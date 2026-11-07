import type { VillageSummaryEntry } from '../utils/villageSession';
import { canUseWebCheckout } from '../utils/paymentPlatform';
/**
 * Service API Client Spring Boot 3.x - Mssid DZ
 * Connecteur universel prêt à l'emploi pour le backend Java Spring Boot (JWT & REST)
 */

const CONFIGURED_SPRING_BOOT_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SPRING_BOOT_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SPRING_BOOT_URL) ||
  '';

export const SPRING_BOOT_BASE_URL = CONFIGURED_SPRING_BOOT_URL || 'http://localhost:8080/api'; // Cible le port Spring Boot par défaut

// 'localhost' depuis un appareil mobile (émulateur ou téléphone réel) désigne l'appareil
// lui-même, jamais le serveur : si aucune URL explicite n'a été fournie ET que la page n'est
// pas elle-même servie depuis localhost, on avertit tôt plutôt que de laisser échouer
// silencieusement chaque appel réseau (login, register, sync XP/badges...).
if (
  !CONFIGURED_SPRING_BOOT_URL &&
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
) {
  console.warn(
    "[mssid dz] VITE_SPRING_BOOT_URL n'est pas définie : l'application utilise 'http://localhost:8080/api' par défaut, " +
    "ce qui ne fonctionnera pas sur un appareil mobile, un émulateur ou un domaine de production. " +
    "Définissez VITE_SPRING_BOOT_URL (voir frontend/.env.example) avant de builder l'application."
  );
}

import { UserRole } from '../types/auth';
import { getStoredLocale } from '../localePreference';
import { meta as messagesAr } from '../locales/ar/meta';
import { meta as messagesFr } from '../locales/fr/meta';

function networkMessage(key: 'networkOffline' | 'networkTimeout' | 'networkUnavailable' | 'networkWriteUncertain') {
  return (getStoredLocale() === 'fr' ? messagesFr : messagesAr)[key];
}

export interface CahierAccess {
  premium: boolean;
  limit: number;
  remaining: number;
  resetsAt: string;
  unlockedIds: string[];
  allowed: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface InfraQuotaMeter {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
}

export interface InfraProviderQuota {
  provider: string;
  status: 'ok' | 'not_configured' | 'error' | string;
  error?: string;
  dashboardUrl?: string;
  note?: string;
  meters: InfraQuotaMeter[];
}

export interface InfraQuotasResponse {
  fetchedAt: string;
  resend: InfraProviderQuota;
  neon: InfraProviderQuota;
  render: InfraProviderQuota;
}

export interface SpringBootAuthResponse {
  // SEC-01: the backend no longer puts the JWT in the response body — it arrives as an HttpOnly
  // cookie instead (see AuthController.java). Kept optional only for older/non-browser callers.
  token?: string;
  email?: string;
  nom?: string;
  roleName?: string;
  role?: UserRole;
  user?: any;
  // Only ever true from /v1/auth/google, for a brand-new account it just created — see
  // AuthResponse.java for why this is the only reliable "grade/wilaya are genuinely unset" signal.
  profileIncomplete?: boolean;
}

// Endpoints that must never trigger a silent refresh-and-retry: retrying auth itself would either
// loop (refresh calling refresh) or make no sense (a failed login isn't fixed by refreshing).
const AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH = ['/v1/auth/login', '/v1/auth/register', '/v1/auth/logout', '/v1/auth/refresh'];

// Not a session, not a token — just "has this browser ever completed a login on this app before".
// The HttpOnly auth cookie itself stays fully invisible to JS (SEC-01); this is only a heuristic to
// skip the refresh+logout round trip on the very first /users/me 401 for a browser that has never
// authenticated (a guest visiting for the first time never needed either call — remonte utilisateur
// + PageSpeed : ~1.8s of the critical path was this cascade running for every guest, every visit).
// Self-heals both ways: set on any confirmed-authenticated response, cleared once a refresh attempt
// genuinely fails, so a stale 'true' left over from an expired/cleared session costs at most one
// wasted round trip before correcting itself.
const HAD_SESSION_KEY = 'mssid_had_session';
function hadSessionBefore(): boolean {
  return typeof window !== 'undefined' && window.localStorage.getItem(HAD_SESSION_KEY) === 'true';
}
function markHadSession(): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(HAD_SESSION_KEY, 'true');
}
function clearHadSession(): void {
  if (typeof window !== 'undefined') window.localStorage.removeItem(HAD_SESSION_KEY);
}

class SpringBootApiService {
  private requestTimeoutMs = 15000;

  // SEC-06: dedupes concurrent refresh attempts — if several API calls 401 around the same moment
  // (e.g. a screen firing 3 parallel fetches right as the access token expires), they all await the
  // same in-flight refresh instead of each rotating the single-use refresh token and invalidating
  // each other's attempt.
  private refreshPromise: Promise<boolean> | null = null;

  // SEC-10: identity for AI quota is the HttpOnly JWT cookie (server loads User + role).
  // Do not send x-user-role / x-user-id — those headers are client-spoofable and ignored by Spring.

  // SEC-01: the backend now issues the JWT as an HttpOnly cookie (see AuthController.java) — it never
  // reaches JS, so there is nothing left to read/store/attach here. Every request must send
  // `credentials: 'include'` so the browser attaches that cookie automatically; logging out means
  // asking the server to clear it, not deleting a localStorage entry.
  public async logout(): Promise<void> {
    clearHadSession();
    await this.request('/v1/auth/logout', { method: 'POST' }).catch(() => {});
  }

  /** Permanent account deletion — see UserService.deleteAccount for what gets cleaned up server-side. */
  public async deleteAccount(): Promise<void> {
    const result = await this.request('/v1/users/me', { method: 'DELETE' });
    if (result.error || (result.status !== undefined && result.status >= 400)) {
      throw new Error(result.error || 'Impossible de supprimer le compte. Veuillez réessayer.');
    }
  }

  // SEC-08: soft email verification — never blocks app usage, just a discreet reminder + the code
  // entry it drives. Both require the auth cookie (request() already sends credentials: 'include').
  public async verifyEmail(code: string) {
    return this.request<{ emailVerified: boolean; message: string }>('/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  public async resendVerificationEmail() {
    return this.request<{ message: string; cooldownSeconds?: number }>('/v1/auth/resend-verification', {
      method: 'POST',
    });
  }

  // SEC-09: "mot de passe oublié" — unauthenticated by necessity (no cookie exists yet). The backend
  // always answers 200 with the same generic message whether or not the email is registered, to
  // avoid leaking account existence — the frontend must not try to distinguish those cases either.
  public async forgotPassword(email: string) {
    return this.request<{ message: string }>('/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  public async resetPassword(email: string, code: string, newPassword: string) {
    return this.request<{ message: string }>('/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    });
  }

  // SEC-06: exchanges the HttpOnly refresh cookie for a fresh access-token cookie (see
  // AuthController.refresh). Deliberately bypasses `request()` — going through it would re-enter this
  // same 401-handling branch and could recurse. Dedupes concurrent callers onto one in-flight call
  // since the refresh token is single-use: two parallel refreshes would have the second one rotate a
  // token the first already consumed.
  private async tryRefresh(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;

    const baseUrl = SPRING_BOOT_BASE_URL.endsWith('/') ? SPRING_BOOT_BASE_URL.slice(0, -1) : SPRING_BOOT_BASE_URL;

    this.refreshPromise = fetch(`${baseUrl}/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: this.getHeaders(),
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  // Générer les en-têtes HTTP sécurisés
  private getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    return headers;
  }

 // Requête générique HTTP
public async request<T>(
  endpoint: string,
  options: RequestInit = {},
  _isRetryAfterRefresh = false,
  _isRetryAfterColdStart = false
): Promise<{ data?: T; error?: string; status: number; headers?: Headers }> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const mayRetryNetwork = ['GET', 'HEAD'].includes((options.method || 'GET').toUpperCase());
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { error: networkMessage('networkOffline'), status: 0 };
  }
  const baseUrl = SPRING_BOOT_BASE_URL.endsWith('/') 
    ? SPRING_BOOT_BASE_URL.slice(0, -1) 
    : SPRING_BOOT_BASE_URL;

  const url = `${baseUrl}${normalizedEndpoint}`;

  // Sur un réseau mobile instable ou un serveur injoignable, fetch() peut rester en
  // attente plusieurs minutes sans jamais rejeter : on borne chaque appel pour que
  // l'utilisateur voie un message d'erreur au lieu d'un écran de chargement infini.
  // The one retry after a timeout gets a longer budget than the first attempt: by the time we've
  // timed out once, we have real reason to suspect a Render cold start in progress (container boot
  // can take up to ~30-50s) rather than a genuinely hung connection, and the first attempt's wait
  // already gave the container that much of a head start.
  // Writes get one longer attempt, never an automatic replay: the server may have
  // committed a mutation even when its response was lost.
  const timeoutMs = _isRetryAfterColdStart || !mayRetryNetwork ? Math.max(this.requestTimeoutMs, 40000) : this.requestTimeoutMs;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders((options.headers as Record<string, string>) || {}),
      credentials: 'include', // SEC-01: send the HttpOnly auth cookie on every request
      signal: controller.signal,
    });

    const status = response.status;

    if (status === 401) {
      // SEC-06: the access token cookie is only good for 24h — a 401 here usually just means it
      // expired, not that the session is truly over. Try a silent refresh-and-retry once before
      // giving up; only fall back to logging out if the refresh itself fails (revoked/expired
      // refresh token, or no session at all). Skipped entirely for a browser that has never
      // authenticated — see HAD_SESSION_KEY above.
      const canAttemptRefresh = !_isRetryAfterRefresh && !AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH.includes(normalizedEndpoint) && hadSessionBefore();
      if (canAttemptRefresh && (await this.tryRefresh())) {
        return this.request<T>(endpoint, options, true);
      }

      // Best-effort: ask the server to drop the (presumably expired/invalid) auth cookie — pointless
      // for a browser that never had one, so skip the request entirely in that case. logout() itself
      // clears HAD_SESSION_KEY, so this also self-heals a stale 'true' left over from a session that
      // really is gone (expired/cleared cookie) after this one wasted round trip.
      // Fire-and-forget — a stuck logout call must never block surfacing this 401 to the caller.
      if (hadSessionBefore()) {
        this.logout().catch(() => {});
      }
      // On extrait le message JSON du backend si présent, sinon fallback
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || errorData.error || 'Email ou mot de passe incorrect.',
        status
      };
    }

    if (status === 404) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        error: errorData.message || errorData.error || 'Utilisateur inexistant sur le serveur.', 
        status 
      };
    }

    if (status === 429) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || 'Quota quotidien de requêtes dépassé. Veuillez réessayer demain.',
        status,
      };
    }

    const contentType = response.headers.get('content-type');
    let data: T | undefined;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      return {
        error: (data as any)?.message || (data as any)?.error || `Erreur serveur (${status})`,
        status,
      };
    }

    return { data, status, headers: response.headers };
  } catch (err: any) {
    // Cleared here (not just in `finally`) because the AbortError and network-failure branches
    // below can `await` a multi-second retry wait before returning — leaving this attempt's own
    // guard timer armed for that entire wait was harmless in production (nothing listens to an
    // abort on an already-settled fetch) but left dangling fake timers across tests that await a
    // retry wait, which is exactly what made two of the tests below flaky.
    clearTimeout(timeoutId);
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return { error: networkMessage('networkOffline'), status: 0 };
    }
    if (!mayRetryNetwork) {
      return { error: networkMessage('networkWriteUncertain'), status: 0 };
    }
    if (err?.name === 'AbortError') {
      if (!_isRetryAfterColdStart) {
        console.warn(`[mssid dz] Timeout (${timeoutMs}ms) sur ${url}, nouvelle tentative avec un délai plus long (cold start possible)`);
        return this.request<T>(endpoint, options, _isRetryAfterRefresh, true);
      }
      console.warn(`[mssid dz] Délai d'attente dépassé (${timeoutMs}ms) pour ${url}`);
      return {
        error: networkMessage('networkTimeout'),
        status: 0,
      };
    }
    // A free-tier host (Render) that's been idle 15+ min can refuse/drop the very first request
    // while its container spins back up (~30-50s) — the exact failure a real visitor could hit, not
    // just a genuinely unreachable server. Unlike the AbortError/timeout branch above (which already
    // burns 15s of real wall-clock time just waiting on the hung first attempt), a connection-refused
    // failure here returns almost instantly — a short wait before retrying used to fire the retry at
    // ~5s, still deep inside the 30-50s boot window, so it just failed again and gave up (remonte
    // utilisateur + testeurs : echecs de connexion/inscription repetes). Wait long enough for the
    // container to actually finish booting before trying again.
    if (!_isRetryAfterColdStart) {
      console.warn(`[mssid dz] Échec réseau sur ${url}, nouvelle tentative dans 20s (possible cold start)`, err.message);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      return this.request<T>(endpoint, options, _isRetryAfterRefresh, true);
    }

    console.warn('Erreur de connexion au serveur mssid dz:', err.message);
    return {
      error: networkMessage('networkUnavailable'),
      status: 0,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

  // --- Endpoints d'Authentification ---

  // SEC-05: cookie-authenticated identity fetch — AuthContext calls this once on app boot to
  // hydrate the current user from the server instead of trusting a cached localStorage profile.
  // A 401 here simply means "not logged in" (no cookie / expired session).
  public async fetchCurrentUser() {
    const res = await this.request<any>('/v1/users/me', { method: 'GET' });
    if (res.data && !res.error) markHadSession();
    return res;
  }

  public async login(credentials: { email: string; password?: string; passwordHash?: string }) {
    const payload = {
      email: credentials.email,
      password: credentials.password || credentials.passwordHash || '',
      passwordHash: credentials.passwordHash || credentials.password || '',
    };

    // SEC-01: the JWT arrives as a Set-Cookie header the browser stores itself (HttpOnly) — the
    // response body no longer carries a `token` field at all, nothing to persist here.
    const res = await this.request<SpringBootAuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data && !res.error) markHadSession();
    return res;
  }

  public async register(userData: { nom: string; email: string; password?: string; passwordHash?: string; roleName?: string; grade?: string; parentEmail?: string; wilaya?: string }) {
    const payload = {
      nom: userData.nom,
      email: userData.email,
      password: userData.password || userData.passwordHash || '',
      passwordHash: userData.passwordHash || userData.password || '',
      roleName: userData.roleName || 'ROLE_FREE',
      grade: userData.grade,
      parentEmail: userData.parentEmail || undefined,
      wilaya: userData.wilaya || undefined,
    };

    const res = await this.request<SpringBootAuthResponse>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.data && !res.error) markHadSession();
    return res;
  }

  public async loginWithGoogle(idToken: string) {
    // Same cookie-issuing flow as login()/register() — the backend verifies idToken itself
    // (GoogleIdTokenVerifier) and never trusts anything else the frontend could claim.
    const res = await this.request<SpringBootAuthResponse>('/v1/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    if (res.data && !res.error) markHadSession();
    return res;
  }

  // --- Proxy IA Gemini ---
  public async askGeminiExplain(payload: { topic?: string; prompt?: string; question?: string; grade?: string; subjectContext?: string; promptType?: string; examId?: number }) {
    const formattedPrompt = payload.prompt || `${payload.topic || ''} ${payload.question || ''}`.trim();
    const formattedContext = payload.subjectContext || payload.grade || '5AP';

    return this.request<{
      responseText?: string;
      text?: string;
      status?: string;
      exerciseText?: string;
      solutionText?: string;
      quickCheck?: { questionAr: string; options: { labelAr: string; isCorrect: boolean }[] };
      quotaRemaining?: number;
      quotaLimit?: number;
    }>('/v1/ai/explain', {
      method: 'POST',
      body: JSON.stringify({
        prompt: formattedPrompt,
        subjectContext: formattedContext,
        examId: payload.examId || null,
        topic: payload.topic,
        question: payload.question,
        grade: payload.grade,
        promptType: payload.promptType,
      }),
    });
  }

  public async getCemPaper(paperId: string) {
    return this.request<import('../data/immersive/cemPrep').CemPaper>('/v1/cahiers/papers/'+encodeURIComponent(paperId),{method:'GET'});
  }
  public async getCahierContent(documentId: string) {
    return this.request<import('../data/cahiers/competenceCahiers').CompetenceCahier>('/v1/cahiers/'+encodeURIComponent(documentId)+'/content',{method:'GET'});
  }
  public async getCahierAccess() {
    return this.request<CahierAccess>('/v1/cahiers/access', { method: 'GET' });
  }

  public async unlockCahier(documentId: string) {
    const result = await this.request<CahierAccess>(`/v1/cahiers/${encodeURIComponent(documentId)}/unlock`, { method: 'POST' });
    if (result.status === 429) {
      const current = await this.getCahierAccess();
      return { ...current, data: current.data ? { ...current.data, allowed: false } : undefined, status: 429 };
    }
    return result;
  }

  public async getAiQuota() {
    return this.request<{
      allowed?: boolean;
      limit: number;
      remaining: number;
      resetHours?: number;
    }>('/v1/ai/quota', {
      method: 'GET',
    });
  }

  // --- Endpoints Examens Officiels ---
  public async getPublicExams() {
    return this.request<any[]>('/v1/exams/public/list', {
      method: 'GET',
    });
  }

  public async getExamSolution(examId: number) {
    return this.request<any>(`/v1/exams/${examId}/solutions`, {
      method: 'GET',
    });
  }

  // T2/T3 server-side content gate — see PremiumContentController. While the payment flags are
  // off, this is readable by anyone (including guests). Once both flags are on, FREE/guest get 403.
  // LessonViewer distinguishes 403 vs 404 by status for the exact message shown.
  public async getPremiumLessonContent(lessonId: string) {
    return this.request<any>(`/v1/courses/premium-lessons/${lessonId}`, {
      method: 'GET',
    });
  }

  // --- Gestion des Reçus de Paiement ---
  public async submitReceipt(payload: { paymentMethod: string; amountDzd: number; planId?: string; transactionRef: string; receiptImageUrl: string }) {
    if (!canUseWebCheckout()) throw new Error('Receipt submission is available only in the web application.');
    return this.request<{ id: number; status: string; transactionRef: string; amountDzd: number; planId?: string; durationMonths?: number }>('/v1/payments/receipt/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getSubscriptionStatus() {
    return this.request<{ status: string; startDate: string | null; endDate: string | null }>('/v1/payments/subscription', { method: 'GET' });
  }

  public async getAllReceipts() {
    return this.request<any[]>('/v1/payments/admin/receipts', {
      method: 'GET',
    });
  }

  public async verifyReceipt(id: number, approve: boolean, rejectionReason?: string) {
    return this.request(`/v1/payments/admin/receipts/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ approve, rejectionReason }),
    });
  }

  // --- Administration des Utilisateurs et Rôles ---
  public async getUsersAll() {
    return this.request<any[]>('/v1/users/all', {
      method: 'GET',
    });
  }

  /** « مساعدي »: today's detailed corrections for this account (server is the quota authority). */
  public async getMusaidiToday() {
    return this.request<import('../utils/musaidiQuota').MusaidiServerStatus>('/v1/musaidi/today', { method: 'GET' });
  }

  /** « مساعدي »: asks the server to open one detailed correction; `allowed: false` once the free quota is used. */
  public async openMusaidi(itemId: string) {
    return this.request<import('../utils/musaidiQuota').MusaidiServerStatus>('/v1/musaidi/open', {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    });
  }

  /** كود التفعيل: prepaid card, BaridiMob code or school licence. Web only (never offered in the Android app). */
  public async redeemActivationCode(code: string) {
    return this.request<{ planId: string; months: number; endDate: string }>('/v1/activation-codes/redeem', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  /** Admin: generate a batch; the plain codes are returned once and never stored. */
  public async generateActivationCodes(input: { planId: string; count: number; seats: number; kind: 'CARD' | 'RECEIPT' | 'SCHOOL'; label: string; validUntil?: string | null }) {
    return this.request<{ codes: string[] }>('/v1/admin/activation-codes', { method: 'POST', body: JSON.stringify(input) });
  }

  public async getActivationBatches() {
    return this.request<{ label: string; kind: string; planId: string; codes: number; seats: number; used: number; validUntil: string | null; revoked: number }[]>('/v1/admin/activation-codes/batches', { method: 'GET' });
  }

  public async revokeActivationBatch(label: string) {
    return this.request<{ revoked: number }>('/v1/admin/activation-codes/revoke', { method: 'POST', body: JSON.stringify({ label }) });
  }

  /** V2 first-steps screen: stores the parent e-mail used for the weekly report. */
  public async updateParentEmail(parentEmail: string) {
    return this.request<any>('/v1/users/me/parent-email', {
      method: 'PUT',
      body: JSON.stringify({ parentEmail }),
    });
  }

  public async updateUserProgress(progressData: any) {
    return this.request<any>('/v1/users/me/progress', {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  public async updateUserRole(userId: number, role: string) {
    return this.request<any>(`/v1/users/admin/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  public async getReceiptStatus() {
    return this.request<{ status: 'NONE'|'PENDING_VERIFICATION'|'APPROVED'|'REJECTED'; planId: string|null; durationMonths: number|null; submittedAt: string|null; rejectionReason: string|null }>('/v1/payments/receipt/status', { method: 'GET' });
  }
  public async getLearningSnapshot(scope: string, childId?: number) {
    return this.request<Record<string, { outcome: 'independent' | 'helped' | 'review'; at: string; completedAt?: string }>>('/v1/learning/' + encodeURIComponent(scope) + (childId == null ? '' : '?childId=' + childId), { method: 'GET' });
  }
  public async saveLearningSnapshot(scope: string, childId: number | undefined, results: Record<string, { outcome: 'independent' | 'helped' | 'review'; at: string; completedAt?: string }>) {
    return this.request<Record<string, { outcome: 'independent' | 'helped' | 'review'; at: string; completedAt?: string }>>('/v1/learning/' + encodeURIComponent(scope) + (childId == null ? '' : '?childId=' + childId), { method: 'PUT', body: JSON.stringify(results) });
  }

  public async getChildProfiles() {
    return this.request<Array<{ id: number; displayName: string; grade: string; avatar?: string | null }>>(
      '/v1/children',
      { method: 'GET' },
    );
  }

  public async createChildProfile(payload: { displayName: string; grade: string; avatar?: string }) {
    return this.request<{ id: number; displayName: string; grade: string; avatar?: string | null }>(
      '/v1/children',
      { method: 'POST', body: JSON.stringify(payload) },
    );
  }

  public async updateChildProfile(
    id: number,
    payload: { displayName: string; grade: string; avatar?: string },
  ) {
    return this.request<{ id: number; displayName: string; grade: string; avatar?: string | null }>(
      `/v1/children/${id}`,
      { method: 'PUT', body: JSON.stringify(payload) },
    );
  }

  public async deleteChildProfile(id: number) {
    return this.request<void>(`/v1/children/${id}`, { method: 'DELETE' });
  }

  public async getPremiumFunnel() {
    return this.request<Array<{ event: string; grade: string; day: string; total: number }>>('/v1/admin/premium-funnel', { method: 'GET' });
  }

  public async getChildProgress(id: number) {
    return this.request<{
      competenceStats?: Record<string, unknown>;
      lessonSessions?: Array<Record<string, unknown>>;
      villageSummaries?: VillageSummaryEntry[];
    }>(`/v1/children/${id}/progress`, { method: 'GET' });
  }

  public async saveChildProgress(
    id: number,
    payload: { competenceStats?: Record<string, unknown>; lessonSessions?: Array<Record<string, unknown>>; villageSummaries?: VillageSummaryEntry[] },
  ) {
    return this.request<void>(`/v1/children/${id}/progress`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // --- Admin Console: Analytics, Feature Flags, Audit Log ---

  public async getAdminStatsOverview() {
    return this.request<any>('/v1/admin/stats/overview', {
      method: 'GET',
    });
  }

  public async getAdminStatsPeriod(from: string, to: string) {
    return this.request<unknown>(`/v1/admin/stats/period?${new URLSearchParams({ from, to })}`, { method: 'GET' });
  }

  // Public endpoint (no admin auth required) — every visitor's client hydrates flag overrides
  // from here at boot, see AuthContext.tsx.
  public async getFeatureFlagsPublic() {
    return this.request<Record<string, boolean>>('/v1/feature-flags', {
      method: 'GET',
    });
  }

  public async getAndroidRelease() {
    return this.request<{ latestVersionCode: number; minVersionCode: number }>('/v1/android-release', {
      method: 'GET',
    });
  }

  public async updateAndroidRelease(body: { latestVersionCode?: number; minVersionCode?: number }) {
    return this.request<{ latestVersionCode: number; minVersionCode: number }>('/v1/admin/android-release', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public async updateFeatureFlag(flagKey: string, enabled: boolean) {
    return this.request<any>(`/v1/admin/feature-flags/${flagKey}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    });
  }

  public async deleteFeatureFlagOverride(flagKey: string) {
    return this.request<any>(`/v1/admin/feature-flags/${flagKey}`, {
      method: 'DELETE',
    });
  }

  public async getAdminAuditLog(filters: {
    limit?: number;
    actionType?: string;
    outcome?: string;
    actorEmail?: string;
    dateFrom?: string; // ISO local date-time, e.g. "2026-08-17T00:00:00"
    dateTo?: string;
    excludeActionType?: string;
  } = {}) {
    const params = new URLSearchParams();
    params.set('limit', String(filters.limit ?? 50));
    if (filters.actionType) params.set('actionType', filters.actionType);
    if (filters.outcome) params.set('outcome', filters.outcome);
    if (filters.actorEmail) params.set('actorEmail', filters.actorEmail);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.excludeActionType) params.set('excludeActionType', filters.excludeActionType);
    return this.request<any[]>(`/v1/admin/audit-log?${params.toString()}`, {
      method: 'GET',
    });
  }

  public async getAdminAuditLogEphemeralCount() {
    return this.request<{ count: number; actionTypes: string[] }>('/v1/admin/audit-log/ephemeral', {
      method: 'GET',
    });
  }

  public async purgeAdminAuditLogEphemeral() {
    return this.request<{ count: number; actionTypes: string[] }>('/v1/admin/audit-log/ephemeral', {
      method: 'DELETE',
    });
  }

  public async getContactMessages() {
    return this.request<any[]>('/v1/admin/contact-messages', {
      method: 'GET',
    });
  }

  public async getAdminInfraQuotas() {
    return this.request<InfraQuotasResponse>('/v1/admin/infra/quotas', {
      method: 'GET',
    });
  }

  // --- "Nous contacter / Suggestions" ---
  public async submitContact(payload: { name: string; email: string; type: string; message: string }) {
    return this.request<{ success: boolean }>('/v1/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const springBootApi = new SpringBootApiService();
