import React, { useState } from 'react';
const families = [
    { label: 'المليارات', places: ['مليار'], powers: [12] },
    { label: 'الملايين', places: ['مئات الملايين', 'عشرات الملايين', 'ملايين'], powers: [11, 10, 9] },
    { label: 'الآلاف', places: ['مئات الآلاف', 'عشرات الآلاف', 'آلاف'], powers: [8, 7, 6] },
    { label: 'الوحدات', places: ['مئات', 'عشرات', 'آحاد'], powers: [5, 4, 3] },
    { label: 'الأجزاء العشرية', places: ['أعشار', 'أجزاء من مائة', 'أجزاء من ألف'], powers: [2, 1, 0] },
];
export const MAX_SCALED_NUMBER = 1000000000000n;
export function formatPlaceValue(value: bigint) {
    const whole = value / 1000n;
    return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + (value % 1000n).toString().padStart(3, '0');
}
/** Exact thousandths, through one billion inclusive; no floating-point rounding. */
export function PlaceValueTable({ value, onChange }: {
    value: bigint;
    onChange: (value: bigint) => void;
}) {
    const [family, setFamily] = useState(3);
    const active = families[family];
    return <section aria-label="جدول المنازل" dir="rtl"><p>اختر عائلة، ثم أضف أو أنقص في منزلة. راقب انتقال الأرقام.</p>
    <output dir="ltr" className="demo-number" aria-live="polite">{formatPlaceValue(value)}</output>
    <p>من صفر إلى مليار، مع ثلاثة أرقام بعد الفاصلة.</p>
    <div className="demo-families">{families.map((f, i) => <button key={f.label} aria-pressed={family === i} onClick={() => setFamily(i)}>{f.label}</button>)}</div>
    <table dir="ltr"><thead><tr>{active.places.map(p => <th key={p} dir="rtl">{p}</th>)}</tr></thead><tbody><tr>{active.powers.map((power, i) => {
            const weight = 10n ** BigInt(power), digit = (value / weight) % 10n;
            return <td key={power}><button aria-label={'أضيف ' + active.places[i]} disabled={value + weight > MAX_SCALED_NUMBER} onClick={() => onChange(value + weight)}>+</button><output>{digit.toString()}</output><button aria-label={'أنقص ' + active.places[i]} disabled={value < weight} onClick={() => onChange(value - weight)}>−</button></td>;
        })}</tr></tbody></table>
  </section>;
}
