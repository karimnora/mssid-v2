package dz.mssid.education.service;

import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.entity.PaymentReceipt;

import java.util.List;

public interface PaymentService {

    PaymentReceipt submitReceipt(String userEmail, ReceiptUploadRequest request);

    List<PaymentReceipt> getAllReceipts();

    List<PaymentReceipt> getReceiptsByStatus(PaymentReceipt.ReceiptStatus status);

    PaymentReceipt verifyReceipt(Long receiptId, VerifyReceiptRequest request);
}
