# O-CRM-6 — mail transport reality (CRM-P3 verification pass)

**Method:** §0.2/§18.1 — call sites counted in live code on `claude/crm-module`, never inferred.
**Verdict:** a transport **exists**, but it is narrower than "elite-vet can send mail", and
three of its properties change what §9.1 can honestly promise.

## 1. What exists

`src/lib/email/` — two files, 18 lines total.

| File | Contents |
|---|---|
| `transporter.ts` | `nodemailer.createTransport({ service: "gmail", host: "smtp.gmail.com", port: 587, secure: false, auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASSWORD } })` |
| `index.ts` | `sendEmail({ to, subject, html })` → `transporter.sendMail({ from: env.EMAIL_USER, … })` |

**Four production call sites** (`grep` across `src/`, excluding tests):

| Call site | Failure handling |
|---|---|
| `expenses.dao.ts:340` | `try/catch` → `console.error`, non-blocking |
| `leave-requests.dao.ts:120` | `try/catch` → `console.error`, non-blocking |
| `psoa.service.ts:269` | `try/catch` → collects the message into a per-recipient `skipped[]` shown to the user |
| `lib/auth/index.ts:204` (better-auth `emailOTP`) | no catch — a send failure fails the OTP flow |

`src/lib/email/templates/clinic-invite.tsx` exists and is **0 bytes**. There is no template
rendering infrastructure; all three domain call sites build HTML inline with template literals.

## 2. The three properties that constrain §9.1

### 2.1 One global Gmail account, not per clinic — the multi-tenancy problem

`service: "gmail"` with a single `EMAIL_USER`/`EMAIL_PASSWORD` pair for the whole deployment.
`from` is hardcoded to `env.EMAIL_USER`. There is no per-clinic sender anywhere.

`ClinicCrmSettings.crmEmailFromName` (added in CRM-P0 per §14) is a **display name only** — and
Gmail's SMTP rewrites or rejects a `From` address that is not the authenticated account, so a
per-clinic *address* cannot be achieved by setting a header. Every clinic's CRM mail would leave
from the same envelope address unless something changes. **This is an owner decision, not an
implementation detail** (Q1).

### 2.2 «open/delivery status if the transport reports it» resolves to **NO**

§9.1's conditional is answerable now: nodemailer's `sendMail` resolves when the SMTP server
**accepts** the message, which is not delivery. Gmail SMTP reports no opens, no delivery
receipts, and no bounce webhook — bounces return to the sending mailbox as new mail, which
nothing in this repo reads. Open tracking would require a tracking pixel plus a public endpoint,
i.e. new infrastructure that §9.1 does not authorise.

So the honest timeline vocabulary is **«أُرسل» (accepted by SMTP) / «فشل الإرسال»** and nothing
finer. Anything richer would be a status the system cannot know (Q2).

### 2.3 Nothing is persisted today

None of the four call sites records a row anywhere — no send log, no message table, no
`psoaSendLog`. CRM-P3's `crm_email_message` would be the **first** persistence of outbound mail
in the repo. Nothing existing needs migrating into it, and nothing existing will populate it.

### 2.4 Two smaller facts worth having

- `EMAIL_USER`/`EMAIL_PASSWORD` are `z.string()` in `src/env.ts` — **required**, so the app
  cannot boot without mail credentials. There is no "mail not configured" state to degrade into,
  which matters if a MANUAL-only mode is chosen.
- No `transporter.verify()`, no retry, no queue. A send is one in-process SMTP round trip on the
  request path.

## 3. Consequence for §8.3 — the timeline endpoint does not exist

Separate finding from the same pass, and it lands squarely in P3's scope.

§8.3 specifies «**Timeline endpoint** per entity: merges, newest-first with type filters».
There is **no such endpoint**. `src/features/crm/components/lead-timeline.tsx` calls four hooks
(status log, notes, tasks, comments), concatenates them into a `TimelineEntry[]` and sorts in the
browser (`lead-timeline.tsx:86–123`). Both the lead page and the deal page render it.

Adding email makes that five parallel queries, and "newest-first with type filters" cannot be
paginated client-side without fetching every row of every type first. P3 either builds the
endpoint §8.3 specifies, or keeps the client merge and records the deviation (Q3).

## 4. Questions for the owner — blocking, per §0.1 rule 6

**Q1 — sender identity (multi-tenancy).** Choose:
- **(a) One envelope, clinic in the display name (recommended for v1).** Send from the global
  account; set the from-*name* from `crmEmailFromName`; set `Reply-To` to the clinic's own
  address so replies reach the clinic. Works with today's transport, no new secrets. Cost: every
  clinic's mail shares one envelope address, visible in the recipient's client.
- **(b) Per-clinic SMTP credentials.** Truthful per-clinic identity, but new settings columns,
  credential storage (encryption at rest is its own decision), and per-clinic failure modes.
- **(c) MANUAL-only, mirroring WhatsApp §9.2.** Compose and record, mark as sent by hand, send
  nothing. Smallest surface; defers the question.

**Q2 — confirm the §9.1 status vocabulary** is «أُرسل»/«فشل الإرسال» only, with no open or
delivery tracking, recorded as a §17.2 row against §9.1's "if the transport reports it".

**Q3 — §8.3 timeline.** Build the server endpoint this phase (recommended — email makes the
client merge five queries and blocks pagination), or keep the client-side merge and record the
deviation?

No mail code will be written until Q1 and Q2 are answered; Q3 changes the shape of the phase's
first task.
