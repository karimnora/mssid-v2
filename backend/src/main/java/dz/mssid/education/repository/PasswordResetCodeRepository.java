package dz.mssid.education.repository;

import dz.mssid.education.entity.PasswordResetCode;
import dz.mssid.education.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, Long> {

    Optional<PasswordResetCode> findByCodeHashAndUser(String codeHash, User user);

    List<PasswordResetCode> findByUserAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(User user, LocalDateTime now);
}
