import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X } from 'lucide-react';
import { motion } from 'motion/react';
import type { CompetenceCahier } from '../../data/cahiers/competenceCahiers';
import { useTranslation } from '../../hooks/useTranslation';

import { useCahierAccess } from '../../hooks/useCahierAccess';
import { springBootApi } from '../../services/springBootApi';
import { PremiumOffer } from '../PremiumOffer';
import { CahierQuotaNotice } from './CahierQuotaNotice';

interface CompetenceCahierSheetProps {
  cahier: CompetenceCahier;
  onClose: () => void;
}

const UnlockedCahierSheet: React.FC<CompetenceCahierSheetProps> = ({ cahier, onClose }) => {
  const t = useTranslation('labsImmersive');
  const [side, setSide] = useState<'front' | 'verso'>('front');

  const print = () => {
    setTimeout(() => window.print(), 50);
  };

  return createPortal(
    <div className="sheet-print-modal fixed inset-0 z-[70] bg-black/40 flex items-start justify-center overflow-auto p-3 sm:p-6">
      <div className="w-full max-w-[210mm] space-y-3">
        <div className="no-print flex flex-wrap items-center gap-2 justify-between bg-white rounded-2xl border-2 border-[#E7E2D7] p-3">
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSide('front')}
              className={`hit-target px-4 rounded-2xl text-sm font-extrabold cursor-pointer ${
                side === 'front' ? 'bg-[#008751] text-white' : 'bg-white border-2 border-[#E7E2D7]'
              }`}
            >
              {t('cahierFront')}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSide('verso')}
              className={`hit-target px-4 rounded-2xl text-sm font-extrabold cursor-pointer ${
                side === 'verso' ? 'bg-[#008751] text-white' : 'bg-white border-2 border-[#E7E2D7]'
              }`}
            >
              {t('cahierVerso')}
            </motion.button>
          </div>
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={print}
              className="hit-target px-4 rounded-2xl bg-[#008751] text-white text-sm font-extrabold cursor-pointer inline-flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" aria-hidden />
              {t('cahierPrint')}
            </motion.button>
            <p className="text-[11px] font-bold text-[var(--kids-muted)] max-w-[16rem]">{t('cahierPrintHint')}</p>
            <button type="button" onClick={onClose} className="kids-close cursor-pointer" aria-label={t('backAria')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <article
          dir="rtl"
          data-print-mode={side === 'verso' ? 'corrige' : 'subject'}
          className="printable-sheet bg-white max-w-[210mm] mx-auto p-6 sm:p-8 border border-[#E7E2D7] text-[#0f172a] space-y-5"
        >
          <header className="border-b-2 border-[#008751] pb-3 space-y-1 print-identity">
            <p className="text-xs font-extrabold text-[#008751]">مَسِيد DZ — كُرَّاسُ الكَفَاءَةِ</p>
            <p className="text-[11px] font-bold text-slate-500">{cahier.domainAr} · {cahier.grade}</p>
            <h1 className="text-lg font-extrabold leading-tight">{cahier.titleAr}</h1>
            <p className="text-xs font-bold">الاسم: …………………… الأَبُ / الأُمُّ: …………………… التاريخ: …… / …… / ……</p>
          </header>

          {side === 'front' ? (
            <ol className="space-y-5 list-decimal pr-5">
              {cahier.exercises.map((exercise, index) => (
                <li key={index} className="space-y-2">
                  <p className="text-[15px] font-bold leading-relaxed">{exercise.promptAr}</p>
                  {exercise.figure === 'square-circle' && (
                    <div data-cahier-figure="square-circle" className="w-28 h-28 border-2 border-[#0f172a] rounded-sm mx-auto" />
                  )}
                  {exercise.figure === 'two-dots' && (
                    <div data-cahier-figure="two-dots" className="flex items-center justify-between px-8 py-4">
                      <span className="w-3 h-3 rounded-full bg-[#0f172a]" />
                      <span className="w-3 h-3 rounded-full bg-[#0f172a]" />
                    </div>
                  )}
                  {exercise.figure === 'stars-5' && (
                    <div data-cahier-figure="stars-5" className="flex gap-2 justify-center py-2 text-xl" aria-hidden>
                      {'☆☆☆☆☆'}
                    </div>
                  )}
                  <div className="print-answer-lines space-y-2">
                    {Array.from({ length: exercise.lines }, (_, line) => (
                      <div key={line} className="border-b border-slate-300 h-7" />
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="print-corrige space-y-4">
              <p className="text-xs font-extrabold text-[#008751]">{t('cahierVerso')}</p>
              <ol className="space-y-3 list-decimal pr-5">
                {cahier.versoAr.map((line, index) => (
                  <li key={index} className="print-corrige-box text-[15px] font-bold leading-relaxed bg-[#FFF8E7] rounded-2xl p-3">
                    {line}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </article>
      </div>
    </div>,
    document.body,
  );
};

// One entry point for the lab, the parent notebook and the CEM parcours.
export const CompetenceCahierSheet: React.FC<CompetenceCahierSheetProps> = props => {
  const t = useTranslation('subscription');
  const { authUser, access, loading, error, refresh } = useCahierAccess();
  const documentOwner = `${authUser?.id ?? 'guest'}:${props.cahier.competenceId}`;
  const [unlockedOwner, setUnlockedOwner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);
  const identity = useRef({ userId: authUser?.id, documentId: props.cahier.competenceId });
  identity.current = { userId: authUser?.id, documentId: props.cahier.competenceId };
  useEffect(() => { setUnlockedOwner(null); setFailed(false); }, [authUser?.id, authUser?.role, props.cahier.competenceId]);
  const canRead = Boolean(authUser && (unlockedOwner === documentOwner || access?.premium || access?.unlockedIds.includes(props.cahier.competenceId)));
  const unlock = async () => {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setFailed(false);
    const requestIdentity = identity.current;
    try {
      const res = await springBootApi.unlockCahier(props.cahier.competenceId);
      if (identity.current.userId !== requestIdentity.userId || identity.current.documentId !== requestIdentity.documentId) return;
      if (res.data?.allowed && !res.error) setUnlockedOwner(documentOwner);
      else if (res.status !== 429) setFailed(true);
      refresh();
    } catch { setFailed(true); }
    finally { setBusy(false); inFlight.current = false; }
  };
  if (canRead) return <RemoteCahierSheet key={documentOwner} {...props}/>;
  return createPortal(<div className="fixed inset-0 z-[70] bg-black/40 overflow-auto p-4 flex items-start justify-center">
    <section role="dialog" aria-modal="true" aria-label={props.cahier.titleAr} className="bg-white rounded-3xl p-5 max-w-xl w-full space-y-4 text-[#0f172a]">
      <h2 className="text-lg font-extrabold">{props.cahier.titleAr}</h2>
      <p>{t('cahierPreview')}</p>
      <p dir="rtl" className="rounded-2xl bg-[#FFF8E7] p-4 font-bold">{props.cahier.exercises[0]?.promptAr}</p>
      {access && <CahierQuotaNotice access={access} />}
      {!authUser ? <p>{t('cahierLogin')}</p> : loading ? <p>{t('cahierChecking')}</p> : (error || failed) ? <>
        <p role="alert">{t('cahierUnavailable')}</p><button type="button" className="hit-target" onClick={()=>{setFailed(false);refresh();}}>{t('cahierRetry')}</button>
      </> : access && access.remaining > 0 ? <button type="button" disabled={busy} onClick={unlock} className="hit-target rounded-2xl bg-[#008751] text-white px-4 font-bold disabled:opacity-50">{busy ? t('cahierChecking') : t('cahierUnlock')}</button> : access ? <>
        <p>{t('cahierLimit')}</p><PremiumOffer />
      </> : null}
      <button type="button" onClick={props.onClose} className="hit-target block font-bold">{t('continueFree')}</button>
    </section>
  </div>, document.body);
};

function RemoteCahierSheet(props:CompetenceCahierSheetProps) {
 const t=useTranslation('subscription');const {authUser}=useCahierAccess();
 const [document,setDocument]=useState<CompetenceCahier|null>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{let alive=true;setDocument(null);setError(false);void springBootApi.getCahierContent(props.cahier.competenceId).then(res=>{if(!alive)return;const d=res.data;if(res.error||!d||d.competenceId!==props.cahier.competenceId||!Array.isArray(d.exercises)||d.exercises.length<2||!Array.isArray(d.versoAr))setError(true);else setDocument(d);}).catch(()=>{if(alive)setError(true);});return()=>{alive=false;};},[authUser?.id,props.cahier.competenceId,retry]);
 if(document)return <UnlockedCahierSheet cahier={document} onClose={props.onClose}/>;
 return createPortal(<div className="fixed inset-0 z-[70] bg-black/40 p-4 overflow-auto"><section role="dialog" aria-modal="true" aria-label={props.cahier.titleAr} className="bg-white text-slate-900 p-5 rounded-2xl max-w-xl mx-auto space-y-3"><p role={error?'alert':'status'}>{error?t('cahierUnavailable'):t('cahierChecking')}</p>{error&&<button className="hit-target px-4" onClick={()=>setRetry(n=>n+1)}>{t('cahierRetry')}</button>}<button className="hit-target px-4" onClick={props.onClose}>{t('continueFree')}</button></section></div>,window.document.body);
}
