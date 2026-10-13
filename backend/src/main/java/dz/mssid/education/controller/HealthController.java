package dz.mssid.education.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
 * Keep this endpoint independent of the database: frequent platform probes must not
 * prevent an idle Neon compute from suspending. Database diagnostics are admin-only.
 */
@RestController
@RequiredArgsConstructor
public class HealthController {

    private final DataSource dataSource;

    @GetMapping("/api/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/health/database")
    public ResponseEntity<?> databaseHealth() {
        try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("SELECT 1");
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of("status", "DOWN", "database", "unreachable"));
        }
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
