package dz.mssid.education.service;

import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.Subscription;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.PaymentReceiptRepository;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.SubscriptionRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentReceiptRepository receiptRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AdminAuditLogService adminAuditLogService;

    // Single source of truth for the subscription price server-side — the frontend mirrors this same
    // value (see frontend/src/constants/pricing.ts). A submitted amount that doesn't match this is
    // rejected outright rather than silently accepted, closing the gap where a receipt could claim
    // any amount with nothing to cross-check it against the real price before an admin approves it.
    @Value("${app.payments.subscription-price-dzd:1500}")
    private double subscriptionPriceDzd;

    @Override
    @Transactional
    public PaymentReceipt submitReceipt(String userEmail, ReceiptUploadRequest request) {
        // SEC-04: userEmail comes only from the authenticated principal (PaymentController) — never
        // fall back to a client-supplied request.userEmail, that was an IDOR (attribute a receipt to
        // an arbitrary victim account).
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé pour la soumission du reçu: " + userEmail));

        if (request.getAmountDzd() != null && Double.compare(request.getAmountDzd(), subscriptionPriceDzd) != 0) {
            throw new IllegalArgumentException(
                    "Le montant indiqué (" + request.getAmountDzd() + " DZD) ne correspond pas au tarif de l'abonnement ("
                            + subscriptionPriceDzd + " DZD).");
        }

        String imageUrl = request.getReceiptImageUrl() != null ? request.getReceiptImageUrl() : request.getReceiptImgUrl();
        if (imageUrl == null || imageUrl.isBlank()) {
            imageUrl = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400";
        }

        PaymentReceipt receipt = PaymentReceipt.builder()
                .user(user)
                .receiptImageUrl(imageUrl)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "BARIDIMOB")
                .transactionRef(request.getTransactionRef() != null ? request.getTransactionRef() : "BM-" + System.currentTimeMillis())
                .amountDzd(subscriptionPriceDzd)
                .status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION)
                .submittedAt(LocalDateTime.now())
                .build();

        return receiptRepository.save(receipt);
    }

    @Override
    public List<PaymentReceipt> getAllReceipts() {
        return receiptRepository.findAll();
    }

    @Override
    public List<PaymentReceipt> getReceiptsByStatus(PaymentReceipt.ReceiptStatus status) {
        return receiptRepository.findByStatus(status);
    }

    @Override
    @Transactional
    public PaymentReceipt verifyReceipt(Long receiptId, VerifyReceiptRequest request, String actorEmail) {
        PaymentReceipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new RuntimeException("Reçu introuvable avec ID: " + receiptId));

        boolean approved = Boolean.TRUE.equals(request.getApprove());

        if (approved) {
            receipt.setStatus(PaymentReceipt.ReceiptStatus.APPROVED);
            receipt.setVerifiedAt(LocalDateTime.now());

            // Upgrade User to ROLE_PREMIUM
            User user = receipt.getUser();
            Role premiumRole = roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName(Role.RoleName.ROLE_PREMIUM);
                        return roleRepository.save(r);
                    });
            user.setRole(premiumRole);
            userRepository.save(user);

            // The annual subscription record — this is what SubscriptionExpiryService's daily sweep
            // checks to eventually downgrade the user back to ROLE_FREE. Reuses an existing row if the
            // user already had one (e.g. renewing after a prior expiry) instead of accumulating duplicates.
            Subscription subscription = subscriptionRepository.findByUser(user).orElseGet(Subscription::new);
            subscription.setUser(user);
            subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscription.setStartDate(LocalDate.now());
            subscription.setEndDate(LocalDate.now().plusYears(1));
            subscriptionRepository.save(subscription);

            adminAuditLogService.record(actorEmail, "RECEIPT_APPROVED", "RECEIPT", receiptId.toString(), "user upgraded to ROLE_PREMIUM");
        } else {
            receipt.setStatus(PaymentReceipt.ReceiptStatus.REJECTED);
            receipt.setRejectionReason(request.getRejectionReason() != null ? request.getRejectionReason() : "Document non conforme");
            receipt.setVerifiedAt(LocalDateTime.now());

            adminAuditLogService.record(actorEmail, "RECEIPT_REJECTED", "RECEIPT", receiptId.toString(), "rejected: " + receipt.getRejectionReason());
        }

        return receiptRepository.save(receipt);
    }
}
