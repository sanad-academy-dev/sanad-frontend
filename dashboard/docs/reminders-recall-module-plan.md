# Reminders & Recall — module plan `[RC0]`

**Status:** built, verified locally, **not committed**. Everything below is executed evidence,
not intent — every figure in §7 came from a run, and every defect in §6 was found by a check
in this repo rather than by reading.

---

## §1. Why the module exists

The repo already had five real due engines. What it did **not** have was anything that fires
on its own, anything that reaches a client except email, or any record that a client was
contacted. Three structural gaps, each documented in the codebase itself before this work:

| Gap | Evidence at HEAD |
|---|---|
| **No scheduler at all** | Eight places say so literally: `schema.prisma:13129`, `inpatients.controller.ts:79`, `triage-breach.service.ts:11`, `accounting-jobs.runner.ts:27`, `course-assignments.dao.ts:468`, `training.controller.ts:12`, `inpatient-due.service.ts:22`, `mobile-retention.service.ts:102`. The workaround everywhere is *read-triggered* detection — a missed inpatient dose is discovered when a human opens the board, i.e. silent at 3 a.m. |
| **Email is the only transport** | `src/lib/email` = nodemailer/SMTP, one template, four senders, **none of them a reminder**. Zero SMS/WhatsApp/push keys in `src/env.ts`. The "WhatsApp reminder" was a `wa.me` link a human clicked. |
| **No outbox, no contact log, no dedupe** | Nothing recorded that an owner was called. No `lastContactedAt`, no snooze, no attempt count. So a list could be worked twice, and the moment a scheduler existed the same owner would be nagged every run. |

Plus a fourth, worse than all three: **the settings screen wrote to dead columns.** Every
`ClinicNotificationSettings.emailReminder*` flag is persisted by
`/management/settings/notifications-email` and read by **no server path**. A clinic could switch
on "remind 24 hours before" and reasonably believe reminders were going out.

---

## §2. What was built

Four layers. Each is independently useful; layer 1 unblocks the rest.

### RC1 — the scheduler (`src/server/scheduler/`)

A generic in-process job runner where **the row is the queue** (`ScheduledJob`). Same
claim/complete semantics as `AccountingJob` [P0.5] — atomic `updateMany` guarded on `QUEUED`,
so two workers cannot run one job — but generalised out of accounting, because accounting's
guards (BRD AR-7) assume every row is a posting.

- `POST /api/cron/tick` — **the only ungated route in the module**, in its own file so the
  ungated-route audit keeps full coverage of everything else. Guarded by `CRON_SECRET` with a
  **constant-time** comparison; a missing secret returns **503 closed**, never open.
- `POST /api/scheduler/run-now` — the same tick scoped to one clinic, for clinics with no cron
  yet. (This one shipped broken first; see §6.)
- Idempotency keys make repetition free: a daily key for the sweep, a 15-minute window key for
  dispatch. A 5-minute cron therefore produces **one** sweep per day, not 288.

### RC2 — the outbox (`src/server/reminders/outbox.service.ts`, `channels/`)

`NotificationOutbox` with `@@unique([clinicId, dedupeKey])`. **`dedupeKey` is the load-bearing
column of the whole module** — `{trigger}:{subjectId}:{discriminator}:{YYYY-MM-DD}`. Without it
the first working cron turns recall into daily harassment.

Channels sit behind `channel.port.ts` with **four** outcomes, and the fourth is the point:

- `sent` · `failed` (transient, retried with 5min×3ⁿ backoff) · `skipped` (**final decision**,
  never retried — no provider, no address) · `manual` (link ready, sending is a human act).

Adapters: `inbox` ✅, `email` ✅, `whatsapp` = **MANUAL provider** (builds the `wa.me` link,
records *who* clicked "sent"), `sms`/`push` = explicit `unavailable` adapters that announce
their absence rather than being missing map entries that throw at runtime.

Bodies are **snapshots**, not templates resolved at send time — editing a template tomorrow
must not rewrite what was sent yesterday.

### RC3 — rules & templates

`ReminderRule` per clinic: trigger, offset (signed — negative means *after* due), repeat +
`maxSends` cap, ordered channel preference, Arabic templates, quiet hours, horizon.

Nine defaults are created **lazily on first read**, not seeded — `ensureGlobalDefaults`
short-circuits on populated databases, so seed-file data never reaches an existing clinic (a
lesson already paid for in this repo). **All nine ship `active: false`**: a module that starts
messaging real owners at deploy time is an incident, not a feature.

The template renderer is a pure substituter — no expressions, no loops, no calls. A settings
text field must never become an execution surface. Unknown tags are rejected **at save time**,
not at send time.

### RC4 — the recall workbench

One board keyed by **owner, not pet**. This is the entire operational point: the five due lists
already existed, but on four separate screens keyed by patient, so an owner with three due dogs
appeared three times in three places — and got called three times, or not at all.

`RecallContact` logs channel, outcome, notes, snooze, and the booked appointment.
`NO_ANSWER`/`CALLBACK_REQUESTED` deliberately **do not** close an item: hiding someone because
one person tried once is exactly how half of recall evaporates.

### RC5 — collectors

Nine triggers, and the governing rule is: **no collector computes a due date.** Each reads the
engine that already owns that computation — `vaccinationsDao.listDue` (per-antigen),
`nextGroomDueAt`, `nextRecheckAt`, `CarePlanEnrollmentVisit.scheduledAt`, `PostOpOrder.dueAt`,
`Membership.currentPeriodEnd`, `SalesInvoice.dueDate`. A second scheduling implementation
diverges from the first with certainty, and then the reminder says something different from
the screen.

---

## §3. Cross-cutting fixes this required

- **Phone normalisation unified.** `src/lib/validation/phone.ts` (E.164, libphonenumber) is now
  the only normaliser on this path. The hand-rolled one in `vaccination-reminder.ts` produced a
  different string for the same owner.
- **`Appointment.whatsappReminderEnabled` finally means something.** It was written by the
  booking wizard and the add-appointment modal and read by nothing. The upcoming-appointment
  collector now honours it.
- **`ownerId` added to `GroomingDueRow` / `NutritionDueRow`** — additive, so the board can group
  by owner.
- **The dead settings switches now say so**, with a link to the screen that works. They are not
  deleted (that would silently drop what clinics configured) and not left silent (worse).

---

## §4. RBAC

New resource `reminders`, group `operations`, `scopes: []` (recall is clinic work — an owner
deals with the clinic, and a branch-scoped list means one owner called twice).

Two extra actions, and the split is the point:

- **`send_reminders`** — editing a template is reviewable; firing a batch at real owners is
  **not reversible**. So `update` does not inherit it.
- **`run`** — running the scheduler itself; infrastructure, closer to "run the migration".

Role templates: receptionist gets `read` + `send_reminders` (works the board, logs calls,
cannot rewrite what the whole clinic sends); clinic manager gets all six.

---

## §5. Deployment

Add to the host crontab (the same crontab already used for backups, `docs/deployment.md`):

```cron
*/5 * * * * curl -fsS -X POST https://<host>/api/cron/tick \
    -H "x-cron-secret: $CRON_SECRET" >/dev/null 2>&1
```

Set `CRON_SECRET` (≥32 chars) in the Dokploy environment. **Until it is set the endpoint
returns 503 and refuses to run** — deliberately fail-closed, since it dispatches messages to
real owners. Clinics can still use the in-app "شغّل الآن" button meanwhile.

---

## §6. Defects found *by the checks*, not by reading

This section exists because CLAUDE.md rule 12 says a walkthrough is only evidence once it has
been executed. It was executed, and it found four things:

| # | Found by | Defect | Fix |
|---|---|---|---|
| 1 | controller permission test | `POST /recall/contacts` with an unknown `ownerId` escaped as **500** (Prisma FK violation) instead of an Arabic 404 | scoped existence guards before insert |
| 2 | walkthrough step 3 | the vaccination collector **excluded `NOT_STARTED`** — an animal that never had a dose, the highest-value recall case of all | use the engine's own `ACTIONABLE_DUE_STATUSES` instead of a hand-listed copy |
| 3 | walkthrough step 5 | **`/scheduler/run-now` did nothing.** It executed queued jobs but never enqueued any — so for a clinic without cron, exactly who the button is for, pressing it did nothing forever | it now runs the real tick, scoped to the caller's clinic |
| 4 | client typecheck | importing `PreviewRow` from `outbox.service` dragged every collector and DAO into the **client** type graph | shared types moved to `reminders.type.ts`, per the AGENTS.md convention |

### Two pre-existing defects on `main`, uncovered along the way

The client typecheck was **already failing at HEAD** — OOM at the repo's configured 9216 MB —
and the OOM was *hiding* the errors that caused it. The emergency merge (`eb92fd2`) added
`VitalSignsSource.TRIAGE` and `InboxItemType.TRIAGE`; four hand-copied label maps never got
them:

`vitals-history-dialog.tsx` · `vitals-history-table.tsx` · `vitals-snapshot-card.tsx` ·
`patient-history.ts` · `inbox-notify.tsx` · `inbox-map.ts`

Type-error recovery inflated the type graph past the ceiling → OOM → OOM printed no `error TS`
lines → nobody saw the errors. Fixed by giving each map an exhaustive
`Record<Enum, …>` annotation (the three vitals copies collapsed into one shared
`VITALS_SOURCE_LABELS`), so the next enum value breaks the build instead of rendering
`undefined` in a badge.

**Client typecheck peak: 9,843 MB while broken → 8,952 MB once fixed** (warm), i.e. back
under the repo's own 9216 ceiling for the incremental path.

### The CI typecheck ceiling had already outgrown 9216 — both tiers

Found only after CI ran, because a local warm typecheck cannot see it. **Both** CI tiers
OOMed on `bun run typecheck`, fast and cold.

Cold peaks measured 2026-09-04, one process per program:

| program | cold peak | at [P13.6] |
|---|---|---|
| generated | 7,582 MB | 5.56 GB |
| server | 8,886 MB | 8.11 GB |
| **client** | **9,819 MB** | 8.66 GB |

The client program alone exceeds 9216 — **and does so with this module removed too
(9,571 MB)**. So the cold gate had already outgrown the ceiling before this branch: the
ceiling was lowered 12288 → 9216 on 2026-09-03 for a 32 GB Windows dev box (rule 13), which
silently lowered it for CI as well, and inpatients + emergency landed after rule 14's
8.66 GB figure was measured. This module contributes ~248 MB of a ~600 MB overshoot.

Fix: `scripts/typecheck.mjs` runs rule 15's three programs with **one** ceiling, read from
`TYPECHECK_HEAP_MB` (default **9216 — the dev box is unchanged**). Both CI jobs set 11264,
which is above the measured peak with ~1.4 GB headroom and below the 12288 that was
SIGKILLed in 2026-08 — that was the pre-[P13.6] monolith on a *shared* runner, not one
program per process on a dedicated one with 8 GB of provisioned swap.

Verified: `TYPECHECK_HEAP_MB=11264 bun run typecheck:cold` → exit 0 (100s + 112s + 165s).

### Both walkthroughs depended on seed data CI does not have

`PR Full Checks` runs `migrate deploy` and **no seed at all**. Antigens and vaccination
protocols live in `prisma/seed-vaccinations.ts`, which never runs there; and
`ensureGlobalDefaults` is called without `await` from `app.ts`, so it races `beforeAll`.
Both walkthroughs now create their own catalogue rows and depend on nothing ambient.

⚠️ **Separate finding for the owner: `seedAnimalTypes` never writes the `species` column.**
Every seeded animal type lands with `species: null`. Vaccination protocol matching
(`pickProtocol`) and vital-sign reference ranges both key off it, so on a freshly seeded
database species-level protocol matching can never match. Not fixed here — changing seeded
defaults needs a migration to reach existing clinics, and that is an owner decision.

---

## §7. Verification actually run

| Check | Result |
|---|---|
| `bun run typecheck` (generated → server → client, 9216 MB) | **exit 0** |
| `bun run format` (Biome) | **exit 0** |
| `bun run test:fast` | **120 files, 1631 tests, all pass** |
| `prisma migrate deploy` (local Postgres :5433) | applied `20260904120000_reminders_recall_rc0` |
| `prisma migrate diff --exit-code` | **no drift** |
| `reminders-controllers.permission.test.ts` | **61/61** — authorized-passes / 403 / receptionist-denied per endpoint, plus three cron-secret cases |
| `reminders-walkthrough.e2e.test.ts` | **18/18**, every step through `app.handle` |
| `reminder-schedule.test.ts` + `reminder-template.test.ts` | **36/36** pure |

The walkthrough seeds a **five-week-old puppy with no vaccinations** and lets the real
vaccination engine schedule its first core dose — nothing is faked into an outbox row. It then
proves: defaults arrive off · cron does nothing while off · preview writes nothing · activation
· tick creates the message · **a second tick creates no duplicate** · quiet hours defer rather
than drop · manual WhatsApp link + signed "sent" · owner appears on the board with an E.164
number · unknown owner → 404 · "no answer" keeps the item · "booked" closes it and cancels
pending messages · contact history ordered · jobs readable · bad template tag rejected at save ·
half-open quiet window rejected.

---

## §8. Not done — deliberately, and why

- **Real SMS/WhatsApp/push providers.** All three need commercial paperwork with lead times
  longer than the code: a CITC-licensed sender ID (Taqnyat/Unifonic/Msegat), a WhatsApp
  Business number, Apple/Google push credentials. The `ChannelAdapter` port is the whole
  integration surface — one file each when the credentials exist.
- **Migrating the old settings flags onto real rules.** Needs a data migration and an owner
  decision about what each legacy flag should become. Flagged in the UI instead of guessed.
- **A `typeTriage` inbox setting.** Triage notifications currently follow `typeInpatients` for
  the documented reason; a key of their own is a migration on inbox settings.
- **`nextRepeatAt` is written and unit-tested but not yet wired into the sweep.** First sends
  work; repeat sends are the next increment. Called out rather than left to be discovered.
