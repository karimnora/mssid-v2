import { describe, expect, it } from 'vitest';
import { androidUpdateKind } from './androidUpdate';

describe('androidUpdateKind', () => {
  it('stays quiet when the installed build is current', () => {
    expect(androidUpdateKind(8, { latestVersionCode: 8, minVersionCode: 0 })).toBe('none');
  });

  it('offers a skippable update when Play is ahead', () => {
    expect(androidUpdateKind(8, { latestVersionCode: 9, minVersionCode: 0 })).toBe('optional');
  });

  it('requires an update only when minVersionCode is above the installed build', () => {
    expect(androidUpdateKind(8, { latestVersionCode: 10, minVersionCode: 9 })).toBe('required');
  });

  it('ignores a missing or broken payload', () => {
    expect(androidUpdateKind(8, null)).toBe('none');
    expect(androidUpdateKind(0, { latestVersionCode: 9, minVersionCode: 0 })).toBe('none');
  });
});
