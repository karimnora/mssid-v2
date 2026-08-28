package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Live free-tier quotas for the Admin Console (Technical Logs). Every meter is either read from
 * the provider's API that moment, or explicitly {@code not_configured}/{@code error} — never a
 * hardcoded leftover from a previous deploy. Render does not expose remaining instance-hours on
 * its public API; that meter is omitted rather than guessed.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InfraQuotasDto {

    private String fetchedAt;
    private ProviderQuota resend;
    private ProviderQuota neon;
    private ProviderQuota render;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProviderQuota {
        private String provider;
        private String status; // ok | not_configured | error
        private String error;
        private String dashboardUrl;
        private String note;
        private List<Meter> meters;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Meter {
        private String id;
        private String label;
        private Double used;
        private Double limit;
        private String unit;
    }
}
