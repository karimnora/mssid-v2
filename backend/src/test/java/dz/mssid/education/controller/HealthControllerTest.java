package dz.mssid.education.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class HealthControllerTest {
    @Mock private DataSource dataSource;
    @Mock private Connection connection;
    @Mock private Statement statement;
    @InjectMocks private HealthController controller;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void repeatedLivenessProbesNeverWakeTheDatabase() throws Exception {
        for (int i = 0; i < 10; i++) {
            mvc.perform(get("/api/health"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("UP"));
        }
        verifyNoInteractions(dataSource, connection, statement);
    }

    @Test
    void databaseDiagnosticChecksAndClosesTheConnection() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.createStatement()).thenReturn(statement);
        mvc.perform(get("/api/health/database"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
        verify(statement).execute("SELECT 1");
        verify(statement).close();
        verify(connection).close();
    }

    @Test
    void databaseOutageDoesNotAffectServerLiveness() throws Exception {
        when(dataSource.getConnection()).thenThrow(new SQLException("private database details"));
        mvc.perform(get("/api/health/database"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.database").value("unreachable"))
                .andExpect(content().string(org.hamcrest.Matchers.not(
                        org.hamcrest.Matchers.containsString("private database details"))));
        mvc.perform(get("/api/health")).andExpect(status().isOk());
        verify(dataSource, times(1)).getConnection();
    }

    @Test
    void failedQueryStillClosesDatabaseResources() throws Exception {
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.createStatement()).thenReturn(statement);
        when(statement.execute("SELECT 1")).thenThrow(new SQLException("unavailable"));
        mvc.perform(get("/api/health/database"))
                .andExpect(status().isServiceUnavailable());
        verify(statement).close();
        verify(connection).close();
    }
}
