import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Droplets, Award, Info, RotateCcw } from 'lucide-react';
import { AuthService } from '../../services/authService';

interface Props {
  onReward?: (coins: number, xp: number) => void;
}

export const DensityChottLab: React.FC<Props> = ({ onReward }) => {
  const [salinityGramsPerLiter, setSalinityGramsPerLiter] = useState<number>(0); // 0 g/L (fresh water) to 350 g/L (Chott Melrhir extreme salt)
  const [testedObject, setTestedObject] = useState<'date' | 'olive' | 'wood' | 'rock'>('date');

  // Densities (g/cm3)
  const OBJECT_DENSITIES = {
    date: { nameAr: 'تمرة دقلة نور 🌴', density: 1.15, icon: '🟤' },
    olive: { nameAr: 'حبة زيتون سيق 🫒', density: 1.08, icon: '🟢' },
    wood: { nameAr: 'قطعة خشب العرعار 🪵', density: 0.70, icon: '🟫' },
    rock: { nameAr: 'حجر صحراوي 🪨', density: 2.50, icon: '⚪' },
  };

  // Water density: 1.0 g/cm3 at 0g/L, up to ~1.25 g/cm3 at 350g/L
  const waterDensity = 1.0 + (salinityGramsPerLiter / 350) * 0.25;
  const currentObj = OBJECT_DENSITIES[testedObject];
  const isFloating = waterDensity >= currentObj.density;

  const handleReward = () => {
    AuthService.addScore(25);
    if (onReward) onReward(10, 25);
  };

  return (
    <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--app-card-border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-100 text-sky-900 text-xs font-black px-3 py-1 rounded-full">
              الكتلة الحجمية ودافعة أرخميدس 🔬
            </span>
            <span className="text-xs font-bold text-sky-600">شط ملغيغ • بسكرة • الوادي</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--app-text)] mt-2">
            مختبر الكثافة: طفو دقلة نور في مياه شط ملغيغ فائقة الملوحة
          </h2>
          <p className="text-xs sm:text-sm text-[var(--app-text-muted)] mt-1">
            شاهد كيف تتغير الكتلة الحجمية للمحلول المائي بزيادة تركيز الملح، مما يجعل الأجسام تطفو عندما تصبح كثافة الماء أكبر من كثافتها!
          </p>
        </div>

        <button
          onClick={handleReward}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>إتمام التجربة (+25 XP)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--app-card-subtle)] p-5 rounded-2xl border border-[var(--app-card-border)]">
          <h3 className="font-black text-sm text-[var(--app-text)] flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>متغيرات التجربة المخبرية</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>تركيز الملح في الحوض (g/L):</span>
              <span className="text-sky-700 font-mono text-sm">{salinityGramsPerLiter} g/L</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="10"
              value={salinityGramsPerLiter}
              onChange={(e) => setSalinityGramsPerLiter(Number(e.target.value))}
              className="w-full accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-[var(--app-text-muted)] font-medium">
              <span>ماء عذب (0 g/L)</span>
              <span>بحر متوسط (38 g/L)</span>
              <span>شط ملغيغ (300+ g/L)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--app-text)]">اختر الجسم المراد اختباره:</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(OBJECT_DENSITIES) as (keyof typeof OBJECT_DENSITIES)[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTestedObject(key)}
                  className={`p-2.5 rounded-xl font-bold text-xs transition-all text-right flex items-center justify-between cursor-pointer ${
                    testedObject === key
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border border-[var(--app-card-border)]'
                  }`}
                >
                  <span>{OBJECT_DENSITIES[key].nameAr}</span>
                  <span className="text-[10px] opacity-80 font-mono">{OBJECT_DENSITIES[key].density} g/cm³</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-sky-200 text-xs space-y-1.5 text-slate-800">
            <div className="flex justify-between font-bold">
              <span>كثافة المحلول المائي (ρ):</span>
              <span className="text-sky-700 font-mono font-black text-sm">{waterDensity.toFixed(2)} g/cm³</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>كثافة الجسم المختبر (ρ):</span>
              <span className="text-amber-700 font-mono font-black text-sm">{currentObj.density.toFixed(2)} g/cm³</span>
            </div>
            <div className="pt-2 border-t border-sky-100 font-black text-center">
              {isFloating ? (
                <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs">
                  🎉 يطفو على السطح (دافعة أرخميدس &gt; الثقل)
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-xs">
                  ⬇️ يغرق في القاع (الثقل &gt; دافعة أرخميدس)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Visual Water Tank */}
        <div className="lg:col-span-7 bg-gradient-to-b from-sky-50 to-blue-100 rounded-2xl p-6 border border-sky-200 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
          <div className="text-center text-xs font-black text-sky-950 bg-white/80 py-1 px-3 rounded-full self-center border border-sky-300">
            حوض مياه شط ملغيغ (الملوحة: {salinityGramsPerLiter} g/L)
          </div>

          {/* Water Tank */}
          <div className="relative w-48 sm:w-60 h-52 mx-auto bg-gradient-to-b from-sky-200/50 via-cyan-300/70 to-blue-500/80 rounded-b-3xl border-x-4 border-b-4 border-slate-400 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Animated Object */}
            <motion.div
              animate={{
                y: isFloating ? -50 : 65,
              }}
              transition={{ type: 'spring', damping: 12, stiffness: 80 }}
              className="flex flex-col items-center z-10"
            >
              <div className="text-4xl filter drop-shadow-md">
                {currentObj.icon}
              </div>
              <span className="text-[10px] font-black bg-white/90 px-2 py-0.5 rounded-md text-slate-900 shadow-xs mt-1">
                {currentObj.nameAr.split(' ')[0]}
              </span>
            </motion.div>

            {/* Salt crystals floating when high salinity */}
            {salinityGramsPerLiter > 100 && (
              <div className="absolute inset-x-0 bottom-0 h-6 bg-white/70 backdrop-blur-xs text-center text-[10px] font-bold text-sky-900 border-t border-white flex items-center justify-center">
                ترسبات ملحية غنية 🧂
              </div>
            )}
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-sky-300 text-xs text-sky-950 text-center">
            💡 <strong>الاستنتاج العلمي:</strong> يطفو الجسم عندما تكون كتلته الحجمية أصغر من الكتلة الحجمية للسائل المحيط به، وهذا يفسر سباحة الأجسام بسهولة في الشطوط والبحار المالحة!
          </div>
        </div>
      </div>
    </div>
  );
};
