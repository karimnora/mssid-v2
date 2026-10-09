import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { springBootApi, type CahierAccess } from '../services/springBootApi';
export function isCahierAccess(value: unknown): value is CahierAccess {
  const v = value as CahierAccess | null;
  return Boolean(v && typeof v.premium === 'boolean' && Number.isInteger(v.limit) && v.limit > 0
    && Number.isInteger(v.remaining) && v.remaining >= 0 && v.remaining <= v.limit
    && typeof v.allowed === 'boolean' && typeof v.resetsAt === 'string' && Number.isFinite(Date.parse(v.resetsAt))
    && Array.isArray(v.unlockedIds) && v.unlockedIds.every(id => typeof id === 'string'));
}
const EVENT = 'mssid-cahier-access-changed';
export function useCahierAccess() {
  const { authUser } = useAuth();
  const owner = `${authUser?.id ?? 'guest'}:${authUser?.role ?? ''}`;
  const [state, setState] = useState<{ owner: string; access: CahierAccess | null }>({ owner: '', access: null });
  const access = state.owner === owner ? state.access : null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    setState({ owner, access: null }); setError(false);
    const load = async () => {
      if (!authUser) return;
      setLoading(true);
      try {
        const res = await springBootApi.getCahierAccess();
        if (alive) {
          const valid = !res.error && isCahierAccess(res.data);
          setState({ owner, access: valid ? res.data! : null }); setError(!valid);
        }
      } catch { if (alive) setError(true); }
      finally { if (alive) setLoading(false); }
    };
    void load();
    window.addEventListener(EVENT, load);
    return () => { alive = false; window.removeEventListener(EVENT, load); };
  }, [authUser?.id, authUser?.role]);
  const refresh = useCallback(() => window.dispatchEvent(new Event(EVENT)), []);
  return { authUser, access, loading, error, refresh };
}
