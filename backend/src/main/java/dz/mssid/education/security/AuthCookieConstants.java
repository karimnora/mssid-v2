package dz.mssid.education.security;

/**
 * Shared cookie name between {@link dz.mssid.education.controller.AuthController} (which sets it)
 * and {@link JwtAuthenticationFilter} (which reads it) — kept in one place so the two never drift apart.
 */
public final class AuthCookieConstants {

    public static final String COOKIE_NAME = "mssid_auth_token";

    // SEC-06: the refresh cookie is scoped to a narrower path than the access-token cookie — the
    // browser only ever attaches it to /api/v1/auth/** calls (refresh, logout), never to every API
    // request, shrinking its exposure surface compared to the access token.
    public static final String REFRESH_COOKIE_NAME = "mssid_refresh_token";
    public static final String REFRESH_COOKIE_PATH = "/api/v1/auth";

    private AuthCookieConstants() {
    }
}
