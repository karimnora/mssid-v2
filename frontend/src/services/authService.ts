import { AuthUser, PaymentReceipt, PaymentMethod, UserRole, Subscription } from '../types/auth';
import { DidouAvatarConfig } from '../types/ecosystem';
import { springBootApi } from './springBootApi';

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

// Pre-defined demo accounts used for local/offline testing when the backend is unavailable
const DEMO_USERS: Record<string, AuthUser> = {
  'free@mssid.dz': {
    id: 101,
    nom: 'أحمد التلميذ',
    email: 'free@mssid.dz',
    role: 'ROLE_FREE',
    score: 140,
    xp: 140,
    level: 2,
    grade: '5AP',
    streakDays: 4,
    quizzesCompleted: 3,
    completedLessonIds: ['math-5ap-numbers'],
    badges: [],
    quizScores: {},
  },
  'premium@mssid.dz': {
    id: 102,
    nom: 'سارة المتفوقة',
    email: 'premium@mssid.dz',
    role: 'ROLE_PREMIUM',
    score: 850,
    xp: 850,
    level: 9,
    grade: '5AP',
    streakDays: 12,
    quizzesCompleted: 18,
    completedLessonIds: [],
    badges: ['b_math_star'],
    quizScores: {},
    subscription: {
      id: 1,
      userId: 102,
      status: 'ACTIVE',
      startDate: '2026-01-01',
      endDate: '2027-01-01',
      planName: 'اشتراك تفوق mssid dz السنوي',
      amountDzd: 1500,
    },
  },
  'admin@mssid.dz': {
    id: 103,
    nom: 'الأستاذ المدير',
    email: 'admin@mssid.dz',
    role: 'ROLE_ADMIN',
    score: 2500,
    xp: 2500,
    level: 26,
    grade: '5AP',
    streakDays: 30,
    quizzesCompleted: 50,
    completedLessonIds: [],
    badges: [],
    quizScores: {},
  },
};

// Default sample payment receipts
const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 1,
    userId: 101,
    userEmail: 'free@mssid.dz',
    userName: 'أحمد التلميذ',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    paymentMethod: 'BARIDIMOB',
    amountDzd: 1500,
    transactionRef: 'BM-2026-987456123',
    status: 'PENDING_VERIFICATION',
    submittedAt: '2026-08-05 10:30',
  },
  {
    id: 2,
    userId: 102,
    userEmail: 'premium@mssid.dz',
    userName: 'سارة المتفوقة',
    receiptImageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=600&q=80',
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
    currentUserState = user;
    springBootApi.setIdentityHeaders(user?.role, user?.email);
    notifyAuthListeners();
  }

  /** AuthContext subscribes here (via useSyncExternalStore) to react to login/logout/profile updates. */
  static subscribe(listener: AuthListener): () => void {
    authListeners.add(listener);
    return () => authListeners.delete(listener);
  }

  static login(email: string, pass: string): AuthUser {
    const normalized = email.trim().toLowerCase();
    const demoUser = DEMO_USERS[normalized];

    const user: AuthUser = demoUser
      ? { ...demoUser, token: `jwt.token.${Date.now()}` }
      : {
          // Create dynamic free user if not pre-made
          id: Math.floor(Math.random() * 9000) + 1000,
          nom: email.split('@')[0],
          email: email,
          role: 'ROLE_FREE',
          token: `jwt.token.${Date.now()}`,
        };

    this.setCurrentUser(user);
    return user;
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

    const u = response.data.user || {};
    const scoreVal = u.score !== undefined ? u.score : (response.data as any).score ?? 140;
    const levelVal = u.level !== undefined ? u.level : Math.floor(scoreVal / 100) + 1;

    const authUser: AuthUser = {
      id: u.id || Math.floor(Math.random() * 9000) + 1000,
      nom: response.data.nom || u.nom || email.split('@')[0],
      email: response.data.email || u.email || email,
      role: (response.data.roleName || response.data.role || u.role || 'ROLE_FREE') as UserRole,
      score: scoreVal,
      xp: scoreVal,
      level: levelVal,
      grade: u.grade || '5AP',
      streakDays: u.streakDays || 4,
      quizzesCompleted: u.quizzesCompleted || 3,
      completedLessonIds: u.completedLessonIds || ['math-5ap-numbers'],
      badges: u.badges || [],
      quizScores: u.quizScores || {},
      emailVerified: u.emailVerified ?? false,
      goldCoins: u.goldCoins ?? 150,
      avatarConfig: u.avatarConfig,
    };

    this.setCurrentUser(authUser);
    return { user: authUser };
  } catch (err: any) {
    return {
      user: null, 
      error: 'Erreur réseau lors de la tentative de connexion.' 
    };
  }
}

  static register(nom: string, email: string, pass: string): AuthUser {
    const user: AuthUser = {
      id: Math.floor(Math.random() * 9000) + 1000,
      nom: nom.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
      role: 'ROLE_FREE',
      score: 0,
      xp: 0,
      level: 1,
      grade: '5AP',
      streakDays: 1,
      quizzesCompleted: 0,
      completedLessonIds: [],
      token: `jwt.token.registered.${Date.now()}`,
    };

    this.setCurrentUser(user);
    return user;
  }

static async registerAsync(nom: string, email: string, pass: string, grade?: string): Promise<{ user: AuthUser | null; error?: string }> {
  try {
    const response = await springBootApi.register({ nom, email, password: pass, grade });

    if (response.error || !response.data) {
      return {
        user: null,
        error: response.error || 'Erreur lors de la création du compte.'
      };
    }

    const u = response.data.user || {};
    const authUser: AuthUser = {
      id: u.id || Math.floor(Math.random() * 9000) + 1000,
      nom: response.data.nom || u.nom || nom || email.split('@')[0],
      email: response.data.email || u.email || email,
      role: (response.data.roleName || response.data.role || u.role || 'ROLE_FREE') as UserRole,
      score: u.score ?? 0,
      xp: u.xp ?? 0,
      level: u.level ?? 1,
      grade: u.grade || grade || '5AP',
      streakDays: u.streakDays || 1,
      quizzesCompleted: u.quizzesCompleted || 0,
      completedLessonIds: u.completedLessonIds || [],
      badges: u.badges || [],
      quizScores: u.quizScores || {},
      emailVerified: u.emailVerified ?? false,
      goldCoins: u.goldCoins ?? 150,
      avatarConfig: u.avatarConfig,
    };

    this.setCurrentUser(authUser);
    return { user: authUser };
  } catch (err: any) {
    return { user: null, error: 'Impossible de contacter le serveur. Veuillez réessayer plus tard.' };
  }
}

  static switchDemoRole(role: UserRole): AuthUser {
    let email = 'free@mssid.dz';
    if (role === 'ROLE_PREMIUM') email = 'premium@mssid.dz';
    if (role === 'ROLE_ADMIN') email = 'admin@mssid.dz';

    const demoUser = DEMO_USERS[email];
    const user: AuthUser = demoUser
      ? { ...demoUser, token: `mssid_jwt_token_${Date.now()}` }
      : {
          id: 101,
          nom: role === 'ROLE_ADMIN' ? 'الأستاذ المدير' : role === 'ROLE_PREMIUM' ? 'سارة المتفوقة' : 'أحمد التلميذ',
          email: email,
          role: role,
          score: role === 'ROLE_ADMIN' ? 2500 : role === 'ROLE_PREMIUM' ? 850 : 140,
          xp: role === 'ROLE_ADMIN' ? 2500 : role === 'ROLE_PREMIUM' ? 850 : 140,
          level: role === 'ROLE_ADMIN' ? 26 : role === 'ROLE_PREMIUM' ? 9 : 2,
          token: `mssid_jwt_token_${Date.now()}`,
        };
    this.setCurrentUser(user);

    // Call backend API login so request is registered on backend. SEC-01: success is now judged by
    // the absence of an error (the JWT itself arrives as an HttpOnly cookie, not in res.data).
    springBootApi.login({ email, password: 'password123' }).then((res) => {
      if (res.data && !res.error) {
        const u = res.data.user || {};
        const scoreVal = u.score !== undefined ? u.score : user.score;
        const levelVal = Math.floor((scoreVal || 0) / 100) + 1;
        const backendUser: AuthUser = {
          ...user,
          id: u.id || user.id,
          nom: res.data.nom || u.nom || user.nom,
          role: (res.data.roleName || res.data.role || role) as UserRole,
          score: scoreVal,
          xp: scoreVal,
          level: levelVal,
        };
        this.setCurrentUser(backendUser);
      }
    }).catch(() => {});

    return user;
  }

  static addScore(points: number, lessonId?: string): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const currentScore = user.score !== undefined ? user.score : (user.xp || 0);
    const newScore = currentScore + points;
    const newLevel = Math.floor(newScore / 100) + 1;
    const currentQuizzes = user.quizzesCompleted || 0;
    const currentCompleted = user.completedLessonIds || [];
    const newCompleted = lessonId && !currentCompleted.includes(lessonId) ? [...currentCompleted, lessonId] : currentCompleted;

    const updatedUser: AuthUser = {
      ...user,
      score: newScore,
      xp: newScore,
      level: newLevel,
      quizzesCompleted: currentQuizzes + 1,
      completedLessonIds: newCompleted,
      streakDays: Math.max(user.streakDays || 1, 1),
      lastActiveDate: new Date().toISOString().slice(0, 10),
    };

    this.setCurrentUser(updatedUser);

    // Persist the earned XP/progress to the backend (best-effort, fire-and-forget —
    // addScore stays synchronous since callers don't await it).
    springBootApi.updateUserProgress({
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

    springBootApi.updateUserProgress({
      email: updatedUser.email,
      grade: newGrade,
    }).catch((err) => console.error('Erreur de synchronisation du niveau:', err));

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
    const newExams = isFirstCompletion ? [...currentExams, examId] : currentExams;

    const updatedUser: AuthUser = {
      ...user,
      score: newScore,
      xp: newScore,
      level: Math.floor(newScore / 100) + 1,
      completedExamIds: newExams,
      lastActiveDate: new Date().toISOString().slice(0, 10),
    };

    this.setCurrentUser(updatedUser);

    springBootApi.updateUserProgress({
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      score: updatedUser.score,
      xp: updatedUser.xp,
      level: updatedUser.level,
      lastActiveDate: updatedUser.lastActiveDate,
      completedExamIds: isFirstCompletion ? [examId] : undefined,
    }).catch((err) => console.error('Erreur de synchronisation examen:', err));

    return updatedUser;
  }

  /** Same pattern as addScore, but for the challenges arena. */
  static addChallengeXp(challengeId: string, points: number): AuthUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const currentScore = user.score !== undefined ? user.score : (user.xp || 0);
    const newScore = currentScore + points;
    const currentChallenges = user.completedChallengeIds || [];
    const isFirstCompletion = !currentChallenges.includes(challengeId);
    const newChallenges = isFirstCompletion ? [...currentChallenges, challengeId] : currentChallenges;

    const updatedUser: AuthUser = {
      ...user,
      score: newScore,
      xp: newScore,
      level: Math.floor(newScore / 100) + 1,
      completedChallengeIds: newChallenges,
      lastActiveDate: new Date().toISOString().slice(0, 10),
    };

    this.setCurrentUser(updatedUser);

    springBootApi.updateUserProgress({
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      score: updatedUser.score,
      xp: updatedUser.xp,
      level: updatedUser.level,
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

    springBootApi.updateUserProgress({
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

    springBootApi.updateUserProgress({
      email: updatedUser.email,
      nom: updatedUser.nom,
      name: updatedUser.nom,
      goldCoins,
      avatarConfig,
    }).catch((err) => console.error('Erreur de synchronisation des pièces/tenue Didou:', err));

    return updatedUser;
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
    await springBootApi.updateUserProgress({
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
    if (!currentUser || !currentUser.email) {
      return null;
    }

    try {
      const userEmail = currentUser.email;
      const res = await springBootApi.request<any>(`/v1/users/me?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'x-user-id': userEmail,
        },
      });
      if (res.data) {
        const rawScore = res.data.score !== undefined ? res.data.score : (res.data.xp !== undefined ? res.data.xp : currentUser.score || 0);
        const rawLevel = res.data.level !== undefined ? res.data.level : Math.floor(rawScore / 100) + 1;

        const updatedUser: AuthUser = {
          ...currentUser,
          id: res.data.id || currentUser.id,
          nom: res.data.nom || currentUser.nom,
          email: res.data.email || currentUser.email,
          role: (res.data.roleName || res.data.role || currentUser.role) as UserRole,
          score: rawScore,
          xp: rawScore,
          level: rawLevel,
          grade: res.data.grade || currentUser.grade || '5AP',
          streakDays: res.data.streakDays || currentUser.streakDays || 1,
          quizzesCompleted: res.data.quizzesCompleted || currentUser.quizzesCompleted || 0,
          completedLessonIds: res.data.completedLessonIds || currentUser.completedLessonIds || [],
          badges: res.data.badges && res.data.badges.length > 0 ? res.data.badges : currentUser.badges || [],
          badgeUnlockedAt: res.data.badgeUnlockedAt || currentUser.badgeUnlockedAt || {},
          completedExamIds: res.data.completedExamIds || currentUser.completedExamIds || [],
          completedChallengeIds: res.data.completedChallengeIds || currentUser.completedChallengeIds || [],
        };
        this.setCurrentUser(updatedUser);
        return updatedUser;
      }
    } catch {
      // Fallback
    }
    return currentUser;
  }

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
          streakDays: u.streakDays || 1,
          quizzesCompleted: u.quizzesCompleted || 0,
          createdAt: u.createdAt,
          emailVerified: u.emailVerified ?? false,
          goldCoins: u.goldCoins ?? 150,
          avatarConfig: u.avatarConfig,
        }));
      }
    } catch {
      // Fallback
    }
    return Object.values(DEMO_USERS);
  }

  /**
   * Real payment-receipts read (replaces the localStorage-mock getReceipts() for admin views).
   * The backend entity may expose the submitting user as a nested `user` relation rather than flat
   * `userEmail`/`userName` fields — map defensively so either shape works. Unlike getAllUsersAsync,
   * this deliberately does NOT fall back to demo/mock data on failure: showing an empty list is more
   * honest than showing stale fake receipts.
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

  static async updateUserRoleAsync(userId: number, newRole: UserRole): Promise<boolean> {
    try {
      const res = await springBootApi.updateUserRole(userId, newRole);
      if (res.data && res.data.success) {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.role = newRole;
          this.setCurrentUser(currentUser);
        }
        return true;
      }
    } catch {
      // Fallback locally
    }

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.role = newRole;
      this.setCurrentUser(currentUser);
      return true;
    }
    return false;
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
      await springBootApi.deleteAccount();
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
      localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(INITIAL_RECEIPTS));
      return INITIAL_RECEIPTS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_RECEIPTS;
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
