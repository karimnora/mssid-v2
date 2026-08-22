package dz.mssid.education.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    @DisplayName("handleDataAccessException - masks the raw SQL/constraint detail from the client")
    void handleDataAccessException_masksRawMessage() {
        DataIntegrityViolationException ex = new DataIntegrityViolationException(
                "duplicate key value violates unique constraint \"users_email_key\" on table users");

        ResponseEntity<Map<String, Object>> response = handler.handleDataAccessException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        String message = (String) response.getBody().get("message");
        assertFalse(message.contains("users_email_key"), "constraint name must never reach the client");
        assertFalse(message.contains("SQL"), "no SQL vocabulary should leak into the client-facing message");
    }

    @Test
    @DisplayName("handleRuntimeException - still returns the raw message for ordinary business exceptions")
    void handleRuntimeException_keepsBusinessMessage() {
        RuntimeException ex = new RuntimeException("Cet email est déjà utilisé.");

        ResponseEntity<Map<String, Object>> response = handler.handleRuntimeException(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Cet email est déjà utilisé.", response.getBody().get("message"));
    }

    @Test
    @DisplayName("handleAiQuotaExceeded - returns 429 with limit/remaining, not a generic 400")
    void handleAiQuotaExceeded_returns429() {
        AiQuotaExceededException ex = new AiQuotaExceededException(3, 0, 8);

        ResponseEntity<Map<String, Object>> response = handler.handleAiQuotaExceeded(ex);

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertEquals(429, response.getBody().get("status"));
        assertEquals(3, response.getBody().get("limit"));
        assertEquals(0, response.getBody().get("remaining"));
        assertEquals(8, response.getBody().get("resetHours"));
    }
}
