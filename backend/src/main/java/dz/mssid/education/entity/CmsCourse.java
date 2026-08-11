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
@Table(name = "cms_courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsCourse {

    @Id
    private String id;

    @Column(name = "chapter_id")
    private String chapterId;

    private String grade;
    private String subject;

    @Column(name = "title_ar", columnDefinition = "text")
    private String titleAr;

    @Column(name = "title_fr", columnDefinition = "text")
    private String titleFr;

    @Column(name = "summary_ar", columnDefinition = "text")
    private String summaryAr;

    @Column(name = "body_html_content", columnDefinition = "text")
    private String bodyHtmlContent;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "rules_ar", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> rulesAr = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "key_formulas", columnDefinition = "jsonb")
    @Builder.Default
    private List<Map<String, String>> keyFormulas = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "media_urls", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> mediaUrls = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "attachments", columnDefinition = "jsonb")
    @Builder.Default
    private List<Map<String, String>> attachments = new ArrayList<>();

    @Column(name = "interactive_tool")
    private String interactiveTool;

    private Integer version;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "versions_history", columnDefinition = "jsonb")
    @Builder.Default
    private List<Map<String, Object>> versionsHistory = new ArrayList<>();

    @Column(name = "workflow_status")
    private String workflowStatus;

    @Column(name = "author_name")
    private String authorName;

    @Column(name = "reviewer_name")
    private String reviewerName;

    @Column(name = "updated_at")
    private String updatedAt;

    @Column(name = "created_at")
    private String createdAt;
}
