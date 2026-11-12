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
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  // Set when the contact modal is opened via a discreet "report an error" trigger elsewhere in the
  // app (an exam corrigé, a grammar rule) — pre-fills the message with exactly which content is
  // being flagged, so ContactMessagesModule doesn't have to guess from a vague description.
  const [contactPrefillMessage, setContactPrefillMessage] = useState<string | null>(null);
  const [isDressingRoomOpen, setIsDressingRoomOpen] = useState(false);
  const [isHomeworkPinOpen, setIsHomeworkPinOpen] = useState(false);
  const [isPrintablesOpen, setIsPrintablesOpen] = useState(false);
  const [isHonorCertificatesOpen, setIsHonorCertificatesOpen] = useState(false);
  const [isOfflinePacksOpen, setIsOfflinePacksOpen] = useState(false);
  const [isParentNotebookOpen, setIsParentNotebookOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  const openAuth = (mode: 'login' | 'register' = 'login', reason: string | null = null) => {
    setAuthModalInitialMode(mode);
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  /** Opens the contact form pre-filled to report an error on a specific piece of content
   * (an exam corrigé, a grammar rule) — contextLabel identifies exactly what's being flagged. */
  const openErrorReport = (contextLabel: string) => {
    setContactPrefillMessage(`⚠️ خطأ في: ${contextLabel}\n\nوصف الخطأ:\n`);
    setIsContactModalOpen(true);
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
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    isTermsModalOpen,
    setIsTermsModalOpen,
    isContactModalOpen,
    setIsContactModalOpen,
    contactPrefillMessage,
    setContactPrefillMessage,
    openErrorReport,
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
    isParentNotebookOpen,
    setIsParentNotebookOpen,
    isDiagnosticOpen,
    setIsDiagnosticOpen,
    openAuth,
  };
}
