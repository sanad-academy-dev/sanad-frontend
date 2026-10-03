# P8 Readiness Dossier — Multi-Currency & Revaluation

> **Status:** planning document, written at the M2 gate (PR #89 pending the owner's
> walkthrough). No source code changes accompany this document. It folds into the P8
> kickoff after "M2 passed".
>
> **Law:** BRD §4.7, §9 (FR-9.1–9.4), BR-7.4.4, BR-4.10.2, AC-3 · `IMPLEMENTATION_PHASES.md`
> [P8.1]–[P8.5] · ADR-0002 (tri-currency ledger, supersedes ADR-0001 for the ledger scope)
> · contract C2 (Decimal 21,9) and C4 (schema tri-currency from P2, runtime rate=1 until P8).

---

## 1. What already exists (activation targets, not construction sites)

P8 is mostly an **activation** phase: ADR-0002 front-loaded the schema and several seams
were built currency-aware during P1–P7. Inventory of what is already in place:

| Layer | Already built | Where |
|---|---|---|
| GL storage | Full tri-currency triplet per GLE: base `debit/credit`, `debitInAccountCurrency/creditInAccountCurrency` + `accountCurrencyCode`, `debitInTransactionCurrency/creditInTransactionCurrency` + `transactionCurrencyCode` + `transactionExchangeRate` | `prisma/schema.prisma` `GlEntry` (~5139–5195) |
| PLE storage | `amount` (base) + `amountInAccountCurrency` + `accountCurrencyCode` per row | `PaymentLedgerEntry` (~5673–5708) |
| gl_map | `GlMapRow` accepts all three pairs; `toWorkingRow` defaults missing pairs to base; `toggleNegatives`/`mergeSimilar` operate on all three triplets; **EGOL zero-row exemption already implemented** (`isExchangeGainLoss`, `keepZeroRows`) | `src/server/accounting/gl/gl-map.ts` |
| Engine | Persists all triplets; `transactionExchangeRate` defaults `"1"`; **BR-4.10.2 party GL-currency guard already enforced per batch** via `assertPartyGlCurrency` | `gl-engine.service.ts:279–281, 583–590`; guard in `party/party.service.ts:181` |
| Rates | `CurrencyExchange` table (dated, per-pair, `forBuying/forSelling`) + `resolveExchangeRate` + stale rules (`pickStoredRate`, `isStale`, `assertNotStale`) | `currency-exchange/` (P1.8) |
| Settings | `allow_stale`, `stale_days`, `exchange_gain_loss_posting_date` (enum `Invoice \| Payment \| Reconciliation Date`, default `Reconciliation Date`) already defined with codecs + tests | `accounts-settings/accounts-settings.type.ts:380, 417` |
| Company defaults | `exchangeGainLossAccountId` (realized) and `unrealizedExchangeGainLossAccountId` (ERR) — nullable, editable in the settings screen | `CompanySettings` (schema ~4570–4571) |
| Invoices | `currencyCode` + `conversionRate Decimal(21,9) @default(1)` + `partyAccountCurrencyCode` snapshot on both invoice tables; advances child rows carry `refExchangeRate` + `exchangeGainLoss` | `SalesInvoice`/`PurchaseInvoice`, `SalesInvoiceAdvance` (~6020–6035) |
| Payment Entry | Dual rates (`sourceExchangeRate`/`targetExchangeRate`) + base mirrors (`basePaidAmount`/`baseReceivedAmount`); per-account currency snapshots; `PaymentEntryReference.exchangeRate @default(1)` (= the rate AT the reference) | `PaymentEntry` (~6415–6450), `PaymentEntryReference` (~6494) |
| JE | `isSystemGenerated` flag; voucher-reference rows (P3.4) usable to link system JEs to their source pair | `JournalEntry` (~5222) |
| Jobs | Runner infrastructure for scheduled work (the daily rate fetch job's home) | `jobs/accounting-jobs.runner.ts` |

**Consequence:** no P8 migration touches `gl_entry`, `payment_ledger_entry`, or any P7
payment table. New tables are limited to the ERR doctype ([P8.4]) and possibly a provider
config row ([P8.5], see below).

---

## 2. FX design walkthrough — how [P8.1]→[P8.5] land

### [P8.1] Foreign-currency accounts end-to-end

**JE multi-currency rows.**
- `journal-entry.type.ts`: add `multiCurrency: boolean` to the header schema; child rows
  grow `exchangeRate` (editable only when `multiCurrency` and the account's currency ≠
  base) and the user-entered pair becomes `debit/creditInAccountCurrency` — base
  `debit/credit` turn into **derived** values (`account amount × row rate`). Today the
  user enters base amounts directly; keep that path bit-identical when `multiCurrency`
  is off.
- `journal-entry.service.ts` (`buildJeGlMap` area): stop letting `toWorkingRow` default
  the account pair — pass explicit `debitInAccountCurrency/creditInAccountCurrency` from
  the row and computed base amounts. BR-7.1.4: base totals must balance; a small residue
  books via the engine's existing §6 step-8 allowance (already implemented).
- The JE screen shows the rate column behind the `multiCurrency` flag (the P2.4 "hide
  flag" finally flips).

**Invoice `conversion_rate`.**
- The two hardcoded seams: `sales-invoice.service.ts:228` and
  `purchase-invoice.service.ts:234` — both write `conversionRate: "1", // single-currency
  P5–P7`. Replace with §4.7 resolution: manual rate on doc → `resolveExchangeRate`
  (selling side for SINV, buying side for PINV) → error. `resolveExchangeRate` and the
  stale guard already exist; the invoice save passes `(clinicId, from: doc.currencyCode,
  to: baseCurrency, date: postingDate)`.
- GL composers (`sales-invoice.gl.ts`, `purchase-invoice.gl.ts`): totals from the §8
  calculator are **transaction-currency**; base = `amount × conversionRate` computed with
  `Prisma.Decimal` (comment markers for this sit at `sales-invoice.gl.ts:116` and
  `purchase-invoice.gl.ts:161` — the "real at P8" notes). Receivable/payable rows also
  carry the account-currency pair in the **party account currency**
  (`partyAccountCurrencyCode` snapshot — usually = document currency for a foreign-party
  account, else = base).
- **Engine tri-currency persistence audit** (the task's third bullet): a DB test posting a
  synthetic voucher with three genuinely different pairs and asserting each triplet lands
  verbatim, plus PLE `amountInAccountCurrency` ≠ base `amount`.

### [P8.2] Payment Entry cross-currency (BR-7.4.2/7.4.4)

- `payment-entry.service.ts` `prepare()`: the same-currency shortcut (`received = paid`)
  branches — when `paidFromCurrency ≠ paidToCurrency`, both rates resolve independently
  and `basePaid = paid × sourceExchangeRate`, `baseReceived = received ×
  targetExchangeRate`. `assertDifferenceZero` (payment-entry.allocation.ts) moves to
  **base** terms: `difference = basePaid − baseReceived − Σdeductions` (it already reads
  the stored `differenceAmount`; the formula's inputs change, not the gate).
- Per-reference gain/loss: at submit, for each reference row, `gainLoss = allocated ×
  (paymentRate − reference.exchangeRate)` where `reference.exchangeRate` snapshots the
  invoice's `conversionRate` at pull time (the column + default already exist). Sign
  convention: for receivables a payment-rate **drop** is a loss; for payables a
  payment-rate **rise** is a loss (mirrored party side).
- **Auto-suggested deduction row**: the PE form suggests an Exchange Gain/Loss deduction
  (`CompanySettings.exchangeGainLossAccountId`, cost center from header) equal to
  Σ per-reference gain/loss whenever the posting-date setting says "Payment" — the user
  sees and can override the account, never the math.
- **Settings-driven posting target & date** — see §3 below (BR-7.4.4 plan).

### [P8.3] Party GL-currency guard + the single-account setting

Mostly **already shipped**: `assertPartyGlCurrency` (BR-4.10.2) blocks posting a party in
a second currency and the engine calls it for every party-bearing row
(`gl-engine.service.ts:279`). Remaining P8.3 work is the escape hatch: a new
accounts-settings boolean (`allow_multi_currency_invoices_against_single_account`,
ERPNext parity) that, when ON, relaxes the guard to allow multiple transaction currencies
against one party account (base-converted). One setting row + one branch in
`assertPartyGlCurrency` + tests for both states.

### [P8.4] Exchange Rate Revaluation (FR-9.3)

New doctype (the phase's only new tables): `exchange_rate_revaluation` header
(postingDate, company, `roundingLossAllowance Decimal @default(0.05)`, totals
gain/loss booked/unbooked, docstatus + documentNo "ERR" series) + child rows (accountId,
partyType/partyId nullable, account currency, `balanceInAccountCurrency`, `bookedBase`,
`currentRate`, `newBase`, `gainLoss`, `isZeroForeignSweep`).

- **Account scan:** every account whose `accountCurrencyCode ≠ base` with nonzero balance,
  plus **party sub-balances** on AR/AP accounts — both derivable from `gl_entry` sums
  (account currency vs base) grouped by (account, party). The PLE is NOT the source here
  (ERR revalues GL balances, not open documents).
- **Zero-foreign / nonzero-base sweep rows:** where account-currency balance rounds to 0
  but base ≠ 0, the row books the full base residue; differences within
  `roundingLossAllowance` go to the round-off account instead.
- **JE generation on submit:** voucherType **"Exchange Rate Revaluation"** (extends
  `JE_VOUCHER_TYPES`, see §5 risk 7), `isSystemGenerated`, per row Dr/Cr the account with
  **account-currency delta 0, base delta = gainLoss** against
  `unrealizedExchangeGainLossAccountId`. This is exactly the GLE shape the tri-currency
  gl_map already supports (base pair ≠ account pair) — and the reason the EGOL zero-drop
  exemption exists (`keepZeroRows`): rows with zero account-currency amounts but nonzero
  base must survive step 5b.
- Cancel: standard voucher cancel (AR-2 append-only reversal) — the ERR JE cancels with it
  via the reference link.

### [P8.5] Rate provider + daily fetch + stale enforcement

- Provider config: per the schema note (~5028) `currency_exchange_settings` is **not a
  table** — plan: keep it that way and store the provider config in accounts-settings
  rows (`rate_provider`, `rate_provider_url`, `rate_result_key`) alongside the existing
  `allow_stale`/`stale_days`. Frankfurter-style GET through the environment's HTTPS proxy.
- Daily fetch job registers in the existing `jobs/accounting-jobs.runner.ts` — one job per
  clinic-enabled currency pair writing `CurrencyExchange` rows (idempotent per date).
- **Stale enforcement goes live:** `resolveExchangeRate` already calls the stale rules;
  P8.5 wires `assertNotStale` into the **submit** path of every rate-consuming voucher
  (invoice/PE/JE-multicurrency/ERR) so a stale stored rate blocks per §4.7 when
  `allow_stale` is off. Resolution stays at save; staleness re-checks at submit (rates on
  the doc are manual overrides and never blocked).

---

## 3. BR-7.4.4 resolution plan — realized gain/loss lifecycle (the waiting §7.9 item)

**The rule:** per reference, `gain/loss = allocated × (payment rate − invoice rate)`.
Booked EITHER inside the PE's own GL (a deduction row) OR as a separate system JE
"Exchange Gain Or Loss", per `exchange_gain_loss_posting_date`:

| Setting value | Booking vehicle | Posting date |
|---|---|---|
| `Payment` | Deduction row inside the PE's GL batch (no extra JE) | PE posting date |
| `Invoice` | System JE per reference | The invoice's posting date |
| `Reconciliation Date` (default) | System JE per reference | Date of the settlement act (submit/reconcile day) |

**System JE shape:** voucherType **"Exchange Gain Or Loss"** (second `JE_VOUCHER_TYPES`
addition), `isSystemGenerated: true`, two rows — party AR/AP account (account-currency
delta **0**, base delta = gain/loss, party set, `againstVoucher` = the invoice) vs
`exchangeGainLossAccountId`. The zero-account-currency row is again why `keepZeroRows`
exists. The JE's P3.4 voucher-reference rows link it to **both** the payment (source) and
the invoice (target) so it is discoverable from either side.

**Composition with the P7 primitives — the key design decision.** P7 deliberately built
ONE settlement-move primitive and its exact inverse:

- `relinkAdvanceToInvoice` (advances.service.ts) — every settlement **creation** flows
  through it (invoice-side advances P7.5, reconciliation P7.6).
- `unreconcilePayment` (unreconcile.service.ts) + `enforceInvoiceCancelInterlock`
  (cancel-interlock.service.ts) — every settlement **destruction**.
- PE submit (`peConfig.onSubmit`) books allocations directly via the GL map (references
  known at submit).

The EGOL hooks attach at exactly these four call sites, never deeper:

1. **PE submit** — after `makeGlEntries`, for each reference with `gainLoss ≠ 0`: if
   setting = `Payment`, the deduction row was already in the map (auto-suggested,
   validated at submit); else create + submit the system JE inside the same transaction.
2. **relinkAdvanceToInvoice** — new optional step after the PLE move: compute gain/loss
   from `refExchangeRate` (advance row) vs invoice `conversionRate`, book the system JE
   in the same tx, and **record its id on the settlement it belongs to** (the advance row
   / PE reference row gains an `exchangeGainLossJeId` nullable column — the one small P8
   migration touching a P7 table, additive only).
3. **unreconcilePayment** — inverse: for each broken allocation, find the linked EGOL JE
   (via the stored id, fallback: JE reference rows) and **cancel** it (AR-2 append-only
   reversal — we cancel, never delete, logged as a deviation from ERPNext's
   delete-if-possible; consistent with the module's cancel discipline).
4. **enforceInvoiceCancelInterlock** (flag ON path) — same inverse per auto-unlinked
   allocation, inside the invoice cancel tx.

This closes the §7.9 ledger item "FX gain/loss JE auto-cancel on unlink/unreconcile —
P8's half of BR-7.4.4" with **zero structural change** to the P7 flow: each primitive
gains one hook call at its tail, and the linkage column makes auto-cancel a lookup, not
a search.

**Idempotency & safety:** EGOL JEs are exempt from the Σdebit=Σcredit throw (§6 step 8
exemption — already coded), survive zero-row drops (`keepZeroRows` — already coded), and
are `isSystemGenerated` so the JE screen shows them read-only.

---

## 4. ILS/USD/JOD market scenario — the demo-seed FX story (hand-computable)

Demo clinic base currency: **ILS** (`defaultCurrencyCode = "ILS"`). Seed rates
(`CurrencyExchange`): USD→ILS 3.70 (Jan 10), 3.60 (Feb 1), 3.55 (Mar 31);
JOD→ILS 5.20 (Jan 15), 5.30 (Feb 10). Accounts: AR-USD (accountCurrency USD),
AP-JOD (JOD), Bank-ILS, realized EGOL expense, unrealized EGOL.

**Story A — USD sales invoice settled at a worse rate (AC-3, extended).**
1. Jan 10: SINV-A, owner "Nimr", currency USD, total **USD 100**, conversionRate
   **3.70** → GL: Dr AR-USD 370.00 ILS / 100.00 USD, Cr revenue 370.00. AR in USD: 100.
2. Feb 1: PAY-1 Receive USD 100 @ sourceExchangeRate **3.60**, allocate 100 to SINV-A.
   basePaid = 360.00. Realized **loss = 100 × (3.70 − 3.60) = 10.00 ILS**.
   - Setting `Payment`: PE GL = Dr Bank 360.00, Dr EGOL 10.00, Cr AR-USD 370.00 ILS /
     100.00 USD. One batch, balanced.
   - Setting `Reconciliation Date` (default): PE GL = Dr Bank 360.00, Cr AR-USD 360.00 ILS
     / 100.00 USD… plus system JE "Exchange Gain Or Loss" dated Feb 1: Dr EGOL 10.00,
     Cr AR-USD 10.00 ILS / **0.00 USD** (the zero-account-currency row).
   - Either way: **AR-USD balance after = 0.00 USD and 0.00 ILS** (AC-3's "AR in USD
     shows 0"). SINV-A → Paid.
3. Cancel PAY-1 → interlock unlinks, EGOL JE auto-cancels, AR back to 100 USD / 370 ILS,
   SINV-A → Unpaid. (The M3-era regression check for §3 hook 3/4.)

**Story B — partial payment + ERR on the remainder.**
1. SINV-B: USD 100 @ 3.70 (booked base 370.00).
2. Feb 1: receive **USD 60** @ 3.60 → realized loss = 60 × 0.10 = **6.00 ILS**;
   outstanding 40 USD, booked base 148.00.
3. Mar 31: ERR at rate **3.55** → new base = 40 × 3.55 = 142.00; **unrealized loss
   6.00 ILS**. ERR JE: Dr Unrealized-EGOL 6.00, Cr AR-USD 6.00 ILS / 0.00 USD (party
   sub-balance row). Booked-vs-unbooked: 6.00 unbooked until a later settlement realizes
   it.

**Story C — JOD purchase, payable side (sign mirror).**
1. Jan 15: PINV-C supplier "Aqaba Vet Supplies", **JOD 50** @ 5.20 → Cr AP-JOD 260.00 ILS
   / 50.00 JOD.
2. Feb 10: PAY-2 Pay JOD 50 @ **5.30** → baseReceived side 265.00. Realized
   **loss = 50 × (5.30 − 5.20) = 5.00 ILS** (paying a payable at a higher rate costs
   more base). GL (setting `Payment`): Dr AP-JOD 260.00 ILS / 50.00 JOD, Dr EGOL 5.00,
   Cr Bank 265.00. AP-JOD after = 0 in both currencies.

Every figure above is a one-line multiplication — the walkthrough script can verify each
GL row by hand. AC-3 is Story A verbatim (with 3.7/3.6 exactly as the BRD states it).

---

## 5. Risk list — where P8 might force CHANGES to P0–P7 code

| # | Risk | Mitigation |
|---|---|---|
| 1 | **Hand-written PLE inserts in the P7 settlement movers** (`relinkAdvanceToInvoice`, `unreconcilePayment`, `enforceInvoiceCancelInterlock`) copy `amount`/`amountInAccountCurrency` 1:1 — correct at rate=1, but with a foreign party account the two differ and every move must carry **both** proportionally. Highest-blast-radius P7 touch. | Audit all three files' PLE writes first task of P8.2; add a shared `movePleSlice` helper so the proportion math lives once; regression: rerun the entire P7 suite with a foreign-currency fixture party. |
| 2 | **`assertDifferenceZero` / allocation units**: allocations are account-currency amounts; payment amounts are transaction-currency. Same thing at rate=1 — not after. `assertAllocationSign` compares allocated vs PLE outstanding (account currency): fine, but the PE totals gate mixes units unless base-normalized. | Move the difference gate to base terms (§2/[P8.2]); add unit-mismatch tests (USD allocation vs ILS paid amount). |
| 3 | **Invoice services hardcode `conversionRate: "1"`** (sales `:228`, purchase `:234`) and the §8 calculator's outputs are consumed as if base. | The calculator stays transaction-currency (correct per BRD §8); only the GL composers multiply by rate. Golden fixtures (P4.3) unchanged; add rate≠1 composer fixtures. |
| 4 | **Client-side money sums** (`sumAmountStrings`) sum mixed-currency strings blindly — the P7 stats cards (e.g. «مقبوضات») would add USD to ILS. | P8 UI task: group stats by currency or sum base mirrors only; audit every `sumAmountStrings` call site (they're few — list screens' stats). |
| 5 | **`JE_VOUCHER_TYPES` is a closed 5-value list** (`journal-entry.type.ts:13`) reused by zod schemas + `isJeVoucherType`; adding "Exchange Rate Revaluation" / "Exchange Gain Or Loss" ripples into validation tests and any exhaustive switch. | Additive change; grep for exhaustive handling before extending; system types stay UI-hidden for manual creation (`isSystemGenerated` gate). |
| 6 | **Fixtures/seed assume SAR everywhere** (e.g. `payment-entry.allocation.db.test.ts:76`, demo seed, `gl-test-fixture.ts`); the FX scenario needs an ILS-base clinic + USD/JOD accounts. | Extend `gl-test-fixture.ts` with an FX variant rather than editing the base fixture — existing suites stay untouched. |
| 7 | **`inWords` (print) is Arabic riyal wording**; USD/JOD documents would print the wrong currency name. | Currency-aware `inWords` keyed off document currency — additive utility change, but the P5.9/P7.9 print layouts embed it, so both prints need a pass. |
| 8 | **Round-off GLE transaction mirror**: §6 step 8 writes the round-off row from the base diff; BRD requires the transaction-currency diff mirrored on it. At rate=1 they're equal — verify the engine actually mirrors rather than duplicating base. | Covered by the [P8.1] engine tri-currency persistence audit test. |
| 9 | **Reports display raw amounts** (registers, payment reports, trial balance) without currency columns; mixed-currency data would be ambiguous rather than wrong (server sums are per-account/base). | Add currency code columns + base-vs-account toggle where the BRD's report specs require; display-layer only. |
| 10 | **Rate timing**: rate resolved at save can be stale by submit. | Resolve at save, `assertNotStale` re-check at submit (§2/[P8.5]); manual doc rates exempt. |

Risks 1–2 are the only ones touching P7 **logic**; both are contained behind seams built
this phase and carry their own regression suites. Everything else is additive or
display-layer.

---

## 6. Suggested P8 commit slicing (refines the phases file, no reordering)

[P8.1a] engine persistence audit + JE multi-currency rows → [P8.1b] invoice
conversion-rate activation → [P8.2a] PLE-mover triplet audit (risk 1) → [P8.2b] PE
cross-currency amounts + per-reference gain/loss + `Payment`-mode deduction → [P8.2c]
system EGOL JE + linkage column + auto-cancel hooks (closes §7.9) → [P8.3] guard setting →
[P8.4] ERR doctype + screen → [P8.5] provider + job + stale-live → FX demo seed (§4
stories) + AC-3 acceptance suite.
