import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { springBootApi } from './springBootApi';
import { setStoredLocale } from '../localePreference';

beforeEach(() => { setStoredLocale('fr'); });
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); setStoredLocale('ar'); });

describe('Network failures without duplicated mutations', () => {
  it('reports offline immediately without submitting or clearing progress', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const fetch = vi.spyOn(globalThis, 'fetch');
    localStorage.setItem('mssid_user_progress', 'saved-progress');
    const result = await springBootApi.request('/v1/contact', { method: 'POST', body: '{}' });
    expect(result.error).toContain('Aucune connexion Internet');
    expect(fetch).not.toHaveBeenCalled();
    expect(localStorage.getItem('mssid_user_progress')).toBe('saved-progress');
  });
  it.each(['POST', 'PUT', 'DELETE', 'PATCH'])('does not replay a %s after losing the response', async (method) => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Connection dropped'));
    const result = await springBootApi.request('/test-write', { method, body: '{}' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(0);
    expect(result.error).toContain('Vérifie si ton action a été enregistrée');
  });
  it('bounds a slow mutation to one 40-second attempt', async () => {
    vi.useFakeTimers();
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation((_url, init) => new Promise((_, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')));
    }));
    const pending = springBootApi.request('/v1/auth/register', { method: 'POST', body: '{}' });
    await vi.advanceTimersByTimeAsync(40000);
    const result = await pending;
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(0);
  });
  it('localizes offline feedback in Arabic', async () => {
    setStoredLocale('ar');
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    expect((await springBootApi.request('/test')).error).toContain('بالإنترنت');
  });
});
