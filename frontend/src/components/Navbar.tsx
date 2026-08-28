import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { PrimaryGrade, UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { MssidLogo } from './MssidLogo';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

export type HeaderTheme = 'light' | 'neutre' | 'dark';

export const NAV_GRADES: { id: PrimaryGrade; labelKey: 'grade1APFull' | 'grade2APFull' | 'grade3APFull' | 'grade4APFull' | 'grade5APFull'; badge: string }[] = [
  { id: '1AP', labelKey: 'grade1APFull', badge: '1AP' },
  { id: '2AP', labelKey: 'grade2APFull', badge: '2AP' },
  { id: '3AP', labelKey: 'grade3APFull', badge: '3AP' },
  { id: '4AP', labelKey: 'grade4APFull', badge: '4AP' },
  { id: '5AP', labelKey: 'grade5APFull', badge: '5AP' },
];

export const THEME_OPTIONS: { id: HeaderTheme; labelKey: 'themeNeutreFull' | 'themeDarkFull' }[] = [
  { id: 'neutre', labelKey: 'themeNeutreFull' },
  { id: 'dark', labelKey: 'themeDarkFull' },
];

interface NavbarProps {
  currentGrade: PrimaryGrade;
  userProfile: UserProfile;
  authUser: AuthUser | null;
  onOpenProfileModal: () => void;
  onHomeClick: () => void;
  currentTheme?: HeaderTheme;
}

const applyThemeToRoot = (selectedTheme: HeaderTheme) => {
  const root = document.documentElement;
  root.classList.remove('theme-neutre', 'theme-light', 'theme-dark');
  root.classList.add(`theme-${selectedTheme}`);
};

export const Navbar: React.FC<NavbarProps> = ({
  currentGrade,
  userProfile,
  authUser,
  onOpenProfileModal,
  onHomeClick,
  currentTheme = 'neutre',
}) => {
  const t = useTranslation('navigation');
  const { direction } = useLocaleContext();
  const gradeMeta = NAV_GRADES.find((g) => g.id === currentGrade) ?? NAV_GRADES[0];
  const avatar = userProfile.avatar || (authUser?.nom ? authUser.nom.charAt(0).toUpperCase() : '🎓');

  useEffect(() => {
    const validTheme: HeaderTheme = (['neutre', 'light', 'dark'].includes(currentTheme) ? currentTheme : 'neutre') as HeaderTheme;
    applyThemeToRoot(validTheme);
  }, [currentTheme]);

  return (
    <header
      className="sticky top-0 z-40 pt-[env(safe-area-inset-top)] bg-[var(--app-header-bg)] border-b border-[var(--app-card-border)] text-[var(--app-text)] shadow-sm backdrop-blur-md"
      dir={direction}
      data-nav-child="true"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onHomeClick}
          className="flex items-center gap-2 min-w-0 hit-target rounded-2xl px-1 cursor-pointer"
          aria-label={t('home')}
          title={t('backToHomeTitle')}
        >
          <MssidLogo size="md" />
          <span className="font-extrabold text-lg tracking-tight truncate">
            MSSID <span className="text-[var(--brand-emerald)] font-serif text-base">DZ</span>
          </span>
        </motion.button>

        <motion.button
          type="button"
          data-nav-grade-readout
          whileTap={{ scale: 0.95 }}
          onClick={onOpenProfileModal}
          className="hit-target px-3 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] text-sm font-extrabold text-[var(--brand-emerald-dark)] flex items-center justify-center shrink-0 cursor-pointer"
          title={t('changeGradeOrLanguageTitle')}
        >
          <span className="sr-only">{t(gradeMeta.labelKey)}</span>
          <span aria-hidden>{gradeMeta.badge}</span>
        </motion.button>

        <motion.button
          type="button"
          data-nav-avatar
          whileTap={{ scale: 0.95 }}
          onClick={onOpenProfileModal}
          className="hit-target w-12 rounded-2xl bg-[var(--brand-emerald)] text-white text-xl flex items-center justify-center cursor-pointer shrink-0"
          aria-label={t('profile')}
          title={t('profile')}
        >
          {avatar}
        </motion.button>
      </div>
    </header>
  );
};
