import React, { useId } from 'react';
import { Ar, Frame, Num, BLUE, GOLD, GREEN, INK, MUTED, ORANGE, VIOLET } from './svgKit';
import { ALGERIA_MAP_BANDS, ALGERIA_OUTLINE_PATH } from '../../../data/algeriaMapOutline';

/**
 * Animated drawings for the 5AP history and geography lessons (V2 « contenu enrichi »).
 * Each `Step` appears in turn (CSS in immersive/didouGuide.css) and LessonDidou plays a soft
 * sound for each one. Maps use the Natural Earth outline of Algeria; places are set from
 * their real longitude and latitude.
 */
const RED = '#dc2626';
const SEA = '#dbeafe';

/** Longitude/latitude to the coordinates of ALGERIA_OUTLINE_PATH (fitted on Oran, Algiers, Constantine, Tamanrasset). */
const px = (lon: number) => 204.8 + 17.67 * lon;
const py = (lat: number) => 65.4 + (36.75 - lat) * 20.47;

function Step({ i, children }: { i: number; children: React.ReactNode }) {
  return <g className="ill-step" style={{ ['--i' as string]: i } as React.CSSProperties}>{children}</g>;
}

function Emoji({ x, y, size = 24, children }: { x: number; y: number; size?: number; children: string }) {
  return <text x={x} y={y} fontSize={size} textAnchor="middle" fontFamily="'Segoe UI Emoji','Noto Color Emoji','Apple Color Emoji',sans-serif">{children}</text>;
}

/** The Algerian flag: green at the hoist, white, red crescent and star. */
function Flag({ x, y, w = 36, wave = true }: { x: number; y: number; w?: number; wave?: boolean }) {
  const h = w * 2 / 3;
  return (
    <g>
      <line x1={x} y1={y - 2} x2={x} y2={y + h * 2.2} stroke="#78350f" strokeWidth="2.5" />
      <g className={wave ? 'ill-wave' : undefined}>
        <rect x={x} y={y} width={w / 2} height={h} fill="#006233" />
        <rect x={x + w / 2} y={y} width={w / 2} height={h} fill="#fff" stroke="#e5e7eb" strokeWidth="0.6" />
        <circle cx={x + w / 2} cy={y + h / 2} r={h * 0.25} fill={RED} />
        <circle cx={x + w / 2 + h * 0.06} cy={y + h / 2} r={h * 0.2} fill="#fff" />
        <circle cx={x + w / 2 + h * 0.19} cy={y + h / 2} r={h * 0.07} fill={RED} />
      </g>
    </g>
  );
}

/** The map of Algeria, drawn in the outline's own coordinates. */
function AlgeriaMap({ x, y, w, h, view = '45 50 380 386', fill = '#fef3c7', children }: { x: number; y: number; w: number; h: number; view?: string; fill?: string; children?: React.ReactNode }) {
  return (
    <svg x={x} y={y} width={w} height={h} viewBox={view} overflow="hidden">
      <path d={ALGERIA_OUTLINE_PATH} fill={fill} stroke="#92400e" strokeWidth="2.5" strokeLinejoin="round" />
      {children}
    </svg>
  );
}

function Pin({ lon, lat, n, color = RED, r = 7, i }: { lon: number; lat: number; n: string; color?: string; r?: number; i: number }) {
  return (
    <Step i={i}>
      <circle className="ill-pulse" cx={px(lon)} cy={py(lat)} r={r} fill={color} stroke="#fff" strokeWidth={r / 4} />
      <text x={px(lon)} y={py(lat) + r * 0.42} fontSize={r * 1.15} fontWeight={800} fill="#fff" textAnchor="middle" fontFamily="'Segoe UI', Roboto, Arial, sans-serif">{n}</text>
    </Step>
  );
}

function Badge({ x, y, n, color }: { x: number; y: number; n: string; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill={color} />
      <Num x={x} y={y + 4} size={11} fill="#fff">{n}</Num>
    </g>
  );
}

// 1. The four periods on one timeline (read from right to left, like the page).
function PeriodsLandmarks() {
  const periods = [
    { t: 'القَدِيمَةُ', e: '📜', l: 'مَاسِينِيسَا', c: '#b45309' },
    { t: 'الوَسِيطَةُ', e: '🕌', l: 'الرُّسْتُمِيُّونَ', c: GREEN },
    { t: 'الحَدِيثَةُ', e: '⛵', l: 'الأُسْطُولُ البَحْرِيُّ', c: BLUE },
    { t: 'المُعَاصِرَةُ', e: '', l: 'ثَوْرَةُ 1954', c: RED },
  ];
  const dates = ['476 م', '1453 م', '1830 م'];
  return (
    <Frame label="المراحل التاريخية الأربعة على خط الزمن" height={236}>
      <Ar x={190} y={26} size={15}>خَطُّ الزَّمَنِ: أَرْبَعُ مَرَاحِلَ</Ar>
      {periods.map((p, i) => {
        const x = 354 - (i + 1) * 82;
        return (
          <Step key={p.t} i={i}>
            {p.e ? <Emoji x={x + 41} y={70} size={26}>{p.e}</Emoji> : <Flag x={x + 28} y={44} w={30} />}
            <Ar x={x + 41} y={96} size={13} fill={p.c}>{p.t}</Ar>
            <rect x={x + 2} y={106} width={78} height={22} rx="6" fill={p.c} />
            <Ar x={x + 41} y={166} size={11} fill={MUTED}>{p.l}</Ar>
          </Step>
        );
      })}
      {dates.map((d, i) => (
        <Step key={d} i={i + 1}>
          <line x1={354 - (i + 1) * 82} y1={102} x2={354 - (i + 1) * 82} y2={134} stroke={INK} strokeWidth="2" />
          <Ar x={354 - (i + 1) * 82} y={148} size={12}>{d}</Ar>
        </Step>
      ))}
      <Ar x={354} y={148} size={11} fill={MUTED}>3200 ق.م</Ar>
      <Ar x={26} y={148} size={11} fill={MUTED}>اليَوْمَ</Ar>
      <Step i={4}>
        <Ar x={190} y={206} size={12.5} fill={MUTED}>الكِتَابَةُ ← سُقُوطُ رُومَا ← فَتْحُ القُسْطَنْطِينِيَّةِ ← الاحْتِلَالُ</Ar>
      </Step>
    </Frame>
  );
}

// 2. The Islamic conquest: from the East to Kairouan, then to the central Maghreb.
function IslamicConquest() {
  const cards = [
    { d: '647 م', t: 'بِدَايَةُ الفَتْحِ' },
    { d: '670 م', t: 'عُقْبَةُ يُؤَسِّسُ القَيْرَوَانَ' },
    { d: '', t: 'كُسَيْلَةُ ثُمَّ الكَاهِنَةُ تُقَاوِمَانِ' },
    { d: '', t: 'الأَمَازِيغُ يَدْخُلُونَ الإِسْلَامَ' },
  ];
  return (
    <Frame label="الفتح الإسلامي لشمال إفريقيا: من المشرق إلى القيروان ثم المغرب الأوسط" height={250}>
      <Ar x={190} y={26} size={15}>طَرِيقُ الفَتْحِ مِنَ المَشْرِقِ</Ar>
      <path className="ill-draw" pathLength={1} d="M340 70 C 290 100, 230 100, 190 80 S 90 60, 50 82" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
      <Step i={0}><Emoji x={344} y={66} size={24}>🕌</Emoji><Ar x={344} y={92} size={11.5}>المَشْرِقُ</Ar></Step>
      <Step i={1}><circle className="ill-pulse" cx={190} cy={80} r="8" fill={GREEN} stroke="#fff" strokeWidth="2" /><Ar x={190} y={108} size={12} fill={GREEN}>القَيْرَوَانُ</Ar></Step>
      <Step i={2}><circle cx={50} cy={82} r="7" fill={ORANGE} /><Ar x={56} y={110} size={11.5}>المَغْرِبُ الأَوْسَطُ</Ar></Step>
      {cards.map((c, i) => {
        const x = 270 - i * 84;
        return (
          <Step key={c.t} i={i + 2}>
            <rect x={x} y={134} width={80} height={86} rx="12" fill="#fff" stroke={i === 2 ? ORANGE : GREEN} strokeWidth="2" />
            <Badge x={x + 40} y={150} n={String(i + 1)} color={i === 2 ? ORANGE : GREEN} />
            {c.d && <Ar x={x + 40} y={178} size={12.5} fill={INK}>{c.d}</Ar>}
            <foreignObject x={x + 4} y={c.d ? 182 : 164} width={72} height={40}>
              <div style={{ font: "700 10.5px Cairo, Tahoma, sans-serif", color: MUTED, textAlign: 'center', direction: 'rtl', lineHeight: 1.25 }}>{c.t}</div>
            </foreignObject>
          </Step>
        );
      })}
    </Frame>
  );
}

// 3. The Ottoman era: four beyliks, the fleet, Navarino.
function OttomanEra() {
  const beyliks = [
    { n: '1', t: 'دَارُ السُّلْطَانِ (الجَزَائِرُ)', lon: 3.06, lat: 36.75, c: RED },
    { n: '2', t: 'بَايْلِكُ الشَّرْقِ (قَسَنْطِينَةُ)', lon: 6.61, lat: 36.36, c: BLUE },
    { n: '3', t: 'بَايْلِكُ الغَرْبِ (وَهْرَانُ)', lon: -0.63, lat: 35.7, c: GREEN },
    { n: '4', t: 'بَايْلِكُ التِّيطَرِي (المَدْيَةُ)', lon: 2.75, lat: 36.27, c: VIOLET },
  ];
  return (
    <Frame label="العهد العثماني: البايلكات الأربعة والأسطول ومعركة نافارين" height={290}>
      <rect x={18} y={16} width={344} height={52} rx="10" fill={SEA} />
      <Ar x={190} y={36} size={12.5} fill={BLUE}>البَحْرُ الأَبْيَضُ المُتَوَسِّطُ</Ar>
      <AlgeriaMap x={18} y={22} w={344} h={140} view="170 46 170 69">
        {beyliks.map((b, i) => <Pin key={b.n} i={i} lon={b.lon} lat={b.lat} n={b.n} color={b.c} r={5} />)}
      </AlgeriaMap>
      <g className="ill-sail"><Emoji x={60} y={44} size={22}>⛵</Emoji></g>
      {beyliks.map((b, i) => (
        <Step key={b.t} i={i}>
          <Badge x={354 - (i % 2) * 172} y={178 + Math.floor(i / 2) * 26} n={b.n} color={b.c} />
          <Ar x={340 - (i % 2) * 172} y={183 + Math.floor(i / 2) * 26} size={11.5} anchor="start">{b.t}</Ar>
        </Step>
      ))}
      <Step i={4}>
        <rect x={196} y={234} width={166} height={42} rx="10" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" />
        <Ar x={279} y={252} size={12} fill={GREEN}>1516 م: الاسْتِنْجَادُ بِالعُثْمَانِيِّينَ</Ar>
        <Ar x={279} y={269} size={10.5} fill={MUTED}>عُرُوجُ وَخَيْرُ الدِّينِ ضِدَّ الإِسْبَانِ</Ar>
      </Step>
      <Step i={5}>
        <rect x={18} y={234} width={170} height={42} rx="10" fill="#fef2f2" stroke={RED} strokeWidth="2" />
        <Ar x={103} y={252} size={12} fill={RED}>1827 م: مَعْرَكَةُ نَافَارِينَ</Ar>
        <Ar x={103} y={269} size={10.5} fill={MUTED}>تَحَطَّمَ الأُسْطُولُ ← ضَعُفَتِ الجَزَائِرُ</Ar>
      </Step>
    </Frame>
  );
}

// 4. 1830 and the popular resistances on the map.
function FrenchColonizationResistances() {
  const items = [
    { n: '1', t: 'سِيدِي فَرَجَ: إِنْزَالُ 14 جُوَان 1830', lon: 2.85, lat: 36.77, c: INK },
    { n: '2', t: 'الأَمِيرُ عَبْدُ القَادِرِ (الغَرْبُ)', lon: 0.14, lat: 35.4, c: GREEN },
    { n: '3', t: 'أَحْمَدُ بَايْ (قَسَنْطِينَةُ)', lon: 6.61, lat: 36.36, c: BLUE },
    { n: '4', t: 'لَالَّةُ فَاطْمَةُ نْسُومَرَ (القَبَائِلُ)', lon: 4.05, lat: 36.65, c: VIOLET },
    { n: '5', t: 'الزَّعَاطْشَةُ 1849 (بِسْكْرَةُ)', lon: 5.6, lat: 34.85, c: ORANGE },
    { n: '6', t: 'المُقْرَانِي وَالحَدَّادُ 1871', lon: 4.76, lat: 36.07, c: '#0f766e' },
  ];
  return (
    <Frame label="الاحتلال الفرنسي سنة 1830 والمقاومات الشعبية على الخريطة" height={318}>
      <Ar x={190} y={24} size={14.5}>شَعْبٌ يُقَاوِمُ فِي كُلِّ الجِهَاتِ</Ar>
      <rect x={18} y={34} width={344} height={36} rx="10" fill={SEA} />
      <AlgeriaMap x={18} y={34} w={344} h={172} view="182 50 160 80">
        {items.map((it, i) => <Pin key={it.n} i={i} lon={it.lon} lat={it.lat} n={it.n} color={it.c} r={4.6} />)}
      </AlgeriaMap>
      {items.map((it, i) => (
        <Step key={it.t} i={i}>
          <Badge x={354 - (i % 2) * 172} y={222 + Math.floor(i / 2) * 26} n={it.n} color={it.c} />
          <Ar x={340 - (i % 2) * 172} y={227 + Math.floor(i / 2) * 26} size={10.5} anchor="start">{it.t}</Ar>
        </Step>
      ))}
      <Step i={6}>
        <Ar x={190} y={306} size={11} fill={MUTED}>وَفِي أَقْصَى الجَنُوبِ: مُقَاوَمَةُ التَّوَارِقِ بِقِيَادَةِ الشَّيْخِ آمُود</Ar>
      </Step>
    </Frame>
  );
}

// 5. The national movement: three currents, then the road to 1954.
function NationalMovement() {
  const currents = [
    { t: 'الاسْتِقْلَالِيُّ', who: 'مَصَالِي الحَاج', what: 'الاسْتِقْلَالُ التَّامُّ', c: RED },
    { t: 'الإِصْلَاحِيُّ', who: 'ابْنُ بَادِيس', what: 'التَّعْلِيمُ وَالهُوِيَّةُ', c: GREEN },
    { t: 'اللِّيبِرَالِيُّ', who: 'فَرْحَات عَبَّاس', what: 'المُسَاوَاةُ أَوَّلاً', c: BLUE },
  ];
  const road = ['1919', '8 مَاي 1945', '1947', '1 نُوفَمْبَر 1954'];
  return (
    <Frame label="الحركة الوطنية: ثلاثة تيارات ثم الطريق إلى ثورة نوفمبر" height={262}>
      <Ar x={190} y={24} size={14.5}>ثَلَاثَةُ تَيَّارَاتٍ وَطَنِيَّةٍ</Ar>
      {currents.map((c, i) => {
        const x = 252 - i * 116;
        return (
          <Step key={c.t} i={i}>
            <rect x={x} y={36} width={108} height={92} rx="12" fill="#fff" stroke={c.c} strokeWidth="2.5" />
            <rect x={x} y={36} width={108} height={26} rx="12" fill={c.c} />
            <Ar x={x + 54} y={54} size={12.5} fill="#fff">{c.t}</Ar>
            <Ar x={x + 54} y={86} size={12.5}>{c.who}</Ar>
            <Ar x={x + 54} y={112} size={11} fill={MUTED}>{c.what}</Ar>
          </Step>
        );
      })}
      <line x1={340} y1={176} x2={40} y2={176} stroke="#cbd5e1" strokeWidth="4" />
      {road.map((d, i) => {
        const x = 340 - i * 100;
        return (
          <Step key={d} i={i + 3}>
            <circle className={i === 3 ? 'ill-pulse' : undefined} cx={x} cy={176} r={i === 3 ? 10 : 7} fill={i === 1 ? '#7f1d1d' : i === 3 ? RED : INK} />
            <Ar x={x} y={162} size={11.5}>{d}</Ar>
          </Step>
        );
      })}
      <Step i={3}><Ar x={340} y={204} size={10.5} fill={MUTED}>نِضَالٌ سِيَاسِيٌّ</Ar></Step>
      <Step i={4}><Ar x={240} y={204} size={10.5} fill={MUTED}>مَجَازِرُ سَطِيفَ</Ar><Ar x={240} y={220} size={10.5} fill={MUTED}>وَقَالَمَةَ وَخَرَّاطَةَ</Ar></Step>
      <Step i={5}><Ar x={140} y={204} size={10.5} fill={MUTED}>المُنَظَّمَةُ الخَاصَّةُ</Ar></Step>
      <Step i={6}><Ar x={40} y={204} size={10.5} fill={RED}>الثَّوْرَةُ</Ar></Step>
      <Step i={6}><Ar x={190} y={248} size={12} fill={INK}>مِنَ الكِفَاحِ السِّيَاسِيِّ إِلَى الكِفَاحِ المُسَلَّحِ</Ar></Step>
    </Frame>
  );
}

// 6. The revolution 1954-1962 on a timeline ending with the flag.
function GloriousRevolution() {
  const steps = [
    { d: '1 نُوفَمْبَر 1954', t: 'البَيَانُ وَأُولَى العَمَلِيَّاتِ' },
    { d: '20 أُوت 1955', t: 'هَجَمَاتُ الشَّمَالِ القَسَنْطِينِي' },
    { d: '20 أُوت 1956', t: 'مُؤْتَمَرُ الصُّومَامِ: 6 وِلَايَاتٍ' },
    { d: '11 دِيسَمْبَر 1960', t: 'المُظَاهَرَاتُ الشَّعْبِيَّةُ' },
  ];
  return (
    <Frame label="الثورة التحريرية من 1 نوفمبر 1954 إلى الاستقلال في 5 جويلية 1962" height={276}>
      <Ar x={190} y={24} size={14.5}>ثَمَانِي سَنَوَاتٍ نَحْوَ الحُرِّيَّةِ</Ar>
      <line x1={340} y1={44} x2={340} y2={214} stroke="#cbd5e1" strokeWidth="4" />
      {steps.map((s, i) => (
        <Step key={s.d} i={i}>
          <circle cx={340} cy={52 + i * 42} r="8" fill={i === 0 ? RED : GREEN} stroke="#fff" strokeWidth="2" />
          <Ar x={324} y={50 + i * 42} size={12.5} anchor="start" fill={i === 0 ? RED : GREEN}>{s.d}</Ar>
          <Ar x={324} y={67 + i * 42} size={11} anchor="start" fill={MUTED}>{s.t}</Ar>
        </Step>
      ))}
      <Step i={4}>
        <circle className="ill-pulse" cx={340} cy={222} r="10" fill={GOLD} stroke="#fff" strokeWidth="2" />
        <Ar x={324} y={220} size={13.5} anchor="start" fill={INK}>5 جُوِيلِيَة 1962: الاسْتِقْلَالُ</Ar>
        <Ar x={324} y={240} size={11} anchor="start" fill={MUTED}>مِلْيُونٌ وَنِصْفُ مِلْيُونِ شَهِيدٍ</Ar>
        <Flag x={56} y={86} w={84} />
        <Emoji x={60} y={238} size={24}>🎉</Emoji>
        <Emoji x={130} y={238} size={24}>🎉</Emoji>
      </Step>
    </Frame>
  );
}

// 7. 11 December 1960: the people in the streets, the world hears.
function December1960() {
  const cities = ['الجَزَائِرُ', 'وَهْرَانُ', 'عَنَّابَةُ'];
  return (
    <Frame label="مظاهرات 11 ديسمبر 1960 في المدن الجزائرية وتدويل القضية" height={250}>
      <Ar x={190} y={26} size={15}>11 دِيسَمْبَر 1960: الشَّعْبُ فِي الشَّارِعِ</Ar>
      {cities.map((c, i) => {
        const x = 252 - i * 116;
        return (
          <Step key={c} i={i}>
            <rect x={x} y={42} width={108} height={104} rx="12" fill="#fff" stroke={GREEN} strokeWidth="2" />
            <Flag x={x + 18} y={52} w={30} />
            <Flag x={x + 62} y={58} w={26} />
            <Emoji x={x + 54} y={122} size={22}>🧍🧍‍♀️🧍</Emoji>
            <Ar x={x + 54} y={140} size={12}>{c}</Ar>
          </Step>
        );
      })}
      <Step i={3}>
        <path className="ill-draw" pathLength={1} d="M190 152 V178" stroke={BLUE} strokeWidth="3" fill="none" />
        <Emoji x={190} y={208} size={28}>🌍</Emoji>
        <Ar x={190} y={236} size={12} fill={BLUE}>الأُمَمُ المُتَّحِدَةُ وَالعَالَمُ يَسْمَعُ: تَدْوِيلُ القَضِيَّةِ</Ar>
      </Step>
    </Frame>
  );
}

// 8. Where Algeria is: neighbours, Greenwich, the Tropic of Cancer.
function LocationImportance() {
  const map = { x: 92, y: 40, w: 196, h: 200 };
  const s = map.w / 380;
  const gx = map.x + (px(0) - 45) * s;
  const ty = map.y + (py(23.44) - 50) * s;
  return (
    <Frame label="موقع الجزائر: حدودها وخط غرينتش ومدار السرطان" height={300}>
      <rect x={18} y={12} width={344} height={34} rx="10" fill={SEA} />
      <Ar x={190} y={34} size={12.5} fill={BLUE}>البَحْرُ الأَبْيَضُ المُتَوَسِّطُ (1200 كم)</Ar>
      <AlgeriaMap x={map.x} y={map.y} w={map.w} h={map.h} />
      <Step i={0}>
        <line x1={gx} y1={36} x2={gx} y2={250} stroke={VIOLET} strokeWidth="2.5" strokeDasharray="6 4" />
        <Ar x={gx + 4} y={262} size={11} fill={VIOLET} anchor="end">خَطُّ غْرِينِتْش 0°</Ar>
      </Step>
      <Step i={1}>
        <line x1={70} y1={ty} x2={312} y2={ty} stroke={ORANGE} strokeWidth="2.5" strokeDasharray="6 4" />
        <Ar x={364} y={ty + 4} size={11} fill={ORANGE} anchor="start">مَدَارُ السَّرَطَانِ</Ar>
      </Step>
      <Step i={2}>
        <Ar x={322} y={76} size={12}>تُونِسُ</Ar>
        <Ar x={330} y={140} size={12}>لِيبْيَا</Ar>
      </Step>
      <Step i={3}>
        <Ar x={56} y={86} size={12}>المَغْرِبُ</Ar>
        <Ar x={50} y={148} size={10.5}>الصَّحْرَاءُ الغَرْبِيَّةُ</Ar>
        <Ar x={50} y={186} size={12}>مُورِيتَانْيَا</Ar>
      </Step>
      <Step i={4}>
        <Ar x={112} y={232} size={12}>مَالِي</Ar>
        <Ar x={274} y={236} size={12}>النَّيْجَرُ</Ar>
      </Step>
      <Step i={5}>
        <rect x={60} y={268} width={260} height={26} rx="13" fill="#fef9c3" stroke={GOLD} strokeWidth="2" />
        <Ar x={190} y={286} size={12.5}>{'2 381 741 كم²: أَكْبَرُ بَلَدٍ فِي إِفْرِيقْيَا'}</Ar>
      </Step>
    </Frame>
  );
}

// 9. Three regions: relief, climate, vegetation; rain decreases southwards.
function ReliefClimateVegetation() {
  const clip = `relief${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const bands = [
    { k: 'tell', c: '#86efac' },
    { k: 'high_plateaus', c: '#fde68a' },
    { k: 'saharan_atlas', c: '#d6a35c' },
    { k: 'sahara', c: '#fcd9a8' },
  ];
  const rows = [
    { e: '🌲', t: 'الشَّمَالُ', d: 'مُتَوَسِّطِيٌّ · غَابَاتٌ', p: '≈ 4 %', c: GREEN },
    { e: '🌾', t: 'الهِضَابُ العُلْيَا', d: 'شِبْهُ جَافٍّ · حَلْفَاءُ', p: '≈ 9 %', c: '#a16207' },
    { e: '🌴', t: 'الصَّحْرَاءُ', d: 'جَافٌّ · عِرْقٌ وَرَقٌّ · وَاحَاتٌ', p: '≈ 87 %', c: ORANGE },
  ];
  return (
    <Frame label="أقاليم الجزائر الثلاثة: التضاريس والمناخ والغطاء النباتي" height={276}>
      <svg x={172} y={20} width={196} height={200} viewBox="45 50 380 386">
        <defs><clipPath id={clip}><path d={ALGERIA_OUTLINE_PATH} /></clipPath></defs>
        <g clipPath={`url(#${clip})`}>
          {bands.map((b, i) => {
            const band = ALGERIA_MAP_BANDS[b.k];
            return <Step key={b.k} i={i}><rect x={0} y={band.y0} width={470} height={band.y1 - band.y0} fill={b.c} /></Step>;
          })}
        </g>
        <path d={ALGERIA_OUTLINE_PATH} fill="none" stroke="#92400e" strokeWidth="2.5" />
      </svg>
      {rows.map((r, i) => (
        <Step key={r.t} i={i === 2 ? 3 : i}>
          <rect x={14} y={24 + i * 64} width={160} height={56} rx="12" fill="#fff" stroke={r.c} strokeWidth="2" />
          <Emoji x={34} y={58 + i * 64} size={20}>{r.e}</Emoji>
          <Ar x={166} y={44 + i * 64} size={12.5} anchor="start" fill={r.c}>{`${r.t} ${r.p}`}</Ar>
          <Ar x={166} y={66 + i * 64} size={10.5} anchor="start" fill={MUTED}>{r.d}</Ar>
        </Step>
      ))}
      <Step i={4}>
        <Emoji x={30} y={240} size={20}>🌧️</Emoji>
        <Arrow x1={52} y1={234} x2={300} y2={234} />
        <Emoji x={326} y={240} size={20}>☀️</Emoji>
        <Ar x={190} y={262} size={11.5} fill={MUTED}>كُلَّمَا اتَّجَهْنَا جَنُوباً قَلَّتِ الأَمْطَارُ</Ar>
      </Step>
    </Frame>
  );
}

function Arrow({ x1, y1, x2, y2, color = MUTED }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${x2 - 8 * Math.cos(a - 0.45)},${y2 - 8 * Math.sin(a - 0.45)} ${x2 - 8 * Math.cos(a + 0.45)},${y2 - 8 * Math.sin(a + 0.45)}`} fill={color} />
    </g>
  );
}

/** Deterministic dots: dense in the north, rare in the Sahara. */
const POPULATION_DOTS = (() => {
  const dots: [number, number][] = [];
  let seed = 7;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const zones: [number, number, number, number, number][] = [
    [175, 345, 60, 96, 70],
    [170, 350, 96, 135, 22],
    [150, 380, 135, 420, 12],
  ];
  zones.forEach(([x0, x1, y0, y1, n]) => { for (let i = 0; i < n; i++) dots.push([x0 + rand() * (x1 - x0), y0 + rand() * (y1 - y0)]); });
  return dots;
})();

// 10. Population in the north, the Green Dam, major hazards.
function PopulationEconomyHazards() {
  const clip = `pop${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <Frame label="توزيع السكان في الجزائر والسد الأخضر والمخاطر الكبرى" height={280}>
      <svg x={172} y={16} width={196} height={200} viewBox="45 50 380 386">
        <defs><clipPath id={clip}><path d={ALGERIA_OUTLINE_PATH} /></clipPath></defs>
        <path d={ALGERIA_OUTLINE_PATH} fill="#fef3c7" stroke="#92400e" strokeWidth="2.5" />
        <Step i={0}>
          <g clipPath={`url(#${clip})`}>
            {POPULATION_DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" fill={VIOLET} opacity="0.75" />)}
          </g>
        </Step>
        <Step i={1}>
          <g clipPath={`url(#${clip})`}>
            {Array.from({ length: 9 }, (_, i) => <text key={i} x={190 + i * 18} y={150} fontSize="16" textAnchor="middle">🌳</text>)}
          </g>
        </Step>
        <Pin i={2} lon={3.48} lat={36.76} n="!" color={ORANGE} r={9} />
        <Pin i={3} lon={3.05} lat={36.79} n="~" color={BLUE} r={9} />
      </svg>
      {[
        { e: '👨‍👩‍👧', t: 'أَكْثَرُ مِنْ 65 % فِي الشَّمَالِ', c: VIOLET },
        { e: '🌳', t: 'السَّدُّ الأَخْضَرُ ضِدَّ التَّصَحُّرِ', c: GREEN },
        { e: '⚠️', t: 'زِلْزَالُ بُومَرْدَاس 2003', c: ORANGE },
        { e: '🌊', t: 'فَيَضَانُ بَابِ الوَادِي 2001', c: BLUE },
      ].map((r, i) => (
        <Step key={r.t} i={i}>
          <rect x={12} y={20 + i * 50} width={162} height={42} rx="12" fill="#fff" stroke={r.c} strokeWidth="2" />
          <Emoji x={30} y={48 + i * 50} size={17}>{r.e}</Emoji>
          <Ar x={166} y={46 + i * 50} size={11} anchor="start" fill={r.c}>{r.t}</Ar>
        </Step>
      ))}
      <Step i={4}>
        <Ar x={190} y={250} size={12} fill={INK}>فِلَاحَةٌ · صِنَاعَةٌ · خَدَمَاتٌ</Ar>
        <Ar x={190} y={270} size={11} fill={MUTED}>وِقَايَةٌ: تَشْجِيرٌ، سُدُودٌ، بِنَاءٌ مُقَاوِمٌ لِلزَّلَازِلِ</Ar>
      </Step>
    </Frame>
  );
}

export const HISTORY_GEO_5AP_ILLUSTRATIONS: Record<string, React.FC> = {
  'history-5ap-periods-landmarks': PeriodsLandmarks,
  'history-5ap-islamic-conquest': IslamicConquest,
  'history-5ap-ottoman-era': OttomanEra,
  'history-5ap-french-colonization-popular-resistances': FrenchColonizationResistances,
  'history-5ap-national-movement': NationalMovement,
  'history-5ap-glorious-revolution-1954': GloriousRevolution,
  'history-5ap-december-1960-demonstrations': December1960,
  'geo-5ap-location-importance': LocationImportance,
  'geo-5ap-relief-climate-vegetation': ReliefClimateVegetation,
  'geo-5ap-population-economy-hazards': PopulationEconomyHazards,
};
