import React from 'react';
import { PrimaryGrade } from '../types';

interface GradeSelectorProps {
  currentGrade: PrimaryGrade;
  onGradeChange: (grade: PrimaryGrade) => void;
}

const GRADES_DETAIL: { id: PrimaryGrade; titleAr: string; levelName: string; desc: string; color: string }[] = [
  { id: '1AP', titleAr: 'السنة الأولى ابتدائي', levelName: '1AP', desc: 'الحروف والأعداد الأولية والأنشطة البسيطة', color: 'from-amber-400 to-orange-500' },
  { id: '2AP', titleAr: 'السنة الثانية ابتدائي', levelName: '2AP', desc: 'الجمع والطرح وجداول القراءة والمهارات', color: 'from-emerald-400 to-teal-600' },
  { id: '3AP', titleAr: 'السنة الثالثة ابتدائي', levelName: '3AP', desc: 'الضرب والأشكال الهندسية وقواعد الإملاء', color: 'from-sky-400 to-blue-600' },
  { id: '4AP', titleAr: 'السنة الرابعة ابتدائي', levelName: '4AP', desc: 'القسمة والكسور والتناسبية والجغرافيا', color: 'from-indigo-500 to-purple-600' },
  { id: '5AP', titleAr: 'السنة الخامسة ابتدائي', levelName: '5AP', desc: 'البرنامج الكامل لشهادة التعليم الابتدائي والسوروبان', color: 'from-amber-500 via-emerald-600 to-teal-700' },
];

export const GradeSelectorBanner: React.FC<GradeSelectorProps> = ({ currentGrade, onGradeChange }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden mb-8 dir-rtl">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-3">
          <span>المنهاج التعليمي الجزائري الرسمي</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3 text-white leading-tight font-sans">
          تعلّم، تدرّب وتفوّق في المرحلة الابتدائية 🇩🇿
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-sans">
          اختر السنة الدراسية للاستفادة من المخلصات المصورة، التمارين التفاعلية، الحساب الذهني الياباني (السوروبان)، مواضيع شهادة التعليم الابتدائي، والمعلّم الذكي.
        </p>

        {/* Grade Cards Carousel/Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {GRADES_DETAIL.map((g) => {
            const isSelected = currentGrade === g.id;
            return (
              <button
                key={g.id}
                onClick={() => onGradeChange(g.id)}
                className={`p-3.5 rounded-2xl border text-right transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 border-amber-400 shadow-lg scale-[1.02] ring-2 ring-amber-400'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-emerald-300'
                    }`}>
                      {g.levelName}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm leading-snug mb-1">
                    {g.titleAr}
                  </h3>
                </div>
                <p className={`text-[11px] leading-snug line-clamp-2 mt-1 ${isSelected ? 'text-slate-600' : 'text-slate-300'}`}>
                  {g.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
