import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  profileStorageKey,
  persistChildSelection,
  readChildSelection,
  clearChildSelection,
  primaryGradeForChild,
  ACTIVE_CHILD_KEY,
  GUEST_PROFILE_KEY,
} from './childProfileStorage';

describe('childProfileStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('namespaces progress keys per child and keeps the guest key for account mode', () => {
    expect(profileStorageKey(null)).toBe(GUEST_PROFILE_KEY);
    expect(profileStorageKey(12)).toBe('mssid_user_profile_child_12');
  });

  it('round-trips child and account selections', () => {
    persistChildSelection({ type: 'child', id: 4 });
    expect(readChildSelection()).toEqual({ type: 'child', id: 4 });
    expect(localStorage.getItem(ACTIVE_CHILD_KEY)).toBe('4');

    persistChildSelection({ type: 'account' });
    expect(readChildSelection()).toEqual({ type: 'account' });

    clearChildSelection();
    expect(readChildSelection()).toBeNull();
  });

  it('maps PRESCHOOL to 1AP for the primary grade field', () => {
    expect(primaryGradeForChild('PRESCHOOL')).toBe('1AP');
    expect(primaryGradeForChild('3AP')).toBe('3AP');
  });
});
