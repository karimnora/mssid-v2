package dz.mssid.education.security;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.service.ParentalConsentService;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ParentalConsentFilterTest {
    final ParentalConsentFilter filter = new ParentalConsentFilter();
    @AfterEach void clearSession() { SecurityContextHolder.clearContext(); }
    private User signIn() {
        User user = User.builder().email("parent@example.test").role(new Role(1L, Role.RoleName.ROLE_FREE)).build();
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
        return user;
    }
    private MockHttpServletRequest request(String method, String path) {
        MockHttpServletRequest request = new MockHttpServletRequest(method, path);
        request.setServletPath(path);
        return request;
    }

    @Test void rejectsAllChildDataWritesForLegacyAndStaleAccounts() throws Exception {
        User user = signIn();
        for (String version : new String[] { null, "old-version" }) {
            user.setParentalConsentVersion(version);
            user.setParentalConsentAt(version == null ? null : Instant.now());
            for (String path : new String[] { "/api/v1/children", "/api/v1/children/11/progress", "/api/v1/users/me/progress", "/api/v1/users/profile", "/api/v1/users/me", "/api/v1/learning/family-5AP", "/api/v1/musaidi/open", "/api/v1/ai/explain", "/api/gemini/explain" }) {
                FilterChain chain = mock(FilterChain.class);
                MockHttpServletResponse response = new MockHttpServletResponse();
                filter.doFilter(request("POST", path), response, chain);
                assertEquals(403, response.getStatus(), path);
                assertTrue(response.getContentAsString().contains("PARENTAL_CONSENT_REQUIRED"));
                verifyNoInteractions(chain);
            }
        }
    }

    @Test void rejectsWritesWithAnEmptyServletPathAndAContextPath() throws Exception {
        signIn();
        var request = new MockHttpServletRequest("PUT", "/education/api/v1/users/me/progress");
        request.setContextPath("/education");
        var response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);
        filter.doFilter(request, response, chain);
        assertEquals(403, response.getStatus());
        verifyNoInteractions(chain);
    }

    @Test void acceptedConsentAllowsProgressToReachTheController() throws Exception {
        User user = signIn();
        user.setParentalConsentAt(Instant.now());
        user.setParentalConsentVersion(ParentalConsentService.CURRENT_VERSION);
        var request = request("PUT", "/api/v1/children/11/progress");
        var response = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);
        filter.doFilter(request, response, chain);
        verify(chain).doFilter(request, response);
    }

    @Test void readingDeletingAndParentAuthenticationRemainAvailable() throws Exception {
        signIn();
        for (String[] route : new String[][] { { "GET", "/api/v1/children/11/progress" }, { "DELETE", "/api/v1/children/11" }, { "POST", "/api/v1/auth/parental-consent" }, { "POST", "/api/v1/auth/logout" }, { "PUT", "/api/v1/users/me/parent-email" } }) {
            var request = request(route[0], route[1]);
            var response = new MockHttpServletResponse();
            FilterChain chain = mock(FilterChain.class);
            filter.doFilter(request, response, chain);
            verify(chain).doFilter(request, response);
        }
    }
}
