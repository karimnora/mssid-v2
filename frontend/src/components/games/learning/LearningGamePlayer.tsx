import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useSpring } from 'motion/react';
import type { GamePack, GameRound } from '../../../data/games/types';
import type { PracticeResult } from '../../../utils/competenceProgress';
import { DidouGuide, type DidouMood } from '../../immersive/DidouGuide';
import { DidouPortrait } from '../../world/DidouPortrait';
import { ModalCloseButton } from '../../ui/ModalCloseButton';
import { speakText, stopSpeech } from '../../../utils/speech';
import { playPop, playSoftMiss, playSoftSuccess } from '../../../utils/immersiveFeedback';
import { MazeBoard, MemoryBoard, OrderBoard, SortBoard, type BoardMove, type CardVoice } from './boards';
import '../../missions/mission.css';
import './learningGames.css';

const PICTURES = /[\p{Extended_Pictographic}\u200d\uFE0F]/gu;

/** Didou's voice: pictures are shown, never spelled out by the speech engine. */
function say(text: string) {
  const words = text.replace(PICTURES, '').replace(/«\s*»/g, '').trim();
  if (!words) return;
  try {
    void speakText(words, 'ar-SA').catch(() => undefined);
  } catch {
    /* no speech engine (jsdom, some WebViews) */
  }
}

/** A short vibration on phones that support it (Android WebView), nothing elsewhere. */
function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* not allowed */
  }
}

function prefersReducedMotion(): boolean {
  try {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  } catch {
    return false;
  }
}

/** Stars of one level: 3 with at most 1 real mistake, 2 up to 3, else 1. A skipped level has none. */
export function starsForMisses(misses: number): number {
  return misses <= 1 ? 3 : misses <= 3 ? 2 : 1;
}

/** Difficulty label of each level, in order. */
export const LEVEL_TIER_AR = ['سَهْلٌ', 'مُتَوَسِّطٌ', 'صَعْبٌ', 'خَبِيرٌ', 'بَطَلٌ'];
/** Ten levels share five difficulty tiers (2 levels each); a shorter pack gets one tier per level. */
export function tierIndex(i: number, total: number): number {
  return Math.min(LEVEL_TIER_AR.length - 1, Math.floor((i * LEVEL_TIER_AR.length) / Math.max(total, LEVEL_TIER_AR.length)));
}

/** The level to suggest: the first one never solved, else the first one without 3 stars. */
export function suggestedLevel(pack: GamePack, best: Record<string, number>): number {
  const unsolved = pack.rounds.findIndex((r) => !best[r.id]);
  if (unsolved !== -1) return unsolved;
  const notPerfect = pack.rounds.findIndex((r) => (best[r.id] ?? 0) < 3);
  return notPerfect === -1 ? 0 : notPerfect;
}

const COMBO_LINES: Record<number, string> = {
  3: 'رَائِعٌ! ثَلَاثُ إِجَابَاتٍ صَحِيحَةٍ مُتَتَالِيَةٍ! 🔥',
  5: 'خَمْسٌ مُتَتَالِيَةٌ! أَنْتَ فِي قِمَّةِ التَّرْكِيزِ!',
  8: 'ثَمَانٍ بِلَا خَطَأٍ! دِيدُو فَخُورٌ بِكَ!',
};

const SKIP_LINE = 'لَا بَأْسَ! تَخَطَّيْنَا المُسْتَوَى، وَيُمْكِنُكَ العَوْدَةُ إِلَيْهِ مِنَ الخَرِيطَةِ.';
const MAP_LINE = 'اِخْتَرْ مُسْتَوًى: كُلُّ المُسْتَوَيَاتِ مَفْتُوحَةٌ، وَيُمْكِنُكَ أَنْ تَقْفِزَ إِلَى أَيِّ تَحَدٍّ.';

type Screen = { kind: 'map' } | { kind: 'level'; index: number } | { kind: 'recap' };
type Talk = { text: string; n: number };

/**
 * « ألعاب ديدو التعليمية »: a full-screen 3D adventure. A map of ten levels (easy → champion, all
 * open), each level played on its board, then a memo card. Didou speaks every line, explains every
 * wrong move, gives a hint from the second miss of a level and cheers streaks. The child may skip
 * any level and come back later; each level reports to the parent notebook through its lesson.
 */
export const LearningGamePlayer: React.FC<{
  pack: GamePack;
  onExit: () => void;
  onResult?: (lessonId: string, result: PracticeResult) => void;
  /** Best stars per level id, kept by the caller (device storage). */
  best?: Record<string, number>;
  /** A level was solved with these stars (the caller keeps the best and gives the XP). */
  onLevelSolved?: (roundId: string, stars: number) => void;
  /** Open this level directly instead of the map (lesson banner). */
  startLevel?: number;
}> = ({ pack, onExit, onResult, best = {}, onLevelSolved, startLevel }) => {
  const [screen, setScreen] = useState<Screen>(() => (startLevel != null && pack.rounds[startLevel] ? { kind: 'level', index: startLevel } : { kind: 'map' }));
  const [talk, setTalk] = useState<Talk>({ text: pack.storyAr, n: 0 });
  const [mood, setMood] = useState<DidouMood>('talk');
  const [solvedStars, setSolvedStars] = useState(0);
  const [levelMisses, setLevelMisses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [burst, setBurst] = useState(0);
  const [party, setParty] = useState(0);
  const [jolt, setJolt] = useState(0);
  const [play, setPlay] = useState(0);
  const [session, setSession] = useState<Record<string, number>>({});
  const comboRef = useRef(0);
  const missesRef = useRef(0);
  const skipNote = useRef('');
  const firstMap = useRef(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stars = useMemo(() => {
    const merged: Record<string, number> = { ...best };
    for (const [id, s] of Object.entries(session)) merged[id] = Math.max(merged[id] ?? 0, s);
    return merged;
  }, [best, session]);

  const round: GameRound | undefined = screen.kind === 'level' ? pack.rounds[screen.index] : undefined;
  const levelIndex = screen.kind === 'level' ? screen.index : -1;
  const isLast = levelIndex === pack.rounds.length - 1;
  const roundRef = useRef(round);
  roundRef.current = round;

  const speak = useCallback((text: string, nextMood: DidouMood) => {
    setMood(nextMood);
    setTalk((t) => ({ text, n: t.n + 1 }));
  }, []);

  useEffect(() => say(talk.text), [talk]);
  useEffect(() => () => stopSpeech(), []);

  useEffect(() => {
    setSolvedStars(0);
    setLevelMisses(0);
    missesRef.current = 0;
    if (screen.kind === 'level') {
      const opening = pack.rounds[screen.index].sayAr;
      speak(skipNote.current ? `${skipNote.current} ${opening}` : opening, 'talk');
      skipNote.current = '';
    } else if (screen.kind === 'recap') {
      speak('بِطَاقَةُ الذَّاكِرَةِ: هَذَا مَا تَعَلَّمْنَاهُ فِي هَذِهِ المُغَامَرَةِ.', 'happy');
    } else if (!firstMap.current) {
      speak(MAP_LINE, 'talk');
    }
    firstMap.current = false;
    // A new level starts at the top; once its board has landed, the page glides just enough for the
    // whole board to be on screen (nothing moves when it already fits).
    const el = scrollRef.current;
    try {
      el?.scrollTo({ top: 0 });
    } catch {
      /* jsdom */
    }
    if (screen.kind !== 'level' || !el) return undefined;
    const timer = window.setTimeout(() => {
      const board = el.querySelector('[data-lg-board]');
      if (!board || typeof el.scrollTo !== 'function') return;
      const top = board.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
      const target = Math.min(el.scrollHeight - el.clientHeight, Math.max(0, top - 12));
      if (target > 0) el.scrollTo({ top: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }, 650);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, play]);

  const onMove = useCallback((move: BoardMove) => {
    const current = roundRef.current;
    if (!current) return;
    const exerciseId = `${pack.id}:${current.id}`;
    if (move.kind === 'hit') {
      comboRef.current += 1;
      setCombo(comboRef.current);
      setBurst((b) => b + 1);
      playSoftSuccess();
      buzz(12);
      const cheer = COMBO_LINES[comboRef.current];
      if (move.sayAr) speak(cheer ? `${move.sayAr} ${cheer}` : move.sayAr, 'happy');
      else if (cheer) speak(cheer, 'happy');
      return;
    }
    if (move.kind === 'nudge') {
      speak(move.sayAr, 'think');
      return;
    }
    if (move.kind === 'miss') {
      comboRef.current = 0;
      setCombo(0);
      missesRef.current += 1;
      setLevelMisses(missesRef.current);
      setJolt((j) => j + 1);
      playSoftMiss();
      buzz([18, 40, 18]);
      speak(missesRef.current >= 2 ? `${move.whyAr} ${current.hintAr}` : move.whyAr, 'think');
      if (missesRef.current === 1) onResult?.(current.lessonId, { outcome: 'fail', exerciseId });
      return;
    }
    const earned = starsForMisses(missesRef.current);
    playSoftSuccess();
    buzz([20, 50, 20, 50, 40]);
    setSolvedStars(earned);
    setParty((p) => p + 1);
    setSession((s) => ({ ...s, [current.id]: Math.max(s[current.id] ?? 0, earned) }));
    speak(current.successAr, 'happy');
    onResult?.(current.lessonId, { outcome: 'success', helped: missesRef.current > 0, exerciseId });
    onLevelSolved?.(current.id, earned);
  }, [onLevelSolved, onResult, pack.id, speak]);

  const openLevel = (index: number) => {
    playPop();
    comboRef.current = 0;
    setCombo(0);
    setScreen({ kind: 'level', index });
    setPlay((p) => p + 1);
  };
  const goNext = () => {
    if (levelIndex >= 0 && !isLast) openLevel(levelIndex + 1);
    else {
      playPop();
      setScreen({ kind: 'recap' });
    }
  };
  const skip = () => {
    skipNote.current = isLast ? '' : SKIP_LINE;
    goNext();
  };
  const toMap = () => {
    playPop();
    setScreen({ kind: 'map' });
  };

  const suggested = suggestedLevel(pack, stars);
  const totalStars = pack.rounds.reduce((sum, r) => sum + (stars[r.id] ?? 0), 0);
  const solved = solvedStars > 0;

  return createPortal(
    <div
      className={`mission-player lg-player ${pack.young ? 'lg-young' : ''} ${pack.grade === 'PRE' ? 'lg-pre' : ''} fixed inset-0 z-[65] flex flex-col overflow-hidden`}
      dir="rtl"
      style={{ background: pack.theme.backdrop ? `center / cover no-repeat url(${pack.theme.backdrop}), ${pack.theme.sky}` : pack.theme.sky }}
      data-painted={pack.theme.backdrop ? '' : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={pack.titleAr}
      data-learning-game={pack.id}
    >
      <World pack={pack} />

      {/* Only the game scrolls; the action bar below is its own band and never covers the board. */}
      <div ref={scrollRef} className="lg-scroll relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden" data-lg-scroll>
      <div className="relative max-w-xl mx-auto px-4 pt-3 pb-6 space-y-3">
        <header className="flex items-center justify-between gap-3">
          <ModalCloseButton onClose={onExit} tone="dark" />
          <div className="min-w-0 text-center">
            <p className="text-[11px] font-extrabold text-white/80">🎮 لُعْبَةُ دِيدُو · ⭐ {totalStars} / {pack.rounds.length * 3}</p>
            <h1 className="text-base font-black text-white leading-tight lg-title-3d">{pack.titleAr}</h1>
          </div>
          <AnimatePresence>
            {combo >= 2 && screen.kind === 'level' ? (
              <motion.span key={combo} initial={{ scale: 0.3, rotate: -20, rotateY: 90 }} animate={{ scale: 1, rotate: 0, rotateY: 0 }} exit={{ scale: 0 }} className="lg-combo" data-lg-combo={combo}>
                🔥 ×{combo}
              </motion.span>
            ) : (
              <span key="no-combo" className="w-12" />
            )}
          </AnimatePresence>
        </header>

        <ol className="lg-beads" aria-label="المُسْتَوَيَاتُ">
          {pack.rounds.map((r, i) => (
            <li key={r.id} data-state={i === levelIndex ? 'now' : stars[r.id] ? 'done' : 'todo'}>
              <button type="button" onClick={() => openLevel(i)} aria-label={`المُسْتَوَى ${i + 1}: ${r.titleAr}`}>{i + 1}</button>
            </li>
          ))}
        </ol>

        <DidouGuide line={talk.text} mood={mood} lang="ar" listenLabel="اسْتَمِعْ إِلَى دِيدُو" onReplay={() => say(talk.text)} />

        <AnimatePresence mode="wait">
          <motion.section
            key={screen.kind === 'level' ? `level-${screen.index}-${play}` : screen.kind}
            initial={{ opacity: 0, y: 40, rotateX: -18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, rotateX: 14, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            style={{ transformPerspective: 1200 }}
            data-lg-step={round ? round.kind : screen.kind}
          >
            <TiltStage jolt={jolt}>
              <div className="mission-card lg-card relative overflow-hidden">
                <Burst n={burst} />
                {round ? (
                  <div className="space-y-3">
                    <div className="lg-round-head">
                      <span className="lg-round-n" data-tier={tierIndex(levelIndex, pack.rounds.length)}>
                        {isLast ? '👑 ' : ''}المُسْتَوَى {levelIndex + 1} / {pack.rounds.length} · {LEVEL_TIER_AR[tierIndex(levelIndex, pack.rounds.length)]}
                      </span>
                      <h2 className="lg-round-title">{round.titleAr}</h2>
                      {stars[round.id] ? <p className="lg-round-best" aria-label={`أَفْضَلُ نَتِيجَةٍ ${stars[round.id]} / 3`}>{'⭐'.repeat(stars[round.id])}</p> : null}
                    </div>
                    <RoundBoard key={`${round.id}-${play}`} round={round} assist={Boolean(round.easy) || levelMisses >= 2} onMove={onMove} voice={pack.cardLang ?? (pack.young ? 'ar' : undefined)} />
                    <AnimatePresence>{solved && <LevelClear key={`clear-${play}`} stars={solvedStars} misses={levelMisses} last={isLast} reported={Boolean(onResult)} />}</AnimatePresence>
                  </div>
                ) : screen.kind === 'recap' ? (
                  <Recap pack={pack} stars={stars} total={totalStars} onLevel={openLevel} />
                ) : (
                  <LevelMap pack={pack} stars={stars} suggested={suggested} onOpen={openLevel} />
                )}
              </div>
            </TiltStage>
          </motion.section>
        </AnimatePresence>
      </div>

      </div>

      <Confetti n={party} />

      <div className="lg-actions relative flex-none px-4 pt-3" data-lg-actions>
        <div className="max-w-xl mx-auto flex gap-2">
          {screen.kind === 'map' && (
            <motion.button type="button" data-lg-next onClick={() => openLevel(suggested)} whileTap={{ scale: 0.95 }} className="mission-next flex-1">
              ▶ {stars[pack.rounds[suggested].id] ? 'اِلْعَبِ' : 'اِبْدَأِ'} المُسْتَوَى {suggested + 1}
            </motion.button>
          )}
          {screen.kind === 'level' && (
            <>
              <motion.button type="button" data-lg-map onClick={toMap} whileTap={{ scale: 0.92 }} className="mission-secondary lg-icon-btn" aria-label="خَرِيطَةُ المُسْتَوَيَاتِ">🗺️</motion.button>
              {solved && (
                <motion.button type="button" data-lg-retry onClick={() => openLevel(levelIndex)} whileTap={{ scale: 0.92 }} className="mission-secondary lg-icon-btn" aria-label="أَعِدِ المُسْتَوَى">🔁</motion.button>
              )}
              <motion.button
                type="button"
                data-lg-next
                data-lg-skip={solved ? undefined : ''}
                onClick={solved ? goNext : skip}
                whileTap={{ scale: 0.95 }}
                animate={solved ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={solved ? { repeat: Infinity, duration: 1.4 } : undefined}
                className={`flex-1 ${solved ? 'mission-next' : 'mission-secondary lg-skip'}`}
              >
                {solved ? (isLast ? '📌 بِطَاقَةُ الذَّاكِرَةِ' : 'المُسْتَوَى التَّالِي ←') : isLast ? '⏭ تَخَطَّ إِلَى بِطَاقَةِ الذَّاكِرَةِ' : '⏭ تَخَطَّ إِلَى المُسْتَوَى التَّالِي'}
              </motion.button>
            </>
          )}
          {screen.kind === 'recap' && (
            <>
              <motion.button type="button" data-lg-map onClick={toMap} whileTap={{ scale: 0.95 }} className="mission-secondary flex-1">🗺️ الخَرِيطَةُ</motion.button>
              <motion.button type="button" data-lg-finish onClick={onExit} whileTap={{ scale: 0.95 }} className="mission-next flex-1">✓ أَنْهَيْتُ</motion.button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

function RoundBoard({ round, ...props }: { round: GameRound; assist: boolean; onMove: (m: BoardMove) => void; voice?: CardVoice }) {
  switch (round.kind) {
    case 'memory':
      return <MemoryBoard round={round} {...props} />;
    case 'sort':
      return <SortBoard round={round} {...props} />;
    case 'order':
      return <OrderBoard round={round} {...props} />;
    case 'maze':
      return <MazeBoard round={round} {...props} />;
  }
}

/** The 3D scene behind the game: sun, drifting clouds, a perspective floor and the landmarks on it. */
function World({ pack }: { pack: GamePack }) {
  return (
    <div className="lg-world" aria-hidden="true">
      <div className="mission-stars-bg" />
      <span className="lg-sun" />
      <span className="lg-cloud c1" />
      <span className="lg-cloud c2" />
      <span className="lg-cloud c3" />
      <div className="lg-floor" />
      <div className="lg-scenery">
        {pack.theme.scenery.map((e, i) => (
          <span key={i} className={`depth-${i % 3}`} style={{ animationDelay: `${i * 0.6}s` }}>{e}</span>
        ))}
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className="lg-mote" style={{ insetInlineStart: `${8 + i * 16}%`, animationDelay: `${i * 1.3}s` }} />)}
    </div>
  );
}

/** The game card leans toward the mouse (desktop only) and jolts softly on a mistake. */
function TiltStage({ jolt, children }: { jolt: number; children: React.ReactNode }) {
  const rotateX = useSpring(0, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 18 });
  const enabled = useMemo(() => {
    try {
      return Boolean(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) && !prefersReducedMotion();
    } catch {
      return false;
    }
  }, []);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 6);
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 5);
  };
  const leave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };
  return (
    <motion.div
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      animate={{ x: jolt ? (jolt % 2 ? [0, -8, 8, -4, 0] : [0, 8, -8, 4, 0]) : 0 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

/** Map of the levels: 3D platforms on a winding path, every level open. */
function LevelMap({ pack, stars, suggested, onOpen }: { pack: GamePack; stars: Record<string, number>; suggested: number; onOpen: (i: number) => void }) {
  return (
    <div className="lg-map" data-lg-map-screen>
      <div className="lg-map-hero">
        <motion.span className="lg-story-emoji" animate={{ y: [0, -12, 0], rotateY: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 3.2 }} aria-hidden="true">
          {pack.theme.emoji}
        </motion.span>
        <p className="lg-map-sub"><span dir="ltr">{pack.rounds.length}</span> مُسْتَوَيَاتٍ مِنَ السَّهْلِ إِلَى البَطَلِ · كُلُّهَا مَفْتُوحَةٌ · 👑 فِي النِّهَايَةِ</p>
      </div>
      <ol className="lg-path">
        {pack.rounds.map((r, i) => {
          const got = stars[r.id] ?? 0;
          return (
            <motion.li
              key={r.id}
              className={`lg-path-row ${i % 2 ? 'alt' : ''}`}
              initial={{ opacity: 0, y: 30, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 * i }}
            >
              <motion.button
                type="button"
                data-lg-level={i}
                data-state={got ? 'done' : i === suggested ? 'now' : 'todo'}
                data-tier={tierIndex(i, pack.rounds.length)}
                data-boss={i === pack.rounds.length - 1 ? '' : undefined}
                onClick={() => onOpen(i)}
                whileHover={{ y: -6, rotateX: 12 }}
                whileTap={{ scale: 0.9, y: 4 }}
                className="lg-node"
                aria-label={`المُسْتَوَى ${i + 1}: ${r.titleAr} — ${LEVEL_TIER_AR[tierIndex(i, pack.rounds.length)]}${got ? ` — ${got} / 3` : ''}`}
              >
                <span className="lg-node-num">{i + 1}</span>
                {i === pack.rounds.length - 1 && <span className="lg-node-crown" aria-hidden="true">👑</span>}
                {i === suggested && (
                  <motion.span layoutId={`lg-map-didou-${pack.id}`} className="lg-node-didou" animate={{ y: [0, -6, 0] }} transition={{ y: { repeat: Infinity, duration: 1.6 } }}>
                    <DidouPortrait size={40} />
                  </motion.span>
                )}
              </motion.button>
              <div className="lg-node-info">
                <span className="lg-node-tier" data-tier={tierIndex(i, pack.rounds.length)}>{LEVEL_TIER_AR[tierIndex(i, pack.rounds.length)]}</span>
                <p className="lg-node-title">{r.titleAr}</p>
                <p className="lg-node-stars" aria-hidden="true">
                  {[0, 1, 2].map((s) => <span key={s} className={s < got ? '' : 'off'}>⭐</span>)}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

/** « خَطَأٌ وَاحِدٌ فَقَطْ · ثَلَاثُ نُجُومٍ »: how the stars of a level were earned. */
export function clearLineAr(misses: number, stars: number): string {
  const mistakes =
    misses === 0 ? 'بِلَا أَيِّ خَطَأٍ' : misses === 1 ? 'خَطَأٌ وَاحِدٌ فَقَطْ' : misses === 2 ? 'خَطَآنِ' : misses <= 10 ? `${misses} أَخْطَاءٍ` : `${misses} خَطَأً`;
  const got = stars >= 3 ? 'ثَلَاثُ نُجُومٍ' : stars === 2 ? 'نَجْمَتَانِ' : 'نَجْمَةٌ وَاحِدَةٌ';
  return `${mistakes} · ${got}`;
}

/** Pops over the board when a level is solved: its stars spin in, one by one. */
function LevelClear({ stars, misses, last, reported }: { stars: number; misses: number; last: boolean; reported: boolean }) {
  return (
    <motion.div
      className="lg-clear"
      data-lg-clear={stars}
      initial={{ opacity: 0, scale: 0.6, rotateX: -60 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      role="status"
    >
      <p className="lg-clear-title">{last ? '🏆 أَنْهَيْتَ آخِرَ مُسْتَوًى!' : '🎉 أَحْسَنْتَ! المُسْتَوَى مُكْتَمِلٌ'}</p>
      <div className="lg-clear-stars" aria-label={`${stars} / 3`}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotateY: -540, y: 30 }}
            animate={{ scale: 1, rotateY: 0, y: 0 }}
            transition={{ delay: 0.25 + i * 0.22, type: 'spring', stiffness: 220, damping: 14 }}
            className={i < stars ? '' : 'off'}
          >
            ⭐
          </motion.span>
        ))}
      </div>
      <p className="lg-clear-line">{clearLineAr(misses, stars)}</p>
      {reported && <p className="lg-clear-chip">📒 وَصَلَ إِلَى دَفْتَرِ الوَلِيِّ</p>}
    </motion.div>
  );
}

function Recap({ pack, stars, total, onLevel }: { pack: GamePack; stars: Record<string, number>; total: number; onLevel: (i: number) => void }) {
  const left = pack.rounds.map((r, i) => ({ r, i })).filter(({ r }) => !stars[r.id]);
  const all = left.length === 0;
  return (
    <div className="space-y-4" data-lg-recap data-lg-end={total}>
      <div className="text-center">
        <motion.p initial={{ scale: 0, rotateY: 180 }} animate={{ scale: 1, rotateY: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} className="text-6xl" aria-hidden="true">
          {all ? '🏆' : '🧭'}
        </motion.p>
        <p className="text-lg font-black text-slate-900 mt-1" dir="rtl">⭐ {total} / {pack.rounds.length * 3}</p>
        <p className="text-sm font-extrabold text-slate-700">
          {all ? `أَنْهَيْتَ كُلَّ المُسْتَوَيَاتِ! +${pack.xp} XP` : `بَقِيَتْ ${left.length} مِنَ المُسْتَوَيَاتِ لَمْ تُكْمِلْهَا بَعْدُ: عُدْ إِلَيْهَا لِتَرْبَحَ ${pack.xp} XP.`}
        </p>
      </div>
      {!all && (
        <div className="flex flex-wrap justify-center gap-2">
          {left.map(({ r, i }) => (
            <button key={r.id} type="button" data-lg-recap-level={i} onClick={() => onLevel(i)} className="lg-recap-chip">
              {i + 1}. {r.titleAr}
            </button>
          ))}
        </div>
      )}
      <div className="mission-recap space-y-2">
        <p className="text-sm font-black text-[#92400e]">📌 بِطَاقَةُ الذَّاكِرَةِ: مَا تَعَلَّمْتُهُ</p>
        {pack.recapAr.map((p) => <p key={p} className="mission-recap-point">✓ {p}</p>)}
      </div>
    </div>
  );
}

const SPARKS = ['✨', '⭐', '🌟', '✨', '💫', '⭐', '✨', '🌟'];

/** A small burst of stars from the centre of the card on every right move. */
function Burst({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <div key={n} className="lg-burst" aria-hidden="true">
      {SPARKS.map((s, i) => {
        const angle = (i / SPARKS.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
            animate={{ x: Math.cos(angle) * 120, y: Math.sin(angle) * 90, opacity: 0, scale: 1.3, rotate: 180 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            {s}
          </motion.span>
        );
      })}
    </div>
  );
}

const CONFETTI_COLORS = ['#ffd23f', '#22c55e', '#38bdf8', '#a855f7', '#fb923c', '#f472b6'];

/** Full-screen confetti rain when a level is solved. */
function Confetti({ n }: { n: number }) {
  if (n === 0 || prefersReducedMotion()) return null;
  const fall = (typeof window !== 'undefined' ? window.innerHeight : 800) + 60;
  return (
    <div key={n} className="lg-confetti" aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <motion.span
          key={i}
          style={{ background: CONFETTI_COLORS[i % CONFETTI_COLORS.length], insetInlineStart: `${(i * 37) % 100}%` }}
          initial={{ y: -40, rotateX: 0, rotateZ: 0, opacity: 1 }}
          animate={{ y: fall, rotateX: 720 + i * 20, rotateZ: (i % 2 ? 1 : -1) * 360, opacity: [1, 1, 0] }}
          transition={{ duration: 1.8 + (i % 5) * 0.25, ease: 'easeIn', delay: (i % 7) * 0.05 }}
        />
      ))}
    </div>
  );
}
