package dz.mssid.education.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * General system event log — started as an admin-actions-only audit trail (role changes, receipt
 * verification, feature-flag changes) and was broadened to cover the events an admin actually needs
 * to debug from the console: email delivery attempts, registration/login failures, receipt
 * submissions, AI tutor call failures. Still not a general HTTP request/access log — every row is an
 * explicit `record(...)` call at a meaningful business event, not middleware-level noise.
 */
@Entity
@Table(name = "admin_audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actor_email", nullable = false)
    private String actorEmail;

    @Column(name = "action_type", nullable = false)
    private String actionType; // ROLE_CHANGE, RECEIPT_APPROVED, RECEIPT_REJECTED, FEATURE_FLAG_CHANGED

    @Column(name = "target_type", nullable = false)
    private String targetType; // USER, RECEIPT, FEATURE_FLAG

    @Column(name = "target_id")
    private String targetId;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "outcome", nullable = false)
    @Builder.Default
    private String outcome = "SUCCESS"; // SUCCESS or FAILURE

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
