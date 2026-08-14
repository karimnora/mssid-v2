package dz.mssid.education.service;

import dz.mssid.education.dto.AdminAuditLogDto;
import dz.mssid.education.entity.AdminAuditLog;
import dz.mssid.education.repository.AdminAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAuditLogService {

    private final AdminAuditLogRepository auditLogRepository;

    public void record(String actorEmail, String actionType, String targetType, String targetId, String details) {
        AdminAuditLog entry = AdminAuditLog.builder()
                .actorEmail(actorEmail)
                .actionType(actionType)
                .targetType(targetType)
                .targetId(targetId)
                .details(details)
                .build();
        auditLogRepository.save(entry);
    }

    public List<AdminAuditLogDto> getRecent(int limit) {
        int cappedLimit = Math.min(Math.max(limit, 1), 200);
        return auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, cappedLimit))
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private AdminAuditLogDto toDto(AdminAuditLog entry) {
        return AdminAuditLogDto.builder()
                .id(entry.getId())
                .actorEmail(entry.getActorEmail())
                .actionType(entry.getActionType())
                .targetType(entry.getTargetType())
                .targetId(entry.getTargetId())
                .details(entry.getDetails())
                .createdAt(entry.getCreatedAt() != null ? entry.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
