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

    // Set only by loginWithGoogle(), for a brand-new account it just created (never by register()/
    // login()). Google gives no grade/wilaya, and UserMapper always fills a "5AP" default in `user`
    // for display purposes elsewhere — so this is the only signal the frontend has that those fields
    // are genuinely unset in the DB and worth asking the user to confirm/complete once.
    @Builder.Default
    private boolean profileIncomplete = false;
}
