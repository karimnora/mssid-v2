-- Key/value overrides for runtime app settings that are not boolean feature flags
-- (e.g. the Play Store versionCode the Android client should treat as current).
CREATE TABLE public.app_settings (
    setting_key   VARCHAR(64) PRIMARY KEY,
    setting_value VARCHAR(64) NOT NULL
);
