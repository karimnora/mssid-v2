package dz.mssid.education.dto;

import dz.mssid.education.entity.ChildProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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

    public static ChildProfileDto from(ChildProfile profile) {
        return ChildProfileDto.builder()
                .id(profile.getId())
                .displayName(profile.getDisplayName())
                .grade(profile.getGrade())
                .avatar(profile.getAvatar())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
