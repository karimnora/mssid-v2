import { PreschoolModule } from './types';
import { NUMBERS_MODULE_0_TO_10 } from './numbersModule';
import { SHAPES_MODULE } from './shapesModule';
import { ANIMALS_MODULE } from './animalsModule';
import { LETTERS_MODULE } from './lettersModule';
import { COLORS_MODULE } from './colorsModule';
import { WORLD_MODULE } from './worldModule';
import { PRE_WRITING_MODULE } from './preWritingModule';
import { LOGIC_SPATIAL_MODULE } from './logicSpatialModule';
import { ISLAMIC_VALUES_MODULE } from './islamicValuesModule';
import { CREATIVE_GAMES_MODULE } from './creativeGamesModule';
import { ARCADE_GAMES_MODULE } from './arcadeGamesModule';
// ── New 0AP curriculum modules (aligned with dzexams.com/fr/0ap) ──────────────
import { BODY_MODULE } from './bodyModule';
import { SEASONS_MODULE } from './seasonsModule';
import { FAMILY_MODULE } from './familyModule';
import { ALGERIA_MODULE } from './algeriaModule';
import { FOOD_MODULE } from './foodModule';
import { ART_DRAWING_MODULE } from './artDrawingModule';
import { SEQUENCE_MODULE } from './sequenceModule';
import { EMOTIONS_MODULE } from './emotionsModule';

export * from './types';

// Complete rich pedagogical catalog for Mode Éveil (3-5 ans) - Algerian Preschool.
// Modules ordered: foundational literacy & numeracy first, then thematic science/civics,
// then creative & games — mirrors the official Algerian 0AP programme structure.
export const PRESCHOOL_MODULES: PreschoolModule[] = [
  // ── Foundational literacy & numeracy ──────────────────────────────────────
  LETTERS_MODULE,
  NUMBERS_MODULE_0_TO_10,
  SHAPES_MODULE,
  COLORS_MODULE,
  // ── Sciences du vivant & du monde (Éducation Scientifique 0AP) ────────────
  ANIMALS_MODULE,
  BODY_MODULE,
  SEASONS_MODULE,
  FOOD_MODULE,
  WORLD_MODULE,
  // ── Éducation Civique & Valeurs ────────────────────────────────────────────
  FAMILY_MODULE,
  ALGERIA_MODULE,
  ISLAMIC_VALUES_MODULE,
  EMOTIONS_MODULE,
  // ── Expression, motricité & créativité ────────────────────────────────────
  PRE_WRITING_MODULE,
  LOGIC_SPATIAL_MODULE,
  SEQUENCE_MODULE,
  ART_DRAWING_MODULE,
  CREATIVE_GAMES_MODULE,
  ARCADE_GAMES_MODULE,
];
