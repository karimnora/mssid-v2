package dz.mssid.education.controller;

import dz.mssid.education.dto.UpdateFeatureFlagRequest;
import dz.mssid.education.service.FeatureFlagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class FeatureFlagController {

    private final FeatureFlagService featureFlagService;

    /**
     * Public — every visitor's client (not just admins) hydrates local feature-flag overrides from
     * here at app boot, so a toggle made by one admin reaches every browser/device on next load.
     */
    @GetMapping("/api/v1/feature-flags")
    public ResponseEntity<Map<String, Boolean>> getFeatureFlags() {
        return ResponseEntity.ok(featureFlagService.getAllOverrides());
    }

    @PutMapping("/api/v1/admin/feature-flags/{flagKey}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateFeatureFlag(
            @PathVariable String flagKey,
            @RequestBody UpdateFeatureFlagRequest request,
            @AuthenticationPrincipal UserDetails principal
    ) {
        if (request.getEnabled() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Le paramètre 'enabled' est obligatoire"));
        }
        featureFlagService.upsertFlag(flagKey, request.getEnabled(), principal.getUsername());
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/api/v1/admin/feature-flags/{flagKey}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFeatureFlagOverride(
            @PathVariable String flagKey,
            @AuthenticationPrincipal UserDetails principal
    ) {
        featureFlagService.deleteOverride(flagKey, principal.getUsername());
        return ResponseEntity.ok(Map.of("success", true));
    }
}
