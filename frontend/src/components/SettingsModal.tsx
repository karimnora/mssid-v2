import React from 'react';
import { motion } from 'motion/react';
import { PrimaryGrade } from '../types';
import { AuthUser } from '../types/auth';
import { X, Settings, KeyRound, LogOut } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { TashkeelToggle } from './TashkeelToggle';
import { Card } from './ui';
import { LanguageSwitcher } from './LanguageSwitcher';
import { HeaderTheme, NAV_GRADES, THEME_OPTIONS } from './Navbar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser?: AuthUser | null;
  tashkeelEnabled: boolean;
  onToggleTashkeel: (next: boolean) => void;
  currentGrade?: PrimaryGrade;
  onGradeChange?: (grade: PrimaryGrade) => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  currentTheme?: HeaderTheme;
  onThemeChange?: (theme: HeaderTheme) => void;
  isThemeAuto?: boolean;
  onThemeAuto?: () => void;
}

// Split out of ProfileModal (remonte utilisateur : "je veux désassocier le profile et Réglages
// dans un nouveau icon ⚙️ dans le header") — grade/language/theme/tashkeel/connexion get their
// own dedicated surface, opened from a header gear icon, separate from the avatar/XP/badges
// "Moi" destination. Every control here applies immediately on click (no buffered state), so
// unlike ProfileModal there's nothing to "save" — closing is just closing.
export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  authUser,
  tashkeelEnabled,
  onToggleTashkeel,
  currentGrade,
  onGradeChange,
  onOpenAuthModal,
  onLogout,
  currentTheme = 'neutre',
  onThemeChange,
  isThemeAuto = false,
  onThemeAuto,
}) => {
  const t = useTranslation('common');
  const tNav = useTranslation('navigation');
  const { direction } = useLocaleContext();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 kids-modal-overlay backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      dir={direction}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="kids-modal-panel w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="kids-modal-header p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h2 className="text-base sm:text-lg font-extrabold">{t('settingsSectionLabel')}</h2>
          </div>
          <button onClick={onClose} className="kids-close cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {currentGrade && onGradeChange && (
            <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-2 rounded-[22px]">
              <p className="text-sm font-extrabold text-[var(--kids-ink)]">{t('profileGradeLabel')}</p>
              <div data-profile-grade-strip className="grid grid-cols-2 gap-2">
                {NAV_GRADES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onGradeChange(g.id)}
                    className={`hit-target rounded-2xl px-3 py-3 text-sm font-extrabold cursor-pointer ${
                      currentGrade === g.id
                        ? 'kids-pop bg-[var(--kids-grass-2)] text-white'
                        : 'bg-[#FFFBF0] text-[var(--kids-muted)] border-2 border-[#E7E2D7]'
                    }`}
                  >
                    {tNav(g.labelKey)}
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-3 rounded-[22px]">
            <p className="text-sm font-extrabold text-[var(--kids-ink)]">{t('chooseLanguageLabel')}</p>
            <LanguageSwitcher />
          </Card>

          <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-2 rounded-[22px]">
            <p className="text-sm font-extrabold text-[var(--kids-ink)]">{t('profileThemeLabel')}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {onThemeAuto && (
                <button
                  type="button"
                  onClick={onThemeAuto}
                  className={`hit-target rounded-2xl text-[11px] font-extrabold cursor-pointer ${
                    isThemeAuto ? 'bg-[var(--kids-grass-2)] text-white' : 'bg-[#FFFBF0] text-[var(--kids-muted)] border-2 border-[#E7E2D7]'
                  }`}
                >
                  {tNav('themeAutoShort')}
                </button>
              )}
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onThemeChange?.(opt.id)}
                  className={`hit-target rounded-2xl text-[11px] font-extrabold cursor-pointer ${
                    !isThemeAuto && currentTheme === opt.id
                      ? 'bg-[var(--kids-grass-2)] text-white'
                      : 'bg-[#FFFBF0] text-[var(--kids-muted)] border-2 border-[#E7E2D7]'
                  }`}
                >
                  {tNav(opt.id === 'neutre' ? 'themeNeutreShort' : 'themeDarkShort')}
                </button>
              ))}
            </div>
          </Card>

          <Card padding="md" className="!bg-white !border-[#E7E2D7] rounded-[22px]">
            <TashkeelToggle enabled={tashkeelEnabled} onToggle={onToggleTashkeel} />
          </Card>

          {!authUser && onOpenAuthModal && (
            <button
              type="button"
              onClick={() => { onOpenAuthModal(); onClose(); }}
              className="w-full hit-target rounded-2xl bg-[var(--kids-grass-2)] text-white text-sm font-extrabold cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              {tNav('loginRegisterCta')}
            </button>
          )}
          {authUser && onLogout && (
            <button
              type="button"
              onClick={() => { onLogout(); onClose(); }}
              className="w-full hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold text-[var(--brand-coral)] cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {tNav('logout')}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
