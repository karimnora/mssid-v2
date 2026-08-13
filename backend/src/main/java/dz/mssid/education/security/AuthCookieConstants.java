package dz.mssid.education.security;

/**
 * Shared cookie name between {@link dz.mssid.education.controller.AuthController} (which sets it)
 * and {@link JwtAuthenticationFilter} (which reads it) — kept in one place so the two never drift apart.
 */
public final class AuthCookieConstants {

    public static final String COOKIE_NAME = "mssid_auth_token";

    private AuthCookieConstants() {
    }
}
