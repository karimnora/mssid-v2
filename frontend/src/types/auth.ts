import { DidouAvatarConfig } from './ecosystem';

export type UserRole = 'ROLE_FREE' | 'ROLE_PREMIUM' | 'ROLE_ADMIN';

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';

export type ReceiptStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';

export type PaymentMethod = 'BARIDIMOB' | 'EDAHABIA' | 'CCP_OFFICE';

export interface Subscription {
  id: number;
  userId: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  planName: string;
  planId?: string;
  durationMonths?: number;
  amountDzd: number;
}

export interface PaymentReceipt {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  receiptImageUrl: string;
  paymentMethod: PaymentMethod;
  amountDzd: number;
  planId?: string;
  durationMonths?: number;
  transactionRef: string;
  status: ReceiptStatus;
  submittedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface AuthUser {
  id: number;
  nom: string;
  email: string;
  role: UserRole;
  token?: string;
  subscription?: Subscription;
  score?: number;
  xp?: number;
  level?: number;
  quizzesCompleted?: number;
  streakDays?: number;
  grade?: string;
  /** Server: false when no grade was ever chosen (V2 first-steps screen). Undefined = unknown. */
  gradeSet?: boolean;
  /** Server: whether a parent e-mail is on file (the address itself is never sent back). */
  parentEmailSet?: boolean;
  wilaya?: string;
  completedLessonIds?: string[];
  completedExamIds?: string[];
  completedChallengeIds?: string[];
  badges?: string[];
  badgeUnlockedAt?: Record<string, string>;
  quizScores?: Record<string, number>;
  tashkeelEnabled?: boolean;
  createdAt?: string;
  avatar?: string;
  lastActiveDate?: string;
  emailVerified?: boolean;
  // "Didou Studio" cosmetic economy — deliberately separate from score/xp (see DidouDressingRoomModal
  // and AuthService.syncGoldCoinsAndAvatar). Not a second progression metric, just spendable currency.
  goldCoins?: number;
  avatarConfig?: DidouAvatarConfig;
  competenceStats?: Record<string, { attempts: number; successes: number; failures?: number; lastAt: string; lastLessonId: string; lastOutcome?: 'success' | 'fail'; alone?: number; helped?: number; missedExerciseIds?: string[] }>;
  lessonSessions?: Array<{ at: string; lessonId: string; competenceIds: string[]; outcome: 'success' | 'fail'; helped?: boolean; count?: number }>;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
}
