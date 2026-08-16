package dz.mssid.education.security;

import dz.mssid.education.entity.RefreshToken;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

/**
 * SEC-06: opaque, DB-backed refresh tokens — deliberately decoupled from JwtTokenProvider's signed
 * access tokens rather than reusing JWTs for both roles. Rotation is single-use: every successful
 * refresh revokes the token it consumed and issues a brand new one, so replaying an already-used
 * (e.g. stolen-then-legitimately-used) token is rejected outright instead of silently re-authenticated.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.jwt.refresh-expiration-ms:2592000000}") // 30 jours par défaut
    private long refreshExpirationMs;

    public String createToken(User user) {
        String rawToken = generateRawToken();
        RefreshToken entity = RefreshToken.builder()
                .tokenHash(hash(rawToken))
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000))
                .revoked(false)
                .build();
        refreshTokenRepository.save(entity);
        return rawToken;
    }

    /**
     * Validates `rawToken`, revokes it, and issues a fresh one for the same user. Throws
     * BadCredentialsException (mapped to 401 by GlobalExceptionHandler) when the token is unknown,
     * expired, or already revoked — the caller (AuthController) responds by forcing a fresh login
     * rather than trusting a token that looks reused.
     */
    @Transactional
    public RotationResult rotate(String rawToken) {
        RefreshToken existing = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new BadCredentialsException("Session invalide, veuillez vous reconnecter."));

        if (existing.isRevoked() || existing.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadCredentialsException("Session expirée, veuillez vous reconnecter.");
        }

        existing.setRevoked(true);
        refreshTokenRepository.save(existing);

        String newRawToken = createToken(existing.getUser());
        return new RotationResult(existing.getUser(), newRawToken);
    }

    public void revoke(String rawToken) {
        refreshTokenRepository.findByTokenHash(hash(rawToken)).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    private String generateRawToken() {
        byte[] bytes = new byte[48];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 non disponible sur cette JVM", e);
        }
    }

    public record RotationResult(User user, String rawToken) {
    }
}
