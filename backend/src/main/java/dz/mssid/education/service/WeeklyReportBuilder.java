package dz.mssid.education.service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Builds the weekly parent report from what the app already saves per child (competence stats and
 * lesson sessions, see frontend utils/competenceProgress.ts). Pure: no Spring, no clock of its own,
 * so the content is unit-tested without a database or a mail provider.
 */
public final class WeeklyReportBuilder {

    public static final int MAX_ITEMS = 3;
    public static final int SESSION_MINUTES = 12;

    private WeeklyReportBuilder() {
    }

    /** Competence labels exported from the app (resources/competence-catalog.json). */
    public record Label(String labelAr, String labelFr) {
    }

    public record ChildWeek(
            String name,
            String grade,
            int sessions,
            int successes,
            int alone,
            int helped,
            List<String> succeeded,
            List<String> toReview,
            int missedToRedo,
            String nextAr) {

        public boolean active() {
            return sessions > 0;
        }
    }

    public static ChildWeek childWeek(String name, String grade, Map<String, Object> stats,
                                      List<Map<String, Object>> sessions, Instant now,
                                      Map<String, Label> labels) {
        Instant weekAgo = now.minus(7, ChronoUnit.DAYS);
        int total = 0;
        int successes = 0;
        int alone = 0;
        int helped = 0;
        Set<String> succeeded = new LinkedHashSet<>();
        List<Map<String, Object>> recent = new ArrayList<>(sessions == null ? List.of() : sessions);
        recent.sort(Comparator.comparing((Map<String, Object> s) -> String.valueOf(s.get("at"))).reversed());
        for (Map<String, Object> session : recent) {
            if (session.containsKey("villageSummary")) continue; // Unscored workshop observations.
            Instant at = parse(session.get("at"));
            if (at == null || at.isBefore(weekAgo) || at.isAfter(now)) continue;
            int count = Math.max(1, intOf(session.get("count")));
            total += count;
            if (!"success".equals(session.get("outcome"))) continue;
            successes += count;
            Object help = session.get("helped");
            if (Boolean.TRUE.equals(help)) helped += count;
            else if (Boolean.FALSE.equals(help)) alone += count;
            for (Object id : listOf(session.get("competenceIds"))) {
                Label label = labels.get(String.valueOf(id));
                if (label != null && succeeded.size() < MAX_ITEMS) succeeded.add(label.labelAr());
            }
        }

        record Review(String labelAr, int missed, int failures) {
        }
        List<Review> reviews = new ArrayList<>();
        int missedToRedo = 0;
        if (stats != null) {
            for (Map.Entry<String, Object> entry : stats.entrySet()) {
                if (!(entry.getValue() instanceof Map<?, ?> stat)) continue;
                Label label = labels.get(entry.getKey());
                if (label == null) continue;
                int missed = listOf(stat.get("missedExerciseIds")).size();
                int failures = intOf(stat.get("failures"));
                boolean review = "fail".equals(stat.get("lastOutcome")) || missed > 0
                        || (failures > 0 && intOf(stat.get("successes")) == 0);
                if (!review) continue;
                missedToRedo += missed;
                reviews.add(new Review(label.labelAr(), missed, failures));
            }
        }
        reviews.sort(Comparator.comparingInt(Review::missed).thenComparingInt(Review::failures).reversed());
        List<String> toReview = reviews.stream().limit(MAX_ITEMS).map(Review::labelAr).toList();
        return new ChildWeek(name, grade, total, successes, alone, helped, List.copyOf(succeeded), toReview,
                missedToRedo, toReview.isEmpty() ? null : toReview.get(0));
    }

    public static String subject(List<ChildWeek> children) {
        String names = String.join(" و", children.stream().map(ChildWeek::name).toList());
        return "📒 حصيلة الأسبوع — " + names + " | مَسِيد DZ";
    }

    /**
     * Right-to-left HTML e-mail. {@code offerUrl} is shown to free families only (the Android app never
     * shows prices; the e-mail may point to the web offer). {@code unsubscribeUrl} may be null.
     */
    public static String html(List<ChildWeek> children, String notebookUrl, String offerUrl, String unsubscribeUrl) {
        StringBuilder out = new StringBuilder();
        out.append("<div dir=\"rtl\" lang=\"ar\" style=\"font-family:Tahoma,Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a\">");
        out.append("<div style=\"background:#0B6B4F;color:#fff;padding:18px 20px;border-radius:16px 16px 0 0\">")
                .append("<h1 style=\"margin:0;font-size:20px\">📒 حصيلة الأسبوع</h1>")
                .append("<p style=\"margin:6px 0 0;font-size:13px;opacity:.9\">ما أنجزه أطفالكم على مَسِيد DZ خلال الأيام السبعة الماضية</p></div>");
        for (ChildWeek child : children) {
            out.append("<div style=\"border:2px solid #E7E2D7;border-top:0;padding:16px 20px\">");
            out.append("<h2 style=\"margin:0 0 8px;font-size:18px\">").append(esc(child.name()))
                    .append(" <span style=\"color:#64748b;font-size:13px\">(").append(esc(child.grade())).append(")</span></h2>");
            out.append("<p style=\"margin:4px 0\">✅ <strong>").append(child.sessions()).append("</strong> حصة، منها <strong>")
                    .append(child.successes()).append("</strong> ناجحة.</p>");
            if (child.alone() + child.helped() > 0) {
                out.append("<p style=\"margin:4px 0\">💪 التمارين: <strong>").append(child.alone()).append("</strong> بمفرده، <strong>")
                        .append(child.helped()).append("</strong> بمساعدة تلميح.</p>");
            }
            if (!child.succeeded().isEmpty()) {
                out.append("<p style=\"margin:10px 0 4px;color:#0B6B4F;font-weight:bold\">نجح في:</p>").append(list(child.succeeded()));
            }
            if (child.toReview().isEmpty()) {
                out.append("<p style=\"margin:10px 0 4px\">🔁 لا شيء للمراجعة حالياً.</p>");
            } else {
                out.append("<p style=\"margin:10px 0 4px;color:#A86B00;font-weight:bold\">🔁 للمراجعة:</p>").append(list(child.toReview()));
                if (child.missedToRedo() > 0) {
                    out.append("<p style=\"margin:4px 0;font-size:13px\">📄 ").append(child.missedToRedo())
                            .append(" تمرين أخطأ فيه جاهز في كراس الاستدراك (دفتر الولي).</p>");
                }
            }
            if (child.nextAr() != null) {
                out.append("<p style=\"margin:10px 0 0;background:#EEF4FF;border-radius:12px;padding:10px\">👉 نصيحة الغد: <strong>")
                        .append(SESSION_MINUTES).append(" دقيقة</strong> حول «").append(esc(child.nextAr())).append("».</p>");
            }
            out.append("</div>");
        }
        out.append("<div style=\"border:2px solid #E7E2D7;border-top:0;padding:16px 20px;border-radius:0 0 16px 16px;text-align:center\">");
        if (notebookUrl != null && !notebookUrl.isBlank()) {
            out.append("<a href=\"").append(esc(notebookUrl)).append("\" style=\"display:inline-block;background:#008751;color:#fff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:12px\">افتح دفتر الولي</a>");
        }
        if (offerUrl != null && !offerUrl.isBlank()) {
            out.append("<p style=\"margin:14px 0 0;font-size:13px\">الخطة الكاملة قبل الاختبار، كراسات الاستدراك والمواضيع التجريبية المصحّحة متاحة في حساب العائلة المميّز: ")
                    .append("<a href=\"").append(esc(offerUrl)).append("\">").append(esc(offerUrl)).append("</a></p>");
        }
        out.append("<p style=\"margin:14px 0 0;color:#64748b;font-size:12px\">تصلكم هذه الرسالة لأنكم أضفتم بريدكم في «خطوتان للبدء». ");
        if (unsubscribeUrl != null && !unsubscribeUrl.isBlank()) {
            out.append("<a href=\"").append(esc(unsubscribeUrl)).append("\" style=\"color:#64748b\">إيقاف هذه الرسائل</a>");
        }
        out.append("</p></div></div>");
        return out.toString();
    }

    private static String list(List<String> items) {
        StringBuilder out = new StringBuilder("<ul style=\"margin:0;padding-right:20px\">");
        for (String item : items) out.append("<li>").append(esc(item)).append("</li>");
        return out.append("</ul>").toString();
    }

    static String esc(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    private static Instant parse(Object value) {
        if (value == null) return null;
        try {
            return OffsetDateTime.parse(String.valueOf(value)).toInstant();
        } catch (DateTimeParseException e) {
            try {
                return Instant.parse(String.valueOf(value));
            } catch (DateTimeParseException ignored) {
                return null;
            }
        }
    }

    private static int intOf(Object value) {
        return value instanceof Number number ? number.intValue() : 0;
    }

    private static Collection<?> listOf(Object value) {
        return value instanceof Collection<?> collection ? collection : List.of();
    }
}
