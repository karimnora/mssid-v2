package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Every field here maps 1:1 to a real, persisted column already on {@code User}/{@code PaymentReceipt}
 * (see AdminStatsService) — deliberately excludes anything with no real backing data (average session
 * time, per-lesson open/abandon events, preschool session counts): those would have to be fabricated.
 *
 * dailyActiveUsers/weeklyActiveUsers/monthlyActiveUsers and the retention rates are derived from
 * {@code User.lastActiveDate}, sent by the frontend when progress is synchronized. It is a UTC
 * calendar date, not an app-open log or proof of learning. Guests and unsynchronized activity are
 * absent. The 7/30-day windows include today and the preceding 6/29 dates, excluding future dates.
 *
 * retentionRate7Days/30Days: of accounts old enough to have had a full 7/30-day window (created before
 * that cutoff), the percentage still active (lastActiveDate) within the last 7/30 days — a rolling
 * "are old accounts still coming back" rate, not per-cohort same-day-offset retention (which needs
 * more signup volume per day than an early-stage app has to be statistically meaningful).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsOverviewDto {
    private long totalUsers;
    private Map<String, Long> roleDistribution;
    private Map<String, Long> gradeDistribution;
    /** wilaya name -> account count, "UNKNOWN" for accounts that never set it (all accounts predating
     * this field, plus any Google sign-up that hasn't completed its profile yet). */
    private Map<String, Long> wilayaDistribution;
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
    private long newUsersToday;
    private long dailyActiveUsers;
    private long weeklyActiveUsers;
    private long monthlyActiveUsers;
    private double retentionRate7Days;
    private double retentionRate30Days;
    /** DAU / MAU × 100 — 0 when nobody was active this month. */
    private double stickinessDauMau;
    /** Accounts that completed at least one lesson. */
    private long activatedUsers;
    private double activationRate;
    private long neverActiveUsers;
    private long inactive30DaysUsers;
    private long emailVerifiedUsers;
    private long parentEmailSetUsers;
    /** LOCAL / GOOGLE (User.provider). */
    private Map<String, Long> providerDistribution;
    /** lessonId -> completion count across all users, top 10, already sorted descending. */
    private Map<String, Long> topCompletedLessons;
    private Map<String, Long> topCompletedExams;
    private Map<String, Long> topCompletedChallenges;
    private PaymentsStatsDto payments;
}
