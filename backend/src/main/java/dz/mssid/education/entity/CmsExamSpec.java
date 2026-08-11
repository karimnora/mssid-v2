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

@Entity
@Table(name = "cms_exams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsExamSpec {

    @Id
    private String id;

    private String grade;
    private String subject;
    private Integer year;

    @Column(name = "session_ar", columnDefinition = "text")
    private String sessionAr;

    @Column(name = "title_ar", columnDefinition = "text")
    private String titleAr;

    private Integer durationMinutes;
    private Integer totalPoints;
    private Integer passingScore;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "exercise_ids", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> exerciseIds = new ArrayList<>();

    @Column(name = "auto_grading_enabled")
    private Boolean autoGradingEnabled;

    @Column(name = "workflow_status")
    private String workflowStatus;

    @Column(name = "author_name")
    private String authorName;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;
}
