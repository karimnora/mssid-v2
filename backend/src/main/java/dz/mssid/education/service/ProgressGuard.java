package dz.mssid.education.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * SEC-11: the client still sends a full progress snapshot (fire-and-forget from AuthService),
 * but the server is authoritative. Unknown badges, huge XP/gold jumps, and client-picked
 * levels are clamped or dropped — never applied as-is.
 */
public final class ProgressGuard {

    public static final int XP_PER_LEVEL = 100;
    public static final int MAX_XP_GAIN_PER_SYNC = 250;
    public static final int MAX_XP_TOTAL = 1_000_000;
    public static final int MAX_GOLD_GAIN_PER_SYNC = 50;
    public static final int MAX_GOLD_TOTAL = 50_000;
    public static final int MAX_STREAK_INCREASE_PER_SYNC = 1;
    public static final int MAX_STREAK_DAYS = 365;
    public static final int MAX_NEW_IDS_PER_SYNC = 20;
    public static final int MAX_ID_LENGTH = 80;
    public static final int MAX_LESSON_QUIZ_XP = 500;

    public static final Set<String> ALLOWED_GRADES = Set.of("1AP", "2AP", "3AP", "4AP", "5AP");

    /** Mirrors frontend/src/data/badgesData.ts — unknown ids are dropped. */
    public static final Set<String> ALLOWED_BADGE_IDS = Set.of(
            "b_welcome",
            "b_fennec_desert",
            "b_tifinagh_friend",
            "b_arabic_calligraphy",
            "b_algerian_heritage",
            "b_gold_dinar",
            "b_green_defender",
            "b_math_star",
            "b_math_legend",
            "b_soroban_master",
            "b_arabic_hero",
            "b_arabic_master",
            "b_french_champion",
            "b_english_master",
            "b_science_explorer",
            "b_science_genius",
            "b_history_geo_scholar",
            "b_islamic_light",
            "b_civics_citizen",
            "b_all_rounder",
            "b_exam_champion",
            "b_exam_legend",
            "b_challenge_master",
            "b_challenge_legend",
            "b_streak_flame",
            "b_streak_legend",
            "b_xp_1000",
            "b_game_first",
            "b_arcade_master"
    );

    private static final Pattern SAFE_ID = Pattern.compile("^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,79}$");
    private static final Pattern ISO_DATE = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}$");

    private ProgressGuard() {
    }

    public static int clampXp(Integer current, Integer requested) {
        int from = current == null ? 0 : Math.max(0, current);
        if (requested == null) {
            return from;
        }
        int want = Math.max(0, requested);
        if (want <= from) {
            return from;
        }
        int gained = Math.min(want - from, MAX_XP_GAIN_PER_SYNC);
        return Math.min(MAX_XP_TOTAL, from + gained);
    }

    public static int levelFromXp(int xp) {
        return Math.floorDiv(Math.max(0, xp), XP_PER_LEVEL) + 1;
    }

    public static int clampGold(Integer current, Integer requested) {
        int from = current == null ? 0 : Math.max(0, current);
        if (requested == null) {
            return from;
        }
        int want = Math.max(0, Math.min(MAX_GOLD_TOTAL, requested));
        if (want <= from) {
            return want;
        }
        return Math.min(MAX_GOLD_TOTAL, from + Math.min(want - from, MAX_GOLD_GAIN_PER_SYNC));
    }

    public static int clampStreak(Integer current, Integer requested) {
        int from = current == null ? 0 : Math.max(0, current);
        if (requested == null) {
            return from;
        }
        int want = Math.max(0, Math.min(MAX_STREAK_DAYS, requested));
        if (want <= from) {
            return want;
        }
        return Math.min(MAX_STREAK_DAYS, from + MAX_STREAK_INCREASE_PER_SYNC);
    }

    public static String sanitizeGrade(String current, String requested) {
        if (requested != null && ALLOWED_GRADES.contains(requested)) {
            return requested;
        }
        return current;
    }

    public static String sanitizeLastActiveDate(String current, String requested) {
        if (requested != null && ISO_DATE.matcher(requested).matches()) {
            return requested;
        }
        return current;
    }

    public static List<String> mergeKnownBadges(List<String> existing, List<String> incoming) {
        List<String> merged = new ArrayList<>(existing != null ? existing : List.of());
        if (incoming == null) {
            return merged;
        }
        for (String badge : incoming) {
            if (badge != null && ALLOWED_BADGE_IDS.contains(badge) && !merged.contains(badge)) {
                merged.add(badge);
            }
        }
        return merged;
    }

    public static Map<String, String> mergeBadgeUnlockTimes(Map<String, String> existing, Map<String, String> incoming) {
        Map<String, String> merged = new HashMap<>(existing != null ? existing : Map.of());
        if (incoming == null) {
            return merged;
        }
        incoming.forEach((badgeId, unlockedAt) -> {
            if (badgeId != null && unlockedAt != null && ALLOWED_BADGE_IDS.contains(badgeId)) {
                merged.putIfAbsent(badgeId, unlockedAt);
            }
        });
        return merged;
    }

    public static List<String> mergeIds(List<String> existing, List<String> incoming) {
        List<String> merged = new ArrayList<>(existing != null ? existing : List.of());
        if (incoming == null) {
            return merged;
        }
        int added = 0;
        for (String id : incoming) {
            if (added >= MAX_NEW_IDS_PER_SYNC) {
                break;
            }
            if (isSafeId(id) && !merged.contains(id)) {
                merged.add(id);
                added++;
            }
        }
        return merged;
    }

    public static Map<String, Integer> mergeQuizScores(Map<String, Integer> existing, Map<String, Integer> incoming) {
        Map<String, Integer> merged = new HashMap<>(existing != null ? existing : Map.of());
        if (incoming == null) {
            return merged;
        }
        incoming.forEach((lessonId, score) -> {
            if (!isSafeId(lessonId) || score == null) {
                return;
            }
            int clamped = Math.max(0, Math.min(MAX_LESSON_QUIZ_XP, score));
            merged.put(lessonId, Math.max(merged.getOrDefault(lessonId, 0), clamped));
        });
        return merged;
    }

    static boolean isSafeId(String id) {
        return id != null && id.length() <= MAX_ID_LENGTH && SAFE_ID.matcher(id).matches();
    }
}
