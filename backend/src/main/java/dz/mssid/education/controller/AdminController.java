package dz.mssid.education.controller;

import dz.mssid.education.dto.AdminAuditLogDto;
import dz.mssid.education.dto.AdminStatsOverviewDto;
import dz.mssid.education.entity.ContactMessage;
import dz.mssid.education.repository.ContactMessageRepository;
import dz.mssid.education.service.AdminAuditLogService;
import dz.mssid.education.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminStatsService adminStatsService;
    private final AdminAuditLogService adminAuditLogService;
    private final ContactMessageRepository contactMessageRepository;

    @GetMapping("/stats/overview")
    public ResponseEntity<AdminStatsOverviewDto> getStatsOverview() {
        return ResponseEntity.ok(adminStatsService.getOverview());
    }

    @GetMapping("/audit-log")
    public ResponseEntity<List<AdminAuditLogDto>> getAuditLog(
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String actionType,
            @RequestParam(required = false) String outcome,
            @RequestParam(required = false) String actorEmail,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo) {
        return ResponseEntity.ok(adminAuditLogService.getFiltered(actionType, outcome, actorEmail, dateFrom, dateTo, limit));
    }

    /**
     * "نتواصل معك" submissions (ContactController's public POST /api/v1/contact) previously had no
     * read path at all — messages landed in the DB with no way to see them short of a direct SQL
     * query. Newest first, same ordering convention as the audit log above.
     */
    @GetMapping("/contact-messages")
    public ResponseEntity<List<ContactMessage>> getContactMessages() {
        return ResponseEntity.ok(contactMessageRepository.findAllByOrderBySubmittedAtDesc());
    }
}
