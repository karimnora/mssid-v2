package dz.mssid.education.repository;

import dz.mssid.education.entity.CmsCurriculumProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CmsCurriculumProgramRepository extends JpaRepository<CmsCurriculumProgram, String> {
}
