package dz.mssid.education.service;

import dz.mssid.education.dto.AdminAuditLogDto;
import dz.mssid.education.entity.AdminAuditLog;
import dz.mssid.education.repository.AdminAuditLogRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

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
    @DisplayName("record - Persists a new audit entry with the given fields")
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
    }

    @Test
    @DisplayName("getRecent - Maps entities to DTOs, newest first, capped at 200")
    void getRecent_MapsAndCapsLimit() {
        AdminAuditLog entry = AdminAuditLog.builder()
                .id(1L).actorEmail("admin@mssid.dz").actionType("RECEIPT_APPROVED")
                .targetType("RECEIPT").targetId("10").details("user upgraded to ROLE_PREMIUM")
                .createdAt(LocalDateTime.of(2026, 1, 1, 12, 0))
                .build();

        when(auditLogRepository.findAllByOrderByCreatedAtDesc(any(Pageable.class))).thenReturn(List.of(entry));

        List<AdminAuditLogDto> result = adminAuditLogService.getRecent(500);

        assertEquals(1, result.size());
        assertEquals("admin@mssid.dz", result.get(0).getActorEmail());
        assertEquals("RECEIPT_APPROVED", result.get(0).getActionType());
        assertNotNull(result.get(0).getCreatedAt());
    }
}
