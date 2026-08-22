import { afterEach, describe, expect, it } from 'vitest';
import { getStoredLocale, setStoredLocale } from './localePreference';

describe('localePreference', () => {
  afterEach(() => {
    setStoredLocale('ar');
    localStorage.removeItem('mssid_locale_preference');
    setStoredLocale('ar');
  });

  it('defaults to Arabic and never reads navigator.language', () => {
    localStorage.clear();
    setStoredLocale('ar');
    expect(getStoredLocale()).toBe('ar');
  });

  it('persists an explicit French choice only', () => {
    setStoredLocale('fr');
    expect(getStoredLocale()).toBe('fr');
    expect(localStorage.getItem('mssid_locale_preference')).toBe('fr');
  });
});
