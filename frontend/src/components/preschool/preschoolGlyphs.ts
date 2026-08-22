import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';

/** Arabic letter → Latin grapheme for FR/EN preschool (never show أ/ب/ت in those languages). */
const AR_TO_LATIN_FR: Record<string, string> = {
  أ: 'A', ا: 'A', إ: 'I', آ: 'A',
  ب: 'B',
  ت: 'T',
  ث: 'Th',
  ج: 'J',
  ح: 'H',
  خ: 'Kh',
  د: 'D',
  ذ: 'Dh',
  ر: 'R',
  ز: 'Z',
  س: 'S',
  ش: 'Ch',
  ص: 'Ç',
  ض: 'D',
  ط: 'T',
  ظ: 'Z',
  ع: 'A',
  غ: 'G',
  ف: 'F',
  ق: 'Q',
  ك: 'K',
  ل: 'L',
  م: 'M',
  ن: 'N',
  ه: 'H', 'هـ': 'H',
  و: 'O',
  ي: 'I',
};

const AR_TO_LATIN_EN: Record<string, string> = {
  ...AR_TO_LATIN_FR,
  و: 'W',
  ي: 'Y',
  ش: 'Sh',
  ص: 'S',
};

/** Picture that starts with the Latin letter (never an Arabic word like toufah / batta). */
const LATIN_PICTURE: Record<string, { fr: string; en: string }> = {
  'letters-alif-rabbit':   { fr: '✈️', en: '✈️' },
  'letters-boat-alif-baa': { fr: '🎈', en: '🎈' },
  'letters-taa-apple':     { fr: '🍅', en: '🐯' },
  'letters-thaa-fox':      { fr: '🎭', en: '3️⃣' },
  'letters-jeem-camel':    { fr: '🧃', en: '🧃' },
  'letters-dal-bear':      { fr: '🦕', en: '🦕' },
  'letters-seen-fish':     { fr: '🐭', en: '⭐' },
  'letters-meem-banana':   { fr: '🏠', en: '🌙' },
  'letters-raa-feather':   { fr: '🤖', en: '🌈' },
  'letters-zay-giraffe':   { fr: '🦓', en: '🦓' },
  'letters-sheen-sun':     { fr: '🐱', en: '🚢' },
  'letters-sad-falcon':    { fr: '👦', en: '🧦' },
  'letters-dad-frog':      { fr: '👆', en: '🚪' },
  'letters-taa2-peacock':  { fr: '🚂', en: '🚚' },
  'letters-za-gazelle':    { fr: '0️⃣', en: '0️⃣' },
  'letters-ayn-bird':      { fr: '🐴', en: '🐜' },
  'letters-ghayn-sheep':   { fr: '🎂', en: '🐐' },
  'letters-faa-elephant':  { fr: '🍓', en: '🌸' },
  'letters-qaf-monkey':    { fr: '4️⃣', en: '👑' },
  'letters-kaf-dog':       { fr: '🐨', en: '🪁' },
  'letters-lam-lemon':     { fr: '🦁', en: '🍋' },
  'letters-noon-bee':      { fr: '☁️', en: '👃' },
  'letters-haa2-moon':     { fr: '🦉', en: '🎩' },
  'letters-waw-rose':      { fr: '🍊', en: '🍉' },
  'letters-yaa-hand':      { fr: '🧊', en: '🪀' },
};

const CONNECT_EMOJI: Record<'fr' | 'en', Record<string, string>> = {
  fr: {
    '🐰': '✈️', '🦆': '🎈', '🐪': '🧃', '🐻': '🦕', '🐟': '🐭',
    '🐘': '🍓', '🐒': '4️⃣', '🐶': '🐨', '🦒': '🦓', '🌹': '🍊',
  },
  en: {
    '🐰': '✈️', '🦆': '🎈', '🐪': '🧃', '🐻': '🦕', '🐟': '⭐',
    '🐘': '🌸', '🐒': '👑', '🐶': '🪁', '🦒': '🦓', '🌹': '🍉',
  },
};

const RHYME_SORT: Record<'fr' | 'en', { bins: { id: string; labelAsset: string }[]; items: { id: string; asset: string; correctBinId: string }[] }> = {
  fr: {
    bins: [
      { id: 'faa-sound', labelAsset: '🍓' },
      { id: 'kaf-sound', labelAsset: '🐨' },
    ],
    items: [
      { id: 'faa-1', asset: '🌸', correctBinId: 'faa-sound' },
      { id: 'faa-2', asset: '🍓', correctBinId: 'faa-sound' },
      { id: 'kaf-1', asset: '🥝', correctBinId: 'kaf-sound' },
      { id: 'kaf-2', asset: '🐨', correctBinId: 'kaf-sound' },
    ],
  },
  en: {
    bins: [
      { id: 'faa-sound', labelAsset: '🌸' },
      { id: 'kaf-sound', labelAsset: '🪁' },
    ],
    items: [
      { id: 'faa-1', asset: '🐸', correctBinId: 'faa-sound' },
      { id: 'faa-2', asset: '🌸', correctBinId: 'faa-sound' },
      { id: 'kaf-1', asset: '🥝', correctBinId: 'kaf-sound' },
      { id: 'kaf-2', asset: '🪁', correctBinId: 'kaf-sound' },
    ],
  },
};

export function activityPicture(activity: PreschoolActivity, language: PreschoolLanguage): string {
  if (language !== 'ar') {
    const hook = LATIN_PICTURE[activity.id];
    if (hook) return language === 'fr' ? hook.fr : hook.en;
  }
  return activity.visualAssets.mainSvgOrImage;
}

export function localizePicture(emoji: string, language: PreschoolLanguage): string {
  if (language === 'ar') return emoji;
  return CONNECT_EMOJI[language][emoji] ?? emoji;
}

export function rhymeSortAssets(language: PreschoolLanguage) {
  if (language === 'ar') return null;
  return RHYME_SORT[language];
}

const SLUG_ICONS: Record<string, string> = {
  basket: '🧺',
  connect: '🔗',
  rhyme: '👂',
  memory: '🃏',
  sort: '📦',
  path: '🛤️',
  match: '🔗',
  red: '🔴',
  orange: '🟠',
  yellow: '🟡',
  green: '🟢',
  blue: '🔵',
  purple: '🟣',
  sort_colors: '🎨',
  circle: '⭕',
  square: '⬜',
  triangle: '🔺',
  star: '⭐',
  heart: '❤️',
  diamond: '🪁',
  cow: '🐄',
  sheep: '🐑',
  chicken: '🐔',
  cat: '🐱',
  dog: '🐶',
  lion: '🦁',
  rabbit: '🐰',
  boat: '⛵',
  bird: '🐦',
  turtle: '🐢',
  apples: '🍎',
  stars: '✨',
  fish: '🐟',
  leaves: '🍃',
  sky_land: '🌤️',
  fruit_veg: '🥦',
  seasons_clothes: '🧥',
  balloon: '🎈',
  sun: '☀️',
  family: '👨‍👩‍👧',
  mom: '👩',
  dad: '👨',
  grandparents: '👴',
  grandma: '👵',
  baby: '👶',
  'family-roles': '📖',
  'family-memory': '🃏',
  flag: '🇩🇿',
  'flag-colors': '🟩',
  'national-symbols': '⭐',
  'algerian-food': '🍲',
  'algeria-places': '🗺️',
  'algeria-memory': '🃏',
  'algeria-mosque': '🕌',
  'algeria-monuments': '🏛️',
  'algeria-habitats': '🏜️',
  market: '🛒',
  fruits: '🍓',
  vegetables: '🥕',
  milk: '🥛',
  'fruits-vs-veggies': '🧺',
  'food-origin': '🌾',
  'food-colors': '🎨',
  'food-memory': '🃏',
  hygiene: '🧼',
  tidy: '🧸',
  day: '🌅',
  'day-night': '🌙',
  'world-memory': '🃏',
  eyes: '👀',
  ears: '👂',
  hands: '✋',
  senses: '👃',
  'body-parts': '🧍',
  'body-memory': '🃏',
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
  'seasonal-clothes': '🧥',
  'season-symbols': '🔗',
  camel: '🐪',
  habitat: '🌍',
  handwashing: '🚿',
  toothbrushing: '🪥',
  vertical: '🌲',
  horizontal: '🐍',
  oblique: '🪁',
  zigzag: '⚡',
  wave: '🌊',
  loop: '☀️',
  'pencil-path': '✏️',
  'pencil-maze': '📓',
  long: '🚂',
  weight: '🪨',
  'heavy-light': '⚖️',
  above: '🐦',
  inside: '🏠',
  pattern: '🚂',
  pattern2: '⭐',
  'think-path': '🧠',
  'logic-memory': '🃏',
  'red-blue': '🔴',
  'cat-dog': '🐱',
  'sun-moon': '☀️',
  'apple-banana': '🍎',
  'elephant-mouse': '🐘',
  'car-bus-bus': '🚌',
  'sun-cloud-rain': '🌧️',
  '1-2-3-4': '4️⃣',
  apple: '🍎',
  flower: '🌸',
  ant: '🐜',
  farm: '🚜',
  zoo: '🦁',
  car: '🚗',
  rain: '🌧️',
  bees: '🐝',
  face: '😊',
  house: '🏠',
  fennec: '🦊',
  couscous: '🍲',
  'mosque-path': '🕌',
  mosque: '🕌',
  bismillah: '🍎',
  alhamdulillah: '🤲',
  salam: '🤝',
  manners: '💛',
  'values-memory': '🃏',
  'feelings-path': '💖',
  'emotions-sort': '🎭',
  'emotion-pairs': '🔗',
  'emotion-memory': '🃏',
  hug: '🤗',
  'crayon-path': '🖍️',
  'play-path': '🎨',
  oasis: '🌴',
  'boat-tap': '⛵',
  vehicles: '🚦',
};

function isInternalSlug(value: string): boolean {
  return /^[a-z][a-z0-9_-]+$/i.test(value) && value.length > 1;
}

export function localizeGlyph(glyph: string, language: PreschoolLanguage): string {
  if (language === 'ar') return glyph;
  const map = language === 'fr' ? AR_TO_LATIN_FR : AR_TO_LATIN_EN;
  return map[glyph] ?? glyph;
}

/** Icon shown inside a path-view circle — never an internal slug like "basket". */
export function activityPathIcon(activity: PreschoolActivity, language: PreschoolLanguage): string {
  const raw = String(activity.targetValue);
  if (SLUG_ICONS[raw]) return SLUG_ICONS[raw];

  if (isInternalSlug(raw)) {
    const main = activity.visualAssets.mainSvgOrImage;
    if (main && !isInternalSlug(main)) return main;
    return '🎮';
  }

  return localizeGlyph(raw, language);
}
