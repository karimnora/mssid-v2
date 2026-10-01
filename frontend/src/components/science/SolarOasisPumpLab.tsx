import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Zap, Droplets, Sparkles, Award, RotateCcw, AlertTriangle } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { useTranslation } from '../../hooks/useTranslation';

interface Props {
  onReward?: (coins: number, xp: number) => void;
}

export const SolarOasisPumpLab: React.FC<Props> = ({ onReward }) => {
  const t = useTranslation('labsScience');
  const [solarAngle, setSolarAngle] = useState<number>(31); // optimal 31° for Algerian desert
  const [sunlightHours, setSunlightHours] = useState<number>(12); // 0 to 24 (noon is peak)
  const [batteryConnected, setBatteryConnected] = useState<boolean>(true);

  // Efficiency calculation based on angle and time of day
  const angleEfficiency = Math.max(0.2, 1 - Math.abs(solarAngle - 31) * 0.025);
  const timeFactor = Math.max(0, Math.sin(((sunlightHours - 6) / 12) * Math.PI));
  const powerGeneratedWatts = Math.round(1500 * angleEfficiency * timeFactor);
  const pumpingRateM3h = (powerGeneratedWatts * 0.008).toFixed(1);

  const handleReward = () => {
    AuthService.addScore(25);
    if (onReward) onReward(10, 25);
  };

  return (
    <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--app-card-border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-900 text-xs font-black px-3 py-1 rounded-full">
              {t('solarBadgeTopic')}
            </span>
            <span className="text-xs font-bold text-amber-600">{t('solarBadgeLocation')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--app-text)] mt-2">
            {t('solarTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--app-text-muted)] mt-1">
            {t('solarIntro')}
          </p>
        </div>

        <button
          onClick={handleReward}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>إتمام التجربة (+25 XP)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-4 bg-[var(--app-card-subtle)] p-5 rounded-2xl border border-[var(--app-card-border)]">
          <h3 className="font-black text-sm text-[var(--app-text)] flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>لوحة التحكم الشمسية</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>زاوية ميل الألواح (°):</span>
              <span className="text-yellow-700 font-mono">{solarAngle}° (المثالية ~31°)</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={solarAngle}
              onChange={(e) => setSolarAngle(Number(e.target.value))}
              className="w-full accent-yellow-500"
            />
            <div className="flex justify-between text-[10px] text-[var(--app-text-muted)]">
              <span>أفقي (0°)</span>
              <span>جنوب جزائري (31°)</span>
              <span>عمودي (90°)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>ساعة النهار (موقع الشمس):</span>
              <span className="text-amber-700 font-mono">{sunlightHours}:00 سا</span>
            </div>
            <input
              type="range"
              min="6"
              max="18"
              value={sunlightHours}
              onChange={(e) => setSunlightHours(Number(e.target.value))}
              aria-label="ساعة النهار (موقع الشمس)"
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-[var(--app-text-muted)]">
              <span>شروق (06:00)</span>
              <span>ذروة الظهيرة (12:00)</span>
              <span>غروب (18:00)</span>
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-yellow-200 text-xs space-y-1.5 text-slate-800">
            <div className="flex justify-between font-bold">
              <span>⚡ الطاقة المولدة:</span>
              <span className="text-amber-600 font-mono text-sm">{powerGeneratedWatts} Watt</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>💧 معدل تدفق الضخ:</span>
              <span className="text-cyan-600 font-mono text-sm">{pumpingRateM3h} م³/ساعة</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (powerGeneratedWatts / 1500) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Visual Lab Display */}
        <div className="lg:col-span-8 bg-gradient-to-b from-sky-200 via-amber-100 to-amber-200 rounded-2xl p-6 border border-yellow-300 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
          {/* Sun Representation */}
          <motion.div
            animate={{
              x: ((sunlightHours - 6) / 12) * 260 - 130,
              y: -Math.sin(((sunlightHours - 6) / 12) * Math.PI) * 40,
            }}
            transition={{ type: 'spring', damping: 15 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          >
            <div className="w-14 h-14 rounded-full bg-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.9)] flex items-center justify-center text-2xl border-2 border-yellow-200 animate-pulse">
              ☀️
            </div>
            <span className="text-[10px] font-black text-amber-900 mt-1 bg-white/70 px-2 py-0.5 rounded-full">
              شمس الصحراء الجزائرية
            </span>
          </motion.div>

          <div className="h-20" />

          {/* Solar Panel & Pump Ground System */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mt-auto z-10">
            {/* Solar Panel */}
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-yellow-300 text-center space-y-2">
              <div className="font-black text-xs text-slate-800">الألواح الشمسية الكهروضوئية</div>
              <div
                className="w-24 h-16 mx-auto border-2 border-slate-400 rounded-lg shadow-md transition-transform duration-300 flex items-center justify-center text-yellow-300 text-xs font-mono font-bold"
                style={{ transform: `rotate(-${solarAngle / 2}deg)`, backgroundImage: 'linear-gradient(to bottom right, #1e3a8a, #1e1b4b)' }}
              >
                ⚡ {powerGeneratedWatts}W
              </div>
              <div className="text-[10px] text-slate-600 font-bold">زاوية الميل الحالية: {solarAngle}°</div>
            </div>

            {/* Submersible Pump */}
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-cyan-300 text-center space-y-2">
              <div className="font-black text-xs text-slate-800">مضخة السقي الفلاحي الغاطسة</div>
              <div className="flex items-center justify-center gap-2">
                <div className="text-2xl">🚜</div>
                <div className="text-2xl">🌴</div>
              </div>
              <div className="text-xs font-bold text-cyan-800">
                تدفق السقي: <span className="font-mono text-sm">{pumpingRateM3h} m³/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
