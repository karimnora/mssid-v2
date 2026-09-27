package dz.mssid.education.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildProfileRequest {
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 40, message = "Le prénom ne doit pas dépasser 40 caractères")
    private String displayName;

    @NotBlank(message = "Le niveau est obligatoire")
    private String grade;

    @Size(max = 16, message = "Avatar invalide")
    private String avatar;
}
