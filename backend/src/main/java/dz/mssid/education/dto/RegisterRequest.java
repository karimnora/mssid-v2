package dz.mssid.education.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "L'e-mail est obligatoire")
    @Email(message = "Le format de l'e-mail est invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String password;

    // Optional: the level (1AP..5AP) the student picks during registration, kept as their default
    // going forward — see UserMapper/GradeSelector on the frontend. Free-text on purpose, same as
    // User.grade/CmsCourse.grade elsewhere, so adding non-primaire levels later needs no migration.
    private String grade;

    // Optional minimal parental supervision (product decision, pre-launch audit) — no verification,
    // never blocks registration. @Email only validates the format when a value is actually supplied.
    @Email(message = "Le format de l'e-mail du parent est invalide")
    private String parentEmail;
}