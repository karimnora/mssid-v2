package dz.mssid.education.security;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class RateLimitFilterTest {

    private RateLimitFilter filter;

    @BeforeEach
    void setUp() {
        filter = new RateLimitFilter();
    }

    private MockHttpServletRequest postRequest(String path) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", path);
        request.setServletPath(path);
        request.setRemoteAddr("203.0.113.10");
        return request;
    }

    @Test
    @DisplayName("AI endpoints (/api/v1/ai/**, /api/gemini/**) are capped at 15 requests/minute per IP")
    void aiEndpoints_areLimitedTo15PerMinute() throws Exception {
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 15; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilterInternal(postRequest("/api/v1/ai/explain"), response, chain);
            assertEquals(200, response.getStatus(), "request " + (i + 1) + " should pass through");
        }
        verify(chain, times(15)).doFilter(any(), any());

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilterInternal(postRequest("/api/v1/ai/explain"), blocked, chain);
        assertEquals(429, blocked.getStatus());
        verify(chain, times(15)).doFilter(any(), any());
    }

    @Test
    @DisplayName("The legacy /api/gemini/** alias shares the same AI counter as /api/v1/ai/**")
    void geminiAlias_sharesCounterWithAiPath() throws Exception {
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 10; i++) {
            filter.doFilterInternal(postRequest("/api/v1/ai/prompt"), new MockHttpServletResponse(), chain);
        }
        for (int i = 0; i < 5; i++) {
            filter.doFilterInternal(postRequest("/api/gemini/prompt"), new MockHttpServletResponse(), chain);
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        filter.doFilterInternal(postRequest("/api/gemini/prompt"), blocked, chain);
        assertEquals(429, blocked.getStatus(), "16th combined request across both aliases must be blocked");
    }

    @Test
    @DisplayName("A non-AI API path still gets the general 60/minute window, not the tighter AI one")
    void nonAiApiPath_usesDefaultWindow() throws Exception {
        FilterChain chain = mock(FilterChain.class);

        for (int i = 0; i < 20; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            filter.doFilterInternal(postRequest("/api/v1/courses"), response, chain);
            assertEquals(200, response.getStatus(), "request " + (i + 1) + " must not hit the tighter AI limit");
        }
    }
}
