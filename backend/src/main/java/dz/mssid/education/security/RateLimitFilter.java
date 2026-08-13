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
 * Two tiers:
 * - {@code POST /api/v1/auth/login}: 5 attempts / 15 minutes — brute-force guard.
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
    private static final Window DEFAULT_WINDOW = new Window(60, 60 * 1000L);

    private static final class Counter {
        final AtomicInteger count = new AtomicInteger(0);
        volatile long windowStart = System.currentTimeMillis();
    }

    private final ConcurrentHashMap<String, Counter> loginCounters = new ConcurrentHashMap<>();
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
        boolean isLoginAttempt = "POST".equalsIgnoreCase(request.getMethod()) && path.startsWith("/api/v1/auth/login");

        Window window = isLoginAttempt ? LOGIN_WINDOW : DEFAULT_WINDOW;
        ConcurrentHashMap<String, Counter> bucket = isLoginAttempt ? loginCounters : apiCounters;
        String key = clientIp(request);

        if (isRateLimited(bucket, key, window)) {
            response.setStatus(429);
            response.setContentType("application/json;charset=UTF-8");
            String message = isLoginAttempt
                    ? "Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes."
                    : "Trop de requêtes envoyées. Veuillez ralentir et réessayer dans un instant.";
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
