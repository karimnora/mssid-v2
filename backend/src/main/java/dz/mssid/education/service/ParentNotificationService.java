package dz.mssid.education.service;

import dz.mssid.education.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * One-time "your child created an account" email to the optional parent_email collected at
 * registration (see RegisterRequest.parentEmail). Deliberately not a supervision dashboard or a
 * recurring report — see the pre-launch audit's "Email parent optionnel" scope decision — just an
 * honest heads-up so a parent isn't unaware their child has an account.
 */
@Service
@RequiredArgsConstructor
public class ParentNotificationService {

    private final ResendEmailService resendEmailService;

    /** Best-effort — a flaky email provider must never block registration. No-ops when unset. */
    public void sendAccountCreatedNotice(User user) {
        String parentEmail = user.getParentEmail();
        if (parentEmail == null || parentEmail.isBlank()) return;

        String html = buildEmailHtml(user.getNom(), user.getGrade());
        resendEmailService.sendHtmlEmail(parentEmail, "تم إنشاء حساب لطفلك على مَسِيد DZ", html);
    }

    private String buildEmailHtml(String childName, String grade) {
        String gradeLine = (grade != null && !grade.isBlank())
                ? "<p>المستوى الدراسي المُختار: <strong>" + escapeHtml(grade) + "</strong></p>"
                : "";
        return "<div dir=\"rtl\" style=\"font-family: sans-serif; text-align: center; padding: 24px;\">"
                + "<h2>مرحباً 👋</h2>"
                + "<p>نُعلمكم بأنّ <strong>" + escapeHtml(childName) + "</strong> أنشأ للتو حساباً على منصة "
                + "<strong>مَسِيد DZ</strong> للتعليم الابتدائي.</p>"
                + gradeLine
                + "<p style=\"color:#64748b; font-size: 13px;\">"
                + "هذه رسالة إعلامية لمرة واحدة فقط ولا تتطلب أي إجراء منكم. "
                + "إذا لم تكونوا تتوقعون هذه الرسالة، يمكنكم تجاهلها بأمان."
                + "</p>"
                + "</div>";
    }

    private String escapeHtml(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
