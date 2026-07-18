# Integrations guide

How to take the two live features from demo to production:

1. **Blessings** — receiving money gifts by bank transfer, with an emailed receipt.
2. **Notes wall** — a guestbook backed by Google Sheets + Apps Script.

Everything in the site reads from a `.env` file. Copy `.env.example` to `.env`,
fill in values, and **restart the dev server** (Vite only reads env at startup).
Never commit `.env` — it is gitignored. Only variables prefixed with `VITE_` are
exposed to the browser, so never put a **secret** key in one.

---

## 1. Blessings (bank transfer + receipt)

The Blessings page (`/registry`) collects gifts by **bank transfer** — no
payment processor, no keys, no fees. The flow:

1. A guest picks (or types) an amount and enters their name and email.
2. The page shows **your account details boldly** and a suggested transfer
   reference.
3. They make the transfer in their own banking app, then press
   **"I have sent it · Confirm payment"**.
4. That fires a confirmation to your (optional) Apps Script, which emails them a
   receipt and logs the gift, and the guest lands on the thank-you page.

### 1.1 Set your account details (no code)

Edit `src/content/payments.json` — this is the only file most people need to
touch:

```json
{
  "currency": "NGN",
  "presets": [20000, 50000, 100000, 250000, 500000],
  "bankName": "Guaranty Trust Bank (GTBank)",
  "accountName": "Eniolaoluwa & Tiwalade Omotosho",
  "accountNumber": "0123456789",
  "transactionDescription": "Wedding blessing for E&T"
}
```

- `presets` are the suggested-amount buttons; guests can still enter any amount.
- `transactionDescription` is the reference shown to guests (the page appends
  the guest's name so you can reconcile transfers).

That is enough to go live — the confirm button works immediately. Without a
receipt endpoint (below) it runs in **placeholder mode**: the guest still
reaches the thank-you page, but no receipt email is sent.

### 1.2 Email receipts automatically (optional — Google Apps Script)

To email a receipt and keep a record of every confirmed gift, point the site at
a Google Apps Script web app. The frontend is already wired: set
`VITE_RECEIPT_ENDPOINT` and confirmations POST to it; leave it empty and the
flow stays in placeholder mode.

Create a Google Sheet (e.g. **"E&T Gifts"**) with row-1 headers
`name · email · amount · currency · createdAt`, then **Extensions → Apps
Script** and paste:

```js
const SHEET = "Sheet1"; // rename if your tab is named differently

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  if (body.action === "receipt") {
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
    sh.appendRow([body.name, body.email, body.amount, body.currency, body.createdAt]);

    const naira = "₦" + Number(body.amount).toLocaleString("en-NG");
    MailApp.sendEmail({
      to: body.email,
      subject: "Thank you for your blessing 💛",
      htmlBody:
        `Dear ${body.name},<br><br>` +
        `We have received your kind blessing of <b>${naira}</b> and are ` +
        `deeply grateful.<br><br>With love,<br>Eni &amp; Tiwa`,
    });
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: false }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy it: **Deploy → New deployment → Web app**, **Execute as: Me**,
**Who has access: Anyone**, authorise, and copy the `/exec` URL:

```bash
# .env
VITE_RECEIPT_ENDPOINT=https://script.google.com/macros/s/AKfycb..../exec
```

Restart the dev server. Confirmations now append a row to the sheet and email
the guest a receipt.

> **Note — this is a self-reported confirmation, not verified settlement.** The
> guest presses "I have sent it" before the money has necessarily cleared. Treat
> the Gifts sheet as a list of *pledges*, and reconcile it against your bank
> statement before you thank anyone as a confirmed donor. Because there is no
> payment processor, there is no secret key, webhook, or signature to manage.

### 1.3 Go-live checklist

- [ ] Real account details in `src/content/payments.json`.
- [ ] `VITE_RECEIPT_ENDPOINT` set (or accept placeholder mode with no receipts).
- [ ] Apps Script deployed as **New version** after any edit, so `/exec` is current.
- [ ] One test transfer + confirm, checked against the Gifts sheet and inbox.
- [ ] Reconcile the Gifts sheet against your bank statement before thanking donors.

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
