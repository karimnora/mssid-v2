package dz.mssid.education.controller;

import dz.mssid.education.dto.AuthResponse;
import dz.mssid.education.dto.LoginRequest;
import dz.mssid.education.dto.RegisterRequest;
import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.entity.User;
import dz.mssid.education.mapper.UserMapper;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.security.AuthCookieConstants;
import dz.mssid.education.security.JwtTokenProvider;
import dz.mssid.education.security.RefreshTokenService;
import dz.mssid.education.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtTokenProvider jwtTokenProvider;

    // SEC-01: the JWT secret/expiration property keys intentionally mirror JwtTokenProvider so the
    // cookie's maxAge always matches the token's real expiry.
    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration-ms:2592000000}")
    private long refreshExpirationMs;

    // Must be false for plain-HTTP local dev (browsers silently drop `Secure` cookies over http) and
    // true in every deployed environment. Override via app.cookie.secure=true in prod config/env.
    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse httpResponse) {
        try {
            AuthResponse response = authService.register(request);
            attachAuthCookie(httpResponse, response.getToken());
            attachRefreshCookie(httpResponse, response.getRefreshToken());
            return ResponseEntity.ok(stripToken(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse httpResponse) {
        try {
            AuthResponse response = authService.login(request);
            attachAuthCookie(httpResponse, response.getToken());
            attachRefreshCookie(httpResponse, response.getRefreshToken());
            return ResponseEntity.ok(stripToken(response));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Identifiants incorrects ou compte introuvable"));
        }
    }

    /**
     * SEC-06: exchanges the (HttpOnly, /api/v1/auth-scoped) refresh cookie for a new access token —
     * called by the frontend when an API call comes back 401 because the 24h access token expired,
     * instead of forcing a full re-login. The refresh token is single-use: this call also rotates it,
     * so a stolen-then-replayed refresh token gets rejected the next time the legitimate client uses it.
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String rawRefreshToken = getCookieValue(httpRequest, AuthCookieConstants.REFRESH_COOKIE_NAME);
        if (rawRefreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Session invalide, veuillez vous reconnecter."));
        }

        RefreshTokenService.RotationResult rotation = refreshTokenService.rotate(rawRefreshToken);
        User user = rotation.user();

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, user.getAuthorities());
        String newAccessToken = jwtTokenProvider.generateToken(authentication);

        attachAuthCookie(httpResponse, newAccessToken);
        attachRefreshCookie(httpResponse, rotation.rawToken());

        UserProfileDto profileDto = UserMapper.toUserProfileDto(user);
        return ResponseEntity.ok(Map.of("user", profileDto));
    }

    /**
     * SEC-01/SEC-06: clears both HttpOnly cookies and revokes the refresh token server-side. Not
     * behind authentication — logging out with an already-expired/missing cookie must still succeed,
     * it's a no-op from the client's point of view.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String rawRefreshToken = getCookieValue(httpRequest, AuthCookieConstants.REFRESH_COOKIE_NAME);
        if (rawRefreshToken != null) {
            refreshTokenService.revoke(rawRefreshToken);
        }

        ResponseCookie expiredCookie = ResponseCookie.from(AuthCookieConstants.COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());

        ResponseCookie expiredRefreshCookie = ResponseCookie.from(AuthCookieConstants.REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path(AuthCookieConstants.REFRESH_COOKIE_PATH)
                .maxAge(0)
                .build();
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, expiredRefreshCookie.toString());

        return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
    }

    // SEC-01: the JWT itself never reaches the JSON body / JS-readable storage — it travels only as
    // an HttpOnly cookie the browser attaches automatically. UserProfileDto (email/nom/role/xp...) is
    // still returned so the frontend can render the freshly-authenticated user immediately.
    private void attachAuthCookie(HttpServletResponse httpResponse, String token) {
        ResponseCookie cookie = ResponseCookie.from(AuthCookieConstants.COOKIE_NAME, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofMillis(jwtExpirationMs))
                .build();
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void attachRefreshCookie(HttpServletResponse httpResponse, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from(AuthCookieConstants.REFRESH_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path(AuthCookieConstants.REFRESH_COOKIE_PATH)
                .maxAge(Duration.ofMillis(refreshExpirationMs))
                .build();
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName()) && cookie.getValue() != null && !cookie.getValue().isBlank()) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private AuthResponse stripToken(AuthResponse response) {
        response.setToken(null);
        response.setAccessToken(null);
        response.setRefreshToken(null);
        return response;
    }
}