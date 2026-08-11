package dz.mssid.education.service;

import dz.mssid.education.dto.UserDto;
import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.mapper.UserMapper;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'email: " + email));

        return new UserDto(
                user.getId(),
                user.getNom(),
                user.getEmail(),
                user.getRole().getName().name(),
                user.getScore(),
                user.getCreatedAt()
        );
    }

    public UserDto updateNom(String email, String nouveauNom) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + email));

        user.setNom(nouveauNom);
        User updatedUser = userRepository.save(user);

        return new UserDto(
                updatedUser.getId(),
                updatedUser.getNom(),
                updatedUser.getEmail(),
                updatedUser.getRole().getName().name(),
                updatedUser.getScore(),
                updatedUser.getCreatedAt()
        );
    }

    /**
     * Récupère le profil adapté au DTO UserProfileDto pour le frontend.
     */
    public UserProfileDto getUserProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));

        return UserMapper.toUserProfileDto(user);
    }

    /**
     * Met à jour la progression globale de l'élève (XP, niveau, leçons terminées, quiz).
     */
    public UserProfileDto updateUserProgress(String email, UserProfileDto progressData) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));

        if (progressData.getGrade() != null) user.setGrade(progressData.getGrade());
        if (progressData.getAvatar() != null) user.setAvatar(progressData.getAvatar());
        if (progressData.getXp() != null) user.setXp(progressData.getXp());
        if (progressData.getLevel() != null) user.setLevel(progressData.getLevel());
        if (progressData.getStreakDays() != null) user.setStreakDays(progressData.getStreakDays());
        if (progressData.getLastActiveDate() != null) user.setLastActiveDate(progressData.getLastActiveDate());

        if (progressData.getCompletedLessonIds() != null) {
            List<String> mergedLessons = new ArrayList<>(user.getCompletedLessonIds() != null ? user.getCompletedLessonIds() : List.of());
            for (String lessonId : progressData.getCompletedLessonIds()) {
                if (lessonId != null && !mergedLessons.contains(lessonId)) {
                    mergedLessons.add(lessonId);
                }
            }
            user.setCompletedLessonIds(mergedLessons);
        }

        if (progressData.getBadges() != null) {
            List<String> mergedBadges = new ArrayList<>(user.getBadges() != null ? user.getBadges() : List.of());
            for (String badge : progressData.getBadges()) {
                if (badge != null && !mergedBadges.contains(badge)) {
                    mergedBadges.add(badge);
                }
            }
            user.setBadges(mergedBadges);
        }

        if (progressData.getQuizScores() != null) {
            Map<String, Integer> mergedQuizScores = new HashMap<>(user.getQuizScores() != null ? user.getQuizScores() : Map.of());
            progressData.getQuizScores().forEach((lessonId, score) -> {
                if (lessonId != null && score != null) {
                    mergedQuizScores.put(lessonId, Math.max(mergedQuizScores.getOrDefault(lessonId, 0), score));
                }
            });
            user.setQuizScores(mergedQuizScores);
        }

        List<String> completedLessons = user.getCompletedLessonIds() != null ? user.getCompletedLessonIds() : List.of();
        long mathLessons = completedLessons.stream()
                .filter(lessonId -> lessonId != null && lessonId.toLowerCase().contains("math"))
                .count();

        if (mathLessons >= 3) {
            List<String> existingBadges = new ArrayList<>(user.getBadges() != null ? user.getBadges() : List.of());
            if (!existingBadges.contains("b_math_star")) {
                existingBadges.add("b_math_star");
            }
            user.setBadges(existingBadges);
        }

        if (user.getXp() != null) {
            user.setScore(user.getXp());
        }

        User savedUser = userRepository.save(user);
        return UserMapper.toUserProfileDto(savedUser);
    }

    /**
     * Récupère la liste de tous les utilisateurs pour le panneau Admin RBAC.
     */
    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toUserProfileDto)
                .collect(Collectors.toList());
    }

    /**
     * Modifie le rôle RBAC d'un utilisateur par son ID.
     */
    public UserProfileDto updateUserRole(Long userId, String newRoleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + userId));

        Role.RoleName roleEnum;
        try {
            roleEnum = Role.RoleName.valueOf(newRoleName);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rôle invalide: " + newRoleName);
        }

        Role role = roleRepository.findByName(roleEnum)
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName(roleEnum);
                    return roleRepository.save(r);
                });

        user.setRole(role);
        User saved = userRepository.save(user);
        return UserMapper.toUserProfileDto(saved);
    }
}
