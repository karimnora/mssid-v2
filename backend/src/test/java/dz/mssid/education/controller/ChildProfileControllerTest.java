package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.ChildProfileDto;
import dz.mssid.education.dto.ChildProfileRequest;
import dz.mssid.education.service.ChildProfileService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ChildProfileControllerTest {

    private static final String EMAIL = "parent@mssid.dz";

    private MockMvc mockMvc;

    @Mock
    private ChildProfileService childProfileService;

    @InjectMocks
    private ChildProfileController controller;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void authenticate() {
        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(EMAIL, "N/A", List.of());
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));
    }

    @Test
    void list_returnsProfilesOfConnectedAccount() throws Exception {
        authenticate();
        when(childProfileService.list(EMAIL)).thenReturn(List.of(
                ChildProfileDto.builder().id(1L).displayName("Lina").grade("PRESCHOOL").build()));

        mockMvc.perform(get("/api/v1/children"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].displayName").value("Lina"))
                .andExpect(jsonPath("$[0].grade").value("PRESCHOOL"));
    }

    @Test
    void list_withoutAuthentication_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/children"))
                .andExpect(status().isUnauthorized());
        verifyNoInteractions(childProfileService);
    }

    @Test
    void create_returns201() throws Exception {
        authenticate();
        ChildProfileRequest body = ChildProfileRequest.builder().displayName("Sami").grade("1AP").build();
        when(childProfileService.create(eq(EMAIL), any(ChildProfileRequest.class)))
                .thenReturn(ChildProfileDto.builder().id(3L).displayName("Sami").grade("1AP").build());

        mockMvc.perform(post("/api/v1/children")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3));
    }

    @Test
    void create_withBlankName_returns400() throws Exception {
        authenticate();
        ChildProfileRequest body = ChildProfileRequest.builder().displayName("").grade("1AP").build();

        mockMvc.perform(post("/api/v1/children")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(childProfileService);
    }

    @Test
    void delete_returns204() throws Exception {
        authenticate();

        mockMvc.perform(delete("/api/v1/children/7"))
                .andExpect(status().isNoContent());
        verify(childProfileService).delete(EMAIL, 7L);
    }
}
