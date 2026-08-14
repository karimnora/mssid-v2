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

class SpringBootApiService {
  private requestTimeoutMs = 15000;

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
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number; headers?: Headers }> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = SPRING_BOOT_BASE_URL.endsWith('/') 
    ? SPRING_BOOT_BASE_URL.slice(0, -1) 
    : SPRING_BOOT_BASE_URL;

  const url = `${baseUrl}${normalizedEndpoint}`;

  // Sur un réseau mobile instable ou un serveur injoignable, fetch() peut rester en
  // attente plusieurs minutes sans jamais rejeter : on borne chaque appel pour que
  // l'utilisateur voie un message d'erreur au lieu d'un écran de chargement infini.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders((options.headers as Record<string, string>) || {}),
      credentials: 'include', // SEC-01: send the HttpOnly auth cookie on every request
      signal: controller.signal,
    });

    const status = response.status;

    if (status === 401) {
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
      console.warn(`[mssid dz] Délai d'attente dépassé (${this.requestTimeoutMs}ms) pour ${url}`);
      return {
        error: 'Le serveur met trop de temps à répondre. Vérifiez votre connexion et réessayez.',
        status: 0,
      };
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

  public async register(userData: { nom: string; email: string; password?: string; passwordHash?: string; roleName?: string }) {
    const payload = {
      nom: userData.nom,
      email: userData.email,
      password: userData.password || userData.passwordHash || '',
      passwordHash: userData.passwordHash || userData.password || '',
      roleName: userData.roleName || 'ROLE_FREE',
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

    return this.request<{ responseText?: string; text?: string; cached?: boolean; usage?: any; status?: string }>('/v1/ai/explain', {
      method: 'POST',
      body: JSON.stringify({
        prompt: formattedPrompt,
        subjectContext: formattedContext,
        examId: payload.examId || null,
        topic: payload.topic,
        question: payload.question,
        grade: payload.grade,
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

  public async generateCmsContent(payload: { type: string; topic: string; grade?: string; subject?: string; difficulty?: string }) {
    return this.request<{ text?: string; responseText?: string; cached?: boolean; usage?: any }>('/gemini/cms-generate', {
      method: 'POST',
      body: JSON.stringify(payload),
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
    return this.request('/v1/payments/receipt/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async createCheckout(payload: { paymentMethod: string; amountDzd: number; providerName: string; returnUrl?: string; transactionRef?: string }) {
    return this.request<{
      checkoutId: string;
      checkoutUrl: string;
      transactionRef: string;
      status: string;
      message: string;
    }>('/v1/payments/checkout', {
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

  public async getAdminAuditLog(limit: number = 50) {
    return this.request<any[]>(`/v1/admin/audit-log?limit=${limit}`, {
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