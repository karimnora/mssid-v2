export type FeatureFlagName =
  | 'SHOW_ADS'
  | 'enablePayments'
  | 'tamazight'
  | 'enableAITutor'
  | 'advancedLabs'
  | 'voiceReading'
  | 'educationalCalculator'
  | 'writingLab'
  | 'interactiveVideo'
  | 'pwa'
  | 'enablePreschoolModule'
  | 'enablePrintablePDFs'
  | 'enableExamSection';

const DEFAULT_FLAGS: Record<FeatureFlagName, boolean> = {
  SHOW_ADS: true,
  enablePayments: true,
  tamazight: false,
  enableAITutor: true,
  advancedLabs: true,
  voiceReading: true,
  educationalCalculator: true,
  writingLab: true,
  interactiveVideo: true,
  pwa: false,
  enablePreschoolModule: true,
  enablePrintablePDFs: true,
  enableExamSection: true,
};

const OVERRIDES_STORAGE_KEY = 'mssid_feature_flag_overrides';

function loadOverrides(): Partial<Record<FeatureFlagName, boolean>> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = window.localStorage.getItem(OVERRIDES_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Partial<Record<FeatureFlagName, boolean>>) : {};
  } catch {
    return {};
  }
}

let overrides: Partial<Record<FeatureFlagName, boolean>> = loadOverrides();
let currentFlags: Record<FeatureFlagName, boolean> = { ...DEFAULT_FLAGS, ...overrides };

type Listener = () => void;
const listeners = new Set<Listener>();

function persistAndRecompute() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  }
  currentFlags = { ...DEFAULT_FLAGS, ...overrides };
  listeners.forEach((listener) => listener());
}

// Centralized runtime feature flags. `DEFAULT_FLAGS` are the code-level defaults; the CMS
// "⚙️ Configuration & Feature Flags" tab writes per-flag overrides into localStorage via
// setFeatureFlagOverride, so a toggle takes effect instantly across the whole app with no redeploy.
export const getFeatureFlags = (): Record<FeatureFlagName, boolean> => currentFlags;

export const isFeatureEnabled = (flag: FeatureFlagName): boolean => currentFlags[flag];

export const isFlagOverridden = (flag: FeatureFlagName): boolean => flag in overrides;

export const setFeatureFlagOverride = (flag: FeatureFlagName, value: boolean): void => {
  overrides = { ...overrides, [flag]: value };
  persistAndRecompute();
};

export const resetFeatureFlagOverride = (flag: FeatureFlagName): void => {
  const next = { ...overrides };
  delete next[flag];
  overrides = next;
  persistAndRecompute();
};

export const subscribeFeatureFlags = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const DEFAULT_FEATURE_FLAGS = DEFAULT_FLAGS;
