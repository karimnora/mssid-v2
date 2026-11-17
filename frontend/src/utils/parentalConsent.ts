import type { AuthUser } from '../types/auth';

export const PARENTAL_CONSENT_VERSION = 'parental-consent-2026-11-v1';
export interface ParentalConsentDecision {
  parentalConsentAccepted: boolean;
  parentalConsentVersion: string;
}

export function needsParentalConsent(user: Pick<AuthUser, 'parentalConsentRequired' | 'parentalConsentAt' | 'parentalConsentVersion'>): boolean {
  return user.parentalConsentRequired !== false || !user.parentalConsentAt
    || user.parentalConsentVersion !== PARENTAL_CONSENT_VERSION;
}

// Memory only. Unknown/guest sessions cannot send child data before the server profile is loaded.
let paused = true;
export function updateParentalConsentSession(user: AuthUser | null): void {
  paused = !user || needsParentalConsent(user);
}
export function isParentalConsentPending(): boolean { return paused; }

/** Mirrors the server filter: reads and parent-account/authentication actions remain available. */
export function isChildDataWrite(endpoint: string, method = 'GET'): boolean {
  if (!['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) return false;
  const path = endpoint.split('?')[0];
  return path === '/v1/children' || path.startsWith('/v1/children/')
    || ['/v1/users/me/progress', '/v1/users/profile', '/v1/users/me', '/v1/musaidi/open'].includes(path)
    || path.startsWith('/v1/learning/') || path.startsWith('/v1/ai/') || path.startsWith('/gemini/');
}
