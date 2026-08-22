import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';
import { localizeGlyph, localizePicture } from './preschoolGlyphs';

interface PreschoolConnectDotsProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}

type Side = 'left' | 'right';
interface NodeSel { side: Side; id: string }
interface Pt { x: number; y: number }

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const PreschoolConnectDots: React.FC<PreschoolConnectDotsProps> = ({ activity, language, onComplete }) => {
  const pairs = activity.visualAssets.connectPairs || [];
  const shuffledRight = useMemo(() => shuffle(pairs), [activity.id]);

  const [selected, setSelected] = useState<NodeSel | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPulseId, setWrongPulseId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<Pt | null>(null);
  const [lineTick, setLineTick] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dragStart = useRef<{ sel: NodeSel; x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const prevSelected = useRef<NodeSel | null>(null);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  useEffect(() => {
    setSelected(null);
    setMatchedIds([]);
    setWrongPulseId(null);
    setDragPos(null);
  }, [activity.id]);

  useLayoutEffect(() => {
    setLineTick((n) => n + 1);
  }, [matchedIds, dragPos, shuffledRight]);

  useEffect(() => {
    const onResize = () => setLineTick((n) => n + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toBoard = (clientX: number, clientY: number): Pt => {
    const board = boardRef.current!.getBoundingClientRect();
    return { x: clientX - board.left, y: clientY - board.top };
  };

  const centerOf = (side: Side, id: string): Pt | null => {
    const el = nodeRefs.current[`${side}-${id}`];
    const board = boardRef.current;
    if (!el || !board) return null;
    const r = el.getBoundingClientRect();
    const b = board.getBoundingClientRect();
    return { x: r.left + r.width / 2 - b.left, y: r.top + r.height / 2 - b.top };
  };

  const findNodeAt = (clientX: number, clientY: number, side: Side): string | null => {
    const ids = side === 'left' ? pairs.map((p) => p.id) : shuffledRight.map((p) => p.id);
    for (const id of ids) {
      if (matchedIds.includes(id)) continue;
      const el = nodeRefs.current[`${side}-${id}`];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const pad = 14;
      if (clientX >= r.left - pad && clientX <= r.right + pad && clientY >= r.top - pad && clientY <= r.bottom + pad) {
        return id;
      }
    }
    return null;
  };

  const tryMatch = (idA: string, idB: string) => {
    if (matchedIds.includes(idA) || matchedIds.includes(idB)) return;
    if (idA === idB) {
      const next = [...matchedIds, idA];
      setMatchedIds(next);
      setSelected(null);
      playSuccessChime();
      if (next.length === pairs.length) setTimeout(onComplete, 900);
    } else {
      setWrongPulseId(idB);
      playGentleNudge();
      setTimeout(() => {
        setWrongPulseId(null);
        setSelected(null);
      }, 450);
    }
  };

  const onNodePointerDown = (e: React.PointerEvent, sel: NodeSel) => {
    if (matchedIds.includes(sel.id)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    prevSelected.current = selected;
    dragStart.current = { sel, x: e.clientX, y: e.clientY };
    dragging.current = false;
    setSelected(sel);
  };

  const onNodePointerMove = (e: React.PointerEvent) => {
    const start = dragStart.current;
    if (!start) return;
    const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    if (dist > 10) {
      dragging.current = true;
      setDragPos(toBoard(e.clientX, e.clientY));
    }
  };

  const onNodePointerUp = (e: React.PointerEvent, sel: NodeSel) => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;

    if (dragging.current) {
      dragging.current = false;
      setDragPos(null);
      const opposite: Side = start.sel.side === 'left' ? 'right' : 'left';
      const hit = findNodeAt(e.clientX, e.clientY, opposite);
      if (hit) tryMatch(start.sel.id, hit);
      return;
    }

    const prev = prevSelected.current;
    if (prev && prev.side !== sel.side) {
      tryMatch(prev.id, sel.id);
    }
  };

  const dragOrigin = selected && dragPos ? centerOf(selected.side, selected.id) : null;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-xs sm:text-sm font-bold text-slate-500 text-center px-2">
        {t(
          'اِلْمِسْ أَوِ اسْحَبْ خَطًّا لِلرَّبْط',
          'Touche, ou glisse un trait pour relier',
          'Tap, or drag a line to connect',
        )}
      </p>

      <div ref={boardRef} className="relative flex items-start justify-center gap-12 sm:gap-16 w-full max-w-sm px-2">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          aria-hidden
        >
          {matchedIds.map((id) => {
            const a = centerOf('left', id);
            const b = centerOf('right', id);
            if (!a || !b) return null;
            return (
              <line
                key={`${id}-${lineTick}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="#22c55e"
                strokeWidth={7}
                strokeLinecap="round"
              />
            );
          })}
          {dragOrigin && dragPos && (
            <line
              x1={dragOrigin.x} y1={dragOrigin.y} x2={dragPos.x} y2={dragPos.y}
              stroke="#f59e0b"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray="10 8"
            />
          )}
        </svg>

        <div className="relative z-10 flex flex-col gap-3">
          {pairs.map((pair) => (
            <PairNode
              key={`L-${pair.id}`}
              nodeKey={`left-${pair.id}`}
              nodeRefs={nodeRefs}
              glyph={localizePicture(pair.leftAsset, language)}
              matched={matchedIds.includes(pair.id)}
              selected={selected?.side === 'left' && selected.id === pair.id}
              wrong={false}
              accent="amber"
              onPointerDown={(e) => onNodePointerDown(e, { side: 'left', id: pair.id })}
              onPointerMove={onNodePointerMove}
              onPointerUp={(e) => onNodePointerUp(e, { side: 'left', id: pair.id })}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          {shuffledRight.map((pair) => (
            <PairNode
              key={`R-${pair.id}`}
              nodeKey={`right-${pair.id}`}
              nodeRefs={nodeRefs}
              glyph={localizeGlyph(pair.rightAsset, language)}
              matched={matchedIds.includes(pair.id)}
              selected={selected?.side === 'right' && selected.id === pair.id}
              wrong={wrongPulseId === pair.id}
              accent="sky"
              onPointerDown={(e) => onNodePointerDown(e, { side: 'right', id: pair.id })}
              onPointerMove={onNodePointerMove}
              onPointerUp={(e) => onNodePointerUp(e, { side: 'right', id: pair.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PairNode: React.FC<{
  nodeKey: string;
  nodeRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  glyph: string;
  matched: boolean;
  selected: boolean;
  wrong: boolean;
  accent: 'amber' | 'sky';
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => void;
}> = ({
  nodeKey, nodeRefs, glyph, matched, selected, wrong, accent,
  onPointerDown, onPointerMove, onPointerUp,
}) => {
  const idleBorder = accent === 'amber' ? 'border-amber-200' : 'border-sky-200';
  return (
    <motion.button
      ref={(el) => { nodeRefs.current[nodeKey] = el; }}
      type="button"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      whileTap={!matched ? { scale: 0.92 } : undefined}
      animate={wrong ? { x: [0, -8, 8, -8, 0] } : { x: 0 }}
      disabled={matched}
      className={`relative min-h-20 min-w-20 w-20 h-20 rounded-2xl text-4xl flex items-center justify-center
                  shadow-md border-4 cursor-pointer select-none touch-none
                  ${matched
                    ? 'bg-emerald-100 border-emerald-500'
                    : selected
                      ? 'bg-amber-200 border-amber-500'
                      : `bg-white ${idleBorder}`}`}
    >
      <span className="font-black text-slate-800">{glyph}</span>
      {matched && <span className="absolute -top-1 -end-1 text-base">✅</span>}
    </motion.button>
  );
};
