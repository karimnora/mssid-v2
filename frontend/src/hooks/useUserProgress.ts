import { useCallback, useEffect, useState } from 'react';
import { Badge as BadgeInfo, PrimaryGrade, UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { AuthService } from '../services/authService';
import { incrementDailyObjective } from '../utils/dailyObjective';
import { applyDidouGoldBonus } from '../utils/didouCompanion';
import { getStoredLocale } from '../localePreference';
import { locales } from '../locales';

/** Back-fills fields added after a profile was first saved to localStorage, and updates the daily streak. */
export function normalizeUserProfile(raw: UserProfile): UserProfile {
  const profile: UserProfile = {
    ...raw,
    completedExamIds: raw.completedExamIds || [],
    completedChallengeIds: raw.completedChallengeIds || [],
    completedGameIds: raw.completedGameIds || [],
    completedLabIds: raw.completedLabIds || [],
    quizFullyValidatedLessonIds: raw.quizFullyValidatedLessonIds || [],
    badgeUnlockedAt: raw.badgeUnlockedAt || {},
  };

  const today = new Date().toISOString().slice(0, 10);
  const lastActive = profile.lastActiveDate ? profile.lastActiveDate.slice(0, 10) : null;
  if (lastActive === today) return profile;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return {
    ...profile,
    streakDays: lastActive === yesterday ? profile.streakDays + 1 : 1,
    lastActiveDate: today,
  };
}

/**
 * A genuine "clean slate" profile — every progress field zeroed, not just a subset. Used on logout
 * so the next guest/user never sees the previous account's XP/lessons/badges/streak/quiz history.
 * Keeps the grade the app was already browsing (not the account's), since that's app-level context
 * rather than personal progress.
 */
export function createFreshGuestProfile(currentGrade: PrimaryGrade): UserProfile {
  return {
    name: 'تلميذ مَسِيد',
    grade: currentGrade,
    avatar: '🎓',
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    completedLessonIds: [],
    completedExamIds: [],
    completedChallengeIds: [],
    completedGameIds: [],
    completedLabIds: [],
    quizFullyValidatedLessonIds: [],
    badges: [],
    badgeUnlockedAt: {},
    quizScores: {},
    tashkeelEnabled: false,
  };
}

/** XP from a quiz item or exercise — does not mark the lesson complete. */
export function applyLessonXp(prev: UserProfile, lessonId: string, earnedXp: number): UserProfile {
  const newXp = prev.xp + earnedXp;
  return {
    ...prev,
    xp: newXp,
    level: Math.floor(newXp / 100) + 1,
    quizScores: {
      ...prev.quizScores,
      [lessonId]: (prev.quizScores[lessonId] || 0) + earnedXp,
    },
  };
}

/** First success only — replaying a challenge never farms XP. */
export function applyChallengeXp(prev: UserProfile, challengeId: string, earnedXp: number): UserProfile {
  if (prev.completedChallengeIds.includes(challengeId)) return prev;
  const xp = prev.xp + Math.max(0, earnedXp);
  return {
    ...prev,
    xp,
    level: Math.floor(xp / 100) + 1,
    completedChallengeIds: [...prev.completedChallengeIds, challengeId],
  };
}

/** First success only — arcade replay is not a lesson and does not add XP. */
export function applyGameXp(prev: UserProfile, gameId: string, earnedXp: number): UserProfile {
  const ids = prev.completedGameIds ?? [];
  if (ids.includes(gameId)) return prev;
  const xp = prev.xp + Math.max(0, earnedXp);
  return {
    ...prev,
    xp,
    level: Math.floor(xp / 100) + 1,
    completedGameIds: [...ids, gameId],
  };
}

/** A lesson is complete only after the interactive quiz is fully correct (or a no-quiz lesson is finished). */
export function markLessonQuizComplete(prev: UserProfile, lessonId: string): UserProfile {
  return {
    ...prev,
    quizFullyValidatedLessonIds: prev.quizFullyValidatedLessonIds.includes(lessonId)
      ? prev.quizFullyValidatedLessonIds
      : [...prev.quizFullyValidatedLessonIds, lessonId],
    completedLessonIds: prev.completedLessonIds.includes(lessonId)
      ? prev.completedLessonIds
      : [...prev.completedLessonIds, lessonId],
  };
}

export function useUserProgress(options: { authUser: AuthUser | null }) {
  const { authUser } = options;

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mssid_user_profile');
    if (saved) {
      try {
        return normalizeUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }
    return createFreshGuestProfile('1AP');
  });

  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<BadgeInfo[]>([]);
  const [ratingPromptTrigger, setRatingPromptTrigger] = useState(0);

  useEffect(() => {
    // Dynamic import: badgeEngine.ts needs the full lesson catalog (to map completed-lesson ids
    // to subjects) — deferring it here keeps that ~4.6 MB out of the initial bundle. Badge
    // evaluation already only runs after progress actually changes, well after first paint, so
    // the extra fetch is invisible in practice.
    let cancelled = false;
    import('../utils/badgeEngine').then(({ applyBadgeEvaluation }) => {
      if (cancelled) return;
      const { profile: updated, newlyUnlocked } = applyBadgeEvaluation(userProfile, {
        isAuthenticated: Boolean(authUser),
      });
      if (newlyUnlocked.length > 0) {
        setUserProfile(updated);
        setNewlyUnlockedBadges((prev) => [...prev, ...newlyUnlocked]);
        AuthService.syncBadges(updated.badges, updated.badgeUnlockedAt);
        setRatingPromptTrigger((t) => t + 1);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userProfile.xp,
    userProfile.streakDays,
    userProfile.completedLessonIds.length,
    userProfile.completedExamIds.length,
    userProfile.completedChallengeIds.length,
    userProfile.completedGameIds.length,
    userProfile.completedLabIds.length,
    authUser,
  ]);

  useEffect(() => {
    // Trust the server's fields directly (?? only falls back to `prev` when the field is truly
    // absent from the API response, never when it's a genuine empty array/zero). Devices are often
    // shared between siblings in a family: falling back to `prev` on a merely-empty server value
    // used to let one child's local guest/leftover progress (exams, challenges, badges) bleed into
    // whichever real account next logs in on that same browser (revue externe #5).
    if (authUser) {
      const xp = authUser.score !== undefined ? authUser.score : (authUser.xp !== undefined ? authUser.xp : 0);
      const level = authUser.level !== undefined ? authUser.level : Math.floor(xp / 100) + 1;
      setUserProfile((prev) => ({
        ...prev,
        name: authUser.nom || prev.name,
        xp: xp,
        level: level,
        streakDays: authUser.streakDays ?? prev.streakDays,
        completedLessonIds: authUser.completedLessonIds || prev.completedLessonIds,
        completedExamIds: authUser.completedExamIds ?? prev.completedExamIds,
        completedChallengeIds: authUser.completedChallengeIds ?? prev.completedChallengeIds,
        badges: authUser.badges ?? prev.badges,
        badgeUnlockedAt: authUser.badgeUnlockedAt ?? prev.badgeUnlockedAt,
        quizScores: authUser.quizScores || prev.quizScores,
        tashkeelEnabled: authUser.tashkeelEnabled ?? prev.tashkeelEnabled,
        goldCoins: authUser.goldCoins ?? prev.goldCoins,
        avatarConfig: authUser.avatarConfig ?? prev.avatarConfig,
      }));
    }
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('mssid_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleQuizFullyValidated = (lessonId: string) => {
    AuthService.markLessonCompleted(lessonId);
    setUserProfile((prev) => markLessonQuizComplete(prev, lessonId));
    setRatingPromptTrigger((t) => t + 1);
  };

  const handleCompleteQuiz = (lessonId: string, earnedXp: number) => {
    AuthService.addScore(earnedXp);
    incrementDailyObjective();
    setUserProfile((prev) => applyLessonXp(prev, lessonId, earnedXp));
  };

  const handleCompleteExam = (examId: string) => {
    AuthService.addExamXp(examId, 50);
    incrementDailyObjective();

    setUserProfile((prev) => {
      if (prev.completedExamIds.includes(examId)) return prev;
      return {
        ...prev,
        xp: prev.xp + 50,
        level: Math.floor((prev.xp + 50) / 100) + 1,
        completedExamIds: [...prev.completedExamIds, examId],
      };
    });
  };

  const handleCompleteChallenge = (challengeId: string, earnedXp: number) => {
    if (!userProfile.completedChallengeIds.includes(challengeId)) {
      AuthService.addChallengeXp(challengeId, earnedXp);
      incrementDailyObjective();
    }
    setUserProfile((prev) => applyChallengeXp(prev, challengeId, earnedXp));
  };

  const handleCompleteGame = (gameId: string, earnedXp: number) => {
    setUserProfile((prev) => applyGameXp(prev, gameId, earnedXp));
  };

  const handleLabReward = (coins: number, xp: number) => {
    // DIDOU_STAGES[1] ("Écolier Brillant", level 4+) advertises a +10% gold bonus as an unlocked
    // perk — this is where it actually applies, on the one path that grants gold.
    const bonusCoins = applyDidouGoldBonus(coins, userProfile.level);
    const newCoins = (userProfile.goldCoins ?? 150) + bonusCoins;
    setUserProfile((prev) => ({
      ...prev,
      goldCoins: newCoins,
      xp: prev.xp + xp,
    }));
    if (authUser) AuthService.syncGoldCoinsAndAvatar(newCoins, userProfile.avatarConfig);
  };

  const handleVisitLab = useCallback((labId: string) => {
    setUserProfile((prev) => {
      const ids = prev.completedLabIds ?? [];
      if (ids.includes(labId)) return prev;
      return { ...prev, completedLabIds: [...ids, labId] };
    });
  }, []);

  const handleResetProgress = () => {
    if (window.confirm(locales[getStoredLocale()].strings.navigation.confirmResetProgress)) {
      setUserProfile({
        ...createFreshGuestProfile(userProfile.grade),
        name: userProfile.name,
        tashkeelEnabled: userProfile.tashkeelEnabled ?? false,
      });
      return true;
    }
    return false;
  };

  const handleUpdateProfileName = (newName: string) => {
    setUserProfile((prev) => {
      const updated = { ...prev, name: newName };
      localStorage.setItem('mssid_user_profile', JSON.stringify(updated));
      return updated;
    });

    if (authUser) {
      AuthService.setCurrentUser({ ...authUser, nom: newName });
      AuthService.updateProfileAsync(newName).catch(() => {});
    }
  };

  const handleUpdateProfileAvatar = (newAvatar: string) => {
    setUserProfile((prev) => {
      const updated = { ...prev, avatar: newAvatar };
      localStorage.setItem('mssid_user_profile', JSON.stringify(updated));
      return updated;
    });
    if (authUser) {
      AuthService.setCurrentUser({ ...authUser, avatar: newAvatar });
    }
  };

  const handleRefreshProfileFromDb = async () => {
    await AuthService.fetchProfileFromDbAsync();
  };

  const handleLogoutProgressReset = (currentGrade: PrimaryGrade) => {
    localStorage.removeItem('mssid_user_profile');
    setNewlyUnlockedBadges([]);
    setUserProfile(() => createFreshGuestProfile(currentGrade));
  };

  return {
    userProfile,
    setUserProfile,
    newlyUnlockedBadges,
    setNewlyUnlockedBadges,
    ratingPromptTrigger,
    handleQuizFullyValidated,
    handleCompleteQuiz,
    handleCompleteExam,
    handleCompleteChallenge,
    handleCompleteGame,
    handleVisitLab,
    handleLabReward,
    handleResetProgress,
    handleUpdateProfileName,
    handleUpdateProfileAvatar,
    handleRefreshProfileFromDb,
    handleLogoutProgressReset,
  };
}
