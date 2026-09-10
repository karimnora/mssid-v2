package dz.mssid.education.repository;

import dz.mssid.education.entity.AdReel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdReelRepository extends JpaRepository<AdReel, Long> {
    List<AdReel> findAllByOrderByUpdatedAtDesc();
}
