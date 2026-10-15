import React from 'react';
import type { LearningSyncStatus } from '../hooks/useLearningSnapshot';
export function LearningSyncNotice({status,onRetry,language}:{status:LearningSyncStatus;onRetry:()=>void;language?:string}) {
 const fr=language==='fr';
 const label=status==='synced' ? (fr?'Résultats synchronisés avec votre compte.':'تمت مزامنة النتائج مع حسابك.') : status==='syncing' ? (fr?'Synchronisation des résultats…':'جارٍ مزامنة النتائج…') : status==='pending' ? (fr?'Résultats sur cet appareil. Synchronisation à réessayer.':'النتائج على هذا الجهاز. أعد محاولة المزامنة.') : (fr?'Résultats conservés sur cet appareil. Connectez-vous pour les synchroniser.':'النتائج محفوظة على هذا الجهاز. سجّل الدخول لمزامنتها.');
 const english=status==='synced'?'Results synchronized with your account.':status==='syncing'?'Synchronizing results…':status==='pending'?'Results saved on this device. Retry synchronization.':'Results kept on this device. Sign in to synchronize.';
 return <div aria-live="polite" className="rounded-2xl border border-emerald-200 bg-white text-slate-800 p-3 text-sm" data-learning-sync={status}>{language==='en'?english:label}{status==='pending'&&<button type="button" className="min-h-12 px-4 font-bold underline" onClick={onRetry}>{language==='en'?'Retry':fr?'Réessayer':'أعيد المحاولة'}</button>}</div>;
}
