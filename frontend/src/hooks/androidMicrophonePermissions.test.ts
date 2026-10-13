import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Android WebView microphone permissions', () => {
  it('declares every permission requested by the installed Capacitor audio capture handler', () => {
    const manifest = readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
    const bridge = readFileSync('node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/BridgeWebChromeClient.java', 'utf8');
    const audioCapture = bridge.match(/if \(Arrays\.asList\(request\.getResources\(\)\).contains\("android.webkit.resource.AUDIO_CAPTURE"\)\) \{([^}]+)\}/)?.[1];
    expect(audioCapture).toBeDefined();
    const permissions = [...audioCapture!.matchAll(/Manifest\.permission\.(\w+)/g)].map(match => match[1]);
    expect(permissions).toContain('RECORD_AUDIO');
    for (const permission of permissions) {
      expect(manifest).toContain(`<uses-permission android:name="android.permission.${permission}" />`);
    }
  });
});
