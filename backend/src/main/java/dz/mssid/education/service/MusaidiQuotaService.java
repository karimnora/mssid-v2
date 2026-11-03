package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.regex.Pattern;

/**
 * « مساعدي » daily quota (V2, docs/v2-gratuit-payant.md): a free account opens at most
 * {@value #FREE_DAILY_CORRECTIONS} detailed corrections per Algerian calendar day; re-opening one
 * already seen that day is free; Premium and admin accounts are unlimited. Stored in the database
 * (not in memory) so it survives restarts of the free Render instance and device reinstalls.
 */
@Service
public class MusaidiQuotaService {

    public static final int FREE_DAILY_CORRECTIONS = 3;
    static final ZoneId ALGIERS = ZoneId.of("Africa/Algiers");
    /** Bank ids look like "math-1ap-t1-spatial-relations:quiz:q1". */
    private static final Pattern ITEM_ID = Pattern.compile("[A-Za-z0-9:_.-]{1,200}");

    private final JdbcTemplate jdbc;
    private final UserRepository users;
    private final Clock clock;

    @Autowired
    public MusaidiQuotaService(JdbcTemplate jdbc, UserRepository users) {
        this(jdbc, users, Clock.system(ALGIERS));
    }

    MusaidiQuotaService(JdbcTemplate jdbc, UserRepository users, Clock clock) {
        this.jdbc = jdbc;
        this.users = users;
        this.clock = clock;
    }

    /** {@code limit} and {@code remaining} are null for unlimited (Premium/admin) accounts. */
    public record Status(boolean allowed, boolean premium, Integer limit, Integer remaining, List<String> opened, String day) {
    }

    @Transactional(readOnly = true)
    public Status today(String email) {
        User user = user(email);
        LocalDate day = LocalDate.now(clock);
        if (isUnlimited(user)) {
            return status(true, user, List.of(), day);
        }
        return status(true, user, opened(user.getId(), day), day);
    }

    @Transactional
    public Status open(String email, String itemId) {
        if (itemId == null || !ITEM_ID.matcher(itemId).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid item");
        }
        User user = user(email);
        LocalDate day = LocalDate.now(clock);
        if (isUnlimited(user)) {
            return status(true, user, List.of(), day);
        }
        // Serializes two quick taps, or two devices of the same family, on the same account.
        jdbc.queryForObject("SELECT id FROM users WHERE id=? FOR UPDATE", Long.class, user.getId());
        List<String> opened = opened(user.getId(), day);
        if (opened.contains(itemId)) {
            return status(true, user, opened, day);
        }
        if (opened.size() >= FREE_DAILY_CORRECTIONS) {
            return status(false, user, opened, day);
        }
        jdbc.update("INSERT INTO musaidi_openings(user_id, day, item_id) VALUES (?,?,?) ON CONFLICT DO NOTHING",
                user.getId(), day, itemId);
        return status(true, user, opened(user.getId(), day), day);
    }

    /** Keeps the table small: only the current day is ever read. */
    @Scheduled(cron = "0 30 3 * * *", zone = "Africa/Algiers")
    @Transactional
    public void purgeOldDays() {
        jdbc.update("DELETE FROM musaidi_openings WHERE day < ?", LocalDate.now(clock).minusDays(7));
    }

    private User user(String email) {
        return users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    private List<String> opened(Long userId, LocalDate day) {
        return jdbc.queryForList("SELECT item_id FROM musaidi_openings WHERE user_id=? AND day=? ORDER BY opened_at, item_id",
                String.class, userId, day);
    }

    static boolean isUnlimited(User user) {
        Role role = user.getRole();
        return role != null && (role.getName() == Role.RoleName.ROLE_PREMIUM || role.getName() == Role.RoleName.ROLE_ADMIN);
    }

    private static Status status(boolean allowed, User user, List<String> opened, LocalDate day) {
        if (isUnlimited(user)) {
            return new Status(true, true, null, null, List.of(), day.toString());
        }
        int remaining = Math.max(0, FREE_DAILY_CORRECTIONS - opened.size());
        return new Status(allowed, false, FREE_DAILY_CORRECTIONS, remaining, List.copyOf(opened), day.toString());
    }
}
