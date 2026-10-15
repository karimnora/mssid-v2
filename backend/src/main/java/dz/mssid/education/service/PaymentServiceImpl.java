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

    @Override
    @Transactional
    public PaymentReceipt submitReceipt(String userEmail, ReceiptUploadRequest request) {
        // SEC-04: userEmail comes only from the authenticated principal (PaymentController) — never
        // fall back to a client-supplied request.userEmail, that was an IDOR (attribute a receipt to
        // an arbitrary victim account).
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé pour la soumission du reçu: " + userEmail));

        SubscriptionPlan plan = SubscriptionPlan.resolve(request.getPlanId());
        if (request.getPlanId() != null && !request.getPlanId().isBlank() && request.getAmountDzd() == null) {
            throw new IllegalArgumentException("Le montant de la formule choisie est obligatoire");
        }
        if (request.getAmountDzd() != null && Double.compare(request.getAmountDzd(), plan.priceDzd()) != 0) {
            adminAuditLogService.record(userEmail, "RECEIPT_SUBMITTED", "RECEIPT", null,
                    "montant refusé: " + request.getAmountDzd() + " DZD (attendu " + plan.priceDzd() + " DZD)", "FAILURE");
            throw new IllegalArgumentException(
                    "Le montant indiqué (" + request.getAmountDzd() + " DZD) ne correspond pas au tarif de l'abonnement ("
                            + plan.priceDzd() + " DZD).");
        }

        String imageUrl = request.getReceiptImageUrl() != null ? request.getReceiptImageUrl() : request.getReceiptImgUrl();
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("Une image du reçu est obligatoire");
        }

        PaymentReceipt receipt = PaymentReceipt.builder()
                .user(user)
                .receiptImageUrl(imageUrl)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "BARIDIMOB")
                .transactionRef(request.getTransactionRef() != null ? request.getTransactionRef() : "BM-" + System.currentTimeMillis())
                .amountDzd(plan.priceDzd())
                .planId(plan.id())
                .durationMonths(plan.months())
                .status(PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION)
                .submittedAt(LocalDateTime.now())
                .build();

        PaymentReceipt saved = receiptRepository.save(receipt);
        // saved.getId() is populated in-place by Hibernate for IDENTITY-strategy entities after
        // save(), but stays null against a mocked repository in tests — guard rather than assume.
        String receiptId = saved.getId() != null ? saved.getId().toString() : null;
        adminAuditLogService.record(userEmail, "RECEIPT_SUBMITTED", "RECEIPT", receiptId,
                saved.getPaymentMethod() + " / " + saved.getTransactionRef(), "SUCCESS");
        return saved;
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
        PaymentReceipt receipt = receiptRepository.findForVerification(receiptId)
                .orElseThrow(() -> new RuntimeException("Reçu introuvable avec ID: " + receiptId));

        if (receipt.getStatus() != PaymentReceipt.ReceiptStatus.PENDING_VERIFICATION) {
            throw new IllegalArgumentException("Ce reçu a déjà été traité : aucun abonnement supplémentaire ne sera activé");
        }
        boolean approved = Boolean.TRUE.equals(request.getApprove());

        if (approved) {
            receipt.setStatus(PaymentReceipt.ReceiptStatus.APPROVED);
            receipt.setVerifiedAt(LocalDateTime.now());

            // Upgrade User to ROLE_PREMIUM
            User user = userRepository.findForPayment(receipt.getUser().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Compte introuvable"));
            Role premiumRole = roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName(Role.RoleName.ROLE_PREMIUM);
                        return roleRepository.save(r);
                    });
            user.setRole(premiumRole);
            userRepository.save(user);

            // The chosen-duration subscription record — this is what SubscriptionExpiryService's daily sweep
            // checks to eventually downgrade the user back to ROLE_FREE. Reuses an existing row if the
            // user already had one (e.g. renewing after a prior expiry) instead of accumulating duplicates.
            Subscription subscription = subscriptionRepository.findByUser(user).orElseGet(Subscription::new);
            subscription.setUser(user);
            LocalDate today = LocalDate.now();
            boolean renewing = subscription.getStatus() == Subscription.SubscriptionStatus.ACTIVE && subscription.getEndDate() != null && !subscription.getEndDate().isBefore(today)
                    && subscription.getStartDate() != null;
            LocalDate base = renewing ? subscription.getEndDate() : today;
            if (!renewing) subscription.setStartDate(today);
            subscription.setEndDate(base.plusMonths(receipt.getDurationMonths()));
            subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscription.setPlanId(receipt.getPlanId());
            subscription.setDurationMonths(receipt.getDurationMonths());
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
