import React, { useState } from 'react';
import { CourseLesson } from '../types';
import {
  Flame,
  Zap,
  TestTube,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Sliders,
  Droplets,
  Activity,
  Award,
  Thermometer,
  Wind
} from 'lucide-react';

interface ScienceReactorInteractiveProps {
  lesson?: CourseLesson;
  grade?: string;
}

export const ScienceReactorInteractive: React.FC<ScienceReactorInteractiveProps> = ({
  lesson,
  grade = '4AP'
}) => {
  // Simulator State variables
  const [temperature, setTemperature] = useState<number>(25); // Celsius
  const [voltage, setVoltage] = useState<number>(4.5); // Volts
  const [switchClosed, setSwitchClosed] = useState<boolean>(false);
  const [selectedSubstance, setSelectedSubstance] = useState<'water' | 'saline' | 'oil' | 'copper' | 'wood'>('water');
  const [airPressure, setAirPressure] = useState<number>(1); // bar

  // Science Experiment preset based on lesson title or grade
  const getExperimentPreset = () => {
    const title = lesson?.titleAr || '';
    if (title.includes('كهرباء') || title.includes('الدارة') || title.includes('نواقل')) {
      return 'electricity';
    } else if (title.includes('غاز') || title.includes('هواء') || title.includes('ضغط')) {
      return 'gas_properties';
    } else if (title.includes('ماء') || title.includes('حالة') || title.includes('تبخر')) {
      return 'states_of_matter';
    }
    return 'general_lab';
  };

  const expPreset = getExperimentPreset();

  // Electricity calculations
  const isConductor = selectedSubstance === 'copper' || selectedSubstance === 'saline';
  const bulbBrightness = switchClosed && isConductor ? Math.min(100, Math.round((voltage / 9) * 100)) : 0;

  // States of Matter calculations
  const getWaterState = (temp: number) => {
    if (temp <= 0) return { name: 'حالة صلبة (جليد ❄️)', color: 'text-cyan-400 bg-cyan-950/80 border-cyan-800' };
    if (temp >= 100) return { name: 'حالة غازية (بخار ماء ♨️)', color: 'text-amber-400 bg-amber-950/80 border-amber-800' };
    return { name: 'حالة سائلة (ماء 💧)', color: 'text-blue-400 bg-blue-950/80 border-blue-800' };
  };

  const currentState = getWaterState(temperature);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-md space-y-6 dir-rtl" dir="rtl">
      {/* Header Banner */}
      <div
        className="text-white rounded-2xl p-5 shadow-sm border border-cyan-800/50 flex items-center justify-between flex-wrap gap-3"
        style={{ backgroundImage: 'linear-gradient(to right, #0f172a, #1e1b4b, #083344)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-slate-950 font-black flex items-center justify-center text-2xl shadow-sm">
            🧪
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
              <span>مفاعل التجارب والمختبر العلمي التفاعلي</span>
              <span className="text-xs bg-cyan-300 text-slate-950 font-black px-2.5 py-0.5 rounded-md">
                {lesson?.grade || grade}
              </span>
            </h3>
            <p className="text-xs text-cyan-200 font-sans mt-0.5">
              تجربة درس: {lesson?.titleAr || 'النشاط العلمي والتجريبي'}
            </p>
          </div>
        </div>

        <span className="bg-white/10 text-cyan-100 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>محاكاة تفاعلية حية</span>
        </span>
      </div>

      {/* EXPERIMENT SIMULATION BOARD */}
      {expPreset === 'electricity' && (
        <div className="bg-slate-950 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <h4 className="font-extrabold text-sm sm:text-base text-cyan-400 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>مفاعل الدارة الكهربائية والنواقل والتوصيل</span>
            </h4>
            <span className="text-xs font-bold text-slate-400">
              اختبر العوازل والنواقل مع تغير الفولطية
            </span>
          </div>

          {/* Interactive Circuit Visualization */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[200px] relative space-y-4">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {/* Battery */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-10 bg-amber-500 text-slate-950 font-black rounded-xl flex items-center justify-center text-xs shadow-md">
                  🔋 {voltage}V
                </div>
                <span className="text-[11px] text-slate-400 mt-1">المولد/البطارية</span>
              </div>

              {/* Wire Connection */}
              <div className={`h-1.5 w-16 transition-colors ${switchClosed ? 'bg-amber-400 shadow-amber-400 shadow-sm' : 'bg-slate-700'}`} />

              {/* Switch */}
              <button
                onClick={() => setSwitchClosed(!switchClosed)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  switchClosed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white'
                }`}
              >
                {switchClosed ? 'الدارة مغلقة ⚡' : 'الدارة مفتوحة 🔴'}
              </button>

              {/* Wire Connection */}
              <div className={`h-1.5 w-16 transition-colors ${switchClosed && isConductor ? 'bg-amber-400 shadow-amber-400 shadow-sm' : 'bg-slate-700'}`} />

              {/* Tested Material */}
              <div className="flex flex-col items-center">
                <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                  isConductor ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-rose-950 border-rose-500 text-rose-300'
                }`}>
                  {selectedSubstance === 'copper' && '🔗 سلك نحاس (ناقل)'}
                  {selectedSubstance === 'saline' && '🧪 ماء مالح (ناقل)'}
                  {selectedSubstance === 'wood' && '🪵 قطة خشب (عازل)'}
                  {selectedSubstance === 'water' && '💧 ماء نقي (عازل ضعيف)'}
                  {selectedSubstance === 'oil' && '🛢️ زيت (عازل)'}
                </div>
                <span className="text-[11px] text-slate-400 mt-1">المادة المختبرة</span>
              </div>

              {/* Wire Connection */}
              <div className={`h-1.5 w-16 transition-colors ${bulbBrightness > 0 ? 'bg-amber-400 shadow-amber-400 shadow-sm' : 'bg-slate-700'}`} />

              {/* Light Bulb */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    bulbBrightness > 0
                      ? 'bg-amber-400 text-slate-950 ring-8 ring-amber-400/30 shadow-lg shadow-amber-400/50 scale-110'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  💡
                </div>
                <span className="text-[11px] text-slate-400 mt-1">
                  {bulbBrightness > 0 ? `توهج المصباح (${bulbBrightness}%)` : 'المصباح منطفئ'}
                </span>
              </div>
            </div>

            {/* Scientific Observation Box */}
            <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed">
              <span className="font-extrabold text-amber-300 block mb-1">🔍 الاستنتاج العلمي المباشر:</span>
              {switchClosed ? (
                isConductor ? (
                  <span className="text-emerald-300">
                    تسمح مادة ({selectedSubstance === 'copper' ? 'النحاس' : 'الماء المالح'}) بمرور التيار الكهربائي لأنها <strong>ناقلة للكهرباء</strong>، مما يؤدي لإغلاق الدارة وتوهج المصباح!
                  </span>
                ) : (
                  <span className="text-rose-300">
                    لا يمر التيار الكهربائي لأن مادة ({selectedSubstance === 'wood' ? 'الخشب' : selectedSubstance === 'oil' ? 'الزيت' : 'الماء النقي'}) تعتبر <strong>عازلة للكهرباء</strong>.
                  </span>
                )
              ) : (
                <span className="text-slate-400">
                  الدارة المفتوحة لا تجعل التيار الكهربائي يسري. اضغط على القاطعة لإغلاق الدارة.
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 block">اختبار المادة الناقلة والعازلة:</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'copper', label: 'سلك نحاسي' },
                  { id: 'saline', label: 'ماء مالح' },
                  { id: 'wood', label: 'قطعة خشب' },
                  { id: 'water', label: 'ماء مقطر' },
                  { id: 'oil', label: 'زيت' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSubstance(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      selectedSubstance === item.id
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>تعديل قوة المولد (Volts):</span>
                <span className="text-amber-400 font-mono font-bold">{voltage} V</span>
              </label>
              <input
                type="range"
                min="1.5"
                max="12"
                step="1.5"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* STATES OF MATTER & THERMAL REACTOR */}
      {expPreset !== 'electricity' && (
        <div className="bg-slate-950 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <h4 className="font-extrabold text-sm sm:text-base text-cyan-400 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-amber-400" />
              <span>مفاعل تحولات المادة والحرارة والتأثيرات البيئية</span>
            </h4>
            <span className="text-xs font-bold text-slate-400">
              تغيير درجة الحرارة والضغط لملاحظة التغيرات الفيزيائية
            </span>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px] relative space-y-4">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {/* Thermal Container */}
              <div className="relative w-36 h-36 bg-slate-950 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center shadow-inner overflow-hidden">
                {/* Visual state animation */}
                {temperature <= 0 && (
                  <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center text-4xl animate-pulse">
                    🧊
                  </div>
                )}
                {temperature > 0 && temperature < 100 && (
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-blue-600/40 flex items-center justify-center text-3xl">
                    💧
                  </div>
                )}
                {temperature >= 100 && (
                  <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center text-4xl animate-bounce">
                    ♨️
                  </div>
                )}

                <div className="relative z-10 text-center font-extrabold text-xs">
                  <div className="text-xl font-mono text-amber-400 font-black">{temperature}°C</div>
                </div>
              </div>

              {/* State Badge */}
              <div className={`p-4 rounded-2xl border font-black text-sm ${currentState.color}`}>
                {currentState.name}
              </div>
            </div>

            {/* scientific deduction */}
            <div className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed">
              <span className="font-extrabold text-cyan-300 block mb-1">🔍 التفسير الفيزيائي:</span>
              {temperature <= 0 && 'عند انخفاض الحرارة إلى 0°C أو أقل، يتحول الماء السائل إلى جليد صلب بفعل الانجماد.'}
              {temperature > 0 && temperature < 100 && 'في درجات الحرارة العادية، يحتفظ الماء بحالته السائلة وياخذ شكل الإناء الذي يوضع فيه.'}
              {temperature >= 100 && 'عند الوصول إلى درجة الغليان 100°C، يتحول الماء السائل إلى بخار غازي يتصاعد في الهواء بفعل التبخر.'}
            </div>
          </div>

          {/* Temperature Controls */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>التحكم في درجة حرارة المفاعل:</span>
              </span>
              <span className="text-amber-400 font-mono font-black text-sm">{temperature}°C</span>
            </div>

            <input
              type="range"
              min="-20"
              max="120"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400">
              <button onClick={() => setTemperature(-10)} className="hover:text-cyan-300 cursor-pointer">❄️ انجماد (-10°C)</button>
              <button onClick={() => setTemperature(25)} className="hover:text-blue-300 cursor-pointer">💧 حرارة الغرفة (25°C)</button>
              <button onClick={() => setTemperature(105)} className="hover:text-amber-300 cursor-pointer">♨️ غليان وتبخر (105°C)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
