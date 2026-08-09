// ReceiptVerificationRequest.java
package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceiptVerificationRequest {
    private String paymentMethod;
    private Double amountDzd;
    private String transactionRef;
    private String receiptImageUrl;
}