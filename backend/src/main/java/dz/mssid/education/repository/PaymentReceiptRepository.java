package dz.mssid.education.repository;

import dz.mssid.education.entity.PaymentReceipt;
import dz.mssid.education.entity.PaymentReceipt.ReceiptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentReceiptRepository extends JpaRepository<PaymentReceipt, Long> {

    // Récupère la liste des reçus filtrés par leur statut (PENDING, APPROVED, REJECTED)
    List<PaymentReceipt> findByStatus(ReceiptStatus status);

    // Récupère tous les reçus de paiement soumis par un utilisateur spécifique
    List<PaymentReceipt> findByUserId(Long userId);
}