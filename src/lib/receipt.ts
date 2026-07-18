import { paymentsConfig } from "@/config/payments";

/**
 * Send a payment confirmation so the couple can email the guest a receipt and
 * log the blessing. This is a best-effort POST to a Google Apps Script web app
 * (see docs/integrations.md). Until VITE_RECEIPT_ENDPOINT is set, it runs in
 * placeholder mode: it simply resolves after a short beat so the giving flow
 * can be experienced end to end without a backend.
 *
 * It never throws — a failed receipt must not block a guest who has already
 * sent their transfer from reaching the thank-you page.
 */
export async function sendReceipt(input: {
  name: string;
  email: string;
  amountNaira: number;
}): Promise<{ ok: boolean; sent: boolean }> {
  const endpoint = paymentsConfig.receiptEndpoint;

  if (!endpoint) {
    // Placeholder flow — pretend to notify, resolve so the UI can proceed.
    await new Promise((r) => setTimeout(r, 700));
    return { ok: true, sent: false };
  }

  try {
    // text/plain keeps this a "simple" request so the browser skips the CORS
    // preflight that Apps Script web apps do not answer.
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "receipt",
        name: input.name.trim() || "A wellwisher",
        email: input.email.trim(),
        amount: input.amountNaira,
        currency: paymentsConfig.currency,
        createdAt: Date.now(),
      }),
    });
    return { ok: true, sent: true };
  } catch {
    return { ok: false, sent: false };
  }
}
