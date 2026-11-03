package dz.mssid.education.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String nom;
    private String name;

    @Email(message = "Le format de l'e-mail est invalide")
    private String email;
    private String role;
    private Integer score;
    private String grade; // "1AP" ... "5AP"
    /** False when no grade was ever chosen (grade above then shows the legacy "5AP" fallback). Read-only. */
    private Boolean gradeSet;
    /** Whether a parent e-mail is on file; the address itself is never sent back. Read-only. */
    private Boolean parentEmailSet;
    private String wilaya;
    private String avatar;
    private Integer xp;
    private Integer level;
    private Integer streakDays;
    private Integer quizzesCompleted;
    private String lastActiveDate;
    private List<String> completedLessonIds;
    private List<String> badges;
    private Map<String, String> badgeUnlockedAt;
    private List<String> completedExamIds;
    private List<String> completedChallengeIds;
    private Map<String, Integer> quizScores;
    private String createdAt;
    private Boolean emailVerified;
    private Integer goldCoins;
    private Map<String, Object> avatarConfig;
    private Map<String, Object> competenceStats;
    private List<Map<String, Object>> lessonSessions;
}