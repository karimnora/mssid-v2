package dz.mssid.education.controller;

import dz.mssid.education.service.WeeklyReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Weekly parent report: the one-click stop link of the e-mail (public, signed) and a manual run for
 * the admin (to test the e-mail before the Thursday schedule, or to resend after an outage).
 */
@RestController
@RequiredArgsConstructor
public class WeeklyReportController {

    private final WeeklyReportService weeklyReports;

    @GetMapping(value = "/api/v1/reports/unsubscribe", produces = MediaType.TEXT_HTML_VALUE + ";charset=UTF-8")
    public ResponseEntity<String> unsubscribe(@RequestParam("u") long userId, @RequestParam("t") String token) {
        boolean done = weeklyReports.unsubscribe(userId, token);
        String message = done
                ? "تمّ إيقاف حصيلة الأسبوع. لن تصلكم هذه الرسائل بعد اليوم."
                : "الرابط غير صالح أو منتهٍ.";
        String html = "<!doctype html><html lang=\"ar\" dir=\"rtl\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
                + "<title>مَسِيد DZ</title></head><body style=\"font-family:Tahoma,Arial,sans-serif;text-align:center;padding:40px;background:#FFFBF0;color:#0f172a\">"
                + "<h1 style=\"font-size:20px\">" + message + "</h1></body></html>";
        return ResponseEntity.status(done ? 200 : 400).body(html);
    }

    @PostMapping("/api/v1/admin/weekly-reports/run")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Integer> runNow() {
        return Map.of("sent", weeklyReports.run());
    }
}
