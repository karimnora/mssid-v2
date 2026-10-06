export const GUEST_PROGRESS_OWNER = 'guest';

let activeOwnerId = GUEST_PROGRESS_OWNER;

export function progressOwnerId(userId?: number | null): string {
  return userId == null ? GUEST_PROGRESS_OWNER : `user:${userId}`;
}

export function getActiveProgressOwner(): string {
  return activeOwnerId;
}

/** Call on login/logout so quiz rewards and resume targets follow the person on the device. */
export function setActiveProgressOwner(userId?: number | null): void {
  activeOwnerId = progressOwnerId(userId);
}

export function isProgressOwnerKey(key: string): boolean {
  return key === GUEST_PROGRESS_OWNER || key.startsWith('user:');
}
