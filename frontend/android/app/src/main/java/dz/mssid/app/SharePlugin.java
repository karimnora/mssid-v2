package dz.mssid.app;

import android.content.Intent;
import android.net.Uri;
import android.util.Base64;

import androidx.core.content.FileProvider;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;

@CapacitorPlugin(name = "MssidShare")
public class SharePlugin extends Plugin {

    @PluginMethod
    public void shareImage(PluginCall call) {
        final String base64 = call.getString("base64");
        final String filename = sanitizeFilename(call.getString("filename", "mssid-dz.png"));
        final String text = call.getString("text", "");
        final String title = call.getString("title", "Mssid DZ");
        if (base64 == null || base64.isEmpty()) {
            call.reject("base64 is required");
            return;
        }
        getActivity().runOnUiThread(() -> {
            try {
                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                File cache = new File(getContext().getCacheDir(), filename);
                try (FileOutputStream fos = new FileOutputStream(cache)) {
                    fos.write(bytes);
                }
                Uri uri = FileProvider.getUriForFile(
                        getContext(),
                        getContext().getPackageName() + ".fileprovider",
                        cache
                );
                Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("image/png");
                intent.putExtra(Intent.EXTRA_STREAM, uri);
                if (text != null && !text.isEmpty()) {
                    intent.putExtra(Intent.EXTRA_TEXT, text);
                }
                intent.putExtra(Intent.EXTRA_SUBJECT, title);
                intent.setClipData(android.content.ClipData.newRawUri("image", uri));
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                getActivity().startActivity(Intent.createChooser(intent, title));
                call.resolve();
            } catch (Exception e) {
                call.reject("Share failed: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void shareText(PluginCall call) {
        final String text = call.getString("text");
        final String title = call.getString("title", "Mssid DZ");
        if (text == null || text.isEmpty()) {
            call.reject("text is required");
            return;
        }
        getActivity().runOnUiThread(() -> {
            try {
                Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("text/plain");
                intent.putExtra(Intent.EXTRA_TEXT, text);
                intent.putExtra(Intent.EXTRA_SUBJECT, title);
                getActivity().startActivity(Intent.createChooser(intent, title));
                call.resolve();
            } catch (Exception e) {
                call.reject("Share failed: " + e.getMessage());
            }
        });
    }

    private static String sanitizeFilename(String name) {
        String cleaned = name.replaceAll("[^a-zA-Z0-9._-]", "_");
        return cleaned.isEmpty() ? "mssid-dz.png" : cleaned;
    }
}
