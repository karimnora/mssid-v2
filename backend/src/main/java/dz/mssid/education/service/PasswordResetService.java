package dz.mssid.education.service;

import dz.mssid.education.entity.PasswordResetCode;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.PasswordResetCodeRepository;
import dz.mssid.education.repository.RefreshTokenRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

/**
 * "Mot de passe oublié" — same 6-digit-code-by-email shape as EmailVerificationService (see its
 * class comment for why a code and not a link). Deliberately mirrors that service's structure so
 * the two flows stay consistent, but every public method here treats "email doesn't exist" and
 * "email exists but on cooldown" identically to the caller — this endpoint is unauthenticated and
 * a differing response for either case would let an attacker enumerate registered emails.
 */
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final Duration CODE_TTL = Duration.ofMinutes(15);
    private static final Duration RESEND_COOLDOWN = Duration.ofSeconds(60);

    private final PasswordResetCodeRepository codeRepository;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ResendEmailService resendEmailService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Looks up the email and, if it exists and isn't on cooldown, emails a fresh code. Always
     * completes without throwing regardless of whether the email is registered — the controller
     * returns the same generic message either way.
     */
    @Transactional
    public void requestReset(String email) {
        if (email == null || email.isBlank()) return;

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty()) return;

        User user = userOpt.get();
        if (!cooldownRemaining(user).isZero()) return;

        String rawCode = generateSixDigitCode();
        PasswordResetCode entity = PasswordResetCode.builder()
                .codeHash(hash(rawCode))
                .user(user)
                .expiresAt(LocalDateTime.now().plus(CODE_TTL))
                .consumed(false)
                .build();
        codeRepository.save(entity);

        String html = buildEmailHtml(user.getNom(), rawCode);
        resendEmailService.sendHtmlEmail(user.getEmail(), "إعادة تعيين كلمة المرور - مَسِيد DZ", html);
    }

    public Duration cooldownRemaining(User user) {
        List<PasswordResetCode> active = codeRepository
                .findByUserAndConsumedFalseAndExpiresAtAfterOrderByCreatedAtDesc(user, LocalDateTime.now());
        if (active.isEmpty()) return Duration.ZERO;

        LocalDateTime mostRecent = active.get(0).getCreatedAt();
        LocalDateTime cooldownEnds = mostRecent.plus(RESEND_COOLDOWN);
        if (cooldownEnds.isBefore(LocalDateTime.now())) return Duration.ZERO;
        return Duration.between(LocalDateTime.now(), cooldownEnds);
    }

    /**
     * @return true if the code was valid and the password was changed, false otherwise (unknown
     * email, unknown/expired/consumed code — deliberately the same generic outcome, see class doc).
     * On success, every existing refresh token for the user is deleted so a password reset also
     * ends every other logged-in session (the 24h access-token JWTs already in flight elsewhere
     * still expire naturally — they aren't individually revocable, same pre-existing limitation as
     * the rest of the JWT design here).
     */
    @Transactional
    public boolean resetPassword(String email, String rawCode, String newPassword) {
        if (email == null || rawCode == null || rawCode.isBlank() || newPassword == null || newPassword.isBlank()) {
            return false;
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty()) return false;
        User user = userOpt.get();

        return codeRepository.findByCodeHashAndUser(hash(rawCode.trim()), user)
                .filter(code -> !code.isConsumed())
                .filter(code -> code.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(code -> {
                    code.setConsumed(true);
                    codeRepository.save(code);
                    user.setPasswordHash(passwordEncoder.encode(newPassword));
                    userRepository.save(user);
                    refreshTokenRepository.deleteByUser(user);
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
                + "<p>طلبت إعادة تعيين كلمة المرور في تطبيق مَسِيد DZ. الرمز هو:</p>"
                + "<p style=\"font-size: 32px; font-weight: bold; letter-spacing: 8px; background:#f1f5f9; padding: 12px 24px; border-radius: 12px; display:inline-block;\">"
                + code + "</p>"
                + "<p style=\"color:#64748b; font-size: 13px;\">صالح لمدة 15 دقيقة. إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة ولن يتغير شيء.</p>"
                + "</div>";
    }

    private String escapeHtml(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
