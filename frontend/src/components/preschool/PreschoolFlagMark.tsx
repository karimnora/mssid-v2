import React, { useId } from 'react';

/**
 * Regional-indicator flag emojis (🇩🇿) render as ISO letters (DZ) on Windows and
 * some Android WebViews. Same class of bug as PreschoolShapeMark.
 */
const RI_A = 0x1f1e6;
const RI_Z = 0x1f1ff;

export function flagIsoFromEmoji(asset: string): string | null {
  const cps = [...asset];
  if (cps.length !== 2) return null;
  const a = cps[0].codePointAt(0);
  const b = cps[1].codePointAt(0);
  if (a == null || b == null || a < RI_A || a > RI_Z || b < RI_A || b > RI_Z) return null;
  return String.fromCharCode(65 + (a - RI_A), 65 + (b - RI_A));
}

export function isFlagEmoji(asset: string): boolean {
  return flagIsoFromEmoji(asset) !== null;
}

function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(' ');
}

const DZ_STAR = starPoints(528, 300, 48, 20);

function FlagSvg({
  iso,
  size,
  className,
  children,
}: {
  iso: string;
  size: number;
  className: string;
  children: React.ReactNode;
}): React.ReactElement {
  const h = Math.round((size * 2) / 3);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 900 600"
      className={`shrink-0 rounded-md shadow-sm overflow-hidden ${className}`}
      aria-hidden="true"
      data-flag={iso}
    >
      {children}
    </svg>
  );
}

function AlgerianFlag({ size, className }: { size: number; className: string }) {
  const uid = useId();
  const maskId = `${uid}-crescent`;
  return (
    <FlagSvg iso="DZ" size={size} className={className}>
      <rect width="450" height="600" fill="#006233" />
      <rect x="450" width="450" height="600" fill="#fff" />
      <mask id={maskId}>
        <rect width="900" height="600" fill="#000" />
        <circle cx="450" cy="300" r="118" fill="#fff" />
        <circle cx="486" cy="300" r="94" fill="#000" />
      </mask>
      <circle cx="450" cy="300" r="118" fill="#D21034" mask={`url(#${maskId})`} />
      <polygon points={DZ_STAR} fill="#D21034" />
    </FlagSvg>
  );
}

function JapanFlag({ size, className }: { size: number; className: string }) {
  return (
    <FlagSvg iso="JP" size={size} className={className}>
      <rect width="900" height="600" fill="#fff" />
      <circle cx="450" cy="300" r="180" fill="#BC002D" />
    </FlagSvg>
  );
}

function BrazilFlag({ size, className }: { size: number; className: string }) {
  return (
    <FlagSvg iso="BR" size={size} className={className}>
      <rect width="900" height="600" fill="#009B3A" />
      <polygon points="450,70 830,300 450,530 70,300" fill="#FEDD00" />
      <circle cx="450" cy="300" r="108" fill="#002776" />
    </FlagSvg>
  );
}

function FranceFlag({ size, className }: { size: number; className: string }) {
  return (
    <FlagSvg iso="FR" size={size} className={className}>
      <rect width="300" height="600" fill="#002395" />
      <rect x="300" width="300" height="600" fill="#fff" />
      <rect x="600" width="300" height="600" fill="#ED2939" />
    </FlagSvg>
  );
}

function BritainFlag({ size, className }: { size: number; className: string }) {
  return (
    <FlagSvg iso="GB" size={size} className={className}>
      <rect width="900" height="600" fill="#012169" />
      <path d="M0,0 L900,600 M900,0 L0,600" stroke="#fff" strokeWidth="90" />
      <path d="M0,0 L900,600 M900,0 L0,600" stroke="#C8102E" strokeWidth="36" />
      <path d="M450,0 V600 M0,300 H900" stroke="#fff" strokeWidth="150" />
      <path d="M450,0 V600 M0,300 H900" stroke="#C8102E" strokeWidth="90" />
    </FlagSvg>
  );
}

function GenericFlag({ iso, size, className }: { iso: string; size: number; className: string }) {
  return (
    <FlagSvg iso={iso} size={size} className={className}>
      <rect width="900" height="600" fill="#38bdf8" />
      <rect x="24" y="24" width="852" height="552" fill="none" stroke="#fff" strokeWidth="18" />
      <text
        x="450"
        y="340"
        textAnchor="middle"
        fontSize="180"
        fontWeight="800"
        fill="#0f172a"
        fontFamily="sans-serif"
      >
        {iso}
      </text>
    </FlagSvg>
  );
}

interface PreschoolFlagMarkProps {
  asset: string;
  size?: number;
  className?: string;
}

export const PreschoolFlagMark: React.FC<PreschoolFlagMarkProps> = ({
  asset,
  size = 64,
  className = '',
}) => {
  const iso = flagIsoFromEmoji(asset);
  if (!iso) {
    return <span className={className} style={{ fontSize: size * 0.9 }}>{asset}</span>;
  }
  if (iso === 'DZ') return <AlgerianFlag size={size} className={className} />;
  if (iso === 'JP') return <JapanFlag size={size} className={className} />;
  if (iso === 'BR') return <BrazilFlag size={size} className={className} />;
  if (iso === 'FR') return <FranceFlag size={size} className={className} />;
  if (iso === 'GB') return <BritainFlag size={size} className={className} />;
  return <GenericFlag iso={iso} size={size} className={className} />;
};
