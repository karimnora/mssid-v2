package dz.mssid.education.service;

import dz.mssid.education.dto.CheckoutRequest;
import dz.mssid.education.dto.CheckoutResponse;
import dz.mssid.education.dto.PaymentWebhookResponse;
import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.dto.WebhookEventRequest;
import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.PaymentTransaction;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.Subscription;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.PaymentReceiptRepository;
import dz.mssid.education.repository.PaymentTransactionRepository;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentReceiptRepository receiptRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public PaymentReceipt submitReceipt(String userEmail, ReceiptUploadRequest request) {
        // SEC-04: userEmail comes only from the authenticated principal (PaymentController) — never
        // fall back to a client-supplied request.userEmail, that was an IDOR (attribute a receipt to
        // an arbitrary victim account).
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé pour la soumission du reçu: " + userEmail));

        String imageUrl = request.getReceiptImageUrl() != null ? request.getReceiptImageUrl() : request.getReceiptImgUrl();
        if (imageUrl == null || imageUrl.isBlank()) {
            imageUrl = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400";
        }

        PaymentReceipt receipt = PaymentReceipt.builder()
                .user(user)
                .receiptImageUrl(imageUrl)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "BARIDIMOB")
                .transactionRef(request.getTransactionRef() != null ? request.getTransactionRef() : "BM-" + System.currentTimeMillis())
                .amountDzd(request.getAmountDzd() != null ? request.getAmountDzd() : 1500.0)
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
    public CheckoutResponse createCheckout(String userEmail, CheckoutRequest request) {
        // SEC-04: same fix as submitReceipt — identity comes only from the authenticated principal.
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé pour la création du checkout: " + userEmail));

        String transactionRef = request.getTransactionRef() != null && !request.getTransactionRef().isBlank()
                ? request.getTransactionRef()
                : "CPAY-" + UUID.randomUUID();
        String checkoutId = "CHG-" + UUID.randomUUID();
        String providerName = request.getProviderName() != null ? request.getProviderName() : "ChargilyPayV2";
        String paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod() : "BARIDIMOB";
        Double amount = request.getAmountDzd() != null ? request.getAmountDzd() : 1500.0;

        String checkoutUrl = String.format("https://pay.chargily.com/checkout/%s?amount=%.0f&method=%s&ref=%s", checkoutId, amount, paymentMethod, transactionRef);

        PaymentTransaction transaction = PaymentTransaction.builder()
                .user(user)
                .checkoutId(checkoutId)
                .transactionRef(transactionRef)
                .providerName(providerName)
                .paymentMethod(paymentMethod)
                .amountDzd(amount)
                .checkoutUrl(checkoutUrl)
                .status(PaymentTransaction.TransactionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        paymentTransactionRepository.save(transaction);

        return CheckoutResponse.builder()
                .checkoutId(checkoutId)
                .checkoutUrl(checkoutUrl)
                .transactionRef(transactionRef)
                .status("PENDING")
                .message("Checkout créé. Utilisez l'URL de paiement pour finaliser la transaction.")
                .build();
    }

    @Override
    @Transactional
    public PaymentWebhookResponse processWebhook(WebhookEventRequest request) {
        String checkoutId = request.getCheckoutId();
        String transactionRef = request.getTransactionRef();
        String status = request.getStatus() != null ? request.getStatus().toUpperCase() : "";

        PaymentTransaction transaction = paymentTransactionRepository.findByCheckoutId(checkoutId)
                .or(() -> transactionRef != null ? paymentTransactionRepository.findByTransactionRef(transactionRef) : java.util.Optional.empty())
                .orElseThrow(() -> new RuntimeException("Transaction introuvable pour webhook: " + checkoutId));

        if (status.contains("COMPLET") || status.contains("SUCCESS") || status.contains("PAID")) {
            transaction.setStatus(PaymentTransaction.TransactionStatus.COMPLETED);
        } else {
            transaction.setStatus(PaymentTransaction.TransactionStatus.FAILED);
        }
        transaction.setUpdatedAt(LocalDateTime.now());
        paymentTransactionRepository.save(transaction);

        // SEC-04: the user to upgrade is whoever actually owns this transaction (set at checkout
        // creation, from the authenticated caller) — never request.getUserEmail(), which is fully
        // client-controlled and previously let any caller premium-upgrade an arbitrary account.
        User user = transaction.getUser();

        if (transaction.getStatus() == PaymentTransaction.TransactionStatus.COMPLETED) {
            Role premiumRole = roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setName(Role.RoleName.ROLE_PREMIUM);
                        return roleRepository.save(r);
                    });

            user.setRole(premiumRole);

            Subscription subscription = user.getSubscription();
            if (subscription == null) {
                subscription = new Subscription();
                subscription.setUser(user);
            }
            subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscription.setStartDate(LocalDate.now());
            subscription.setEndDate(LocalDate.now().plusDays(30));
            user.setSubscription(subscription);

            userRepository.save(user);

            return PaymentWebhookResponse.builder()
                    .success(true)
                    .message("Paiement confirmé et rôle premium activé.")
                    .checkoutId(transaction.getCheckoutId())
                    .transactionRef(transaction.getTransactionRef())
                    .build();
        }

        return PaymentWebhookResponse.builder()
                .success(false)
                .message("Webhook reçu, mais le paiement n'a pas été validé.")
                .checkoutId(transaction.getCheckoutId())
                .transactionRef(transaction.getTransactionRef())
                .build();
    }

    @Override
    @Transactional
    public PaymentReceipt verifyReceipt(Long receiptId, VerifyReceiptRequest request) {
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
        } else {
            receipt.setStatus(PaymentReceipt.ReceiptStatus.REJECTED);
            receipt.setRejectionReason(request.getRejectionReason() != null ? request.getRejectionReason() : "Document non conforme");
            receipt.setVerifiedAt(LocalDateTime.now());
        }

        return receiptRepository.save(receipt);
    }
}
