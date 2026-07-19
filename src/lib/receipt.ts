import { paymentsConfig } from "@/config/payments";
import { backendEnabled, postToBackend } from "@/config/backend";

/**
 * Send a payment confirmation so the couple can log the blessing and the guest
 * gets an emailed receipt. Handled by the shared Apps Script web app
 * (scripts/apps-script/Code.gs, action "receipt").
 *
 * Until VITE_APPS_SCRIPT_URL is set this runs in placeholder mode: it resolves
 * after a short beat so the giving flow can be experienced without a backend.
 *
 * It never throws — a failed receipt must not block a guest who has already
 * sent their transfer from reaching the thank-you page.
 */
export async function sendReceipt(input: {
  name: string;
  email: string;
  amountNaira: number;
}): Promise<{ ok: boolean; sent: boolean }> {
  if (!backendEnabled) {
    // Placeholder flow — pretend to notify, resolve so the UI can proceed.
    await new Promise((r) => setTimeout(r, 700));
    return { ok: true, sent: false };
  }

  try {
    await postToBackend({
      action: "receipt",
      name: input.name.trim() || "A wellwisher",
      email: input.email.trim(),
      amount: input.amountNaira,
      currency: paymentsConfig.currency,
      createdAt: Date.now(),
    });
    return { ok: true, sent: true };
  } catch {
    return { ok: false, sent: false };
  }
}
