package dz.mssid.education;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

// @EnableScheduling powers SubscriptionExpiryService's daily @Scheduled sweep — nothing else in the
// app uses scheduled tasks today.
@SpringBootApplication
@EnableScheduling
public class EducationApplication {

	public static void main(String[] args) {
		SpringApplication.run(EducationApplication.class, args);
	}

}
