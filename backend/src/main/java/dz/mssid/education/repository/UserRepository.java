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

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select u from User u where u.id = :id")
    Optional<User> findForPayment(@org.springframework.data.repository.query.Param("id") Long id);

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    long countByRole_Name(Role.RoleName roleName);

    List<User> findByCreatedAtGreaterThanEqualAndCreatedAtLessThan(LocalDateTime from, LocalDateTime until);

    /** Families that receive the weekly report: a parent e-mail, not opted out, not already sent since {@code sentBefore}. */
    @org.springframework.data.jpa.repository.Query("select u from User u where u.parentEmail is not null and u.parentEmail <> '' and u.weeklyReportOptOut = false and (u.weeklyReportLastSentAt is null or u.weeklyReportLastSentAt < :sentBefore) order by u.id")
    List<User> findWeeklyReportRecipients(@org.springframework.data.repository.query.Param("sentBefore") LocalDateTime sentBefore);
}
