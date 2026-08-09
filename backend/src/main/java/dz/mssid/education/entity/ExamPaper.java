package dz.mssid.education.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_papers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private String matiere; // Math, Physique, Sciences, Arab, etc.

    @Column(nullable = false)
    private String niveau; // 1AM, 2AM, 3AM, 4AM (BEM), 1AS, 2AS, 3AS (BAC)

    @Column(nullable = false)
    private Integer annee; // e.g. 2024, 2023

    private Integer trimestre; // 1, 2, 3

    @Column(name = "pdf_subject_url", nullable = false)
    private String pdfSubjectUrl;

    @Column(name = "pdf_solution_url")
    private String pdfSolutionUrl; // Accès réservé au ROLE_PREMIUM

    @Column(name = "correction_bareme_details", columnDefinition = "TEXT")
    private String correctionBaremeDetails;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}