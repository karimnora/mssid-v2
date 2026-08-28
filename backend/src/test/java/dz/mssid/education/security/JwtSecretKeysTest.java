package dz.mssid.education.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtSecretKeysTest {

    @Test
    @DisplayName("rejects blank and too-short secrets")
    void rejectsWeakSecrets() {
        assertThrows(IllegalStateException.class, () -> JwtSecretKeys.fromSecret(null));
        assertThrows(IllegalStateException.class, () -> JwtSecretKeys.fromSecret("   "));
        assertThrows(IllegalStateException.class, () -> JwtSecretKeys.fromSecret("short"));
    }

    @Test
    @DisplayName("accepts a long raw UTF-8 secret (Render generateValue style)")
    void acceptsLongRawSecret() {
        assertDoesNotThrow(() -> JwtSecretKeys.fromSecret(
                "TestOnlyJwtSecretNeverUsedOutsideTheTestSuite2026XYZ"));
    }

    @Test
    @DisplayName("accepts a Base64 encoding of 32 random bytes")
    void acceptsBase64Secret() {
        byte[] raw = new byte[32];
        for (int i = 0; i < raw.length; i++) {
            raw[i] = (byte) (i + 7);
        }
        String encoded = Base64.getEncoder().encodeToString(raw);
        assertDoesNotThrow(() -> JwtSecretKeys.fromSecret(encoded));
    }
}
