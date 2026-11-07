package dz.mssid.education.service;

import dz.mssid.education.entity.Role;
import dz.mssid.education.entity.Subscription;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.RoleRepository;
import dz.mssid.education.repository.SubscriptionRepository;
import dz.mssid.education.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.Date;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Activation codes (« كود التفعيل »): one system for prepaid cards sold in bookshops and tutoring
 * schools, codes sent to a parent after a BaridiMob payment, and school licences (a class code used
 * by up to 60 accounts). Redeeming grants Premium for the code's plan, added to a running
 * subscription; SubscriptionExpiryService downgrades at the end as for a receipt.
 *
 * Only SHA-256 hashes are stored: the plain codes exist once, in the admin's generation response.
 * Redeeming is serialised per code ({@code FOR UPDATE}) so a class code can never exceed its seats.
 */
@Service
public class ActivationCodeService {

    public static final String ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
    public static final int MAX_BATCH = 500;
    public static final int MAX_SEATS = 60;
    public static final Set<String> KINDS = Set.of("CARD", "RECEIPT", "SCHOOL");

    private final JdbcTemplate jdbc;
    private final UserRepository users;
    private final RoleRepository roles;
    private final SubscriptionRepository subscriptions;
    private final AdminAuditLogService audit;
    private final Clock clock;
    private final SecureRandom random = new SecureRandom();

    @Autowired
    public ActivationCodeService(JdbcTemplate jdbc, UserRepository users, RoleRepository roles,
                                 SubscriptionRepository subscriptions, AdminAuditLogService audit) {
        this(jdbc, users, roles, subscriptions, audit, Clock.system(WeeklyReportService.ALGIERS));
    }

    ActivationCodeService(JdbcTemplate jdbc, UserRepository users, RoleRepository roles,
                          SubscriptionRepository subscriptions, AdminAuditLogService audit, Clock clock) {
        this.jdbc = jdbc;
        this.users = users;
        this.roles = roles;
        this.subscriptions = subscriptions;
        this.audit = audit;
        this.clock = clock;
    }

    public record Batch(String label, String kind, String planId, int codes, int seats, int used, LocalDate validUntil, int revoked) {
    }

    public record Redeemed(String planId, int months, LocalDate endDate) {
    }

    /** Upper-case, without spaces, dashes or dots (« msd 4k7p-9xq2 » → « MSD4K7P9XQ2 »). */
    public static String normalize(String raw) {
        if (raw == null) return "";
        return raw.toUpperCase(Locale.ROOT).replaceAll("[\\s\\-_.]", "");
    }

    static String hash(String normalized) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(normalized.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    /** MSD-XXXX-XXXX: 8 random symbols from 31 (≈ 8,5 × 10¹¹ codes). */
    String newCode() {
        StringBuilder body = new StringBuilder();
        for (int i = 0; i < 8; i++) body.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        return "MSD-" + body.substring(0, 4) + "-" + body.substring(4);
    }

    @Transactional
    public List<String> generate(String planId, int count, int seats, String kind, String label, LocalDate validUntil, String actor) {
        SubscriptionPlan plan = SubscriptionPlan.forNewPurchase(planId);
        if (count < 1 || count > MAX_BATCH) throw bad("Entre 1 et " + MAX_BATCH + " codes par lot.");
        if (seats < 1 || seats > MAX_SEATS) throw bad("Entre 1 et " + MAX_SEATS + " comptes par code.");
        if (!KINDS.contains(kind)) throw bad("Type de code inconnu.");
        if (label == null || label.isBlank() || label.length() > 120) throw bad("Donnez un nom au lot (librairie, école, parent…).");
        List<String> codes = new ArrayList<>();
        while (codes.size() < count) {
            String code = newCode();
            String normalized = normalize(code);
            int inserted = jdbc.update(
                    "INSERT INTO activation_codes (code_hash, code_hint, kind, plan_id, duration_months, max_uses, batch_label, valid_until, created_by, created_at) "
                            + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (code_hash) DO NOTHING",
                    hash(normalized), normalized.substring(normalized.length() - 4), kind, plan.id(), plan.months(), seats,
                    label.trim(), validUntil == null ? null : Date.valueOf(validUntil), actor, LocalDateTime.now(clock));
            if (inserted == 1) codes.add(code);
        }
        audit.record(actor, "ACTIVATION_CODES_CREATED", "ACTIVATION_CODE", label.trim(),
                count + " code(s) " + kind + " " + plan.id() + " × " + seats + " compte(s)", "SUCCESS");
        return codes;
    }

    @Transactional
    public Redeemed redeem(String email, String rawCode) {
        String normalized = normalize(rawCode);
        if (!normalized.matches("MSD[" + ALPHABET + "]{8}")) {
            throw bad("الكود غير صحيح. تحقّق من الأحرف ثم أعد المحاولة.");
        }
        User user = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        List<Map<String, Object>> rows = jdbc.queryForList(
                "SELECT id, plan_id, duration_months, max_uses, used_count, valid_until, revoked FROM activation_codes WHERE code_hash = ? FOR UPDATE",
                hash(normalized));
        if (rows.isEmpty()) {
            audit.record(email, "ACTIVATION_CODE_REDEEM", "ACTIVATION_CODE", "?" + normalized.substring(normalized.length() - 4), "code inconnu", "FAILURE");
            throw bad("الكود غير صحيح. تحقّق من الأحرف ثم أعد المحاولة.");
        }
        Map<String, Object> row = rows.get(0);
        long codeId = ((Number) row.get("id")).longValue();
        if (Boolean.TRUE.equals(row.get("revoked"))) throw bad("هذا الكود أُلغي. تواصلوا معنا إن اشتريتموه.");
        Object validUntil = row.get("valid_until");
        LocalDate today = LocalDate.now(clock);
        if (validUntil != null && toLocalDate(validUntil).isBefore(today)) throw bad("انتهت صلاحية هذا الكود.");
        Integer already = jdbc.queryForObject("SELECT COUNT(*) FROM activation_code_redemptions WHERE code_id = ? AND user_id = ?", Integer.class, codeId, user.getId());
        if (already != null && already > 0) throw bad("استعملتم هذا الكود من قبل على هذا الحساب.");
        if (((Number) row.get("used_count")).intValue() >= ((Number) row.get("max_uses")).intValue()) {
            throw bad("هذا الكود استُعمل بالكامل.");
        }

        jdbc.update("UPDATE activation_codes SET used_count = used_count + 1 WHERE id = ?", codeId);
        jdbc.update("INSERT INTO activation_code_redemptions (code_id, user_id, redeemed_at) VALUES (?, ?, ?)", codeId, user.getId(), LocalDateTime.now(clock));
        String planId = String.valueOf(row.get("plan_id"));
        int months = ((Number) row.get("duration_months")).intValue();
        LocalDate end = grantPremium(user.getId(), planId, months, today);
        audit.record(email, "ACTIVATION_CODE_REDEEM", "ACTIVATION_CODE", String.valueOf(codeId), planId + " → " + end, "SUCCESS");
        return new Redeemed(planId, months, end);
    }

    /** Same rule as an approved receipt: Premium role, and months added to a running subscription. */
    LocalDate grantPremium(long userId, String planId, int months, LocalDate today) {
        User user = users.findForPayment(userId).orElseThrow(() -> bad("Compte introuvable"));
        if (user.getRole() == null || user.getRole().getName() != Role.RoleName.ROLE_ADMIN) {
            Role premium = roles.findByName(Role.RoleName.ROLE_PREMIUM).orElseGet(() -> {
                Role role = new Role();
                role.setName(Role.RoleName.ROLE_PREMIUM);
                return roles.save(role);
            });
            user.setRole(premium);
            users.save(user);
        }
        Subscription subscription = subscriptions.findByUser(user).orElseGet(Subscription::new);
        subscription.setUser(user);
        boolean renewing = subscription.getStatus() == Subscription.SubscriptionStatus.ACTIVE
                && subscription.getEndDate() != null && !subscription.getEndDate().isBefore(today)
                && subscription.getStartDate() != null;
        LocalDate base = renewing ? subscription.getEndDate() : today;
        if (!renewing) subscription.setStartDate(today);
        subscription.setEndDate(base.plusMonths(months));
        subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        subscription.setPlanId(planId);
        subscription.setDurationMonths(months);
        subscriptions.save(subscription);
        return subscription.getEndDate();
    }

    public List<Batch> batches() {
        return jdbc.query(
                "SELECT batch_label, kind, plan_id, COUNT(*) AS codes, SUM(max_uses) AS seats, SUM(used_count) AS used, MAX(valid_until) AS valid_until, "
                        + "SUM(CASE WHEN revoked THEN 1 ELSE 0 END) AS revoked FROM activation_codes GROUP BY batch_label, kind, plan_id ORDER BY MAX(created_at) DESC",
                (rs, i) -> new Batch(rs.getString("batch_label"), rs.getString("kind"), rs.getString("plan_id"), rs.getInt("codes"),
                        rs.getInt("seats"), rs.getInt("used"), rs.getDate("valid_until") == null ? null : rs.getDate("valid_until").toLocalDate(),
                        rs.getInt("revoked")));
    }

    /** Stops every unused seat of a batch (lost box of cards, cancelled school order). */
    @Transactional
    public int revokeBatch(String label, String actor) {
        int count = jdbc.update("UPDATE activation_codes SET revoked = TRUE WHERE batch_label = ? AND revoked = FALSE", label);
        audit.record(actor, "ACTIVATION_CODES_REVOKED", "ACTIVATION_CODE", label, count + " code(s)", "SUCCESS");
        return count;
    }

    private static LocalDate toLocalDate(Object value) {
        if (value instanceof Date date) return date.toLocalDate();
        if (value instanceof LocalDate date) return date;
        return LocalDate.parse(String.valueOf(value).substring(0, 10));
    }

    private static ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
