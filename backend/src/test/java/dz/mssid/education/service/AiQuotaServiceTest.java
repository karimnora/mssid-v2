package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.exception.AiQuotaExceededException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;

class AiQuotaServiceTest {

    private AiQuotaService quotaService;

    @BeforeEach
    void setUp() {
        quotaService = new AiQuotaService();
        quotaService.clearForTests();
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("ROLE_FREE is capped at 3 calls per 24h — the 4th is denied")
    void freeRole_fourthCallDenied() {
        String email = "free@mssid.dz";
        for (int i = 0; i < AiQuotaService.FREE_DAILY_LIMIT; i++) {
            AiQuotaService.QuotaSnapshot ok = quotaService.tryConsume(email, Role.RoleName.ROLE_FREE);
            assertTrue(ok.allowed());
        }
        AiQuotaService.QuotaSnapshot denied = quotaService.tryConsume(email, Role.RoleName.ROLE_FREE);
        assertFalse(denied.allowed());
        assertEquals(0, denied.remaining());
        assertEquals(AiQuotaService.FREE_DAILY_LIMIT, denied.limit());
    }

    @Test
    @DisplayName("ROLE_PREMIUM gets the 50/day cap, independent of a FREE account on another email")
    void premiumAndFree_areIndependent() {
        for (int i = 0; i < AiQuotaService.FREE_DAILY_LIMIT; i++) {
            quotaService.tryConsume("free@mssid.dz", Role.RoleName.ROLE_FREE);
        }
        assertFalse(quotaService.tryConsume("free@mssid.dz", Role.RoleName.ROLE_FREE).allowed());

        AiQuotaService.QuotaSnapshot premium = quotaService.tryConsume("premium@mssid.dz", Role.RoleName.ROLE_PREMIUM);
        assertTrue(premium.allowed());
        assertEquals(AiQuotaService.PREMIUM_DAILY_LIMIT, premium.limit());
        assertEquals(AiQuotaService.PREMIUM_DAILY_LIMIT - 1, premium.remaining());
    }

    @Test
    @DisplayName("ROLE_ADMIN uses the 1000/day cap")
    void adminRole_usesAdminLimit() {
        AiQuotaService.QuotaSnapshot snapshot = quotaService.tryConsume("admin@mssid.dz", Role.RoleName.ROLE_ADMIN);
        assertTrue(snapshot.allowed());
        assertEquals(AiQuotaService.ADMIN_DAILY_LIMIT, snapshot.limit());
    }

    @Test
    @DisplayName("consumeAuthenticatedUser reads role from the JWT User principal, not from any header")
    void consumeAuthenticatedUser_usesEntityRole() {
        User premium = User.builder()
                .email("premium@mssid.dz")
                .nom("Sara")
                .passwordHash("x")
                .role(new Role(2L, Role.RoleName.ROLE_PREMIUM))
                .build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(premium, null, premium.getAuthorities()));

        AiQuotaService.QuotaSnapshot snapshot = quotaService.consumeAuthenticatedUser();
        assertEquals(AiQuotaService.PREMIUM_DAILY_LIMIT, snapshot.limit());
        assertEquals(AiQuotaService.PREMIUM_DAILY_LIMIT - 1, snapshot.remaining());
    }

    @Test
    @DisplayName("consumeAuthenticatedUser throws when the SecurityContext has no principal")
    void consumeAuthenticatedUser_unauthenticated_throws() {
        assertThrows(AuthenticationCredentialsNotFoundException.class, quotaService::consumeAuthenticatedUser);
    }

    @Test
    @DisplayName("A FREE user hitting the cap throws AiQuotaExceededException")
    void consumeAuthenticatedUser_exhausted_throwsQuotaException() {
        User free = User.builder()
                .email("kid@mssid.dz")
                .nom("Ahmed")
                .passwordHash("x")
                .role(new Role(1L, Role.RoleName.ROLE_FREE))
                .build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(free, null, free.getAuthorities()));

        for (int i = 0; i < AiQuotaService.FREE_DAILY_LIMIT; i++) {
            quotaService.consumeAuthenticatedUser();
        }
        AiQuotaExceededException ex = assertThrows(AiQuotaExceededException.class, quotaService::consumeAuthenticatedUser);
        assertEquals(AiQuotaService.FREE_DAILY_LIMIT, ex.getLimit());
        assertEquals(0, ex.getRemaining());
    }

    @Test
    @DisplayName("refund restores a FREE slot after a consumed call — Gemini failure must not burn the day")
    void refund_restoresConsumedSlot() {
        String email = "kid@mssid.dz";
        quotaService.tryConsume(email, Role.RoleName.ROLE_FREE);
        quotaService.tryConsume(email, Role.RoleName.ROLE_FREE);
        AiQuotaService.QuotaSnapshot afterRefund = quotaService.refund(email, Role.RoleName.ROLE_FREE);
        assertEquals(2, afterRefund.remaining());
        assertTrue(afterRefund.allowed());
        AiQuotaService.QuotaSnapshot peeked = quotaService.peek(email, Role.RoleName.ROLE_FREE);
        assertEquals(2, peeked.remaining());
    }

    @Test
    @DisplayName("refund never drives the counter below zero")
    void refund_doesNotGoNegative() {
        AiQuotaService.QuotaSnapshot snapshot = quotaService.refund("unused@mssid.dz", Role.RoleName.ROLE_FREE);
        assertEquals(AiQuotaService.FREE_DAILY_LIMIT, snapshot.remaining());
    }
}
