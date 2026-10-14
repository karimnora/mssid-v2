import { useCallback, useEffect, useRef } from 'react';

/** Cancel a pending result when the activity is replaced or left. */
export function useDelayedCompletion(activityKey = '') {
  const timer = useRef<number | undefined>(undefined);
  const mounted = useRef(true);
  const currentKey = useRef(activityKey);
  currentKey.current = activityKey;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(timer.current);
    };
  }, [activityKey]);
  return useCallback((complete: () => void, delay: number) => {
    if (!mounted.current || currentKey.current !== activityKey) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (mounted.current && currentKey.current === activityKey) complete();
    }, delay);
  }, [activityKey]);
}
