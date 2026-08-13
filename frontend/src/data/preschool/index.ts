import { PreschoolModule } from './types';
import { NUMBERS_MODULE_0_TO_10 } from './numbersModule';
import { SHAPES_MODULE } from './shapesModule';
import { ANIMALS_MODULE } from './animalsModule';

export * from './types';

// Letters/colors modules follow the same PreschoolModule shape and can be appended here once
// authored — no structural change needed.
export const PRESCHOOL_MODULES: PreschoolModule[] = [NUMBERS_MODULE_0_TO_10, SHAPES_MODULE, ANIMALS_MODULE];
