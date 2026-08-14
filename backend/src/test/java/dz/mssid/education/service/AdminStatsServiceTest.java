package dz.mssid.education.service;

import dz.mssid.education.dto.AdminStatsOverviewDto;
import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.PaymentReceiptRepository;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminStatsServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PaymentReceiptRepository paymentReceiptRepository;

    @InjectMocks
    private AdminStatsService adminStatsService;

    @Test
    @DisplayName("getOverview - Computes every metric from real User/PaymentReceipt rows, no fabricated fields")
    void getOverview_ComputesRealAggregates() {
        Role freeRole = new Role(1L, Role.RoleName.ROLE_FREE);
        Role premiumRole = new Role(2L, Role.RoleName.ROLE_PREMIUM);

        User u1 = User.builder()
                .id(1L).role(freeRole).grade("5AP").xp(100).level(2).streakDays(3)
                .completedLessonIds(List.of("l1", "l2")).completedExamIds(List.of("e1"))
                .completedChallengeIds(List.of()).badges(List.of("b1"))
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();
        User u2 = User.builder()
                .id(2L).role(premiumRole).grade("5AP").xp(300).level(4).streakDays(10)
                .completedLessonIds(List.of("l3")).completedExamIds(List.of())
                .completedChallengeIds(List.of("c1", "c2")).badges(List.of("b1", "b2"))
                .createdAt(LocalDateTime.now().minusDays(20))
                .build();

        when(userRepository.findAll()).thenReturn(List.of(u1, u2));

        PaymentReceipt r1 = PaymentReceipt.builder()
                .id(1L).status(PaymentReceipt.ReceiptStatus.APPROVED).paymentMethod("BARIDIMOB").amountDzd(1500.0)
                .build();
        PaymentReceipt r2 = PaymentReceipt.builder()
                .id(2L).status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION).paymentMethod("CCP").amountDzd(2000.0)
                .build();
        when(paymentReceiptRepository.findAll()).thenReturn(List.of(r1, r2));

        AdminStatsOverviewDto result = adminStatsService.getOverview();

        assertEquals(2, result.getTotalUsers());
        assertEquals(1L, result.getRoleDistribution().get("ROLE_FREE"));
        assertEquals(1L, result.getRoleDistribution().get("ROLE_PREMIUM"));
        assertEquals(2L, result.getGradeDistribution().get("5AP"));
        assertEquals(400, result.getTotalXp());
        assertEquals(3, result.getTotalCompletedLessons());
        assertEquals(1, result.getTotalCompletedExams());
        assertEquals(2, result.getTotalCompletedChallenges());
        assertEquals(3, result.getTotalBadgesUnlocked());
        assertEquals(1, result.getNewUsersLast7Days());
        assertEquals(2, result.getNewUsersLast30Days());

        assertEquals(2, result.getPayments().getTotalReceipts());
        assertEquals(1L, result.getPayments().getReceiptsByStatus().get("APPROVED"));
        assertEquals(1L, result.getPayments().getReceiptsByStatus().get("PENDING_VERIFICATION"));
        assertEquals(1500.0, result.getPayments().getTotalAmountDzdApproved());
        assertEquals(2000.0, result.getPayments().getTotalAmountDzdPending());
    }

    @Test
    @DisplayName("getOverview - Handles zero users without dividing by zero")
    void getOverview_EmptyDataset() {
        when(userRepository.findAll()).thenReturn(List.of());
        when(paymentReceiptRepository.findAll()).thenReturn(List.of());

        AdminStatsOverviewDto result = adminStatsService.getOverview();

        assertEquals(0, result.getTotalUsers());
        assertEquals(0, result.getAverageXp());
        assertEquals(0, result.getPayments().getTotalReceipts());
    }
}
