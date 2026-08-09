package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptUploadRequest {
    private String userEmail;
    private String paymentMethod;
    private String transactionRef;
    private Double amountDzd;
    private String receiptImageUrl;
    private String receiptImgUrl;
    private String ripSender;
}


