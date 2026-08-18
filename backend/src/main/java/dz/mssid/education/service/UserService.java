package dz.mssid.education.service;

import dz.mssid.education.dto.UserDto;
import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.mapper.UserMapper;
import dz.mssid.education.repository.EmailVerificationCodeRepository;
import dz.mssid.education.repository.PasswordResetCodeRepository;
import dz.mssid.education.repository.PaymentReceiptRepository;
import dz.mssid.education.repository.RefreshTokenRepository;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.SubscriptionRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final AdminAuditLogService adminAuditLogService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationCodeRepository emailVerificationCodeRepository;
    private final PasswordResetCodeRepository passwordResetCodeRepository;
    private final PaymentReceiptRepository paymentReceiptRepository;
    private final SubscriptionRepository subscriptionRepository;

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
        // Scalar overwrite (not merge) — the client always sends its current authoritative balance,
        // same semantics as xp/level/streakDays above (unlike the list/map fields below, which merge).
        if (progressData.getGoldCoins() != null) user.setGoldCoins(progressData.getGoldCoins());
        if (progressData.getAvatarConfig() != null) user.setAvatarConfig(progressData.getAvatarConfig());

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

        // First-unlock timestamps are append-only: an existing timestamp for a badge id is never overwritten.
        if (progressData.getBadgeUnlockedAt() != null) {
            Map<String, String> mergedUnlockedAt = new HashMap<>(user.getBadgeUnlockedAt() != null ? user.getBadgeUnlockedAt() : Map.of());
            progressData.getBadgeUnlockedAt().forEach((badgeId, unlockedAt) -> {
                if (badgeId != null && unlockedAt != null) {
                    mergedUnlockedAt.putIfAbsent(badgeId, unlockedAt);
                }
            });
            user.setBadgeUnlockedAt(mergedUnlockedAt);
        }

        if (progressData.getCompletedExamIds() != null) {
            List<String> mergedExams = new ArrayList<>(user.getCompletedExamIds() != null ? user.getCompletedExamIds() : List.of());
            for (String examId : progressData.getCompletedExamIds()) {
                if (examId != null && !mergedExams.contains(examId)) {
                    mergedExams.add(examId);
                }
            }
            user.setCompletedExamIds(mergedExams);
        }

        if (progressData.getCompletedChallengeIds() != null) {
            List<String> mergedChallenges = new ArrayList<>(user.getCompletedChallengeIds() != null ? user.getCompletedChallengeIds() : List.of());
            for (String challengeId : progressData.getCompletedChallengeIds()) {
                if (challengeId != null && !mergedChallenges.contains(challengeId)) {
                    mergedChallenges.add(challengeId);
                }
            }
            user.setCompletedChallengeIds(mergedChallenges);
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
     * Suppression définitive du compte et de toutes les données qui lui sont liées — honore la
     * promesse de la politique de confidentialité ("suppression sur demande par email"), qui n'avait
     * jusqu'ici aucun endpoint réel derrière elle. Aucune des tables dépendantes (refresh_tokens,
     * email_verification_codes, password_reset_codes, payment_receipts, subscriptions) n'a de
     * ON DELETE CASCADE au niveau base — chacune doit être vidée explicitement avant de supprimer
     * la ligne users, sous peine de violation de contrainte de clé étrangère.
     */
    @Transactional
    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + email));

        refreshTokenRepository.deleteByUser(user);
        emailVerificationCodeRepository.deleteByUser(user);
        passwordResetCodeRepository.deleteByUser(user);
        paymentReceiptRepository.deleteByUserId(user.getId());
        subscriptionRepository.deleteByUser(user);

        userRepository.delete(user);
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
    public UserProfileDto updateUserRole(Long userId, String newRoleName, String actorEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + userId));

        Role.RoleName roleEnum;
        try {
            roleEnum = Role.RoleName.valueOf(newRoleName);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rôle invalide: " + newRoleName);
        }

        String oldRoleName = user.getRole() != null && user.getRole().getName() != null
                ? user.getRole().getName().name()
                : "UNKNOWN";

        Role role = roleRepository.findByName(roleEnum)
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName(roleEnum);
                    return roleRepository.save(r);
                });

        user.setRole(role);
        User saved = userRepository.save(user);

        adminAuditLogService.record(actorEmail, "ROLE_CHANGE", "USER", userId.toString(), oldRoleName + " -> " + newRoleName);

        return UserMapper.toUserProfileDto(saved);
    }
}
