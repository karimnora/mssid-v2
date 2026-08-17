package dz.mssid.education.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * SEC-03: fixed-window rate limiter, keyed by client IP.
 * <p>
 * Deliberately dependency-free (no Bucket4j/Redis) — this backend runs as a single instance today,
 * so an in-memory counter is correct and easy to verify without a build toolchain. If this ever runs
 * behind multiple instances, these counters must move to a shared store (Redis) since each instance
 * would otherwise track its own independent window, defeating the limit.
 * <p>
 * Four tiers:
 * - {@code POST /api/v1/auth/login}: 5 attempts / 15 minutes — brute-force guard.
 * - {@code POST /api/v1/auth/forgot-password}: 3 requests / 15 minutes per IP — this endpoint
 *   triggers an outbound email per call, so without this an attacker could bombard the Resend
 *   quota/reputation just by hammering the endpoint (it's unauthenticated by necessity). Combined
 *   with PasswordResetService's own 60s per-account cooldown, which caps abuse of a single target
 *   email regardless of which IP it comes from.
 * - {@code POST /api/v1/auth/reset-password}: 10 attempts / 15 minutes per IP — the reset code is
 *   only 6 digits (1e6 possibilities); this doesn't make brute-forcing it feasible on its own, but
 *   it removes the "just script it" trivial case on top of the code's own 15-minute expiry.
 * - Everything else under {@code /api/**}: 60 requests / minute — general abuse/scraping guard
 *   (this also covers the currently-unauthenticated {@code /api/gemini/**} and {@code /api/v1/ai/**}
 *   endpoints, which had no abuse protection at all).
 * <p>
 * Known limitation: the per-IP counters are never evicted, so memory grows slowly with the number of
 * distinct IPs seen over the process lifetime. Acceptable for a first hardening pass; a production
 * deployment under sustained traffic should swap this for a TTL-aware cache (Caffeine) or Bucket4j+Redis.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private record Window(int limit, long windowMs) {
    }

    private static final Window LOGIN_WINDOW = new Window(5, 15 * 60 * 1000L);
    private static final Window FORGOT_PASSWORD_WINDOW = new Window(3, 15 * 60 * 1000L);
    private static final Window RESET_PASSWORD_WINDOW = new Window(10, 15 * 60 * 1000L);
    private static final Window DEFAULT_WINDOW = new Window(60, 60 * 1000L);

    private static final class Counter {
        final AtomicInteger count = new AtomicInteger(0);
        volatile long windowStart = System.currentTimeMillis();
    }

    private final ConcurrentHashMap<String, Counter> loginCounters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Counter> forgotPasswordCounters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Counter> resetPasswordCounters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Counter> apiCounters = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return !path.startsWith("/api/") || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        boolean isPost = "POST".equalsIgnoreCase(request.getMethod());
        boolean isLoginAttempt = isPost && path.startsWith("/api/v1/auth/login");
        boolean isForgotPassword = isPost && path.startsWith("/api/v1/auth/forgot-password");
        boolean isResetPassword = isPost && path.startsWith("/api/v1/auth/reset-password");

        Window window;
        ConcurrentHashMap<String, Counter> bucket;
        String message;
        if (isLoginAttempt) {
            window = LOGIN_WINDOW;
            bucket = loginCounters;
            message = "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.";
        } else if (isForgotPassword) {
            window = FORGOT_PASSWORD_WINDOW;
            bucket = forgotPasswordCounters;
            message = "Trop de demandes de réinitialisation. Veuillez réessayer dans 15 minutes.";
        } else if (isResetPassword) {
            window = RESET_PASSWORD_WINDOW;
            bucket = resetPasswordCounters;
            message = "Trop de tentatives. Veuillez réessayer dans 15 minutes.";
        } else {
            window = DEFAULT_WINDOW;
            bucket = apiCounters;
            message = "Trop de requêtes envoyées. Veuillez ralentir et réessayer dans un instant.";
        }

        String key = clientIp(request);

        if (isRateLimited(bucket, key, window)) {
            response.setStatus(429);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"message\": \"" + message + "\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(ConcurrentHashMap<String, Counter> bucket, String key, Window window) {
        long now = System.currentTimeMillis();
        Counter counter = bucket.computeIfAbsent(key, k -> new Counter());

        synchronized (counter) {
            if (now - counter.windowStart > window.windowMs()) {
                counter.windowStart = now;
                counter.count.set(0);
            }
            return counter.count.incrementAndGet() > window.limit();
        }
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
