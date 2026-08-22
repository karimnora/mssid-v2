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
      // Short pause for the last match's own green flash — PreschoolActivityPlayer's celebration
      // overlay adds its own (longer) pause before advancing, so this no longer needs to.
      if (next.length === pairs.length) setTimeout(onComplete, 350);
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

  const titles = activity.visualAssets.connectColumnTitles;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-sm font-bold text-slate-600 text-center px-3 leading-relaxed">
        {titles
          ? t(
              `اِلْمَسْ «${titles.left.ar}» أَوَّلًا، ثُمَّ «${titles.right.ar}»`,
              `Touche d’abord « ${titles.left.fr} », puis « ${titles.right.fr} »`,
              `First tap “${titles.left.en}”, then “${titles.right.en}”`,
            )
          : t(
              'اِلْمِسْ أَوِ اسْحَبْ خَطًّا لِلرَّبْط',
              'Touche, ou glisse un trait pour relier',
              'Tap, or drag a line to connect',
            )}
      </p>

      {/* dir="ltr" is intentional and independent of `language`: without it, dir="rtl" would flip
          which physical side the `pairs` vs `shuffledRight` columns render on (flex row-start moves
          to the right), even though nothing in the matching logic depends on reading direction —
          matches are found by literal node position, not by "left means source". Keeping the board
          itself ltr keeps the two columns in a stable physical spot across all 3 languages; only the
          instruction text above should follow `language`, which is why it goes through `t()`. */}
      <div ref={boardRef} dir="ltr" className="relative flex items-start justify-center gap-10 sm:gap-14 w-full max-w-md px-2">
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

        <div className="relative z-10 flex flex-col gap-3 items-center">
          {titles && (
            <p className="text-[11px] font-black text-amber-700 uppercase tracking-wide">{titles.left[language]}</p>
          )}
          {pairs.map((pair) => (
            <PairNode
              key={`L-${pair.id}`}
              nodeKey={`left-${pair.id}`}
              nodeRefs={nodeRefs}
              glyph={localizePicture(pair.leftAsset, language)}
              caption={pair.leftLabel?.[language]}
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

        <div className="relative z-10 flex flex-col gap-3 items-center">
          {titles && (
            <p className="text-[11px] font-black text-sky-700 uppercase tracking-wide">{titles.right[language]}</p>
          )}
          {shuffledRight.map((pair) => (
            <PairNode
              key={`R-${pair.id}`}
              nodeKey={`right-${pair.id}`}
              nodeRefs={nodeRefs}
              glyph={localizeGlyph(pair.rightAsset, language)}
              caption={pair.rightLabel?.[language]}
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
  caption?: string;
  matched: boolean;
  selected: boolean;
  wrong: boolean;
  accent: 'amber' | 'sky';
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => void;
}> = ({
  nodeKey, nodeRefs, glyph, caption, matched, selected, wrong, accent,
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
      whileHover={!matched ? { scale: 1.05 } : undefined}
      whileTap={!matched ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      animate={wrong ? { x: [0, -8, 8, -8, 0] } : { x: 0 }}
      disabled={matched}
      className={`relative min-h-[5.5rem] min-w-[5.5rem] w-[5.5rem] rounded-3xl flex flex-col items-center justify-center gap-0.5 px-1 py-2
                  shadow-md border-4 cursor-pointer select-none touch-none
                  ${matched
                    ? 'bg-emerald-100 border-emerald-500'
                    : selected
                      ? 'bg-amber-200 border-amber-500'
                      : `bg-white ${idleBorder}`}`}
    >
      <span className="text-4xl leading-none">{glyph}</span>
      {caption && (
        <span className="text-[10px] font-black text-slate-700 leading-tight text-center">{caption}</span>
      )}
      {matched && <span className="absolute -top-1 -end-1 text-base">✅</span>}
    </motion.button>
  );
};
