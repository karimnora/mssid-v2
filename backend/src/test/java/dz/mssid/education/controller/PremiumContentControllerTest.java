package dz.mssid.education.controller;

import dz.mssid.education.entity.PremiumLessonContent;
import dz.mssid.education.repository.PremiumLessonContentRepository;
import dz.mssid.education.service.FeatureFlagService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PremiumContentControllerTest {

    @Mock
    private PremiumLessonContentRepository premiumLessonContentRepository;

    @Mock
    private FeatureFlagService featureFlagService;

    private PremiumContentController controller() {
        return new PremiumContentController(premiumLessonContentRepository, featureFlagService);
    }

    private static PremiumLessonContent storedLesson() {
        return PremiumLessonContent.builder()
                .lessonId("math-5ap-division")
                .grade("5AP")
                .subject("math")
                .trimester(2)
                .contentJson("{\"id\":\"math-5ap-division\"}")
                .build();
    }

    @Test
    @DisplayName("flags off — returns the stored content even for a guest")
    void paywallOff_guest_returnsContent() {
        when(featureFlagService.isTrimesterPaywallActive()).thenReturn(false);
        when(premiumLessonContentRepository.findById("math-5ap-division")).thenReturn(Optional.of(storedLesson()));

        ResponseEntity<String> response = controller().getPremiumLessonContent("math-5ap-division", null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"id\":\"math-5ap-division\"}", response.getBody());
    }

    @Test
    @DisplayName("flags off — 404 when the lesson id has no migrated content yet")
    void paywallOff_notFound_returns404() {
        when(featureFlagService.isTrimesterPaywallActive()).thenReturn(false);
        when(premiumLessonContentRepository.findById("math-5ap-unmigrated")).thenReturn(Optional.empty());

        ResponseEntity<String> response = controller().getPremiumLessonContent("math-5ap-unmigrated", null);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @DisplayName("flags on — guest and ROLE_FREE get 403")
    void paywallOn_freeOrGuest_returns403() {
        when(featureFlagService.isTrimesterPaywallActive()).thenReturn(true);

        assertEquals(HttpStatus.FORBIDDEN,
                controller().getPremiumLessonContent("math-5ap-division", null).getStatusCode());

        var free = new UsernamePasswordAuthenticationToken(
                "younes", "x", List.of(new SimpleGrantedAuthority("ROLE_FREE")));
        assertEquals(HttpStatus.FORBIDDEN,
                controller().getPremiumLessonContent("math-5ap-division", free).getStatusCode());
    }

    @Test
    @DisplayName("flags on — ROLE_PREMIUM can read the stored content")
    void paywallOn_premium_returnsContent() {
        when(featureFlagService.isTrimesterPaywallActive()).thenReturn(true);
        when(premiumLessonContentRepository.findById("math-5ap-division")).thenReturn(Optional.of(storedLesson()));

        var premium = new UsernamePasswordAuthenticationToken(
                "sara", "x", List.of(new SimpleGrantedAuthority("ROLE_PREMIUM")));
        ResponseEntity<String> response = controller().getPremiumLessonContent("math-5ap-division", premium);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"id\":\"math-5ap-division\"}", response.getBody());
    }
}
