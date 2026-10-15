import React from 'react';
/** Small original illustrations, shared by the story cards and their setting. */
export function PreschoolDiscoveryArt({ asset, size = 56, className = '' }: {
    asset: string;
    size?: number;
    className?: string;
}) {
    const kind = asset.replace('discovery:', '');
    if (kind.startsWith('count-')) {
        const n = kind === 'count-flowers' ? 3 : kind === 'count-apples' ? 4 : 5;
        return <svg viewBox="0 0 120 110" width={size} height={size} className={className} aria-hidden="true">{Array.from({ length: n }, (_, i) => <g key={i} transform={'translate(' + (8 + (i % 3) * 38) + ' ' + (10 + Math.floor(i / 3) * 50) + ')'}>{kind === 'count-flowers' ? <><path d="M17 24V43" stroke="#4a7349" strokeWidth="3"/>{[0, 60, 120, 180, 240, 300].map(a => <ellipse key={a} cx="17" cy="9" rx="5" ry="9" fill="#e7b851" transform={'rotate(' + a + ' 17 19)'}/>)}<circle cx="17" cy="19" r="6" fill="#805a37"/></> : kind === 'count-apples' ? <><path d="M16 10Q4 4 3 18Q2 35 14 38Q18 34 23 38Q35 28 31 14Q27 5 19 10Z" fill="#c94d3d"/><path d="M17 12L19 2M20 5Q29 0 30 5Q27 11 20 5" stroke="#416e3d" strokeWidth="2" fill="#619049"/></> : <><rect x="0" y="7" width="32" height="32" rx="4" fill="#226e8d"/><path d="M16 11L28 23L16 35L4 23Z" fill="#c6e4ee"/></>}</g>)}</svg>;
    }
    const plant = ['seed', 'water', 'sprout'].includes(kind);
    const fruit = ['apple', 'wash', 'bite'].includes(kind);
    return <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" style={{ flexShrink: 0 }}>
    <rect x="2" y="2" width="96" height="96" rx="22" fill="#f5edcf"/>
    <ellipse cx="50" cy="86" rx="32" ry="5" fill="#9c8050" opacity=".2"/>
    {plant ? <><path d="M23 60H77L69 85H31Z" fill="#c47b54"/><path d="M21 59H79" stroke="#845337" strokeWidth="7" strokeLinecap="round"/>{kind === 'sprout' ? <><path d="M50 60V31" stroke="#3d7350" strokeWidth="5"/><path d="M49 48Q22 46 29 29Q52 26 49 48M51 38Q78 36 72 20Q49 19 51 38" fill="#6b9e55"/></> : <><ellipse cx="50" cy="53" rx="6" ry="9" fill="#6a4430" transform="rotate(30 50 53)"/>{kind === 'water' ? <><path d="M70 21L61 35H88V19Z" fill="#478aa2"/><path d="M69 39L64 47M80 39L75 47" stroke="#37829d" strokeWidth="4" strokeLinecap="round"/></> : <path d="M43 17Q51 10 57 20L51 35L43 32Z" fill="#e4b180"/>}</>}</> : fruit ? <><path d="M48 34Q29 23 23 43Q16 65 34 79Q44 85 50 79Q63 87 76 70Q87 48 73 35Q63 25 52 34Z" fill="#c95442" stroke="#9c3931" strokeWidth="2"/><path d="M50 35L53 20M54 25Q66 12 74 22Q66 34 54 25" stroke="#466a40" strokeWidth="4" fill="#709455"/>{kind === 'wash' && <><path d="M18 11H39V23H31V32" stroke="#6c8d92" strokeWidth="7" fill="none"/><path d="M28 36L25 45M38 33L35 42" stroke="#2987b2" strokeWidth="4"/></>}{kind === 'bite' && <path d="M76 42Q57 42 64 55Q52 64 69 69L88 58Z" fill="#f5edcf"/>}</> : <>{kind === 'clay' ? <path d="M20 75Q24 56 39 53Q35 36 53 39Q73 37 74 58L84 78Z" fill="#b5774c"/> : kind === 'tile' ? <><rect x="22" y="23" width="56" height="56" rx="5" fill="#2f7567"/><path d="M50 30L70 50L50 70L30 50Z" fill="#f1d48a"/></> : <>{[0, 1, 2].flatMap(y => [0, 1, 2].map(x => <rect key={x + ':' + y} x={15 + x * 24} y={15 + y * 24} width="22" height="22" rx="2" fill={(x + y) % 2 ? '#e1af61' : '#307467'}/>))}</>}</>}
  </svg>;
}
export function PreschoolDiscoveryScene({ activityId }: {
    activityId: string;
}) {
    if (!activityId.startsWith('discovery-'))
        return null;
    const garden = activityId.startsWith('discovery-garden');
    const picnic = activityId.startsWith('discovery-picnic');
    return <div className="w-full rounded-3xl overflow-hidden border-2 border-emerald-100 bg-emerald-50" data-discovery-scene>
    <svg viewBox="0 0 500 115" className="w-full block" aria-hidden="true"><rect width="500" height="115" fill="#e2efe5"/><circle cx="433" cy="26" r="18" fill="#efcb73"/><path d="M0 83Q110 42 245 84T500 76V115H0Z" fill="#b6cda7"/><path d="M0 103Q240 77 500 104V115H0Z" fill="#e4d4ac"/><path d="M35 90V37Q67 3 98 37V90" fill="#f6ebcb"/><path d="M51 91V50Q67 32 82 50V91" fill="#478672"/><g transform="translate(145 7)"><PreschoolDiscoveryArt asset={garden ? 'discovery:sprout' : picnic ? 'discovery:apple' : 'discovery:mosaic'} size={95}/></g><g transform="translate(275 28)"><PreschoolDiscoveryArt asset={garden ? 'discovery:water' : picnic ? 'discovery:wash' : 'discovery:tile'} size={72}/></g></svg>
  </div>;
}
