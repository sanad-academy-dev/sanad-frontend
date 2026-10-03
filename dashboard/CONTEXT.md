# Elite Vet

A multi-tenant veterinary clinic management platform. Each **Clinic** operates independently with its own settings, staff, patients, and financial records.

## Language

### Billing & Money

**Clinic Currency**: The ISO 4217 currency code a clinic operates in (e.g., `"SAR"`). Stored on `ClinicSettings`, carried in the session, and used for display formatting only — it does not affect how amounts are stored in the database.
_Avoid_: locale currency, display currency

**Money Amount**: A monetary value stored as `Decimal(10,2)` in the clinic's own currency. Never stored in a canonical/normalized currency — there is no cross-clinic FX conversion.
_Avoid_: price, cost (use specific field names like `subtotal`, `total`, `priceSnapshot`)

**Invoice**: A financial record created at the end of an appointment, capturing a snapshot of all amounts, VAT rate, discount, and currency at the moment of creation. Immutable financial snapshots — not recalculated from current prices after creation.
_Avoid_: bill, receipt

**Financial Snapshot**: Fields on `Invoice` (and `AppointmentService`) that capture the value of a mutable setting at invoice creation time — `priceSnapshot`, `vatRate`, `currencyCode`. Protects historical records from future setting changes.

**Payment**: The act of settling an `Invoice`, either partially or in full. A payment records the method used and contributes to `amountPaid`.
_Avoid_: charge, transaction

**VAT Rate**: The value-added tax percentage applied to an invoice, snapshotted from `ClinicSettings.vatRate` at invoice creation.

### Clinic & Tenancy

**Clinic**: The top-level tenant. Owns all data — patients, staff, invoices, inventory.

**Active Clinic**: The clinic a user is currently operating within, stored in their session as `activeClinicId`. A user may belong to multiple clinics.

**Branch**: A physical location belonging to a Clinic.

## Relationships

- A **Clinic** has one `ClinicSettings` which holds its **Clinic Currency**
- An **Invoice** belongs to exactly one **Clinic** and snapshots the **Clinic Currency** at creation
- A **Payment** settles an **Invoice** partially or fully
- **Money Amounts** on an **Invoice** are always in the **Clinic Currency** snapshotted on that invoice

## Example dialogue

> **Dev:** "If a clinic changes their currency from SAR to AED, do old invoices update?"
> **Domain expert:** "No — the **Financial Snapshot** on each **Invoice** preserves the **Clinic Currency** at the time of creation. Old invoices stay in SAR."

> **Dev:** "Where do I get the currency to format a price on the services list page?"
> **Domain expert:** "From the session — **Clinic Currency** is always in the active session. No extra fetch needed."

## Flagged ambiguities

- "currency" was used loosely to mean both formatting preference and stored amount denomination — resolved: **Clinic Currency** is display-only; **Money Amounts** are always stored as plain `Decimal(10,2)` in the clinic's currency with no FX layer.
