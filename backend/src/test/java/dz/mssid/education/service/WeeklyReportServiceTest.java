package dz.mssid.education.service;

import dz.mssid.education.entity.ChildProfile;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.ChildProfileRepository;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class WeeklyReportServiceTest {

    // Thursday 5 Nov 2026, 19:00 in Algiers.
    private static final Instant NOW = Instant.parse("2026-11-05T18:00:00Z");
    private static final Clock CLOCK = Clock.fixed(NOW, WeeklyReportService.ALGIERS);
    private static final Map<String, WeeklyReportBuilder.Label> LABELS = Map.of(
            "ar-5ap-c-tamyiz", new WeeklyReportBuilder.Label("أُمَيِّزُ التَّمْيِيزَ وَأُعْرِبُهُ", "Reconnaître التمييز"),
            "math-5ap-c-division", new WeeklyReportBuilder.Label("أُنْجِزُ القِسْمَةَ الإِقْلِيدِيَّةَ", "Division"),
            "math-5ap-c-fractions", new WeeklyReportBuilder.Label("الكُسُورُ", "Fractions"));

    private UserRepository users;
    private ChildProfileRepository children;
    private ResendEmailService mail;
    private WeeklyReportService service;

    @Test
    void workshopObservationsNeverBecomeWeeklySuccesses() {
        var week = WeeklyReportBuilder.childWeek("Demo", "5AP", Map.of(),
                List.of(Map.of("at", NOW.toString(), "outcome", "success", "count", 0,
                        "villageSummary", Map.of("id", "demo-session"))), NOW, LABELS);
        assertThat(week.sessions()).isZero();
        assertThat(week.active()).isFalse();
    }

    @BeforeEach
    void setUp() {
        users = mock(UserRepository.class);
        children = mock(ChildProfileRepository.class);
        mail = mock(ResendEmailService.class);
        service = new WeeklyReportService(users, children, mail, CLOCK, LABELS);
        service.configure(true, 80, "https://mssid-v2-test.vercel.app/", "https://api.example.dz", "secret");
    }

    private static Map<String, Object> session(String at, String outcome, Boolean helped, int count, String competenceId) {
        Map<String, Object> s = new java.util.HashMap<>(Map.of("at", at, "lessonId", "l", "outcome", outcome, "count", count, "competenceIds", List.of(competenceId)));
        if (helped != null) s.put("helped", helped);
        return s;
    }

    private static ChildProfile amine() {
        return ChildProfile.builder()
                .displayName("أمين").grade("5AP")
                .competenceStats(Map.of(
                        "ar-5ap-c-tamyiz", Map.of("attempts", 3, "successes", 1, "failures", 2, "lastOutcome", "fail", "missedExerciseIds", List.of("e1", "e2")),
                        "math-5ap-c-division", Map.of("attempts", 2, "successes", 2, "failures", 0, "lastOutcome", "success", "alone", 2),
                        "math-5ap-c-fractions", Map.of("attempts", 2, "successes", 1, "failures", 1, "lastOutcome", "success", "missedExerciseIds", List.of("f1"))))
                .lessonSessions(new ArrayList<>(List.of(
                        session("2026-11-04T17:00:00.000Z", "success", false, 2, "math-5ap-c-division"),
                        session("2026-11-03T17:00:00.000Z", "success", true, 1, "math-5ap-c-fractions"),
                        session("2026-11-02T17:00:00.000Z", "fail", null, 1, "ar-5ap-c-tamyiz"),
                        session("2026-10-20T17:00:00.000Z", "success", false, 5, "math-5ap-c-division"))))
                .build();
    }

    private static User parent(long id, Role.RoleName role) {
        User user = User.builder().id(id).nom("Karim").email("p" + id + "@test.invalid").parentEmail("parent" + id + "@test.invalid")
                .passwordHash("x").build();
        Role r = new Role(); r.setName(role); user.setRole(r);
        return user;
    }

    @Test
    void summarisesTheWeekAloneVersusWithHelpAndWhatToReview() {
        WeeklyReportBuilder.ChildWeek week = WeeklyReportBuilder.childWeek("أمين", "5AP", amine().getCompetenceStats(), amine().getLessonSessions(), NOW, LABELS);

        assertThat(week.sessions()).isEqualTo(4); // the October session is outside the week
        assertThat(week.successes()).isEqualTo(3);
        assertThat(week.alone()).isEqualTo(2);
        assertThat(week.helped()).isEqualTo(1);
        // Most missed first: التمييز (2 missed) before fractions (1 missed); division is fine.
        assertThat(week.toReview()).containsExactly("أُمَيِّزُ التَّمْيِيزَ وَأُعْرِبُهُ", "الكُسُورُ");
        assertThat(week.missedToRedo()).isEqualTo(3);
        assertThat(week.nextAr()).isEqualTo("أُمَيِّزُ التَّمْيِيزَ وَأُعْرِبُهُ");
    }

    @Test
    void sendsOneMailPerActiveFamilyWithTheOfferOnlyForFreeAccounts() {
        User free = parent(1, Role.RoleName.ROLE_FREE);
        User premium = parent(2, Role.RoleName.ROLE_PREMIUM);
        when(users.findWeeklyReportRecipients(any())).thenReturn(List.of(free, premium));
        when(children.findAllByUserEmailOrderByCreatedAtAsc(anyString())).thenReturn(List.of(amine()));
        when(mail.sendHtmlEmail(anyString(), anyString(), anyString())).thenReturn(true);

        assertThat(service.run()).isEqualTo(2);

        ArgumentCaptor<String> html = ArgumentCaptor.forClass(String.class);
        verify(mail).sendHtmlEmail(eq("parent1@test.invalid"), contains("أمين"), html.capture());
        assertThat(html.getValue()).contains("2</strong> بمفرده").contains("?open=offer").contains("?open=parent-notebook")
                .contains("/api/v1/reports/unsubscribe?u=1&amp;t=" + service.tokenFor(1));
        verify(mail).sendHtmlEmail(eq("parent2@test.invalid"), anyString(), argThat(body -> !body.contains("?open=offer")));
        assertThat(free.getWeeklyReportLastSentAt()).isEqualTo(LocalDateTime.of(2026, 11, 5, 19, 0));
        verify(users, times(2)).save(any(User.class));
    }

    @Test
    void skipsFamiliesWithoutActivityAndRespectsTheCap() {
        User idle = parent(3, Role.RoleName.ROLE_FREE);
        ChildProfile sleeping = ChildProfile.builder().displayName("سارة").grade("4AP").build();
        when(users.findWeeklyReportRecipients(any())).thenReturn(List.of(idle));
        when(children.findAllByUserEmailOrderByCreatedAtAsc(anyString())).thenReturn(List.of(sleeping));
        assertThat(service.run()).isZero();
        verifyNoInteractions(mail);

        service.configure(true, 1, "https://site", "https://api", "secret");
        when(users.findWeeklyReportRecipients(any())).thenReturn(List.of(parent(4, Role.RoleName.ROLE_FREE), parent(5, Role.RoleName.ROLE_FREE)));
        when(children.findAllByUserEmailOrderByCreatedAtAsc(anyString())).thenReturn(List.of(amine()));
        when(mail.sendHtmlEmail(anyString(), anyString(), anyString())).thenReturn(true);
        assertThat(service.run()).isEqualTo(1);
    }

    @Test
    void doesNotMarkAsSentWhenTheProviderFails() {
        User user = parent(6, Role.RoleName.ROLE_FREE);
        when(users.findWeeklyReportRecipients(any())).thenReturn(List.of(user));
        when(children.findAllByUserEmailOrderByCreatedAtAsc(anyString())).thenReturn(List.of(amine()));
        when(mail.sendHtmlEmail(anyString(), anyString(), anyString())).thenReturn(false);
        assertThat(service.run()).isZero();
        assertThat(user.getWeeklyReportLastSentAt()).isNull();
        verify(users, never()).save(any());
    }

    @Test
    void unsubscribesOnlyWithTheSignedToken() {
        User user = parent(7, Role.RoleName.ROLE_FREE);
        when(users.findById(7L)).thenReturn(Optional.of(user));
        assertThat(service.unsubscribe(7, "forged-token-000000000")).isFalse();
        assertThat(user.isWeeklyReportOptOut()).isFalse();
        assertThat(service.unsubscribe(7, service.tokenFor(7))).isTrue();
        assertThat(user.isWeeklyReportOptOut()).isTrue();
        assertThat(service.tokenFor(7)).isNotEqualTo(service.tokenFor(8));
    }

    @Test
    void escapesNamesInTheMail() {
        WeeklyReportBuilder.ChildWeek week = new WeeklyReportBuilder.ChildWeek("<b>x</b>", "5AP", 1, 1, 1, 0, List.of(), List.of(), 0, null);
        assertThat(WeeklyReportBuilder.html(List.of(week), null, null, null)).contains("&lt;b&gt;x&lt;/b&gt;").doesNotContain("<b>x</b>");
    }

    @Test
    void readsTheCompetenceCatalogExportedFromTheApp() {
        assertThat(WeeklyReportService.loadLabels()).containsKey("ar-5ap-c-tamyiz").containsKey("math-1ap-c-spatial-position");
    }

    private static String contains(String part) {
        return org.mockito.ArgumentMatchers.contains(part);
    }
}
