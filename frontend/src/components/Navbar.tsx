import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, ClipboardList, Settings } from 'lucide-react';
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
  /** Present only when there's somewhere to go back to (not on the home screen) — renders a
   * dedicated back chevron that steps one entry back through the app's own history, as opposed
   * to onHomeClick which always jumps straight to the home screen. */
  onBackClick?: () => void;
  currentTheme?: HeaderTheme;
  onOpenProfileModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenAssess?: () => void;
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
  onBackClick,
  currentTheme = 'neutre',
  onOpenProfileModal,
  onOpenSettingsModal,
  onOpenAssess,
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center gap-2 sm:gap-3">
        {onBackClick && (
          <motion.button
            type="button"
            data-nav-back
            whileTap={{ scale: 0.92 }}
            onClick={onBackClick}
            className="hit-target w-10 h-10 shrink-0 rounded-2xl bg-[#FFFBF0] border-2 border-[#E7E2D7] text-[var(--kids-muted,#64748b)] flex items-center justify-center cursor-pointer"
            aria-label={t('backButtonFloatingLabel')}
            title={t('backButtonFloatingLabel')}
          >
            {direction === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </motion.button>
        )}

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onHomeClick}
          className="flex items-center gap-2 min-w-0 flex-1 hit-target rounded-2xl px-1 cursor-pointer"
          aria-label={t('home')}
          title={t('backToHomeTitle')}
        >
          <MssidLogo size="md" />
          <span className="font-extrabold text-lg tracking-tight truncate">
            MSSID <span className="app-logo-dz text-[var(--brand-emerald)] font-serif text-base">DZ</span>
          </span>
        </motion.button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onOpenAssess && (
            <motion.button
              type="button"
              data-nav-assess
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAssess}
              className="hidden md:flex hit-target min-h-10 h-10 px-3 rounded-2xl bg-[#EFF6FF] border-2 border-[#BFDBFE] text-[var(--brand-blue)] items-center justify-center gap-1.5 cursor-pointer"
              aria-label={t('navAssessTab')}
              title={t('navAssessTab')}
            >
              <ClipboardList className="w-5 h-5" />
              <span className="text-sm font-extrabold">{t('navAssessTab')}</span>
            </motion.button>
          )}

          <p
            data-nav-grade-readout
            className="hit-target px-3 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] text-sm font-extrabold text-[var(--brand-emerald-dark)] flex items-center justify-center"
          >
            <span className="sr-only">{t(gradeMeta.labelKey)}</span>
            <span aria-hidden>{gradeMeta.badge}</span>
          </p>

          <motion.button
            type="button"
            data-nav-settings
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettingsModal}
            className="hit-target w-10 h-10 rounded-2xl bg-[#FFFBF0] border-2 border-[#E7E2D7] text-[var(--kids-muted)] flex items-center justify-center cursor-pointer"
            aria-label={t('settings')}
            title={t('settings')}
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          <motion.button
            type="button"
            data-nav-profile
            whileTap={{ scale: 0.95 }}
            onClick={onOpenProfileModal}
            className="flex hit-target w-10 h-10 rounded-2xl bg-[var(--brand-emerald)] text-white text-lg items-center justify-center cursor-pointer"
            aria-label={t('profile')}
            title={t('meTab')}
          >
            <span aria-hidden>{avatar || '🎓'}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
