import { AuthUser, PaymentReceipt, PaymentMethod, UserRole, Subscription } from '../types/auth';
import { springBootApi } from './springBootApi';

const STORAGE_KEYS = {
  CURRENT_USER: 'mssid_auth_user',
  TOKEN: 'mssid_jwt_token',
  RECEIPTS: 'mssid_payment_receipts',
};

// Initial default demo accounts
const DEMO_USERS: Record<string, AuthUser> = {
  'free@mssid.dz': {
    id: 101,
    nom: 'أحمد التلميذ',
    email: 'free@mssid.dz',
    role: 'ROLE_FREE',
    token: 'jwt.token.free.user.simulated',
  },
  'premium@mssid.dz': {
    id: 102,
    nom: 'سارة المتفوقة',
    email: 'premium@mssid.dz',
    role: 'ROLE_PREMIUM',
    token: 'jwt.token.premium.user.simulated',
    subscription: {
      id: 501,
      userId: 102,
      status: 'ACTIVE',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      planName: 'الاشتراك السنوي الشامل 5AP',
      amountDzd: 1500,
    },
  },
  'admin@mssid.dz': {
    id: 103,
    nom: 'الأستاذ المدير',
    email: 'admin@mssid.dz',
    role: 'ROLE_ADMIN',
    token: 'jwt.token.admin.user.simulated',
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
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!saved) {
      return null;
    }
    try {
      const user: AuthUser = JSON.parse(saved);
      if (user && user.nom) {
        const cleanedNom = user.nom.replace(/\s*\((FREE|PREMIUM|ADMIN)\)/gi, '').trim();
        if (cleanedNom !== user.nom) {
          user.nom = cleanedNom;
          this.setCurrentUser(user);
        }
      }
      return user;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: AuthUser | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      if (user.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, user.token);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  }

  static login(email: string, pass: string): AuthUser {
    const normalized = email.trim().toLowerCase();
    let user = DEMO_USERS[normalized];

    if (!user) {
      // Create dynamic free user if not pre-made
      user = {
        id: Math.floor(Math.random() * 9000) + 1000,
        nom: email.split('@')[0],
        email: email,
        role: 'ROLE_FREE',
        token: `jwt.token.${Date.now()}`,
      };
    }

    this.setCurrentUser(user);
    return user;
  }

  static async loginAsync(email: string, pass: string): Promise<{ user: AuthUser; error?: string }> {
    try {
      const response = await springBootApi.login({ email, password: pass });
      if (response.data && response.data.token) {
        const u = response.data.user || {};
        const scoreVal = u.score !== undefined ? u.score : (response.data as any).score ?? 140;
        const levelVal = u.level !== undefined ? u.level : Math.floor(scoreVal / 100) + 1;

        const authUser: AuthUser = {
          id: u.id || Math.floor(Math.random() * 9000) + 1000,
          nom: response.data.nom || u.nom || email.split('@')[0],
          email: response.data.email || u.email || email,
          role: (response.data.roleName || response.data.role || u.role || 'ROLE_FREE') as UserRole,
          token: response.data.token,
          score: scoreVal,
          xp: scoreVal,
          level: levelVal,
          grade: u.grade || '5AP',
          streakDays: u.streakDays || 4,
          quizzesCompleted: u.quizzesCompleted || 3,
          completedLessonIds: u.completedLessonIds || ['math-5ap-numbers'],
        };
        this.setCurrentUser(authUser);
        return { user: authUser };
      } else if (response.error) {
        return { user: this.login(email, pass), error: response.error };
      }
    } catch {
      // Fallback
    }
    return { user: this.login(email, pass) };
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

  static async registerAsync(nom: string, email: string, pass: string): Promise<{ user: AuthUser; error?: string }> {
    try {
      const response = await springBootApi.register({ nom, email, password: pass });
      if (response.data && response.data.token) {
        const u = response.data.user || {};
        const authUser: AuthUser = {
          id: u.id || Math.floor(Math.random() * 9000) + 1000,
          nom: response.data.nom || u.nom || nom || email.split('@')[0],
          email: response.data.email || u.email || email,
          role: (response.data.roleName || response.data.role || u.role || 'ROLE_FREE') as UserRole,
          token: response.data.token,
          score: u.score ?? 0,
          xp: u.xp ?? 0,
          level: u.level ?? 1,
          grade: u.grade || '5AP',
          streakDays: u.streakDays || 1,
          quizzesCompleted: u.quizzesCompleted || 0,
          completedLessonIds: u.completedLessonIds || [],
        };
        this.setCurrentUser(authUser);
        return { user: authUser };
      } else if (response.error) {
        return { user: this.register(nom, email, pass), error: response.error };
      }
    } catch {
      // Fallback
    }
    return { user: this.register(nom, email, pass) };
  }

  static switchDemoRole(role: UserRole): AuthUser {
    let email = 'free@mssid.dz';
    if (role === 'ROLE_PREMIUM') email = 'premium@mssid.dz';
    if (role === 'ROLE_ADMIN') email = 'admin@mssid.dz';

    const user = DEMO_USERS[email] || {
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

    // Call backend API login so request is registered on backend
    springBootApi.login({ email, password: 'password123' }).then((res) => {
      if (res.data && res.data.token) {
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
          token: res.data.token,
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
    };

    this.setCurrentUser(updatedUser);

    // Sync score to Express backend asynchronously
    springBootApi.request('/v1/users/score', {
      method: 'POST',
      body: JSON.stringify({
        email: updatedUser.email,
        scoreDelta: points,
        totalScore: updatedUser.score,
        lessonId,
        quizzesCompleted: updatedUser.quizzesCompleted,
      }),
    }).then((res) => {
      if (res.data) {
        const d = res.data as any;
        const syncedUser: AuthUser = {
          ...updatedUser,
          score: d.score !== undefined ? d.score : updatedUser.score,
          xp: d.xp !== undefined ? d.xp : updatedUser.xp,
          level: d.level !== undefined ? d.level : updatedUser.level,
        };
        this.setCurrentUser(syncedUser);
      }
    }).catch(() => {});

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
    await springBootApi.request('/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify({
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
        completedLessonIds: updatedUser.completedLessonIds || [],
        badges: updatedUser.badges || [],
        quizScores: updatedUser.quizScores || {},
      }),
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
        }));
      }
    } catch {
      // Fallback
    }
    return Object.values(DEMO_USERS);
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
    springBootApi.clearToken();
    this.setCurrentUser(null);
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
}
