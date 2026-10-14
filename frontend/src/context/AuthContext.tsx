import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { AuthUser } from '../types/auth';
import { mapAuthProfile } from '../services/authProfile';
import { retryPendingProgress } from '../services/progressSync';
import { AuthService } from '../services/authService';
import { springBootApi } from '../services/springBootApi';
import { hydrateFromServerOverrides, FeatureFlagName } from '../featureFlags';

export interface AuthContextValue {
  authUser: AuthUser | null;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ authUser: null, isAuthLoading: true });

// SEC-05: single source of truth for "who is logged in". No localStorage involved anywhere in this
// file — identity lives in memory only (AuthService's pub/sub singleton, see authService.ts) and is
// (re)hydrated from the HttpOnly-cookie-authenticated GET /api/v1/users/me on every app boot. A 401
// there just means "not logged in", which is the correct, safe default (never trust a stale cache).
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authUser = useSyncExternalStore(AuthService.subscribe, AuthService.getCurrentUser);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    springBootApi
      .fetchCurrentUser()
      .then((res) => {
        if (cancelled) return;
        if (res.data && !res.error) {
          AuthService.hydrateCurrentUser(mapAuthProfile(res.data));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsAuthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const retry = () => { void retryPendingProgress(); };
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, []);

  // Feature-flag hydration: runs once for EVERY visitor (not just admins) so an admin's toggle
  // (persisted server-side via PUT /api/v1/admin/feature-flags/{key}) reaches every browser/device on
  // its next load. Public endpoint, no auth required. Must never block app boot — on any failure the
  // app just keeps running on local defaults/localStorage overrides, same as before this existed.
  useEffect(() => {
    springBootApi
      .getFeatureFlagsPublic()
      .then((res) => {
        if (res.data && !res.error) {
          hydrateFromServerOverrides(res.data as Partial<Record<FeatureFlagName, boolean>>);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => useContext(AuthContext);
