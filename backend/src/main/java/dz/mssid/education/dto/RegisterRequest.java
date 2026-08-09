package dz.mssid.education.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "L'e-mail est obligatoire")
    @Email(message = "Le format de l'e-mail est invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
}