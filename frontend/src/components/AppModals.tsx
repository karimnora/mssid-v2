import React, { Suspense, lazy, useState } from 'react';
import { CourseLesson, PrimaryGrade, UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { AuthService } from '../services/authService';
import { AiTutorModal } from './AiTutorModal';
import { BadgeUnlockToast } from './BadgeUnlockToast';
import { CertificateModal } from './CertificateModal';
import { AuthModal } from './AuthModal';
import { EmailVerificationPopup } from './EmailVerificationPopup';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { TermsOfServiceModal } from './TermsOfServiceModal';
import { SubscriptionPaywall } from './SubscriptionPaywall';
import { AppRatingPrompt } from './AppRatingPrompt';
import { ContactModal } from './ContactModal';
import { Badge as BadgeInfo } from '../types';
import { useAppModals } from '../hooks/useAppModals';
import { useTranslation } from '../hooks/useTranslation';
import { HeaderTheme } from './Navbar';

const DidouDressingRoomModal = lazy(() => import('./DidouDressingRoomModal').then((m) => ({ default: m.DidouDressingRoomModal })));
const HomeworkPinModal = lazy(() => import('./HomeworkPinModal').then((m) => ({ default: m.HomeworkPinModal })));
const PrintableWorksheetsGeneratorModal = lazy(() => import('./PrintableWorksheetsGeneratorModal').then((m) => ({ default: m.PrintableWorksheetsGeneratorModal })));
const HonorCertificatesStudioModal = lazy(() => import('./HonorCertificatesStudioModal').then((m) => ({ default: m.HonorCertificatesStudioModal })));
const OfflinePacksManagerModal = lazy(() => import('./OfflinePacksManagerModal').then((m) => ({ default: m.OfflinePacksManagerModal })));
// Lazy specifically because ProfileModal pulls in badgeEngine.ts, which needs the full lesson
// catalog to map completed-lesson ids to subjects — no reason that forces itself into the initial
// bundle before the user has even opened their profile.
const ProfileModal = lazy(() => import('./ProfileModal').then((m) => ({ default: m.ProfileModal })));
const SettingsModal = lazy(() => import('./SettingsModal').then((m) => ({ default: m.SettingsModal })));

type Modals = ReturnType<typeof useAppModals>;

interface AppModalsProps {
  modals: Modals;
  grade: PrimaryGrade;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  authUser: AuthUser | null;
  newlyUnlockedBadges: BadgeInfo[];
  onDismissBadge: () => void;
  ratingPromptTrigger: number;
  allowRatingPrompt?: boolean;
  lockedLesson: CourseLesson | null;
  onCloseLockedLesson: () => void;
  onSelectLesson: (lesson: CourseLesson) => void;
  onRestoreLesson: (lesson: CourseLesson) => void;
  onStartHomework: (subject: CourseLesson['subject']) => void;
  onGradeChange: (grade: PrimaryGrade) => void;
  onOpenAuthModal: () => void;
  /** Routes into preschool mode right after a "préscolaire" registration (AuthModal's landOnPreschool flag). */
  onEnterPreschool: () => void;
  onLogout: () => void;
  onOpenAdminConsole: () => void;
  onOpenContactModal: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenTermsOfService: () => void;
  currentTheme: HeaderTheme;
  onThemeChange: (theme: HeaderTheme) => void;
  isThemeAuto: boolean;
  onThemeAuto: () => void;
  onResetProgress: () => boolean;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (avatar: string) => void;
  onRefreshFromDb: () => Promise<void>;
}

export const AppModals: React.FC<AppModalsProps> = ({
  modals,
  grade,
  userProfile,
  setUserProfile,
  authUser,
  newlyUnlockedBadges,
  onDismissBadge,
  ratingPromptTrigger,
  allowRatingPrompt = true,
  lockedLesson,
  onCloseLockedLesson,
  onSelectLesson,
  onRestoreLesson,
  onStartHomework,
  onGradeChange,
  onOpenAuthModal,
  onEnterPreschool,
  onLogout,
  onOpenAdminConsole,
  onOpenContactModal,
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
  currentTheme,
  onThemeChange,
  isThemeAuto,
  onThemeAuto,
  onResetProgress,
  onUpdateName,
  onUpdateAvatar,
  onRefreshFromDb,
}) => {
  const t = useTranslation('navigation');
  const [certificateBadge, setCertificateBadge] = useState<BadgeInfo | null>(null);
  const [manualRatingTrigger, setManualRatingTrigger] = useState(0);
  return (
  <>
    <AiTutorModal
      isOpen={modals.isAiModalOpen}
      onClose={() => modals.setIsAiModalOpen(false)}
      grade={grade}
    />

    <BadgeUnlockToast queue={newlyUnlockedBadges} onDismiss={onDismissBadge} onShare={setCertificateBadge} />

    <CertificateModal
      badge={certificateBadge}
      childName={userProfile.name}
      grade={userProfile.grade}
      onClose={() => setCertificateBadge(null)}
    />

    <Suspense fallback={null}>
      <ProfileModal
        isOpen={modals.isProfileModalOpen}
        onClose={() => modals.setIsProfileModalOpen(false)}
        userProfile={userProfile}
        authUser={authUser}
        onResetProgress={() => {
          if (onResetProgress()) modals.setIsProfileModalOpen(false);
        }}
        onUpdateName={onUpdateName}
        onUpdateAvatar={onUpdateAvatar}
        onRefreshFromDb={onRefreshFromDb}
        onOpenAdminConsole={onOpenAdminConsole}
        onShareBadge={setCertificateBadge}
      />
    </Suspense>

    <Suspense fallback={null}>
      <SettingsModal
        onOpenRating={() => setManualRatingTrigger((value) => value + 1)}
        isOpen={modals.isSettingsModalOpen}
        onClose={() => modals.setIsSettingsModalOpen(false)}
        authUser={authUser}
        tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
        onToggleTashkeel={(next) => {
          setUserProfile((prev) => ({ ...prev, tashkeelEnabled: next }));
        }}
        currentGrade={grade}
        onGradeChange={onGradeChange}
        onOpenAuthModal={onOpenAuthModal}
        onLogout={onLogout}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        isThemeAuto={isThemeAuto}
        onThemeAuto={onThemeAuto}
        onOpenContactModal={() => {
          modals.setIsSettingsModalOpen(false);
          onOpenContactModal();
        }}
        onOpenPrivacyPolicy={() => {
          modals.setIsSettingsModalOpen(false);
          onOpenPrivacyPolicy();
        }}
        onOpenTermsOfService={() => {
          modals.setIsSettingsModalOpen(false);
          onOpenTermsOfService();
        }}
        onOpenAdminConsole={() => {
          modals.setIsSettingsModalOpen(false);
          onOpenAdminConsole();
        }}
      />
    </Suspense>

    <ContactModal
      isOpen={modals.isContactModalOpen}
      onClose={() => {
        modals.setIsContactModalOpen(false);
        modals.setContactPrefillMessage(null);
      }}
      authUser={authUser}
      prefillMessage={modals.contactPrefillMessage}
    />

    <AppRatingPrompt
      trigger={ratingPromptTrigger}
      allowAutomaticPrompt={allowRatingPrompt}
      manualTrigger={manualRatingTrigger}
      blocked={Object.entries(modals).some(([key, value]) => key.startsWith('is') && key.endsWith('Open') && value === true) || Boolean(certificateBadge) || Boolean(lockedLesson)}
      onOpenContact={() => modals.setIsContactModalOpen(true)}
    />

    <AuthModal
      isOpen={modals.isAuthModalOpen}
      onClose={() => modals.setIsAuthModalOpen(false)}
      initialMode={modals.authModalInitialMode}
      contextMessage={modals.authModalReason}
      onOpenPrivacyPolicy={() => modals.setIsPrivacyModalOpen(true)}
      onOpenTermsOfService={() => modals.setIsTermsModalOpen(true)}
      onAuthSuccess={(_user, opts) => {
        const freshUser = AuthService.getCurrentUser();
        if (freshUser && !freshUser.emailVerified) {
          modals.setIsEmailVerifyPopupOpen(true);
        }

        if (opts?.landOnPreschool) {
          onEnterPreschool();
          return;
        }

        const raw = sessionStorage.getItem('redirect_after_auth');
        if (!raw) return;
        sessionStorage.removeItem('redirect_after_auth');
        try {
          const target = JSON.parse(raw);
          if (target?.type === 'lesson' && target.lessonId) {
            // Dynamic import: this login->redirect path is rare, no reason it should force the
            // ~4.6 MB lesson catalog into every visitor's initial bundle.
            import('../data/coursesData').then(({ COURSES_DATA }) => {
              const lesson = COURSES_DATA.find((l) => l.id === target.lessonId);
              if (lesson) onRestoreLesson(lesson);
            });
          }
        } catch {
          // Ignore malformed/stale redirect payloads — worst case the user just lands on the dashboard.
        }
      }}
    />

    {authUser && (
      <EmailVerificationPopup
        isOpen={modals.isEmailVerifyPopupOpen}
        onClose={() => modals.setIsEmailVerifyPopupOpen(false)}
        email={authUser.email}
      />
    )}

    <PrivacyPolicyModal
      isOpen={modals.isPrivacyModalOpen}
      onClose={() => modals.setIsPrivacyModalOpen(false)}
    />

    <TermsOfServiceModal
      isOpen={modals.isTermsModalOpen}
      onClose={() => modals.setIsTermsModalOpen(false)}
    />

    <Suspense fallback={null}>
      {modals.isDressingRoomOpen && (
        <DidouDressingRoomModal
          isOpen={modals.isDressingRoomOpen}
          onClose={() => modals.setIsDressingRoomOpen(false)}
          userProfile={userProfile}
          onUpdateProfile={(updated) => setUserProfile(updated)}
        />
      )}

      {modals.isHomeworkPinOpen && (
        <HomeworkPinModal
          isOpen={modals.isHomeworkPinOpen}
          onClose={() => modals.setIsHomeworkPinOpen(false)}
          currentGrade={grade}
          onStartHomework={(hw) => {
            modals.setIsHomeworkPinOpen(false);
            if (hw?.subject) onStartHomework(hw.subject);
          }}
        />
      )}

      {modals.isPrintablesOpen && (
        <PrintableWorksheetsGeneratorModal
          isOpen={modals.isPrintablesOpen}
          onClose={() => modals.setIsPrintablesOpen(false)}
          defaultGrade={grade}
          onOpenCertificates={() => {
            modals.setIsPrintablesOpen(false);
            modals.setIsHonorCertificatesOpen(true);
          }}
        />
      )}

      {modals.isHonorCertificatesOpen && (
        <HonorCertificatesStudioModal
          isOpen={modals.isHonorCertificatesOpen}
          onClose={() => modals.setIsHonorCertificatesOpen(false)}
          userProfile={userProfile}
          defaultGrade={grade}
        />
      )}

      {modals.isOfflinePacksOpen && (
        <OfflinePacksManagerModal
          isOpen={modals.isOfflinePacksOpen}
          onClose={() => modals.setIsOfflinePacksOpen(false)}
        />
      )}
    </Suspense>

    {lockedLesson && (
      <SubscriptionPaywall
        user={authUser}
        title={t('openLockedLessonTitle', {
          trimesterLabel: lockedLesson.trimester === 3 ? t('trimesterThird') : t('trimesterSecond'),
          title: lockedLesson.titleAr,
        })}
        onClose={onCloseLockedLesson}
        onSuccessUpgrade={() => {
          const lesson = lockedLesson;
          onCloseLockedLesson();
          onSelectLesson(lesson);
        }}
      />
    )}
  </>
  );
};
