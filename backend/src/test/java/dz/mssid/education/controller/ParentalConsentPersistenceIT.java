package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.security.AuthCookieConstants;
import dz.mssid.education.security.JwtTokenProvider;
import dz.mssid.education.service.EmailVerificationService;
import dz.mssid.education.service.ParentNotificationService;
import dz.mssid.education.service.ParentalConsentService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Explicit local integration test (-Dtest=ParentalConsentPersistenceIT), never the running family database. */
@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:postgresql://localhost:5433/mssid_v2_cx04_test",
        "spring.datasource.username=postgres", "app.weekly-report.enabled=false", "sentry.dsn="
})
@ActiveProfiles("v2")
@AutoConfigureMockMvc
@Transactional
class ParentalConsentPersistenceIT {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired JdbcTemplate jdbc;
    @Autowired UserRepository users;
    @Autowired RoleRepository roles;
    @Autowired JwtTokenProvider tokens;
    @MockBean EmailVerificationService verification;
    @MockBean ParentNotificationService notifications;
    final String version = ParentalConsentService.CURRENT_VERSION;

    private Cookie legacyCookie(String consentVersion) {
        assertEquals("mssid_v2_cx04_test", jdbc.queryForObject("SELECT current_database()", String.class));
        Role role = roles.findByName(Role.RoleName.ROLE_FREE).orElseGet(() -> roles.save(new Role(null, Role.RoleName.ROLE_FREE)));
        User user = users.saveAndFlush(User.builder().nom("Parent test").email("cx04-legacy@example.test")
                .passwordHash("unused").role(role).parentalConsentVersion(consentVersion)
                .parentalConsentAt(consentVersion == null ? null : Instant.parse("2020-01-01T00:00:00Z")).build());
        return new Cookie(AuthCookieConstants.COOKIE_NAME,
                tokens.generateToken(new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities())));
    }

    @Test void registrationPersistsServerTimeAndNeverTheClientDate() throws Exception {
        assertEquals("mssid_v2_cx04_test", jdbc.queryForObject("SELECT current_database()", String.class));
        String email = "cx04-new@example.test";
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("nom", "Parent test", "email", email, "password", "local-password-123",
                        "parentalConsentAccepted", false, "parentalConsentVersion", version))))
                .andExpect(status().isBadRequest());
        assertFalse(users.existsByEmail(email));
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("nom", "Parent test", "email", email, "password", "local-password-123",
                        "parentalConsentAccepted", true, "parentalConsentVersion", version, "parentalConsentAt", "2000-01-01T00:00:00Z"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.parentalConsentRequired").value(false));
        users.flush();
        var stored = jdbc.queryForMap("SELECT parental_consent_version, parental_consent_at > NOW() - INTERVAL '1 minute' AS recent FROM users WHERE email = ?", email);
        assertEquals(version, stored.get("parental_consent_version"));
        assertEquals(true, stored.get("recent"));
    }

    @Test void aLegacyAccountCanReadButCannotSyncUntilAnAdultAccepts() throws Exception {
        Cookie cookie = legacyCookie(null);
        mvc.perform(get("/api/v1/users/me").cookie(cookie)).andExpect(status().isOk())
                .andExpect(jsonPath("$.parentalConsentRequired").value(true));
        mvc.perform(put("/api/v1/users/me/progress").cookie(cookie).contentType(MediaType.APPLICATION_JSON).content("{\"score\":10,\"xp\":10}"))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("PARENTAL_CONSENT_REQUIRED"));
        mvc.perform(post("/api/v1/auth/parental-consent").cookie(cookie).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("parentalConsentAccepted", true, "parentalConsentVersion", version))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.parentalConsentRequired").value(false));
        mvc.perform(put("/api/v1/users/me/progress").cookie(cookie).contentType(MediaType.APPLICATION_JSON).content("{\"score\":10,\"xp\":10}"))
                .andExpect(status().isOk());
        users.flush();
        assertEquals(version, jdbc.queryForObject("SELECT parental_consent_version FROM users WHERE email = 'cx04-legacy@example.test'", String.class));
    }

    @Test void anOlderVersionCannotAuthorizeNewProgress() throws Exception {
        Cookie cookie = legacyCookie("parental-consent-old");
        mvc.perform(put("/api/v1/learning/family-5AP").cookie(cookie).contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/v1/auth/parental-consent").cookie(cookie).contentType(MediaType.APPLICATION_JSON)
                .content("{\"parentalConsentAccepted\":true,\"parentalConsentVersion\":\"parental-consent-old\"}"))
                .andExpect(status().isBadRequest());
        assertEquals("parental-consent-old", users.findByEmail("cx04-legacy@example.test").orElseThrow().getParentalConsentVersion());
    }
}
