import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { GamePack, GameRound } from '../../../data/games/types';
import type { PracticeResult } from '../../../utils/competenceProgress';
import { DidouGuide, type DidouMood } from '../../immersive/DidouGuide';
import { ModalCloseButton } from '../../ui/ModalCloseButton';
import { speakText, stopSpeech } from '../../../utils/speech';
import { playPop, playSoftMiss, playSoftSuccess } from '../../../utils/immersiveFeedback';
import { MazeBoard, MemoryBoard, OrderBoard, SortBoard, type BoardMove } from './boards';
import '../../missions/mission.css';
import './learningGames.css';

function say(text: string) {
  try {
    void speakText(text, 'ar-SA').catch(() => undefined);
  } catch {
    /* no speech engine (jsdom, some WebViews) */
  }
}

/** 3 stars with at most 2 real mistakes in the whole pack, 2 stars up to 6, else 1. */
export function starsForMisses(misses: number): number {
  return misses <= 2 ? 3 : misses <= 6 ? 2 : 1;
}

const COMBO_LINES: Record<number, string> = {
  3: 'رَائِعٌ! ثَلَاثُ إِجَابَاتٍ صَحِيحَةٍ مُتَتَالِيَةٍ! 🔥',
  5: 'خَمْسٌ مُتَتَالِيَةٌ! أَنْتَ فِي قِمَّةِ التَّرْكِيزِ!',
  8: 'ثَمَانٍ بِلَا خَطَأٍ! دِيدُو فَخُورٌ بِكَ!',
};

type Talk = { text: string; n: number };

/**
 * « ألعاب ديدو التعليمية »: a full-screen adventure (story → 3 rounds → memo card). Didou speaks
 * every line, explains every wrong move, gives a hint from the second miss of a round, and cheers
 * streaks. Each round reports to the parent notebook through its catalog lesson.
 */
export const LearningGamePlayer: React.FC<{
  pack: GamePack;
  onExit: () => void;
  onResult?: (lessonId: string, result: PracticeResult) => void;
  onFinish?: (stars: number) => void;
}> = ({ pack, onExit, onResult, onFinish }) => {
  // step 0 = story, 1..n = rounds, n+1 = memo card
  const [step, setStep] = useState(0);
  const [talk, setTalk] = useState<Talk>({ text: pack.storyAr, n: 0 });
  const [mood, setMood] = useState<DidouMood>('talk');
  const [solved, setSolved] = useState(false);
  const [roundMisses, setRoundMisses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [burst, setBurst] = useState(0);
  const [finished, setFinished] = useState(false);
  const [replay, setReplay] = useState(0);
  const totalMisses = useRef(0);
  const comboRef = useRef(0);
  const missesRef = useRef(0);

  const round: GameRound | undefined = step >= 1 && step <= pack.rounds.length ? pack.rounds[step - 1] : undefined;
  const isRecap = step === pack.rounds.length + 1;
  const roundRef = useRef(round);
  roundRef.current = round;

  const speak = useCallback((text: string, nextMood: DidouMood) => {
    setMood(nextMood);
    setTalk((t) => ({ text, n: t.n + 1 }));
  }, []);

  useEffect(() => say(talk.text), [talk]);
  useEffect(() => () => stopSpeech(), []);

  useEffect(() => {
    setSolved(false);
    setRoundMisses(0);
    missesRef.current = 0;
    if (round) speak(round.sayAr, 'talk');
    else if (isRecap) speak('بِطَاقَةُ الذَّاكِرَةِ: هَذَا مَا تَعَلَّمْنَاهُ اليَوْمَ.', 'happy');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, replay]);

  const onMove = useCallback((move: BoardMove) => {
    const current = roundRef.current;
    if (!current) return;
    const exerciseId = `${pack.id}:${current.id}`;
    if (move.kind === 'hit') {
      comboRef.current += 1;
      setCombo(comboRef.current);
      setBurst((b) => b + 1);
      playSoftSuccess();
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
      totalMisses.current += 1;
      setRoundMisses(missesRef.current);
      playSoftMiss();
      speak(missesRef.current >= 2 ? `${move.whyAr} ${current.hintAr}` : move.whyAr, 'think');
      if (missesRef.current === 1) onResult?.(current.lessonId, { outcome: 'fail', exerciseId });
      return;
    }
    playSoftSuccess();
    setSolved(true);
    speak(current.successAr, 'happy');
    onResult?.(current.lessonId, { outcome: 'success', helped: missesRef.current > 0, exerciseId });
  }, [onResult, pack.id, speak]);

  const stars = starsForMisses(totalMisses.current);
  const canGoOn = step === 0 || isRecap || solved;

  const next = () => {
    playPop();
    if (!isRecap) {
      setStep(step + 1);
      return;
    }
    setFinished(true);
    speak(stars === 3 ? 'ثَلَاثُ نُجُومٍ! أَنْتَ بَطَلُ المُغَامَرَةِ.' : 'أَنْهَيْتَ المُغَامَرَةَ! أَعِدْهَا لِتَرْبَحَ كُلَّ النُّجُومِ.', 'happy');
    onFinish?.(stars);
  };

  const restart = () => {
    totalMisses.current = 0;
    comboRef.current = 0;
    setCombo(0);
    setFinished(false);
    setStep(0);
    setReplay((r) => r + 1);
    speak(pack.storyAr, 'talk');
  };

  return createPortal(
    <div
      className="mission-player lg-player fixed inset-0 z-[65] overflow-y-auto"
      dir="rtl"
      style={{ background: pack.theme.sky }}
      role="dialog"
      aria-modal="true"
      aria-label={pack.titleAr}
      data-learning-game={pack.id}
    >
      <div className="mission-stars-bg" aria-hidden="true" />
      <div className="lg-scenery" aria-hidden="true">
        {pack.theme.scenery.map((e, i) => <span key={i} style={{ animationDelay: `${i * 0.6}s` }}>{e}</span>)}
      </div>

      <div className="relative max-w-xl mx-auto px-4 pt-4 pb-36 space-y-4">
        <header className="flex items-center justify-between gap-3">
          <ModalCloseButton onClose={onExit} tone="dark" />
          <div className="min-w-0 text-center">
            <p className="text-[11px] font-extrabold text-white/75">🎮 لُعْبَةُ دِيدُو</p>
            <h1 className="text-base font-black text-white leading-tight">{pack.titleAr}</h1>
          </div>
          <AnimatePresence>
            {combo >= 2 && !finished ? (
              <motion.span key={combo} initial={{ scale: 0.3, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} className="lg-combo" data-lg-combo={combo}>
                🔥 ×{combo}
              </motion.span>
            ) : (
              <span key="no-combo" className="w-12" />
            )}
          </AnimatePresence>
        </header>

        <ol className="mission-beads" aria-label="تَقَدُّمُ المُغَامَرَةِ">
          {[0, ...pack.rounds.map((_, i) => i + 1), pack.rounds.length + 1].map((i) => (
            <li key={i} data-state={i < step || finished ? 'done' : i === step ? 'now' : 'todo'} data-challenge={i === pack.rounds.length ? '' : undefined} />
          ))}
        </ol>

        <DidouGuide line={talk.text} mood={mood} lang="ar" listenLabel="اسْتَمِعْ إِلَى دِيدُو" onReplay={() => say(talk.text)} />

        <AnimatePresence mode="wait">
          <motion.section
            key={finished ? 'end' : `${step}-${replay}`}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="mission-card relative overflow-hidden"
            data-lg-step={finished ? 'end' : round ? round.kind : isRecap ? 'recap' : 'story'}
          >
            <Burst n={burst} />
            {finished ? (
              <EndCard stars={stars} xp={pack.xp} onReplay={restart} onExit={onExit} />
            ) : round ? (
              <div className="space-y-3">
                <div className="lg-round-head">
                  <span className="lg-round-n">الجَوْلَةُ {step} / {pack.rounds.length}</span>
                  <h2 className="lg-round-title">{round.titleAr}</h2>
                </div>
                <RoundBoard key={`${round.id}-${replay}`} round={round} assist={roundMisses >= 2} onMove={onMove} />
              </div>
            ) : isRecap ? (
              <div className="mission-recap space-y-2" data-lg-recap>
                <p className="text-sm font-black text-[#92400e]">📌 بِطَاقَةُ الذَّاكِرَةِ: مَا تَعَلَّمْتُهُ</p>
                {pack.recapAr.map((p) => <p key={p} className="mission-recap-point">✓ {p}</p>)}
              </div>
            ) : (
              <div className="lg-story">
                <motion.span className="lg-story-emoji" animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} aria-hidden="true">
                  {pack.theme.emoji}
                </motion.span>
                <p className="lg-story-rounds">{pack.rounds.map((r, i) => `${i + 1}. ${r.titleAr}`).join('  ·  ')}</p>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      {!finished && (
        <div className="fixed inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/45 to-transparent">
          <div className="max-w-xl mx-auto">
            <motion.button type="button" data-lg-next disabled={!canGoOn} onClick={next} whileTap={{ scale: 0.95 }} className="mission-next w-full">
              {step === 0 ? '▶ هَيَّا نَلْعَبُ!' : isRecap ? 'أَنْهِ المُغَامَرَةَ ⭐' : solved ? 'الجَوْلَةُ التَّالِيَةُ ←' : '… أَكْمِلِ الجَوْلَةَ'}
            </motion.button>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
};

function RoundBoard({ round, assist, onMove }: { round: GameRound; assist: boolean; onMove: (m: BoardMove) => void }) {
  switch (round.kind) {
    case 'memory':
      return <MemoryBoard round={round} assist={assist} onMove={onMove} />;
    case 'sort':
      return <SortBoard round={round} assist={assist} onMove={onMove} />;
    case 'order':
      return <OrderBoard round={round} assist={assist} onMove={onMove} />;
    case 'maze':
      return <MazeBoard round={round} assist={assist} onMove={onMove} />;
  }
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
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{ x: Math.cos(angle) * 110, y: Math.sin(angle) * 80, opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            {s}
          </motion.span>
        );
      })}
    </div>
  );
}

function EndCard({ stars, xp, onReplay, onExit }: { stars: number; xp: number; onReplay: () => void; onExit: () => void }) {
  return (
    <div className="text-center space-y-4" data-lg-end={stars}>
      <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl" aria-hidden="true">🏆</motion.p>
      <div className="flex justify-center gap-2 text-5xl" aria-label={`${stars} / 3`}>
        {[0, 1, 2].map((i) => (
          <motion.span key={i} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + i * 0.25, type: 'spring' }} className={i < stars ? '' : 'opacity-25 grayscale'}>⭐</motion.span>
        ))}
      </div>
      <p className="text-lg font-black text-slate-900">+{xp} XP</p>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" data-lg-replay onClick={onReplay} className="mission-secondary">🔁 أَعِدِ اللُّعْبَةَ</button>
        <button type="button" onClick={onExit} className="mission-next">✓ أَنْهَيْتُ</button>
      </div>
    </div>
  );
}
