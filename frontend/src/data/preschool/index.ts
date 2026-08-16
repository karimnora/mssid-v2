import { PreschoolModule } from './types';
import { NUMBERS_MODULE_0_TO_10 } from './numbersModule';
import { SHAPES_MODULE } from './shapesModule';
import { ANIMALS_MODULE } from './animalsModule';
import { LETTERS_MODULE } from './lettersModule';
import { COLORS_MODULE } from './colorsModule';
import { WORLD_MODULE } from './worldModule';

export * from './types';

// Complete rich pedagogical catalog for Mode Éveil (3-5 ans) - Algerian Preschool.
export const PRESCHOOL_MODULES: PreschoolModule[] = [
  LETTERS_MODULE,
  NUMBERS_MODULE_0_TO_10,
  SHAPES_MODULE,
  COLORS_MODULE,
  ANIMALS_MODULE,
  WORLD_MODULE,
];
