package dz.mssid.education.controller;
import dz.mssid.education.service.CahierAccessService;
import org.junit.jupiter.api.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
class CahierAccessControllerTest {
    CahierAccessService service; MockMvc mvc;
    @BeforeEach void setup() {
        service = mock(CahierAccessService.class);
        mvc = MockMvcBuilders.standaloneSetup(new CahierAccessController(service, mock(dz.mssid.education.service.CahierContentService.class))).setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver()).build();
    }
    @AfterEach void cleanup() { SecurityContextHolder.clearContext(); }
    void login() {
        var principal = new org.springframework.security.core.userdetails.User("parent@test.invalid", "test", List.of());
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(principal, null, List.of()));
    }
    @Test void anonymousCannotReadOrSpendCredits() throws Exception {
        mvc.perform(get("/api/v1/cahiers/access")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/v1/cahiers/a/unlock")).andExpect(status().isUnauthorized());
        verifyNoInteractions(service);
    }
    @Test void quotaBelongsToAuthenticatedFamilyNotClientHeaders() throws Exception {
        login(); when(service.status("parent@test.invalid")).thenReturn(new CahierAccessService.Access(false,3,2,"2030-01-06T23:00:00Z", List.of("a"),true));
        mvc.perform(get("/api/v1/cahiers/access").header("X-User-Id","999").header("X-User-Role","ROLE_PREMIUM"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.remaining").value(2)).andExpect(jsonPath("$.premium").value(false));
        verify(service).status("parent@test.invalid");
    }
    @Test void quotaExhaustedReturns429AndRenewalInformation() throws Exception {
        login(); when(service.unlock("parent@test.invalid", "b")).thenReturn(new CahierAccessService.Access(false,3,0,"2030-01-06T23:00:00Z", List.of("a"),false));
        mvc.perform(post("/api/v1/cahiers/b/unlock")).andExpect(status().isTooManyRequests())
            .andExpect(jsonPath("$.allowed").value(false)).andExpect(jsonPath("$.resetsAt").value("2030-01-06T23:00:00Z"));
    }
}
