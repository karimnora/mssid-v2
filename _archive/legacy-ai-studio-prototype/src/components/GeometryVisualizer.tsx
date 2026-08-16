import React, { useState } from 'react';
import { Box, Circle, Square, Compass, Sparkles } from 'lucide-react';

interface ShapeInfo {
  id: string;
  nameAr: string;
  category: '2d' | '3d';
  propertiesAr: string[];
  perimeterFormulaAr?: string;
  areaFormulaAr?: string;
  volumeFormulaAr?: string;
  svgIcon: string;
}

const SHAPES: ShapeInfo[] = [
  {
    id: 'square',
    nameAr: 'المربع (Square)',
    category: '2d',
    propertiesAr: ['مضلع رباعي له 4 أضلاع متقايسة متسامتة', 'له 4 زوايا قائمة (90°)', 'قطراه متقايسان ومتعامدان ومتناصفان'],
    perimeterFormulaAr: 'المحيط = الضلع × 4',
    areaFormulaAr: 'المساحة = الضلع × الضلع (a²)',
    svgIcon: 'square'
  },
  {
    id: 'rectangle',
    nameAr: 'المستطيل (Rectangle)',
    category: '2d',
    propertiesAr: ['مضلع رباعي كل ضلعين متقابلين متوازيان ومتقايسان', 'له 4 زوايا قائمة (90°)', 'قطراه متقايسان ومتناصفان وغير متعامدين'],
    perimeterFormulaAr: 'المحيط = (الطول + العرض) × 2',
    areaFormulaAr: 'المساحة = الطول × العرض (L × l)',
    svgIcon: 'rectangle'
  },
  {
    id: 'triangle',
    nameAr: 'المثلثات الخاصة (Triangles)',
    category: '2d',
    propertiesAr: ['مثلث قائم: فيه زاوية قائمة (90°)', 'متساوي الساقين: فيه ضلعان متقايسان وزاويتان متقايستان', 'متقايس الأضلاع: أضلاعه الثلاثة وزواياه الـ 3 متقايسة (60°)'],
    perimeterFormulaAr: 'المحيط = مجموع أطوال أضلاعه الثلاثة',
    areaFormulaAr: 'المساحة = (القاعدة × الارتفاع) ÷ 2',
    svgIcon: 'triangle'
  },
  {
    id: 'circle',
    nameAr: 'الدائرة والقرص (Circle & Disk)',
    category: '2d',
    propertiesAr: ['الدائرة: مجموعة نقط تبعد ببعد ثابت (نصف القطر r) عن المركز O', 'القطر D = 2 × r', 'الوتر: قطعة تربط نقطتين ولا تمر بالمركز'],
    perimeterFormulaAr: 'محيط الدائرة = القطر × π (حيث π ≈ 3.14)',
    areaFormulaAr: 'مساحة القرص = r × r × π',
    svgIcon: 'circle'
  },
  {
    id: 'cube',
    nameAr: 'المكعب (Cube)',
    category: '3d',
    propertiesAr: ['مجسم منتظم له 6 أوجه مربعة متطابقة', 'له 12 حرفاً متقايساً و 8 رؤوس', 'كل زواياه قائمة'],
    areaFormulaAr: 'المساحة الكلية = الحرف × الحرف × 6',
    volumeFormulaAr: 'الحجم = الحرف × الحرف × الحرف (c³)',
    svgIcon: 'cube'
  },
  {
    id: 'cuboid',
    nameAr: 'متوازي المستطيلات (Cuboid)',
    category: '3d',
    propertiesAr: ['مجسم له 6 أوجه مستطيلة الشكل (كل وجهين متقابلين متطابقان)', 'له 12 حرفاً و 8 رؤوس', 'أبعاده الثلاثة: الطول، العرض، والارتفاع'],
    areaFormulaAr: 'المساحة الجانبية = محيط القاعدة × الارتفاع',
    volumeFormulaAr: 'الحجم = الطول × العرض × الارتفاع (L × l × h)',
    svgIcon: 'cuboid'
  },
  {
    id: 'cylinder',
    nameAr: 'الأسطوانة الدائرية (Cylinder)',
    category: '3d',
    propertiesAr: ['مجسم يتكون من قاعدتين دائريتين متوازيتين ومتقايستين', 'سطح جانبي منحني يلتف حول الارتفاع h'],
    areaFormulaAr: 'المساحة الجانبية = محيط القاعدة × الارتفاع = 2 × π × r × h',
    volumeFormulaAr: 'الحجم = مساحة القاعدة × الارتفاع = π × r² × h',
    svgIcon: 'cylinder'
  }
];

interface GeometryVisualizerProps {
  grade?: string;
  theme?: string;
}

export const GeometryVisualizer: React.FC<GeometryVisualizerProps> = ({ grade = '4AP', theme = 'dark' }) => {
  const [selectedShapeId, setSelectedShapeIndex] = useState<string>('square');

  const selectedShape = SHAPES.find((s) => s.id === selectedShapeId) || SHAPES[0];

  const isNeutre = theme === 'neutre';
  const isLight = theme === 'light';
  const isSepia = theme === 'sepia';

  const cardStyle = isNeutre
    ? 'bg-white border-slate-200 text-slate-900'
    : isLight
    ? 'bg-slate-50 border-slate-200 text-slate-900'
    : isSepia
    ? 'bg-[#F5F2EB] border-[#E7E2D7] text-stone-900'
    : 'bg-slate-900 border-slate-800 text-slate-100';

  const subBoxStyle = isNeutre
    ? 'bg-slate-50 border-slate-200 text-slate-800'
    : isLight
    ? 'bg-white border-slate-200 text-slate-800'
    : isSepia
    ? 'bg-[#FBF9F5] border-[#E7E2D7] text-stone-900'
    : 'bg-slate-800/80 border-slate-700/80 text-slate-100';

  return (
    <div className={`${cardStyle} border rounded-2xl p-4 sm:p-6 shadow-xs dir-rtl transition-colors duration-300`} dir="rtl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-700/30 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            📐
          </div>
          <div>
            <h3 className="font-extrabold text-base font-sans flex items-center gap-2">
              <span>المستكشف الهندسي التفاعلي</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                {grade}
              </span>
            </h3>
            <p className="text-xs opacity-70 font-sans">
              الأشكال الهندسية ثنائية وثلاثية الأبعاد وقوانين المحيط والمساحة والحجم
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className={`flex gap-1 p-1 rounded-xl border text-xs font-bold flex-wrap ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
          {SHAPES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedShapeIndex(s.id)}
              className={`px-2.5 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
                selectedShapeId === s.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'opacity-70 hover:opacity-100 hover:bg-amber-500/10'
              }`}
            >
              {s.nameAr.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualizer Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Interactive SVG Render Canvas */}
        <div className="md:col-span-5 bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
          <div className="text-[10px] font-mono text-amber-400/70 absolute top-3 right-3 uppercase tracking-wider">
            {selectedShape.category === '2d' ? '2D PLANE SHAPE' : '3D SOLID GEOMETRY'}
          </div>

          {/* SVG Shape Drawings */}
          <div className="w-36 h-36 flex items-center justify-center">
            {selectedShape.id === 'square' && (
              <svg className="w-28 h-28 text-amber-400 stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="3">
                <rect x="10" y="10" width="80" height="80" rx="4" className="fill-amber-500/10" />
                <path d="M10,10 L90,90 M90,10 L10,90" strokeDasharray="3,3" strokeWidth="1.5" className="text-slate-500" />
              </svg>
            )}
            {selectedShape.id === 'rectangle' && (
              <svg className="w-32 h-20 text-emerald-400 stroke-current" viewBox="0 0 120 70" fill="none" strokeWidth="3">
                <rect x="5" y="5" width="110" height="60" rx="4" className="fill-emerald-500/10" />
                <path d="M5,5 L115,65 M115,5 L5,65" strokeDasharray="3,3" strokeWidth="1.5" className="text-slate-500" />
              </svg>
            )}
            {selectedShape.id === 'triangle' && (
              <svg className="w-28 h-28 text-sky-400 stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="3">
                <polygon points="50,10 10,90 90,90" className="fill-sky-500/10" />
                <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="3,3" strokeWidth="1.5" className="text-amber-400" />
              </svg>
            )}
            {selectedShape.id === 'circle' && (
              <svg className="w-28 h-28 text-indigo-400 stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="3">
                <circle cx="50" cy="50" r="40" className="fill-indigo-500/10" />
                <line x1="50" y1="50" x2="90" y2="50" strokeWidth="2" className="text-amber-400" />
                <circle cx="50" cy="50" r="3" className="fill-amber-400 stroke-none" />
              </svg>
            )}
            {selectedShape.id === 'cube' && (
              <svg className="w-28 h-28 text-purple-400 stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="2.5">
                <rect x="15" y="30" width="55" height="55" className="fill-purple-500/10" />
                <rect x="30" y="15" width="55" height="55" className="fill-purple-500/10" />
                <line x1="15" y1="30" x2="30" y2="15" />
                <line x1="70" y1="30" x2="85" y2="15" />
                <line x1="15" y1="85" x2="30" y2="70" />
                <line x1="70" y1="85" x2="85" y2="70" />
              </svg>
            )}
            {selectedShape.id === 'cuboid' && (
              <svg className="w-32 h-24 text-teal-400 stroke-current" viewBox="0 0 120 80" fill="none" strokeWidth="2">
                <rect x="10" y="25" width="70" height="45" className="fill-teal-500/10" />
                <rect x="30" y="10" width="70" height="45" className="fill-teal-500/10" />
                <line x1="10" y1="25" x2="30" y2="10" />
                <line x1="80" y1="25" x2="100" y2="10" />
                <line x1="10" y1="70" x2="30" y2="55" />
                <line x1="80" y1="70" x2="100" y2="55" />
              </svg>
            )}
            {selectedShape.id === 'cylinder' && (
              <svg className="w-24 h-32 text-orange-400 stroke-current" viewBox="0 0 80 100" fill="none" strokeWidth="2">
                <ellipse cx="40" cy="20" rx="30" ry="10" className="fill-orange-500/10" />
                <ellipse cx="40" cy="80" rx="30" ry="10" className="fill-orange-500/10" />
                <line x1="10" y1="20" x2="10" y2="80" />
                <line x1="70" y1="20" x2="70" y2="80" />
              </svg>
            )}
          </div>
        </div>

        {/* Right Info & Formulas Pane */}
        <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-base mb-2 font-sans">{selectedShape.nameAr}</h4>
            <div className={`${subBoxStyle} p-3 rounded-xl border mb-3`}>
              <span className="text-[10px] font-bold opacity-60 block uppercase mb-1">الخصائص المميزة:</span>
              <ul className="list-disc list-inside space-y-1 text-xs font-medium">
                {selectedShape.propertiesAr.map((prop, pIdx) => (
                  <li key={pIdx}>{prop}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            {selectedShape.perimeterFormulaAr && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>قانون المحيط:</span>
                <span className="font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">{selectedShape.perimeterFormulaAr}</span>
              </div>
            )}
            {selectedShape.areaFormulaAr && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-amber-400">
                <span>قانون المساحة:</span>
                <span className="font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">{selectedShape.areaFormulaAr}</span>
              </div>
            )}
            {selectedShape.volumeFormulaAr && (
              <div className="bg-purple-500/10 border border-purple-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-purple-400">
                <span>قانون الحجم:</span>
                <span className="font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">{selectedShape.volumeFormulaAr}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
