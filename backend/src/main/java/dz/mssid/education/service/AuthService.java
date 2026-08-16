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
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // 1. Vérification de l'email
        if (userRepository.existsByEmail(request.getEmail())) {
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
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

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
                .orElseThrow(() -> new BadCredentialsException("Identifiants incorrects ou compte introuvable"));

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
            throw new BadCredentialsException("Identifiants incorrects ou compte introuvable");
        }
    }
}
