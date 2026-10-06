import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const nativeState = vi.hoisted(() => ({
  isNative: false,
  platform: 'web',
  shareImage: vi.fn().mockResolvedValue(undefined),
  shareText: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => nativeState.isNative,
    getPlatform: () => nativeState.platform,
  },
  registerPlugin: () => ({
    shareImage: nativeState.shareImage,
    shareText: nativeState.shareText,
  }),
}));

import { copyText, shareImageBlob, sharePlainText } from './shareContent';

describe('shareImageBlob', () => {
  beforeEach(() => {
    nativeState.isNative = false;
    nativeState.platform = 'web';
    nativeState.shareImage.mockClear();
    nativeState.shareText.mockClear();
    vi.stubGlobal('navigator', {
      ...navigator,
      share: undefined,
      canShare: undefined,
      clipboard: { writeText: vi.fn() },
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses the native Android share sheet', async () => {
    nativeState.isNative = true;
    nativeState.platform = 'android';
    const blob = new Blob(['png'], { type: 'image/png' });
    await expect(shareImageBlob(blob, 'badge.png', 'وسام')).resolves.toBe('shared');
    expect(nativeState.shareImage).toHaveBeenCalledWith(expect.objectContaining({
      filename: 'badge.png',
      text: 'وسام',
      title: 'مَسِيد DZ',
    }));
    expect(nativeState.shareImage.mock.calls[0][0].base64).toBeTruthy();
  });

  it('still shares when canShare throws — the old gate swallowed the tap', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      ...navigator,
      share,
      canShare: () => {
        throw new TypeError('canShare files unsupported');
      },
    });
    const blob = new Blob(['png'], { type: 'image/png' });
    await expect(shareImageBlob(blob, 'badge.png', 'وسام')).resolves.toBe('shared');
    expect(share).toHaveBeenCalledTimes(1);
  });

  it('falls back to download when Web Share is missing', async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const blob = new Blob(['png'], { type: 'image/png' });
    await expect(shareImageBlob(blob, 'badge.png', 'وسام')).resolves.toBe('downloaded');
    expect(click).toHaveBeenCalledTimes(1);
    click.mockRestore();
  });
});

describe('sharePlainText / copyText', () => {
  beforeEach(() => {
    nativeState.isNative = false;
    nativeState.platform = 'web';
    nativeState.shareText.mockClear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses the native Android text share sheet', async () => {
    nativeState.isNative = true;
    nativeState.platform = 'android';
    await expect(sharePlainText('رمز الواجب 1234')).resolves.toBe('shared');
    expect(nativeState.shareText).toHaveBeenCalledWith({
      text: 'رمز الواجب 1234',
      title: 'مَسِيد DZ',
    });
  });

  it('copies through execCommand when clipboard.writeText is blocked', async () => {
    nativeState.isNative = false;
    vi.stubGlobal('navigator', {
      ...navigator,
      share: undefined,
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('NotAllowedError')),
      },
    });
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    });
    await expect(copyText('pin')).resolves.toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
