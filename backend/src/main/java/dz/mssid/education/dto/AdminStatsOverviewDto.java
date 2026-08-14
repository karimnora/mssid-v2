package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Every field here maps 1:1 to a real, persisted column already on {@code User}/{@code PaymentReceipt}
 * (see AdminStatsService) — deliberately excludes anything with no real backing data (DAU, average
 * session time, "top consulted lessons", preschool session counts): those would have to be fabricated.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsOverviewDto {
    private long totalUsers;
    private Map<String, Long> roleDistribution;
    private Map<String, Long> gradeDistribution;
    private long totalXp;
    private double averageXp;
    private double averageLevel;
    private double averageStreakDays;
    private long totalCompletedLessons;
    private long totalCompletedExams;
    private long totalCompletedChallenges;
    private long totalBadgesUnlocked;
    private long newUsersLast7Days;
    private long newUsersLast30Days;
    private PaymentsStatsDto payments;
}
