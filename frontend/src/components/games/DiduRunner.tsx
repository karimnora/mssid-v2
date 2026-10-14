import { useActivityExitGuard } from '../../context/ActivityExitContext';
/**
 * DiduRunner.tsx — ديدو العدّاء
 * 2D side-scrolling endless runner using Phaser.js.
 * Tap / Space to jump. 4 difficulty levels.
 * Everything drawn programmatically — no external assets needed.
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { motion, AnimatePresence } from 'motion/react';
import { LevelSelectScreen, LevelDef } from '../preschool/LevelSelectScreen';
import { useLevelProgress } from '../preschool/useLevelProgress';

export interface DiduRunnerProps {
  onExit?: () => void;
  onComplete?: (xp: number) => void;
  language?: 'ar' | 'fr' | 'en';
}

interface LevelCfg {
  scrollSpeed: number;
  spawnMin: number;
  spawnMax: number;
  winScore: number;
  gravity: number;
  jumpVel: number;
}

const LEVEL_CFGS: LevelCfg[] = [
  { scrollSpeed: 220, spawnMin: 1600, spawnMax: 2800, winScore: 25,  gravity: 900, jumpVel: -520 },
  { scrollSpeed: 300, spawnMin: 1200, spawnMax: 2200, winScore: 40,  gravity: 950, jumpVel: -540 },
  { scrollSpeed: 390, spawnMin:  900, spawnMax: 1700, winScore: 60,  gravity: 1000, jumpVel: -560 },
  { scrollSpeed: 490, spawnMin:  700, spawnMax: 1400, winScore: 80,  gravity: 1050, jumpVel: -590 },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🦊', diffLabel: '⭐',
    titleAr: 'الصحراء الهادئة', titleFr: 'Désert Tranquille', titleEn: 'Calm Desert',
    descAr: 'سرعة بطيئة — ابدأ مغامرتك!', descFr: 'Vitesse lente — commence l\'aventure !', descEn: 'Slow speed — start your adventure!',
    gradient: 'from-orange-400 to-amber-500' },
  { level: 2, emoji: '🦊💨', diffLabel: '⭐⭐',
    titleAr: 'عاصفة الرمال', titleFr: 'Tempête de Sable', titleEn: 'Sand Storm',
    descAr: 'العقبات تتسارع!', descFr: 'Les obstacles s\'accélèrent !', descEn: 'Obstacles getting faster!',
    gradient: 'from-amber-500 to-orange-600' },
  { level: 3, emoji: '⚡🦊', diffLabel: '⭐⭐⭐',
    titleAr: 'عدو البرق', titleFr: 'Sprint Éclair', titleEn: 'Lightning Sprint',
    descAr: 'ديدو يتسارع — ركّز جيداً!', descFr: 'Dido accélère — concentre-toi !', descEn: 'Dido speeds up — focus!',
    gradient: 'from-rose-500 to-red-600' },
  { level: 4, emoji: '🏆🦊', diffLabel: '🏆',
    titleAr: 'سيد الصحراء', titleFr: 'Maître du Désert', titleEn: 'Desert Master',
    descAr: 'السرعة القصوى — للأبطال فقط!', descFr: 'Vitesse max — pour les héros !', descEn: 'Max speed — heroes only!',
    gradient: 'from-fuchsia-600 to-purple-700' },
];

// Obstacle colors palette
const OBS_COLORS = [0x22c55e, 0x16a34a, 0x15803d];
const GROUND_COLOR = 0xe2a653;
const GROUND_DARK  = 0xb5813a;
const SKY_TOP      = 0x1e3a5f;
const SKY_BOT      = 0x7b5ea7;
const DIDU_COLOR   = 0xf97316;
const DIDU_EAR     = 0xfed7aa;

export const DiduRunner: React.FC<DiduRunnerProps> = ({ onExit, onComplete, language = 'ar' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('dido_runner', 4);
  const [phase, setPhase] = useState<'select' | 'play' | 'win' | 'lose'>('select');
  const requestLeave = useActivityExitGuard(phase === 'play', language);
  const [levelIdx, setLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const scoreRef = useRef(0);
  const phaseRef = useRef<'play' | 'done'>('play');

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;

    const cfg = LEVEL_CFGS[levelIdx];
    scoreRef.current = 0;
    phaseRef.current = 'play';
    setScore(0);

    const W = Math.min(containerRef.current.clientWidth, 480);
    const H = 280;
    const GROUND_Y = H - 48;
    const DIDU_X = 80;

    class RunnerScene extends Phaser.Scene {
      didu!: Phaser.GameObjects.Graphics;
      diduBody!: Phaser.Types.Physics.Arcade.ImageWithStaticBody | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      ground!: Phaser.Physics.Arcade.StaticGroup;
      obstacles!: Phaser.Physics.Arcade.Group;
      bgGraphics!: Phaser.GameObjects.Graphics;
      fgGraphics!: Phaser.GameObjects.Graphics;
      scoreText!: Phaser.GameObjects.Text;
      spawnTimer?: Phaser.Time.TimerEvent;
      scoreTimer?: Phaser.Time.TimerEvent;
      isOnGround = true;
      scrollX = 0;
      alive = true;

      constructor() { super('RunnerScene'); }

      drawBackground() {
        this.bgGraphics.clear();
        // Sky gradient (simulated with bands)
        this.bgGraphics.fillGradientStyle(SKY_TOP, SKY_TOP, SKY_BOT, SKY_BOT, 1);
        this.bgGraphics.fillRect(0, 0, W, GROUND_Y);

        // Stars/dots in sky
        for (let i = 0; i < 30; i++) {
          const sx = (((i * 137 + this.scrollX * 0.1) % (W + 60)) - 30 + W) % W;
          const sy = (i * 53) % (GROUND_Y - 20);
          this.bgGraphics.fillStyle(0xffffff, 0.5 + (i % 3) * 0.15);
          this.bgGraphics.fillCircle(sx, sy, 1.5);
        }

        // Dunes
        this.bgGraphics.fillStyle(0xc47a20, 0.5);
        for (let d = 0; d < 4; d++) {
          const dx = ((d * 200 - this.scrollX * 0.3) % (W + 200) + W + 200) % (W + 200) - 100;
          this.bgGraphics.fillEllipse(dx, GROUND_Y - 5, 200, 60);
        }

        // Ground
        this.bgGraphics.fillStyle(GROUND_COLOR);
        this.bgGraphics.fillRect(0, GROUND_Y, W, H - GROUND_Y);
        this.bgGraphics.fillStyle(GROUND_DARK);
        this.bgGraphics.fillRect(0, GROUND_Y, W, 6);

        // Ground texture lines
        for (let t = 0; t < 12; t++) {
          const tx = ((t * 80 - this.scrollX) % (W + 80) + W + 80) % (W + 80) - 40;
          this.bgGraphics.fillStyle(0xb07820, 0.6);
          this.bgGraphics.fillRect(tx, GROUND_Y + 12, 30, 2);
        }
      }

      drawDidu(g: Phaser.GameObjects.Graphics) {
        g.clear();
        // Shadow
        g.fillStyle(0x000000, 0.15);
        g.fillEllipse(0, 18, 34, 10);

        // Tail (behind body)
        g.fillStyle(DIDU_COLOR);
        g.fillEllipse(-16, 4, 18, 12);
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(-20, 2, 5);

        // Body
        g.fillStyle(DIDU_COLOR);
        g.fillEllipse(0, 0, 36, 30);

        // Head
        g.fillStyle(DIDU_COLOR);
        g.fillCircle(14, -8, 14);

        // Ears (pointy fennec ears)
        g.fillStyle(DIDU_COLOR);
        g.fillTriangle(8, -20, 16, -35, 20, -18);
        g.fillTriangle(18, -18, 28, -32, 30, -16);
        g.fillStyle(DIDU_EAR);
        g.fillTriangle(10, -21, 16, -31, 20, -19);
        g.fillTriangle(20, -19, 27, -28, 29, -17);

        // Eye
        g.fillStyle(0xffffff);
        g.fillCircle(20, -10, 5);
        g.fillStyle(0x1e293b);
        g.fillCircle(22, -10, 3);
        g.fillStyle(0xffffff);
        g.fillCircle(23, -11, 1);

        // Nose
        g.fillStyle(0x1e293b);
        g.fillCircle(28, -6, 2);

        // Feet (animated with running cycle)
        const runPhase = (this.time.now / 80) % (Math.PI * 2);
        g.fillStyle(DIDU_COLOR);
        g.fillEllipse(-4 + Math.sin(runPhase) * 5, 16, 12, 8);
        g.fillEllipse(8 + Math.sin(runPhase + Math.PI) * 5, 16, 12, 8);
      }

      create() {
        this.bgGraphics = this.add.graphics().setDepth(0);
        this.fgGraphics = this.add.graphics().setDepth(3);

        // Ground physics body (invisible, just for collision)
        this.ground = this.physics.add.staticGroup();
        const groundBody = this.add.rectangle(W / 2, GROUND_Y + 10, W, 20, 0x000000, 0);
        this.physics.add.existing(groundBody, true);
        this.ground.add(groundBody);

        // Dido visual
        this.didu = this.add.graphics().setDepth(2);
        // Physics proxy
        const proxy = this.add.rectangle(DIDU_X, GROUND_Y - 16, 28, 32, 0xff0000, 0);
        this.physics.add.existing(proxy);
        const body = proxy.body as Phaser.Physics.Arcade.Body;
        body.setGravityY(cfg.gravity);
        body.setCollideWorldBounds(true);
        this.diduBody = proxy as any;

        this.physics.add.collider(this.diduBody, this.ground, () => { this.isOnGround = true; });

        // Obstacles group
        this.obstacles = this.physics.add.group();
        this.physics.add.overlap(this.diduBody, this.obstacles, () => {
          if (!this.alive) return;
          this.alive = false;
          phaseRef.current = 'done';
          this.spawnTimer?.destroy();
          this.scoreTimer?.destroy();
          this.time.delayedCall(400, () => setPhase('lose'));
        });

        // Score HUD
        this.scoreText = this.add.text(W / 2, 12, '0', {
          fontSize: '18px', fontFamily: 'monospace', color: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5, 0).setDepth(10);

        // Jump input
        this.input.on('pointerdown', () => this.jump());
        if (this.input.keyboard) {
          this.input.keyboard.on('keydown-SPACE', () => this.jump());
          this.input.keyboard.on('keydown-UP', () => this.jump());
        }

        // Score ticker
        this.scoreTimer = this.time.addEvent({
          delay: 400, loop: true, callback: () => {
            if (!this.alive || phaseRef.current === 'done') return;
            scoreRef.current++;
            setScore(scoreRef.current);
            this.scoreText.setText(String(scoreRef.current));
            if (scoreRef.current >= cfg.winScore) {
              this.alive = false;
              phaseRef.current = 'done';
              this.spawnTimer?.destroy();
              this.scoreTimer?.destroy();
              this.time.delayedCall(400, () => setPhase('win'));
            }
          },
        });

        this.spawnObstacle();
      }

      jump() {
        if (!this.alive) return;
        const body = this.diduBody.body as Phaser.Physics.Arcade.Body;
        if (this.isOnGround) {
          body.setVelocityY(cfg.jumpVel);
          this.isOnGround = false;
        }
      }

      spawnObstacle() {
        if (phaseRef.current === 'done') return;
        const delay = Phaser.Math.Between(cfg.spawnMin, cfg.spawnMax);
        this.spawnTimer = this.time.delayedCall(delay, () => {
          if (phaseRef.current === 'done') return;
          const h = Phaser.Math.Between(28, 50);
          const w = Phaser.Math.Between(18, 30);
          const color = Phaser.Utils.Array.GetRandom(OBS_COLORS);
          // Draw obstacle as cactus-like shape
          const g = this.add.graphics().setDepth(2);
          g.fillStyle(color);
          g.fillRect(-w / 2, -h, w, h);
          // Cactus arms
          if (h > 36) {
            g.fillRect(-w / 2 - 10, -h * 0.65, 10, h * 0.3);
            g.fillRect(w / 2, -h * 0.5, 10, h * 0.25);
          }
          g.x = W + 20;
          g.y = GROUND_Y;

          // Physics body for collision
          const rect = this.add.rectangle(W + 20, GROUND_Y - h / 2, w - 4, h, 0xff0000, 0);
          this.physics.add.existing(rect);
          const body = rect.body as Phaser.Physics.Arcade.Body;
          body.setAllowGravity(false);
          body.setVelocityX(-cfg.scrollSpeed);
          body.setImmovable(true);
          this.obstacles.add(rect);

          // Sync graphics to physics rect each update
          (rect as any).__gfx = g;

          this.time.delayedCall(5000, () => { g.destroy(); rect.destroy(); });
          this.spawnObstacle();
        });
      }

      update() {
        this.scrollX += cfg.scrollSpeed / 60;
        this.drawBackground();

        // Update obstacle graphics positions
        this.obstacles.getChildren().forEach((child) => {
          const rect = child as Phaser.GameObjects.Rectangle;
          const g = (rect as any).__gfx as Phaser.GameObjects.Graphics;
          if (g && g.active) {
            g.x = rect.x;
          }
        });

        // Draw Didu at physics position
        const body = this.diduBody.body as Phaser.Physics.Arcade.Body;
        this.didu.x = body.x + body.width / 2;
        this.didu.y = body.y + body.height / 2 - 2;
        this.drawDidu(this.didu);
      }
    }

    if (gameRef.current) { gameRef.current.destroy(true); }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: W,
      height: H,
      backgroundColor: '#1e3a5f',
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      scene: RunnerScene,
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
        gameTitle={language === 'ar' ? 'ديدو العدّاء' : language === 'fr' ? 'Dido le Coureur' : 'Dido Runner'}
        gameIcon="🦊"
        levels={defs}
        language={language}
        onSelectLevel={handleLevelSelect}
        onExit={onExit}
      />
    );
  }

  if (phase === 'win' || phase === 'lose') {
    const earned = phase === 'win' ? 20 * (levelIdx + 1) : 0;
    const starsEarned = phase === 'win' ? (score >= LEVEL_CFGS[levelIdx].winScore * 0.9 ? 3 : 2) : 0;
    if (phase === 'win') completeLevel(levelIdx + 1, starsEarned);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-900 to-amber-900 p-4" dir="rtl">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="bg-white rounded-4xl shadow-2xl p-8 text-center max-w-xs w-full"
        >
          <div className="text-6xl mb-3">{phase === 'win' ? '🏆' : '💥'}</div>
          <h2 className={`text-2xl font-extrabold mb-1 ${phase === 'win' ? 'text-amber-600' : 'text-rose-600'}`}>
            {phase === 'win' ? 'أحسنت ديدو! 🦊' : 'اصطدم ديدو!'}
          </h2>
          <p className="text-slate-500 mb-2">النقاط: {score}</p>
          {phase === 'win' && (
            <div className="bg-amber-50 rounded-2xl px-4 py-2 mb-4 text-amber-700 font-bold text-lg">
              +{earned} XP ⭐
            </div>
          )}
          <div className="flex gap-2 mb-5 justify-center">
            <button
              onClick={() => setPhase('play')}
              className="bg-slate-100 text-slate-700 rounded-2xl px-5 py-2 font-bold text-sm"
            >
              إعادة
            </button>
            <button
              onClick={() => requestLeave(() => setPhase('select'))}
              className="bg-gradient-to-br from-orange-400 to-rose-500 text-white rounded-2xl px-5 py-2 font-bold text-sm shadow"
            >
              المستويات
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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-orange-900 to-amber-800 p-3 pb-6" dir="rtl">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <button onClick={() => { if (onExit) requestLeave(onExit); }} className="bg-white/10 rounded-2xl px-3 py-1.5 text-white/80 font-bold text-sm">
          ← خروج
        </button>
        <h1 className="text-base font-extrabold text-white">🦊 ديدو العدّاء</h1>
        <button onClick={() => requestLeave(() => setPhase('select'))} className="bg-white/10 rounded-2xl px-3 py-1.5 text-white/80 text-sm font-bold">
          المستويات
        </button>
      </div>

      {/* Score + progress */}
      <div className="w-full max-w-md flex items-center gap-3 mb-2">
        <span className="text-white font-extrabold text-lg">{score}</span>
        <div className="flex-1 bg-white/10 rounded-full h-3">
          <motion.div
            className="bg-amber-400 h-3 rounded-full"
            animate={{ width: `${Math.min((score / cfg.winScore) * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-white/60 text-sm">{cfg.winScore}</span>
      </div>

      {/* Phaser canvas */}
      <div
        ref={containerRef}
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      />

      {/* Mobile jump button */}
      <div className="w-full max-w-md mt-4 px-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            const game = gameRef.current;
            if (game) {
              const scene = game.scene.getScene('RunnerScene') as any;
              if (scene && scene.jump) scene.jump();
            }
          }}
          className="w-full bg-white/10 border border-white/20 rounded-3xl py-5 text-white font-extrabold text-xl shadow-lg active:bg-white/20"
        >
          🦊 اقفز! / Jump!
        </motion.button>
      </div>
    </div>
  );
};
