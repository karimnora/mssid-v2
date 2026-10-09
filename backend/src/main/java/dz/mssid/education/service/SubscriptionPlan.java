package dz.mssid.education.service;

public record SubscriptionPlan(String id, int months, double priceDzd) {
    public static SubscriptionPlan resolve(String id) {
        if (id == null || id.isBlank()) throw new IllegalArgumentException("Choisissez une formule de 3, 6 ou 12 mois");
        return switch (id) {
            case "P3M" -> new SubscriptionPlan(id, 3, 900);
            case "P6M" -> new SubscriptionPlan(id, 6, 1500);
            case "P12M" -> new SubscriptionPlan(id, 12, 2400);
            default -> throw new IllegalArgumentException("Formule d'abonnement inconnue");
        };
    }
}
