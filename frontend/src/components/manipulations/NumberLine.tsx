import React from 'react';
export interface NumberLineProps {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
}
export function NumberLine({ min, max, step, value, onChange }: NumberLineProps) {
    const select = (v: number) => onChange(Number(Math.max(min, Math.min(max, min + Math.round((v - min) / step) * step)).toFixed(6)));
    return <section aria-label="المستقيم المدرج" dir="rtl">
    <p>المس المستقيم لتختار موضعًا، أو استعمل + و −.</p>
    <div dir="ltr" className="number-line" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); select(min + Math.max(0, Math.min(1, ((e.clientX - r.left) / r.width - 16 / 500) / (468 / 500))) * (max - min)); }}>
      <svg viewBox="0 0 500 80" aria-hidden="true"><path d="M16 40H484" stroke="currentColor" strokeWidth="3"/>
        {Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => <path key={i} d={`M${16 + i * 468 / Math.round((max - min) / step)} 32v16`} stroke="currentColor"/>)}
        <circle cx={16 + (value - min) * 468 / (max - min)} cy="40" r="10" fill="#008751"/>
        <text x="16" y="75">{min}</text><text x="484" y="75" textAnchor="end">{max}</text>
      </svg>
    </div>
    <div className="demo-controls" dir="ltr"><button onClick={() => select(value - step)} disabled={value <= min} aria-label="أنقص خطوة">−</button><output aria-live="polite">{String(value).replace('.', ',')}</output><button onClick={() => select(value + step)} disabled={value >= max} aria-label="أضيف خطوة">+</button></div>
  </section>;
}
