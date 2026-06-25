/**
 * Paystack settings for receiving blessings (gifts) toward the couple's home.
 * There is no goal and no expiry; this simply opens a secure payment.
 *
 * Set your public key in a .env file as VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxx
 * (or pk_test_xxx while testing). See docs/integrations.md for the full setup.
 *
 * While no key is set, the page runs in DEMO MODE: the give button opens a
 * simulated checkout so you can feel the flow without taking any real payment.
 */
const key = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? "") as string;

export const paymentsConfig = {
  paystackPublicKey: key,
  /** True when no real key is set — the give button simulates a payment. */
  demoMode: !key,
  currency: "NGN",
  /** Suggested amounts in Naira; guests can also enter their own. */
  presets: [20000, 50000, 100000, 250000, 500000],
};
