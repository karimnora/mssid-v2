/**
 * Service API Client Spring Boot 3.x - Mssid DZ
 * Connecteur universel prêt à l'emploi pour le backend Java Spring Boot (JWT & REST)
 */

export const SPRING_BOOT_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SPRING_BOOT_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SPRING_BOOT_URL) ||
  'http://localhost:8080/api'; // Cible le port Spring Boot par défaut

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
  const baseUrl = SPRING_BOOT_BASE_URL.endsWith('/') 
    ? SPRING_BOOT_BASE_URL.slice(0, -1) 
    : SPRING_BOOT_BASE_URL;

  const url = `${baseUrl}${normalizedEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders((options.headers as Record<string, string>) || {}),
    });

    const status = response.status;

    if (status === 401) {
      this.clearToken();
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
        error: errorData.message || 'Quota quotidien de requêtes dépassé (Rate Limit Spring Boot).',
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
    console.warn('Erreur de connexion au backend mssid dz:', err.message);
    return {
      error: 'Impossible de contacter le serveur mssid dz backend.',
      status: 0,
    };
  }
}

  // --- Endpoints d'Authentification ---
  public async login(credentials: { email: string; password?: string; passwordHash?: string }) {
    const payload = {
      email: credentials.email,
      password: credentials.password || credentials.passwordHash || '',
      passwordHash: credentials.passwordHash || credentials.password || '',
    };

    const res = await this.request<SpringBootAuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.data?.token) {
      this.setToken(res.data.token);
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

    const res = await this.request<SpringBootAuthResponse>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
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
}

export const springBootApi = new SpringBootApiService();