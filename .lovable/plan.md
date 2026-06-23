## Overview

A static, royally-styled wedding site for **Eniolaoluwa & Tiwalade** (cipher **E&T**), wedding date **27 August 2026**. Built per the Royal Edition v3 manual — all 20 sections — with mocked/dummy backend so every interaction (RSVP, Paystack contribute, notes wall, sealed states) looks and feels real. Backend wiring to Google Sheets / Apps Script / Paystack is deferred; swap-in points are clearly marked.

## Identity & Tokens

- **Cipher / monogram:** E & T (interlaced), coronet above. Used as favicon, dividers, watermark (6% opacity), back-to-top.
- **Crest:** Full achievement (coronet + laurel-wreathed E&T cipher + motto banner "AMOR VINCIT OMNIA"). Gilt and emerald variants. Hero + invitation + footer only.
- **Seal:** Oxblood wax seal with coronet + cipher in gilt — used for funded registry items and Thank-You page.
- **Palette (CSS vars in `src/styles.css`):**
  - `--ivory` #FBF7EE, `--paper` #F4EEDC, `--emerald-deep` #0B3B2E, `--emerald-ink` #06241B
  - `--gold-champagne` #C9A961, `--gilt` gradient (#B8862F → #E6C36A → #B8862F)
  - `--oxblood` #6B1F2A, `--charcoal` #2A2A2A
- **Fonts (via @fontsource):** Cinzel (ceremonial caps, 0.18em tracking), Cormorant Garamond (display + headings), Inter (body), Pinyon Script (signatures/quotes).
- **Motion:** Easing tokens (`royal`, `silk`, `crest`), fade-up 16px → 0, gilt sheen sweep, seal press-in, ribbon draw. Respects `prefers-reduced-motion`.

## Sections to Build (manual §IX)

```text
1. Hero / Invitation         — crest, names in Cinzel, date 27·VIII·MMXXVI, countdown
2. Note From Us              — Pinyon Script signed letter, motto close
3. Our Story / Timeline      — vertical gilt rail w/ dated milestones
4. Meet the Couple           — twin portrait cards, desaturate→colour on hover
5. The Bridal Party          — court of honour grid w/ role titles
6. Order of the Day          — schedule (ceremony, reception, after-party)
7. The Venue                 — map placeholder, dress code, directions
8. Travel & Stay             — hotel cards, transport notes
9. Gallery (#TiwaSaidYes)    — masonry + lightbox
10. Registry / Blessings     — filter tabs, contribute modal (mock Paystack),
                               progress hairline, seal closes funded items
11. Notes Wall               — moderated guestbook (mock submit + approval state)
12. RSVP                     — multi-step form (name lookup, party, meals, song)
13. FAQ                      — accordion, ink/gilt
14. Thank-You / Confirmation — seal stamp, motto
15. 404 / Royal Apology      — coronet, gold hairline
Plus: persistent header with cipher, footer with crest+motto, back-to-top cipher button.
```

## Architecture (TanStack Start)

```text
src/
  routes/
    __root.tsx              — html shell, font links, favicon (cipher), nav, footer
    index.tsx               — Hero + Note + Story + Couple + Party (long-form home)
    schedule.tsx            — Order of the Day
    venue.tsx               — Venue + Travel & Stay
    gallery.tsx
    registry.tsx
    notes.tsx               — guestbook wall
    rsvp.tsx
    faq.tsx
    thank-you.tsx
  components/
    heraldry/   Crest, Coronet, Cipher, Seal, MottoBanner, GoldHairline
    layout/     SectionWrapper, Eyebrow, Header, Footer, BackToTopCipher
    registry/   GiftCard, ContributeModal, ProgressHairline, FilterTabs
    rsvp/       RsvpForm (multi-step)
    notes/      NoteCard, NoteForm
    ui/         (shadcn components, restyled to tokens)
  data/                     — mock JSON matching §XI schemas
    couple.json, story.json, party.json, schedule.json,
    venue.json, gallery.json, registry.json, notes.json, faq.json
  lib/
    mockApi.ts              — simulates GET/POST endpoints w/ latency + localStorage
    paystackMock.ts         — fake checkout flow → "payment success" → seal animation
  assets/                   — generated SVGs (crest, coronet, cipher, seal)
  styles.css                — tokens, font-face, utility primitives
```

## Mock Backend (dummy infra)

- `src/lib/mockApi.ts` exports `getRegistry`, `contribute`, `submitRsvp`, `submitNote`, `listNotes` — each returns Promises with 300–600ms latency.
- Contributions and RSVPs persist to `localStorage` so the UI reflects state across navigations and reloads.
- Notes submitted go to a "pending moderation" bucket; a seeded set is pre-approved so the wall is populated.
- Paystack flow: clicking "Bless this gift" opens `ContributeModal` → fake card form → success screen → registry item progress bar advances → if 100%, gilt seal stamps the card.
- All mock functions sit behind a `@/lib/api` barrel so the real Apps Script integration is a single-file swap later.

## Asset Generation

- Generate **crest (gilt)**, **crest (emerald)**, **coronet**, **cipher E&T**, **wax seal (oxblood + gilt)** as premium SVG/PNG via image generation, saved to `src/assets/`.
- Generate two **couple portrait placeholders** and ~8 gallery photos (sepia-leaning, editorial).
- Generate **paper-grain** subtle texture overlay (≤30KB).

## Fonts

```bash
bun add @fontsource/cinzel @fontsource/cormorant-garamond @fontsource/inter @fontsource/pinyon-script
```
Imported once in `src/router.tsx` (or `__root.tsx` client portion). No CDN, no @import.

## Out of Scope (deferred)

- Real Google Apps Script endpoint (§XII), real Paystack keys (§XIII), real webhook verification.
- Email/SMS confirmations.
- CMS-backed content edits (content lives in `src/data/*.json` for now).

When you're ready for the backend pass, the swap surface is intentionally small: `src/lib/mockApi.ts` → real `fetch` calls; `paystackMock.ts` → Paystack inline JS; add env vars per §XVI.

## Acceptance

- All 20 manual sections present, navigable, and visually consistent with the Royal Standard.
- RSVP, contribute, and notes flows all complete end-to-end on mock data with persisted state.
- Lighthouse ≥ 95 perf/accessibility on the home route; reduced-motion honoured.
- No placeholder index, no Lovable boilerplate, no console errors.
