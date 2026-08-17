package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.AuthResponse;
import dz.mssid.education.dto.LoginRequest;
import dz.mssid.education.dto.RegisterRequest;
import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.security.AuthCookieConstants;
import dz.mssid.education.security.JwtTokenProvider;
import dz.mssid.education.security.RefreshTokenService;
import dz.mssid.education.exception.GlobalExceptionHandler;
import dz.mssid.education.service.AuthService;
import dz.mssid.education.service.EmailVerificationService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Duration;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private EmailVerificationService emailVerificationService;

    @Mock
    private dz.mssid.education.service.PasswordResetService passwordResetService;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User testUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authController, "jwtExpirationMs", 86_400_000L);
        ReflectionTestUtils.setField(authController, "refreshExpirationMs", 2_592_000_000L);
        ReflectionTestUtils.setField(authController, "cookieSecure", false);

        // GlobalExceptionHandler must be registered explicitly here — standalone MockMvc only wires
        // up the controller under test, not @RestControllerAdvice beans, so without this the
        // BadCredentialsException thrown by refresh_InvalidToken_Unauthorized would propagate as an
        // uncaught servlet error instead of the real 401 response the app returns in production.
        // AuthenticationPrincipalArgumentResolver is likewise not auto-registered outside the real
        // filter chain — needed for verify-email/resend-verification's @AuthenticationPrincipal param.
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .build();

        testUser = User.builder()
                .id(10L)
                .nom("Amina Bendjama")
                .email("amina@mssid.dz")
                .passwordHash("encoded")
                .role(new Role(1L, Role.RoleName.ROLE_FREE))
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Standalone MockMvc has no filter chain, so SecurityMockMvcRequestPostProcessors.user(...)
     * never reaches SecurityContextHolder here — setting it directly is what
     * @AuthenticationPrincipal's resolver actually reads (same pattern as UserControllerTest).
     */
    private void authenticateAs(String email) {
        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(email, "N/A", List.of());
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));
    }

    // RegisterRequest/LoginRequest only expose @Data's implicit no-args constructor + setters.
    private static RegisterRequest registerRequest(String nom, String email, String password) {
        RegisterRequest request = new RegisterRequest();
        request.setNom(nom);
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    private static LoginRequest loginRequest(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    @Test
    @DisplayName("POST /register - Registers user, sets both HttpOnly cookies, and never leaks tokens in the JSON body")
    void register_Success() throws Exception {
        RegisterRequest registerRequest = registerRequest("Amina Bendjama", "amina@mssid.dz", "pass12345");
        UserProfileDto userProfile = UserProfileDto.builder()
                .id(10L)
                .nom("Amina Bendjama")
                .name("Amina Bendjama")
                .email("amina@mssid.dz")
                .role("ROLE_FREE")
                .score(0)
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .token("jwt_token_sample_123")
                .accessToken("jwt_token_sample_123")
                .refreshToken("refresh_token_sample_123")
                .email("amina@mssid.dz")
                .nom("Amina Bendjama")
                .role("ROLE_FREE")
                .roleName("ROLE_FREE")
                .user(userProfile)
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").doesNotExist())
                .andExpect(jsonPath("$.refreshToken").doesNotExist())
                .andExpect(jsonPath("$.email").value("amina@mssid.dz"))
                .andExpect(jsonPath("$.user.email").value("amina@mssid.dz"))
                .andExpect(cookie().value(AuthCookieConstants.COOKIE_NAME, "jwt_token_sample_123"))
                .andExpect(cookie().httpOnly(AuthCookieConstants.COOKIE_NAME, true))
                .andExpect(cookie().value(AuthCookieConstants.REFRESH_COOKIE_NAME, "refresh_token_sample_123"))
                .andExpect(cookie().path(AuthCookieConstants.REFRESH_COOKIE_NAME, AuthCookieConstants.REFRESH_COOKIE_PATH));
    }

    @Test
    @DisplayName("POST /register - Returns 400 Bad Request on exception")
    void register_Failure_BadRequest() throws Exception {
        RegisterRequest registerRequest = registerRequest("Amina Bendjama", "existing@mssid.dz", "pass12345");

        when(authService.register(any(RegisterRequest.class))).thenThrow(new RuntimeException("Cet email est déjà utilisé."));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cet email est déjà utilisé."));
    }

    @Test
    @DisplayName("POST /login - Authenticates user, sets both cookies, and returns 200 OK")
    void login_Success() throws Exception {
        LoginRequest loginRequest = loginRequest("amina@mssid.dz", "pass12345");
        UserProfileDto userProfile = UserProfileDto.builder()
                .id(10L)
                .nom("Amina Bendjama")
                .email("amina@mssid.dz")
                .role("ROLE_PREMIUM")
                .score(120)
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .token("jwt_token_login_ok")
                .accessToken("jwt_token_login_ok")
                .refreshToken("refresh_token_login_ok")
                .email("amina@mssid.dz")
                .nom("Amina Bendjama")
                .role("ROLE_PREMIUM")
                .roleName("ROLE_PREMIUM")
                .user(userProfile)
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").doesNotExist())
                .andExpect(jsonPath("$.user.score").value(120))
                .andExpect(cookie().exists(AuthCookieConstants.COOKIE_NAME))
                .andExpect(cookie().exists(AuthCookieConstants.REFRESH_COOKIE_NAME));
    }

    @Test
    @DisplayName("POST /login - Returns 401 on bad credentials")
    void login_Failure_Unauthorized() throws Exception {
        LoginRequest loginRequest = loginRequest("amina@mssid.dz", "wrongpass");

        when(authService.login(any(LoginRequest.class))).thenThrow(new BadCredentialsException("Identifiants incorrects ou compte introuvable"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Identifiants incorrects ou compte introuvable"));
    }

    @Test
    @DisplayName("POST /refresh - Rotates the refresh cookie and issues a fresh access token")
    void refresh_Success() throws Exception {
        String oldRawToken = "old_raw_refresh_token";
        String newRawToken = "new_raw_refresh_token";
        RefreshTokenService.RotationResult rotation = new RefreshTokenService.RotationResult(testUser, newRawToken);

        when(refreshTokenService.rotate(oldRawToken)).thenReturn(rotation);
        when(jwtTokenProvider.generateToken(any())).thenReturn("new_access_token");

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie(AuthCookieConstants.REFRESH_COOKIE_NAME, oldRawToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("amina@mssid.dz"))
                .andExpect(cookie().value(AuthCookieConstants.COOKIE_NAME, "new_access_token"))
                .andExpect(cookie().value(AuthCookieConstants.REFRESH_COOKIE_NAME, newRawToken));

        verify(refreshTokenService).rotate(oldRawToken);
    }

    @Test
    @DisplayName("POST /refresh - Returns 401 when no refresh cookie is present")
    void refresh_NoCookie_Unauthorized() throws Exception {
        mockMvc.perform(post("/api/v1/auth/refresh"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(refreshTokenService);
    }

    @Test
    @DisplayName("POST /refresh - Returns 401 when the refresh token is invalid/expired/revoked")
    void refresh_InvalidToken_Unauthorized() throws Exception {
        when(refreshTokenService.rotate("stale_token")).thenThrow(new BadCredentialsException("Session expirée, veuillez vous reconnecter."));

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie(AuthCookieConstants.REFRESH_COOKIE_NAME, "stale_token")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /logout - Revokes the refresh token and clears both cookies")
    void logout_RevokesTokenAndClearsCookies() throws Exception {
        mockMvc.perform(post("/api/v1/auth/logout")
                        .cookie(new Cookie(AuthCookieConstants.REFRESH_COOKIE_NAME, "some_raw_token")))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge(AuthCookieConstants.COOKIE_NAME, 0))
                .andExpect(cookie().maxAge(AuthCookieConstants.REFRESH_COOKIE_NAME, 0));

        verify(refreshTokenService).revoke("some_raw_token");
    }

    @Test
    @DisplayName("POST /logout - Still succeeds (no-op) when no refresh cookie is present")
    void logout_NoCookie_StillSucceeds() throws Exception {
        mockMvc.perform(post("/api/v1/auth/logout"))
                .andExpect(status().isOk());

        verify(refreshTokenService, never()).revoke(any());
    }

    @Test
    @DisplayName("POST /verify-email - Correct code marks the account verified")
    void verifyEmail_CorrectCode_Success() throws Exception {
        when(userRepository.findByEmail("amina@mssid.dz")).thenReturn(java.util.Optional.of(testUser));
        when(emailVerificationService.verifyCode(testUser, "123456")).thenReturn(true);
        authenticateAs("amina@mssid.dz");

        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"123456\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.emailVerified").value(true));
    }

    @Test
    @DisplayName("POST /verify-email - Wrong code returns 400")
    void verifyEmail_WrongCode_BadRequest() throws Exception {
        when(userRepository.findByEmail("amina@mssid.dz")).thenReturn(java.util.Optional.of(testUser));
        when(emailVerificationService.verifyCode(testUser, "000000")).thenReturn(false);
        authenticateAs("amina@mssid.dz");

        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"000000\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /verify-email - Returns 401 without an authenticated principal")
    void verifyEmail_NoAuth_Unauthorized() throws Exception {
        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"123456\"}"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(emailVerificationService);
    }

    @Test
    @DisplayName("POST /resend-verification - Sends a new code when allowed")
    void resendVerification_Allowed_Success() throws Exception {
        when(userRepository.findByEmail("amina@mssid.dz")).thenReturn(java.util.Optional.of(testUser));
        when(emailVerificationService.cooldownRemaining(testUser)).thenReturn(Duration.ZERO);
        when(emailVerificationService.sendVerificationCode(testUser)).thenReturn(true);
        authenticateAs("amina@mssid.dz");

        mockMvc.perform(post("/api/v1/auth/resend-verification"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /resend-verification - Returns 429 while within the cooldown window")
    void resendVerification_WithinCooldown_TooManyRequests() throws Exception {
        when(userRepository.findByEmail("amina@mssid.dz")).thenReturn(java.util.Optional.of(testUser));
        when(emailVerificationService.cooldownRemaining(testUser)).thenReturn(Duration.ofSeconds(45));
        authenticateAs("amina@mssid.dz");

        mockMvc.perform(post("/api/v1/auth/resend-verification"))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.cooldownSeconds").value(45));

        verify(emailVerificationService, never()).sendVerificationCode(any());
    }

    @Test
    @DisplayName("POST /resend-verification - Already-verified account is a no-op 200")
    void resendVerification_AlreadyVerified_NoOp() throws Exception {
        testUser.setEmailVerified(true);
        when(userRepository.findByEmail("amina@mssid.dz")).thenReturn(java.util.Optional.of(testUser));
        authenticateAs("amina@mssid.dz");

        mockMvc.perform(post("/api/v1/auth/resend-verification"))
                .andExpect(status().isOk());

        verifyNoInteractions(emailVerificationService);
    }

    @Test
    @DisplayName("POST /forgot-password - Always returns the same generic 200, whether or not the email exists")
    void forgotPassword_AlwaysGenericSuccess() throws Exception {
        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"amina@mssid.dz\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());

        verify(passwordResetService).requestReset("amina@mssid.dz");
    }

    @Test
    @DisplayName("POST /forgot-password - Unknown email still returns 200 (no enumeration signal)")
    void forgotPassword_UnknownEmail_StillGenericSuccess() throws Exception {
        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"ghost@mssid.dz\"}"))
                .andExpect(status().isOk());

        verify(passwordResetService).requestReset("ghost@mssid.dz");
    }

    @Test
    @DisplayName("POST /reset-password - Valid code changes the password")
    void resetPassword_ValidCode_Success() throws Exception {
        when(passwordResetService.resetPassword("amina@mssid.dz", "654321", "NewPass123!")).thenReturn(true);

        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"amina@mssid.dz\",\"code\":\"654321\",\"newPassword\":\"NewPass123!\"}"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /reset-password - Invalid code returns 400")
    void resetPassword_InvalidCode_BadRequest() throws Exception {
        when(passwordResetService.resetPassword("amina@mssid.dz", "000000", "NewPass123!")).thenReturn(false);

        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"amina@mssid.dz\",\"code\":\"000000\",\"newPassword\":\"NewPass123!\"}"))
                .andExpect(status().isBadRequest());
    }
}
