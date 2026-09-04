/**
 * FruitCatcherGame.tsx — « Le Panier Gourmand »
 * 8 niveaux : fruits du Maghreb, souk, cailloux à éviter (pas de bombes).
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { motion } from 'motion/react';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';
import {
  playBubblePop,
  playGentleNudge,
  playSuccessChime,
  resumeTownAudio,
  usePreschoolSpeech,
} from './usePreschoolAudio';

export interface FruitCatcherGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

type FruitKind = 'apple' | 'orange' | 'lemon' | 'strawberry' | 'grape' | 'date' | 'fig' | 'melon';

interface LevelCfg {
  halfW: number;
  speedMin: number; speedMax: number;
  spawnDelay: number;
  winCount: number;
  hasPebbles: boolean;
  kinds: FruitKind[];
  emoji: string;
  missionAr: string; missionFr: string; missionEn: string;
}

const LEVELS: LevelCfg[] = [
  { halfW: 62, speedMin: 80,  speedMax: 140, spawnDelay: 1300, winCount: 6,  hasPebbles: false,
    kinds: ['apple', 'orange'], emoji: '🍎',
    missionAr: 'اِلْتَقِطِ التُّفَّاحَ وَالْبُرْتُقَال!', missionFr: 'Attrape les pommes et les oranges !', missionEn: 'Catch the apples and oranges!' },
  { halfW: 58, speedMin: 100, speedMax: 170, spawnDelay: 1150, winCount: 8,  hasPebbles: false,
    kinds: ['orange', 'lemon'], emoji: '🍊',
    missionAr: 'اِلْتَقِطِ الْبُرْتُقَالَ وَاللَّيْمُون!', missionFr: 'Attrape les oranges et les citrons !', missionEn: 'Catch the oranges and lemons!' },
  { halfW: 54, speedMin: 120, speedMax: 190, spawnDelay: 1000, winCount: 10, hasPebbles: false,
    kinds: ['strawberry', 'grape', 'apple'], emoji: '🍓',
    missionAr: 'اِلْتَقِطِ الْفَرَاوِلَةَ وَالْعِنَب!', missionFr: 'Attrape les fraises et les raisins !', missionEn: 'Catch the strawberries and grapes!' },
  { halfW: 56, speedMin: 110, speedMax: 185, spawnDelay: 1050, winCount: 10, hasPebbles: false,
    kinds: ['melon', 'orange'], emoji: '🍉',
    missionAr: 'الْبَطِّيخُ الْكَبِير! اِلْتَقِطْهُ', missionFr: 'La grosse pastèque ! Attrape-la', missionEn: 'The big watermelon! Catch it' },
  { halfW: 50, speedMin: 140, speedMax: 210, spawnDelay: 900,  winCount: 12, hasPebbles: false,
    kinds: ['date', 'fig', 'orange'], emoji: '🌴',
    missionAr: 'اِلْتَقِطِ التَّمْرَ وَالتِّين!', missionFr: 'Attrape les dattes et les figues !', missionEn: 'Catch the dates and figs!' },
  { halfW: 46, speedMin: 155, speedMax: 230, spawnDelay: 820,  winCount: 12, hasPebbles: false,
    kinds: ['apple', 'grape', 'lemon', 'strawberry'], emoji: '🍇',
    missionAr: 'السَّلَةُ أَضْيَق! اِنْتَبِه', missionFr: 'Le panier est plus petit ! Attention', missionEn: 'The basket is smaller! Be careful' },
  { halfW: 48, speedMin: 150, speedMax: 240, spawnDelay: 780,  winCount: 12, hasPebbles: true,
    kinds: ['apple', 'orange', 'date', 'melon'], emoji: '🪨',
    missionAr: 'الْفَوَاكِهُ نَعَمْ، الْحَجَرُ لَا!', missionFr: 'Les fruits oui, le caillou non !', missionEn: 'Fruits yes, pebble no!' },
  { halfW: 42, speedMin: 170, speedMax: 270, spawnDelay: 680,  winCount: 14, hasPebbles: true,
    kinds: ['apple', 'orange', 'lemon', 'strawberry', 'grape', 'date', 'fig', 'melon'], emoji: '🧺',
    missionAr: 'سُوقُ الْفَوَاكِهِ! اِمْلَإِ السَّلَة', missionFr: 'Le grand souk ! Remplis le panier', missionEn: 'The big market! Fill the basket' },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🍎', diffLabel: '⭐',
    titleAr: 'التفاح', titleFr: 'Les pommes', titleEn: 'Apples',
    descAr: 'فواكه بطيئة وسلة واسعة', descFr: 'Fruits lents, grand panier', descEn: 'Slow fruits, wide basket',
    gradient: 'from-red-400 to-rose-500' },
  { level: 2, emoji: '🍊', diffLabel: '⭐',
    titleAr: 'البرتقال', titleFr: 'Les oranges', titleEn: 'Oranges',
    descAr: 'برتقال وليمون الجزائر', descFr: 'Oranges et citrons d’Algérie', descEn: 'Algerian oranges and lemons',
    gradient: 'from-orange-400 to-amber-500' },
  { level: 3, emoji: '🍓', diffLabel: '⭐⭐',
    titleAr: 'الفراولة', titleFr: 'Les fraises', titleEn: 'Strawberries',
    descAr: 'فراولة وعنب', descFr: 'Fraises et raisins', descEn: 'Strawberries and grapes',
    gradient: 'from-pink-400 to-rose-600' },
  { level: 4, emoji: '🍉', diffLabel: '⭐⭐',
    titleAr: 'البطيخ', titleFr: 'La pastèque', titleEn: 'Watermelon',
    descAr: 'البطيخ الكبير', descFr: 'La grosse pastèque', descEn: 'The big watermelon',
    gradient: 'from-green-400 to-lime-600' },
  { level: 5, emoji: '🌴', diffLabel: '⭐⭐',
    titleAr: 'الواحة', titleFr: 'L’oasis', titleEn: 'The oasis',
    descAr: 'تمر وتين', descFr: 'Dattes et figues', descEn: 'Dates and figs',
    gradient: 'from-amber-500 to-yellow-700' },
  { level: 6, emoji: '🍇', diffLabel: '⭐⭐⭐',
    titleAr: 'سلة ضيقة', titleFr: 'Petit panier', titleEn: 'Small basket',
    descAr: 'انتبه، السلة أصغر', descFr: 'Attention, panier plus petit', descEn: 'Careful, smaller basket',
    gradient: 'from-violet-400 to-purple-600' },
  { level: 7, emoji: '🪨', diffLabel: '⭐⭐⭐',
    titleAr: 'تجنّب الحجر', titleFr: 'Pas le caillou !', titleEn: 'Not the pebble!',
    descAr: 'الفواكه نعم، الحجر لا', descFr: 'Les fruits oui, le caillou non', descEn: 'Fruits yes, pebble no',
    gradient: 'from-stone-400 to-amber-600' },
  { level: 8, emoji: '🧺', diffLabel: '🏆',
    titleAr: 'سوق الفواكه', titleFr: 'Le grand souk', titleEn: 'The big souk',
    descAr: 'املأ السلة في السوق', descFr: 'Remplis le panier au souk', descEn: 'Fill the basket at the souk',
    gradient: 'from-emerald-500 to-teal-700' },
];

export const FruitCatcherGame: React.FC<FruitCatcherGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('fruit_catcher', 8);
  const unlockedCap = (stars[4] ?? 0) > 0 ? Math.max(maxUnlocked, 5) : maxUnlocked;
  const [phase, setPhase] = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const ctrlRef = useRef({ left: false, right: false });
  const onWinRef = useRef<(s: number) => void>(() => {});

  const { speak } = usePreschoolSpeech(language);
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;
  const cfgPlay = LEVELS[activeLevel - 1];
  const mission = t(cfgPlay.missionAr, cfgPlay.missionFr, cfgPlay.missionEn);

  onWinRef.current = (s: number) => {
    completeLevel(activeLevel, s);
    setPhase('select');
  };

  useEffect(() => {
    if (phase !== 'play') return;
    const timer = window.setTimeout(() => speak(mission), 350);
    return () => window.clearTimeout(timer);
  }, [phase, activeLevel, mission, speak]);

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;
    const W = 800, H = 500;
    const cfg = LEVELS[activeLevel - 1];
    const ctrl = ctrlRef;

    const labels = {
      score: t('نقاط', 'Points', 'Score'),
      win:   t('🎉 السَّلَةُ مَلْآنَة! أَحْسَنْت!', '🎉 Panier plein ! Bravo !', '🎉 Full basket! Well done!'),
      pebble: t('🪨 حَجَر!', '🪨 Caillou !', '🪨 Pebble!'),
      lvl:   t(`م${activeLevel}`, `N${activeLevel}`, `L${activeLevel}`),
    };

    class Scene extends Phaser.Scene {
      private fruits!: Phaser.Physics.Arcade.Group;
      private basket!: Phaser.GameObjects.Image;
      private score = 0;
      private misses = 0;
      private scoreTxt!: Phaser.GameObjects.Text;
      private done = false;
      private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

      constructor() { super('FC'); }

      create() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x7dd3fc, 0x7dd3fc, 0xfde68a, 0xfbbf24, 1);
        bg.fillRect(0, 0, W, H);
        this.add.circle(70, 48, 28, 0xfde047);
        this.add.circle(70, 48, 42, 0xfacc15, 0.3);
        [[120, 55], [380, 40], [620, 62]].forEach(([cx, cy]) => {
          const cg = this.add.graphics().fillStyle(0xffffff, 0.82);
          cg.fillCircle(cx, cy, 20); cg.fillCircle(cx + 24, cy - 7, 16);
          cg.fillCircle(cx - 18, cy - 4, 13); cg.fillCircle(cx + 44, cy, 18);
        });
        const gnd = this.add.graphics();
        gnd.fillStyle(0x4ade80); gnd.fillRect(0, H - 36, W, 36);
        gnd.fillStyle(0xbbf7d0); gnd.fillRect(0, H - 36, W, 8);

        const bw = 100, bh = 54;
        const bg2 = this.add.graphics();
        bg2.fillStyle(0xb45309); bg2.fillRoundedRect(0, 8, bw, 42, 12);
        bg2.fillStyle(0xfef3c7); bg2.fillRoundedRect(5, 12, bw - 10, 34, 9);
        bg2.lineStyle(2, 0xa16207, 0.7);
        for (let x2 = 14; x2 < bw - 10; x2 += 14) {
          bg2.beginPath(); bg2.moveTo(x2, 12); bg2.lineTo(x2, 46); bg2.strokePath();
        }
        bg2.beginPath(); bg2.moveTo(5, 28); bg2.lineTo(bw - 5, 28); bg2.strokePath();
        bg2.lineStyle(3, 0x78350f); bg2.strokeRoundedRect(0, 8, bw, 42, 12);
        bg2.lineStyle(4, 0x92400e);
        bg2.beginPath(); bg2.moveTo(22, 8); bg2.lineTo(50, -6); bg2.lineTo(78, 8); bg2.strokePath();
        bg2.generateTexture('basket', bw, bh); bg2.destroy();
        this.basket = this.add.image(W / 2, H - 48, 'basket').setDepth(6);

        const drawFruit = (key: string, paint: (g: Phaser.GameObjects.Graphics) => void, tw = 36, th = 40) => {
          const g = this.add.graphics();
          paint(g);
          g.generateTexture(key, tw, th);
          g.destroy();
        };
        drawFruit('apple', (g) => {
          g.fillStyle(0xef4444); g.fillCircle(18, 22, 16);
          g.fillStyle(0xfca5a5, 0.45); g.fillEllipse(12, 14, 10, 12);
          g.lineStyle(2.5, 0x166534); g.beginPath(); g.moveTo(18, 4); g.lineTo(18, 10); g.strokePath();
        });
        drawFruit('orange', (g) => {
          g.fillStyle(0xf97316); g.fillCircle(18, 20, 16);
          g.fillStyle(0xfed7aa, 0.4); g.fillEllipse(12, 14, 9, 11);
          g.fillStyle(0x166534); g.fillCircle(18, 6, 3);
        });
        drawFruit('lemon', (g) => {
          g.fillStyle(0xfde047); g.fillEllipse(18, 20, 28, 22);
          g.fillStyle(0xfef9c3, 0.5); g.fillEllipse(12, 14, 10, 12);
        });
        drawFruit('strawberry', (g) => {
          g.fillStyle(0xf43f5e); g.fillTriangle(18, 34, 4, 14, 32, 14);
          g.fillStyle(0xf43f5e); g.fillCircle(18, 16, 12);
          g.fillStyle(0x166534); g.fillCircle(18, 8, 5);
          g.fillStyle(0xfef08a); g.fillCircle(12, 20, 1.5); g.fillCircle(22, 24, 1.5);
        });
        drawFruit('grape', (g) => {
          g.fillStyle(0x8b5cf6);
          g.fillCircle(12, 22, 7); g.fillCircle(22, 22, 7); g.fillCircle(17, 14, 7); g.fillCircle(17, 28, 6);
          g.lineStyle(2, 0x166534); g.beginPath(); g.moveTo(17, 6); g.lineTo(17, 12); g.strokePath();
        });
        drawFruit('date', (g) => {
          g.fillStyle(0x78350f); g.fillEllipse(18, 22, 14, 26);
          g.fillStyle(0xa16207, 0.5); g.fillEllipse(14, 16, 6, 10);
          g.fillStyle(0x166534); g.fillRect(16, 6, 4, 6);
        });
        drawFruit('fig', (g) => {
          g.fillStyle(0x6b21a8); g.fillEllipse(18, 24, 18, 22);
          g.fillStyle(0xa855f7, 0.45); g.fillEllipse(14, 18, 8, 10);
          g.fillStyle(0x166534); g.fillCircle(18, 10, 4);
        });
        drawFruit('melon', (g) => {
          g.fillStyle(0x16a34a); g.fillEllipse(18, 22, 30, 24);
          g.fillStyle(0x4ade80); g.fillEllipse(18, 22, 22, 16);
          g.fillStyle(0xf43f5e); g.fillEllipse(18, 22, 14, 10);
        }, 40, 42);
        if (cfg.hasPebbles) {
          drawFruit('pebble', (g) => {
            g.fillStyle(0x78716c); g.fillEllipse(18, 22, 22, 16);
            g.fillStyle(0xa8a29e, 0.5); g.fillEllipse(14, 18, 8, 6);
          });
        }

        this.fruits = this.physics.add.group();
        this.time.addEvent({ delay: cfg.spawnDelay, loop: true, callback: () => { if (!this.done) this.drop(); } });
        this.time.delayedCall(120, () => { if (!this.done) this.drop(); });

        this.scoreTxt = this.add.text(W / 2, 12, `${labels.lvl}  ·  ${labels.score}: 0 / ${cfg.winCount}`, {
          fontSize: '18px', color: '#14532d', fontStyle: 'bold',
          backgroundColor: '#ffffffcc', padding: { x: 12, y: 6 },
        }).setOrigin(0.5, 0).setDepth(10);

        this.add.text(W / 2, H - 8,
          t('← اُسْحَب أَوِ اسْتَعْمِلِ الْأَزْرَار →', '← Glisse ou utilise les boutons →', '← Drag or use the buttons →'),
          { fontSize: '14px', color: '#14532d', fontStyle: 'bold' },
        ).setOrigin(0.5, 1).setDepth(10);

        if (this.input.keyboard) this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
          if (ptr.isDown) this.basket.x = Phaser.Math.Clamp(ptr.x, 50, W - 50);
        });
        this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
          this.basket.x = Phaser.Math.Clamp(ptr.x, 50, W - 50);
        });
      }

      drop() {
        const isPebble = cfg.hasPebbles && Phaser.Math.Between(0, 5) === 0;
        const key = isPebble ? 'pebble' : Phaser.Math.RND.pick(cfg.kinds);
        const f = this.fruits.create(Phaser.Math.Between(28, W - 28), -12, key) as Phaser.Physics.Arcade.Sprite & { isPebble?: boolean };
        f.setVelocityY(Phaser.Math.Between(cfg.speedMin, cfg.speedMax));
        f.setDepth(5); f.setAngle(Phaser.Math.Between(-20, 20));
        f.setAngularVelocity(Phaser.Math.Between(-70, 70));
        f.isPebble = isPebble;
      }

      onCatch(f: Phaser.Physics.Arcade.Sprite & { isPebble?: boolean }) {
        const bx = f.x, by = f.y;
        const bad = f.isPebble;
        f.destroy();
        if (bad) {
          playGentleNudge();
          this.cameras.main.shake(220, 0.01);
          const tx = this.add.text(bx, by - 10, labels.pebble, { fontSize: '18px', color: '#57534e', fontStyle: 'bold' })
            .setDepth(12);
          this.tweens.add({ targets: tx, y: by - 56, alpha: 0, duration: 800, onComplete: () => tx.destroy() });
          this.score = Math.max(0, this.score - 1);
        } else {
          this.score++;
          const star = this.add.text(bx, by - 10, '⭐', { fontSize: '22px' }).setDepth(9);
          this.tweens.add({ targets: star, y: star.y - 50, alpha: 0, duration: 700, onComplete: () => star.destroy() });
          playBubblePop();
          if (this.score >= cfg.winCount) this.celebrate();
        }
        this.scoreTxt.setText(`${labels.lvl}  ·  ${labels.score}: ${this.score} / ${cfg.winCount}`);
      }

      celebrate() {
        this.done = true;
        playSuccessChime();
        const earnedStars = this.misses === 0 ? 3 : this.misses <= 3 ? 2 : 1;
        this.cameras.main.flash(700, 255, 220, 50);
        ['🎉', '🍎', '🍊', '⭐', '🧺', '🥳'].forEach((e, i) => {
          this.time.delayedCall(i * 120, () => {
            const tx = this.add.text(Phaser.Math.Between(80, W - 80), Phaser.Math.Between(80, H - 80), e, { fontSize: '36px' })
              .setDepth(20).setAlpha(0);
            this.tweens.add({
              targets: tx, alpha: 1, y: tx.y - 100, duration: 1400,
              onComplete: () => this.tweens.add({ targets: tx, alpha: 0, duration: 500 }),
            });
          });
        });
        const starsStr = '★'.repeat(earnedStars) + '☆'.repeat(3 - earnedStars);
        const p = this.add.graphics().setDepth(18);
        p.fillStyle(0x14532d, 0.94); p.fillRoundedRect(W / 2 - 220, H / 2 - 70, 440, 140, 22);
        p.lineStyle(3, 0x4ade80); p.strokeRoundedRect(W / 2 - 220, H / 2 - 70, 440, 140, 22);
        const wt = this.add.text(W / 2, H / 2 - 18, labels.win, {
          fontSize: '22px', color: '#d1fae5', fontStyle: 'bold', align: 'center', wordWrap: { width: 400 },
        }).setOrigin(0.5).setDepth(19).setScale(0.2);
        this.tweens.add({
          targets: wt, scaleX: 1, scaleY: 1, duration: 450, ease: 'Back.easeOut',
          onComplete: () => {
            this.add.text(W / 2, H / 2 + 32, starsStr, { fontSize: '32px', color: '#fbbf24' }).setOrigin(0.5).setDepth(19);
            this.time.delayedCall(1600, () => onWinRef.current(earnedStars));
          },
        });
      }

      update() {
        if (this.done) return;
        const step = 6;
        if (this.cursors?.left.isDown || ctrl.current.left) this.basket.x = Math.max(50, this.basket.x - step);
        if (this.cursors?.right.isDown || ctrl.current.right) this.basket.x = Math.min(W - 50, this.basket.x + step);

        const bx = this.basket.x, by = this.basket.y;
        (this.fruits.getChildren() as (Phaser.Physics.Arcade.Sprite & { isPebble?: boolean })[]).forEach((f) => {
          if (!f.active) return;
          if (Math.abs(f.x - bx) < cfg.halfW && f.y > by - 28 && f.y < by + 22) this.onCatch(f);
          else if (f.y > H + 20) {
            if (!f.isPebble) this.misses++;
            f.destroy();
          }
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
        gameTitle={t('السَّلَةُ الْجَائِعَة', 'Le panier gourmand', 'The hungry basket')}
        gameIcon="🍎"
        language={language}
        onExit={onExit ?? (() => {})}
        onSelectLevel={(lvl) => { setLevel(lvl); setPhase('play'); }}
        levels={LEVEL_DEFS.map((d) => ({
          ...d,
          unlocked: d.level <= unlockedCap,
          earnedStars: stars[d.level] ?? 0,
        }))}
      />
    );
  }

  const ctrl = ctrlRef.current;
  const DBtn: React.FC<{ dir: 'left' | 'right'; label: string }> = ({ dir, label }) => (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-lime-500 text-3xl font-black shadow-md
                 border-2 border-lime-300 active:bg-lime-600 cursor-pointer select-none touch-none"
      onPointerDown={(e) => { e.preventDefault(); resumeTownAudio(); ctrl[dir] = true; }}
      onPointerUp={(e) => { e.preventDefault(); ctrl[dir] = false; }}
      onPointerLeave={(e) => { e.preventDefault(); ctrl[dir] = false; }}
    >
      {label}
    </motion.button>
  );

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="relative flex flex-col items-center gap-4 bg-[#F8F9FA] p-4 sm:p-6 rounded-3xl min-h-screen justify-center"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPhase('select')}
        className="absolute top-4 start-4 z-10 bg-white hover:bg-lime-50 text-slate-800 font-black
                   px-4 py-2 rounded-2xl shadow-md border-2 border-lime-200 cursor-pointer
                   flex items-center gap-2 text-sm"
      >
        🚪 {t('خروج', 'Retour', 'Back')}
      </motion.button>

      <div className="flex items-center justify-center gap-3 mt-12 sm:mt-2 max-w-xl px-14">
        <p className="text-3xl shrink-0">{cfgPlay.emoji}</p>
        <p className="text-base sm:text-lg font-black text-slate-800 text-center leading-snug">{mission}</p>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => { resumeTownAudio(); speak(mission); }}
          className="min-h-12 min-w-12 shrink-0 rounded-2xl bg-white shadow-md border-2 border-lime-300 text-2xl"
          aria-label={t('استمع', 'Écouter', 'Listen')}
        >
          🔊
        </motion.button>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-4xl aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-4 border-lime-300"
      />
      <div className="flex gap-8 mt-1" dir="ltr">
        <DBtn dir="left" label="◀" />
        <DBtn dir="right" label="▶" />
      </div>
    </div>
  );
};
