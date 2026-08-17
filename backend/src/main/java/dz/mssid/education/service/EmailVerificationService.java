package dz.mssid.education.service;

import dz.mssid.education.entity.EmailVerificationCode;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.EmailVerificationCodeRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.HexFormat;

/**
 * Soft email verification (product decision: never blocks app usage — see User.emailVerified).
 * 6-digit code typed directly in the app rather than a clickable link: this app ships wrapped in a
 * Capacitor Android WebView, where a mail-app link would open the system browser instead of the app
 * (no App Links/deep-link setup exists) — a code the user re-types avoids that dead end entirely.
 */
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final Duration CODE_TTL = Duration.ofMinutes(15);
    private static final Duration RESEND_COOLDOWN = Duration.ofSeconds(60);

    private final EmailVerificationCodeRepository codeRepository;
    private final ResendEmailService resendEmailService;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * @return the cooldown remaining before another code may be sent, or Duration.ZERO if allowed now.
     */
    public Duration cooldownRemaining(User user) {
        List<EmailVerificationCode> active = codeRepository
                .findByUserAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(user, LocalDateTime.now());
        if (active.isEmpty()) return Duration.ZERO;

        LocalDateTime mostRecent = active.get(0).getCreatedAt();
        LocalDateTime cooldownEnds = mostRecent.plus(RESEND_COOLDOWN);
        if (cooldownEnds.isBefore(LocalDateTime.now())) return Duration.ZERO;
        return Duration.between(LocalDateTime.now(), cooldownEnds);
    }

    /** Generates a fresh 6-digit code, stores its hash, and emails it. Silently no-ops during cooldown. */
    @Transactional
    public boolean sendVerificationCode(User user) {
        if (user.isEmailVerified()) return false;
        if (!cooldownRemaining(user).isZero()) return false;

        String rawCode = generateSixDigitCode();
        EmailVerificationCode entity = EmailVerificationCode.builder()
                .codeHash(hash(rawCode))
                .user(user)
                .expiresAt(LocalDateTime.now().plus(CODE_TTL))
                .consumed(false)
                .build();
        codeRepository.save(entity);

        String html = buildEmailHtml(user.getNom(), rawCode);
        return resendEmailService.sendHtmlEmail(user.getEmail(), "رمز تأكيد بريدك الإلكتروني - مَسِيد DZ", html);
    }

    /**
     * @return true if the code was valid and the account is now verified, false otherwise (unknown,
     * expired, already-consumed, or mismatched code — deliberately the same generic outcome for all
     * of these so a wrong guess can't be used to probe which failure mode it hit).
     */
    @Transactional
    public boolean verifyCode(User user, String rawCode) {
        if (rawCode == null || rawCode.isBlank()) return false;

        return codeRepository.findByCodeHashAndUser(hash(rawCode.trim()), user)
                .filter(code -> !code.isConsumed())
                .filter(code -> code.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(code -> {
                    code.setConsumed(true);
                    codeRepository.save(code);
                    user.setEmailVerified(true);
                    return true;
                })
                .orElse(false);
    }

    private String generateSixDigitCode() {
        int value = secureRandom.nextInt(1_000_000);
        return String.format("%06d", value);
    }

    private String hash(String rawCode) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawCode.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 non disponible sur cette JVM", e);
        }
    }

    private String buildEmailHtml(String nom, String code) {
        return "<div dir=\"rtl\" style=\"font-family: sans-serif; text-align: center; padding: 24px;\">"
                + "<h2>مرحباً " + escapeHtml(nom) + " 👋</h2>"
                + "<p>رمز تأكيد بريدك الإلكتروني في تطبيق مَسِيد DZ هو:</p>"
                + "<p style=\"font-size: 32px; font-weight: bold; letter-spacing: 8px; background:#f1f5f9; padding: 12px 24px; border-radius: 12px; display:inline-block;\">"
                + code + "</p>"
                + "<p style=\"color:#64748b; font-size: 13px;\">صالح لمدة 15 دقيقة. إذا لم تطلب هذا الرمز، تجاهل هذه الرسالة.</p>"
                + "</div>";
    }

    private String escapeHtml(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
