package dz.mssid.education.dto;

import dz.mssid.education.entity.ChildProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildProfileDto {
    private Long id;
    private String displayName;
    private String grade;
    private String avatar;
    private LocalDateTime createdAt;
    private Map<String, Object> competenceStats;
    private List<Map<String, Object>> lessonSessions;

    public static ChildProfileDto from(ChildProfile profile) {
        return ChildProfileDto.builder()
                .id(profile.getId())
                .displayName(profile.getDisplayName())
                .grade(profile.getGrade())
                .avatar(profile.getAvatar())
                .createdAt(profile.getCreatedAt())
                .competenceStats(profile.getCompetenceStats())
                .lessonSessions(profile.getLessonSessions())
                .build();
    }
}
