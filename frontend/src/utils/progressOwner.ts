export const GUEST_PROGRESS_OWNER = 'guest';

let activeOwnerId = GUEST_PROGRESS_OWNER;
const listeners = new Set<() => void>();
export function subscribeProgressOwner(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function progressOwnerId(userId?: number | null): string {
  return userId == null ? GUEST_PROGRESS_OWNER : `user:${userId}`;
}

export function getActiveProgressOwner(): string {
  return activeOwnerId;
}

/** Call on login/logout so quiz rewards and resume targets follow the person on the device. */
export function setActiveProgressOwner(userId?: number | null, childId?: number | null): void {
  const next = progressOwnerId(userId) + (childId == null ? '' : `:child:${childId}`);
  if (next === activeOwnerId) return;
  activeOwnerId = next;
  listeners.forEach((listener) => listener());
}

export function isProgressOwnerKey(key: string): boolean {
  return key === GUEST_PROGRESS_OWNER || key.startsWith('guest:child:') || key.startsWith('user:');
}
