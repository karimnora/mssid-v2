package dz.mssid.education.exception;

import lombok.Getter;

/**
 * SEC-10: thrown when an authenticated account has used up its daily Gemini quota.
 * Identity/role come from the JWT SecurityContext — never from client headers.
 */
@Getter
public class AiQuotaExceededException extends RuntimeException {

    private final int limit;
    private final int remaining;
    private final int resetHours;

    public AiQuotaExceededException(int limit, int remaining, int resetHours) {
        super("لقد استنفدت حصتك اليومية من أسئلة المعلم الذكي (" + limit + "/" + limit
                + "). حاول مرة أخرى بعد حوالي " + resetHours + " ساعة.");
        this.limit = limit;
        this.remaining = remaining;
        this.resetHours = resetHours;
    }
}
