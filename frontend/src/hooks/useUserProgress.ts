import { useCallback, useEffect, useState } from 'react';
import { Badge as BadgeInfo, PrimaryGrade, UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { AuthService } from '../services/authService';
import { incrementDailyObjective } from '../utils/dailyObjective';
import { applyBadgeEvaluation } from '../utils/badgeEngine';
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
    const { profile: updated, newlyUnlocked } = applyBadgeEvaluation(userProfile);
    if (newlyUnlocked.length > 0) {
      setUserProfile(updated);
      setNewlyUnlockedBadges((prev) => [...prev, ...newlyUnlocked]);
      AuthService.syncBadges(updated.badges, updated.badgeUnlockedAt);
      setRatingPromptTrigger((t) => t + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userProfile.xp,
    userProfile.streakDays,
    userProfile.completedLessonIds.length,
    userProfile.completedExamIds.length,
    userProfile.completedChallengeIds.length,
    userProfile.completedGameIds.length,
    userProfile.completedLabIds.length,
  ]);

  useEffect(() => {
    if (authUser) {
      const xp = authUser.score !== undefined ? authUser.score : (authUser.xp !== undefined ? authUser.xp : 140);
      const level = authUser.level !== undefined ? authUser.level : Math.floor(xp / 100) + 1;
      setUserProfile((prev) => ({
        ...prev,
        name: authUser.nom || prev.name,
        xp: xp,
        level: level,
        streakDays: authUser.streakDays || prev.streakDays,
        completedLessonIds: authUser.completedLessonIds || prev.completedLessonIds,
        completedExamIds: authUser.completedExamIds && authUser.completedExamIds.length > 0 ? authUser.completedExamIds : prev.completedExamIds,
        completedChallengeIds: authUser.completedChallengeIds && authUser.completedChallengeIds.length > 0 ? authUser.completedChallengeIds : prev.completedChallengeIds,
        badges: authUser.badges && authUser.badges.length > 0 ? authUser.badges : prev.badges,
        badgeUnlockedAt: { ...authUser.badgeUnlockedAt, ...prev.badgeUnlockedAt },
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
    setUserProfile((prev) =>
      prev.quizFullyValidatedLessonIds.includes(lessonId)
        ? prev
        : { ...prev, quizFullyValidatedLessonIds: [...prev.quizFullyValidatedLessonIds, lessonId] }
    );
    setRatingPromptTrigger((t) => t + 1);
  };

  const handleCompleteQuiz = (lessonId: string, earnedXp: number) => {
    AuthService.addScore(earnedXp, lessonId);
    incrementDailyObjective();

    setUserProfile((prev) => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyCompleted ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId];
      const newXp = prev.xp + earnedXp;
      const newLevel = Math.floor(newXp / 100) + 1;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedLessonIds: newCompleted,
        quizScores: {
          ...prev.quizScores,
          [lessonId]: (prev.quizScores[lessonId] || 0) + earnedXp,
        },
      };
    });
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
    AuthService.addChallengeXp(challengeId, earnedXp);
    incrementDailyObjective();

    setUserProfile((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
      level: Math.floor((prev.xp + earnedXp) / 100) + 1,
      completedChallengeIds: prev.completedChallengeIds.includes(challengeId)
        ? prev.completedChallengeIds
        : [...prev.completedChallengeIds, challengeId],
    }));
  };

  const handleCompleteGame = (gameId: string, earnedXp: number) => {
    setUserProfile((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
      level: Math.floor((prev.xp + earnedXp) / 100) + 1,
      completedGameIds: (prev.completedGameIds ?? []).includes(gameId)
        ? (prev.completedGameIds ?? [])
        : [...(prev.completedGameIds ?? []), gameId],
    }));
  };

  const handleLabReward = (coins: number, xp: number) => {
    const newCoins = (userProfile.goldCoins || 150) + coins;
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
