package dz.mssid.education.dto;

public class VerifyReceiptRequest {
    private Boolean approve;
    private String rejectionReason;

    public Boolean getApprove() { return approve; }
    public void setApprove(Boolean approve) { this.approve = approve; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
