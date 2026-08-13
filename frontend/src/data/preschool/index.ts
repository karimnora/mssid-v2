import { PreschoolModule } from './types';
import { NUMBERS_MODULE_0_TO_10 } from './numbersModule';

export * from './types';

// MVP pilot scope: numbers only. Letters/colors/shapes/animals modules follow the same
// PreschoolModule shape and can be appended here once authored — no structural change needed.
export const PRESCHOOL_MODULES: PreschoolModule[] = [NUMBERS_MODULE_0_TO_10];
