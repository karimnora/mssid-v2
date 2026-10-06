import { Capacitor, registerPlugin } from '@capacitor/core';

interface MssidSharePlugin {
  shareImage(options: { base64: string; filename: string; text?: string; title?: string }): Promise<void>;
  shareText(options: { text: string; title?: string }): Promise<void>;
}

const MssidShare = registerPlugin<MssidSharePlugin>('MssidShare');

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

function canSharePayload(payload: ShareData): boolean | 'unknown' {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare !== 'function') return 'unknown';
  try {
    return navigator.canShare(payload) ? true : false;
  } catch {
    return 'unknown';
  }
}

async function tryNavigatorShare(payload: ShareData): Promise<ShareOutcome | 'failed'> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return 'failed';
  try {
    await navigator.share(payload);
    return 'shared';
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') return 'cancelled';
    return 'failed';
  }
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * Opens the system share sheet with a PNG. Android WebView ignores navigator.share
 * file sharing and `<a download>`, which made the certificate button look dead.
 */
export async function shareImageBlob(blob: Blob, filename: string, shareText: string, title = 'مَسِيد DZ'): Promise<ShareOutcome> {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    const base64 = await blobToBase64(blob);
    await MssidShare.shareImage({ base64, filename, text: shareText, title });
    return 'shared';
  }

  const file = new File([blob], filename, { type: blob.type || 'image/png' });
  const withFile: ShareData = { files: [file], title, text: shareText };
  const filesShareable = canSharePayload(withFile);
  if (filesShareable !== false) {
    const fileResult = await tryNavigatorShare(withFile);
    if (fileResult !== 'failed') return fileResult;
  }

  const textResult = await tryNavigatorShare({ title, text: shareText });
  if (textResult !== 'failed') return textResult;

  triggerDownload(blob, filename);
  return 'downloaded';
}

export async function sharePlainText(text: string, title = 'مَسِيد DZ'): Promise<ShareOutcome> {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    await MssidShare.shareText({ text, title });
    return 'shared';
  }
  const result = await tryNavigatorShare({ title, text });
  if (result !== 'failed') return result;
  const copied = await copyText(text);
  return copied ? 'downloaded' : 'cancelled';
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand — WebView clipboard permission is often missing.
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}
