package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.UpdateFeatureFlagRequest;
import dz.mssid.education.service.FeatureFlagService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class FeatureFlagControllerTest {

    private MockMvc mockMvc;

    @Mock
    private FeatureFlagService featureFlagService;

    @InjectMocks
    private FeatureFlagController featureFlagController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(featureFlagController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void authenticateAs(String email) {
        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(email, "N/A", List.of());
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));
    }

    @Test
    @DisplayName("GET /api/v1/feature-flags - Public, returns only persisted overrides")
    void getFeatureFlags_Success() throws Exception {
        when(featureFlagService.getAllOverrides()).thenReturn(Map.of("enableAITutor", false));

        mockMvc.perform(get("/api/v1/feature-flags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enableAITutor").value(false));
    }

    @Test
    @DisplayName("PUT /api/v1/admin/feature-flags/{key} - Updates the override with the acting admin's email")
    void updateFeatureFlag_Success() throws Exception {
        UpdateFeatureFlagRequest request = new UpdateFeatureFlagRequest();
        request.setEnabled(true);
        authenticateAs("admin@mssid.dz");

        mockMvc.perform(put("/api/v1/admin/feature-flags/enablePayments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(featureFlagService).upsertFlag(eq("enablePayments"), eq(true), eq("admin@mssid.dz"));
    }

    @Test
    @DisplayName("DELETE /api/v1/admin/feature-flags/{key} - Resets the override to code default")
    void deleteFeatureFlagOverride_Success() throws Exception {
        authenticateAs("admin@mssid.dz");

        mockMvc.perform(delete("/api/v1/admin/feature-flags/enablePayments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(featureFlagService).deleteOverride(eq("enablePayments"), eq("admin@mssid.dz"));
    }
}
