package dz.mssid.education;
import dz.mssid.education.config.V2EnvironmentGuard;
import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.mock.env.MockEnvironment;
import static org.junit.jupiter.api.Assertions.*;
class V2EnvironmentGuardTest {
    @Test void refusesV1ProductionProfileBeforeMigrations() {
        var env = new MockEnvironment(); env.setActiveProfiles("prod");
        assertThrows(IllegalStateException.class, () -> new V2EnvironmentGuard().postProcessEnvironment(env, new SpringApplication(Object.class)));
    }
    @Test void refusesReuseOfInheritedV1Database() {
        var env = new MockEnvironment().withProperty("DATABASE_URL", "jdbc:postgresql://prod/main")
                .withProperty("spring.datasource.url", "jdbc:postgresql://prod/main");
        env.setActiveProfiles("prod", "v2");
        assertThrows(IllegalStateException.class, () -> new V2EnvironmentGuard().postProcessEnvironment(env, new SpringApplication(Object.class)));
    }
    @Test void rejectsSameDatabaseWithDifferentCredentialsAndJdbcSyntax() {
        var env=new MockEnvironment().withProperty("DATABASE_URL","postgresql://other:password@PROD:5432/main?sslmode=require").withProperty("spring.datasource.url","jdbc:postgresql://prod/main");
        env.setActiveProfiles("prod","v2");assertThrows(IllegalStateException.class,()->new V2EnvironmentGuard().postProcessEnvironment(env,new SpringApplication(Object.class)));
    }
    @Test void acceptsIsolatedV2AndLocalUnitTests() {
        var env = new MockEnvironment().withProperty("spring.datasource.url", "jdbc:postgresql://localhost:5433/mssid_v2");
        env.setActiveProfiles("prod", "v2");
        assertDoesNotThrow(() -> new V2EnvironmentGuard().postProcessEnvironment(env, new SpringApplication(Object.class)));
        assertDoesNotThrow(() -> new V2EnvironmentGuard().postProcessEnvironment(new MockEnvironment(), new SpringApplication(Object.class)));
    }
}
