package dz.mssid.education.service;

import dz.mssid.education.dto.ChildProfileDto;
import dz.mssid.education.dto.ChildProfileRequest;
import dz.mssid.education.entity.ChildProfile;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.ChildProfileRepository;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChildProfileServiceTest {

    private static final String EMAIL = "parent@mssid.dz";

    @Mock
    private ChildProfileRepository childProfileRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ChildProfileService service;

    private static ChildProfileRequest request(String name, String grade, String avatar) {
        return ChildProfileRequest.builder().displayName(name).grade(grade).avatar(avatar).build();
    }

    @Test
    @DisplayName("create stores a cleaned name, the grade and the avatar for the connected account")
    void create_success() {
        User parent = User.builder().id(1L).email(EMAIL).build();
        when(childProfileRepository.countByUserEmail(EMAIL)).thenReturn(0L);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(parent));
        when(childProfileRepository.save(any(ChildProfile.class))).thenAnswer(inv -> {
            ChildProfile saved = inv.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        ChildProfileDto dto = service.create(EMAIL, request("  يوسف   أمين ", "2AP", " 🦊 "));

        ArgumentCaptor<ChildProfile> captor = ArgumentCaptor.forClass(ChildProfile.class);
        verify(childProfileRepository).save(captor.capture());
        assertThat(captor.getValue().getUser()).isSameAs(parent);
        assertThat(dto.getId()).isEqualTo(10L);
        assertThat(dto.getDisplayName()).isEqualTo("يوسف أمين");
        assertThat(dto.getGrade()).isEqualTo("2AP");
        assertThat(dto.getAvatar()).isEqualTo("🦊");
    }

    @Test
    @DisplayName("create accepts the preschool grade and a missing avatar")
    void create_preschoolWithoutAvatar() {
        when(childProfileRepository.countByUserEmail(EMAIL)).thenReturn(1L);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(User.builder().email(EMAIL).build()));
        when(childProfileRepository.save(any(ChildProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        ChildProfileDto dto = service.create(EMAIL, request("Lina", ChildProfileService.PRESCHOOL_GRADE, "  "));

        assertThat(dto.getGrade()).isEqualTo("PRESCHOOL");
        assertThat(dto.getAvatar()).isNull();
    }

    @Test
    @DisplayName("create refuses a seventh profile")
    void create_limitReached() {
        when(childProfileRepository.countByUserEmail(EMAIL)).thenReturn((long) ChildProfileService.MAX_PROFILES_PER_ACCOUNT);

        assertThatThrownBy(() -> service.create(EMAIL, request("Sami", "1AP", null)))
                .isExactlyInstanceOf(RuntimeException.class)
                .hasMessageContaining("Nombre maximal");
        verify(childProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("create refuses an unknown grade and a blank name")
    void create_invalidInput() {
        when(childProfileRepository.countByUserEmail(EMAIL)).thenReturn(0L);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(User.builder().email(EMAIL).build()));

        assertThatThrownBy(() -> service.create(EMAIL, request("Sami", "6AP", null)))
                .hasMessage("Niveau invalide");
        assertThatThrownBy(() -> service.create(EMAIL, request("   ", "1AP", null)))
                .hasMessage("Le prénom est obligatoire");
        verify(childProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("update and delete only reach profiles of the connected account")
    void updateAndDelete_otherAccount() {
        when(childProfileRepository.findByIdAndUserEmail(5L, EMAIL)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(EMAIL, 5L, request("Sami", "1AP", null)))
                .hasMessage("Profil introuvable");
        assertThatThrownBy(() -> service.delete(EMAIL, 5L))
                .hasMessage("Profil introuvable");
        verify(childProfileRepository, never()).save(any());
        verify(childProfileRepository, never()).delete(any());
    }

    @Test
    @DisplayName("update changes name, grade and avatar of an owned profile")
    void update_success() {
        ChildProfile existing = ChildProfile.builder().id(5L).displayName("Sami").grade("1AP").build();
        when(childProfileRepository.findByIdAndUserEmail(5L, EMAIL)).thenReturn(Optional.of(existing));
        when(childProfileRepository.save(existing)).thenReturn(existing);

        ChildProfileDto dto = service.update(EMAIL, 5L, request("Sami", "2AP", "🐼"));

        assertThat(dto.getGrade()).isEqualTo("2AP");
        assertThat(dto.getAvatar()).isEqualTo("🐼");
    }
}
