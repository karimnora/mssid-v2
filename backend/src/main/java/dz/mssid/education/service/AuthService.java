package dz.mssid.education.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
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
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

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

    // Empty by default (feature dormant until GOOGLE_OAUTH_CLIENT_ID is set) — this is the OAuth
    // Client ID, not a secret; ID-token verification needs no client secret at all.
    @Value("${app.oauth.google.client-id:}")
    private String googleClientId;

    private GoogleIdTokenVerifier googleIdTokenVerifier;

    @PostConstruct
    void initGoogleIdTokenVerifier() {
        if (googleClientId != null && !googleClientId.isBlank()) {
            this.googleIdTokenVerifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
        }
    }

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
                .wilaya(request.getWilaya())
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

    /**
     * Verifies a Google-issued ID token server-side (never trusts anything the frontend claims about
     * the user), then finds-or-creates the matching account and issues the exact same JWT + refresh
     * token pair as {@link #login} / {@link #register} — from the frontend's point of view this is
     * just another way to end up authenticated, not a separate session mechanism.
     */
    public AuthResponse loginWithGoogle(String rawIdToken) {
        if (googleIdTokenVerifier == null) {
            throw new IllegalStateException("La connexion avec Google n'est pas configurée sur ce serveur.");
        }

        GoogleIdToken idToken;
        try {
            idToken = googleIdTokenVerifier.verify(rawIdToken);
        } catch (GeneralSecurityException | IOException | IllegalArgumentException e) {
            throw new BadCredentialsException("Jeton Google invalide.");
        }
        if (idToken == null) {
            throw new BadCredentialsException("Jeton Google invalide ou expiré.");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String googleId = payload.getSubject();
        String email = payload.getEmail();
        boolean googleEmailVerified = Boolean.TRUE.equals(payload.getEmailVerified());
        Object nameClaim = payload.get("name");
        String name = nameClaim != null ? nameClaim.toString() : email;

        User user = userRepository.findByGoogleId(googleId).orElse(null);
        boolean isNewUser = false;

        if (user == null) {
            User existingByEmail = userRepository.findByEmail(email).orElse(null);
            if (existingByEmail != null) {
                // Account already exists (registered by email/password) — link it, but only once
                // Google itself has confirmed the email really belongs to this Google account.
                if (!googleEmailVerified) {
                    adminAuditLogService.record(email, "GOOGLE_LINK_REJECTED", "USER",
                            existingByEmail.getId() != null ? existingByEmail.getId().toString() : null,
                            "email non vérifié par Google", "FAILURE");
                    throw new BadCredentialsException("Impossible de lier ce compte Google : l'e-mail n'est pas vérifié par Google.");
                }
                existingByEmail.setGoogleId(googleId);
                if (!existingByEmail.isEmailVerified()) {
                    existingByEmail.setEmailVerified(true);
                }
                user = userRepository.save(existingByEmail);
            } else {
                isNewUser = true;
                Role defaultRole = roleRepository.findByName(Role.RoleName.ROLE_FREE)
                        .orElseGet(() -> {
                            Role newRole = new Role();
                            newRole.setName(Role.RoleName.ROLE_FREE);
                            return roleRepository.save(newRole);
                        });
                // Random, never-communicated password: this account only ever authenticates via
                // Google, but password_hash stays NOT NULL, so it needs *some* unusable value here.
                user = User.builder()
                        .nom(name)
                        .email(email)
                        .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .provider("GOOGLE")
                        .googleId(googleId)
                        .role(defaultRole)
                        .emailVerified(googleEmailVerified)
                        .createdAt(LocalDateTime.now())
                        .build();
                user = userRepository.save(user);
            }
        }

        String userId = user.getId() != null ? user.getId().toString() : null;
        adminAuditLogService.record(user.getEmail(), isNewUser ? "GOOGLE_REGISTERED" : "GOOGLE_LOGIN", "USER", userId,
                "provider=GOOGLE", "SUCCESS");

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, user.getAuthorities());
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
                .profileIncomplete(isNewUser)
                .build();
    }
}
