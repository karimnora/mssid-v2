package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAuditLogDto {
    private Long id;
    private String actorEmail;
    private String actionType;
    private String targetType;
    private String targetId;
    private String details;
    private String outcome;
    private String createdAt;
}
