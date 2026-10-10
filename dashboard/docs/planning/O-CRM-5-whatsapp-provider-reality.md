# O-CRM-5 — WhatsApp provider reality (CRM-P4 verification pass)

**Method:** §0.2/§18.1 — call sites counted in live code; provider capabilities confirmed
against GREEN-API's own published documentation, not from memory.
**Owner decision:** Green API is the v1 provider.
**Verdict:** **no integration exists in this repo.** The channel ships as §9.2's fallback
shape — provider abstraction + Green API adapter behind config, `MANUAL` when unconfigured.

## 1. What exists here today: nothing, and one dead flag

Searched `src/`, `prisma/`, `scripts/`, `package.json`, `.env.example` for
`green-?api|greenapi|whatsapp|wa\.me|chat-api|twilio|360dialog|wati|instanceId`.

| Finding | Detail |
|---|---|
| Green API integration | **none** — zero references, no dependency, no env var |
| `CrmWhatsappProvider` enum | exactly **one** member, `MANUAL` (CRM-P0). Adding `GREEN_API` is a schema change → P4's migration, which §15 already expects |
| `crmWhatsappProvider` setting | exists on `ClinicCrmSettings`, defaults `MANUAL`, read by nothing yet |
| `wa.me` link | `src/features/services/vaccinations/utils/vaccination-reminder.ts` — a deliberate link-not-send, with a comment stating no transport exists |
| **`Appointment.whatsappReminderEnabled`** | **a DEAD flag.** Written by the booking handler and the booking wizard exposes a user-facing toggle for it; **read by no send path.** The vaccination-reminder comment says so in as many words |

The dead flag is the one finding with a user-visible consequence today: a customer ticks
«تذكير واتساب» in the public booking wizard and nothing sends. It is out of CRM scope
(appointments/bookings own it), but P4 is the first phase that makes it *wireable* — see
question Q4.

Two phone normalisers already exist and differ: `normalizePhone` in
`@/lib/validation/phone` (CRM's, E.164-ish) and another in `vaccination-reminder.ts`
(digits-only, `wa.me` style, defaults country code `966`). Green API needs a THIRD shape —
`<digits>@c.us` — so the adapter must own that conversion explicitly rather than assume
either existing one.

## 2. What Green API actually supports

Confirmed from GREEN-API documentation. Note `green-api.com` is blocked by this
environment's egress proxy, so these come from indexed documentation pages rather than a
direct fetch — worth re-confirming against the live docs before the adapter ships.

| Capability | Reality |
|---|---|
| Auth | `idInstance` + `apiTokenInstance`, **per instance = per WhatsApp number** |
| Send text | `sendMessage` (`chatId`, `message`) |
| Send media | `sendFileByUrl` (`chatId`, `urlFile`, `fileName`, optional `caption`) |
| Inbound | **two models**: push to a configured `webhookUrl`, OR poll `ReceiveNotification` + `DeleteNotification` (delete is mandatory — it acknowledges and dequeues) |
| Delivery status | **YES** — `outgoingMessageStatus` webhook with `sent` / `delivered` / `read` / `failed`, plus `idMessage` and `timestamp` |
| Instance health | `stateInstanceChanged` (authorization state) and `statusInstanceChanged` (socket state) webhooks |
| Templates | **no Meta-approved template concept** in the classic gateway — see Q1 |

### 2.1 The status contrast with email — this is the interesting one

CRM-P3 fixed the email vocabulary at two members («أُرسل»/«فشل الإرسال») **because the
transport could not report more**. Green API reports `sent`, `delivered`, `read` and
`failed`. So WhatsApp can honestly show more than email — but only if inbound webhooks
actually reach us (Q2). The §9.1 precedent must not be copied blindly here; the reasoning
that produced it points the other way for this channel.

## 3. Questions for the owner — blocking, per §0.1 rule 6

**Q1 — WHICH Green API product?** The search surfaced two distinct product lines:
the classic gateway (`/en/docs/api/`) and a **WABA** offering (`/en/waba/api/`). They are
materially different:
- **Classic gateway** — automates a normal WhatsApp account via QR pairing. No template
  approval, no 24-hour window, works immediately. But it is not an official Meta channel:
  account-ban risk is real and borne by the clinic's own number.
- **WABA (official Business API)** — Meta-approved message templates, the 24-hour customer
  service window, per-message pricing, business verification. Legitimate and durable, but
  «send a free-text message from the deal page» is only legal inside an open 24-hour
  window; outside it, only an approved template may go out.

This choice changes the data model (template entity or not), the UI (can the user type a
free message, or must they pick an approved template?), and BR-level rules. I will not
guess it.

**Q2 — can Green API reach us with webhooks?** Push mode needs a publicly-reachable HTTPS
endpoint on our deployment. If that is not available, the alternative is polling
`ReceiveNotification`/`DeleteNotification` on a schedule — which needs a job runner, and
CRM has no job runner of its own (F15 deferred the namespacing question to CRM-P5).
Which is it: public webhook endpoint, or polling job?

**Q3 — credentials per clinic or one global instance?** An instance is bound to ONE
WhatsApp number, and a clinic's number is its identity to its customers — so unlike the
email envelope (where the owner accepted one shared address), a shared WhatsApp number
looks wrong here. Per-clinic means storing `idInstance`/`apiTokenInstance` per clinic,
which is the credential-storage decision deliberately avoided in CRM-P3 Q1 option (b):
encryption at rest becomes a real question. Confirm per-clinic, and say whether plaintext
columns are acceptable for v1 or encryption is required now.

**Q4 — the dead `whatsappReminderEnabled` flag.** Out of CRM scope, but P4 gives it the
transport it always lacked. File as a follow-up for the appointments module, leave alone,
or fix inside P4?

No adapter code will be written until Q1 and Q2 are answered — Q1 changes the schema and
Q2 changes whether a job runner is in scope for this phase.

## Sources

- [Receiving webhooks (HTTP API)](https://green-api.com/en/docs/api/receiving/technology-http-api/)
- [Working with incoming webhooks](https://green-api.com/en/docs/api/recommendations/working-with-incomming-webhooks/)
- [SendFileByUrl](https://green-api.com/en/docs/api/sending/SendFileByUrl/)
- [OutgoingMessageStatus webhook](https://green-api.com/en/docs/api/receiving/notifications-format/outgoing-message/OutgoingMessageStatus/)
- [Incoming webhook types](https://green-api.com/en/docs/api/receiving/notifications-format/type-webhook/)
- [WABA — OutgoingMessageStatus](https://green-api.com/en/waba/api/receiving/notifications-format/outgoing-message/OutgoingMessageStatus/)
