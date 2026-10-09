import React,{useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {useAuth} from '../context/AuthContext';
import {canUseWebCheckout} from '../utils/paymentPlatform';
import {SubscriptionStatusPanel} from './SubscriptionStatusPanel';
export const OPEN_SUBSCRIPTION_STATUS='mssid:open-subscription-status';
// Lives above premium-gated content so granting access cannot dismiss the confirmation.
export function NativeSubscriptionStatus(){
 const {authUser}=useAuth();const [open,setOpen]=useState(false);
 useEffect(()=>{const show=()=>{if(!canUseWebCheckout())setOpen(true);};window.addEventListener(OPEN_SUBSCRIPTION_STATUS,show);return()=>window.removeEventListener(OPEN_SUBSCRIPTION_STATUS,show);},[]);
 return open&&!canUseWebCheckout()?createPortal(<div className="relative z-[100]"><SubscriptionStatusPanel user={authUser} onClose={()=>setOpen(false)}/></div>,document.body):null;
}
