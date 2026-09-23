import { describe, expect, it } from 'vitest';
import { isPublicApiCacheUrl } from './publicApiCache';

describe('service-worker API cache', () => {
  it('keeps public exams and feature flags available for offline reuse', () => {
    expect(isPublicApiCacheUrl(new URL('https://mssid-dz.com/api/v1/exams/public/list'))).toBe(true);
    expect(isPublicApiCacheUrl(new URL('https://mssid-dz.com/api/v1/feature-flags'))).toBe(true);
  });

  it('never caches account or restricted responses by URL on a shared device', () => {
    for (const path of [
      '/api/v1/users/me',
      '/api/v1/users/me/progress',
      '/api/v1/auth/login',
      '/api/v1/admin/stats/overview',
      '/api/v1/payments/admin/receipts',
      '/api/v1/ai/quota',
      '/api/v1/exams/12/solutions',
      '/api/v1/courses/premium-lessons/math-1',
    ]) {
      expect(isPublicApiCacheUrl(new URL(path, 'https://mssid-dz.com'))).toBe(false);
    }
  });
});
