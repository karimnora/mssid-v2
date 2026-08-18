package dz.mssid.education;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

// JwtTokenProvider now refuses to start if app.jwt.secret is the publicly-known default (see its
// @PostConstruct guard) — this test environment has no real JWT_SECRET env var, so it needs its own
// clearly-fake-but-not-the-committed-default secret to let the context load.
@SpringBootTest
@TestPropertySource(properties = "app.jwt.secret=TestOnlyJwtSecretNeverUsedOutsideTheTestSuite2026XYZ")
class EducationApplicationTests {

	@Test
	void contextLoads() {
	}

}
