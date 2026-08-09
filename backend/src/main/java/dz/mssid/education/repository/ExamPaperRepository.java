package dz.mssid.education.repository;

import dz.mssid.education.entity.ExamPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamPaperRepository extends JpaRepository<ExamPaper, Long> {

    List<ExamPaper> findByNiveauAndMatiere(String niveau, String matiere);

    List<ExamPaper> findByNiveau(String niveau);

    List<ExamPaper> findByMatiere(String matiere);
}