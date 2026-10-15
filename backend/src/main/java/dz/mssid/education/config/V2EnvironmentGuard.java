package dz.mssid.education.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Profiles;

/** Runs after config loading and before context/Flyway startup. Present only on the V2 branch. */
public class V2EnvironmentGuard implements EnvironmentPostProcessor, Ordered {
    private static boolean sameDatabase(String a,String b) {
        if(a==null||b==null)return false;
        try {
            var left=java.net.URI.create(a.replaceFirst("^jdbc:","").replaceFirst("^postgresql:","postgres:"));
            var right=java.net.URI.create(b.replaceFirst("^jdbc:","").replaceFirst("^postgresql:","postgres:"));
            return left.getHost()!=null && left.getHost().equalsIgnoreCase(right.getHost()) && (left.getPort()<0?5432:left.getPort())==(right.getPort()<0?5432:right.getPort()) && java.util.Objects.equals(left.getPath(),right.getPath());
        } catch(IllegalArgumentException ex){return a.equals(b);}
    }
    @Override public int getOrder() { return Ordered.LOWEST_PRECEDENCE; }
    @Override public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        boolean v2 = environment.acceptsProfiles(Profiles.of("v2"));
        if (environment.acceptsProfiles(Profiles.of("prod")) && !v2) {
            throw new IllegalStateException("V2 cannot start with the V1 production profile. Use a separate service with prod,v2.");
        }
        String inheritedDatabase = environment.getProperty("DATABASE_URL");
        if (v2 && inheritedDatabase != null && sameDatabase(inheritedDatabase,environment.getProperty("spring.datasource.url"))) {
            throw new IllegalStateException("V2 must not reuse DATABASE_URL from V1. Create a separate empty test database.");
        }
    }
}
