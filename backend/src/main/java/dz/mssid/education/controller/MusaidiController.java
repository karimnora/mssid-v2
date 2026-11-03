package dz.mssid.education.controller;

import dz.mssid.education.service.MusaidiQuotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * « مساعدي » daily quota. GET /api/v1/musaidi/today, POST /api/v1/musaidi/open {"itemId": "..."}.
 * Both answer 200 with the current status; a refused opening has {@code allowed: false}.
 */
@RestController
@RequestMapping("/api/v1/musaidi")
@RequiredArgsConstructor
public class MusaidiController {

    private final MusaidiQuotaService service;

    public record OpenRequest(String itemId) {
    }

    @GetMapping("/today")
    public ResponseEntity<MusaidiQuotaService.Status> today(@AuthenticationPrincipal UserDetails user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(service.today(user.getUsername()));
    }

    @PostMapping("/open")
    public ResponseEntity<MusaidiQuotaService.Status> open(@AuthenticationPrincipal UserDetails user,
                                                           @RequestBody(required = false) OpenRequest request) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(service.open(user.getUsername(), request == null ? null : request.itemId()));
    }
}
