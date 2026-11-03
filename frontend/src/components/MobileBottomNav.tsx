import React from 'react';
import { Home, BookOpen, Gamepad2, ClipboardList } from 'lucide-react';
import { PrimaryGrade, SubjectId } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { isLabSubjectId } from '../navigation/appLocation';
import { DidouPortrait } from './world/DidouPortrait';

interface MobileBottomNavProps {
  grade?: PrimaryGrade;
  selectedSubject: SubjectId;
  activeTab?: 'home' | 'courses' | 'exercises' | 'games';
  onSelectTab: (tab: 'home' | 'courses' | 'exercises' | 'games') => void;
  onOpenAiTutor: () => void;
  /** When false (admin `enableAITutor` off), the fox entry is hidden. Defaults on. */
  showAiTutor?: boolean;
  onClearSelectedLesson: () => void;
  theme?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  selectedSubject,
  activeTab,
  onSelectTab,
  onOpenAiTutor,
  showAiTutor = true,
  onClearSelectedLesson,
}) => {
  const t = useTranslation('navigation');
  const { direction } = useLocaleContext();

  const handleTab = (tab: 'home' | 'courses' | 'exercises' | 'games') => {
    onSelectTab(tab);
    onClearSelectedLesson();
  };

  const activeLabId = isLabSubjectId(selectedSubject) ? selectedSubject : undefined;

  const navBgClass = 'bg-[var(--app-footer-bg)] border-[var(--app-card-border)]';
  const activeTabClass = 'text-[var(--app-text)] font-extrabold';
  const inactiveTabClass = 'text-[var(--app-text-muted)]';

  const tabButton = (
    tab: 'home' | 'courses' | 'exercises' | 'games',
    icon: React.ReactNode,
    label: string
  ) => (
    <button
      type="button"
      onClick={() => handleTab(tab)}
      data-nav-tab={tab}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[60px] rounded-2xl transition-colors cursor-pointer ${
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
      data-nav-compact="true"
      data-bottom-nav
    >
      {tabButton('home', <Home className="w-5 h-5" />, t('home'))}
      {tabButton('courses', <BookOpen className="w-5 h-5" />, t('courses'))}

      {showAiTutor && (
      <div className="flex flex-col items-center flex-1">
        <button
          type="button"
          onClick={onOpenAiTutor}
          className={`kids-nav-ai kids-pop w-[60px] h-[60px] -mt-7 rounded-full bg-gradient-to-br from-[var(--kids-sun-1)] to-[var(--kids-coral-2)] text-white flex items-center justify-center overflow-hidden border-4 border-[var(--app-footer-bg)] cursor-pointer`}
          data-nav-ai
          title={t('aiTutor')}
          aria-label={t('aiTutor')}
        >
          <DidouPortrait size={50} className="mt-2" />
        </button>
        <span className="text-[11px] font-extrabold text-[var(--app-text)] mt-0.5">{t('aiTutorShort')}</span>
      </div>
      )}

      {tabButton('games', <Gamepad2 className="w-5 h-5" />, t('playTab'))}
      {tabButton('exercises', <ClipboardList className="w-5 h-5" />, t('navAssessTab'))}
    </nav>
  );
};
