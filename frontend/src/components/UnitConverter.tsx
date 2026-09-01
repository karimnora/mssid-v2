import React, { useState } from 'react';
import { ArrowLeftRight, Calculator, Scale, Clock, Ruler, Maximize2 } from 'lucide-react';

type UnitCategory = 'length' | 'area' | 'weight' | 'capacity' | 'time';

interface UnitConverterProps {
  grade?: string;
  theme?: string;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({ grade = '4AP', theme = 'dark' }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('cm');

  const isNeutre = theme === 'neutre';
  const isLight = theme === 'light';
  const isSepia = theme === 'sepia';
  const isBright = isNeutre || isLight || isSepia;

  const cardStyle = isNeutre
    ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
    : isLight
    ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-sm'
    : isSepia
    ? 'bg-[#F5F2EB] border-[#E7E2D7] text-stone-900 shadow-sm'
    : 'bg-slate-900 border-slate-800 text-slate-100';

  const subBoxStyle = isNeutre
    ? 'bg-slate-50 border-slate-200 text-slate-800'
    : isLight
    ? 'bg-white border-slate-200 text-slate-800'
    : isSepia
    ? 'bg-[#FBF9F5] border-[#E7E2D7] text-stone-900'
    : 'bg-slate-800/80 border-slate-700/80 text-slate-100';

  const inputStyle = isNeutre
    ? 'bg-white border-slate-300 text-slate-900 focus:ring-purple-500'
    : isLight
    ? 'bg-white border-slate-300 text-slate-900 focus:ring-teal-500'
    : isSepia
    ? 'bg-white border-[#D6CEBF] text-stone-900 focus:ring-amber-500'
    : 'bg-slate-950 border-slate-700 text-white focus:ring-emerald-500';

  // Multipliers relative to base unit
  const UNITS_CONFIG: Record<
    UnitCategory,
    {
      titleAr: string;
      icon: any;
      units: { id: string; labelAr: string; factorToBase: number }[];
    }
  > = {
    length: {
      titleAr: 'قياس الأطوال (المتر m)',
      icon: Ruler,
      units: [
        { id: 'km', labelAr: 'كيلومتر (km)', factorToBase: 1000 },
        { id: 'hm', labelAr: 'هكتومتر (hm)', factorToBase: 100 },
        { id: 'dam', labelAr: 'ديكامتر (dam)', factorToBase: 10 },
        { id: 'm', labelAr: 'متر (m)', factorToBase: 1 },
        { id: 'dm', labelAr: 'ديسيمتر (dm)', factorToBase: 0.1 },
        { id: 'cm', labelAr: 'سنتيمتر (cm)', factorToBase: 0.01 },
        { id: 'mm', labelAr: 'ميليمتر (mm)', factorToBase: 0.001 },
      ],
    },
    area: {
      titleAr: 'قياس المساحات الفلاحية (المتر المربع m² والآر a)',
      icon: Maximize2,
      units: [
        { id: 'ha', labelAr: 'هكتار (ha / hm²)', factorToBase: 10000 },
        { id: 'a', labelAr: 'آر (a / dam²)', factorToBase: 100 },
        { id: 'ca', labelAr: 'سانتيار (ca / m²)', factorToBase: 1 },
        { id: 'm2', labelAr: 'متر مربع (m²)', factorToBase: 1 },
        { id: 'dm2', labelAr: 'ديسيمتر مربع (dm²)', factorToBase: 0.01 },
        { id: 'cm2', labelAr: 'سنتيمتر مربع (cm²)', factorToBase: 0.0001 },
      ],
    },
    weight: {
      titleAr: 'قياس الأوزان والكتل (الغرام g والكيلوغرام kg)',
      icon: Scale,
      units: [
        { id: 't', labelAr: 'طن (t)', factorToBase: 1000000 },
        { id: 'q', labelAr: 'قنطار (q)', factorToBase: 100000 },
        { id: 'kg', labelAr: 'كيلوغرام (kg)', factorToBase: 1000 },
        { id: 'hg', labelAr: 'هكتوغرام (hg)', factorToBase: 100 },
        { id: 'dag', labelAr: 'ديكالغرام (dag)', factorToBase: 10 },
        { id: 'g', labelAr: 'غرام (g)', factorToBase: 1 },
        { id: 'dg', labelAr: 'ديسيغرام (dg)', factorToBase: 0.1 },
        { id: 'cg', labelAr: 'سنتيغرام (cg)', factorToBase: 0.01 },
        { id: 'mg', labelAr: 'ميليغرام (mg)', factorToBase: 0.001 },
      ],
    },
    capacity: {
      titleAr: 'قياس السعات (التر L)',
      icon: Calculator,
      units: [
        { id: 'hl', labelAr: 'هكتولتر (hL)', factorToBase: 100 },
        { id: 'dal', labelAr: 'ديكالتر (daL)', factorToBase: 10 },
        { id: 'l', labelAr: 'لتر (L)', factorToBase: 1 },
        { id: 'dl', labelAr: 'ديسيلتر (dL)', factorToBase: 0.1 },
        { id: 'cl', labelAr: 'سنتيلتر (cL)', factorToBase: 0.01 },
        { id: 'ml', labelAr: 'ميليلتر (mL)', factorToBase: 0.001 },
      ],
    },
    time: {
      titleAr: 'قياس المدد الزمنية (الساعة h والدقيقة min)',
      icon: Clock,
      units: [
        { id: 'day', labelAr: 'يوم (24 ساعة)', factorToBase: 86400 },
        { id: 'h', labelAr: 'ساعة (h)', factorToBase: 3600 },
        { id: 'min', labelAr: 'دقيقة (min)', factorToBase: 60 },
        { id: 's', labelAr: 'ثانية (s)', factorToBase: 1 },
      ],
    },
  };

  const currentCategoryUnits = UNITS_CONFIG[category].units;

  // Compute conversion
  const fromFactor = currentCategoryUnits.find((u) => u.id === fromUnit)?.factorToBase || 1;
  const toFactor = currentCategoryUnits.find((u) => u.id === toUnit)?.factorToBase || 1;

  const baseValue = inputValue * fromFactor;
  const convertedValue = baseValue / toFactor;

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const newUnits = UNITS_CONFIG[newCat].units;
    setFromUnit(newUnits[0].id);
    setToUnit(newUnits[Math.min(3, newUnits.length - 1)].id);
  };

  return (
    // data-lab-instrument: this component already adapts cardStyle/subBoxStyle to the app's own
    // theme prop correctly on its own, and its "official reference table" box (bg-slate-900 /
    // bg-slate-800/80) is deliberately dark in EVERY theme, including bright/light — the app's
    // default. Without this opt-out, the lab-interior wrapper's force-light-card override still
    // neutralizes those exact classes to white while leaving their white/light text untouched,
    // making the reference table (and, in dark theme, the category-selector bar) unreadable.
    <div data-lab-instrument className={`${cardStyle} border rounded-2xl p-4 sm:p-6 shadow-xs dir-rtl transition-colors duration-300`} dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-700/30 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            📏
          </div>
          <div>
            <h3 className="font-extrabold text-base font-sans">
              محول القياسات والجداول الرسمية ({grade})
            </h3>
            <p className="text-xs opacity-70 font-sans">
              تحويلات الأطوال، المساحات الفلاحية، الأوزان، السعات والمدد
            </p>
          </div>
        </div>

        {/* Category Switcher Buttons */}
        <div className={`flex items-center p-1 rounded-xl border text-xs font-bold flex-wrap gap-1 ${isBright ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
          {(Object.keys(UNITS_CONFIG) as UnitCategory[]).map((catKey) => {
            const isCatActive = category === catKey;
            const IconComp = UNITS_CONFIG[catKey].icon;
            return (
              <button
                key={catKey}
                onClick={() => handleCategoryChange(catKey)}
                className={`flex items-center gap-1 px-3 py-1.5 min-h-[var(--hit)] rounded-lg transition-all cursor-pointer ${
                  isCatActive
                    ? 'bg-[#008751] text-white shadow-xs'
                    : isBright
                      ? 'text-slate-800 hover:bg-teal-500/10'
                      : 'text-slate-200 hover:bg-teal-500/10'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{catKey === 'length' ? 'أطوال' : catKey === 'area' ? 'مساحات' : catKey === 'weight' ? 'أوزان' : catKey === 'capacity' ? 'سعات' : 'مدد'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Converter Input Grid */}
      <div className={`${subBoxStyle} p-4 rounded-xl border mb-4`}>
        <h4 className="text-xs font-bold opacity-80 mb-3">{UNITS_CONFIG[category].titleAr}</h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* Input value & From unit */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold opacity-60 block uppercase">القيمة المراد تحويلها:</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                className={`w-full font-bold text-sm rounded-xl px-3 py-2 border focus:outline-none ${inputStyle}`}
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className={`text-xs font-bold rounded-xl px-2.5 py-2 border focus:outline-none ${inputStyle}`}
              >
                {currentCategoryUnits.map((u) => (
                  <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                    {u.labelAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap icon */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                const temp = fromUnit;
                setFromUnit(toUnit);
                setToUnit(temp);
              }}
              className={`p-2.5 border rounded-xl shadow-xs transition-transform active:scale-90 ${inputStyle}`}
              title="عكس الوحدتين"
            >
              <ArrowLeftRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>

          {/* Result value & To unit */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold opacity-60 block uppercase">النتيجة المحولة:</label>
            <div className="flex gap-2">
              <div className={`w-full font-black text-sm rounded-xl px-3 py-2 flex items-center overflow-x-auto font-mono border ${
                isBright
                  ? 'bg-teal-50 border-teal-200 text-teal-900'
                  : 'bg-teal-500/10 border-teal-500/30 text-teal-300'
              }`}>
                {convertedValue.toLocaleString('ar-DZ', { maximumFractionDigits: 6 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className={`text-xs font-bold rounded-xl px-2.5 py-2 border focus:outline-none ${inputStyle}`}
              >
                {currentCategoryUnits.map((u) => (
                  <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                    {u.labelAr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Official Scale Reference Table */}
      <div className={`rounded-xl p-4 border ${isBright ? 'bg-slate-900 text-white border-slate-800' : 'bg-black/60 text-slate-200 border-slate-800'}`}>
        <span className="text-[10px] font-mono text-teal-300 block mb-2 uppercase tracking-wider">
          جدول المهارات والنسب المرجعية للشهادة:
        </span>
        <div className="flex items-center justify-between text-xs font-bold flex-wrap gap-2">
          {category === 'area' && (
            <>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1 الهكتار (ha) = 100 آر (a) = 10,000 m²</div>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1 الآر (a) = 1 dam² = 100 m²</div>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1 السانتيار (ca) = 1 m²</div>
            </>
          )}
          {category === 'weight' && (
            <>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1 طن (t) = 10 قنطار (q) = 1000 kg</div>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1 kg = 1000 g = 10 hg = 100 dag</div>
            </>
          )}
          {category === 'length' && (
            <>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1 km = 10 hm = 100 dam = 1000 m</div>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1 m = 10 dm = 100 cm = 1000 mm</div>
            </>
          )}
          {category === 'capacity' && (
            <>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1 hL = 10 daL = 100 L</div>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1 L = 10 dL = 100 cL = 1000 mL</div>
            </>
          )}
          {category === 'time' && (
            <>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1h = 60min = 3600s</div>
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-white">1min = 60s</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
