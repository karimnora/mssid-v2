package dz.mssid.education.controller;

import dz.mssid.education.dto.UpdateProfileRequest;
import dz.mssid.education.dto.UserDto;
import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Récupère le profil complet adapté à l'interface React (UserProfile TS).
     * GET /api/v1/users/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserProfileDto profile = userService.getUserProfileByEmail(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    /**
     * Récupère les données utilisateur basiques si besoin de rétrocompatibilité.
     * GET /api/v1/users/me/basic
     */
    @GetMapping("/me/basic")
    public ResponseEntity<UserDto> getCurrentUserBasic(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    /**
     * Mise à jour du nom de l'utilisateur.
     * PUT /api/v1/users/me
     */
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserDto updatedUser = userService.updateNom(userDetails.getUsername(), request.getNom());
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Mise à jour du profil complet.
     * PUT /api/v1/users/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateFullProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserProfileDto profileData
    ) {
        UserProfileDto updated = userService.updateUserProgress(userDetails.getUsername(), profileData);
        return ResponseEntity.ok(updated);
    }

    /**
     * Mise à jour des progrès de l'élève (XP, leçons terminées, scores).
     * PUT /api/v1/users/me/progress
     */
    @PutMapping("/me/progress")
    public ResponseEntity<UserProfileDto> updateProgress(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserProfileDto progressData
    ) {
        UserProfileDto updatedProfile = userService.updateUserProgress(userDetails.getUsername(), progressData);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Récupération de tous les utilisateurs (Réservé à l'ADMIN RBAC).
     * GET /api/v1/users/all
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        List<UserProfileDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Modification du rôle d'un utilisateur par l'administrateur (RBAC).
     * PUT /api/v1/admin/users/{id}/role
     */
    @PutMapping("/admin/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String newRole = payload.get("role");
        if (newRole == null || newRole.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Le paramètre 'role' est obligatoire"));
        }
        UserProfileDto updatedUser = userService.updateUserRole(id, newRole);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Rôle mis à jour avec succès",
                "user", updatedUser
        ));
    }
}
