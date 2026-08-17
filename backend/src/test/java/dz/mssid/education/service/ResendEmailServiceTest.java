package dz.mssid.education.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

// Regression tests for the logging gap that prompted this: a failed email send used to leave zero
// queryable trace anywhere, only an ephemeral console log.error. Every path here must now produce an
// EMAIL_SEND audit entry with the right outcome, since that's the whole point of the admin console
// being able to answer "why didn't the confirmation email send?".
@ExtendWith(MockitoExtension.class)
class ResendEmailServiceTest {

    @Mock
    private AdminAuditLogService adminAuditLogService;

    @InjectMocks
    private ResendEmailService resendEmailService;

    @Test
    @DisplayName("sendHtmlEmail - Missing API key: returns false and records an EMAIL_SEND FAILURE entry")
    void sendHtmlEmail_MissingApiKey_RecordsFailure() {
        ReflectionTestUtils.setField(resendEmailService, "apiKey", "");

        boolean result = resendEmailService.sendHtmlEmail("younes@mssid.dz", "رمز التحقق", "<p>123456</p>");

        assertFalse(result);
        verify(adminAuditLogService).record(
                eq("younes@mssid.dz"), eq("EMAIL_SEND"), eq("EMAIL"), eq("رمز التحقق"), anyString(), eq("FAILURE"));
    }

    @Test
    @DisplayName("sendHtmlEmail - Resend API unreachable: returns false and records an EMAIL_SEND FAILURE entry")
    void sendHtmlEmail_ResendUnreachable_RecordsFailure() {
        // A real (non-blank) key with the default api-url pointed at an address nothing listens on —
        // RestTemplate throws, exercising the catch block without needing a live HTTP mock. @Value
        // defaults never resolve outside a Spring context, so fromEmail must be set explicitly too.
        ReflectionTestUtils.setField(resendEmailService, "apiKey", "re_fake_test_key");
        ReflectionTestUtils.setField(resendEmailService, "fromEmail", "Mssid DZ <onboarding@resend.dev>");
        ReflectionTestUtils.setField(resendEmailService, "apiUrl", "http://localhost:1/unreachable");

        boolean result = resendEmailService.sendHtmlEmail("younes@mssid.dz", "رمز التحقق", "<p>123456</p>");

        assertFalse(result);
        verify(adminAuditLogService).record(
                eq("younes@mssid.dz"), eq("EMAIL_SEND"), eq("EMAIL"), eq("رمز التحقق"), anyString(), eq("FAILURE"));
    }

}
