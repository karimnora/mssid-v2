'use client';
import { useMotionPreference } from './useMotionPreference';
import React, { useState } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import butterfly1 from '../assets/design/home-v3/creatures/butterfly-1.webp';
import butterfly2 from '../assets/design/home-v3/creatures/butterfly-2.webp';
import bee1 from '../assets/design/home-v3/creatures/bee-1.webp';
import bee2 from '../assets/design/home-v3/creatures/bee-2.webp';
import bird1 from '../assets/design/home-v3/creatures/bird-1.webp';
import bird2 from '../assets/design/home-v3/creatures/bird-2.webp';
import ladybug1 from '../assets/design/home-v3/creatures/ladybug-1.webp';
import ladybug2 from '../assets/design/home-v3/creatures/ladybug-2.webp';

export type GardenCreatureId = 'butterfly' | 'bee' | 'bird' | 'ladybug';
const motionTokens = { butterflyWing: .7, beeWing: .5, birdWing: .85, steps: 1.2, flight: 4.8, exit: .18, hover: .18 } as const;
const CREATURES = [
 {id:'butterfly',label:'فراشة تختبئ بين الأزهار',frames:[butterfly1,butterfly2],wing:motionTokens.butterflyWing,x:[-7,7,-7],y:[0,-9,0],rotate:[-4,5,-4]},
 {id:'bee',label:'اكتشف النحلة قرب الأزهار',frames:[bee1,bee2],wing:motionTokens.beeWing,x:[-9,10,-9],y:[0,-7,0],rotate:[0,-5,0]},
 {id:'bird',label:'اكتشف العصفور بين الأغصان',frames:[bird1,bird2],wing:motionTokens.birdWing,x:[-10,10,-10],y:[0,-6,0],rotate:[-2,2,-2]},
 {id:'ladybug',label:'اكتشف الدعسوقة الصغيرة',frames:[ladybug1,ladybug2],wing:motionTokens.steps,x:[-5,5,-5],y:[0,-2,0],rotate:[-4,4,-4]},
] as const;

/** The hit area stays still; only the creature inside it moves, so small hands can catch it. */
function Creature({creature,onDiscover}:{creature:typeof CREATURES[number];onDiscover:(id:GardenCreatureId)=>void}) {
 const reduced=useMotionPreference();
 const present=useIsPresent();
 const [focused,setFocused]=useState(false);
 const paused=!!reduced||focused;
 return <motion.button type="button" className={`home-garden-creature home-garden-creature--${creature.id}`} data-home-creature={creature.id} data-home-butterfly={creature.id==='butterfly'?'':undefined} data-still={paused} aria-label={creature.label} disabled={!present} initial={false} exit={reduced?{opacity:0}:{opacity:0,y:-14,scale:.8}} transition={{duration:motionTokens.exit}} onPointerEnter={()=>setFocused(true)} onPointerLeave={()=>setFocused(false)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onClick={()=>onDiscover(creature.id)}>
   <motion.span key={paused ? "still" : "flight"} className="home-garden-flight" animate={paused?{x:0,y:0,rotate:0}:{x:[...creature.x],y:[...creature.y],rotate:[...creature.rotate]}} transition={paused?{duration:motionTokens.hover}:{duration:motionTokens.flight,repeat:Infinity,ease:'easeInOut'}}>
     {creature.frames.map((src,index)=><motion.img key={src} src={src} alt="" draggable={false} initial={false} style={{opacity:index===0?1:0}} animate={paused?{opacity:index===0?1:0}:{opacity:index===0?[1,1,0,0,1]:[0,0,1,1,0]}} transition={paused?{duration:motionTokens.hover}:{duration:creature.wing,repeat:Infinity,times:[0,.42,.5,.92,1],ease:'linear'}}/>)}
   </motion.span>
 </motion.button>;
}

export function GardenCreatures({discovered,onDiscover}:{discovered:readonly GardenCreatureId[];onDiscover:(id:GardenCreatureId)=>void}){
 return <div className="home-garden-creatures" aria-label="أصدقاء الحديقة الصغار"><AnimatePresence>{CREATURES.filter(creature=>!discovered.includes(creature.id)).map(creature=><Creature key={creature.id} creature={creature} onDiscover={onDiscover}/>)}</AnimatePresence></div>;
}
