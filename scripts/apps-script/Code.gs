/**
 * The Phenomenal Union — Google Apps Script web app.
 *
 * One deployment serves the whole site backend:
 *   GET  ?action=list                          → the approved notes for the wall
 *   POST { action: "add", name, message }      → save a note + email the couple
 *   POST { action: "receipt", name, email, … } → log a gift + email the guest
 *
 * SETUP (see docs/integrations.md for the walkthrough)
 *   1. Create a Google Sheet, open Extensions → Apps Script, paste this file.
 *   2. Deploy → New deployment → Web app, "Execute as: Me",
 *      "Who has access: Anyone". Authorise when prompted.
 *   3. Put the /exec URL in the site's .env as VITE_APPS_SCRIPT_URL.
 *
 * The "Notes" and "Gifts" tabs (and their header rows) are created automatically
 * on first use — you do not need to set them up by hand.
 *
 * MODERATION: notes are saved with approved = TRUE so they appear immediately.
 * To retract one, set its `approved` cell to FALSE — it disappears on the next
 * page load. The e-mail notification is your alarm; the sheet is your off switch.
 */

/** Where new-note / new-gift notifications are sent. */
var COUPLE_EMAIL = "thephenomenalunion@gmail.com";

/** Shown as the sender name on outgoing mail. */
var SENDER_NAME = "The Phenomenal Union";

var NOTES_SHEET = "Notes";
var GIFTS_SHEET = "Gifts";

var NOTES_HEADERS = ["id", "name", "message", "approved", "createdAt", "createdAtReadable"];
var GIFTS_HEADERS = ["id", "name", "email", "amount", "currency", "createdAt", "createdAtReadable"];

/** Match the client-side caps in src/components/notes/NotesWall.tsx. */
var MAX_NAME = 80;
var MAX_MESSAGE = 500;

var TIMEZONE = "Africa/Lagos";

/* ─────────────────────────── Routing ─────────────────────────── */

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "list";
    if (action === "list") {
      return jsonOut_({ ok: true, notes: listNotes_() });
    }
    return jsonOut_({ ok: false, error: "Unknown action: " + action });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    if (body.action === "add") return addNote_(body);
    if (body.action === "receipt") return addReceipt_(body);

    return jsonOut_({ ok: false, error: "Unknown action: " + body.action });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

/* ─────────────────────────── Notes ─────────────────────────── */

/** Approved notes only, newest first. Retracted rows never leave the server. */
function listNotes_() {
  var sh = ensureSheet_(NOTES_SHEET, NOTES_HEADERS);
  var values = sh.getDataRange().getValues();
  values.shift(); // drop the header row

  var notes = [];
  for (var i = 0; i < values.length; i++) {
    var r = values[i];
    if (!r[0] && !r[2]) continue; // skip blank rows
    var approved = r[3] === true || String(r[3]).toUpperCase() === "TRUE";
    if (!approved) continue;
    notes.push({
      id: String(r[0]),
      name: String(r[1]),
      message: String(r[2]),
      approved: true,
      createdAt: Number(r[4]) || 0,
    });
  }

  notes.sort(function (a, b) {
    return b.createdAt - a.createdAt;
  });
  return notes;
}

function addNote_(body) {
  var name = clamp_(body.name, MAX_NAME) || "Anonymous";
  var message = clamp_(body.message, MAX_MESSAGE);

  if (!message) return jsonOut_({ ok: false, error: "A note cannot be empty." });

  var now = new Date();
  var id = "note-" + now.getTime();

  // Serialise appends so two guests submitting at once cannot collide.
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sh = ensureSheet_(NOTES_SHEET, NOTES_HEADERS);
    sh.appendRow([id, name, message, true, now.getTime(), readable_(now)]);
  } finally {
    lock.releaseLock();
  }

  // The note is saved; a mail failure must never fail the request.
  try {
    notifyCoupleOfNote_(name, message, now, id);
  } catch (err) {
    Logger.log("Note mail failed: " + err);
  }

  return jsonOut_({ ok: true, id: id, pending: false });
}

/* ─────────────────────────── Gifts / receipts ─────────────────────────── */

function addReceipt_(body) {
  var name = clamp_(body.name, MAX_NAME) || "A wellwisher";
  var email = clamp_(body.email, 160);
  var amount = Number(body.amount) || 0;
  var currency = clamp_(body.currency, 8) || "NGN";

  var now = new Date();
  var id = "gift-" + now.getTime();

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sh = ensureSheet_(GIFTS_SHEET, GIFTS_HEADERS);
    sh.appendRow([id, name, email, amount, currency, now.getTime(), readable_(now)]);
  } finally {
    lock.releaseLock();
  }

  try {
    if (email && email.indexOf("@") > -1) {
      sendGuestReceipt_(name, email, amount, currency, now);
    }
    notifyCoupleOfGift_(name, email, amount, currency, now);
  } catch (err) {
    Logger.log("Receipt mail failed: " + err);
  }

  return jsonOut_({ ok: true, id: id });
}

/* ─────────────────────────── E-mail ─────────────────────────── */

function notifyCoupleOfNote_(name, message, when, id) {
  var html = emailShell_(
    "A new note on the wall",
    "Someone just left a blessing for you.",
    '<tr><td style="padding:0 32px 8px;">' +
      fieldLabel_("From") +
      '<div style="font:400 20px/1.4 Georgia,serif;color:#06241b;">' + esc_(name) + "</div>" +
      "</td></tr>" +
      '<tr><td style="padding:18px 32px 8px;">' +
      fieldLabel_("Their note") +
      '<div style="border-left:3px solid #ab8330;padding:10px 0 10px 16px;font:italic 400 18px/1.7 Georgia,serif;color:#2a2a2a;">' +
      esc_(message) +
      "</div></td></tr>" +
      '<tr><td style="padding:18px 32px 0;">' +
      fieldLabel_("Received") +
      '<div style="font:400 15px/1.5 Georgia,serif;color:#2a2a2a;">' + esc_(readable_(when)) + " (WAT)</div>" +
      "</td></tr>" +
      '<tr><td style="padding:24px 32px 0;">' +
      '<a href="' + esc_(sheetUrl_()) + '" style="display:inline-block;background:#06241b;color:#fbf7ee;text-decoration:none;font:400 12px/1 Georgia,serif;letter-spacing:.22em;text-transform:uppercase;padding:14px 26px;border:1px solid #ab8330;">Open the notes sheet</a>' +
      "</td></tr>" +
      '<tr><td style="padding:16px 32px 0;font:400 13px/1.6 Georgia,serif;color:#6b6b6b;">' +
      "This note is already live on the wall. To take it down, set its <b>approved</b> cell to <b>FALSE</b>." +
      '<div style="margin-top:6px;color:#9a9a9a;font-size:12px;">Reference: ' + esc_(id) + "</div>" +
      "</td></tr>"
  );

  MailApp.sendEmail({
    to: COUPLE_EMAIL,
    subject: "New note from " + name + " — " + SENDER_NAME,
    htmlBody: html,
    body: name + " wrote:\n\n" + message + "\n\n" + readable_(when) + " (WAT)",
    name: SENDER_NAME,
  });
}

function sendGuestReceipt_(name, email, amount, currency, when) {
  var html = emailShell_(
    "Thank you for your blessing",
    "Received with full hearts.",
    '<tr><td style="padding:0 32px 8px;font:italic 400 18px/1.7 Georgia,serif;color:#2a2a2a;">' +
      "Dear " + esc_(name) + ",</td></tr>" +
      '<tr><td style="padding:10px 32px 0;font:italic 400 17px/1.7 Georgia,serif;color:#2a2a2a;">' +
      "We have received your kind blessing of" +
      '<div style="margin:14px 0;font:400 34px/1.2 Georgia,serif;color:#06241b;letter-spacing:.02em;">' +
      esc_(money_(amount, currency)) +
      "</div>" +
      "and we are quietly and deeply grateful. Thank you for standing with us as we build our first home together." +
      "</td></tr>" +
      '<tr><td style="padding:20px 32px 0;">' +
      fieldLabel_("Confirmed") +
      '<div style="font:400 15px/1.5 Georgia,serif;color:#2a2a2a;">' + esc_(readable_(when)) + " (WAT)</div>" +
      "</td></tr>" +
      '<tr><td style="padding:26px 32px 0;font:italic 400 17px/1.6 Georgia,serif;color:#2a2a2a;">' +
      "With love,<br><span style=\"font-size:22px;color:#ab8330;\">Eni &amp; Tiwa</span></td></tr>"
  );

  MailApp.sendEmail({
    to: email,
    subject: "Thank you for your blessing — " + SENDER_NAME,
    htmlBody: html,
    body:
      "Dear " + name + ",\n\nWe have received your kind blessing of " +
      money_(amount, currency) + " and are deeply grateful.\n\nWith love,\nEni & Tiwa",
    name: SENDER_NAME,
    replyTo: COUPLE_EMAIL,
  });
}

function notifyCoupleOfGift_(name, email, amount, currency, when) {
  var html = emailShell_(
    "A blessing was confirmed",
    "Someone has sent a gift toward your first home.",
    '<tr><td style="padding:0 32px 8px;">' +
      fieldLabel_("From") +
      '<div style="font:400 20px/1.4 Georgia,serif;color:#06241b;">' + esc_(name) + "</div>" +
      '<div style="font:400 14px/1.5 Georgia,serif;color:#6b6b6b;">' + esc_(email) + "</div>" +
      "</td></tr>" +
      '<tr><td style="padding:18px 32px 0;">' +
      fieldLabel_("Amount") +
      '<div style="font:400 30px/1.2 Georgia,serif;color:#06241b;">' + esc_(money_(amount, currency)) + "</div>" +
      "</td></tr>" +
      '<tr><td style="padding:18px 32px 0;">' +
      fieldLabel_("Confirmed") +
      '<div style="font:400 15px/1.5 Georgia,serif;color:#2a2a2a;">' + esc_(readable_(when)) + " (WAT)</div>" +
      "</td></tr>" +
      '<tr><td style="padding:20px 32px 0;font:400 13px/1.6 Georgia,serif;color:#6b6b6b;">' +
      "This is the guest's own confirmation that they sent a transfer. Please check it against your bank statement before thanking them as a confirmed donor." +
      "</td></tr>" +
      '<tr><td style="padding:22px 32px 0;">' +
      '<a href="' + esc_(sheetUrl_()) + '" style="display:inline-block;background:#06241b;color:#fbf7ee;text-decoration:none;font:400 12px/1 Georgia,serif;letter-spacing:.22em;text-transform:uppercase;padding:14px 26px;border:1px solid #ab8330;">Open the gifts sheet</a>' +
      "</td></tr>"
  );

  MailApp.sendEmail({
    to: COUPLE_EMAIL,
    subject: "Blessing confirmed: " + money_(amount, currency) + " from " + name,
    htmlBody: html,
    body: name + " (" + email + ") confirmed " + money_(amount, currency) + " on " + readable_(when),
    name: SENDER_NAME,
  });
}

/**
 * The shared royal envelope for every e-mail. Styles are inline because Gmail
 * strips <style> blocks, and the layout is a table so it survives older clients.
 */
function emailShell_(title, subtitle, innerRows) {
  return (
    '<div style="margin:0;padding:24px 12px;background:#f4eedc;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background:#fbf7ee;border:1px solid rgba(171,131,48,.38);">' +
    // header band
    '<tr><td style="background:#06241b;padding:30px 32px;text-align:center;">' +
    '<div style="font:400 12px/1 Georgia,serif;letter-spacing:.34em;text-transform:uppercase;color:#e6c98a;">' +
    esc_(SENDER_NAME) +
    "</div>" +
    '<div style="margin-top:12px;font:400 28px/1.25 Georgia,serif;color:#fbf7ee;">' + esc_(title) + "</div>" +
    '<div style="margin-top:8px;font:italic 400 16px/1.5 Georgia,serif;color:rgba(251,247,238,.75);">' +
    esc_(subtitle) +
    "</div>" +
    "</td></tr>" +
    // gilt hairline
    '<tr><td style="padding:0;"><div style="height:2px;background:#ab8330;"></div></td></tr>' +
    '<tr><td style="height:28px;"></td></tr>' +
    innerRows +
    '<tr><td style="height:32px;"></td></tr>' +
    // footer
    '<tr><td style="border-top:1px solid rgba(171,131,48,.35);padding:20px 32px;text-align:center;font:400 11px/1.6 Georgia,serif;letter-spacing:.2em;text-transform:uppercase;color:#8a7b55;">' +
    "Amor Vincit Omnia · 27 · 08 · 2026" +
    "</td></tr>" +
    "</table></div>"
  );
}

function fieldLabel_(text) {
  return (
    '<div style="font:400 11px/1 Georgia,serif;letter-spacing:.28em;text-transform:uppercase;color:#8a7b55;margin-bottom:6px;">' +
    esc_(text) +
    "</div>"
  );
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Get a tab by name, creating it with its header row on first use. */
function ensureSheet_(name, headers) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

/**
 * Escape everything that reaches an e-mail body. Notes are untrusted guest
 * input and must never be interpolated into HTML raw.
 */
function esc_(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp_(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

function readable_(date) {
  return Utilities.formatDate(date, TIMEZONE, "d MMM yyyy, h:mm a");
}

function money_(amount, currency) {
  var n = Number(amount) || 0;
  var pretty = n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (currency === "NGN" ? "₦" : currency + " ") + pretty;
}

function sheetUrl_() {
  return SpreadsheetApp.getActive().getUrl();
}
