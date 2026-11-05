import type { PrimaryGrade } from '../../types';
import { gradeWorlds, PLAN_2AP, PLAN_3AP, PLAN_4AP, PLAN_5AP } from './journeyWorldsByGrade';

/**
 * « Kawkab Didou » journey map (V2). Each world groups three real catalog lessons followed by a
 * treasure. A station is only "done" once its lesson quiz is fully validated (rule F-10), so the
 * map never invents its own exercises: it is a playful path through the existing 1AP catalog.
 *
 * The visual style (night sky, glossy buttons) is a deliberate exception to docs/v2-design-brief.md
 * decided by Karim on 2026-11-03 — see docs/v2-carte-didou.md.
 */

export type JourneyVehicle = 'walk' | 'boat' | 'rocket';

export type JourneyWorldId =
  | 'sahara'
  | 'casbah'
  | 'sea'
  | 'constantine'
  | 'djurdjura'
  | 'timgad'
  | 'tassili'
  | 'space';

export interface LocalizedText {
  ar: string;
  fr: string;
}

export interface JourneyWorld {
  id: JourneyWorldId;
  name: LocalizedText;
  subtitle: LocalizedText;
  vehicle: JourneyVehicle;
  /** Said by Didou when he enters the world. */
  welcome: LocalizedText;
  badge: LocalizedText;
  medalColor: string;
  /** Exactly three catalog lesson ids, in the order the child meets them. */
  lessonIds: readonly [string, string, string];
  /** Vertical position (map units, 0–900) of the three stations and the treasure. */
  ys: readonly [number, number, number, number];
}

export const JOURNEY_WORLD_WIDTH = 1600;
export const JOURNEY_HEIGHT = 900;
/** Horizontal position of the 3 stations + treasure inside a world, in travel order (right → left). */
export const JOURNEY_STATION_XS = [1350, 950, 560, 200] as const;

const WORLDS_1AP: readonly JourneyWorld[] = [
  {
    id: 'sahara',
    name: { ar: 'الصحراء', fr: 'Le Sahara' },
    subtitle: { ar: 'عالم الأعداد الأولى', fr: 'Le monde des premiers nombres' },
    vehicle: 'walk',
    welcome: { ar: 'مرحباً بك في الصحراء، بيتي! هنا نتعلّم المكان والأعداد الأولى', fr: 'Bienvenue au Sahara, ma maison ! Ici on apprend à se repérer et les premiers nombres.' },
    badge: { ar: 'وسام الصحراء', fr: 'Médaille du Sahara' },
    medalColor: '#f2a33d',
    lessonIds: ['math-1ap-t1-spatial-relations', 'math-1ap-t1-right-left-inside-outside', 'math-1ap-t1-numbers-0-5'],
    // On the painted decor's sand, below the oasis pool and the ksar's rock (components/world/worldArt.ts).
    ys: [700, 680, 720, 640],
  },
  {
    id: 'casbah',
    name: { ar: 'القصبة', fr: 'La Casbah' },
    subtitle: { ar: 'عالم المدرسة والحروف', fr: "Le monde de l'école et des lettres" },
    vehicle: 'walk',
    welcome: { ar: 'وصلنا إلى قصبة الجزائر! في أزقّتها نتعلّم الحروف وآداب التحية', fr: "Nous voilà dans la Casbah d'Alger ! Dans ses ruelles, on apprend les lettres et la politesse." },
    badge: { ar: 'وسام القصبة', fr: 'Médaille de la Casbah' },
    medalColor: '#2f6fe0',
    lessonIds: ['arabic-1ap-t1-school-axis', 'arabic-1ap-t1-letters-group1', 'civics-1ap-t1-greetings-respect'],
    // On the painted decor's paved square, below the parapet (y ≈ 680).
    ys: [750, 730, 770, 740],
  },
  {
    id: 'sea',
    name: { ar: 'البحر', fr: 'La mer' },
    subtitle: { ar: 'عالم الحركات والحيوانات', fr: 'Le monde des voyelles et des animaux' },
    vehicle: 'boat',
    welcome: { ar: 'هيا نركب القارب! في البحر نتعلّم الحركات ونكتشف كيف تتنقّل الحيوانات', fr: 'Montons dans le bateau ! En mer, on apprend les voyelles et comment se déplacent les animaux.' },
    badge: { ar: 'وسام البحر', fr: 'Médaille de la mer' },
    medalColor: '#1f9bd6',
    lessonIds: ['science-1ap-t1-animal-locomotion', 'arabic-1ap-t1-harakat', 'math-1ap-t2-numbers-6-10'],
    ys: [640, 740, 610, 720],
  },
  {
    id: 'constantine',
    name: { ar: 'قسنطينة', fr: 'Constantine' },
    subtitle: { ar: 'مدينة الجسور: الأطوال والمقارنة', fr: 'La ville des ponts : longueurs et comparaisons' },
    vehicle: 'walk',
    welcome: { ar: 'هذه قسنطينة، مدينة الجسور! فوق الجسر نقارن الأطوال والكميات', fr: 'Voici Constantine, la ville des ponts ! Sur le pont, on compare les longueurs et les quantités.' },
    badge: { ar: 'وسام الجسور', fr: 'Médaille des ponts' },
    medalColor: '#c8693f',
    lessonIds: ['math-1ap-t1-grandeurs', 'math-1ap-t2-compare-quantities', 'math-1ap-t2-subtraction-and-lengths'],
    ys: [660, 492, 492, 640],
  },
  {
    id: 'djurdjura',
    name: { ar: 'جبال جرجرة', fr: 'Le Djurdjura' },
    subtitle: { ar: 'عالم الحواس والطبيعة', fr: 'Le monde des sens et de la nature' },
    vehicle: 'walk',
    welcome: { ar: 'وصلنا إلى جبال جرجرة! هنا نكتشف حواسّنا والنباتات وفصول السنة', fr: "Nous voici dans le Djurdjura ! On découvre nos sens, les plantes et les saisons." },
    badge: { ar: 'وسام الجبال', fr: 'Médaille des montagnes' },
    medalColor: '#3db23a',
    lessonIds: ['science-1ap-t1-five-senses-hygiene', 'science-1ap-t2-plant-growth', 'science-1ap-t3-seasons-weather'],
    ys: [700, 560, 690, 540],
  },
  {
    id: 'timgad',
    name: { ar: 'تيمقاد', fr: 'Timgad' },
    subtitle: { ar: 'عالم الأشكال والتراث', fr: 'Le monde des formes et du patrimoine' },
    vehicle: 'walk',
    welcome: { ar: 'هذه آثار تيمقاد في الأوراس! بين الأعمدة نتعلّم الأشكال والأعداد ورموز وطننا', fr: "Voici les ruines de Timgad, dans les Aurès ! Entre les colonnes, on apprend les formes, les nombres et les symboles de notre pays." },
    badge: { ar: 'وسام تيمقاد', fr: 'Médaille de Timgad' },
    medalColor: '#b98a4e',
    lessonIds: ['math-1ap-t1-shapes-colors', 'math-1ap-t2-numbers-11-20', 'civics-1ap-t2-flag-anthem'],
    ys: [720, 600, 720, 590],
  },
  {
    id: 'tassili',
    name: { ar: 'الطاسيلي ناجر', fr: "Le Tassili n'Ajjer" },
    subtitle: { ar: 'عالم الحروف والرسوم القديمة', fr: 'Le monde des lettres et des peintures anciennes' },
    vehicle: 'walk',
    welcome: { ar: 'وصلنا إلى الطاسيلي! على صخوره رسوم عمرها آلاف السنين، وهنا نتعلّم حروفاً جديدة والمدّ', fr: "Nous voici au Tassili ! Ses rochers portent des peintures vieilles de milliers d'années. Ici, on apprend de nouvelles lettres et les voyelles longues." },
    badge: { ar: 'وسام الطاسيلي', fr: 'Médaille du Tassili' },
    medalColor: '#a0522d',
    lessonIds: ['arabic-1ap-t2-letters-group3', 'arabic-1ap-t2-madd', 'arabic-1ap-t2-nature-axis'],
    ys: [700, 580, 700, 540],
  },
  {
    id: 'space',
    name: { ar: 'الفضاء', fr: "L'espace" },
    subtitle: { ar: 'عالم الأعداد الكبيرة', fr: 'Le monde des grands nombres' },
    vehicle: 'rocket',
    welcome: { ar: 'انطلق الصاروخ! في الفضاء نتعلّم الأعداد حتى 99 والمقارنة والنقود', fr: "Décollage ! Dans l'espace, on apprend les nombres jusqu'à 99, la comparaison et la monnaie." },
    badge: { ar: 'وسام بطل الفضاء', fr: "Médaille du héros de l'espace" },
    medalColor: '#8b22e0',
    lessonIds: ['math-1ap-t3-place-value-and-n99', 'math-1ap-t3-compare-symbols', 'math-1ap-t3-addition-and-time-money'],
    ys: [520, 340, 560, 380],
  },
];

export const JOURNEYS: Partial<Record<PrimaryGrade, readonly JourneyWorld[]>> = {
  '1AP': WORLDS_1AP,
  // Each grade keeps its own map for the whole school year (no travel between years).
  '2AP': gradeWorlds(WORLDS_1AP, PLAN_2AP),
  '3AP': gradeWorlds(WORLDS_1AP, PLAN_3AP),
  '4AP': gradeWorlds(WORLDS_1AP, PLAN_4AP),
  '5AP': gradeWorlds(WORLDS_1AP, PLAN_5AP),
};

export function journeyForGrade(grade: PrimaryGrade): readonly JourneyWorld[] | null {
  return JOURNEYS[grade] ?? null;
}

export function journeyWidth(worlds: readonly JourneyWorld[]): number {
  return worlds.length * JOURNEY_WORLD_WIDTH;
}

/** Left edge of world `k` on the map: the journey reads right → left, like Arabic. */
export function worldLeft(worlds: readonly JourneyWorld[], k: number): number {
  return journeyWidth(worlds) - JOURNEY_WORLD_WIDTH * (k + 1);
}

export const pickText = (text: LocalizedText, locale: string): string => (locale === 'ar' ? text.ar : text.fr);
