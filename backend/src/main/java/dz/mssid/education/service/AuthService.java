package dz.mssid.education.service;

import dz.mssid.education.dto.AuthResponse;
import dz.mssid.education.dto.LoginRequest;
import dz.mssid.education.dto.RegisterRequest;
import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.mapper.UserMapper;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.security.JwtTokenProvider;
import dz.mssid.education.security.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final EmailVerificationService emailVerificationService;
    private final ParentNotificationService parentNotificationService;
    private final AuthenticationManager authenticationManager;
    private final AdminAuditLogService adminAuditLogService;

    public AuthResponse register(RegisterRequest request) {
        // 1. Vérification de l'email
        if (userRepository.existsByEmail(request.getEmail())) {
            adminAuditLogService.record(request.getEmail(), "REGISTRATION_FAILED", "USER", null,
                    "email déjà utilisé", "FAILURE");
            throw new RuntimeException("Cet email est déjà utilisé.");
        }

        // 2. Récupération ou création automatique du rôle
        Role defaultRole = roleRepository.findByName(Role.RoleName.ROLE_FREE)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(Role.RoleName.ROLE_FREE);
                    return roleRepository.save(newRole);
                });

        // 3. Sauvegarde de l'utilisateur
        User user = User.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(defaultRole)
                .grade(request.getGrade())
                .parentEmail(request.getParentEmail())
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        // user.getId() is populated in-place by Hibernate for IDENTITY-strategy entities after save(),
        // but stays null against a mocked repository in tests — guard rather than assume either way.
        String userId = user.getId() != null ? user.getId().toString() : null;
        adminAuditLogService.record(user.getEmail(), "USER_REGISTERED", "USER", userId,
                "grade=" + user.getGrade(), "SUCCESS");

        // Best-effort — a flaky email provider must never block account creation (soft verification,
        // never blocks app usage; the user can always request a resend later). Any failure is already
        // captured by ResendEmailService's own EMAIL_SEND audit entry, so nothing further to log here.
        emailVerificationService.sendVerificationCode(user);

        // Best-effort, same reasoning as above — only fires when parentEmail was actually supplied.
        parentNotificationService.sendAccountCreatedNotice(user);

        // 4. Authentification & Génération du Token JWT
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        String refreshToken = refreshTokenService.createToken(user);
        UserProfileDto profileDto = UserMapper.toUserProfileDto(user);
        String roleStr = user.getRole() != null ? user.getRole().getName().name() : "ROLE_FREE";

        return AuthResponse.builder()
                .token(token)
                .accessToken(token)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .nom(user.getNom())
                .roleName(roleStr)
                .role(roleStr)
                .user(profileDto)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Vérification si l'utilisateur existe
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    adminAuditLogService.record(request.getEmail(), "LOGIN_FAILED", "USER", null,
                            "compte introuvable", "FAILURE");
                    return new BadCredentialsException("Identifiants incorrects ou compte introuvable");
                });

        // 2. Authentification Spring Security
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 3. Génération du JWT + du refresh token
            String token = jwtTokenProvider.generateToken(authentication);
            String refreshToken = refreshTokenService.createToken(user);
            UserProfileDto profileDto = UserMapper.toUserProfileDto(user);
            String roleStr = user.getRole() != null ? user.getRole().getName().name() : "ROLE_FREE";

            // 4. Réponse
            return AuthResponse.builder()
                    .token(token)
                    .accessToken(token)
                    .refreshToken(refreshToken)
                    .email(user.getEmail())
                    .nom(user.getNom())
                    .roleName(roleStr)
                    .role(roleStr)
                    .user(profileDto)
                    .build();
        } catch (AuthenticationException e) {
            adminAuditLogService.record(request.getEmail(), "LOGIN_FAILED", "USER", null,
                    "mot de passe incorrect", "FAILURE");
            throw new BadCredentialsException("Identifiants incorrects ou compte introuvable");
        }
    }
}
