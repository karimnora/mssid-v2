package dz.mssid.education.controller;
import dz.mssid.education.service.PremiumFunnelService;
import org.junit.jupiter.api.*;
import org.springframework.context.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class PremiumFunnelSecurityTest {
    @Configuration @EnableMethodSecurity static class Config {
        @Bean PremiumFunnelService service() { return mock(PremiumFunnelService.class); }
        @Bean PremiumFunnelController controller(PremiumFunnelService service) { return new PremiumFunnelController(service); }
    }
    private AnnotationConfigApplicationContext context;
    @BeforeEach void setup() { SecurityContextHolder.clearContext(); context = new AnnotationConfigApplicationContext(Config.class); }
    @AfterEach void cleanup() { SecurityContextHolder.clearContext(); context.close(); }
    @Test void anonymousCanSubmitButCannotReadCounters() {
        var controller = context.getBean(PremiumFunnelController.class);
        assertEquals(204, controller.record(Map.of("event","offer_open","grade","5AP","day","2026-11-07")).getStatusCode().value());
        assertThrows(AuthenticationCredentialsNotFoundException.class, controller::recent);
    }
    @Test void onlyAdministratorCanReadTheAggregates() {
        var controller = context.getBean(PremiumFunnelController.class);
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("free", null, List.of(new SimpleGrantedAuthority("ROLE_FREE"))));
        assertThrows(AccessDeniedException.class, controller::recent);
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("admin", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))));
        when(context.getBean(PremiumFunnelService.class).recent()).thenReturn(List.of());
        assertTrue(controller.recent().isEmpty());
    }
}
