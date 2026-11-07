package dz.mssid.education.controller;

import dz.mssid.education.service.PremiumFunnelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PremiumFunnelController {
    private final PremiumFunnelService service;
    @PostMapping("/analytics/premium-funnel")
    public ResponseEntity<Void> record(@RequestBody Map<String, Object> payload) {
        service.record(payload);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/admin/premium-funnel")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PremiumFunnelService.Count> recent() { return service.recent(); }
}
