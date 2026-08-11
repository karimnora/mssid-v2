package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    private String userEmail;
    private String paymentMethod;
    private Double amountDzd;
    private String returnUrl;
    private String transactionRef;
    private String providerName;
}
