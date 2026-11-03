package dz.mssid.education.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Parent e-mail collected by the V2 first-launch screen (Google sign-ups never see the register form). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParentEmailRequest {
    @NotBlank(message = "L'e-mail du parent est obligatoire")
    @Email(message = "Le format de l'e-mail est invalide")
    @Size(max = 254, message = "E-mail trop long")
    private String parentEmail;
}
