/**
 * The site's backend: a single Google Apps Script web app.
 *
 * One deployment serves everything — the Notes wall (list + add) and the
 * blessing receipt — routed by an `action` field. Set its /exec URL in a .env
 * file as VITE_APPS_SCRIPT_URL. See docs/integrations.md for the walkthrough,
 * and scripts/apps-script/Code.gs for the script itself.
 *
 * While the URL is empty the site runs in DEMO mode: the Notes wall reads and
 * writes the visitor's own browser storage, and the blessing confirmation
 * completes without sending a receipt. Nothing is lost, nothing is shared.
 */
export const appsScriptUrl = ((import.meta.env.VITE_APPS_SCRIPT_URL ?? "") as string).trim();

/** True once a real Apps Script deployment is wired up. */
export const backendEnabled = Boolean(appsScriptUrl);

/**
 * POST a JSON payload to the web app.
 *
 * The content type is deliberately `text/plain`: it keeps this a "simple"
 * CORS request so the browser skips the preflight that Apps Script web apps
 * cannot answer. Do not change it to application/json.
 */
export async function postToBackend(payload: Record<string, unknown>): Promise<Response> {
  return fetch(appsScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}
