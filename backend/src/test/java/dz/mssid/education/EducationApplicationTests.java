package dz.mssid.education;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.ReceiptUploadRequest;
import dz.mssid.education.entity.User;
import dz.mssid.education.entity.Role;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.service.PaymentService;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

// JwtTokenProvider now refuses to start if app.jwt.secret is the publicly-known default (see its
// @PostConstruct guard) — this test environment has no real JWT_SECRET env var, so it needs its own
// clearly-fake-but-not-the-committed-default secret to let the context load.
@SpringBootTest
@TestPropertySource(properties = "app.jwt.secret=TestOnlyJwtSecretNeverUsedOutsideTheTestSuite2026XYZ")
class EducationApplicationTests {

    @Autowired UserRepository users;
    @Autowired RoleRepository roles;
    @Autowired PaymentService payments;
    @Autowired JdbcTemplate jdbc;
    @Autowired ObjectMapper mapper;

    @Test
    @Transactional
    void uploadedImageSurvivesDatabaseAndResponseSerialization() throws Exception {
        Role free = roles.findByName(Role.RoleName.ROLE_FREE).orElseGet(() -> {
            Role role = new Role();
            role.setName(Role.RoleName.ROLE_FREE);
            return roles.save(role);
        });
        User parent = users.saveAndFlush(User.builder().nom("Receipt test parent")
                .email("receipt-regression@example.com").passwordHash("test-only-hash").role(free).build());
        String image = "data:image/png;base64," + "AAAA".repeat(20000);
        var receipt = payments.submitReceipt(parent.getEmail(), ReceiptUploadRequest.builder()
                .planId("P12M").amountDzd(2400.0).paymentMethod("BARIDIMOB")
                .transactionRef("TEST-RECEIPT").receiptImageUrl(image).build());
        assertEquals(image, jdbc.queryForObject(
                "SELECT receipt_image_url FROM payment_receipts WHERE id = ?", String.class, receipt.getId()));
        var response = mapper.readTree(mapper.writeValueAsString(receipt));
        assertEquals(image, response.get("receiptImageUrl").asText());
        assertEquals("PENDING_VERIFICATION", response.get("status").asText());
        assertEquals(Role.RoleName.ROLE_FREE, parent.getRole().getName());
    }

	@Test
	void contextLoads() {
	}

}
