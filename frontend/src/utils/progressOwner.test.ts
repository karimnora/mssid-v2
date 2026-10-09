import { afterEach, describe, expect, it } from 'vitest';
import { getActiveProgressOwner, isProgressOwnerKey, setActiveProgressOwner } from './progressOwner';
afterEach(() => setActiveProgressOwner(null));
describe('child progress ownership after V1 rebase', () => {
  it('separates siblings and the parent account', () => {
    setActiveProgressOwner(7, 1); const first = getActiveProgressOwner();
    setActiveProgressOwner(7, 2); const second = getActiveProgressOwner();
    setActiveProgressOwner(7); const account = getActiveProgressOwner();
    expect(first).not.toBe(second); expect(first).not.toBe(account);
    expect(isProgressOwnerKey(first)).toBe(true); expect(account).toBe('user:7');
  });
  it('separates children even without a logged-in account', () => {
    setActiveProgressOwner(null, 1); expect(getActiveProgressOwner()).toBe('guest:child:1');
    expect(isProgressOwnerKey(getActiveProgressOwner())).toBe(true);
  });
});
