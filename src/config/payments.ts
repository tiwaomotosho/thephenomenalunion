/**
 * Blessings (money gifts) settings.
 *
 * Guests give by bank transfer: they pick an amount and leave their name and
 * email, then the page shows the couple's account details boldly and asks them
 * to confirm once they have sent the transfer. On confirm, a payment
 * confirmation (name, email, amount) is POSTed to an optional Google Apps
 * Script web app that emails them a receipt, and they land on the thank-you
 * page.
 *
 * EDIT THE ACCOUNT DETAILS in src/content/payments.json — no code needed:
 *   bankName, accountName, accountNumber, transactionDescription, presets.
 *
 * The receipt endpoint is a secret-free Apps Script URL set in a .env file as
 * VITE_RECEIPT_ENDPOINT=... (see docs/integrations.md). While it is empty the
 * confirmation runs in a harmless placeholder mode: the flow completes and the
 * guest reaches the thank-you page, but no receipt email is actually sent.
 */
import data from "@/content/payments.json";

const receiptEndpoint = (import.meta.env.VITE_RECEIPT_ENDPOINT ?? "") as string;

export const paymentsConfig = {
  ...data,
  /** Google Apps Script URL that emails receipts; empty → placeholder mode. */
  receiptEndpoint,
  /** True once a real endpoint is set. */
  receiptEnabled: Boolean(receiptEndpoint),
};
