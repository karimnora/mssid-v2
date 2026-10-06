import { Capacitor, registerPlugin } from '@capacitor/core';

interface MssidPrintPlugin {
  print(options?: { jobName?: string }): Promise<void>;
  printHtml(options: { html: string; jobName?: string }): Promise<void>;
}

const MssidPrint = registerPlugin<MssidPrintPlugin>('MssidPrint');

function openHtmlPrintWindow(html: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
  }, 300);
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
export async function printHtmlDocument(html: string, jobName = 'Mssid DZ'): Promise<void> {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    await MssidPrint.printHtml({ html, jobName });
    return;
  }
  openHtmlPrintWindow(html);
}
