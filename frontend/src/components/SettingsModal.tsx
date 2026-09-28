import React from 'react';
import { motion } from 'motion/react';
import { PrimaryGrade } from '../types';
import { AuthUser } from '../types/auth';
import { AuthService } from '../services/authService';
import { WILAYAS_LIST } from '../data/wilayasData';
import { X, Settings, KeyRound, LogOut, MessageSquare, FileText, ShieldCheck, MapPin } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { TashkeelToggle } from './TashkeelToggle';
import { Card } from './ui';
import { LanguageSwitcher } from './LanguageSwitcher';
import { HeaderTheme, NAV_GRADES, THEME_OPTIONS } from './Navbar';
import { getAppPlatform } from '../utils/appPlatform';

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
  onOpenContactModal?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfService?: () => void;
  onOpenAdminConsole?: () => void;
  onOpenRating?: () => void;
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
  onOpenContactModal,
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
  onOpenAdminConsole,
  onOpenRating,
}) => {
  const t = useTranslation('common');
  const tNav = useTranslation('navigation');
  const tMeta = useTranslation('meta');
  const { direction } = useLocaleContext();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 kids-modal-overlay backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6"
      dir={direction}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="kids-modal-panel w-full max-w-xl flex flex-col overflow-hidden"
      >
        <div className="kids-modal-header p-4 sm:p-5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Settings className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-extrabold truncate">{t('settingsSectionLabel')}</h2>
          </div>
          <button type="button" onClick={onClose} className="kids-close cursor-pointer" aria-label={t('close')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="kids-modal-body p-5 space-y-4">
          {currentGrade && onGradeChange && (
            <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-2 rounded-[22px]">
              <p className="text-sm font-extrabold text-[var(--kids-ink)]">{t('profileGradeLabel')}</p>
              <div data-profile-grade-strip className="grid grid-cols-2 gap-2">
                {NAV_GRADES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => { onGradeChange(g.id); onClose(); }}
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

          {authUser && (
            <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-2 rounded-[22px]">
              <p className="flex items-center gap-1.5 text-sm font-extrabold text-[var(--kids-ink)]">
                <MapPin className="w-4 h-4 text-[var(--kids-grass-2)]" />
                <span>{t('profileWilayaLabel')}</span>
              </p>
              <select
                value={authUser.wilaya || ''}
                onChange={(e) => AuthService.updateWilaya(e.target.value)}
                className="kids-input"
              >
                <option value="">{t('profileWilayaPlaceholder')}</option>
                {WILAYAS_LIST.map((w) => (
                  <option key={w.codeStr} value={w.codeStr}>
                    {w.codeStr} - {direction === 'rtl' ? w.nameAr : w.nameFr}
                  </option>
                ))}
              </select>
            </Card>
          )}

          <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-3 rounded-[22px]">
            <p className="text-sm font-extrabold text-[var(--kids-ink)]">{t('chooseLanguageLabel')}</p>
            <LanguageSwitcher className="w-full" />
          </Card>

          <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-2 rounded-[22px]">
            <p className="text-sm font-extrabold text-[var(--kids-ink)]">{t('profileThemeLabel')}</p>
            <div className="grid grid-cols-3 gap-1.5 min-w-0">
              {onThemeAuto && (
                <button
                  type="button"
                  onClick={onThemeAuto}
                  className={`hit-target rounded-2xl px-1 text-[11px] leading-tight text-center font-extrabold cursor-pointer ${
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
                  className={`hit-target rounded-2xl px-1 text-[11px] leading-tight text-center font-extrabold cursor-pointer ${
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

          {authUser?.role === 'ROLE_ADMIN' && onOpenAdminConsole && (
            <button
              type="button"
              onClick={() => { onOpenAdminConsole(); onClose(); }}
              className="w-full hit-target rounded-2xl bg-[var(--brand-amber)]/20 border-2 border-[var(--brand-amber)] text-sm font-extrabold text-[#5A3B00] cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {tNav('adminConsole')}
            </button>
          )}

          <div className="space-y-2 pt-2">
            {getAppPlatform() === 'android' && onOpenRating && (
              <button type="button" className="w-full hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold text-[var(--kids-ink)] cursor-pointer" onClick={() => { onClose(); onOpenRating(); }}>
                {tMeta('reviewGooglePlay')}
              </button>
            )}
            {onOpenContactModal && (
              <button
                type="button"
                onClick={() => { onOpenContactModal(); onClose(); }}
                className="w-full hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold text-[var(--kids-ink)] cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {tMeta('ratingSendFeedbackButton')}
              </button>
            )}
            {onOpenPrivacyPolicy && (
              <button
                type="button"
                onClick={() => { onOpenPrivacyPolicy(); onClose(); }}
                className="w-full hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold text-[var(--kids-ink)] cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {tNav('privacyPolicyMenuItem')}
              </button>
            )}
            {onOpenTermsOfService && (
              <button
                type="button"
                onClick={() => { onOpenTermsOfService(); onClose(); }}
                className="w-full hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold text-[var(--kids-ink)] cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {tNav('termsMenuItem')}
              </button>
            )}
          </div>
          <p className="text-center text-xs text-[var(--kids-muted)]" dir="auto">
            {tMeta('appVersion', { version: __APP_VERSION__ })}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
