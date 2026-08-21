/**
 * BalloonPopGame.tsx
 * 4 niveaux de difficulté croissante — Phaser + responsive.
 * L1: lents, grands. L2: plus rapides. L3: petits + durée de vie limitée.
 * L4: défi rapide, durée 3 s par ballon.
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';

export interface BalloonPopGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

interface LevelCfg {
  spawnDelay: number;
  minSpeed: number; maxSpeed: number;
  minR: number; maxR: number;
  winCount: number;
  lifetime: number | null; // ms before auto-pop (null = infinite)
}
const LEVELS: LevelCfg[] = [
  { spawnDelay: 1500, minSpeed: 65,  maxSpeed: 110, minR: 22, maxR: 28, winCount: 10, lifetime: null },
  { spawnDelay: 1100, minSpeed: 90,  maxSpeed: 150, minR: 18, maxR: 26, winCount: 15, lifetime: null },
  { spawnDelay:  820, minSpeed: 110, maxSpeed: 185, minR: 15, maxR: 24, winCount: 20, lifetime: 4500 },
  { spawnDelay:  600, minSpeed: 135, maxSpeed: 220, minR: 12, maxR: 22, winCount: 25, lifetime: 3000 },
];
const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🎈', diffLabel: '⭐',
    titleAr: 'المستوى السهل',       titleFr: 'Niveau Facile',     titleEn: 'Easy Level',
    descAr:  'بالونات كبيرة وبطيئة', descFr:  'Ballons lents et grands', descEn: 'Slow, big balloons',
    gradient: 'from-rose-400 to-pink-500' },
  { level: 2, emoji: '🎈🎈', diffLabel: '⭐⭐',
    titleAr: 'متوسط',         titleFr: 'Moyen',          titleEn: 'Medium',
    descAr:  'أسرع وأكثر',   descFr:  'Plus vite!',     descEn:  'Faster & more!',
    gradient: 'from-rose-500 to-fuchsia-600' },
  { level: 3, emoji: '🎈💨', diffLabel: '⭐⭐⭐',
    titleAr: 'صعب – بالونات سريعة وقصيرة العمر',  titleFr: 'Difficile – ils s\'envolent vite!', titleEn: 'Hard – they fly fast!',
    descAr:  'ينفجر البالون وحده بعد 4 ث',       descFr:  'Le ballon éclate seul en 4 s',      descEn: 'Balloon pops itself in 4 s',
    gradient: 'from-fuchsia-500 to-purple-600' },
  { level: 4, emoji: '🏆', diffLabel: '🏆',
    titleAr: 'التحدي الكبير',         titleFr: 'Grand Défi !',          titleEn: 'Big Challenge!',
    descAr:  '3 ثوانٍ فقط لكل بالون', descFr:  '3 secondes par ballon', descEn: '3 seconds per balloon',
    gradient: 'from-amber-500 to-orange-600' },
];

const COLORS = [0xef4444, 0x3b82f6, 0xfbbf24, 0x22c55e, 0xa855f7, 0xf97316, 0xec4899, 0x06b6d4];

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('balloon_pop', 4);
  const [phase, setPhase]       = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);
  const onWinRef     = useRef<(s: number) => void>(() => {});

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  // Wire up the win callback each render
  onWinRef.current = (s: number) => {
    completeLevel(activeLevel, s);
    setPhase('select');
  };

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;
    const W = 640, H = 420;
    const cfg = LEVELS[activeLevel - 1];

    const labels = {
      score: t('نقاط', 'Points', 'Score'),
      tap:   t('👆 اضغط على البالونات!', '👆 Touche les ballons !', '👆 Tap the balloons!'),
      win:   t('🎉 رائع! أحسنت! 🏆', '🎉 Super ! Bravo ! 🏆', '🎉 Amazing! Well done! 🏆'),
      lvl:   t(`المستوى ${activeLevel}`, `Niveau ${activeLevel}`, `Level ${activeLevel}`),
    };

    class Scene extends Phaser.Scene {
      private group!: Phaser.Physics.Arcade.Group;
      private score = 0;
      private scoreTxt!: Phaser.GameObjects.Text;
      private done = false;

      constructor() { super('B'); }

      create() {
        // Sky gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xbae6fd, 0xbae6fd, 0x38bdf8, 0x0ea5e9, 1);
        bg.fillRect(0, 0, W, H);
        const cg = this.add.graphics().fillStyle(0xffffff, 0.75);
        [[80, 55], [440, 72], [260, 38]].forEach(([cx, cy]) => {
          cg.fillCircle(cx, cy, 22); cg.fillCircle(cx + 26, cy - 8, 17);
          cg.fillCircle(cx - 20, cy - 5, 14); cg.fillCircle(cx + 48, cy, 19);
        });
        const grd = this.add.graphics();
        grd.fillStyle(0x4ade80); grd.fillRect(0, H - 28, W, 28);
        grd.fillStyle(0x22c55e); grd.fillRect(0, H - 18, W, 18);

        // Balloon textures per level (scaling radius)
        COLORS.forEach((col, i) => {
          const r = Phaser.Math.Between(cfg.minR, cfg.maxR);
          const g = this.add.graphics();
          g.fillStyle(col); g.fillEllipse(r, r * 1.2, r * 2, r * 2.4);
          g.fillStyle(0xffffff, 0.35); g.fillEllipse(r - r * 0.3, r - r * 0.2, r * 0.6, r * 0.9);
          g.fillStyle(col); g.fillTriangle(r - 3, r * 2.4, r + 3, r * 2.4, r, r * 2.7);
          g.lineStyle(1.5, 0xffffff, 0.4);
          const sy = r * 2.8, ey = r * 2.8 + 30;
          for (let s = sy; s < ey; s += 6) {
            g.beginPath(); g.moveTo(r + Math.sin(s * 0.6) * 5, s);
            g.lineTo(r + Math.sin((s + 3) * 0.6) * 5, s + 3); g.strokePath();
          }
          g.generateTexture(`bal${i}`, r * 2 + 2, ey + 4); g.destroy();
        });

        this.group = this.physics.add.group();
        this.time.addEvent({ delay: cfg.spawnDelay, loop: true, callback: () => { if (!this.done) this.spawn(); } });
        this.time.delayedCall(200, () => { if (!this.done) this.spawn(); });
        this.time.delayedCall(700, () => { if (!this.done) this.spawn(); });

        this.scoreTxt = this.add.text(W / 2, 12, `${labels.lvl}  |  ${labels.score}: 0 / ${cfg.winCount}`, {
          fontSize: '18px', color: '#fef08a', fontStyle: 'bold',
          backgroundColor: '#0f172a', padding: { x: 12, y: 5 },
        }).setOrigin(0.5, 0).setDepth(10);

        this.add.text(W / 2, H - 6, labels.tap, {
          fontSize: '12px', color: '#1e3a8a', fontStyle: 'bold',
        }).setOrigin(0.5, 1).setDepth(10);
      }

      spawn() {
        const x = Phaser.Math.Between(30, W - 30);
        const ci = Phaser.Math.Between(0, COLORS.length - 1);
        const b = this.group.create(x, H + 12, `bal${ci}`) as Phaser.Physics.Arcade.Sprite;
        b.setVelocityY(-Phaser.Math.Between(cfg.minSpeed, cfg.maxSpeed));
        b.setInteractive(); b.setDepth(5);
        b.on('pointerdown', () => { if (b.active && !this.done) this.pop(b, COLORS[ci], true); });
        // Lifetime for levels 3+
        if (cfg.lifetime) {
          this.time.delayedCall(cfg.lifetime, () => {
            if (b.active) this.pop(b, COLORS[ci], false);
          });
        }
      }

      pop(b: Phaser.Physics.Arcade.Sprite, color: number, byPlayer: boolean) {
        b.disableInteractive(); b.destroy();
        if (byPlayer) {
          this.score++;
          this.scoreTxt.setText(`${labels.lvl}  |  ${labels.score}: ${this.score} / ${cfg.winCount}`);
          this.burst(b.x, b.y, color);
          this.beep(true);
          if (this.score >= cfg.winCount) this.celebrate();
        } else {
          // balloon escaped — quick red puff
          this.burst(b.x, b.y, 0xff6b6b);
          this.beep(false);
        }
      }

      burst(x: number, y: number, color: number) {
        for (let i = 0; i < 10; i++) {
          const dot = this.add.circle(x, y, Phaser.Math.Between(4, 8), color).setDepth(8);
          const a = (i / 10) * Math.PI * 2;
          const d = Phaser.Math.Between(35, 100);
          this.tweens.add({ targets: dot, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d,
            alpha: 0, scaleX: 0.15, scaleY: 0.15, duration: 480, ease: 'Quad.easeOut',
            onComplete: () => dot.destroy() });
        }
        const fl = this.add.circle(x, y, 28, 0xffffff, 0.75).setDepth(9);
        this.tweens.add({ targets: fl, alpha: 0, scaleX: 2.2, scaleY: 2.2, duration: 200, onComplete: () => fl.destroy() });
      }

      beep(success: boolean) {
        try {
          const C = window.AudioContext || (window as any).webkitAudioContext;
          if (!C) return; const ctx = new C();
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(success ? 700 : 220, ctx.currentTime);
          o.frequency.exponentialRampToValueAtTime(success ? 200 : 100, ctx.currentTime + 0.12);
          g.gain.setValueAtTime(0.1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
          o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.14);
        } catch (_) {}
      }

      celebrate() {
        this.done = true;
        // Stars: 3 if first try, 2 otherwise (simplified)
        const earnedStars = 3;
        this.cameras.main.flash(600, 255, 230, 0);
        ['🎉', '🎊', '⭐', '🌟', '🏆', '🥳'].forEach((em, i) => {
          this.time.delayedCall(i * 110, () => {
            const tx = this.add.text(Phaser.Math.Between(80, W - 80), Phaser.Math.Between(80, H - 80), em,
              { fontSize: '36px' }).setDepth(20).setAlpha(0);
            this.tweens.add({ targets: tx, alpha: 1, y: tx.y - 110, duration: 1400,
              onComplete: () => this.tweens.add({ targets: tx, alpha: 0, duration: 500 }) });
          });
        });
        const p = this.add.graphics().setDepth(18);
        p.fillStyle(0x0f172a, 0.92); p.fillRoundedRect(W / 2 - 210, H / 2 - 62, 420, 124, 18);
        p.lineStyle(3, 0xfbbf24); p.strokeRoundedRect(W / 2 - 210, H / 2 - 62, 420, 124, 18);
        const wt = this.add.text(W / 2, H / 2, labels.win, { fontSize: '26px', color: '#fef08a', fontStyle: 'bold' })
          .setOrigin(0.5).setDepth(19).setScale(0.2);
        this.tweens.add({ targets: wt, scaleX: 1, scaleY: 1, duration: 450, ease: 'Back.easeOut',
          onComplete: () => {
            this.time.delayedCall(1500, () => onWinRef.current(earnedStars));
          },
        });
      }

      update() {
        if (this.done) return;
        (this.group.getChildren() as Phaser.Physics.Arcade.Sprite[]).forEach(b => {
          if (b.active && b.y < -110) b.destroy();
        });
      }
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO, parent: containerRef.current, width: W, height: H,
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [Scene],
    });
    return () => { gameRef.current?.destroy(true); };
  }, [phase, activeLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('فرقع البالونات', 'Éclate les Ballons', 'Pop the Balloons')}
        gameIcon="🎈"
        language={language}
        onExit={onExit ?? (() => {})}
        onSelectLevel={lvl => { setLevel(lvl); setPhase('play'); }}
        levels={LEVEL_DEFS.map(d => ({
          ...d,
          unlocked: d.level <= maxUnlocked,
          earnedStars: stars[d.level] ?? 0,
        }))}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-950 p-3 sm:p-4 min-h-screen justify-center">
      <button onClick={() => setPhase('select')}
        className="self-start bg-white/90 hover:bg-white text-slate-900 font-black px-4 py-2 rounded-2xl shadow-lg border-2 border-rose-300 cursor-pointer text-sm">
        🚪 {t('خروج', 'Retour', 'Back')}
      </button>
      <div ref={containerRef}
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-400"
        style={{ aspectRatio: '16/10' }} />
    </div>
  );
};
