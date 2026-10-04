import React, { useId } from 'react';

interface CountryFlagProps {
  countryId: string;
  className?: string;
}

function starPoints(cx: number, cy: number, outer: number, inner: number, rotation = -Math.PI / 2): string {
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = rotation + (i * Math.PI) / 5;
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`;
  }).join(' ');
}

const DZ_STAR = starPoints(508, 300, 38, 16);
const TN_STAR = starPoints(470, 300, 42, 17);
const LY_STAR = starPoints(490, 300, 28, 12);
const MR_STAR = starPoints(450, 248, 34, 14);
const MA_STAR = starPoints(450, 300, 92, 36);
const EH_STAR = starPoints(488, 300, 22, 9);

function Crescent({
  maskId,
  cx,
  cy,
  outer,
  inner,
  shiftX = 0,
  shiftY = 0,
  fill,
}: {
  maskId: string;
  cx: number;
  cy: number;
  outer: number;
  inner: number;
  shiftX?: number;
  shiftY?: number;
  fill: string;
}) {
  return (
    <>
      <mask id={maskId}>
        <circle cx={cx} cy={cy} r={outer} fill="#fff" />
        <circle cx={cx + shiftX} cy={cy + shiftY} r={inner} fill="#000" />
      </mask>
      <circle cx={cx} cy={cy} r={outer} fill={fill} mask={`url(#${maskId})`} />
    </>
  );
}

function FlagSvg({ countryId, uid }: { countryId: string; uid: string }) {
  switch (countryId) {
    case 'dz':
      return (
        <>
          <rect width="450" height="600" fill="#006233" />
          <rect x="450" width="450" height="600" fill="#FFFFFF" />
          <Crescent maskId={`${uid}-c`} cx={428} cy={300} outer={108} inner={86} shiftX={34} fill="#D21034" />
          <polygon points={DZ_STAR} fill="#D21034" />
        </>
      );
    case 'tn':
      return (
        <>
          <rect width="900" height="600" fill="#E70013" />
          <circle cx="450" cy="300" r="132" fill="#FFFFFF" />
          <Crescent maskId={`${uid}-c`} cx={448} cy={300} outer={88} inner={68} shiftX={28} fill="#E70013" />
          <polygon points={TN_STAR} fill="#E70013" />
        </>
      );
    case 'ly':
      return (
        <>
          <rect width="900" height="150" fill="#E70013" />
          <rect y="150" width="900" height="300" fill="#000000" />
          <rect y="450" width="900" height="150" fill="#239E46" />
          <Crescent maskId={`${uid}-c`} cx={430} cy={300} outer={70} inner={54} shiftX={22} fill="#FFFFFF" />
          <polygon points={LY_STAR} fill="#FFFFFF" />
        </>
      );
    case 'ma':
      return (
        <>
          <rect width="900" height="600" fill="#C1272D" />
          <polygon points={MA_STAR} fill="none" stroke="#006233" strokeWidth="22" strokeLinejoin="miter" />
        </>
      );
    case 'mr':
      return (
        <>
          <rect width="900" height="600" fill="#00A95C" />
          <rect width="900" height="78" fill="#D01C1F" />
          <rect y="522" width="900" height="78" fill="#D01C1F" />
          <Crescent maskId={`${uid}-c`} cx={450} cy={340} outer={90} inner={70} shiftY={-30} fill="#FFD100" />
          <polygon points={MR_STAR} fill="#FFD100" />
        </>
      );
    case 'ml':
      return (
        <>
          <rect width="300" height="600" fill="#14B53A" />
          <rect x="300" width="300" height="600" fill="#FCD116" />
          <rect x="600" width="300" height="600" fill="#CE1126" />
        </>
      );
    case 'ne':
      return (
        <>
          <rect width="900" height="200" fill="#E05206" />
          <rect y="200" width="900" height="200" fill="#FFFFFF" />
          <rect y="400" width="900" height="200" fill="#0DB02B" />
          <circle cx="450" cy="300" r="68" fill="#E05206" />
        </>
      );
    case 'eg':
      return (
        <>
          <rect width="900" height="200" fill="#CE1126" />
          <rect y="200" width="900" height="200" fill="#FFFFFF" />
          <rect y="400" width="900" height="200" fill="#000000" />
          <path fill="#C09300" d="M450 232 390 318l32 10-18 40h92l-18-40 32-10Z" />
          <path fill="#C09300" d="M338 300c46 8 78 18 112 18s66-10 112-18l-18 46c-30 8-62 12-94 12s-64-4-94-12Z" />
        </>
      );
    case 'eh':
      return (
        <>
          <rect width="900" height="200" fill="#000000" />
          <rect y="200" width="900" height="200" fill="#FFFFFF" />
          <rect y="400" width="900" height="200" fill="#007229" />
          <path fill="#CE1126" d="M0 0 360 300 0 600Z" />
          <Crescent maskId={`${uid}-c`} cx={430} cy={300} outer={52} inner={40} shiftX={16} fill="#CE1126" />
          <polygon points={EH_STAR} fill="#CE1126" />
        </>
      );
    case 'ps':
      return (
        <>
          <rect width="900" height="200" fill="#000000" />
          <rect y="200" width="900" height="200" fill="#FFFFFF" />
          <rect y="400" width="900" height="200" fill="#007A3D" />
          <path fill="#EE2A35" d="M0 0 360 300 0 600Z" />
        </>
      );
    case 'sa':
      return (
        <>
          <rect width="900" height="600" fill="#006C35" />
          <text
            x="450"
            y="268"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Cairo, 'Noto Naskh Arabic', sans-serif"
            fontSize="54"
            fontWeight="800"
          >
            لا إله إلا الله
          </text>
          <text
            x="450"
            y="332"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Cairo, 'Noto Naskh Arabic', sans-serif"
            fontSize="40"
            fontWeight="800"
          >
            محمد رسول الله
          </text>
          <path
            fill="#FFFFFF"
            d="M210 430h420c18 0 28 14 18 26L610 502H250c-22 0-28-16-18-28l-22-44Zm430 8 78 22-90 28v-28Z"
          />
        </>
      );
    default:
      return <rect width="900" height="600" fill="#E7E2D7" />;
  }
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ countryId, className }) => {
  const uid = useId().replace(/:/g, '');
  return (
    <div className={className} dir="ltr" data-country-flag={countryId}>
      <svg viewBox="0 0 900 600" className="h-full w-full block" aria-hidden="true">
        <defs>
          <clipPath id={`${uid}-round`}>
            <rect width="900" height="600" rx="28" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${uid}-round)`}>
          <FlagSvg countryId={countryId} uid={uid} />
        </g>
        <rect width="900" height="600" rx="28" fill="none" stroke="#E7E2D7" strokeWidth="8" />
      </svg>
    </div>
  );
};
