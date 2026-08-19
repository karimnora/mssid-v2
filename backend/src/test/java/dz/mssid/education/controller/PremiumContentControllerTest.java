package dz.mssid.education.controller;

import dz.mssid.education.entity.PremiumLessonContent;
import dz.mssid.education.repository.PremiumLessonContentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

// Unit-level only — the @PreAuthorize("hasRole('PREMIUM') or hasRole('ADMIN')") role gate itself
// (the actual point of this endpoint) is exercised by Spring Security's method-security AOP at
// runtime, same as ExamController.getOfficialExamSolution's identical pattern; verify it manually
// (e.g. curl as a ROLE_FREE account, expect 403) once this builds locally — this test only covers
// the controller's own 200/404 branching.
@ExtendWith(MockitoExtension.class)
class PremiumContentControllerTest {

    @Mock
    private PremiumLessonContentRepository premiumLessonContentRepository;

    @Test
    @DisplayName("getPremiumLessonContent - returns the stored content_json as-is when the lesson exists")
    void getPremiumLessonContent_found_returnsContentJson() {
        PremiumLessonContent stored = PremiumLessonContent.builder()
                .lessonId("math-5ap-division")
                .grade("5AP")
                .subject("math")
                .trimester(2)
                .contentJson("{\"id\":\"math-5ap-division\"}")
                .build();
        when(premiumLessonContentRepository.findById("math-5ap-division")).thenReturn(Optional.of(stored));

        PremiumContentController controller = new PremiumContentController(premiumLessonContentRepository);
        ResponseEntity<String> response = controller.getPremiumLessonContent("math-5ap-division");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"id\":\"math-5ap-division\"}", response.getBody());
    }

    @Test
    @DisplayName("getPremiumLessonContent - 404 when the lesson id has no migrated content yet")
    void getPremiumLessonContent_notFound_returns404() {
        when(premiumLessonContentRepository.findById("math-5ap-unmigrated")).thenReturn(Optional.empty());

        PremiumContentController controller = new PremiumContentController(premiumLessonContentRepository);
        ResponseEntity<String> response = controller.getPremiumLessonContent("math-5ap-unmigrated");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
