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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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
                .provider("GOOGLE").emailVerified(true).parentEmail("parent@mssid.dz")
                .createdAt(LocalDateTime.now().minusDays(2))
                .lastActiveDate(LocalDate.now().toString())
                .build();
        User u2 = User.builder()
                .id(2L).role(premiumRole).grade("5AP").xp(300).level(4).streakDays(10)
                .completedLessonIds(List.of("l3")).completedExamIds(List.of())
                .completedChallengeIds(List.of("c1", "c2")).badges(List.of("b1", "b2"))
                .provider("LOCAL").emailVerified(false)
                .createdAt(LocalDateTime.now().minusDays(20))
                .lastActiveDate(LocalDate.now().toString())
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
        assertEquals(2, result.getDailyActiveUsers());
        assertEquals(Map.of("l1", 1L, "l2", 1L, "l3", 1L), result.getTopCompletedLessons());
        assertEquals(Map.of("e1", 1L), result.getTopCompletedExams());
        assertEquals(Map.of("c1", 1L, "c2", 1L), result.getTopCompletedChallenges());
        assertEquals(2, result.getActivatedUsers());
        assertEquals(100.0, result.getActivationRate(), 0.01);
        assertEquals(0, result.getNeverActiveUsers());
        assertEquals(1, result.getEmailVerifiedUsers());
        assertEquals(1, result.getParentEmailSetUsers());
        assertEquals(1L, result.getProviderDistribution().get("GOOGLE"));
        assertEquals(1L, result.getProviderDistribution().get("LOCAL"));
        assertEquals(100.0, result.getStickinessDauMau(), 0.01);

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
        assertEquals(0, result.getDailyActiveUsers());
        assertEquals(0, result.getRetentionRate7Days());
        assertTrue(result.getTopCompletedLessons().isEmpty());
    }

    @Test
    @DisplayName("getOverview - DAU/WAU/MAU and rolling retention read from lastActiveDate + createdAt only")
    void getOverview_ActiveUsersAndRetention() {
        Role freeRole = new Role(1L, Role.RoleName.ROLE_FREE);

        // Old account (40d), still active today: counted everywhere, and "retained" in both windows.
        User stillActive = User.builder()
                .id(1L).role(freeRole).grade("5AP")
                .completedLessonIds(List.of()).completedExamIds(List.of()).completedChallengeIds(List.of()).badges(List.of())
                .createdAt(LocalDateTime.now().minusDays(40))
                .lastActiveDate(LocalDate.now().toString())
                .build();
        // Old account (40d), last seen 20d ago: inside the 30-day window but not the 7-day one —
        // counted in MAU and retained30, but not WAU/retained7.
        User lapsedButRecent = User.builder()
                .id(2L).role(freeRole).grade("5AP")
                .completedLessonIds(List.of()).completedExamIds(List.of()).completedChallengeIds(List.of()).badges(List.of())
                .createdAt(LocalDateTime.now().minusDays(40))
                .lastActiveDate(LocalDate.now().minusDays(20).toString())
                .build();
        // Young account (3d): too recent to belong to either retention cohort's denominator, but
        // still counts toward DAU/WAU/MAU since it was active today.
        User newAndActive = User.builder()
                .id(3L).role(freeRole).grade("5AP")
                .completedLessonIds(List.of()).completedExamIds(List.of()).completedChallengeIds(List.of()).badges(List.of())
                .createdAt(LocalDateTime.now().minusDays(3))
                .lastActiveDate(LocalDate.now().toString())
                .build();
        // Old account (40d), last seen 60d ago: outside every window, drags both retention rates down.
        User goneDark = User.builder()
                .id(4L).role(freeRole).grade("5AP")
                .completedLessonIds(List.of()).completedExamIds(List.of()).completedChallengeIds(List.of()).badges(List.of())
                .createdAt(LocalDateTime.now().minusDays(40))
                .lastActiveDate(LocalDate.now().minusDays(60).toString())
                .build();

        when(userRepository.findAll()).thenReturn(List.of(stillActive, lapsedButRecent, newAndActive, goneDark));
        when(paymentReceiptRepository.findAll()).thenReturn(List.of());

        AdminStatsOverviewDto result = adminStatsService.getOverview();

        assertEquals(2, result.getDailyActiveUsers(), "stillActive + newAndActive");
        assertEquals(2, result.getWeeklyActiveUsers(), "same two — lapsedButRecent/goneDark are outside 7 days");
        assertEquals(3, result.getMonthlyActiveUsers(), "adds lapsedButRecent — 20d is inside the 30-day window");

        // Retention cohort (accounts older than the window) = stillActive, lapsedButRecent, goneDark (not newAndActive).
        assertEquals(100.0 / 3, result.getRetentionRate7Days(), 0.01, "only stillActive retained of the 3 old-enough accounts");
        assertEquals(200.0 / 3, result.getRetentionRate30Days(), 0.01, "stillActive + lapsedButRecent retained of the 3");
    }

    @Test
    @DisplayName("getOverview - topCompletedLessons aggregates across users and ranks by frequency")
    void getOverview_TopCompletedLessons() {
        Role freeRole = new Role(1L, Role.RoleName.ROLE_FREE);
        User u1 = User.builder().id(1L).role(freeRole).grade("5AP")
                .completedLessonIds(List.of("popular-lesson", "rare-lesson-a"))
                .completedExamIds(List.of()).completedChallengeIds(List.of()).badges(List.of())
                .createdAt(LocalDateTime.now()).build();
        User u2 = User.builder().id(2L).role(freeRole).grade("5AP")
                .completedLessonIds(List.of("popular-lesson", "rare-lesson-b"))
                .completedExamIds(List.of()).completedChallengeIds(List.of()).badges(List.of())
                .createdAt(LocalDateTime.now()).build();
        User u3 = User.builder().id(3L).role(freeRole).grade("5AP")
                .completedLessonIds(List.of("popular-lesson"))
                .completedExamIds(List.of()).completedChallengeIds(List.of()).badges(List.of())
                .createdAt(LocalDateTime.now()).build();

        when(userRepository.findAll()).thenReturn(List.of(u1, u2, u3));
        when(paymentReceiptRepository.findAll()).thenReturn(List.of());

        AdminStatsOverviewDto result = adminStatsService.getOverview();

        List<String> orderedIds = List.copyOf(result.getTopCompletedLessons().keySet());
        assertEquals("popular-lesson", orderedIds.get(0), "the 3x-completed lesson must rank first");
        assertEquals(3L, result.getTopCompletedLessons().get("popular-lesson"));
        assertEquals(1L, result.getTopCompletedLessons().get("rare-lesson-a"));
        assertEquals(1L, result.getTopCompletedLessons().get("rare-lesson-b"));
    }
}
