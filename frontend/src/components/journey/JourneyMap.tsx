import { recordPremiumEvent } from '../../utils/premiumFunnel';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PrimaryGrade } from '../../types';
import { GradeDecor } from './JourneyGradeDecor';
import {
  JOURNEY_HEIGHT,
  JOURNEY_STATION_XS,
  JOURNEY_WORLD_WIDTH,
  journeyWidth,
  pickText,
  worldLeft,
  type JourneyWorld,
} from '../../data/journey/journeyWorlds';
import { currentStationIndex, type JourneyStation, type StationState } from '../../utils/journeyProgress';
import { DidouFull, DidouHead, StarIcon } from './DidouJourneyArt';
import { OBJECT_ART, WORLD_DECOR } from '../world/worldArt';
import { JourneyRibbon, SpeakerIcon, type JourneySfx, type RibbonContent } from './JourneyRibbon';
import { JourneySceneryDefs, WORLD_SKY, WorldBackdrop } from './JourneyScenery';
import { NATIVE_OFFER_COPY } from '../../constants/nativeOfferCopy';

export interface JourneyMemoryState {
  claimed: string[];
  at: number;
  welcomed: boolean;
}

interface JourneyMapProps {
  /** Grade of the map: its own light and landmarks (JourneyGradeDecor). */
  grade?: PrimaryGrade;
  worlds: readonly JourneyWorld[];
  stations: readonly JourneyStation[];
  states: readonly StationState[];
  stars: readonly number[];
  lessonTitles: Readonly<Record<string, string>>;
  locale: string;
  memory: JourneyMemoryState;
  onMemoryChange: (memory: JourneyMemoryState) => void;
  onStartLesson: (stationIndex: number) => void;
  onClaimTreasure: (worldIndex: number) => void;
  onBack: () => void;
  say: (text: string) => void;
  sfx: JourneySfx;
  totalStars: number;
  coins: number;
  /** Parent-facing Premium entry (PremiumOffer) shown when a Premium world is tapped. */
  premiumExtra?: React.ReactNode;
  /** Bonus game stops (one learning-game pack each), drawn above the trail; they never lock lessons. */
  gameStations?: readonly JourneyGameStation[];
  onOpenGame?: (index: number) => void;
}

export interface JourneyGameStation {
  worldIndex: number;
  emoji: string;
  title: string;
  /** False: Premium pack on a free account (purple, padlock). */
  open: boolean;
  free: boolean;
  stars: number;
  maxStars: number;
}

/** Where a world's game stop stands: between its 2nd and 3rd lessons, lifted above the trail. */
export function gameStationPoint(world: JourneyWorld, left: number): { x: number; y: number; trailY: number } {
  const x = left + (JOURNEY_STATION_XS[1] + JOURNEY_STATION_XS[2]) / 2;
  const trailY = (world.ys[1] + world.ys[2]) / 2;
  // Never higher than 340: above that it would touch the world banner of the map HUD.
  return { x, y: Math.max(340, Math.min(world.ys[1], world.ys[2]) - 200), trailY };
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** Smooth Catmull-Rom path through the stations, starting on the right edge (the journey reads right → left). */
function trailPath(points: ReadonlyArray<readonly [number, number]>): string {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export function JourneyMap(props: JourneyMapProps) {
  const { grade, worlds, stations, states, stars, lessonTitles, locale, memory, onMemoryChange, onStartLesson, onClaimTreasure, onBack, say, sfx, totalStars, coins, premiumExtra, gameStations = [], onOpenGame } = props;
  const ar = locale === 'ar';
  const T = (arText: string, frText: string) => (ar ? arText : frText);
  const totalW = journeyWidth(worlds);
  const d = useMemo(
    () => trailPath([[totalW - 30, 760], ...stations.map((s) => [s.x, s.y] as const), [40, 300]]),
    [stations, totalW],
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tokenRef = useRef<SVGGElement>(null);
  const rocketRef = useRef<SVGGElement>(null);
  const lensRef = useRef<number[]>([]);
  const lenRef = useRef(0);
  const atRef = useRef(Math.min(memory.at, currentStationIndex(states)));
  const busyRef = useRef(false);
  const memoryRef = useRef(memory);
  memoryRef.current = memory;
  const introRan = useRef(false);

  const [bannerWorld, setBannerWorld] = useState(() => stations[atRef.current]?.worldIndex ?? 0);
  const [ribbon, setRibbon] = useState<RibbonContent | null>(null);
  const [coach, setCoach] = useState<string | null>(null);
  const [shaking, setShaking] = useState<number | null>(null);
  const coachTimer = useRef<number | undefined>(undefined);

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const worldOfX = useCallback(
    (x: number) => Math.max(0, Math.min(worlds.length - 1, Math.floor((totalW - x) / JOURNEY_WORLD_WIDTH))),
    [totalW, worlds.length],
  );
  const mapScale = () => (svgRef.current ? svgRef.current.getBoundingClientRect().width / totalW : 1);

  const coachSay = useCallback(
    (text: string) => {
      setCoach(text);
      say(text);
      window.clearTimeout(coachTimer.current);
      coachTimer.current = window.setTimeout(() => setCoach(null), Math.max(3000, text.length * 95));
    },
    [say],
  );
  useEffect(() => () => window.clearTimeout(coachTimer.current), []);

  const placeToken = useCallback(
    (len: number, moving = false, dir = 1) => {
      const path = pathRef.current;
      const token = tokenRef.current;
      if (!path || !token) return { x: 0, y: 0 };
      const total = path.getTotalLength();
      const p = path.getPointAtLength(len);
      const q = path.getPointAtLength(Math.max(0, Math.min(total, len + 6 * dir)));
      const vehicle = worlds[worldOfX(p.x)].vehicle;
      token.setAttribute('transform', `translate(${p.x.toFixed(1)} ${(p.y - 40).toFixed(1)})`);
      token.setAttribute('data-vehicle', vehicle);
      token.setAttribute('data-moving', String(moving));
      if (rocketRef.current) {
        const ang = Math.atan2(q.y - p.y, Math.abs(q.x - p.x) + 0.01) * (180 / Math.PI) * (q.x < p.x ? -1 : 1);
        rocketRef.current.setAttribute('transform', moving && vehicle === 'rocket' ? `rotate(${Math.max(-35, Math.min(35, ang)).toFixed(1)})` : '');
      }
      return p;
    },
    [worlds, worldOfX],
  );

  const centerOn = useCallback((x: number, smooth: boolean) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: x * mapScale() - el.clientWidth / 2, behavior: smooth ? 'smooth' : 'auto' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measure where each station sits along the trail once the path is in the DOM.
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const samples: Array<[number, number, number]> = [];
    for (let l = 0; l <= total; l += 6) {
      const p = path.getPointAtLength(l);
      samples.push([l, p.x, p.y]);
    }
    lensRef.current = stations.map((s) => {
      let best = 0;
      let bestDist = Infinity;
      for (const [l, x, y] of samples) {
        const dist = (x - s.x) ** 2 + (y - s.y) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          best = l;
        }
      }
      return best;
    });
    lenRef.current = lensRef.current[atRef.current] ?? 0;
    placeToken(lenRef.current);
    centerOn(stations[atRef.current]?.x ?? totalW, false);
  }, [stations, placeToken, centerOn, totalW]);

  const travelTo = useCallback(
    (target: number) =>
      new Promise<boolean>((resolve) => {
        const from = lenRef.current;
        const to = lensRef.current[target] ?? from;
        const startWorld = stations[atRef.current]?.worldIndex ?? 0;
        const finish = () => {
          busyRef.current = false;
          atRef.current = target;
          onMemoryChange({ ...memoryRef.current, at: target });
          resolve(stations[target].worldIndex !== startWorld);
        };
        if (Math.abs(to - from) < 2) {
          finish();
          return;
        }
        busyRef.current = true;
        const dir = to > from ? 1 : -1;
        const duration = reducedMotion ? 0 : Math.min(4200, Math.max(900, Math.abs(to - from) / 0.75));
        const t0 = performance.now();
        sfx.whoosh();
        const step = (now: number) => {
          const t = duration === 0 ? 1 : Math.min(1, (now - t0) / duration);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          lenRef.current = from + (to - from) * e;
          const p = placeToken(lenRef.current, t < 1, dir);
          const el = scrollRef.current;
          if (el) el.scrollLeft = p.x * mapScale() - el.clientWidth / 2;
          if (t < 1) requestAnimationFrame(step);
          else {
            placeToken(lenRef.current, false, dir);
            finish();
          }
        };
        requestAnimationFrame(step);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stations, onMemoryChange, placeToken, sfx, reducedMotion],
  );

  const welcome = useCallback(
    (worldIndex: number) =>
      new Promise<void>((resolve) => {
        const text = pickText(worlds[worldIndex].welcome, locale);
        say(text);
        setRibbon({ text, buttons: [{ label: T('هيا!', "C'est parti !"), tone: 'green', onClick: () => { setRibbon(null); resolve(); } }] });
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [worlds, locale, say],
  );

  // On arrival: greet the first time, then walk Didou to a station opened by a lesson just finished.
  useEffect(() => {
    if (introRan.current) return;
    introRan.current = true;
    const target = currentStationIndex(states);
    void (async () => {
      await wait(350);
      if (!memoryRef.current.welcomed) {
        await welcome(stations[atRef.current].worldIndex);
        onMemoryChange({ ...memoryRef.current, welcomed: true });
      }
      if (target > atRef.current) {
        sfx.win();
        coachSay(T('أحسنت! هيا إلى المحطة التالية', 'Bravo ! En route vers la prochaine étape'));
        await wait(700);
        const crossed = await travelTo(target);
        if (crossed) await welcome(stations[target].worldIndex);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBanner = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cx = (el.scrollLeft + el.clientWidth / 2) / mapScale();
    setBannerWorld(worldOfX(cx));
  };

  // Mouse drag to scroll on desktop (touch scrolls natively).
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !scrollRef.current) return;
    drag.current = { x: e.clientX, left: scrollRef.current.scrollLeft, moved: false };
    dragged.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !scrollRef.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6) dragged.current = true;
    scrollRef.current.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    drag.current = null;
  };

  const openStation = async (i: number) => {
    if (busyRef.current || ribbon) return;
    const station = stations[i];
    const state = states[i];
    if (state === 'premium') {
      recordPremiumEvent('lock_open');
      setShaking(i);
      window.setTimeout(() => setShaking(null), 450);
      sfx.soft();
      const text = ar ? NATIVE_OFFER_COPY.journeyPremium.ar : NATIVE_OFFER_COPY.journeyPremium.fr;
      say(text);
      setRibbon({ text, extra: <div className="space-y-3"><div className="j-premium-preview-frame"><img className="j-premium-preview" src={WORLD_DECOR[worlds[station.worldIndex].id].landscape} alt={pickText(worlds[station.worldIndex].name, locale)} /></div>{premiumExtra}</div>, buttons: [{ label: T('حسناً', "D'accord"), onClick: () => setRibbon(null) }] });
      return;
    }
    if (state === 'locked' || state === 'missing') {
      setShaking(i);
      window.setTimeout(() => setShaking(null), 450);
      sfx.soft();
      coachSay(
        state === 'missing'
          ? T('هذه المحطة قيد التحضير، سنكملها قريباً', 'Cette étape est en préparation, on la terminera bientôt.')
          : T('هذه المحطة مقفلة. أكمل المحطة السابقة أولاً!', "Cette étape est fermée. Termine d'abord l'étape précédente !"),
      );
      return;
    }
    sfx.pop();
    const crossed = await travelTo(i);
    const world = worlds[station.worldIndex];
    if (crossed) await welcome(station.worldIndex);
    if (station.kind === 'treasure') {
      if (state === 'done') {
        const text = T(`فتحت هذا الكنز من قبل. ${world.badge.ar} في حقيبتك!`, `Tu as déjà ouvert ce trésor. La ${world.badge.fr.toLowerCase()} est dans ton sac !`);
        say(text);
        setRibbon({ text, medalColor: world.medalColor, buttons: [{ label: T('حسناً', "D'accord"), onClick: () => setRibbon(null) }] });
        return;
      }
      onClaimTreasure(station.worldIndex);
      sfx.fanfare();
      const last = i === stations.length - 1;
      const text = last
        ? T('مبروك! أكملت رحلة ديدو كلها. أنت بطل الفضاء!', "Bravo ! Tu as terminé tout le voyage de Didou. Tu es un héros de l'espace !")
        : T(`فتحت كنز ${world.name.ar}! ربحت ${world.badge.ar}`, `Tu as ouvert le trésor : ${world.name.fr} ! Tu gagnes la ${world.badge.fr.toLowerCase()}.`);
      say(text);
      setRibbon({
        text,
        medalColor: world.medalColor,
        buttons: [
          {
            label: last ? T('رائع!', 'Génial !') : T('إلى العالم التالي', 'Vers le monde suivant'),
            onClick: async () => {
              setRibbon(null);
              if (last) return;
              const next = await travelTo(i + 1);
              if (next) await welcome(stations[i + 1].worldIndex);
            },
          },
        ],
      });
      return;
    }
    const title = lessonTitles[station.lessonId!] ?? '';
    const text = T(`${world.name.ar} · المحطة ${station.number}: «${title}». هل نبدأ؟`, `${world.name.fr} · étape ${station.number} : « ${title} ». On commence ?`);
    say(text);
    setRibbon({
      text,
      stars: state === 'done' ? stars[i] : undefined,
      buttons: [
        { label: T('لا', 'Non'), tone: 'coral', onClick: () => setRibbon(null) },
        { label: state === 'done' ? T('أعد الدرس', 'Refaire') : T('نعم', 'Oui'), tone: 'green', onClick: () => { setRibbon(null); onStartLesson(i); } },
      ],
    });
  };

  const onMapClick = (e: React.MouseEvent) => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    const target = e.target as Element;
    const game = target.closest('[data-game-station]');
    if (game) {
      if (busyRef.current || ribbon) return;
      sfx.pop();
      onOpenGame?.(Number(game.getAttribute('data-game-station')));
      return;
    }
    const node = target.closest('[data-station]');
    if (node) {
      void openStation(Number(node.getAttribute('data-station')));
    } else if (target.closest('.j-token')) {
      sfx.boing();
      coachSay(T('أنا جاهز للمغامرة! اختر محطة', "Je suis prêt pour l'aventure ! Choisis une étape."));
    }
  };

  const world = worlds[bannerWorld];
  const goWorld = (k: number) => {
    sfx.pop();
    centerOn(worldLeft(worlds, k) + JOURNEY_WORLD_WIDTH / 2, true);
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="j-map-scroll"
        dir="ltr"
        onScroll={updateBanner}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <svg
          ref={svgRef}
          className="j-map-svg"
          viewBox={`0 0 ${totalW} ${JOURNEY_HEIGHT}`}
          style={{ aspectRatio: `${totalW} / ${JOURNEY_HEIGHT}` }}
          role="group"
          aria-label={T('خريطة رحلة ديدو', 'Carte du voyage de Didou')}
          onClick={onMapClick}
        >
          <defs>
            <JourneySceneryDefs />
            {worlds.slice(1).map((next, k) => {
              const seam = worldLeft(worlds, k);
              return (
                <mask key={k} id={`jw-seam-${k}`} maskUnits="userSpaceOnUse" x={seam} y="0" width="420" height={JOURNEY_HEIGHT}>
                  <rect x={seam} y="0" width="420" height={JOURNEY_HEIGHT} fill="url(#jw-hfade)" />
                </mask>
              );
            })}
            <radialGradient id="jw-mist">
              <stop offset="0" stopColor="#fff8ec" stopOpacity=".95" />
              <stop offset=".55" stopColor="#fff8ec" stopOpacity=".7" />
              <stop offset="1" stopColor="#fff8ec" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="jw-n-done" cx=".35" cy=".3"><stop offset="0" stopColor="#fff3b0" /><stop offset=".6" stopColor="#ffc21a" /><stop offset="1" stopColor="#c98500" /></radialGradient>
            <radialGradient id="jw-n-open" cx=".35" cy=".3"><stop offset="0" stopColor="#c9f0ff" /><stop offset=".55" stopColor="#2f9bff" /><stop offset="1" stopColor="#0a5fd0" /></radialGradient>
            <radialGradient id="jw-n-locked" cx=".35" cy=".3"><stop offset="0" stopColor="#d7dbea" /><stop offset="1" stopColor="#7f88a8" /></radialGradient>
            <clipPath id="jw-rocket-window"><circle cx="0" cy="-150" r="30" /></clipPath>
          </defs>

          {worlds.map((w, k) => (
            // 1-unit overlap on each side hides the anti-aliasing hairline between two edge-to-edge worlds.
            <g key={w.id} transform={`translate(${worldLeft(worlds, k) - 1} 0) scale(${(JOURNEY_WORLD_WIDTH + 2) / JOURNEY_WORLD_WIDTH} 1)`}>
              <WorldBackdrop id={w.id} />
              {grade && <GradeDecor grade={grade} world={w.id} />}
            </g>
          ))}
          {/* Soften each border: the next world's sky fades over the start of the previous one, and a faint
              mist hides where one ground ends and the next begins (night already blends into space). */}
          {worlds.slice(1).map((next, k) => {
            const seam = worldLeft(worlds, k);
            return (
              <g key={next.id}>
                <rect x={seam} y="0" width="420" height={JOURNEY_HEIGHT} fill={`url(#${WORLD_SKY[next.id]})`} mask={`url(#jw-seam-${k})`} />
                {next.id !== 'space' && <ellipse cx={seam} cy="700" rx="260" ry="360" fill="url(#jw-mist)" opacity="0.4" />}
              </g>
            );
          })}
          {worlds.map((w, k) => (
            <g key={w.id} transform={`translate(${worldLeft(worlds, k) + JOURNEY_WORLD_WIDTH - 360} 170)`} aria-hidden="true">
              <path d="M0 0 V150" stroke="#7a4e2c" strokeWidth="12" />
              <rect x="-150" y="-60" width="230" height="84" rx="18" fill="#8a5a33" stroke="#5a3a22" strokeWidth="6" />
              <text x="-35" y="0" textAnchor="middle" fontFamily="Lalezar, Cairo, sans-serif" fontSize="42" fill="#fff8ec">
                {pickText(w.name, locale)}
              </text>
            </g>
          ))}

          <path d={d} fill="none" stroke="rgba(19,32,107,.35)" strokeWidth="40" strokeLinecap="round" />
          <path ref={pathRef} d={d} fill="none" stroke="#fff" strokeWidth="12" strokeDasharray="2 30" strokeLinecap="round" />

          {gameStations.map((g, k) => {
            const { x, y, trailY } = gameStationPoint(worlds[g.worldIndex], worldLeft(worlds, g.worldIndex));
            const top = g.open ? '#ffe680' : '#c084fc';
            const side = g.open ? '#b77900' : '#3b0764';
            const label = `${T('لعبة', 'Jeu')}: ${g.title}${g.open ? (g.free ? T('، مجانية', ', gratuit') : '') : T('، للحسابات المميزة', ', Premium')}${g.stars ? ` — ${g.stars}/${g.maxStars}` : ''}`;
            return (
              <g
                key={`game-${g.worldIndex}`}
                className="j-game"
                data-game-station={k}
                data-open={g.open}
                tabIndex={0}
                role="button"
                aria-label={label}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    sfx.pop();
                    onOpenGame?.(k);
                  }
                }}
              >
                <path d={`M${x} ${trailY - 20} V${y + 76}`} stroke="#fff" strokeWidth="9" strokeDasharray="2 22" strokeLinecap="round" opacity=".85" />
                <ellipse cx={x} cy={y + 86} rx="56" ry="13" fill="rgba(0,0,0,.25)" />
                <circle className="j-g-hit" cx={x} cy={y + 10} r="92" fill="transparent" />
                <g className="j-gb">
                  <rect x={x - 62} y={y - 50} width="124" height="124" rx="34" fill={side} />
                  <rect x={x - 62} y={y - 60} width="124" height="120" rx="34" fill={top} stroke="#fff" strokeWidth="7" />
                  <path className="j-g-shine" d={`M${x - 40} ${y - 50} L${x - 6} ${y - 50} L${x - 44} ${y + 40} L${x - 56} ${y + 20}Z`} fill="#fff" opacity="0" />
                  <text x={x} y={y + 22} textAnchor="middle" fontSize="64">{g.emoji}</text>
                  {g.open ? (
                    <g transform={`translate(${x} ${y + 80})`}>
                      <rect x="-64" y="-22" width="128" height="40" rx="20" fill="#13206b" stroke="#fff" strokeWidth="4" />
                      <text x="0" y="9" textAnchor="middle" fontFamily="Lalezar, Cairo, sans-serif" fontSize="28" fill="#ffd23f" direction="ltr">
                        {g.free && !g.stars ? T('مجاني', 'Gratuit') : `★ ${g.stars}/${g.maxStars}`}
                      </text>
                    </g>
                  ) : (
                    <g transform={`translate(${x + 50} ${y + 46})`}>
                      <circle r="28" fill="#6b21a8" stroke="#fff" strokeWidth="5" />
                      <rect x="-12" y="-3" width="24" height="18" rx="4" fill="#fff" />
                      <path d="M-7 -3 V-9 A7 7 0 0 1 7 -9 V-3" stroke="#fff" strokeWidth="5" fill="none" />
                    </g>
                  )}
                </g>
              </g>
            );
          })}

          {stations.map((s, i) => {
            const state = states[i];
            const worldId = worlds[s.worldIndex].id;
            const fill = state === 'done' ? 'url(#jw-n-done)' : state === 'open' ? 'url(#jw-n-open)' : 'url(#jw-n-locked)';
            const title = s.kind === 'treasure' ? `${T('كنز', 'Trésor')} ${pickText(worlds[s.worldIndex].name, locale)}` : lessonTitles[s.lessonId!] ?? '';
            return (
              <g
                key={i}
                className="j-node"
                data-station={i}
                data-state={state}
                data-shake={shaking === i}
                tabIndex={0}
                role="button"
                aria-label={`${title}${state === 'locked' ? T('، مقفلة', ', fermée') : state === 'premium' ? T('، للحسابات المميزة', ', Premium') : state === 'done' ? T('، مكتملة', ', terminée') : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    void openStation(i);
                  }
                }}
              >
                {worldId === 'space' ? (
                  <>
                    <ellipse cx={s.x} cy={s.y + 44} rx="86" ry="30" fill="#6b5a8e" />
                    <ellipse cx={s.x - 10} cy={s.y + 36} rx="62" ry="16" fill="#8d7cb3" />
                  </>
                ) : worldId === 'sea' ? (
                  <ellipse cx={s.x} cy={s.y + 40} rx="70" ry="18" fill="#fff" opacity=".5" />
                ) : (
                  <ellipse cx={s.x} cy={s.y + 40} rx="58" ry="14" fill="rgba(0,0,0,.22)" />
                )}
                <circle className="j-hit" cx={s.x} cy={s.y} r="80" fill="transparent" />
                <g className="j-nb">
                  <circle cx={s.x} cy={s.y} r={s.kind === 'treasure' ? 56 : 48} fill={fill} stroke="#fff" strokeWidth="7" opacity={state === 'missing' ? 0.5 : 1} />
                  {s.kind === 'treasure' ? (
                    // Rendered chest (components/world/worldArt.ts), greyed until the world's lessons are done.
                    <image href={OBJECT_ART.chest} x={s.x - 42} y={s.y - 42} width="84" height="84" style={state === 'locked' || state === 'premium' ? { filter: 'grayscale(.85) brightness(1.1)' } : undefined} />
                  ) : state === 'locked' || state === 'missing' || state === 'premium' ? (
                    <image href={OBJECT_ART.lock} x={s.x - 22} y={s.y - 30} width="44" height="60" />
                  ) : (
                    <text x={s.x} y={s.y + 17} textAnchor="middle" fontFamily="Lalezar, Cairo, sans-serif" fontSize="50" fill="#fff" stroke="#13206b" strokeWidth="5" paintOrder="stroke">
                      {s.number}
                    </text>
                  )}
                </g>
                {state === 'done' && s.kind === 'lesson' &&
                  [0, 1, 2].map((k) => <StarIcon key={k} on={k < stars[i]} x={s.x - 60 + k * 40} y={s.y + 46} width="40" height="40" />)}
              </g>
            );
          })}

          <g ref={tokenRef} className="j-token" data-vehicle="walk" data-moving="false">
            <g className="j-vehicle j-v-walk">
              <DidouFull x="-60" y="-158" width="120" height="158" />
            </g>
            <g className="j-vehicle j-v-boat">
              <path d="M10 -40 V-220 L96 -60Z" fill="#fff" />
              <path d="M10 -40 V-200" stroke="#7a4e2c" strokeWidth="6" />
              <DidouFull x="-62" y="-150" width="100" height="132" />
              <path d="M-100 -46 H100 L72 6 H-72Z" fill="#a0522d" />
              <rect x="-100" y="-50" width="200" height="12" fill="#f2b33d" />
              <path d="M-110 10 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" strokeWidth="5" fill="none" />
            </g>
            <g className="j-vehicle j-v-rocket">
              <g ref={rocketRef}>
                <path className="j-flame" d="M-22 -30 Q0 30 22 -30Z" fill="#ffb800" />
                <path className="j-flame" d="M-12 -30 Q0 8 12 -30Z" fill="#fff3b0" />
                <path d="M-44 -70 L-70 -24 L-40 -36Z M44 -70 L70 -24 L40 -36Z" fill="#d6283b" />
                <path d="M0 -260 C52 -210 56 -130 46 -32 H-46 C-56 -130 -52 -210 0 -260Z" fill="#fff8ec" stroke="#13206b" strokeWidth="5" />
                <path d="M0 -260 C26 -236 38 -214 44 -196 H-44 C-38 -214 -26 -236 0 -260Z" fill="#d6283b" />
                <circle cx="0" cy="-150" r="36" fill="#9fe3ff" stroke="#13206b" strokeWidth="6" />
                <g clipPath="url(#jw-rocket-window)">
                  <DidouHead x="-40" y="-188" width="80" height="70" />
                </g>
                <rect x="-46" y="-60" width="92" height="12" fill="#0f8a4b" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div className="j-map-hud">
        <button type="button" className="j-gloss j-round j-flip" onClick={() => { sfx.pop(); onBack(); }} aria-label={T('رجوع إلى الكوكب', 'Retour à la planète')}>
          <ArrowIcon />
        </button>
        <div className="j-banner" aria-live="polite">
          <b className="journey-outline">{pickText(world.name, locale)}</b>
          <span>{pickText(world.subtitle, locale)}</span>
        </div>
        <div className="j-map-counters">
          <div className="j-counter" aria-label={T('النجوم', 'Étoiles')}>
            <span>{totalStars}</span>
            <StarIcon />
          </div>
          <div className="j-counter" aria-label={T('القطع الذهبية', "Pièces d'or")}>
            <span>{coins}</span>
            <CoinIcon />
          </div>
        </div>
      </div>
      {bannerWorld > 0 && (
        <button type="button" className="j-gloss j-round j-nav" data-side="right" onClick={() => goWorld(bannerWorld - 1)} aria-label={T('العالم السابق', 'Monde précédent')}>
          <ArrowIcon to="right" />
        </button>
      )}
      {bannerWorld < worlds.length - 1 && (
        <button type="button" className="j-gloss j-round j-nav" data-side="left" onClick={() => goWorld(bannerWorld + 1)} aria-label={T('العالم التالي', 'Monde suivant')}>
          <ArrowIcon to="left" />
        </button>
      )}
      {coach && (
        <div className="j-say j-map-say">
          <DidouHead className="j-say-head" />
          <div className="j-say-text">
            <span>{coach}</span>
            <button type="button" className="j-listen" onClick={() => say(coach)} aria-label={T('استمع', 'Écouter')}>
              <SpeakerIcon />
            </button>
          </div>
        </div>
      )}
      {ribbon && <JourneyRibbon {...ribbon} onListen={() => say(ribbon.text)} listenLabel={T('استمع إلى ديدو', 'Écouter Didou')} />}
    </>
  );
}

/** Arrow pointing physically left or right; add `j-flip` on the button to mirror a "back" arrow in RTL. */
export function ArrowIcon({ to = 'left' }: { to?: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {to === 'right' ? (
        <path d="M3 12h16M12 4l8 8-8 8" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M21 12H5M12 4l-8 8 8 8" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#ffb800" stroke="#b77900" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="7" fill="#ffd23f" />
      <path d="M14.5 8.2a4.6 4.6 0 100 7.6 3.8 3.8 0 110-7.6z" fill="#e39a00" />
    </svg>
  );
}
