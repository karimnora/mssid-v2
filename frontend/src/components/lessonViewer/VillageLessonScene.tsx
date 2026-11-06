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
    const root = document.getElementById('root');
    const oldDisplay = root?.style.display ?? '';
    const oldInert = root?.inert ?? false;
    const oldAria = root?.getAttribute('aria-hidden');
    const opener = document.activeElement as HTMLElement | null;
    const hadClass = document.body.classList.contains(
      'mssid-village-scene-active'
    );
    stopSpeech();
    scene.current?.focus();
    if (root) {
      root.style.display = 'none';
      root.inert = true;
      root.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.add('mssid-village-scene-active');
    return () => {
      stopSpeech();
      if (root) {
        root.style.display = oldDisplay;
        root.inert = oldInert;
        if (oldAria === null || oldAria === undefined)
          root.removeAttribute('aria-hidden');
        else root.setAttribute('aria-hidden', oldAria);
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
