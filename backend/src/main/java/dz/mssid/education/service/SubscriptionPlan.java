package dz.mssid.education.service;

public record SubscriptionPlan(String id, int months, double priceDzd) {
    /** New orders expose only the currently sold plans. Existing receipts keep their stored duration. */
    public static SubscriptionPlan forNewPurchase(String id) {
        if (!"P3M".equals(id) && !"P12M".equals(id)) throw new IllegalArgumentException("Choisissez une formule de 3 ou 12 mois");
        return resolve(id);
    }
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
