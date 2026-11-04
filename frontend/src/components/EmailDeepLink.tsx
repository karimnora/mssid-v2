import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ParentGateModal } from './ParentGateModal';
import { SubscriptionPaywall } from './SubscriptionPaywall';
import { OPEN_SUBSCRIPTION_STATUS } from './NativeSubscriptionStatus';
import { canUseWebCheckout } from '../utils/paymentPlatform';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';

export type EmailDeepLinkTarget = 'parent-notebook' | 'offer';

export function readEmailDeepLink(search: string): EmailDeepLinkTarget | null {
  const open = new URLSearchParams(search).get('open');
  return open === 'parent-notebook' || open === 'offer' ? open : null;
}

/**
 * Links of the weekly report e-mail (`/?open=parent-notebook`, `/?open=offer`, see backend
 * WeeklyReportService). Both go through the Parent Gate, then open the notebook or the web offer.
 * The parameter is removed from the address so a reload or a shared link does not reopen it.
 */
export const EmailDeepLink: React.FC<{ onOpenNotebook: () => void }> = ({ onOpenNotebook }) => {
  const { authUser } = useAuth();
  const [target] = useState<EmailDeepLinkTarget | null>(() => (typeof window === 'undefined' ? null : readEmailDeepLink(window.location.search)));
  const [gate, setGate] = useState(Boolean(target));
  const [offer, setOffer] = useState(false);

  useEffect(() => {
    if (!target) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('open');
      window.history.replaceState(window.history.state, '', url.toString());
    } catch {
      /* old WebView: harmless if the parameter stays */
    }
  }, [target]);

  if (!target) return null;
  return (
    <>
      {gate && createPortal(
        <div className="relative z-[90]">
          <ParentGateModal
            isOpen
            onClose={() => setGate(false)}
            onVerified={() => {
              setGate(false);
              if (target === 'parent-notebook') onOpenNotebook();
              else if (canUseWebCheckout()) setOffer(true);
              else window.dispatchEvent(new Event(OPEN_SUBSCRIPTION_STATUS));
            }}
          />
        </div>,
        document.body,
      )}
      {offer && createPortal(
        <div className="relative z-[75]">
          <SubscriptionPaywall parentVerified user={authUser} onClose={() => setOffer(false)} onSuccessUpgrade={(user) => { AuthService.setCurrentUser(user); setOffer(false); }} />
        </div>,
        document.body,
      )}
    </>
  );
};
