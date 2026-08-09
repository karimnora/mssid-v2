package dz.mssid.education.controller;

import dz.mssid.education.dto.AuthResponse;
import dz.mssid.education.dto.LoginRequest;
import dz.mssid.education.dto.RegisterRequest;
import dz.mssid.education.dto.UserDto;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.UserRepository;
import dz.mssid.education.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Autorise les requêtes cross-origin du frontend
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

        @PostMapping("/users/add-score")
        public ResponseEntity<?> addScore(Authentication authentication, @RequestBody Map<String, Integer> payload) {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Utilisateur non authentifié"));
            }

            String username = authentication.getName();

            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable: " + username));

            Integer pointsToAdd = payload.getOrDefault("points", 0);

            int newScore = (user.getScore() != null ? user.getScore() : 0) + pointsToAdd;
            user.setScore(newScore);
            userRepository.save(user);

            UserDto dto = new UserDto(
                    user.getId(),
                    user.getNom(),
                    user.getEmail(),
                    user.getRole().getName().name(),
                    user.getScore(),
                    user.getCreatedAt()
            );
            return ResponseEntity.ok(dto);
        }
}