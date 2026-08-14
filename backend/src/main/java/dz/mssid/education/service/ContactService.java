package dz.mssid.education.service;

import dz.mssid.education.dto.ContactMessageRequest;
import dz.mssid.education.entity.ContactMessage;
import dz.mssid.education.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ContactService {

    private static final Set<String> VALID_TYPES = Set.of("suggestion", "bug", "concern");

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessage submit(ContactMessageRequest request) {
        String type = request.getType() != null && VALID_TYPES.contains(request.getType().toLowerCase())
                ? request.getType().toLowerCase()
                : "suggestion";

        ContactMessage saved = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .type(type)
                .message(request.getMessage())
                .build();

        return contactMessageRepository.save(saved);
    }
}
