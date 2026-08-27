import React from 'react';
import { Home, BookOpen, Grid, User, FileText } from 'lucide-react';
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

  const isDark = theme === 'dark' || theme === 'midnight';
  const activeLabId = isLabSubjectId(selectedSubject) ? selectedSubject : undefined;

  const navBgClass = isDark
    ? 'bg-slate-900 text-white border-slate-800'
    : 'bg-white text-[var(--kids-ink)] border-[var(--app-card-subtle)]';

  const activeTabClass = isDark
    ? 'text-emerald-400 font-extrabold'
    : 'text-[var(--kids-grass-2)] font-extrabold';

  const inactiveTabClass = isDark
    ? 'text-slate-400'
    : 'text-[#B7A996]';

  const tabButton = (
    tab: 'home' | 'courses' | 'exercises' | 'games',
    icon: React.ReactNode,
    label: string
  ) => (
    <button
      type="button"
      onClick={() => handleTab(tab)}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-h-12 rounded-2xl transition-colors cursor-pointer ${
        activeTab === tab ? `${activeTabClass} bg-[var(--kids-grass-1)]/20` : inactiveTabClass
      }`}
      aria-current={activeTab === tab ? 'page' : undefined}
    >
      {icon}
      <span className="text-[11px] font-extrabold">{label}</span>
    </button>
  );

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t-[3px] px-1 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-end justify-around ${navBgClass}`}
      dir={direction}
      data-lab-open={activeLabId}
      data-nav-compact="false"
    >
      {tabButton('home', <Home className="w-5 h-5" />, t('home'))}
      {tabButton('courses', <BookOpen className="w-5 h-5" />, t('courses'))}
      {tabButton('games', <Grid className="w-5 h-5" />, t('games'))}

      <div className="flex flex-col items-center flex-1">
        <button
          type="button"
          onClick={onOpenAiTutor}
          className={`kids-nav-ai kids-pop w-[56px] h-[56px] -mt-7 rounded-full bg-gradient-to-br from-[var(--kids-sun-1)] to-[var(--kids-coral-2)] text-white flex items-center justify-center text-[26px] border-4 cursor-pointer ${
            isDark ? 'border-slate-900' : 'border-white'
          }`}
          title={t('aiTutor')}
        >
          <span aria-hidden>🦊</span>
        </button>
        <span className="text-[11px] font-extrabold text-[var(--kids-coral-2)] mt-0.5">{t('aiTutorShort')}</span>
      </div>

      {tabButton('exercises', <FileText className="w-5 h-5" />, t('exercises'))}

      <button
        type="button"
        onClick={onOpenProfile}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-h-12 rounded-2xl transition-colors cursor-pointer ${inactiveTabClass}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[11px] font-extrabold">{t('profile')}</span>
      </button>
    </nav>
  );
};
