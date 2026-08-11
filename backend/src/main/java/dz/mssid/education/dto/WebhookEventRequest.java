package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookEventRequest {
    private String checkoutId;
    private String userEmail;
    private String paymentMethod;
    private Double amountDzd;
    private String transactionRef;
    private String eventType;
    private String status;
    private String provider;
    private String signature;
}
