package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentsStatsDto {
    private long totalReceipts;
    private Map<String, Long> receiptsByStatus;
    private Map<String, Long> receiptsByMethod;
    private double totalAmountDzdApproved;
    private double totalAmountDzdPending;
}
