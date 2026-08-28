package dz.mssid.education.exception;

import io.sentry.Sentry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Intercepte les erreurs de validation des DTOs (@Valid / @Email / @NotBlank)
     * et renvoie un statut 400 Bad Request avec les messages explicites par champ.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("error", "Bad Request");
        response.put("message", fieldErrors.getOrDefault("email", "Erreur de validation des données transmises."));
        response.put("errors", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * SEC-10: daily Gemini quota exhausted for the authenticated account (role from JWT, not headers).
     */
    @ExceptionHandler(AiQuotaExceededException.class)
    public ResponseEntity<Map<String, Object>> handleAiQuotaExceeded(AiQuotaExceededException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of(
                "status", 429,
                "error", "Too Many Requests",
                "message", ex.getMessage(),
                "limit", ex.getLimit(),
                "remaining", ex.getRemaining(),
                "resetHours", ex.getResetHours()
        ));
    }

    /**
     * Intercepte les erreurs d'authentification (ex: mauvais mot de passe ou utilisateur introuvable)
     * et renvoie un statut 401 Unauthorized avec un message clair.
     */
    @ExceptionHandler({org.springframework.security.authentication.BadCredentialsException.class, org.springframework.security.core.AuthenticationException.class})
    public ResponseEntity<Map<String, Object>> handleBadCredentials(Exception ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "status", 401,
                "error", "Unauthorized",
                "message", "Identifiants incorrects ou compte introuvable"
        ));
    }

    /**
     * Intercepte les erreurs d'accès aux données (contraintes SQL violées, colonnes/tables introuvables,
     * timeouts base...) AVANT le handler RuntimeException générique ci-dessous — Spring choisit le
     * handler le plus spécifique pour le type de l'exception, donc celui-ci prend le dessus pour toute
     * DataAccessException même si RuntimeException est aussi déclaré. Message générique côté client :
     * ex.getMessage() sur ce type peut contenir des noms de colonnes/contraintes internes (SEC).
     * Le détail complet part dans les logs serveur pour le diagnostic.
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDataAccessException(DataAccessException ex) {
        log.error("Erreur d'accès aux données non gérée explicitement", ex);
        // Sentry (Phase 190): this @ExceptionHandler swallows the exception before Spring/Sentry's
        // own resolver would ever see it, so it must be reported explicitly. No-op if sentry.dsn
        // is blank (see application.properties). Always a real bug/infra issue, never noise.
        Sentry.captureException(ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", 500,
                "error", "Internal Server Error",
                "message", "Une erreur interne est survenue. Veuillez réessayer plus tard."
        ));
    }

    /**
     * Intercepte les exceptions métier génériques (ex: email déjà utilisé, utilisateur introuvable).
     * Sentry (Phase 190): captured here too even though this handler also carries expected
     * business-rule rejections (email taken, etc.) alongside real bugs — there's no reliable way to
     * tell them apart generically at this layer. Mute the specific issue in the Sentry dashboard
     * once you recognize a business-rule message repeating; missing an actual bug here would be the
     * worse failure mode.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Sentry.captureException(ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", ex.getMessage()
        ));
    }
}
