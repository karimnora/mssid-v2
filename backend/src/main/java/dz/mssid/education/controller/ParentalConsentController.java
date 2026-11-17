package dz.mssid.education.controller;

import dz.mssid.education.dto.ParentalConsentRequest;
import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.mapper.UserMapper;
import dz.mssid.education.service.ParentalConsentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
public class ParentalConsentController {
    private final ParentalConsentService consent;

    @PostMapping("/api/v1/auth/parental-consent")
    public ResponseEntity<UserProfileDto> accept(@AuthenticationPrincipal UserDetails principal, @RequestBody ParentalConsentRequest request) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        try {
            return ResponseEntity.ok(UserMapper.toUserProfileDto(consent.accept(principal.getUsername(), request.parentalConsentAccepted(), request.parentalConsentVersion())));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).build();
        }
    }
}
