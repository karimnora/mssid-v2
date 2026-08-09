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

import java.util.List;
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
        if (progressData.getCompletedLessonIds() != null) user.setCompletedLessonIds(progressData.getCompletedLessonIds());
        if (progressData.getBadges() != null) user.setBadges(progressData.getBadges());
        if (progressData.getQuizScores() != null) user.setQuizScores(progressData.getQuizScores());

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
