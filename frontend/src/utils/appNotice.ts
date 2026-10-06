/** Short parent-facing status chip. Injected so print/share helpers need no React tree. */
export function showAppNotice(message: string): void {
  if (typeof document === 'undefined') return;
  document.getElementById('mssid-app-notice')?.remove();
  const el = document.createElement('div');
  el.id = 'mssid-app-notice';
  el.setAttribute('role', 'status');
  el.dir = 'auto';
  el.textContent = message;
  el.style.cssText = [
    'position:fixed',
    'z-index:80',
    'inset-inline:1rem',
    'bottom:1.25rem',
    'max-width:28rem',
    'margin-inline:auto',
    'background:#FFFFFF',
    'color:#0f172a',
    'border:2px solid #E7E2D7',
    'border-radius:1.5rem',
    'padding:1rem 1.25rem',
    'font-weight:800',
    'font-size:1rem',
    'line-height:1.45',
    'box-shadow:0 8px 24px rgba(15,23,42,0.12)',
    'pointer-events:none',
  ].join(';');
  document.body.appendChild(el);
  window.setTimeout(() => {
    if (el.parentNode) el.remove();
  }, 6000);
}
