package dz.mssid.education.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Full pedagogical content for a T2/T3 lesson that has been moved off the static frontend bundle —
 * see the pilot migration V10/V11 and PremiumContentController. content_json is stored as-is (the
 * same shape as CourseLesson on the frontend) rather than a normalized relational schema: this table
 * only ever needs to serve the whole blob to an authorized client, never query inside it.
 */
@Entity
@Table(name = "premium_lesson_content")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PremiumLessonContent {

    @Id
    @Column(name = "lesson_id")
    private String lessonId;

    @Column(nullable = false, length = 10)
    private String grade;

    @Column(nullable = false, length = 50)
    private String subject;

    @Column(nullable = false)
    private Integer trimester;

    // No @Lob here — same convention as every other large-text column in this codebase (see
    // AdminAuditLog.details, ContactMessage.message, ExamPaper.correctionBaremeDetails): @Lob makes
    // Hibernate expect a CLOB/oid mapping under ddl-auto=validate, which mismatches the plain TEXT
    // column the migration actually creates and fails ApplicationContext startup.
    @Column(name = "content_json", nullable = false, columnDefinition = "TEXT")
    private String contentJson;

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
