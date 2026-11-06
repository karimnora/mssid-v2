import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { stopSpeech } from '../../utils/speech';
import './villageLessonScene.css';

/** One isolated scene for both direct links and the journey, without changing the app theme. */
export function VillageLessonScene({
  children,
}: {
  children: React.ReactNode;
}) {
  const scene = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    // Only the old workspace is suspended. Global alerts and app modals remain live.
    const surfaces = new Map<HTMLElement, { display: string; inert: boolean; aria: string | null }>();
    const suspend = () => {
      document.querySelectorAll<HTMLElement>('[data-legacy-chrome]').forEach(element => {
        if (surfaces.has(element)) return;
        surfaces.set(element, { display: element.style.display, inert: element.inert, aria: element.getAttribute('aria-hidden') });
        element.style.display = 'none';
        element.inert = true;
        element.setAttribute('aria-hidden', 'true');
      });
    };
    const opener = document.activeElement as HTMLElement | null;
    const hadClass = document.body.classList.contains(
      'mssid-village-scene-active'
    );
    stopSpeech();
    scene.current?.focus();
    suspend();
    const observer = new MutationObserver(suspend);
    observer.observe(document.body, { childList: true, subtree: true });
    document.body.classList.add('mssid-village-scene-active');
    return () => {
      stopSpeech();
      observer.disconnect();
      for (const [element, { display, inert, aria }] of surfaces) {
        element.style.display = display;
        element.inert = inert;
        if (aria === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', aria);
      }
      if (!hadClass)
        document.body.classList.remove('mssid-village-scene-active');
      if (opener?.isConnected) opener.focus();
    };
  }, []);
  return createPortal(
    <main
      ref={scene}
      tabIndex={-1}
      dir="rtl"
      lang="ar"
      aria-label="أتعلّم مع ديدو"
      data-village-lesson-scene
      className="village-lesson-scene"
    >
      {children}
    </main>,
    document.body
  );
}
