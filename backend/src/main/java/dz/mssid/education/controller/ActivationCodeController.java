package dz.mssid.education.controller;

import dz.mssid.education.service.ActivationCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/** كود التفعيل: redeem (any signed-in account, web only in the app), generate / list / revoke (admin). */
@RestController
@RequiredArgsConstructor
public class ActivationCodeController {

    private final ActivationCodeService codes;

    public record RedeemRequest(String code) {
    }

    public record GenerateRequest(String planId, Integer count, Integer seats, String kind, String label, LocalDate validUntil) {
    }

    public record RevokeRequest(String label) {
    }

    @PostMapping("/api/v1/activation-codes/redeem")
    public ActivationCodeService.Redeemed redeem(@RequestBody RedeemRequest request, Authentication auth) {
        return codes.redeem(auth.getName(), request.code());
    }

    @PostMapping("/api/v1/admin/activation-codes")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, List<String>> generate(@RequestBody GenerateRequest request, Authentication auth) {
        return Map.of("codes", codes.generate(request.planId(), request.count() == null ? 1 : request.count(),
                request.seats() == null ? 1 : request.seats(), request.kind() == null ? "CARD" : request.kind(),
                request.label(), request.validUntil(), auth.getName()));
    }

    @GetMapping("/api/v1/admin/activation-codes/batches")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivationCodeService.Batch> batches() {
        return codes.batches();
    }

    @PostMapping("/api/v1/admin/activation-codes/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Integer> revoke(@RequestBody RevokeRequest request, Authentication auth) {
        return Map.of("revoked", codes.revokeBatch(request.label(), auth.getName()));
    }
}
