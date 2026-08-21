/**
 * CircuitBuilder.tsx
 * Drag-and-drop SVG circuit editor with real-time graph simulation.
 * Kids can place electrical components, connect them with wires and see
 * the circuit come to life with animated current flow.
 *
 * Interaction model:
 *  • Drag component body  → reposition on canvas
 *  • Click terminal dot   → start drawing a wire; click another terminal → complete wire
 *  • Click wire           → delete it
 *  • Click switch body    → toggle open/closed
 *  • Click diode body     → reverse polarity
 *  • Hover × badge        → delete component (battery is permanent)
 */

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trash2, Zap, CheckCircle2, XCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────
export type CBType = 'battery' | 'switch' | 'bulb' | 'diode' | 'motor' | 'buzzer' | 'resistor';

export interface CBComp {
  id: string;
  type: CBType;
  x: number;
  y: number;
  switchOpen: boolean;
  diodeReversed: boolean;
  resistorVal: 10 | 100 | 1000;
  voltage: 4.5 | 9;
}

export interface CBWire {
  id: string;
  from: string; fromT: 'A' | 'B';
  to: string;   toT:   'A' | 'B';
}

type Interaction =
  | { type: 'idle' }
  | { type: 'dragging'; id: string; ox: number; oy: number }
  | { type: 'wiring';   fromId: string; fromT: 'A' | 'B'; px: number; py: number };

// ─────────────────────────────────────────────────────
// Layout constants
// ─────────────────────────────────────────────────────
const SVG_W = 500;
const SVG_H = 310;
const HW = 40;  // component half-width
const HH = 24;  // component half-height

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────
function toSVG(e: { clientX: number; clientY: number }, svg: SVGSVGElement) {
  const r = svg.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width)  * SVG_W,
    y: ((e.clientY - r.top)  / r.height) * SVG_H,
  };
}

function termPos(c: CBComp, t: 'A' | 'B') {
  return { x: c.x + (t === 'A' ? -HW : HW), y: c.y };
}

/** Manhattan L-shaped wire path */
function wirePath(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const mx = (p1.x + p2.x) / 2;
  return `M ${p1.x} ${p1.y} H ${mx} V ${p2.y} H ${p2.x}`;
}

// ─────────────────────────────────────────────────────
// Circuit simulator  (graph DFS)
// ─────────────────────────────────────────────────────
function simulate(comps: CBComp[], wires: CBWire[]): { powered: Set<string>; closed: boolean } {
  const adj = new Map<string, Set<string>>();
  const edge = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  };

  // Wire connections
  for (const w of wires) edge(`${w.from}_${w.fromT}`, `${w.to}_${w.toT}`);

  // Component internal edges (all except battery)
  for (const c of comps) {
    if (c.type === 'battery') continue;
    const conducts =
      c.type === 'switch' ? !c.switchOpen :
      c.type === 'diode'  ? !c.diodeReversed : true;
    if (conducts) edge(`${c.id}_A`, `${c.id}_B`);
  }

  const bat = comps.find(c => c.type === 'battery');
  if (!bat) return { powered: new Set(), closed: false };

  const start = `${bat.id}_B`; // (+) terminal — conventional current exits
  const goal  = `${bat.id}_A`; // (−) terminal — current returns
  const visited = new Set<string>();
  const onPath  = new Set<string>();

  function dfs(cur: string, trail: string[]): boolean {
    if (cur === goal) { [...trail, cur].forEach(n => onPath.add(n)); return true; }
    if (visited.has(cur)) return false;
    visited.add(cur);
    for (const next of (adj.get(cur) ?? [])) {
      if (dfs(next, [...trail, cur])) return true;
    }
    return false;
  }

  const closed = dfs(start, []);

  const powered = new Set<string>();
  for (const c of comps) {
    if (c.type !== 'battery' &&
        (onPath.has(`${c.id}_A`) || onPath.has(`${c.id}_B`))) {
      powered.add(c.id);
    }
  }
  return { powered, closed };
}

// ─────────────────────────────────────────────────────
// Default circuit  (simple series loop: battery → switch → bulb)
// ─────────────────────────────────────────────────────
const DEFAULT_COMPS: CBComp[] = [
  { id: 'bat0',  type: 'battery', x: 250, y: 265, switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5 },
  { id: 'sw0',   type: 'switch',  x: 100, y: 70,  switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5 },
  { id: 'bulb0', type: 'bulb',    x: 395, y: 70,  switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5 },
];
const DEFAULT_WIRES: CBWire[] = [
  { id: 'w0', from: 'bat0',  fromT: 'B', to: 'bulb0', toT: 'B' }, // battery(+) → bulb right
  { id: 'w1', from: 'bulb0', fromT: 'A', to: 'sw0',   toT: 'B' }, // bulb left  → switch right
  { id: 'w2', from: 'sw0',   fromT: 'A', to: 'bat0',  toT: 'A' }, // switch left → battery(−)
];

// ─────────────────────────────────────────────────────
// Palette definition
// ─────────────────────────────────────────────────────
const PALETTE: { type: CBType; labelAr: string; labelFr: string; icon: string; accent: string }[] = [
  { type: 'switch',   labelAr: 'قاطعة',    labelFr: 'Interrupteur', icon: '⚡', accent: 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20' },
  { type: 'bulb',     labelAr: 'مصباح',    labelFr: 'Ampoule',      icon: '💡', accent: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20' },
  { type: 'diode',    labelAr: 'صمام LED', labelFr: 'Diode LED',    icon: '🔺', accent: 'border-orange-500/50 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20' },
  { type: 'motor',    labelAr: 'محرك',     labelFr: 'Moteur',       icon: '⚙️', accent: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20' },
  { type: 'buzzer',   labelAr: 'جرس',      labelFr: 'Vibreur',      icon: '🔔', accent: 'border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20' },
  { type: 'resistor', labelAr: 'مقاومة',   labelFr: 'Résistance',   icon: '🟤', accent: 'border-rose-500/50 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' },
];

// ─────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────
export const CircuitBuilder: React.FC = () => {
  const [comps,       setComps]       = useState<CBComp[]>(DEFAULT_COMPS);
  const [wires,       setWires]       = useState<CBWire[]>(DEFAULT_WIRES);
  const [interaction, setInteraction] = useState<Interaction>({ type: 'idle' });
  const [hovered,     setHovered]     = useState<string | null>(null);
  const svgRef    = useRef<SVGSVGElement>(null);
  const idCounter = useRef(100);
  const wireCompleted = useRef(false); // flag to prevent cancel-on-pointerup

  const nextId = () => `e${idCounter.current++}`;

  // ─── Simulation ────────────────────────────────────
  const { powered, closed } = useMemo(() => simulate(comps, wires), [comps, wires]);

  // ─── Global mouse-move listener (for wire preview) ──
  useEffect(() => {
    if (interaction.type !== 'wiring') return;
    const onMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const { x, y } = toSVG(e, svgRef.current);
      setInteraction(prev => prev.type === 'wiring' ? { ...prev, px: x, py: y } : prev);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [interaction.type]);

  // ─── SVG pointer handlers ──────────────────────────

  const handleSVGPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (interaction.type !== 'dragging' || !svgRef.current) return;
    const { x, y } = toSVG(e, svgRef.current);
    setComps(prev => prev.map(c =>
      c.id === interaction.id
        ? { ...c, x: Math.max(HW + 4, Math.min(SVG_W - HW - 4, x - interaction.ox)),
                  y: Math.max(HH + 4, Math.min(SVG_H - HH - 4, y - interaction.oy)) }
        : c
    ));
  }, [interaction]);

  const handleSVGPointerUp = useCallback(() => {
    if (interaction.type === 'dragging') {
      setInteraction({ type: 'idle' });
      return;
    }
    if (interaction.type === 'wiring' && !wireCompleted.current) {
      setInteraction({ type: 'idle' });
    }
    wireCompleted.current = false;
  }, [interaction]);

  // ─── Component drag ────────────────────────────────
  const handleCompPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    if (interaction.type === 'wiring') return; // terminals take priority
    e.stopPropagation();
    if (!svgRef.current) return;
    const { x, y } = toSVG(e, svgRef.current);
    const comp = comps.find(c => c.id === id);
    if (!comp) return;
    setInteraction({ type: 'dragging', id, ox: x - comp.x, oy: y - comp.y });
    svgRef.current.setPointerCapture(e.pointerId);
  }, [interaction, comps]);

  // ─── Terminal click (wire draw / complete) ──────────
  const handleTerminalPointerDown = useCallback((e: React.PointerEvent, compId: string, t: 'A' | 'B') => {
    e.stopPropagation();
    if (!svgRef.current) return;
    const { x, y } = toSVG(e, svgRef.current);

    if (interaction.type === 'wiring') {
      // Prevent connecting terminal to itself
      if (interaction.fromId === compId && interaction.fromT === t) {
        setInteraction({ type: 'idle' });
        return;
      }
      // Prevent duplicate wires
      const dup = wires.some(w =>
        (w.from === interaction.fromId && w.fromT === interaction.fromT && w.to === compId && w.toT === t) ||
        (w.to === interaction.fromId && w.toT === interaction.fromT && w.from === compId && w.fromT === t)
      );
      if (!dup) {
        setWires(prev => [...prev, { id: nextId(), from: interaction.fromId, fromT: interaction.fromT, to: compId, toT: t }]);
      }
      wireCompleted.current = true;
      setInteraction({ type: 'idle' });
    } else {
      setInteraction({ type: 'wiring', fromId: compId, fromT: t, px: x, py: y });
    }
  }, [interaction, wires, nextId]);

  // ─── Component body click (toggle switch / reverse diode) ──
  const handleCompClick = useCallback((e: React.MouseEvent, id: string) => {
    if (interaction.type !== 'idle') return;
    const comp = comps.find(c => c.id === id);
    if (!comp) return;
    if (comp.type === 'switch') {
      setComps(prev => prev.map(c => c.id === id ? { ...c, switchOpen: !c.switchOpen } : c));
    } else if (comp.type === 'diode') {
      setComps(prev => prev.map(c => c.id === id ? { ...c, diodeReversed: !c.diodeReversed } : c));
    } else if (comp.type === 'resistor') {
      const vals: (10 | 100 | 1000)[] = [10, 100, 1000];
      const next = vals[(vals.indexOf(comp.resistorVal) + 1) % 3];
      setComps(prev => prev.map(c => c.id === id ? { ...c, resistorVal: next } : c));
    }
  }, [interaction, comps]);

  // ─── Add / Delete ───────────────────────────────────
  const handleAddComp = (type: CBType) => {
    const id = nextId();
    setComps(prev => [...prev, {
      id, type,
      x: 120 + Math.random() * 260,
      y: 80  + Math.random() * 140,
      switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5,
    }]);
  };

  const handleDeleteComp = useCallback((id: string) => {
    setComps(prev => prev.filter(c => c.id !== id));
    setWires(prev => prev.filter(w => w.from !== id && w.to !== id));
  }, []);

  const handleDeleteWire = useCallback((wireId: string) => {
    setWires(prev => prev.filter(w => w.id !== wireId));
  }, []);

  const handleReset = () => { setComps(DEFAULT_COMPS); setWires(DEFAULT_WIRES); setInteraction({ type: 'idle' }); };
  const handleClear = () => {
    setComps([{ id: 'bat0', type: 'battery', x: 250, y: 265, switchOpen: false, diodeReversed: false, resistorVal: 100, voltage: 4.5 }]);
    setWires([]);
    setInteraction({ type: 'idle' });
  };

  // ─────────────────────────────────────────────────────
  // SVG Component renderer
  // ─────────────────────────────────────────────────────
  const renderComp = (c: CBComp) => {
    const isPowered  = powered.has(c.id);
    const isHovered  = hovered === c.id;
    const isBattery  = c.type === 'battery';
    const isWiring   = interaction.type === 'wiring';
    const isSource   = isWiring && interaction.fromId === c.id;

    // Colors per type
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

    const icons: Record<CBType, string> = { battery: '🔋', switch: c.switchOpen ? '🔴' : '🟢', bulb: isPowered ? '💡' : '⚫', diode: '🔺', motor: '⚙️', buzzer: '🔔', resistor: '〰️' };
    const icon = icons[c.type];

    const tA = { x: -HW, y: 0 };
    const tB = { x: HW,  y: 0 };

    return (
      <g
        key={c.id}
        transform={`translate(${c.x},${c.y})`}
        onPointerDown={e => handleCompPointerDown(e as unknown as React.PointerEvent, c.id)}
        onClick={e => handleCompClick(e as unknown as React.MouseEvent, c.id)}
        onPointerEnter={() => setHovered(c.id)}
        onPointerLeave={() => setHovered(null)}
        style={{
          cursor: isBattery ? 'default' : isWiring ? 'crosshair' : 'grab',
          pointerEvents: 'auto',
        }}
      >
        {/* Power glow */}
        {isPowered && (
          <rect x={-HW - 7} y={-HH - 7} width={(HW + 7) * 2} height={(HH + 7) * 2} rx="18"
            fill="#fbbf24" opacity="0.18" />
        )}

        {/* Body */}
        <rect
          x={-HW} y={-HH} width={HW * 2} height={HH * 2} rx="9"
          fill={s.fill}
          stroke={s.stroke}
          strokeWidth={isHovered || isSource ? 2.5 : 1.5}
        />

        {/* Switch internal line */}
        {c.type === 'switch' && (
          <line
            x1={-HW + 8} y1="0" x2={c.switchOpen ? -4 : HW - 8} y2={c.switchOpen ? -10 : 0}
            stroke={c.switchOpen ? '#ef4444' : '#22c55e'} strokeWidth="3" strokeLinecap="round"
          />
        )}

        {/* Diode triangle symbol */}
        {c.type === 'diode' && (
          <g transform={c.diodeReversed ? 'scale(-1,1)' : ''}>
            <polygon points="-14,-12 -14,12 12,0" fill={isPowered ? '#f59e0b' : '#64748b'} stroke="#fef08a" strokeWidth="1" />
            <line x1="12" y1="-14" x2="12" y2="14" stroke="#fef08a" strokeWidth="3" />
          </g>
        )}

        {/* Resistor zigzag */}
        {c.type === 'resistor' && (
          <polyline
            points="-28,0 -20,-10 -12,10 -4,-10 4,10 12,-10 20,10 28,0"
            fill="none" stroke={isPowered ? '#fef08a' : '#94a3b8'} strokeWidth="2.5" strokeLinejoin="round"
          />
        )}

        {/* Bulb filament */}
        {c.type === 'bulb' && !isPowered && (
          <path d="M-10,8 L-5,-5 L0,5 L5,-5 L10,8" fill="none" stroke="#475569" strokeWidth="2" />
        )}
        {c.type === 'bulb' && isPowered && (
          <text x="0" y="7" textAnchor="middle" fontSize="16">💡</text>
        )}

        {/* Motor M label + spin */}
        {c.type === 'motor' && (
          <>
            <text x="0" y="5" textAnchor="middle" fontSize="13" fill="#ffffff" fontWeight="900">M</text>
            {isPowered && (
              <g style={{ transformOrigin: '0 0', animation: 'spin 0.6s linear infinite' }}>
                <line x1="-16" y1="-4" x2="16" y2="-4" stroke="#fef08a" strokeWidth="2.5" />
              </g>
            )}
          </>
        )}

        {/* Buzzer text */}
        {c.type === 'buzzer' && (
          <text x="0" y="6" textAnchor="middle" fontSize="14">🔔</text>
        )}

        {/* Label below */}
        {c.type !== 'bulb' && c.type !== 'motor' && c.type !== 'buzzer' && c.type !== 'diode' && c.type !== 'switch' && c.type !== 'resistor' && (
          <text x="0" y="5" textAnchor="middle" fontSize="11" fill="#e2e8f0" fontWeight="700">{icon}</text>
        )}

        {/* Sub-label */}
        <text x="0" y={HH + 12} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="700">{s.label}</text>

        {/* Battery polarity */}
        {isBattery && (
          <>
            <text x={-HW - 10} y="5" textAnchor="middle" fontSize="14" fill="#ef4444" fontWeight="900">−</text>
            <text x={ HW + 10} y="5" textAnchor="middle" fontSize="14" fill="#22c55e" fontWeight="900">+</text>
            <text x="0" y="5" textAnchor="middle" fontSize="11" fill="#e2e8f0" fontWeight="800">🔋 {c.voltage}V</text>
          </>
        )}

        {/* Terminal A */}
        <circle
          cx={tA.x} cy={tA.y} r={6}
          fill={isSource && interaction.fromT === 'A' ? '#fbbf24' : '#1e293b'}
          stroke={isWiring ? '#fbbf24' : '#64748b'} strokeWidth="2"
          style={{ cursor: 'crosshair', pointerEvents: 'auto' }}
          onPointerDown={e => {
            e.stopPropagation();
            handleTerminalPointerDown(e as unknown as React.PointerEvent, c.id, 'A');
          }}
        />
        {/* Terminal B */}
        <circle
          cx={tB.x} cy={tB.y} r={6}
          fill={isSource && interaction.fromT === 'B' ? '#fbbf24' : '#1e293b'}
          stroke={isWiring ? '#fbbf24' : '#64748b'} strokeWidth="2"
          style={{ cursor: 'crosshair', pointerEvents: 'auto' }}
          onPointerDown={e => {
            e.stopPropagation();
            handleTerminalPointerDown(e as unknown as React.PointerEvent, c.id, 'B');
          }}
        />

        {/* Delete × (hover, not battery) */}
        {isHovered && !isBattery && interaction.type === 'idle' && (
          <g
            transform={`translate(${HW - 8},${-HH - 8})`}
            onClick={e => { (e as unknown as React.MouseEvent).stopPropagation(); handleDeleteComp(c.id); }}
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
            <circle r="9" fill="#ef4444" stroke="#fecaca" strokeWidth="1" />
            <text y="4" textAnchor="middle" fontSize="11" fill="white" fontWeight="900">×</text>
          </g>
        )}
      </g>
    );
  };

  // ─────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────
  const poweredList = comps
    .filter(c => powered.has(c.id))
    .map(c => PALETTE.find(p => p.type === c.type)?.labelAr ?? c.type);

  return (
    <div className="space-y-3" dir="rtl">
      {/* Status banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={closed ? 'closed' : 'open'}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className={`p-3 rounded-2xl border text-xs font-bold flex items-start gap-2.5 ${
            closed
              ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-200'
              : 'bg-amber-950/80  border-amber-700/60  text-amber-200'
          }`}
        >
          {closed
            ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            : <XCircle       className="w-4 h-4 text-amber-400    shrink-0 mt-0.5" />}
          <div>
            {closed
              ? <>✅ الدارة مغلقة — التيار يمر عبر: <strong>{poweredList.join(' ← ')}</strong></>
              : <>⚠️ الدارة غير مكتملة — تحقق من الوصلات، القاطعة، أو الصمام الثنائي</>}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

        {/* ── Palette ─────────────────────────────────────── */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">أضف عنصراً إلى الدارة:</span>

          <div className="space-y-1.5">
            {PALETTE.map(p => (
              <motion.button
                key={p.type}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleAddComp(p.type)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${p.accent}`}
              >
                <span className="text-sm">{p.icon}</span>
                <div className="text-right leading-tight">
                  <div>{p.labelAr}</div>
                  <div className="text-[9px] opacity-60 font-mono">{p.labelFr}</div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="pt-1 border-t border-slate-800 space-y-1.5">
            <button
              type="button" onClick={handleReset}
              className="w-full flex items-center gap-2 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> الدارة الافتراضية
            </button>
            <button
              type="button" onClick={handleClear}
              className="w-full flex items-center gap-2 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> مسح الكل
            </button>
          </div>

          {/* Usage guide */}
          <div className="bg-slate-950 rounded-xl p-2.5 text-[9px] text-slate-400 space-y-1 border border-slate-800/80 leading-relaxed">
            <p className="font-black text-slate-300 text-[10px] mb-1.5">📖 كيفية الاستخدام:</p>
            <p>🖱️ <strong className="text-slate-300">سحب</strong> العناصر لإعادة تموضعها</p>
            <p>🔴 <strong className="text-slate-300">انقر طرفاً</strong> ثم طرفاً آخر لتوصيلهما</p>
            <p>✂️ <strong className="text-slate-300">انقر السلك</strong> لحذفه</p>
            <p>❌ <strong className="text-slate-300">× الحمراء</strong> لحذف عنصر</p>
            <p>⚡ <strong className="text-slate-300">انقر القاطعة</strong> لفتح/إغلاق</p>
            <p>🔺 <strong className="text-slate-300">انقر الصمام</strong> لعكس القطبية</p>
            <p>🟤 <strong className="text-slate-300">انقر المقاومة</strong> لتغيير قيمتها</p>
          </div>
        </div>

        {/* ── SVG Canvas ──────────────────────────────────── */}
        <div className="lg:col-span-9">
          <div
            className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden"
            style={{ aspectRatio: `${SVG_W} / ${SVG_H}` }}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              style={{ width: '100%', height: '100%', touchAction: 'none', display: 'block' }}
              onPointerMove={handleSVGPointerMove}
              onPointerUp={handleSVGPointerUp}
              onPointerLeave={() => {
                if (interaction.type === 'dragging') setInteraction({ type: 'idle' });
              }}
            >
              <defs>
                <pattern id="cb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.6" />
                </pattern>
                <filter id="cb-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background grid */}
              <rect width={SVG_W} height={SVG_H} fill="url(#cb-grid)" />

              {/* ── Wires ─────────────────────────────────── */}
              {wires.map(w => {
                const fc = comps.find(c => c.id === w.from);
                const tc = comps.find(c => c.id === w.to);
                if (!fc || !tc) return null;
                const p1 = termPos(fc, w.fromT);
                const p2 = termPos(tc, w.toT);
                const isLive = closed && (powered.has(w.from) || powered.has(w.to));
                const d = wirePath(p1, p2);
                return (
                  <g key={w.id} onClick={() => handleDeleteWire(w.id)} style={{ cursor: 'pointer' }}>
                    {/* Invisible wide hit area */}
                    <path d={d} fill="none" stroke="transparent" strokeWidth="14" />
                    {/* Wire */}
                    <path d={d} fill="none"
                      stroke={isLive ? '#eab308' : '#334155'}
                      strokeWidth={isLive ? 3.5 : 2.5}
                      strokeLinecap="round" />
                    {/* Current flow animation */}
                    {isLive && (
                      <path d={d} fill="none"
                        stroke="#fef08a" strokeWidth="3"
                        strokeDasharray="6 12" strokeLinecap="round"
                        className="animate-[dash_1.2s_linear_infinite]" />
                    )}
                  </g>
                );
              })}

              {/* ── Components ────────────────────────────── */}
              {comps.map(c => renderComp(c))}

              {/* ── Preview wire while drawing ────────────── */}
              {interaction.type === 'wiring' && (() => {
                const fc = comps.find(c => c.id === interaction.fromId);
                if (!fc) return null;
                const p1 = termPos(fc, interaction.fromT);
                return (
                  <path
                    d={`M ${p1.x} ${p1.y} L ${interaction.px} ${interaction.py}`}
                    fill="none" stroke="#fbbf24" strokeWidth="2.5"
                    strokeDasharray="7 5" opacity="0.85"
                    style={{ pointerEvents: 'none' }}
                  />
                );
              })()}
            </svg>
          </div>

          {/* Hint bar */}
          <div className="mt-1.5 text-center text-[9px] text-slate-500 font-bold">
            {interaction.type === 'wiring'
              ? '⚡ انقر على طرف آخر (دائرة) لإتمام الوصلة — أو انقر مكاناً فارغاً للإلغاء'
              : '👆 اسحب العناصر • انقر الأطراف لتوصيلها • انقر السلك لحذفه • انقر العنصر لتغيير حالته'}
          </div>
        </div>
      </div>
    </div>
  );
};
