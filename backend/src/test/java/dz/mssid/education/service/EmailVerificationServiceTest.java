package dz.mssid.education.service;

import dz.mssid.education.entity.EmailVerificationCode;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.EmailVerificationCodeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
class EmailVerificationServiceTest {

    @Mock
    private EmailVerificationCodeRepository codeRepository;

    @Mock
    private ResendEmailService resendEmailService;

    private EmailVerificationService emailVerificationService;
    private User testUser;

    @BeforeEach
    void setUp() {
        emailVerificationService = new EmailVerificationService(codeRepository, resendEmailService);
        testUser = User.builder()
                .id(1L)
                .nom("Omar Testeur")
                .email("omar@mssid.dz")
                .passwordHash("encoded")
                .role(new Role(1L, Role.RoleName.ROLE_FREE))
                .emailVerified(false)
                .build();
    }

    @Test
    @DisplayName("sendVerificationCode - generates and emails a 6-digit code, hashed at rest")
    void sendVerificationCode_generatesAndSendsCode() {
        when(codeRepository.findByUserAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(eq(testUser), any()))
                .thenReturn(List.of());
        when(codeRepository.save(any(EmailVerificationCode.class))).thenAnswer(inv -> inv.getArgument(0));
        when(resendEmailService.sendHtmlEmail(eq("omar@mssid.dz"), anyString(), anyString())).thenReturn(true);

        boolean result = emailVerificationService.sendVerificationCode(testUser);

        assertTrue(result);
        ArgumentCaptor<EmailVerificationCode> captor = ArgumentCaptor.forClass(EmailVerificationCode.class);
        verify(codeRepository).save(captor.capture());
        EmailVerificationCode saved = captor.getValue();
        assertEquals(64, saved.getCodeHash().length(), "SHA-256 hex digest is 64 chars");
        assertFalse(saved.isConsumed());
        assertTrue(saved.getExpiresAt().isAfter(LocalDateTime.now()));

        // The email body must contain a plain 6-digit code, but never the stored hash.
        verify(resendEmailService).sendHtmlEmail(eq("omar@mssid.dz"), anyString(),
                argThat(html -> html.matches("(?s).*\\b\\d{6}\\b.*") && !html.contains(saved.getCodeHash())));
    }

    @Test
    @DisplayName("sendVerificationCode - no-ops for an already-verified user")
    void sendVerificationCode_alreadyVerified_noOps() {
        testUser.setEmailVerified(true);

        boolean result = emailVerificationService.sendVerificationCode(testUser);

        assertFalse(result);
        verifyNoInteractions(resendEmailService);
        verify(codeRepository, never()).save(any());
    }

    @Test
    @DisplayName("sendVerificationCode - no-ops while a recent code is still within the resend cooldown")
    void sendVerificationCode_withinCooldown_noOps() {
        EmailVerificationCode recent = EmailVerificationCode.builder()
                .id(1L)
                .codeHash("irrelevant")
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .consumed(false)
                .createdAt(LocalDateTime.now().minusSeconds(5))
                .build();
        when(codeRepository.findByUserAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(eq(testUser), any()))
                .thenReturn(List.of(recent));

        boolean result = emailVerificationService.sendVerificationCode(testUser);

        assertFalse(result);
        verifyNoInteractions(resendEmailService);
    }

    @Test
    @DisplayName("cooldownRemaining - zero once the cooldown window has elapsed")
    void cooldownRemaining_elapsed_returnsZero() {
        EmailVerificationCode old = EmailVerificationCode.builder()
                .id(1L)
                .codeHash("irrelevant")
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .consumed(false)
                .createdAt(LocalDateTime.now().minusMinutes(5))
                .build();
        when(codeRepository.findByUserAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(eq(testUser), any()))
                .thenReturn(List.of(old));

        assertTrue(emailVerificationService.cooldownRemaining(testUser).isZero());
    }

    @Test
    @DisplayName("verifyCode - correct code marks it consumed and sets emailVerified")
    void verifyCode_validCode_verifiesUser() {
        EmailVerificationCode stored = EmailVerificationCode.builder()
                .id(1L)
                .codeHash(sha256("123456"))
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .consumed(false)
                .build();
        when(codeRepository.findByCodeHashAndUser(sha256("123456"), testUser)).thenReturn(Optional.of(stored));

        boolean result = emailVerificationService.verifyCode(testUser, "123456");

        assertTrue(result);
        assertTrue(stored.isConsumed());
        assertTrue(testUser.isEmailVerified());
        verify(codeRepository).save(stored);
    }

    @Test
    @DisplayName("verifyCode - unknown code is rejected without verifying the user")
    void verifyCode_unknownCode_rejected() {
        when(codeRepository.findByCodeHashAndUser(anyString(), eq(testUser))).thenReturn(Optional.empty());

        boolean result = emailVerificationService.verifyCode(testUser, "999999");

        assertFalse(result);
        assertFalse(testUser.isEmailVerified());
    }

    @Test
    @DisplayName("verifyCode - expired code is rejected")
    void verifyCode_expiredCode_rejected() {
        EmailVerificationCode expired = EmailVerificationCode.builder()
                .id(1L)
                .codeHash(sha256("123456"))
                .user(testUser)
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .consumed(false)
                .build();
        when(codeRepository.findByCodeHashAndUser(sha256("123456"), testUser)).thenReturn(Optional.of(expired));

        assertFalse(emailVerificationService.verifyCode(testUser, "123456"));
        assertFalse(testUser.isEmailVerified());
    }

    @Test
    @DisplayName("verifyCode - already-consumed code is rejected (single use)")
    void verifyCode_alreadyConsumed_rejected() {
        EmailVerificationCode consumed = EmailVerificationCode.builder()
                .id(1L)
                .codeHash(sha256("123456"))
                .user(testUser)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .consumed(true)
                .build();
        when(codeRepository.findByCodeHashAndUser(sha256("123456"), testUser)).thenReturn(Optional.of(consumed));

        assertFalse(emailVerificationService.verifyCode(testUser, "123456"));
        assertFalse(testUser.isEmailVerified());
    }

    @Test
    @DisplayName("verifyCode - blank/null code is rejected without a repository lookup")
    void verifyCode_blankCode_rejected() {
        assertFalse(emailVerificationService.verifyCode(testUser, null));
        assertFalse(emailVerificationService.verifyCode(testUser, "  "));
        verifyNoInteractions(codeRepository);
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
