import { AuthUser, UserRole } from '../types/auth';

const number = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? value : fallback;
const text = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const list = (value: unknown, fallback: string[] = []) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback;
function record<T extends string | number>(value: unknown, kind: 'string' | 'number', fallback: Record<string, T> = {}): Record<string, T> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => typeof entry === kind)) as Record<string, T>;
}

/** Same server-to-account contract for login, Google, registration, boot and refresh. */
export function mapAuthProfile(value: unknown, defaults: Partial<AuthUser> = {}): AuthUser {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const score = number(raw.score ?? raw.xp, defaults.score ?? defaults.xp ?? 0);
  return {
    id: number(raw.id, defaults.id ?? 0),
    nom: text(raw.nom ?? raw.name, defaults.nom ?? ''), email: text(raw.email, defaults.email ?? ''),
    role: text(raw.roleName ?? raw.role, defaults.role ?? 'ROLE_FREE') as UserRole,
    score, xp: score, level: number(raw.level, Math.floor(score / 100) + 1),
    grade: text(raw.grade, defaults.grade ?? '1AP'), wilaya: text(raw.wilaya, defaults.wilaya),
    avatar: text(raw.avatar, defaults.avatar),
    streakDays: number(raw.streakDays, defaults.streakDays ?? 0),
    quizzesCompleted: number(raw.quizzesCompleted, defaults.quizzesCompleted ?? 0),
    lastActiveDate: text(raw.lastActiveDate, defaults.lastActiveDate),
    completedLessonIds: list(raw.completedLessonIds, defaults.completedLessonIds),
    completedExamIds: list(raw.completedExamIds, defaults.completedExamIds),
    completedChallengeIds: list(raw.completedChallengeIds, defaults.completedChallengeIds),
    badges: list(raw.badges, defaults.badges),
    badgeUnlockedAt: record<string>(raw.badgeUnlockedAt, 'string', defaults.badgeUnlockedAt),
    quizScores: record<number>(raw.quizScores, 'number', defaults.quizScores),
    emailVerified: typeof raw.emailVerified === 'boolean' ? raw.emailVerified : defaults.emailVerified ?? false,
    goldCoins: number(raw.goldCoins, defaults.goldCoins ?? 150),
    avatarConfig: raw.avatarConfig && typeof raw.avatarConfig === 'object' && !Array.isArray(raw.avatarConfig)
      ? raw.avatarConfig as AuthUser['avatarConfig'] : defaults.avatarConfig,
    tashkeelEnabled: typeof raw.tashkeelEnabled === 'boolean' ? raw.tashkeelEnabled : defaults.tashkeelEnabled,
    createdAt: text(raw.createdAt, defaults.createdAt),
  };
}

export function mapAuthResponse(value: unknown, defaults: Partial<AuthUser> = {}): AuthUser {
  const response = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const user = response.user && typeof response.user === 'object' ? response.user as Record<string, unknown> : {};
  return mapAuthProfile({ ...response, ...user,
    nom: response.nom ?? user.nom, email: response.email ?? user.email,
    roleName: response.roleName ?? response.role ?? user.roleName ?? user.role,
  }, defaults);
}
