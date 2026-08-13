package dz.mssid.education.controller;

import dz.mssid.education.dto.CheckoutRequest;
import dz.mssid.education.dto.CheckoutResponse;
import dz.mssid.education.dto.PaymentWebhookResponse;
import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.dto.WebhookEventRequest;
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
        // SEC-04: identity comes only from the authenticated principal — never from a client-supplied
        // email in the body (that was a latent IDOR: any caller could attribute a receipt to another
        // account by setting request.userEmail, which then gets premium-upgraded on admin approval).
        PaymentReceipt receipt = paymentService.submitReceipt(userDetails.getUsername(), request);
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

    @PostMapping("/api/v1/payments/checkout")
    public ResponseEntity<CheckoutResponse> createCheckout(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CheckoutRequest request
    ) {
        // SEC-04: same fix as submitReceipt — never trust request.userEmail for identity.
        CheckoutResponse response = paymentService.createCheckout(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * SEC-04 (critical fix): this used to accept ANY authenticated user's JWT with no role check,
     * trust a client-supplied `status` string ("PAID" sufficed) and a client-supplied `userEmail` —
     * letting any logged-in student grant ROLE_PREMIUM to any account (including their own) for free.
     * No real payment-gateway signature verification exists yet, so admin-only is the safest gate
     * available today; PaymentServiceImpl.processWebhook also no longer trusts request.userEmail.
     */
    @PostMapping("/api/v1/payments/webhook")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentWebhookResponse> handleWebhook(@RequestBody WebhookEventRequest request) {
        PaymentWebhookResponse response = paymentService.processWebhook(request);
        return ResponseEntity.ok(response);
    }
}
