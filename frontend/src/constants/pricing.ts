// Single source of truth for the displayed subscription price — mirrors the backend's
// app.payments.subscription-price-dzd (PaymentServiceImpl), which is what actually gets enforced
// server-side. Keep both in sync manually if the price ever changes; there is no shared config
// source between the two apps.
export const SUBSCRIPTION_PRICE_DZD = 1500;
