package dz.mssid.education.service;

import dz.mssid.education.entity.User;
import dz.mssid.education.mapper.UserMapper;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ParentalConsentServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final ParentalConsentService consent = new ParentalConsentService(users);
    private static final String VERSION = ParentalConsentService.CURRENT_VERSION;

    @Test void rejectsMissingFalseAndStaleDecisionsWithoutWriting() {
        assertThrows(ResponseStatusException.class, () -> consent.accept("parent@example.test", null, VERSION));
        assertThrows(ResponseStatusException.class, () -> consent.accept("parent@example.test", false, VERSION));
        assertThrows(ResponseStatusException.class, () -> consent.accept("parent@example.test", true, "old-version"));
        verifyNoInteractions(users);
    }

    @Test void recordsServerTimeAndCurrentVersionForTheAuthenticatedAccount() {
        User user = User.builder().email("parent@example.test").build();
        when(users.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(users.save(user)).thenReturn(user);
        Instant before = Instant.now();
        assertSame(user, consent.accept(user.getEmail(), true, VERSION));
        assertFalse(user.getParentalConsentAt().isBefore(before));
        assertFalse(user.getParentalConsentAt().isAfter(Instant.now()));
        assertEquals(VERSION, user.getParentalConsentVersion());
        assertFalse(UserMapper.toUserProfileDto(user).getParentalConsentRequired());
        verify(users).save(user);
    }

    @Test void preservesTheOriginalTimestampForAnAlreadyAcceptedVersion() {
        Instant original = Instant.parse("2026-11-15T10:00:00Z");
        User user = User.builder().email("parent@example.test").parentalConsentAt(original).parentalConsentVersion(VERSION).build();
        when(users.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        consent.accept(user.getEmail(), true, VERSION);
        assertEquals(original, user.getParentalConsentAt());
        verify(users, never()).save(any());
    }

    @Test void legacyAndOutdatedAccountsMustConsentAgain() {
        User user = User.builder().email("parent@example.test").build();
        assertTrue(UserMapper.toUserProfileDto(user).getParentalConsentRequired());
        user.setParentalConsentAt(Instant.parse("2020-01-01T00:00:00Z"));
        user.setParentalConsentVersion("old-version");
        assertTrue(UserMapper.toUserProfileDto(user).getParentalConsentRequired());
        when(users.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(users.save(user)).thenReturn(user);
        consent.accept(user.getEmail(), true, VERSION);
        assertTrue(ParentalConsentService.hasCurrentConsent(user));
    }
}
