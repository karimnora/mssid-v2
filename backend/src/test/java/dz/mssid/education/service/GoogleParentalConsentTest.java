package dz.mssid.education.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.security.JwtTokenProvider;
import dz.mssid.education.security.RefreshTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoogleParentalConsentTest {
    @Mock UserRepository users;
    @Mock RoleRepository roles;
    @Mock PasswordEncoder passwords;
    @Mock JwtTokenProvider tokens;
    @Mock RefreshTokenService refresh;
    @Mock EmailVerificationService emailVerification;
    @Mock ParentNotificationService notifications;
    @Mock AuthenticationManager authentication;
    @Mock AdminAuditLogService audit;
    @Mock GoogleIdTokenVerifier verifier;
    @Mock GoogleIdToken token;
    @Mock GoogleIdToken.Payload payload;
    @InjectMocks AuthService auth;
    final Role free = new Role(1L, Role.RoleName.ROLE_FREE);

    @BeforeEach void configureVerifier() {
        ReflectionTestUtils.setField(auth, "googleIdTokenVerifier", verifier);
    }

    private void verifiedIdentity() throws Exception {
        when(verifier.verify("verified-token")).thenReturn(token);
        when(token.getPayload()).thenReturn(payload);
        when(payload.getSubject()).thenReturn("google-parent");
        when(payload.getEmail()).thenReturn("google-parent@example.test");
        when(payload.getEmailVerified()).thenReturn(true);
        when(payload.get("name")).thenReturn("Parent test");
    }

    @Test void neverCreatesANewGoogleAccountBeforeExplicitCurrentConsent() throws Exception {
        verifiedIdentity();
        when(users.findByGoogleId("google-parent")).thenReturn(Optional.empty());
        when(users.findByEmail("google-parent@example.test")).thenReturn(Optional.empty());
        assertThrows(ParentalConsentService.RequiredForGoogleRegistration.class,
                () -> auth.loginWithGoogle("verified-token", null, null));
        assertThrows(ParentalConsentService.RequiredForGoogleRegistration.class,
                () -> auth.loginWithGoogle("verified-token", true, "old-version"));
        verify(users, never()).save(any());
        verifyNoInteractions(roles, passwords, tokens, refresh, notifications, emailVerification);
    }

    @Test void createsTheGoogleAccountOnlyWithRecordedConsent() throws Exception {
        verifiedIdentity();
        when(roles.findByName(Role.RoleName.ROLE_FREE)).thenReturn(Optional.of(free));
        when(passwords.encode(anyString())).thenReturn("hashed");
        when(users.save(any())).thenAnswer(invocation -> { User user = invocation.getArgument(0); user.setId(1L); return user; });
        when(tokens.generateToken(any())).thenReturn("access-token");
        when(refresh.createToken(any())).thenReturn("refresh-token");
        var response = auth.loginWithGoogle("verified-token", true, ParentalConsentService.CURRENT_VERSION);
        assertTrue(response.isProfileIncomplete());
        assertNotNull(response.getUser().getParentalConsentAt());
        assertEquals(ParentalConsentService.CURRENT_VERSION, response.getUser().getParentalConsentVersion());
        assertFalse(response.getUser().getParentalConsentRequired());
        verify(users).save(argThat(ParentalConsentService::hasCurrentConsent));
    }

    @Test void existingGoogleAccountsCanSignInButStillNeedTheParentStep() throws Exception {
        verifiedIdentity();
        User legacy = User.builder().id(1L).email("google-parent@example.test").role(free).build();
        when(users.findByGoogleId("google-parent")).thenReturn(Optional.of(legacy));
        when(tokens.generateToken(any())).thenReturn("access-token");
        when(refresh.createToken(legacy)).thenReturn("refresh-token");
        var response = auth.loginWithGoogle("verified-token", true, ParentalConsentService.CURRENT_VERSION);
        assertTrue(response.getUser().getParentalConsentRequired());
        assertNull(legacy.getParentalConsentAt());
        verify(users, never()).save(any());
    }

    @Test void neverUsesAnUnverifiedGoogleIdentityEvenIfConsentWasClaimed() throws Exception {
        when(verifier.verify("invalid-token")).thenReturn(null);
        assertThrows(BadCredentialsException.class, () -> auth.loginWithGoogle("invalid-token", true, ParentalConsentService.CURRENT_VERSION));
        verifyNoInteractions(users, roles, passwords, tokens, refresh);
    }
}
