/** Avatar shown when an account has none. */
export const DEFAULT_AVATAR = '🎓';

/**
 * Avatars are emoji. The server sends the placeholder word « default_avatar » when an account never
 * chose one (UserMapper); a technical word like that must never be displayed to a child.
 */
export function displayAvatar(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_AVATAR;
  const avatar = value.trim();
  if (!avatar || /^[A-Za-z0-9_.-]{3,}$/.test(avatar)) return DEFAULT_AVATAR;
  return avatar;
}
