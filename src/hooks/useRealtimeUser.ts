import { useState, useEffect } from 'react';
import { AuthUser } from '../types/auth';
import { AuthService } from '../services/authService';

export function useRealtimeUser(initialUser: AuthUser | null) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<{ type: string; timestamp: Date } | null>(null);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    // Initial fetch from server to get accurate live data on mount
    const fetchLatest = async () => {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser?.email) {
        try {
          const res = await fetch(`/api/v1/users/live-sync?email=${encodeURIComponent(currentUser.email)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              const merged: AuthUser = {
                ...currentUser,
                ...data.user,
                score: data.user.score ?? currentUser.score,
                xp: data.user.xp ?? currentUser.xp,
                level: data.user.level ?? currentUser.level,
                role: data.user.role ?? currentUser.role,
                nom: data.user.nom ?? currentUser.nom,
              };
              AuthService.setCurrentUser(merged);
              setUser(merged);
            }
          }
        } catch {
          // ignore network failure
        }
      }
    };

    fetchLatest();

    // Subscribe to SSE real-time stream
    const unsubscribe = AuthService.subscribeToRealtimeUser((updatedUser, eventType) => {
      setUser(updatedUser);
      setIsLiveConnected(true);
      if (eventType) {
        setLastEvent({ type: eventType, timestamp: new Date() });
      }
    });

    // Check live connection state periodically
    const statusInterval = setInterval(() => {
      setIsLiveConnected(AuthService.isLiveConnected());
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, []);

  return {
    user,
    setUser,
    isLiveConnected,
    lastEvent,
  };
}
