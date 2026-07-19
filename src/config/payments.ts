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
 * The receipt is sent by the shared Apps Script web app (see src/config/backend.ts
 * and docs/integrations.md). While VITE_APPS_SCRIPT_URL is empty the confirmation
 * runs in a harmless placeholder mode: the flow completes and the guest reaches
 * the thank-you page, but no receipt email is actually sent.
 */
import data from "@/content/payments.json";
import { backendEnabled } from "@/config/backend";

export const paymentsConfig = {
  ...data,
  /** True once the shared Apps Script deployment is wired up. */
  receiptEnabled: backendEnabled,
};
