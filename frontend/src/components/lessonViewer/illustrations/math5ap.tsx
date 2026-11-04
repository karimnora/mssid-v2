import React from 'react';

/**
 * Drawings made for each 5AP math lesson (V2 « contenu enrichi », docs/v2-design-monde.md).
 * Original SVG, Algerian conventions: decimal comma, division « en potence », Arabic units.
 */
import { Ar, Frame, Num, BLUE, GOLD, GREEN, INK, MUTED, ORANGE } from './svgKit';

// 1. Large numbers: the periods are wagons of a train.
function LargeNumbers() {
  const wagons = [
    { label: 'المليارات', digits: ['', '', ''] },
    { label: 'الملايين', digits: ['', '', '2'] },
    { label: 'الآلاف', digits: ['3', '4', '0'] },
    { label: 'الوحدات', digits: ['5', '0', '6'] },
  ];
  const colors = ['#94a3b8', '#7c3aed', BLUE, GREEN];
  return (
    <Frame label="قطار الفترات: العدد 2340506 مقسّم إلى فترات">
      <Ar x={190} y={28} size={15}>كل فترة عربة فيها 3 خانات: مئات، عشرات، وحدات</Ar>
      <line x1="14" y1="150" x2="366" y2="150" stroke="#cbd5e1" strokeWidth="4" />
      {wagons.map((w, i) => {
        const x = 14 + i * 80;
        return (
          <g key={w.label}>
            <Ar x={x + 36} y={62} size={12} fill={colors[i]}>{w.label}</Ar>
            <rect x={x} y={70} width={72} height={58} rx="8" fill="#fff" stroke={colors[i]} strokeWidth="3" />
            {w.digits.map((d, j) => (
              <g key={j}>
                <rect x={x + 5 + j * 21} y={84} width={20} height={30} rx="4" fill={d ? '#f8fafc' : '#f1f5f9'} stroke="#cbd5e1" />
                <Num x={x + 15 + j * 21} y={106} size={18} fill={d ? colors[i] : '#cbd5e1'}>{d || '·'}</Num>
              </g>
            ))}
            <circle cx={x + 16} cy={140} r="9" fill="#334155" />
            <circle cx={x + 56} cy={140} r="9" fill="#334155" />
            {i < 3 && <rect x={x + 72} y={112} width={8} height={5} fill="#64748b" />}
          </g>
        );
      })}
      <Num x={190} y={182} size={22} fill={INK}>2 340 506</Num>
      <Ar x={190} y={206} size={13} fill={MUTED}>مليونان وثلاثمائة وأربعون ألفاً وخمسمائة وستة</Ar>
    </Frame>
  );
}

// 2. Operations: addition and multiplication laid out in columns.
function Operations() {
  const col = (x0: number, digits: string, y: number, fill = INK) =>
    digits.split('').map((d, i) => (
      <Num key={`${y}-${i}`} x={x0 - (digits.length - 1 - i) * 18} y={y} size={20} fill={fill}>{d}</Num>
    ));
  return (
    <Frame label="عمليتان موضوعتان: جمع بالاحتفاظ وضرب">
      <Ar x={95} y={30} size={14} fill={GREEN}>الجمع بالاحتفاظ</Ar>
      {col(150, '111', 56, ORANGE)}
      {col(150, '3456', 82)}
      <Num x={60} y={108} size={20}>+</Num>
      {col(150, '2789', 108)}
      <line x1="60" y1="118" x2="160" y2="118" stroke={INK} strokeWidth="2.5" />
      {col(150, '6245', 144, GREEN)}
      <Ar x={95} y={186} size={12} fill={MUTED}>الأرقام البرتقالية: الاحتفاظ</Ar>

      <line x1="200" y1="24" x2="200" y2="196" stroke="#e2e8f0" strokeWidth="2" />

      <Ar x={290} y={30} size={14} fill={BLUE}>الضرب في عدد من رقمين</Ar>
      {col(340, '46', 60)}
      <Num x={262} y={84} size={20}>×</Num>
      {col(340, '23', 84)}
      <line x1="256" y1="94" x2="350" y2="94" stroke={INK} strokeWidth="2.5" />
      {col(340, '138', 118)}
      {col(340, '920', 142)}
      <Num x={232} y={122} size={11} fill={MUTED} weight={600}>46 × 3</Num>
      <Num x={232} y={146} size={11} fill={MUTED} weight={600}>46 × 20</Num>
      <line x1="256" y1="152" x2="350" y2="152" stroke={INK} strokeWidth="2.5" />
      {col(340, '1058', 176, BLUE)}
    </Frame>
  );
}

// 3. Euclidean division « en potence »: 157 ÷ 12.
function Division() {
  return (
    <Frame label="القسمة الإقليدية: 157 مقسوم على 12">
      <Num x={110} y={60} size={24}>157</Num>
      <line x1="150" y1="38" x2="150" y2="150" stroke={INK} strokeWidth="3" />
      <Num x={185} y={60} size={24}>12</Num>
      <line x1="150" y1="70" x2="240" y2="70" stroke={INK} strokeWidth="3" />
      <Num x={185} y={96} size={24} fill={BLUE}>13</Num>
      <Num x={100} y={88} size={20} fill={MUTED}>− 12</Num>
      <line x1="72" y1="96" x2="140" y2="96" stroke={MUTED} strokeWidth="2" />
      <Num x={118} y={118} size={20}>37</Num>
      <Num x={100} y={140} size={20} fill={MUTED}>− 36</Num>
      <line x1="72" y1="148" x2="140" y2="148" stroke={MUTED} strokeWidth="2" />
      <Num x={128} y={172} size={22} fill={ORANGE}>1</Num>
      <Ar x={300} y={60} size={13}>المقسوم: 157</Ar>
      <Ar x={300} y={84} size={13}>القاسم: 12</Ar>
      <Ar x={300} y={108} size={13} fill={BLUE}>حاصل القسمة: 13</Ar>
      <Ar x={300} y={132} size={13} fill={ORANGE}>الباقي: 1</Ar>
      <Num x={190} y={204} size={18} fill={GREEN}>157 = (12 × 13) + 1</Num>
    </Frame>
  );
}

// 4. Fractions: a bar in quarters and a disc in halves.
function Fractions() {
  return (
    <Frame label="الكسور: ثلاثة أرباع شريط ونصف قرص">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={30 + i * 50} y={60} width={50} height={46} fill={i < 3 ? '#93c5fd' : '#fff'} stroke={BLUE} strokeWidth="3" />
      ))}
      <Num x={130} y={140} size={24} fill={BLUE}>3</Num>
      <line x1="114" y1="148" x2="146" y2="148" stroke={BLUE} strokeWidth="3" />
      <Num x={130} y={174} size={24} fill={BLUE}>4</Num>
      <Ar x={130} y={40} size={13}>قسّمنا الشريط إلى 4 أجزاء متساوية ولوّنّا 3</Ar>
      <Ar x={74} y={148} size={12} fill={MUTED}>البسط</Ar>
      <Ar x={74} y={174} size={12} fill={MUTED}>المقام</Ar>

      <circle cx={300} cy={92} r={44} fill="#fff" stroke={GREEN} strokeWidth="3" />
      <path d="M300 48a44 44 0 0 1 0 88z" fill="#86efac" stroke={GREEN} strokeWidth="3" />
      <Num x={300} y={164} size={22} fill={GREEN}>1</Num>
      <line x1="288" y1="171" x2="312" y2="171" stroke={GREEN} strokeWidth="3" />
      <Num x={300} y={194} size={22} fill={GREEN}>2</Num>
    </Frame>
  );
}

// 5. Decimals on a number line: 2,7.
function Decimals() {
  const x0 = 40;
  const step = 30;
  return (
    <Frame label="العدد العشري 2,7 على مستقيم مدرّج">
      <Ar x={190} y={34} size={14}>بين 2 و 3 نقسّم الوحدة إلى 10 أعشار</Ar>
      <line x1={x0} y1={110} x2={x0 + 10 * step} y2={110} stroke={INK} strokeWidth="3" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={x0 + i * step} y1={i % 10 === 0 ? 94 : 101} x2={x0 + i * step} y2={i % 10 === 0 ? 126 : 119} stroke={INK} strokeWidth={i % 10 === 0 ? 3 : 2} />
      ))}
      <Num x={x0} y={150} size={20}>2</Num>
      <Num x={x0 + 10 * step} y={150} size={20}>3</Num>
      <path d={`M${x0 + 7 * step} 90l-9-16h18z`} fill={ORANGE} />
      <Num x={x0 + 7 * step} y={66} size={22} fill={ORANGE}>2,7</Num>
      <Ar x={190} y={190} size={14} fill={MUTED}>2,7 = وحدتان و 7 أعشار</Ar>
    </Frame>
  );
}

// 6. Conversion table for lengths.
function Lengths() {
  const heads = ['كلم', 'هكم', 'دكم', 'م', 'دسم', 'سم', 'مم'];
  const row = ['', '', '', '1', '3', '5', ''];
  return (
    <Frame label="جدول تحويل وحدات الطول">
      <Ar x={190} y={32} size={14}>كل وحدة تساوي 10 مرات الوحدة التي على يمينها</Ar>
      <g direction="ltr">
        {heads.map((h, i) => (
          <g key={h}>
            <rect x={22 + i * 48} y={50} width={48} height={34} fill={h === 'م' ? '#dbeafe' : '#f8fafc'} stroke="#cbd5e1" />
            <Ar x={46 + i * 48} y={73} size={14} fill={h === 'م' ? BLUE : INK}>{h}</Ar>
            <rect x={22 + i * 48} y={84} width={48} height={40} fill="#fff" stroke="#cbd5e1" />
            <Num x={46 + i * 48} y={112} size={22} fill={row[i] ? GREEN : '#cbd5e1'}>{row[i] || '·'}</Num>
          </g>
        ))}
      </g>
      <circle cx={70 + 3 * 48} cy={122} r="4" fill={ORANGE} />
      <Ar x={190} y={166} size={18} fill={GREEN}>1,35 م = 135 سم</Ar>
      <Ar x={190} y={196} size={13} fill={MUTED}>نضع رقم الوحدات تحت «م» ثم نقرأ في العمود المطلوب</Ar>
    </Frame>
  );
}

// 7. Perimeter and area on a grid: 6 cm × 4 cm.
function PerimeterArea() {
  const s = 24;
  return (
    <Frame label="محيط ومساحة مستطيل طوله 6 سم وعرضه 4 سم">
      <g>
        {Array.from({ length: 6 * 4 }, (_, i) => (
          <rect key={i} x={30 + (i % 6) * s} y={44 + Math.floor(i / 6) * s} width={s} height={s} fill="#dcfce7" stroke="#86efac" />
        ))}
        <rect x={30} y={44} width={6 * s} height={4 * s} fill="none" stroke={ORANGE} strokeWidth="4" strokeDasharray="10 6" />
      </g>
      <Ar x={102} y={34} size={13}>6 سم</Ar>
      <Ar x={200} y={96} size={13}>4 سم</Ar>
      <Ar x={290} y={70} size={15} fill={ORANGE}>المحيط</Ar>
      <Num x={340} y={96} size={15} fill={ORANGE} anchor="end">(6 + 4) × 2 = 20</Num>
      <Ar x={358} y={96} size={13} fill={ORANGE}>سم</Ar>
      <Ar x={290} y={134} size={15} fill={GREEN}>المساحة</Ar>
      <Num x={340} y={160} size={15} fill={GREEN} anchor="end">6 × 4 = 24</Num>
      <Ar x={360} y={160} size={13} fill={GREEN}>سم²</Ar>
      <Ar x={102} y={176} size={12} fill={MUTED}>كل مربع = 1 سم²</Ar>
    </Frame>
  );
}

function Clock({ cx, cy, h, m, color }: { cx: number; cy: number; h: number; m: number; color: string }) {
  const hourA = (((h % 12) + m / 60) * 30 - 90) * (Math.PI / 180);
  const minA = (m * 6 - 90) * (Math.PI / 180);
  return (
    <g>
      <circle cx={cx} cy={cy} r={46} fill="#fff" stroke={color} strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={cx + 38 * Math.sin(a)} y1={cy - 38 * Math.cos(a)} x2={cx + 43 * Math.sin(a)} y2={cy - 43 * Math.cos(a)} stroke={INK} strokeWidth="2" />;
      })}
      <line x1={cx} y1={cy} x2={cx + 24 * Math.cos(hourA)} y2={cy + 24 * Math.sin(hourA)} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + 36 * Math.cos(minA)} y2={cy + 36 * Math.sin(minA)} stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill={INK} />
    </g>
  );
}

// 8. Durations: from 8:15 to 10:45.
function Durations() {
  return (
    <Frame label="حساب مدة: من الساعة 8 و15 دقيقة إلى الساعة 10 و45 دقيقة">
      <Clock cx={80} cy={92} h={8} m={15} color={BLUE} />
      <Clock cx={300} cy={92} h={10} m={45} color={GREEN} />
      <Num x={80} y={162} size={18} fill={BLUE}>08:15</Num>
      <Num x={300} y={162} size={18} fill={GREEN}>10:45</Num>
      <path d="M140 92h96" stroke={ORANGE} strokeWidth="4" />
      <path d="M236 82l14 10-14 10z" fill={ORANGE} />
      <Ar x={190} y={76} size={14} fill={ORANGE}>المدة</Ar>
      <Ar x={190} y={118} size={15} fill={ORANGE}>2 سا 30 د</Ar>
      <Ar x={190} y={200} size={13} fill={MUTED}>البداية + المدة = النهاية</Ar>
    </Frame>
  );
}

// 9. Lines and angles.
function LinesAngles() {
  return (
    <Frame label="مستقيمان متوازيان، مستقيمان متعامدان، وأنواع الزوايا">
      <line x1="20" y1="50" x2="130" y2="50" stroke={BLUE} strokeWidth="3" />
      <line x1="20" y1="80" x2="130" y2="80" stroke={BLUE} strokeWidth="3" />
      <Ar x={75} y={106} size={12} fill={BLUE}>متوازيان</Ar>
      <line x1="200" y1="40" x2="200" y2="100" stroke={GREEN} strokeWidth="3" />
      <line x1="160" y1="90" x2="250" y2="90" stroke={GREEN} strokeWidth="3" />
      <rect x={200} y={78} width={12} height={12} fill="none" stroke={GREEN} strokeWidth="2" />
      <Ar x={205} y={118} size={12} fill={GREEN}>متعامدان</Ar>
      {[
        { x: 40, deg: 45, name: 'حادة' },
        { x: 160, deg: 90, name: 'قائمة' },
        { x: 280, deg: 130, name: 'منفرجة' },
      ].map(({ x, deg, name }) => {
        const a = (-deg * Math.PI) / 180;
        return (
          <g key={name}>
            <line x1={x} y1={186} x2={x + 70} y2={186} stroke={INK} strokeWidth="3" />
            <line x1={x} y1={186} x2={x + 55 * Math.cos(a)} y2={186 + 55 * Math.sin(a)} stroke={INK} strokeWidth="3" />
            {deg === 90 ? (
              <rect x={x} y={174} width={12} height={12} fill="none" stroke={ORANGE} strokeWidth="2" />
            ) : (
              <path d={`M${x + 20} 186A20 20 0 0 0 ${x + 20 * Math.cos(a)} ${186 + 20 * Math.sin(a)}`} fill="none" stroke={ORANGE} strokeWidth="2.5" />
            )}
            <Ar x={x + 35} y={210} size={12} fill={ORANGE}>{name}</Ar>
          </g>
        );
      })}
    </Frame>
  );
}

// 10. Triangles.
function Triangles() {
  const tick = (x: number, y: number, r: number) => <line x1={x - 5 * Math.cos(r)} y1={y - 5 * Math.sin(r)} x2={x + 5 * Math.cos(r)} y2={y + 5 * Math.sin(r)} stroke={ORANGE} strokeWidth="2.5" />;
  return (
    <Frame label="أنواع المثلثات">
      <path d="M30 170h90l-45-78z" fill="#dbeafe" stroke={BLUE} strokeWidth="3" />
      {tick(75, 170, Math.PI / 2)}
      {tick(52, 131, -0.5)}
      {tick(98, 131, 0.5)}
      <Ar x={75} y={200} size={12} fill={BLUE}>متقايس الأضلاع</Ar>
      <path d="M150 170h80l-40-110z" fill="#dcfce7" stroke={GREEN} strokeWidth="3" />
      {tick(170, 115, -0.35)}
      {tick(210, 115, 0.35)}
      <Ar x={190} y={200} size={12} fill={GREEN}>متساوي الساقين</Ar>
      <path d="M270 170h80l-80-90z" fill="#fef3c7" stroke={ORANGE} strokeWidth="3" />
      <rect x={270} y={158} width={12} height={12} fill="none" stroke={ORANGE} strokeWidth="2" />
      <Ar x={310} y={200} size={12} fill={ORANGE}>قائم</Ar>
      <Ar x={190} y={36} size={14}>نصنّف المثلث حسب أضلاعه وزواياه</Ar>
    </Frame>
  );
}

// 11. Symmetry and solids.
function SymmetrySolids() {
  return (
    <Frame label="محور التناظر، المكعب ومتوازي المستطيلات">
      <path d="M90 50l40 40-40 70-40-70z" fill="#fde68a" stroke={GOLD} strokeWidth="3" />
      <line x1="90" y1="36" x2="90" y2="176" stroke={ORANGE} strokeWidth="2.5" strokeDasharray="7 5" />
      <Ar x={90} y={200} size={12} fill={ORANGE}>محور التناظر</Ar>
      <g stroke={BLUE} strokeWidth="2.5" fill="#dbeafe">
        <path d="M180 90h60v60h-60z" />
        <path d="M180 90l20-20h60l-20 20z" fill="#bfdbfe" />
        <path d="M240 90l20-20v60l-20 20z" fill="#93c5fd" />
      </g>
      <Ar x={220} y={190} size={12} fill={BLUE}>مكعب</Ar>
      <g stroke={GREEN} strokeWidth="2.5" fill="#dcfce7">
        <path d="M280 110h70v40h-70z" />
        <path d="M280 110l14-16h70l-14 16z" fill="#bbf7d0" />
        <path d="M350 110l14-16v40l-14 16z" fill="#86efac" />
      </g>
      <Ar x={320} y={190} size={12} fill={GREEN}>متوازي المستطيلات</Ar>
    </Frame>
  );
}

// 12. Proportionality: price of exercise books.
function Proportionality() {
  const qty = [1, 2, 4, 5];
  return (
    <Frame label="جدول تناسبية: ثمن الكراريس">
      <Ar x={190} y={32} size={14}>ثمن الكراس الواحد 30 دج</Ar>
      <g direction="ltr">
        <rect x={20} y={50} width={100} height={40} fill="#f8fafc" stroke="#cbd5e1" />
        <Ar x={70} y={76} size={13}>عدد الكراريس</Ar>
        <rect x={20} y={90} width={100} height={40} fill="#f8fafc" stroke="#cbd5e1" />
        <Ar x={70} y={116} size={13}>الثمن (دج)</Ar>
        {qty.map((q, i) => (
          <g key={q}>
            <rect x={120 + i * 56} y={50} width={56} height={40} fill="#fff" stroke="#cbd5e1" />
            <Num x={148 + i * 56} y={77} size={18}>{q}</Num>
            <rect x={120 + i * 56} y={90} width={56} height={40} fill="#fff" stroke="#cbd5e1" />
            <Num x={148 + i * 56} y={117} size={18} fill={GREEN}>{q * 30}</Num>
          </g>
        ))}
      </g>
      <path d="M354 64c22 0 22 52 0 52" fill="none" stroke={ORANGE} strokeWidth="3" />
      <path d="M352 110l6 10-12 0z" fill={ORANGE} />
      <Num x={350} y={156} size={18} fill={ORANGE}>× 30</Num>
      <Ar x={190} y={196} size={13} fill={MUTED}>نضرب دائماً في العدد نفسه: هذه تناسبية</Ar>
    </Frame>
  );
}

// 13. Percentage and scale.
function PercentageScale() {
  const c = 13;
  return (
    <Frame label="النسبة المئوية 25 بالمائة والمقياس">
      {Array.from({ length: 100 }, (_, i) => (
        <rect key={i} x={24 + (i % 10) * c} y={40 + Math.floor(i / 10) * c} width={c} height={c} fill={i < 25 ? '#86efac' : '#fff'} stroke="#cbd5e1" strokeWidth="1" />
      ))}
      <Num x={89} y={194} size={18} fill={GREEN}>25% = 25/100</Num>
      <Ar x={270} y={52} size={14} fill={BLUE}>المقياس</Ar>
      <line x1="210" y1="96" x2="330" y2="96" stroke={INK} strokeWidth="3" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={210 + i * 40} y1="88" x2={210 + i * 40} y2="104" stroke={INK} strokeWidth="2.5" />
      ))}
      <Ar x={230} y={124} size={13}>1 سم</Ar>
      <Ar x={270} y={154} size={13}>1 سم على الخريطة</Ar>
      <Ar x={270} y={176} size={13} fill={BLUE}>= 100 م في الواقع</Ar>
    </Frame>
  );
}

// 14. Organising data: bar chart of favourite fruits in a class.
function DataOrganization() {
  const bars = [
    { name: 'التمر', v: 12, color: '#b45309' },
    { name: 'البرتقال', v: 8, color: ORANGE },
    { name: 'التفاح', v: 6, color: '#dc2626' },
    { name: 'الموز', v: 4, color: GOLD },
  ];
  return (
    <Frame label="مخطط بالأعمدة: الفاكهة المفضلة في القسم">
      <Ar x={190} y={30} size={14}>الفاكهة المفضلة عند تلاميذ القسم</Ar>
      <line x1="50" y1="170" x2="350" y2="170" stroke={INK} strokeWidth="2.5" />
      <line x1="50" y1="40" x2="50" y2="170" stroke={INK} strokeWidth="2.5" />
      {[0, 4, 8, 12].map((v) => (
        <g key={v}>
          <line x1="46" y1={170 - v * 10} x2="350" y2={170 - v * 10} stroke="#e2e8f0" />
          <Num x={36} y={175 - v * 10} size={12} fill={MUTED}>{v}</Num>
        </g>
      ))}
      {bars.map((b, i) => (
        <g key={b.name}>
          <rect x={80 + i * 70} y={170 - b.v * 10} width={40} height={b.v * 10} rx="4" fill={b.color} />
          <Num x={100 + i * 70} y={164 - b.v * 10} size={13}>{b.v}</Num>
          <Ar x={100 + i * 70} y={192} size={12}>{b.name}</Ar>
        </g>
      ))}
    </Frame>
  );
}

// 15. Circle: centre, radius, diameter.
function Circle() {
  return (
    <Frame label="الدائرة: المركز، نصف القطر والقطر">
      <circle cx={130} cy={110} r={70} fill="#e0f2fe" stroke={BLUE} strokeWidth="3" />
      <line x1={60} y1={110} x2={200} y2={110} stroke={GREEN} strokeWidth="3" />
      <line x1={130} y1={110} x2={130 + 70 * Math.cos(-0.9)} y2={110 + 70 * Math.sin(-0.9)} stroke={ORANGE} strokeWidth="3" />
      <circle cx={130} cy={110} r="5" fill={INK} />
      <Ar x={128} y={132} size={13}>م</Ar>
      <Ar x={290} y={60} size={14}>المركز: م</Ar>
      <Ar x={290} y={92} size={14} fill={ORANGE}>نصف القطر = 3 سم</Ar>
      <Ar x={290} y={124} size={14} fill={GREEN}>القطر = 6 سم</Ar>
      <Ar x={290} y={168} size={13} fill={MUTED}>القطر = 2 × نصف القطر</Ar>
    </Frame>
  );
}

export const MATH_5AP_ILLUSTRATIONS: Record<string, React.FC> = {
  'math-5ap-large-numbers': LargeNumbers,
  'math-5ap-operations': Operations,
  'math-5ap-division': Division,
  'math-5ap-fractions': Fractions,
  'math-5ap-decimals': Decimals,
  'math-5ap-lengths-masses-capacities': Lengths,
  'math-5ap-perimeters-areas': PerimeterArea,
  'math-5ap-durations': Durations,
  'math-5ap-lines-angles': LinesAngles,
  'math-5ap-polygons-triangles': Triangles,
  'math-5ap-symmetry-solides': SymmetrySolids,
  'math-5ap-proportionality-ruleofthree': Proportionality,
  'math-5ap-percentage-scale': PercentageScale,
  'math-5ap-data-organization': DataOrganization,
  'math-5ap-circle-radius': Circle,
};
