import fs from 'fs';

const path = 'c:/Users/Karim/Desktop/mssid/mssid-V1/frontend/src/data/preschool/lettersModule.ts';
let file = fs.readFileSync(path, 'utf8');

function replaceActivityI18nAndVisual(id, nextI18nAndVisual) {
  const marker = `id: '${id}'`;
  const idPos = file.indexOf(marker);
  if (idPos < 0) throw new Error(`Missing ${id}`);
  const i18nStart = file.indexOf('i18n: {', idPos);
  // End of this activity: the closing `},` before the next activity or end of array.
  // Find matching brace from activity start.
  const actStart = file.lastIndexOf('\n    {', idPos);
  let depth = 0;
  let i = actStart + 5; // at '{'
  let actEnd = -1;
  for (; i < file.length; i++) {
    const ch = file[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        actEnd = i + 1; // include }
        break;
      }
    }
  }
  if (actEnd < 0) throw new Error(`Could not find end of ${id}`);
  const head = file.slice(actStart, i18nStart);
  // Keep trailing comma after activity if present
  let after = file.slice(actEnd);
  const comma = after.startsWith(',') ? ',' : '';
  if (comma) after = after.slice(1);
  const rebuilt = `${head}${nextI18nAndVisual}\n    }${comma}`;
  file = file.slice(0, actStart) + rebuilt + after;
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const TRACE = [
  { id: 'letters-trace-alif', ar: 'أ', fr: 'A', en: 'A',
    frA: 'Trace la lettre A avec ton doigt ! Une ligne de haut en bas !', frS: 'Très beau tracé ! Tu as écrit A !',
    enA: 'Trace the letter A with your finger! A line from top to bottom!', enS: 'Great trace! You wrote A!' },
  { id: 'letters-trace-jeem', ar: 'ج', fr: 'J', en: 'J',
    frA: 'Trace la lettre J avec ton doigt ! Descends, puis tourne !', frS: 'Très beau tracé ! Tu as écrit J !',
    enA: 'Trace the letter J with your finger! Go down, then curve!', enS: 'Great trace! You wrote J!' },
  { id: 'letters-trace-baa', ar: 'ب', fr: 'B', en: 'B',
    frA: 'Trace la lettre B avec ton doigt ! Une ligne et un point !', frS: 'Très beau tracé ! Tu as écrit B !',
    enA: 'Trace the letter B with your finger! A line and a dot!', enS: 'Great trace! You wrote B!' },
  { id: 'letters-trace-meem', ar: 'م', fr: 'M', en: 'M',
    frA: 'Trace la lettre M avec ton doigt ! Un petit rond et une queue !', frS: 'Très beau tracé ! Tu as écrit M !',
    enA: 'Trace the letter M with your finger! A small circle and a tail!', enS: 'Great trace! You wrote M!' },
  { id: 'letters-trace-raa', ar: 'ر', fr: 'R', en: 'R',
    frA: 'Trace la lettre R avec ton doigt ! Une ligne qui courbe vers le bas !', frS: 'Très beau tracé ! Tu as écrit R !',
    enA: 'Trace the letter R with your finger! A line that curves down!', enS: 'Great trace! You wrote R!' },
  { id: 'letters-trace-sad', ar: 'ص', fr: 'F', en: 'F',
    frA: 'Trace la lettre F avec ton doigt ! Une ligne et une barre !', frS: 'Très beau tracé ! Tu as écrit F !',
    enA: 'Trace the letter F with your finger! A line and a bar!', enS: 'Great trace! You wrote F!' },
  { id: 'letters-trace-faa', ar: 'ف', fr: 'E', en: 'E',
    frA: 'Trace la lettre E avec ton doigt ! Trois barres horizontales !', frS: 'Très beau tracé ! Tu as écrit E !',
    enA: 'Trace the letter E with your finger! Three horizontal bars!', enS: 'Great trace! You wrote E!' },
  { id: 'letters-trace-lam', ar: 'ل', fr: 'L', en: 'L',
    frA: 'Trace la lettre L avec ton doigt ! Une grande ligne vers le bas !', frS: 'Très beau tracé ! Tu as écrit L !',
    enA: 'Trace the letter L with your finger! A tall line going down!', enS: 'Great trace! You wrote L!' },
  { id: 'letters-trace-waw', ar: 'و', fr: 'R', en: 'R',
    frA: 'Trace la lettre R avec ton doigt ! Une ligne et une boucle !', frS: 'Très beau tracé ! Tu as écrit R !',
    enA: 'Trace the letter R with your finger! A line and a loop!', enS: 'Great trace! You wrote R!' },
];

function readArFields(id) {
  const idPos = file.indexOf(`id: '${id}'`);
  const i18nStart = file.indexOf('i18n: {', idPos);
  const visualStart = file.indexOf('visualAssets:', i18nStart);
  const block = file.slice(i18nStart, visualStart);
  const title = block.match(/ar:[\s\S]*?title:\s*'((?:\\'|[^'])*)'/)?.[1];
  const promptAudio = block.match(/ar:[\s\S]*?promptAudio:\s*'((?:\\'|[^'])*)'/)?.[1];
  const promptText = block.match(/ar:[\s\S]*?promptText:\s*'((?:\\'|[^'])*)'/)?.[1];
  const successAudio = block.match(/ar:[\s\S]*?successAudio:\s*'((?:\\'|[^'])*)'/)?.[1];
  if (!title || !promptAudio || !successAudio) throw new Error(`AR parse fail ${id}`);
  return { title, promptAudio, promptText: promptText || '', successAudio };
}

for (const t of TRACE) {
  const ar = readArFields(t.id);
  const body = `i18n: {
        ar: {
          title: '${ar.title}',
          promptAudio: '${ar.promptAudio}',
          promptText: '${ar.promptText}',
          successAudio: '${ar.successAudio}',
          glyph: '${t.ar}',
        },
        fr: {
          title: 'Trace la Lettre ${t.fr}',
          promptAudio: '${esc(t.frA)}',
          promptText: 'Encouragez l\\'enfant à tracer la lettre ${t.fr}.',
          successAudio: '${esc(t.frS)}',
          glyph: '${t.fr}',
        },
        en: {
          title: 'Trace the Letter ${t.en}',
          promptAudio: '${esc(t.enA)}',
          promptText: 'Encourage your child to trace the letter ${t.en}.',
          successAudio: '${esc(t.enS)}',
          glyph: '${t.en}',
        },
      },
      visualAssets: {
        mainSvgOrImage: '${t.ar}',
      },`;
  replaceActivityI18nAndVisual(t.id, body);
}

replaceActivityI18nAndVisual('letters-match-words', `i18n: {
        ar: {
          title: 'وَصِّلِ الحَرْفَ بِالصُّورَةِ',
          promptAudio: 'اِلْمِسِ الحَرْفَ ثُمَّ الصُّورَة، أَوِ اسْحَبْ خَطًّا بَيْنَهُمَا!',
          promptText: 'يمكن الربط بالنقر (حرف ثم صورة) أو بسحب خط من الحرف إلى الصورة.',
          successAudio: 'عَبْقَرِيٌّ صَغِير! رَبَطْتَ كُلَّ الحُرُوف!',
          connectPairs: [
            { id: 'alif-rabbit', leftAsset: '🐰', rightAsset: 'أ' },
            { id: 'baa-batta', leftAsset: '🦆', rightAsset: 'ب' },
            { id: 'jamal-jeem', leftAsset: '🐪', rightAsset: 'ج' },
            { id: 'dal-bear', leftAsset: '🐻', rightAsset: 'د' },
            { id: 'seen-fish', leftAsset: '🐟', rightAsset: 'س' },
          ],
        },
        fr: {
          title: 'Associe la Lettre et l\\'Image',
          promptAudio: 'Touche la lettre puis l’image, ou glisse un trait pour les relier !',
          promptText: 'On peut associer en tapant (lettre puis image) ou en traçant un lien.',
          successAudio: 'Bravo ! Tu as associé toutes les lettres !',
          connectPairs: [
            { id: 'a-ananas', leftAsset: '🍍', rightAsset: 'A' },
            { id: 'b-ballon', leftAsset: '🎈', rightAsset: 'B' },
            { id: 'j-jardin', leftAsset: '🌼', rightAsset: 'J' },
            { id: 'd-dino', leftAsset: '🦕', rightAsset: 'D' },
            { id: 's-soleil', leftAsset: '☀️', rightAsset: 'S' },
          ],
        },
        en: {
          title: 'Match Letter and Picture',
          promptAudio: 'Tap the letter then the picture, or drag a line to connect them!',
          promptText: 'Match by tapping (letter then picture) or by drawing a link.',
          successAudio: 'Fantastic! All letters are matched!',
          connectPairs: [
            { id: 'a-apple', leftAsset: '🍎', rightAsset: 'A' },
            { id: 'b-bear', leftAsset: '🐻', rightAsset: 'B' },
            { id: 'j-juice', leftAsset: '🧃', rightAsset: 'J' },
            { id: 'd-dog', leftAsset: '🐕', rightAsset: 'D' },
            { id: 's-snake', leftAsset: '🐍', rightAsset: 'S' },
          ],
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔤',
      },`);

replaceActivityI18nAndVisual('letters-match-words-2', `i18n: {
        ar: {
          title: 'وَصِّلِ الحَرْفَ بِالصُّورَةِ (٢)',
          promptAudio: 'اِلْمِسِ الحَرْفَ ثُمَّ الصُّورَة، أَوِ اسْحَبْ خَطًّا بَيْنَهُمَا!',
          promptText: 'يمكن الربط بالنقر (حرف ثم صورة) أو بسحب خط من الحرف إلى الصورة (تكملة الأبجدية).',
          successAudio: 'عَبْقَرِيٌّ صَغِير! رَبَطْتَ كُلَّ حُرُوفِ الأَبْجَدِيَّة!',
          connectPairs: [
            { id: 'feel-faa', leftAsset: '🐘', rightAsset: 'ف' },
            { id: 'qird-qaf', leftAsset: '🐒', rightAsset: 'ق' },
            { id: 'kalb-kaf', leftAsset: '🐶', rightAsset: 'ك' },
            { id: 'zarafa-zay', leftAsset: '🦒', rightAsset: 'ز' },
            { id: 'warda-waw', leftAsset: '🌹', rightAsset: 'و' },
          ],
        },
        fr: {
          title: 'Associe la Lettre et l\\'Image (2)',
          promptAudio: 'Touche la lettre puis l’image, ou glisse un trait pour les relier !',
          promptText: 'On peut associer en tapant ou en traçant un lien (suite de l’alphabet).',
          successAudio: 'Bravo ! Tu as associé tout l\\'alphabet !',
          connectPairs: [
            { id: 'e-elephant', leftAsset: '🐘', rightAsset: 'E' },
            { id: 'q-quatre', leftAsset: '4️⃣', rightAsset: 'Q' },
            { id: 'c-chat', leftAsset: '🐱', rightAsset: 'C' },
            { id: 'z-zebre', leftAsset: '🦓', rightAsset: 'Z' },
            { id: 'r-rose', leftAsset: '🌹', rightAsset: 'R' },
          ],
        },
        en: {
          title: 'Match Letter and Picture (2)',
          promptAudio: 'Tap the letter then the picture, or drag a line to connect them!',
          promptText: 'Match by tapping or by drawing a link (rest of the alphabet).',
          successAudio: 'Fantastic! You matched the whole alphabet!',
          connectPairs: [
            { id: 'e-elephant', leftAsset: '🐘', rightAsset: 'E' },
            { id: 'q-queen', leftAsset: '👸', rightAsset: 'Q' },
            { id: 'k-kite', leftAsset: '🪁', rightAsset: 'K' },
            { id: 'z-zebra', leftAsset: '🦓', rightAsset: 'Z' },
            { id: 'r-rose', leftAsset: '🌹', rightAsset: 'R' },
          ],
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔤',
      },`);

replaceActivityI18nAndVisual('letters-rhyme-sort', `i18n: {
        ar: {
          title: 'أُذُنِي الصَّغِيرَةُ تَسْمَعُ',
          promptAudio: 'اِسْتَمِعْ جَيِّداً! ضَعِ الصُّوَرَ الَّتِي تَبْدَأُ بِصَوْتِ الفَاءِ مَعَ الفِيل، وَالَّتِي تَبْدَأُ بِصَوْتِ الكَافِ مَعَ الكَلْب!',
          promptText: 'ساعد طفلك على تمييز الصور حسب الصوت الأول لاسمها (تمييز سمعي).',
          successAudio: 'أُذُنٌ ذَكِيَّة! سَمِعْتَ كُلَّ الأَصْوَاتِ بِشَكْلٍ صَحِيح!',
          sortBins: [
            { id: 'faa-sound', labelAsset: '🐘' },
            { id: 'kaf-sound', labelAsset: '🐶' },
          ],
          sortItems: [
            { id: 'faa-1', asset: '🦋', correctBinId: 'faa-sound' },
            { id: 'faa-2', asset: '🍓', correctBinId: 'faa-sound' },
            { id: 'kaf-1', asset: '🍰', correctBinId: 'kaf-sound' },
            { id: 'kaf-2', asset: '🥐', correctBinId: 'kaf-sound' },
          ],
        },
        fr: {
          title: 'Ma Petite Oreille Écoute',
          promptAudio: 'Écoute bien ! Mets la fleur et la fraise avec l\\'éléphant, le gâteau et le croissant avec le chat !',
          promptText: 'Aidez l\\'enfant à trier selon le premier son français : F (fleur, fraise, éléphant) et C (gâteau, croissant, chat).',
          successAudio: 'Quelle bonne oreille ! Tu as reconnu tous les sons !',
          sortBins: [
            { id: 'f-sound', labelAsset: '🐘' },
            { id: 'c-sound', labelAsset: '🐱' },
          ],
          sortItems: [
            { id: 'f-1', asset: '🌸', correctBinId: 'f-sound' },
            { id: 'f-2', asset: '🍓', correctBinId: 'f-sound' },
            { id: 'c-1', asset: '🍰', correctBinId: 'c-sound' },
            { id: 'c-2', asset: '🥐', correctBinId: 'c-sound' },
          ],
        },
        en: {
          title: 'My Little Ear Listens',
          promptAudio: 'Listen carefully! Put the fish and the strawberry with the frog, the car and the cupcake with the cat!',
          promptText: 'Help your child sort by the English first sound: F (fish, strawberry, frog) and C (car, cupcake, cat).',
          successAudio: 'What a smart ear! You heard every sound correctly!',
          sortBins: [
            { id: 'f-sound', labelAsset: '🐸' },
            { id: 'c-sound', labelAsset: '🐱' },
          ],
          sortItems: [
            { id: 'f-1', asset: '🐟', correctBinId: 'f-sound' },
            { id: 'f-2', asset: '🍓', correctBinId: 'f-sound' },
            { id: 'c-1', asset: '🚗', correctBinId: 'c-sound' },
            { id: 'c-2', asset: '🧁', correctBinId: 'c-sound' },
          ],
        },
      },
      visualAssets: {
        mainSvgOrImage: '👂',
      },`);

// Fix mismatched FR/EN titles vs taught Latin letter
const fixes = [
  ["title: 'La Pêche à la Lettre D',\n          promptAudio: 'Touche la lettre G ! G comme Grenouille !'",
   "title: 'La Pêche à la Lettre G',\n          promptAudio: 'Touche la lettre G ! G comme Grenouille !'"],
  ["promptAudio: 'Touche la lettre G ! G comme Grenouille !',\n          promptText: 'Aidez votre enfant à toucher la lettre D.'",
   "promptAudio: 'Touche la lettre G ! G comme Grenouille !',\n          promptText: 'Aidez votre enfant à toucher la lettre G.'"],
  ["title: 'Catch the Letter D',\n          promptAudio: 'Touch the letter F! F for Frog!'",
   "title: 'Catch the Letter F',\n          promptAudio: 'Touch the letter F! F for Frog!'"],
  ["promptAudio: 'Touch the letter F! F for Frog!',\n          promptText: 'Help your child tap the letter D.'",
   "promptAudio: 'Touch the letter F! F for Frog!',\n          promptText: 'Help your child tap the letter F.'"],
  ["title: 'La Pêche à la Lettre A',\n          promptAudio: 'Touche la lettre O ! O comme Oiseau !'",
   "title: 'La Pêche à la Lettre O',\n          promptAudio: 'Touche la lettre O ! O comme Oiseau !'"],
  ["promptAudio: 'Touche la lettre O ! O comme Oiseau !',\n          promptText: 'Aidez votre enfant à toucher la lettre A.'",
   "promptAudio: 'Touche la lettre O ! O comme Oiseau !',\n          promptText: 'Aidez votre enfant à toucher la lettre O.'"],
  ["title: 'Catch the Letter A',\n          promptAudio: 'Touch the letter B! B for Bird!'",
   "title: 'Catch the Letter B',\n          promptAudio: 'Touch the letter B! B for Bird!'"],
  ["promptAudio: 'Touch the letter B! B for Bird!',\n          promptText: 'Help your child tap the letter A.'",
   "promptAudio: 'Touch the letter B! B for Bird!',\n          promptText: 'Help your child tap the letter B.'"],
  ["title: 'La Pêche à la Lettre O',\n          promptAudio: 'Touche la lettre R ! R comme Rose !'",
   "title: 'La Pêche à la Lettre R',\n          promptAudio: 'Touche la lettre R ! R comme Rose !'"],
  ["promptAudio: 'Touche la lettre R ! R comme Rose !',\n          promptText: 'Aidez votre enfant à toucher la lettre O.'",
   "promptAudio: 'Touche la lettre R ! R comme Rose !',\n          promptText: 'Aidez votre enfant à toucher la lettre R.'"],
  ["title: 'Catch the Letter W',\n          promptAudio: 'Touch the letter R! R for Rose!'",
   "title: 'Catch the Letter R',\n          promptAudio: 'Touch the letter R! R for Rose!'"],
  ["promptAudio: 'Touch the letter R! R for Rose!',\n          promptText: 'Help your child tap the letter W.'",
   "promptAudio: 'Touch the letter R! R for Rose!',\n          promptText: 'Help your child tap the letter R.'"],
  ["title: 'La Pêche à la Lettre I',\n          promptAudio: 'Touche la lettre M ! M comme Main !'",
   "title: 'La Pêche à la Lettre M',\n          promptAudio: 'Touche la lettre M ! M comme Main !'"],
  ["promptAudio: 'Touche la lettre M ! M comme Main !',\n          promptText: 'Aidez votre enfant à toucher la lettre I.'",
   "promptAudio: 'Touche la lettre M ! M comme Main !',\n          promptText: 'Aidez votre enfant à toucher la lettre M.'"],
  ["title: 'Catch the Letter Y',\n          promptAudio: 'Touch the letter H! H for Hand!'",
   "title: 'Catch the Letter H',\n          promptAudio: 'Touch the letter H! H for Hand!'"],
  ["promptAudio: 'Touch the letter H! H for Hand!',\n          promptText: 'Help your child tap the letter Y.'",
   "promptAudio: 'Touch the letter H! H for Hand!',\n          promptText: 'Help your child tap the letter H.'"],
];

for (const [from, to] of fixes) {
  file = file.split(from).join(to);
}

fs.writeFileSync(path, file);
const lines = file.split('\n').length;
const activities = (file.match(/id: 'letters-/g) || []).length;
console.log(`OK lines=${lines} activities=${activities}`);
