import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { MazeRound, MemoryRound, OrderRound, SortRound } from '../../../data/games/types';
import { mazeNeighbours } from '../../../data/games';
import { DidouPortrait } from '../../world/DidouPortrait';
import { playPop } from '../../../utils/immersiveFeedback';

/**
 * What a board tells the player:
 * - hit: a right move (optional line for Didou),
 * - nudge: a hint that is not a mistake (memory: two unknown cards; maze: a stone too far),
 * - miss: a real mistake, with its own explanation (first one of the round goes to the notebook),
 * - solved: the round is finished.
 */
export type BoardMove = { kind: 'hit'; sayAr?: string } | { kind: 'nudge'; sayAr: string } | { kind: 'miss'; whyAr: string } | { kind: 'solved' };

export interface BoardProps<R> {
  round: R;
  /** From the second miss of the round on: boards may show extra help (dates on the timeline…). */
  assist: boolean;
  onMove: (move: BoardMove) => void;
}

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const shake = { x: [0, -9, 9, -5, 0] };

/** « 3/4 » drawn as a stacked fraction, numbers kept left-to-right inside Arabic text. */
export function GameText({ text }: { text: string }) {
  const fraction = /^(\d+)\/(\d+)$/.exec(text.trim());
  if (fraction) {
    return (
      <span className="lg-frac" dir="ltr" aria-label={`${fraction[1]}/${fraction[2]}`}>
        <span aria-hidden="true">{fraction[1]}</span>
        <span className="lg-frac-bar" aria-hidden="true" />
        <span aria-hidden="true">{fraction[2]}</span>
      </span>
    );
  }
  if (/^[\d\s,.%]+$/.test(text)) return <span dir="ltr" className="lg-num">{text}</span>;
  return <>{text}</>;
}

// ——————————————————— Memory ———————————————————

interface MemoryCard { key: string; pair: string; text: string }

export function MemoryBoard({ round, onMove }: BoardProps<MemoryRound>) {
  const cards = useMemo<MemoryCard[]>(
    () => shuffle(round.pairs.flatMap((p) => [{ key: `${p.id}-a`, pair: p.id, text: p.a }, { key: `${p.id}-b`, pair: p.id, text: p.b }])),
    [round],
  );
  const [up, setUp] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const seen = useRef(new Set<string>());
  const matchedCount = useRef(0);
  const busy = useRef(false);

  const flip = (card: MemoryCard) => {
    if (busy.current || up.includes(card.key) || matched.includes(card.pair)) return;
    playPop();
    const next = [...up, card.key];
    setUp(next);
    if (next.length < 2) return;
    busy.current = true;
    const [a, b] = next.map((k) => cards.find((c) => c.key === k)!);
    // A real mistake only when both cards had already been seen: the child could have known.
    const knew = seen.current.has(a.key) && seen.current.has(b.key);
    seen.current.add(a.key).add(b.key);
    if (a.pair === b.pair) {
      const pair = round.pairs.find((p) => p.id === a.pair)!;
      window.setTimeout(() => {
        setMatched((m) => [...m, a.pair]);
        setUp([]);
        busy.current = false;
        matchedCount.current += 1;
        onMove({ kind: 'hit', sayAr: pair.linkAr });
        if (matchedCount.current === round.pairs.length) window.setTimeout(() => onMove({ kind: 'solved' }), 900);
      }, 450);
      return;
    }
    const pa = round.pairs.find((p) => p.id === a.pair)!;
    const pb = round.pairs.find((p) => p.id === b.pair)!;
    const why = `«${a.text}» تُسَاوِي ${pa.valueAr}، وَ«${b.text}» تُسَاوِي ${pb.valueAr}: لَيْسَتَا تَوْأَمَيْنِ.`;
    setWrongPair([a.key, b.key]);
    window.setTimeout(() => {
      setUp([]);
      setWrongPair([]);
      busy.current = false;
      onMove(knew ? { kind: 'miss', whyAr: why } : { kind: 'nudge', sayAr: `${why} تَذَكَّرْ مَكَانَهُمَا!` });
    }, 1100);
  };

  return (
    <div className={`lg-memory ${cards.length > 12 ? 'cols-4' : 'cols-3'}`} data-lg-board="memory">
      {cards.map((card, i) => {
        const isMatched = matched.includes(card.pair);
        const faceUp = isMatched || up.includes(card.key);
        return (
          <motion.button
            key={card.key}
            type="button"
            data-lg-card={card.key}
            data-pair={card.pair}
            data-state={isMatched ? 'matched' : faceUp ? 'up' : 'down'}
            onClick={() => flip(card)}
            animate={wrongPair.includes(card.key) ? shake : isMatched ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="lg-mcard"
            aria-label={faceUp ? card.text : `بِطَاقَةٌ مَقْلُوبَةٌ ${i + 1}`}
            disabled={isMatched}
          >
            <span className={`lg-mcard-inner ${faceUp ? 'is-up' : ''}`}>
              <span className="lg-mcard-back" aria-hidden="true">🦊</span>
              <span className={`lg-mcard-front ${isMatched ? 'is-matched' : ''}`}><GameText text={card.text} /></span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ——————————————————— Sort ———————————————————

export function SortBoard({ round, onMove }: BoardProps<SortRound>) {
  const cards = useMemo(() => shuffle(round.cards), [round]);
  const [picked, setPicked] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState<string | null>(null);
  const [glowBin, setGlowBin] = useState<string | null>(null);

  const drop = (binId: string) => {
    const card = round.cards.find((c) => c.id === picked);
    if (!card) return;
    if (card.bin !== binId) {
      setShaking(card.id);
      onMove({ kind: 'miss', whyAr: card.whyAr });
      return;
    }
    const next = { ...placed, [card.id]: binId };
    setPlaced(next);
    setPicked(null);
    setGlowBin(binId);
    window.setTimeout(() => setGlowBin(null), 500);
    onMove({ kind: 'hit' });
    if (Object.keys(next).length === round.cards.length) window.setTimeout(() => onMove({ kind: 'solved' }), 500);
  };

  return (
    <div className="space-y-4" data-lg-board="sort">
      <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
        {cards.filter((c) => !placed[c.id]).map((card) => (
          <motion.button
            key={card.id}
            type="button"
            data-lg-sort-card={card.id}
            onClick={() => { playPop(); setPicked(card.id); }}
            animate={shaking === card.id ? shake : picked === card.id ? { y: -8, scale: 1.06 } : { y: 0, scale: 1 }}
            onAnimationComplete={() => shaking === card.id && setShaking(null)}
            className={`lg-chip ${picked === card.id ? 'picked' : ''}`}
            aria-pressed={picked === card.id}
          >
            {card.textAr}
          </motion.button>
        ))}
      </div>
      <div className={`grid gap-2 ${round.bins.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {round.bins.map((bin) => (
          <motion.button
            key={bin.id}
            type="button"
            data-lg-bin={bin.id}
            onClick={() => drop(bin.id)}
            disabled={!picked}
            animate={glowBin === bin.id ? { scale: [1, 1.06, 1] } : {}}
            className={`lg-shelf ${picked ? 'ready' : ''}`}
          >
            <span className="lg-shelf-label">{bin.labelAr}</span>
            <span className="lg-shelf-books">
              {round.cards.filter((c) => placed[c.id] === bin.id).map((c) => (
                <motion.span key={c.id} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg-book">{c.textAr}</motion.span>
              ))}
            </span>
          </motion.button>
        ))}
      </div>
      <p className="text-xs font-extrabold text-center text-slate-600 min-h-[18px]">
        {picked ? 'اُنْقُرِ الرَّفَّ المُنَاسِبَ' : 'اُنْقُرْ بِطَاقَةً'}
      </p>
    </div>
  );
}

// ——————————————————— Order ———————————————————

export function OrderBoard({ round, assist, onMove }: BoardProps<OrderRound>) {
  const pool = useMemo(() => shuffle(round.cards), [round]);
  const sorted = useMemo(() => [...round.cards].sort((a, b) => a.rank - b.rank), [round]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [shaking, setShaking] = useState<string | null>(null);

  const tap = (cardId: string) => {
    const card = round.cards.find((c) => c.id === cardId)!;
    const expected = sorted[placed.length];
    if (card.rank !== expected.rank) {
      setShaking(card.id);
      onMove({ kind: 'miss', whyAr: round.wrongAr.replace('{card}', card.textAr).replace('{key}', card.keyAr) });
      return;
    }
    const next = [...placed, card.id];
    setPlaced(next);
    onMove({ kind: 'hit' });
    if (next.length === round.cards.length) window.setTimeout(() => onMove({ kind: 'solved' }), 600);
  };

  return (
    <div className="space-y-4" data-lg-board="order">
      <p className="lg-direction">⟵ {round.directionAr}</p>
      <ol className="lg-timeline" aria-label={round.directionAr}>
        {sorted.map((_, i) => {
          const card = placed[i] ? round.cards.find((c) => c.id === placed[i]) : undefined;
          return (
            <li key={i} className={`lg-slot ${card ? 'filled' : i === placed.length ? 'next' : ''}`} data-lg-slot={i}>
              <span className="lg-slot-n">{i + 1}</span>
              {card && (
                <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className="lg-slot-card">
                  <span className="text-2xl" aria-hidden="true">{card.emoji}</span>
                  <span className="lg-slot-text">{card.textAr}</span>
                  <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="lg-date">{card.keyAr}</motion.span>
                </motion.span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="grid gap-2 sm:grid-cols-2">
        {pool.filter((c) => !placed.includes(c.id)).map((card) => (
          <motion.button
            key={card.id}
            type="button"
            data-lg-order-card={card.id}
            onClick={() => tap(card.id)}
            animate={shaking === card.id ? shake : {}}
            onAnimationComplete={() => shaking === card.id && setShaking(null)}
            className="lg-event"
          >
            <span className="text-3xl" aria-hidden="true">{card.emoji}</span>
            <span className="flex-1 text-start">{card.textAr}</span>
            {assist && <span className="lg-date small">{card.keyAr}</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ——————————————————— Maze ———————————————————

const cellKey = (r: number, c: number) => `${r},${c}`;

export function MazeBoard({ round, onMove }: BoardProps<MazeRound>) {
  const grid = round.grid;
  const goal: [number, number] = [grid.length - 1, grid[grid.length - 1].length - 1];
  const [trail, setTrail] = useState<string[]>([cellKey(0, 0)]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [shaking, setShaking] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [r0, c0] = trail[trail.length - 1].split(',').map(Number);
  const reachable = new Set(mazeNeighbours(grid, r0, c0).map(([y, x]) => cellKey(y, x)));

  const tap = (r: number, c: number) => {
    if (done) return;
    const key = cellKey(r, c);
    const back = trail.indexOf(key);
    if (back !== -1) {
      if (back !== trail.length - 1) setTrail(trail.slice(0, back + 1));
      return;
    }
    if (!reachable.has(key)) {
      onMove({ kind: 'nudge', sayAr: 'اُنْقُرْ حَجَراً مُلَاصِقاً لِدِيدُو: أَمَامَهُ أَوْ خَلْفَهُ أَوْ عَلَى جَانِبَيْهِ.' });
      return;
    }
    const cell = grid[r][c];
    if (!cell.ok) {
      setShaking(key);
      if (!wrong.includes(key)) setWrong([...wrong, key]);
      onMove({ kind: 'miss', whyAr: cell.whyAr ?? round.hintAr });
      return;
    }
    setTrail([...trail, key]);
    onMove({ kind: 'hit' });
    if (r === goal[0] && c === goal[1]) {
      setDone(true);
      window.setTimeout(() => onMove({ kind: 'solved' }), 700);
    }
  };

  return (
    <div className="space-y-3" data-lg-board="maze">
      <p className="lg-rule">📜 {round.ruleAr}</p>
      <div className="lg-maze" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = cellKey(r, c);
            const here = key === trail[trail.length - 1];
            const onTrail = trail.includes(key);
            const isGoal = r === goal[0] && c === goal[1];
            const state = here ? 'here' : onTrail ? 'trail' : wrong.includes(key) ? 'cracked' : reachable.has(key) && !done ? 'reachable' : 'idle';
            return (
              <motion.button
                key={key}
                type="button"
                data-lg-cell={key}
                data-state={state}
                onClick={() => tap(r, c)}
                animate={shaking === key ? shake : here ? { scale: [1, 1.08, 1] } : {}}
                onAnimationComplete={() => shaking === key && setShaking(null)}
                className="lg-stone"
                aria-label={`${cell.t}${here ? ' — دِيدُو هُنَا' : ''}${isGoal ? ' — الكَنْزُ' : ''}`}
              >
                {here ? (
                  <motion.span layoutId={`didou-${round.id}`} className="lg-stone-didou"><DidouPortrait size={40} /></motion.span>
                ) : (
                  <span className="lg-stone-text"><GameText text={cell.t} /></span>
                )}
                {isGoal && !here && <span className="lg-stone-goal" aria-hidden="true">💎</span>}
              </motion.button>
            );
          }),
        )}
      </div>
    </div>
  );
}
