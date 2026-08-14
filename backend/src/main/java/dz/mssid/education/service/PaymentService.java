package dz.mssid.education.service;

import dz.mssid.education.dto.CheckoutRequest;
import dz.mssid.education.dto.CheckoutResponse;
import dz.mssid.education.dto.PaymentWebhookResponse;
import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.dto.VerifyReceiptRequest;
import dz.mssid.education.dto.WebhookEventRequest;
import dz.mssid.education.entity.PaymentReceipt;

import java.util.List;

public interface PaymentService {

    PaymentReceipt submitReceipt(String userEmail, ReceiptUploadRequest request);

    CheckoutResponse createCheckout(String userEmail, CheckoutRequest request);

    PaymentWebhookResponse processWebhook(WebhookEventRequest request);

    List<PaymentReceipt> getAllReceipts();

    List<PaymentReceipt> getReceiptsByStatus(PaymentReceipt.ReceiptStatus status);

    PaymentReceipt verifyReceipt(Long receiptId, VerifyReceiptRequest request, String actorEmail);
}
