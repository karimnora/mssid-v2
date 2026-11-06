import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
function subscribe(listener: () => void) {
 if (typeof window === 'undefined') return () => {};
 const media = window.matchMedia(query);
 media.addEventListener('change', listener);
 return () => media.removeEventListener('change', listener);
}
const snapshot = () => typeof window === 'undefined' || window.matchMedia(query).matches;
/** Responds immediately when the OS preference changes, including during an activity. */
export function useMotionPreference() {
 return useSyncExternalStore(subscribe, snapshot, () => true);
}
