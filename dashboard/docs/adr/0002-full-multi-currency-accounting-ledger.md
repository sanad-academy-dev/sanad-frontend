# ADR-0002 — Full multi-currency in the accounting ledger (supersedes ADR-0001)

**Status:** Accepted · **Supersedes:** [ADR-0001](./0001-multi-currency-display-only.md)
(multi-currency display-only) · **Scope:** the accounting module only (`gl_entry`,
`payment_ledger_entry`, and all new accounting vouchers). Existing operational documents
(`Invoice`, `Sale`, `Expense`, …) are unaffected by this ADR until their posting adapters
are wired.

## Context

ADR-0001 declared currency a display preference: one `currencyCode` per clinic, all
`Decimal(10,2)` money implicitly in that currency, **no canonical currency and no FX
layer**. That decision was correct for a single-country billing app and remains correct
for the operational (non-accounting) surface.

The accounting module (`BRD_Accounting_Module.md`) has a different, hard requirement:
**mixed ILS / USD / JOD operations** are a market necessity. BRD §5.1 (AR-5) mandates
tri-currency storage on every GL entry, and BRD §9 + phase **P8** require per-document
conversion rates, foreign-currency accounts, realized/unrealized exchange gain/loss, and
Exchange Rate Revaluation. This is exactly the "FX conversion and exchange rate
management" ADR-0001 chose to avoid — the two cannot both hold for the ledger.

## Decision

**The accounting ledger is fully multi-currency.** For the accounting module we supersede
ADR-0001:

1. **Tri-currency storage from day one (schema, P2).** `gl_entry` (and `payment_ledger_
   entry` where applicable) carry the full BRD §5.1 column set from the P2 migration:
   - base: `debit` / `credit` (company/base currency)
   - account currency: `debitInAccountCurrency` / `creditInAccountCurrency` +
     `accountCurrency`
   - transaction currency: `debitInTransactionCurrency` / `creditInTransactionCurrency` +
     `transactionCurrency`, `transactionExchangeRate`
   (Reporting/presentation currency, the optional 4th set, stays [P2]/later.)

2. **Phased activation matches `IMPLEMENTATION_PHASES.md` exactly.** Phases **P0–P7 run
   operationally single-currency**: `transactionExchangeRate = 1`, account currency = base
   currency, all three amount triplets equal. No FX math, no rate provider, no revaluation
   before P8. This preserves ADR-0001's "no FX complexity" posture for everything shipped
   pre-P8 while the schema is already correct.

3. **Full FX activates at P8.** Foreign-currency accounts, per-document `conversionRate`,
   realized gain/loss on payment (BR-7.4.4), Exchange Rate Revaluation (FR-9.3), and the
   rate provider + stale-rate guard (§4.7) come online in Phase 8, gated by
   `accounts_settings` flags. A clinic that never enables a second currency behaves
   exactly as a single-currency ledger indefinitely.

4. **Base currency = the company's (clinic's) default currency** (`ClinicSettings.
   currencyCode`), per BRD glossary. All base `debit`/`credit` are stored in it.

5. **Existing operational screens stay display-only** (ADR-0001 semantics intact) until
   each module's posting adapter is wired (contract §7). The adapter is the single
   boundary where an operational amount is lifted into the tri-currency ledger (pre-P8:
   rate 1).

## Consequences

- ADR-0001 remains the governing decision for **operational** money (`Invoice`, `Sale`,
  `Expense` totals, `formatCurrency`, the session `currencyCode`). This ADR narrows it: it
  no longer governs the accounting ledger.
- The ledger schema is FX-ready before any FX code exists — no destructive migration when
  P8 lands (honoring ADR-0001's own stated migration path: "add FX rate storage, keep the
  snapshot pattern, convert at read time").
- Accounting money and exchange rates use `Decimal(21,9)` (see contract C2 / BRD NFR-2),
  not the operational `Decimal(10,2)`.
- Rounding to a currency's fraction units happens only at document boundaries (BR-8.1);
  intermediate ledger math is full-precision decimal.
- A pre-P8 reviewer will see tri-currency columns populated with equal triplets and
  `rate = 1` — this is intended, not dead schema.

## Compliance

Per the accounting standing rules (CLAUDE.md), an ADR is never silently overridden. This
ADR is the explicit, written supersession of ADR-0001 for the ledger scope. ADR-0001 has
been annotated with a pointer here.
