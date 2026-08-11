package dz.mssid.education.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "cms_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsExercise {

    @Id
    private String id;

    @Column(name = "course_id")
    private String courseId;

    @Column(name = "chapter_id")
    private String chapterId;

    private String grade;
    private String subject;

    @Column(name = "title_ar", columnDefinition = "text")
    private String titleAr;

    private String type;
    private String difficulty;
    private Integer estimatedMinutes;
    private Integer pointsXp;

    @Column(name = "question_ar", columnDefinition = "text")
    private String questionAr;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "options", columnDefinition = "jsonb")
    @Builder.Default
    private List<Map<String, Object>> options = new ArrayList<>();

    @Column(name = "fill_blanks_text_ar", columnDefinition = "text")
    private String fillBlanksTextAr;

    @Column(name = "matching_pairs", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    @Builder.Default
    private List<Map<String, String>> matchingPairs = new ArrayList<>();

    @Column(name = "correct_solution_ar", columnDefinition = "text")
    private String correctSolutionAr;

    @Column(name = "step_by_step_explanation_ar", columnDefinition = "text")
    private String stepByStepExplanationAr;

    @Column(name = "competency_code")
    private String competencyCode;

    @Column(name = "workflow_status")
    private String workflowStatus;

    @Column(name = "updated_at")
    private String updatedAt;
}
