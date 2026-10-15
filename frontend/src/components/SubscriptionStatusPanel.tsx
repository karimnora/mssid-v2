import { ReceiptStatus } from './ReceiptStatus';
import React, {useEffect,useRef,useState} from 'react';
import {useTranslation} from '../hooks/useTranslation';
import {useLocaleContext} from '../context/LocaleContext';
import {AuthService} from '../services/authService';
import {springBootApi} from '../services/springBootApi';
import {mapProfileDtoToAuthUser} from '../context/AuthContext';
import type {AuthUser} from '../types/auth';

export function SubscriptionStatusPanel({user,onClose}:{user:AuthUser|null;onClose:()=>void}) {
 const t=useTranslation('subscription');const {locale,direction}=useLocaleContext();
 const [snapshot,setSnapshot]=useState<{status:string;endDate:string|null}|null>(null);
 const [busy,setBusy]=useState(false);const [error,setError]=useState(false);
 const alive=useRef(true);const dialog=useRef<HTMLDivElement>(null);
 useEffect(()=>{alive.current=true;const previous=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.focus();return()=>{alive.current=false;document.body.style.overflow=overflow;previous?.focus();};},[]);
 const requestId=useRef(0);
 async function refresh(){
  const sequence=++requestId.current;
  const owner=AuthService.getCurrentUser()?.id;if(!owner)return;
  setBusy(true);setError(false);
  try {
   const [status,profile]=await Promise.all([springBootApi.getSubscriptionStatus(),springBootApi.fetchCurrentUser()]);
   if(!alive.current||requestId.current!==sequence||AuthService.getCurrentUser()?.id!==owner)return;
   if(status.error||profile.error||!status.data||!profile.data||profile.data.id!==owner)throw new Error('refresh');
   AuthService.setCurrentUser(mapProfileDtoToAuthUser(profile.data));setSnapshot(status.data);
  }catch{if(alive.current&&requestId.current===sequence)setError(true);}finally{if(alive.current&&requestId.current===sequence)setBusy(false);}
 }
 useEffect(()=>{setSnapshot(null);if(user)void refresh();},[user?.id]);
 const status=snapshot?.status;const label=status==='ACTIVE'?t('subscriptionActive'):status==='EXPIRED'?t('subscriptionExpired'):status==='CANCELLED'?t('subscriptionCancelled'):status==='NONE'?t('subscriptionFree'):t('subscriptionUnknown');
 const date=snapshot?.endDate;const formatted=date?new Intl.DateTimeFormat(locale==='fr'?'fr-DZ':'ar-DZ',{dateStyle:'long',timeZone:'UTC'}).format(new Date(`${date}T00:00:00Z`)):null;
 return <div className="fixed inset-0 z-50 bg-slate-950/70 p-4 flex items-center justify-center overflow-auto">
  <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t('mySubscription')} dir={direction} data-subscription-status className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-md space-y-4" onKeyDown={e=>{
   if(e.key==='Escape'){e.stopPropagation();onClose();}
   if(e.key==='Tab'){const buttons=dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');if(!buttons?.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===dialog.current)){e.preventDefault();first.focus();}}
  }}>
   <h2 className="text-xl font-black">{t('mySubscription')}</h2>
   <p>{t('subscriptionAccessInfo')}</p>
   {!user?<p>{t('subscriptionSignInInfo')}</p>:<>
    <p role="status" aria-live="polite" className="rounded-xl bg-emerald-50 p-3 font-bold">{busy?t('subscriptionLoading'):label}</p>
    {formatted&&<p>{t('subscriptionEndDate')} <strong>{formatted}</strong></p>}
    <ReceiptStatus/>
    {error&&<p role="alert">{t('subscriptionRefreshError')}</p>}
    <button type="button" disabled={busy} onClick={()=>void refresh()} className="min-h-12 px-4 rounded-xl bg-emerald-800 text-white font-bold">{t('subscriptionRefresh')}</button>
   </>}
   <button type="button" onClick={onClose} className="min-h-12 px-4 rounded-xl border border-slate-300 font-bold">{t('subscriptionClose')}</button>
  </div>
 </div>;
}
