/**
 * Service API Client Spring Boot 3.x - Mssid DZ
 * Connecteur universel prêt à l'emploi pour le backend Java Spring Boot (JWT & REST)
 */

export const SPRING_BOOT_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SPRING_BOOT_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SPRING_BOOT_URL) ||
  '/api';

import { UserRole } from '../types/auth';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface SpringBootAuthResponse {
  token: string;
  email?: string;
  nom?: string;
  roleName?: string;
  role?: UserRole;
  user?: any;
}

class SpringBootApiService {
  private tokenKey = 'mssid_jwt_token';

  // Obtenir le token JWT stocké
  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Enregistrer le token JWT
  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Supprimer le token (Déconnexion)
  public clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Générer les en-têtes HTTP sécurisés
  private getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Récupérer le rôle et l'email utilisateur actuel pour le Rate Limiter & Auth Context
    let currentUser: any = {};
    try {
      const rawCurrent = localStorage.getItem('mssid_current_user');
      const rawAuth = localStorage.getItem('mssid_auth_user');
      if (rawCurrent && rawCurrent !== 'undefined') {
        currentUser = JSON.parse(rawCurrent);
      } else if (rawAuth && rawAuth !== 'undefined') {
        currentUser = JSON.parse(rawAuth);
      }
    } catch {
      currentUser = {};
    }

    if (currentUser?.role) {
      headers['x-user-role'] = currentUser.role;
    }
    if (currentUser?.email) {
      headers['x-user-id'] = currentUser.email;
    }

    return headers;
  }

  // Requête générique HTTP
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string; status: number; headers?: Headers }> {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${SPRING_BOOT_BASE_URL}${normalizedEndpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 seconds timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: this.getHeaders((options.headers as Record<string, string>) || {}),
      });
      clearTimeout(timeoutId);

      const status = response.status;
      const contentType = response.headers.get('content-type');
      let data: T | undefined;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json().catch(() => undefined);
      }

      if (status === 401 || status === 404) {
        this.clearToken();
        const errText = (data as any)?.message || (data as any)?.error || 'Identifiants incorrects ou compte introuvable.';
        return { error: errText, status };
      }

      if (status === 400) {
        const errText = (data as any)?.message || (data as any)?.error || 'Données invalides ou champs manquants (400).';
        return { error: errText, status };
      }

      if (status === 429) {
        return {
          error: (data as any)?.message || 'Quota quotidien de requêtes dépassé (Rate Limit).',
          status,
        };
      }

      if (!response.ok) {
        return {
          error: (data as any)?.message || (data as any)?.error || `Erreur serveur (${status})`,
          status,
        };
      }

      return { data, status, headers: response.headers };
    } catch (err: any) {
      clearTimeout(timeoutId);
      this.clearToken();
      if (err.name === 'AbortError') {
        return {
          error: 'انتهت مهلة الاتصال بالخادم (Timeout). يرجى المحاولة لاحقاً.',
          status: 408,
        };
      }
      console.warn('Erreur de connexion au backend mssid dz:', err.message);
      return {
        error: 'Identifiants incorrects ou compte introuvable (Serveur indisponible).',
        status: 0,
      };
    }
  }

  // --- Endpoints d'Authentification (Spring Boot & Express) ---
  public async login(credentials: { email: string; password?: string; passwordHash?: string }) {
    const payload = {
      email: credentials.email,
      password: credentials.password || credentials.passwordHash || '',
      passwordHash: credentials.passwordHash || credentials.password || '',
    };

    const res = await this.request<SpringBootAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if ((res.status === 200 || res.status === 201) && res.data?.token) {
      this.setToken(res.data.token);
    } else {
      this.clearToken();
    }
    return res;
  }

  public async register(userData: { nom: string; email: string; password?: string; passwordHash?: string; roleName?: string }) {
    const payload = {
      nom: userData.nom,
      email: userData.email,
      password: userData.password || userData.passwordHash || '',
      passwordHash: userData.passwordHash || userData.password || '',
      roleName: userData.roleName || 'ROLE_FREE',
    };

    const res = await this.request<SpringBootAuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if ((res.status === 200 || res.status === 201) && res.data?.token) {
      this.setToken(res.data.token);
    } else {
      this.clearToken();
    }
    return res;
  }

  // --- Proxy IA Gemini avec Cache & Rate Limit ---
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

  // --- Administration des Utilisateurs et Rôles (RBAC) ---
  public async getUsersAll() {
    return this.request<any[]>('/v1/users/all', {
      method: 'GET',
    });
  }

  public async updateUserRole(userId: number, role: string) {
    return this.request<any>(`/v1/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }
}

export const springBootApi = new SpringBootApiService();

