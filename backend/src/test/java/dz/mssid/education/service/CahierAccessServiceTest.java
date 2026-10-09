package dz.mssid.education.service;
import dz.mssid.education.entity.*;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.*;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class CahierAccessServiceTest {
    JdbcTemplate jdbc; UserRepository users; User user; CahierAccessService service;
    @BeforeEach void setup() {
        jdbc = mock(JdbcTemplate.class); users = mock(UserRepository.class);
        user = User.builder().id(7L).role(new Role(1L, Role.RoleName.ROLE_FREE)).build();
        when(users.findByEmail("parent@test.invalid")).thenReturn(Optional.of(user));
        service = new CahierAccessService(jdbc, users, Clock.fixed(Instant.parse("2026-10-11T22:59:59Z"), ZoneOffset.UTC), Set.of("a", "b"));
        when(jdbc.queryForList(anyString(), eq(String.class), eq(7L))).thenReturn(List.of());
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq(7L), any(java.sql.Date.class))).thenReturn(0);
    }
    @Test void snapshotUsesAlgerianMondayWithoutSpendingCredit() {
        var access = service.status("parent@test.invalid");
        assertThat(access.remaining()).isEqualTo(3);
        assertThat(access.resetsAt()).isEqualTo("2026-10-11T23:00:00Z");
        verify(jdbc, never()).update(anyString(), any(), any(), any());
    }
    @Test void fourthNewDocumentIsDeniedWithoutWriting() {
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq(7L), any(java.sql.Date.class))).thenReturn(3);
        assertThat(service.unlock("parent@test.invalid", "b").allowed()).isFalse();
        verify(jdbc, never()).update(anyString(), any(), any(), any());
    }
    @Test void oldFreeUnlockStillWorksAtZeroCredits() {
        when(jdbc.queryForList(anyString(), eq(String.class), eq(7L))).thenReturn(List.of("a"));
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq(7L), any(java.sql.Date.class))).thenReturn(3);
        assertThat(service.unlock("parent@test.invalid", "a").allowed()).isTrue();
        verify(jdbc, never()).update(anyString(), any(), any(), any());
    }
    @Test void newUnlockUsesFamilyLockAndPersistsExactlyOneDocument() {
        service.unlock("parent@test.invalid", "a");
        var order = inOrder(jdbc);
        order.verify(jdbc).queryForObject("SELECT id FROM users WHERE id = ? FOR UPDATE", Long.class, 7L);
        order.verify(jdbc).update("INSERT INTO family_cahier_unlocks(user_id, document_id, week_start) VALUES (?, ?, ?)", 7L, "a", java.sql.Date.valueOf("2026-10-05"));
    }
    @Test void premiumBypassesQuotaWithoutCreatingPermanentFreeUnlocks() {
        user.setRole(new Role(2L, Role.RoleName.ROLE_PREMIUM));
        when(jdbc.queryForObject(anyString(), eq(Integer.class), eq(7L), any(java.sql.Date.class))).thenReturn(3);
        var access = service.unlock("parent@test.invalid", "b");
        assertThat(access.allowed()).isTrue(); assertThat(access.premium()).isTrue();
        verify(jdbc, never()).update(anyString(), any(), any(), any());
    }
    @Test void unknownDocumentCannotSpendCredits() {
        assertThatThrownBy(() -> service.unlock("parent@test.invalid", "forged")).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verifyNoInteractions(jdbc);
    }
    @Test void mondayBoundaryRenewsQuotaInAlgerianTime() {
        service = new CahierAccessService(jdbc, users, Clock.fixed(Instant.parse("2026-10-11T23:00:00Z"), ZoneOffset.UTC), Set.of("a"));
        assertThat(service.weekStart()).isEqualTo(LocalDate.parse("2026-10-12"));
        assertThat(service.status("parent@test.invalid").resetsAt()).isEqualTo("2026-10-18T23:00:00Z");
    }
}
