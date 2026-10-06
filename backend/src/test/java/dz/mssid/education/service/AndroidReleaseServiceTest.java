package dz.mssid.education.service;

import dz.mssid.education.dto.AndroidReleaseResponse;
import dz.mssid.education.entity.AppSetting;
import dz.mssid.education.repository.AppSettingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AndroidReleaseServiceTest {

    @Mock
    private AppSettingRepository appSettingRepository;

    @Mock
    private AdminAuditLogService adminAuditLogService;

    @InjectMocks
    private AndroidReleaseService androidReleaseService;

    @Test
    @DisplayName("getRelease - uses code defaults when no rows exist")
    void getRelease_defaultsWhenMissing() {
        when(appSettingRepository.findById(AndroidReleaseService.LATEST_KEY)).thenReturn(Optional.empty());
        when(appSettingRepository.findById(AndroidReleaseService.MIN_KEY)).thenReturn(Optional.empty());

        AndroidReleaseResponse result = androidReleaseService.getRelease();

        assertEquals(8, result.getLatestVersionCode());
        assertEquals(0, result.getMinVersionCode());
    }

    @Test
    @DisplayName("getRelease - prefers persisted overrides")
    void getRelease_usesPersistedOverrides() {
        when(appSettingRepository.findById(AndroidReleaseService.LATEST_KEY))
                .thenReturn(Optional.of(AppSetting.builder().settingKey(AndroidReleaseService.LATEST_KEY).settingValue("10").build()));
        when(appSettingRepository.findById(AndroidReleaseService.MIN_KEY))
                .thenReturn(Optional.of(AppSetting.builder().settingKey(AndroidReleaseService.MIN_KEY).settingValue("9").build()));

        AndroidReleaseResponse result = androidReleaseService.getRelease();

        assertEquals(10, result.getLatestVersionCode());
        assertEquals(9, result.getMinVersionCode());
    }

    @Test
    @DisplayName("update - stores latestVersionCode and writes an audit row")
    void update_persistsLatestAndAudits() {
        java.util.Map<String, AppSetting> store = new java.util.HashMap<>();
        when(appSettingRepository.findById(org.mockito.ArgumentMatchers.anyString()))
                .thenAnswer(invocation -> java.util.Optional.ofNullable(store.get(invocation.getArgument(0))));
        when(appSettingRepository.save(any(AppSetting.class))).thenAnswer(invocation -> {
            AppSetting row = invocation.getArgument(0);
            store.put(row.getSettingKey(), row);
            return row;
        });

        AndroidReleaseResponse result = androidReleaseService.update(11, null, "admin@mssid.dz");

        assertEquals(11, result.getLatestVersionCode());
        assertEquals(0, result.getMinVersionCode());
        verify(adminAuditLogService).record(eq("admin@mssid.dz"), eq("ANDROID_RELEASE_CHANGED"), eq("APP_SETTING"), eq("android-release"), anyString());
    }

    @Test
    @DisplayName("update - rejects a latestVersionCode below 1")
    void update_rejectsInvalidLatest() {
        assertThrows(IllegalArgumentException.class, () -> androidReleaseService.update(0, null, "admin@mssid.dz"));
    }
}
