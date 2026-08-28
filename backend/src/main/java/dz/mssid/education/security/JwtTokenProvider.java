package dz.mssid.education.security;

import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Set;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:MssidDzSuperSecretKeyForJWTAuthentication20261234567890}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}") // Expire après 24 heures (en millisecondes)
    private long jwtExpirationMs;

    // SEC: both of these strings are committed to git (this file's own fallback default, plus
    // application.properties' separate JWT_SECRET fallback) — public knowledge. Before this guard,
    // any environment that forgot to set JWT_SECRET (a fresh staging box, a local docker-compose run)
    // would silently sign tokens with a key anyone can read on GitHub, letting an attacker forge a
    // valid auth token for any user. Render's production deployment already sets a real JWT_SECRET,
    // so this fails fast only in the misconfigured case it exists to catch.
    private static final Set<String> KNOWN_PUBLIC_DEFAULTS = Set.of(
            "MssidDzSuperSecretKeyForJWTAuthentication20261234567890",
            "MssidDzSecretKeyForJWTAuth2026AlgerianEducationPortal"
    );

    private SecretKey signingKey;

    @PostConstruct
    void validateSecretIsNotThePublicDefault() {
        if (KNOWN_PUBLIC_DEFAULTS.contains(jwtSecret)) {
            throw new IllegalStateException(
                    "app.jwt.secret is set to a default value that is publicly visible in this repository's " +
                    "source code. Set a real, random JWT_SECRET environment variable before starting this " +
                    "application — otherwise anyone can forge a valid authentication token."
            );
        }
        // Resolves Base64 *or* a long raw string (Render generateValue) and fails fast if too short.
        this.signingKey = JwtSecretKeys.fromSecret(jwtSecret);
    }

    private SecretKey getSigningKey() {
        return signingKey;
    }

    /**
     * Génère un token JWT à partir de l'authentification
     */
    public String generateToken(Authentication authentication) {

        String username = authentication.getName();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Extrait le nom d'utilisateur (Subject / Email) du Token JWT
     */
    public String getUsernameFromJwt(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * Valide le Token JWT
     * - signature
     * - expiration
     * - format
     */
    public boolean validateToken(String token) {

        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (SignatureException ex) {
            System.out.println("Signature JWT invalide");
        } catch (MalformedJwtException ex) {
            System.out.println("Token JWT invalide");
        } catch (ExpiredJwtException ex) {
            System.out.println("Token JWT expiré");
        } catch (UnsupportedJwtException ex) {
            System.out.println("Token JWT non supporté");
        } catch (IllegalArgumentException ex) {
            System.out.println("Chaîne claims JWT vide");
        }
        return false;
    }

}