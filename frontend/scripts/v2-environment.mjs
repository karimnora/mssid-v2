export function resolveV2ApiUrl(env) {
  // Generic V1 variables are deliberately ignored, including on Vercel previews.
  const value = env.VITE_V2_SPRING_BOOT_URL || 'http://localhost:8081/api';
  let url;
  try { url = new URL(value); } catch { throw new Error('V2 API URL is invalid'); }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash || !['http:', 'https:'].includes(url.protocol)
      || (!local && url.protocol !== 'https:') || (local && url.port === '8080')
      || url.hostname === 'mssid-backend.onrender.com' || url.hostname === 'mssid-dz.com'
      || url.hostname.endsWith('.mssid-dz.com') || url.pathname.replace(/\/$/, '') !== '/api') {
    throw new Error('V2 must use its own API, ending in /api; production API is forbidden');
  }
  return url.toString().replace(/\/$/, '');
}
