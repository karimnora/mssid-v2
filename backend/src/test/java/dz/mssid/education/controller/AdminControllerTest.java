package dz.mssid.education.controller;

import dz.mssid.education.dto.AdminAuditLogDto;
import dz.mssid.education.dto.AdminStatsOverviewDto;
import dz.mssid.education.dto.PaymentsStatsDto;
import dz.mssid.education.entity.ContactMessage;
import dz.mssid.education.repository.ContactMessageRepository;
import dz.mssid.education.service.AdminAuditLogService;
import dz.mssid.education.service.AdminStatsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AdminStatsService adminStatsService;

    @Mock
    private AdminAuditLogService adminAuditLogService;

    @Mock
    private ContactMessageRepository contactMessageRepository;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
    }

    @Test
    @DisplayName("GET /api/v1/admin/stats/overview - Returns the real aggregates DTO")
    void getStatsOverview_Success() throws Exception {
        AdminStatsOverviewDto stats = AdminStatsOverviewDto.builder()
                .totalUsers(42)
                .roleDistribution(Map.of("ROLE_FREE", 40L, "ROLE_ADMIN", 2L))
                .payments(PaymentsStatsDto.builder().totalReceipts(5).build())
                .build();

        when(adminStatsService.getOverview()).thenReturn(stats);

        mockMvc.perform(get("/api/v1/admin/stats/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").value(42))
                .andExpect(jsonPath("$.roleDistribution.ROLE_FREE").value(40))
                .andExpect(jsonPath("$.payments.totalReceipts").value(5));
    }

    @Test
    @DisplayName("GET /api/v1/admin/audit-log - No filters: returns recent audit entries, newest first")
    void getAuditLog_Success() throws Exception {
        AdminAuditLogDto entry = AdminAuditLogDto.builder()
                .id(1L).actorEmail("admin@mssid.dz").actionType("ROLE_CHANGE")
                .targetType("USER").targetId("5").details("ROLE_FREE -> ROLE_PREMIUM")
                .outcome("SUCCESS")
                .createdAt("2026-01-01T12:00:00")
                .build();

        when(adminAuditLogService.getFiltered(isNull(), isNull(), isNull(), isNull(), isNull(), eq(50)))
                .thenReturn(List.of(entry));

        mockMvc.perform(get("/api/v1/admin/audit-log"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].actionType").value("ROLE_CHANGE"))
                .andExpect(jsonPath("$[0].outcome").value("SUCCESS"));
    }

    // Regression test for the filtering system: an admin debugging "why didn't the confirmation email
    // send" needs to narrow by actionType + outcome, not just scroll through the last N rows.
    @Test
    @DisplayName("GET /api/v1/admin/audit-log?actionType=EMAIL_SEND&outcome=FAILURE - Passes filters through")
    void getAuditLog_WithFilters_PassesThemThrough() throws Exception {
        AdminAuditLogDto failedEmail = AdminAuditLogDto.builder()
                .id(2L).actorEmail("user@mssid.dz").actionType("EMAIL_SEND")
                .targetType("EMAIL").targetId("رمز التحقق").details("échec Resend: timeout")
                .outcome("FAILURE")
                .createdAt("2026-08-17T10:00:00")
                .build();

        when(adminAuditLogService.getFiltered(eq("EMAIL_SEND"), eq("FAILURE"), isNull(), isNull(), isNull(), eq(50)))
                .thenReturn(List.of(failedEmail));

        mockMvc.perform(get("/api/v1/admin/audit-log").param("actionType", "EMAIL_SEND").param("outcome", "FAILURE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].outcome").value("FAILURE"));
    }

    @Test
    @DisplayName("GET /api/v1/admin/contact-messages - Returns submitted messages, newest first")
    void getContactMessages_Success() throws Exception {
        ContactMessage message = ContactMessage.builder()
                .id(1L)
                .name("يونس الجزائري")
                .email("younes@mssid.dz")
                .type("bug")
                .message("زر تسجيل الدخول لا يعمل على هاتفي.")
                .submittedAt(java.time.LocalDateTime.of(2026, 8, 17, 10, 0))
                .build();

        when(contactMessageRepository.findAllByOrderBySubmittedAtDesc()).thenReturn(List.of(message));

        mockMvc.perform(get("/api/v1/admin/contact-messages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("يونس الجزائري"))
                .andExpect(jsonPath("$[0].type").value("bug"));
    }
}
