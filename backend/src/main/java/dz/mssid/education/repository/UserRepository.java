package dz.mssid.education.repository;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    long countByRole_Name(Role.RoleName roleName);

    List<User> findByCreatedAtGreaterThanEqualAndCreatedAtLessThan(LocalDateTime from, LocalDateTime until);
}
