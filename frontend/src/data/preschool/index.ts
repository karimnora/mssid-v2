import { PreschoolModule } from './types';
import { NUMBERS_MODULE_0_TO_5, NUMBERS_MODULE_6_TO_10 } from './numbersModule';
import { SHAPES_MODULE } from './shapesModule';
import { ANIMALS_MODULE } from './animalsModule';
import { LETTERS_MODULE_START, LETTERS_MODULE_MORE } from './lettersModule';
import { COLORS_MODULE } from './colorsModule';
import { WORLD_MODULE } from './worldModule';
import { PRE_WRITING_MODULE } from './preWritingModule';
import { LOGIC_SPATIAL_MODULE } from './logicSpatialModule';
import { ISLAMIC_VALUES_MODULE } from './islamicValuesModule';
import { SHORT_SURAHS_MODULE } from './shortSurahsModule';
import { CREATIVE_GAMES_MODULE } from './creativeGamesModule';
// ── New 0AP curriculum modules (aligned with dzexams.com/fr/0ap) ──────────────
import { BODY_MODULE } from './bodyModule';
import { SEASONS_MODULE } from './seasonsModule';
import { CALENDAR_MODULE } from './calendarModule';
import { FAMILY_MODULE } from './familyModule';
import { ALGERIA_MODULE } from './algeriaModule';
import { FOOD_MODULE } from './foodModule';
import { ART_DRAWING_MODULE } from './artDrawingModule';
import { SEQUENCE_MODULE } from './sequenceModule';
import { STORIES_MODULE } from './storiesModule';
import { EMOTIONS_MODULE } from './emotionsModule';

export * from './types';

// Complete rich pedagogical catalog for Mode Éveil (3-5 ans) - Algerian Preschool.
// Modules ordered: foundational literacy & numeracy first, then thematic science/civics,
// then creative & games — mirrors the official Algerian 0AP programme structure.
export const PRESCHOOL_MODULES: PreschoolModule[] = [
  // ── Foundational literacy & numeracy ──────────────────────────────────────
  LETTERS_MODULE_START,
  LETTERS_MODULE_MORE,
  NUMBERS_MODULE_0_TO_5,
  NUMBERS_MODULE_6_TO_10,
  SHAPES_MODULE,
  COLORS_MODULE,
  // ── Sciences du vivant & du monde (Éducation Scientifique 0AP) ────────────
  ANIMALS_MODULE,
  BODY_MODULE,
  SEASONS_MODULE,
  CALENDAR_MODULE,
  FOOD_MODULE,
  WORLD_MODULE,
  // ── Éducation Civique & Valeurs ────────────────────────────────────────────
  FAMILY_MODULE,
  ALGERIA_MODULE,
  ISLAMIC_VALUES_MODULE,
  SHORT_SURAHS_MODULE,
  EMOTIONS_MODULE,
  // ── Expression, motricité & créativité ────────────────────────────────────
  PRE_WRITING_MODULE,
  LOGIC_SPATIAL_MODULE,
  SEQUENCE_MODULE,
  STORIES_MODULE,
  ART_DRAWING_MODULE,
  CREATIVE_GAMES_MODULE,
];
