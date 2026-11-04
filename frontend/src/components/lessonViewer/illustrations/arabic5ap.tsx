import React from 'react';
import { Ar, Frame, BLUE, GOLD, GREEN, INK, MUTED, ORANGE, VIOLET } from './svgKit';

/**
 * Drawings made for each 5AP Arabic lesson (V2 « contenu enrichi », docs/v2-design-monde.md).
 * One colour per case everywhere: blue = مرفوع, green = منصوب, orange = مجرور, grey = no case shown.
 * Sentences read right to left: the first word is drawn on the right.
 */
type Case = 'raf' | 'nasb' | 'jarr' | 'neutral';
const CASES: Record<Case, { fill: string; stroke: string; label: string }> = {
  raf: { fill: '#dbeafe', stroke: BLUE, label: 'مَرْفُوعٌ' },
  nasb: { fill: '#dcfce7', stroke: GREEN, label: 'مَنْصُوبٌ' },
  jarr: { fill: '#ffedd5', stroke: ORANGE, label: 'مَجْرُورٌ' },
  neutral: { fill: '#f1f5f9', stroke: '#64748b', label: '' },
};

type Word = { w: string; role?: string; c: Case; ghost?: boolean };
const bare = (s: string) => s.replace(/[ً-ْٰ]/g, '');

function layout(words: Word[], size: number, right: number, gap: number) {
  let x = right;
  return words.map(word => {
    const w = Math.max(bare(word.w).length * size * 0.6 + 22, word.role ? bare(word.role).length * 6.6 + 14 : 0, 46);
    const left = x - w;
    x = left - gap;
    return { left, w, cx: left + w / 2 };
  });
}

/** A sentence as coloured word blocks, its role written under each word. */
function Sentence({ words, y, size = 18, right = 362, gap = 8 }: { words: Word[]; y: number; size?: number; right?: number; gap?: number }) {
  const boxes = layout(words, size, right, gap);
  return (
    <g>
      {words.map((word, i) => {
        const { left, w, cx } = boxes[i];
        const cs = CASES[word.c];
        return (
          <g key={i} opacity={word.ghost ? 0.55 : 1}>
            <rect x={left} y={y} width={w} height={size + 20} rx="10" fill={word.ghost ? '#fff' : cs.fill} stroke={cs.stroke} strokeWidth="2.5" strokeDasharray={word.ghost ? '6 4' : undefined} />
            <Ar x={cx} y={y + size + 5} size={size}>{word.w}</Ar>
            {word.role && <Ar x={cx} y={y + size + 38} size={11.5} fill={cs.stroke}>{word.role}</Ar>}
          </g>
        );
      })}
    </g>
  );
}

function Legend({ y, cases = ['raf', 'nasb', 'jarr'] }: { y: number; cases?: Case[] }) {
  return (
    <g>
      {cases.map((c, i) => {
        const x = 300 - i * 96;
        return (
          <g key={c}>
            <rect x={x} y={y - 13} width={70} height={20} rx="10" fill={CASES[c].fill} stroke={CASES[c].stroke} strokeWidth="1.5" />
            <Ar x={x + 35} y={y + 2} size={11.5} fill={CASES[c].stroke}>{CASES[c].label}</Ar>
          </g>
        );
      })}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = MUTED }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 8;
  const p1 = `${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)}`;
  const p2 = `${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${p1} ${p2}`} fill={color} />
    </g>
  );
}

/** A small table whose first column is on the right. */
function Table({ y, cols, rows, rowH = 30, header }: { y: number; cols: number[]; rows: React.ReactNode[][]; rowH?: number; header?: string[] }) {
  const right = 362;
  const xs: number[] = [];
  let x = right;
  cols.forEach(w => { xs.push(x - w); x -= w; });
  const all = header ? [header, ...rows] : rows;
  return (
    <g>
      {all.map((row, r) => (
        <g key={r}>
          {row.map((cell, c) => (
            <g key={c}>
              <rect x={xs[c]} y={y + r * rowH} width={cols[c]} height={rowH} fill={header && r === 0 ? '#fde68a' : r % 2 ? '#fff' : '#fffdf7'} stroke="#e2d9c3" />
              {typeof cell === 'string'
                ? <Ar x={xs[c] + cols[c] / 2} y={y + r * rowH + rowH / 2 + 5} size={header && r === 0 ? 12 : 14} fill={c === 0 ? MUTED : INK}>{cell}</Ar>
                : cell}
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

// 1. Nominal and verbal sentences.
function SentenceComponents() {
  return (
    <Frame label="أول كلمة تحدد نوع الجملة: فعلية أو اسمية" height={244}>
      <Ar x={190} y={26} size={15}>أَوَّلُ كَلِمَةٍ تُحَدِّدُ نَوْعَ الجُمْلَةِ</Ar>
      <Ar x={362} y={52} size={12.5} anchor="start" fill={MUTED}>جُمْلَةٌ فِعْلِيَّةٌ: تَبْدَأُ بِفِعْلٍ</Ar>
      <Sentence y={60} words={[{ w: 'قَرَأَ', role: 'فِعْلٌ', c: 'neutral' }, { w: 'التِّلْمِيذُ', role: 'فَاعِلٌ', c: 'raf' }, { w: 'الدَّرْسَ', role: 'مَفْعُولٌ بِهِ', c: 'nasb' }]} />
      <Ar x={362} y={140} size={12.5} anchor="start" fill={MUTED}>جُمْلَةٌ اسْمِيَّةٌ: تَبْدَأُ بِاسْمٍ</Ar>
      <Sentence y={148} words={[{ w: 'العِلْمُ', role: 'مُبْتَدَأٌ', c: 'raf' }, { w: 'نُورٌ', role: 'خَبَرٌ', c: 'raf' }]} />
      <Legend y={228} />
    </Frame>
  );
}

// 2. كان and إنّ swap the cases of their two parts.
function KanInna() {
  return (
    <Frame label="كان ترفع الاسم وتنصب الخبر، وإن تنصب الاسم وترفع الخبر" height={244}>
      <Ar x={190} y={26} size={15}>النَّاسِخُ يُغَيِّرُ حَرَكَةَ الجُمْلَةِ الاسْمِيَّةِ</Ar>
      <Ar x={362} y={52} size={12.5} anchor="start" fill={MUTED}>كَانَ: تَرْفَعُ الاسْمَ وَتَنْصِبُ الخَبَرَ</Ar>
      <Sentence y={60} words={[{ w: 'كَانَ', role: 'فِعْلٌ نَاسِخٌ', c: 'neutral' }, { w: 'الجَوُّ', role: 'اسْمُ كَانَ', c: 'raf' }, { w: 'جَمِيلاً', role: 'خَبَرُ كَانَ', c: 'nasb' }]} />
      <Ar x={362} y={140} size={12.5} anchor="start" fill={MUTED}>إِنَّ: تَنْصِبُ الاسْمَ وَتَرْفَعُ الخَبَرَ</Ar>
      <Sentence y={148} words={[{ w: 'إِنَّ', role: 'حَرْفٌ نَاسِخٌ', c: 'neutral' }, { w: 'الجَوَّ', role: 'اسْمُ إِنَّ', c: 'nasb' }, { w: 'جَمِيلٌ', role: 'خَبَرُ إِنَّ', c: 'raf' }]} />
      <Legend y={228} cases={['raf', 'nasb']} />
    </Frame>
  );
}

// 3. Passive voice: the subject leaves, the object takes its place.
function PassiveVoice() {
  const top: Word[] = [{ w: 'كَتَبَ', role: 'فِعْلٌ', c: 'neutral' }, { w: 'التِّلْمِيذُ', role: 'فَاعِلٌ', c: 'raf', ghost: true }, { w: 'الدَّرْسَ', role: 'مَفْعُولٌ بِهِ', c: 'nasb' }];
  const bottom: Word[] = [{ w: 'كُتِبَ', role: 'مَبْنِيٌّ لِلْمَجْهُولِ', c: 'neutral' }, { w: 'الدَّرْسُ', role: 'نَائِبُ فَاعِلٍ', c: 'raf' }];
  const a = layout(top, 18, 362, 8)[2];
  const b = layout(bottom, 18, 362, 8)[1];
  return (
    <Frame label="المبني للمجهول: يحذف الفاعل ويصير المفعول به نائب فاعل مرفوعاً" height={260}>
      <Ar x={190} y={26} size={15}>اِخْتَفَى الفَاعِلُ… فَمَنْ يَنُوبُ عَنْهُ؟</Ar>
      <Sentence y={44} words={top} />
      <Arrow x1={a.cx} y1={108} x2={b.cx} y2={146} color={VIOLET} />
      <Sentence y={150} words={bottom} />
      <Ar x={190} y={230} size={12.5} fill={MUTED}>كُتِبَ: يُضَمُّ أَوَّلُهُ وَيُكْسَرُ مَا قَبْلَ آخِرِهِ</Ar>
      <Ar x={190} y={250} size={12.5} fill={VIOLET}>المَفْعُولُ بِهِ يَصِيرُ نَائِبَ فَاعِلٍ مَرْفُوعاً</Ar>
    </Frame>
  );
}

// 4. Annexation (a chain) and the adjective (a shadow).
function AnnexationAdjective() {
  const chain = layout([{ w: 'كِتَابُ', role: 'مُضَافٌ', c: 'neutral' }, { w: 'التِّلْمِيذِ', role: 'مُضَافٌ إِلَيْهِ', c: 'jarr' }], 18, 362, 22);
  return (
    <Frame label="المضاف إليه مجرور دائماً، والصفة تتبع الموصوف" height={256}>
      <Ar x={362} y={26} size={13} anchor="start" fill={MUTED}>المُضَافُ إِلَيْهِ مَجْرُورٌ دَائِماً</Ar>
      <Sentence y={34} gap={22} words={[{ w: 'كِتَابُ', role: 'مُضَافٌ', c: 'neutral' }, { w: 'التِّلْمِيذِ', role: 'مُضَافٌ إِلَيْهِ', c: 'jarr' }]} />
      <circle cx={chain[0].left - 5} cy={53} r="7" fill="none" stroke={GOLD} strokeWidth="3" />
      <circle cx={chain[0].left - 15} cy={53} r="7" fill="none" stroke={GOLD} strokeWidth="3" />
      <Ar x={362} y={124} size={13} anchor="start" fill={MUTED}>الصِّفَةُ تَتْبَعُ مَوْصُوفَهَا كَظِلِّهِ</Ar>
      <Sentence y={132} words={[{ w: 'رَأَيْتُ', role: 'فِعْلٌ وَفَاعِلٌ', c: 'neutral' }, { w: 'المَتْحَفَ', role: 'مَوْصُوفٌ', c: 'nasb' }, { w: 'الوَطَنِيَّ', role: 'صِفَةٌ', c: 'nasb' }]} />
      {['الإِعْرَابُ', 'التَّعْرِيفُ', 'التَّذْكِيرُ', 'العَدَدُ'].map((t, i) => (
        <g key={t}>
          <rect x={286 - i * 88} y={218} width={76} height={24} rx="12" fill="#ecfdf5" stroke={GREEN} />
          <Ar x={324 - i * 88} y={235} size={12} fill={GREEN}>{`✓ ${t}`}</Ar>
        </g>
      ))}
    </Frame>
  );
}

// 5. الحال, the five nouns and the five verbs.
function HalFiveNamesVerbs() {
  const hal = layout([{ w: 'دَخَلَ', c: 'neutral' }, { w: 'التِّلْمِيذُ', c: 'raf' }, { w: 'مُبْتَسِماً', role: 'حَالٌ', c: 'nasb' }], 17, 362, 8);
  return (
    <Frame label="الحال تجيب عن كيف، والأسماء الخمسة والأفعال الخمسة تعرب بالحروف" height={262}>
      <rect x={hal[2].cx - 30} y={8} width={60} height={24} rx="12" fill="#fef9c3" stroke={GOLD} strokeWidth="2" />
      <Ar x={hal[2].cx} y={25} size={13}>كَيْفَ؟</Ar>
      <Sentence y={38} size={17} words={[{ w: 'دَخَلَ', role: 'فِعْلٌ', c: 'neutral' }, { w: 'التِّلْمِيذُ', role: 'صَاحِبُ الحَالِ', c: 'raf' }, { w: 'مُبْتَسِماً', role: 'حَالٌ', c: 'nasb' }]} />
      <Ar x={362} y={124} size={13} anchor="start" fill={MUTED}>الأَسْمَاءُ الخَمْسَةُ تُعْرَبُ بِالحُرُوفِ</Ar>
      {[
        { t: 'جَاءَ أَبُوكَ', k: 'و', c: 'raf' as Case },
        { t: 'رَأَيْتُ أَبَاكَ', k: 'ا', c: 'nasb' as Case },
        { t: 'مَرَرْتُ بِأَبِيكَ', k: 'ي', c: 'jarr' as Case },
      ].map((r, i) => (
        <g key={r.k}>
          <rect x={246 - i * 116} y={134} width={108} height={52} rx="12" fill={CASES[r.c].fill} stroke={CASES[r.c].stroke} strokeWidth="2" />
          <Ar x={300 - i * 116} y={156} size={14}>{r.t}</Ar>
          <Ar x={300 - i * 116} y={177} size={12} fill={CASES[r.c].stroke}>{`${CASES[r.c].label} بِـ«${r.k}»`}</Ar>
        </g>
      ))}
      <Ar x={362} y={210} size={13} anchor="start" fill={MUTED}>الأَفْعَالُ الخَمْسَةُ</Ar>
      <rect x={196} y={218} width={166} height={32} rx="12" fill={CASES.raf.fill} stroke={BLUE} strokeWidth="2" />
      <Ar x={279} y={239} size={13}>يَكْتُبُونَ: ثُبُوتُ النُّونِ</Ar>
      <rect x={18} y={218} width={170} height={32} rx="12" fill={CASES.nasb.fill} stroke={GREEN} strokeWidth="2" />
      <Ar x={103} y={239} size={13}>لَنْ يَكْتُبُوا: حَذْفُ النُّونِ</Ar>
    </Frame>
  );
}

/** Three letter boxes, right to left, the weak letter coloured. */
function Root({ x, y, letters, weak }: { x: number; y: number; letters: string[]; weak?: number }) {
  return (
    <g>
      {letters.map((l, i) => (
        <g key={i}>
          <rect x={x - (i + 1) * 30} y={y} width={26} height={30} rx="6" fill={i === weak ? '#fde68a' : '#fff'} stroke={i === weak ? ORANGE : '#cbd5e1'} strokeWidth="2" />
          <Ar x={x - (i + 1) * 30 + 13} y={y + 21} size={16} fill={i === weak ? ORANGE : INK}>{l}</Ar>
        </g>
      ))}
    </g>
  );
}

// 6. Sound and weak verbs: where is the weak letter?
function MorphologyVerbs() {
  const sound = [
    { n: 'سَالِمٌ', v: 'كَتَبَ', l: ['ك', 'ت', 'ب'] },
    { n: 'مَهْمُوزٌ', v: 'أَكَلَ', l: ['أ', 'ك', 'ل'] },
    { n: 'مُضَعَّفٌ', v: 'شَدَّ', l: ['ش', 'د', 'د'] },
  ];
  const weak = [
    { n: 'مِثَالٌ (أَوَّلُهُ)', v: 'وَصَلَ', l: ['و', 'ص', 'ل'], k: 0 },
    { n: 'أَجْوَفُ (وَسَطُهُ)', v: 'قَالَ', l: ['ق', 'ا', 'ل'], k: 1 },
    { n: 'نَاقِصٌ (آخِرُهُ)', v: 'سَعَى', l: ['س', 'ع', 'ى'], k: 2 },
  ];
  return (
    <Frame label="الفعل الصحيح والفعل المعتل حسب موضع حرف العلة" height={250}>
      <Ar x={282} y={28} size={15} fill={BLUE}>الفِعْلُ الصَّحِيحُ</Ar>
      <Ar x={98} y={28} size={15} fill={ORANGE}>الفِعْلُ المُعْتَلُّ</Ar>
      <line x1="190" y1="16" x2="190" y2="236" stroke="#e7e2d7" strokeWidth="2" />
      {sound.map((s, i) => (
        <g key={s.n}>
          <Ar x={362} y={70 + i * 66} size={13} anchor="start" fill={MUTED}>{s.n}</Ar>
          <Ar x={362} y={92 + i * 66} size={15} anchor="start">{s.v}</Ar>
          <Root x={296} y={56 + i * 66} letters={s.l} />
        </g>
      ))}
      {weak.map((s, i) => (
        <g key={s.n}>
          <Ar x={178} y={70 + i * 66} size={12} anchor="start" fill={MUTED}>{s.n}</Ar>
          <Ar x={178} y={92 + i * 66} size={15} anchor="start">{s.v}</Ar>
          <Root x={104} y={56 + i * 66} letters={s.l} weak={s.k} />
        </g>
      ))}
    </Frame>
  );
}

// 7. Jussive and imperative of the defective verb: the weak letter falls.
function MutalVerbsJazm() {
  return (
    <Frame label="المضارع المعتل الآخر يجزم بحذف حرف العلة، والأمر منه مثله" height={214}>
      <Ar x={190} y={26} size={15}>حَرْفُ العِلَّةِ يَسْقُطُ بَعْدَ «لَمْ» وَفِي الأَمْرِ</Ar>
      <Table
        y={40}
        cols={[90, 92, 92, 70]}
        header={['المُضَارِعُ', 'بَعْدَ «لَمْ»', 'الأَمْرُ', 'سَقَطَ']}
        rows={[
          ['يَدْعُو', 'لَمْ يَدْعُ', 'اُدْعُ', 'و'],
          ['يَرْمِي', 'لَمْ يَرْمِ', 'اِرْمِ', 'ي'],
          ['يَسْعَى', 'لَمْ يَسْعَ', 'اِسْعَ', 'ى'],
        ]}
        rowH={34}
      />
      {[0, 1, 2].map(i => (
        <circle key={i} cx={53} cy={91 + i * 34} r="13" fill="none" stroke={ORANGE} strokeWidth="2" strokeDasharray="4 3" />
      ))}
      <Ar x={190} y={200} size={12.5} fill={MUTED}>أَمَّا الصَّحِيحُ الآخِرِ فَيُجْزَمُ بِالسُّكُونِ: لَمْ يَكْتُبْ</Ar>
    </Frame>
  );
}

// 8. Bare and augmented verbs, active and passive participles.
function BareAugmentedParticiples() {
  return (
    <Frame label="اسم الفاعل واسم المفعول من الثلاثي ومن غير الثلاثي" height={228}>
      <Ar x={190} y={26} size={15}>مِنَ الفِعْلِ نَصْنَعُ اسْمَيْنِ</Ar>
      <Table
        y={40}
        cols={[110, 118, 118]}
        header={['الفِعْلُ', 'اسْمُ الفَاعِلِ', 'اسْمُ المَفْعُولِ']}
        rows={[
          ['كَتَبَ (ثُلَاثِيٌّ)', 'كَاتِبٌ', 'مَكْتُوبٌ'],
          ['أَكْرَمَ', 'مُكْرِمٌ', 'مُكْرَمٌ'],
          ['اِسْتَخْرَجَ', 'مُسْتَخْرِجٌ', 'مُسْتَخْرَجٌ'],
        ]}
        rowH={34}
      />
      <Ar x={190} y={192} size={12.5} fill={MUTED}>غَيْرُ الثُّلَاثِيِّ: مِيمٌ مَضْمُومَةٌ فِي أَوَّلِهِ</Ar>
      <Ar x={190} y={213} size={12.5} fill={VIOLET}>كَسْرَةٌ قَبْلَ الآخِرِ ← فَاعِلٌ · فَتْحَةٌ قَبْلَ الآخِرِ ← مَفْعُولٌ</Ar>
    </Frame>
  );
}

/** A basket of words for a sorting drawing. */
function Basket({ x, title, color, items }: { x: number; title: string; color: string; items: [string, string][] }) {
  return (
    <g>
      <circle cx={x + 82} cy={42} r="22" fill="#fff" stroke={color} strokeWidth="3" />
      <Ar x={x + 82} y={52} size={26} fill={color}>{title}</Ar>
      <path d={`M${x} 72 h164 l-14 128 h-136 z`} fill="#fffdf7" stroke={color} strokeWidth="2.5" />
      {items.map(([w, why], i) => (
        <g key={w}>
          <Ar x={x + 82} y={96 + i * 38} size={15}>{w}</Ar>
          <Ar x={x + 82} y={112 + i * 38} size={10.5} fill={MUTED}>{why}</Ar>
        </g>
      ))}
    </g>
  );
}

// 9. Open and tied ta.
function SpellingTaas() {
  return (
    <Frame label="التاء المفتوحة والتاء المربوطة" height={240}>
      <Basket x={198} title="ت" color={BLUE} items={[['خَرَجَتْ', 'فِي آخِرِ الفِعْلِ'], ['مُعَلِّمَاتٌ', 'جَمْعُ مُؤَنَّثٍ سَالِمٌ'], ['بَيْتٌ', 'ثُلَاثِيٌّ سَاكِنُ الوَسَطِ']]} />
      <Basket x={18} title="ة" color={VIOLET} items={[['مَدْرَسَةٌ', 'اسْمٌ مُفْرَدٌ مُؤَنَّثٌ'], ['قُضَاةٌ', 'مُفْرَدُهُ قَاضٍ']]} />
      <Ar x={190} y={226} size={12.5} fill={MUTED}>قِفْ عَلَى الكَلِمَةِ: إِنْ سَمِعْتَ هَاءً فَهِيَ «ة»</Ar>
    </Frame>
  );
}

// 10. The hamza ladder.
function SpellingHamzas() {
  const steps = [
    { v: 'الكَسْرَةُ', s: 'ئ', e: 'سُئِلَ' },
    { v: 'الضَّمَّةُ', s: 'ؤ', e: 'مُؤْمِنٌ' },
    { v: 'الفَتْحَةُ', s: 'أ', e: 'سَأَلَ' },
    { v: 'السُّكُونُ', s: '', e: '' },
  ];
  return (
    <Frame label="سلم قوة الحركات في كتابة الهمزة" height={250}>
      <Ar x={190} y={24} size={14.5}>الهَمْزَةُ المُتَوَسِّطَةُ: نَتْبَعُ أَقْوَى الحَرَكَتَيْنِ</Ar>
      {steps.map((st, i) => {
        const x = 274 - i * 86;
        const top = 50 + i * 30;
        return (
          <g key={st.v}>
            <rect x={x} y={top} width={82} height={194 - top} rx="8" fill={['#fde68a', '#fef3c7', '#fffbeb', '#f8fafc'][i]} stroke="#e2c66b" strokeWidth="2" />
            <Ar x={x + 41} y={top + 20} size={13}>{st.v}</Ar>
            {st.s && <Ar x={x + 41} y={top + 46} size={24} fill={ORANGE}>{st.s}</Ar>}
            {st.e && <Ar x={x + 41} y={top + 68} size={13} fill={MUTED}>{st.e}</Ar>}
          </g>
        );
      })}
      <Ar x={190} y={216} size={12.5} fill={MUTED}>المُتَطَرِّفَةُ: تَتْبَعُ حَرَكَةَ الحَرْفِ الَّذِي قَبْلَهَا</Ar>
      <Ar x={190} y={238} size={14}>شَاطِئٌ · يَجْرُؤُ · قَرَأَ · دِفْءٌ</Ar>
    </Frame>
  );
}

// 11. The plan of a written text.
function IntegrationWriting() {
  const parts = [
    { t: 'المُقَدِّمَةُ', n: 'سَطْرَانِ', d: 'تَمْهِيدٌ يُشَوِّقُ القَارِئَ', h: 2, c: BLUE },
    { t: 'العَرْضُ', n: '6 إِلَى 8 أَسْطُرٍ', d: 'الأَفْكَارُ وَالأَمْثِلَةُ وَأَدَوَاتُ الرَّبْطِ', h: 5, c: GREEN },
    { t: 'الخَاتِمَةُ', n: 'سَطْرَانِ', d: 'خُلَاصَةٌ أَوْ نَصِيحَةٌ أَوْ بَيْتُ شِعْرٍ', h: 2, c: VIOLET },
  ];
  let y = 40;
  return (
    <Frame label="بناء نص من 8 إلى 12 سطراً: مقدمة وعرض وخاتمة" height={282}>
      <Ar x={190} y={26} size={15}>نَصٌّ مِنْ 8 إِلَى 12 سَطْراً</Ar>
      {parts.map(p => {
        const h = p.h * 18 + 16;
        const top = y;
        y += h + 8;
        return (
          <g key={p.t}>
            <rect x={18} y={top} width={344} height={h} rx="10" fill="#fff" stroke={p.c} strokeWidth="2.5" />
            {Array.from({ length: p.h }, (_, i) => (
              <line key={i} x1={30} x2={220} y1={top + 18 + i * 18} y2={top + 18 + i * 18} stroke="#e2e8f0" strokeWidth="2" />
            ))}
            <Ar x={350} y={top + 22} size={14} anchor="start" fill={p.c}>{`${p.t} (${p.n})`}</Ar>
            <Ar x={350} y={top + 42} size={11.5} anchor="start" fill={MUTED}>{p.d}</Ar>
          </g>
        );
      })}
    </Frame>
  );
}

// 12. The three criteria of the official marking grid.
function WritingEvaluationGrid() {
  const rows = [
    { t: 'مَلَاءَمَةُ المُنْتُوجِ', q: 'هَلْ كَتَبْتُ مَا طَلَبَتْهُ التَّعْلِيمَةُ كُلَّهُ؟', c: BLUE },
    { t: 'اِنْسِجَامُ النَّصِّ', q: 'هَلْ أَفْكَارِي مُرَتَّبَةٌ وَمَرْبُوطَةٌ؟', c: GREEN },
    { t: 'سَلَامَةُ اللُّغَةِ', q: 'نَحْوٌ، صَرْفٌ، إِمْلَاءٌ، تَرْقِيمٌ', c: VIOLET },
  ];
  return (
    <Frame label="معايير شبكة التقييم الثلاثة" height={226}>
      <Ar x={190} y={26} size={15}>أُرَاجِعُ نَصِّي قَبْلَ أَنْ أُسَلِّمَهُ</Ar>
      {rows.map((r, i) => (
        <g key={r.t}>
          <rect x={18} y={42 + i * 60} width={344} height={52} rx="12" fill="#fff" stroke={r.c} strokeWidth="2.5" />
          <circle cx={340} cy={68 + i * 60} r="14" fill={r.c} />
          <Ar x={340} y={74 + i * 60} size={15} fill="#fff">{String(i + 1)}</Ar>
          <Ar x={318} y={64 + i * 60} size={14.5} anchor="start" fill={r.c}>{r.t}</Ar>
          <Ar x={318} y={84 + i * 60} size={12} anchor="start" fill={MUTED}>{r.q}</Ar>
          <rect x={32} y={56 + i * 60} width={24} height={24} rx="6" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" />
          <path d={`M37 ${69 + i * 60} l5 5 l9 -11`} fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </Frame>
  );
}

// 13. The three objects: each answers its own question.
function Maf3ulTypes() {
  const rows: { q: string; words: Word[] }[] = [
    { q: 'تَوْكِيدٌ', words: [{ w: 'رَكَضْتُ', c: 'neutral' }, { w: 'رَكْضاً', role: 'مَفْعُولٌ مُطْلَقٌ', c: 'nasb' }] },
    { q: 'لِمَاذَا؟', words: [{ w: 'وَقَفْتُ', c: 'neutral' }, { w: 'اِحْتِرَاماً', role: 'مَفْعُولٌ لِأَجْلِهِ', c: 'nasb' }] },
    { q: 'مَتَى؟ أَيْنَ؟', words: [{ w: 'جَلَسْتُ', c: 'neutral' }, { w: 'أَمَامَ', role: 'مَفْعُولٌ فِيهِ', c: 'nasb' }, { w: 'السَّبُّورَةِ', c: 'jarr' }] },
  ];
  return (
    <Frame label="المفعول المطلق ولأجله وفيه: كل واحد يجيب عن سؤال" height={244}>
      <Ar x={190} y={24} size={14.5}>ثَلَاثَةُ مَفَاعِيلَ مَنْصُوبَةٍ، لِكُلٍّ سُؤَالُهُ</Ar>
      {rows.map((r, i) => {
        const y = 36 + i * 70;
        return (
          <g key={r.q}>
            <Sentence y={y} size={16} words={r.words} right={362} />
            <rect x={18} y={y + 4} width={86} height={28} rx="14" fill="#fef9c3" stroke={GOLD} strokeWidth="2" />
            <Ar x={61} y={y + 23} size={13}>{r.q}</Ar>
          </g>
        );
      })}
    </Frame>
  );
}

// 14. التمييز removes the doubt.
function Tamyiz() {
  return (
    <Frame label="التمييز اسم منصوب يزيل الغموض بعد عدد أو وزن أو نسبة" height={262}>
      <Ar x={362} y={26} size={13} anchor="start" fill={MUTED}>عِشْرُونَ… مَاذَا؟</Ar>
      <Sentence y={34} words={[{ w: 'عِنْدِي', c: 'neutral' }, { w: 'عِشْرُونَ', role: 'عَدَدٌ مُبْهَمٌ', c: 'neutral' }, { w: '؟', c: 'nasb', ghost: true }]} />
      <Sentence y={104} words={[{ w: 'عِنْدِي', c: 'neutral' }, { w: 'عِشْرُونَ', c: 'neutral' }, { w: 'كِتَاباً', role: 'تَمْيِيزُ ذَاتٍ', c: 'nasb' }]} />
      <Ar x={362} y={188} size={13} anchor="start" fill={MUTED}>اِزْدَادَ فِي مَاذَا؟</Ar>
      <Sentence y={196} words={[{ w: 'اِزْدَادَ', c: 'neutral' }, { w: 'التِّلْمِيذُ', c: 'raf' }, { w: 'عِلْماً', role: 'تَمْيِيزُ نِسْبَةٍ', c: 'nasb' }]} />
    </Frame>
  );
}

// 15. Dual and sound plurals.
function MuthannaSoundPlurals() {
  return (
    <Frame label="المثنى وجمع المذكر السالم وجمع المؤنث السالم في الرفع والنصب والجر" height={218}>
      <Ar x={190} y={26} size={15}>طَالِبٌ ← طَالِبَانِ ← طُلَّابٌ أَوْ طَالِبُونَ</Ar>
      <Table
        y={40}
        cols={[124, 110, 112]}
        header={['النَّوْعُ', 'الرَّفْعُ', 'النَّصْبُ وَالجَرُّ']}
        rows={[
          ['المُثَنَّى', 'طَالِبَانِ', 'طَالِبَيْنِ'],
          ['جَمْعُ المُذَكَّرِ السَّالِمُ', 'مُعَلِّمُونَ', 'مُعَلِّمِينَ'],
          ['جَمْعُ المُؤَنَّثِ السَّالِمُ', 'مُعَلِّمَاتٌ', 'مُعَلِّمَاتٍ'],
        ]}
        rowH={34}
      />
      <Ar x={190} y={196} size={12.5} fill={MUTED}>المُثَنَّى وَجَمْعُ المُذَكَّرِ بِالحُرُوفِ، وَجَمْعُ المُؤَنَّثِ بِالحَرَكَاتِ</Ar>
    </Frame>
  );
}

// 16. Broken plural: the word changes shape.
function JamTaksir() {
  const pairs = [
    ['كِتَابٌ', 'كُتُبٌ', 'فُعُلٌ'],
    ['وَلَدٌ', 'أَوْلَادٌ', 'أَفْعَالٌ'],
    ['بَيْتٌ', 'بُيُوتٌ', 'فُعُولٌ'],
  ];
  return (
    <Frame label="جمع التكسير يغير صورة المفرد" height={226}>
      <Ar x={190} y={26} size={15}>تَتَغَيَّرُ صُورَةُ الكَلِمَةِ كُلُّهَا</Ar>
      {pairs.map(([s, p, wz], i) => {
        const y = 44 + i * 46;
        return (
          <g key={s}>
            <rect x={262} y={y} width={100} height={36} rx="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <Ar x={312} y={y + 25} size={17}>{s}</Ar>
            <Arrow x1={256} y1={y + 18} x2={206} y2={y + 18} color={VIOLET} />
            <rect x={100} y={y} width={100} height={36} rx="10" fill="#ede9fe" stroke={VIOLET} strokeWidth="2" />
            <Ar x={150} y={y + 25} size={17}>{p}</Ar>
            <Ar x={56} y={y + 24} size={12} fill={MUTED}>{`وَزْنُ ${wz}`}</Ar>
          </g>
        );
      })}
      <Ar x={190} y={200} size={12.5} fill={MUTED}>يُعْرَبُ بِالحَرَكَاتِ كَالمُفْرَدِ: جَاءَ الأَوْلَادُ · رَأَيْتُ الأَوْلَادَ</Ar>
    </Frame>
  );
}

// 17. Tall or short alif: the « أنا » test.
function AlifLayina() {
  return (
    <Frame label="الألف اللينة: نسند الفعل إلى أنا لنعرف أصلها" height={236}>
      <Ar x={190} y={26} size={15}>أَسْنِدِ الفِعْلَ إِلَى «أَنَا»</Ar>
      {[
        { v: 'دَعَا', t: 'دَعَوْتُ', k: 'وَاوٌ', r: 'أَلِفٌ مَمْدُودَةٌ «ا»', c: BLUE, x: 196 },
        { v: 'رَمَى', t: 'رَمَيْتُ', k: 'يَاءٌ', r: 'أَلِفٌ مَقْصُورَةٌ «ى»', c: VIOLET, x: 18 },
      ].map(d => (
        <g key={d.v}>
          <rect x={d.x} y={40} width={166} height={120} rx="14" fill="#fff" stroke={d.c} strokeWidth="2.5" />
          <Ar x={d.x + 83} y={68} size={20}>{d.v}</Ar>
          <Ar x={d.x + 83} y={96} size={15} fill={MUTED}>{`أَنَا ${d.t}`}</Ar>
          <Ar x={d.x + 83} y={120} size={13} fill={d.c}>{`ظَهَرَتْ ${d.k}`}</Ar>
          <Ar x={d.x + 83} y={146} size={13} fill={d.c}>{d.r}</Ar>
        </g>
      ))}
      <Ar x={190} y={190} size={12.5} fill={MUTED}>فَوْقَ الثُّلَاثِيِّ «ى» غَالِباً: أَعْطَى، اِسْتَدْعَى</Ar>
      <Ar x={190} y={214} size={12.5} fill={MUTED}>وَتُحْفَظُ: إِلَى، عَلَى، مَتَى، لَدَى، حَتَّى</Ar>
    </Frame>
  );
}

export const ARABIC_5AP_ILLUSTRATIONS: Record<string, React.FC> = {
  'arabic-5ap-sentence-components': SentenceComponents,
  'arabic-5ap-kan-inna': KanInna,
  'arabic-5ap-passive-voice': PassiveVoice,
  'arabic-5ap-annexation-adjective': AnnexationAdjective,
  'arabic-5ap-hal-five-names-verbs': HalFiveNamesVerbs,
  'arabic-5ap-morphology-verbs': MorphologyVerbs,
  'arabic-5ap-mutal-verbs-jazm-amr': MutalVerbsJazm,
  'arabic-5ap-bare-augmented-participles': BareAugmentedParticiples,
  'arabic-5ap-spelling-taas': SpellingTaas,
  'arabic-5ap-spelling-hamzas': SpellingHamzas,
  'arabic-5ap-integration-writing': IntegrationWriting,
  'arabic-5ap-writing-evaluation-grid': WritingEvaluationGrid,
  'arabic-5ap-maf3ul-types': Maf3ulTypes,
  'arabic-5ap-tamyiz': Tamyiz,
  'arabic-5ap-muthanna-sound-plurals': MuthannaSoundPlurals,
  'arabic-5ap-jam-taksir': JamTaksir,
  'arabic-5ap-alif-layina': AlifLayina,
};
