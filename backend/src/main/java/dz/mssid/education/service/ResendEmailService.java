package dz.mssid.education.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Thin wrapper around Resend's transactional email REST API (https://resend.com/docs/api-reference/emails/send-email).
 * No SDK dependency — same "plain RestTemplate + @Value config" pattern as GeminiAiService, so this
 * doesn't introduce a new HTTP client abstraction into the codebase for one integration.
 *
 * SEC-08: app.resend.api-key MUST be set via environment/secret in every deployed environment — left
 * blank by default so a missing key fails loudly (logged, caught) instead of silently no-op'ing.
 * app.resend.from-email must be an address on a domain verified in the Resend dashboard before it can
 * send to arbitrary recipients; Resend's shared onboarding@resend.dev sender only delivers to the
 * account owner's own verified address, so it's fine for local testing but not for real users.
 */
@Service
@RequiredArgsConstructor
public class ResendEmailService {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailService.class);

    @Value("${app.resend.api-key:}")
    private String apiKey;

    @Value("${app.resend.from-email:Mssid DZ <onboarding@resend.dev>}")
    private String fromEmail;

    @Value("${app.resend.api-url:https://api.resend.com/emails}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // The single choke point every outbound email goes through (verification codes, password
    // resets) — logging here once covers every caller, instead of duplicating the same record(...)
    // call at each call site. This is what makes "why didn't the confirmation email send" answerable
    // from the admin console instead of only an ephemeral console log.error.
    private final AdminAuditLogService adminAuditLogService;

    /** @return true if the email was handed off to Resend successfully, false otherwise (never throws). */
    public boolean sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("[ResendEmailService] app.resend.api-key is not configured — skipping email to {}", toEmail);
            adminAuditLogService.record(toEmail, "EMAIL_SEND", "EMAIL", subject,
                    "app.resend.api-key n'est pas configurée — envoi ignoré", "FAILURE");
            return false;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = Map.of(
                "from", fromEmail,
                "to", List.of(toEmail),
                "subject", subject,
                "html", htmlBody
        );

        try {
            restTemplate.postForObject(apiUrl, new HttpEntity<>(requestBody, headers), Map.class);
            adminAuditLogService.record(toEmail, "EMAIL_SEND", "EMAIL", subject, "envoyé via Resend", "SUCCESS");
            return true;
        } catch (Exception e) {
            log.error("[ResendEmailService] Failed to send email to {}: {}", toEmail, e.getMessage());
            adminAuditLogService.record(toEmail, "EMAIL_SEND", "EMAIL", subject,
                    "échec Resend: " + e.getMessage(), "FAILURE");
            return false;
        }
    }
}
