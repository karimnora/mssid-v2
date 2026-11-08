package dz.mssid.education.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.*;
import java.util.*;

@Service
public class PremiumFunnelService {
    private static final Set<String> EVENTS = Set.of("lock_open", "parent_interest", "offer_open", "demo_complete", "musaidi_suggestion", "musaidi_correction", "musaidi_twin", "musaidi_revision");
    private static final Set<String> GRADES = Set.of("1AP", "2AP", "3AP", "4AP", "5AP", "unknown");
    private final JdbcTemplate jdbc;
    private final Clock clock;
    @Autowired
    public PremiumFunnelService(JdbcTemplate jdbc) { this(jdbc, Clock.systemUTC()); }
    PremiumFunnelService(JdbcTemplate jdbc, Clock clock) { this.jdbc = jdbc; this.clock = clock; }
    private LocalDate today() { return LocalDate.now(clock.withZone(ZoneId.of("Africa/Algiers"))); }

    public void record(Map<String, Object> payload) {
        if (payload == null || !payload.keySet().equals(Set.of("event", "grade", "day"))) throw bad();
        if (!(payload.get("event") instanceof String event) || !EVENTS.contains(event)
                || !(payload.get("grade") instanceof String grade) || !GRADES.contains(grade)
                || !(payload.get("day") instanceof String dayText)) throw bad();
        LocalDate day;
        try { day = LocalDate.parse(dayText); } catch (RuntimeException e) { throw bad(); }
        if (day.isAfter(today()) || day.isBefore(today().minusDays(7))) throw bad();
        jdbc.update("INSERT INTO premium_funnel_daily(event,grade,day,total) VALUES (?,?,?,1) "
                + "ON CONFLICT(event,grade,day) DO UPDATE SET total=LEAST(premium_funnel_daily.total+1,1000000000)",
                event, grade, day);
    }
    public record Count(String event, String grade, LocalDate day, long total) {}
    public List<Count> totals(LocalDate from, LocalDate to) {
        if (from == null || to == null || from.isAfter(to) || from.isBefore(to.minusDays(30)) || to.isAfter(today())) throw bad();
        return jdbc.query("SELECT event,grade,day,total FROM premium_funnel_daily WHERE day BETWEEN ? AND ? ORDER BY day DESC,grade,event",
                (rs, n) -> new Count(rs.getString("event"), rs.getString("grade"), rs.getObject("day", LocalDate.class), rs.getLong("total")), from, to);
    }
    public List<Count> recent() { return totals(today().minusDays(6), today()); }
    @Scheduled(cron = "0 20 3 * * *", zone = "Africa/Algiers")
    public void purge() { jdbc.update("DELETE FROM premium_funnel_daily WHERE day < ?", today().minusDays(90)); }
    private static ResponseStatusException bad() { return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid aggregate event"); }
}
