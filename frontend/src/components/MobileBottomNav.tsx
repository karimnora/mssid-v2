import React from 'react';
import { Home, BookOpen, Bot, Grid, User, FileText } from 'lucide-react';
import { PrimaryGrade, SubjectId } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { isLabSubjectId } from '../navigation/appLocation';

interface MobileBottomNavProps {
  grade?: PrimaryGrade;
  selectedSubject: SubjectId;
  activeTab?: 'home' | 'courses' | 'exercises' | 'games';
  onSelectTab: (tab: 'home' | 'courses' | 'exercises' | 'games') => void;
  onOpenAiTutor: () => void;
  onOpenProfile: () => void;
  onClearSelectedLesson: () => void;
  theme?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  grade,
  selectedSubject,
  activeTab,
  onSelectTab,
  onOpenAiTutor,
  onOpenProfile,
  onClearSelectedLesson,
  theme = 'dark',
}) => {
  const t = useTranslation('navigation');
  const { direction } = useLocaleContext();

  const handleTab = (tab: 'home' | 'courses' | 'exercises' | 'games') => {
    onSelectTab(tab);
    onClearSelectedLesson();
  };

  const isNeutre = theme === 'neutre';
  const isLight = theme === 'light';
  const isSepia = theme === 'sepia';
  const activeLabId = isLabSubjectId(selectedSubject) ? selectedSubject : undefined;

  const navBgClass = isNeutre
    ? 'bg-white/95 text-slate-900 border-slate-200 shadow-xl'
    : isLight
    ? 'bg-white/95 text-slate-800 border-slate-200 shadow-xl'
    : isSepia
    ? 'bg-[#F5F2EB]/95 text-stone-900 border-[#E7E2D7] shadow-xl'
    : 'bg-slate-900/95 text-white border-slate-800 shadow-2xl';

  const activeTabClass = isNeutre
    ? 'text-[var(--brand-emerald-dark)] font-extrabold bg-[var(--brand-emerald)]/10 border border-[var(--brand-emerald)]/25'
    : isLight
    ? 'text-[var(--brand-amber-dark)] font-extrabold bg-[var(--brand-amber)]/15 border border-[var(--brand-amber)]/30'
    : isSepia
    ? 'text-amber-800 font-black bg-amber-100/70 border border-amber-300/60'
    : 'text-emerald-400 font-extrabold bg-emerald-950/60';

  const inactiveTabClass = isNeutre || isLight
    ? 'text-slate-600 hover:text-slate-900'
    : isSepia
    ? 'text-stone-600 hover:text-stone-900'
    : 'text-slate-300 hover:text-white';

  const ringClass = isLight
    ? 'ring-slate-100'
    : isSepia
    ? 'ring-[#FBF9F5]'
    : 'ring-slate-900';

  const tabButton = (
    tab: 'home' | 'courses' | 'exercises' | 'games',
    icon: React.ReactNode,
    label: string
  ) => (
    <button
      type="button"
      onClick={() => handleTab(tab)}
      className={`flex flex-col items-center justify-center gap-0.5 px-3 min-h-12 rounded-2xl transition-all cursor-pointer ${
        activeTab === tab ? activeTabClass : inactiveTabClass
      }`}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </button>
  );

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] flex items-center justify-around transition-colors duration-300 ${navBgClass}`}
      dir={direction}
      data-lab-open={activeLabId}
      data-nav-compact="false"
    >
      {tabButton('home', <Home className="w-5 h-5" />, t('home'))}
      {tabButton('courses', <BookOpen className="w-5 h-5" />, t('courses'))}
      {tabButton('games', <Grid className="w-5 h-5 text-[var(--brand-amber-dark)]" />, t('games'))}

      <button
        type="button"
        onClick={onOpenAiTutor}
        className={`flex flex-col items-center justify-center -mt-5 bg-[var(--brand-emerald)] text-white min-h-14 min-w-14 p-3 rounded-full active:scale-95 transition-all ring-4 cursor-pointer bounce-soft ${ringClass}`}
        title={t('aiTutor')}
      >
        <Bot className="w-6 h-6" />
        <span className="text-xs font-extrabold tracking-tight mt-0.5">{t('aiTutorShort')}</span>
      </button>
      {tabButton('exercises', <FileText className="w-5 h-5 text-[var(--brand-blue)]" />, t('exercises'))}

      <button
        type="button"
        onClick={onOpenProfile}
        className={`flex flex-col items-center justify-center gap-0.5 px-3 min-h-12 rounded-2xl transition-all cursor-pointer ${inactiveTabClass}`}
      >
        <User className="w-5 h-5" />
        <span className="text-xs font-bold">{t('profile')}</span>
      </button>
    </nav>
  );
};
