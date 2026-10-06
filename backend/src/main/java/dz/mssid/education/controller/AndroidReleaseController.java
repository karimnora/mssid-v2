package dz.mssid.education.controller;

import dz.mssid.education.dto.AndroidReleaseResponse;
import dz.mssid.education.dto.UpdateAndroidReleaseRequest;
import dz.mssid.education.service.AndroidReleaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AndroidReleaseController {

    private final AndroidReleaseService androidReleaseService;

    /** Public — the native app compares this to its bundled versionCode on every launch. */
    @GetMapping("/api/v1/android-release")
    public ResponseEntity<AndroidReleaseResponse> getAndroidRelease() {
        return ResponseEntity.ok(androidReleaseService.getRelease());
    }

    @PutMapping("/api/v1/admin/android-release")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAndroidRelease(
            @RequestBody UpdateAndroidReleaseRequest request,
            @AuthenticationPrincipal UserDetails principal
    ) {
        if (request.getLatestVersionCode() == null && request.getMinVersionCode() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Au moins un versionCode est obligatoire"));
        }
        try {
            return ResponseEntity.ok(androidReleaseService.update(
                    request.getLatestVersionCode(),
                    request.getMinVersionCode(),
                    principal.getUsername()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
