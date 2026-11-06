package dz.mssid.app;

import android.content.Context;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "MssidPrint")
public class PrintPlugin extends Plugin {
    /** Only touched on the UI thread. One print job at a time: Chromium's adapter cannot overlap. */
    private boolean printInProgress = false;
    private WebView htmlPrintView;

    @PluginMethod
    public void print(PluginCall call) {
        final String jobName = call.getString("jobName", "Mssid DZ");
        final boolean landscape = Boolean.TRUE.equals(call.getBoolean("landscape", false));
        getActivity().runOnUiThread(() -> {
            if (printInProgress) {
                // A print dialog is already open (double tap): ignore instead of crashing.
                call.resolve();
                return;
            }
            try {
                PrintManager printManager = (PrintManager) getContext().getSystemService(Context.PRINT_SERVICE);
                if (printManager == null) {
                    call.reject("Print service unavailable");
                    return;
                }
                WebView webView = getBridge().getWebView();
                PrintDocumentAdapter adapter = new GuardedPrintAdapter(
                        webView.createPrintDocumentAdapter(jobName), this::onPrintJobFinished);
                printInProgress = true;
                // Match the app's 10 mm paper margin even on WebViews that ignore @page.
                printManager.print(jobName, adapter, new PrintAttributes.Builder()
                        .setMediaSize(landscape
                                ? PrintAttributes.MediaSize.ISO_A4.asLandscape()
                                : PrintAttributes.MediaSize.ISO_A4)
                        .setMinMargins(new PrintAttributes.Margins(394, 394, 394, 394))
                        .build());
                call.resolve();
            } catch (Exception e) {
                onPrintJobFinished();
                call.reject("Print failed: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void printHtml(PluginCall call) {
        final String html = call.getString("html");
        final String jobName = call.getString("jobName", "Mssid DZ");
        if (html == null || html.isEmpty()) {
            call.reject("html is required");
            return;
        }
        getActivity().runOnUiThread(() -> {
            if (printInProgress) {
                call.resolve();
                return;
            }
            printInProgress = true;
            try {
                final WebView printView = new WebView(getContext());
                htmlPrintView = printView;
                printView.setWebViewClient(new WebViewClient() {
                    private boolean printed = false;

                    @Override
                    public void onPageFinished(WebView view, String url) {
                        if (printed) {
                            return;
                        }
                        printed = true;
                        try {
                            PrintManager printManager = (PrintManager) getContext().getSystemService(Context.PRINT_SERVICE);
                            if (printManager == null) {
                                onPrintJobFinished();
                                call.reject("Print service unavailable");
                                return;
                            }
                            PrintDocumentAdapter adapter = new GuardedPrintAdapter(
                                    view.createPrintDocumentAdapter(jobName), PrintPlugin.this::onPrintJobFinished);
                            printManager.print(jobName, adapter, defaultPrintAttributes());
                            call.resolve();
                        } catch (Exception e) {
                            onPrintJobFinished();
                            call.reject("Print failed: " + e.getMessage());
                        }
                    }
                });
                printView.loadDataWithBaseURL("https://localhost/", html, "text/html", "UTF-8", null);
            } catch (Exception e) {
                onPrintJobFinished();
                call.reject("Print failed: " + e.getMessage());
            }
        });
    }

    /** Runs on the UI thread once the print dialog is closed (or the job failed to start). */
    private void onPrintJobFinished() {
        printInProgress = false;
        if (htmlPrintView != null) {
            htmlPrintView.destroy();
            htmlPrintView = null;
        }
    }

    private static PrintAttributes defaultPrintAttributes() {
        return new PrintAttributes.Builder()
                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                .build();
    }

    /**
     * Wraps Chromium's WebView print adapter. Some print services (seen on Samsung / Android 10)
     * call onWrite again while the previous write is still running; Chromium then throws
     * "IllegalStateException: printing is already pending" on the main thread and the app crashes.
     * We turn that into a failed write so the print preview simply retries.
     */
    private static final class GuardedPrintAdapter extends PrintDocumentAdapter {
        private final PrintDocumentAdapter delegate;
        private final Runnable onFinished;

        GuardedPrintAdapter(PrintDocumentAdapter delegate, Runnable onFinished) {
            this.delegate = delegate;
            this.onFinished = onFinished;
        }

        @Override
        public void onStart() {
            delegate.onStart();
        }

        @Override
        public void onLayout(PrintAttributes oldAttributes, PrintAttributes newAttributes,
                             CancellationSignal cancellationSignal, LayoutResultCallback callback,
                             Bundle extras) {
            delegate.onLayout(oldAttributes, newAttributes, cancellationSignal, callback, extras);
        }

        @Override
        public void onWrite(PageRange[] pages, ParcelFileDescriptor destination,
                            CancellationSignal cancellationSignal, WriteResultCallback callback) {
            try {
                delegate.onWrite(pages, destination, cancellationSignal, callback);
            } catch (IllegalStateException e) {
                callback.onWriteFailed(e.getMessage());
            }
        }

        @Override
        public void onFinish() {
            try {
                delegate.onFinish();
            } finally {
                onFinished.run();
            }
        }
    }
}
