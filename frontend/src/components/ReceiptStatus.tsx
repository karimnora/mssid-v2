import React,{useEffect,useState} from 'react';
import {useLocaleContext} from '../context/LocaleContext';
import {useAuth} from '../context/AuthContext';
import {springBootApi} from '../services/springBootApi';
export function ReceiptStatus() {
 const {authUser}=useAuth();const {locale}=useLocaleContext();const fr=locale==='fr';
 const [state,setState]=useState<{owner:number;data:Awaited<ReturnType<typeof springBootApi.getReceiptStatus>>['data']}|null>(null),[error,setError]=useState(false),[revision,setRevision]=useState(0),[busy,setBusy]=useState(false);
 useEffect(()=>{let alive=true;setState(null);setError(false);if(!authUser)return;setBusy(true);void springBootApi.getReceiptStatus().then(res=>{if(alive){if(res.error||!res.data||!['NONE','PENDING_VERIFICATION','APPROVED','REJECTED'].includes(res.data.status))setError(true);else setState({owner:authUser.id,data:res.data});}}).catch(()=>{if(alive)setError(true);}).finally(()=>{if(alive)setBusy(false);});return()=>{alive=false;};},[authUser?.id,revision]);
 if(!authUser)return null;
 const data=state?.owner===authUser.id?state.data:undefined;
 const label=data?.status==='PENDING_VERIFICATION'?(fr?'Reçu enregistré — vérification manuelle en attente. Votre abonnement sera activé après validation.':'تم استلام الوصل — في انتظار التحقق اليدوي. يُفعّل الاشتراك بعد الموافقة.'):data?.status==='APPROVED'?(fr?'Dernier reçu validé. Consultez les dates de votre abonnement.':'تم قبول آخر وصل. راجع تواريخ اشتراكك.'):data?.status==='REJECTED'?(fr?'Dernier reçu refusé.':'تم رفض آخر وصل.'):(fr?'Aucun reçu enregistré.':'لا يوجد وصل مسجل.');
 return <section data-receipt-status className="rounded-2xl border p-3 space-y-2 text-sm"><h3 className="font-bold">{fr?'Suivi de votre reçu':'متابعة الوصل'}</h3><p aria-live="polite">{busy?(fr?'Chargement…':'جارٍ التحميل…'):error?(fr?'Impossible de vérifier le reçu. Réessayez avant un nouvel envoi.':'تعذر التحقق من الوصل. أعد المحاولة قبل إرسال وصل جديد.'):label}</p>{data?.rejectionReason&&<p>{data.rejectionReason}</p>}{data?.durationMonths&&<p>{data.durationMonths} {fr?'mois':'أشهر'}</p>}<p>{fr?'Le dépôt du reçu ne déclenche aucun prélèvement automatique. Aucun délai d’activation garanti n’est annoncé pendant la bêta.':'إيداع الوصل لا يفعّل اقتطاعاً تلقائياً. خلال التجربة لا نعلن مهلة تفعيل مضمونة.'}</p><button type="button" disabled={busy} className="min-h-12 px-4 border rounded-xl font-bold" onClick={()=>setRevision(n=>n+1)}>{fr?'Actualiser le reçu':'تحديث الوصل'}</button></section>;
}
