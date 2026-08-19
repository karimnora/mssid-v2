import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { X, Award, Flame, Trophy, Star, CheckCircle2, Lock, ShieldCheck, RefreshCw, Edit2, Database, Target, Sparkles, Mail } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { TashkeelToggle } from './TashkeelToggle';
import { Card, XPProgressBar } from './ui';
import { getDailyObjectiveProgress, DAILY_OBJECTIVE_TARGET } from '../utils/dailyObjective';
import { BADGES_CATALOG } from '../data/badgesData';
import { describeCriteria } from '../utils/badgeEngine';
import { AuthService } from '../services/authService';
import { ParentGateModal } from './ParentGateModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  authUser?: AuthUser | null;
  tashkeelEnabled: boolean;
  onToggleTashkeel: (next: boolean) => void;
  onResetProgress: () => void;
  onUpdateName?: (newName: string) => void;
  onUpdateAvatar?: (newAvatar: string) => void;
  onRefreshFromDb?: () => Promise<void>;
}

const AVATAR_OPTIONS = [
  '🦁', '🐯', '🦊', '🐼', '🐨', '🦄', '🐸', '🐧',
  '🦉', '🐢', '🦋', '🐝', '🚀', '⭐', '🎓', '🏆',
  '🦸', '🦸‍♀️', '🧑‍🚀', '🥷',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  authUser,
  tashkeelEnabled,
  onToggleTashkeel,
  onResetProgress,
  onUpdateName,
  onUpdateAvatar,
  onRefreshFromDb,
}) => {
  const t = useTranslation('common');
  const currentName = authUser?.nom || userProfile.name;
  const [editedName, setEditedName] = useState(currentName);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile.avatar || '🎓');

  // SEC-08: soft email verification widget state — the card itself only renders while
  // authUser.emailVerified is false, and disappears reactively the moment verifyEmailCode succeeds
  // (AuthService.setCurrentUser updates the shared singleton authUser is read from).
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyState, setVerifyState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerifyCode = async () => {
    if (verificationCode.trim().length !== 6) return;
    setVerifyState('loading');
    const result = await AuthService.verifyEmailCode(verificationCode.trim());
    setVerifyState(result.success ? 'success' : 'error');
    setVerifyMessage(result.message || null);
    if (result.success) setVerificationCode('');
  };

  const handleResendCode = async () => {
    setResendCooldown(60);
    const result = await AuthService.resendVerificationCode();
    setVerifyMessage(result.message || null);
  };

  // Two-step confirm (tap once to reveal, tap again to actually delete) rather than a browser
  // confirm() dialog — this app is used by children, and a native confirm() is too easy to dismiss
  // reflexively without reading. A full page reload afterward is deliberate: it's the simplest way to
  // reset every piece of in-memory app state (userProfile, selectedLesson, etc.) back to a clean
  // logged-out guest session without duplicating App.tsx's logout reset logic here.
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);
  const [showDeleteParentGate, setShowDeleteParentGate] = useState(false);

  // Parent Gate sits after the two-step confirm above, right before the actual DELETE call — the
  // last point before the action is irreversible.
  const handleDeleteAccount = () => {
    if (!confirmDeleteAccount) {
      setConfirmDeleteAccount(true);
      return;
    }
    setShowDeleteParentGate(true);
  };

  const performAccountDeletion = async () => {
    setShowDeleteParentGate(false);
    setDeletingAccount(true);
    setDeleteAccountError(null);
    const result = await AuthService.deleteAccountAsync();
    if (result.success) {
      localStorage.removeItem('mssid_user_profile');
      window.location.reload();
      return;
    }
    setDeletingAccount(false);
    setDeleteAccountError(result.error || 'تعذر حذف الحساب، حاول مجدداً');
  };

  useEffect(() => {
    setEditedName(authUser?.nom || userProfile.name);
  }, [authUser?.nom, userProfile.name]);

  useEffect(() => {
    setSelectedAvatar(userProfile.avatar || '🎓');
  }, [userProfile.avatar]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onUpdateName && editedName.trim()) {
      onUpdateName(editedName.trim());
    }
    onClose();
  };

  const handleSelectAvatar = (emoji: string) => {
    setSelectedAvatar(emoji);
    onUpdateAvatar?.(emoji);
  };

  const handleRefreshClick = async () => {
    if (onRefreshFromDb) {
      setIsRefreshing(true);
      await onRefreshFromDb();
      setIsRefreshing(false);
    }
  };

  const totalXp = authUser?.score !== undefined ? authUser.score : (authUser?.xp !== undefined ? authUser.xp : userProfile.xp);
  const currentLevel = authUser?.level !== undefined ? authUser.level : Math.floor(totalXp / 100) + 1;
  const nextLevelXp = currentLevel * 100;
  const xpInCurrentLevel = totalXp % 100;
  const currentLevelProgress = Math.min(100, Math.round((xpInCurrentLevel / 100) * 100));
  const dailyObjective = getDailyObjectiveProgress();
  const dailyObjectiveDone = dailyObjective.count >= DAILY_OBJECTIVE_TARGET;

  // Conic-gradient ring around the avatar: fuses "who you are" (avatar) with "how far along you
  // are" (% to next level) into a single glance, instead of making the XP bar further down the only
  // place progress is visible.
  const avatarRingStyle: React.CSSProperties = {
    background: `conic-gradient(var(--brand-amber) ${currentLevelProgress * 3.6}deg, rgba(255,255,255,0.15) ${currentLevelProgress * 3.6}deg)`,
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 dir-rtl"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="bg-white border border-slate-300 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
      >

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full p-[3px] shrink-0" style={avatarRingStyle} title={`${currentLevelProgress}% نحو المستوى ${currentLevel + 1}`}>
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 flex items-center justify-center text-xl font-bold">
                <span className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  {selectedAvatar}
                </span>
              </div>
              <span className="absolute -bottom-1 -left-1 bg-amber-400 text-slate-950 text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-slate-900">
                {currentLevel}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold font-sans">{currentName}</h2>
                {authUser?.role && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    authUser.role === 'ROLE_ADMIN'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : authUser.role === 'ROLE_PREMIUM'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {authUser.role === 'ROLE_ADMIN' ? 'ADMIN' : authUser.role === 'ROLE_PREMIUM' ? 'PREMIUM' : 'FREE'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {authUser?.email ? `${authUser.email} • المستوى ${currentLevel}` : `تلميذ في ${userProfile.grade} • المستوى ${currentLevel}`}
              </p>
              <div className="w-32 sm:w-40 bg-white/10 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshFromDb && (
              <button
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                title="تحديث البيانات من قاعدة البيانات"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              >
                <Database className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Identity Card */}
          <Card padding="md" className="!bg-emerald-50/80 !border-emerald-200/80 space-y-2">
            <label className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>اسم التلميذ / الحساب الشخصي:</span>
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="أدخل اسمك هنا..."
              className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </Card>

          {/* Email Verification Reminder Card — discreet, non-blocking (SEC-08) */}
          {authUser && !authUser.emailVerified && (
            <Card padding="md" className="!bg-amber-50 !border-amber-200 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>قم بتأكيد بريدك الإلكتروني</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                أرسلنا رمزاً مكوناً من 6 أرقام إلى {authUser.email}. أدخله هنا لتأكيد حسابك.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  dir="ltr"
                  className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-mono font-extrabold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || verifyState === 'loading'}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                >
                  {verifyState === 'loading' ? '...' : 'تأكيد'}
                </button>
              </div>
              {verifyMessage && (
                <p className={`text-[11px] font-bold ${verifyState === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {verifyMessage}
                </p>
              )}
              <button
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                className="text-[11px] font-bold text-amber-700 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
              >
                {resendCooldown > 0 ? `إعادة الإرسال بعد ${resendCooldown} ثانية` : 'لم يصلك الرمز؟ إعادة الإرسال'}
              </button>
            </Card>
          )}

          {/* Avatar Picker Card */}
          <Card padding="md" className="space-y-3">
            <label className="text-xs font-extrabold text-[var(--app-text)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>اختر رمزك الشخصي المفضل:</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((emoji) => {
                const isSelected = emoji === selectedAvatar;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSelectAvatar(emoji)}
                    aria-pressed={isSelected}
                    title={emoji}
                    className={`aspect-square rounded-2xl border flex items-center justify-center text-2xl sm:text-3xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 scale-105'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 active:scale-95'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* XP Gauge Card */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-[var(--app-text)]">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>المستوى الحالي ({currentLevel}) ← التقدم نحو المستوى ({currentLevel + 1})</span>
              </div>
            </div>

            <XPProgressBar currentXp={xpInCurrentLevel} maxXp={100} showLabel={false} />
            <div className="text-left">
              <span className="font-mono text-emerald-700 font-black text-sm" dir="ltr">{totalXp} XP</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--app-text-muted)] pt-1">
              <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>سلسلة الحضور: {userProfile.streakDays} أيام متواصلة</span>
              </div>
              <span>مكتمل {userProfile.completedLessonIds.length} دروس</span>
            </div>
          </Card>

          {/* Daily Objective ("Objectif du jour") */}
          <Card padding="md" className={`space-y-2 ${dailyObjectiveDone ? '!bg-emerald-50 !border-emerald-200' : '!bg-amber-50 !border-amber-200'}`}>
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                <span>🎯 هدف اليوم</span>
              </div>
              <span className="font-mono">{Math.min(dailyObjective.count, DAILY_OBJECTIVE_TARGET)} / {DAILY_OBJECTIVE_TARGET} تمارين</span>
            </div>
            <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${dailyObjectiveDone ? 'bg-emerald-500' : 'bg-amber-400'}`}
                style={{ width: `${Math.min(100, (dailyObjective.count / DAILY_OBJECTIVE_TARGET) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] font-bold text-slate-600">
              {dailyObjectiveDone ? '🎉 أنجزت هدف اليوم! عد غداً لهدف جديد.' : `أكمل ${DAILY_OBJECTIVE_TARGET - dailyObjective.count} تمارين أو اختبارات أخرى اليوم لإكمال الهدف.`}
            </p>
          </Card>

          <div className="grid gap-4">
            <Card padding="md">
              <TashkeelToggle enabled={tashkeelEnabled} onToggle={onToggleTashkeel} />
            </Card>

            {/* Badges Gallery Card — always driven by userProfile.badges, kept live by the badge-evaluation
                effect in App.tsx, so this gallery reflects real progress rather than a fixed mock list. */}
            <Card padding="md" className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-[var(--app-text-muted)] tracking-wider">
                شارات الأوسمة والإنجازات ({userProfile.badges.length}/{BADGES_CATALOG.length}):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BADGES_CATALOG.map((b) => {
                  const isUnlocked = userProfile.badges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                        isUnlocked
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                          : 'bg-slate-100/60 border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="text-2xl p-1 bg-white rounded-lg border border-slate-200 shrink-0">
                        {b.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs">{b.titleAr}</h4>
                          {isUnlocked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                          {isUnlocked ? b.descriptionAr : describeCriteria(b.criteria)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <button
              onClick={onResetProgress}
              className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('resetProgress')}</span>
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl hover:bg-emerald-700 transition-colors shadow-md active:scale-95 cursor-pointer"
            >
              {t('saveAndClose')}
            </button>
          </div>

          {authUser && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {deletingAccount
                  ? 'جارٍ الحذف...'
                  : confirmDeleteAccount
                  ? 'اضغط مجدداً لتأكيد حذف الحساب نهائياً'
                  : 'حذف الحساب نهائياً'}
              </button>
              {confirmDeleteAccount && !deletingAccount && (
                <button
                  onClick={() => setConfirmDeleteAccount(false)}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  إلغاء
                </button>
              )}
            </div>
          )}
          {deleteAccountError && (
            <p className="text-[11px] font-bold text-rose-600 text-center">{deleteAccountError}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
    <ParentGateModal
      isOpen={showDeleteParentGate}
      onClose={() => setShowDeleteParentGate(false)}
      onVerified={performAccountDeletion}
    />
    </>
  );
};
