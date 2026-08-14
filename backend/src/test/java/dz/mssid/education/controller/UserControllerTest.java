package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.service.UserService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Standalone MockMvc has no filter chain, so SecurityMockMvcRequestPostProcessors.user(...)
     * (which relies on SecurityContextPersistenceFilter) never reaches SecurityContextHolder here —
     * setting it directly is what @AuthenticationPrincipal's resolver actually reads.
     */
    private void authenticateAs(String email) {
        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(email, "N/A", List.of());
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));
    }

    @Test
    @DisplayName("GET /api/v1/users/me - Returns 200 OK with UserProfileDto")
    void getCurrentUserProfile_Success() throws Exception {
        UserProfileDto profile = UserProfileDto.builder()
                .id(1L)
                .nom("Ahmed Eleve")
                .email("eleve@mssid.dz")
                .role("ROLE_FREE")
                .score(150)
                .grade("5AP")
                .build();

        when(userService.getUserProfileByEmail("eleve@mssid.dz")).thenReturn(profile);
        authenticateAs("eleve@mssid.dz");

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("eleve@mssid.dz"))
                .andExpect(jsonPath("$.role").value("ROLE_FREE"));
    }

    @Test
    @DisplayName("GET /api/v1/users/all - Returns list of all user profiles")
    void getAllUsers_Success() throws Exception {
        UserProfileDto u1 = UserProfileDto.builder().id(1L).email("user1@mssid.dz").role("ROLE_FREE").build();
        UserProfileDto u2 = UserProfileDto.builder().id(2L).email("user2@mssid.dz").role("ROLE_PREMIUM").build();

        when(userService.getAllUsers()).thenReturn(List.of(u1, u2));

        mockMvc.perform(get("/api/v1/users/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].email").value("user1@mssid.dz"))
                .andExpect(jsonPath("$[1].role").value("ROLE_PREMIUM"));
    }

    @Test
    @DisplayName("PUT /api/v1/admin/users/{id}/role - Updates user role successfully")
    void updateUserRole_Success() throws Exception {
        UserProfileDto updated = UserProfileDto.builder()
                .id(5L)
                .nom("Mohamed Admin")
                .email("mohamed@mssid.dz")
                .role("ROLE_TEACHER")
                .build();

        when(userService.updateUserRole(eq(5L), eq("ROLE_TEACHER"), eq("admin@mssid.dz"))).thenReturn(updated);
        authenticateAs("admin@mssid.dz");

        mockMvc.perform(put("/api/v1/users/admin/5/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("role", "ROLE_TEACHER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.user.role").value("ROLE_TEACHER"));
    }
}
