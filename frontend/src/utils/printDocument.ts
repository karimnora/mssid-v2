import { Capacitor, registerPlugin } from '@capacitor/core';
import { getStoredLocale } from '../localePreference';
import { showAppNotice } from './appNotice';

interface MssidPrintPlugin {
  print(options?: { jobName?: string }): Promise<void>;
  printHtml(options: { html: string; jobName?: string }): Promise<void>;
}

const MssidPrint = registerPlugin<MssidPrintPlugin>('MssidPrint');

export type PrintOutcome = 'printed' | 'blocked';

function notifyPrintBlocked(): void {
  showAppNotice(
    getStoredLocale() === 'fr'
      ? 'L’impression a été bloquée. Autorisez les pop-ups pour cette page, puis réessayez.'
      : 'تم حظر نافذة الطباعة. اسمح بالنوافذ المنبثقة لهذه الصفحة ثم أعد المحاولة.',
  );
}

function printHtmlViaIframe(html: string): boolean {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('title', 'print');
  iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;left:0;top:0';
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    iframe.remove();
    return false;
  }
  doc.open();
  doc.write(html);
  doc.close();
  try {
    win.focus();
    win.print();
  } catch {
    iframe.remove();
    return false;
  }
  window.setTimeout(() => iframe.remove(), 60_000);
  return true;
}

function openHtmlPrintWindow(html: string): PrintOutcome {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => {
      printWindow.print();
    }, 300);
    return 'printed';
  }
  if (printHtmlViaIframe(html)) return 'printed';
  notifyPrintBlocked();
  return 'blocked';
}

/** Android WebView ignores window.print(); native PrintManager is used instead. */
export async function printDocument(jobName = 'Mssid DZ'): Promise<void> {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    await MssidPrint.print({ jobName });
    return;
  }
  window.print();
}

/** Print generated HTML (new-window flow fails in the Android WebView). */
export async function printHtmlDocument(html: string, jobName = 'Mssid DZ'): Promise<PrintOutcome> {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    await MssidPrint.printHtml({ html, jobName });
    return 'printed';
  }
  return openHtmlPrintWindow(html);
}
