import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MazeRound, MemoryRound, OrderRound, SortRound } from '../../../data/games/types';
import { mazeNeighbours } from '../../../data/games';
import { DidouPortrait } from '../../world/DidouPortrait';
import { playPop } from '../../../utils/immersiveFeedback';
import { speakText } from '../../../utils/speech';

/**
 * What a board tells the player:
 * - hit: a right move (optional line for Didou),
 * - nudge: a hint that is not a mistake (memory: two unknown cards; maze: a stone too far),
 * - miss: a real mistake, with its own explanation (first one of the level goes to the notebook),
 * - solved: the level is finished.
 *
 * Every board is drawn in 3D (perspective, thick tiles with a lit top and a dark edge) and pieces
 * fly to where they belong (shared `layoutId`), so each right move is seen, not only heard.
 */
export type BoardMove = { kind: 'hit'; sayAr?: string } | { kind: 'nudge'; sayAr: string } | { kind: 'miss'; whyAr: string } | { kind: 'solved' };

export interface BoardProps<R> {
  round: R;
  /** Warm-up level, or from the second miss of the level on: boards show extra help (dates…). */
  assist: boolean;
  onMove: (move: BoardMove) => void;
  /** Young readers: every card or stone is read aloud when tapped (see `GamePack.young`). */
  young?: boolean;
}

const PICTURES = /[\p{Extended_Pictographic}\u200d\uFE0F]/gu;

/** Reads a card aloud without its pictures (speech engines would spell the emoji names). */
export function readCard(text: string) {
  const words = text.replace(PICTURES, '').trim();
  if (!words) return;
  try {
    void speakText(words, 'ar-SA').catch(() => undefined);
  } catch {
    /* no speech engine */
  }
}

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const SHAKE = [0, -10, 10, -6, 6, 0];
const springy = { type: 'spring' as const, stiffness: 320, damping: 22 };
const flight = { type: 'spring' as const, stiffness: 260, damping: 24 };

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
  // Numbers and little sums (« 3 × 4 », « 38 + 12 ») stay left-to-right inside Arabic text.
  if (/^[\d\s,.%×+\-−=÷]+$/.test(text)) return <span dir="ltr" className="lg-num">{text}</span>;
  // « 🦆 بَطَّةٌ »: the picture drawn big, above its word.
  const picture = /^([\p{Extended_Pictographic}\u200d\uFE0F]+)\s+(.+)$/u.exec(text.trim());
  if (picture) {
    return (
      <span className="lg-pic">
        <span className="lg-pic-emoji" aria-hidden="true">{picture[1]}</span>
        <span className="lg-pic-word">{picture[2]}</span>
      </span>
    );
  }
  return <>{text}</>;
}

/** « 4 / 9 » under a board: how much of the level is done. */
function BoardProgress({ done, total }: { done: number; total: number }) {
  return (
    <div className="lg-progress" aria-label={`${done} / ${total}`}>
      <motion.span className="lg-progress-fill" initial={false} animate={{ width: `${(done / total) * 100}%` }} transition={springy} />
      <span className="lg-progress-text" dir="ltr">{done} / {total}</span>
    </div>
  );
}

// ——————————————————— Memory ———————————————————

interface MemoryCard { key: string; pair: string; text: string }

export const PEEK_MS = 3000;

export function MemoryBoard({ round, onMove, young }: BoardProps<MemoryRound>) {
  const cards = useMemo<MemoryCard[]>(
    () => shuffle(round.pairs.flatMap((p) => [{ key: `${p.id}-a`, pair: p.id, text: p.a }, { key: `${p.id}-b`, pair: p.id, text: p.b }])),
    [round],
  );
  const [up, setUp] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  // Warm-up level: every card is shown face up for a few seconds first.
  const [peek, setPeek] = useState(Boolean(round.easy));
  const seen = useRef(new Set<string>());
  const matchedCount = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    if (!round.easy) return undefined;
    const timer = window.setTimeout(() => setPeek(false), PEEK_MS);
    return () => window.clearTimeout(timer);
  }, [round]);

  const flip = (card: MemoryCard) => {
    if (peek || busy.current || up.includes(card.key) || matched.includes(card.pair)) return;
    playPop();
    if (young) readCard(card.text);
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
      }, 420);
      return;
    }
    const pa = round.pairs.find((p) => p.id === a.pair)!;
    const pb = round.pairs.find((p) => p.id === b.pair)!;
    const why = (round.mismatchAr ?? '«{a}» تُسَاوِي {va}، وَ«{b}» تُسَاوِي {vb}: لَيْسَتَا تَوْأَمَيْنِ.')
      .replace('{a}', a.text)
      .replace('{va}', pa.valueAr)
      .replace('{b}', b.text)
      .replace('{vb}', pb.valueAr);
    setWrongPair([a.key, b.key]);
    window.setTimeout(() => {
      setUp([]);
      setWrongPair([]);
      busy.current = false;
      onMove(knew ? { kind: 'miss', whyAr: why } : { kind: 'nudge', sayAr: `${why} تَذَكَّرْ مَكَانَهُمَا!` });
    }, 1050);
  };

  const cols = cards.length === 12 || cards.length === 6 ? 'cols-3' : 'cols-4';

  return (
    <div className="space-y-3" data-lg-board="memory">
      <AnimatePresence>
        {peek && (
          <motion.p key="peek" className="lg-peek" data-lg-peek initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
            👀 اِحْفَظْ أَمَاكِنَ البِطَاقَاتِ…
            <span className="lg-peek-bar" style={{ animationDuration: `${PEEK_MS}ms` }} aria-hidden="true" />
          </motion.p>
        )}
      </AnimatePresence>
      <div className={`lg-memory lg-3d ${cols}`}>
        {cards.map((card, i) => {
          const isMatched = matched.includes(card.pair);
          const faceUp = peek || isMatched || up.includes(card.key);
          const isWrong = wrongPair.includes(card.key);
          return (
            <motion.button
              key={card.key}
              type="button"
              data-lg-card={card.key}
              data-pair={card.pair}
              data-state={isMatched ? 'matched' : faceUp ? 'up' : 'down'}
              onClick={() => flip(card)}
              initial={{ opacity: 0, y: -60, rotateX: 70, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: isMatched ? [1, 1.14, 1] : 1, x: isWrong ? SHAKE : 0 }}
              transition={{ default: { ...springy, delay: i * 0.035 }, x: { duration: 0.45 }, scale: { duration: 0.45 } }}
              whileHover={faceUp ? undefined : { y: -6, rotateX: 10 }}
              whileTap={{ scale: 0.92 }}
              className="lg-mcard"
              aria-label={faceUp ? card.text : `بِطَاقَةٌ مَقْلُوبَةٌ ${i + 1}`}
              disabled={isMatched}
            >
              <motion.span
                className="lg-mcard-inner"
                initial={false}
                animate={{ rotateY: faceUp ? 180 : 0, z: up.includes(card.key) ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <span className="lg-mcard-back" aria-hidden="true"><span className="lg-mcard-seal">🦊</span></span>
                <span className={`lg-mcard-front ${isMatched ? 'is-matched' : ''} ${isWrong ? 'is-wrong' : ''}`}>
                  <GameText text={card.text} />
                  {isMatched && <motion.span className="lg-mcard-check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} aria-hidden="true">✓</motion.span>}
                </span>
              </motion.span>
            </motion.button>
          );
        })}
      </div>
      <BoardProgress done={matched.length} total={round.pairs.length} />
    </div>
  );
}

// ——————————————————— Sort ———————————————————

export function SortBoard({ round, onMove, young }: BoardProps<SortRound>) {
  const cards = useMemo(() => shuffle(round.cards), [round]);
  const [picked, setPicked] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState<string | null>(null);
  const [glowBin, setGlowBin] = useState<string | null>(null);
  const [wobbleBin, setWobbleBin] = useState<string | null>(null);
  const flyId = (cardId: string) => `lg-sort-${round.id}-${cardId}`;
  const placedCount = Object.keys(placed).length;

  const drop = (binId: string) => {
    const card = round.cards.find((c) => c.id === picked);
    if (!card) return;
    if (card.bin !== binId) {
      setShaking(card.id);
      setWobbleBin(binId);
      window.setTimeout(() => setWobbleBin(null), 450);
      onMove({ kind: 'miss', whyAr: card.whyAr });
      return;
    }
    const next = { ...placed, [card.id]: binId };
    setPlaced(next);
    setPicked(null);
    setGlowBin(binId);
    window.setTimeout(() => setGlowBin(null), 600);
    onMove({ kind: 'hit' });
    if (Object.keys(next).length === round.cards.length) window.setTimeout(() => onMove({ kind: 'solved' }), 600);
  };

  return (
    <div className="space-y-4" data-lg-board="sort">
      <div className="lg-tray lg-3d">
        {cards.filter((c) => !placed[c.id]).map((card, i) => (
          <motion.button
            key={card.id}
            layoutId={flyId(card.id)}
            type="button"
            data-lg-sort-card={card.id}
            onClick={() => { playPop(); if (young) readCard(card.textAr); setPicked(card.id); }}
            initial={{ opacity: 0, y: 30, rotateX: -50 }}
            animate={
              shaking === card.id
                ? { opacity: 1, x: SHAKE, rotate: [0, -5, 5, -3, 0], y: 0, scale: 1, rotateX: 0 }
                : picked === card.id
                  ? { opacity: 1, x: 0, rotate: 0, y: -12, scale: 1.1, rotateX: 14 }
                  : { opacity: 1, x: 0, rotate: 0, y: 0, scale: 1, rotateX: 0 }
            }
            transition={{ default: { ...springy, delay: placedCount ? 0 : i * 0.04 }, x: { duration: 0.45 }, rotate: { duration: 0.45 }, layout: flight }}
            onAnimationComplete={() => shaking === card.id && setShaking(null)}
            whileTap={{ scale: 0.94 }}
            className={`lg-chip ${picked === card.id ? 'picked' : ''}`}
            aria-pressed={picked === card.id}
          >
            <GameText text={card.textAr} />
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
            animate={glowBin === bin.id ? { scale: [1, 1.07, 1], y: [0, -6, 0], rotate: 0 } : wobbleBin === bin.id ? { rotate: [0, -3, 3, -2, 0], scale: 1, y: 0 } : { scale: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.45 }}
            whileTap={picked ? { scale: 0.96 } : undefined}
            className={`lg-shelf ${picked ? 'ready' : ''} ${glowBin === bin.id ? 'glow' : ''}`}
          >
            <span className="lg-shelf-label">{bin.labelAr}</span>
            <span className="lg-shelf-books">
              {round.cards.filter((c) => placed[c.id] === bin.id).map((c) => (
                <motion.span key={c.id} layoutId={flyId(c.id)} transition={flight} className="lg-book">{c.textAr.replace(PICTURES, '').trim() || c.textAr}</motion.span>
              ))}
            </span>
            <span className="lg-shelf-plank" aria-hidden="true" />
          </motion.button>
        ))}
      </div>
      <p className="lg-board-tip">{picked ? '👆 اُنْقُرِ الرَّفَّ المُنَاسِبَ' : '👆 اُنْقُرْ بِطَاقَةً'}</p>
      <BoardProgress done={placedCount} total={round.cards.length} />
    </div>
  );
}

// ——————————————————— Order ———————————————————

export function OrderBoard({ round, assist, onMove, young }: BoardProps<OrderRound>) {
  const pool = useMemo(() => shuffle(round.cards), [round]);
  const sorted = useMemo(() => [...round.cards].sort((a, b) => a.rank - b.rank), [round]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [shaking, setShaking] = useState<string | null>(null);
  const flyId = (cardId: string) => `lg-order-${round.id}-${cardId}`;

  const tap = (cardId: string) => {
    const card = round.cards.find((c) => c.id === cardId)!;
    const expected = sorted[placed.length];
    if (card.rank !== expected.rank) {
      setShaking(card.id);
      onMove({ kind: 'miss', whyAr: round.wrongAr.replace('{card}', card.textAr).replace('{key}', card.keyAr) });
      return;
    }
    playPop();
    if (young) readCard(card.keyAr);
    const next = [...placed, card.id];
    setPlaced(next);
    onMove({ kind: 'hit' });
    if (next.length === round.cards.length) window.setTimeout(() => onMove({ kind: 'solved' }), 700);
  };

  return (
    <div className="space-y-4" data-lg-board="order">
      <p className="lg-direction">⟵ {round.directionAr}</p>
      <ol className="lg-timeline" aria-label={round.directionAr}>
        <motion.span className="lg-timeline-glow" aria-hidden="true" initial={false} animate={{ height: `${(placed.length / sorted.length) * 100}%` }} transition={springy} />
        {sorted.map((_, i) => {
          const card = placed[i] ? round.cards.find((c) => c.id === placed[i]) : undefined;
          return (
            <li key={i} className={`lg-slot ${card ? 'filled' : i === placed.length ? 'next' : ''}`} data-lg-slot={i}>
              <span className="lg-slot-n">{i + 1}</span>
              {card ? (
                <motion.span layoutId={flyId(card.id)} transition={flight} className="lg-slot-card">
                  <span className="text-2xl" aria-hidden="true">{card.emoji}</span>
                  <span className="lg-slot-text">{card.textAr}</span>
                  <motion.span initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="lg-date">{card.keyAr}</motion.span>
                </motion.span>
              ) : (
                <span className="lg-slot-empty" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <div className="grid gap-2 sm:grid-cols-2 lg-3d">
        {pool.filter((c) => !placed.includes(c.id)).map((card, i) => (
          <motion.button
            key={card.id}
            layoutId={flyId(card.id)}
            type="button"
            data-lg-order-card={card.id}
            onClick={() => tap(card.id)}
            initial={{ opacity: 0, rotateY: i % 2 ? 40 : -40, y: 20 }}
            animate={shaking === card.id ? { opacity: 1, x: SHAKE, rotateY: 0, y: 0 } : { opacity: 1, x: 0, rotateY: 0, y: 0 }}
            transition={{ default: { ...springy, delay: placed.length ? 0 : i * 0.05 }, x: { duration: 0.45 }, layout: flight }}
            onAnimationComplete={() => shaking === card.id && setShaking(null)}
            whileHover={{ y: -4, rotateX: 6 }}
            whileTap={{ scale: 0.95 }}
            className="lg-event"
          >
            <span className="lg-event-emoji" aria-hidden="true">{card.emoji}</span>
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

export function MazeBoard({ round, onMove, young }: BoardProps<MazeRound>) {
  const grid = round.grid;
  const goal: [number, number] = [grid.length - 1, grid[grid.length - 1].length - 1];
  const [trail, setTrail] = useState<string[]>([cellKey(0, 0)]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [shaking, setShaking] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [r0, c0] = trail[trail.length - 1].split(',').map(Number);
  const reachable = new Set(mazeNeighbours(grid, r0, c0).map(([y, x]) => cellKey(y, x)));
  const cols = grid[0].length;
  // Expert mazes: every stone stays hidden in fog until Didou has stood next to it (the treasure shines through).
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set([cellKey(0, 0), ...mazeNeighbours(grid, 0, 0).map(([y, x]) => cellKey(y, x))]));
  const hidden = (r: number, c: number) => Boolean(round.fog) && !revealed.has(cellKey(r, c)) && !(r === goal[0] && c === goal[1]);

  const tap = (r: number, c: number) => {
    if (done) return;
    const key = cellKey(r, c);
    const back = trail.indexOf(key);
    if (back !== -1) {
      if (back !== trail.length - 1) setTrail(trail.slice(0, back + 1));
      return;
    }
    if (!reachable.has(key)) {
      onMove({
        kind: 'nudge',
        sayAr: hidden(r, c)
          ? 'الضَّبَابُ يُغَطِّي هَذَا الحَجَرَ! تَقَدَّمْ لِتَكْشِفَ الحِجَارَةَ القَرِيبَةَ مِنْ دِيدُو.'
          : 'اُنْقُرْ حَجَراً مُلَاصِقاً لِدِيدُو: أَمَامَهُ أَوْ خَلْفَهُ أَوْ عَلَى جَانِبَيْهِ.',
      });
      return;
    }
    const cell = grid[r][c];
    if (!cell.ok) {
      setShaking(key);
      if (!wrong.includes(key)) setWrong([...wrong, key]);
      onMove({ kind: 'miss', whyAr: cell.whyAr ?? round.hintAr });
      return;
    }
    playPop();
    if (young) readCard(cell.t);
    setTrail([...trail, key]);
    if (round.fog) setRevealed((prev) => new Set([...prev, ...mazeNeighbours(grid, r, c).map(([y, x]) => cellKey(y, x))]));
    onMove({ kind: 'hit' });
    if (r === goal[0] && c === goal[1]) {
      setDone(true);
      window.setTimeout(() => onMove({ kind: 'solved' }), 800);
    }
  };

  return (
    <div className="space-y-3" data-lg-board="maze">
      <p className="lg-rule">📜 {round.ruleAr}</p>
      <div className="lg-maze-stage">
        <div className={`lg-maze ${cols > 5 ? 'dense' : ''} ${done ? 'won' : ''}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const key = cellKey(r, c);
              const here = key === trail[trail.length - 1];
              const onTrail = trail.includes(key);
              const isGoal = r === goal[0] && c === goal[1];
              const fogged = hidden(r, c);
              const state = here ? 'here' : onTrail ? 'trail' : fogged ? 'fog' : wrong.includes(key) ? 'cracked' : reachable.has(key) && !done ? 'reachable' : 'idle';
              return (
                <motion.button
                  key={key}
                  type="button"
                  data-lg-cell={key}
                  data-state={state}
                  onClick={() => tap(r, c)}
                  initial={{ opacity: 0, y: -30, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1, x: shaking === key ? SHAKE : 0, y: state === 'reachable' ? -5 : state === 'cracked' ? 6 : 0 }}
                  transition={{ default: { ...springy, delay: (r + c) * 0.025 }, x: { duration: 0.45 } }}
                  onAnimationComplete={() => shaking === key && setShaking(null)}
                  whileTap={{ scale: 0.9 }}
                  className="lg-stone"
                  aria-label={fogged ? 'حَجَرٌ تَحْتَ الضَّبَابِ' : `${cell.t}${here ? ' — دِيدُو هُنَا' : ''}${isGoal ? ' — الكَنْزُ' : ''}`}
                >
                  {here ? (
                    <motion.span layoutId={`didou-${round.id}`} transition={{ type: 'spring', stiffness: 420, damping: 24 }} className="lg-stone-didou">
                      <motion.span key={trail.length} initial={{ y: -22, scaleY: 0.85 }} animate={{ y: 0, scaleY: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }} className="block">
                        <DidouPortrait size={cols > 5 ? 34 : 40} />
                      </motion.span>
                    </motion.span>
                  ) : fogged ? (
                    <span className="lg-stone-fog" aria-hidden="true">☁️</span>
                  ) : (
                    <motion.span key="shown" initial={round.fog ? { rotateY: 90, opacity: 0 } : false} animate={{ rotateY: 0, opacity: 1 }} className={`lg-stone-text ${cell.t.length > 3 ? 'long' : ''}`}>
                      <GameText text={cell.t} />
                    </motion.span>
                  )}
                  {isGoal && !here && <span className="lg-stone-goal" aria-hidden="true">💎</span>}
                  {state === 'cracked' && <span className="lg-stone-crack" aria-hidden="true" />}
                </motion.button>
              );
            }),
          )}
        </div>
      </div>
      <p className="lg-board-tip">👆 اُنْقُرْ حَجَراً مُجَاوِراً لِدِيدُو · اُنْقُرْ حَجَراً مِنْ مَسَارِكَ لِلرُّجُوعِ</p>
    </div>
  );
}
