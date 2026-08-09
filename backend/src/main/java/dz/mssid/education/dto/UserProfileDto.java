package dz.mssid.education.dto;

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
    private String email;
    private String role;
    private Integer score;
    private String grade; // "1AP" ... "5AP"
    private String avatar;
    private Integer xp;
    private Integer level;
    private Integer streakDays;
    private Integer quizzesCompleted;
    private String lastActiveDate;
    private List<String> completedLessonIds;
    private List<String> badges;
    private Map<String, Integer> quizScores;
    private String createdAt;
}