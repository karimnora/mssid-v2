package dz.mssid.education.entity;

import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "child_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "display_name", nullable = false, length = 40)
    private String displayName;

    @Column(nullable = false, length = 16)
    private String grade;

    @Column(length = 16)
    private String avatar;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "competence_stats", columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> competenceStats = new HashMap<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "lesson_sessions", columnDefinition = "jsonb")
    @Builder.Default
    private List<Map<String, Object>> lessonSessions = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "village_summaries", columnDefinition = "jsonb")
    @Builder.Default
    private List<Map<String, Object>> villageSummaries = new ArrayList<>();
}
