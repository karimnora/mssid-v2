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
          responseText: 'شرح مفصل للكسور العشرية',
          status: 'success',
        }),
      });
      global.fetch = mockFetch;

      const result = await springBootApi.askGeminiExplain({
        topic: 'الكسور العشرية',
        grade: '5AP',
        promptType: 'solve',
      });

      expect(result.status).toBe(200);
      expect(result.data?.responseText).toBe('شرح مفصل للكسور العشرية');

      // promptType must reach the backend — it's what distinguishes "اشرح لي درساً" from "حل مسألة"
      // from "ولّد مسألة تدريبية جديدة" server-side (see GeminiProxyController's routing).
      const sentBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(sentBody.promptType).toBe('solve');
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

    it('SEC-06: silently refreshes and retries once when a 401 is just an expired access token', async () => {
      const mockFetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('/v1/auth/refresh')) {
          return Promise.resolve({
            status: 200,
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ user: { email: 'admin@mssid.dz' } }),
          });
        }
        // First call to the protected route fails; a second call (the retry after refresh)
        // succeeds — simulating a freshly-rotated access token cookie now being valid.
        const alreadyRetried = mockFetch.mock.calls.filter((c: any[]) => c[0].includes('/protected-route')).length > 1;
        if (alreadyRetried) {
          return Promise.resolve({
            status: 200,
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ message: 'Success after refresh' }),
          });
        }
        return Promise.resolve({ status: 401, ok: false, headers: new Headers(), json: async () => ({}) });
      });
      global.fetch = mockFetch;

      const result = await springBootApi.request<{ message: string }>('/protected-route');

      expect(result.status).toBe(200);
      expect(result.data?.message).toBe('Success after refresh');
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/v1/auth/refresh'), expect.objectContaining({ method: 'POST' }));
      // Original endpoint hit twice: once that 401'd, once retried after the silent refresh.
      expect(mockFetch.mock.calls.filter((c: any[]) => c[0].includes('/protected-route')).length).toBe(2);
    });

    it('SEC-06: does not attempt a refresh when the 401 comes from the login call itself', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ status: 401, ok: false, headers: new Headers(), json: async () => ({}) });
      global.fetch = mockFetch;

      await springBootApi.request('/v1/auth/login', { method: 'POST' });

      expect(mockFetch).not.toHaveBeenCalledWith(expect.stringContaining('/v1/auth/refresh'), expect.anything());
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

    it('silently retries once after a network error, then succeeds (cold-start recovery)', async () => {
      // Render's free tier can drop the very first request while an idle container spins back up —
      // request() retries once after a short wait before surfacing anything to the caller.
      vi.useFakeTimers();
      try {
        const mockFetch = vi
          .fn()
          .mockRejectedValueOnce(new Error('Failed to fetch'))
          .mockResolvedValueOnce({
            status: 200,
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ status: 'UP' }),
          });
        global.fetch = mockFetch;

        const resultPromise = springBootApi.request('/health');
        await vi.advanceTimersByTimeAsync(5000);
        const result = await resultPromise;

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result.status).toBe(200);
        expect(result.error).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });

    it('catches network/connection errors gracefully when the backend is still unreachable after the retry', async () => {
      vi.useFakeTimers();
      try {
        const mockFetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
        global.fetch = mockFetch;

        const resultPromise = springBootApi.request('/health');
        await vi.advanceTimersByTimeAsync(5000);
        const result = await resultPromise;

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result.status).toBe(0);
        expect(result.error).toContain('Impossible de contacter le serveur');
      } finally {
        vi.useRealTimers();
      }
    });

    // Regression test: the AbortError branch used to return immediately on the very first timeout,
    // never reaching the retry logic above — so a Render cold start (container boot up to ~30-50s,
    // longer than the 15s per-attempt timeout) always surfaced this error on the first request,
    // even though the retry-after-network-failure path already handled the non-timeout case.
    it('retries once with a longer timeout after the first attempt times out (cold-start recovery)', async () => {
      vi.useFakeTimers();
      try {
        let callCount = 0;
        const mockFetch = vi.fn().mockImplementation((_url: string, opts: RequestInit) => {
          callCount++;
          if (callCount === 1) {
            // Hangs until the AbortController's timeout fires, like a real slow cold-starting server.
            return new Promise((_resolve, reject) => {
              opts.signal?.addEventListener('abort', () => {
                const err = new Error('The operation was aborted.');
                err.name = 'AbortError';
                reject(err);
              });
            });
          }
          return Promise.resolve({
            status: 200,
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ status: 'UP' }),
          });
        });
        global.fetch = mockFetch;

        const resultPromise = springBootApi.request('/health');
        await vi.advanceTimersByTimeAsync(15000); // first attempt's timeout fires
        const result = await resultPromise;

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result.status).toBe(200);
        expect(result.error).toBeUndefined();
      } finally {
        vi.useRealTimers();
      }
    });

    it('surfaces the timeout error only once the retry (with its longer budget) also times out', async () => {
      vi.useFakeTimers();
      try {
        const mockFetch = vi.fn().mockImplementation((_url: string, opts: RequestInit) => {
          return new Promise((_resolve, reject) => {
            opts.signal?.addEventListener('abort', () => {
              const err = new Error('The operation was aborted.');
              err.name = 'AbortError';
              reject(err);
            });
          });
        });
        global.fetch = mockFetch;

        const resultPromise = springBootApi.request('/health');
        await vi.advanceTimersByTimeAsync(15000); // first attempt times out
        await vi.advanceTimersByTimeAsync(40000); // retry's longer budget also times out
        const result = await resultPromise;

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result.status).toBe(0);
        expect(result.error).toContain('trop de temps');
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
