/**
 * TowerStackGame.tsx — بناء البرج
 * Classic block-stacking game using Phaser.
 * A block swings left-right; tap to drop it onto the tower.
 * The overhanging part falls; the remaining part becomes the next block.
 * 4 levels with increasing swing speed.
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { motion } from 'motion/react';
import { LevelSelectScreen, LevelDef } from '../preschool/LevelSelectScreen';
import { useLevelProgress } from '../preschool/useLevelProgress';

export interface TowerStackGameProps {
  onExit?: () => void;
  onComplete?: (xp: number) => void;
  language?: 'ar' | 'fr' | 'en';
}

interface LevelCfg {
  swingSpeed: number;
  winBlocks: number;
}

const LEVEL_CFGS: LevelCfg[] = [
  { swingSpeed: 100, winBlocks: 8  },
  { swingSpeed: 160, winBlocks: 10 },
  { swingSpeed: 230, winBlocks: 12 },
  { swingSpeed: 310, winBlocks: 15 },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🏗️', diffLabel: '⭐',
    titleAr: 'البنّاء المبتدئ', titleFr: 'Apprenti Bâtisseur', titleEn: 'Apprentice Builder',
    descAr: 'حركة بطيئة — ضع 8 طوابق!', descFr: 'Lent — pose 8 niveaux !', descEn: 'Slow — stack 8 floors!',
    gradient: 'from-teal-400 to-emerald-500' },
  { level: 2, emoji: '🏗️🏗️', diffLabel: '⭐⭐',
    titleAr: 'المهندس الصغير', titleFr: 'Petit Architecte', titleEn: 'Mini Architect',
    descAr: 'أسرع — 10 طوابق!', descFr: 'Plus vite — 10 niveaux !', descEn: 'Faster — 10 floors!',
    gradient: 'from-emerald-500 to-green-600' },
  { level: 3, emoji: '🏙️', diffLabel: '⭐⭐⭐',
    titleAr: 'بنّاء محترف', titleFr: 'Constructeur Expert', titleEn: 'Expert Builder',
    descAr: 'تحدٍّ حقيقي — 12 طابقاً!', descFr: 'Défi réel — 12 étages !', descEn: 'Real challenge — 12 floors!',
    gradient: 'from-cyan-500 to-teal-700' },
  { level: 4, emoji: '🏆🏙️', diffLabel: '🏆',
    titleAr: 'ناطحة سحاب', titleFr: 'Gratte-ciel', titleEn: 'Skyscraper!',
    descAr: 'سرعة قصوى — 15 طابقاً!', descFr: 'Max vitesse — 15 étages !', descEn: 'Max speed — 15 floors!',
    gradient: 'from-blue-500 to-indigo-700' },
];

const BLOCK_COLORS = [
  0xf97316, 0xef4444, 0xeab308, 0x22c55e,
  0x06b6d4, 0x6366f1, 0xa855f7, 0xec4899,
];

export const TowerStackGame: React.FC<TowerStackGameProps> = ({ onExit, onComplete, language = 'ar' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('tower_stack', 4);
  const [phase, setPhase] = useState<'select' | 'play' | 'win' | 'lose'>('select');
  const [levelIdx, setLevelIdx] = useState(0);
  const [stackCount, setStackCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const stackRef = useRef(0);
  const phaseRef = useRef<'play' | 'done'>('play');

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;

    const cfg = LEVEL_CFGS[levelIdx];
    stackRef.current = 0;
    phaseRef.current = 'play';
    setStackCount(0);

    const W = Math.min(containerRef.current.clientWidth, 480);
    const H = 340;
    const INITIAL_W = Math.floor(W * 0.55);
    const BLOCK_H = 24;
    const GROUND_Y = H - 30;

    class StackScene extends Phaser.Scene {
      blocks: Array<{ x: number; w: number; y: number; color: number }> = [];
      movingX = 0;
      movingW = INITIAL_W;
      movingDir = 1;
      movingColor = 0;
      colorIdx = 0;
      canPlace = true;
      bgGfx!: Phaser.GameObjects.Graphics;
      towerGfx!: Phaser.GameObjects.Graphics;
      movingGfx!: Phaser.GameObjects.Graphics;
      scoreText!: Phaser.GameObjects.Text;
      heightOffset = 0;
      cameraY = 0;

      constructor() { super('StackScene'); }

      get stackTopY(): number {
        return GROUND_Y - this.blocks.length * BLOCK_H - this.heightOffset;
      }

      drawBg() {
        this.bgGfx.clear();
        // Sky gradient
        this.bgGfx.fillGradientStyle(0x0f172a, 0x0f172a, 0x1e3a5f, 0x1e3a5f, 1);
        this.bgGfx.fillRect(0, 0, W, H);
        // Grid lines (building guide)
        this.bgGfx.lineStyle(1, 0x334155, 0.3);
        for (let gx = 0; gx < W; gx += 40) {
          this.bgGfx.lineBetween(gx, 0, gx, H);
        }
        // Ground
        this.bgGfx.fillStyle(0x374151);
        this.bgGfx.fillRect(0, GROUND_Y + 2, W, H - GROUND_Y - 2);
        this.bgGfx.fillStyle(0x4b5563);
        this.bgGfx.fillRect(0, GROUND_Y, W, 4);
      }

      drawTower() {
        this.towerGfx.clear();
        this.blocks.forEach((b, i) => {
          const y = GROUND_Y - (i + 1) * BLOCK_H - this.heightOffset;
          if (y < -BLOCK_H || y > H) return;
          // Block shadow
          this.towerGfx.fillStyle(0x000000, 0.25);
          this.towerGfx.fillRect(b.x - b.w / 2 + 3, y + 3, b.w, BLOCK_H);
          // Block body
          this.towerGfx.fillStyle(b.color);
          this.towerGfx.fillRoundedRect(b.x - b.w / 2, y, b.w, BLOCK_H - 2, 4);
          // Highlight on top
          this.towerGfx.fillStyle(0xffffff, 0.2);
          this.towerGfx.fillRoundedRect(b.x - b.w / 2, y, b.w, 5, { tl: 4, tr: 4, bl: 0, br: 0 });
        });
      }

      drawMoving() {
        this.movingGfx.clear();
        const y = this.stackTopY - BLOCK_H;
        if (y > H) return;
        // Glow effect
        this.movingGfx.fillStyle(this.movingColor, 0.25);
        this.movingGfx.fillRoundedRect(this.movingX - this.movingW / 2 - 4, y - 4, this.movingW + 8, BLOCK_H + 6, 6);
        // Block
        this.movingGfx.fillStyle(this.movingColor);
        this.movingGfx.fillRoundedRect(this.movingX - this.movingW / 2, y, this.movingW, BLOCK_H - 2, 4);
        this.movingGfx.fillStyle(0xffffff, 0.2);
        this.movingGfx.fillRoundedRect(this.movingX - this.movingW / 2, y, this.movingW, 5, { tl: 4, tr: 4, bl: 0, br: 0 });
      }

      create() {
        this.bgGfx   = this.add.graphics().setDepth(0);
        this.towerGfx = this.add.graphics().setDepth(1);
        this.movingGfx = this.add.graphics().setDepth(2);

        // First base block (always centered)
        this.blocks.push({ x: W / 2, w: INITIAL_W, y: GROUND_Y - BLOCK_H, color: BLOCK_COLORS[0] });
        this.colorIdx = 1;
        this.movingColor = BLOCK_COLORS[1];
        this.movingX = W * 0.1;
        this.movingW = INITIAL_W;

        this.scoreText = this.add.text(W / 2, 8, '0', {
          fontSize: '20px', fontFamily: 'monospace', color: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5, 0).setDepth(10);

        this.input.on('pointerdown', () => this.place());
        if (this.input.keyboard) {
          this.input.keyboard.on('keydown-SPACE', () => this.place());
        }
      }

      place() {
        if (!this.canPlace || phaseRef.current === 'done') return;
        this.canPlace = false;

        const prevBlock = this.blocks[this.blocks.length - 1];
        const left  = Math.max(this.movingX - this.movingW / 2, prevBlock.x - prevBlock.w / 2);
        const right = Math.min(this.movingX + this.movingW / 2, prevBlock.x + prevBlock.w / 2);
        const overlap = right - left;

        if (overlap <= 4) {
          // Missed — game over
          phaseRef.current = 'done';
          // Drop animation
          this.tweens.add({
            targets: this.movingGfx,
            alpha: 0,
            y: H,
            duration: 500,
          });
          this.time.delayedCall(600, () => setPhase('lose'));
          return;
        }

        const newX = (left + right) / 2;
        const newW = overlap;
        this.colorIdx = (this.colorIdx + 1) % BLOCK_COLORS.length;
        const newColor = BLOCK_COLORS[this.colorIdx];
        this.blocks.push({ x: newX, w: newW, y: this.stackTopY, color: newColor });

        // Flash effect
        this.cameras.main.flash(80, 255, 255, 255, true);

        stackRef.current++;
        setStackCount(stackRef.current);
        this.scoreText.setText(String(stackRef.current));

        // Scroll camera up as tower grows
        if (this.blocks.length > 6) {
          this.heightOffset = (this.blocks.length - 6) * BLOCK_H;
        }

        if (stackRef.current >= cfg.winBlocks) {
          phaseRef.current = 'done';
          this.time.delayedCall(400, () => setPhase('win'));
          return;
        }

        this.movingColor = BLOCK_COLORS[(this.colorIdx + 1) % BLOCK_COLORS.length];
        this.movingW = newW;
        this.movingX = Phaser.Math.Between(0, 1) ? W * 0.15 : W * 0.85;
        this.movingDir = this.movingX < W / 2 ? 1 : -1;
        this.time.delayedCall(100, () => { this.canPlace = true; });
      }

      update(time: number, delta: number) {
        if (phaseRef.current === 'done') return;
        // Move block left-right
        this.movingX += this.movingDir * (cfg.swingSpeed * delta) / 1000;
        const halfW = this.movingW / 2;
        if (this.movingX + halfW > W * 0.9) { this.movingX = W * 0.9 - halfW; this.movingDir = -1; }
        if (this.movingX - halfW < W * 0.1) { this.movingX = W * 0.1 + halfW; this.movingDir = 1; }

        this.drawBg();
        this.drawTower();
        this.drawMoving();
      }
    }

    if (gameRef.current) { gameRef.current.destroy(true); }
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: W,
      height: H,
      backgroundColor: '#0f172a',
      scene: StackScene,
      parent: containerRef.current,
      render: { antialias: true },
      scale: { mode: Phaser.Scale.NONE },
    });

    return () => {
      if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; }
    };
  }, [phase, levelIdx]);

  const handleLevelSelect = (lvl: number) => {
    setLevelIdx(lvl - 1);
    setPhase('play');
  };

  if (phase === 'select') {
    const defs: LevelDef[] = LEVEL_DEFS.map((d) => ({
      ...d, unlocked: d.level <= maxUnlocked, earnedStars: stars[d.level] ?? 0,
    }));
    return (
      <LevelSelectScreen
        gameTitle={language === 'ar' ? 'بناء البرج' : language === 'fr' ? 'Construis la Tour' : 'Tower Stack'}
        gameIcon="🏗️"
        levels={defs}
        language={language}
        onSelectLevel={handleLevelSelect}
        onExit={onExit}
      />
    );
  }

  if (phase === 'win' || phase === 'lose') {
    const earned = phase === 'win' ? 20 * (levelIdx + 1) : 0;
    const starsEarned = phase === 'win' ? 3 : 0;
    if (phase === 'win') completeLevel(levelIdx + 1, starsEarned);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-teal-900 p-4" dir="rtl">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="bg-white rounded-4xl shadow-2xl p-8 text-center max-w-xs w-full"
        >
          <div className="text-6xl mb-3">{phase === 'win' ? '🏙️' : '💥'}</div>
          <h2 className={`text-2xl font-extrabold mb-1 ${phase === 'win' ? 'text-teal-600' : 'text-rose-600'}`}>
            {phase === 'win' ? 'برج رائع! 🏗️' : 'انهار البرج!'}
          </h2>
          <p className="text-slate-500 mb-2">طوابق: {stackCount}</p>
          {phase === 'win' && (
            <div className="bg-amber-50 rounded-2xl px-4 py-2 mb-4 text-amber-700 font-bold text-lg">
              +{earned} XP ⭐
            </div>
          )}
          <div className="flex gap-2 mb-5 justify-center">
            <button onClick={() => setPhase('play')} className="bg-slate-100 text-slate-700 rounded-2xl px-5 py-2 font-bold text-sm">
              إعادة
            </button>
            <button onClick={() => setPhase('select')} className="bg-gradient-to-br from-teal-400 to-emerald-600 text-white rounded-2xl px-5 py-2 font-bold text-sm shadow">
              المستويات
            </button>
            {phase === 'win' && (
              <button onClick={() => onComplete?.(earned)} className="bg-gradient-to-br from-emerald-400 to-green-500 text-white rounded-2xl px-5 py-2 font-bold text-sm shadow">
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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-900 to-teal-900 p-3 pb-6" dir="rtl">
      <div className="w-full flex items-center justify-between mb-2">
        <button onClick={onExit} className="bg-white/10 rounded-2xl px-3 py-1.5 text-white/80 font-bold text-sm">
          ← خروج
        </button>
        <h1 className="text-base font-extrabold text-white">🏗️ بناء البرج</h1>
        <button onClick={() => setPhase('select')} className="bg-white/10 rounded-2xl px-3 py-1.5 text-white/80 text-sm font-bold">
          المستويات
        </button>
      </div>

      <div className="w-full max-w-md flex items-center gap-3 mb-2">
        <span className="text-white font-extrabold text-lg">{stackCount}</span>
        <div className="flex-1 bg-white/10 rounded-full h-3">
          <motion.div
            className="bg-teal-400 h-3 rounded-full"
            animate={{ width: `${Math.min((stackCount / cfg.winBlocks) * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-white/60 text-sm">{cfg.winBlocks}</span>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      />

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          const game = gameRef.current;
          if (game) {
            const scene = game.scene.getScene('StackScene') as any;
            if (scene && scene.place) scene.place();
          }
        }}
        className="w-full max-w-md mt-4 bg-white/10 border border-white/20 rounded-3xl py-5 text-white font-extrabold text-xl shadow-lg active:bg-white/20"
      >
        🏗️ ضع الطابق / Pose !
      </motion.button>
    </div>
  );
};
