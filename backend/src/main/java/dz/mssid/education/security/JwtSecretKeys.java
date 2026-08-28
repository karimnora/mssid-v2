package dz.mssid.education.security;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Turns {@code JWT_SECRET} into an HS256 key (≥ 256 bits).
 * <p>
 * Render's {@code generateValue: true} yields a random printable string, not necessarily
 * Base64. Older deploys may already store a real Base64 blob. Accept both: prefer a Base64
 * decode that yields ≥ 32 bytes (keeps existing Render secrets working), otherwise use the
 * raw UTF-8 bytes when they are long enough. Anything shorter fails fast at boot.
 */
final class JwtSecretKeys {

    static final int MIN_KEY_BYTES = 32;

    private JwtSecretKeys() {}

    static SecretKey fromSecret(String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "JWT_SECRET is blank. Set a random value of at least 32 bytes "
                            + "(e.g. openssl rand -base64 32) before starting this application.");
        }

        byte[] utf8 = secret.trim().getBytes(StandardCharsets.UTF_8);
        byte[] base64 = tryDecodeBase64(secret.trim());

        byte[] keyBytes;
        if (base64 != null && base64.length >= MIN_KEY_BYTES) {
            keyBytes = base64;
        } else if (utf8.length >= MIN_KEY_BYTES) {
            keyBytes = utf8;
        } else {
            throw new IllegalStateException(
                    "JWT_SECRET is too short for HS256 (need ≥ 32 bytes, or a Base64 encoding of "
                            + "≥ 32 bytes). Generate one with: openssl rand -base64 32");
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    private static byte[] tryDecodeBase64(String secret) {
        try {
            return Decoders.BASE64.decode(secret);
        } catch (RuntimeException ignored) {
            return null;
        }
    }
}
