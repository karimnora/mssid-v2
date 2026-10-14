import React, { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { registerPlugin } from '@capacitor/core';
import { getStoredLocale } from '../localePreference';

type Language = 'ar' | 'fr' | 'en';
type ExitGuard = {
  requestLeave: (action: () => void) => void;
  hasPendingWork: () => boolean;
  register: (id: string, language: Language) => void;
  unregister: (id: string) => void;
};
const passThrough: ExitGuard = {
  requestLeave: action => action(), hasPendingWork: () => false,
  register: () => {}, unregister: () => {},
};
const Context = createContext<ExitGuard>(passThrough);
const NativeNavigation = registerPlugin<{ back: () => Promise<void> }>('Navigation');

const copy = {
  ar: { title: 'هل تريد الخروج؟', message: 'نشاطك لم ينتهِ بعد. إذا خرجت الآن، قد تحتاج إلى البدء من جديد.', stay: 'متابعة', leave: 'خروج' },
  fr: { title: 'Quitter cette activité ?', message: 'Ton activité n’est pas terminée. Si tu quittes maintenant, tu pourrais devoir recommencer.', stay: 'Continuer', leave: 'Quitter' },
  en: { title: 'Leave this activity?', message: 'Your activity is not finished. If you leave now, you may need to start again.', stay: 'Continue', leave: 'Leave' },
};

export function ActivityExitProvider({ children }: React.PropsWithChildren) {
  const sessions = useRef(new Map<string, Language>());
  const pending = useRef<(() => void) | null>(null);
  const allowing = useRef(false);
  const [language, setLanguage] = useState<Language | null>(null);
  const stayButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const messageId = useId();
  const cancel = useCallback(() => {
    pending.current = null;
    setLanguage(null);
    returnFocus.current?.focus();
  }, []);
  const requestLeave = useCallback((action: () => void) => {
    if (allowing.current || sessions.current.size === 0) { action(); return; }
    if (pending.current) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    pending.current = action;
    setLanguage([...sessions.current.values()].at(-1) ?? 'ar');
  }, []);
  const guard = useMemo<ExitGuard>(() => ({
    requestLeave,
    hasPendingWork: () => sessions.current.size > 0 && !allowing.current,
    register: (id, lang) => { sessions.current.set(id, lang); },
    unregister: id => {
      sessions.current.delete(id);
      if (pending.current && sessions.current.size === 0) cancel();
    },
  }), [requestLeave, cancel]);

  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => {
      if (!guard.hasPendingWork()) return;
      event.preventDefault(); event.returnValue = '';
    };
    const nativeBack = (event: Event) => {
      if (pending.current) { event.preventDefault(); cancel(); return; }
      if (!guard.hasPendingWork()) return;
      event.preventDefault();
      requestLeave(() => {
        window.dispatchEvent(new Event('mssid:allow-history-once'));
        void NativeNavigation.back();
      });
    };
    window.addEventListener('beforeunload', unload);
    window.addEventListener('mssid:native-back', nativeBack);
    return () => {
      window.removeEventListener('beforeunload', unload);
      window.removeEventListener('mssid:native-back', nativeBack);
    };
  }, [guard, cancel, requestLeave]);

  useEffect(() => {
    if (!language) return;
    stayButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); cancel(); }
      if (event.key !== 'Tab') return;
      const buttons = dialog.current?.querySelectorAll<HTMLButtonElement>('button');
      if (!buttons?.length) return;
      const first = buttons[0]; const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keyboard); };
  }, [language, cancel]);

  const confirm = () => {
    const action = pending.current;
    pending.current = null; setLanguage(null);
    allowing.current = true;
    try { action?.(); } finally { allowing.current = false; }
  };
  const text = language ? copy[language] : null;
  return <Context.Provider value={guard}>
    {children}
    {text && createPortal(
      <div className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden"
        onClick={event => { if (event.target === event.currentTarget) cancel(); }}>
        <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId}
          dir={language === 'ar' ? 'rtl' : 'ltr'} className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center text-slate-900">
          <div aria-hidden="true" className="text-5xl mb-3">🦊</div>
          <h2 id={titleId} className="font-black text-xl">{text.title}</h2>
          <p id={messageId} className="mt-3 text-slate-600 leading-relaxed">{text.message}</p>
          <div className="mt-6 flex flex-col gap-3">
            <button ref={stayButton} type="button" onClick={cancel} className="min-h-14 rounded-2xl bg-emerald-700 text-white font-black cursor-pointer focus-visible:outline-4 focus-visible:outline-amber-400">{text.stay}</button>
            <button type="button" onClick={confirm} className="min-h-12 rounded-2xl border-2 border-slate-300 font-bold cursor-pointer focus-visible:outline-4 focus-visible:outline-amber-400">{text.leave}</button>
          </div>
        </div>
      </div>, document.body)}
  </Context.Provider>;
}

export const useActivityExit = () => useContext(Context);

/** Only activities with unfinished work register; catalogues and reading screens stay unguarded. */
export function useActivityExitGuard(active: boolean, language?: Language) {
  const guard = useActivityExit();
  const id = useId();
  const locale = language ?? getStoredLocale();
  useLayoutEffect(() => {
    if (active) guard.register(id, locale);
    return () => guard.unregister(id);
  }, [active, locale, guard, id]);
  return guard.requestLeave;
}
