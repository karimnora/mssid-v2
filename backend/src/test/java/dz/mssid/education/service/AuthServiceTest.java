package dz.mssid.education.service;

import dz.mssid.education.dto.AuthResponse;
import dz.mssid.education.dto.LoginRequest;
import dz.mssid.education.dto.RegisterRequest;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.security.JwtTokenProvider;
import dz.mssid.education.security.RefreshTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private EmailVerificationService emailVerificationService;

    @Mock
    private ParentNotificationService parentNotificationService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private AdminAuditLogService adminAuditLogService;

    @InjectMocks
    private AuthService authService;

    private Role freeRole;
    private User testUser;

    @BeforeEach
    void setUp() {
        freeRole = new Role(1L, Role.RoleName.ROLE_FREE);
        testUser = User.builder()
                .id(100L)
                .nom("Omar Testeur")
                .email("omar@mssid.dz")
                .passwordHash("encoded_password_123")
                .role(freeRole)
                .score(50)
                .createdAt(LocalDateTime.now())
                .build();
    }

    // RegisterRequest/LoginRequest only expose @Data's implicit no-args constructor + setters.
    private static RegisterRequest registerRequest(String nom, String email, String password) {
        RegisterRequest request = new RegisterRequest();
        request.setNom(nom);
        request.setEmail(email);
        request.setPassword(password);
        request.setParentalConsentAccepted(true);
        request.setParentalConsentVersion(ParentalConsentService.CURRENT_VERSION);
        return request;
    }

    private static LoginRequest loginRequest(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    @Test
    @DisplayName("register - Success Path (New user registered with ROLE_FREE, JWT + refresh token)")
    void register_Success() {
        RegisterRequest request = registerRequest("Omar Testeur", "omar@mssid.dz", "password123");

        when(userRepository.existsByEmail("omar@mssid.dz")).thenReturn(false);
        when(roleRepository.findByName(Role.RoleName.ROLE_FREE)).thenReturn(Optional.of(freeRole));
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password_123");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        Authentication authMock = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
        when(jwtTokenProvider.generateToken(authMock)).thenReturn("jwt_mock_token_abc123");
        // register() creates a fresh in-memory User via User.builder() and passes THAT to
        // refreshTokenService.createToken — userRepository.save(user)'s return value (testUser) is
        // never reassigned, so the two are different instances; the stub/verify below must match on
        // the built user's email rather than reference/value-equal `testUser`.
        when(refreshTokenService.createToken(argThat(u -> u != null && "omar@mssid.dz".equals(u.getEmail()))))
                .thenReturn("refresh_mock_token_abc123");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt_mock_token_abc123", response.getAccessToken());
        assertEquals("refresh_mock_token_abc123", response.getRefreshToken());
        assertNotNull(response.getUser());
        assertEquals("omar@mssid.dz", response.getUser().getEmail());
        assertEquals("ROLE_FREE", response.getUser().getRole());
        assertEquals(ParentalConsentService.CURRENT_VERSION, response.getUser().getParentalConsentVersion());
        assertNotNull(response.getUser().getParentalConsentAt());
        assertFalse(response.getUser().getParentalConsentRequired());

        verify(userRepository, times(1)).save(any(User.class));
        verify(refreshTokenService, times(1)).createToken(any(User.class));
        verify(emailVerificationService, times(1)).sendVerificationCode(any(User.class));
        verify(parentNotificationService, times(1)).sendAccountCreatedNotice(any(User.class));
        verify(adminAuditLogService).record(eq("omar@mssid.dz"), eq("USER_REGISTERED"), eq("USER"), any(), any(), eq("SUCCESS"));
    }

    @Test
    @DisplayName("register - Grade picked at registration is saved on the new User")
    void register_WithGrade_SavesGradeOnUser() {
        RegisterRequest request = registerRequest("Yasmine Testeur", "yasmine@mssid.dz", "password123");
        request.setGrade("3AP");

        when(userRepository.existsByEmail("yasmine@mssid.dz")).thenReturn(false);
        when(roleRepository.findByName(Role.RoleName.ROLE_FREE)).thenReturn(Optional.of(freeRole));
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password_123");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        Authentication authMock = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
        when(jwtTokenProvider.generateToken(authMock)).thenReturn("jwt_mock_token_xyz");
        when(refreshTokenService.createToken(any(User.class))).thenReturn("refresh_mock_token_xyz");

        authService.register(request);

        ArgumentCaptor<User> savedUserCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUserCaptor.capture());
        assertEquals("3AP", savedUserCaptor.getValue().getGrade());
    }

    @Test
    @DisplayName("register - Throws Exception when email is already registered")
    void register_EmailAlreadyExists_ThrowsException() {
        RegisterRequest request = registerRequest("Omar Testeur", "omar@mssid.dz", "password123");

        when(userRepository.existsByEmail("omar@mssid.dz")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertTrue(exception.getMessage().contains("déjà utilisé"));

        verify(userRepository, never()).save(any(User.class));
        verifyNoInteractions(refreshTokenService);
        verify(adminAuditLogService).record(eq("omar@mssid.dz"), eq("REGISTRATION_FAILED"), eq("USER"), any(), any(), eq("FAILURE"));
    }

    @Test
    @DisplayName("login - Success Path (Valid credentials returns JWT + refresh token + UserProfileDto)")
    void login_Success() {
        LoginRequest request = loginRequest("omar@mssid.dz", "password123");

        Authentication authMock = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
        when(userRepository.findByEmail("omar@mssid.dz")).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateToken(authMock)).thenReturn("jwt_mock_token_login_xyz");
        when(refreshTokenService.createToken(testUser)).thenReturn("refresh_mock_token_login_xyz");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt_mock_token_login_xyz", response.getAccessToken());
        assertEquals("refresh_mock_token_login_xyz", response.getRefreshToken());
        assertEquals("Omar Testeur", response.getUser().getNom());
        assertEquals(50, response.getUser().getScore());
        assertTrue(response.getUser().getParentalConsentRequired());
    }

    @Test
    void registerRejectsMissingRefusedOrOutdatedConsentBeforeAnyAccountWrite() {
        for (Boolean decision : new Boolean[] { null, false }) {
            RegisterRequest request = registerRequest("Parent", "parent@example.test", "password123");
            request.setParentalConsentAccepted(decision);
            assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> authService.register(request));
        }
        RegisterRequest stale = registerRequest("Parent", "parent@example.test", "password123");
        stale.setParentalConsentVersion("parental-consent-old");
        assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> authService.register(stale));
        verifyNoInteractions(userRepository, roleRepository, passwordEncoder, jwtTokenProvider, refreshTokenService,
                emailVerificationService, parentNotificationService, adminAuditLogService, authenticationManager);
    }

    @Test
    @DisplayName("login - User Not Found Throws BadCredentialsException")
    void login_UserNotFound_ThrowsException() {
        LoginRequest request = loginRequest("unknown@mssid.dz", "wrongpass");

        when(userRepository.findByEmail("unknown@mssid.dz")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verifyNoInteractions(refreshTokenService);
        verify(adminAuditLogService).record(eq("unknown@mssid.dz"), eq("LOGIN_FAILED"), eq("USER"), any(), any(), eq("FAILURE"));
    }

    @Test
    @DisplayName("login - Wrong Password Throws BadCredentialsException")
    void login_WrongPassword_ThrowsException() {
        LoginRequest request = loginRequest("omar@mssid.dz", "wrongpass");

        when(userRepository.findByEmail("omar@mssid.dz")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verifyNoInteractions(refreshTokenService);
        verify(adminAuditLogService).record(eq("omar@mssid.dz"), eq("LOGIN_FAILED"), eq("USER"), any(), any(), eq("FAILURE"));
    }
}
