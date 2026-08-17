package dz.mssid.education.service;

import dz.mssid.education.entity.PasswordResetCode;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.PasswordResetCodeRepository;
import dz.mssid.education.repository.RefreshTokenRepository;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private PasswordResetCodeRepository codeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private ResendEmailService resendEmailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    private PasswordResetService passwordResetService;
    private User testUser;

    @BeforeEach
    void setUp() {
        passwordResetService = new PasswordResetService(
                codeRepository, userRepository, refreshTokenRepository, resendEmailService, passwordEncoder);
        testUser = User.builder()
                .id(1L)
                .nom("Omar Testeur")
                .email("omar@mssid.dz")
                .passwordHash("old_encoded")
                .role(new Role(1L, Role.RoleName.ROLE_FREE))
                .build();
    }

    @Test
    @DisplayName("requestReset - unknown email silently no-ops (no enumeration signal)")
    void requestReset_unknownEmail_noOps() {
        when(userRepository.findByEmail("ghost@mssid.dz")).thenReturn(Optional.empty());

        passwordResetService.requestReset("ghost@mssid.dz");

        verifyNoInteractions(resendEmailService);
        verify(codeRepository, never()).save(any());
    }

    @Test
    @DisplayName("requestReset - known email generates and emails a hashed 6-digit code")
    void requestReset_knownEmail_sendsCode() {
        when(userRepository.findByEmail("omar@mssid.dz")).thenReturn(Optional.of(testUser));
        when(codeRepository.findByUserAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(eq(testUser), any()))
                .thenReturn(List.of());
        when(codeRepository.save(any(PasswordResetCode.class))).thenAnswer(inv -> inv.getArgument(0));

        passwordResetService.requestReset("omar@mssid.dz");

        ArgumentCaptor<PasswordResetCode> captor = ArgumentCaptor.forClass(PasswordResetCode.class);
        verify(codeRepository).save(captor.capture());
        PasswordResetCode saved = captor.getValue();
        assertEquals(64, saved.getCodeHash().length(), "SHA-256 hex digest is 64 chars");
        assertFalse(saved.isConsumed());

        verify(resendEmailService).sendHtmlEmail(eq("omar@mssid.dz"), anyString(),
                argThat(html -> html.matches("(?s).*\\b\\d{6}\\b.*") && !html.contains(saved.getCodeHash())));
    }

    @Test
    @DisplayName("requestReset - within cooldown silently no-ops")
    void requestReset_withinCooldown_noOps() {
        PasswordResetCode recent = PasswordResetCode.builder()
                .id(1L).codeHash("irrelevant").user(testUser)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .consumed(false)
                .createdAt(LocalDateTime.now().minusSeconds(5))
                .build();
        when(userRepository.findByEmail("omar@mssid.dz")).thenReturn(Optional.of(testUser));
        when(codeRepository.findByUserAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(eq(testUser), any()))
                .thenReturn(List.of(recent));

        passwordResetService.requestReset("omar@mssid.dz");

        verifyNoInteractions(resendEmailService);
        verify(codeRepository, never()).save(any());
    }

    @Test
    @DisplayName("resetPassword - valid code updates the password hash and wipes existing sessions")
    void resetPassword_validCode_updatesPasswordAndRevokesSessions() {
        PasswordResetCode stored = PasswordResetCode.builder()
                .id(1L).codeHash(sha256("654321")).user(testUser)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .consumed(false)
                .build();
        when(userRepository.findByEmail("omar@mssid.dz")).thenReturn(Optional.of(testUser));
        when(codeRepository.findByCodeHashAndUser(sha256("654321"), testUser)).thenReturn(Optional.of(stored));
        when(passwordEncoder.encode("NewPass123!")).thenReturn("new_encoded");

        boolean result = passwordResetService.resetPassword("omar@mssid.dz", "654321", "NewPass123!");

        assertTrue(result);
        assertTrue(stored.isConsumed());
        assertEquals("new_encoded", testUser.getPasswordHash());
        verify(userRepository).save(testUser);
        verify(refreshTokenRepository).deleteByUser(testUser);
    }

    @Test
    @DisplayName("resetPassword - unknown email is rejected without a code lookup")
    void resetPassword_unknownEmail_rejected() {
        when(userRepository.findByEmail("ghost@mssid.dz")).thenReturn(Optional.empty());

        boolean result = passwordResetService.resetPassword("ghost@mssid.dz", "654321", "NewPass123!");

        assertFalse(result);
        verifyNoInteractions(codeRepository, refreshTokenRepository);
    }

    @Test
    @DisplayName("resetPassword - unknown code is rejected, password untouched")
    void resetPassword_unknownCode_rejected() {
        when(userRepository.findByEmail("omar@mssid.dz")).thenReturn(Optional.of(testUser));
        when(codeRepository.findByCodeHashAndUser(anyString(), eq(testUser))).thenReturn(Optional.empty());

        boolean result = passwordResetService.resetPassword("omar@mssid.dz", "000000", "NewPass123!");

        assertFalse(result);
        assertEquals("old_encoded", testUser.getPasswordHash());
        verifyNoInteractions(refreshTokenRepository);
    }

    @Test
    @DisplayName("resetPassword - expired code is rejected")
    void resetPassword_expiredCode_rejected() {
        PasswordResetCode expired = PasswordResetCode.builder()
                .id(1L).codeHash(sha256("654321")).user(testUser)
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .consumed(false)
                .build();
        when(userRepository.findByEmail("omar@mssid.dz")).thenReturn(Optional.of(testUser));
        when(codeRepository.findByCodeHashAndUser(sha256("654321"), testUser)).thenReturn(Optional.of(expired));

        assertFalse(passwordResetService.resetPassword("omar@mssid.dz", "654321", "NewPass123!"));
        assertEquals("old_encoded", testUser.getPasswordHash());
    }

    @Test
    @DisplayName("resetPassword - already-consumed code is rejected (single use)")
    void resetPassword_alreadyConsumed_rejected() {
        PasswordResetCode consumed = PasswordResetCode.builder()
                .id(1L).codeHash(sha256("654321")).user(testUser)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .consumed(true)
                .build();
        when(userRepository.findByEmail("omar@mssid.dz")).thenReturn(Optional.of(testUser));
        when(codeRepository.findByCodeHashAndUser(sha256("654321"), testUser)).thenReturn(Optional.of(consumed));

        assertFalse(passwordResetService.resetPassword("omar@mssid.dz", "654321", "NewPass123!"));
    }

    private static String sha256(String raw) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(raw.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(hashed);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
