import React from 'react';
import { motion } from 'motion/react';
import { useLocaleContext } from '../context/LocaleContext';
import type { LocaleCode } from '../localePreference';

const LANGUAGE_OPTIONS: { code: LocaleCode; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
];

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '', compact = false }) => {
  const { locale, setLocale, t } = useLocaleContext();

  return (
    <div className={`flex items-center gap-2 text-xs font-bold text-[var(--app-text)] min-w-0 ${className}`}>
      {!compact && (
        <span className="hidden lg:inline text-[var(--app-text-muted)]">{t('common', 'chooseLanguageLabel')}</span>
      )}
      <div className="flex items-center gap-1 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] shadow-xs p-1 w-full min-w-0">
        {LANGUAGE_OPTIONS.map((option) => (
          <motion.button
            key={option.code}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocale(option.code)}
            className={`hit-target flex-1 px-2.5 rounded-xl transition-colors text-[11px] font-black cursor-pointer ${
              locale === option.code
                ? 'bg-[var(--brand-emerald)] text-white shadow-sm'
                : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-card-bg)]'
            }`}
            aria-pressed={locale === option.code}
            aria-label={option.label}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
