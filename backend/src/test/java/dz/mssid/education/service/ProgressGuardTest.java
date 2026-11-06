package dz.mssid.education.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ProgressGuardTest {

    @Test
    void savesWorkshopSummaryWithoutDuplicatesOrScoredCounts() {
        Map<String, Object> summary = Map.of("id", "session-1", "title", "Fractions", "grade", "5AP", "next", "interactive",
                "transfer", Map.of("decompose", Map.of("completed", true, "helped", true, "attempts", 2)));
        Map<String, Object> entry = Map.of("at", "2026-11-06T18:00:00Z", "lessonId", "math-5ap-fractions", "outcome", "success", "villageSummary", summary);
        var saved = ProgressGuard.mergeLessonSessions(List.of(), List.of(entry));
        var replay = ProgressGuard.mergeLessonSessions(saved, List.of(entry));
        assertEquals(1, replay.size());
        assertEquals(0, replay.getFirst().get("count"));
        assertTrue(replay.getFirst().get("villageSummary") instanceof Map);
        assertEquals(List.of(), replay.getFirst().get("competenceIds"));
    }

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
    @DisplayName("Competence stats keep the higher counts and drop unsafe ids")
    void mergeCompetenceStats_keepsMaxAndDropsUnsafe() {
        Map<String, Object> existing = Map.of(
                "math-1ap-c-addition",
                Map.of("attempts", 2, "successes", 1, "failures", 1, "lastAt", "2026-01-01T00:00:00Z", "lastLessonId", "math-1ap-t2-addition-concept", "lastOutcome", "fail")
        );
        Map<String, Object> incoming = Map.of(
                "math-1ap-c-addition",
                Map.of("attempts", 3, "successes", 2, "failures", 1, "lastAt", "2026-02-01T00:00:00Z", "lastLessonId", "math-1ap-t2-addition-concept", "lastOutcome", "success"),
                "<script>",
                Map.of("attempts", 9, "successes", 9, "failures", 0)
        );
        Map<String, Object> merged = ProgressGuard.mergeCompetenceStats(existing, incoming);
        @SuppressWarnings("unchecked")
        Map<String, Object> addition = (Map<String, Object>) merged.get("math-1ap-c-addition");
        assertEquals(3, addition.get("attempts"));
        assertEquals(2, addition.get("successes"));
        assertEquals("success", addition.get("lastOutcome"));
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
