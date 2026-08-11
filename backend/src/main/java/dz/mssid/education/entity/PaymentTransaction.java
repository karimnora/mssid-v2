package dz.mssid.education.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "checkout_id", nullable = false, unique = true)
    private String checkoutId;

    @Column(name = "transaction_ref", nullable = false)
    private String transactionRef;

    @Column(name = "provider_name")
    private String providerName;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "amount_dzd")
    private Double amountDzd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status = TransactionStatus.PENDING;

    @Column(name = "checkout_url")
    private String checkoutUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum TransactionStatus {
        PENDING,
        COMPLETED,
        FAILED
    }
}
