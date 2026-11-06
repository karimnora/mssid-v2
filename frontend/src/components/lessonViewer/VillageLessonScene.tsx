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
    const surfaces = Array.from(document.querySelectorAll<HTMLElement>(
      '[data-app-header], [data-bottom-nav], [data-village-legacy-content], [data-village-legacy-footer], .journey-root'
    )).map(element => ({
      element,
      display: element.style.display,
      inert: element.inert,
      aria: element.getAttribute('aria-hidden'),
    }));
    const opener = document.activeElement as HTMLElement | null;
    const hadClass = document.body.classList.contains(
      'mssid-village-scene-active'
    );
    stopSpeech();
    scene.current?.focus();
    for (const { element } of surfaces) {
      element.style.display = 'none';
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.add('mssid-village-scene-active');
    return () => {
      stopSpeech();
      for (const { element, display, inert, aria } of surfaces) {
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
