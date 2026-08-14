package dz.mssid.education.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * A minimal, targeted audit trail — only for the specific admin-triggered actions this Admin
 * Console already performs (role changes, receipt verification, feature-flag changes). Not a
 * general request/access-logging system.
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

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
