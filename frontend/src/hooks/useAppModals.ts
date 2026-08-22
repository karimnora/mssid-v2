import { useState } from 'react';

export function useAppModals() {
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEmailVerifyPopupOpen, setIsEmailVerifyPopupOpen] = useState(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDressingRoomOpen, setIsDressingRoomOpen] = useState(false);
  const [isHomeworkPinOpen, setIsHomeworkPinOpen] = useState(false);
  const [isPrintablesOpen, setIsPrintablesOpen] = useState(false);
  const [isOfflinePacksOpen, setIsOfflinePacksOpen] = useState(false);

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  return {
    authModalInitialMode,
    isAiModalOpen,
    setIsAiModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
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
    isOfflinePacksOpen,
    setIsOfflinePacksOpen,
    openAuth,
  };
}
