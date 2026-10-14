package dz.mssid.app;

import android.content.Context;
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
    private WebView htmlPrintView;

    @PluginMethod
    public void print(PluginCall call) {
        final String jobName = call.getString("jobName", "Mssid DZ");
        final boolean landscape = Boolean.TRUE.equals(call.getBoolean("landscape", false));
        getActivity().runOnUiThread(() -> {
            try {
                PrintManager printManager = (PrintManager) getContext().getSystemService(Context.PRINT_SERVICE);
                if (printManager == null) {
                    call.reject("Print service unavailable");
                    return;
                }
                WebView webView = getBridge().getWebView();
                PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(jobName);
                // Match the app's 10 mm paper margin even on WebViews that ignore @page.
                printManager.print(jobName, adapter, new PrintAttributes.Builder()
                        .setMediaSize(landscape
                                ? PrintAttributes.MediaSize.ISO_A4.asLandscape()
                                : PrintAttributes.MediaSize.ISO_A4)
                        .setMinMargins(new PrintAttributes.Margins(394, 394, 394, 394))
                        .build());
                call.resolve();
            } catch (Exception e) {
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
            try {
                htmlPrintView = new WebView(getContext());
                htmlPrintView.setWebViewClient(new WebViewClient() {
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
                                call.reject("Print service unavailable");
                                return;
                            }
                            PrintDocumentAdapter adapter = view.createPrintDocumentAdapter(jobName);
                            printManager.print(jobName, adapter, defaultPrintAttributes());
                            call.resolve();
                        } catch (Exception e) {
                            call.reject("Print failed: " + e.getMessage());
                        }
                    }
                });
                htmlPrintView.loadDataWithBaseURL("https://localhost/", html, "text/html", "UTF-8", null);
            } catch (Exception e) {
                call.reject("Print failed: " + e.getMessage());
            }
        });
    }

    private static PrintAttributes defaultPrintAttributes() {
        return new PrintAttributes.Builder()
                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                .build();
    }
}
