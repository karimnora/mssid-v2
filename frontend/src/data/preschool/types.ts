// Mode Éveil / Préscolaire (3-5 ans) — data types.
//
// Deliberately isolated from ../../types (CourseLesson / PrimaryGrade / SubjectId): this age band
// has a completely different interaction model (tap/drag/trace, no reading, no quiz), so forcing it
// into the primary-school lesson shape would either corrupt that shape or require awkward optional
// fields nobody else needs. Nothing here is imported by, or imports from, the 1AP-5AP course data.

export type PreschoolDomain = 'numbers' | 'letters' | 'colors' | 'shapes' | 'animals' | 'writing' | 'values' | 'creative' | 'world';

export type PreschoolLanguage = 'ar' | 'fr' | 'en';

export type PreschoolInteractionType =
  | 'tap_choice'     // Tap the correct image / numeral among a few big choices
  | 'drag_drop'      // Drag objects into a drop zone (counting)
  | 'trace'          // Trace a numeral/shape with a finger (wide tolerance, never blocks)
  | 'find_path'      // Drag a character from a start point to an end point (simplified maze — reaching the goal matters, not staying on a line)
  | 'connect_dots'   // Match pairs by tap (A then B) OR by dragging a line between them
  | 'sorting'        // Drag items into the correct one of several category bins
  | 'memory_cards'   // Flip-and-match pairs, 2x2 (default) up to 2x3 cards
  | 'creative_extra' // Open slot for one-off original mini-games that don't fit the shapes above (e.g. bubble_pop below) — add new interactionType values here as they're invented, keep each one's own small, self-contained component
  | 'coloring'       // Tap-to-fill a picture made of simple declared shapes — no "wrong" color, done when every region has one
  | 'maze'           // Drag a traveler along a dashed waypoint path from start to goal (stricter than find_path: must pass near every waypoint, not just reach the end)
  | 'jigsaw'        // Drag each piece onto its matching ghost silhouette to reassemble a simple picture
  | 'sequence'      // Show a repeating pattern and ask "what comes next?" — pattern items shown as a visual row, choices below
  | 'listen_tap';   // Tap each name card to hear it — no wrong answer, done when every card has been heard

/**
 * "Child-first" voice rule: `promptAudio` (and `successAudio`) must always read as the mascot
 * talking DIRECTLY to the child — second person, playful, short ("Touch the red circle!", not "Ask
 * your child to touch..."). `promptText` is the only field ever written for the accompanying adult;
 * it is optional, secondary, and never required reading for the child to progress.
 */
export interface LocalizedContent {
  title: string;
  /**
   * Phrase spoken to the child. Played as a recorded file when `promptAudioSrc` is set,
   * otherwise synthesized via the Web Speech API (quality varies by device, especially Arabic).
   */
  promptAudio: string;
  /** Optional recorded prompt, e.g. `/sounds/preschool/ar/num-0-prompt.mp3`. TTS is the fallback. */
  promptAudioSrc?: string;
  /** Optional caption shown to the accompanying parent/adult — never required reading for the child. */
  promptText?: string;
  /** Short celebratory phrase spoken on success (same MVP convention as promptAudio). */
  successAudio?: string;
  /** Optional recorded success line. TTS is the fallback. */
  successAudioSrc?: string;
  /** Optional hero image for tap_choice — when set per language, isolates AR/FR/EN visuals. */
  image?: string;
  /** Optional tap targets — when set per language, isolates letter glyphs (أ vs A). */
  choices?: PreschoolChoice[];
  /** Optional letter/shape to trace — when set, FR/EN show Latin letters instead of Arabic. */
  glyph?: string;
  /** Optional connect pairs — when set, FR/EN match Latin letters to their pictures. */
  connectPairs?: PreschoolConnectPair[];
  /** Optional sorting bins/items — when set, FR/EN use Latin first-sound discrimination. */
  sortBins?: PreschoolSortBin[];
  sortItems?: PreschoolSortItem[];
}

export interface PreschoolChoice {
  id: string;
  /** Emoji or short glyph — no image asset pipeline in the MVP. */
  asset: string;
  isCorrect: boolean;
  /** Optional caption under the glyph (day name, month name, …). */
  label?: { ar: string; fr: string; en: string };
}

export interface PreschoolDragItem {
  id: string;
  asset: string;
}

/** find_path: a token the child drags from a start icon to an end icon. Reaching the end zone is
 * what matters — no precise line-following is required or checked (see PreschoolFindPath). */
export interface PreschoolPathToken {
  startAsset: string;
  endAsset: string;
  travelerAsset: string;
}

/** Optional stepping-stones on find_path (e.g. colored pads on the fennec desert trail).
 *  `x`/`y` are percents of the board (0–100). First stop is the start, last is the goal. */
export interface PreschoolPathStop {
  x: number;
  y: number;
  asset: string;
  color: string;
}

/** connect_dots: a pair to match by tapping — left item then its right match. */
export interface PreschoolConnectPair {
  id: string;
  leftAsset: string;
  rightAsset: string;
  /** Optional caption under the left glyph (season name, animal name, …). */
  leftLabel?: { ar: string; fr: string; en: string };
  /** Optional caption under the right glyph. */
  rightLabel?: { ar: string; fr: string; en: string };
}

/** sorting: one category bin (e.g. "big animals"). */
export interface PreschoolSortBin {
  id: string;
  labelAsset: string;
  /** Optional caption under the bin glyph (École, Week-end, …). */
  label?: { ar: string; fr: string; en: string };
}

/** sorting: one draggable item that belongs in exactly one bin. */
export interface PreschoolSortItem {
  id: string;
  asset: string;
  correctBinId: string;
  /** Optional caption on the chip (day name, month name, …). */
  label?: { ar: string; fr: string; en: string };
}

/** listen_tap: one name card the child taps to hear the spoken word. */
export interface PreschoolListenCard {
  id: string;
  asset: string;
  label: { ar: string; fr: string; en: string };
}

/** memory_cards: one pair — `asset` is rendered on two face-down cards, shuffled. */
export interface PreschoolMemoryPair {
  id: string;
  asset: string;
}

/** coloring: a region declared as a simple shape — never hand-authored SVG path data, so new
 * pictures stay cheap to write. Coordinates share PreschoolTrace's 260x260 canvas box: circle/ellipse
 * `x`/`y` are the shape's center, rect `x`/`y` is its top-left corner. */
export interface PreschoolColoringRegion {
  id: string;
  shape: 'circle' | 'ellipse' | 'rect';
  x: number;
  y: number;
  size: number;   // circle: radius; ellipse: horizontal radius (rx); rect: width
  size2?: number; // ellipse: vertical radius (ry); rect: height — defaults to `size` when omitted
}

/** maze: a waypoint on the guide path, same 0-260 coordinate box as PreschoolTrace's canvas. The
 * first entry is the start position, the last is the goal. */
export interface PreschoolMazeWaypoint {
  x: number;
  y: number;
}

/** jigsaw: one landing slot on the puzzle board, positioned by its center point in px. */
export interface PreschoolJigsawSlot {
  id: string;
  x: number;
  y: number;
}

/** jigsaw: one draggable piece, matched to exactly one slot by id. */
export interface PreschoolJigsawPiece {
  id: string;
  asset: string;
  correctSlotId: string;
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
  /** find_path */
  pathToken?: PreschoolPathToken;
  pathStops?: PreschoolPathStop[];
  /** Scenic board for find_path: desert, bath, seasons, week, market, home, or day. */
  pathTheme?: 'desert' | 'bath' | 'seasons' | 'week' | 'market' | 'home' | 'day' | 'algeria' | 'mosque' | 'feelings' | 'writing' | 'logic' | 'default';
  /** connect_dots */
  connectPairs?: PreschoolConnectPair[];
  /** Optional headings above the two connect columns (e.g. « saison » / « image »). */
  connectColumnTitles?: {
    left: { ar: string; fr: string; en: string };
    right: { ar: string; fr: string; en: string };
  };
  /** sorting */
  sortBins?: PreschoolSortBin[];
  sortItems?: PreschoolSortItem[];
  /** memory_cards */
  memoryPairs?: PreschoolMemoryPair[];
  /** creative_extra / bubble_pop: how many bubbles to pop, and what's inside each one. */
  bubbleCount?: number;
  bubbleAsset?: string;
  /** coloring */
  coloringRegions?: PreschoolColoringRegion[];
  /** maze */
  mazeWaypoints?: PreschoolMazeWaypoint[];
  mazeTravelerAsset?: string;
  /** Emoji shown at the maze finish (carrot, nest, house…) — defaults to a flag. */
  mazeGoalAsset?: string;
  /** jigsaw */
  jigsawSlots?: PreschoolJigsawSlot[];
  jigsawPieces?: PreschoolJigsawPiece[];
  /** sequence — shown prefix (incomplete). The missing next item is the one `choices` marked isCorrect. */
  sequencePattern?: string[];
  /** listen_tap — name cards in display order (Sunday first for the Algerian week). */
  listenCards?: PreschoolListenCard[];
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
