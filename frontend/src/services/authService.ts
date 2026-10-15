import { mapAuthProfile, mapAuthResponse } from './authProfile';
import { queueProgressUpdate, setProgressSyncOwner, restorePendingProgress, retryPendingProgress, progressSync, clearPendingProgress } from './progressSync';
import { applyDidouGoldBonus } from '../utils/didouCompanion';
import { AuthUser, PaymentReceipt, PaymentMethod, UserRole, Subscription } from '../types/auth';
import { DidouAvatarConfig } from '../types/ecosystem';
import { springBootApi } from './springBootApi';
import { getActiveProgressOwner, setActiveProgressOwner } from '../utils/progressOwner';

const STORAGE_KEYS = {
  RECEIPTS: 'mssid_payment_receipts',
};

// SEC-05: the authenticated profile (name, email, xp, badges...) now lives in memory only — never
// localStorage. Session persistence across page reloads is the HttpOnly cookie's job (see SEC-01);
// AuthContext re-hydrates this singleton from GET /api/v1/users/me on every app boot. Same
// subscribe/notify shape as featureFlags.ts, so useSyncExternalStore can drive React re-renders.
let currentUserState: AuthUser | null = null;
type AuthListener = () => void;
const authListeners = new Set<AuthListener>();

function notifyAuthListeners() {
  authListeners.forEach((listener) => listener());
}

// Seed data for the local-only payment-receipts mock (getReceipts/submitReceipt/verifyReceipt
// below). That whole mock is dev/test fixture only — it backs the isDevBuild-gated "simulate
// admin approval" button in SubscriptionPaywall and the unit tests in authService.test.ts, never
// a real admin/prod flow (that's verifyReceiptAsync, backed by the actual API). Uses
// non-'@mssid.dz' emails so it can't be mistaken for a real or demo account.
const DEV_MOCK_RECEIPTS_SEED: PaymentReceipt[] = [
  {
    id: 1,
    userId: 101,
    userEmail: 'dev-free@example.test',
    userName: 'أحمد التلميذ',
    receiptImageUrl: '',
    paymentMethod: 'BARIDIMOB',
    amountDzd: 1500,
    transactionRef: 'BM-2026-987456123',
    status: 'PENDING_VERIFICATION',
    submittedAt: '2026-08-05 10:30',
  },
  {
    id: 2,
    userId: 102,
    userEmail: 'dev-premium@example.test',
    userName: 'سارة المتفوقة',
    receiptImageUrl: '',
    paymentMethod: 'EDAHABIA',
    amountDzd: 1500,
    transactionRef: 'ED-2026-456789123',
    status: 'APPROVED',
    submittedAt: '2026-08-01 14:15',
    verifiedAt: '2026-08-01 15:00',
  },
];

export class AuthService {
  static getCurrentUser(): AuthUser | null {
    return currentUserState;
  }

  static setCurrentUser(user: AuthUser | null): void {
    if (user && user.nom) {
      const cleanedNom = user.nom.replace(/\s*\((FREE|PREMIUM|ADMIN)\)/gi, '').trim();
      if (cleanedNom !== user.nom) {
        user = { ...user, nom: cleanedNom };
      }
    }
    const previousOwner=getActiveProgressOwner();
    const preserveChild=Boolean(user && currentUserState?.id===user.id && previousOwner.startsWith('user:'+user.id+':child:'));
    currentUserState = user;
    setProgressSyncOwner(user?.id ?? null);
    if(!preserveChild)setActiveProgressOwner(user?.id ?? null);
    notifyAuthListeners();
  }

  /** AuthContext subscribes here (via useSyncExternalStore) to react to login/logout/profile updates. */
  static subscribe(listener: AuthListener): () => void {
    authListeners.add(listener);
    return () => authListeners.delete(listener);
  }

  static hydrateCurrentUser(user: AuthUser): AuthUser {
    const restored = restorePendingProgress(user);
    this.setCurrentUser(restored);
    void retryPendingProgress();
    return restored;
  }

static async loginAsync(email: string, pass: string): Promise<{ user: AuthUser | null; error?: string }> {
  try {
    const response = await springBootApi.login({ email, password: pass });

    // SEC-01: the JWT now lives in an HttpOnly cookie set directly by the backend response headers —
    // it never appears in response.data anymore, so success can no longer be detected by the
    // presence of a `token` field. A 2xx with no `error` means the cookie was set.
    if (response.error || !response.data) {
      return {
        user: null,
        error: response.error || 'Identifiants invalides.'
      };
    }

    const authUser = mapAuthResponse(response.data, { nom: email.split('@')[0], email });

    this.hydrateCurrentUser(authUser);
    return { user: authUser };
  } catch (err: any) {
    return {
      user: null,
      error: 'Erreur réseau lors de la tentative de connexion.'
    };
  }
}

static async registerAsync(nom: string, email: string, pass: string, grade?: string, parentEmail?: string, wilaya?: string): Promise<{ user: AuthUser | null; error?: string }> {
  try {
    const response = await springBootApi.register({ nom, email, password: pass, grade, parentEmail, wilaya });

    if (response.error || !response.data) {
      return {
        user: null,
        error: response.error || 'Erreur lors de la création du compte.'
      };
    }

    const authUser = mapAuthResponse(response.data, { nom: nom || email.split('@')[0], email, grade, wilaya });

    this.hydrateCurrentUser(authUser);
    return { user: authUser };
  } catch (err: any) {
    return { user: null, error: 'Impossible de contacter le serveur. Veuillez réessayer plus tard.' };
  }
}

static async loginWithGoogleAsync(idToken: string): Promise<{ user: AuthUser | null; error?: string; profileIncomplete?: boolean }> {
  try {
    const response = await springBootApi.loginWithGoogle(idToken);

    if (response.error || !response.data) {
      return { user: null, error: response.error || 'Échec de la connexion avec Google.' };
    }

    const authUser = mapAuthResponse(response.data);

    this.hydrateCurrentUser(authUser);
    return { user: authUser, profileIncomplete: response.data.profileIncomplete === true };
  } catch (err: any) {
    return { user: null, error: 'Impossible de contacter le serveur. Veuillez réessayer plus tard.' };
  }
}

  /**
   * Day-based streak increment shared by every XP-granting action (addScore, addExamXp,
   * addChallengeXp): same day as last activity -> unchanged, exactly one day later -> +1,
   * any gap -> reset to 1. Mirrors normalizeUserProfile's logic for the local guest profile,
   * kept in sync so a streak doesn't silently stall depending on which activity (quiz vs
   * exam vs challenge) the student did that day.
   */
  private static computeStreak(user: AuthUser): { streakDays: number; lastActiveDate: string } {
    const today = new Date().toISOString().slice(0, 10);
    const lastActive = user.lastActiveDate ? user.lastActiveDate.slice(0, 10) : null;
    if (lastActive === today) return { streakDays: Math.max(user.streakDays || 1, 1), lastActiveDate: today };

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    return {
      streakDays: lastActive === yesterday ? (user.streakDays || 0) + 1 : 1,
      lastActiveDate: today,
    };
  }

  static addScore(points: number, lessonId?: string): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const currentScore = user.score !== undefined ? user.score : (user.xp || 0);
    const newScore = currentScore + points;
    const newLevel = Math.floor(newScore / 100) + 1;
    const currentQuizzes = user.quizzesCompleted || 0;
    const { streakDays, lastActiveDate } = this.computeStreak(user);

    const updatedUser: AuthUser = {
      ...user,
      score: newScore,
      xp: newScore,
      level: newLevel,
      quizzesCompleted: currentQuizzes + 1,
      quizScores: lessonId ? { ...user.quizScores, [lessonId]: (user.quizScores?.[lessonId] ?? 0) + points } : user.quizScores,
      streakDays,
      lastActiveDate,
    };

    this.setCurrentUser(updatedUser);

    // Persist the earned XP/progress to the backend (best-effort, fire-and-forget —
    // addScore stays synchronous since callers don't await it).
    queueProgressUpdate(updatedUser.id, {
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      grade: updatedUser.grade,
      avatar: updatedUser.avatar || '🎓',
      score: updatedUser.score,
      xp: updatedUser.xp,
      level: updatedUser.level,
      streakDays: updatedUser.streakDays,
      quizzesCompleted: updatedUser.quizzesCompleted,
      lastActiveDate: updatedUser.lastActiveDate,
      completedLessonIds: updatedUser.completedLessonIds,
      badges: updatedUser.badges || [],
      quizScores: updatedUser.quizScores || {},
    }).catch((err) => console.error('Erreur de synchronisation XP:', err));

    return updatedUser;
  }

  /** Marks a lesson complete after a full quiz (or a no-quiz finish). XP is awarded separately via addScore. */
  static markLessonCompleted(lessonId: string): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user || !lessonId) return user;

    const currentCompleted = user.completedLessonIds || [];
    if (currentCompleted.includes(lessonId)) return user;

    const updatedUser: AuthUser = {
      ...user,
      completedLessonIds: [...currentCompleted, lessonId],
      lastActiveDate: new Date().toISOString().slice(0, 10),
    };

    this.setCurrentUser(updatedUser);

    queueProgressUpdate(updatedUser.id, {
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      grade: updatedUser.grade,
      avatar: updatedUser.avatar || '🎓',
      score: updatedUser.score,
      xp: updatedUser.xp,
      level: updatedUser.level,
      streakDays: updatedUser.streakDays,
      quizzesCompleted: updatedUser.quizzesCompleted,
      lastActiveDate: updatedUser.lastActiveDate,
      completedLessonIds: updatedUser.completedLessonIds,
      badges: updatedUser.badges || [],
      quizScores: updatedUser.quizScores || {},
    }).catch((err) => console.error('Erreur de synchronisation leçon terminée:', err));

    return updatedUser;
  }

  /**
   * Persists the account's chosen grade level (picked at registration, or changed later via
   * Navbar's grade switcher) so it becomes the default on every future login/reload instead of
   * silently resetting — same fire-and-forget sync pattern as addScore. No-op for guests (no
   * account to persist to; App.tsx's local `grade` state already reflects the change either way).
   */
  static updateGrade(newGrade: string): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    if (user.grade === newGrade) return user;

    const updatedUser: AuthUser = { ...user, grade: newGrade };
    this.setCurrentUser(updatedUser);

    queueProgressUpdate(updatedUser.id, {
      email: updatedUser.email,
      grade: newGrade,
    }).catch((err) => console.error('Erreur de synchronisation du niveau:', err));

    return updatedUser;
  }

  /** Same pattern/rationale as updateGrade, for the wilaya (province) field — used by the settings
   * screen and by the post-Google-login "complete your profile" step. */
  static updateWilaya(newWilaya: string): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    if (user.wilaya === newWilaya) return user;

    const updatedUser: AuthUser = { ...user, wilaya: newWilaya };
    this.setCurrentUser(updatedUser);

    queueProgressUpdate(updatedUser.id, {
      email: updatedUser.email,
      wilaya: newWilaya,
    }).catch((err) => console.error('Erreur de synchronisation de la wilaya:', err));

    return updatedUser;
  }

  /**
   * SEC-08: soft email verification. Unlike addScore/updateGrade this is properly awaited (not
   * fire-and-forget) since the UI needs to show success/failure right away for the code the user
   * just typed in.
   */
  static async verifyEmailCode(code: string): Promise<{ success: boolean; message?: string }> {
    const res = await springBootApi.verifyEmail(code);
    if (res.error || !res.data?.emailVerified) {
      return { success: false, message: res.error || 'الرمز غير صحيح أو منتهي الصلاحية.' };
    }
    const user = this.getCurrentUser();
    if (user) this.setCurrentUser({ ...user, emailVerified: true });
    return { success: true, message: res.data.message };
  }

  static async resendVerificationCode(): Promise<{ success: boolean; message?: string }> {
    const res = await springBootApi.resendVerificationEmail();
    if (res.error) return { success: false, message: res.error };
    return { success: true, message: res.data?.message };
  }

  // SEC-09: always resolves with a message to display, regardless of whether the email is
  // registered — the backend deliberately answers identically either way (see forgotPassword there).
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
    const res = await springBootApi.forgotPassword(email);
    if (res.error) return { success: false, message: res.error };
    return { success: true, message: res.data?.message };
  }

  static async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    const res = await springBootApi.resetPassword(email, code, newPassword);
    if (res.error) return { success: false, message: res.error };
    return { success: true, message: res.data?.message };
  }

  /** Same pattern as addScore, but for the exam bank (ExamsViewer has no auto-grading — completion is self-reported). */
  static addExamXp(examId: string, points: number): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const currentScore = user.score !== undefined ? user.score : (user.xp || 0);
    const newScore = currentScore + points;
    const currentExams = user.completedExamIds || [];
    const isFirstCompletion = !currentExams.includes(examId);
    if (!examId || !isFirstCompletion) return user;
    const newExams = isFirstCompletion ? [...currentExams, examId] : currentExams;
    const { streakDays, lastActiveDate } = this.computeStreak(user);

    const updatedUser: AuthUser = {
      ...user,
      score: newScore,
      xp: newScore,
      level: Math.floor(newScore / 100) + 1,
      completedExamIds: newExams,
      streakDays,
      lastActiveDate,
    };

    this.setCurrentUser(updatedUser);

    queueProgressUpdate(updatedUser.id, {
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      score: updatedUser.score,
      xp: updatedUser.xp,
      level: updatedUser.level,
      streakDays: updatedUser.streakDays,
      lastActiveDate: updatedUser.lastActiveDate,
      completedExamIds: isFirstCompletion ? [examId] : undefined,
    }).catch((err) => console.error('Erreur de synchronisation examen:', err));

    return updatedUser;
  }

  /** Same pattern as addScore, but for the challenges arena. */
  static addChallengeXp(challengeId: string, points: number): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const currentChallenges = user.completedChallengeIds || [];
    const isFirstCompletion = !currentChallenges.includes(challengeId);
    if (!isFirstCompletion) return user;

    const currentScore = user.score !== undefined ? user.score : (user.xp || 0);
    const newScore = currentScore + points;
    const newChallenges = [...currentChallenges, challengeId];
    const { streakDays, lastActiveDate } = this.computeStreak(user);

    const updatedUser: AuthUser = {
      ...user,
      score: newScore,
      xp: newScore,
      level: Math.floor(newScore / 100) + 1,
      completedChallengeIds: newChallenges,
      streakDays,
      lastActiveDate,
    };

    this.setCurrentUser(updatedUser);

    queueProgressUpdate(updatedUser.id, {
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      score: updatedUser.score,
      xp: updatedUser.xp,
      level: updatedUser.level,
      streakDays: updatedUser.streakDays,
      lastActiveDate: updatedUser.lastActiveDate,
      completedChallengeIds: isFirstCompletion ? [challengeId] : undefined,
    }).catch((err) => console.error('Erreur de synchronisation défi:', err));

    return updatedUser;
  }

  /**
   * Pushes newly-unlocked badges to the backend (fire-and-forget) and keeps the local authUser copy
   * in sync. The backend union-merges by badge id and never overwrites an existing unlock timestamp,
   * so calling this repeatedly / out of order is always safe.
   */
  static syncBadges(badges: string[], badgeUnlockedAt: Record<string, string>): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const updatedUser: AuthUser = { ...user, badges, badgeUnlockedAt };
    this.setCurrentUser(updatedUser);

    queueProgressUpdate(updatedUser.id, {
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      badges,
      badgeUnlockedAt,
    }).catch((err) => console.error('Erreur de synchronisation des badges:', err));

    return updatedUser;
  }

  // "Didou Studio" cosmetic economy — deliberately its own sync call rather than piggybacking on
  // updateProfileAsync(nom, grade), so a gold-coin/outfit change never needs a name/grade in hand
  // (App.tsx's lab-reward handlers call this directly, mirroring syncBadges above).
  static syncGoldCoinsAndAvatar(goldCoins: number, avatarConfig?: DidouAvatarConfig): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const updatedUser: AuthUser = { ...user, goldCoins, avatarConfig };
    this.setCurrentUser(updatedUser);

    queueProgressUpdate(updatedUser.id, {
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      goldCoins,
      avatarConfig,
    }).catch((err) => console.error('Erreur de synchronisation des pièces/tenue Didou:', err));

    return updatedUser;
  }

  static addLabReward(coins: number, xp: number): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const currentXp = user.score ?? user.xp ?? 0;
    const total = currentXp + Math.max(0, xp);
    const updatedUser: AuthUser = { ...user, score: total, xp: total, level: Math.floor(total / 100) + 1,
      goldCoins: (user.goldCoins ?? 150) + applyDidouGoldBonus(coins, user.level ?? Math.floor(currentXp / 100) + 1),
      ...this.computeStreak(user),
    };
    this.setCurrentUser(updatedUser);
    void queueProgressUpdate(updatedUser.id, { score: total, xp: total, level: updatedUser.level,
      goldCoins: updatedUser.goldCoins, avatarConfig: updatedUser.avatarConfig,
      streakDays: updatedUser.streakDays, lastActiveDate: updatedUser.lastActiveDate,
    });
    return updatedUser;

  }

  static syncCompetenceProgress(payload: {
    competenceStats?: AuthUser['competenceStats'];
    lessonSessions?: AuthUser['lessonSessions'];
  }): void {
    const user = this.getCurrentUser();
    if (!user) return;
    if ((payload.competenceStats ?? user.competenceStats) === user.competenceStats
      && (payload.lessonSessions ?? user.lessonSessions) === user.lessonSessions) return;
    const updatedUser: AuthUser = {
      ...user,
      competenceStats: payload.competenceStats ?? user.competenceStats,
      lessonSessions: payload.lessonSessions ?? user.lessonSessions,
    };
    this.setCurrentUser(updatedUser);
    queueProgressUpdate(updatedUser.id, {
      competenceStats: updatedUser.competenceStats ?? {},
      lessonSessions: updatedUser.lessonSessions ?? [],
    }).catch((err) => console.error('Erreur de synchronisation du carnet:', err));
  }

static async updateProfileAsync(nom: string, grade?: string): Promise<AuthUser | null> {
  const user = this.getCurrentUser();
  if (!user) return null;

  const updatedUser: AuthUser = {
    ...user,
    nom: nom.trim(),
    grade: grade || user.grade,
  };

  this.setCurrentUser(updatedUser);

  try {
    await queueProgressUpdate(updatedUser.id, {
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      grade: updatedUser.grade,
      avatar: updatedUser.avatar || '🎓',
      score: updatedUser.score || updatedUser.xp || 0,
      xp: updatedUser.score || updatedUser.xp || 0,
      level: updatedUser.level || 1,
      streakDays: updatedUser.streakDays || 1,
      quizzesCompleted: updatedUser.quizzesCompleted || 0,
      lastActiveDate: updatedUser.lastActiveDate || new Date().toISOString().slice(0, 10),
      completedLessonIds: updatedUser.completedLessonIds || [],
      completedExamIds: updatedUser.completedExamIds || [],
      completedChallengeIds: updatedUser.completedChallengeIds || [],
      badges: updatedUser.badges || [],
      badgeUnlockedAt: updatedUser.badgeUnlockedAt || {},
      quizScores: updatedUser.quizScores || {},
    });
  } catch (err) {
    console.error("Erreur de synchronisation profile:", err);
  }

  return updatedUser;
}

  static async fetchProfileFromDbAsync(): Promise<AuthUser | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    await retryPendingProgress();
    const latest = this.getCurrentUser();
    if (!latest || latest.id !== currentUser.id) return latest;
    // Never replace local gains with an older server snapshot while saving is pending.
    if (progressSync.getSnapshot().status === 'pending') return latest;
    const res = await springBootApi.fetchCurrentUser();
    if (res.error || !res.data) throw new Error(res.error || 'Impossible de récupérer le profil.');
    if (this.getCurrentUser() !== latest) return this.getCurrentUser();
    const updated = restorePendingProgress(mapAuthProfile(res.data, latest));
    this.setCurrentUser(updated);
    return updated;
  }
  /**
   * Real user-list read for the admin console (UsersRolesModule.tsx). Deliberately does NOT fall
   * back to demo/mock accounts on failure — an admin seeing "أحمد التلميذ / سارة المتفوقة / الأستاذ
   * المدير" after a real backend error would have no way to tell they're fabricated, not real
   * students. Showing an empty list is more honest. Mirrors getAllReceiptsAsync below.
   */
  static async getAllUsersAsync(): Promise<AuthUser[]> {
    try {
      const res = await springBootApi.getUsersAll();
      if (res.data && Array.isArray(res.data)) {
        return res.data.map((u: any) => ({
          id: u.id,
          nom: u.nom || u.email?.split('@')[0] || 'مستخدم',
          email: u.email,
          role: u.role as UserRole,
          score: u.score ?? u.xp ?? 0,
          xp: u.xp ?? u.score ?? 0,
          level: u.level ?? Math.floor((u.score || 0) / 100) + 1,
          grade: u.grade || '5AP',
          wilaya: u.wilaya,
          streakDays: u.streakDays || 1,
          quizzesCompleted: u.quizzesCompleted || 0,
          createdAt: u.createdAt,
          emailVerified: u.emailVerified ?? false,
          goldCoins: u.goldCoins ?? 150,
          avatarConfig: u.avatarConfig,
        }));
      }
    } catch (e) {
      console.error('Erreur de chargement des utilisateurs:', e);
    }
    return [];
  }

  /**
   * Real payment-receipts read (replaces the localStorage-mock getReceipts() for admin views).
   * The backend entity may expose the submitting user as a nested `user` relation rather than flat
   * `userEmail`/`userName` fields — map defensively so either shape works. Same honest-on-failure
   * contract as getAllUsersAsync above: no fallback to demo/mock data.
   */
  static async getAllReceiptsAsync(): Promise<PaymentReceipt[]> {
    try {
      const res = await springBootApi.getAllReceipts();
      if (res.data && Array.isArray(res.data)) {
        return res.data.map((r: any) => ({
          id: r.id,
          userId: r.userId ?? r.user?.id,
          userEmail: r.userEmail ?? r.user?.email ?? '',
          userName: r.userName ?? r.user?.nom ?? r.user?.name ?? '',
          receiptImageUrl: r.receiptImageUrl ?? r.imageUrl ?? '',
          paymentMethod: r.paymentMethod,
          amountDzd: r.amountDzd,
          planId: r.planId,
          durationMonths: r.durationMonths,
          transactionRef: r.transactionRef,
          status: r.status,
          submittedAt: r.submittedAt ?? r.createdAt ?? '',
          verifiedAt: r.verifiedAt,
          rejectionReason: r.rejectionReason,
        }));
      }
    } catch (e) {
      console.error('Erreur de chargement des reçus:', e);
    }
    return [];
  }

  /**
   * The real, backend-authoritative role-change call for the admin console. Previously this fell
   * back to an unconditional local-only write whenever the edited row was the admin's own account
   * (network error, or a non-throwing-but-unsuccessful response) — an admin editing their own role
   * could be shown "success" for a change the server never actually persisted. Mirrors
   * verifyReceiptAsync above: never assumes success, only reports it once the backend confirms.
   */
  static async updateUserRoleAsync(userId: number, newRole: UserRole): Promise<{ success: boolean; message?: string }> {
    const res = await springBootApi.updateUserRole(userId, newRole);
    if (res.error) {
      return { success: false, message: res.error };
    }
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.role = newRole;
      this.setCurrentUser(currentUser);
    }
    return { success: true };
  }

  static logout(): void {
    // Fire-and-forget: clearing the HttpOnly cookie needs a round-trip to the server, but callers
    // of logout() expect an immediate, synchronous local sign-out.
    springBootApi.logout().catch(() => {});
    this.setCurrentUser(null);
  }

  /**
   * Permanent account deletion. Unlike logout(), this genuinely must succeed server-side before the
   * local session is torn down — silently discarding a failed delete would leave the account intact
   * on the server while the UI acts as if it were gone.
   */
  static async deleteAccountAsync(): Promise<{ success: boolean; error?: string }> {
    try {
      const user = this.getCurrentUser();
      await springBootApi.deleteAccount();
      if (user) {
        clearPendingProgress(user.id);
        try { localStorage.removeItem(`mssid_local_activities_v1_${user.id}`); } catch { /* unavailable storage */ }
      }
      if (this.getCurrentUser()?.id !== user?.id) return { success: false, error: 'La session a changé. Veuillez réessayer.' };
      this.setCurrentUser(null);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'تعذر حذف الحساب' };
    }
  }

  // Payment Receipts API Simulation
  static getReceipts(): PaymentReceipt[] {
    const saved = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(DEV_MOCK_RECEIPTS_SEED));
      return DEV_MOCK_RECEIPTS_SEED;
    }
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : DEV_MOCK_RECEIPTS_SEED;
    } catch {
      return DEV_MOCK_RECEIPTS_SEED;
    }
  }

  static submitReceipt(
    userId: number,
    userName: string,
    userEmail: string,
    paymentMethod: PaymentMethod,
    amountDzd: number,
    transactionRef: string,
    receiptImageUrl: string
  ): PaymentReceipt {
    const receipts = this.getReceipts();
    const newReceipt: PaymentReceipt = {
      id: Date.now(),
      userId,
      userName,
      userEmail,
      paymentMethod,
      amountDzd,
      transactionRef: transactionRef || `REF-${Math.floor(Math.random() * 899999) + 100000}`,
      receiptImageUrl,
      status: 'PENDING_VERIFICATION',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const updated = [newReceipt, ...receipts];
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(updated));

    // Async sync to backend Express / Spring Boot
    springBootApi.submitReceipt({
      paymentMethod,
      amountDzd,
      transactionRef: newReceipt.transactionRef,
      receiptImageUrl,
    }).catch(() => {});

    return newReceipt;
  }

  /**
   * The real submission path — awaits the backend's actual response instead of writing an optimistic
   * local copy and firing the real call without checking it (same class of bug as the old
   * verifyReceipt, fixed in Phase 36 for admin approval; this is the equivalent fix for submission).
   * The backend now validates amountDzd against the real subscription price server-side
   * (PaymentServiceImpl.submitReceipt) — a mismatch surfaces here as a real error, not a silently
   * swallowed one.
   */
  static async submitReceiptAsync(payload: {
    paymentMethod: PaymentMethod;
    amountDzd: number;
    planId?: string;
    transactionRef: string;
    receiptImageUrl: string;
  }): Promise<{ success: boolean; receipt?: PaymentReceipt; message?: string }> {
    const res = await springBootApi.submitReceipt(payload);
    if (res.error || !res.data) {
      return { success: false, message: res.error || 'تعذر إرسال الوصل. حاول مرة أخرى.' };
    }

    const currentUser = this.getCurrentUser();
    const receipt: PaymentReceipt = {
      id: res.data.id,
      userId: currentUser?.id || 0,
      userName: currentUser?.nom || '',
      userEmail: currentUser?.email || '',
      paymentMethod: payload.paymentMethod,
      amountDzd: res.data.amountDzd,
      planId: res.data.planId,
      durationMonths: res.data.durationMonths,
      transactionRef: res.data.transactionRef,
      receiptImageUrl: payload.receiptImageUrl,
      status: (res.data.status as PaymentReceipt['status']) || 'PENDING_VERIFICATION',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    return { success: true, receipt };
  }

  /**
   * Local-only mock, entirely disconnected from the real backend receipts table (fires a
   * fire-and-forget sync as a courtesy, but never awaits/checks it). Used ONLY by
   * SubscriptionPaywall.tsx's dev-build-gated "simulate admin approval" testing shortcut, which
   * itself submits via the equally local-only submitReceipt() above — never the real admin flow.
   * The real admin console (UsersRolesModule.tsx) must use verifyReceiptAsync below instead: an
   * admin approving/rejecting a REAL user's payment needs to know for certain whether the backend
   * actually recorded it, not just that a local copy was optimistically updated.
   */
  static verifyReceipt(receiptId: number, approve: boolean, rejectionReason?: string): PaymentReceipt | null {
    const receipts = this.getReceipts();
    const idx = receipts.findIndex((r) => r.id === receiptId);
    if (idx === -1) return null;

    const target = receipts[idx];
    target.status = approve ? 'APPROVED' : 'REJECTED';
    target.verifiedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    if (!approve && rejectionReason) {
      target.rejectionReason = rejectionReason;
    }

    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));

    // Async sync to backend
    springBootApi.verifyReceipt(receiptId, approve, rejectionReason).catch(() => {});

    // If approved, upgrade current user if it matches, or update user state
    if (approve) {
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === target.userId) {
        const upgraded: AuthUser = {
          ...currentUser,
          role: 'ROLE_PREMIUM',
          subscription: {
            id: Date.now(),
            userId: currentUser.id,
            status: 'ACTIVE',
            startDate: new Date().toISOString().substring(0, 10),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
            planName: 'اشتراك تفوق mssid dz السنوي',
            amountDzd: target.amountDzd,
          },
        };
        this.setCurrentUser(upgraded);
      }
    }

    return target;
  }

  /**
   * The real, backend-authoritative approve/reject call for the admin console. Unlike verifyReceipt
   * above, this never assumes success — it awaits the actual PUT and reports exactly what happened,
   * so an admin can't be shown "approved" for a payment the server never actually recorded (the bug
   * that motivated this method: a fire-and-forget call swallowing a network failure meant a real
   * paying user could stay stuck on FREE with nobody noticing).
   */
  static async verifyReceiptAsync(receiptId: number, approve: boolean, rejectionReason?: string): Promise<{ success: boolean; message?: string }> {
    const res = await springBootApi.verifyReceipt(receiptId, approve, rejectionReason);
    if (res.error) {
      return { success: false, message: res.error };
    }
    return { success: true };
  }
}
