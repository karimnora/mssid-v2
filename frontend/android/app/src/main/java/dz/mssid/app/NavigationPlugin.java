package dz.mssid.app;

import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Let unfinished activities ask before Android's system Back leaves the WebView. */
@CapacitorPlugin(name = "Navigation")
public class NavigationPlugin extends Plugin {
    @Override
    public void load() {
        getActivity().getOnBackPressedDispatcher().addCallback(getActivity(), new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                getBridge().getWebView().evaluateJavascript(
                    "window.dispatchEvent(new Event('mssid:native-back', {cancelable:true}))",
                    result -> { if (!"false".equals(result)) performBack(); }
                );
            }
        });
    }

    private void performBack() {
        if (getBridge().getWebView().canGoBack()) getBridge().getWebView().goBack();
        else getActivity().finish();
    }

    @PluginMethod
    public void back(PluginCall call) {
        getActivity().runOnUiThread(() -> { performBack(); call.resolve(); });
    }
}
