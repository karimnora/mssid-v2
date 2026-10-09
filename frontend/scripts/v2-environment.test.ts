import { describe, expect, it } from 'vitest';
import { resolveV2ApiUrl } from './v2-environment.mjs';
describe('V2 environment isolation', () => {
  it('ignores a production URL inherited through the generic V1 variable', () => {
    expect(resolveV2ApiUrl({ VITE_SPRING_BOOT_URL: 'https://mssid-backend.onrender.com/api' })).toBe('http://localhost:8081/api');
  });
  it('accepts a separate HTTPS preview backend', () => {
    expect(resolveV2ApiUrl({ VITE_V2_SPRING_BOOT_URL: 'https://mssid-backend-v2.onrender.com/api/' })).toBe('https://mssid-backend-v2.onrender.com/api');
  });
  it.each(['https://mssid-backend.onrender.com/api', 'https://api.mssid-dz.com/api',
    'http://localhost:8080/api', 'http://test.example.com/api', 'https://test.example.com',
    'https://user:password@test.example.com/api', 'https://test.example.com/api?key=secret'])('refuses unsafe test API %s', url => {
    expect(() => resolveV2ApiUrl({ VITE_V2_SPRING_BOOT_URL: url })).toThrow();
  });
});
