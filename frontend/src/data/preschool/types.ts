// Mode Éveil / Préscolaire (3-5 ans) — data types.
//
// Deliberately isolated from ../../types (CourseLesson / PrimaryGrade / SubjectId): this age band
// has a completely different interaction model (tap/drag/trace, no reading, no quiz), so forcing it
// into the primary-school lesson shape would either corrupt that shape or require awkward optional
// fields nobody else needs. Nothing here is imported by, or imports from, the 1AP-5AP course data.

export type PreschoolDomain = 'numbers' | 'letters' | 'colors' | 'shapes' | 'animals';

export type PreschoolLanguage = 'ar' | 'fr' | 'en';

export type PreschoolInteractionType =
  | 'tap_choice' // Tap the correct image / numeral among a few big choices
  | 'drag_drop'  // Drag objects into a drop zone (counting)
  | 'trace';     // Trace a numeral/shape with a finger (wide tolerance, never blocks)

export interface LocalizedContent {
  title: string;
  /**
   * MVP note: holds the literal phrase spoken aloud, fed to the Web Speech API TTS voice for the
   * activity's language (see usePreschoolSpeech). No recorded voice-over assets exist yet — once a
   * professional voice-over is produced per language, swap this for an asset URL and update
   * usePreschoolSpeech to play it instead of synthesizing; the field name/shape doesn't need to change.
   */
  promptAudio: string;
  /** Optional caption shown to the accompanying parent/adult — never required reading for the child. */
  promptText?: string;
  /** Short celebratory phrase spoken on success (same MVP convention as promptAudio). */
  successAudio?: string;
}

export interface PreschoolChoice {
  id: string;
  /** Emoji or short glyph — no image asset pipeline in the MVP. */
  asset: string;
  isCorrect: boolean;
}

export interface PreschoolDragItem {
  id: string;
  asset: string;
}

export interface PreschoolVisualAssets {
  /** Big emoji/glyph representing the activity itself (the numeral, or a counted group). */
  mainSvgOrImage: string;
  choices?: PreschoolChoice[];
  dragItems?: PreschoolDragItem[];
  /** For drag_drop: how many items must land in the drop zone to succeed. */
  dropZoneCount?: number;
  /** Reserved for a future real SVG reference path; the MVP renders `mainSvgOrImage` as a big traceable glyph instead. */
  tracePathSvg?: string;
}

export interface PreschoolActivity {
  id: string;
  domain: PreschoolDomain;
  /** e.g. 3, or 'أ' for a letter module (not used yet, reserved for future domains). */
  targetValue: string | number;
  /** Position on the module's path, 1-based. */
  stepNumber: number;
  interactionType: PreschoolInteractionType;
  /** Localized content per language — every activity must supply all 3. */
  i18n: Record<PreschoolLanguage, LocalizedContent>;
  visualAssets: PreschoolVisualAssets;
}

export interface PreschoolModule {
  id: string;
  domain: PreschoolDomain;
  titleI18n: Record<PreschoolLanguage, string>;
  icon: string;
  totalSteps: number;
  activities: PreschoolActivity[];
}

export const PRESCHOOL_LANGUAGE_LABELS: Record<PreschoolLanguage, { nativeLabel: string; flag: string; dir: 'rtl' | 'ltr' }> = {
  ar: { nativeLabel: 'العربية', flag: '🇩🇿', dir: 'rtl' },
  fr: { nativeLabel: 'Français', flag: '🇫🇷', dir: 'ltr' },
  en: { nativeLabel: 'English', flag: '🇬🇧', dir: 'ltr' },
};
