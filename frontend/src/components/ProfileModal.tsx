import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { X, Flame, Star, CheckCircle2, Lock, ShieldCheck, RefreshCw, Edit2, Database, Trophy, Sparkles, Mail, MessageSquare, FileText, Home } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { Card, XPProgressBar } from './ui';
import { BADGES_CATALOG } from '../data/badgesData';
import { describeCriteria } from '../utils/badgeEngine';
import { AuthService } from '../services/authService';
import { ParentGateModal } from './ParentGateModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  authUser?: AuthUser | null;
  onResetProgress: () => void;
  onUpdateName?: (newName: string) => void;
  onUpdateAvatar?: (newAvatar: string) => void;
  onRefreshFromDb?: () => Promise<void>;
  onOpenAdminConsole?: () => void;
  onOpenPreschool?: () => void;
  onOpenContactModal?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfService?: () => void;
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
  onResetProgress,
  onUpdateName,
  onUpdateAvatar,
  onRefreshFromDb,
  onOpenAdminConsole,
  onOpenPreschool,
  onOpenContactModal,
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
}) => {
  const t = useTranslation('common');
  const tNav = useTranslation('navigation');
  const { direction } = useLocaleContext();
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
    setDeleteAccountError(result.error || t('deleteAccountErrorFallback'));
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

  // Conic-gradient ring around the avatar: fuses "who you are" (avatar) with "how far along you
  // are" (% to next level) into a single glance, instead of making the XP bar further down the only
  // place progress is visible.
  const avatarRingStyle: React.CSSProperties = {
    background: `conic-gradient(var(--kids-sun-1) ${currentLevelProgress * 3.6}deg, rgba(255,255,255,0.28) ${currentLevelProgress * 3.6}deg)`,
  };

  return (
    <>
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

        {/* Header */}
        <div className="kids-modal-header p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-14 rounded-full p-[3px] shrink-0" style={avatarRingStyle} title={t('levelProgressTitle', { percent: currentLevelProgress, level: currentLevel + 1 })}>
              <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center text-xl font-bold">
                <span className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  {selectedAvatar}
                </span>
              </div>
              <span className="absolute -bottom-1 -left-1 bg-gradient-to-br from-[var(--kids-sun-1)] to-[var(--kids-sun-2)] text-[#5A3B00] text-[10px] font-extrabold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                {currentLevel}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold truncate">{currentName}</h2>
                {authUser?.role && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    authUser.role === 'ROLE_ADMIN'
                      ? 'bg-white/20 text-white border border-white/40'
                      : authUser.role === 'ROLE_PREMIUM'
                      ? 'bg-gradient-to-r from-[var(--kids-sun-1)] to-[var(--kids-sun-2)] text-[#5A3B00]'
                      : 'bg-white/20 text-white border border-white/40'
                  }`}>
                    {authUser.role === 'ROLE_ADMIN' ? 'ADMIN' : authUser.role === 'ROLE_PREMIUM' ? 'PREMIUM' : 'FREE'}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/90 mt-0.5 truncate">
                {authUser?.email
                  ? t('emailLevelLabel', { email: authUser.email, level: currentLevel })
                  : t('studentInGradeLabel', { grade: userProfile.grade, level: currentLevel })}
              </p>
              <div className="w-32 sm:w-40 bg-white/25 h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full rounded-full bg-[var(--kids-sun-1)] transition-all duration-500"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onRefreshFromDb && (
              <button
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                title={t('refreshFromDbTitle')}
                className="kids-close cursor-pointer disabled:opacity-50"
              >
                <Database className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="kids-close cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Identity Card */}
          <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-2 rounded-[22px]">
            <label className="text-sm font-extrabold text-[var(--kids-ink)] flex items-center gap-1.5">
              <Edit2 className="w-4 h-4 text-[var(--kids-grass-2)]" />
              <span>{t('studentNameLabel')}</span>
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="kids-input"
            />
          </Card>

          {/* Email Verification Reminder Card — discreet, non-blocking (SEC-08) */}
          {authUser && !authUser.emailVerified && (
            <Card padding="md" className="!bg-[#FFF8E7] !border-[#F5D98A] space-y-2.5 rounded-[22px]">
              <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#5A3B00]">
                <Mail className="w-4 h-4 text-[var(--kids-sun-2)]" />
                <span>{t('confirmEmailHeading')}</span>
              </div>
              <p className="text-xs text-[#8A5A12] leading-relaxed font-bold">
                {t('emailCodeSentText', { email: authUser.email })}
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
                  className="kids-input flex-1 font-mono text-center tracking-widest"
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || verifyState === 'loading'}
                  className="kids-cta-amber px-4 cursor-pointer shrink-0 disabled:cursor-not-allowed"
                >
                  {verifyState === 'loading' ? '...' : t('confirmButton')}
                </button>
              </div>
              {verifyMessage && (
                <p className={`text-xs font-bold ${verifyState === 'success' ? 'text-[var(--kids-grass-2)]' : 'text-[var(--brand-coral)]'}`}>
                  {verifyMessage}
                </p>
              )}
              <button
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                className="text-xs font-extrabold text-[#8A5A12] disabled:opacity-50 cursor-pointer"
              >
                {resendCooldown > 0 ? t('resendAfterSeconds', { seconds: resendCooldown }) : t('resendCode')}
              </button>
            </Card>
          )}

          {/* Progress group — avatar, level/XP, and badges. Grade/language/theme/tashkeel/
              connexion moved out to SettingsModal, opened from a dedicated ⚙️ header icon
              (remonte utilisateur : "je veux désassocier le profile et Réglages dans un nouveau
              icon ⚙️ dans le header"). */}
          <div className="flex items-center gap-1.5 px-1 pt-2">
            <Trophy className="w-4 h-4 text-[var(--kids-sun-2)]" />
            <span className="text-xs font-black text-[var(--kids-muted)]">{t('progressSectionLabel')}</span>
          </div>

          {/* Avatar Picker Card */}
          <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-3 rounded-[22px]">
            <label className="text-sm font-extrabold text-[var(--kids-ink)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[var(--kids-sun-2)]" />
              <span>{t('avatarPickerLabel')}</span>
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
                    className={`aspect-square min-h-[var(--hit)] rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl cursor-pointer ${
                      isSelected
                        ? 'bg-[#ECFDF5] border-[var(--kids-grass-2)] kids-pop'
                        : 'bg-[#FFFBF0] border-[#E7E2D7]'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* XP Gauge Card */}
          <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-3 rounded-[22px]">
            <div className="flex items-center justify-between text-sm font-extrabold text-[var(--kids-ink)]">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[var(--kids-sun-2)] fill-[var(--kids-sun-1)]" />
                <span>{t('currentLevelLabel', { level: currentLevel, nextLevel: currentLevel + 1 })}</span>
              </div>
            </div>

            <XPProgressBar currentXp={xpInCurrentLevel} maxXp={100} showLabel={false} />
            <div className="text-left">
              <span className="font-extrabold text-[var(--kids-grass-2)] text-sm" dir="ltr">{totalXp} XP</span>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[var(--kids-muted)] pt-1">
              <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[var(--kids-coral-2)] fill-[var(--kids-sun-1)]" />
                <span>{t('streakLabel', { days: userProfile.streakDays })}</span>
              </div>
              <span>{t('completedLessonsLabel', { count: userProfile.completedLessonIds.length })}</span>
            </div>
          </Card>

          <div className="grid gap-4">
            {/* Badges Gallery Card — always driven by userProfile.badges, kept live by the badge-evaluation
                effect in App.tsx, so this gallery reflects real progress rather than a fixed mock list. */}
            <Card padding="md" className="!bg-white !border-[#E7E2D7] space-y-3 rounded-[22px]">
              <h3 className="text-sm font-extrabold text-[var(--kids-muted)]">
                {t('badgesGalleryLabel', { unlocked: userProfile.badges.length, total: BADGES_CATALOG.length })}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BADGES_CATALOG.map((b) => {
                  const isUnlocked = userProfile.badges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`p-3 rounded-2xl border-2 flex items-start gap-3 ${
                        isUnlocked
                          ? 'bg-[#FFF8E7] border-[#F5D98A] text-[#5A3B00]'
                          : 'bg-[#FFFBF0] border-[#E7E2D7] text-[var(--kids-muted)] opacity-70'
                      }`}
                    >
                      <div className="text-2xl p-1.5 bg-white rounded-xl border-2 border-[#E7E2D7] shrink-0">
                        {b.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm">{b.titleAr}</h4>
                          {isUnlocked ? (
                            <CheckCircle2 className="w-4 h-4 text-[var(--kids-grass-2)] shrink-0" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-[var(--kids-muted)] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-[var(--kids-muted)] leading-snug mt-0.5 font-bold">
                          {isUnlocked ? b.descriptionAr : describeCriteria(b.criteria)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-2">
              {onOpenPreschool && (
                <button
                  type="button"
                  onClick={() => { onOpenPreschool(); onClose(); }}
                  className="w-full hit-target rounded-2xl bg-[#FFF8E7] border-2 border-[#F5D98A] text-sm font-extrabold text-[#5A3B00] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  {t('profilePreschoolCta')}
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
              {onOpenContactModal && (
                <button
                  type="button"
                  onClick={() => { onOpenContactModal(); onClose(); }}
                  className="w-full hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold text-[var(--kids-ink)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {tNav('contactUs')}
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
        </div>

        {/* Footer */}
        <div className="bg-[#FFF8E7] border-t-2 border-[#E7E2D7] p-4 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onResetProgress}
              className="text-sm font-extrabold text-[var(--brand-coral)] flex items-center gap-1 cursor-pointer min-h-[var(--hit)]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('resetProgress')}</span>
            </button>
            <button
              onClick={handleSave}
              className="kids-cta !w-auto px-6 cursor-pointer"
            >
              {t('saveAndClose')}
            </button>
          </div>

          {authUser && (
            <div className="flex items-center justify-between border-t-2 border-[#E7E2D7] pt-2.5">
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="text-xs font-bold text-[var(--kids-muted)] disabled:opacity-50 cursor-pointer"
              >
                {deletingAccount
                  ? t('deletingAccountLabel')
                  : confirmDeleteAccount
                  ? t('confirmDeleteAccountLabel')
                  : t('deleteAccountLabel')}
              </button>
              {confirmDeleteAccount && !deletingAccount && (
                <button
                  onClick={() => setConfirmDeleteAccount(false)}
                  className="text-xs font-extrabold text-[var(--kids-ink)] cursor-pointer"
                >
                  {t('cancel')}
                </button>
              )}
            </div>
          )}
          {deleteAccountError && (
            <p className="text-xs font-bold text-[var(--brand-coral)] text-center">{deleteAccountError}</p>
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
