package dz.mssid.education.controller;

import dz.mssid.education.dto.AdminAuditLogDto;
import dz.mssid.education.dto.AdminStatsOverviewDto;
import dz.mssid.education.dto.PaymentsStatsDto;
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
    @DisplayName("GET /api/v1/admin/audit-log - Returns recent audit entries, newest first")
    void getAuditLog_Success() throws Exception {
        AdminAuditLogDto entry = AdminAuditLogDto.builder()
                .id(1L).actorEmail("admin@mssid.dz").actionType("ROLE_CHANGE")
                .targetType("USER").targetId("5").details("ROLE_FREE -> ROLE_TEACHER")
                .createdAt("2026-01-01T12:00:00")
                .build();

        when(adminAuditLogService.getRecent(50)).thenReturn(List.of(entry));

        mockMvc.perform(get("/api/v1/admin/audit-log"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].actionType").value("ROLE_CHANGE"));
    }
}
