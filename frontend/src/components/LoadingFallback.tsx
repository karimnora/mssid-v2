import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  label?: string;
  minHeight?: string;
}

// Suspense fallback for React.lazy()-loaded routes/tools (see App.tsx's R2.1 code splitting).
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ label = 'جاري التحميل...', minHeight = '280px' }) => (
  <div
    className="flex flex-col items-center justify-center gap-3 rounded-3xl border bg-[var(--app-card-bg)] border-[var(--app-card-border)] text-[var(--app-text-muted)]"
    style={{ minHeight }}
  >
    <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-emerald)]" />
    <span className="text-xs font-bold">{label}</span>
  </div>
);
