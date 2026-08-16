package dz.mssid.education.security;

import dz.mssid.education.entity.RefreshToken;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    private RefreshTokenService refreshTokenService;
    private User testUser;

    @BeforeEach
    void setUp() {
        refreshTokenService = new RefreshTokenService(refreshTokenRepository);
        ReflectionTestUtils.setField(refreshTokenService, "refreshExpirationMs", 2_592_000_000L);

        testUser = User.builder()
                .id(1L)
                .nom("Omar Testeur")
                .email("omar@mssid.dz")
                .passwordHash("encoded")
                .role(new Role(1L, Role.RoleName.ROLE_FREE))
                .build();
    }

    @Test
    @DisplayName("createToken - persists a hashed, non-expired token and returns the raw value")
    void createToken_persistsHashedToken() {
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(inv -> inv.getArgument(0));

        String rawToken = refreshTokenService.createToken(testUser);

        ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(captor.capture());
        RefreshToken saved = captor.getValue();

        assertNotNull(rawToken);
        assertNotEquals(rawToken, saved.getTokenHash(), "the raw token must never be stored verbatim");
        assertEquals(64, saved.getTokenHash().length(), "SHA-256 hex digest is 64 chars");
        assertFalse(saved.isRevoked());
        assertTrue(saved.getExpiresAt().isAfter(LocalDateTime.now()));
        assertEquals(testUser, saved.getUser());
    }

    @Test
    @DisplayName("rotate - valid token is revoked and a fresh one is issued for the same user")
    void rotate_validToken_revokesAndReissues() {
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(inv -> inv.getArgument(0));
        String rawToken = refreshTokenService.createToken(testUser);

        ArgumentCaptor<RefreshToken> firstSaveCaptor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(firstSaveCaptor.capture());
        RefreshToken stored = firstSaveCaptor.getValue();

        when(refreshTokenRepository.findByTokenHash(stored.getTokenHash())).thenReturn(Optional.of(stored));

        RefreshTokenService.RotationResult result = refreshTokenService.rotate(rawToken);

        assertEquals(testUser, result.user());
        assertNotEquals(rawToken, result.rawToken(), "rotation must issue a different token");
        assertTrue(stored.isRevoked(), "the consumed token must be marked revoked");
        // 1 save from createToken() above + 1 save revoking `stored` + 1 save for the reissued token
        verify(refreshTokenRepository, times(3)).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("rotate - unknown token throws BadCredentialsException")
    void rotate_unknownToken_throws() {
        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> refreshTokenService.rotate("unknown-raw-token"));
    }

    @Test
    @DisplayName("rotate - expired token throws BadCredentialsException")
    void rotate_expiredToken_throws() {
        RefreshToken expired = RefreshToken.builder()
                .id(1L)
                .tokenHash("irrelevant-in-this-test")
                .user(testUser)
                .expiresAt(LocalDateTime.now().minusDays(1))
                .revoked(false)
                .build();
        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.of(expired));

        assertThrows(BadCredentialsException.class, () -> refreshTokenService.rotate("some-raw-token"));
    }

    @Test
    @DisplayName("rotate - already revoked token throws BadCredentialsException")
    void rotate_revokedToken_throws() {
        RefreshToken revoked = RefreshToken.builder()
                .id(1L)
                .tokenHash("irrelevant-in-this-test")
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusDays(1))
                .revoked(true)
                .build();
        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.of(revoked));

        assertThrows(BadCredentialsException.class, () -> refreshTokenService.rotate("some-raw-token"));
    }

    @Test
    @DisplayName("revoke - marks the matching token as revoked")
    void revoke_marksTokenRevoked() {
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(inv -> inv.getArgument(0));
        String rawToken = refreshTokenService.createToken(testUser);

        ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(captor.capture());
        RefreshToken stored = captor.getValue();
        when(refreshTokenRepository.findByTokenHash(stored.getTokenHash())).thenReturn(Optional.of(stored));

        refreshTokenService.revoke(rawToken);

        assertTrue(stored.isRevoked());
    }

    @Test
    @DisplayName("revoke - silently no-ops when the token is unknown")
    void revoke_unknownToken_noException() {
        when(refreshTokenRepository.findByTokenHash(any())).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> refreshTokenService.revoke("unknown-raw-token"));
        verify(refreshTokenRepository, never()).save(any());
    }
}
