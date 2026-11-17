package dz.mssid.education.service;

import dz.mssid.education.entity.User;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ParentalConsentService {
    public static final String CURRENT_VERSION = "parental-consent-2026-11-v1";
    private final UserRepository users;

    public static boolean acceptsCurrentVersion(Boolean accepted, String version) {
        return Boolean.TRUE.equals(accepted) && CURRENT_VERSION.equals(version);
    }

    public static void requireAccepted(Boolean accepted, String version) {
        if (!acceptsCurrentVersion(accepted, version)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La confirmation du parent pour la version actuelle est nécessaire.");
        }
    }

    public static boolean hasCurrentConsent(User user) {
        return user != null && user.getParentalConsentAt() != null
                && CURRENT_VERSION.equals(user.getParentalConsentVersion());
    }

    @Transactional
    public User accept(String email, Boolean accepted, String version) {
        requireAccepted(accepted, version);
        User user = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (hasCurrentConsent(user)) return user;
        user.setParentalConsentAt(Instant.now());
        user.setParentalConsentVersion(CURRENT_VERSION);
        return users.save(user);
    }

    /** A verified Google identity may retry with an explicit decision before any account is created. */
    public static class RequiredForGoogleRegistration extends RuntimeException {
        public RequiredForGoogleRegistration() { super("La confirmation du parent est nécessaire avant de créer le compte."); }
    }
}
