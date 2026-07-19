# Integrations guide

The site has one backend: a **single Google Apps Script web app** attached to a
Google Sheet. That one deployment powers both live features:

1. **Notes wall** (`/notes`) — guests read and post blessings; each new note
   emails you.
2. **Blessings** (`/registry`) — bank-transfer gifts, with an emailed receipt.

Everything reads from a `.env` file. Copy `.env.example` to `.env`, fill in the
URL, and **restart the dev server** (Vite only reads env at startup). Never
commit `.env` — it is gitignored.

> **Until you set the URL, nothing is broken.** The site runs in DEMO mode: the
> Notes wall uses the visitor's own browser storage and no email is sent.

---

## 1. Set up the backend (do this once)

### 1.1 Create the sheet

Create a Google Sheet — call it something like **"E&T Backend"**. You do **not**
need to add any tabs or headers: the script creates the `Notes` and `Gifts` tabs,
with their header rows, the first time each is used.

### 1.2 Add the script

In the sheet: **Extensions → Apps Script**. Delete whatever is there and paste the
entire contents of [`scripts/apps-script/Code.gs`](../scripts/apps-script/Code.gs)
from this repo. Save.

The script is kept in the repo so it is version-controlled — treat that file as
the source of truth and re-paste it whenever it changes.

At the top of the file you can adjust:

```js
var COUPLE_EMAIL = "thephenomenalunion@gmail.com";  // where notifications go
var SENDER_NAME  = "The Phenomenal Union";          // sender name on outgoing mail
```

### 1.3 Deploy as a web app

1. **Deploy → New deployment → type: Web app**.
2. **Execute as: Me**.
3. **Who has access: Anyone** — this is required. Guests are not signed in to
   Google, so anything stricter returns a login page instead of your data.
4. Authorise when prompted (it is your own script, on your own sheet). Google
   will warn that the app is unverified — that is expected for a personal script;
   choose **Advanced → Go to … (unsafe)** to continue.
5. Copy the **Web app URL** (it ends in `/exec`).

```bash
# .env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb..../exec
```

Restart the dev server. The Notes wall is now live and shared between all guests.

> **Re-deploying:** after you edit the script, use **Deploy → Manage deployments
> → Edit (pencil) → Version: New version → Deploy**. If you skip this, the `/exec`
> URL keeps serving your *old* code. This is the single most common mistake.

---

## 2. Notes wall

### 2.1 How it works

| Direction | Request | What happens |
|---|---|---|
| Page load | `GET ?action=list` | Returns approved notes, newest first |
| Guest posts | `POST {action:"add", name, message}` | Appends a row, emails you, then the page re-runs the `GET` so the guest sees their note appear |

Names are capped at 80 characters and messages at 500, on both the client and the
server.

### 2.2 Moderation — publish now, retract if needed

Notes are saved with **`approved = TRUE`**, so they appear immediately. This is
deliberate: the guest gets the satisfaction of seeing their blessing land.

To take a note down, open the `Notes` tab and set that row's **`approved` cell to
`FALSE`**. It disappears for everyone on the next page load, and it is never sent
to the browser again. The email is your alarm; the sheet is your off switch.

Keep the sheet handy on your phone the week of the wedding.

### 2.3 The notification email

Every new note emails `COUPLE_EMAIL` with the guest's name, the note itself, the
Lagos timestamp, and a button straight to the sheet. It is HTML-formatted to match
the site (emerald, gilt, Georgia) with a plain-text fallback for older clients.

Guest text is HTML-escaped before it reaches the email, so a note containing
markup cannot break or inject anything into your inbox.

---

## 3. Blessings (bank transfer + receipt)

The Blessings page collects gifts by **bank transfer** — no payment processor, no
keys, no fees.

1. A guest picks (or types) an amount and enters their name and email.
2. The page shows **your account details boldly** plus a suggested reference.
3. They transfer in their own banking app, then press
   **"I have sent it · Confirm payment"**.
4. That POSTs `{action:"receipt", …}`, which logs the gift to the `Gifts` tab,
   emails the guest a receipt, and notifies you — then they land on the
   thank-you page.

### 3.1 Set your account details (no code)

Edit `src/content/payments.json` — the only file most people need to touch:

```json
{
  "currency": "NGN",
  "presets": [20000, 50000, 100000, 250000, 500000],
  "bankName": "United Bank for Africa (UBA)",
  "accountName": "Tiwalade Omotosho",
  "accountNumber": "2081599431",
  "transactionDescription": "Wedding blessing for E&T"
}
```

- `presets` are the suggested-amount buttons; guests can still enter any amount.
- `transactionDescription` is the reference shown to guests (the page appends the
  guest's name so you can reconcile transfers).

### 3.2 This is a self-reported confirmation

The guest presses "I have sent it" before the money has necessarily cleared. Treat
the `Gifts` tab as a list of **pledges** and reconcile it against your bank
statement before thanking anyone as a confirmed donor. Because there is no payment
processor, there is no secret key, webhook, or signature to manage.

---

## 4. Notes and gotchas

- **CORS:** the frontend posts as `text/plain` on purpose, so the browser treats it
  as a "simple" request and skips the preflight that Apps Script cannot answer.
  **Do not change that content type.** The `GET` redirects via
  `script.googleusercontent.com`; `fetch` follows it automatically.
- **Email quota:** a free Google account sends ~100 emails/day. Ample here, and
  mail sending is wrapped in `try/catch` — if it ever fails, the note is still
  saved.
- **Backup:** the sheet *is* your database. `File → Version history` is your undo.
  Export a copy after the day.
- **Spam:** notes are public the moment they are posted. If the link spreads
  widely, consider adding a honeypot field or a simple rate check to `doPost`.

## 5. Go-live checklist

- [ ] Script pasted from `scripts/apps-script/Code.gs` and deployed as a **Web app**
      (Execute as **Me**, Access **Anyone**).
- [ ] `VITE_APPS_SCRIPT_URL` set in production (Vercel → Settings → Environment
      Variables) and locally in `.env`.
- [ ] Posted a test note → row in `Notes` with `approved=TRUE`, email received,
      note visible on the wall.
- [ ] Set that row's `approved` to `FALSE` → note disappears on reload.
- [ ] Real account details in `src/content/payments.json`.
- [ ] One test transfer + confirm → row in `Gifts`, receipt email received.
- [ ] Re-deployed a **New version** after any script edit.
