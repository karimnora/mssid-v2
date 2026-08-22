import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';

/** Same picture in AR/FR/EN — the spoken prompt already names that picture. */
export function activityPicture(activity: PreschoolActivity, _language: PreschoolLanguage): string {
  return activity.visualAssets.mainSvgOrImage;
}

/** Same emoji in every language so a match game never asks for a rabbit and shows a plane. */
export function localizePicture(emoji: string, _language: PreschoolLanguage): string {
  return emoji;
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

export function localizeGlyph(glyph: string, _language: PreschoolLanguage): string {
  return glyph;
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
