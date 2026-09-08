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
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private AdminAuditLogService adminAuditLogService;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private Role freeRole;
    private Role premiumRole;

    @BeforeEach
    void setUp() {
        freeRole = new Role(1L, Role.RoleName.ROLE_FREE);
        premiumRole = new Role(2L, Role.RoleName.ROLE_PREMIUM);

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
    @DisplayName("updateUserRole - Updates role to ROLE_PREMIUM successfully")
    void updateUserRole_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findByName(Role.RoleName.ROLE_PREMIUM)).thenReturn(Optional.of(premiumRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileDto result = userService.updateUserRole(1L, "ROLE_PREMIUM", "admin@mssid.dz");

        assertNotNull(result);
        assertEquals("ROLE_PREMIUM", result.getRole());
        verify(userRepository).save(testUser);
        verify(adminAuditLogService).record(eq("admin@mssid.dz"), eq("ROLE_CHANGE"), eq("USER"), eq("1"), contains("ROLE_PREMIUM"));
    }

    @Test
    @DisplayName("updateUserRole - Rejects self-demotion of an admin's own account")
    void updateUserRole_RejectsSelfDemotion() {
        Role adminRole = new Role(3L, Role.RoleName.ROLE_ADMIN);
        testUser.setRole(adminRole);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        assertThrows(RuntimeException.class,
                () -> userService.updateUserRole(1L, "ROLE_FREE", "kareem@mssid.dz"));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("updateUserRole - Rejects demoting the last remaining admin, even by another admin")
    void updateUserRole_RejectsDemotingLastAdmin() {
        Role adminRole = new Role(3L, Role.RoleName.ROLE_ADMIN);
        testUser.setRole(adminRole);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.countByRole_Name(Role.RoleName.ROLE_ADMIN)).thenReturn(1L);

        assertThrows(RuntimeException.class,
                () -> userService.updateUserRole(1L, "ROLE_FREE", "another-admin@mssid.dz"));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("updateUserRole - Allows demoting an admin when another admin remains")
    void updateUserRole_AllowsDemotingAdminWhenAnotherAdminRemains() {
        Role adminRole = new Role(3L, Role.RoleName.ROLE_ADMIN);
        testUser.setRole(adminRole);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.countByRole_Name(Role.RoleName.ROLE_ADMIN)).thenReturn(2L);
        when(roleRepository.findByName(Role.RoleName.ROLE_FREE)).thenReturn(Optional.of(freeRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileDto result = userService.updateUserRole(1L, "ROLE_FREE", "another-admin@mssid.dz");

        assertEquals("ROLE_FREE", result.getRole());
    }

    @Test
    @DisplayName("updateUserProgress - Merges badges/exams/challenges without dropping existing ones")
    void updateUserProgress_MergesNewFieldsAdditively() {
        testUser.setBadges(new java.util.ArrayList<>(List.of("b_welcome")));
        testUser.setBadgeUnlockedAt(new java.util.HashMap<>(Map.of("b_welcome", "2026-01-01T00:00:00Z")));
        testUser.setCompletedExamIds(new java.util.ArrayList<>(List.of("exam-2018-trim1-math")));
        testUser.setCompletedChallengeIds(new java.util.ArrayList<>());

        when(userRepository.findByEmail("kareem@mssid.dz")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileDto incoming = UserProfileDto.builder()
                .badges(List.of("b_welcome", "b_streak_flame"))
                .badgeUnlockedAt(Map.of("b_welcome", "SHOULD_NOT_OVERWRITE", "b_streak_flame", "2026-02-01T00:00:00Z"))
                .completedExamIds(List.of("exam-5ap-math-t1-2026"))
                .completedChallengeIds(List.of("challenge-math-large-numbers"))
                .build();

        UserProfileDto result = userService.updateUserProgress("kareem@mssid.dz", incoming);

        assertEquals(List.of("b_welcome", "b_streak_flame"), result.getBadges());
        assertEquals("2026-01-01T00:00:00Z", result.getBadgeUnlockedAt().get("b_welcome"));
        assertEquals("2026-02-01T00:00:00Z", result.getBadgeUnlockedAt().get("b_streak_flame"));
        assertEquals(List.of("exam-2018-trim1-math", "exam-5ap-math-t1-2026"), result.getCompletedExamIds());
        assertEquals(List.of("challenge-math-large-numbers"), result.getCompletedChallengeIds());
    }

    @Test
    @DisplayName("updateUserProgress - Overwrites goldCoins/avatarConfig (not merged, unlike badges/exams)")
    void updateUserProgress_OverwritesGoldCoinsAndAvatarConfig() {
        testUser.setGoldCoins(150);
        when(userRepository.findByEmail("kareem@mssid.dz")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Map<String, Object> newAvatarConfig = Map.of(
                "activeOutfit", "burnous_traditionnel",
                "unlockedOutfits", List.of("default", "burnous_traditionnel"),
                "mood", "celebrating"
        );
        UserProfileDto incoming = UserProfileDto.builder()
                .goldCoins(95)
                .avatarConfig(newAvatarConfig)
                .build();

        UserProfileDto result = userService.updateUserProgress("kareem@mssid.dz", incoming);

        assertEquals(95, result.getGoldCoins());
        assertEquals(newAvatarConfig, result.getAvatarConfig());
    }

    @Test
    @DisplayName("updateUserProgress - Leaves goldCoins/avatarConfig untouched when absent from the payload")
    void updateUserProgress_LeavesGoldCoinsUntouchedWhenAbsent() {
        testUser.setGoldCoins(300);
        when(userRepository.findByEmail("kareem@mssid.dz")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileDto incoming = UserProfileDto.builder().nom("Kareem Updated").build();

        UserProfileDto result = userService.updateUserProgress("kareem@mssid.dz", incoming);

        assertEquals(300, result.getGoldCoins());
    }

    @Test
    @DisplayName("SEC-11: a huge XP dump is capped per sync and level is derived from XP, not the payload")
    void updateUserProgress_CapsXpAndDerivesLevel() {
        testUser.setXp(100);
        testUser.setLevel(2);
        testUser.setScore(100);
        when(userRepository.findByEmail("kareem@mssid.dz")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileDto incoming = UserProfileDto.builder()
                .xp(999_999)
                .level(999)
                .build();

        UserProfileDto result = userService.updateUserProgress("kareem@mssid.dz", incoming);

        assertEquals(100 + ProgressGuard.MAX_XP_GAIN_PER_SYNC, result.getXp());
        assertEquals(result.getXp(), result.getScore());
        assertEquals(ProgressGuard.levelFromXp(result.getXp()), result.getLevel());
        assertNotEquals(999, result.getLevel());
    }

    @Test
    @DisplayName("SEC-11: unknown badges are dropped; catalog badges still merge")
    void updateUserProgress_DropsUnknownBadges() {
        testUser.setBadges(new java.util.ArrayList<>(List.of("b_welcome")));
        when(userRepository.findByEmail("kareem@mssid.dz")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileDto incoming = UserProfileDto.builder()
                .badges(List.of("b_hacker", "b_math_star"))
                .build();

        UserProfileDto result = userService.updateUserProgress("kareem@mssid.dz", incoming);

        assertEquals(List.of("b_welcome", "b_math_star"), result.getBadges());
    }

    @Test
    @DisplayName("SEC-11: gold cannot jump by more than MAX_GOLD_GAIN_PER_SYNC")
    void updateUserProgress_CapsGoldGain() {
        testUser.setGoldCoins(150);
        when(userRepository.findByEmail("kareem@mssid.dz")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileDto incoming = UserProfileDto.builder().goldCoins(50_000).build();

        UserProfileDto result = userService.updateUserProgress("kareem@mssid.dz", incoming);

        assertEquals(150 + ProgressGuard.MAX_GOLD_GAIN_PER_SYNC, result.getGoldCoins());
    }
}
