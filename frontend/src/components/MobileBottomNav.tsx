import React from 'react';
import { Home, BookOpen, Gamepad2 } from 'lucide-react';
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
  profileOpen?: boolean;
  theme?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  selectedSubject,
  activeTab,
  onSelectTab,
  onOpenProfile,
  onClearSelectedLesson,
  profileOpen = false,
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
    : 'text-[var(--kids-muted)]';

  const tabButton = (
    tab: 'home' | 'courses' | 'games',
    icon: React.ReactNode,
    label: string
  ) => (
    <button
      type="button"
      onClick={() => handleTab(tab)}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-h-12 rounded-2xl transition-colors cursor-pointer ${
        activeTab === tab && !profileOpen ? `${activeTabClass} bg-[var(--kids-grass-1)]/20` : inactiveTabClass
      }`}
      aria-current={activeTab === tab && !profileOpen ? 'page' : undefined}
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
    >
      {tabButton('home', <Home className="w-5 h-5" />, t('home'))}
      {tabButton('courses', <BookOpen className="w-5 h-5" />, t('courses'))}
      {tabButton('games', <Gamepad2 className="w-5 h-5" />, t('playTab'))}
      <button
        type="button"
        onClick={onOpenProfile}
        className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-h-12 rounded-2xl transition-colors cursor-pointer ${
          profileOpen ? `${activeTabClass} bg-[var(--kids-grass-1)]/20` : inactiveTabClass
        }`}
        aria-current={profileOpen ? 'page' : undefined}
        aria-label={t('profile')}
      >
        <span className="text-[22px] leading-none" aria-hidden>🦊</span>
        <span className="text-[11px] font-extrabold">{t('meTab')}</span>
      </button>
    </nav>
  );
};
