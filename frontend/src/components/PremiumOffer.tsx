import type { PrimaryGrade } from '../types';
import { recordPremiumEvent } from '../utils/premiumFunnel';
import { OPEN_SUBSCRIPTION_STATUS } from './NativeSubscriptionStatus';
import { canUseWebCheckout } from '../utils/paymentPlatform';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { SubscriptionPaywall } from './SubscriptionPaywall';
import { ParentGateModal } from './ParentGateModal';
import { AuthService } from '../services/authService';

export function PremiumOffer({ label, grade }: { label?: string; grade?: PrimaryGrade } = {}) {
  const { authUser } = useAuth();
  const t = useTranslation('subscription');
  const [gate, setGate] = useState(false);
  const [offer, setOffer] = useState(false);
  return <>
    <button type="button" data-premium-offer-entry onClick={() => { recordPremiumEvent('parent_interest', grade); setGate(true); }} className="hit-target rounded-2xl px-4 py-2 bg-[#008751] text-white font-extrabold">
      {label ?? t(canUseWebCheckout() ? 'discoverPremium' : 'mySubscription')}
    </button>
    {gate && createPortal(<div className="relative z-[90]"><ParentGateModal isOpen onClose={() => setGate(false)} onVerified={() => { setGate(false); if(canUseWebCheckout())setOffer(true);else window.dispatchEvent(new Event(OPEN_SUBSCRIPTION_STATUS)); }} /></div>, document.body)}
    {offer && createPortal(<div className="relative z-[75]"><SubscriptionPaywall grade={grade} parentVerified user={authUser} onClose={() => setOffer(false)} onSuccessUpgrade={user => { AuthService.setCurrentUser(user); setOffer(false); }} /></div>, document.body)}
  </>;
}

