package dz.mssid.education.config;

import dz.mssid.education.security.JwtAuthenticationFilter;
import dz.mssid.education.security.RateLimitFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final RateLimitFilter rateLimitFilter;
    private final AuthenticationProvider authenticationProvider;

    @Value("${app.cors.allowed-origins}")
    private String allowedOriginsProperty;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // 1. Autoriser toutes les requêtes Preflight OPTIONS (évite le 403/401 CORS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Endpoints publics
                        .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                        .requestMatchers("/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/google", "/api/v1/auth/logout", "/api/v1/auth/refresh").permitAll()
                        .requestMatchers("/api/v1/auth/forgot-password", "/api/v1/auth/reset-password").permitAll()
                        .requestMatchers("/api/v1/exams/public/**").permitAll()
                        // SEC-10: /api/v1/ai/** and /api/gemini/** require a JWT cookie (anyRequest
                        // authenticated below). Quota is then keyed by the loaded User role — never
                        // by client-supplied x-user-role / x-user-id headers.
                        // Admin Console: every visitor's client (not just admins) hydrates local
                        // feature-flag overrides from this at boot — see FeatureFlagController.
                        .requestMatchers(HttpMethod.GET, "/api/v1/feature-flags").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/android-release").permitAll()
                        // T2/T3 bodies live here (out of the JS bundle). The controller itself
                        // returns 403 when the trimester paywall flags are on; while they are off
                        // (free-launch window) guests must still be able to read the lesson.
                        .requestMatchers(HttpMethod.GET, "/api/v1/courses/premium-lessons/**").permitAll()

                        // "Nous contacter" — a guest/parent with no account must be able to send feedback.
                        .requestMatchers(HttpMethod.POST, "/api/v1/contact").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/analytics/premium-funnel").permitAll()

                        // Weekly report e-mail: the stop link is opened from a mail client, without a session.
                        // It is signed per user (WeeklyReportService.tokenFor).
                        .requestMatchers(HttpMethod.GET, "/api/v1/reports/unsubscribe").permitAll()

                        .anyRequest().authenticated()
                )
                // SEC-01: /logout above is intentionally permitAll — clearing an HttpOnly cookie must
                // succeed even if it's already missing/expired, it's a no-op from the client's side.
                // Gestion de l'erreur 401 en inline (Remplace JwtAuthenticationEntryPoint)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("{\"error\": \"Non autorisé: " + authException.getMessage() + "\"}");
                        })
                )
                .authenticationProvider(authenticationProvider)
                // Register jwtAuthFilter FIRST, anchored to a well-known Spring Security filter class
                // (UsernamePasswordAuthenticationFilter) — this is what makes Spring's internal
                // FilterOrderRegistration learn JwtAuthenticationFilter's position in the chain.
                // rateLimitFilter can then validly reference JwtAuthenticationFilter.class as its own
                // anchor below. Doing this in the opposite order throws "The Filter class
                // JwtAuthenticationFilter does not have a registered order" — Spring can't insert
                // something "before" a custom filter class it hasn't seen registered yet.
                //
                // SEC-03: rate limiting still runs before JWT processing so it also protects the
                // unauthenticated /login brute-force surface, not just already-authenticated calls.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(rateLimitFilter, JwtAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // SEC: was setAllowedOriginPatterns(List.of("*")) — a wildcard combined with
        // allowCredentials(true) lets any third-party site replay an authenticated request using a
        // logged-in child's session cookie. Now restricted to app.cors.allowed-origins (see
        // application.properties / CORS_ALLOWED_ORIGINS).
        List<String> allowedOrigins = Arrays.stream(allowedOriginsProperty.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}