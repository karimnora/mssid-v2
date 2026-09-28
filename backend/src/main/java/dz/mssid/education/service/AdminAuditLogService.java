package dz.mssid.education.service;

import dz.mssid.education.dto.AdminAuditLogDto;
import dz.mssid.education.dto.AuditLogPurgeDto;
import dz.mssid.education.entity.AdminAuditLog;
import dz.mssid.education.repository.AdminAuditLogRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAuditLogService {

    /**
     * High-volume telemetry that is safe to drop: routine Google logins, every email attempt, and
     * AI generation traces. Never includes role changes, receipts, feature flags, registrations,
     * login failures, or the purge record itself.
     */
    public static final List<String> EPHEMERAL_ACTION_TYPES = List.of(
            "GOOGLE_LOGIN",
            "EMAIL_SEND",
            "AI_TUTOR_CALL_FAILED",
            "AI_REEL_GENERATED",
            "AI_NARRATION_GENERATED",
            "AI_ILLUSTRATION_GENERATED",
            "AI_REEL_GENERATION_FAILED",
            "AI_NARRATION_FAILED",
            "AI_ILLUSTRATION_FAILED"
    );

    private final AdminAuditLogRepository auditLogRepository;

    /** Back-compat for the 4 original admin-mutation call sites, which never fail before logging (the
     * mutation itself already committed by the time these run), so SUCCESS is always correct here. */
    public void record(String actorEmail, String actionType, String targetType, String targetId, String details) {
        record(actorEmail, actionType, targetType, targetId, details, "SUCCESS");
    }

    public void record(String actorEmail, String actionType, String targetType, String targetId, String details, String outcome) {
        AdminAuditLog entry = AdminAuditLog.builder()
                .actorEmail(actorEmail)
                .actionType(actionType)
                .targetType(targetType)
                .targetId(targetId)
                .details(details)
                .outcome(outcome != null ? outcome : "SUCCESS")
                .build();
        auditLogRepository.save(entry);
    }

    public List<AdminAuditLogDto> getRecent(int limit) {
        return getFiltered(null, null, null, null, null, null, limit);
    }

    public List<AdminAuditLogDto> getFiltered(
            String actionType, String outcome, String actorEmail, LocalDateTime dateFrom, LocalDateTime dateTo, int limit) {
        return getFiltered(actionType, outcome, actorEmail, dateFrom, dateTo, null, limit);
    }

    public List<AdminAuditLogDto> getFiltered(
            String actionType, String outcome, String actorEmail, LocalDateTime dateFrom, LocalDateTime dateTo,
            String excludeActionType, int limit) {
        int cappedLimit = Math.min(Math.max(limit, 1), 200);

        Specification<AdminAuditLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            String actionTypeValue = blankToNull(actionType);
            String outcomeValue = blankToNull(outcome);
            String actorEmailValue = blankToNull(actorEmail);

            if (actionTypeValue != null) predicates.add(cb.equal(root.get("actionType"), actionTypeValue));
            String excludeActionTypeValue = blankToNull(excludeActionType);
            if (excludeActionTypeValue != null && actionTypeValue == null) {
                predicates.add(cb.notEqual(root.get("actionType"), excludeActionTypeValue));
            }
            if (outcomeValue != null) predicates.add(cb.equal(root.get("outcome"), outcomeValue));
            if (actorEmailValue != null) {
                predicates.add(cb.like(cb.lower(root.get("actorEmail")), "%" + actorEmailValue.toLowerCase() + "%"));
            }
            if (dateFrom != null) predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), dateFrom));
            if (dateTo != null) predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), dateTo));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return auditLogRepository.findAll(spec, PageRequest.of(0, cappedLimit, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public AuditLogPurgeDto getEphemeralPreview() {
        return AuditLogPurgeDto.builder()
                .count(auditLogRepository.countByActionTypeIn(EPHEMERAL_ACTION_TYPES))
                .actionTypes(EPHEMERAL_ACTION_TYPES)
                .build();
    }

    @Transactional
    public AuditLogPurgeDto purgeEphemeral(String actorEmail) {
        long deleted = auditLogRepository.deleteByActionTypeIn(EPHEMERAL_ACTION_TYPES);
        if (deleted > 0) {
            record(actorEmail, "AUDIT_LOG_PURGED", "AUDIT_LOG", null,
                    "deleted=" + deleted + " types=" + String.join(",", EPHEMERAL_ACTION_TYPES));
        }
        return AuditLogPurgeDto.builder()
                .count(deleted)
                .actionTypes(EPHEMERAL_ACTION_TYPES)
                .build();
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private AdminAuditLogDto toDto(AdminAuditLog entry) {
        return AdminAuditLogDto.builder()
                .id(entry.getId())
                .actorEmail(entry.getActorEmail())
                .actionType(entry.getActionType())
                .targetType(entry.getTargetType())
                .targetId(entry.getTargetId())
                .details(entry.getDetails())
                .outcome(entry.getOutcome())
                .createdAt(entry.getCreatedAt() != null ? entry.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}
