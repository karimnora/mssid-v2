import { useCallback, useSyncExternalStore } from 'react';

/**
 * The family's choice between the « monde de jeu » design (Didou's planet home for Premium, night
 * sky on the child screens) and the classic cream interface. Kept on the device and changeable at
 * any time: the planet's back button and the switch on the home (DesignModeSwitch). The admin flag
 * `worldDesign` still decides whether the world design exists at all.
 */
export type DesignMode = 'world' | 'classic';

const KEY = 'mssid_design_mode';
const EVENT = 'mssid-design-mode-changed';

export function readDesignMode(): DesignMode {
  try {
    return window.localStorage.getItem(KEY) === 'classic' ? 'classic' : 'world';
  } catch {
    return 'world';
  }
}

export function writeDesignMode(mode: DesignMode): void {
  try {
    window.localStorage.setItem(KEY, mode);
  } catch {
    /* private mode: the choice lasts until the page reloads */
    memory = mode;
  }
  window.dispatchEvent(new Event(EVENT));
}

let memory: DesignMode | null = null;

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

const snapshot = () => memory ?? readDesignMode();

export function useDesignMode(): [DesignMode, (mode: DesignMode) => void] {
  const mode = useSyncExternalStore(subscribe, snapshot, () => 'world' as DesignMode);
  const set = useCallback((next: DesignMode) => writeDesignMode(next), []);
  return [mode, set];
}
