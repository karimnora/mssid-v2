package dz.mssid.education.controller;

import dz.mssid.education.dto.ContactMessageRequest;
import dz.mssid.education.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /**
     * "Nous contacter / Suggestions" — public (a parent/guest with no account can still send
     * feedback), the name/email fields are simply what the sender typed, not an authenticated identity.
     */
    @PostMapping("/api/v1/contact")
    public ResponseEntity<?> submitContact(@RequestBody ContactMessageRequest request) {
        if (request.getName() == null || request.getName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "الاسم والبريد الإلكتروني والرسالة حقول إلزامية"));
        }
        contactService.submit(request);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
