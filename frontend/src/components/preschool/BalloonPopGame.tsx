import { useActivityExitGuard } from '../../context/ActivityExitContext';
/**
 * BalloonPopGame.tsx — « Éclate les Ballons »
 * 8 mondes thématiques, ballons souriants, vent, mission parlée.
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

export interface BalloonPopGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

interface LevelCfg {
  spawnDelay: number;
  minSpeed: number; maxSpeed: number;
  minR: number; maxR: number;
  winCount: number;
  lifetime: number | null;
  drift: number;
  skyTop: number; skyBot: number;
  night: boolean;
  emoji: string;
  missionAr: string; missionFr: string; missionEn: string;
}

const LEVELS: LevelCfg[] = [
  { spawnDelay: 1600, minSpeed: 55,  maxSpeed: 95,  minR: 26, maxR: 32, winCount: 8,  lifetime: null, drift: 0,  skyTop: 0xbae6fd, skyBot: 0x38bdf8, night: false, emoji: '🎈',
    missionAr: 'اُنْقُرِ الْبَالُونَاتِ الْكَبِيرَة!', missionFr: 'Touche les gros ballons !', missionEn: 'Tap the big balloons!' },
  { spawnDelay: 1300, minSpeed: 70,  maxSpeed: 115, minR: 24, maxR: 30, winCount: 10, lifetime: null, drift: 8,  skyTop: 0xfce7f3, skyBot: 0xf9a8d4, night: false, emoji: '🌸',
    missionAr: 'فَرْقِعْ بَالُونَاتِ الْحَدِيقَة!', missionFr: 'Éclate les ballons du jardin !', missionEn: 'Pop the garden balloons!' },
  { spawnDelay: 1100, minSpeed: 85,  maxSpeed: 135, minR: 22, maxR: 28, winCount: 12, lifetime: null, drift: 18, skyTop: 0xe0f2fe, skyBot: 0x7dd3fc, night: false, emoji: '☁️',
    missionAr: 'فَرْقِعِ الْبَالُونَاتِ فِي السَّمَاء!', missionFr: 'Éclate les ballons dans le ciel !', missionEn: 'Pop the balloons in the sky!' },
  { spawnDelay: 950,  minSpeed: 95,  maxSpeed: 150, minR: 20, maxR: 27, winCount: 12, lifetime: null, drift: 22, skyTop: 0xfef9c3, skyBot: 0xfde047, night: false, emoji: '🌈',
    missionAr: 'كُلُّ الْأَلْوَانِ! فَرْقِعْهَا!', missionFr: 'Toutes les couleurs ! Éclate-les !', missionEn: 'All the colours! Pop them!' },
  { spawnDelay: 850,  minSpeed: 105, maxSpeed: 165, minR: 18, maxR: 25, winCount: 14, lifetime: 5000, drift: 28, skyTop: 0xccfbf1, skyBot: 0x5eead4, night: false, emoji: '🐦',
    missionAr: 'سَرِيع! قَبْلَ أَنْ يَطِيرُوا!', missionFr: 'Vite ! Avant qu’ils s’envolent !', missionEn: 'Quick! Before they fly away!' },
  { spawnDelay: 800,  minSpeed: 110, maxSpeed: 175, minR: 18, maxR: 24, winCount: 14, lifetime: 4500, drift: 20, skyTop: 0x1e3a8a, skyBot: 0x312e81, night: true,  emoji: '🌙',
    missionAr: 'فَرْقِعْ بَالُونَاتِ اللَّيْلِ!', missionFr: 'Éclate les ballons de la nuit !', missionEn: 'Pop the night balloons!' },
  { spawnDelay: 720,  minSpeed: 120, maxSpeed: 190, minR: 16, maxR: 24, winCount: 16, lifetime: 4000, drift: 55, skyTop: 0xe0f2fe, skyBot: 0x0284c7, night: false, emoji: '💨',
    missionAr: 'الرِّيحُ قَوِيَّة! اُنْقُرْ سَرِيعاً!', missionFr: 'Le vent souffle ! Tape vite !', missionEn: 'The wind blows! Tap fast!' },
  { spawnDelay: 620,  minSpeed: 130, maxSpeed: 210, minR: 15, maxR: 22, winCount: 16, lifetime: 3500, drift: 40, skyTop: 0xfce7f3, skyBot: 0xfb7185, night: false, emoji: '🎉',
    missionAr: 'الْحَفْلَةُ الْكُبْرَى! فَرْقِعِ الْكُلّ!', missionFr: 'La grande fête ! Éclate-les tous !', missionEn: 'The big party! Pop them all!' },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🎈', diffLabel: '⭐',
    titleAr: 'الحفلة', titleFr: 'La fête', titleEn: 'The party',
    descAr: 'بالونات كبيرة وبطيئة', descFr: 'Gros ballons, tout doux', descEn: 'Big, slow balloons',
    gradient: 'from-rose-300 to-pink-400' },
  { level: 2, emoji: '🌸', diffLabel: '⭐',
    titleAr: 'الحديقة', titleFr: 'Le jardin', titleEn: 'The garden',
    descAr: 'بالونات الزهور', descFr: 'Ballons parmi les fleurs', descEn: 'Balloons among the flowers',
    gradient: 'from-pink-400 to-rose-500' },
  { level: 3, emoji: '☁️', diffLabel: '⭐⭐',
    titleAr: 'السماء', titleFr: 'Le ciel', titleEn: 'The sky',
    descAr: 'تطير نحو الغيوم', descFr: 'Ils montent vers les nuages', descEn: 'They rise to the clouds',
    gradient: 'from-sky-400 to-blue-500' },
  { level: 4, emoji: '🌈', diffLabel: '⭐⭐',
    titleAr: 'قوس قزح', titleFr: 'Arc-en-ciel', titleEn: 'Rainbow',
    descAr: 'كل الألوان', descFr: 'Toutes les couleurs', descEn: 'Every colour',
    gradient: 'from-amber-300 to-violet-500' },
  { level: 5, emoji: '🐦', diffLabel: '⭐⭐',
    titleAr: 'الطيور', titleFr: 'Les oiseaux', titleEn: 'Birds',
    descAr: 'قبل أن يطيروا', descFr: 'Avant qu’ils s’envolent', descEn: 'Before they fly away',
    gradient: 'from-teal-400 to-cyan-600' },
  { level: 6, emoji: '🌙', diffLabel: '⭐⭐⭐',
    titleAr: 'الليل', titleFr: 'La nuit', titleEn: 'Night',
    descAr: 'بالونات لامعة', descFr: 'Ballons qui brillent', descEn: 'Glowing balloons',
    gradient: 'from-indigo-600 to-slate-800' },
  { level: 7, emoji: '💨', diffLabel: '⭐⭐⭐',
    titleAr: 'الريح', titleFr: 'Le vent', titleEn: 'The wind',
    descAr: 'الريح تدفع البالونات', descFr: 'Le vent pousse les ballons', descEn: 'The wind pushes the balloons',
    gradient: 'from-sky-500 to-blue-700' },
  { level: 8, emoji: '🎉', diffLabel: '🏆',
    titleAr: 'الحفلة الكبرى', titleFr: 'La grande fête', titleEn: 'The big party',
    descAr: 'أسرع الحفلات', descFr: 'La fête la plus rapide', descEn: 'The fastest party',
    gradient: 'from-amber-400 to-rose-500' },
];

const COLORS = [0xef4444, 0x3b82f6, 0xfbbf24, 0x22c55e, 0xa855f7, 0xf97316, 0xec4899, 0x06b6d4];

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('balloon_pop', 8);
  const unlockedCap = (stars[4] ?? 0) > 0 ? Math.max(maxUnlocked, 5) : maxUnlocked;
  const [phase, setPhase] = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const requestLeave = useActivityExitGuard(phase === 'play', language);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
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

    const labels = {
      score: t('نقاط', 'Points', 'Score'),
      tap:   t('👆 اُنْقُرِ الْبَالُون!', '👆 Touche le ballon !', '👆 Tap the balloon!'),
      win:   t('🎉 أَحْسَنْت! بَطَلُ الْبَالُونَات!', '🎉 Bravo ! Champion des ballons !', '🎉 Balloon champion!'),
      lvl:   t(`م${activeLevel}`, `N${activeLevel}`, `L${activeLevel}`),
    };

    class Scene extends Phaser.Scene {
      private group!: Phaser.Physics.Arcade.Group;
      private score = 0;
      private misses = 0;
      private scoreTxt!: Phaser.GameObjects.Text;
      private done = false;

      constructor() { super('B'); }

      create() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(cfg.skyTop, cfg.skyTop, cfg.skyBot, cfg.skyBot, 1);
        bg.fillRect(0, 0, W, H);

        if (cfg.night) {
          for (let i = 0; i < 18; i++) {
            this.add.circle(
              Phaser.Math.Between(20, W - 20), Phaser.Math.Between(16, 160),
              Phaser.Math.Between(1, 2), 0xfef08a, 0.9,
            );
          }
          this.add.text(W - 70, 48, '🌙', { fontSize: '42px' }).setOrigin(0.5);
        } else {
          const sun = this.add.circle(70, 48, 28, 0xfde047, 0.95);
          this.add.circle(70, 48, 42, 0xfacc15, 0.28);
          this.tweens.add({ targets: sun, scaleX: 1.08, scaleY: 1.08, yoyo: true, repeat: -1, duration: 1400 });
        }

        const cloudCol = cfg.night ? 0xcbd5e1 : 0xffffff;
        [[90, 70], [280, 42], [520, 58], [700, 38]].forEach(([cx, cy]) => {
          const cg = this.add.graphics().fillStyle(cloudCol, cfg.night ? 0.35 : 0.82);
          cg.fillCircle(cx, cy, 20); cg.fillCircle(cx + 24, cy - 6, 16);
          cg.fillCircle(cx - 18, cy - 4, 13); cg.fillCircle(cx + 44, cy, 17);
        });

        const grd = this.add.graphics();
        grd.fillStyle(cfg.night ? 0x14532d : 0x4ade80); grd.fillRect(0, H - 36, W, 36);
        grd.fillStyle(cfg.night ? 0x166534 : 0x22c55e); grd.fillRect(0, H - 20, W, 20);
        if (!cfg.night) {
          [[80, H - 28, 0xf472b6], [200, H - 32, 0xfbbf24], [420, H - 26, 0xa78bfa], [620, H - 30, 0xf97316]]
            .forEach(([x, y, c]) => {
              const fl = this.add.graphics();
              fl.fillStyle(0x166534); fl.fillRect(x - 1, y, 3, 10);
              fl.fillStyle(c as number);
              for (let i = 0; i < 5; i++) {
                const a = (i / 5) * Math.PI * 2;
                fl.fillCircle(x + Math.cos(a) * 5, (y as number) + Math.sin(a) * 5, 4);
              }
              fl.fillStyle(0xfacc15); fl.fillCircle(x as number, y as number, 3);
            });
        }

        const r = cfg.maxR;
        COLORS.forEach((col, i) => {
          const g = this.add.graphics();
          g.fillStyle(col); g.fillEllipse(r, r * 1.2, r * 2, r * 2.4);
          g.fillStyle(0xffffff, 0.38); g.fillEllipse(r - r * 0.32, r * 0.85, r * 0.55, r * 0.8);
          g.fillStyle(0x1e293b, 0.85);
          g.fillCircle(r - r * 0.28, r * 1.05, Math.max(2.2, r * 0.1));
          g.fillCircle(r + r * 0.28, r * 1.05, Math.max(2.2, r * 0.1));
          g.lineStyle(2, 0x1e293b, 0.8);
          g.beginPath(); g.arc(r, r * 1.28, r * 0.32, 0.15, Math.PI - 0.15); g.strokePath();
          g.fillStyle(col); g.fillTriangle(r - 3, r * 2.4, r + 3, r * 2.4, r, r * 2.7);
          g.lineStyle(1.5, 0xffffff, 0.45);
          const sy = r * 2.8, ey = r * 2.8 + 28;
          for (let s = sy; s < ey; s += 6) {
            g.beginPath(); g.moveTo(r + Math.sin(s * 0.6) * 5, s);
            g.lineTo(r + Math.sin((s + 3) * 0.6) * 5, s + 3); g.strokePath();
          }
          g.generateTexture(`bal${i}`, r * 2 + 2, ey + 4); g.destroy();
        });

        this.group = this.physics.add.group();
        this.time.addEvent({ delay: cfg.spawnDelay, loop: true, callback: () => { if (!this.done) this.spawn(); } });
        this.time.delayedCall(180, () => { if (!this.done) this.spawn(); });
        this.time.delayedCall(600, () => { if (!this.done) this.spawn(); });

        this.scoreTxt = this.add.text(W / 2, 12, `${labels.lvl}  ·  ${labels.score}: 0 / ${cfg.winCount}`, {
          fontSize: '18px', color: cfg.night ? '#fef08a' : '#14532d', fontStyle: 'bold',
          backgroundColor: cfg.night ? '#0f172acc' : '#ffffffcc', padding: { x: 12, y: 6 },
        }).setOrigin(0.5, 0).setDepth(10);

        this.add.text(W / 2, H - 8, labels.tap, {
          fontSize: '14px', color: cfg.night ? '#fef9c3' : '#14532d', fontStyle: 'bold',
        }).setOrigin(0.5, 1).setDepth(10);
      }

      spawn() {
        const x = Phaser.Math.Between(50, W - 50);
        const ci = Phaser.Math.Between(0, COLORS.length - 1);
        const b = this.group.create(x, H + 16, `bal${ci}`) as Phaser.Physics.Arcade.Sprite;
        const scale = Phaser.Math.FloatBetween(cfg.minR / cfg.maxR, 1);
        b.setScale(scale);
        b.setVelocityY(-Phaser.Math.Between(cfg.minSpeed, cfg.maxSpeed));
        if (cfg.drift) {
          b.setVelocityX(Phaser.Math.Between(-cfg.drift, cfg.drift));
        }
        b.setInteractive(); b.setDepth(5);
        b.on('pointerdown', () => { if (b.active && !this.done) this.pop(b, COLORS[ci], true); });
        if (cfg.lifetime) {
          this.time.delayedCall(cfg.lifetime, () => {
            if (b.active) this.pop(b, COLORS[ci], false);
          });
        }
      }

      pop(b: Phaser.Physics.Arcade.Sprite, color: number, byPlayer: boolean) {
        const { x, y } = b;
        b.disableInteractive(); b.destroy();
        if (byPlayer) {
          this.score++;
          this.scoreTxt.setText(`${labels.lvl}  ·  ${labels.score}: ${this.score} / ${cfg.winCount}`);
          this.burst(x, y, color);
          playBubblePop();
          if (this.score >= cfg.winCount) this.celebrate();
        } else {
          this.misses++;
          this.burst(x, y, 0x94a3b8);
          playGentleNudge();
        }
      }

      burst(x: number, y: number, color: number) {
        for (let i = 0; i < 10; i++) {
          const dot = this.add.circle(x, y, Phaser.Math.Between(4, 8), color).setDepth(8);
          const a = (i / 10) * Math.PI * 2;
          const d = Phaser.Math.Between(35, 100);
          this.tweens.add({
            targets: dot, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d,
            alpha: 0, scaleX: 0.15, scaleY: 0.15, duration: 480, ease: 'Quad.easeOut',
            onComplete: () => dot.destroy(),
          });
        }
        const fl = this.add.circle(x, y, 28, 0xffffff, 0.75).setDepth(9);
        this.tweens.add({ targets: fl, alpha: 0, scaleX: 2.2, scaleY: 2.2, duration: 200, onComplete: () => fl.destroy() });
      }

      celebrate() {
        this.done = true;
        playSuccessChime();
        const earnedStars = this.misses === 0 ? 3 : this.misses <= 3 ? 2 : 1;
        this.cameras.main.flash(600, 255, 230, 0);
        ['🎉', '🎈', '⭐', '🌟', cfg.emoji, '🥳'].forEach((em, i) => {
          this.time.delayedCall(i * 110, () => {
            const tx = this.add.text(Phaser.Math.Between(80, W - 80), Phaser.Math.Between(80, H - 80), em, { fontSize: '36px' })
              .setDepth(20).setAlpha(0);
            this.tweens.add({
              targets: tx, alpha: 1, y: tx.y - 110, duration: 1400,
              onComplete: () => this.tweens.add({ targets: tx, alpha: 0, duration: 500 }),
            });
          });
        });
        const starsStr = '★'.repeat(earnedStars) + '☆'.repeat(3 - earnedStars);
        const p = this.add.graphics().setDepth(18);
        p.fillStyle(0x14532d, 0.94); p.fillRoundedRect(W / 2 - 220, H / 2 - 70, 440, 140, 22);
        p.lineStyle(3, 0xfbbf24); p.strokeRoundedRect(W / 2 - 220, H / 2 - 70, 440, 140, 22);
        const wt = this.add.text(W / 2, H / 2 - 18, labels.win, { fontSize: '24px', color: '#fef08a', fontStyle: 'bold' })
          .setOrigin(0.5).setDepth(19).setScale(0.2);
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
        (this.group.getChildren() as Phaser.Physics.Arcade.Sprite[]).forEach((b) => {
          if (!b.active) return;
          if (b.x < 40) { b.x = 40; b.setVelocityX(Math.abs(b.body!.velocity.x)); }
          if (b.x > W - 40) { b.x = W - 40; b.setVelocityX(-Math.abs(b.body!.velocity.x)); }
          if (b.y < -120) {
            this.misses++;
            b.destroy();
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
        gameTitle={t('فَرْقِعِ الْبَالُونَات', 'Éclate les ballons', 'Pop the balloons')}
        gameIcon="🎈"
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

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="preschool-safe-top relative flex flex-col items-center gap-4 bg-[#F8F9FA] p-4 sm:p-6 rounded-3xl min-h-screen justify-center"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => requestLeave(() => setPhase('select'))}
        className="absolute top-4 start-4 z-10 bg-white hover:bg-rose-50 text-slate-800 font-black
                   px-4 py-2 rounded-2xl shadow-md border-2 border-rose-200 cursor-pointer
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
          className="min-h-12 min-w-12 shrink-0 rounded-2xl bg-white shadow-md border-2 border-rose-300 text-2xl"
          aria-label={t('استمع', 'Écouter', 'Listen')}
        >
          🔊
        </motion.button>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-4xl aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-4 border-rose-300"
      />
    </div>
  );
};
