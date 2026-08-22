export type FeatureFlagName =
  | 'enablePayments'
  | 'tamazight'
  | 'enableAITutor'
  | 'advancedLabs'
  | 'voiceReading'
  | 'educationalCalculator'
  | 'writingLab'
  | 'enablePrintablePDFs'
  | 'enableTrimesterPaywall';

const DEFAULT_FLAGS: Record<FeatureFlagName, boolean> = {
  // Off at launch: ship a fully free app first, flip on (via the admin Feature Flags tab) once
  // ready to introduce payments — this is the master kill-switch, enableTrimesterPaywall below is
  // the specific T2/T3 lock and stays subordinate to this one either way (see trimesterAccess.ts).
  enablePayments: false,
  tamazight: false,
  enableAITutor: true,
  advancedLabs: true,
  voiceReading: true,
  educationalCalculator: true,
  writingLab: true,
  enablePrintablePDFs: true,
  // Off by default: T2/T3 stay fully open during the content-review/testing phase before launch.
  // Flip to true (via the admin CMS Config tab) once the paid subscription is ready to enforce.
  enableTrimesterPaywall: false,
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

/**
 * Read-only hydration from the server's persisted flag overrides (GET /api/v1/feature-flags),
 * called once per app boot from AuthContext for every visitor. Server values win over whatever is
 * already in localStorage for any key present in both, so a toggle made by an admin on another
 * device/browser reaches this one on next load — but this function itself never writes back to the
 * server (that's setFeatureFlagOverride's job, wired to the PUT/DELETE admin endpoints separately).
 */
export const hydrateFromServerOverrides = (
  serverOverrides: Partial<Record<FeatureFlagName, boolean>>
): void => {
  overrides = { ...overrides, ...serverOverrides };
  persistAndRecompute();
};

export const DEFAULT_FEATURE_FLAGS = DEFAULT_FLAGS;
