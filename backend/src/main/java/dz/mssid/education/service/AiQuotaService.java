package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.exception.AiQuotaExceededException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

/**
 * SEC-10: daily Gemini quota keyed by the authenticated account (email + role from the
 * JWT-loaded {@link User}), not by {@code x-user-role} / {@code x-user-id} request headers.
 * Those headers are client-controlled and must never influence billing or access.
 * <p>
 * In-memory, single-instance — same constraint as {@code RateLimitFilter}. Move to Redis
 * if this service is ever replicated.
 */
@Service
public class AiQuotaService {

    public static final int FREE_DAILY_LIMIT = 3;
    public static final int PREMIUM_DAILY_LIMIT = 50;
    public static final int ADMIN_DAILY_LIMIT = 1000;

    private static final long WINDOW_MS = 24L * 60 * 60 * 1000;

    private static final class Window {
        int count;
        long resetAt;
    }

    private final ConcurrentHashMap<String, Window> usage = new ConcurrentHashMap<>();

    public record QuotaSnapshot(boolean allowed, int limit, int remaining, int resetHours) {
    }

    /**
     * Consumes one slot for the JWT principal. Throws 401-mapped if nobody is authenticated,
     * or {@link AiQuotaExceededException} (429) if the daily cap is already used.
     */
    public QuotaSnapshot consumeAuthenticatedUser() {
        UserIdentity identity = resolveIdentityFromSecurityContext();
        QuotaSnapshot snapshot = tryConsume(identity.email(), identity.role());
        if (!snapshot.allowed()) {
            throw new AiQuotaExceededException(snapshot.limit(), snapshot.remaining(), snapshot.resetHours());
        }
        return snapshot;
    }

    public QuotaSnapshot peek(String email, Role.RoleName role) {
        int limit = dailyLimit(role);
        Window window = usage.get(normalizeEmail(email));
        long now = System.currentTimeMillis();
        if (window == null || now >= window.resetAt) {
            return new QuotaSnapshot(true, limit, limit, 24);
        }
        int remaining = Math.max(0, limit - window.count);
        return new QuotaSnapshot(remaining > 0, limit, remaining, hoursLeft(window.resetAt, now));
    }

    QuotaSnapshot tryConsume(String email, Role.RoleName role) {
        int limit = dailyLimit(role);
        String key = normalizeEmail(email);
        long now = System.currentTimeMillis();

        Window window = usage.compute(key, (ignored, existing) -> {
            if (existing == null || now >= existing.resetAt) {
                Window fresh = new Window();
                fresh.count = 0;
                fresh.resetAt = now + WINDOW_MS;
                return fresh;
            }
            return existing;
        });

        synchronized (window) {
            if (now >= window.resetAt) {
                window.count = 0;
                window.resetAt = now + WINDOW_MS;
            }
            if (window.count >= limit) {
                return new QuotaSnapshot(false, limit, 0, hoursLeft(window.resetAt, now));
            }
            window.count++;
            return new QuotaSnapshot(true, limit, limit - window.count, hoursLeft(window.resetAt, now));
        }
    }

    void clearForTests() {
        usage.clear();
    }

    private UserIdentity resolveIdentityFromSecurityContext() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null
                || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AuthenticationCredentialsNotFoundException("Connexion requise pour utiliser l'assistant IA.");
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof User user) {
            Role.RoleName role = (user.getRole() != null && user.getRole().getName() != null)
                    ? user.getRole().getName()
                    : Role.RoleName.ROLE_FREE;
            String email = user.getEmail() != null ? user.getEmail() : user.getUsername();
            return new UserIdentity(email, role);
        }

        // UserDetails from the JWT filter is our User entity today. A non-User principal
        // still keys quota by the authenticated name and defaults to FREE — never a client header.
        return new UserIdentity(auth.getName(), Role.RoleName.ROLE_FREE);
    }

    private static int dailyLimit(Role.RoleName role) {
        if (role == Role.RoleName.ROLE_ADMIN) {
            return ADMIN_DAILY_LIMIT;
        }
        if (role == Role.RoleName.ROLE_PREMIUM) {
            return PREMIUM_DAILY_LIMIT;
        }
        return FREE_DAILY_LIMIT;
    }

    private static String normalizeEmail(String email) {
        return email == null ? "unknown" : email.trim().toLowerCase();
    }

    private static int hoursLeft(long resetAt, long now) {
        return Math.max(1, (int) Math.ceil((resetAt - now) / (1000.0 * 60 * 60)));
    }

    private record UserIdentity(String email, Role.RoleName role) {
    }
}
