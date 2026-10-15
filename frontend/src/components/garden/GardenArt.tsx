import React from 'react';
export function GardenObject({ kind, size = 56 }: {
    kind: 'seed' | 'plant' | 'can' | 'basket' | 'sun' | 'tomato';
    size?: number;
}) {
    return <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true" focusable="false">
 {kind === 'seed' ? <><path d="M39 10Q9 20 17 49Q31 76 54 57Q76 30 39 10Z" fill="#a56b3c"/><path d="M41 19Q28 37 33 56" stroke="#714c32" strokeWidth="4" fill="none"/></> : kind === 'plant' ? <><path d="M19 48H65L58 74H26Z" fill="#bd7953"/><path d="M42 49V16" stroke="#42774b" strokeWidth="5"/><path d="M41 38Q12 36 19 17Q43 15 41 38M43 28Q69 29 66 9Q42 7 43 28" fill="#77a063"/><path d="M17 49H66" stroke="#8c5b3a" strokeWidth="6" strokeLinecap="round"/></> : kind === 'can' ? <><path d="M23 30H55V66H23Z" fill="#458895"/><path d="M55 38Q79 23 72 52L55 56" stroke="#326773" strokeWidth="7" fill="none"/><path d="M24 38L4 23L3 36L23 54" fill="#458895"/><path d="M25 29V19H52V29" stroke="#326773" strokeWidth="6" fill="none"/><path d="M5 44L3 51M12 48L9 56" stroke="#5b9ab4" strokeWidth="3" strokeLinecap="round"/></> : kind === 'basket' ? <><path d="M13 36H68L60 70H22Z" fill="#bf9154"/><path d="M23 37Q21 3 45 11Q62 16 58 37" stroke="#89683d" strokeWidth="6" fill="none"/><path d="M21 48H63M24 59H61M31 39V68M45 39V68M55 39V68" stroke="#ead2a2" strokeWidth="3"/></> : kind === 'sun' ? <><circle cx="40" cy="40" r="19" fill="#e8b34d"/>{[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} d="M40 9V2" transform={'rotate(' + a + ' 40 40)'} stroke="#d99b37" strokeWidth="4" strokeLinecap="round"/>)}</> : <><path d="M39 22Q12 14 9 40Q8 70 40 72Q71 69 70 41Q67 15 42 22" fill="#c94d3c"/><path d="M39 27L23 18L38 20L44 7L46 22L61 18L48 29Z" fill="#50804b"/><path d="M20 37Q16 49 23 55" stroke="#ea9682" strokeWidth="5" fill="none" strokeLinecap="round"/></>}
 </svg>;
}
export function GardenScene({ phase }: {
    phase: number;
}) {
    return <svg viewBox="0 0 640 225" aria-hidden="true" className="garden-scene">
 <rect width="640" height="225" fill="#deeee6"/><circle cx="551" cy="43" r="24" fill="#f4d38a"/><path d="M0 136Q111 72 257 134T640 112V225H0Z" fill="#bad0a5"/><path d="M0 183Q211 151 640 179V225H0Z" fill="#eadcb8"/>
 <path d="M25 174V74Q64 33 104 74V174M119 173V63Q153 25 188 63V173" fill="#f8ecd0" stroke="#c8b084" strokeWidth="3"/><path d="M44 174V98Q64 76 83 98V174M138 173V91Q155 70 171 91V173" fill="#82a28a"/>
 {[0, 1, 2].map(r => <g key={r} transform={'translate(' + (227 + r * 115) + ' ' + (157 + (r % 2) * 18) + ')'}><path d="M-8 7L80 3L91 41L-4 45Z" fill="#a77a50"/><path d="M0 12L72 9L80 33L4 36Z" fill="#795b3c"/>{phase > 0 && [0, 1, 2].map(c => <g key={c} transform={'translate(' + (9 + c * 23) + ' ' + (phase >= 2 ? -18 : 0) + ')'}>{phase >= 2 ? <><path d="M5 27V6" stroke="#4e7745" strokeWidth="4"/><path d="M5 20Q-9 18 -5 7Q8 6 5 20M6 13Q20 12 17 1Q4 2 6 13" fill="#6d9852"/>{phase >= 4 && <circle cx="13" cy="19" r="6" fill="#c95c42"/>}</> : <ellipse cx="6" cy="23" rx="4" ry="7" fill="#d2a768"/>}</g>)}</g>)}
 <path d="M588 176V101M588 115Q563 91 551 109M588 116Q615 91 628 108" stroke="#6f966c" strokeWidth="8" fill="none" strokeLinecap="round"/>
 </svg>;
}
