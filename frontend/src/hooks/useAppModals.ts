import { useState } from 'react';

export function useAppModals() {
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');
  // Shown as a banner inside AuthModal so a guest redirected here (locked lesson/lab/exam/AI tutor)
  // understands WHY the login screen just appeared, instead of it looking like an unexplained
  // interruption. null when the modal is opened as a deliberate "Se connecter" click.
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEmailVerifyPopupOpen, setIsEmailVerifyPopupOpen] = useState(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDressingRoomOpen, setIsDressingRoomOpen] = useState(false);
  const [isHomeworkPinOpen, setIsHomeworkPinOpen] = useState(false);
  const [isPrintablesOpen, setIsPrintablesOpen] = useState(false);
  const [isHonorCertificatesOpen, setIsHonorCertificatesOpen] = useState(false);
  const [isOfflinePacksOpen, setIsOfflinePacksOpen] = useState(false);

  const openAuth = (mode: 'login' | 'register' = 'login', reason: string | null = null) => {
    setAuthModalInitialMode(mode);
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  return {
    authModalInitialMode,
    authModalReason,
    isAiModalOpen,
    setIsAiModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isEmailVerifyPopupOpen,
    setIsEmailVerifyPopupOpen,
    isMobileSimulatorOpen,
    setIsMobileSimulatorOpen,
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    isTermsModalOpen,
    setIsTermsModalOpen,
    isContactModalOpen,
    setIsContactModalOpen,
    isDressingRoomOpen,
    setIsDressingRoomOpen,
    isHomeworkPinOpen,
    setIsHomeworkPinOpen,
    isPrintablesOpen,
    setIsPrintablesOpen,
    isHonorCertificatesOpen,
    setIsHonorCertificatesOpen,
    isOfflinePacksOpen,
    setIsOfflinePacksOpen,
    openAuth,
  };
}
