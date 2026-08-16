import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { springBootApi } from './springBootApi';

describe('SpringBootApiService - Spring Boot REST API Service Unit Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('JWT Token & Header Storage Management', () => {
    it('manages JWT token in localStorage correctly', () => {
      expect(springBootApi.getToken()).toBeNull();

      springBootApi.setToken('test.jwt.token.123');
      expect(springBootApi.getToken()).toBe('test.jwt.token.123');

      springBootApi.clearToken();
      expect(springBootApi.getToken()).toBeNull();
    });
  });

  describe('HTTP Request Handling - Happy Paths & Header Attachments', () => {
    it('attaches Authorization bearer token and user role headers to requests', async () => {
      springBootApi.setToken('mock_jwt_token_xyz');
      localStorage.setItem('mssid_auth_user', JSON.stringify({ email: 'teacher@mssid.dz', role: 'ROLE_TEACHER' }));
      localStorage.setItem('mssid_current_user', JSON.stringify({ email: 'teacher@mssid.dz', role: 'ROLE_TEACHER' }));

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
            'Authorization': 'Bearer mock_jwt_token_xyz',
            'x-user-role': 'ROLE_TEACHER',
            'x-user-id': 'teacher@mssid.dz',
          }),
        })
      );
    });

    it('performs login and stores returned JWT token on success', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          token: 'returned_login_jwt_token_456',
          user: { email: 'admin@mssid.dz', role: 'ROLE_ADMIN' },
        }),
      });
      global.fetch = mockFetch;

      const result = await springBootApi.login({ email: 'admin@mssid.dz', passwordHash: 'hashed_pass' });

      expect(result.status).toBe(200);
      expect(result.data?.token).toBe('returned_login_jwt_token_456');
      expect(springBootApi.getToken()).toBe('returned_login_jwt_token_456');
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
    it('handles 401 Unauthorized status by clearing token and returning expired message', async () => {
      springBootApi.setToken('expired_token_123');

      const mockFetch = vi.fn().mockResolvedValue({
        status: 401,
        ok: false,
        headers: new Headers(),
      });
      global.fetch = mockFetch;

      const result = await springBootApi.request('/protected-route');

      expect(result.status).toBe(401);
      expect(result.error).toContain('Session expirée');
      expect(springBootApi.getToken()).toBeNull();
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
