package dz.mssid.education.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:MssidDzSuperSecretKeyForJWTAuthentication20261234567890}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}") // Expire après 24 heures (en millisecondes)
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
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