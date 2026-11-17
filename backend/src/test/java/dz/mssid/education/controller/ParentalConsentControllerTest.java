package dz.mssid.education.controller;

import dz.mssid.education.entity.User;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.service.ParentalConsentService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ParentalConsentControllerTest {
    final UserRepository users = mock(UserRepository.class);
    MockMvc mvc;
    @BeforeEach void setup() {
        mvc = MockMvcBuilders.standaloneSetup(new ParentalConsentController(new ParentalConsentService(users)))
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver()).build();
    }
    @AfterEach void clear() { SecurityContextHolder.clearContext(); }
    void signIn() {
        var principal = new org.springframework.security.core.userdetails.User("parent@example.test", "unused", List.of());
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(principal, null, List.of()));
    }
    String decision(boolean accepted, String version) {
        return "{\"parentalConsentAccepted\":" + accepted + ",\"parentalConsentVersion\":\"" + version + "\"}";
    }

    @Test void acceptanceRequiresAuthentication() throws Exception {
        mvc.perform(post("/api/v1/auth/parental-consent").contentType(MediaType.APPLICATION_JSON)
                .content(decision(true, ParentalConsentService.CURRENT_VERSION))).andExpect(status().isUnauthorized());
        verifyNoInteractions(users);
    }

    @Test void refusesAnUncheckedOrOutdatedDecision() throws Exception {
        signIn();
        for (String body : List.of(decision(false, ParentalConsentService.CURRENT_VERSION), decision(true, "old-version"), "{}")) {
            mvc.perform(post("/api/v1/auth/parental-consent").contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isBadRequest());
        }
        verifyNoInteractions(users);
    }

    @Test void returnsRecordedConsentForTheAuthenticatedParent() throws Exception {
        signIn();
        User user = User.builder().id(7L).email("parent@example.test").build();
        when(users.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(users.save(user)).thenReturn(user);
        mvc.perform(post("/api/v1/auth/parental-consent").contentType(MediaType.APPLICATION_JSON)
                .content(decision(true, ParentalConsentService.CURRENT_VERSION)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.parentalConsentRequired").value(false))
                .andExpect(jsonPath("$.parentalConsentVersion").value(ParentalConsentService.CURRENT_VERSION))
                .andExpect(jsonPath("$.parentalConsentAt").isString());
        verify(users).save(user);
    }
}
