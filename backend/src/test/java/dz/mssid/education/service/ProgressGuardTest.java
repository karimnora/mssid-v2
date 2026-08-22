package dz.mssid.education.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ProgressGuardTest {

    @Test
    @DisplayName("XP never decreases and a huge jump is capped per sync")
    void clampXp_ignoresDecreaseAndCapsGain() {
        assertEquals(400, ProgressGuard.clampXp(400, 10));
        assertEquals(400, ProgressGuard.clampXp(400, null));
        assertEquals(400 + ProgressGuard.MAX_XP_GAIN_PER_SYNC, ProgressGuard.clampXp(400, 999_999));
        assertEquals(40, ProgressGuard.clampXp(0, 40));
    }

    @Test
    @DisplayName("Level is derived from XP — 100 XP per level, starting at 1")
    void levelFromXp_matchesFrontendFormula() {
        assertEquals(1, ProgressGuard.levelFromXp(0));
        assertEquals(1, ProgressGuard.levelFromXp(99));
        assertEquals(2, ProgressGuard.levelFromXp(100));
        assertEquals(6, ProgressGuard.levelFromXp(500));
    }

    @Test
    @DisplayName("Gold can decrease (shop spend) but gains are capped")
    void clampGold_allowsSpendCapsGain() {
        assertEquals(95, ProgressGuard.clampGold(150, 95));
        assertEquals(150 + ProgressGuard.MAX_GOLD_GAIN_PER_SYNC, ProgressGuard.clampGold(150, 10_000));
        assertEquals(150, ProgressGuard.clampGold(150, null));
        assertEquals(0, ProgressGuard.clampGold(20, -5));
    }

    @Test
    @DisplayName("Streak may reset, but can only grow by 1 per sync")
    void clampStreak_resetAllowedIncreaseCapped() {
        assertEquals(1, ProgressGuard.clampStreak(7, 1));
        assertEquals(8, ProgressGuard.clampStreak(7, 30));
        assertEquals(ProgressGuard.MAX_STREAK_DAYS, ProgressGuard.clampStreak(ProgressGuard.MAX_STREAK_DAYS, 999));
    }

    @Test
    @DisplayName("Unknown badge ids are dropped; catalog ids merge")
    void mergeKnownBadges_dropsUnknown() {
        List<String> merged = ProgressGuard.mergeKnownBadges(
                List.of("b_welcome"),
                Arrays.asList("b_welcome", "b_hacker", "b_math_star", null)
        );
        assertEquals(List.of("b_welcome", "b_math_star"), merged);
    }

    @Test
    @DisplayName("Quiz XP per lesson is clamped and never decreases")
    void mergeQuizScores_clampsAndKeepsBest() {
        Map<String, Integer> merged = ProgressGuard.mergeQuizScores(
                Map.of("lesson-math-1", 40),
                Map.of("lesson-math-1", 9999, "lesson-math-2", -3, "<script>", 80)
        );
        assertEquals(ProgressGuard.MAX_LESSON_QUIZ_XP, merged.get("lesson-math-1"));
        assertEquals(0, merged.get("lesson-math-2"));
        assertFalse(merged.containsKey("<script>"));
    }

    @Test
    @DisplayName("Only official grades 1AP–5AP are accepted")
    void sanitizeGrade_rejectsUnknown() {
        assertEquals("3AP", ProgressGuard.sanitizeGrade("5AP", "3AP"));
        assertEquals("5AP", ProgressGuard.sanitizeGrade("5AP", "99AP"));
        assertEquals("5AP", ProgressGuard.sanitizeGrade("5AP", null));
    }
}
