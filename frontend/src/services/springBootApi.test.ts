import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { springBootApi } from './springBootApi';

describe('SpringBootApiService - Spring Boot REST API Service Unit Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    springBootApi.setIdentityHeaders(null, null);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('SEC-01: HttpOnly cookie auth (no JS-readable token)', () => {
    it('sends credentials: include so the HttpOnly auth cookie is attached automatically', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Success' }),
      });
      global.fetch = mockFetch;

      await springBootApi.request('/test-endpoint');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({ credentials: 'include' })
      );
    });

    it('logout() calls the backend to clear the auth cookie instead of touching localStorage', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Déconnexion réussie' }),
      });
      global.fetch = mockFetch;

      await springBootApi.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/auth/logout'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('HTTP Request Handling - Happy Paths & Header Attachments', () => {
    it('attaches user role headers pushed by AuthService (SEC-05: no localStorage read)', async () => {
      springBootApi.setIdentityHeaders('ROLE_TEACHER', 'teacher@mssid.dz');

      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Success' }),
      });
      global.fetch = mockFetch;

      const response = await springBootApi.request<{ message: string }>('/test-endpoint');

      expect(response.status).toBe(200);
      expect(response.data?.message).toBe('Success');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-user-role': 'ROLE_TEACHER',
            'x-user-id': 'teacher@mssid.dz',
          }),
        })
      );
    });

    it('performs login without exposing a JWT in the response body', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          user: { email: 'admin@mssid.dz', role: 'ROLE_ADMIN' },
        }),
      });
      global.fetch = mockFetch;

      const result = await springBootApi.login({ email: 'admin@mssid.dz', passwordHash: 'hashed_pass' });

      expect(result.status).toBe(200);
      expect(result.error).toBeUndefined();
      expect(result.data?.token).toBeUndefined();
    });

    it('handles askGeminiExplain request payload correctly', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          text: 'شرح مفصل للكسور العشرية',
          cached: true,
          usage: { remaining: 49, limit: 50 },
        }),
      });
      global.fetch = mockFetch;

      const result = await springBootApi.askGeminiExplain({
        topic: 'الكسور العشرية',
        grade: '5AP',
        promptType: 'explain',
      });

      expect(result.status).toBe(200);
      expect(result.data?.text).toBe('شرح مفصل للكسور العشرية');
      expect(result.data?.cached).toBe(true);
    });
  });

  describe('Error Handling & Boundary Edge Cases', () => {
    it('handles 401 Unauthorized status by asking the server to clear the auth cookie', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 401,
        ok: false,
        headers: new Headers(),
        json: async () => ({}),
      });
      global.fetch = mockFetch;

      const result = await springBootApi.request('/protected-route');

      expect(result.status).toBe(401);
      expect(result.error).toContain('Email ou mot de passe incorrect');
      // logout() is fire-and-forget from within the 401 handler — give its microtask a tick to run.
      await Promise.resolve();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/auth/logout'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('handles 429 Rate Limit Exceeded status from Spring Boot backend', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 429,
        ok: false,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Quota quotidien dépassé (100/100)' }),
      });
      global.fetch = mockFetch;

      const result = await springBootApi.request('/gemini/explain');

      expect(result.status).toBe(429);
      expect(result.error).toBe('Quota quotidien dépassé (100/100)');
    });

    it('catches network/connection errors gracefully when backend is unreachable', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
      global.fetch = mockFetch;

      const result = await springBootApi.request('/health');

      expect(result.status).toBe(0);
      expect(result.error).toContain('Impossible de contacter le serveur');
    });
  });
});
