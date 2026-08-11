import React, { useState, useEffect, useRef } from 'react';
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
  BarChart2,
  LogOut,
} from 'lucide-react';
import { PrimaryGrade, UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { MssidLogo } from './MssidLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

export type HeaderTheme = 'light' | 'neutre' | 'dark' | 'midnight' | 'oled' | 'sepia';

interface NavbarProps {
  currentGrade: PrimaryGrade;
  onGradeChange: (grade: PrimaryGrade) => void;
  userProfile: UserProfile;
  authUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenAdminReceiptsModal: () => void;
  onOpenAiTutor: () => void;
  onOpenAuditModal: () => void;
  onOpenPricingModal: () => void;
  onOpenProfileModal: () => void;
  onOpenMobileSimulator?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenCms?: () => void;
  onHomeClick: () => void;
  currentTheme?: HeaderTheme;
  onThemeChange?: (theme: HeaderTheme) => void;
}

const GRADES: { id: PrimaryGrade; labelAr: string; shortLabel: string; badge: string }[] = [
  { id: '1AP', labelAr: 'السنة الأولى', shortLabel: 'السنة 1', badge: '1AP' },
  { id: '2AP', labelAr: 'السنة الثانية', shortLabel: 'السنة 2', badge: '2AP' },
  { id: '3AP', labelAr: 'السنة الثالثة', shortLabel: 'السنة 3', badge: '3AP' },
  { id: '4AP', labelAr: 'السنة الرابعة', shortLabel: 'السنة 4', badge: '4AP' },
  { id: '5AP', labelAr: 'السنة الخامسة', shortLabel: 'السنة 5', badge: '5AP' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentGrade,
  onGradeChange,
  userProfile,
  authUser,
  onOpenAuthModal,
  onLogout,
  onOpenAdminReceiptsModal,
  onOpenAiTutor,
  onOpenAuditModal,
  onOpenProfileModal,
  onOpenMobileSimulator,
  onOpenPrivacyPolicy,
  onOpenCms,
  onHomeClick,
  currentTheme = 'midnight',
  onThemeChange,
}) => {
  const [theme, setTheme] = useState<HeaderTheme>(currentTheme);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const applyThemeToRoot = (selectedTheme: HeaderTheme) => {
    const root = document.documentElement;
    root.classList.remove('theme-midnight', 'theme-dark', 'theme-oled', 'theme-light', 'theme-neutre', 'theme-sepia');
    root.classList.add(`theme-${selectedTheme}`);

    if (selectedTheme === 'neutre') {
      document.body.style.backgroundColor = '#ecfdf5';
      document.body.style.color = '#0f172a';
    } else if (selectedTheme === 'light') {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0f172a';
    } else if (selectedTheme === 'sepia') {
      document.body.style.backgroundColor = '#fbf9f5';
      document.body.style.color = '#292524';
    } else {
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f8fafc';
    }
  };

  useEffect(() => {
    if (currentTheme) {
      const validTheme: HeaderTheme = (['neutre', 'light', 'dark', 'midnight', 'oled', 'sepia'].includes(currentTheme) ? currentTheme : 'neutre') as HeaderTheme;
      setTheme(validTheme);
      applyThemeToRoot(validTheme);
    }
  }, [currentTheme]);

  const handleThemeSelect = (selectedTheme: HeaderTheme) => {
    setTheme(selectedTheme);
    if (onThemeChange) {
      onThemeChange(selectedTheme);
    }
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

  const isLightLike = theme === 'light' || theme === 'neutre' || theme === 'sepia';

  const getHeaderBgStyle = () => {
    switch (theme) {
      case 'oled':
        return 'bg-black/95 border-b border-neutral-800 text-white shadow-2xl';
      case 'neutre':
        return 'bg-white/98 border-b-4 border-amber-100 text-slate-900 shadow-sm backdrop-blur-md';
      case 'light':
        return 'bg-white/98 border-b-4 border-indigo-100 text-slate-900 shadow-sm backdrop-blur-md';
      case 'sepia':
        return 'bg-[#FBF9F5]/95 border-b-4 border-[#D6CEBF] text-stone-900 shadow-sm backdrop-blur-md';
      case 'midnight':
      case 'dark':
      default:
        return 'bg-slate-900/95 border-b border-slate-800 text-slate-100 shadow-md backdrop-blur-md';
    }
  };

  const getSegmentedBgStyle = () => {
    switch (theme) {
      case 'oled':
        return 'bg-neutral-900/90 border border-neutral-800';
      case 'neutre':
        return 'bg-amber-50/80 border-2 border-amber-200/80 p-1 rounded-2xl';
      case 'light':
        return 'bg-indigo-50/80 border-2 border-indigo-200/80 p-1 rounded-2xl';
      case 'sepia':
        return 'bg-[#EDE8DF] border border-[#D6CEBF]';
      case 'midnight':
      case 'dark':
      default:
        return 'bg-slate-950/80 border border-slate-800/80';
    }
  };

  const getActiveTabStyle = (isActive: boolean) => {
    if (!isActive) {
      return isLightLike
        ? theme === 'neutre'
          ? 'text-slate-600 hover:text-slate-900 hover:bg-amber-100/60 font-bold'
          : theme === 'light'
          ? 'text-indigo-950 hover:text-indigo-700 hover:bg-indigo-100/60 font-bold'
          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-bold'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/60';
    }

    switch (theme) {
      case 'oled':
        return 'bg-emerald-950 text-emerald-300 font-black border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
      case 'neutre':
      case 'light':
        return 'bg-indigo-600 text-white font-black shadow-md border-b-4 border-indigo-800 active:translate-y-0.5';
      case 'sepia':
        return 'bg-amber-800 text-amber-50 font-black shadow-xs';
      case 'midnight':
      case 'dark':
      default:
        return 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.25)] border border-emerald-400/30';
    }
  };

  const getDropdownBgStyle = () => {
    switch (theme) {
      case 'oled':
        return 'bg-neutral-950 border-neutral-800 text-white shadow-2xl';
      case 'neutre':
        return 'bg-emerald-50/98 border-2 border-emerald-200 text-slate-900 shadow-2xl';
      case 'light':
        return 'bg-white border-2 border-purple-100 text-slate-900 shadow-2xl';
      case 'sepia':
        return 'bg-[#F5F2EB] border-[#E7E2D7] text-stone-900 shadow-xl';
      case 'midnight':
      case 'dark':
      default:
        return 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl';
    }
  };

  const isAiEnabled = useFeatureFlag('aiAssistant');
  const roleLabel = authUser?.role || 'ROLE_FREE';
  const isAdmin = roleLabel === 'ROLE_ADMIN';
  const isPremiumOrAdmin = roleLabel === 'ROLE_PREMIUM' || isAdmin;
  const displayXp = authUser?.score !== undefined ? authUser.score : (authUser?.xp !== undefined ? authUser.xp : userProfile.xp);
  const displayLevel = authUser?.level !== undefined ? authUser.level : Math.floor(displayXp / 100) + 1;
  
  // Dynamic Badges count from backend or fallback to userProfile
  const displayBadgesCount = (authUser as any)?.badges 
    ? (authUser as any).badges.length 
    : (userProfile?.badges ? userProfile.badges.length : 0);

  return (
    <>
      <header className={`sticky top-0 z-40 transition-colors duration-300 dir-rtl ${getHeaderBgStyle()}`} dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* LOGO & BRAND */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer group" onClick={onHomeClick}>
            {theme === 'neutre' || theme === 'light' ? (
              <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg border-b-4 border-indigo-800 transition-transform group-hover:scale-105">
                M
              </div>
            ) : (
              <div className="transition-transform group-hover:scale-105">
                <MssidLogo size="md" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900 font-sans">
                  MSSID <span className="text-indigo-600 font-serif text-lg">DZ</span>
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-200">
                  مَسِيد الجزائر
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 hidden sm:block">
                المنصة التعليمية للابتدائي الجزائري
              </p>
            </div>
          </div>

          {/* GRADES NAVIGATION */}
          <div className={`hidden lg:flex items-center p-1.5 rounded-2xl ${getSegmentedBgStyle()}`}>
            {GRADES.map((g) => {
              const isActive = currentGrade === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => onGradeChange(g.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${getActiveTabStyle(
                    isActive
                  )}`}
                  title={g.labelAr}
                >
                  <span>{g.labelAr}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? theme === 'neutre'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-black/30 text-white font-bold'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {g.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ACTIONS & USER PROFILE */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* AI Tutor Button */}
            {isAiEnabled && (theme === 'neutre' ? (
              <button
                onClick={onOpenAiTutor}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95 cursor-pointer"
                title="المعلم الذكي مسيد"
              >
                <Sparkles className="w-4 h-4 animate-pulse text-amber-100" />
                <span className="hidden sm:inline">المعلّم الذكي</span>
              </button>
            ) : (
              <button
                onClick={onOpenAiTutor}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:brightness-110 text-white font-black text-xs px-3 py-2 rounded-xl shadow-md shadow-emerald-900/30 transition-all cursor-pointer active:scale-95"
                title="المعلم الذكي بالذكاء الاصطناعي Gemini"
              >
                <Bot className="w-4 h-4 text-amber-200 animate-pulse" />
                <span className="hidden sm:inline">المعلّم الذكي</span>
              </button>
            ))}
           

<div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {/* XP & Badges Display */}
            {theme === 'neutre' || theme === 'light' ? (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={onOpenProfileModal}
                  className="flex items-center gap-2 bg-amber-100 px-3.5 py-1.5 rounded-full border-2 border-amber-200 transition-all hover:bg-amber-200/80 cursor-pointer"
                  title={`المستوى ${displayLevel} - ${displayXp} نقاط خبرة`}
                >
                  <span className="text-base">⭐</span>
                  <span className="font-black text-amber-700 text-xs">{displayXp} XP (Niv.{displayLevel})</span>
                </button>
                <button
                  onClick={onOpenProfileModal}
                  className="flex items-center gap-2 bg-emerald-100 px-3.5 py-1.5 rounded-full border-2 border-emerald-200 transition-all hover:bg-emerald-200/80 cursor-pointer"
                >
                  <span className="text-base">🏆</span>
                  <span className="font-black text-emerald-700 text-xs">
                    {displayBadgesCount} {displayBadgesCount > 1 ? 'الأوسمة' : 'وسام'}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenProfileModal}
                className={`hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer hover:brightness-110 active:scale-95 ${
                  isLightLike
                    ? 'bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-200'
                }`}
                title={`الملف الشخصي - المستوى ${displayLevel}`}
              >
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <span className="font-extrabold text-orange-400">{userProfile.streakDays}d</span>
                </div>
                <div className="h-3 w-px bg-slate-700/60" />
                <div className="flex items-center gap-1 text-amber-400">
                  <Award className="w-4 h-4" />
                  <span className="font-extrabold text-amber-300">{displayXp} XP (Lvl {displayLevel})</span>
                </div>
                <span
                  className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md ${
                    isPremiumOrAdmin
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {roleLabel === 'ROLE_ADMIN' ? 'ADMIN' : roleLabel === 'ROLE_PREMIUM' ? 'PRO' : 'FREE'}
                </span>
              </button>
            )}

            {/* Theme Dropdown */}
            <div className="hidden md:block relative" ref={themeRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isLightLike
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                    : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title="تغيير المظهر والثيم"
              >
                {theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : theme === 'neutre' ? (
                  <Palette className="w-4 h-4 text-purple-600" />
                ) : theme === 'oled' ? (
                  <Moon className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Palette className="w-4 h-4 text-teal-400" />
                )}
              </button>

              {isThemeDropdownOpen && (
                <div
                  className={`absolute left-0 mt-2 w-48 rounded-2xl border p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${getDropdownBgStyle()}`}
                >
                  <div className={`text-[10px] font-bold px-2 py-1 border-b mb-1 ${isLightLike ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800/60'}`}>
                    اختر ثيم الواجهة:
                  </div>

                  <button
                    onClick={() => handleThemeSelect('neutre')}
                    className={`w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      theme === 'neutre'
                        ? 'bg-emerald-600 text-white font-black shadow-sm'
                        : isLightLike
                        ? 'hover:bg-emerald-100/70 text-slate-800'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>1. Neutre (النمط الملوّن والمنعش)</span>
                    </div>
                    {theme === 'neutre' && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  <button
                    onClick={() => handleThemeSelect('light')}
                    className={`w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-purple-700 text-white font-black shadow-sm'
                        : isLightLike
                        ? 'hover:bg-purple-50 text-slate-800'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>2. Light (الأبيض والأرجواني)</span>
                    </div>
                    {theme === 'light' && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  <button
                    onClick={() => handleThemeSelect('dark')}
                    className={`w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      theme === 'dark' || theme === 'midnight'
                        ? 'bg-slate-800 text-emerald-400 font-black shadow-sm border border-emerald-500/30'
                        : isLightLike
                        ? 'hover:bg-slate-100 text-slate-800'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-teal-400" />
                      <span>3. Dark (الداكن - Midnight)</span>
                    </div>
                    {(theme === 'dark' || theme === 'midnight') && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* UNIFIED PROFILE & AUTH DROPDOWN */}
            <div className="hidden md:block relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer active:scale-95 ${
                  isLightLike
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100'
                }`}
                title="القائمة والخيارات العامة"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-[10px]">
                  {authUser?.nom ? authUser.nom.charAt(0).toUpperCase() : '👤'}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">
                  {authUser ? authUser.nom : 'تسجيل الدخول'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isProfileDropdownOpen && (
                <div
                  className={`absolute left-0 mt-2 w-64 rounded-2xl border p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${getDropdownBgStyle()}`}
                >
                  <div className={`p-2.5 rounded-xl border mb-2 ${isLightLike ? 'bg-purple-50 border-purple-200/80 text-slate-900' : 'bg-emerald-950/40 border-emerald-800/40'}`}>
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className={`font-extrabold text-xs truncate max-w-[120px] ${isLightLike ? 'text-purple-900' : 'text-white'}`}>
                        {authUser ? authUser.nom : 'زائر mssid dz'}
                      </span>
                      <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded shadow-xs ${
                        !authUser
                          ? 'bg-slate-200 text-slate-700 border border-slate-300'
                          : isAdmin
                          ? 'bg-rose-500 text-white'
                          : roleLabel === 'ROLE_PREMIUM'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {!authUser ? 'GUEST' : isAdmin ? '👑 ADMIN' : roleLabel === 'ROLE_PREMIUM' ? '⭐ PREMIUM' : '🌱 FREE'}
                      </span>
                    </div>
                    {authUser?.email ? (
                      <p className="text-[10px] text-slate-500 dir-ltr text-right truncate mt-0.5 font-mono">{authUser.email}</p>
                    ) : (
                      <p className="text-[10px] text-slate-500 text-right truncate mt-0.5">سجل دخولك لحفظ بياناتك في الخادم</p>
                    )}
                    <div className={`text-[10px] mt-1.5 flex items-center justify-between ${isLightLike ? 'text-slate-600' : 'text-slate-400'}`}>
                      <span>🔥 {authUser?.streakDays ?? userProfile.streakDays} أيام متتالية</span>
                      <span className="font-bold text-amber-500">🏆 {displayXp} XP / نقاط</span>
                    </div>
                  </div>

                  <div className={`text-[10px] font-bold px-2 py-1 border-b mb-1 ${isLightLike ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800/60'}`}>
                    الحساب والتوثيق
                  </div>

                  {!authUser ? (
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer text-purple-700 hover:bg-purple-50"
                    >
                      <KeyRound className="w-4 h-4 text-purple-600" />
                      <span>تسجيل الدخول / إنشاء حساب</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          onOpenProfileModal();
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${isLightLike ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800/70 text-slate-100'}`}
                      >
                        <User className="w-4 h-4 text-emerald-500" />
                        <span>الملف الشخصي والتقدم</span>
                      </button>

                      <button
                        onClick={() => {
                          onLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer text-red-600 hover:bg-red-500/10"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>تسجيل الخروج (Déconnexion)</span>
                      </button>
                    </>
                  )}

                  {/* ADMIN SECTION (RBAC & CMS) */}
                  {isAdmin && (
                    <>
                      <div className={`text-[10px] font-bold px-2 py-1 border-b mb-1 mt-2 ${isLightLike ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800/60'}`}>
                        إدارة النظام (Admin)
                      </div>

                      <button
                        onClick={() => {
                          onOpenAdminReceiptsModal();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>لوحة إدارة المستخدمين والوصولات (RBAC)</span>
                      </button>

                      {onOpenCms && (
                        <button
                          onClick={() => {
                            onOpenCms();
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            isLightLike ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800/70 text-slate-100'
                          }`}
                        >
                          <Sliders className="w-4 h-4 text-indigo-400" />
                          <span>إدارة المحتوى (CMS Admin)</span>
                        </button>
                      )}
                    </>
                  )}

                  <div className={`text-[10px] font-bold px-2 py-1 border-b mb-1 mt-2 ${isLightLike ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800/60'}`}>
                    أدوات وإعدادات
                  </div>

                  <button
                    onClick={() => {
                      onOpenAuditModal();
                      setIsProfileDropdownOpen(false);
                    }}
                    className={`w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${isLightLike ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800/70 text-slate-100'}`}
                  >
                    <BarChart2 className="w-4 h-4 text-teal-600" />
                    <span>تقرير التدقيق البيداغوجي</span>
                  </button>

                  {onOpenPrivacyPolicy && (
                    <button
                      onClick={() => {
                        onOpenPrivacyPolicy();
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full text-right px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${isLightLike ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800/70 text-slate-100'}`}
                    >
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>سياسة الخصوصية Google Play</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className={`md:hidden p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isLightLike
                  ? 'bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-800 border-slate-700 text-slate-100'
              }`}
              title="القائمة"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end transition-all dir-rtl" dir="rtl">
          <div className={`w-4/5 max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl border-r border-slate-800 ${getDropdownBgStyle()}`}>
            
            <div className="space-y-5 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <MssidLogo size="sm" />
                  <span className="font-black text-base">مَسِيد DZ</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">اختر المستوى الدراسي:</label>
                <div className="grid grid-cols-2 gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        onGradeChange(g.id);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-extrabold border transition-all text-center ${
                        currentGrade === g.id
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-800/60 text-slate-300 border-slate-700/60'
                      }`}
                    >
                      {g.labelAr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">ثيم الواجهة:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleThemeSelect('neutre')}
                    className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold border ${
                      theme === 'neutre' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Neutre
                  </button>
                  <button
                    onClick={() => handleThemeSelect('light')}
                    className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold border ${
                      theme === 'light' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeSelect('dark')}
                    className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-bold border ${
                      theme === 'dark' || theme === 'midnight' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    onOpenAiTutor();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-amber-200" />
                  <span>المعلم الذكي بالذكاء الاصطناعي</span>
                </button>

                <button
                  onClick={() => {
                    onOpenProfileModal();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 text-slate-200 font-bold text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>الملف الشخصي</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">{displayXp} XP</span>
                </button>

                {onOpenMobileSimulator && (
                  <button
                    onClick={() => {
                      onOpenMobileSimulator();
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-800/80 text-emerald-300 font-bold text-xs flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>تطبيق المحمول (Android/iOS)</span>
                  </button>
                )}

                {/* CMS Mobile riservé au rôle ADMIN */}
                {isAdmin && onOpenCms && (
                  <button
                    onClick={() => {
                      onOpenCms();
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl bg-indigo-900/40 text-indigo-200 border border-indigo-700/50 font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>إدارة المحتوى (CMS Admin)</span>
                  </button>
                )}

                {!authUser ? (
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <span>تسجيل الدخول / إنشاء حساب</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>تسجيل الخروج (Déconnexion)</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
              مَسِيد DZ • الإصدار v2.6.0 (SaaS Dashboard)
            </div>

          </div>
        </div>
      )}
    </>
  );
};