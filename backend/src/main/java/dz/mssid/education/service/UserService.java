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

import java.util.List;
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
     * SEC-11: snapshot client accepté, mais XP/gold/badges/level sont clampés côté serveur.
     */
    public UserProfileDto updateUserProgress(String email, UserProfileDto progressData) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email : " + email));

        user.setGrade(ProgressGuard.sanitizeGrade(user.getGrade(), progressData.getGrade()));
        if (progressData.getAvatar() != null) user.setAvatar(progressData.getAvatar());
        if (progressData.getWilaya() != null) user.setWilaya(progressData.getWilaya());

        Integer requestedXp = progressData.getXp() != null ? progressData.getXp() : progressData.getScore();
        if (requestedXp != null) {
            int nextXp = ProgressGuard.clampXp(user.getXp(), requestedXp);
            user.setXp(nextXp);
            user.setScore(nextXp);
            user.setLevel(ProgressGuard.levelFromXp(nextXp));
        }

        if (progressData.getStreakDays() != null) {
            user.setStreakDays(ProgressGuard.clampStreak(user.getStreakDays(), progressData.getStreakDays()));
        }
        user.setLastActiveDate(ProgressGuard.sanitizeLastActiveDate(user.getLastActiveDate(), progressData.getLastActiveDate()));
        if (progressData.getGoldCoins() != null) {
            user.setGoldCoins(ProgressGuard.clampGold(user.getGoldCoins(), progressData.getGoldCoins()));
        }
        if (progressData.getAvatarConfig() != null) user.setAvatarConfig(progressData.getAvatarConfig());

        if (progressData.getCompletedLessonIds() != null) {
            user.setCompletedLessonIds(ProgressGuard.mergeIds(user.getCompletedLessonIds(), progressData.getCompletedLessonIds()));
        }
        if (progressData.getBadges() != null) {
            user.setBadges(ProgressGuard.mergeKnownBadges(user.getBadges(), progressData.getBadges()));
        }
        if (progressData.getBadgeUnlockedAt() != null) {
            user.setBadgeUnlockedAt(ProgressGuard.mergeBadgeUnlockTimes(user.getBadgeUnlockedAt(), progressData.getBadgeUnlockedAt()));
        }
        if (progressData.getCompletedExamIds() != null) {
            user.setCompletedExamIds(ProgressGuard.mergeIds(user.getCompletedExamIds(), progressData.getCompletedExamIds()));
        }
        if (progressData.getCompletedChallengeIds() != null) {
            user.setCompletedChallengeIds(ProgressGuard.mergeIds(user.getCompletedChallengeIds(), progressData.getCompletedChallengeIds()));
        }
        if (progressData.getQuizScores() != null) {
            user.setQuizScores(ProgressGuard.mergeQuizScores(user.getQuizScores(), progressData.getQuizScores()));
        }
        if (progressData.getCompetenceStats() != null) {
            user.setCompetenceStats(ProgressGuard.mergeCompetenceStats(user.getCompetenceStats(), progressData.getCompetenceStats()));
        }
        if (progressData.getLessonSessions() != null) {
            user.setLessonSessions(ProgressGuard.mergeLessonSessions(user.getLessonSessions(), progressData.getLessonSessions()));
        }

        List<String> completedLessons = user.getCompletedLessonIds() != null ? user.getCompletedLessonIds() : List.of();
        long mathLessons = completedLessons.stream()
                .filter(lessonId -> lessonId != null && lessonId.toLowerCase().contains("math"))
                .count();

        if (mathLessons >= 3) {
            user.setBadges(ProgressGuard.mergeKnownBadges(user.getBadges(), List.of("b_math_star")));
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
        boolean wasAdmin = Role.RoleName.ROLE_ADMIN.name().equals(oldRoleName);

        // Self-demotion would let an admin lock themselves out of the console mid-session with no
        // one else able to fix it from the UI. Demoting another admin is still allowed.
        if (wasAdmin && roleEnum != Role.RoleName.ROLE_ADMIN
                && user.getEmail() != null && user.getEmail().equalsIgnoreCase(actorEmail)) {
            throw new RuntimeException("لا يمكنك تخفيض صلاحياتك الخاصة. اطلب من مشرف آخر تنفيذ هذا الإجراء.");
        }

        // Same guard against the app losing all admin access at once, this time regardless of who's
        // making the change: refuse to demote the very last ROLE_ADMIN account.
        if (wasAdmin && roleEnum != Role.RoleName.ROLE_ADMIN
                && userRepository.countByRole_Name(Role.RoleName.ROLE_ADMIN) <= 1) {
            throw new RuntimeException("لا يمكن تخفيض هذا الحساب لأنه المشرف (ADMIN) الوحيد المتبقي في النظام.");
        }

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
