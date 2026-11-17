package dz.mssid.education.security;

import dz.mssid.education.entity.User;
import dz.mssid.education.service.ParentalConsentService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

/** Runs inside Spring Security after JWT authentication, never as a separate servlet filter. */
public class ParentalConsentFilter extends OncePerRequestFilter {
    private static final Set<String> WRITES = Set.of("POST", "PUT", "PATCH");

    public static boolean protects(String method, String path) {
        if (!WRITES.contains(method)) return false;
        return path.equals("/api/v1/children") || path.startsWith("/api/v1/children/")
                || path.equals("/api/v1/users/me/progress") || path.equals("/api/v1/users/profile")
                || path.equals("/api/v1/users/me") || path.startsWith("/api/v1/learning/")
                || path.equals("/api/v1/musaidi/open") || path.startsWith("/api/v1/ai/")
                || path.startsWith("/api/gemini/");
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        if (path == null || path.isEmpty()) {
            path = request.getRequestURI().substring(request.getContextPath().length());
        }
        return !protects(request.getMethod(), path);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)
                && (!(auth.getPrincipal() instanceof User user) || !ParentalConsentService.hasCurrentConsent(user))) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":\"PARENTAL_CONSENT_REQUIRED\",\"message\":\"La confirmation du parent est nécessaire avant de synchroniser les données.\"}");
            return;
        }
        chain.doFilter(request, response);
    }
}
