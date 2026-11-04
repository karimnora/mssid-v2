import React from 'react';
import { Ar, Frame, Num, BLUE, GOLD, GREEN, INK, MUTED, ORANGE, VIOLET } from './svgKit';

/**
 * Drawings made for each 5AP science lesson (V2 « contenu enrichi », docs/v2-design-monde.md).
 * Simple shapes a child can redraw in the copybook; arrows show what moves.
 */
const RED = '#dc2626';
const SKY = '#e0f2fe';
const SOIL = '#a16207';
const LEAF = '#16a34a';

function Arrow({ x1, y1, x2, y2, color = MUTED, width = 2.5 }: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 8;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} ${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)}`} fill={color} />
    </g>
  );
}

function Emoji({ x, y, size = 26, children }: { x: number; y: number; size?: number; children: string }) {
  return <text x={x} y={y} fontSize={size} textAnchor="middle" fontFamily="'Segoe UI Emoji','Noto Color Emoji','Apple Color Emoji',sans-serif">{children}</text>;
}

function Tag({ x, y, w, text, color }: { x: number; y: number; w: number; text: string; color: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 15} width={w} height={22} rx="11" fill="#fff" stroke={color} strokeWidth="2" />
      <Ar x={x} y={y + 1} size={12} fill={color}>{text}</Ar>
    </g>
  );
}

// 1. Breathing: air in, air out, and the silent danger of the stove.
function RespirationHealth() {
  return (
    <Frame label="الجهاز التنفسي: يدخل الأكسجين ويخرج ثاني أكسيد الكربون، وخطر غاز أول أكسيد الكربون" height={240}>
      <Ar x={190} y={26} size={15}>نَتَنَفَّسُ هَوَاءً نَقِيّاً</Ar>
      <rect x={260} y={40} width={14} height={50} rx="6" fill="#fecaca" stroke={RED} strokeWidth="2" />
      <path d="M267 90 L242 112 M267 90 L292 112" stroke={RED} strokeWidth="5" strokeLinecap="round" />
      <path d="M240 104 C205 104 200 160 212 192 C222 214 252 206 256 186 L258 116 Z" fill="#fda4af" stroke={RED} strokeWidth="2.5" />
      <path d="M294 104 C329 104 334 160 322 192 C312 214 282 206 278 186 L276 116 Z" fill="#fda4af" stroke={RED} strokeWidth="2.5" />
      <Ar x={234} y={160} size={12}>رِئَةٌ</Ar>
      <Ar x={300} y={160} size={12}>رِئَةٌ</Ar>
      <Ar x={364} y={76} size={11} anchor="start">القَصَبَةُ الهَوَائِيَّةُ</Ar>
      <Arrow x1={326} y1={40} x2={280} y2={46} color={GREEN} />
      <Num x={342} y={46} size={14} fill={GREEN}>O₂</Num>
      <Arrow x1={254} y1={46} x2={212} y2={40} color={MUTED} />
      <Num x={192} y={48} size={14} fill={MUTED}>CO₂</Num>
      <rect x={18} y={48} width={150} height={150} rx="14" fill="#fff7ed" stroke={ORANGE} strokeWidth="2.5" />
      <Emoji x={93} y={92} size={32}>🔥</Emoji>
      <Num x={93} y={124} size={20} fill={ORANGE}>CO</Num>
      <Ar x={93} y={148} size={12} fill={ORANGE}>خَطَرٌ صَامِتٌ</Ar>
      <Ar x={93} y={166} size={11} fill={MUTED}>بِلَا لَوْنٍ وَلَا رَائِحَةٍ</Ar>
      <Ar x={93} y={186} size={12} fill={INK}>هَوِّ الغُرْفَةَ!</Ar>
      <Ar x={190} y={226} size={12.5} fill={MUTED}>رِيَاضَةٌ فِي الهَوَاءِ النَّقِيِّ · لَا تَدْخِينَ · تَهْوِيَةٌ يَوْمِيَّةٌ</Ar>
    </Frame>
  );
}

// 2. Blood circulation: the heart pumps, arteries go out, veins come back.
function CirculationHeart() {
  return (
    <Frame label="الدورة الدموية: الشرايين تخرج من القلب والأوردة تعود إليه والشعيرات تربط بينهما" height={230}>
      <Ar x={190} y={26} size={15}>القَلْبُ مِضَخَّةُ الجِسْمِ</Ar>
      <path d="M300 92 C300 70 330 66 336 88 C342 66 372 70 372 92 C372 118 336 138 336 150 C336 138 300 118 300 92 Z" fill="#f87171" stroke={RED} strokeWidth="2.5" transform="translate(-14 4)" />
      <Ar x={322} y={176} size={13}>القَلْبُ</Ar>
      <rect x={24} y={70} width={96} height={80} rx="14" fill="#fef3c7" stroke={GOLD} strokeWidth="2.5" />
      <Ar x={72} y={100} size={13}>الأَعْضَاءُ</Ar>
      <path d="M40 124 q8 -10 16 0 t16 0 t16 0 t16 0" fill="none" stroke={VIOLET} strokeWidth="2.5" />
      <Ar x={72} y={170} size={11.5} fill={VIOLET}>شُعَيْرَاتٌ دَمَوِيَّةٌ</Ar>
      <Arrow x1={290} y1={78} x2={128} y2={78} color={RED} width={5} />
      <Ar x={210} y={66} size={12.5} fill={RED}>الشَّرَايِينُ: دَمٌ غَنِيٌّ بِـ O₂</Ar>
      <Arrow x1={128} y1={140} x2={290} y2={140} color={BLUE} width={5} />
      <Ar x={210} y={162} size={12.5} fill={BLUE}>الأَوْرِدَةُ: دَمٌ مُحَمَّلٌ بِـ CO₂</Ar>
      <Ar x={190} y={210} size={12.5} fill={MUTED}>رِيَاضَةٌ مُنْتَظِمَةٌ · قَلِيلٌ مِنَ الدُّهُونِ · لَا تَدْخِينَ</Ar>
    </Frame>
  );
}

// 3. A balanced plate, and the sun for vitamin D.
function NutritionHealth() {
  const parts = [
    { t: 'أَغْذِيَةُ البِنَاءِ', e: '🥚 🥛 🍗', c: RED, d: 'M190 128 L190 48 A80 80 0 0 1 259 168 Z' },
    { t: 'أَغْذِيَةُ الطَّاقَةِ', e: '🍞 🍝', c: GOLD, d: 'M190 128 L259 168 A80 80 0 0 1 121 168 Z' },
    { t: 'أَغْذِيَةُ الوِقَايَةِ', e: '🥕 🍊', c: LEAF, d: 'M190 128 L121 168 A80 80 0 0 1 190 48 Z' },
  ];
  return (
    <Frame label="الغذاء المتوازن: أغذية البناء والطاقة والوقاية، والشمس لفيتامين د" height={240}>
      <Ar x={190} y={30} size={15}>صَحْنٌ مُتَوَازِنٌ</Ar>
      {parts.map(p => <path key={p.t} d={p.d} fill={`${p.c}22`} stroke={p.c} strokeWidth="2.5" />)}
      <Emoji x={222} y={104} size={16}>{parts[0].e}</Emoji>
      <Emoji x={190} y={176} size={16}>{parts[1].e}</Emoji>
      <Emoji x={158} y={104} size={16}>{parts[2].e}</Emoji>
      <Tag x={318} y={80} w={104} text={parts[0].t} color={RED} />
      <Tag x={190} y={226} w={110} text={parts[1].t} color={'#a16207'} />
      <Tag x={62} y={80} w={110} text={parts[2].t} color={LEAF} />
      <Emoji x={330} y={170} size={30}>☀️</Emoji>
      <Ar x={330} y={196} size={11.5} fill={MUTED}>فِيتَامِينُ D</Ar>
      <Ar x={56} y={176} size={11.5} fill={MUTED}>4 وَجَبَاتٍ</Ar>
      <Ar x={56} y={194} size={11.5} fill={MUTED}>وَمَاءٌ كَافٍ</Ar>
    </Frame>
  );
}

// 4. What a green plant takes in, and where.
function PlantNutrition() {
  return (
    <Frame label="حاجات النبات الأخضر: الماء والأملاح بالأوبار الماصة، والضوء، وثاني أكسيد الكربون، والنتح" height={250}>
      <rect x={2} y={160} width={376} height={86} fill="#fde68a" opacity="0.55" />
      <Emoji x={44} y={52} size={34}>☀️</Emoji>
      <Arrow x1={66} y1={56} x2={160} y2={96} color={GOLD} />
      <Ar x={84} y={92} size={12} fill={'#a16207'}>الضَّوْءُ</Ar>
      <line x1={190} y1={160} x2={190} y2={70} stroke={LEAF} strokeWidth="6" />
      <path d="M190 112 C160 96 150 80 168 70 C182 74 190 92 190 112 Z" fill="#86efac" stroke={LEAF} strokeWidth="2" />
      <path d="M190 96 C220 80 232 64 214 54 C200 58 190 76 190 96 Z" fill="#86efac" stroke={LEAF} strokeWidth="2" />
      <path d="M190 160 L170 200 M190 160 L190 210 M190 160 L212 202" stroke={SOIL} strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5].map(i => <line key={i} x1={186 + (i % 3) * 4} y1={196 + Math.floor(i / 3) * 6} x2={178 + (i % 3) * 10} y2={202 + Math.floor(i / 3) * 6} stroke={SOIL} strokeWidth="1.2" />)}
      <ellipse cx={190} cy={204} rx={30} ry={14} fill="none" stroke={VIOLET} strokeWidth="2" strokeDasharray="5 4" />
      <Ar x={290} y={210} size={12} fill={VIOLET}>الأَوْبَارُ المَاصَّةُ</Ar>
      <Arrow x1={250} y1={206} x2={224} y2={206} color={VIOLET} />
      <Arrow x1={110} y1={226} x2={176} y2={212} color={BLUE} />
      <Ar x={74} y={232} size={11.5} fill={BLUE}>مَاءٌ + أَمْلَاحٌ</Ar>
      <Arrow x1={320} y1={110} x2={222} y2={70} color={MUTED} />
      <Num x={336} y={124} size={14} fill={MUTED}>CO₂</Num>
      <Arrow x1={216} y1={46} x2={268} y2={24} color={'#0ea5e9'} />
      <Ar x={322} y={30} size={12} fill={'#0369a1'}>النَّتْحُ (بُخَارُ مَاءٍ)</Ar>
    </Frame>
  );
}

// 5. Desert plants: store water, lose less, seek it deep.
function PlantAdaptation() {
  return (
    <Frame label="تكيف النباتات مع الوسط الجاف: ساق لحمية، أوراق شوكية، جذور عميقة" height={240}>
      <Ar x={190} y={26} size={15}>كَيْفَ تَعِيشُ نَبَاتَاتُ الصَّحْرَاءِ؟</Ar>
      <rect x={2} y={160} width={376} height={76} fill="#fde68a" opacity="0.6" />
      {/* cactus */}
      <rect x={300} y={66} width={26} height={94} rx="13" fill="#4ade80" stroke={LEAF} strokeWidth="2.5" />
      <path d="M300 112 h-14 v-26" fill="none" stroke={LEAF} strokeWidth="10" strokeLinecap="round" />
      {[80, 100, 120, 140].map(y => <path key={y} d={`M326 ${y} l8 -3 M300 ${y + 6} l-8 -3`} stroke={INK} strokeWidth="1.5" />)}
      <Ar x={312} y={56} size={12.5} fill={LEAF}>الصَّبَّارُ</Ar>
      <Ar x={312} y={184} size={11.5}>سَاقٌ لَحْمِيَّةٌ</Ar>
      <Ar x={312} y={200} size={11.5}>تُخَزِّنُ المَاءَ</Ar>
      {/* retem */}
      {[-30, -15, 0, 15, 30].map(a => <line key={a} x1={190} y1={160} x2={190 + a * 1.4} y2={92} stroke={LEAF} strokeWidth="2.5" />)}
      {[-30, -15, 0, 15, 30].map(a => <circle key={a} cx={190 + a * 1.4} cy={94} r="3" fill={LEAF} />)}
      <Ar x={190} y={80} size={12.5} fill={LEAF}>الرَّتَمُ</Ar>
      <Ar x={190} y={184} size={11.5}>أَوْرَاقٌ صَغِيرَةٌ</Ar>
      <Ar x={190} y={200} size={11.5}>نَتْحٌ قَلِيلٌ</Ar>
      {/* palm */}
      <rect x={64} y={70} width={12} height={90} fill="#a16207" />
      {[-60, -30, 0, 30, 60].map(a => <path key={a} d={`M70 70 q ${a * 0.6} -20 ${a * 0.9} 8`} fill="none" stroke={LEAF} strokeWidth="4" />)}
      <path d="M70 160 v70 M70 175 l-18 40 M70 175 l18 40" stroke={SOIL} strokeWidth="3" />
      <Ar x={70} y={56} size={12.5} fill={LEAF}>النَّخْلَةُ</Ar>
      <Ar x={128} y={214} size={11.5}>جُذُورٌ عَمِيقَةٌ</Ar>
    </Frame>
  );
}

// 6. A closed circuit, and the conductor test.
function ElectricCircuit() {
  return (
    <Frame label="الدارة الكهربائية البسيطة واختبار النواقل والعوازل" height={240}>
      <Ar x={190} y={26} size={15}>دَارَةٌ مُغْلَقَةٌ ← المِصْبَاحُ يُضِيءُ</Ar>
      <rect x={40} y={120} width={70} height={36} rx="6" fill="#fde68a" stroke={INK} strokeWidth="2.5" />
      <Num x={57} y={144} size={14}>+</Num><Num x={93} y={144} size={14}>−</Num>
      <Ar x={75} y={176} size={12}>البَطَّارِيَّةُ</Ar>
      <path d="M75 120 V60 H180" fill="none" stroke={INK} strokeWidth="3" />
      <circle cx={200} cy={60} r="17" fill="#fef08a" stroke={GOLD} strokeWidth="3" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <line key={a} x1={200 + 22 * Math.cos(a * Math.PI / 180)} y1={60 + 22 * Math.sin(a * Math.PI / 180)} x2={200 + 30 * Math.cos(a * Math.PI / 180)} y2={60 + 30 * Math.sin(a * Math.PI / 180)} stroke={GOLD} strokeWidth="2.5" />)}
      <Ar x={200} y={104} size={12}>المِصْبَاحُ</Ar>
      <path d="M220 60 H300 V138 H250" fill="none" stroke={INK} strokeWidth="3" />
      <circle cx={246} cy={138} r="4" fill={INK} /><circle cx={198} cy={138} r="4" fill={INK} />
      <line x1={198} y1={138} x2={246} y2={138} stroke={GREEN} strokeWidth="4" />
      <Ar x={222} y={128} size={11.5} fill={GREEN}>قَاطِعَةٌ مُغْلَقَةٌ</Ar>
      <path d="M198 138 H110" fill="none" stroke={INK} strokeWidth="3" />
      <rect x={18} y={188} width={168} height={40} rx="10" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" />
      <Ar x={102} y={213} size={12} fill={GREEN}>نَاقِلٌ: حَدِيدٌ، نُحَاسٌ، نُقُودٌ</Ar>
      <rect x={194} y={188} width={168} height={40} rx="10" fill="#f1f5f9" stroke={MUTED} strokeWidth="2" />
      <Ar x={278} y={213} size={12} fill={MUTED}>عَازِلٌ: خَشَبٌ، بْلَاسْتِيكٌ، زُجَاجٌ</Ar>
    </Frame>
  );
}

// 7. Four safety rules at home.
function ElectricalSafety() {
  const rules = [
    { e: '✋💧', t: 'لَا أَلْمُسُ الكَهْرَبَاءَ بِيَدٍ مَبْلُولَةٍ' },
    { e: '🔌', t: 'أَنْزِعُ القَابِسَ قَبْلَ التَّنْظِيفِ' },
    { e: '🛡️', t: 'أَغْطِيَةٌ عَلَى المَآخِذِ' },
    { e: '⚡', t: 'لَا أَجْهِزَةَ كَثِيرَةً فِي مَأْخَذٍ وَاحِدٍ' },
  ];
  return (
    <Frame label="قواعد الأمن الكهربائي في المنزل" height={236}>
      <Ar x={190} y={26} size={15}>المَاءُ وَالكَهْرَبَاءُ لَا يَجْتَمِعَانِ</Ar>
      {rules.map((r, i) => {
        const x = i % 2 === 0 ? 196 : 18;
        const y = 42 + Math.floor(i / 2) * 92;
        return (
          <g key={r.t}>
            <rect x={x} y={y} width={166} height={82} rx="14" fill="#fff" stroke={i === 0 ? ORANGE : BLUE} strokeWidth="2.5" />
            <Emoji x={x + 83} y={y + 36} size={26}>{r.e}</Emoji>
            <Ar x={x + 83} y={y + 66} size={11.5}>{r.t}</Ar>
          </g>
        );
      })}
    </Frame>
  );
}

// 8. Renewable and non-renewable energy.
function RenewableEnergy() {
  return (
    <Frame label="مصادر الطاقة المتجددة وغير المتجددة" height={226}>
      <rect x={196} y={14} width={166} height={198} rx="14" fill="#ecfdf5" stroke={GREEN} strokeWidth="2.5" />
      <rect x={18} y={14} width={166} height={198} rx="14" fill="#f8fafc" stroke={MUTED} strokeWidth="2.5" />
      <Ar x={279} y={40} size={14} fill={GREEN}>مُتَجَدِّدَةٌ: لَا تَنْفَدُ</Ar>
      <Ar x={101} y={40} size={14} fill={MUTED}>غَيْرُ مُتَجَدِّدَةٍ: تَنْفَدُ</Ar>
      {[['☀️', 'الشَّمْسُ'], ['🌬️', 'الرِّيَاحُ'], ['💧', 'المَاءُ']].map(([e, t], i) => (
        <g key={t}><Emoji x={330} y={84 + i * 46} size={26}>{e}</Emoji><Ar x={290} y={78 + i * 46} size={13} anchor="start">{t}</Ar></g>
      ))}
      {[['🛢️', 'البِتْرُولُ'], ['🔥', 'الغَازُ الطَّبِيعِيُّ'], ['⚫', 'الفَحْمُ']].map(([e, t], i) => (
        <g key={t}><Emoji x={152} y={84 + i * 46} size={26}>{e}</Emoji><Ar x={112} y={78 + i * 46} size={13} anchor="start">{t}</Ar></g>
      ))}
      <Ar x={279} y={204} size={11.5} fill={GREEN}>نَظِيفَةٌ تَقْرِيباً</Ar>
      <Ar x={101} y={204} size={11.5} fill={MUTED}>تُلَوِّثُ الهَوَاءَ</Ar>
    </Frame>
  );
}

// 9. Separating mixtures: filtering and evaporating.
function MatterMixtures() {
  return (
    <Frame label="فصل المخاليط: الترشيح للماء والرمل، والتبخير للماء والملح" height={236}>
      <Ar x={279} y={28} size={13.5} fill={SOIL}>مَاءٌ + رَمْلٌ: التَّرْشِيحُ</Ar>
      <path d="M244 52 h70 l-28 40 v20 h-14 v-20 z" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <path d="M254 58 h50 l-25 32 z" fill="#fde68a" stroke={SOIL} strokeWidth="1.5" />
      <Ar x={364} y={126} size={11} anchor="start" fill={MUTED}>وَرَقُ تَرْشِيحٍ</Ar>
      <path d="M254 136 v52 h52 v-52" fill="none" stroke={INK} strokeWidth="2.5" />
      <rect x={256} y={156} width={48} height={30} fill={SKY} />
      <line x1={279} y1={112} x2={279} y2={150} stroke={'#38bdf8'} strokeWidth="2" strokeDasharray="3 3" />
      <Ar x={279} y={212} size={12} fill={BLUE}>مَاءٌ صَافٍ يَنْزِلُ</Ar>
      <line x1={190} y1={20} x2={190} y2={222} stroke="#e7e2d7" strokeWidth="2" />
      <Ar x={101} y={28} size={13.5} fill={ORANGE}>مَاءٌ + مِلْحٌ: التَّبْخِيرُ</Ar>
      <path d="M58 110 h86 l-8 24 h-70 z" fill={SKY} stroke={INK} strokeWidth="2.5" />
      {[78, 100, 122].map(x => <path key={x} d={`M${x} 102 q-6 -10 0 -20 q6 -10 0 -20`} fill="none" stroke={'#94a3b8'} strokeWidth="2" />)}
      <Ar x={101} y={46} size={11.5} fill={MUTED}>يَتَبَخَّرُ المَاءُ</Ar>
      <Emoji x={101} y={170} size={24}>🔥</Emoji>
      <Ar x={101} y={198} size={12} fill={ORANGE}>يَبْقَى المِلْحُ فِي القَاعِ</Ar>
      {[76, 90, 104, 118].map(x => <rect key={x} x={x} y={128} width={6} height={4} fill="#fff" stroke={MUTED} strokeWidth="0.8" />)}
    </Frame>
  );
}

// 10. Sexual reproduction (flower to plant) and cuttings.
function PlantReproduction() {
  const steps = [
    { e: '🌸', t: 'زَهْرَةٌ' },
    { e: '🐝', t: 'تَلْقِيحٌ' },
    { e: '🌰', t: 'بِذْرَةٌ' },
    { e: '🌱', t: 'إِنْبَاتٌ' },
  ];
  return (
    <Frame label="التكاثر الجنسي عند النبات من الزهرة إلى النبتة، والتكاثر اللاجنسي بالعقلة والترقيد" height={236}>
      <Ar x={362} y={28} size={13.5} anchor="start" fill={VIOLET}>تَكَاثُرٌ جِنْسِيٌّ</Ar>
      {steps.map((s, i) => {
        const x = 318 - i * 88;
        return (
          <g key={s.t}>
            <circle cx={x} cy={70} r="26" fill="#faf5ff" stroke={VIOLET} strokeWidth="2" />
            <Emoji x={x} y={80} size={24}>{s.e}</Emoji>
            <Ar x={x} y={114} size={12}>{s.t}</Ar>
            {i < 3 && <Arrow x1={x - 30} y1={70} x2={x - 56} y2={70} color={VIOLET} />}
          </g>
        );
      })}
      <Ar x={362} y={146} size={13.5} anchor="start" fill={GREEN}>تَكَاثُرٌ لَا جِنْسِيٌّ: بِلَا زَهْرَةٍ وَلَا بِذْرَةٍ</Ar>
      <rect x={196} y={158} width={166} height={66} rx="12" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" />
      <Ar x={279} y={184} size={13} fill={GREEN}>العُقْلَةُ</Ar>
      <Ar x={279} y={206} size={11}>نَقْطَعُ جُزْءاً مِنَ السَّاقِ وَنَغْرِسُهُ</Ar>
      <rect x={18} y={158} width={166} height={66} rx="12" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" />
      <Ar x={101} y={184} size={13} fill={GREEN}>التَّرْقِيدُ</Ar>
      <Ar x={101} y={206} size={11}>نَدْفِنُ غُصْناً مُتَّصِلاً بِالأُمِّ</Ar>
    </Frame>
  );
}

// 11. Grafting and tubers.
function GraftingTubers() {
  return (
    <Frame label="التطعيم يجمع الطعم والأصل، والدرنة تنبت نبتة جديدة" height={236}>
      <Ar x={279} y={28} size={14} fill={GREEN}>التَّطْعِيمُ</Ar>
      <rect x={270} y={110} width={18} height={84} fill="#a16207" />
      <path d="M279 194 l-20 30 M279 194 l20 30 M279 194 v34" stroke={SOIL} strokeWidth="3" />
      <rect x={272} y={62} width={14} height={52} fill="#84cc16" />
      <rect x={266} y={104} width={26} height={12} rx="3" fill="#fde68a" stroke={GOLD} strokeWidth="2" />
      <circle cx={279} cy={56} r="14" fill="#86efac" stroke={LEAF} strokeWidth="2" />
      <Ar x={334} y={72} size={12} anchor="start" fill={LEAF}>الطُّعْمُ</Ar>
      <Ar x={334} y={88} size={10.5} anchor="start" fill={MUTED}>ثِمَارٌ جَيِّدَةٌ</Ar>
      <Ar x={334} y={160} size={12} anchor="start" fill={SOIL}>الأَصْلُ</Ar>
      <Ar x={334} y={176} size={10.5} anchor="start" fill={MUTED}>جُذُورٌ قَوِيَّةٌ</Ar>
      <line x1={190} y1={20} x2={190} y2={226} stroke="#e7e2d7" strokeWidth="2" />
      <Ar x={101} y={28} size={14} fill={'#a16207'}>الدَّرَنَةُ (البَطَاطَا)</Ar>
      <ellipse cx={101} cy={140} rx={56} ry={36} fill="#fcd34d" stroke={SOIL} strokeWidth="2.5" />
      {[[80, 128], [116, 150], [108, 122]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill={SOIL} />)}
      <path d="M108 122 q4 -30 -6 -54" fill="none" stroke={LEAF} strokeWidth="3" />
      <path d="M102 74 c-14 -6 -18 -16 -8 -20 c8 2 10 12 8 20 z" fill="#86efac" stroke={LEAF} strokeWidth="1.5" />
      <Ar x={101} y={204} size={11.5} fill={MUTED}>تُنْبِتُ مِنْ عُيُونِهَا نَبْتَةً جَدِيدَةً</Ar>
    </Frame>
  );
}

// 12. Egg-laying and live-bearing animals.
function AnimalReproduction() {
  return (
    <Frame label="الحيوانات البيوضة والحيوانات الولودة" height={220}>
      <rect x={196} y={14} width={166} height={190} rx="14" fill="#fff7ed" stroke={ORANGE} strokeWidth="2.5" />
      <rect x={18} y={14} width={166} height={190} rx="14" fill="#eff6ff" stroke={BLUE} strokeWidth="2.5" />
      <Ar x={279} y={40} size={14} fill={ORANGE}>بَيُوضَةٌ 🥚</Ar>
      <Ar x={279} y={60} size={11} fill={MUTED}>الجَنِينُ يَنْمُو فِي بَيْضَةٍ</Ar>
      <Ar x={101} y={40} size={14} fill={BLUE}>وَلُودَةٌ</Ar>
      <Ar x={101} y={60} size={11} fill={MUTED}>الجَنِينُ يَنْمُو دَاخِلَ أُمِّهِ</Ar>
      {[['🐔', 'الدَّجَاجَةُ'], ['🐢', 'السُّلَحْفَاةُ'], ['🐟', 'السَّمَكَةُ'], ['🐸', 'الضِّفْدَعُ']].map(([e, t], i) => (
        <g key={t}><Emoji x={240 + (i % 2) * 78} y={104 + Math.floor(i / 2) * 58} size={28}>{e}</Emoji><Ar x={240 + (i % 2) * 78} y={124 + Math.floor(i / 2) * 58} size={11}>{t}</Ar></g>
      ))}
      {[['🐱', 'القِطَّةُ'], ['🐰', 'الأَرْنَبُ'], ['🐄', 'البَقَرَةُ'], ['👶', 'الإِنْسَانُ']].map(([e, t], i) => (
        <g key={t}><Emoji x={62 + (i % 2) * 78} y={104 + Math.floor(i / 2) * 58} size={28}>{e}</Emoji><Ar x={62 + (i % 2) * 78} y={124 + Math.floor(i / 2) * 58} size={11}>{t}</Ar></g>
      ))}
    </Frame>
  );
}

// 13. Air takes up space and keeps fire burning.
function AirProperties() {
  return (
    <Frame label="الهواء يشغل حيزاً، والاحتراق يحتاج أكسجين الهواء" height={232}>
      <Ar x={279} y={28} size={13.5} fill={BLUE}>الهَوَاءُ يَشْغَلُ حَيِّزاً</Ar>
      <rect x={226} y={110} width={110} height={80} fill={SKY} stroke={'#38bdf8'} strokeWidth="2" />
      <path d="M254 70 v80 h50 v-80" fill="#fff" fillOpacity="0.4" stroke={INK} strokeWidth="2.5" />
      <rect x={256} y={72} width={46} height={58} fill="#fff" />
      <Ar x={279} y={104} size={12} fill={MUTED}>هَوَاءٌ</Ar>
      <Ar x={279} y={214} size={11.5} fill={MUTED}>المَاءُ لَا يَدْخُلُ الكَأْسَ المَقْلُوبَ</Ar>
      <line x1={190} y1={20} x2={190} y2={222} stroke="#e7e2d7" strokeWidth="2" />
      <Ar x={101} y={28} size={13.5} fill={ORANGE}>النَّارُ تَحْتَاجُ الأُكْسِجِينَ</Ar>
      <rect x={60} y={130} width={14} height={50} fill="#fff" stroke={INK} strokeWidth="2" />
      <path d="M67 128 c-6 -10 0 -18 0 -24 c6 8 8 16 0 24 z" fill="#fb923c" />
      <Ar x={67} y={198} size={11}>تَشْتَعِلُ</Ar>
      <rect x={122} y={130} width={14} height={50} fill="#fff" stroke={INK} strokeWidth="2" />
      <path d="M106 182 v-80 a23 23 0 0 1 46 0 v80" fill="#e2e8f0" fillOpacity="0.5" stroke={INK} strokeWidth="2.5" />
      <path d="M129 124 q4 -10 -2 -18" fill="none" stroke={'#94a3b8'} strokeWidth="2" />
      <Ar x={129} y={198} size={11}>تَنْطَفِئُ</Ar>
      <Ar x={101} y={214} size={11.5} fill={MUTED}>تَحْتَ الكَأْسِ يَنْفَدُ الأُكْسِجِينُ</Ar>
    </Frame>
  );
}

// 14. The water cycle.
function WaterCycle() {
  return (
    <Frame label="دورة الماء في الطبيعة: تبخر ثم تكاثف ثم هطول" height={236}>
      <rect x={2} y={170} width={376} height={64} fill="#bae6fd" />
      <Ar x={300} y={210} size={13} fill={BLUE}>البَحْرُ</Ar>
      <Emoji x={340} y={52} size={34}>☀️</Emoji>
      {[250, 280, 310].map(x => <Arrow key={x} x1={x} y1={164} x2={x - 30} y2={96} color={'#f59e0b'} />)}
      <Ar x={300} y={130} size={12.5} fill={'#b45309'} anchor="start">تَبَخُّرٌ</Ar>
      <path d="M120 70 a22 22 0 0 1 40 -10 a26 26 0 0 1 48 10 a18 18 0 0 1 0 34 h-88 a18 18 0 0 1 0 -34 z" fill="#f1f5f9" stroke={MUTED} strokeWidth="2" />
      <Ar x={164} y={92} size={12.5} fill={MUTED}>تَكَاثُفٌ</Ar>
      {[110, 130, 150, 170].map(x => <line key={x} x1={x} y1={116} x2={x - 8} y2={146} stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" />)}
      <Ar x={60} y={134} size={12.5} fill={BLUE}>هُطُولٌ</Ar>
      <path d="M20 160 q40 -10 70 2 t90 8" fill="none" stroke={BLUE} strokeWidth="5" />
      <Ar x={84} y={196} size={12} fill={BLUE}>الوِدْيَانُ تَعُودُ إِلَى البَحْرِ</Ar>
      <Ar x={190} y={226} size={12} fill={INK}>سَائِلٌ ← غَازٌ ← سَائِلٌ… رِحْلَةٌ لَا تَتَوَقَّفُ</Ar>
    </Frame>
  );
}

// 15. Sorting waste.
function PollutionWaste() {
  const bins = [
    { e: '📄', t: 'وَرَقٌ', c: BLUE, out: 'تَدْوِيرٌ' },
    { e: '🧴', t: 'بْلَاسْتِيكٌ', c: GOLD, out: 'تَدْوِيرٌ' },
    { e: '🍎', t: 'بَقَايَا عُضْوِيَّةٌ', c: LEAF, out: 'سَمَادٌ (كُومْبُوسْت)' },
  ];
  return (
    <Frame label="فرز النفايات: الورق والبلاستيك للتدوير والبقايا العضوية للسماد" height={226}>
      <Ar x={190} y={26} size={15}>أُفْرِزُ نُفَايَاتِي</Ar>
      {bins.map((b, i) => {
        const x = 300 - i * 122;
        return (
          <g key={b.t}>
            <rect x={x - 46} y={50} width={92} height={18} rx="5" fill={b.c} />
            <path d={`M${x - 40} 68 h80 l-8 92 h-64 z`} fill={`${b.c}22`} stroke={b.c} strokeWidth="2.5" />
            <Emoji x={x} y={116} size={30}>{b.e}</Emoji>
            <Ar x={x} y={146} size={12}>{b.t}</Ar>
            <Ar x={x} y={186} size={12} fill={b.c === GOLD ? '#a16207' : b.c}>{`♻ ${b.out}`}</Ar>
          </g>
        );
      })}
      <Ar x={190} y={212} size={12} fill={MUTED}>هَوَاءٌ وَمَاءٌ وَتُرْبَةٌ نَظِيفَةٌ</Ar>
    </Frame>
  );
}

export const SCIENCE_5AP_ILLUSTRATIONS: Record<string, React.FC> = {
  'science-5ap-respiration-health': RespirationHealth,
  'science-5ap-circulation-heart': CirculationHeart,
  'science-5ap-nutrition-health': NutritionHealth,
  'science-5ap-plant-nutrition': PlantNutrition,
  'science-5ap-plant-adaptation': PlantAdaptation,
  'science-5ap-electric-circuit': ElectricCircuit,
  'science-5ap-electrical-safety': ElectricalSafety,
  'science-5ap-renewable-energy': RenewableEnergy,
  'science-5ap-matter-mixtures': MatterMixtures,
  'science-5ap-plant-reproduction': PlantReproduction,
  'science-5ap-grafting-tubers': GraftingTubers,
  'science-5ap-animal-reproduction': AnimalReproduction,
  'science-5ap-air-properties': AirProperties,
  'science-5ap-water-cycle': WaterCycle,
  'science-5ap-pollution-waste-treatment': PollutionWaste,
};
