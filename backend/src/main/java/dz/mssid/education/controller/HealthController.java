package dz.mssid.education.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.util.Map;

/**
 * Public, unauthenticated liveness check — used as the health check path by the hosting platform
 * (e.g. Render) to know the container is up and serving traffic.
 *
 * Also runs a trivial query on every call to verify database connectivity and return 503
 * when the database is unavailable.
 */
@RestController
@RequiredArgsConstructor
public class HealthController {

    private final DataSource dataSource;

    @GetMapping("/api/health")
    public ResponseEntity<?> health() {
        try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("SELECT 1");
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("status", "DOWN", "database", "unreachable"));
        }
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
