package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.UserRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class CahierAccessService {
    public static final int WEEKLY_LIMIT = 3;
    static final ZoneId ZONE = ZoneId.of("Africa/Algiers");
    private final JdbcTemplate jdbc;
    private final UserRepository users;
    private final Clock clock;
    private final Set<String> documents;
    public record Access(boolean premium, int limit, int remaining, String resetsAt,
                         List<String> unlockedIds, boolean allowed) {}

    @org.springframework.beans.factory.annotation.Autowired
    public CahierAccessService(JdbcTemplate jdbc, UserRepository users) throws IOException {
        this(jdbc, users, Clock.system(ZONE), loadDocuments());
    }
    CahierAccessService(JdbcTemplate jdbc, UserRepository users, Clock clock, Set<String> documents) {
        this.jdbc = jdbc; this.users = users; this.clock = clock; this.documents = documents;
    }
    private static Set<String> loadDocuments() throws IOException {
        try (var reader = new BufferedReader(new InputStreamReader(new ClassPathResource("cahier-ids.txt").getInputStream(), StandardCharsets.UTF_8))) {
            return Set.copyOf(reader.lines().filter(s -> !s.isBlank()).toList());
        }
    }
    private User user(String email) {
        return users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
    static boolean premium(User user) {
        return user.getRole() != null && (user.getRole().getName() == Role.RoleName.ROLE_PREMIUM
            || user.getRole().getName() == Role.RoleName.ROLE_ADMIN);
    }
    LocalDate weekStart() {
        return LocalDate.now(clock.withZone(ZONE)).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }
    @Transactional(readOnly = true)
    public Access status(String email) { return snapshot(user(email), true); }

    @Transactional
    public Access unlock(String email, String documentId) {
        if (!documents.contains(documentId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown cahier");
        User user = user(email);
        // Serializes concurrent requests across children/devices and server instances.
        jdbc.queryForObject("SELECT id FROM users WHERE id = ? FOR UPDATE", Long.class, user.getId());
        Access before = snapshot(user, true);
        if (before.premium() || before.unlockedIds().contains(documentId)) return before;
        if (before.remaining() == 0) return snapshot(user, false);
        jdbc.update("INSERT INTO family_cahier_unlocks(user_id, document_id, week_start) VALUES (?, ?, ?)",
            user.getId(), documentId, java.sql.Date.valueOf(weekStart()));
        return snapshot(user, true);
    }
    private Access snapshot(User user, boolean allowed) {
        LocalDate monday = weekStart();
        List<String> unlocked = jdbc.queryForList("SELECT document_id FROM family_cahier_unlocks WHERE user_id = ? ORDER BY document_id", String.class, user.getId());
        Integer used = jdbc.queryForObject("SELECT count(*) FROM family_cahier_unlocks WHERE user_id = ? AND week_start = ?", Integer.class,
            user.getId(), java.sql.Date.valueOf(monday));
        return new Access(premium(user), WEEKLY_LIMIT, Math.max(0, WEEKLY_LIMIT - (used == null ? 0 : used)),
            monday.plusWeeks(1).atStartOfDay(ZONE).toInstant().toString(), unlocked, allowed);
    }
}
