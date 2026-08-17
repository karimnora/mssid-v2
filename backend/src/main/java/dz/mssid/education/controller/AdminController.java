package dz.mssid.education.controller;

import dz.mssid.education.dto.AdminAuditLogDto;
import dz.mssid.education.dto.AdminStatsOverviewDto;
import dz.mssid.education.entity.ContactMessage;
import dz.mssid.education.repository.ContactMessageRepository;
import dz.mssid.education.service.AdminAuditLogService;
import dz.mssid.education.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<AdminAuditLogDto>> getAuditLog(@RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(adminAuditLogService.getRecent(limit));
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
