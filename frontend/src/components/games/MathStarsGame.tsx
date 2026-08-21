/**
 * MathStarsGame.tsx
 * حرب النجوم — Falling asteroid math challenge.
 * 4 levels of increasing difficulty. React answer buttons + Phaser visual canvas.
 * Follows the same pattern as BalloonPopGame with LevelSelectScreen + useLevelProgress.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import { motion, AnimatePresence } from 'motion/react';
import { LevelSelectScreen, LevelDef } from '../preschool/LevelSelectScreen';
import { useLevelProgress } from '../preschool/useLevelProgress';

export interface MathStarsGameProps {
  onExit?: () => void;
  onComplete?: (xp: number) => void;
  language?: 'ar' | 'fr' | 'en';
}

interface Question {
  text: string;
  answer: number;
  opts: number[];
}

interface LevelCfg {
  speed: number;
  winCount: number;
  livesMax: number;
  label: string;
  generateQuestion: () => Question;
}

function makeOpts(answer: number, n = 4): number[] {
  const set = new Set<number>([answer]);
  let attempts = 0;
  while (set.size < n && attempts < 60) {
    const delta = Math.floor(Math.random() * 6) + 1;
    const wrong = answer + (Math.random() > 0.5 ? delta : -delta);
    if (wrong !== answer && wrong >= 0) set.add(wrong);
    attempts++;
  }
  return [...set].sort(() => Math.random() - 0.5);
}

function genL1(): Question {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  if (Math.random() > 0.5) {
    return { text: `${a} + ${b} = ?`, answer: a + b, opts: makeOpts(a + b) };
  }
  const [hi, lo] = [Math.max(a, b), Math.min(a, b)];
  return { text: `${hi} - ${lo} = ?`, answer: hi - lo, opts: makeOpts(hi - lo) };
}

function genL2(): Question {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 2;
  return { text: `${a} × ${b} = ?`, answer: a * b, opts: makeOpts(a * b) };
}

function genL3(): Question {
  const roll = Math.random();
  if (roll < 0.4) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { text: `${a} × ${b} = ?`, answer: a * b, opts: makeOpts(a * b) };
  } else if (roll < 0.7) {
    const b = Math.floor(Math.random() * 8) + 2;
    const q = Math.floor(Math.random() * 9) + 2;
    return { text: `${q * b} ÷ ${b} = ?`, answer: q, opts: makeOpts(q) };
  } else {
    const a = Math.floor(Math.random() * 50) + 20;
    const b = Math.floor(Math.random() * 30) + 10;
    return { text: `${a} + ${b} = ?`, answer: a + b, opts: makeOpts(a + b) };
  }
}

function genL4(): Question {
  const roll = Math.random();
  if (roll < 0.3) {
    const a = Math.floor(Math.random() * 12) + 2;
    const b = Math.floor(Math.random() * 12) + 2;
    return { text: `${a} × ${b} = ?`, answer: a * b, opts: makeOpts(a * b) };
  } else if (roll < 0.55) {
    const b = Math.floor(Math.random() * 11) + 2;
    const q = Math.floor(Math.random() * 12) + 2;
    return { text: `${q * b} ÷ ${b} = ?`, answer: q, opts: makeOpts(q) };
  } else if (roll < 0.78) {
    const a = Math.floor(Math.random() * 200) + 100;
    const b = Math.floor(Math.random() * 100) + 50;
    return { text: `${a} + ${b} = ?`, answer: a + b, opts: makeOpts(a + b) };
  } else {
    const a = Math.floor(Math.random() * 200) + 100;
    const b = Math.floor(Math.random() * 80) + 20;
    return { text: `${a} - ${b} = ?`, answer: a - b, opts: makeOpts(a - b) };
  }
}

const LEVEL_CFGS: LevelCfg[] = [
  { speed: 60, winCount: 8,  livesMax: 3, label: 'L1', generateQuestion: genL1 },
  { speed: 95, winCount: 10, livesMax: 3, label: 'L2', generateQuestion: genL2 },
  { speed: 135, winCount: 12, livesMax: 3, label: 'L3', generateQuestion: genL3 },
  { speed: 180, winCount: 15, livesMax: 2, label: 'L4', generateQuestion: genL4 },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '⭐', diffLabel: '⭐',
    titleAr: 'الجمع والطرح', titleFr: 'Addition & Soustraction', titleEn: 'Addition & Subtraction',
    descAr: 'نيازك بطيئة — الجمع والطرح 1-10', descFr: 'Astéroïdes lents — +/- jusqu\'à 10', descEn: 'Slow asteroids — +/- up to 10',
    gradient: 'from-sky-400 to-blue-500' },
  { level: 2, emoji: '⭐⭐', diffLabel: '⭐⭐',
    titleAr: 'جداول الضرب (1-5)', titleFr: 'Tables de × (1-5)', titleEn: 'Times Tables (1-5)',
    descAr: 'تسريع النيازك — جداول 1 إلى 5', descFr: 'Astéroïdes plus rapides — tables 1 à 5', descEn: 'Faster — times tables 1–5',
    gradient: 'from-violet-400 to-purple-500' },
  { level: 3, emoji: '⭐⭐⭐', diffLabel: '⭐⭐⭐',
    titleAr: 'الضرب والقسمة', titleFr: 'Multiplication & Division', titleEn: 'Mult. & Division',
    descAr: 'نيازك سريعة — الضرب والقسمة والجمع', descFr: 'Vite ! ×, ÷ et +', descEn: 'Fast! ×, ÷ and +',
    gradient: 'from-amber-400 to-orange-500' },
  { level: 4, emoji: '🏆', diffLabel: '🏆',
    titleAr: 'التحدي الكبير', titleFr: 'Grand Défi !', titleEn: 'Ultimate Challenge!',
    descAr: 'كل العمليات — فقط حياتان!', descFr: 'Toutes les opérations — 2 vies seulement !', descEn: 'All ops — only 2 lives!',
    gradient: 'from-rose-500 to-red-600' },
];

const ASTEROID_COLORS = [0x6366f1, 0x8b5cf6, 0xa78bfa, 0x7c3aed, 0x4f46e5];
const QUESTION_COLOR = '#fff';

export const MathStarsGame: React.FC<MathStarsGameProps> = ({ onExit, onComplete, language = 'ar' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('math_stars', 4);
  const [phase, setPhase] = useState<'select' | 'play' | 'win' | 'lose'>('select');
  const [levelIdx, setLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [question, setQuestion] = useState<Question | null>(null);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);

  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeAsteroidRef = useRef<Phaser.GameObjects.Container | null>(null);
  const onMissRef = useRef<() => void>(() => {});
  const onHitRef = useRef<() => void>(() => {});
  const spawnRef = useRef<() => void>(() => {});
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const levelIdxRef = useRef(0);
  const phaseRef = useRef<'play' | 'paused'>('play');

  const setNextQuestion = useCallback(() => {
    const cfg = LEVEL_CFGS[levelIdxRef.current];
    const q = cfg.generateQuestion();
    setQuestion(q);
    return q;
  }, []);

  const handleAnswer = useCallback((opt: number, idx: number) => {
    if (!question || phaseRef.current !== 'play') return;
    if (opt === question.answer) {
      onHitRef.current();
      scoreRef.current++;
      setScore(scoreRef.current);
      const cfg = LEVEL_CFGS[levelIdxRef.current];
      if (scoreRef.current >= cfg.winCount) {
        phaseRef.current = 'paused';
        setPhase('win');
        return;
      }
      setTimeout(() => setNextQuestion(), 100);
    } else {
      setWrongIdx(idx);
      setTimeout(() => setWrongIdx(null), 600);
    }
  }, [question, setNextQuestion]);

  useEffect(() => {
    if (phase !== 'play') return;
    if (!containerRef.current) return;

    const cfg = LEVEL_CFGS[levelIdx];
    levelIdxRef.current = levelIdx;
    livesRef.current = cfg.livesMax;
    scoreRef.current = 0;
    phaseRef.current = 'play';
    setLives(cfg.livesMax);
    setScore(0);

    const W = Math.min(containerRef.current.clientWidth, 480);
    const H = Math.min(containerRef.current.clientHeight || 260, 260);

    let asteroidGfx: Phaser.GameObjects.Graphics | null = null;
    let asteroidText: Phaser.GameObjects.Text | null = null;
    let asteroidContainer: Phaser.GameObjects.Container | null = null;
    let fallTween: Phaser.Tweens.Tween | null = null;
    let currentQ: Question | null = null;

    class GameScene extends Phaser.Scene {
      constructor() { super('MathScene'); }

      create() {
        this.add.rectangle(W / 2, H / 2, W, H, 0x0f0c29);

        // Stars background
        for (let i = 0; i < 60; i++) {
          const x = Math.random() * W;
          const y = Math.random() * H;
          const r = Math.random() * 1.5 + 0.5;
          const alpha = Math.random() * 0.6 + 0.3;
          this.add.circle(x, y, r, 0xffffff, alpha);
        }

        const spawnAsteroid = (q: Question) => {
          currentQ = q;
          const color = Phaser.Utils.Array.GetRandom(ASTEROID_COLORS);
          const x = Phaser.Math.Between(50, W - 50);
          const radius = 34;

          if (asteroidContainer) { asteroidContainer.destroy(); }

          asteroidGfx = this.add.graphics();
          asteroidGfx.fillStyle(color, 1);
          asteroidGfx.fillCircle(0, 0, radius);
          asteroidGfx.fillStyle(0x000000, 0.15);
          asteroidGfx.fillCircle(-8, -8, radius * 0.55);
          asteroidGfx.lineStyle(2, 0xffffff, 0.4);
          asteroidGfx.strokeCircle(0, 0, radius);

          asteroidText = this.add.text(0, 0, q.text, {
            fontSize: q.text.length > 10 ? '12px' : '14px',
            fontFamily: 'monospace',
            color: QUESTION_COLOR,
            fontStyle: 'bold',
          }).setOrigin(0.5);

          asteroidContainer = this.add.container(x, -radius - 5, [asteroidGfx, asteroidText]);
          activeAsteroidRef.current = asteroidContainer;

          const duration = ((H + radius * 2) / cfg.speed) * 1000;
          fallTween = this.tweens.add({
            targets: asteroidContainer,
            y: H + radius + 5,
            duration,
            ease: 'Linear',
            onComplete: () => {
              if (phaseRef.current !== 'play') return;
              asteroidContainer?.destroy();
              asteroidContainer = null;
              livesRef.current--;
              setLives(livesRef.current);
              if (livesRef.current <= 0) {
                phaseRef.current = 'paused';
                setPhase('lose');
              } else {
                onMissRef.current();
              }
            },
          });
        };

        onHitRef.current = () => {
          if (asteroidContainer) {
            fallTween?.stop();
            this.tweens.add({
              targets: asteroidContainer,
              scaleX: 2.5, scaleY: 2.5, alpha: 0,
              duration: 300,
              onComplete: () => { asteroidContainer?.destroy(); asteroidContainer = null; },
            });
            for (let i = 0; i < 8; i++) {
              const px = asteroidContainer.x + Phaser.Math.Between(-20, 20);
              const py = asteroidContainer.y + Phaser.Math.Between(-20, 20);
              const p = this.add.star(px, py, 5, 3, 8, 0xfbbf24);
              this.tweens.add({
                targets: p,
                x: px + Phaser.Math.Between(-50, 50),
                y: py + Phaser.Math.Between(-50, 50),
                alpha: 0, angle: 360, scale: 0,
                duration: 600, onComplete: () => p.destroy(),
              });
            }
          }
        };

        onMissRef.current = () => {
          const q = setNextQuestion();
          spawnAsteroid(q);
        };

        spawnRef.current = () => {
          const q = setNextQuestion();
          spawnAsteroid(q);
        };

        spawnRef.current();
      }
    }

    if (gameRef.current) { gameRef.current.destroy(true); }

    const initialQ = cfg.generateQuestion();
    setQuestion(initialQ);

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: W,
      height: H,
      backgroundColor: '#0f0c29',
      scene: GameScene,
      parent: containerRef.current,
      transparent: false,
      render: { antialias: true },
      scale: { mode: Phaser.Scale.NONE },
    });

    return () => {
      if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; }
    };
  }, [phase, levelIdx, setNextQuestion]);

  const handleLevelSelect = (lvl: number) => {
    setLevelIdx(lvl - 1);
    setPhase('play');
  };

  if (phase === 'select') {
    const defs: LevelDef[] = LEVEL_DEFS.map((d) => ({
      ...d,
      unlocked: d.level <= maxUnlocked,
      earnedStars: stars[d.level] ?? 0,
    }));
      return (
      <LevelSelectScreen
        gameTitle={language === 'ar' ? 'حرب النجوم' : language === 'fr' ? 'Guerre des Étoiles' : 'Math Stars'}
        gameIcon="⭐"
        levels={defs}
        language={language}
        onSelectLevel={handleLevelSelect}
        onExit={onExit}
      />
    );
  }

  if (phase === 'win' || phase === 'lose') {
    const earned = phase === 'win' ? 30 * (levelIdx + 1) : 0;
    const starsEarned = phase === 'win' ? (lives === LEVEL_CFGS[levelIdx].livesMax ? 3 : lives > 0 ? 2 : 1) : 0;
    if (phase === 'win') completeLevel(levelIdx + 1, starsEarned);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 p-4" dir="rtl">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="bg-white rounded-4xl shadow-2xl p-8 text-center max-w-xs w-full"
        >
          <div className="text-6xl mb-3">{phase === 'win' ? '🏆' : '💥'}</div>
          <h2 className={`text-2xl font-extrabold mb-1 ${phase === 'win' ? 'text-amber-500' : 'text-rose-600'}`}>
            {phase === 'win' ? 'انتصرت!' : 'انتهت الحياة!'}
          </h2>
          <p className="text-slate-500 mb-2">
            أسقطت {score} نيزك{score !== 1 ? 'اً' : ''}
          </p>
          {phase === 'win' && (
            <div className="bg-amber-50 rounded-2xl px-4 py-2 mb-4 text-amber-700 font-bold text-lg">
              +{earned} XP ⭐
            </div>
          )}
          <div className="flex gap-2 mb-5 justify-center">
            <button
              onClick={() => { setPhase('play'); }}
              className="bg-slate-100 text-slate-700 rounded-2xl px-5 py-2 font-bold text-sm"
            >
              إعادة
            </button>
            <button
              onClick={() => setPhase('select')}
              className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl px-5 py-2 font-bold text-sm shadow"
            >
              اختيار المستوى
            </button>
            {phase === 'win' && (
              <button
                onClick={() => onComplete?.(earned)}
                className="bg-gradient-to-br from-emerald-400 to-green-500 text-white rounded-2xl px-5 py-2 font-bold text-sm shadow"
              >
                إنهاء 🏅
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const cfg = LEVEL_CFGS[levelIdx];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 p-3 pb-6" dir="rtl">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <button
          onClick={onExit}
          className="bg-white/10 rounded-2xl px-3 py-1.5 text-white/80 font-bold shadow text-sm"
        >
          ← خروج
        </button>
        <div className="text-center">
          <h1 className="text-base font-extrabold text-white">⭐ حرب النجوم</h1>
        </div>
        <button
          onClick={() => setPhase('select')}
          className="bg-white/10 rounded-2xl px-3 py-1.5 text-white/80 text-sm font-bold"
        >
          المستويات
        </button>
      </div>

      {/* Stats row */}
      <div className="w-full flex items-center justify-between max-w-md mb-2 px-1">
        <div className="flex gap-1">
          {Array.from({ length: cfg.livesMax }).map((_, i) => (
            <span key={i} className={`text-xl ${i < lives ? '' : 'opacity-20'}`}>❤️</span>
          ))}
        </div>
        <div className="text-white font-bold text-sm">
          💥 {score} / {cfg.winCount}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md bg-white/10 rounded-full h-2 mb-3">
        <motion.div
          className="bg-amber-400 h-2 rounded-full"
          animate={{ width: `${(score / cfg.winCount) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Phaser canvas */}
      <div
        ref={containerRef}
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        style={{ height: 240 }}
      />

      {/* Answer buttons */}
      <div className="w-full max-w-md mt-4 grid grid-cols-2 gap-2.5">
        <AnimatePresence>
          {question?.opts.map((opt, i) => (
            <motion.button
              key={`${question.text}-${opt}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleAnswer(opt, i)}
              className={`
                rounded-3xl py-4 font-extrabold text-xl shadow-lg transition-all duration-200
                ${wrongIdx === i
                  ? 'bg-rose-500 text-white ring-4 ring-rose-400'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}
              `}
            >
              {opt}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
