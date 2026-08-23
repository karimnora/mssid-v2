import fs from 'fs';

const sourcePath = 'c:/Users/Karim/Downloads/lettres.txt';
const outPath = 'c:/Users/Karim/Downloads/lettres-i18n.ts';
const projectPath = 'c:/Users/Karim/Desktop/mssid/mssid-V1/frontend/src/data/preschool/lettersModule.ts';
const source = fs.readFileSync(sourcePath, 'utf8');

const LATIN = {
  'letters-alif-rabbit': { fr: { letter: 'A', image: '🍍', wrong: ['B', 'C'], audio: "Touche la lettre A ! A comme Ananas !", success: 'Bravo ! A comme Ananas !' }, en: { letter: 'A', image: '🍎', wrong: ['B', 'C'], audio: 'Touch the letter A! A for Apple!', success: 'Well done! A for Apple!' } },
  'letters-boat-alif-baa': { fr: { letter: 'B', image: '🎈', wrong: ['A', 'C'], audio: 'Touche la lettre B ! B comme Ballon !', success: 'Bravo ! B comme Ballon !' }, en: { letter: 'B', image: '🐻', wrong: ['A', 'C'], audio: 'Touch the letter B! B for Bear!', success: 'Well done! B for Bear!' } },
  'letters-taa-apple': { fr: { letter: 'T', image: '🍎', wrong: ['S', 'U'], audio: 'Touche la lettre T ! T comme Tomate !', success: 'Bravo ! T comme Tomate !' }, en: { letter: 'T', image: '🚂', wrong: ['S', 'U'], audio: 'Touch the letter T! T for Train!', success: 'Well done! T for Train!' } },
  'letters-thaa-fox': { fr: { letter: 'R', image: '🦊', wrong: ['P', 'S'], audio: 'Touche la lettre R ! R comme Renard !', success: 'Bravo ! R comme Renard !' }, en: { letter: 'F', image: '🦊', wrong: ['D', 'G'], audio: 'Touch the letter F! F for Fox!', success: 'Well done! F for Fox!' } },
  'letters-jeem-camel': { fr: { letter: 'J', image: '🐪', wrong: ['H', 'K'], audio: 'Touche la lettre J ! J comme Jardin !', success: 'Bravo ! J comme Jardin !' }, en: { letter: 'J', image: '🧃', wrong: ['H', 'K'], audio: 'Touch the letter J! J for Juice!', success: 'Well done! J for Juice!' } },
  'letters-dal-bear': { fr: { letter: 'D', image: '🐻', wrong: ['B', 'F'], audio: 'Touche la lettre D ! D comme Dinosaure !', success: 'Bravo ! D comme Dinosaure !' }, en: { letter: 'D', image: '🐕', wrong: ['B', 'F'], audio: 'Touch the letter D! D for Dog!', success: 'Well done! D for Dog!' } },
  'letters-seen-fish': { fr: { letter: 'S', image: '🐟', wrong: ['P', 'T'], audio: 'Touche la lettre S ! S comme Soleil !', success: 'Bravo ! S comme Soleil !' }, en: { letter: 'S', image: '🐍', wrong: ['P', 'T'], audio: 'Touch the letter S! S for Snake!', success: 'Well done! S for Snake!' } },
  'letters-meem-banana': { fr: { letter: 'M', image: '🍌', wrong: ['L', 'N'], audio: 'Touche la lettre M ! M comme Maison !', success: 'Bravo ! M comme Maison !' }, en: { letter: 'M', image: '🐵', wrong: ['L', 'N'], audio: 'Touch the letter M! M for Monkey!', success: 'Well done! M for Monkey!' } },
  'letters-raa-feather': { fr: { letter: 'R', image: '🪶', wrong: ['P', 'T'], audio: 'Touche la lettre R ! R comme Robe !', success: 'Bravo ! R comme Robe !' }, en: { letter: 'R', image: '🌹', wrong: ['P', 'T'], audio: 'Touch the letter R! R for Rose!', success: 'Well done! R for Rose!' } },
  'letters-zay-giraffe': { fr: { letter: 'Z', image: '🦒', wrong: ['X', 'Y'], audio: 'Touche la lettre Z ! Z comme Zèbre !', success: 'Bravo ! Z comme Zèbre !' }, en: { letter: 'Z', image: '🦓', wrong: ['X', 'Y'], audio: 'Touch the letter Z! Z for Zebra!', success: 'Well done! Z for Zebra!' } },
  'letters-sheen-sun': { fr: { letter: 'S', image: '☀️', wrong: ['P', 'T'], audio: 'Touche la lettre S ! S comme Soleil !', success: 'Bravo ! S comme Soleil !' }, en: { letter: 'S', image: '☀️', wrong: ['P', 'T'], audio: 'Touch the letter S! S for Sun!', success: 'Well done! S for Sun!' } },
  'letters-sad-falcon': { fr: { letter: 'F', image: '🦅', wrong: ['D', 'G'], audio: 'Touche la lettre F ! F comme Fleur !', success: 'Bravo ! F comme Fleur !' }, en: { letter: 'F', image: '🦅', wrong: ['D', 'G'], audio: 'Touch the letter F! F for Falcon!', success: 'Well done! F for Falcon!' } },
  'letters-dad-frog': { fr: { letter: 'G', image: '🐸', wrong: ['E', 'I'], audio: 'Touche la lettre G ! G comme Grenouille !', success: 'Bravo ! G comme Grenouille !' }, en: { letter: 'F', image: '🐸', wrong: ['D', 'H'], audio: 'Touch the letter F! F for Frog!', success: 'Well done! F for Frog!' } },
  'letters-taa2-peacock': { fr: { letter: 'T', image: '🦚', wrong: ['R', 'V'], audio: 'Touche la lettre T ! T comme Tortue !', success: 'Bravo ! T comme Tortue !' }, en: { letter: 'T', image: '🦚', wrong: ['R', 'V'], audio: 'Touch the letter T! T for Turtle!', success: 'Well done! T for Turtle!' } },
  'letters-za-gazelle': { fr: { letter: 'G', image: '🦌', wrong: ['E', 'I'], audio: 'Touche la lettre G ! G comme Girafe !', success: 'Bravo ! G comme Girafe !' }, en: { letter: 'G', image: '🦌', wrong: ['E', 'I'], audio: 'Touch the letter G! G for Gazelle!', success: 'Well done! G for Gazelle!' } },
  'letters-ayn-bird': { fr: { letter: 'O', image: '🐦', wrong: ['M', 'Q'], audio: 'Touche la lettre O ! O comme Oiseau !', success: 'Bravo ! O comme Oiseau !' }, en: { letter: 'B', image: '🐦', wrong: ['A', 'D'], audio: 'Touch the letter B! B for Bird!', success: 'Well done! B for Bird!' } },
  'letters-ghayn-sheep': { fr: { letter: 'M', image: '🐑', wrong: ['K', 'O'], audio: 'Touche la lettre M ! M comme Mouton !', success: 'Bravo ! M comme Mouton !' }, en: { letter: 'S', image: '🐑', wrong: ['P', 'T'], audio: 'Touch the letter S! S for Sheep!', success: 'Well done! S for Sheep!' } },
  'letters-faa-elephant': { fr: { letter: 'E', image: '🐘', wrong: ['C', 'G'], audio: 'Touche la lettre E ! E comme Éléphant !', success: 'Bravo ! E comme Éléphant !' }, en: { letter: 'E', image: '🐘', wrong: ['C', 'G'], audio: 'Touch the letter E! E for Elephant!', success: 'Well done! E for Elephant!' } },
  'letters-qaf-monkey': { fr: { letter: 'Q', image: '🐒', wrong: ['O', 'S'], audio: 'Touche la lettre Q ! Q comme Quatre !', success: 'Bravo ! Q comme Quatre !' }, en: { letter: 'Q', image: '👸', wrong: ['O', 'S'], audio: 'Touch the letter Q! Q for Queen!', success: 'Well done! Q for Queen!' } },
  'letters-kaf-dog': { fr: { letter: 'C', image: '🐶', wrong: ['A', 'E'], audio: 'Touche la lettre C ! C comme Chat !', success: 'Bravo ! C comme Chat !' }, en: { letter: 'K', image: '🐶', wrong: ['I', 'M'], audio: 'Touch the letter K! K for Kite!', success: 'Well done! K for Kite!' } },
  'letters-lam-lemon': { fr: { letter: 'L', image: '🍋', wrong: ['J', 'N'], audio: 'Touche la lettre L ! L comme Limonade !', success: 'Bravo ! L comme Limonade !' }, en: { letter: 'L', image: '🦁', wrong: ['J', 'N'], audio: 'Touch the letter L! L for Lion!', success: 'Well done! L for Lion!' } },
  'letters-noon-bee': { fr: { letter: 'N', image: '🐝', wrong: ['L', 'P'], audio: 'Touche la lettre N ! N comme Nuage !', success: 'Bravo ! N comme Nuage !' }, en: { letter: 'N', image: '🪺', wrong: ['L', 'P'], audio: 'Touch the letter N! N for Nest!', success: 'Well done! N for Nest!' } },
  'letters-haa2-moon': { fr: { letter: 'L', image: '🌙', wrong: ['J', 'N'], audio: 'Touche la lettre L ! L comme Lune !', success: 'Bravo ! L comme Lune !' }, en: { letter: 'H', image: '🌙', wrong: ['F', 'J'], audio: 'Touch the letter H! H for House!', success: 'Well done! H for House!' } },
  'letters-waw-rose': { fr: { letter: 'R', image: '🌹', wrong: ['P', 'T'], audio: 'Touche la lettre R ! R comme Rose !', success: 'Bravo ! R comme Rose !' }, en: { letter: 'R', image: '🌹', wrong: ['P', 'T'], audio: 'Touch the letter R! R for Rose!', success: 'Well done! R for Rose!' } },
  'letters-yaa-hand': { fr: { letter: 'M', image: '✋', wrong: ['K', 'O'], audio: 'Touche la lettre M ! M comme Main !', success: 'Bravo ! M comme Main !' }, en: { letter: 'H', image: '✋', wrong: ['F', 'J'], audio: 'Touch the letter H! H for Hand!', success: 'Well done! H for Hand!' } },
};

function parseChoices(text) {
  const items = [];
  const re = /\{\s*id:\s*'([^']+)',\s*asset:\s*'([^']+)',\s*isCorrect:\s*(true|false)\s*\}/g;
  let m;
  while ((m = re.exec(text)) !== null) items.push({ id: m[1], asset: m[2], isCorrect: m[3] === 'true' });
  return items;
}

function fmtChoices(choices) {
  return `[\n${choices.map((c) => `            { id: '${c.id}', asset: '${c.asset}', isCorrect: ${c.isCorrect} },`).join('\n')}\n          ]`;
}

function latinChoices(lang, id) {
  const m = LATIN[id][lang];
  const cid = m.letter.toLowerCase();
  return [
    { id: cid, asset: m.letter, isCorrect: true },
    ...m.wrong.map((w, i) => ({ id: `${cid}-w${i}`, asset: w, isCorrect: false })),
  ];
}

function readLangField(block, field) {
  const m = block.match(new RegExp(`${field}:\\s*'((?:\\\\'|[^'])*)'`));
  return m ? m[1].replace(/\\'/g, "'") : '';
}

function buildLangBlock(lang, id, arImage, arChoices) {
  const sourceBlock = null; // filled by caller via regex capture
  return sourceBlock;
}

function extractBlock(source, id) {
  const marker = `id: '${id}'`;
  const start = source.indexOf(marker);
  const blockStart = source.lastIndexOf('\n    {', start);
  const blockEnd = source.indexOf('\n    },', start);
  return source.slice(blockStart + 1, blockEnd + 6);
}

function getLangContent(i18nBlock, lang) {
  const re = new RegExp(`${lang}:\\s*\\{([\\s\\S]*?)\\n\\s*\\}(?=,\\s*\\n\\s*(?:ar|fr|en):|\\s*\\n\\s*\\},)`);
  const oneLine = new RegExp(`${lang}:\\s*\\{([^}]*)\\}`);
  const multi = i18nBlock.match(re);
  if (multi) return multi[1];
  const single = i18nBlock.match(oneLine);
  return single ? single[1] : '';
}

function renderLang(lang, inner, id, arImage, arChoices) {
  const image = lang === 'ar' ? arImage : LATIN[id][lang].image;
  const choices = lang === 'ar' ? arChoices : latinChoices(lang, id);
  let title = readLangField(`{${inner}}`, 'title');
  let promptAudio = readLangField(`{${inner}}`, 'promptAudio');
  let promptText = readLangField(`{${inner}}`, 'promptText');
  let successAudio = readLangField(`{${inner}}`, 'successAudio');

  if (lang !== 'ar') {
    promptAudio = LATIN[id][lang].audio;
    successAudio = LATIN[id][lang].success;
  }

  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const promptTextLine = promptText ? `\n          promptText: '${esc(promptText)}',` : '';

  return `        ${lang}: {
          title: '${esc(title)}',
          promptAudio: '${esc(promptAudio)}',${promptTextLine}
          successAudio: '${esc(successAudio)}',
          image: '${image}',
          choices: ${fmtChoices(choices)},
        }`;
}

function transformBlock(block, id) {
  const imageMatch = block.match(/mainSvgOrImage: '([^']*)'/);
  const choicesMatch = block.match(/choices: (\[[\s\S]*?\])/);
  if (!imageMatch || !choicesMatch) return block;

  const arImage = imageMatch[1];
  const arChoices = parseChoices(choicesMatch[1]);
  const i18nMatch = block.match(/i18n: \{([\s\S]*?)\n      \},/);
  if (!i18nMatch) return block;

  const i18nInner = i18nMatch[1];
  const newI18n = ['ar', 'fr', 'en']
    .map((lang) => renderLang(lang, getLangContent(i18nInner, lang), id, arImage, arChoices))
    .join(',\n');

  const head = block.slice(0, block.indexOf('i18n: {'));
  const tail = block.slice(block.indexOf('visualAssets:'));
  const newVisual = `visualAssets: {\n        mainSvgOrImage: '${arImage}',\n      },\n    }`;
  return `${head}i18n: {\n${newI18n},\n      },\n      ${newVisual}`;
}

let output = source;
for (const id of Object.keys(LATIN)) {
  const block = extractBlock(output, id);
  output = output.replace(block, transformBlock(block, id));
}

fs.writeFileSync(outPath, output);
fs.writeFileSync(projectPath, output);
console.log('OK');
