import React, { Suspense, lazy } from 'react';
import { CourseLesson, PrimaryGrade, UserProfile } from '../types';
import { AuthUser } from '../types/auth';
import { COURSES_DATA } from '../data/coursesData';
import { AuthService } from '../services/authService';
import { AiTutorModal } from './AiTutorModal';
import { BadgeUnlockToast } from './BadgeUnlockToast';
import { ProfileModal } from './ProfileModal';
import { AuthModal } from './AuthModal';
import { EmailVerificationPopup } from './EmailVerificationPopup';
import { MobileAppSimulator } from './MobileAppSimulator';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { TermsOfServiceModal } from './TermsOfServiceModal';
import { SubscriptionPaywall } from './SubscriptionPaywall';
import { AppRatingPrompt } from './AppRatingPrompt';
import { ContactModal } from './ContactModal';
import { Badge as BadgeInfo } from '../types';
import { useAppModals } from '../hooks/useAppModals';
import { useTranslation } from '../hooks/useTranslation';

const DidouDressingRoomModal = lazy(() => import('./DidouDressingRoomModal').then((m) => ({ default: m.DidouDressingRoomModal })));
const HomeworkPinModal = lazy(() => import('./HomeworkPinModal').then((m) => ({ default: m.HomeworkPinModal })));
const PrintableWorksheetsGeneratorModal = lazy(() => import('./PrintableWorksheetsGeneratorModal').then((m) => ({ default: m.PrintableWorksheetsGeneratorModal })));
const OfflinePacksManagerModal = lazy(() => import('./OfflinePacksManagerModal').then((m) => ({ default: m.OfflinePacksManagerModal })));

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
  lockedLesson: CourseLesson | null;
  onCloseLockedLesson: () => void;
  onSelectLesson: (lesson: CourseLesson) => void;
  onRestoreLesson: (lesson: CourseLesson) => void;
  onStartHomework: (subject: CourseLesson['subject']) => void;
  onGradeChange: (grade: PrimaryGrade) => void;
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
  lockedLesson,
  onCloseLockedLesson,
  onSelectLesson,
  onRestoreLesson,
  onStartHomework,
  onGradeChange,
  onResetProgress,
  onUpdateName,
  onUpdateAvatar,
  onRefreshFromDb,
}) => {
  const t = useTranslation('navigation');
  return (
  <>
    <AiTutorModal
      isOpen={modals.isAiModalOpen}
      onClose={() => modals.setIsAiModalOpen(false)}
      grade={grade}
    />

    <BadgeUnlockToast queue={newlyUnlockedBadges} onDismiss={onDismissBadge} />

    <ProfileModal
      isOpen={modals.isProfileModalOpen}
      onClose={() => modals.setIsProfileModalOpen(false)}
      userProfile={userProfile}
      authUser={authUser}
      tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
      onToggleTashkeel={(next) => {
        setUserProfile((prev) => ({ ...prev, tashkeelEnabled: next }));
      }}
      onResetProgress={() => {
        if (onResetProgress()) modals.setIsProfileModalOpen(false);
      }}
      onUpdateName={onUpdateName}
      onUpdateAvatar={onUpdateAvatar}
      onRefreshFromDb={onRefreshFromDb}
    />

    <ContactModal
      isOpen={modals.isContactModalOpen}
      onClose={() => modals.setIsContactModalOpen(false)}
      authUser={authUser}
    />

    <AppRatingPrompt
      trigger={ratingPromptTrigger}
      onOpenContact={() => modals.setIsContactModalOpen(true)}
    />

    <AuthModal
      isOpen={modals.isAuthModalOpen}
      onClose={() => modals.setIsAuthModalOpen(false)}
      initialMode={modals.authModalInitialMode}
      onOpenPrivacyPolicy={() => modals.setIsPrivacyModalOpen(true)}
      onOpenTermsOfService={() => modals.setIsTermsModalOpen(true)}
      onAuthSuccess={() => {
        const freshUser = AuthService.getCurrentUser();
        if (freshUser && !freshUser.emailVerified) {
          modals.setIsEmailVerifyPopupOpen(true);
        }

        const raw = sessionStorage.getItem('redirect_after_auth');
        if (!raw) return;
        sessionStorage.removeItem('redirect_after_auth');
        try {
          const target = JSON.parse(raw);
          if (target?.type === 'lesson' && target.lessonId) {
            const lesson = COURSES_DATA.find((l) => l.id === target.lessonId);
            if (lesson) onRestoreLesson(lesson);
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

    <MobileAppSimulator
      isOpen={modals.isMobileSimulatorOpen}
      onClose={() => modals.setIsMobileSimulatorOpen(false)}
      currentGrade={grade}
      onGradeChange={onGradeChange}
    />

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
