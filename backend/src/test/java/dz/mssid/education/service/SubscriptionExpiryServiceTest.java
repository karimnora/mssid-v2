package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.Subscription;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.SubscriptionRepository;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionExpiryServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private SubscriptionExpiryService subscriptionExpiryService;

    private Role freeRole;
    private Role premiumRole;
    private User premiumUser;

    @BeforeEach
    void setUp() {
        freeRole = new Role(1L, Role.RoleName.ROLE_FREE);
        premiumRole = new Role(2L, Role.RoleName.ROLE_PREMIUM);
        premiumUser = User.builder().id(20L).email("amina@mssid.dz").role(premiumRole).build();
    }

    @Test
    @DisplayName("expireOverdueSubscriptions - Downgrades a PREMIUM user whose subscription lapsed")
    void expireOverdueSubscriptions_DowngradesPremiumUser() {
        Subscription overdue = Subscription.builder()
                .id(1L).user(premiumUser).status(Subscription.SubscriptionStatus.ACTIVE)
                .startDate(LocalDate.now().minusYears(1).minusDays(5))
                .endDate(LocalDate.now().minusDays(5))
                .build();

        when(subscriptionRepository.findByStatusAndEndDateBefore(eq(Subscription.SubscriptionStatus.ACTIVE), any(LocalDate.class)))
                .thenReturn(List.of(overdue));
        when(roleRepository.findByName(Role.RoleName.ROLE_FREE)).thenReturn(Optional.of(freeRole));

        int expiredCount = subscriptionExpiryService.expireOverdueSubscriptions();

        assertEquals(1, expiredCount);
        assertEquals(Subscription.SubscriptionStatus.EXPIRED, overdue.getStatus());
        assertEquals(freeRole, premiumUser.getRole());
        verify(subscriptionRepository).save(overdue);
        verify(userRepository).save(premiumUser);
    }

    @Test
    @DisplayName("expireOverdueSubscriptions - No-ops when nothing has lapsed")
    void expireOverdueSubscriptions_NothingOverdue_NoOps() {
        when(subscriptionRepository.findByStatusAndEndDateBefore(eq(Subscription.SubscriptionStatus.ACTIVE), any(LocalDate.class)))
                .thenReturn(List.of());

        int expiredCount = subscriptionExpiryService.expireOverdueSubscriptions();

        assertEquals(0, expiredCount);
        verifyNoInteractions(userRepository, roleRepository);
        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    @DisplayName("expireOverdueSubscriptions - Leaves an ADMIN's role alone even if their old subscription lapsed")
    void expireOverdueSubscriptions_DoesNotClobberNonPremiumRole() {
        Role adminRole = new Role(3L, Role.RoleName.ROLE_ADMIN);
        User promotedToAdmin = User.builder().id(21L).email("chef@mssid.dz").role(adminRole).build();
        Subscription overdue = Subscription.builder()
                .id(2L).user(promotedToAdmin).status(Subscription.SubscriptionStatus.ACTIVE)
                .startDate(LocalDate.now().minusYears(1).minusDays(1))
                .endDate(LocalDate.now().minusDays(1))
                .build();

        when(subscriptionRepository.findByStatusAndEndDateBefore(eq(Subscription.SubscriptionStatus.ACTIVE), any(LocalDate.class)))
                .thenReturn(List.of(overdue));
        when(roleRepository.findByName(Role.RoleName.ROLE_FREE)).thenReturn(Optional.of(freeRole));

        subscriptionExpiryService.expireOverdueSubscriptions();

        assertEquals(adminRole, promotedToAdmin.getRole());
        verify(userRepository, never()).save(any());
    }
}
