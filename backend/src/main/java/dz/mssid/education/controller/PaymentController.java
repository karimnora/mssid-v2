package dz.mssid.education.controller;

import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Soumission d'un reçu de paiement (BaridiMob / CCP / Edahabia).
     * POST /api/v1/payments/receipt/upload OR POST /api/receipts/submit
     */
    @PostMapping({"/api/v1/payments/receipt/upload", "/api/receipts/submit"})
    public ResponseEntity<PaymentReceipt> submitReceipt(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ReceiptUploadRequest request
    ) {
        String email = userDetails != null ? userDetails.getUsername() : request.getUserEmail();
        PaymentReceipt receipt = paymentService.submitReceipt(email, request);
        return ResponseEntity.ok(receipt);
    }

    /**
     * Récupération de tous les reçus de paiement (Réservé aux Administrateurs).
     * GET /api/v1/payments/admin/receipts OR GET /api/receipts/all
     */
    @GetMapping({"/api/v1/payments/admin/receipts", "/api/receipts/all"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentReceipt>> getAllReceipts() {
        List<PaymentReceipt> receipts = paymentService.getAllReceipts();
        return ResponseEntity.ok(receipts);
    }

    /**
     * Validation ou rejet d'un reçu par l'Administrateur.
     * PUT /api/v1/payments/admin/receipts/{id}/verify OR PUT /api/receipts/verify/{id}
     */
    @PutMapping({"/api/v1/payments/admin/receipts/{id}/verify", "/api/receipts/verify/{id}"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentReceipt> verifyReceipt(
            @PathVariable Long id,
            @RequestBody VerifyReceiptRequest request
    ) {
        PaymentReceipt updated = paymentService.verifyReceipt(id, request);
        return ResponseEntity.ok(updated);
    }
}
