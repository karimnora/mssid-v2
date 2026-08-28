package dz.mssid.education.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.InfraQuotasDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.hamcrest.Matchers.startsWith;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.lenient;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ExtendWith(MockitoExtension.class)
class InfraQuotaServiceTest {

    @Mock
    private ResendEmailService resendEmailService;

    private InfraQuotaService service;
    private MockRestServiceServer server;

    @BeforeEach
    void setUp() {
        RestTemplate restTemplate = new RestTemplate();
        server = MockRestServiceServer.bindTo(restTemplate).build();
        service = new InfraQuotaService(new ObjectMapper(), resendEmailService, restTemplate);
        lenient().when(resendEmailService.getLastQuotaHint()).thenReturn(Optional.empty());
        ReflectionTestUtils.setField(service, "resendDailyLimit", 100);
        ReflectionTestUtils.setField(service, "resendMonthlyLimit", 3000);
        ReflectionTestUtils.setField(service, "resendApiUrl", "https://api.resend.com/emails");
        ReflectionTestUtils.setField(service, "neonApiBaseUrl", "https://console.neon.tech/api/v2");
        ReflectionTestUtils.setField(service, "neonComputeCuHoursLimit", 100.0);
        ReflectionTestUtils.setField(service, "neonStorageBytesLimit", 536870912L);
        ReflectionTestUtils.setField(service, "renderApiBaseUrl", "https://api.render.com/v1");
        ReflectionTestUtils.setField(service, "renderServiceName", "mssid-backend");
    }

    @Test
    @DisplayName("Missing provider keys → each card is not_configured, never a fake remaining number")
    void getQuotas_MissingKeys_NotConfigured() {
        InfraQuotasDto dto = service.getQuotas();

        assertEquals("not_configured", dto.getResend().getStatus());
        assertEquals("not_configured", dto.getNeon().getStatus());
        assertEquals("not_configured", dto.getRender().getStatus());
        assertTrue(dto.getResend().getMeters().isEmpty());
        assertTrue(dto.getNeon().getMeters().isEmpty());
    }

    @Test
    @DisplayName("Resend list-emails → daily/monthly used mapped against free caps")
    void getQuotas_ResendList_CountsTodayAndMonth() {
        ReflectionTestUtils.setField(service, "resendApiKey", "re_test");
        server.expect(requestTo("https://api.resend.com/emails?limit=100"))
                .andRespond(withSuccess("""
                        {"object":"list","has_more":false,"data":[
                          {"id":"1","created_at":"%s"},
                          {"id":"2","created_at":"%s"}
                        ]}
                        """.formatted(java.time.Instant.now(), java.time.Instant.now()), MediaType.APPLICATION_JSON));

        InfraQuotasDto dto = service.getQuotas();
        server.verify();

        assertEquals("ok", dto.getResend().getStatus());
        assertEquals(2.0, dto.getResend().getMeters().get(0).getUsed());
        assertEquals(100.0, dto.getResend().getMeters().get(0).getLimit());
        assertEquals(2.0, dto.getResend().getMeters().get(1).getUsed());
        assertEquals(3000.0, dto.getResend().getMeters().get(1).getLimit());
        assertEquals("not_configured", dto.getNeon().getStatus());
        assertEquals("not_configured", dto.getRender().getStatus());
    }

    @Test
    @DisplayName("Neon GET project → storage meter from synthetic_storage_size")
    void getQuotas_NeonProject_StorageMeter() {
        ReflectionTestUtils.setField(service, "neonApiKey", "neon_test");
        ReflectionTestUtils.setField(service, "neonProjectId", "orange-mode-123");
        server.expect(requestTo("https://console.neon.tech/api/v2/projects/orange-mode-123"))
                .andRespond(withSuccess(
                        "{\"project\":{\"id\":\"orange-mode-123\",\"synthetic_storage_size\":268435456}}",
                        MediaType.APPLICATION_JSON));
        server.expect(requestTo(startsWith("https://console.neon.tech/api/v2/consumption_history/projects")))
                .andRespond(withSuccess("{\"projects\":[]}", MediaType.APPLICATION_JSON));

        InfraQuotasDto dto = service.getQuotas();
        server.verify();

        assertEquals("ok", dto.getNeon().getStatus());
        assertEquals("storage_gb", dto.getNeon().getMeters().get(0).getId());
        assertEquals(0.25, dto.getNeon().getMeters().get(0).getUsed());
        assertEquals(0.5, dto.getNeon().getMeters().get(0).getLimit());
    }
}
