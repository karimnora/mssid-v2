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

import { printDocument, printHtmlDocument } from './printDocument';

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

describe('printHtmlDocument', () => {
  beforeEach(() => {
    nativeState.isNative = false;
    nativeState.platform = 'web';
    nativeState.printHtml.mockClear();
    document.getElementById('mssid-app-notice')?.remove();
  });

  it('prints in a new window when pop-ups are allowed', async () => {
    const print = vi.fn();
    const fakeWindow = {
      document: { write: vi.fn(), close: vi.fn() },
      focus: vi.fn(),
      print,
    };
    const open = vi.spyOn(window, 'open').mockReturnValue(fakeWindow as unknown as Window);
    await expect(printHtmlDocument('<p>امتحان</p>')).resolves.toBe('printed');
    expect(fakeWindow.document.write).toHaveBeenCalled();
    open.mockRestore();
  });

  it('explains the block when the pop-up and the iframe fallback both fail', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const createElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag !== 'iframe') return createElement(tag);
      const iframe = createElement('iframe') as HTMLIFrameElement;
      Object.defineProperty(iframe, 'contentDocument', { configurable: true, value: null });
      Object.defineProperty(iframe, 'contentWindow', { configurable: true, value: null });
      return iframe;
    });
    await expect(printHtmlDocument('<p>امتحان</p>')).resolves.toBe('blocked');
    expect(document.getElementById('mssid-app-notice')?.textContent).toMatch(/طباعة|pop-ups/i);
    open.mockRestore();
    vi.restoreAllMocks();
  });
});
