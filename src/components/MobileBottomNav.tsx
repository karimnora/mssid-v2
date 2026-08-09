import React from 'react';
import { Home, BookOpen, Bot, Grid, User, Calculator, Sparkles, Zap, Award } from 'lucide-react';
import { SubjectId } from '../types';

interface MobileBottomNavProps {
  selectedSubject: SubjectId;
  setSelectedSubject: (subject: SubjectId) => void;
  onOpenAiTutor: () => void;
  onOpenProfile: () => void;
  onClearSelectedLesson: () => void;
  theme?: string;
  onSelectCategory?: (cat: 'courses' | 'labs' | 'exams') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  selectedSubject,
  setSelectedSubject,
  onOpenAiTutor,
  onOpenProfile,
  onClearSelectedLesson,
  theme = 'dark',
  onSelectCategory,
}) => {
  const handleSubjectChange = (subject: SubjectId, category: 'courses' | 'labs' | 'exams') => {
    setSelectedSubject(subject);
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    onClearSelectedLesson();
  };

  const isNeutre = theme === 'neutre';
  const isLight = theme === 'light';
  const isSepia = theme === 'sepia';

  const isLabSubject = [
    'arabic_conjugator',
    'french_lab',
    'english_lab',
    'soroban',
    'electricity',
    'geometry',
    'converter',
    'multiplication',
  ].includes(selectedSubject);

  const isCourseSubject = !isLabSubject && selectedSubject !== 'exams';

  const navBgClass = isNeutre
    ? 'bg-white/95 text-slate-900 border-slate-200 shadow-xl'
    : isLight
    ? 'bg-white/95 text-slate-800 border-slate-200 shadow-xl'
    : isSepia
    ? 'bg-[#F5F2EB]/95 text-stone-900 border-[#E7E2D7] shadow-xl'
    : 'bg-slate-900/95 text-white border-slate-800 shadow-2xl';

  const activeTabClass = isNeutre
    ? 'text-purple-700 font-black bg-purple-50 border border-purple-200'
    : isLight
    ? 'text-amber-700 font-black bg-amber-50 border border-amber-200'
    : isSepia
    ? 'text-amber-800 font-black bg-amber-100/70 border border-amber-300/60'
    : 'text-emerald-400 font-extrabold bg-emerald-950/60';

  const inactiveTabClass = isNeutre || isLight
    ? 'text-slate-600 hover:text-slate-900'
    : isSepia
    ? 'text-stone-600 hover:text-stone-900'
    : 'text-slate-400 hover:text-white';

  const ringClass = isLight
    ? 'ring-slate-100'
    : isSepia
    ? 'ring-[#FBF9F5]'
    : 'ring-slate-900';

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-2 py-1.5 flex items-center justify-around dir-rtl transition-colors duration-300 ${navBgClass}`}
      dir="rtl"
    >
      {/* 1. Courses Tab */}
      <button
        onClick={() => handleSubjectChange('math', 'courses')}
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
          isCourseSubject ? activeTabClass : inactiveTabClass
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px]">الدروس</span>
      </button>

      {/* 2. Standalone Interactive Labs & Conjugators Tab */}
      <button
        onClick={() => handleSubjectChange('arabic_conjugator', 'labs')}
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
          isLabSubject ? activeTabClass : inactiveTabClass
        }`}
      >
        <Zap className="w-5 h-5 text-orange-400" />
        <span className="text-[10px]">المختبرات</span>
      </button>

      {/* 3. AI Tutor Floating Center Button */}
      <button
        onClick={onOpenAiTutor}
        className={`flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all ring-4 cursor-pointer ${ringClass}`}
        title="المعلم الذكي بالذكاء الاصطناعي"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="text-[9px] font-black tracking-tight mt-0.5">المعلم الذكي</span>
      </button>

      {/* 4. Official Exams Tab */}
      <button
        onClick={() => handleSubjectChange('exams', 'exams')}
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
          selectedSubject === 'exams' ? activeTabClass : inactiveTabClass
        }`}
      >
        <Award className="w-5 h-5 text-purple-400" />
        <span className="text-[10px]">الامتحانات</span>
      </button>

      {/* 5. Profile / Account Tab */}
      <button
        onClick={onOpenProfile}
        className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${inactiveTabClass}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">حسابي</span>
      </button>
    </nav>
  );
};

