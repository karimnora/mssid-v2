package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.Subscription;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.SubscriptionRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Without this, ROLE_PREMIUM granted on receipt approval (PaymentServiceImpl.verifyReceipt) was
 * permanent regardless of the Subscription.endDate recorded alongside it — the "1500 DZD / an" model
 * had no actual enforcement, a paying user's access never lapsed after their year was up.
 */
@Service
@RequiredArgsConstructor
public class SubscriptionExpiryService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionExpiryService.class);

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // Once a day is plenty for an annual subscription — a user's access lapsing a few hours late
    // isn't a real-money problem the way e.g. a payment webhook retry would be.
    @Scheduled(cron = "0 0 3 * * *")
    public void expireOverdueSubscriptionsScheduled() {
        int expired = expireOverdueSubscriptions();
        if (expired > 0) {
            log.info("[SubscriptionExpiryService] {} abonnement(s) expiré(s), utilisateur(s) rétrogradé(s) vers ROLE_FREE.", expired);
        }
    }

    @Transactional
    public int expireOverdueSubscriptions() {
        List<Subscription> overdue = subscriptionRepository.findByStatusAndEndDateBefore(
                Subscription.SubscriptionStatus.ACTIVE, LocalDate.now());

        if (overdue.isEmpty()) return 0;

        Role freeRole = roleRepository.findByName(Role.RoleName.ROLE_FREE)
                .orElseThrow(() -> new IllegalStateException("ROLE_FREE introuvable — DataInitializer n'a pas tourné ?"));

        for (Subscription subscription : overdue) {
            subscription.setStatus(Subscription.SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(subscription);

            User user = subscription.getUser();
            // Only downgrade if still PREMIUM — an admin may already have changed the role manually
            // (e.g. promoted to ADMIN) since the subscription was granted; don't clobber that.
            if (user.getRole() != null && user.getRole().getName() == Role.RoleName.ROLE_PREMIUM) {
                user.setRole(freeRole);
                userRepository.save(user);
            }
        }

        return overdue.size();
    }
}
