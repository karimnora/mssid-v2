import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AuthService } from './authService';
import { isParentalConsentPending, PARENTAL_CONSENT_VERSION } from '../utils/parentalConsent';
const legacy = { id: 7, nom: 'Parent', email: 'parent@example.test', role: 'ROLE_FREE' as const };
const accepted = { ...legacy, parentalConsentRequired: false, parentalConsentAt: '2026-11-16T10:00:00Z', parentalConsentVersion: PARENTAL_CONSENT_VERSION };
beforeEach(() => { localStorage.clear(); AuthService.setCurrentUser(null); });
afterEach(() => { AuthService.setCurrentUser(null); vi.unstubAllGlobals(); });
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

it('does not send cosmetic progress for a legacy account without consent', async () => {
  vi.stubGlobal('fetch', vi.fn());
  AuthService.setCurrentUser(legacy);
  AuthService.syncGoldCoinsAndAvatar(100, { activeOutfit: 'default', unlockedOutfits: ['default'] });
  await Promise.resolve();
  expect(fetch).not.toHaveBeenCalled();
  expect(isParentalConsentPending()).toBe(true);
});

it('updates the session only after the server records its date and version', async () => {
  AuthService.setCurrentUser(legacy);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(accepted)));
  expect((await AuthService.acceptParentalConsent()).success).toBe(true);
  expect(AuthService.getCurrentUser()).toMatchObject(accepted);
  expect(isParentalConsentPending()).toBe(false);
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/v1/auth/parental-consent'), expect.objectContaining({
    body: JSON.stringify({ parentalConsentAccepted: true, parentalConsentVersion: PARENTAL_CONSENT_VERSION }),
  }));
});

it('does not resume synchronization when the server refuses the decision', async () => {
  AuthService.setCurrentUser(legacy);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ message: 'Refused' }, 400)));
  expect((await AuthService.acceptParentalConsent()).success).toBe(false);
  expect(isParentalConsentPending()).toBe(true);
});

it('keeps locally earned progress and retries it after consent is recorded', async () => {
  AuthService.setCurrentUser(legacy);
  const request = vi.fn().mockImplementation((url: string) => Promise.resolve(response(
    url.endsWith('/parental-consent') ? { ...accepted, score: 0, xp: 0 } : { score: 25, xp: 25 },
  )));
  vi.stubGlobal('fetch', request);
  AuthService.addScore(25, 'local-lesson');
  await Promise.resolve();
  expect(request).not.toHaveBeenCalled();
  expect(AuthService.getCurrentUser()?.xp).toBe(25);
  expect((await AuthService.acceptParentalConsent()).success).toBe(true);
  expect(AuthService.getCurrentUser()?.xp).toBe(25);
  expect(request).toHaveBeenCalledWith(expect.stringContaining('/users/me/progress'), expect.objectContaining({
    method: 'PUT', body: expect.stringContaining('local-lesson'),
  }));
  await new Promise(resolve => setTimeout(resolve, 0));
});

it('does not apply a late acceptance response to another signed-in account', async () => {
  AuthService.setCurrentUser(legacy);
  let resolve!: (value: Response) => void;
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise<Response>(done => { resolve = done; })));
  const pending = AuthService.acceptParentalConsent();
  AuthService.setCurrentUser({ ...legacy, id: 8, email: 'other@example.test' });
  resolve(response(accepted));
  expect((await pending).success).toBe(false);
  expect(AuthService.getCurrentUser()?.id).toBe(8);
  expect(isParentalConsentPending()).toBe(true);
});
