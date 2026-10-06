package dz.mssid.education.dto;

public class UpdateAndroidReleaseRequest {
    private Integer latestVersionCode;
    private Integer minVersionCode;

    public Integer getLatestVersionCode() { return latestVersionCode; }
    public void setLatestVersionCode(Integer latestVersionCode) { this.latestVersionCode = latestVersionCode; }
    public Integer getMinVersionCode() { return minVersionCode; }
    public void setMinVersionCode(Integer minVersionCode) { this.minVersionCode = minVersionCode; }
}
