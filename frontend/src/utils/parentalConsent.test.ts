import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { springBootApi } from '../services/springBootApi';
import { PARENTAL_CONSENT_VERSION, needsParentalConsent, updateParentalConsentSession } from './parentalConsent';

const agreed = { id: 7, nom: 'Parent', email: 'parent@example.test', role: 'ROLE_FREE' as const,
  parentalConsentRequired: false, parentalConsentAt: '2026-11-16T10:00:00Z', parentalConsentVersion: PARENTAL_CONSENT_VERSION };
beforeEach(() => {
  updateParentalConsentSession(null);
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })));
});
afterEach(() => { updateParentalConsentSession(null); vi.unstubAllGlobals(); });

describe('parental consent and synchronization', () => {
  it('requires a recorded timestamp and the current version, including for legacy profiles', () => {
    expect(needsParentalConsent({})).toBe(true);
    expect(needsParentalConsent(agreed)).toBe(false);
    expect(needsParentalConsent({ ...agreed, parentalConsentAt: undefined })).toBe(true);
    expect(needsParentalConsent({ ...agreed, parentalConsentVersion: 'old-version' })).toBe(true);
    expect(needsParentalConsent({ ...agreed, parentalConsentRequired: true })).toBe(true);
  });

  it.each(['/v1/children', '/v1/children/11/progress', '/v1/users/me/progress', '/v1/users/profile',
    '/v1/users/me', '/v1/learning/family-5AP?childId=11', '/v1/musaidi/open', '/v1/ai/explain', '/gemini/explain'])
  ('does not send child data to %s while consent is missing', async endpoint => {
    const result = await springBootApi.request(endpoint, { method: 'POST', body: '{"xp":10}' });
    expect(result).toMatchObject({ status: 403, code: 'PARENTAL_CONSENT_REQUIRED' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('resumes writes after server-confirmed consent and pauses them again for another account', async () => {
    updateParentalConsentSession(agreed);
    expect((await springBootApi.request('/v1/children/11/progress', { method: 'PUT', body: '{}' })).status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
    updateParentalConsentSession({ ...agreed, id: 8, parentalConsentRequired: true });
    expect((await springBootApi.request('/v1/children/12/progress', { method: 'PUT', body: '{}' })).status).toBe(403);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('allows reads, account deletion and the explicit consent request while synchronization is paused', async () => {
    await springBootApi.request('/v1/children/11/progress');
    await springBootApi.request('/v1/users/me', { method: 'DELETE' });
    await springBootApi.acceptParentalConsent({ parentalConsentAccepted: true, parentalConsentVersion: PARENTAL_CONSENT_VERSION });
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('preserves the server Google-consent challenge for the interface', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ code: 'PARENTAL_CONSENT_REQUIRED', message: 'Consent required' }), {
      status: 409, headers: { 'Content-Type': 'application/json' },
    })));
    expect(await springBootApi.loginWithGoogle('verified-token')).toMatchObject({ status: 409, code: 'PARENTAL_CONSENT_REQUIRED' });
  });
});
