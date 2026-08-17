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

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
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
}

// Endpoints that must never trigger a silent refresh-and-retry: retrying auth itself would either
// loop (refresh calling refresh) or make no sense (a failed login isn't fixed by refreshing).
const AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH = ['/v1/auth/login', '/v1/auth/register', '/v1/auth/logout', '/v1/auth/refresh'];

class SpringBootApiService {
  private requestTimeoutMs = 15000;

  // SEC-06: dedupes concurrent refresh attempts — if several API calls 401 around the same moment
  // (e.g. a screen firing 3 parallel fetches right as the access token expires), they all await the
  // same in-flight refresh instead of each rotating the single-use refresh token and invalidating
  // each other's attempt.
  private refreshPromise: Promise<boolean> | null = null;

  // SEC-05: identity for the x-user-role/x-user-id convenience headers (used by the AI quota system)
  // is pushed here by AuthService.setCurrentUser whenever the in-memory auth singleton changes — no
  // localStorage read. AuthService already imports springBootApi, so this stays a one-way dependency.
  private identityRole: string | null = null;
  private identityEmail: string | null = null;

  public setIdentityHeaders(role: string | null | undefined, email: string | null | undefined): void {
    this.identityRole = role || null;
    this.identityEmail = email || null;
  }

  // SEC-01: the backend now issues the JWT as an HttpOnly cookie (see AuthController.java) — it never
  // reaches JS, so there is nothing left to read/store/attach here. Every request must send
  // `credentials: 'include'` so the browser attaches that cookie automatically; logging out means
  // asking the server to clear it, not deleting a localStorage entry.
  public async logout(): Promise<void> {
    await this.request('/v1/auth/logout', { method: 'POST' }).catch(() => {});
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

    if (this.identityRole) {
      headers['x-user-role'] = this.identityRole;
    }
    if (this.identityEmail) {
      headers['x-user-id'] = this.identityEmail;
    }

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
  const timeoutMs = _isRetryAfterColdStart ? Math.max(this.requestTimeoutMs, 40000) : this.requestTimeoutMs;
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
      // refresh token, or no session at all).
      const canAttemptRefresh = !_isRetryAfterRefresh && !AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH.includes(normalizedEndpoint);
      if (canAttemptRefresh && (await this.tryRefresh())) {
        return this.request<T>(endpoint, options, true);
      }

      // Best-effort: ask the server to drop the (presumably expired/invalid) auth cookie.
      // Fire-and-forget — a stuck logout call must never block surfacing this 401 to the caller.
      this.logout().catch(() => {});
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
    if (err?.name === 'AbortError') {
      if (!_isRetryAfterColdStart) {
        console.warn(`[mssid dz] Timeout (${timeoutMs}ms) sur ${url}, nouvelle tentative avec un délai plus long (cold start possible)`);
        return this.request<T>(endpoint, options, _isRetryAfterRefresh, true);
      }
      console.warn(`[mssid dz] Délai d'attente dépassé (${timeoutMs}ms) pour ${url}`);
      return {
        error: 'Le serveur met trop de temps à répondre. Vérifiez votre connexion et réessayez.',
        status: 0,
      };
    }
    // A free-tier host (Render) that's been idle 15+ min can refuse/drop the very first request
    // while its container spins back up (~30-50s) — the exact failure a real visitor could hit, not
    // just a genuinely unreachable server. One silent retry after a short wait recovers from that
    // transparently in most cases; a truly offline/broken backend still ends up with the same error,
    // just a few seconds later.
    if (!_isRetryAfterColdStart) {
      console.warn(`[mssid dz] Échec réseau sur ${url}, nouvelle tentative dans 5s (possible cold start)`, err.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return this.request<T>(endpoint, options, _isRetryAfterRefresh, true);
    }

    console.warn('Erreur de connexion au serveur mssid dz:', err.message);
    return {
      error: 'Impossible de contacter le serveur. Veuillez réessayer plus tard.',
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
    return this.request<any>('/v1/users/me', { method: 'GET' });
  }

  public async login(credentials: { email: string; password?: string; passwordHash?: string }) {
    const payload = {
      email: credentials.email,
      password: credentials.password || credentials.passwordHash || '',
      passwordHash: credentials.passwordHash || credentials.password || '',
    };

    // SEC-01: the JWT arrives as a Set-Cookie header the browser stores itself (HttpOnly) — the
    // response body no longer carries a `token` field at all, nothing to persist here.
    return this.request<SpringBootAuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async register(userData: { nom: string; email: string; password?: string; passwordHash?: string; roleName?: string; grade?: string }) {
    const payload = {
      nom: userData.nom,
      email: userData.email,
      password: userData.password || userData.passwordHash || '',
      passwordHash: userData.passwordHash || userData.password || '',
      roleName: userData.roleName || 'ROLE_FREE',
      grade: userData.grade,
    };

    return this.request<SpringBootAuthResponse>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- Proxy IA Gemini ---
  public async askGeminiExplain(payload: { topic?: string; prompt?: string; question?: string; grade?: string; subjectContext?: string; promptType?: string; examId?: number }) {
    const formattedPrompt = payload.prompt || `${payload.topic || ''} ${payload.question || ''}`.trim();
    const formattedContext = payload.subjectContext || payload.grade || '5AP';

    return this.request<{ responseText?: string; text?: string; status?: string }>('/v1/ai/explain', {
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

  public async solveExamDetailed(payload: { prompt: string; examId: number; subjectContext?: string }) {
    return this.request<{ responseText?: string; text?: string; status?: string }>('/v1/ai/solve-exam', {
      method: 'POST',
      body: JSON.stringify({
        prompt: payload.prompt,
        examId: payload.examId,
        subjectContext: payload.subjectContext || 'Examen officiel 5AP',
      }),
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

  // --- Gestion des Reçus de Paiement ---
  public async submitReceipt(payload: { paymentMethod: string; amountDzd: number; transactionRef: string; receiptImageUrl: string }) {
    return this.request<{ id: number; status: string; transactionRef: string; amountDzd: number }>('/v1/payments/receipt/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
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

  // --- Admin Console: Analytics, Feature Flags, Audit Log ---

  public async getAdminStatsOverview() {
    return this.request<any>('/v1/admin/stats/overview', {
      method: 'GET',
    });
  }

  // Public endpoint (no admin auth required) — every visitor's client hydrates flag overrides
  // from here at boot, see AuthContext.tsx.
  public async getFeatureFlagsPublic() {
    return this.request<Record<string, boolean>>('/v1/feature-flags', {
      method: 'GET',
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
  } = {}) {
    const params = new URLSearchParams();
    params.set('limit', String(filters.limit ?? 50));
    if (filters.actionType) params.set('actionType', filters.actionType);
    if (filters.outcome) params.set('outcome', filters.outcome);
    if (filters.actorEmail) params.set('actorEmail', filters.actorEmail);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    return this.request<any[]>(`/v1/admin/audit-log?${params.toString()}`, {
      method: 'GET',
    });
  }

  public async getContactMessages() {
    return this.request<any[]>('/v1/admin/contact-messages', {
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