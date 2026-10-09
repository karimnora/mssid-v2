package dz.mssid.education.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Profiles;

/** Runs after config loading and before context/Flyway startup. Present only on the V2 branch. */
public class V2EnvironmentGuard implements EnvironmentPostProcessor, Ordered {
    @Override public int getOrder() { return Ordered.LOWEST_PRECEDENCE; }
    @Override public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        boolean v2 = environment.acceptsProfiles(Profiles.of("v2"));
        if (environment.acceptsProfiles(Profiles.of("prod")) && !v2) {
            throw new IllegalStateException("V2 cannot start with the V1 production profile. Use a separate service with prod,v2.");
        }
        String inheritedDatabase = environment.getProperty("DATABASE_URL");
        if (v2 && inheritedDatabase != null && inheritedDatabase.equals(environment.getProperty("spring.datasource.url"))) {
            throw new IllegalStateException("V2 must not reuse DATABASE_URL from V1. Create a separate empty test database.");
        }
    }
}
