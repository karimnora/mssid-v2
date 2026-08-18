package dz.mssid.education.repository;

import dz.mssid.education.entity.Subscription;
import dz.mssid.education.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUser(User user);

    List<Subscription> findByStatusAndEndDateBefore(Subscription.SubscriptionStatus status, LocalDate date);

    void deleteByUser(User user);
}
