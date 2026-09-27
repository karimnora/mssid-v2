package dz.mssid.education.repository;

import dz.mssid.education.entity.ChildProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChildProfileRepository extends JpaRepository<ChildProfile, Long> {
    List<ChildProfile> findAllByUserEmailOrderByCreatedAtAsc(String email);

    Optional<ChildProfile> findByIdAndUserEmail(Long id, String email);

    long countByUserEmail(String email);
}
