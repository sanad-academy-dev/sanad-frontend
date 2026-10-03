# Bank statement import — mapping templates ([P11.2], FR-14.1)

The importer turns a bank's CSV/XLSX export into submitted **Bank Transactions** through a
**column mapping**. A mapping says which column holds what, how dates are written, and how
amounts are signed. Nothing about a bank's layout is hard-coded in the importer itself.

## Built-in presets

| Key | Bank | Status |
|---|---|---|
| `generic` | — (date, description, reference, debit, credit) | usable as-is |
| `bank_of_palestine` | بنك فلسطين | ⚠ **UNVERIFIED** placeholder |
| `cairo_amman_bank` | بنك القاهرة عمان | ⚠ **UNVERIFIED** placeholder |
| `arab_bank` | البنك العربي (signed single-amount shape) | ⚠ **UNVERIFIED** placeholder |

The three bank presets exist so a first real statement needs only column-index
adjustments — **they are deliberate placeholders, not verified layouts** (owner directive
at the P11 kickoff: never guess a bank's columns as fact). On the first real statement
from each bank, compare its header row against the preset, adjust, and save a clinic
mapping (below); once confirmed against a real file, promote the preset in
`statement-parser.ts` and flip `verified: true`.

## Adding your bank (the supported flow)

1. Export one real statement (CSV or XLSX) from the bank portal.
2. Open it and note: how many header rows, which columns hold date / description /
   reference / amounts, the date format, and whether amounts are one signed column or
   separate debit/credit columns.
3. Create a clinic mapping: `POST /api/accounting/bank-transactions/mappings` with
   `{ templateName, bankId?, config }` where `config` is:

```jsonc
{
  "headerRows": 1,            // rows to skip
  "delimiter": ",",          // CSV only, optional
  "dateColumn": 0,            // 0-based indexes
  "dateFormat": "DD/MM/YYYY", // YYYY-MM-DD · DD/MM/YYYY · MM/DD/YYYY · DD-MM-YYYY · DD.MM.YYYY
  "descriptionColumn": 1,
  "referenceColumn": 2,       // optional
  "transactionIdColumn": 5,   // optional — the bank's own id, best dedupe key
  "debitColumn": 3,           // money OUT (withdrawal)
  "creditColumn": 4,          // money IN (deposit)
  // OR instead of debit/credit:
  "amountColumn": 3           // one signed column — negative = withdrawal
}
```

4. Import with `mappingId` instead of `presetKey`. Row-level failures come back with row
   numbers; nothing partial is hidden (the import record stores every error).

## Dedupe (FR-14.1)

- With a `transactionIdColumn`: the bank's id is unique per bank account — re-importing
  a file (or overlapping exports) skips existing rows as duplicates.
- Without one: a deterministic fingerprint of (date, amounts, description, reference)
  plus an ordinal for identical rows within one file. Re-importing the same file is a
  no-op; two genuinely identical payments in one statement are both kept.

Amounts accept Western and Arabic-Indic digits, thousand separators, and parenthesised
negatives. All amount math runs through the decimal library (contract C2).
