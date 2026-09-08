package dz.mssid.education.service;

import dz.mssid.education.dto.AdminStatsOverviewDto;
import dz.mssid.education.dto.PaymentsStatsDto;
import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.PaymentReceiptRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Backs the Admin Console's "Analytics" module (GET /api/v1/admin/stats/overview). Computes every
 * metric server-side from real persisted data (User rows + PaymentReceipt rows) — see
 * AdminStatsOverviewDto's javadoc for the "no fabricated metric" contract this must honor.
 */
@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final PaymentReceiptRepository paymentReceiptRepository;

    public AdminStatsOverviewDto getOverview() {
        List<User> users = userRepository.findAll();
        List<PaymentReceipt> receipts = paymentReceiptRepository.findAll();

        long totalUsers = users.size();

        Map<String, Long> roleDistribution = users.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getRole() != null && u.getRole().getName() != null ? u.getRole().getName().name() : "UNKNOWN",
                        Collectors.counting()
                ));

        Map<String, Long> gradeDistribution = users.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getGrade() != null && !u.getGrade().isBlank() ? u.getGrade() : "UNKNOWN",
                        Collectors.counting()
                ));

        Map<String, Long> wilayaDistribution = users.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getWilaya() != null && !u.getWilaya().isBlank() ? u.getWilaya() : "UNKNOWN",
                        Collectors.counting()
                ));

        long totalXp = users.stream().mapToLong(u -> u.getXp() != null ? u.getXp() : 0).sum();
        double averageXp = totalUsers == 0 ? 0 : (double) totalXp / totalUsers;
        double averageLevel = totalUsers == 0 ? 0 : users.stream().mapToInt(u -> u.getLevel() != null ? u.getLevel() : 1).average().orElse(0);
        double averageStreakDays = totalUsers == 0 ? 0 : users.stream().mapToInt(u -> u.getStreakDays() != null ? u.getStreakDays() : 0).average().orElse(0);

        long totalCompletedLessons = users.stream().mapToLong(u -> u.getCompletedLessonIds() != null ? u.getCompletedLessonIds().size() : 0).sum();
        long totalCompletedExams = users.stream().mapToLong(u -> u.getCompletedExamIds() != null ? u.getCompletedExamIds().size() : 0).sum();
        long totalCompletedChallenges = users.stream().mapToLong(u -> u.getCompletedChallengeIds() != null ? u.getCompletedChallengeIds().size() : 0).sum();
        long totalBadgesUnlocked = users.stream().mapToLong(u -> u.getBadges() != null ? u.getBadges().size() : 0).sum();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = now.minusDays(7);
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        long newUsersLast7Days = users.stream().filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(sevenDaysAgo)).count();
        long newUsersLast30Days = users.stream().filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(thirtyDaysAgo)).count();

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgoDate = today.minusDays(7);
        LocalDate thirtyDaysAgoDate = today.minusDays(30);

        long dailyActiveUsers = users.stream()
                .filter(u -> today.equals(parseLastActiveDate(u.getLastActiveDate())))
                .count();
        long weeklyActiveUsers = users.stream()
                .filter(u -> wasActiveSince(u.getLastActiveDate(), sevenDaysAgoDate))
                .count();
        long monthlyActiveUsers = users.stream()
                .filter(u -> wasActiveSince(u.getLastActiveDate(), thirtyDaysAgoDate))
                .count();

        List<User> oldEnoughFor7DayWindow = users.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isBefore(sevenDaysAgo))
                .collect(Collectors.toList());
        long retained7 = oldEnoughFor7DayWindow.stream()
                .filter(u -> wasActiveSince(u.getLastActiveDate(), sevenDaysAgoDate))
                .count();
        double retentionRate7Days = oldEnoughFor7DayWindow.isEmpty() ? 0 : (double) retained7 / oldEnoughFor7DayWindow.size() * 100;

        List<User> oldEnoughFor30DayWindow = users.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isBefore(thirtyDaysAgo))
                .collect(Collectors.toList());
        long retained30 = oldEnoughFor30DayWindow.stream()
                .filter(u -> wasActiveSince(u.getLastActiveDate(), thirtyDaysAgoDate))
                .count();
        double retentionRate30Days = oldEnoughFor30DayWindow.isEmpty() ? 0 : (double) retained30 / oldEnoughFor30DayWindow.size() * 100;

        Map<String, Long> topCompletedLessons = users.stream()
                .flatMap(u -> (u.getCompletedLessonIds() != null ? u.getCompletedLessonIds() : List.<String>of()).stream())
                .collect(Collectors.groupingBy(id -> id, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));

        Map<String, Long> receiptsByStatus = receipts.stream()
                .collect(Collectors.groupingBy(r -> r.getStatus().name(), Collectors.counting()));
        Map<String, Long> receiptsByMethod = receipts.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getPaymentMethod() != null ? r.getPaymentMethod() : "UNKNOWN",
                        Collectors.counting()
                ));
        double totalAmountDzdApproved = receipts.stream()
                .filter(r -> r.getStatus() == PaymentReceipt.ReceiptStatus.APPROVED)
                .mapToDouble(r -> r.getAmountDzd() != null ? r.getAmountDzd() : 0)
                .sum();
        double totalAmountDzdPending = receipts.stream()
                .filter(r -> r.getStatus() == PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION)
                .mapToDouble(r -> r.getAmountDzd() != null ? r.getAmountDzd() : 0)
                .sum();

        PaymentsStatsDto payments = PaymentsStatsDto.builder()
                .totalReceipts(receipts.size())
                .receiptsByStatus(receiptsByStatus)
                .receiptsByMethod(receiptsByMethod)
                .totalAmountDzdApproved(totalAmountDzdApproved)
                .totalAmountDzdPending(totalAmountDzdPending)
                .build();

        return AdminStatsOverviewDto.builder()
                .totalUsers(totalUsers)
                .roleDistribution(roleDistribution)
                .gradeDistribution(gradeDistribution)
                .wilayaDistribution(wilayaDistribution)
                .totalXp(totalXp)
                .averageXp(averageXp)
                .averageLevel(averageLevel)
                .averageStreakDays(averageStreakDays)
                .totalCompletedLessons(totalCompletedLessons)
                .totalCompletedExams(totalCompletedExams)
                .totalCompletedChallenges(totalCompletedChallenges)
                .totalBadgesUnlocked(totalBadgesUnlocked)
                .newUsersLast7Days(newUsersLast7Days)
                .newUsersLast30Days(newUsersLast30Days)
                .dailyActiveUsers(dailyActiveUsers)
                .weeklyActiveUsers(weeklyActiveUsers)
                .monthlyActiveUsers(monthlyActiveUsers)
                .retentionRate7Days(retentionRate7Days)
                .retentionRate30Days(retentionRate30Days)
                .topCompletedLessons(topCompletedLessons)
                .payments(payments)
                .build();
    }

    /** {@code User.lastActiveDate} is stored as a plain "YYYY-MM-DD" string (see ProgressGuard),
     * but stays null for an account that never synced progress once — never assume it's present. */
    private static LocalDate parseLastActiveDate(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return LocalDate.parse(raw.length() > 10 ? raw.substring(0, 10) : raw);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private static boolean wasActiveSince(String lastActiveDate, LocalDate cutoff) {
        LocalDate parsed = parseLastActiveDate(lastActiveDate);
        return parsed != null && !parsed.isBefore(cutoff);
    }
}
