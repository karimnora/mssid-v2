import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Flame,
  Sparkles,
  ShieldCheck,
  User,
  KeyRound,
  Smartphone,
  Sliders,
  Bot,
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  Palette,
  Check,
  FileText,
  LogOut,
  MessageSquare,
  Home,
} from 'lucide-react';
import { PrimaryGrade, UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { MssidLogo } from './MssidLogo';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Badge } from './ui';

export type HeaderTheme = 'light' | 'neutre' | 'dark';

interface NavbarProps {
  currentGrade: PrimaryGrade;
  onGradeChange: (grade: PrimaryGrade) => void;
  userProfile: UserProfile;
  authUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenAiTutor: () => void;
  onOpenProfileModal: () => void;
  onOpenPreschool?: () => void;
  onOpenContactModal?: () => void;
  onOpenMobileSimulator?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfService?: () => void;
  onOpenAdminConsole?: () => void;
  onHomeClick: () => void;
  currentTheme?: HeaderTheme;
  onThemeChange?: (theme: HeaderTheme) => void;
}

const GRADES: { id: PrimaryGrade; labelKey: 'grade1APFull' | 'grade2APFull' | 'grade3APFull' | 'grade4APFull' | 'grade5APFull'; badge: string }[] = [
  { id: '1AP', labelKey: 'grade1APFull', badge: '1AP' },
  { id: '2AP', labelKey: 'grade2APFull', badge: '2AP' },
  { id: '3AP', labelKey: 'grade3APFull', badge: '3AP' },
  { id: '4AP', labelKey: 'grade4APFull', badge: '4AP' },
  { id: '5AP', labelKey: 'grade5APFull', badge: '5AP' },
];

const THEME_OPTIONS: { id: HeaderTheme; icon: React.ReactNode }[] = [
  { id: 'neutre', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
  { id: 'light', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
  { id: 'dark', icon: <Moon className="w-3.5 h-3.5 text-[var(--brand-blue)]" /> },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentGrade,
  onGradeChange,
  userProfile,
  authUser,
  onOpenAuthModal,
  onLogout,
  onOpenAiTutor,
  onOpenProfileModal,
  onOpenPreschool,
  onOpenContactModal,
  onOpenMobileSimulator,
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
  onOpenAdminConsole,
  onHomeClick,
  currentTheme = 'neutre',
  onThemeChange,
}) => {
  const t = useTranslation('navigation');
  const { direction } = useLocaleContext();
  const [theme, setTheme] = useState<HeaderTheme>(currentTheme);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Only toggles the root `.theme-*` class — every visual is driven by the CSS custom
  // properties defined per theme in index.css, so there is nothing else to set here.
  const applyThemeToRoot = (selectedTheme: HeaderTheme) => {
    const root = document.documentElement;
    root.classList.remove('theme-neutre', 'theme-light', 'theme-dark');
    root.classList.add(`theme-${selectedTheme}`);
  };

  useEffect(() => {
    const validTheme: HeaderTheme = (['neutre', 'light', 'dark'].includes(currentTheme) ? currentTheme : 'neutre') as HeaderTheme;
    setTheme(validTheme);
    applyThemeToRoot(validTheme);
  }, [currentTheme]);

  const handleThemeSelect = (selectedTheme: HeaderTheme) => {
    setTheme(selectedTheme);
    onThemeChange?.(selectedTheme);
    setIsThemeDropdownOpen(false);
    applyThemeToRoot(selectedTheme);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAiEnabled = useFeatureFlag('enableAITutor');
  const roleLabel = authUser?.role || 'ROLE_FREE';
  const isAdmin = roleLabel === 'ROLE_ADMIN';
  const displayXp = authUser?.score !== undefined ? authUser.score : (authUser?.xp !== undefined ? authUser.xp : userProfile.xp);
  const displayLevel = authUser?.level !== undefined ? authUser.level : Math.floor(displayXp / 100) + 1;
  // userProfile.badges is the live, continuously re-evaluated set (see App.tsx) — always prefer it over
  // authUser.badges, which is only a point-in-time snapshot from the last login/DB fetch.
  const displayBadgesCount = userProfile?.badges ? userProfile.badges.length : 0;

  return (
    <>
      <header className="sticky top-0 z-40 transition-colors duration-300 bg-[var(--app-header-bg)] border-b border-[var(--app-card-border)] text-[var(--app-text)] shadow-sm backdrop-blur-md" dir={direction}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">

          {/* LOGO & BRAND — shrinks/truncates first, never forces the row wider */}
          <div className="flex items-center gap-2 min-w-0 shrink cursor-pointer group" onClick={onHomeClick}>
            <div className="shrink-0 transition-transform group-hover:scale-105">
              <MssidLogo size="md" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-black text-lg sm:text-xl tracking-tight text-[var(--app-text)] font-sans whitespace-nowrap">
                  MSSID <span className="text-[var(--brand-blue)] font-serif text-base sm:text-lg">DZ</span>
                </span>
                <span className="hidden xl:inline-block bg-[var(--brand-blue)]/10 text-[var(--brand-blue-dark)] text-[10px] font-black px-2 py-0.5 rounded-full border border-[var(--brand-blue)]/25 whitespace-nowrap">
                  {t('brandBadge')}
                </span>
              </div>
              <p className="text-[11px] font-bold text-[var(--app-text-muted)] hidden sm:block truncate">
                {t('brandTagline')}
              </p>
            </div>
          </div>

          {/* HOME BUTTON & GRADES NAVIGATION */}
          <div className="hidden lg:flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onHomeClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-black transition-all cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm hover:brightness-110"
              title={t('backToHomeTitle')}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('home')}</span>
            </motion.button>

            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] shrink-0">
              {onOpenPreschool && (
                <motion.button
                  onClick={onOpenPreschool}
                  whileTap={{ scale: 0.94 }}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-colors cursor-pointer bg-gradient-to-r from-amber-400 to-orange-400 text-orange-950 shadow-xs hover:brightness-105 flex items-center gap-1"
                  title={t('preschoolNavTitle')}
                >
                  <span>🦊</span>
                  <span>{t('preschoolNavLabel')}</span>
                </motion.button>
              )}

              {GRADES.map((g) => {
                const isActive = currentGrade === g.id;
                return (
                  <motion.button
                    key={g.id}
                    onClick={() => onGradeChange(g.id)}
                    whileTap={{ scale: 0.94 }}
                    className={`relative px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-colors cursor-pointer select-none ${
                      isActive ? 'text-white' : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                    title={t(g.labelKey)}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active-grade"
                        className="absolute inset-0 bg-[var(--brand-blue)] rounded-xl shadow-sm"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative">{g.badge}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ACTIONS & USER PROFILE — progressively hides labels/items below xl/lg/md */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* AI Tutor Button */}
            {isAiEnabled && (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
                onClick={onOpenAiTutor}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[var(--brand-emerald)] to-[var(--brand-blue)] text-white font-black text-xs px-2.5 sm:px-3 py-2 rounded-xl shadow-md transition-shadow cursor-pointer"
                title={t('aiTutorTitle')}
              >
                <Bot className="w-4 h-4 text-amber-200" />
                <span className="hidden xl:inline">{t('aiTutorNavLabel')}</span>
              </motion.button>
            )}

            {/* XP & Badges Display */}
            <button
              onClick={onOpenProfileModal}
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border text-xs font-bold transition-colors cursor-pointer bg-[var(--app-card-subtle)] border-[var(--app-card-border)] text-[var(--app-text)] hover:opacity-90"
              title={t('xpLevelStatus', { level: displayLevel, xp: displayXp })}
            >
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span dir="ltr" className="font-extrabold">{userProfile.streakDays}d</span>
              </div>
              <div className="h-3 w-px bg-[var(--app-card-border)]" />
              <div className="flex items-center gap-1 text-[var(--brand-amber-dark)]">
                <Award className="w-4 h-4" />
                <span dir="ltr" className="font-extrabold">{displayXp} XP (Lvl {displayLevel})</span>
              </div>
              <span
                dir="ltr"
                className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md ${
                  roleLabel !== 'ROLE_FREE' ? 'bg-[var(--brand-amber)] text-slate-950' : 'bg-[var(--app-card-border)] text-[var(--app-text-muted)]'
                }`}
              >
                {roleLabel === 'ROLE_ADMIN' ? 'ADMIN' : roleLabel === 'ROLE_PREMIUM' ? 'PRO' : 'FREE'}
              </span>
            </button>

            <LanguageSwitcher compact className="hidden md:flex" />

            {/* Theme Dropdown */}
            <div className="hidden md:block relative" ref={themeRef}>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsThemeDropdownOpen((v) => !v)}
                className="p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer bg-[var(--app-card-subtle)] hover:opacity-90 border-[var(--app-card-border)] text-[var(--app-text)]"
                title={t('themeMenuTitle')}
              >
                {theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : theme === 'neutre' ? (
                  <Palette className="w-4 h-4 text-purple-500" />
                ) : (
                  <Moon className="w-4 h-4 text-[var(--brand-blue)]" />
                )}
              </motion.button>

              <AnimatePresence>
                {isThemeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="absolute left-0 mt-2 w-52 rounded-2xl border p-1.5 shadow-2xl z-50 bg-[var(--app-card-bg)] border-[var(--app-card-border)] text-[var(--app-text)]"
                  >
                    <div className="text-[10px] font-bold px-2 py-1 border-b mb-1 text-[var(--app-text-muted)] border-[var(--app-card-border)]">
                      {t('chooseThemeLabel')}
                    </div>
                    {THEME_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleThemeSelect(opt.id)}
                        className={`w-full text-start px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          theme === opt.id
                            ? 'bg-[var(--brand-blue)] text-white font-black shadow-sm'
                            : 'hover:bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {opt.icon}
                          <span>{t(opt.id === 'neutre' ? 'themeNeutreFull' : opt.id === 'light' ? 'themeLightFull' : 'themeDarkFull')}</span>
                        </div>
                        {theme === opt.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* UNIFIED PROFILE & AUTH DROPDOWN */}
            <div className="hidden md:block relative" ref={profileRef}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsProfileDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold transition-colors cursor-pointer bg-[var(--app-card-subtle)] hover:opacity-90 border-[var(--app-card-border)] text-[var(--app-text)]"
                title={t('profileMenuTitle')}
              >
                <div className="w-6 h-6 rounded-lg bg-[var(--brand-emerald)] text-white font-black flex items-center justify-center text-[10px] shrink-0">
                  {authUser?.nom ? authUser.nom.charAt(0).toUpperCase() : '👤'}
                </div>
                <span className="hidden lg:inline max-w-[100px] truncate">
                  {authUser ? authUser.nom : t('loginShort')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </motion.button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="absolute left-0 mt-2 w-64 rounded-2xl border p-2 shadow-2xl z-50 bg-[var(--app-card-bg)] border-[var(--app-card-border)] text-[var(--app-text)]"
                  >
                    <div className="p-2.5 rounded-xl border mb-2 bg-[var(--brand-blue)]/10 border-[var(--brand-blue)]/25">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="font-extrabold text-xs truncate max-w-[120px] text-[var(--app-text)]">
                          {authUser ? authUser.nom : t('guestFallbackName')}
                        </span>
                        <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded shadow-xs ${
                          !authUser
                            ? 'bg-[var(--app-card-border)] text-[var(--app-text-muted)]'
                            : isAdmin
                            ? 'bg-[var(--brand-coral)] text-white'
                            : roleLabel === 'ROLE_PREMIUM'
                            ? 'bg-[var(--brand-amber)] text-slate-950'
                            : 'bg-[var(--brand-emerald)]/20 text-[var(--brand-emerald-dark)] border border-[var(--brand-emerald)]/30'
                        }`}>
                          {!authUser ? 'GUEST' : isAdmin ? '👑 ADMIN' : roleLabel === 'ROLE_PREMIUM' ? '⭐ PREMIUM' : '🌱 FREE'}
                        </span>
                      </div>
                      {authUser?.email ? (
                        <p dir="ltr" className="text-[10px] text-[var(--app-text-muted)] text-right truncate mt-0.5 font-mono">{authUser.email}</p>
                      ) : (
                        <p className="text-[10px] text-[var(--app-text-muted)] text-start truncate mt-0.5">{t('guestSaveDataHint')}</p>
                      )}
                      <div className="text-[10px] mt-1.5 flex items-center justify-between text-[var(--app-text-muted)]">
                        <span>{t('streakDaysStatus', { days: authUser?.streakDays ?? userProfile.streakDays })}</span>
                        <span dir="ltr" className="font-bold text-[var(--brand-amber-dark)]">🏆 {displayXp} XP</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold px-2 py-1 border-b mb-1 text-[var(--app-text-muted)] border-[var(--app-card-border)]">
                      {t('accountSectionTitle')}
                    </div>

                    {!authUser ? (
                      <button
                        onClick={() => { onOpenAuthModal(); setIsProfileDropdownOpen(false); }}
                        className="w-full text-start px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer text-[var(--brand-blue-dark)] hover:bg-[var(--brand-blue)]/10"
                      >
                        <KeyRound className="w-4 h-4 text-[var(--brand-blue)]" />
                        <span>{t('loginRegisterCta')}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => { onOpenProfileModal(); setIsProfileDropdownOpen(false); }}
                          className="w-full text-start px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer hover:bg-[var(--app-card-subtle)] text-[var(--app-text)]"
                        >
                          <User className="w-4 h-4 text-[var(--brand-emerald)]" />
                          <span>{t('profileAndProgress')}</span>
                        </button>

                        <button
                          onClick={() => { onLogout(); setIsProfileDropdownOpen(false); }}
                          className="w-full text-start px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer text-[var(--brand-coral-dark)] hover:bg-[var(--brand-coral)]/10"
                        >
                          <LogOut className="w-4 h-4 text-[var(--brand-coral)]" />
                          <span>{t('logout')}</span>
                        </button>
                      </>
                    )}

                    {onOpenContactModal && (
                      <button
                        onClick={() => { onOpenContactModal(); setIsProfileDropdownOpen(false); }}
                        className="w-full text-start px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer hover:bg-[var(--app-card-subtle)] text-[var(--app-text)]"
                      >
                        <MessageSquare className="w-4 h-4 text-[var(--brand-blue)]" />
                        <span>{t('contactUs')}</span>
                      </button>
                    )}

                    {/* ADMIN SECTION (RBAC & CMS) */}
                    {isAdmin && (
                      <>
                        <div className="text-[10px] font-bold px-2 py-1 border-b mb-1 mt-2 text-[var(--app-text-muted)] border-[var(--app-card-border)]">
                          {t('adminSectionTitle')}
                        </div>

                        {onOpenAdminConsole && (
                          <button
                            onClick={() => { onOpenAdminConsole(); setIsProfileDropdownOpen(false); }}
                            className="w-full text-start px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer bg-[var(--brand-amber)]/15 text-[var(--brand-amber-dark)] border border-[var(--brand-amber)]/30"
                          >
                            <ShieldCheck className="w-4 h-4 text-[var(--brand-amber)]" />
                            <span>{t('adminConsole')}</span>
                          </button>
                        )}
                      </>
                    )}

                    <div className="text-[10px] font-bold px-2 py-1 border-b mb-1 mt-2 text-[var(--app-text-muted)] border-[var(--app-card-border)]">
                      {t('toolsSectionTitle')}
                    </div>

                    {onOpenPrivacyPolicy && (
                      <button
                        onClick={() => { onOpenPrivacyPolicy(); setIsProfileDropdownOpen(false); }}
                        className="w-full text-start px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer hover:bg-[var(--app-card-subtle)] text-[var(--app-text)]"
                      >
                        <FileText className="w-4 h-4 text-[var(--app-text-muted)]" />
                        <span>{t('privacyPolicyMenuItem')}</span>
                      </button>
                    )}
                    {onOpenTermsOfService && (
                      <button
                        onClick={() => { onOpenTermsOfService(); setIsProfileDropdownOpen(false); }}
                        className="w-full text-start px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer hover:bg-[var(--app-card-subtle)] text-[var(--app-text)]"
                      >
                        <FileText className="w-4 h-4 text-[var(--app-text-muted)]" />
                        <span>{t('termsMenuItem')}</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileDrawerOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer bg-[var(--app-card-subtle)] border-[var(--app-card-border)] text-[var(--app-text)]"
              title={t('mobileMenuTitle')}
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>

          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end"
            dir={direction}
            onClick={(e) => { if (e.target === e.currentTarget) setIsMobileDrawerOpen(false); }}
          >
            <motion.div
              initial={{ x: direction === 'rtl' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: direction === 'rtl' ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="w-4/5 max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl border-r border-[var(--app-card-border)] bg-[var(--app-card-bg)] text-[var(--app-text)]"
            >
              <div className="space-y-5 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[var(--app-card-border)] pb-4">
                  <div className="flex items-center gap-2">
                    <MssidLogo size="sm" />
                    <span className="font-black text-base">مَسِيد DZ</span>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="min-h-10 min-w-10 flex items-center justify-center rounded-lg bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--app-text-muted)] block mb-2">{t('gradeSectionLabel')}</label>
                  {onOpenPreschool && (
                    <button
                      onClick={() => { onOpenPreschool(); setIsMobileDrawerOpen(false); }}
                      className="min-h-12 w-full p-2.5 mb-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-orange-400 text-orange-950 shadow-sm border border-amber-300 flex items-center justify-center gap-2"
                    >
                      <span className="text-base">🦊</span>
                      <span>{t('preschoolMobileLabel')}</span>
                      <span className="bg-orange-950/20 px-2 py-0.5 rounded-full text-[10px]">{t('newBadge')}</span>
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {GRADES.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => { onGradeChange(g.id); setIsMobileDrawerOpen(false); }}
                        className={`min-h-12 p-2 rounded-xl text-xs font-extrabold border transition-colors text-center ${
                          currentGrade === g.id
                            ? 'bg-[var(--brand-blue)] text-white border-[var(--brand-blue-dark)] shadow-md'
                            : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border-[var(--app-card-border)]'
                        }`}
                      >
                        {t(g.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>

                <LanguageSwitcher />

                <div>
                  <label className="text-xs font-bold text-[var(--app-text-muted)] block mb-2">{t('themeSectionLabel')}</label>
                  <div className="flex items-center gap-2">
                    {THEME_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleThemeSelect(opt.id)}
                        className={`min-h-11 flex-1 py-2 px-1 rounded-xl text-[11px] font-bold border transition-colors ${
                          theme === opt.id
                            ? 'bg-[var(--brand-blue)] text-white border-[var(--brand-blue-dark)]'
                            : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border-[var(--app-card-border)]'
                        }`}
                      >
                        {t(opt.id === 'neutre' ? 'themeNeutreShort' : opt.id === 'light' ? 'themeLightShort' : 'themeDarkShort')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[var(--app-card-border)]">
                  <button
                    onClick={() => { onOpenAiTutor(); setIsMobileDrawerOpen(false); }}
                    className="min-h-12 w-full p-2.5 rounded-xl bg-gradient-to-r from-[var(--brand-emerald)] to-[var(--brand-blue)] text-white font-bold text-xs flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4 text-amber-200" />
                    <span>{t('aiTutor')}</span>
                  </button>

                  <button
                    onClick={() => { onOpenProfileModal(); setIsMobileDrawerOpen(false); }}
                    className="min-h-12 w-full p-2.5 rounded-xl bg-[var(--app-card-subtle)] text-[var(--app-text)] font-bold text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[var(--brand-emerald)]" />
                      <span>{t('profile')}</span>
                    </div>
                    <Badge variant="xp"><span dir="ltr">{displayXp} XP</span></Badge>
                  </button>

                  {onOpenContactModal && (
                    <button
                      onClick={() => { onOpenContactModal(); setIsMobileDrawerOpen(false); }}
                      className="min-h-12 w-full p-2.5 rounded-xl bg-[var(--app-card-subtle)] text-[var(--app-text)] font-bold text-xs flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-[var(--brand-blue)]" />
                      <span>{t('contactUs')}</span>
                    </button>
                  )}

                  {onOpenMobileSimulator && (
                    <button
                      onClick={() => { onOpenMobileSimulator(); setIsMobileDrawerOpen(false); }}
                      className="min-h-12 w-full p-2.5 rounded-xl bg-[var(--app-card-subtle)] text-[var(--brand-emerald-dark)] font-bold text-xs flex items-center gap-2"
                    >
                      <Smartphone className="w-4 h-4 text-[var(--brand-emerald)]" />
                      <span>{t('mobileAppLabel')}</span>
                    </button>
                  )}

                  {isAdmin && onOpenAdminConsole && (
                    <button
                      onClick={() => { onOpenAdminConsole(); setIsMobileDrawerOpen(false); }}
                      className="min-h-12 w-full p-2.5 rounded-xl bg-[var(--brand-blue)]/10 text-[var(--brand-blue-dark)] border border-[var(--brand-blue)]/25 font-bold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Sliders className="w-4 h-4 text-[var(--brand-blue)]" />
                      <span>{t('adminConsole')}</span>
                    </button>
                  )}

                  {!authUser ? (
                    <button
                      onClick={() => { onOpenAuthModal(); setIsMobileDrawerOpen(false); }}
                      className="min-h-12 w-full p-2.5 rounded-xl bg-[var(--brand-blue)] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-amber-300" />
                      <span>{t('loginRegisterCta')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { onLogout(); setIsMobileDrawerOpen(false); }}
                      className="min-h-12 w-full p-2.5 rounded-xl bg-[var(--brand-coral)]/15 text-[var(--brand-coral-dark)] border border-[var(--brand-coral)]/30 font-bold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[var(--brand-coral)]" />
                      <span>{t('logout')}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--app-card-border)] text-[10px] text-[var(--app-text-muted)] text-center">
                {t('footerBrandVersion', { version: 'v2.6.0' })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
