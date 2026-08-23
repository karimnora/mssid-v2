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
 * Also runs a trivial query on every call so the existing keep-alive ping
 * (.github/workflows/keep-backend-awake.yml, every 10 min) stops the database from auto-suspending
 * too, not just the web service. Render's container staying warm was never the whole story: on a
 * free-tier managed Postgres (e.g. Neon), the database itself suspends independently after its own
 * idle window, so the first real DB-touching request after a quiet period — login is usually it —
 * still ate that separate cold-start on top of any Render one.
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
