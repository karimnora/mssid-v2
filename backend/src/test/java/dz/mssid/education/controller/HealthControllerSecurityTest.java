package dz.mssid.education.controller;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HealthControllerSecurityTest {
    private AnnotationConfigApplicationContext context;
    private HealthController controller;
    private DataSource dataSource;

    @Configuration
    @EnableMethodSecurity
    static class TestConfig {
        @Bean DataSource dataSource() { return mock(DataSource.class); }
        @Bean HealthController controller(DataSource source) { return new HealthController(source); }
    }

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        context = new AnnotationConfigApplicationContext(TestConfig.class);
        controller = context.getBean(HealthController.class);
        dataSource = context.getBean(DataSource.class);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
        context.close();
    }

    @Test
    void guestCanProbeLivenessButCannotWakeDatabaseThroughDiagnostic() {
        assertEquals(200, controller.health().getStatusCode().value());
        assertThrows(AuthenticationCredentialsNotFoundException.class, controller::databaseHealth);
        verifyNoInteractions(dataSource);
    }

    @Test
    void ordinaryUserCannotRunDatabaseDiagnostic() {
        signIn("ROLE_USER");
        assertThrows(AccessDeniedException.class, controller::databaseHealth);
        verifyNoInteractions(dataSource);
    }

    @Test
    void administratorCanDiagnoseDatabaseOutage() throws Exception {
        signIn("ROLE_ADMIN");
        when(dataSource.getConnection()).thenThrow(new SQLException("unavailable"));
        assertEquals(503, controller.databaseHealth().getStatusCode().value());
        verify(dataSource).getConnection();
    }

    private void signIn(String role) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("test", null,
                        List.of(new SimpleGrantedAuthority(role))));
    }
}
