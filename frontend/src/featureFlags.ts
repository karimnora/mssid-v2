export const featureFlags = {
  payment: false,
  tamazight: false,
  aiAssistant: true,
  advancedLabs: true,
  voiceReading: true,
  educationalCalculator: true,
  writingLab: true,
  interactiveVideo: true,
  pwa: false,
} as const;

export type FeatureFlagName = keyof typeof featureFlags;

export const isFeatureEnabled = (flag: FeatureFlagName): boolean => {
  return featureFlags[flag];
};
