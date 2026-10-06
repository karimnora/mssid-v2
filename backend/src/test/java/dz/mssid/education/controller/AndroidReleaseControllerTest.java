package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.AndroidReleaseResponse;
import dz.mssid.education.dto.UpdateAndroidReleaseRequest;
import dz.mssid.education.service.AndroidReleaseService;
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

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AndroidReleaseControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AndroidReleaseService androidReleaseService;

    @InjectMocks
    private AndroidReleaseController androidReleaseController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(androidReleaseController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("GET /api/v1/android-release - Public")
    void getAndroidRelease_Success() throws Exception {
        when(androidReleaseService.getRelease()).thenReturn(new AndroidReleaseResponse(8, 0));

        mockMvc.perform(get("/api/v1/android-release"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latestVersionCode").value(8))
                .andExpect(jsonPath("$.minVersionCode").value(0));
    }

    @Test
    @DisplayName("PUT /api/v1/admin/android-release - Persists the Play versionCode")
    void updateAndroidRelease_Success() throws Exception {
        UpdateAndroidReleaseRequest request = new UpdateAndroidReleaseRequest();
        request.setLatestVersionCode(9);
        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User("admin@mssid.dz", "N/A", List.of());
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));
        when(androidReleaseService.update(eq(9), isNull(), eq("admin@mssid.dz")))
                .thenReturn(new AndroidReleaseResponse(9, 0));

        mockMvc.perform(put("/api/v1/admin/android-release")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.latestVersionCode").value(9));

        verify(androidReleaseService).update(eq(9), isNull(), eq("admin@mssid.dz"));
    }

    @Test
    @DisplayName("PUT /api/v1/admin/android-release - Empty body is 400")
    void updateAndroidRelease_EmptyBody() throws Exception {
        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User("admin@mssid.dz", "N/A", List.of());
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));

        mockMvc.perform(put("/api/v1/admin/android-release")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
