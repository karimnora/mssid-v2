package dz.mssid.education.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Persists only OVERRIDES of the feature-flag catalog owned by the frontend (see
 * frontend/src/featureFlags.ts's DEFAULT_FLAGS) — a flagKey with no row here simply falls back to
 * its code default. This is the shared, cross-admin/cross-device source of truth; the frontend's
 * localStorage copy is an offline/instant-apply cache hydrated from GET /api/v1/feature-flags.
 */
@Entity
@Table(name = "feature_flags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeatureFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flag_key", nullable = false, unique = true)
    private String flagKey;

    @Column(name = "enabled", nullable = false)
    private boolean enabled;

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "updated_by_email")
    private String updatedByEmail;
}
