package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Preview (GET) and result (DELETE) of an ephemeral audit-log purge. {@code count} is the matching
 * row count — how many would be deleted on GET, how many were deleted on DELETE. {@code actionTypes}
 * is the server-owned whitelist so the CMS can describe what will be dropped without duplicating it.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogPurgeDto {
    private long count;
    private List<String> actionTypes;
}
