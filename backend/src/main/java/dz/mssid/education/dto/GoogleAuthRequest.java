package dz.mssid.education.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleAuthRequest {
    @NotBlank(message = "Le jeton Google est obligatoire")
    private String idToken;
}
