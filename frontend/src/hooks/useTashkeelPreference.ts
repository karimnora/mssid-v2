import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mssid_tashkeel_enabled';

export const useTashkeelPreference = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  }, [enabled]);

  return { enabled, setEnabled };
};
