package dz.mssid.education.controller;

import dz.mssid.education.dto.AuthResponse;
import dz.mssid.education.dto.LoginRequest;
import dz.mssid.education.dto.RegisterRequest;
import dz.mssid.education.dto.UserDto;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.security.AuthCookieConstants;
import dz.mssid.education.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
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

    // SEC-01: the JWT secret/expiration property keys intentionally mirror JwtTokenProvider so the
    // cookie's maxAge always matches the token's real expiry.
    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    // Must be false for plain-HTTP local dev (browsers silently drop `Secure` cookies over http) and
    // true in every deployed environment. Override via app.cookie.secure=true in prod config/env.
    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse httpResponse) {
        try {
            AuthResponse response = authService.register(request);
            attachAuthCookie(httpResponse, response.getToken());
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
            return ResponseEntity.ok(stripToken(response));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Identifiants incorrects ou compte introuvable"));
        }
    }

    /**
     * SEC-01: clears the HttpOnly auth cookie. Not behind authentication — logging out with an
     * already-expired/missing cookie must still succeed, it's a no-op from the client's point of view.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse httpResponse) {
        ResponseCookie expiredCookie = ResponseCookie.from(AuthCookieConstants.COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
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

    private AuthResponse stripToken(AuthResponse response) {
        response.setToken(null);
        response.setAccessToken(null);
        return response;
    }
}