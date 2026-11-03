package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.*;

class MusaidiQuotaServiceTest {

    // 23:30 UTC on 4 Nov is 00:30 on 5 Nov in Algiers: the day must follow Algeria, not UTC.
    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-11-04T23:30:00Z"), MusaidiQuotaService.ALGIERS);
    private static final LocalDate DAY = LocalDate.of(2026, 11, 5);
    private static final String PARENT = "parent@test.invalid";

    private JdbcTemplate jdbc;
    private UserRepository users;
    private MusaidiQuotaService service;

    @BeforeEach
    void setUp() {
        jdbc = mock(JdbcTemplate.class);
        users = mock(UserRepository.class);
        service = new MusaidiQuotaService(jdbc, users, CLOCK);
    }

    private void account(Role.RoleName role) {
        when(users.findByEmail(PARENT)).thenReturn(Optional.of(User.builder().id(7L).role(new Role(1L, role)).build()));
    }

    private void openedToday(List<String> first, List<String> after) {
        when(jdbc.queryForList(startsWith("SELECT item_id"), eq(String.class), eq(7L), eq(DAY))).thenReturn(first, after);
    }

    @Test
    void freeAccountOpensUpToThreeCorrectionsPerAlgerianDay() {
        account(Role.RoleName.ROLE_FREE);
        openedToday(List.of("a", "b"), List.of("a", "b", "c"));
        MusaidiQuotaService.Status status = service.open(PARENT, "c");
        assertThat(status.allowed()).isTrue();
        assertThat(status.remaining()).isZero();
        assertThat(status.day()).isEqualTo("2026-11-05");
        verify(jdbc).update(startsWith("INSERT INTO musaidi_openings"), eq(7L), eq(DAY), eq("c"));
    }

    @Test
    void fourthNewCorrectionIsRefusedWithoutWriting() {
        account(Role.RoleName.ROLE_FREE);
        openedToday(List.of("a", "b", "c"), List.of("a", "b", "c"));
        MusaidiQuotaService.Status status = service.open(PARENT, "d");
        assertThat(status.allowed()).isFalse();
        assertThat(status.remaining()).isZero();
        verify(jdbc, never()).update(startsWith("INSERT"), any(), any(), any());
    }

    @Test
    void reopeningACorrectionAlreadySeenTodayIsFree() {
        account(Role.RoleName.ROLE_FREE);
        openedToday(List.of("a", "b", "c"), List.of("a", "b", "c"));
        assertThat(service.open(PARENT, "b").allowed()).isTrue();
        verify(jdbc, never()).update(startsWith("INSERT"), any(), any(), any());
    }

    @Test
    void premiumAndAdminAreUnlimitedAndNotCounted() {
        account(Role.RoleName.ROLE_PREMIUM);
        MusaidiQuotaService.Status status = service.open(PARENT, "z");
        assertThat(status.allowed()).isTrue();
        assertThat(status.premium()).isTrue();
        assertThat(status.remaining()).isNull();
        verifyNoInteractions(jdbc);
        assertThat(MusaidiQuotaService.isUnlimited(User.builder().role(new Role(2L, Role.RoleName.ROLE_ADMIN)).build())).isTrue();
    }

    @Test
    void malformedItemIdIsRejectedBeforeAnyLookup() {
        assertThatThrownBy(() -> service.open(PARENT, "../../etc")).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.open(PARENT, null)).isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(jdbc, users);
    }

    @Test
    void unknownAccountIsUnauthorized() {
        when(users.findByEmail("ghost")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.today("ghost")).isInstanceOf(ResponseStatusException.class);
    }
}
