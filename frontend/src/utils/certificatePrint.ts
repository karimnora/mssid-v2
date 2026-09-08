/**
 * Shared print trigger for printable certificates/diplomas (Honor Certificates Studio,
 * WilayasExplorer diploma, ...). Any full-screen certificate modal's outer overlay must
 * carry the `certificate-print-modal` class and its certificate frame the `printable-certificate`
 * class — both handled generically in index.css's `@media print` block. The only thing that
 * still varies per certificate is page orientation, handled here via a scoped `@page` override.
 */
export function printCertificate(orientation: 'portrait' | 'landscape' = 'portrait'): void {
  if (orientation === 'portrait') {
    window.print();
    return;
  }

  const orientationOverride = document.createElement('style');
  orientationOverride.setAttribute('data-certificate-print-orientation', 'true');
  orientationOverride.textContent = `
    @media print {
      @page { size: A4 landscape; margin: 10mm; }
    }
  `;
  document.head.appendChild(orientationOverride);

  const cleanup = () => {
    orientationOverride.remove();
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);

  window.print();
}
