package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class ParentNotificationServiceTest {

    @Mock
    private ResendEmailService resendEmailService;

    private ParentNotificationService parentNotificationService;
    private User testUser;

    @BeforeEach
    void setUp() {
        parentNotificationService = new ParentNotificationService(resendEmailService);
        testUser = User.builder()
                .id(1L)
                .nom("Omar Testeur")
                .email("omar@mssid.dz")
                .passwordHash("encoded")
                .role(new Role(1L, Role.RoleName.ROLE_FREE))
                .grade("3AP")
                .parentEmail("parent@example.dz")
                .build();
    }

    @Test
    @DisplayName("sendAccountCreatedNotice - emails the parent with the child's name and grade")
    void sendAccountCreatedNotice_withParentEmail_sendsEmail() {
        parentNotificationService.sendAccountCreatedNotice(testUser);

        verify(resendEmailService).sendHtmlEmail(eq("parent@example.dz"), anyString(),
                argThat(html -> html.contains("Omar Testeur") && html.contains("3AP")));
    }

    @Test
    @DisplayName("sendAccountCreatedNotice - no-ops when no parent email was supplied")
    void sendAccountCreatedNotice_noParentEmail_noOps() {
        testUser.setParentEmail(null);

        parentNotificationService.sendAccountCreatedNotice(testUser);

        verifyNoInteractions(resendEmailService);
    }

    @Test
    @DisplayName("sendAccountCreatedNotice - no-ops when the parent email is blank")
    void sendAccountCreatedNotice_blankParentEmail_noOps() {
        testUser.setParentEmail("   ");

        parentNotificationService.sendAccountCreatedNotice(testUser);

        verifyNoInteractions(resendEmailService);
    }
}
