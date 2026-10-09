import React from 'react';
import type { IslamicRitualStep } from '../types';

const hand = 'M36 133 V97 L22 74 Q18 65 25 63 Q31 61 36 71 L45 84 V36 Q45 27 52 27 Q59 27 59 36 V72 V24 Q59 15 66 15 Q73 15 73 24 V72 V31 Q73 22 80 22 Q87 22 87 31 V76 V45 Q87 36 94 36 Q101 36 101 45 V94 Q101 112 90 123 V133 Z';

/** Simple gesture diagrams accompany the written instructions; never replace them. */
export const TayammumStepIllustration: React.FC<{ kind: NonNullable<IslamicRitualStep['illustration']> }> = ({kind}) => (
  <svg viewBox="0 0 280 170" className="w-full max-w-xs mx-auto rounded-2xl bg-emerald-50" aria-hidden="true" data-ritual-illustration={kind}>
    <g fill="none" stroke="#065f46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'water_check' && <><path d="M115 20 H170 V42 H186 V62 H153 V49 H128 V70 H107 V43 H115 Z" fill="#d1fae5"/><path d="M137 78 Q117 108 137 120 Q157 108 137 78 Z" fill="#bfdbfe"/><path d="M103 133 L176 76" stroke="#be123c" strokeWidth="5"/><path d="M70 146 H209"/></>}
      {kind === 'intention' && <><path d="M140 136 L86 81 Q67 40 96 29 Q124 19 140 48 Q157 19 184 29 Q213 40 194 81 Z" fill="#fde68a"/><path d="M114 79 L132 98 L169 60" strokeWidth="6"/></>}
      {kind === 'earth_touch' && <><path d="M28 135 H252 V154 H28 Z" fill="#e7c69b"/><g transform="translate(30 7) scale(.82)"><path d={hand} fill="#f9dcc0"/></g><g transform="translate(250 7) scale(-.82 .82)"><path d={hand} fill="#f9dcc0"/></g><path d="M140 74 V116 M131 105 L140 116 L149 105" stroke="#b45309"/><path d="M43 146 H61 M96 146 H116 M150 146 H169 M207 146 H230" strokeWidth="2"/></>}
      {kind === 'face_wipe' && <><ellipse cx="140" cy="80" rx="41" ry="58" fill="#f9dcc0"/><path d="M121 67 H128 M152 67 H159 M136 82 L132 95 H143 M126 112 Q140 121 154 112"/><g transform="translate(65 73) scale(.45)"><path d={hand} fill="#f9dcc0"/></g><g transform="translate(215 73) scale(-.45 .45)"><path d={hand} fill="#f9dcc0"/></g><path d="M86 36 V68 M78 59 L86 68 L94 59 M194 36 V68 M186 59 L194 68 L202 59" stroke="#b45309"/></>}
      {kind === 'hands_wipe' && <><g transform="translate(39 15) scale(.92)"><path d={hand} fill="#f9dcc0"/></g><g transform="translate(128 30) rotate(27 65 75) scale(.77)"><path d={hand} fill="#f9dcc0"/></g><path d="M122 145 H172 M163 137 L172 145 L163 153" stroke="#b45309"/></>}
    </g>
  </svg>
);
