package dz.mssid.education.service;

import dz.mssid.education.entity.FeatureFlag;
import dz.mssid.education.repository.FeatureFlagRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FeatureFlagServiceTest {

    @Mock
    private FeatureFlagRepository featureFlagRepository;

    @Mock
    private AdminAuditLogService adminAuditLogService;

    @InjectMocks
    private FeatureFlagService featureFlagService;

    @Test
    @DisplayName("getAllOverrides - Returns only rows that exist, not the full frontend catalog")
    void getAllOverrides_ReturnsPersistedOverridesOnly() {
        FeatureFlag flag = FeatureFlag.builder().flagKey("enableAITutor").enabled(false).build();
        when(featureFlagRepository.findAll()).thenReturn(List.of(flag));

        Map<String, Boolean> result = featureFlagService.getAllOverrides();

        assertEquals(1, result.size());
        assertEquals(false, result.get("enableAITutor"));
    }

    @Test
    @DisplayName("upsertFlag - Creates a new override and records an audit entry")
    void upsertFlag_CreatesNewOverride() {
        when(featureFlagRepository.findByFlagKey("enablePayments")).thenReturn(Optional.empty());

        featureFlagService.upsertFlag("enablePayments", true, "admin@mssid.dz");

        ArgumentCaptor<FeatureFlag> captor = ArgumentCaptor.forClass(FeatureFlag.class);
        verify(featureFlagRepository).save(captor.capture());
        assertEquals("enablePayments", captor.getValue().getFlagKey());
        assertTrue(captor.getValue().isEnabled());
        assertEquals("admin@mssid.dz", captor.getValue().getUpdatedByEmail());

        verify(adminAuditLogService).record(eq("admin@mssid.dz"), eq("FEATURE_FLAG_CHANGED"), eq("FEATURE_FLAG"), eq("enablePayments"), anyString());
    }

    @Test
    @DisplayName("isEnabled - falls back to the code default when no override row exists")
    void isEnabled_usesDefaultWhenMissing() {
        when(featureFlagRepository.findByFlagKey("enablePayments")).thenReturn(Optional.empty());
        assertFalse(featureFlagService.isEnabled("enablePayments", false));
    }

    @Test
    @DisplayName("isTrimesterPaywallActive - requires both payment flags to be overridden ON")
    void isTrimesterPaywallActive_requiresBothFlags() {
        when(featureFlagRepository.findByFlagKey("enablePayments"))
                .thenReturn(Optional.of(FeatureFlag.builder().flagKey("enablePayments").enabled(true).build()));
        when(featureFlagRepository.findByFlagKey("enableTrimesterPaywall"))
                .thenReturn(Optional.of(FeatureFlag.builder().flagKey("enableTrimesterPaywall").enabled(true).build()));

        assertTrue(featureFlagService.isTrimesterPaywallActive());
    }

    @Test
    @DisplayName("isTrimesterPaywallActive - stays off when only enablePayments is on")
    void isTrimesterPaywallActive_falseWhenPaywallFlagMissing() {
        when(featureFlagRepository.findByFlagKey("enablePayments"))
                .thenReturn(Optional.of(FeatureFlag.builder().flagKey("enablePayments").enabled(true).build()));
        when(featureFlagRepository.findByFlagKey("enableTrimesterPaywall")).thenReturn(Optional.empty());

        assertFalse(featureFlagService.isTrimesterPaywallActive());
    }

    @Test
    @DisplayName("deleteOverride - Deletes the row and records an audit entry")
    void deleteOverride_DeletesAndRecords() {
        featureFlagService.deleteOverride("enablePayments", "admin@mssid.dz");

        verify(featureFlagRepository).deleteByFlagKey("enablePayments");
        verify(adminAuditLogService).record(eq("admin@mssid.dz"), eq("FEATURE_FLAG_CHANGED"), eq("FEATURE_FLAG"), eq("enablePayments"), anyString());
    }
}
