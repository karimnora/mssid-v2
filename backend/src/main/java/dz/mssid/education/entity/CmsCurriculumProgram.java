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
@Table(name = "cms_curriculum")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsCurriculumProgram {

    @Id
    private String id;

    private String country;

    @Column(name = "school_system")
    private String schoolSystem;

    @Column(name = "academic_year")
    private String academicYear;

    private String grade;
    private String subject;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "chapters", columnDefinition = "jsonb")
    @Builder.Default
    private List<CmsChapter> chapters = new ArrayList<>();

    @Column(name = "updated_at")
    private String updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CmsChapter {
        private String id;
        private String grade;
        private String subject;
        private String code;
        private String titleAr;
        private Integer order;

        @Builder.Default
        private List<PedagogicalCompetency> competencies = new ArrayList<>();

        @Builder.Default
        private List<CmsSubLesson> subLessons = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PedagogicalCompetency {
        private String id;
        private String code;
        private String domainAr;
        private String descriptionAr;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CmsSubLesson {
        private String id;
        private String titleAr;
        private Integer order;

        @Builder.Default
        private List<PedagogicalObjective> objectives = new ArrayList<>();

        @Column(name = "content_ar", columnDefinition = "text")
        private String contentAr;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PedagogicalObjective {
        private String id;
        private String descriptionAr;
        private String bloomTaxonomyLevel;
    }
}
