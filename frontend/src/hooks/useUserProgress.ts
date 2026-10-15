import {mergeNotebookProgress} from '../utils/mergeNotebookProgress';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge as BadgeInfo, PrimaryGrade, UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { AuthService } from '../services/authService';
import { incrementDailyObjective } from '../utils/dailyObjective';
import { applyDidouGoldBonus } from '../utils/didouCompanion';
import { isValidGrade } from '../navigation/appLocation';
import { getActiveProgressOwner, setActiveProgressOwner } from '../utils/progressOwner';
import {
  clearGuestQuizRewards,
  clearOwnerQuizRewards,
  migrateGuestQuizRewardsToUser,
} from '../utils/quizRewards';
import { clearGuestLastActivity, clearOwnerLastActivity, migrateGuestLastActivityToUser } from '../utils/lastActivity';
import { clearChildSelection, profileStorageKey } from '../utils/childProfileStorage';
import { recordLessonFailure, recordLessonSuccess } from '../utils/competenceProgress';

function finiteNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

function stringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === 'string') out[key] = entry;
  }
  return out;
}

function numberRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: Record<string, number> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    const n = finiteNumber(entry, Number.NaN);
    if (Number.isFinite(n)) out[key] = n;
  }
  return out;
}

/** Keep whatever fields are still typed correctly; never wipe a whole save over one bad property. */
function salvageUserProfile(raw: unknown, fallbackGrade: PrimaryGrade): UserProfile {
  const base = createFreshGuestProfile(fallbackGrade);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return base;
  const o = raw as Record<string, unknown>;
  const xp = Math.max(0, finiteNumber(o.xp, base.xp));
  const rawGrade = typeof o.grade === 'string' ? o.grade : null;
  const grade: PrimaryGrade = isValidGrade(rawGrade) ? rawGrade : fallbackGrade;
  return {
    ...base,
    name: typeof o.name === 'string' && o.name.trim() ? o.name : base.name,
    grade,
    avatar: typeof o.avatar === 'string' && o.avatar ? o.avatar : base.avatar,
    xp,
    goldCoins: o.goldCoins === undefined ? base.goldCoins : Math.max(0, finiteNumber(o.goldCoins, 0)),
    level: Math.max(1, finiteNumber(o.level, Math.floor(xp / 100) + 1)),
    streakDays: Math.max(0, finiteNumber(o.streakDays, base.streakDays)),
    lastActiveDate: typeof o.lastActiveDate === 'string' && o.lastActiveDate
      ? o.lastActiveDate
      : base.lastActiveDate,
    completedLessonIds: stringList(o.completedLessonIds),
    completedExamIds: stringList(o.completedExamIds),
    completedChallengeIds: stringList(o.completedChallengeIds),
    completedGameIds: stringList(o.completedGameIds),
    completedLabIds: stringList(o.completedLabIds),
    quizFullyValidatedLessonIds: stringList(o.quizFullyValidatedLessonIds),
    badges: stringList(o.badges),
    badgeUnlockedAt: stringRecord(o.badgeUnlockedAt),
    quizScores: numberRecord(o.quizScores),
    tashkeelEnabled: typeof o.tashkeelEnabled === 'boolean' ? o.tashkeelEnabled : base.tashkeelEnabled,
    dailyScreenTimeLimitMinutes: o.dailyScreenTimeLimitMinutes === undefined
      ? base.dailyScreenTimeLimitMinutes
      : finiteNumber(o.dailyScreenTimeLimitMinutes, 0),
    avatarConfig: o.avatarConfig && typeof o.avatarConfig === 'object' && !Array.isArray(o.avatarConfig)
      ? o.avatarConfig as UserProfile['avatarConfig']
      : base.avatarConfig,
    competenceStats: o.competenceStats && typeof o.competenceStats === 'object' && !Array.isArray(o.competenceStats) ? o.competenceStats as UserProfile['competenceStats'] : {},
    lessonSessions: Array.isArray(o.lessonSessions) ? o.lessonSessions as UserProfile['lessonSessions'] : [],
  };
}

/** Back-fills fields added after a profile was first saved to localStorage, and updates the daily streak. */
export function normalizeUserProfile(raw: UserProfile | unknown, fallbackGrade: PrimaryGrade = '1AP'): UserProfile {
  const profile = salvageUserProfile(raw, fallbackGrade);

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
    competenceStats: {},
    lessonSessions: [],
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
  const completed: UserProfile = {
    ...prev,
    quizFullyValidatedLessonIds: prev.quizFullyValidatedLessonIds.includes(lessonId)
      ? prev.quizFullyValidatedLessonIds
      : [...prev.quizFullyValidatedLessonIds, lessonId],
    completedLessonIds: prev.completedLessonIds.includes(lessonId)
      ? prev.completedLessonIds
      : [...prev.completedLessonIds, lessonId],
  };
  return recordLessonSuccess(completed, lessonId);
}

export function useUserProgress(options: { authUser: AuthUser | null; activeChildId?: number | null }) {
  const { authUser, activeChildId = null } = options;
  const hydratedOwnerRef = useRef<number | null>(null);
  const [localActivityOwner, setLocalActivityOwner] = useState<number | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(profileStorageKey(activeChildId));
    if (saved) {
      try {
        return normalizeUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse user profile:', e);
        try {
          window.localStorage.setItem('mssid_user_profile_backup', saved);
        } catch {
          // Ignore quota — a fresh guest profile is still preferable to a crash.
        }
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
    if (authUser && activeChildId == null) {
      const sameOwner = hydratedOwnerRef.current === authUser.id;
      hydratedOwnerRef.current = authUser.id;
      const xp = authUser.score !== undefined ? authUser.score : (authUser.xp !== undefined ? authUser.xp : 0);
      const level = authUser.level !== undefined ? authUser.level : Math.floor(xp / 100) + 1;
      let localActivities: Pick<UserProfile, 'completedGameIds' | 'completedLabIds'> = { completedGameIds: [], completedLabIds: [] };
      if (!sameOwner) {
        // Games/lab visits have no server fields. Restore only a cache explicitly belonging to
        // this authenticated account; the legacy unscoped guest save cannot establish ownership.
        try {
          const saved = JSON.parse(localStorage.getItem(`mssid_local_activities_v1_${authUser.id}`) ?? 'null');
          localActivities = { completedGameIds: stringList(saved?.completedGameIds), completedLabIds: stringList(saved?.completedLabIds) };
        } catch { /* Invalid local activity data must not block the server profile. */ }
      }
      setUserProfile((existing) => {
        const prev = sameOwner ? existing : { ...createFreshGuestProfile(isValidGrade(authUser.grade) ? authUser.grade : existing.grade), ...localActivities };
        return {
          ...prev,
          name: authUser.nom || prev.name,
          grade: isValidGrade(authUser.grade) ? authUser.grade : prev.grade,
          avatar: authUser.avatar || prev.avatar,
          xp,
          level,
          streakDays: authUser.streakDays ?? prev.streakDays,
          lastActiveDate: authUser.lastActiveDate || prev.lastActiveDate,
          completedLessonIds: authUser.completedLessonIds ?? prev.completedLessonIds,
          quizFullyValidatedLessonIds: authUser.completedLessonIds ?? prev.quizFullyValidatedLessonIds,
          completedExamIds: authUser.completedExamIds ?? prev.completedExamIds,
          completedChallengeIds: authUser.completedChallengeIds ?? prev.completedChallengeIds,
          badges: authUser.badges ?? prev.badges,
          badgeUnlockedAt: authUser.badgeUnlockedAt ?? prev.badgeUnlockedAt,
          quizScores: authUser.quizScores ?? prev.quizScores,
          tashkeelEnabled: authUser.tashkeelEnabled ?? prev.tashkeelEnabled,
          goldCoins: authUser.goldCoins ?? prev.goldCoins,
          avatarConfig: authUser.avatarConfig ?? prev.avatarConfig,
          competenceStats: authUser.competenceStats ?? prev.competenceStats,
          lessonSessions: authUser.lessonSessions ?? prev.lessonSessions,
        };
      });
      setLocalActivityOwner(authUser.id);
    } else {
      hydratedOwnerRef.current = null;
      setLocalActivityOwner(null);
    }
  }, [authUser, activeChildId]);

  const previousChildId = useRef(activeChildId);

  useEffect(() => {
    if (previousChildId.current === activeChildId) return;
    previousChildId.current = activeChildId;
    const key = profileStorageKey(activeChildId);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setUserProfile(normalizeUserProfile(JSON.parse(saved)));
        return;
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }
    setUserProfile(createFreshGuestProfile('1AP'));
  }, [activeChildId]);

  useEffect(() => {
    setActiveProgressOwner(authUser?.id, activeChildId);
    if (!authUser || activeChildId != null) return;
    migrateGuestQuizRewardsToUser(authUser.id);
    migrateGuestLastActivityToUser(authUser.id);
  }, [authUser?.id, activeChildId]);

  useEffect(() => {
    localStorage.setItem(profileStorageKey(activeChildId), JSON.stringify(userProfile));
  }, [userProfile, activeChildId]);

  useEffect(() => {
    if (!authUser || activeChildId != null || localActivityOwner !== authUser.id) return;
    try {
      localStorage.setItem(`mssid_local_activities_v1_${authUser.id}`, JSON.stringify({
        completedGameIds: userProfile.completedGameIds, completedLabIds: userProfile.completedLabIds,
      }));
    } catch { /* The current session remains usable when local storage is full. */ }
  }, [authUser?.id, activeChildId, localActivityOwner, userProfile.completedGameIds, userProfile.completedLabIds]);

  useEffect(() => {
    if (!authUser || activeChildId == null) return;
    let cancelled = false;
    import('../services/springBootApi').then(({ springBootApi }) =>
      springBootApi.getChildProgress(activeChildId).then((res) => {
        if (cancelled || res.error || !res.data) return;
        setUserProfile((prev) => ({
          ...prev,
          ...mergeNotebookProgress(prev,{competenceStats:res.data.competenceStats as UserProfile['competenceStats'],lessonSessions:res.data.lessonSessions as UserProfile['lessonSessions']}),
        }));
      }),
    );
    return () => {
      cancelled = true;
    };
  }, [authUser, activeChildId]);

  useEffect(() => {
    if (!authUser) return;
    const timer = window.setTimeout(() => {
      const payload = {
        competenceStats: userProfile.competenceStats ?? {},
        lessonSessions: userProfile.lessonSessions ?? [],
      };
      if (activeChildId != null) {
        void import('../services/springBootApi').then(({ springBootApi }) => {
          springBootApi.saveChildProgress(activeChildId, payload).catch(() => {});
        });
        return;
      }
      AuthService.syncCompetenceProgress(payload);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [authUser, activeChildId, userProfile.competenceStats, userProfile.lessonSessions]);

  const handleQuizFullyValidated = (lessonId: string) => {
    AuthService.markLessonCompleted(lessonId);
    setUserProfile((prev) => markLessonQuizComplete(prev, lessonId));
    setRatingPromptTrigger((t) => t + 1);
  };

  const handleQuizMiss = (lessonId: string, competenceId?: string) => {
    setUserProfile((prev) => recordLessonFailure(prev, lessonId, new Date().toISOString(), competenceId));
  };

  const handleCompleteQuiz = (lessonId: string, earnedXp: number) => {
    AuthService.addScore(earnedXp, lessonId);
    incrementDailyObjective();
    setUserProfile((prev) => applyLessonXp(prev, lessonId, earnedXp));
  };

  const handleCompleteExam = (examId: string) => {
    if (userProfile.completedExamIds.includes(examId)) return;
    if (activeChildId == null) {
      if (AuthService.getCurrentUser()?.completedExamIds?.includes(examId)) return;
      AuthService.addExamXp(examId, 50);
    }
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
    const accountReward = authUser && activeChildId == null ? AuthService.addLabReward(coins, xp) : null;
    setUserProfile((prev) => {
      const total = accountReward?.xp ?? prev.xp + Math.max(0, xp);
      return { ...prev,
        goldCoins: accountReward?.goldCoins ?? (prev.goldCoins ?? 150) + applyDidouGoldBonus(coins, prev.level),
        xp: total, level: Math.floor(total / 100) + 1,
      };
    });
  };

  const handleVisitLab = useCallback((labId: string) => {
    setUserProfile((prev) => {
      const ids = prev.completedLabIds ?? [];
      if (ids.includes(labId)) return prev;
      return { ...prev, completedLabIds: [...ids, labId] };
    });
  }, []);

  const handleResetProgress = () => {
    const owner = getActiveProgressOwner();
    clearOwnerQuizRewards(owner);
    clearOwnerLastActivity(owner);
    setUserProfile({
      ...createFreshGuestProfile(userProfile.grade),
      name: userProfile.name,
      tashkeelEnabled: userProfile.tashkeelEnabled ?? false,
    });
    return true;
  };

  const handleUpdateProfileName = (newName: string) => {
    setUserProfile((prev) => {
      const updated = { ...prev, name: newName };
      localStorage.setItem(profileStorageKey(activeChildId), JSON.stringify(updated));
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
      localStorage.setItem(profileStorageKey(activeChildId), JSON.stringify(updated));
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
    setActiveProgressOwner(null);
    clearGuestQuizRewards();
    clearGuestLastActivity();
    localStorage.removeItem(profileStorageKey(activeChildId));
    clearChildSelection();
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
    handleQuizMiss,
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
