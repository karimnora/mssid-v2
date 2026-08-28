import React from 'react';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Global safety net: without this, a render error anywhere in the tree (any of the 30+ lazy-loaded
// interactive tools, a malformed lesson object, etc.) crashes to a blank white screen with no message
// and no way back for a child except a manual browser reload. React only catches render errors via a
// class component's getDerivedStateFromError/componentDidCatch — there is no hooks equivalent.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('[mssid] Uncaught render error:', error, info.componentStack);
    // Sentry (Phase 190): React only reaches this via the class-component boundary — Sentry's
    // global window.onerror listener never sees a render error caught here, so it's reported
    // explicitly. No-op if Sentry.init() was never called (no VITE_SENTRY_DSN, see main.tsx).
    Sentry.captureException(error, { extra: { componentStack: info.componentStack ?? undefined } });
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-sky-100 flex items-center justify-center p-6"
      >
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-8 text-center space-y-4">
          <span className="text-6xl block">🦊</span>
          <h1 className="text-lg font-black text-slate-900">حَدَثَ خَطَأٌ غَيْرُ مُتَوَقَّعٍ</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            نَعْتَذِرُ، حَدَثَتْ مُشْكِلَةٌ فِي هَذِهِ الصَّفْحَةِ. اِضْغَطْ عَلَى الزِّرِّ أَدْنَاهُ لِلْعَوْدَةِ وَإِعَادَةِ المُحَاوَلَةِ.
          </p>
          <button
            onClick={this.handleReload}
            className="w-full min-h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-[0.98]"
          >
            🔄 إِعَادَةُ التَّحْمِيلِ
          </button>
        </div>
      </div>
    );
  }
}
