package dz.mssid.education.service;

import dz.mssid.education.dto.ContactMessageRequest;
import dz.mssid.education.entity.ContactMessage;
import dz.mssid.education.repository.ContactMessageRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactMessageRepository contactMessageRepository;

    @InjectMocks
    private ContactService contactService;

    @Test
    @DisplayName("submit - Saves the message with a normalized lowercase type")
    void submit_SavesWithNormalizedType() {
        ContactMessageRequest request = new ContactMessageRequest();
        request.setName("Yassine");
        request.setEmail("yassine@mssid.dz");
        request.setType("BUG");
        request.setMessage("زر الاختبار لا يعمل على الهاتف");

        when(contactMessageRepository.save(org.mockito.ArgumentMatchers.any(ContactMessage.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        contactService.submit(request);

        ArgumentCaptor<ContactMessage> captor = ArgumentCaptor.forClass(ContactMessage.class);
        verify(contactMessageRepository).save(captor.capture());
        assertEquals("Yassine", captor.getValue().getName());
        assertEquals("bug", captor.getValue().getType());
    }

    @Test
    @DisplayName("submit - Falls back to 'suggestion' for a missing/invalid type")
    void submit_FallsBackToSuggestionForInvalidType() {
        ContactMessageRequest request = new ContactMessageRequest();
        request.setName("Amine");
        request.setEmail("amine@mssid.dz");
        request.setType("not-a-real-type");
        request.setMessage("فكرة لتحسين التطبيق");

        when(contactMessageRepository.save(org.mockito.ArgumentMatchers.any(ContactMessage.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        contactService.submit(request);

        ArgumentCaptor<ContactMessage> captor = ArgumentCaptor.forClass(ContactMessage.class);
        verify(contactMessageRepository).save(captor.capture());
        assertEquals("suggestion", captor.getValue().getType());
    }
}
