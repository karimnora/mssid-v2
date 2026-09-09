import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, Sparkles, Volume2, Award, Info, RotateCcw } from 'lucide-react';
import { AuthService } from '../../services/authService';

interface Props {
  onReward?: (coins: number, xp: number) => void;
}

export const FoggaraHydraulicLab: React.FC<Props> = ({ onReward }) => {
  const [slope, setSlope] = useState<number>(3); // 1 to 5 degrees
  const [channelsCount, setChannelsCount] = useState<number>(3); // 2 to 4 branches (قصريات)
  const [isWaterFlowing, setIsWaterFlowing] = useState<boolean>(true);
  const [selectedSeguia, setSelectedSeguia] = useState<number | null>(null);

  const totalFlowLps = slope * 25; // Liters per second
  const flowPerChannel = (totalFlowLps / channelsCount).toFixed(1);

  const handleReward = () => {
    AuthService.addScore(25);
    if (onReward) onReward(10, 25);
  };

  return (
    <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--app-card-border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">
              الهندسة المائية التراثية الجزائرية 🏛️
            </span>
            <span className="text-xs font-bold text-teal-600">أدرار • تيميمون • قورارة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--app-text)] mt-2">
            مختبر محاكاة الفَقّارَة والقَصْرِيّة (توزيع المياه بالجاذبية)
          </h2>
          <p className="text-xs sm:text-sm text-[var(--app-text-muted)] mt-1">
            اكتشف العبقرية الهندسية للأجداد في جلب المياه الجوفية بدون مضخات وتوزيعها بعدالة تامة عبر مشط القصريّة الحجري.
          </p>
        </div>

        <button
          onClick={handleReward}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>إتمام التجربة (+25 XP)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-4 bg-[var(--app-card-subtle)] p-5 rounded-2xl border border-[var(--app-card-border)]">
          <h3 className="font-black text-sm text-[var(--app-text)] flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-600" />
            <span>لوحة التحكم الهيدروليكية</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>انحدار النفق الجوفي (الجاذبية):</span>
              <span className="text-amber-700 font-mono">{slope}° درجات</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={slope}
              onChange={(e) => setSlope(Number(e.target.value))}
              aria-label="انحدار النفق الجوفي (الجاذبية)"
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-[var(--app-text-muted)]">
              <span>انسياب هادئ (1°)</span>
              <span>تدفق سريع (5°)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>عدد فروع القصرية (السواقي):</span>
              <span className="text-cyan-700 font-mono">{channelsCount} بساتين</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setChannelsCount(num)}
                  className={`py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    channelsCount === num
                      ? 'bg-cyan-700 text-white shadow-sm'
                      : 'bg-[var(--app-card-bg)] text-[var(--app-text-muted)] border border-[var(--app-card-border)]'
                  }`}
                >
                  {num} سواقي
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs space-y-1 text-amber-900">
            <div className="font-bold flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>قانون التدفق المحسوب:</span>
            </div>
            <p>التدفق الكلي: <strong className="font-mono">{totalFlowLps} لتر/ثانية</strong></p>
            <p>حصة كل ساقية: <strong className="font-mono">{flowPerChannel} لتر/ثانية</strong> بالتساوي الكامل!</p>
          </div>
        </div>

        {/* Visual Animation */}
        <div className="lg:col-span-8 bg-gradient-to-b from-amber-50 to-orange-100 rounded-2xl p-5 border border-amber-200 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
          {/* Header of simulation */}
          <div className="flex justify-between items-center text-xs z-10">
            <span className="bg-white/90 font-bold px-3 py-1 rounded-full text-amber-950 border border-amber-300">
              🏞️ مدخل النفق الجوفي (المنبع)
            </span>
            <span className="bg-cyan-700 text-white font-black px-3 py-1 rounded-full text-xs shadow-xs">
              مقسم القصرية الحجري
            </span>
          </div>

          {/* Canvas Illustration */}
          <div className="my-6 space-y-4">
            {/* Main Channel */}
            <div className="relative h-10 bg-amber-200 rounded-xl overflow-hidden border-2 border-amber-400">
              <motion.div
                animate={{ x: isWaterFlowing ? [0, 40, 0] : 0 }}
                transition={{ repeat: Infinity, duration: 1.5 / slope, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-black">
                ماء جوفي منساب بانحدار {slope}° ➔
              </div>
            </div>

            {/* Splitter Comb (القصريّة) */}
            <div className="text-center font-black text-xs text-amber-950 bg-amber-300/80 py-1 rounded-lg border border-amber-400">
              ⬇️ مشط القصريّة يوزع الماء بنسب دقيقة وحسابات هندسية ⬇️
            </div>

            {/* Channels (السواقي) */}
            <div className={`grid grid-cols-${channelsCount} gap-3`}>
              {Array.from({ length: channelsCount }).map((_, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setSelectedSeguia(idx + 1)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-center relative overflow-hidden ${
                    selectedSeguia === idx + 1
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-amber-300 bg-white/90'
                  }`}
                >
                  <div className="text-lg">🌴</div>
                  <div className="font-black text-xs text-slate-800 mt-1">بستان الواحة {idx + 1}</div>
                  <div className="text-[11px] font-mono text-cyan-700 font-bold">{flowPerChannel} L/s</div>
                  <div className="h-2 w-full bg-cyan-100 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="h-full bg-cyan-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-amber-300 text-xs text-amber-950">
            💡 <strong>فائدة علمية:</strong> نظام الفَقّارة الجزائري مصنف تراثاً عالمياً للإنسانية لدى اليونسكو، ويعتمد كلياً على مبادئ الضغط الجوي والجاذبية الأرضية لتغذية واحات الصحراء منذ قرون.
          </div>
        </div>
      </div>
    </div>
  );
};
