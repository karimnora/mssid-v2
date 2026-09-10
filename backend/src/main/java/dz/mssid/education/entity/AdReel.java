package dz.mssid.education.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * "Reels CMS Studio" — an admin-authored/AI-generated educational reel (9:16), edited in the
 * console then exported client-side to PNG/MP4 for manual posting to real social networks. `tags`
 * and `slides` are opaque JSONB (same pattern as User.avatarConfig): their shape lives entirely in
 * frontend/src/types/reels.ts and is never validated or queried server-side.
 */
@Entity
@Table(name = "ad_reels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdReel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "grade_level", nullable = false)
    private String gradeLevel;

    @Column(nullable = false)
    private String category;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tags", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "slides", columnDefinition = "jsonb")
    @Builder.Default
    private List<Map<String, Object>> slides = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private String status = "draft";

    // Explicit @JsonProperty: Lombok's getter for a boolean field already named "isX" is isAiGenerated(),
    // which Jackson's default bean-introspection strips the "is" prefix from, serializing it as
    // "aiGenerated" instead of the "isAiGenerated" the frontend's AdReel type expects — same pitfall
    // already documented on QuickCheckOptionDto.isCorrect.
    @JsonProperty("isAiGenerated")
    @Column(name = "is_ai_generated", nullable = false)
    @Builder.Default
    private boolean isAiGenerated = true;

    @Column(name = "created_by_email")
    private String createdByEmail;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
