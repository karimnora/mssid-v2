/**
 * FruitCatcherGame.tsx
 * 4 niveaux : panier qui rétrécit, fruits plus rapides, bombes au niveau 4.
 * Contrôles : glisser sur le canvas (tactile) + flèches clavier + D-pad HTML.
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';

export interface FruitCatcherGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

interface LevelCfg {
  halfW: number;           // half-width of basket catch zone
  speedMin: number; speedMax: number;
  spawnDelay: number;
  winCount: number;
  hasBombs: boolean;
}
const LEVELS: LevelCfg[] = [
  { halfW: 58, speedMin: 100, speedMax: 175, spawnDelay: 1200, winCount: 8,  hasBombs: false },
  { halfW: 50, speedMin: 150, speedMax: 230, spawnDelay: 1000, winCount: 12, hasBombs: false },
  { halfW: 42, speedMin: 200, speedMax: 300, spawnDelay:  820, winCount: 15, hasBombs: false },
  { halfW: 36, speedMin: 240, speedMax: 360, spawnDelay:  650, winCount: 20, hasBombs: true  },
];
const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🍎', diffLabel: '⭐',
    titleAr: 'سهل',            titleFr: 'Facile',          titleEn: 'Easy',
    descAr:  'فواكه بطيئة وسلة واسعة', descFr: 'Fruits lents, grand panier', descEn: 'Slow fruits, wide basket',
    gradient: 'from-emerald-400 to-green-500' },
  { level: 2, emoji: '🍊', diffLabel: '⭐⭐',
    titleAr: 'متوسط',  titleFr: 'Moyen',   titleEn: 'Medium',
    descAr:  'أسرع!',  descFr: 'Plus vite!', descEn: 'Faster!',
    gradient: 'from-green-500 to-teal-600' },
  { level: 3, emoji: '🍋', diffLabel: '⭐⭐⭐',
    titleAr: 'صعب – سلة أضيق',       titleFr: 'Difficile – panier étroit', titleEn: 'Hard – narrow basket',
    descAr:  'فواكه كثيرة وسريعة',   descFr: 'Beaucoup de fruits rapides', descEn: 'Many fast fruits',
    gradient: 'from-teal-500 to-cyan-600' },
  { level: 4, emoji: '💣', diffLabel: '🏆',
    titleAr: 'تحدي – تجنّب القنابل!',  titleFr: 'Défi – évite les bombes !', titleEn: 'Challenge – avoid bombs!',
    descAr:  'اصطد الفواكه وتجنّب القنابل', descFr: 'Attrape les fruits, évite les bombes', descEn: 'Catch fruits, dodge bombs',
    gradient: 'from-amber-500 to-orange-600' },
];

export const FruitCatcherGame: React.FC<FruitCatcherGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('fruit_catcher', 4);
  const [phase, setPhase]       = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);
  const ctrlRef      = useRef({ left: false, right: false });
  const onWinRef     = useRef<(s: number) => void>(() => {});

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  onWinRef.current = (s: number) => {
    completeLevel(activeLevel, s);
    setPhase('select');
  };

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;
    const W = 640, H = 420;
    const cfg = LEVELS[activeLevel - 1];
    const ctrl = ctrlRef;

    const labels = {
      score: t('نقاط', 'Points', 'Score'),
      win:   t('🎉 سلة ممتلئة! أحسنت! 🍎', '🎉 Panier plein ! Bravo ! 🍎', '🎉 Full basket! Well done! 🍎'),
      bomb:  t('💣 قنبلة!', '💣 Bombe !', '💣 Bomb!'),
      lvl:   t(`م${activeLevel}`, `N${activeLevel}`, `L${activeLevel}`),
    };

    class Scene extends Phaser.Scene {
      private fruits!: Phaser.Physics.Arcade.Group;
      private basket!: Phaser.GameObjects.Image;
      private score = 0;
      private scoreTxt!: Phaser.GameObjects.Text;
      private done = false;
      private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

      constructor() { super('FC'); }

      create() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x7dd3fc, 0x7dd3fc, 0xfde68a, 0xfbbf24, 1);
        bg.fillRect(0, 0, W, H);
        [[60, 50], [420, 65], [240, 35]].forEach(([cx, cy]) => {
          const cg = this.add.graphics().fillStyle(0xffffff, 0.8);
          cg.fillCircle(cx, cy, 20); cg.fillCircle(cx + 24, cy - 7, 16);
          cg.fillCircle(cx - 18, cy - 4, 13); cg.fillCircle(cx + 44, cy, 18);
        });
        const gnd = this.add.graphics();
        gnd.fillStyle(0x4ade80); gnd.fillRect(0, H - 28, W, 28);
        gnd.fillStyle(0xbbf7d0); gnd.fillRect(0, H - 28, W, 6);

        // Basket texture
        const bg2 = this.add.graphics();
        bg2.fillStyle(0xb45309); bg2.fillRoundedRect(0, 6, 90, 40, 10);
        bg2.fillStyle(0xfef3c7); bg2.fillRoundedRect(4, 10, 82, 32, 8);
        bg2.lineStyle(2, 0xa16207, 0.7);
        for (let x2 = 12; x2 < 82; x2 += 14) { bg2.beginPath(); bg2.moveTo(x2, 10); bg2.lineTo(x2, 42); bg2.strokePath(); }
        bg2.beginPath(); bg2.moveTo(4, 26); bg2.lineTo(86, 26); bg2.strokePath();
        bg2.lineStyle(3, 0x78350f); bg2.strokeRoundedRect(0, 6, 90, 40, 10);
        bg2.lineStyle(4, 0x92400e); bg2.beginPath(); bg2.moveTo(20, 6); bg2.lineTo(45, -8); bg2.lineTo(70, 6); bg2.strokePath();
        bg2.generateTexture('basket', 90, 50); bg2.destroy();
        this.basket = this.add.image(W / 2, H - 40, 'basket').setDepth(6);

        // Fruit textures
        const ftypes = [
          { key: 'apple', c: 0xef4444, h: 0xfca5a5 },
          { key: 'orange', c: 0xf97316, h: 0xfed7aa },
          { key: 'lemon', c: 0xfde047, h: 0xfef9c3 },
          { key: 'strawberry', c: 0xf43f5e, h: 0xfda4af },
          { key: 'grape', c: 0x8b5cf6, h: 0xc4b5fd },
        ];
        ftypes.forEach(({ key, c, h }) => {
          const g = this.add.graphics();
          g.fillStyle(c); g.fillCircle(16, 18, 16);
          g.fillStyle(h, 0.4); g.fillEllipse(10, 10, 10, 14);
          g.lineStyle(2.5, 0x166534); g.beginPath(); g.moveTo(16, 2); g.lineTo(16, 7); g.strokePath();
          g.generateTexture(key, 32, 36); g.destroy();
        });

        // Bomb texture (level 4)
        if (cfg.hasBombs) {
          const g = this.add.graphics();
          g.fillStyle(0x1e293b); g.fillCircle(16, 18, 16);
          g.fillStyle(0xfef08a); g.fillCircle(14, 10, 6);
          g.lineStyle(3, 0x6b7280); g.beginPath(); g.moveTo(16, 2); g.lineTo(16, -2); g.strokePath();
          g.generateTexture('bomb', 32, 36); g.destroy();
        }

        this.fruits = this.physics.add.group();
        this.time.addEvent({ delay: cfg.spawnDelay, loop: true, callback: () => { if (!this.done) this.drop(); } });
        this.time.delayedCall(100, () => { if (!this.done) this.drop(); });

        this.scoreTxt = this.add.text(W / 2, 10, `${labels.lvl}  |  ${labels.score}: 0 / ${cfg.winCount}`, {
          fontSize: '18px', color: '#fef08a', fontStyle: 'bold',
          backgroundColor: '#0f172a', padding: { x: 12, y: 5 },
        }).setOrigin(0.5, 0).setDepth(10);

        this.add.text(W / 2, H - 6,
          t('← اسحب أو استخدم الأزرار →', '← Glisse ou utilise les boutons →', '← Drag or use buttons →'),
          { fontSize: '12px', color: '#1e3a8a', fontStyle: 'bold' },
        ).setOrigin(0.5, 1).setDepth(10);

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
          if (ptr.isDown) this.basket.x = Phaser.Math.Clamp(ptr.x, 45, W - 45);
        });
        this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
          this.basket.x = Phaser.Math.Clamp(ptr.x, 45, W - 45);
        });
      }

      drop() {
        const kinds = ['apple', 'orange', 'lemon', 'strawberry', 'grape'];
        const isBomb = cfg.hasBombs && Phaser.Math.Between(0, 4) === 0;
        const key = isBomb ? 'bomb' : Phaser.Math.RND.pick(kinds);
        const f = this.fruits.create(Phaser.Math.Between(20, W - 20), -10, key) as Phaser.Physics.Arcade.Sprite & { isBomb?: boolean };
        f.setVelocityY(Phaser.Math.Between(cfg.speedMin, cfg.speedMax));
        f.setDepth(5); f.setAngle(Phaser.Math.Between(-20, 20));
        f.setAngularVelocity(Phaser.Math.Between(-80, 80));
        f.isBomb = isBomb;
      }

      onCatch(f: Phaser.Physics.Arcade.Sprite & { isBomb?: boolean }) {
        const bx = f.x, by = f.y;
        f.destroy();
        if (f.isBomb) {
          this.cameras.main.shake(300, 0.018);
          const tx = this.add.text(bx, by - 10, labels.bomb, { fontSize: '20px', color: '#ff6b6b', fontStyle: 'bold' })
            .setDepth(12);
          this.tweens.add({ targets: tx, y: by - 60, alpha: 0, duration: 900, onComplete: () => tx.destroy() });
          // Penalize: remove score
          this.score = Math.max(0, this.score - 2);
        } else {
          this.score++;
          const star = this.add.text(bx, by - 10, '⭐', { fontSize: '22px' }).setDepth(9);
          this.tweens.add({ targets: star, y: star.y - 50, alpha: 0, duration: 700, onComplete: () => star.destroy() });
          this.beep();
          if (this.score >= cfg.winCount) this.celebrate();
        }
        this.scoreTxt.setText(`${labels.lvl}  |  ${labels.score}: ${this.score} / ${cfg.winCount}`);
      }

      beep() {
        try {
          const C = window.AudioContext || (window as any).webkitAudioContext;
          if (!C) return; const ctx = new C();
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(880, ctx.currentTime);
          o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
          g.gain.setValueAtTime(0.09, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.1);
        } catch (_) {}
      }

      celebrate() {
        this.done = true;
        this.cameras.main.flash(700, 255, 220, 50);
        ['🎉', '🍎', '⭐', '🏆', '🎊'].forEach((e, i) => {
          this.time.delayedCall(i * 130, () => {
            const tx = this.add.text(Phaser.Math.Between(70, W - 70), Phaser.Math.Between(80, H - 80), e, { fontSize: '36px' })
              .setDepth(20).setAlpha(0);
            this.tweens.add({ targets: tx, alpha: 1, y: tx.y - 100, duration: 1400,
              onComplete: () => this.tweens.add({ targets: tx, alpha: 0, duration: 500 }) });
          });
        });
        const p = this.add.graphics().setDepth(18);
        p.fillStyle(0x0f172a, 0.92); p.fillRoundedRect(W / 2 - 210, H / 2 - 60, 420, 120, 18);
        p.lineStyle(3, 0x4ade80); p.strokeRoundedRect(W / 2 - 210, H / 2 - 60, 420, 120, 18);
        const wt = this.add.text(W / 2, H / 2, labels.win, { fontSize: '22px', color: '#d1fae5', fontStyle: 'bold', align: 'center', wordWrap: { width: 380 } })
          .setOrigin(0.5).setDepth(19).setScale(0.2);
        this.tweens.add({ targets: wt, scaleX: 1, scaleY: 1, duration: 450, ease: 'Back.easeOut',
          onComplete: () => { this.time.delayedCall(1500, () => onWinRef.current(3)); },
        });
      }

      update() {
        if (this.done) return;
        if (this.cursors.left.isDown  || ctrl.current.left)  this.basket.x = Math.max(45, this.basket.x - 5);
        if (this.cursors.right.isDown || ctrl.current.right) this.basket.x = Math.min(W - 45, this.basket.x + 5);

        const bx = this.basket.x, by = this.basket.y;
        (this.fruits.getChildren() as (Phaser.Physics.Arcade.Sprite & { isBomb?: boolean })[]).forEach(f => {
          if (!f.active) return;
          if (Math.abs(f.x - bx) < cfg.halfW && f.y > by - 26 && f.y < by + 20) this.onCatch(f);
          else if (f.y > H + 20) f.destroy();
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
        gameTitle={t('السلة الجائعة', 'Le Panier Gourmand', 'Hungry Basket')}
        gameIcon="🍎"
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

  const ctrl = ctrlRef.current;
  const DBtn: React.FC<{ dir: 'left' | 'right'; label: string }> = ({ dir, label }) => (
    <button
      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/90 text-2xl font-black shadow-lg border-2 border-emerald-300 active:scale-95 cursor-pointer select-none"
      onPointerDown={() => { ctrl[dir] = true; }}
      onPointerUp={() => { ctrl[dir] = false; }}
      onPointerLeave={() => { ctrl[dir] = false; }}
    >{label}</button>
  );

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-950 p-3 sm:p-4 min-h-screen justify-center">
      <button onClick={() => setPhase('select')}
        className="self-start bg-white/90 hover:bg-white text-slate-900 font-black px-4 py-2 rounded-2xl shadow-lg border-2 border-emerald-300 cursor-pointer text-sm">
        🚪 {t('خروج', 'Retour', 'Back')}
      </button>
      <div ref={containerRef}
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-400"
        style={{ aspectRatio: '16/10' }} />
      <div className="flex gap-8 mt-1">
        <DBtn dir="left"  label="◀" />
        <DBtn dir="right" label="▶" />
      </div>
    </div>
  );
};
