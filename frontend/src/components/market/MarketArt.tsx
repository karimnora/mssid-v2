import React from "react";
export function MarketProduce({
  kind,
  size = 48,
}: {
  kind: "apple" | "carrot";
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      {kind === "apple" ? (
        <>
          <path
            d="M40 25C14 6 5 35 17 59C24 75 34 69 40 68C47 69 58 75 65 59C78 34 65 7 40 25Z"
            fill="#c64038"
          />
          <path
            d="M40 26Q37 13 44 8"
            fill="none"
            stroke="#654532"
            strokeWidth="5"
          />
          <path d="M45 18Q62 4 65 19Q52 28 45 18" fill="#387747" />
          <path
            d="M23 33Q15 43 23 53"
            fill="none"
            stroke="#ffb6a0"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path d="M30 24Q48 17 59 36L22 72Q15 74 17 64Z" fill="#d47720" />
          <path
            d="M49 25Q40 6 46 5M54 28Q67 11 71 16M54 28Q64 3 59 3"
            stroke="#387747"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M29 42L38 46M24 56L30 58" stroke="#a54d20" strokeWidth="3" />
        </>
      )}
    </svg>
  );
}
export function MarketScene({ phase }: { phase: number }) {
  return (
    <svg
      className="market-scene"
      viewBox="0 0 640 180"
      role="img"
      aria-label={undefined}
      aria-hidden="true"
    >
      <rect width="640" height="180" rx="24" fill="#eaf3f4" />
      <circle cx="553" cy="38" r="21" fill="#f2c65e" />
      <path
        d="M0 118L70 65L115 82L169 34L217 78L256 54L310 111L381 61L434 104L496 78L565 108L640 60V180H0Z"
        fill="#c6d5d3"
      />
      <path d="M40 105H600V180H40Z" fill="#d2c0a2" />
      <path d="M120 62H520V156H120Z" fill="#fff8e7" />
      <path d="M106 62L132 25H508L534 62Z" fill="#176b66" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path
          key={i}
          d={"M" + (106 + i * 53.5) + " 62h53.5v15q-26.75 18-53.5 0Z"}
          fill={i % 2 ? "#fff1c9" : "#287e77"}
        />
      ))}
      <rect x="139" y="102" width="362" height="50" rx="10" fill="#a36b45" />
      <path d="M137 113H502M137 130H502" stroke="#d3a676" strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={"translate(" + (163 + i * 44) + " 76)"}>
          <ellipse cx="12" cy="19" rx="18" ry="10" fill="#633e2b" />
          <circle cx="8" cy="13" r="9" fill={i % 2 ? "#e0a345" : "#bd4836"} />
          <circle cx="20" cy="15" r="8" fill={i % 2 ? "#e0a345" : "#bd4836"} />
          <path d="M9 6l3-5" stroke="#3b713e" strokeWidth="4" />
        </g>
      ))}
      {phase > 0 && (
        <>
          <rect x="453" y="83" width="35" height="46" rx="4" fill="#fff7df" />
          <path
            d="M460 94h20M460 101h15M460 108h20M460 115h9"
            stroke="#456a63"
            strokeWidth="3"
          />
        </>
      )}
      {phase > 1 && (
        <>
          <path d="M62 132h45l-5 33H67Z" fill="#ba8542" />
          <path
            d="M71 134Q84 104 99 134"
            fill="none"
            stroke="#8b5a30"
            strokeWidth="4"
          />
          <circle cx="77" cy="139" r="8" fill="#c64038" />
          <circle cx="91" cy="138" r="8" fill="#c64038" />
        </>
      )}
    </svg>
  );
}
