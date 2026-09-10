package dz.mssid.education.controller;

import dz.mssid.education.dto.ReelScriptDto;
import dz.mssid.education.entity.AdReel;
import dz.mssid.education.repository.AdReelRepository;
import dz.mssid.education.service.AdminAuditLogService;
import dz.mssid.education.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * "Reels CMS Studio" / usine de pub — admin-only reel generator (AI script via GeminiAiService,
 * edited then exported client-side to PNG/MP4, see frontend ReelsStudioModule.tsx). Follows
 * AdminController's pattern: class-level @PreAuthorize, no AiQuotaService metering (that's for
 * student-facing FREE/PREMIUM quotas — this endpoint is already role-gated and uses its own
 * independent Gemini key, see GeminiAiService.reelsApiKey).
 */
@RestController
@RequestMapping("/api/v1/admin/reels")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdReelController {

    private final AdReelRepository adReelRepository;
    private final GeminiAiService geminiAiService;
    private final AdminAuditLogService adminAuditLogService;

    public record GenerateReelRequest(String topic, String gradeLevel, String language, Integer slideCount) {}

    @PostMapping("/generate")
    public ResponseEntity<ReelScriptDto> generate(@RequestBody GenerateReelRequest request) {
        ReelScriptDto draft = geminiAiService.generateReelScript(
                request.topic(), request.gradeLevel(), request.language(),
                request.slideCount() != null ? request.slideCount() : 4);
        adminAuditLogService.record(currentActorEmail(), "AI_REEL_GENERATED", "AD_REEL", null,
                request.topic(), "success".equals(draft.getStatus()) ? "SUCCESS" : "FAILURE");
        return ResponseEntity.ok(draft);
    }

    @GetMapping
    public ResponseEntity<List<AdReel>> list() {
        return ResponseEntity.ok(adReelRepository.findAllByOrderByUpdatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<AdReel> create(@RequestBody AdReel reel) {
        reel.setId(null);
        reel.setCreatedByEmail(currentActorEmail());
        reel.setCreatedAt(LocalDateTime.now());
        reel.setUpdatedAt(LocalDateTime.now());
        AdReel saved = adReelRepository.save(reel);
        adminAuditLogService.record(currentActorEmail(), "AD_REEL_SAVED", "AD_REEL", String.valueOf(saved.getId()),
                saved.getTitle(), "SUCCESS");
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdReel> update(@PathVariable Long id, @RequestBody AdReel reel) {
        return adReelRepository.findById(id)
                .map(existing -> {
                    reel.setId(existing.getId());
                    reel.setCreatedByEmail(existing.getCreatedByEmail());
                    reel.setCreatedAt(existing.getCreatedAt());
                    reel.setUpdatedAt(LocalDateTime.now());
                    AdReel saved = adReelRepository.save(reel);
                    adminAuditLogService.record(currentActorEmail(), "AD_REEL_SAVED", "AD_REEL", String.valueOf(id),
                            saved.getTitle(), "SUCCESS");
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        if (!adReelRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        adReelRepository.deleteById(id);
        adminAuditLogService.record(currentActorEmail(), "AD_REEL_DELETED", "AD_REEL", String.valueOf(id),
                null, "SUCCESS");
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    private String currentActorEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.isAuthenticated()) ? auth.getName() : "inconnu";
    }
}
