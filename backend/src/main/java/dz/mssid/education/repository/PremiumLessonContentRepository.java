package dz.mssid.education.repository;

import dz.mssid.education.entity.PremiumLessonContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PremiumLessonContentRepository extends JpaRepository<PremiumLessonContent, String> {
}
