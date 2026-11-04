package dz.mssid.education.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.entity.ChildProfile;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.ChildProfileRepository;
import dz.mssid.education.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Weekly report e-mail to the parent (« حصيلة الأسبوع »), every Thursday evening in Algiers — the
 * end of the school week, before the Friday-Saturday weekend. One e-mail per family, listing each
 * child who worked this week; families with no activity get nothing (and cost no e-mail quota).
 *
 * Runs only when {@code app.weekly-report.enabled=true}, sends at most {@code max-per-run} e-mails
 * (Resend free plan: 100 per day), and records the send so a restart never repeats it.
 */
@Service
public class WeeklyReportService {

    private static final Logger log = LoggerFactory.getLogger(WeeklyReportService.class);
    public static final ZoneId ALGIERS = ZoneId.of("Africa/Algiers");

    private final UserRepository users;
    private final ChildProfileRepository children;
    private final ResendEmailService mail;
    private final Clock clock;
    private final Map<String, WeeklyReportBuilder.Label> labels;

    @Value("${app.weekly-report.enabled:false}")
    private boolean enabled;

    @Value("${app.weekly-report.max-per-run:80}")
    private int maxPerRun;

    @Value("${app.weekly-report.web-url:}")
    private String webUrl;

    @Value("${app.weekly-report.public-api-url:}")
    private String publicApiUrl;

    @Value("${app.jwt.secret:}")
    private String secret;

    @Autowired
    public WeeklyReportService(UserRepository users, ChildProfileRepository children, ResendEmailService mail) {
        this(users, children, mail, Clock.system(ALGIERS), loadLabels());
    }

    WeeklyReportService(UserRepository users, ChildProfileRepository children, ResendEmailService mail,
                        Clock clock, Map<String, WeeklyReportBuilder.Label> labels) {
        this.users = users;
        this.children = children;
        this.mail = mail;
        this.clock = clock;
        this.labels = labels;
    }

    void configure(boolean enabled, int maxPerRun, String webUrl, String publicApiUrl, String secret) {
        this.enabled = enabled;
        this.maxPerRun = maxPerRun;
        this.webUrl = webUrl;
        this.publicApiUrl = publicApiUrl;
        this.secret = secret;
    }

    @Scheduled(cron = "${app.weekly-report.cron:0 0 19 * * THU}", zone = "Africa/Algiers")
    public void scheduledRun() {
        if (!enabled) return;
        int sent = run();
        log.info("[WeeklyReport] {} e-mail(s) sent", sent);
    }

    /** @return the number of e-mails handed to the provider. */
    public int run() {
        Instant now = clock.instant();
        // « Not sent in the last 6 days »: tolerant of a late or repeated run, never twice a week.
        LocalDateTime sentBefore = LocalDateTime.ofInstant(now, ALGIERS).minusDays(6);
        int sent = 0;
        for (User user : users.findWeeklyReportRecipients(sentBefore)) {
            if (sent >= maxPerRun) break;
            List<WeeklyReportBuilder.ChildWeek> weeks = weeksFor(user, now);
            if (weeks.isEmpty()) continue;
            String html = WeeklyReportBuilder.html(weeks, notebookUrl(), isPremium(user) ? null : offerUrl(), unsubscribeUrl(user));
            if (mail.sendHtmlEmail(user.getParentEmail(), WeeklyReportBuilder.subject(weeks), html)) {
                user.setWeeklyReportLastSentAt(LocalDateTime.ofInstant(now, ALGIERS));
                users.save(user);
                sent++;
            }
        }
        return sent;
    }

    /** Children who worked this week; the account itself when the family has no child profile yet. */
    List<WeeklyReportBuilder.ChildWeek> weeksFor(User user, Instant now) {
        List<WeeklyReportBuilder.ChildWeek> weeks = new ArrayList<>();
        List<ChildProfile> profiles = children.findAllByUserEmailOrderByCreatedAtAsc(user.getEmail());
        if (profiles.isEmpty()) {
            weeks.add(WeeklyReportBuilder.childWeek(user.getNom(), user.getGrade(), user.getCompetenceStats(), user.getLessonSessions(), now, labels));
        } else {
            for (ChildProfile child : profiles) {
                weeks.add(WeeklyReportBuilder.childWeek(child.getDisplayName(), child.getGrade(), child.getCompetenceStats(), child.getLessonSessions(), now, labels));
            }
        }
        return weeks.stream().filter(WeeklyReportBuilder.ChildWeek::active).toList();
    }

    /** One-click stop from the e-mail. The token is an HMAC of the user id: unguessable, nothing stored. */
    public boolean unsubscribe(long userId, String token) {
        if (token == null || !MessageDigest.isEqual(token.getBytes(StandardCharsets.UTF_8), tokenFor(userId).getBytes(StandardCharsets.UTF_8))) {
            return false;
        }
        return users.findById(userId).map(user -> {
            user.setWeeklyReportOptOut(true);
            users.save(user);
            return true;
        }).orElse(false);
    }

    String tokenFor(long userId) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(("weekly-report:" + secret).getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal(String.valueOf(userId).getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest).substring(0, 22);
        } catch (Exception e) {
            throw new IllegalStateException("HmacSHA256 unavailable", e);
        }
    }

    private String unsubscribeUrl(User user) {
        if (publicApiUrl == null || publicApiUrl.isBlank()) return null;
        return trim(publicApiUrl) + "/api/v1/reports/unsubscribe?u=" + user.getId() + "&t=" + tokenFor(user.getId());
    }

    private String notebookUrl() {
        return webUrl == null || webUrl.isBlank() ? null : trim(webUrl) + "/?open=parent-notebook";
    }

    private String offerUrl() {
        return webUrl == null || webUrl.isBlank() ? null : trim(webUrl) + "/?open=offer";
    }

    private static String trim(String url) {
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    private static boolean isPremium(User user) {
        Role role = user.getRole();
        return role != null && (role.getName() == Role.RoleName.ROLE_PREMIUM || role.getName() == Role.RoleName.ROLE_ADMIN);
    }

    static Map<String, WeeklyReportBuilder.Label> loadLabels() {
        Map<String, WeeklyReportBuilder.Label> map = new HashMap<>();
        try (InputStream input = new ClassPathResource("competence-catalog.json").getInputStream()) {
            for (JsonNode node : new ObjectMapper().readTree(input)) {
                map.put(node.get("id").asText(), new WeeklyReportBuilder.Label(node.get("labelAr").asText(), node.get("labelFr").asText()));
            }
        } catch (IOException e) {
            log.warn("[WeeklyReport] competence-catalog.json unreadable: reports will not list competences", e);
        }
        return map;
    }
}
