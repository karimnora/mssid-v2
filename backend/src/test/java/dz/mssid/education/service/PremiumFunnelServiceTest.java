package dz.mssid.education.service;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.server.ResponseStatusException;
import java.time.*;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
class PremiumFunnelServiceTest {
    private final JdbcTemplate jdbc = mock(JdbcTemplate.class);
    private final PremiumFunnelService service = new PremiumFunnelService(jdbc, Clock.fixed(Instant.parse("2026-11-06T23:30:00Z"), ZoneOffset.UTC));
    @Test void acceptsOnlyThreeAnonymousFieldsAndUsesOneAtomicIncrement() {
        service.record(Map.of("event", "offer_open", "grade", "5AP", "day", "2026-11-07"));
        verify(jdbc).update(contains("ON CONFLICT"), eq("offer_open"), eq("5AP"), eq(LocalDate.of(2026,11,7)));
        verifyNoMoreInteractions(jdbc);
    }
    @Test void acceptsAnonymousMusaidiEvents() {
        for (String event : List.of("musaidi_suggestion", "musaidi_correction", "musaidi_twin", "musaidi_revision")) {
            service.record(Map.of("event", event, "grade", "5AP", "day", "2026-11-07"));
            verify(jdbc).update(contains("ON CONFLICT"), eq(event), eq("5AP"), eq(LocalDate.of(2026,11,7)));
        }
    }
    @Test void rejectsIdentityExtraFieldsInvalidGradesAndUnboundedDates() {
        assertThrows(ResponseStatusException.class, () -> service.record(Map.of("event","offer_open","grade","5AP","day","2026-11-07","childId",7)));
        assertThrows(ResponseStatusException.class, () -> service.record(Map.of("event","offer_open","grade","user-7","day","2026-11-07")));
        assertThrows(ResponseStatusException.class, () -> service.record(Map.of("event","offer_open","grade","5AP","day","2027-01-01")));
        assertThrows(ResponseStatusException.class, () -> service.record(Map.of("event","offer_open","grade","5AP","day","2020-01-01")));
        assertThrows(ResponseStatusException.class, () -> service.record(Map.of("event","paid","grade","5AP","day","2026-11-07")));
        verifyNoInteractions(jdbc);
    }
}
