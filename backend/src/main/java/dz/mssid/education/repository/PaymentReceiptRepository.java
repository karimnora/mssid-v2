package dz.mssid.education.repository;

import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.PaymentReceipt.ReceiptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface PaymentReceiptRepository extends JpaRepository<PaymentReceipt, Long> {
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select r from PaymentReceipt r where r.id = :id")
    java.util.Optional<PaymentReceipt> findForVerification(@org.springframework.data.repository.query.Param("id") Long id);


    // Récupère la liste des reçus filtrés par leur statut (PENDING, APPROVED, REJECTED)
    List<PaymentReceipt> findByStatus(ReceiptStatus status);

    // Récupère tous les reçus de paiement soumis par un utilisateur spécifique
    List<PaymentReceipt> findByUserId(Long userId);

    java.util.Optional<PaymentReceipt> findFirstByUserIdOrderBySubmittedAtDescIdDesc(Long userId);

    void deleteByUserId(Long userId);

    List<PaymentReceipt> findBySubmittedAtGreaterThanEqualAndSubmittedAtLessThan(
            LocalDateTime from, LocalDateTime until);
}
