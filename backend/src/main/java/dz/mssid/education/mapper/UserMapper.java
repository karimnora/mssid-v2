package dz.mssid.education.mapper;

import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.entity.User;

public class UserMapper {

    public static UserProfileDto toUserProfileDto(User user) {
        if (user == null) return null;

        String roleStr = user.getRole() != null && user.getRole().getName() != null
                ? user.getRole().getName().name()
                : "ROLE_FREE";

        return UserProfileDto.builder()
                .id(user.getId())
                .nom(user.getNom())
                .name(user.getNom())
                .email(user.getEmail())
                .role(roleStr)
                .score(user.getScore() != null ? user.getScore() : 0)
                .grade(user.getGrade() != null ? user.getGrade() : "5AP")
                .avatar(user.getAvatar() != null ? user.getAvatar() : "default_avatar")
                .xp(user.getXp() != null ? user.getXp() : 0)
                .level(user.getLevel() != null ? user.getLevel() : 1)
                .streakDays(user.getStreakDays() != null ? user.getStreakDays() : 0)
                .quizzesCompleted(user.getQuizScores() != null ? user.getQuizScores().size() : 0)
                .lastActiveDate(user.getLastActiveDate())
                .completedLessonIds(user.getCompletedLessonIds())
                .badges(user.getBadges())
                .badgeUnlockedAt(user.getBadgeUnlockedAt())
                .completedExamIds(user.getCompletedExamIds())
                .completedChallengeIds(user.getCompletedChallengeIds())
                .quizScores(user.getQuizScores())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build();
    }
}
