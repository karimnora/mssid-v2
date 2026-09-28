/**
 * CircuitBuilder.tsx  — v2  (mobile-first wire connections)
 *
 * Améliorations clés :
 * 1. Terminaux 4× plus grands (r=22 zone tapotable invisible, r=11 point visible)
 * 2. Fil par glisser-déposer : presser un terminal → faire glisser → relâcher → connexion auto
 * 3. Fil par double-clic : tapoter terminal A → tapoter terminal B → connexion
 * 4. Snap automatique dans un rayon de 42 SVG-units + anneaux animés sur les cibles
 * 5. Plus aucun window.addEventListener — tout via pointer capture sur le SVG
 * 6. Sélection au toucher : tapoter un composant → le sélectionner → bouton × visible
 * 7. Canvas = largeur du téléphone (viewBox mesuré), spawn dans la zone visible, labels palette toujours affichés.
 */

import React, { useState, useRef, useCallback, useMemo, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trash2, CheckCircle2, XCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type CBType = 'battery' | 'switch' | 'bulb' | 'diode' | 'motor' | 'buzzer' | 'resistor';

export interface CBComp {
  id: string; type: CBType;
  x: number; y: number;
  switchOpen: boolean; diodeReversed: boolean;
  resistorVal: 10 | 100 | 1000; voltage: 4.5 | 9;
}

export interface CBWire {
  id: string;
  from: string; fromT: 'A' | 'B';
  to: string;   toT:   'A' | 'B';
}

type Interaction =
  | { type: 'idle' }
  | { type: 'dragging'; id: string; ox: number; oy: number }
  | { type: 'wiring';   fromId: string; fromT: 'A' | 'B'; px: number; py: number; snapping: boolean };

// ─── Layout constants ──────────────────────────────────────────────────────
// ViewBox tracks the container width so 1 SVG unit ≈ 1 CSS px (TH=30 → ~60 px, see --hit).
// A fixed 640×400 canvas overflowed on phones and blocked vertical scroll (touch-action: none).
const HW = 50;
const HH = 32;
const TR = 14;
const TH = 30;
const SNAP = 50;
const MIN_CANVAS_W = 280;
const MIN_CANVAS_H = 400;

export function circuitViewSize(containerWidth: number): { w: number; h: number } {
  const w = Math.max(MIN_CANVAS_W, Math.floor(containerWidth) || MIN_CANVAS_W);
  const h = Math.min(560, Math.max(MIN_CANVAS_H, Math.round(w * 1.15)));
  return { w, h };
}

export function defaultCircuitLayout(w: number, h: number): CBComp[] {
  const mx = HW + 24;
  const my = HH + 24;
  return [
    { id: 'bat0', type: 'battery', x: w / 2, y: h - my, switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5 },
    { id: 'sw0', type: 'switch', x: mx, y: my, switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5 },
    { id: 'bulb0', type: 'bulb', x: w - mx, y: my, switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5 },
  ];
}

export function spawnInView(w: number, h: number, jitter = Math.random): { x: number; y: number } {
  const mx = HW + 16;
  const my = HH + 16;
  const x = Math.max(mx, Math.min(w - mx, w / 2 + (jitter() - 0.5) * Math.min(120, w * 0.28)));
  const y = Math.max(my, Math.min(h - my, h / 2 + (jitter() - 0.5) * Math.min(80, h * 0.2)));
  return { x, y };
}

export function clampToCanvas(c: CBComp, w: number, h: number): CBComp {
  return {
    ...c,
    x: Math.max(HW + 5, Math.min(w - HW - 5, c.x)),
    y: Math.max(HH + 5, Math.min(h - HH - 5, c.y)),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function toSVG(e: { clientX: number; clientY: number }, svg: SVGSVGElement) {
  const r = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  return {
    x: ((e.clientX - r.left) / r.width) * vb.width,
    y: ((e.clientY - r.top) / r.height) * vb.height,
  };
}
function termPos(c: CBComp, t: 'A' | 'B') {
  return { x: c.x + (t === 'A' ? -HW : HW), y: c.y };
}
function wirePath(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const mx = (p1.x + p2.x) / 2;
  return `M ${p1.x} ${p1.y} H ${mx} V ${p2.y} H ${p2.x}`;
}

// ─── Simulator ────────────────────────────────────────────────────────────
function simulate(comps: CBComp[], wires: CBWire[]) {
  const adj = new Map<string, Set<string>>();
  const edge = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a)!.add(b); adj.get(b)!.add(a);
  };
  for (const w of wires) edge(`${w.from}_${w.fromT}`, `${w.to}_${w.toT}`);
  for (const c of comps) {
    if (c.type === 'battery') continue;
    const conducts = c.type === 'switch' ? !c.switchOpen : c.type === 'diode' ? !c.diodeReversed : true;
    if (conducts) edge(`${c.id}_A`, `${c.id}_B`);
  }
  const bat = comps.find(c => c.type === 'battery');
  if (!bat) return { powered: new Set<string>(), closed: false };

  const start = `${bat.id}_B`, goal = `${bat.id}_A`;
  const visited = new Set<string>(), onPath = new Set<string>();
  function dfs(cur: string, trail: string[]): boolean {
    if (cur === goal) { [...trail, cur].forEach(n => onPath.add(n)); return true; }
    if (visited.has(cur)) return false;
    visited.add(cur);
    for (const next of (adj.get(cur) ?? [])) { if (dfs(next, [...trail, cur])) return true; }
    return false;
  }
  const closed = dfs(start, []);
  const powered = new Set<string>();
  for (const c of comps) {
    if (c.type !== 'battery' && (onPath.has(`${c.id}_A`) || onPath.has(`${c.id}_B`))) powered.add(c.id);
  }
  return { powered, closed };
}

const DEFAULT_WIRES: CBWire[] = [
  { id: 'w0', from: 'bat0',  fromT: 'B', to: 'bulb0', toT: 'B' },
  { id: 'w1', from: 'bulb0', fromT: 'A', to: 'sw0',   toT: 'B' },
  { id: 'w2', from: 'sw0',   fromT: 'A', to: 'bat0',  toT: 'A' },
];

const PALETTE: { type: CBType; labelAr: string; labelFr: string; icon: string; accent: string }[] = [
  { type: 'switch',   labelAr: 'قاطعة',    labelFr: 'Interrupteur', icon: '⚡', accent: 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20' },
  { type: 'bulb',     labelAr: 'مصباح',    labelFr: 'Ampoule',      icon: '💡', accent: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20' },
  { type: 'diode',    labelAr: 'صمام LED', labelFr: 'Diode LED',    icon: '🔺', accent: 'border-orange-500/50 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20' },
  { type: 'motor',    labelAr: 'محرك',     labelFr: 'Moteur',       icon: '⚙️', accent: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20' },
  { type: 'buzzer',   labelAr: 'جرس',      labelFr: 'Vibreur',      icon: '🔔', accent: 'border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20' },
  { type: 'resistor', labelAr: 'مقاومة',   labelFr: 'Résistance',   icon: '🟤', accent: 'border-rose-500/50 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' },
];

// ─── Main component ────────────────────────────────────────────────────────
export const CircuitBuilder: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState({ w: 360, h: 420 });
  const [comps, setComps] = useState<CBComp[]>(() => defaultCircuitLayout(360, 420));
  const [wires,       setWires]       = useState<CBWire[]>(DEFAULT_WIRES);
  const [interaction, setInteraction] = useState<Interaction>({ type: 'idle' });
  const [hovered,     setHovered]     = useState<string | null>(null);
  const [selected,    setSelected]    = useState<string | null>(null);

  const svgRef      = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const apply = (width: number) => {
      const next = circuitViewSize(width);
      setCanvas((prev) => (prev.w === next.w && prev.h === next.h ? prev : next));
    };
    apply(el.clientWidth);
    const ro = new ResizeObserver((entries) => apply(entries[0]?.contentRect.width ?? el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setComps((prev) => prev.map((c) => clampToCanvas(c, canvas.w, canvas.h)));
  }, [canvas.w, canvas.h]);

  const idCounter   = useRef(100);
  const wireDragged = useRef(false);  // true once pointer moved > threshold during wiring
  // Pointer capture is set on svgRef (not the component's own <g>) in handleCompPointerDown below,
  // which some browsers use to retarget the synthetic `click` event away from the original element —
  // so a genuine tap on a switch/diode/resistor could silently never reach a plain onClick handler.
  // Detecting "was this actually dragged" ourselves (same pattern as wireDragged above) and firing
  // the tap action from handleSVGPointerUp sidesteps that entirely.
  const compDragged = useRef(false);

  const nextId = () => `e${idCounter.current++}`;
  const { powered, closed } = useMemo(() => simulate(comps, wires), [comps, wires]);

  // ── Find closest terminal to a SVG-space point ──────────────────────────
  const snapTarget = useCallback((x: number, y: number, excludeId: string, excludeT: 'A' | 'B') => {
    let best: { compId: string; t: 'A' | 'B'; dist: number } | null = null;
    for (const c of comps) {
      for (const t of ['A', 'B'] as const) {
        if (c.id === excludeId && t === excludeT) continue;
        const tp = termPos(c, t);
        const dist = Math.hypot(tp.x - x, tp.y - y);
        if (dist < SNAP && (!best || dist < best.dist)) best = { compId: c.id, t, dist };
      }
    }
    return best;
  }, [comps]);

  // ── Wire helper ──────────────────────────────────────────────────────────
  const addWire = useCallback((fromId: string, fromT: 'A'|'B', toId: string, toT: 'A'|'B') => {
    const dup = wires.some(w =>
      (w.from === fromId && w.fromT === fromT && w.to === toId && w.toT === toT) ||
      (w.to === fromId && w.toT === fromT && w.from === toId && w.fromT === toT)
    );
    if (!dup) setWires(prev => [...prev, { id: nextId(), from: fromId, fromT, to: toId, toT }]);
  }, [wires]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Component tap: select + toggle switch/diode/cycle resistor ─────────────
  // Invoked from handleSVGPointerUp once we know the pointer never actually moved (see
  // compDragged above) — not a plain onClick, since that can silently miss the retargeted click.
  const handleCompTap = useCallback((id: string) => {
    setSelected(prev => id === prev ? null : id);
    const c = comps.find(c => c.id === id);
    if (!c) return;
    if (c.type === 'switch')
      setComps(prev => prev.map(x => x.id === id ? { ...x, switchOpen: !x.switchOpen } : x));
    else if (c.type === 'diode')
      setComps(prev => prev.map(x => x.id === id ? { ...x, diodeReversed: !x.diodeReversed } : x));
    else if (c.type === 'resistor') {
      const vals: (10 | 100 | 1000)[] = [10, 100, 1000];
      const next = vals[(vals.indexOf(c.resistorVal) + 1) % 3];
      setComps(prev => prev.map(x => x.id === id ? { ...x, resistorVal: next } : x));
    }
  }, [comps]);

  // ── SVG pointer events ───────────────────────────────────────────────────
  const handleSVGPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const { x, y } = toSVG(e, svgRef.current);

    if (interaction.type === 'dragging') {
      compDragged.current = true;
      setComps(prev => prev.map(c =>
        c.id === interaction.id
          ? { ...c,
              x: Math.max(HW + 5, Math.min(canvas.w - HW - 5, x - interaction.ox)),
              y: Math.max(HH + 5, Math.min(canvas.h - HH - 5, y - interaction.oy)) }
          : c
      ));
      return;
    }
    if (interaction.type === 'wiring') {
      wireDragged.current = true;
      const snap = snapTarget(x, y, interaction.fromId, interaction.fromT);
      if (snap) {
        const tp = termPos(comps.find(c => c.id === snap.compId)!, snap.t);
        setInteraction(p => p.type === 'wiring' ? { ...p, px: tp.x, py: tp.y, snapping: true } : p);
      } else {
        setInteraction(p => p.type === 'wiring' ? { ...p, px: x, py: y, snapping: false } : p);
      }
    }
  }, [interaction, comps, snapTarget, canvas.w, canvas.h]);

  const handleSVGPointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (interaction.type === 'dragging') {
      if (!compDragged.current) handleCompTap(interaction.id);
      setInteraction({ type: 'idle' });
      return;
    }
    if (interaction.type === 'wiring' && wireDragged.current) {
      // Drag-to-wire: snap-connect on release
      if (!svgRef.current) { setInteraction({ type: 'idle' }); return; }
      const { x, y } = toSVG(e, svgRef.current);
      const snap = snapTarget(x, y, interaction.fromId, interaction.fromT);
      if (snap) addWire(interaction.fromId, interaction.fromT, snap.compId, snap.t);
      setInteraction({ type: 'idle' });
    }
    // If not dragged (quick tap): keep wiring state active for click-to-connect
  }, [interaction, snapTarget, addWire, handleCompTap]);

  // ── Component drag start ─────────────────────────────────────────────────
  const handleCompPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    if (interaction.type === 'wiring') return;
    e.stopPropagation();
    if (!svgRef.current) return;
    const { x, y } = toSVG(e, svgRef.current);
    const c = comps.find(c => c.id === id);
    if (!c) return;
    compDragged.current = false;
    setInteraction({ type: 'dragging', id, ox: x - c.x, oy: y - c.y });
    svgRef.current.setPointerCapture(e.pointerId);
  }, [interaction, comps]);

  // ── Terminal interactions ────────────────────────────────────────────────
  const handleTerminalPointerDown = useCallback((e: React.PointerEvent, compId: string, t: 'A' | 'B') => {
    e.stopPropagation();
    if (!svgRef.current) return;

    if (interaction.type === 'wiring') {
      // Click-to-connect second terminal
      if (interaction.fromId === compId && interaction.fromT === t) {
        setInteraction({ type: 'idle' });
        return;
      }
      addWire(interaction.fromId, interaction.fromT, compId, t);
      setInteraction({ type: 'idle' });
      return;
    }

    // Start wiring — capture pointer so SVG receives move/up
    svgRef.current.setPointerCapture(e.pointerId);
    wireDragged.current = false;
    const { x, y } = toSVG(e, svgRef.current);
    setInteraction({ type: 'wiring', fromId: compId, fromT: t, px: x, py: y, snapping: false });
    setSelected(null);
  }, [interaction, addWire]);

  // ── Background tap: cancel wiring / deselect ────────────────────────────
  const handleBgPointerDown = useCallback((e: React.PointerEvent<SVGRectElement>) => {
    e.stopPropagation();
    if (interaction.type === 'wiring') { setInteraction({ type: 'idle' }); return; }
    setSelected(null);
  }, [interaction]);

  // ── Add / Delete ─────────────────────────────────────────────────────────
  const handleAddComp = (type: CBType) => {
    const id = nextId();
    const pos = spawnInView(canvas.w, canvas.h);
    setComps(prev => [...prev, {
      id, type,
      x: pos.x,
      y: pos.y,
      switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5,
    }]);
  };
  const handleDeleteComp = useCallback((id: string) => {
    setComps(prev => prev.filter(c => c.id !== id));
    setWires(prev => prev.filter(w => w.from !== id && w.to !== id));
    setSelected(null);
  }, []);
  const handleDeleteWire = useCallback((id: string) => {
    setWires(prev => prev.filter(w => w.id !== id));
  }, []);
  const handleReset = () => {
    setComps(defaultCircuitLayout(canvas.w, canvas.h));
    setWires(DEFAULT_WIRES);
    setInteraction({ type: 'idle' });
    setSelected(null);
  };
  const handleClear = () => {
    const my = HH + 24;
    setComps([{ id: 'bat0', type: 'battery', x: canvas.w / 2, y: canvas.h - my, switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5 }]);
    setWires([]); setInteraction({ type: 'idle' }); setSelected(null);
  };

  // ─── Terminal renderer ─────────────────────────────────────────────────
  const renderTerminal = (compId: string, t: 'A' | 'B') => {
    const isWiring = interaction.type === 'wiring';
    const isSource = isWiring && interaction.fromId === compId && interaction.fromT === t;
    const isTarget = isWiring && !isSource;
    const tcx = t === 'A' ? -HW : HW;
    const tcy = 0;

    return (
      <g key={`t-${compId}-${t}`}>
        {/* Pulsing snap guide ring when this terminal is a valid target */}
        {isTarget && (
          <circle cx={tcx} cy={tcy} r={14} fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.7">
            <animate attributeName="r" values="12;24;12" dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="1.1s" repeatCount="indefinite" />
          </circle>
        )}
        {/* Snap highlight when wire is close to this terminal */}
        {isWiring && interaction.snapping && (
          <circle cx={tcx} cy={tcy} r={TH} fill="#fbbf24" opacity="0.12" />
        )}
        {/* Visible dot */}
        <circle
          cx={tcx} cy={tcy} r={TR}
          fill={isSource ? '#fbbf24' : '#1e293b'}
          stroke={isSource ? '#fef08a' : isTarget ? '#fbbf24' : '#64748b'}
          strokeWidth={isWiring ? 2.5 : 1.5}
          style={{ pointerEvents: 'none' }}
        />
        {/* Large invisible hit area */}
        <circle
          cx={tcx} cy={tcy} r={TH}
          fill="transparent"
          style={{ cursor: 'crosshair', pointerEvents: 'all', touchAction: 'none' }}
          onPointerDown={e => {
            handleTerminalPointerDown(e as unknown as React.PointerEvent, compId, t);
          }}
        />
      </g>
    );
  };

  // ─── Component renderer ───────────────────────────────────────────────
  const renderComp = (c: CBComp) => {
    const isPowered = powered.has(c.id);
    const isHov     = hovered  === c.id;
    const isSel     = selected === c.id;
    const isBat     = c.type   === 'battery';
    const isWiring  = interaction.type === 'wiring';

    const style: Record<CBType, { fill: string; stroke: string; label: string }> = {
      battery:  { fill: '#0c4a6e', stroke: isPowered ? '#38bdf8' : '#0284c7', label: `${c.voltage}V` },
      switch:   { fill: c.switchOpen ? '#1f0606' : '#052e16', stroke: c.switchOpen ? '#ef4444' : '#22c55e', label: c.switchOpen ? 'مفتوحة' : 'مغلقة' },
      bulb:     { fill: isPowered ? '#713f12' : '#1e293b', stroke: isPowered ? '#fbbf24' : '#475569', label: isPowered ? 'مضيء' : 'مصباح' },
      diode:    { fill: '#431407', stroke: '#fb923c', label: c.diodeReversed ? 'عكسي' : 'أمامي' },
      motor:    { fill: '#0c2461', stroke: '#60a5fa', label: 'محرك' },
      buzzer:   { fill: '#2e026d', stroke: '#a78bfa', label: 'جرس' },
      resistor: { fill: '#78350f', stroke: '#fbbf24', label: `${c.resistorVal}Ω` },
    };
    const s = style[c.type];

    return (
      <g
        key={c.id}
        transform={`translate(${c.x},${c.y})`}
        onPointerDown={e => handleCompPointerDown(e as unknown as React.PointerEvent, c.id)}
        onPointerEnter={() => !isWiring && setHovered(c.id)}
        onPointerLeave={() => setHovered(null)}
        style={{ cursor: isBat ? 'default' : isWiring ? 'crosshair' : 'grab', pointerEvents: 'auto', touchAction: 'none' }}
      >
        {/* Selection ring */}
        {isSel && <rect x={-HW - 8} y={-HH - 8} width={(HW + 8) * 2} height={(HH + 8) * 2} rx="18"
          fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="6 3" opacity="0.9" />}
        {/* Power glow */}
        {isPowered && <rect x={-HW - 7} y={-HH - 7} width={(HW + 7) * 2} height={(HH + 7) * 2} rx="18"
          fill="#fbbf24" opacity="0.16" />}
        {/* Body */}
        <rect x={-HW} y={-HH} width={HW * 2} height={HH * 2} rx="9"
          fill={s.fill} stroke={s.stroke} strokeWidth={isHov || isSel ? 2.5 : 1.5} />

        {/* Internal graphics */}
        {c.type === 'switch' && <line x1={-HW + 10} y1="0" x2={c.switchOpen ? -4 : HW - 10} y2={c.switchOpen ? -12 : 0}
          stroke={c.switchOpen ? '#ef4444' : '#22c55e'} strokeWidth="3.5" strokeLinecap="round" />}
        {c.type === 'diode' && <g transform={c.diodeReversed ? 'scale(-1,1)' : ''}>
          <polygon points="-14,-12 -14,12 12,0" fill={isPowered ? '#f59e0b' : '#64748b'} stroke="#fef08a" strokeWidth="1" />
          <line x1="12" y1="-14" x2="12" y2="14" stroke="#fef08a" strokeWidth="3" />
        </g>}
        {c.type === 'resistor' && <polyline
          points="-30,0 -22,-10 -14,10 -6,-10 2,10 10,-10 18,10 26,0"
          fill="none" stroke={isPowered ? '#fef08a' : '#94a3b8'} strokeWidth="2.5" strokeLinejoin="round" />}
        {c.type === 'bulb' && !isPowered && <path d="M-10,9 L-5,-6 L0,6 L5,-6 L10,9" fill="none" stroke="#475569" strokeWidth="2" />}
        {c.type === 'bulb' && isPowered  && <text x="0" y="8" textAnchor="middle" fontSize="16">💡</text>}
        {c.type === 'motor' && <text x="0" y="6" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="900">M</text>}
        {c.type === 'buzzer' && <text x="0" y="7" textAnchor="middle" fontSize="14">🔔</text>}
        {isBat && <>
          <text x={-HW - 12} y="5" textAnchor="middle" fontSize="14" fill="#ef4444" fontWeight="900">−</text>
          <text x={ HW + 12} y="5" textAnchor="middle" fontSize="14" fill="#22c55e" fontWeight="900">+</text>
          <text x="0" y="6" textAnchor="middle" fontSize="11" fill="#e2e8f0" fontWeight="800">🔋 {c.voltage}V</text>
        </>}
        {!isBat && c.type !== 'bulb' && c.type !== 'motor' && c.type !== 'buzzer' &&
          c.type !== 'switch' && c.type !== 'diode' && c.type !== 'resistor' && (
          <text x="0" y="6" textAnchor="middle" fontSize="11" fill="#e2e8f0" fontWeight="700">
            {c.type === 'battery' ? '🔋' : ''}
          </text>
        )}
        <text x="0" y={HH + 14} textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontWeight="700">{s.label}</text>

        {/* Terminals */}
        {renderTerminal(c.id, 'A')}
        {renderTerminal(c.id, 'B')}

        {/* Delete × — visible when hovered or selected on any device */}
        {(isHov || isSel) && !isBat && interaction.type === 'idle' && (
          <g transform={`translate(${HW + 4},${-HH - 16})`}
            onPointerDown={e => { (e as unknown as React.PointerEvent).stopPropagation(); }}
            onClick={e => { (e as unknown as React.MouseEvent).stopPropagation(); handleDeleteComp(c.id); }}
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
            <circle r={20} fill="#ef4444" stroke="#fecaca" strokeWidth="2" />
            <text y="7" textAnchor="middle" fontSize="20" fill="white" fontWeight="900">×</text>
          </g>
        )}
      </g>
    );
  };

  const poweredList = comps.filter(c => powered.has(c.id))
    .map(c => PALETTE.find(p => p.type === c.type)?.labelAr ?? c.type);

  return (
    <div className="space-y-3" dir="rtl">
      {/* Status banner */}
      <AnimatePresence mode="wait">
        <motion.div key={closed ? 'c' : 'o'}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className={`p-3 rounded-2xl border text-xs font-bold flex items-start gap-2.5 ${
            closed ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-200'
                   : 'bg-amber-950/80  border-amber-700/60  text-amber-200'}`}
        >
          {closed
            ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            : <XCircle       className="w-4 h-4 text-amber-400    shrink-0 mt-0.5" />}
          <span>
            {closed
              ? <>✅ الدارة مغلقة — التيار يمر عبر: <strong>{poweredList.join(' ← ')}</strong></>
              : <>⚠️ الدارة غير مكتملة — تحقق من الوصلات أو القاطعة</>}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

        {/* ── Palette ─────────────────────────── */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">أضف عنصراً:</span>
          {/* Mobile: chip row / Desktop: full list */}
          <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-0 lg:space-y-1.5">
            {PALETTE.map(p => (
              <motion.button key={p.type} whileTap={{ scale: 0.93 }} type="button"
                onClick={() => handleAddComp(p.type)}
                className={`hit-target flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${p.accent}
                            lg:w-full`}
              >
                <span className="text-sm">{p.icon}</span>
                <span>{p.labelAr}</span>
                <span className="hidden lg:inline text-[9px] opacity-55 font-mono">{p.labelFr}</span>
              </motion.button>
            ))}
          </div>
          <div className="pt-1 border-t border-slate-800 flex gap-1.5 lg:flex-col">
            <button type="button" onClick={handleReset}
              className="hit-target flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold cursor-pointer transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>الافتراضي</span>
            </button>
            <button type="button" onClick={handleClear}
              className="hit-target flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold cursor-pointer transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح الكل</span>
            </button>
          </div>
          {/* Guide — trimmed to the 2 actions a child actually needs to start (wire, delete);
              switch/diode toggling is discoverable by tapping, not worth reading upfront. */}
          <div className="hidden lg:block bg-slate-950 rounded-xl p-2.5 text-[10px] text-slate-400 space-y-1.5 border border-slate-800/80 leading-relaxed">
            <p>👆 <strong className="text-slate-300">اسحب</strong> النقطة 🔴 نحو نقطة أخرى لتوصيل سلك</p>
            <p>✕ <strong className="text-slate-300">انقر عنصراً</strong> ثم اضغط × لحذفه</p>
          </div>
        </div>

        {/* ── Canvas ──────────────────────────── */}
        <div className="lg:col-span-9">
          <div ref={wrapRef} className="bg-slate-950 rounded-2xl border border-slate-800 w-full" dir="ltr">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${canvas.w} ${canvas.h}`}
              width="100%"
              height={canvas.h}
              preserveAspectRatio="xMidYMid meet"
              style={{
                display: 'block',
                touchAction: interaction.type === 'idle' ? 'pan-y' : 'none',
              }}
              onPointerMove={handleSVGPointerMove}
              onPointerUp={handleSVGPointerUp}
              onPointerLeave={() => { if (interaction.type === 'dragging') setInteraction({ type: 'idle' }); }}
            >
              <defs>
                <pattern id="cb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.6" />
                </pattern>
              </defs>

              {/* Background (handles bg taps) */}
              <rect width={canvas.w} height={canvas.h} fill="url(#cb-grid)"
                style={{ pointerEvents: 'all' }}
                onPointerDown={handleBgPointerDown as unknown as React.PointerEventHandler<SVGRectElement>} />

              {/* Wires */}
              {wires.map(w => {
                const fc = comps.find(c => c.id === w.from);
                const tc = comps.find(c => c.id === w.to);
                if (!fc || !tc) return null;
                const p1 = termPos(fc, w.fromT), p2 = termPos(tc, w.toT);
                const live = closed && (powered.has(w.from) || powered.has(w.to));
                const d = wirePath(p1, p2);
                return (
                  <g key={w.id} onClick={() => handleDeleteWire(w.id)} style={{ cursor: 'pointer' }}>
                    <path d={d} fill="none" stroke="transparent" strokeWidth="18" />
                    <path d={d} fill="none" stroke={live ? '#eab308' : '#334155'} strokeWidth={live ? 3.5 : 2.5} strokeLinecap="round" />
                    {live && <path d={d} fill="none" stroke="#fef08a" strokeWidth="3"
                      strokeDasharray="6 12" strokeLinecap="round"
                      className="animate-[dash_1.2s_linear_infinite]" />}
                  </g>
                );
              })}

              {/* Components */}
              {comps.map(renderComp)}

              {/* Wire preview */}
              {interaction.type === 'wiring' && (() => {
                const fc = comps.find(c => c.id === interaction.fromId);
                if (!fc) return null;
                const p1 = termPos(fc, interaction.fromT);
                return (
                  <path
                    d={`M ${p1.x} ${p1.y} L ${interaction.px} ${interaction.py}`}
                    fill="none"
                    stroke={interaction.snapping ? '#4ade80' : '#fbbf24'}
                    strokeWidth="3" strokeDasharray="7 5" opacity="0.9"
                    style={{ pointerEvents: 'none' }}
                  />
                );
              })()}
            </svg>
          </div>

          {/* Hint — one short line; secondary actions (select/delete a wire) are learned by doing. */}
          <div className="mt-1.5 text-center text-[10px] text-slate-500 font-bold">
            {interaction.type === 'wiring'
              ? '🟢 اسحب نحو طرف آخر أو انقر عليه مباشرة'
              : '👆 اسحب النقاط 🔴 لتوصيل الأسلاك'}
          </div>
        </div>
      </div>
    </div>
  );
};
