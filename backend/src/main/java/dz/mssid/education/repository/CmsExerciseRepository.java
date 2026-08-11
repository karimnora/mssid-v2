package dz.mssid.education.repository;

import dz.mssid.education.entity.CmsExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CmsExerciseRepository extends JpaRepository<CmsExercise, String> {
}
