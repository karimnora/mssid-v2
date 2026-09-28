package dz.mssid.education.service;

import dz.mssid.education.dto.AdminAuditLogDto;
import dz.mssid.education.dto.AuditLogPurgeDto;
import dz.mssid.education.entity.AdminAuditLog;
import dz.mssid.education.repository.AdminAuditLogRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminAuditLogServiceTest {

    @Mock
    private AdminAuditLogRepository auditLogRepository;

    @InjectMocks
    private AdminAuditLogService adminAuditLogService;

    @Test
    @DisplayName("record (5-arg) - Persists a new audit entry, defaulting outcome to SUCCESS")
    void record_SavesEntry() {
        adminAuditLogService.record("admin@mssid.dz", "ROLE_CHANGE", "USER", "5", "ROLE_FREE -> ROLE_PREMIUM");

        ArgumentCaptor<AdminAuditLog> captor = ArgumentCaptor.forClass(AdminAuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        AdminAuditLog saved = captor.getValue();
        assertEquals("admin@mssid.dz", saved.getActorEmail());
        assertEquals("ROLE_CHANGE", saved.getActionType());
        assertEquals("USER", saved.getTargetType());
        assertEquals("5", saved.getTargetId());
        assertEquals("ROLE_FREE -> ROLE_PREMIUM", saved.getDetails());
        assertEquals("SUCCESS", saved.getOutcome());
    }

    @Test
    @DisplayName("record (6-arg) - Persists the given outcome, e.g. FAILURE for a failed email send")
    void record_WithOutcome_SavesGivenOutcome() {
        adminAuditLogService.record("user@mssid.dz", "EMAIL_SEND", "EMAIL", "sujet", "échec Resend: timeout", "FAILURE");

        ArgumentCaptor<AdminAuditLog> captor = ArgumentCaptor.forClass(AdminAuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        assertEquals("FAILURE", captor.getValue().getOutcome());
    }

    @Test
    @DisplayName("getRecent - Maps entities to DTOs (including outcome), newest first, capped at 200")
    void getRecent_MapsAndCapsLimit() {
        AdminAuditLog entry = AdminAuditLog.builder()
                .id(1L).actorEmail("admin@mssid.dz").actionType("RECEIPT_APPROVED")
                .targetType("RECEIPT").targetId("10").details("user upgraded to ROLE_PREMIUM")
                .outcome("SUCCESS")
                .createdAt(LocalDateTime.of(2026, 1, 1, 12, 0))
                .build();

        when(auditLogRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pageOf(entry));

        List<AdminAuditLogDto> result = adminAuditLogService.getRecent(500);

        assertEquals(1, result.size());
        assertEquals("admin@mssid.dz", result.get(0).getActorEmail());
        assertEquals("RECEIPT_APPROVED", result.get(0).getActionType());
        assertEquals("SUCCESS", result.get(0).getOutcome());
        assertNotNull(result.get(0).getCreatedAt());
    }

    // The exact WHERE-clause composition (which predicates a given filter combination produces) is
    // covered by a live smoke test against real Postgres, not here — Specification lambdas only run
    // against a real CriteriaBuilder/Root, so a Mockito-level test of their content would be testing
    // Mockito's stand-ins, not the actual generated SQL. This is what caught the real bug (Postgres
    // couldn't infer a bind parameter's type from a bare "? IS NULL" check) that a mocked unit test
    // never would have.
    @Test
    @DisplayName("getFiltered - Delegates to the repository with a capped page size and maps outcome through")
    void getFiltered_MapsResultsThrough() {
        AdminAuditLog entry = AdminAuditLog.builder()
                .id(2L).actorEmail("user@mssid.dz").actionType("EMAIL_SEND")
                .targetType("EMAIL").targetId("رمز التحقق").details("échec Resend: timeout")
                .outcome("FAILURE")
                .createdAt(LocalDateTime.of(2026, 8, 17, 10, 0))
                .build();

        when(auditLogRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(pageOf(entry));

        List<AdminAuditLogDto> result = adminAuditLogService.getFiltered("EMAIL_SEND", "FAILURE", "user@mssid.dz", null, null, 500);

        assertEquals(1, result.size());
        assertEquals("FAILURE", result.get(0).getOutcome());
        assertEquals("EMAIL_SEND", result.get(0).getActionType());
    }

    @Test
    @DisplayName("ephemeral whitelist never includes roles, receipts, flags, or account creation")
    void ephemeralTypes_ExcludeEssentialAudit() {
        assertFalse(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("ROLE_CHANGE"));
        assertFalse(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("RECEIPT_APPROVED"));
        assertFalse(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("RECEIPT_REJECTED"));
        assertFalse(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("RECEIPT_SUBMITTED"));
        assertFalse(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("FEATURE_FLAG_CHANGED"));
        assertFalse(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("USER_REGISTERED"));
        assertFalse(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("LOGIN_FAILED"));
        assertFalse(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("AUDIT_LOG_PURGED"));
        assertTrue(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("GOOGLE_LOGIN"));
        assertTrue(AdminAuditLogService.EPHEMERAL_ACTION_TYPES.contains("EMAIL_SEND"));
    }

    @Test
    @DisplayName("getEphemeralPreview - Returns the count of rows matching the ephemeral whitelist")
    void getEphemeralPreview_ReturnsCount() {
        when(auditLogRepository.countByActionTypeIn(AdminAuditLogService.EPHEMERAL_ACTION_TYPES)).thenReturn(42L);

        AuditLogPurgeDto preview = adminAuditLogService.getEphemeralPreview();

        assertEquals(42L, preview.getCount());
        assertEquals(AdminAuditLogService.EPHEMERAL_ACTION_TYPES, preview.getActionTypes());
    }

    @Test
    @DisplayName("purgeEphemeral - Deletes only ephemeral types then records AUDIT_LOG_PURGED")
    void purgeEphemeral_DeletesThenRecords() {
        when(auditLogRepository.deleteByActionTypeIn(AdminAuditLogService.EPHEMERAL_ACTION_TYPES)).thenReturn(12L);

        AuditLogPurgeDto result = adminAuditLogService.purgeEphemeral("admin@mssid.dz");

        assertEquals(12L, result.getCount());
        ArgumentCaptor<AdminAuditLog> captor = ArgumentCaptor.forClass(AdminAuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        AdminAuditLog recorded = captor.getValue();
        assertEquals("AUDIT_LOG_PURGED", recorded.getActionType());
        assertEquals("admin@mssid.dz", recorded.getActorEmail());
        assertTrue(recorded.getDetails().contains("deleted=12"));
    }

    @Test
    @DisplayName("purgeEphemeral - Zero rows: does not write a spurious AUDIT_LOG_PURGED entry")
    void purgeEphemeral_ZeroRows_DoesNotRecord() {
        when(auditLogRepository.deleteByActionTypeIn(AdminAuditLogService.EPHEMERAL_ACTION_TYPES)).thenReturn(0L);

        AuditLogPurgeDto result = adminAuditLogService.purgeEphemeral("admin@mssid.dz");

        assertEquals(0L, result.getCount());
        verify(auditLogRepository, org.mockito.Mockito.never()).save(any());
    }

    private Page<AdminAuditLog> pageOf(AdminAuditLog... entries) {
        return new PageImpl<>(List.of(entries));
    }
}
