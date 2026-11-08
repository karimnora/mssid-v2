import { useSyncExternalStore } from 'react';
import { getActiveProgressOwner, subscribeProgressOwner } from './progressOwner';

export function useProgressOwner() {
  return useSyncExternalStore(subscribeProgressOwner, getActiveProgressOwner, () => 'guest');
}
/** Legacy keys deliberately remain untouched: their owner cannot be inferred. */
export function ownerStorageKey(key: string, owner = getActiveProgressOwner()): string {
  return `${key}:${owner}`;
}
export function progressStorage(owner = getActiveProgressOwner()) {
  return {
    getItem: (key: string) => localStorage.getItem(ownerStorageKey(key, owner)),
    setItem: (key: string, value: string) => localStorage.setItem(ownerStorageKey(key, owner), value),
    removeItem: (key: string) => localStorage.removeItem(ownerStorageKey(key, owner)),
  };
}
