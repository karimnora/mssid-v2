package dz.mssid.education.repository;

import dz.mssid.education.entity.CmsExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CmsExerciseRepository extends JpaRepository<CmsExercise, String> {

    List<CmsExercise> findByGrade(String grade);

    List<CmsExercise> findByGradeAndSubject(String grade, String subject);
}
