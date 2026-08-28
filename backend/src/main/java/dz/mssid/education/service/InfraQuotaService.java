package dz.mssid.education.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.InfraQuotasDto;
import dz.mssid.education.dto.InfraQuotasDto.Meter;
import dz.mssid.education.dto.InfraQuotasDto.ProviderQuota;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Pulls remaining free-tier quotas from Resend / Neon / Render so an admin can see them in the
 * CRM instead of opening three dashboards. Each provider is fetched independently: a missing key
 * or a 403 on a paid-only Neon endpoint becomes {@code not_configured}/{@code error} on that card
 * only, never a fabricated number and never a failure of the whole payload.
 */
@Service
public class InfraQuotaService {

    private static final Logger log = LoggerFactory.getLogger(InfraQuotaService.class);
    private static final ZoneId ALGIERS = ZoneId.of("Africa/Algiers");
    private static final int RESEND_LIST_PAGE_SIZE = 100;
    private static final int RESEND_MAX_PAGES = 15;

    @Value("${app.resend.api-key:}")
    private String resendApiKey;

    @Value("${app.resend.api-url:https://api.resend.com/emails}")
    private String resendApiUrl;

    @Value("${app.resend.daily-limit:100}")
    private int resendDailyLimit;

    @Value("${app.resend.monthly-limit:3000}")
    private int resendMonthlyLimit;

    @Value("${app.neon.api-key:}")
    private String neonApiKey;

    @Value("${app.neon.project-id:}")
    private String neonProjectId;

    @Value("${app.neon.org-id:}")
    private String neonOrgId;

    @Value("${app.neon.api-base-url:https://console.neon.tech/api/v2}")
    private String neonApiBaseUrl;

    @Value("${app.neon.compute-cu-hours-limit:100}")
    private double neonComputeCuHoursLimit;

    @Value("${app.neon.storage-bytes-limit:536870912}")
    private long neonStorageBytesLimit;

    @Value("${app.render.api-key:}")
    private String renderApiKey;

    @Value("${app.render.service-id:}")
    private String renderServiceId;

    @Value("${app.render.service-name:mssid-backend}")
    private String renderServiceName;

    @Value("${app.render.api-base-url:https://api.render.com/v1}")
    private String renderApiBaseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ResendEmailService resendEmailService;

    public InfraQuotaService(ObjectMapper objectMapper, ResendEmailService resendEmailService) {
        this.objectMapper = objectMapper;
        this.resendEmailService = resendEmailService;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(8000);
        this.restTemplate = new RestTemplate(factory);
    }

    /** Visible for tests that need to stub HTTP without hitting the real providers. */
    InfraQuotaService(ObjectMapper objectMapper, ResendEmailService resendEmailService, RestTemplate restTemplate) {
        this.objectMapper = objectMapper;
        this.resendEmailService = resendEmailService;
        this.restTemplate = restTemplate;
    }

    public InfraQuotasDto getQuotas() {
        CompletableFuture<ProviderQuota> resend = CompletableFuture.supplyAsync(this::fetchResend);
        CompletableFuture<ProviderQuota> neon = CompletableFuture.supplyAsync(this::fetchNeon);
        CompletableFuture<ProviderQuota> render = CompletableFuture.supplyAsync(this::fetchRender);
        try {
            CompletableFuture.allOf(resend, neon, render).get(12, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("[InfraQuotaService] Timed out waiting for one or more providers: {}", e.getMessage());
        }
        return InfraQuotasDto.builder()
                .fetchedAt(Instant.now().toString())
                .resend(joinOrTimeout(resend, "resend", "https://resend.com/settings/usage"))
                .neon(joinOrTimeout(neon, "neon", "https://console.neon.tech"))
                .render(joinOrTimeout(render, "render", "https://dashboard.render.com/billing#included-usage"))
                .build();
    }

    private ProviderQuota joinOrTimeout(CompletableFuture<ProviderQuota> future, String provider, String dashboardUrl) {
        try {
            return future.getNow(null) != null ? future.join() : errorQuota(provider, dashboardUrl, "Délai dépassé en interrogeant le fournisseur.");
        } catch (Exception e) {
            return errorQuota(provider, dashboardUrl, e.getMessage());
        }
    }

    private ProviderQuota fetchResend() {
        String dashboard = "https://resend.com/settings/usage";
        if (isBlank(resendApiKey)) {
            return notConfigured("resend", dashboard,
                    "Clé RESEND_API_KEY absente — déjà utilisée pour l'envoi, à exposer aussi au backend.");
        }
        try {
            Instant startOfDay = LocalDate.now(ALGIERS).atStartOfDay(ALGIERS).toInstant();
            Instant startOfMonth = LocalDate.now(ALGIERS).withDayOfMonth(1).atStartOfDay(ALGIERS).toInstant();
            int dailyUsed = 0;
            int monthlyUsed = 0;

            Optional<ResendEmailService.QuotaHint> hint = resendEmailService.getLastQuotaHint();
            boolean hintIsToday = hint.isPresent() && hint.get().capturedAt().isAfter(startOfDay);
            if (hintIsToday && hint.get().dailyUsed() != null) {
                dailyUsed = hint.get().dailyUsed();
            }
            if (hint.isPresent() && hint.get().monthlyUsed() != null && hint.get().capturedAt().isAfter(startOfMonth)) {
                monthlyUsed = hint.get().monthlyUsed();
            }

            // Headers from the last send can be hours stale. Counting list-emails for "today" is
            // exact on the free plan (cap 100/day = one page). Monthly falls back to pagination
            // only when we have no header snapshot for this billing month.
            EmailCounts counts = countResendEmails(startOfDay, startOfMonth);
            if (!hintIsToday) {
                dailyUsed = counts.daily;
            }
            if (monthlyUsed == 0) {
                monthlyUsed = counts.monthly;
            } else {
                monthlyUsed = Math.max(monthlyUsed, counts.monthly);
            }

            return ProviderQuota.builder()
                    .provider("resend")
                    .status("ok")
                    .dashboardUrl(dashboard)
                    .meters(List.of(
                            meter("emails_daily", "E-mails aujourd'hui", dailyUsed, resendDailyLimit, "emails"),
                            meter("emails_monthly", "E-mails ce mois", monthlyUsed, resendMonthlyLimit, "emails")
                    ))
                    .build();
        } catch (Exception e) {
            log.warn("[InfraQuotaService] Resend quota fetch failed: {}", e.getMessage());
            return errorQuota("resend", dashboard, e.getMessage());
        }
    }

    private EmailCounts countResendEmails(Instant startOfDay, Instant startOfMonth) {
        int daily = 0;
        int monthly = 0;
        String after = null;
        for (int page = 0; page < RESEND_MAX_PAGES; page++) {
            UriComponentsBuilder uri = UriComponentsBuilder.fromUriString(resendApiUrl)
                    .queryParam("limit", RESEND_LIST_PAGE_SIZE);
            if (after != null) {
                uri.queryParam("after", after);
            }
            JsonNode root = getJson(uri.toUriString(), resendApiKey);
            JsonNode data = root.path("data");
            if (!data.isArray() || data.isEmpty()) {
                break;
            }
            boolean hitPreviousMonth = false;
            String lastId = null;
            for (JsonNode email : data) {
                lastId = text(email, "id");
                Instant created = parseResendDate(text(email, "created_at"));
                if (!created.isBefore(startOfDay)) {
                    daily++;
                }
                if (!created.isBefore(startOfMonth)) {
                    monthly++;
                } else {
                    hitPreviousMonth = true;
                }
            }
            if (hitPreviousMonth || !root.path("has_more").asBoolean(false) || lastId == null) {
                break;
            }
            after = lastId;
        }
        return new EmailCounts(daily, monthly);
    }

    private ProviderQuota fetchNeon() {
        String dashboard = isBlank(neonProjectId)
                ? "https://console.neon.tech"
                : "https://console.neon.tech/app/projects/" + neonProjectId;
        if (isBlank(neonApiKey) || isBlank(neonProjectId)) {
            return notConfigured("neon", dashboard,
                    "Renseigner NEON_API_KEY et NEON_PROJECT_ID (Console → Account settings → API keys, l'id est dans l'URL du projet).");
        }
        try {
            JsonNode projectRoot = getJson(neonApiBaseUrl + "/projects/" + neonProjectId, neonApiKey);
            JsonNode project = projectRoot.has("project") ? projectRoot.get("project") : projectRoot;

            Double storageBytes = firstNumber(project, "synthetic_storage_size", "synthetic_storage_size_bytes");
            Double computeCuHours = firstNumber(project,
                    "current_period_compute_time_seconds", "compute_time_seconds", "cpu_used_sec");
            if (computeCuHours != null) {
                computeCuHours = computeCuHours / 3600.0;
            }

            Consumption extras = fetchNeonConsumption();
            if (extras.cuHours != null) {
                computeCuHours = extras.cuHours;
            }
            if (extras.storageBytes != null && storageBytes == null) {
                storageBytes = extras.storageBytes;
            }
            List<Meter> meters = new ArrayList<>();
            if (computeCuHours != null) {
                meters.add(meter("compute_cu_hours", "Compute Neon (CU-h / mois)", round2(computeCuHours), neonComputeCuHoursLimit, "CU-h"));
            }
            if (storageBytes != null) {
                meters.add(meter("storage_gb", "Stockage Neon", round3(storageBytes / (1024.0 * 1024.0 * 1024.0)),
                        neonStorageBytesLimit / (1024.0 * 1024.0 * 1024.0), "Go"));
            }
            if (extras.transferBytes != null) {
                meters.add(meter("transfer_gb", "Transfert réseau Neon", round3(extras.transferBytes / (1024.0 * 1024.0 * 1024.0)), 5.0, "Go"));
            }

            String note = null;
            if (computeCuHours == null) {
                note = "Le plan Free Neon n'expose pas toujours les CU-heures via l'API. Le stockage ci-dessus est réel ; le compute se lit aussi sur le Dashboard du projet.";
            }

            return ProviderQuota.builder()
                    .provider("neon")
                    .status("ok")
                    .dashboardUrl(dashboard)
                    .note(note)
                    .meters(meters)
                    .build();
        } catch (Exception e) {
            log.warn("[InfraQuotaService] Neon quota fetch failed: {}", e.getMessage());
            return errorQuota("neon", dashboard, e.getMessage());
        }
    }

    /**
     * Best-effort. Consumption history v2 is 403 on Free; legacy is Scale+. We try both and
     * swallow plan errors so the GET /projects path still fills storage.
     */
    private Consumption fetchNeonConsumption() {
        Instant now = Instant.now();
        Instant from = LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        String fromIso = DateTimeFormatter.ISO_INSTANT.format(from);
        String toIso = DateTimeFormatter.ISO_INSTANT.format(now);
        try {
            if (!isBlank(neonOrgId)) {
                String url = UriComponentsBuilder.fromUriString(neonApiBaseUrl + "/consumption_history/v2/projects")
                        .queryParam("from", fromIso)
                        .queryParam("to", toIso)
                        .queryParam("granularity", "monthly")
                        .queryParam("org_id", neonOrgId)
                        .queryParam("project_ids", neonProjectId)
                        .queryParam("metrics", "compute_unit_seconds,public_network_transfer_bytes,root_branch_bytes_month")
                        .toUriString();
                JsonNode root = getJson(url, neonApiKey);
                Double cuSeconds = sumNamedMetric(root, "compute_unit_seconds");
                Double transfer = sumNamedMetric(root, "public_network_transfer_bytes");
                Double storage = sumNamedMetric(root, "root_branch_bytes_month");
                return new Consumption(cuSeconds != null ? cuSeconds / 3600.0 : null, storage, transfer);
            }
        } catch (Exception e) {
            log.info("[InfraQuotaService] Neon consumption v2 unavailable (normal on Free): {}", e.getMessage());
        }
        try {
            String url = UriComponentsBuilder.fromUriString(neonApiBaseUrl + "/consumption_history/projects")
                    .queryParam("from", fromIso)
                    .queryParam("to", toIso)
                    .queryParam("granularity", "monthly")
                    .queryParam("project_ids", neonProjectId)
                    .toUriString();
            JsonNode root = getJson(url, neonApiKey);
            Double computeSeconds = sumField(root, "compute_time_seconds");
            Double storage = sumField(root, "synthetic_storage_size_bytes");
            return new Consumption(computeSeconds != null ? computeSeconds / 3600.0 : null, storage, null);
        } catch (Exception e) {
            log.info("[InfraQuotaService] Neon legacy consumption unavailable (normal on Free): {}", e.getMessage());
            return new Consumption(null, null, null);
        }
    }

    private ProviderQuota fetchRender() {
        String dashboard = "https://dashboard.render.com/billing#included-usage";
        if (isBlank(renderApiKey)) {
            return notConfigured("render", dashboard,
                    "Renseigner RENDER_API_KEY (Account Settings → API Keys). Les 750 h d'instance ne sont pas exposées par l'API : le lien Billing reste la source pour ce chiffre.");
        }
        try {
            JsonNode service = findRenderService();
            if (service == null) {
                return errorQuota("render", dashboard,
                        "Service '" + renderServiceName + "' introuvable. Vérifier RENDER_SERVICE_ID ou RENDER_SERVICE_NAME.");
            }
            String id = text(service, "id");
            String name = text(service, "name");
            String suspended = text(service, "suspended");
            JsonNode details = service.path("serviceDetails");
            String plan = text(details, "plan");
            String region = text(details, "region");

            List<Meter> meters = new ArrayList<>();
            Double cpu = lastMetricValue(renderApiBaseUrl + "/metrics/cpu?resource=" + id);
            if (cpu != null) {
                meters.add(meter("cpu_percent", "CPU live (fraction de cœur)", round2(cpu), 0.1, "cœur"));
            }
            Double memory = lastMetricValue(renderApiBaseUrl + "/metrics/memory?resource=" + id);
            if (memory != null) {
                double memoryMb = toMegabytes(memory);
                meters.add(meter("memory_mb", "RAM live", round1(memoryMb), 512.0, "Mo"));
            }

            String statusNote = "plan=" + (plan.isEmpty() ? "?" : plan)
                    + (region.isEmpty() ? "" : " · " + region)
                    + (suspended.isEmpty() ? "" : " · " + suspended)
                    + " · " + name
                    + ". Les 750 heures d'instance free ne sont pas dans l'API publique — ouvrir Billing.";

            return ProviderQuota.builder()
                    .provider("render")
                    .status("ok")
                    .dashboardUrl(dashboard)
                    .note(statusNote)
                    .meters(meters)
                    .build();
        } catch (Exception e) {
            log.warn("[InfraQuotaService] Render quota fetch failed: {}", e.getMessage());
            return errorQuota("render", dashboard, e.getMessage());
        }
    }

    private JsonNode findRenderService() {
        if (!isBlank(renderServiceId)) {
            JsonNode one = getJson(renderApiBaseUrl + "/services/" + renderServiceId, renderApiKey);
            return one.has("service") ? one.get("service") : one;
        }
        JsonNode list = getJson(renderApiBaseUrl + "/services?limit=50", renderApiKey);
        if (list.isArray()) {
            for (JsonNode item : list) {
                JsonNode service = item.has("service") ? item.get("service") : item;
                if (renderServiceName.equalsIgnoreCase(text(service, "name"))) {
                    return service;
                }
            }
        }
        return null;
    }

    private Double lastMetricValue(String url) {
        try {
            JsonNode root = getJson(url, renderApiKey);
            JsonNode series = root.isArray() ? root : root.path("filtered");
            if (!series.isArray() || series.isEmpty()) {
                return null;
            }
            JsonNode values = series.get(0).path("values");
            if (!values.isArray() || values.isEmpty()) {
                return null;
            }
            JsonNode last = values.get(values.size() - 1);
            if (last.has("value") && last.get("value").isNumber()) {
                return last.get("value").asDouble();
            }
            return null;
        } catch (Exception e) {
            log.info("[InfraQuotaService] Render metric skipped: {}", e.getMessage());
            return null;
        }
    }

    private JsonNode getJson(String url, String bearer) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(bearer);
        headers.set("Accept", "application/json");
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), String.class);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new IllegalStateException("HTTP " + response.getStatusCode().value() + " from " + url);
        }
        try {
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            throw new IllegalStateException("JSON illisible depuis " + url, e);
        }
    }

    private static Meter meter(String id, String label, double used, double limit, String unit) {
        return Meter.builder().id(id).label(label).used(used).limit(limit).unit(unit).build();
    }

    private static ProviderQuota notConfigured(String provider, String dashboardUrl, String note) {
        return ProviderQuota.builder()
                .provider(provider)
                .status("not_configured")
                .dashboardUrl(dashboardUrl)
                .note(note)
                .meters(List.of())
                .build();
    }

    private static ProviderQuota errorQuota(String provider, String dashboardUrl, String error) {
        return ProviderQuota.builder()
                .provider(provider)
                .status("error")
                .dashboardUrl(dashboardUrl)
                .error(error)
                .meters(List.of())
                .build();
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static String text(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? "" : value.asText();
    }

    private static Double firstNumber(JsonNode node, String... fields) {
        for (String field : fields) {
            JsonNode value = node.path(field);
            if (value.isNumber()) {
                return value.asDouble();
            }
        }
        return null;
    }

    private static Double sumNamedMetric(JsonNode root, String metricName) {
        double total = 0;
        boolean found = false;
        for (JsonNode metric : root.findValues("metrics")) {
            if (!metric.isArray()) continue;
            for (JsonNode item : metric) {
                if (metricName.equals(item.path("metric_name").asText()) && item.path("value").isNumber()) {
                    total += item.get("value").asDouble();
                    found = true;
                }
            }
        }
        return found ? total : null;
    }

    private static Double sumField(JsonNode root, String field) {
        double total = 0;
        boolean found = false;
        for (JsonNode value : root.findValues(field)) {
            if (value.isNumber()) {
                total += value.asDouble();
                found = true;
            }
        }
        return found ? total : null;
    }

    private static Instant parseResendDate(String raw) {
        if (raw == null || raw.isBlank()) {
            return Instant.EPOCH;
        }
        String normalized = raw.trim().replace(' ', 'T');
        if (normalized.endsWith("+00")) {
            normalized = normalized.substring(0, normalized.length() - 3) + "Z";
        }
        try {
            return Instant.parse(normalized);
        } catch (Exception ignored) {
            try {
                return OffsetDateTime.parse(normalized).toInstant();
            } catch (Exception ignoredAgain) {
                return Instant.EPOCH;
            }
        }
    }

    /** Render memory series is GB (~0.2–0.5), MB (~200–500), or bytes (hundreds of thousands+). */
    private static double toMegabytes(double raw) {
        if (raw > 10_000) {
            return raw / (1024.0 * 1024.0);
        }
        if (raw <= 16) {
            return raw * 1024.0;
        }
        return raw;
    }

    private static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private static double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private static double round3(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }

    private record EmailCounts(int daily, int monthly) {}

    private record Consumption(Double cuHours, Double storageBytes, Double transferBytes) {}
}
