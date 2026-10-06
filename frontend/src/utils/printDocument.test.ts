import { beforeEach, describe, expect, it, vi } from 'vitest';

const nativeState = vi.hoisted(() => ({
  isNative: false,
  platform: 'web',
  print: vi.fn().mockResolvedValue(undefined),
  printHtml: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => nativeState.isNative,
    getPlatform: () => nativeState.platform,
  },
  registerPlugin: () => ({
    print: nativeState.print,
    printHtml: nativeState.printHtml,
  }),
}));

import { printDocument } from './printDocument';

describe('printDocument', () => {
  beforeEach(() => {
    nativeState.isNative = false;
    nativeState.platform = 'web';
    nativeState.print.mockClear();
    nativeState.printHtml.mockClear();
  });

  it('uses window.print on web', async () => {
    const spy = vi.spyOn(window, 'print').mockImplementation(() => {});
    await printDocument();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(nativeState.print).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('uses the native Android print plugin', async () => {
    nativeState.isNative = true;
    nativeState.platform = 'android';
    const spy = vi.spyOn(window, 'print').mockImplementation(() => {});
    await printDocument('امتحان');
    expect(nativeState.print).toHaveBeenCalledWith({ jobName: 'امتحان' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
