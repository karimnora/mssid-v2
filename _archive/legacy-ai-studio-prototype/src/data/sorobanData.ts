import { SorobanExercise } from '../types';

export interface SorobanRuleGuide {
  titleAr: string;
  ruleFormulaAr: string;
  descriptionAr: string;
  exampleAr: string;
  beadStepsAr: string[];
}

export const SOROBAN_RULES: SorobanRuleGuide[] = [
  {
    titleAr: 'قاعدة المكمل +1 (صديق 5)',
    ruleFormulaAr: '+1 = +5 - 4',
    descriptionAr: 'نستخدم هذه القاعدة عندما نريد إضافة 1 ولا نجد خرزات أحادية كافية في الأسفل مع وجود الخرزة الخماسية العلوية فارغة.',
    exampleAr: 'مثال: 4 + 1 = 5',
    beadStepsAr: ['مثل العدد 4 في العمود', 'أنزل الخرزة الخماسية العلوية (+5)', 'أنزل الخرزات الأربع السفلية (-4)', 'النتيجة هي 5']
  },
  {
    titleAr: 'قاعدة المكمل +2 (صديق 5)',
    ruleFormulaAr: '+2 = +5 - 3',
    descriptionAr: 'عند إضافة 2 وعدم توفر خرزتين أحاديتين في الأسفل، نفعل الخرزة الخماسية (+5) ونعطل 3 خرزات أحادية (-3).',
    exampleAr: 'مثال: 3 + 2 = 5 أو 4 + 2 = 6',
    beadStepsAr: ['مثل العدد 3 في العمود', 'أنزل الخرزة الخماسية العلوية (+5)', 'أنزل 3 خرزات أحادية سفلية (-3)', 'النتيجة هي 5']
  },
  {
    titleAr: 'قاعدة المكمل +3 (صديق 5)',
    ruleFormulaAr: '+3 = +5 - 2',
    descriptionAr: 'عند إضافة 3 وعدم توفر 3 خرزات أحادية، نفعل الخرزة الخماسية (+5) ونعطل خرزتين أحاديتين (-2).',
    exampleAr: 'مثال: 2 + 3 = 5 أو 3 + 3 = 6',
    beadStepsAr: ['مثل العدد 2', 'أنزل الخرزة الخماسية (+5)', 'أنزل خرزتين أحاديتين (-2)', 'النتيجة 5']
  },
  {
    titleAr: 'قاعدة المكمل +4 (صديق 5)',
    ruleFormulaAr: '+4 = +5 - 1',
    descriptionAr: 'عند إضافة 4 وعدم توفر 4 خرزات، نفعل الخرزة الخماسية (+5) ونعطل خرزة أحادية واحدة (-1).',
    exampleAr: 'مثال: 1 + 4 = 5 أو 2 + 4 = 6',
    beadStepsAr: ['مثل العدد 1', 'أنزل الخرزة الخماسية (+5)', 'أنزل خرزة أحادية واحدة (-1)', 'النتيجة 5']
  },
  {
    titleAr: 'قاعدة المكمل +5 (صديق 10)',
    ruleFormulaAr: '+5 = +10 - 5',
    descriptionAr: 'تستخدم في مكملات العشرات عندما تكون الخرزة الخماسية مفعلة مسبقاً وتطلب إضافة 5.',
    exampleAr: 'مثال: 5 + 5 = 10',
    beadStepsAr: ['مثل العدد 5', 'ارفع خرزة واحدة في عمود العشرات (+10)', 'ارفع الخرزة الخماسية في عمود الوحدات (-5)', 'النتيجة 10']
  }
];

export const SOROBAN_PRACTICE_EXERCISES: SorobanExercise[] = [
  { id: 's1', numbers: [1, 2, 1], operation: '+', speedMs: 1500, expectedSum: 4 },
  { id: 's2', numbers: [2, 2, 5], operation: '+', speedMs: 1500, expectedSum: 9 },
  { id: 's3', numbers: [4, 1, 3], operation: '+', speedMs: 1200, expectedSum: 8 },
  { id: 's4', numbers: [12, 15, 21], operation: '+', speedMs: 1500, expectedSum: 48 },
  { id: 's5', numbers: [35, 12, -7, 10], operation: 'mixed', speedMs: 1200, expectedSum: 50 },
  { id: 's6', numbers: [100, 250, 45], operation: '+', speedMs: 1500, expectedSum: 395 },
  { id: 's7', numbers: [8, 7, 9, 6], operation: '+', speedMs: 1000, expectedSum: 30 }
];
