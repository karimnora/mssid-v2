package dz.mssid.education.service;

import dz.mssid.education.dto.AndroidReleaseResponse;
import dz.mssid.education.entity.AppSetting;
import dz.mssid.education.repository.AppSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tells installed Android builds whether Play has a newer package. Defaults come from
 * {@code app.android.*} so a fresh database never invents an update; admins can raise the numbers
 * after Play accepts an AAB, without a backend redeploy.
 */
@Service
@RequiredArgsConstructor
public class AndroidReleaseService {

    public static final String LATEST_KEY = "android.latestVersionCode";
    public static final String MIN_KEY = "android.minVersionCode";

    private final AppSettingRepository appSettingRepository;
    private final AdminAuditLogService adminAuditLogService;

    @Value("${app.android.latest-version-code:8}")
    private int defaultLatestVersionCode = 8;

    @Value("${app.android.min-version-code:0}")
    private int defaultMinVersionCode = 0;

    public AndroidReleaseResponse getRelease() {
        return new AndroidReleaseResponse(
                readInt(LATEST_KEY, defaultLatestVersionCode),
                readInt(MIN_KEY, defaultMinVersionCode)
        );
    }

    @Transactional
    public AndroidReleaseResponse update(Integer latestVersionCode, Integer minVersionCode, String actorEmail) {
        if (latestVersionCode != null) {
            if (latestVersionCode < 1) {
                throw new IllegalArgumentException("latestVersionCode must be >= 1");
            }
            upsert(LATEST_KEY, latestVersionCode);
        }
        if (minVersionCode != null) {
            if (minVersionCode < 0) {
                throw new IllegalArgumentException("minVersionCode must be >= 0");
            }
            upsert(MIN_KEY, minVersionCode);
        }
        AndroidReleaseResponse next = getRelease();
        adminAuditLogService.record(
                actorEmail,
                "ANDROID_RELEASE_CHANGED",
                "APP_SETTING",
                "android-release",
                "latest=" + next.getLatestVersionCode() + ",min=" + next.getMinVersionCode()
        );
        return next;
    }

    private int readInt(String key, int fallback) {
        return appSettingRepository.findById(key)
                .map(AppSetting::getSettingValue)
                .map(value -> {
                    try {
                        return Integer.parseInt(value.trim());
                    } catch (NumberFormatException ignored) {
                        return fallback;
                    }
                })
                .orElse(fallback);
    }

    private void upsert(String key, int value) {
        AppSetting row = appSettingRepository.findById(key)
                .orElseGet(() -> AppSetting.builder().settingKey(key).build());
        row.setSettingValue(Integer.toString(value));
        appSettingRepository.save(row);
    }
}
