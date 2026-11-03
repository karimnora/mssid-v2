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

const DZ_STAR = starPoints(510, 300, 75, 28.6, 0);
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
          {/* Official construction: crescent r = H/4 and H/5 (shifted H/16), star r = H/8 pointing to the fly. */}
          <path fill="#D21034" d="M579.904 225.27a150 150 0 1 0 0 149.46 120 120 0 1 1 0-149.46" />
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
          {/* Eagle of Saladin, simplified: spread wings, head turned to the hoist, shield, cartouche. */}
          <g fill="#C09300">
            <path d="M436 262C396 248 356 258 334 294c20-6 34-4 44 4-14 4-26 14-32 30 22-12 44-12 62-4l58 4Z" />
            <path d="M464 262c40-14 80-4 102 32-20-6-34-4-44 4 14 4 26 14 32 30-22-12-44-12-62-4l-58 4Z" />
            <path d="M426 262h48l-6 78-18 14-18-14Z" />
            <circle cx="450" cy="246" r="17" />
            <path d="M435 243l-19 7 19 5Z" />
            <path d="M434 350l16 22 16-22Z" />
            <rect x="406" y="372" width="88" height="18" rx="5" />
          </g>
          <path d="M437 276h26v32c0 10-13 16-13 16s-13-6-13-16Z" fill="#FFFFFF" stroke="#C09300" strokeWidth="4" />
          <circle cx="447" cy="243" r="3.5" fill="#000000" />
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
            y="262"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Cairo, 'Noto Naskh Arabic', sans-serif"
            fontSize="92"
            fontWeight="800"
          >
            لا إله إلا الله
          </text>
          <text
            x="450"
            y="362"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Cairo, 'Noto Naskh Arabic', sans-serif"
            fontSize="70"
            fontWeight="800"
          >
            محمد رسول الله
          </text>
          {/* Sword under the Shahada: point toward the hoist, hilt toward the fly. */}
          <g fill="#FFFFFF">
            <path d="M228 458l34-14h356v26H262Z" />
            <rect x="618" y="432" width="14" height="52" rx="5" />
            <rect x="632" y="449" width="46" height="18" rx="7" />
            <circle cx="684" cy="458" r="11" />
          </g>
        </>
      );
    default:
      return <rect width="900" height="600" fill="#E7E2D7" />;
  }
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ countryId, className }) => {
  // React 19 ids contain « » or ':' — invalid inside url(#…) on some Android WebViews (masks vanish).
  const uid = `flag${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
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
