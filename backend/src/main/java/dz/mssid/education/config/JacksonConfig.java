package dz.mssid.education.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * jackson-datatype-hibernate6 isn't auto-registered by Spring Boot just from being on the classpath
 * — it needs an explicit bean. Without this, any controller returning a JPA entity with a lazy
 * association that got touched mid-transaction (e.g. PaymentReceipt.user after
 * PaymentServiceImpl.verifyReceipt modifies it) fails to serialize with "Type definition error:
 * ... ByteBuddyInterceptor" instead of just emitting the association's real data.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public Hibernate6Module hibernate6Module() {
        return new Hibernate6Module();
    }
}
