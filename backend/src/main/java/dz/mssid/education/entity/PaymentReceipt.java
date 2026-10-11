package dz.mssid.education.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_receipts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "receipt_image_url", nullable = false, columnDefinition = "text")
    private String receiptImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReceiptStatus status = ReceiptStatus.PENDING_VERIFICATION;

    @Column(name = "payment_method")
    private String paymentMethod; // BARIDIMOB, EDAHABIA, CCP

    @Column(name = "transaction_ref")
    private String transactionRef;

    @Column(name = "amount_dzd")
    private Double amountDzd = 1500.0;

    @Column(name = "plan_id", nullable = false)
    @Builder.Default
    private String planId = "LEGACY_12M";

    @Column(name = "duration_months", nullable = false)
    @Builder.Default
    private Integer durationMonths = 12;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    public enum ReceiptStatus {
        PENDING_VERIFICATION,
        APPROVED,
        REJECTED
    }
}