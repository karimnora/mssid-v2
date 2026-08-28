import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { PrimaryGrade } from '../types';
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
  onHomeClick: () => void;
  currentTheme?: HeaderTheme;
  onOpenProfileModal: () => void;
  avatar?: string;
}

const applyThemeToRoot = (selectedTheme: HeaderTheme) => {
  const root = document.documentElement;
  root.classList.remove('theme-neutre', 'theme-light', 'theme-dark');
  root.classList.add(`theme-${selectedTheme}`);
};

export const Navbar: React.FC<NavbarProps> = ({
  currentGrade,
  onHomeClick,
  currentTheme = 'neutre',
  onOpenProfileModal,
  avatar,
}) => {
  const t = useTranslation('navigation');
  const { direction } = useLocaleContext();
  const gradeMeta = NAV_GRADES.find((g) => g.id === currentGrade) ?? NAV_GRADES[0];

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

        {/* Read-only grade indicator, not a button: the top avatar was already dropped for
            duplicating this badge and the bottom nav's "Moi" tab (three tap targets, one
            destination). Making this badge open the profile too still left two tap targets doing
            the same thing — "Moi" already reaches the grade/language pickers in one tap (they sit
            at the top of the profile since Phase 193), so this stays purely informational
            (remonte utilisateur : "انا et le grade de haut ont la meme choses ... je veux pas
            qu'il soit redondant"). */}
        <div className="flex items-center gap-2 shrink-0">
          <p
            data-nav-grade-readout
            className="hit-target px-3 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] text-sm font-extrabold text-[var(--brand-emerald-dark)] flex items-center justify-center"
          >
            <span className="sr-only">{t(gradeMeta.labelKey)}</span>
            <span aria-hidden>{gradeMeta.badge}</span>
          </p>

          {/* Desktop-only: MobileBottomNav (with its "Moi" tab, the sole profile entry point on
              phones) is md:hidden, so without a header button desktop/tablet users would have no
              way at all to reach the profile — a real gap found live, not a caching issue (the
              earlier grade-badge/avatar removals only accounted for mobile). Hidden below md so
              it doesn't reintroduce the redundancy "Moi" already covers on phones. */}
          <motion.button
            type="button"
            data-nav-desktop-profile
            whileTap={{ scale: 0.95 }}
            onClick={onOpenProfileModal}
            className="hidden md:flex hit-target w-10 h-10 rounded-2xl bg-[var(--brand-emerald)] text-white text-lg items-center justify-center cursor-pointer"
            aria-label={t('profile')}
            title={t('profile')}
          >
            <span aria-hidden>{avatar || '🎓'}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
