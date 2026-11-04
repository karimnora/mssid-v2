export type FeatureFlagName =
  | 'enablePayments'
  | 'tamazight'
  | 'enableAITutor'
  | 'advancedLabs'
  | 'voiceReading'
  | 'educationalCalculator'
  | 'writingLab'
  | 'enablePrintablePDFs'
  | 'enableTrimesterPaywall'
  /** When enabled by an administrator, expose only lessons explicitly verified against the curriculum. */
  | 'curriculumReviewGate'
  /** Parent recap in Mode Éveil. Off in prod until the bilan is safe to ship. */
  | 'preschoolParentBilan'
  /** V2 « Kawkab Didou » planet hub + journey map (docs/v2-carte-didou.md). */
  | 'didouJourney'
  /** V2 « خطوتان للبدء » first-steps screen: grade + parent e-mail (docs/v2-todo-business.md, plan d'activation). */
  | 'firstSteps'
  /** V2 « monde de jeu » design on child screens (night sky, glossy buttons, Didou ribbon). */
  | 'worldDesign'
  /** V2 J-15 banner before the trimester compositions, opening the 10-day plan. Admin turns it on. */
  | 'examCountdown';

const DEFAULT_FLAGS: Record<FeatureFlagName, boolean> = {
  // Off: payments are not collectable. V2 sells modules (carnet depth, cahiers, CEM), not T2/T3.
  // See V2_ACCESS in trimesterAccess.ts. Do not flip enableTrimesterPaywall for the paid beta.
  enablePayments: false,
  // ON so the Amazigh course + tamazight_lab + tamazight_curriculum appear in the hub.
  // Admin can still hide them from the Feature Flags tab (override to false).
  tamazight: true,
  enableAITutor: true,
  advancedLabs: true,
  voiceReading: true,
  educationalCalculator: true,
  writingLab: true,
  enablePrintablePDFs: true,
  // Must stay off for V2: shipped T2/T3 remain free. Premium is new modules, not a trimester lock.
  enableTrimesterPaywall: false,
  // Kept off while the catalog is reviewed. Before a production release an administrator can turn
  // it on to prevent unverified or complementary content from being presented as school content.
  curriculumReviewGate: false,
  // Off until the parent bilan (login + one-child recap) is ready for families.
  preschoolParentBilan: false,
  // V2 only (this branch never ships to the V1 prod app). Admin can hide it from the Feature Flags tab.
  didouJourney: true,
  firstSteps: true,
  worldDesign: true,
  // Off by default: the admin turns it on from the Feature Flags tab for the composition season.
  examCountdown: false,
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
