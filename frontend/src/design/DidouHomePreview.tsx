'use client';
import { useMotionPreference } from './useMotionPreference';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, FlaskConical, Gamepad2, Home, Volume2, VolumeX, Sparkles, X, Play, RotateCcw, Grid2X2, ClipboardCheck, Map as MapIcon } from 'lucide-react';
import landscape from '../assets/design/home-v3/village-landscape.webp';
import portrait from '../assets/design/home-v3/village-portrait.webp';
import greet from '../assets/design/home-v3/didou-greet.webp';
import point from '../assets/design/home-v3/didou-point.webp';
import cheer from '../assets/design/home-v3/didou-cheer.webp';
import { GardenCreatures, type GardenCreatureId } from './GardenCreatures';
import { HOME_VOICES } from './homePreviewVoices';
import { PlanetShelf, type PlanetShelfGroup } from '../components/journey/PlanetShelf';
import type { PrimaryGrade } from '../types';
import './homePreview.css';

type VoiceId = keyof typeof HOME_VOICES;
type PlaceId = 'stories' | 'workshop' | 'games';
const HOME_CAPTIONS: Record<VoiceId, string> = { welcome: 'مرحبًا! أنا ديدو، صديقك في مسيد.', stories: 'هنا نقرأ الحكايات ونتعلم أشياء جديدة.', workshop: 'هنا نجرب ونكتشف معًا.', games: 'وهنا نلعب ونتعلم!', butterfly: 'أحسنت! وجدت الفراشة!', discovery: 'واو! اكتشاف جميل!' };
const PRESENTATION = ['welcome', 'stories', 'workshop', 'games'] as const satisfies readonly VoiceId[];
type VoicePhase = 'idle' | 'loading' | 'speaking';
const motionTokens = { feedback: 0.18, entrance: 0.32, float: 2.4, breath: 1.4, idle: 3.8, cheer: .65, reactionHold: 1.8 } as const;
const springs = { press: { type: 'spring' as const, stiffness: 340, damping: 25 } };
const PLACES = [
 { id: 'stories', title: 'دار الحكايات', short: 'أقرأ وأكتشف', Icon: BookOpen, href: '/courses?g=2AP', color: 'blue' },
 { id: 'workshop', title: 'ورشة الاكتشاف', short: 'أجرب وأفهم', Icon: FlaskConical, href: '/labs?g=2AP', color: 'teal' },
 { id: 'games', title: 'حديقة الألعاب', short: 'ألعب وأتعلم', Icon: Gamepad2, href: '/challenges?g=2AP', color: 'orange' },
] as const;

export interface DidouHomeConnection {
 sound: boolean;
 onToggleSound: () => void;
 onStopSpeech: () => void;
 grade: PrimaryGrade;
 name: string;
 completed: number;
 total: number | null;
 onExit: () => void;
 onOpenCourses: () => void;
 onOpenMap: (() => void) | null;
 onContinue: (() => void) | null;
 nextTitle: string | null;
 onOpenLabs: () => void;
 onOpenGames: () => void;
 onOpenExams: () => void;
 shelfGroups: PlanetShelfGroup[];
 mission?: { say: string; cta: string | null; onStart: () => void } | null;
 examPlanCta?: { label: string; onOpen: () => void } | null;
}
/** The same artwork drives both the isolated preview and the child's connected home. */
export function DidouHomePreview({ connection }: { connection?: DidouHomeConnection }) {
 const reduced = useMotionPreference();
 const [selected, setSelected] = useState<PlaceId | null>(null);
 const [voiceId, setVoiceId] = useState<VoiceId>('welcome');
 const [phase, setPhase] = useState<VoicePhase>('idle');
 const [localMuted, setLocalMuted] = useState(false);
 const muted = connection ? !connection.sound : localMuted;
 const setMuted = (value: boolean) => { if (connection) { if (value === connection.sound) connection.onToggleSound(); } else setLocalMuted(value); };
 const [started, setStarted] = useState(false);
 const [discovered, setDiscovered] = useState<readonly GardenCreatureId[]>([]);
 const [celebrating, setCelebrating] = useState(false);
 const reactionTimer = useRef<number | null>(null);
 const [hovered, setHovered] = useState<PlaceId | null>(null);
 const [panel, setPanel] = useState(false);
 const [learning, setLearning] = useState(false);
 const [shelf, setShelf] = useState(false);
 const [feedback, setFeedback] = useState('');
 const [tourActive, setTourActive] = useState(false);
 const [tourStep, setTourStep] = useState(0);
 const touring = useRef(false);
 const cancelTour = () => { touring.current = false; setTourActive(false); };
 const audio = useRef<HTMLAudioElement | null>(null);
 const request = useRef(0);
 const warm = useRef(new Map<VoiceId, HTMLAudioElement>());
 const focusBeforePanel = useRef<HTMLElement | null>(null);
 const closePanel = useRef<HTMLButtonElement>(null);
 const place = PLACES.find(item => item.id === selected);

 const stop = () => {
   connection?.onStopSpeech();
   request.current++;
   if (audio.current) {
     audio.current.onplaying = audio.current.onended = audio.current.onerror = null;
     audio.current.pause();
     audio.current = null;
   }
   setPhase('idle');
 };
 const prepare = (force = false) => {
   if (muted && !force) return;
   if (typeof Audio === 'undefined') return;
   const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
   if (connection?.saveData) return;
   for (const id of Object.keys(HOME_VOICES) as VoiceId[]) {
     if (warm.current.has(id)) continue;
     const clip = new Audio(HOME_VOICES[id].src);
     clip.preload = 'auto';
     warm.current.set(id, clip);
     clip.load();
   }
 };
 const say = (id: VoiceId, after?: () => void, forceAudio = false) => {
   stop();
   setVoiceId(id);
   setFeedback('');
   if (muted && !forceAudio) return;
   const token = request.current;
   const clip = warm.current.get(id) ?? new Audio(HOME_VOICES[id].src);
   warm.current.set(id, clip);
   audio.current = clip;
   clip.currentTime = 0;
   setPhase('loading');
   clip.onplaying = () => { if (request.current === token) setPhase('speaking'); };
   clip.onended = () => { if (request.current !== token) return; setPhase('idle'); after?.(); };
   clip.onerror = () => {
     if (request.current !== token) return;
     setPhase('idle');
     cancelTour();
     setFeedback('لَمْ يَعْمَلِ الصَّوْتُ. اِضْغَطْ عَلَى السَّمَّاعَةِ لِلْمُحَاوَلَةِ.');
   };
   void clip.play().catch(() => {
     if (request.current !== token) return;
     setPhase('idle');
     cancelTour();
     setFeedback('اِضْغَطْ عَلَى السَّمَّاعَةِ لِسَمَاعِ دِيدُو.');
   });
 };
 useEffect(() => () => {
   touring.current = false;
   if (reactionTimer.current !== null) window.clearTimeout(reactionTimer.current);
   request.current++;
   audio.current?.pause();
   for (const clip of warm.current.values()) {
     clip.pause();
     clip.removeAttribute('src');
   }
   warm.current.clear();
 }, []);
 useEffect(() => {
   if (!panel) return;
   focusBeforePanel.current = document.activeElement as HTMLElement;
   closePanel.current?.focus();
   return () => focusBeforePanel.current?.focus();
 }, [panel]);

 const start = () => {
   setStarted(true);
   setMuted(false);
   setPanel(false);
   setTourActive(true);
   touring.current = true;
   prepare(true);
   const present = (index: number) => {
     if (!touring.current) return;
     const id = PRESENTATION[index];
     if (!id) { cancelTour(); setSelected(null); setVoiceId('welcome'); return; }
     setTourStep(index);
     setSelected(id === 'welcome' ? null : id);
     say(id, () => present(index + 1), true);
   };
   present(0);
 };
 const choose = (id: PlaceId) => {
   setCelebrating(false);
   cancelTour();
   setStarted(true);
   setSelected(id);
   setPanel(false);
   say(id);
   prepare();
 };
 const discover = (id: GardenCreatureId) => {
   cancelTour();
   setDiscovered(previous => previous.includes(id) ? previous : [...previous,id]);
   setStarted(true);
   setSelected(null);
   setCelebrating(true);
   if (reactionTimer.current !== null) window.clearTimeout(reactionTimer.current);
   reactionTimer.current = window.setTimeout(() => setCelebrating(false),motionTokens.reactionHold*1000);
   say(id === 'butterfly' ? 'butterfly' : 'discovery');
   prepare();
 };
 const resetDiscoveries = () => { cancelTour(); stop(); setDiscovered([]); setCelebrating(false); setVoiceId('welcome'); };
 const leave = (action: () => void) => { cancelTour(); stop(); action(); };
 const enterPlace = () => {
   if (!connection || !selected) { setPanel(true); return; }
   leave(selected === 'workshop' ? connection.onOpenLabs : selected === 'games' ? connection.onOpenGames : connection.onOpenCourses);
 };
 const pose = celebrating ? cheer : selected || hovered ? point : greet;

 return <main className="home-preview" lang="ar" dir="rtl" data-home-preview data-home-connected={!!connection} data-home-grade={connection?.grade} data-home-tour={tourActive ? 'playing' : 'idle'} data-home-tour-step={tourStep} data-home-voice-id={voiceId}>
   <picture className="home-preview-world" aria-hidden="true"><source media="(max-width: 680px)" srcSet={portrait}/><img src={landscape} alt="" draggable={false}/></picture>
   <div className="home-preview-shade" aria-hidden="true"/>
   <header className="home-preview-header">
     <a className="home-preview-brand" href="/" onClick={connection ? event => { event.preventDefault(); leave(connection.onExit); } : undefined} aria-label="العودة إلى مسيد"><span>مَسيد<span className="home-preview-brand-dot">✦</span></span></a>
     <div className="home-preview-tools">
       <button type="button" className="home-preview-round" data-home-sound aria-label={muted ? 'تشغيل الصوت' : 'إيقاف الصوت'} aria-pressed={!muted} onClick={() => { cancelTour(); stop(); setMuted(!muted); }}>{muted ? <VolumeX/> : <Volume2/>}</button>
       <a className="home-preview-round home-preview-back" href="/" onClick={connection ? event => { event.preventDefault(); leave(connection.onExit); } : undefined} aria-label="الواجهة الحالية"><Home/></a>
       {connection && <button type="button" className="home-preview-round" data-home-activities aria-label="كل الأنشطة" onClick={() => { cancelTour(); stop(); setShelf(true); }}><Grid2X2/></button>}

     </div>
   </header>
   <section className="home-preview-title" aria-label="الترحيب">
     <p><span/> {connection ? `أهلًا ${connection.name} · ${connection.grade}` : "أهلًا بك في عالم ديدو"} <span/></p>
     <h1>لنلعب <em>ونتعلّم!</em></h1>
     <span className="home-preview-kicker">حكايات، تجارب وألعاب تنتظرك</span>
   </section>

   <a className="home-preview-lessons" data-home-lessons href={connection ? `/courses?g=${connection.grade}` : '/courses?g=2AP'} onClick={connection ? event => { event.preventDefault(); cancelTour(); stop(); setLearning(true); } : undefined}><BookOpen size={24}/><span>دُرُوسِي{connection && <small data-home-progress>{connection.grade} · {connection.total === null ? 'جارٍ التحضير…' : `${connection.completed} / ${connection.total} درسًا مكتملًا`}</small>}</span><ArrowLeft size={20}/></a>
   <nav className="home-preview-places" aria-label="أماكن الاستكشاف">
     {PLACES.map(({id,title,Icon,color}) => <motion.button key={id} type="button" className={`home-preview-place home-preview-place--${id} home-preview-place--${color}`} data-home-place={id} aria-pressed={selected === id} onPointerEnter={() => setHovered(id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(id)} onBlur={() => setHovered(null)} onClick={() => choose(id)} whileHover={reduced ? undefined : { y: -5, scale: 1.04 }} whileTap={reduced ? undefined : { scale: 0.96 }} transition={springs.press}>
       <span className="home-preview-place-icon"><Icon size={23}/></span><span><strong>{title}</strong></span><ArrowLeft className="home-preview-place-arrow" size={19}/>
     </motion.button>)}
   </nav>

   <GardenCreatures discovered={discovered} onDiscover={discover}/>
   {discovered.length > 0 && <span className="home-preview-discovery" data-home-discovery role="status"><Sparkles size={18}/> أصدقاء الحديقة: {discovered.length} / 4</span>}

   <div className="home-preview-character" data-home-didou={phase}>
     <span className="home-preview-character-shadow"/>
     <motion.button type="button" className="home-preview-character-button" aria-label="تحدث مع ديدو" data-home-didou-button onClick={() => { if (!started) { start(); return; } cancelTour(); say(voiceId); prepare(); }} animate={reduced ? undefined : celebrating ? { y:[0,-14,0,-5,0], rotate:[0,-2,0,2,0] } : phase === 'speaking' ? { y:[0,-4,0], rotate:[0,1,0] } : { y:[0,-2,0],rotate:[0,-.4,.4,0] }} transition={{duration:celebrating?motionTokens.cheer:phase==='speaking'?motionTokens.breath:motionTokens.idle,repeat:celebrating?0:Infinity}} whileTap={reduced ? undefined : {scale:0.97}}>
       <motion.img key={pose} src={pose} alt="ديدو، الفنك ذو الوشاح الأخضر والنجمة الحمراء" draggable={false} initial={false} animate={{opacity:1}} transition={{duration:motionTokens.feedback}}/>
     </motion.button>
     <span className="home-preview-character-tag">دِيدُو <span>✦</span></span>
   </div>

   <section className="home-preview-dialogue" aria-label="ديدو يرافقك" data-home-dialogue>
     <div className="home-preview-dialogue-top"><span className="home-preview-guide-name">دِيدُو مَعَكَ</span><span className={`home-preview-voice-state ${phase==='speaking'?'is-speaking':''}`} data-home-voice-phase={phase}>{tourActive ? `أعرّفك بعالمي · ${tourStep + 1}/4` : phase==='speaking' ? 'أَتَحَدَّثُ مَعَكَ' : phase==='loading' ? 'لَحْظَةٌ صَغِيرَةٌ…' : 'أَنَا هُنَا لِأُسَاعِدَكَ'}<i/><i/><i/></span></div>
     <p lang="ar" aria-live="polite">{HOME_CAPTIONS[voiceId]}</p>
     <div className="home-preview-dialogue-actions">
       {tourActive ? <button type="button" className="home-preview-play" data-home-skip onClick={() => { cancelTour(); stop(); setSelected(null); setVoiceId('welcome'); }}><ArrowLeft size={20}/> تخطي</button> : discovered.length === 4 ? <button type="button" className="home-preview-play" data-home-reset-discoveries onClick={resetDiscoveries}><RotateCcw size={20}/> نلعب من جديد</button> : selected ? <button type="button" className="home-preview-play" data-home-enter onClick={enterPlace}><ArrowLeft size={20}/> هيا ندخل!</button> : <button type="button" className="home-preview-play" data-home-start onClick={start}><Play size={21} fill="currentColor"/> {started ? 'اسمع ديدو من جديد' : 'اسمع ديدو'}</button>}

     </div>
     {feedback && <small role="status" className="home-preview-audio-feedback">{feedback}</small>}
   </section>

   {connection && learning && <div className="home-preview-overlay" onClick={() => setLearning(false)}><section className="home-preview-door home-preview-learning" role="dialog" aria-modal="true" aria-labelledby="home-learning-title" ref={node => { if (node && !node.contains(document.activeElement)) node.querySelector<HTMLButtonElement>('button')?.focus(); }} onClick={event => event.stopPropagation()} onKeyDown={event => { if(event.key==='Escape')setLearning(false); if(event.key==='Tab'){const items=event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),a');const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}} }}>
     <button type="button" className="home-preview-close" aria-label="إغلاق" onClick={() => { setLearning(false); document.querySelector<HTMLElement>('[data-home-lessons]')?.focus(); }}><X/></button>
     <h2 id="home-learning-title">رحلتك يا {connection.name}</h2>
     <p>{connection.grade} · {connection.total === null ? 'نحضّر دروسك…' : `${connection.completed} من ${connection.total} درسًا مكتملًا`}</p>
     {connection.total !== null && connection.total > 0 && <progress aria-label="الدروس المكتملة" value={connection.completed} max={connection.total}/>}
     {connection.mission && <div className="home-preview-mission"><p>{connection.mission.say}</p>{connection.mission.cta && <button type="button" className="home-preview-play" data-home-mission onClick={() => leave(connection.mission!.onStart)}>{connection.mission.cta}</button>}</div>}
     {connection.onContinue && <button type="button" className="home-preview-play" data-home-continue onClick={() => leave(connection.onContinue!)}>أكمل رحلتي <ArrowLeft size={20}/></button>}
     {connection.nextTitle && <p className="home-preview-next">{connection.nextTitle}</p>}
     {connection.onOpenMap && <button type="button" className="home-preview-secondary" data-home-map onClick={() => leave(connection.onOpenMap!)}><MapIcon/> خريطة ديدو</button>}
     <button type="button" className="home-preview-secondary" data-home-all-courses onClick={() => leave(connection.onOpenCourses)}><BookOpen/> كل دروسي</button>
     <button type="button" className="home-preview-secondary home-preview-exams" data-home-exams onClick={() => leave(connection.onOpenExams)}><ClipboardCheck/> امتحاناتي</button>
     {connection.examPlanCta && <button type="button" className="home-preview-secondary" onClick={() => leave(connection.examPlanCta!.onOpen)}>{connection.examPlanCta.label}</button>}
   </section></div>}
   {connection && shelf && <PlanetShelf title="كل الأنشطة" closeLabel="إغلاق" groups={connection.shelfGroups} onClose={() => { setShelf(false); document.querySelector<HTMLElement>('[data-home-activities]')?.focus(); }} onPick={() => { stop(); setShelf(false); }}/>}
   {panel && place && <div className="home-preview-overlay" onClick={() => setPanel(false)}><section className="home-preview-door" role="dialog" aria-modal="true" aria-labelledby="home-preview-door-title" onClick={event=>event.stopPropagation()} onKeyDown={event=>{if(event.key==='Escape')setPanel(false);if(event.key==='Tab'){const items=event.currentTarget.querySelectorAll<HTMLElement>('button,a');const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}}}>
     <button ref={closePanel} type="button" className="home-preview-close" aria-label="إغلاق" onClick={()=>setPanel(false)}><X/></button><place.Icon size={46}/><p>اِخْتِيَارٌ رَائِعٌ!</p><h2 id="home-preview-door-title">{place.title}</h2><p>{place.short}</p><a className="home-preview-play" href={place.href}>اُدْخُلْ وَاكْتَشِفْ <ArrowLeft size={20}/></a><small>تَفْتَحُ الأَنْشِطَةَ المَوْجُودَةَ فِي مَسيد.</small>
   </section></div>}
 </main>;
}
