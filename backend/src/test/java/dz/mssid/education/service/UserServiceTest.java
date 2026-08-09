package dz.mssid.education.service;

import dz.mssid.education.dto.UserProfileDto;
import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Role freeRole;
    private Role teacherRole;

    @BeforeEach
    void setUp() {
        freeRole = new Role(1L, Role.RoleName.ROLE_FREE);
        teacherRole = new Role(2L, Role.RoleName.ROLE_TEACHER);

        testUser = User.builder()
                .id(1L)
                .nom("Kareem")
                .email("kareem@mssid.dz")
                .role(freeRole)
                .score(100)
                .grade("5AP")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("getUserProfileByEmail - Returns mapped UserProfileDto")
    void getUserProfileByEmail_Success() {
        when(userRepository.findByEmail("kareem@mssid.dz")).thenReturn(Optional.of(testUser));

        UserProfileDto profile = userService.getUserProfileByEmail("kareem@mssid.dz");

        assertNotNull(profile);
        assertEquals("Kareem", profile.getName());
        assertEquals("kareem@mssid.dz", profile.getEmail());
        assertEquals("ROLE_FREE", profile.getRole());
    }

    @Test
    @DisplayName("getAllUsers - Returns list of UserProfileDto")
    void getAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(List.of(testUser));

        List<UserProfileDto> users = userService.getAllUsers();

        assertEquals(1, users.size());
        assertEquals("kareem@mssid.dz", users.get(0).getEmail());
    }

    @Test
    @DisplayName("updateUserRole - Updates role to ROLE_TEACHER successfully")
    void updateUserRole_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByName(Role.RoleName.ROLE_TEACHER)).thenReturn(Optional.of(teacherRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileDto result = userService.updateUserRole(1L, "ROLE_TEACHER");

        assertNotNull(result);
        assertEquals("ROLE_TEACHER", result.getRole());
        verify(userRepository).save(testUser);
    }
}
