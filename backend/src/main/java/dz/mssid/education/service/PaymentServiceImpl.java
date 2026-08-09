package dz.mssid.education.service;

import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.PaymentReceiptRepository;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentReceiptRepository receiptRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public PaymentReceipt submitReceipt(String userEmail, ReceiptUploadRequest request) {
        String email = (userEmail != null && !userEmail.isBlank()) ? userEmail : request.getUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé pour la soumission du reçu: " + email));

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
