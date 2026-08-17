package dz.mssid.education.repository;

import dz.mssid.education.entity.EmailVerificationCode;
import dz.mssid.education.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCode, Long> {

    Optional<EmailVerificationCode> findByCodeHashAndUser(String codeHash, User user);

    List<EmailVerificationCode> findByUserAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(User user, LocalDateTime now);
}
