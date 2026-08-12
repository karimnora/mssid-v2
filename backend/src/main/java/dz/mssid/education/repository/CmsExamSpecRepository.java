package dz.mssid.education.repository;

import dz.mssid.education.entity.CmsExamSpec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CmsExamSpecRepository extends JpaRepository<CmsExamSpec, String> {

    List<CmsExamSpec> findByGrade(String grade);

    List<CmsExamSpec> findByGradeAndSubject(String grade, String subject);
}
