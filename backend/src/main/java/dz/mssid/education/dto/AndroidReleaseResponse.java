package dz.mssid.education.dto;

public class AndroidReleaseResponse {
    private int latestVersionCode;
    private int minVersionCode;

    public AndroidReleaseResponse() {}

    public AndroidReleaseResponse(int latestVersionCode, int minVersionCode) {
        this.latestVersionCode = latestVersionCode;
        this.minVersionCode = minVersionCode;
    }

    public int getLatestVersionCode() { return latestVersionCode; }
    public void setLatestVersionCode(int latestVersionCode) { this.latestVersionCode = latestVersionCode; }
    public int getMinVersionCode() { return minVersionCode; }
    public void setMinVersionCode(int minVersionCode) { this.minVersionCode = minVersionCode; }
}
