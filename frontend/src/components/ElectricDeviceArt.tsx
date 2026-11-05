import React from 'react';
import bulb from '../assets/labs/electricity/bulb-off.webp';
import led from '../assets/labs/electricity/led-off.webp';
import motor from '../assets/labs/electricity/motor-body.webp';
import fan from '../assets/labs/electricity/motor-fan.webp';
import buzzer from '../assets/labs/electricity/buzzer.webp';
import resistor from '../assets/labs/electricity/resistor.webp';
import copper from '../assets/labs/electricity/copper.webp';
import wood from '../assets/labs/electricity/wood.webp';
import rubber from '../assets/labs/electricity/rubber.webp';
import water from '../assets/labs/electricity/salt-water.webp';
import ruler from '../assets/labs/electricity/ruler.webp';
import nail from '../assets/labs/electricity/nail.webp';
import './electricDeviceArt.css';
export const MATERIAL_ART: Record<string,string> = { copper, wood, rubber, salt_water: water, plastic_ruler: ruler, iron_nail: nail };
export function ElectricDeviceArt({ kind, powered, material }: { kind: 'bulb'|'diode'|'motor'|'buzzer'|'material'|'resistor'; powered: boolean; material?: string }) {
 const src = kind === 'bulb' ? bulb : kind === 'diode' ? led : kind === 'motor' ? motor : kind === 'buzzer' ? buzzer : kind === 'resistor' ? resistor : MATERIAL_ART[material ?? 'iron_nail'];
 return <div className="electric-device" data-electric-device={kind} data-powered={powered} aria-hidden="true">
   <img src={src} alt="" className="electric-device-base" draggable={false} />
   {(kind === 'bulb' || kind === 'diode') && <><span className="electric-device-glow" /><img src={src} alt="" className="electric-device-lit" draggable={false} /></>}
   {kind === 'motor' && <img src={fan} alt="" className="electric-device-fan" draggable={false} />}
 </div>;
}
