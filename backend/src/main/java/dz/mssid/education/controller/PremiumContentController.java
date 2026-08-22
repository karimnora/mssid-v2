package dz.mssid.education.controller;

import dz.mssid.education.repository.PremiumLessonContentRepository;
import dz.mssid.education.service.FeatureFlagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class PremiumContentController {

    private static final Set<String> PREMIUM_OR_STAFF = Set.of("ROLE_PREMIUM", "ROLE_ADMIN");

    private final PremiumLessonContentRepository premiumLessonContentRepository;
    private final FeatureFlagService featureFlagService;

    /**
     * T2/T3 server-side content gate. Lesson bodies are stored here so they stay out of the
     * JS bundle. Access follows the same two flags as {@code isLessonLocked} on the client:
     * <ul>
     *   <li>flags off (launch window — payments not collectable yet): anyone can read the content,
     *       including guests. ROLE_FREE is not a special case; the gate is simply inactive.</li>
     *   <li>both enablePayments and enableTrimesterPaywall on: PREMIUM/ADMIN only, otherwise 403.</li>
     * </ul>
     * GET /api/v1/courses/premium-lessons/{lessonId}
     */
    @GetMapping(value = "/premium-lessons/{lessonId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getPremiumLessonContent(
            @PathVariable String lessonId,
            Authentication authentication
    ) {
        if (featureFlagService.isTrimesterPaywallActive() && !isPremiumOrAdmin(authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return premiumLessonContentRepository.findById(lessonId)
                .map(content -> ResponseEntity.ok(content.getContentJson()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    private static boolean isPremiumOrAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(PREMIUM_OR_STAFF::contains);
    }
}
