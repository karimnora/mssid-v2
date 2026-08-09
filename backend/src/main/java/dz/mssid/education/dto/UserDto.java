package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String nom;
    private String email;
    private String role;
    private Integer score;
    private LocalDateTime createdAt;
}