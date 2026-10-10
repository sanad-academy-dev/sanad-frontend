# Multi-currency is display-only; amounts stored in clinic's local currency

> **⚠️ Partially superseded by [ADR-0002](./0002-full-multi-currency-accounting-ledger.md).**
> This ADR still governs **operational** money (`Invoice`, `Sale`, `Expense` totals,
> `formatCurrency`, session `currencyCode`). The **accounting ledger** (`gl_entry`,
> `payment_ledger_entry`, accounting vouchers) is fully multi-currency per ADR-0002.

Currency in Elite Vet is a display preference, not a stored denomination. Each clinic has a single `currencyCode` (ISO 4217 string, default `"SAR"`) on `ClinicSettings`. All `Decimal(10,2)` money fields are implicitly in that clinic's currency — there is no canonical/normalized currency and no FX conversion layer.

We chose this over a "store in canonical currency, convert for display" approach because clinics are single-country deployments with no cross-clinic financial aggregation requirement. Adding FX conversion and exchange rate management would be pure complexity with no business value at this stage.

## Consequences

- `currencyCode` is snapshotted on `Invoice` at creation (same pattern as `vatRate`) so historical invoices retain their original currency label even if the clinic later changes their setting.
- `currencyCode` is carried in the session alongside `activeClinicId` for zero-latency access in any component that renders money.
- A `formatCurrency(amount, currencyCode)` utility at `src/lib/format-currency.ts` wraps `Intl.NumberFormat` and handles Prisma `Decimal` inputs — all money rendering goes through this.
- When Stripe is integrated, `Invoice` already has both the amount and the `currencyCode` needed to create a `PaymentIntent`. `stripePaymentIntentId` is added as a nullable field now to avoid a migration during live payment flows.
- If cross-currency clinics are ever needed, the migration path is: add FX rate storage, keep the snapshot pattern, convert at read time. The snapshot design does not block this.
