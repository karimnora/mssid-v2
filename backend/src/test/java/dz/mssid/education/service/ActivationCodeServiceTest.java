package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.Subscription;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.SubscriptionRepository;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ActivationCodeServiceTest {

    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-11-05T10:00:00Z"), WeeklyReportService.ALGIERS);
    private static final LocalDate TODAY = LocalDate.of(2026, 11, 5);
    private static final String EMAIL = "parent@test.invalid";
    private static final String CODE = "MSD-4K7P-9XQ2";

    private JdbcTemplate jdbc;
    private UserRepository users;
    private RoleRepository roles;
    private SubscriptionRepository subscriptions;
    private AdminAuditLogService audit;
    private ActivationCodeService service;
    private User user;
    private Role premium;

    @BeforeEach
    void setUp() {
        jdbc = mock(JdbcTemplate.class);
        users = mock(UserRepository.class);
        roles = mock(RoleRepository.class);
        subscriptions = mock(SubscriptionRepository.class);
        audit = mock(AdminAuditLogService.class);
        service = new ActivationCodeService(jdbc, users, roles, subscriptions, audit, CLOCK);
        user = User.builder().id(9L).email(EMAIL).nom("Karim").passwordHash("x").build();
        Role free = new Role();
        free.setName(Role.RoleName.ROLE_FREE);
        user.setRole(free);
        premium = new Role();
        premium.setName(Role.RoleName.ROLE_PREMIUM);
        when(users.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(users.findForPayment(9L)).thenReturn(Optional.of(user));
        when(roles.findByName(Role.RoleName.ROLE_PREMIUM)).thenReturn(Optional.of(premium));
        when(subscriptions.findByUser(user)).thenReturn(Optional.empty());
        when(jdbc.queryForObject(startsWith("SELECT COUNT(*) FROM activation_code_redemptions"), eq(Integer.class), any(), any())).thenReturn(0);
    }

    private void codeRow(int maxUses, int used, boolean revoked, LocalDate validUntil) {
        Map<String, Object> row = new HashMap<>();
        row.put("id", 41L);
        row.put("plan_id", "P12M");
        row.put("duration_months", 12);
        row.put("max_uses", maxUses);
        row.put("used_count", used);
        row.put("revoked", revoked);
        row.put("valid_until", validUntil == null ? null : Date.valueOf(validUntil));
        when(jdbc.queryForList(contains("FOR UPDATE"), eq(ActivationCodeService.hash("MSD4K7P9XQ2")))).thenReturn(List.of(row));
    }

    @Test
    void readsTheCodeHoweverTheParentTypesIt() {
        assertThat(ActivationCodeService.normalize(" msd 4k7p-9xq2 ")).isEqualTo("MSD4K7P9XQ2");
        codeRow(1, 0, false, null);
        assertThat(service.redeem(EMAIL, "msd 4k7p 9xq2").planId()).isEqualTo("P12M");
    }

    @Test
    void grantsPremiumForTheCodePlanAndCountsTheSeat() {
        codeRow(1, 0, false, TODAY.plusDays(30));
        ActivationCodeService.Redeemed redeemed = service.redeem(EMAIL, CODE);

        assertThat(redeemed.months()).isEqualTo(12);
        assertThat(redeemed.endDate()).isEqualTo(TODAY.plusMonths(12));
        assertThat(user.getRole()).isSameAs(premium);
        verify(jdbc).update("UPDATE activation_codes SET used_count = used_count + 1 WHERE id = ?", 41L);
        verify(jdbc).update(startsWith("INSERT INTO activation_code_redemptions"), eq(41L), eq(9L), any());
        verify(subscriptions).save(argThat(s -> s.getStatus() == Subscription.SubscriptionStatus.ACTIVE && "P12M".equals(s.getPlanId())));
    }

    @Test
    void addsTheMonthsToARunningSubscription() {
        Subscription running = new Subscription();
        running.setUser(user);
        running.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        running.setStartDate(TODAY.minusMonths(1));
        running.setEndDate(TODAY.plusMonths(2));
        when(subscriptions.findByUser(user)).thenReturn(Optional.of(running));
        codeRow(1, 0, false, null);

        assertThat(service.redeem(EMAIL, CODE).endDate()).isEqualTo(TODAY.plusMonths(14));
    }

    @Test
    void refusesUnknownRevokedExpiredFullAndAlreadyUsedCodes() {
        assertThatThrownBy(() -> service.redeem(EMAIL, "hello")).isInstanceOf(ResponseStatusException.class);
        when(jdbc.queryForList(contains("FOR UPDATE"), anyString())).thenReturn(List.of());
        assertThatThrownBy(() -> service.redeem(EMAIL, CODE)).hasMessageContaining("الكود غير صحيح");

        codeRow(1, 0, true, null);
        assertThatThrownBy(() -> service.redeem(EMAIL, CODE)).hasMessageContaining("أُلغي");
        codeRow(1, 0, false, TODAY.minusDays(1));
        assertThatThrownBy(() -> service.redeem(EMAIL, CODE)).hasMessageContaining("انتهت صلاحية");
        codeRow(30, 30, false, null);
        assertThatThrownBy(() -> service.redeem(EMAIL, CODE)).hasMessageContaining("استُعمل بالكامل");
        codeRow(30, 3, false, null);
        when(jdbc.queryForObject(startsWith("SELECT COUNT(*) FROM activation_code_redemptions"), eq(Integer.class), any(), any())).thenReturn(1);
        assertThatThrownBy(() -> service.redeem(EMAIL, CODE)).hasMessageContaining("من قبل");

        verify(subscriptions, never()).save(any());
        verify(jdbc, never()).update(startsWith("UPDATE activation_codes SET used_count"), any(Object[].class));
    }

    @Test
    void generatesUniqueReadableCodesAndStoresOnlyTheirHash() {
        when(jdbc.update(startsWith("INSERT INTO activation_codes"), any(Object[].class))).thenReturn(1);
        List<String> codes = service.generate("P3M", 40, 30, "SCHOOL", "École El Feth — 5AP A", TODAY.plusMonths(2), "admin@test.invalid");

        assertThat(codes).hasSize(40);
        Set<String> unique = new HashSet<>(codes);
        assertThat(unique).hasSize(40);
        for (String code : codes) assertThat(code).matches("MSD-[" + ActivationCodeService.ALPHABET + "]{4}-[" + ActivationCodeService.ALPHABET + "]{4}");
        var inserts = mockingDetails(jdbc).getInvocations().stream()
                .filter(call -> call.getMethod().getName().equals("update") && String.valueOf(call.getRawArguments()[0]).startsWith("INSERT INTO activation_codes"))
                .map(call -> call.getArguments())
                .toList();
        assertThat(inserts).hasSize(40);
        for (Object[] args : inserts) {
            assertThat(String.valueOf(args[1])).hasSize(64).doesNotContain("MSD");
            assertThat(args[6]).isEqualTo(30);
        }
    }

    @Test
    void validatesTheBatchRequest() {
        assertThatThrownBy(() -> service.generate("P3M", 0, 1, "CARD", "x", null, "a")).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.generate("P3M", 10, 61, "CARD", "x", null, "a")).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.generate("P3M", 10, 1, "GIFT", "x", null, "a")).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.generate("P3M", 10, 1, "CARD", " ", null, "a")).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.generate("P6M", 1, 1, "CARD", "x", null, "a")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> service.generate("P99", 10, 1, "CARD", "x", null, "a")).isInstanceOf(IllegalArgumentException.class);
    }
}
