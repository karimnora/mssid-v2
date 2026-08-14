package dz.mssid.education.service;

import dz.mssid.education.entity.FeatureFlag;
import dz.mssid.education.repository.FeatureFlagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Stores only OVERRIDES of the flag catalog — the catalog itself (which flags exist, their default
 * value, their Arabic labels) stays owned by frontend/src/featureFlags.ts. A flagKey with no row
 * here simply means "use the code default", same as the pre-existing localStorage-only behavior.
 */
@Service
@RequiredArgsConstructor
public class FeatureFlagService {

    private final FeatureFlagRepository featureFlagRepository;
    private final AdminAuditLogService adminAuditLogService;

    public Map<String, Boolean> getAllOverrides() {
        return featureFlagRepository.findAll().stream()
                .collect(Collectors.toMap(FeatureFlag::getFlagKey, FeatureFlag::isEnabled));
    }

    @Transactional
    public void upsertFlag(String flagKey, boolean enabled, String actorEmail) {
        FeatureFlag flag = featureFlagRepository.findByFlagKey(flagKey)
                .orElseGet(() -> FeatureFlag.builder().flagKey(flagKey).build());
        flag.setEnabled(enabled);
        flag.setUpdatedAt(LocalDateTime.now());
        flag.setUpdatedByEmail(actorEmail);
        featureFlagRepository.save(flag);

        adminAuditLogService.record(actorEmail, "FEATURE_FLAG_CHANGED", "FEATURE_FLAG", flagKey, "enabled=" + enabled);
    }

    @Transactional
    public void deleteOverride(String flagKey, String actorEmail) {
        featureFlagRepository.deleteByFlagKey(flagKey);
        adminAuditLogService.record(actorEmail, "FEATURE_FLAG_CHANGED", "FEATURE_FLAG", flagKey, "reset to code default");
    }
}
