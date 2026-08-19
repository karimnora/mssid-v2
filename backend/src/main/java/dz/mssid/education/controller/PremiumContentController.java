package dz.mssid.education.controller;

import dz.mssid.education.entity.PremiumLessonContent;
import dz.mssid.education.repository.PremiumLessonContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class PremiumContentController {

    private final PremiumLessonContentRepository premiumLessonContentRepository;

    /**
     * The T2/T3 server-side content gate (pilot) — see trimesterAccess.ts's own doc comment for the
     * problem this closes: T2/T3 lesson content used to be statically bundled into the frontend JS
     * for every visitor regardless of role. Same @PreAuthorize pattern already used for paywalled
     * exam solutions (see ExamController.getOfficialExamSolution / SEC-04) — anything short of
     * PREMIUM/ADMIN never reaches the method body, Spring Security returns 403 on its own.
     * GET /api/v1/courses/premium-lessons/{lessonId}
     */
    @GetMapping(value = "/premium-lessons/{lessonId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('PREMIUM') or hasRole('ADMIN')")
    public ResponseEntity<String> getPremiumLessonContent(@PathVariable String lessonId) {
        return premiumLessonContentRepository.findById(lessonId)
                .map(content -> ResponseEntity.ok(content.getContentJson()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
