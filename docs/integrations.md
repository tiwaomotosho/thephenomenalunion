# Integrations guide

How to take the two live features from demo to production:

1. **Paystack** — receiving blessings (money gifts).
2. **Notes wall** — a guestbook backed by Google Sheets + Apps Script.

Everything in the site reads from a `.env` file. Copy `.env.example` to `.env`,
fill in values, and **restart the dev server** (Vite only reads env at startup).
Never commit `.env` — it is gitignored. Only variables prefixed with `VITE_` are
exposed to the browser, so never put a **secret** key in one.

---

## 1. Paystack

Right now the Blessings page (`/registry`) is in **demo mode**: clicking "Bless
the couple" shows a simulated success and no money moves. It switches to real
payments automatically the moment you set `VITE_PAYSTACK_PUBLIC_KEY`.

### 1.1 Create and activate your account

1. Go to <https://paystack.com> and sign up. Choose **Nigeria** and **NGN**.
2. In the dashboard, open **Settings → Business** (also called *Compliance* or
   *Get Started / Activate Business*) and complete:
   - **Business profile**: name, category, description, website
     (your deployed URL), support email and phone.
   - **Settlement account**: the Nigerian bank account where payouts land.
     Paystack does a small test transfer to confirm it.
   - **Identity / KYC verification**:
     - *Starter business* (sole proprietor / individual): your **BVN**, a
       government ID (NIN, driver's licence, or passport), and a selfie.
     - *Registered business*: add your **CAC/RC number** and business
       documents in addition to a director's ID.
3. Submit for review. Test mode works immediately; **live keys only work after
   your business is approved** (usually a day or two).

### 1.2 Get your API keys

Dashboard → **Settings → API Keys & Webhooks**. You get four keys:

| Key | Prefix | Where it goes |
|---|---|---|
| Test Public | `pk_test_` | frontend `.env` while testing |
| Test Secret | `sk_test_` | **server only** — never in the frontend |
| Live Public | `pk_live_` | frontend `.env` in production |
| Live Secret | `sk_live_` | **server only** — never in the frontend |

> **Golden rule:** the **public** key can sit in the browser. The **secret** key
> verifies transactions and must live only on a server (a serverless function or
> Apps Script). If a secret key ever leaks, click **Roll key** in the dashboard.

### 1.3 Turn on real payments (frontend — already built)

The inline checkout is already implemented in `src/lib/paystack.ts` and used by
`src/routes/registry.tsx`. To go live:

```bash
# .env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxx   # then pk_live_xxxx for production
```

Restart the dev server. The "Demonstration" note disappears, and the button now
opens the real Paystack popup (cards, bank transfer, USSD). On success the guest
is sent to the thank-you page. Amounts are taken in **kobo** (we multiply Naira
by 100 for you). Preset buttons and the custom field live in
`src/config/payments.ts`.

### 1.4 Verify every payment (server — strongly recommended)

The browser `callback` tells you a payment *looks* successful, but a guest could
fake it. Before you treat a blessing as real (e.g. send a thank-you, log it to a
sheet), **verify it server-side** with your secret key:

```
GET https://api.paystack.co/transaction/verify/{reference}
Authorization: Bearer sk_live_xxxx
```

Check that `data.status === "success"` **and** `data.amount` equals what you
expected. Two easy places to do this without a traditional backend:

**Option A — Vercel serverless function** (this project deploys on Vercel).
Create `api/verify.ts` (set `PAYSTACK_SECRET_KEY` in Vercel → Project →
Settings → Environment Variables — note: **no** `VITE_` prefix, so it stays
server-side):

```ts
export default async function handler(req: Request) {
  const { reference } = await req.json();
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const json = await res.json();
  const ok = json.data?.status === "success";
  return new Response(JSON.stringify({ ok, amount: json.data?.amount }), {
    headers: { "content-type": "application/json" },
  });
}
```

Then in `registry.tsx`'s `onSuccess`, `POST` the `reference` to `/api/verify`
before navigating to the thank-you page.

**Option B — Google Apps Script** (if you would rather keep everything in
Sheets): use the same script as the Notes wall (section 2) with an extra
`doPost` branch that takes the reference, calls the verify URL with
`UrlFetchApp`, and appends the gift to a "Gifts" sheet. Keep the secret key in
**Script Properties**, never in client code.

### 1.5 Webhooks (the reliable way to record gifts)

A guest might close the tab before the callback fires. Webhooks fix this:
Paystack calls *your* server for every event.

1. Dashboard → **Settings → API Keys & Webhooks → Webhook URL**: paste your
   endpoint (the Vercel function or the Apps Script `/exec` URL).
2. On each call, **verify the signature** so you know it is really Paystack.
   It is an HMAC SHA-512 of the raw request body using your **secret key**,
   sent in the `x-paystack-signature` header:

   ```ts
   import crypto from "node:crypto";
   const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
     .update(rawBody).digest("hex");
   if (hash !== req.headers["x-paystack-signature"]) return; // reject
   ```
3. When the event is `charge.success`, record the gift (donor name from
   `data.metadata`, amount, reference) to your Gifts sheet.

### 1.6 Go-live checklist

- [ ] Business approved; live keys visible in the dashboard.
- [ ] `VITE_PAYSTACK_PUBLIC_KEY` set to the **live** public key in production.
- [ ] Secret key set only on the server (Vercel env var or Apps Script property).
- [ ] Server-side verify and/or webhook wired and signature-checked.
- [ ] One real low-value transaction tested end to end, then refunded.

---

## 2. Notes wall (Google Sheets + Apps Script)

The Notes wall (`/notes`) currently stores entries in the visitor's own browser
(local storage), which is perfect for previewing. To collect notes centrally and
moderate them, point it at a Google Apps Script web app. The frontend is already
wired: set `VITE_NOTES_ENDPOINT` and it uses the backend; leave it empty and it
stays local.

### 2.1 Create the sheet

1. Create a new Google Sheet, e.g. **"E&T Notes"**.
2. Row 1 headers, exactly: `id` · `name` · `message` · `approved` · `createdAt`.
3. `approved` holds `TRUE`/`FALSE`; `createdAt` holds an epoch number (ms).
   To moderate, you simply flip a row's `approved` to `TRUE`.

### 2.2 Add the Apps Script

In the sheet: **Extensions → Apps Script**, replace the contents with:

```js
const SHEET = "Sheet1"; // rename if your tab is named differently

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET ?action=list  → returns approved notes
function doGet(e) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
  const rows = sh.getDataRange().getValues();
  rows.shift(); // drop header
  const notes = rows.map(r => ({
    id: String(r[0]),
    name: String(r[1]),
    message: String(r[2]),
    approved: r[3] === true || String(r[3]).toUpperCase() === "TRUE",
    createdAt: Number(r[4]) || 0,
  }));
  return jsonOut({ notes });
}

// POST { action:"add", name, message } → appends a row, pending approval
function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  if (body.action === "add") {
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
    sh.appendRow([
      "note-" + Date.now(),
      (body.name || "Anonymous").toString().slice(0, 80),
      (body.message || "").toString().slice(0, 500),
      false,           // approved → you flip this to TRUE to publish
      Date.now(),
    ]);
    return jsonOut({ ok: true, pending: true });
  }
  return jsonOut({ ok: false });
}
```

### 2.3 Deploy as a web app

1. **Deploy → New deployment → type: Web app**.
2. **Execute as: Me**, **Who has access: Anyone**.
3. Authorise when prompted (it is your own script).
4. Copy the **Web app URL** (ends in `/exec`).

```bash
# .env
VITE_NOTES_ENDPOINT=https://script.google.com/macros/s/AKfycb..../exec
```

Restart the dev server. New notes now land in your sheet as `approved = FALSE`,
and only rows you flip to `TRUE` appear on the wall.

### 2.4 Notes and gotchas

- **Moderation:** notes are hidden until you set `approved` to `TRUE`. Keep the
  sheet open on your phone the week of the wedding to approve in seconds.
- **CORS:** the frontend posts as `text/plain` on purpose so the browser treats
  it as a "simple" request and skips the preflight that Apps Script cannot
  answer. Do not change that content type.
- **Re-deploying:** after editing the script, use **Deploy → Manage deployments
  → Edit → Version: New version** so the `/exec` URL serves your latest code.
- **Spam:** Apps Script has generous free quotas, but consider a hidden
  honeypot field or a simple rate check if the link spreads widely.
- **Backup:** the sheet *is* your database. `File → Version history` is your
  undo. Export a copy after the day.
