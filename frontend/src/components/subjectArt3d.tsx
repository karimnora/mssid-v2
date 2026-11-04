import React, { useId } from 'react';

/**
 * Subject illustrations in a soft 3D style (V2): light from the top left, gradients for volume,
 * a ground shadow, glossy highlights on glass and metal. Same 160×120 frame as before, so every
 * card and the courses header keep their layout. Gradient ids are made unique per instance and
 * sanitised (React 19 ids contain « : », which some Android WebViews reject inside url(#…)).
 */
function useIds<T extends string>(...names: T[]): Record<T, string> & { url: (name: T) => string } {
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = Object.fromEntries(names.map((name) => [name, `${base}-${name}`])) as Record<T, string>;
  return Object.assign(ids, { url: (name: T) => `url(#${ids[name]})` });
}

function Frame({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full select-none" direction="ltr" style={{ direction: 'ltr' }} fill="none" xmlns="http://www.w3.org/2000/svg" role={label ? 'img' : undefined} aria-hidden={label ? undefined : true} aria-label={label}>
      {children}
    </svg>
  );
}

/** Soft blob behind the object, in the card colour, with a light halo. */
function Backdrop({ id, from, to }: { id: string; from: string; to: string }) {
  return (
    <>
      <defs>
        <radialGradient id={id} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </radialGradient>
      </defs>
      <path d="M160 18C160 78 118 120 66 120C30 120 6 102 0 84V0H160Z" fill={`url(#${id})`} opacity="0.95" />
      <circle cx="132" cy="22" r="20" fill="#fff" opacity="0.14" />
      <circle cx="146" cy="56" r="7" fill="#fff" opacity="0.18" />
    </>
  );
}

function Shadow({ cx, cy, rx, ry = 6 }: { cx: number; cy: number; rx: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#0b1240" opacity="0.28" />;
}

function Arabic() {
  const g = useIds('bg', 'pageL', 'pageR', 'ink', 'gold');
  return (
    <Frame>
      <Backdrop id={g.bg} from="#34d399" to="#047857" />
      <defs>
        <linearGradient id={g.pageL} x1="0" x2="1"><stop offset="0" stopColor="#fffdf5" /><stop offset="1" stopColor="#e8dcc0" /></linearGradient>
        <linearGradient id={g.pageR} x1="1" x2="0"><stop offset="0" stopColor="#fffdf5" /><stop offset="1" stopColor="#e8dcc0" /></linearGradient>
        <radialGradient id={g.ink} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#4b5d8a" /><stop offset="1" stopColor="#0f1a3a" /></radialGradient>
        <linearGradient id={g.gold} x1="0" x2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#b45309" /></linearGradient>
      </defs>
      <Shadow cx={86} cy={104} rx={56} />
      {/* open book: two curved pages and their thickness */}
      <path d="M30 40 Q58 30 84 42 V100 Q58 88 30 98Z" fill="#0f5132" />
      <path d="M138 40 Q110 30 84 42 V100 Q110 88 138 98Z" fill="#0f5132" />
      <path d="M34 36 Q58 26 84 38 V96 Q58 84 34 94Z" fill={g.url('pageL')} />
      <path d="M134 36 Q110 26 84 38 V96 Q110 84 134 94Z" fill={g.url('pageR')} />
      <path d="M84 38 V96" stroke="#b9a47a" strokeWidth="1.5" />
      {/* calligraphy lines and a big ض */}
      <text x="110" y="70" fontSize="30" fontWeight="800" fill="#065f46" textAnchor="middle" direction="rtl" fontFamily="'Noto Naskh Arabic', 'Amiri', serif">ض</text>
      {[48, 58, 68, 78].map((y) => <path key={y} d={`M42 ${y} Q58 ${y - 4} 76 ${y + 1}`} stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />)}
      {/* inkwell and reed pen */}
      <ellipse cx="36" cy="94" rx="13" ry="4" fill="#0b1240" opacity="0.3" />
      <path d="M25 92 Q24 78 30 74 H42 Q48 78 47 92Z" fill={g.url('ink')} />
      <rect x="29" y="69" width="14" height="6" rx="2" fill={g.url('gold')} />
      <path d="M30 80 Q32 76 36 76" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <path d="M36 70 L58 20" stroke="#a16207" strokeWidth="4" strokeLinecap="round" />
      <path d="M58 20 L61 13 L56 18Z" fill="#422006" />
    </Frame>
  );
}

function Math3d() {
  const g = useIds('bg', 'top', 'left', 'right', 'ball', 'pyr1', 'pyr2', 'pencil');
  return (
    <Frame>
      <Backdrop id={g.bg} from="#60a5fa" to="#1d4ed8" />
      <defs>
        <linearGradient id={g.top} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#fbbf24" /></linearGradient>
        <linearGradient id={g.left} x1="0" x2="1"><stop offset="0" stopColor="#f59e0b" /><stop offset="1" stopColor="#d97706" /></linearGradient>
        <linearGradient id={g.right} x1="0" x2="1"><stop offset="0" stopColor="#b45309" /><stop offset="1" stopColor="#92400e" /></linearGradient>
        <radialGradient id={g.ball} cx="0.35" cy="0.3" r="0.75"><stop offset="0" stopColor="#fecdd3" /><stop offset="0.45" stopColor="#f43f5e" /><stop offset="1" stopColor="#9f1239" /></radialGradient>
        <linearGradient id={g.pyr1} x1="0" x2="1"><stop offset="0" stopColor="#6ee7b7" /><stop offset="1" stopColor="#10b981" /></linearGradient>
        <linearGradient id={g.pyr2} x1="0" x2="1"><stop offset="0" stopColor="#059669" /><stop offset="1" stopColor="#065f46" /></linearGradient>
        <linearGradient id={g.pencil} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fde047" /><stop offset="1" stopColor="#ca8a04" /></linearGradient>
      </defs>
      <Shadow cx={80} cy={104} rx={62} />
      {/* cube */}
      <path d="M36 50 L62 38 L88 50 L62 62Z" fill={g.url('top')} />
      <path d="M36 50 L62 62 V92 L36 80Z" fill={g.url('left')} />
      <path d="M88 50 L62 62 V92 L88 80Z" fill={g.url('right')} />
      <path d="M36 50 L62 38 L88 50" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
      {/* sphere */}
      <circle cx="114" cy="74" r="20" fill={g.url('ball')} />
      <ellipse cx="107" cy="65" rx="6" ry="4" fill="#fff" opacity="0.55" transform="rotate(-30 107 65)" />
      {/* pyramid */}
      <path d="M100 98 L120 56 L132 100Z" fill={g.url('pyr1')} />
      <path d="M132 100 L120 56 L146 94Z" fill={g.url('pyr2')} />
      {/* pencil */}
      <g transform="translate(20 104) rotate(-28)">
        <rect x="0" y="-4" width="58" height="8" rx="1.5" fill={g.url('pencil')} />
        <rect x="-8" y="-4" width="8" height="8" rx="2" fill="#fb7185" />
        <path d="M58 -4 L70 0 L58 4Z" fill="#fcd9b6" />
        <path d="M66 -1.3 L70 0 L66 1.3Z" fill="#1f2937" />
      </g>
    </Frame>
  );
}

function French() {
  const g = useIds('bg', 'cover', 'page', 'pen', 'nib');
  return (
    <Frame>
      <Backdrop id={g.bg} from="#e879f9" to="#7e22ce" />
      <defs>
        <linearGradient id={g.cover} x1="0" x2="1"><stop offset="0" stopColor="#ef4444" /><stop offset="1" stopColor="#991b1b" /></linearGradient>
        <linearGradient id={g.page} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e5e7eb" /></linearGradient>
        <linearGradient id={g.pen} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#334155" /><stop offset="0.5" stopColor="#0f172a" /><stop offset="1" stopColor="#334155" /></linearGradient>
        <linearGradient id={g.nib} x1="0" x2="1"><stop offset="0" stopColor="#fef3c7" /><stop offset="1" stopColor="#d97706" /></linearGradient>
      </defs>
      <Shadow cx={84} cy={106} rx={52} />
      <g transform="rotate(-8 84 66)">
        <rect x="46" y="26" width="78" height="74" rx="6" fill={g.url('cover')} />
        <rect x="50" y="28" width="72" height="70" rx="4" fill={g.url('page')} />
        {[40, 50, 60, 70, 80, 90].map((y) => <path key={y} d={`M58 ${y} H116`} stroke="#93c5fd" strokeWidth="1.2" />)}
        <path d="M64 30 V96" stroke="#fca5a5" strokeWidth="1.5" />
        {[34, 48, 62, 76, 90].map((y) => <circle key={y} cx="50" cy={y} r="2.6" fill="#94a3b8" />)}
        <text x="96" y="74" fontSize="30" fontWeight="800" fill="#1e3a8a" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic">Aa</text>
      </g>
      <g transform="translate(140 50) rotate(32)">
        <rect x="-5" y="0" width="10" height="56" rx="5" fill={g.url('pen')} />
        <rect x="-5" y="14" width="10" height="4" fill="#facc15" />
        <path d="M-5 56 L0 74 L5 56Z" fill={g.url('nib')} />
        <path d="M0 60 V70" stroke="#78350f" strokeWidth="1" />
        <rect x="-2" y="4" width="2" height="40" rx="1" fill="#fff" opacity="0.35" />
      </g>
    </Frame>
  );
}

function Science() {
  const g = useIds('bg', 'glass', 'liquid', 'glow');
  return (
    <Frame>
      <Backdrop id={g.bg} from="#5eead4" to="#0f766e" />
      <defs>
        <linearGradient id={g.glass} x1="0" x2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0.55" /><stop offset="0.5" stopColor="#ffffff" stopOpacity="0.12" /><stop offset="1" stopColor="#ffffff" stopOpacity="0.4" /></linearGradient>
        <linearGradient id={g.liquid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a3e635" /><stop offset="1" stopColor="#15803d" /></linearGradient>
        <radialGradient id={g.glow} cx="0.5" cy="0.6" r="0.6"><stop offset="0" stopColor="#d9f99d" stopOpacity="0.9" /><stop offset="1" stopColor="#d9f99d" stopOpacity="0" /></radialGradient>
      </defs>
      <Shadow cx={82} cy={106} rx={44} />
      <ellipse cx="82" cy="82" rx="46" ry="30" fill={g.url('glow')} />
      {/* Erlenmeyer flask */}
      <path d="M58 104 Q50 104 54 96 L72 58 V36 H92 V58 L110 96 Q114 104 106 104Z" fill={g.url('liquid')} />
      <path d="M62 80 H102 L110 96 Q114 104 106 104 H58 Q50 104 54 96Z" fill="#14532d" opacity="0.25" />
      <path d="M58 104 Q50 104 54 96 L72 58 V36 H92 V58 L110 96 Q114 104 106 104Z" fill={g.url('glass')} stroke="#ecfeff" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M66 36 H98" stroke="#ecfeff" strokeWidth="4" strokeLinecap="round" />
      <path d="M76 44 V60 L62 90" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {[[80, 72, 4], [92, 64, 3], [86, 52, 2.5], [96, 46, 2], [74, 86, 3]].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#ecfccb" opacity="0.85" />
      ))}
      {/* atom */}
      <g transform="translate(128 40)" stroke="#fef08a" strokeWidth="2" fill="none">
        <ellipse rx="18" ry="7" />
        <ellipse rx="18" ry="7" transform="rotate(60)" />
        <ellipse rx="18" ry="7" transform="rotate(-60)" />
        <circle r="4" fill="#facc15" stroke="none" />
      </g>
    </Frame>
  );
}

function Islamic() {
  const g = useIds('bg', 'dome', 'wall', 'moon');
  return (
    <Frame>
      <Backdrop id={g.bg} from="#4f46e5" to="#1e1b4b" />
      <defs>
        <radialGradient id={g.dome} cx="0.35" cy="0.25" r="0.85"><stop offset="0" stopColor="#fef3c7" /><stop offset="0.5" stopColor="#f59e0b" /><stop offset="1" stopColor="#92400e" /></radialGradient>
        <linearGradient id={g.wall} x1="0" x2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#cbd5e1" /></linearGradient>
        <radialGradient id={g.moon} cx="0.35" cy="0.35" r="0.8"><stop offset="0" stopColor="#fffbeb" /><stop offset="1" stopColor="#fbbf24" /></radialGradient>
      </defs>
      {[[24, 20], [56, 12], [148, 74], [100, 14], [16, 52]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#fff" opacity="0.8" />)}
      <circle cx="132" cy="28" r="13" fill={g.url('moon')} />
      <circle cx="138" cy="24" r="11" fill="#312e81" />
      <Shadow cx={80} cy={108} rx={64} ry={5} />
      {/* minaret */}
      <rect x="112" y="40" width="14" height="66" fill={g.url('wall')} />
      <rect x="108" y="56" width="22" height="5" rx="2" fill="#e2e8f0" />
      <path d="M112 40 Q119 26 126 40Z" fill={g.url('dome')} />
      <path d="M119 26 V20" stroke="#fbbf24" strokeWidth="2" />
      {/* mosque body and dome */}
      <rect x="30" y="70" width="80" height="36" fill={g.url('wall')} />
      <path d="M38 70 Q38 38 70 32 Q102 38 102 70Z" fill={g.url('dome')} />
      <ellipse cx="58" cy="48" rx="8" ry="5" fill="#fff" opacity="0.45" transform="rotate(-30 58 48)" />
      <path d="M70 32 V24 M66 22 A4 4 0 1 0 74 22" stroke="#fbbf24" strokeWidth="2" fill="none" />
      {[44, 70, 96].map((x) => <path key={x} d={`M${x - 7} 106 V90 Q${x} 80 ${x + 7} 90 V106Z`} fill="#1e3a8a" opacity="0.85" />)}
      <rect x="30" y="68" width="80" height="4" fill="#e2e8f0" />
    </Frame>
  );
}

function HistoryGeo() {
  const g = useIds('bg', 'ocean', 'brass', 'land');
  return (
    <Frame>
      <Backdrop id={g.bg} from="#fbbf24" to="#b45309" />
      <defs>
        <radialGradient id={g.ocean} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#bae6fd" /><stop offset="0.5" stopColor="#0ea5e9" /><stop offset="1" stopColor="#075985" /></radialGradient>
        <linearGradient id={g.brass} x1="0" x2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="0.5" stopColor="#ca8a04" /><stop offset="1" stopColor="#713f12" /></linearGradient>
        <linearGradient id={g.land} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#86efac" /><stop offset="1" stopColor="#15803d" /></linearGradient>
      </defs>
      <Shadow cx={82} cy={108} rx={40} ry={5} />
      <path d="M66 104 H98 L92 96 H72Z" fill={g.url('brass')} />
      <rect x="79" y="84" width="6" height="14" fill={g.url('brass')} />
      <circle cx="82" cy="56" r="32" fill={g.url('ocean')} />
      {/* Africa and Europe, roughly */}
      <path d="M74 34 Q84 30 90 36 Q96 42 92 50 Q98 58 94 68 Q90 80 84 84 Q80 74 78 66 Q70 60 72 50 Q66 44 74 34Z" fill={g.url('land')} />
      <path d="M68 28 Q76 24 84 28 Q80 32 72 32Z" fill={g.url('land')} />
      <path d="M100 40 Q108 44 106 52 Q100 50 100 40Z" fill={g.url('land')} />
      <ellipse cx="70" cy="42" rx="9" ry="6" fill="#fff" opacity="0.35" transform="rotate(-30 70 42)" />
      <path d="M50 56 A32 32 0 0 0 114 56" stroke={g.url('brass')} strokeWidth="3.5" fill="none" transform="rotate(-20 82 56)" />
      <path d="M82 22 A34 34 0 0 1 82 90" stroke={g.url('brass')} strokeWidth="3" fill="none" />
      {/* old map scroll */}
      <g transform="translate(118 74) rotate(-12)">
        <rect x="-4" y="0" width="34" height="24" rx="3" fill="#fef3c7" stroke="#92400e" strokeWidth="1.5" />
        <path d="M2 16 Q10 6 18 12 T28 6" stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        <path d="M22 18 l3 -3 M22 15 l3 3" stroke="#b91c1c" strokeWidth="1.5" />
      </g>
    </Frame>
  );
}

function Civics() {
  const g = useIds('bg', 'brass', 'green', 'white');
  return (
    <Frame>
      <Backdrop id={g.bg} from="#fb7185" to="#be123c" />
      <defs>
        <linearGradient id={g.brass} x1="0" x2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="0.5" stopColor="#d97706" /><stop offset="1" stopColor="#78350f" /></linearGradient>
        <linearGradient id={g.green} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#16a34a" /><stop offset="1" stopColor="#006233" /></linearGradient>
        <linearGradient id={g.white} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e2e8f0" /></linearGradient>
      </defs>
      <Shadow cx={84} cy={108} rx={60} ry={5} />
      {/* Algerian flag, waving */}
      <path d="M30 104 V18" stroke="#6b4a2a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 20 Q48 14 62 22 V58 Q48 50 32 56Z" fill={g.url('green')} />
      <path d="M62 22 Q76 30 92 24 V60 Q76 66 62 58Z" fill={g.url('white')} />
      <circle cx="62" cy="40" r="9" fill="#d21034" />
      <circle cx="65" cy="40" r="7.5" fill="#f8fafc" />
      <path d="M68 36 L69.3 39.4 L73 39.5 L70.1 41.7 L71.2 45.2 L68 43.1 L64.8 45.2 L65.9 41.7 L63 39.5 L66.7 39.4Z" fill="#d21034" />
      {/* balance scales */}
      <rect x="114" y="46" width="5" height="56" fill={g.url('brass')} />
      <path d="M104 104 H130 L126 98 H108Z" fill={g.url('brass')} />
      <path d="M96 52 H138" stroke={g.url('brass')} strokeWidth="4" strokeLinecap="round" />
      <circle cx="116.5" cy="46" r="4" fill={g.url('brass')} />
      <path d="M100 52 L92 74 M100 52 L108 74 M134 52 L126 74 M134 52 L142 74" stroke="#92400e" strokeWidth="1.2" />
      <path d="M90 74 Q100 84 110 74Z" fill={g.url('brass')} />
      <path d="M124 74 Q134 84 144 74Z" fill={g.url('brass')} />
    </Frame>
  );
}

function English() {
  const g = useIds('bg', 'b1', 'b2', 'b3', 'bubble');
  return (
    <Frame>
      <Backdrop id={g.bg} from="#38bdf8" to="#1e3a8a" />
      <defs>
        <linearGradient id={g.b1} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f87171" /><stop offset="1" stopColor="#b91c1c" /></linearGradient>
        <linearGradient id={g.b2} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#60a5fa" /><stop offset="1" stopColor="#1d4ed8" /></linearGradient>
        <linearGradient id={g.b3} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fde047" /><stop offset="1" stopColor="#ca8a04" /></linearGradient>
        <linearGradient id={g.bubble} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#dbeafe" /></linearGradient>
      </defs>
      <Shadow cx={74} cy={108} rx={52} ry={5} />
      {/* stack of books: cover, page edge, spine band */}
      {[
        { y: 86, w: 84, x: 30, f: 'b1' as const },
        { y: 70, w: 76, x: 36, f: 'b2' as const },
        { y: 54, w: 80, x: 32, f: 'b3' as const },
      ].map((b) => (
        <g key={b.y}>
          <rect x={b.x} y={b.y} width={b.w} height="16" rx="3" fill={g.url(b.f)} />
          <rect x={b.x + b.w - 10} y={b.y + 3} width="8" height="10" rx="1" fill="#f8fafc" />
          <rect x={b.x + 8} y={b.y + 6} width={b.w - 30} height="3" rx="1.5" fill="#fff" opacity="0.5" />
        </g>
      ))}
      {/* speech bubble */}
      <path d="M96 14 H146 Q152 14 152 20 V42 Q152 48 146 48 H118 L108 58 L110 48 H96 Q90 48 90 42 V20 Q90 14 96 14Z" fill={g.url('bubble')} stroke="#1e40af" strokeWidth="2" />
      <text x="121" y="38" fontSize="17" fontWeight="900" fill="#1e3a8a" textAnchor="middle" fontFamily="'Segoe UI', Arial, sans-serif">Hello!</text>
    </Frame>
  );
}

function Tamazight() {
  const g = useIds('bg', 'clay', 'rim');
  return (
    <Frame>
      <Backdrop id={g.bg} from="#facc15" to="#c2410c" />
      <defs>
        <radialGradient id={g.clay} cx="0.35" cy="0.3" r="0.85"><stop offset="0" stopColor="#fed7aa" /><stop offset="0.5" stopColor="#ea580c" /><stop offset="1" stopColor="#7c2d12" /></radialGradient>
        <linearGradient id={g.rim} x1="0" x2="1"><stop offset="0" stopColor="#fdba74" /><stop offset="1" stopColor="#9a3412" /></linearGradient>
      </defs>
      <Shadow cx={80} cy={108} rx={40} ry={5} />
      {/* Kabyle-style clay jar */}
      <path d="M62 30 H98 V36 Q114 46 114 70 Q114 98 80 104 Q46 98 46 70 Q46 46 62 36Z" fill={g.url('clay')} />
      <rect x="60" y="26" width="40" height="8" rx="3" fill={g.url('rim')} />
      <path d="M50 62 H110" stroke="#fef3c7" strokeWidth="2" />
      <path d="M48 78 H112" stroke="#fef3c7" strokeWidth="2" />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${54 + i * 9} 78 L${58.5 + i * 9} 70 L${63 + i * 9} 78`} stroke="#1f2937" strokeWidth="1.8" fill="none" />
      ))}
      <text x="80" y="58" fontSize="20" fontWeight="900" fill="#fef3c7" textAnchor="middle" fontFamily="'Noto Sans Tifinagh', 'Ebrima', sans-serif">ⵣ</text>
      <ellipse cx="62" cy="52" rx="6" ry="10" fill="#fff" opacity="0.25" transform="rotate(20 62 52)" />
    </Frame>
  );
}

function Art() {
  const g = useIds('bg', 'wood', 'red', 'blue', 'yellow', 'green', 'brush');
  const paint = (id: 'red' | 'blue' | 'yellow' | 'green', from: string, to: string) => (
    <radialGradient id={g[id]} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} /></radialGradient>
  );
  return (
    <Frame>
      <Backdrop id={g.bg} from="#f9a8d4" to="#be185d" />
      <defs>
        <linearGradient id={g.wood} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fde4b8" /><stop offset="1" stopColor="#b7793a" /></linearGradient>
        {paint('red', '#fecaca', '#dc2626')}
        {paint('blue', '#bfdbfe', '#2563eb')}
        {paint('yellow', '#fef9c3', '#eab308')}
        {paint('green', '#bbf7d0', '#16a34a')}
        <linearGradient id={g.brush} x1="0" x2="1"><stop offset="0" stopColor="#7c2d12" /><stop offset="1" stopColor="#c2410c" /></linearGradient>
      </defs>
      <Shadow cx={80} cy={106} rx={56} ry={6} />
      <path d="M28 66 Q26 30 74 24 Q124 20 132 54 Q138 80 110 92 Q96 98 92 88 Q88 76 74 82 Q60 90 64 100 Q40 100 28 66Z" fill={g.url('wood')} />
      <ellipse cx="74" cy="90" rx="7" ry="5" fill="#be185d" opacity="0.35" />
      {[[52, 46, 'red'], [74, 38, 'yellow'], [98, 42, 'blue'], [114, 62, 'green']].map(([x, y, c]) => (
        <g key={c as string}>
          <circle cx={x as number} cy={y as number} r="9" fill={g.url(c as 'red')} />
          <ellipse cx={(x as number) - 3} cy={(y as number) - 3} rx="3" ry="2" fill="#fff" opacity="0.7" />
        </g>
      ))}
      <g transform="translate(40 100) rotate(-48)">
        <rect x="0" y="-3" width="56" height="6" rx="3" fill={g.url('brush')} />
        <rect x="56" y="-4" width="10" height="8" fill="#cbd5e1" />
        <path d="M66 -4 Q80 0 66 4Z" fill="#2563eb" />
      </g>
    </Frame>
  );
}

const ART: Record<string, React.FC> = {
  arabic: Arabic,
  math: Math3d,
  french: French,
  science: Science,
  islamic: Islamic,
  history_geo: HistoryGeo,
  civics: Civics,
  english: English,
  tamazight: Tamazight,
  art: Art,
};

export const SUBJECT_ART_IDS = Object.keys(ART);

/** The 3D-style drawing of a subject, or null for a subject without one (the caller keeps its fallback). */
export function SubjectArt3d({ id }: { id: string }) {
  const Drawing = ART[id];
  return Drawing ? <Drawing /> : null;
}
