import React from 'react';
import { useLocaleContext } from '../context/LocaleContext';

const LANGUAGE_OPTIONS = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
] as const;

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, direction, t } = useLocaleContext();

  return (
    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
      <span className="hidden sm:inline">{t('common', 'chooseLanguageLabel')}</span>
      <div className="flex items-center gap-1 rounded-2xl bg-white/80 border border-slate-200 shadow-sm p-1">
        {LANGUAGE_OPTIONS.map((option) => (
          <button
            key={option.code}
            onClick={() => setLocale(option.code)}
            className={`px-2 py-1 rounded-xl transition-all text-[11px] font-bold ${
              locale === option.code
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label={`Switch to ${option.label}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
