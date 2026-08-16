package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String accessToken;
    // SEC-06: raw refresh token, populated only long enough for AuthController to move it into an
    // HttpOnly cookie — stripped before the DTO is serialized to the client, same as token/accessToken.
    private String refreshToken;
    private String email;
    private String nom;
    private String roleName;
    private String role;
    private UserProfileDto user;
}
