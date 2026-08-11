export type UserRole = 'ROLE_FREE' | 'ROLE_PREMIUM' | 'ROLE_TEACHER' | 'ROLE_ADMIN';

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
  completedLessonIds?: string[];
  badges?: string[];
  quizScores?: Record<string, number>;
  tashkeelEnabled?: boolean;
  createdAt?: string;
  avatar?: string;
  lastActiveDate?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
}
