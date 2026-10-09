package dz.mssid.education;

import org.junit.jupiter.api.Test;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.env.MockEnvironment;
import java.util.Properties;
import static org.junit.jupiter.api.Assertions.*;

class V2EnvironmentIsolationTest {
    private MockEnvironment environment() throws Exception {
        var properties = new Properties();
        try (var stream = new ClassPathResource("application-v2.properties").getInputStream()) { properties.load(stream); }
        var env = new MockEnvironment().withProperty("DATABASE_URL", "jdbc:postgresql://production/prod")
                .withProperty("DATABASE_PASSWORD", "prod-secret").withProperty("JWT_SECRET", "prod-jwt")
                .withProperty("GOOGLE_OAUTH_CLIENT_ID", "prod-google").withProperty("RESEND_API_KEY", "prod-email");
        env.getPropertySources().addFirst(new PropertiesPropertySource("v2", properties));
        return env;
    }
    @Test void ignoresInheritedProductionCredentials() throws Exception {
        var env = environment();
        assertEquals("jdbc:postgresql://localhost:5433/mssid_v2", env.getProperty("spring.datasource.url"));
        assertEquals("postgres_v2_local_only", env.getProperty("spring.datasource.password"));
        assertEquals("", env.getProperty("app.jwt.secret"));
        assertEquals("", env.getProperty("app.oauth.google.client-id"));
        assertEquals("", env.getProperty("app.resend.api-key"));
    }
    @Test void usesExplicitV2Credentials() throws Exception {
        var env = environment().withProperty("V2_DATABASE_URL", "jdbc:postgresql://test/mssid_v2")
                .withProperty("V2_JWT_SECRET", "different-v2-key");
        assertEquals("jdbc:postgresql://test/mssid_v2", env.getProperty("spring.datasource.url"));
        assertEquals("different-v2-key", env.getProperty("app.jwt.secret"));
    }
}
