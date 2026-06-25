import { paymentsConfig } from "@/config/payments";

/** Minimal shape of the Paystack inline global we rely on. */
type PaystackHandler = { openIframe: () => void };
type PaystackPop = { setup: (options: Record<string, unknown>) => PaystackHandler };

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

let loadPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.PaystackPop) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Paystack"));
    };
    document.head.appendChild(s);
  });
  return loadPromise;
}

export const paystackReady = () => Boolean(paymentsConfig.paystackPublicKey);

/** Open the Paystack checkout for a blessing of `amountNaira`. */
export async function openPaystack(opts: {
  email: string;
  amountNaira: number;
  name: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}): Promise<void> {
  await loadScript();
  if (!window.PaystackPop) throw new Error("Paystack unavailable");
  const handler = window.PaystackPop.setup({
    key: paymentsConfig.paystackPublicKey,
    email: opts.email,
    amount: Math.round(opts.amountNaira * 100), // kobo
    currency: paymentsConfig.currency,
    metadata: {
      custom_fields: [
        { display_name: "Guest", variable_name: "guest", value: opts.name || "A wellwisher" },
        { display_name: "Purpose", variable_name: "purpose", value: "Wedding blessing" },
      ],
    },
    callback: (response: { reference: string }) => opts.onSuccess(response.reference),
    onClose: () => opts.onClose?.(),
  });
  handler.openIframe();
}
