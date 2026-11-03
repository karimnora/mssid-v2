import React, { useId } from 'react';

/**
 * Didou, bust portrait (V2 "monde de jeu" design, docs/v2-design-monde.md). Original vector art:
 * shaded fur, amber eyes with highlights, green scarf with a red star. Decorative unless a label
 * is given.
 */
export function DidouPortrait({ size = 120, label, className }: { size?: number; label?: string; className?: string }) {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name: string) => `dd${raw}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-didou-portrait
    >
      <defs>
        <radialGradient id={id('fur')} cx="45%" cy="35%" r="70%"><stop offset="0" stopColor="#ffbe6e" /><stop offset=".55" stopColor="#f0801f" /><stop offset="1" stopColor="#b9520f" /></radialGradient>
        <radialGradient id={id('body')} cx="50%" cy="20%" r="80%"><stop offset="0" stopColor="#f7923a" /><stop offset="1" stopColor="#b44d0d" /></radialGradient>
        <linearGradient id={id('muzzle')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf2" /><stop offset="1" stopColor="#efd8bd" /></linearGradient>
        <linearGradient id={id('ear')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9a07a" /><stop offset="1" stopColor="#ffd9bd" /></linearGradient>
        <radialGradient id={id('iris')} cx="40%" cy="40%" r="60%"><stop offset="0" stopColor="#ffd665" /><stop offset=".7" stopColor="#d98a12" /><stop offset="1" stopColor="#8a4a00" /></radialGradient>
        <linearGradient id={id('scarf')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2cb866" /><stop offset="1" stopColor="#0f6b38" /></linearGradient>
      </defs>
      <path d="M38 200 C40 160 62 142 100 140 C138 142 160 160 162 200Z" fill={url('body')} />
      <path d="M74 200 C78 172 88 160 100 158 C112 160 122 172 126 200Z" fill={url('muzzle')} />
      <path d="M52 146 C70 160 130 160 148 146 L152 162 C130 176 70 176 48 162Z" fill={url('scarf')} />
      <path d="M50 152 C70 165 130 165 150 152" stroke="#fff" strokeWidth="3" fill="none" opacity=".85" />
      <path d="M122 162 L136 196 L150 188 L140 160Z" fill={url('scarf')} />
      <path d="M131 172 l2 4 4 .4 -3 2.8 .9 4 -3.5 -2 -3.5 2 .9 -4 -3 -2.8 4 -.4z" fill="#e8344e" />
      <path d="M44 74 L36 14 C36 8 42 6 46 10 L84 44Z" fill={url('fur')} />
      <path d="M156 74 L164 14 C164 8 158 6 154 10 L116 44Z" fill={url('fur')} />
      <path d="M38 22 L36 12 C38 7 43 7 46 10 L52 18Z" fill="#5a2a10" />
      <path d="M162 22 L164 12 C162 7 157 7 154 10 L148 18Z" fill="#5a2a10" />
      <path d="M50 64 L46 28 L74 50Z" fill={url('ear')} />
      <path d="M150 64 L154 28 L126 50Z" fill={url('ear')} />
      <path d="M100 36 C146 36 168 66 166 98 C164 112 156 120 150 126 L160 128 L144 136 L148 144 C132 150 116 152 100 152 C84 152 68 150 52 144 L56 136 L40 128 L50 126 C44 120 36 112 34 98 C32 66 54 36 100 36Z" fill={url('fur')} />
      <path d="M100 82 C82 82 70 96 62 112 C56 124 60 142 76 148 C86 152 94 152 100 152 C106 152 114 152 124 148 C140 142 144 124 138 112 C130 96 118 82 100 82Z" fill={url('muzzle')} />
      <path d="M70 58 C76 52 84 52 90 56 M130 58 C124 52 116 52 110 56" stroke="#7a3608" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g className="world-didou-eyes">
        <ellipse cx="78" cy="80" rx="15" ry="17" fill="#fff" />
        <ellipse cx="122" cy="80" rx="15" ry="17" fill="#fff" />
        <circle cx="80" cy="82" r="11" fill={url('iris')} />
        <circle cx="120" cy="82" r="11" fill={url('iris')} />
        <circle cx="81" cy="83" r="6" fill="#1d1028" />
        <circle cx="119" cy="83" r="6" fill="#1d1028" />
        <circle cx="84" cy="78" r="3.4" fill="#fff" />
        <circle cx="122" cy="78" r="3.4" fill="#fff" />
      </g>
      <path d="M64 70 C70 62 86 62 92 70 M136 70 C130 62 114 62 108 70" stroke="#3a1a06" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="62" cy="104" rx="10" ry="6" fill="#ff8f8f" opacity=".45" />
      <ellipse cx="138" cy="104" rx="10" ry="6" fill="#ff8f8f" opacity=".45" />
      <path d="M90 102 C90 96 110 96 110 102 C110 108 104 112 100 113 C96 112 90 108 90 102Z" fill="#2a1508" />
      <ellipse cx="96" cy="100" rx="4" ry="2" fill="#fff" opacity=".6" />
      <path d="M100 113 L100 120" stroke="#2a1508" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M84 120 C90 130 110 130 116 120" stroke="#2a1508" strokeWidth="3" fill="#7a2a1a" strokeLinecap="round" />
      <path d="M94 126 C97 131 103 131 106 126" fill="#ff7b8a" />
      <g fill="#6b3a1c">
        <circle cx="80" cy="112" r="1.6" /><circle cx="74" cy="116" r="1.6" /><circle cx="82" cy="118" r="1.6" />
        <circle cx="120" cy="112" r="1.6" /><circle cx="126" cy="116" r="1.6" /><circle cx="118" cy="118" r="1.6" />
      </g>
      <path d="M60 92 C48 94 38 92 30 88 M60 98 C48 102 40 104 32 104 M140 92 C152 94 162 92 170 88 M140 98 C152 102 160 104 168 104" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".7" strokeLinecap="round" />
      <path d="M86 40 C92 30 100 28 104 34 C108 28 116 30 118 38" stroke="#ffbe6e" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
