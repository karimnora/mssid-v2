package dz.mssid.education.service;

import dz.mssid.education.dto.AuthResponse;
import dz.mssid.education.dto.LoginRequest;
import dz.mssid.education.dto.RegisterRequest;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
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
    private AuthenticationManager authenticationManager;

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

//    @Test
//    @DisplayName("register - Success Path (New user registered with ROLE_FREE & JWT token)")
//    void register_Success() {
//        RegisterRequest request = new RegisterRequest("Omar Testeur", "omar@mssid.dz", "password123");
//
//        when(userRepository.existsByEmail("omar@mssid.dz")).thenReturn(false);
//        when(roleRepository.findByName(Role.RoleName.ROLE_FREE)).thenReturn(Optional.of(freeRole));
//        when(passwordEncoder.encode("password123")).thenReturn("encoded_password_123");
//        when(userRepository.save(any(User.class))).thenReturn(testUser);
//
//        Authentication authMock = mock(Authentication.class);
//        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
//        when(jwtTokenProvider.generateToken(authMock)).thenReturn("jwt_mock_token_abc123");
//
//        AuthResponse response = authService.register(request);
//
//        assertNotNull(response);
//        assertEquals("jwt_mock_token_abc123", response.getAccessToken());
//        assertNotNull(response.getUser());
//        assertEquals("omar@mssid.dz", response.getUser().getEmail());
//        assertEquals("ROLE_FREE", response.getUser().getRole());
//
//        verify(userRepository, times(1)).save(any(User.class));
//    }
//
//    @Test
//    @DisplayName("register - Throws Exception when email is already registered")
//    void register_EmailAlreadyExists_ThrowsException() {
//        RegisterRequest request = new RegisterRequest("Omar Testeur", "omar@mssid.dz", "password123");
//
//        when(userRepository.existsByEmail("omar@mssid.dz")).thenReturn(true);
//
//        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.register(request));
//        assertTrue(exception.getMessage().contains("déjà utilisé"));
//
//        verify(userRepository, never()).save(any(User.class));
//    }
//
//    @Test
//    @DisplayName("login - Success Path (Valid credentials returns JWT & UserProfileDto)")
//    void login_Success() {
//        LoginRequest request = new LoginRequest("omar@mssid.dz", "password123");
//
//        Authentication authMock = mock(Authentication.class);
//        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
//        when(userRepository.findByEmail("omar@mssid.dz")).thenReturn(Optional.of(testUser));
//        when(jwtTokenProvider.generateToken(authMock)).thenReturn("jwt_mock_token_login_xyz");
//
//        AuthResponse response = authService.login(request);
//
//        assertNotNull(response);
//        assertEquals("jwt_mock_token_login_xyz", response.getAccessToken());
//        assertEquals("Omar Testeur", response.getUser().getNom());
//        assertEquals(50, response.getUser().getScore());
//    }
//
//    @Test
//    @DisplayName("login - User Not Found Throws Exception")
//    void login_UserNotFound_ThrowsException() {
//        LoginRequest request = new LoginRequest("unknown@mssid.dz", "wrongpass");
//
//        Authentication authMock = mock(Authentication.class);
//        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
//        when(userRepository.findByEmail("unknown@mssid.dz")).thenReturn(Optional.empty());
//
//        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
//        assertTrue(exception.getMessage().contains("Utilisateur introuvable"));
//    }
}
