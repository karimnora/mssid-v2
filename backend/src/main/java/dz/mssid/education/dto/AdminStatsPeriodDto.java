package dz.mssid.education.dto;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

/** Dated facts only. Receipt amounts are grouped by submission date and current status,
 * not by approval date; learning history cannot be reconstructed from completion ID lists. */
public record AdminStatsPeriodDto(
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd") LocalDate from,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd") LocalDate to, String timezone,
        List<Day> days) {
    public record Day(@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd") LocalDate date,
            long registrations, long submittedReceipts,
            double approvedSubmittedAmountDzd, double pendingSubmittedAmountDzd) {}
}
