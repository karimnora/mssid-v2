/** Only unauthenticated, shared GET endpoints may use a URL-keyed service-worker cache. */
export function isPublicApiCacheUrl(url: URL): boolean {
  return url.pathname.startsWith('/api/v1/exams/public/') ||
    url.pathname === '/api/v1/feature-flags';
}
