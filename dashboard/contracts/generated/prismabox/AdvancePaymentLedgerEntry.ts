import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdvancePaymentLedgerEntryPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    postingDate: t.Date(),
    accountId: t.String({
      description: `the advance account itself — a plain liability/asset, so it carries NO party on the GL`,
    }),
    accountCurrencyCode: t.String(),
    partyType: t.String({
      description: `the party the advance belongs to (C6) — the fact BR-4.3.3 will not let the GL row hold`,
    }),
    partyId: t.String(),
    voucherType: t.String(),
    voucherId: t.String(),
    voucherNo: t.String(),
    againstVoucherType: t.String({
      description: `self while the advance is open; the invoice once released`,
    }),
    againstVoucherId: t.String(),
    againstVoucherNo: __nullable__(t.String()),
    amount: t.Number(),
    amountInAccountCurrency: t.Number(),
    delinked: t.Boolean(),
    costCenterId: __nullable__(t.String()),
    remarks: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
  },
);

export const AdvancePaymentLedgerEntryRelations = t.Object(
  {
    clinic: t.Object(
      {
        id: t.String(),
        name: t.String(),
        slug: __nullable__(t.String()),
        plan: t.Union(
          [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
          { additionalProperties: false },
        ),
        trialEndsAt: __nullable__(t.Date()),
        onboardingCompleted: t.Boolean(),
        rbacVersion: t.Integer({
          description: `[RBAC P4] يُرفَع عند أيّ كتابة على دور أو منحة أو إسناد. الجلسة تحمل النسخة التي
بُنيت منها لقطتُها، فتُعيد بناءها ذاتيًا عند الاختلاف بدل حذف الجلسات وإخراج المستخدم.`,
        }),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    account: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        accountName: t.String(),
        accountNumber: __nullable__(t.String()),
        parentAccountId: __nullable__(t.String()),
        isGroup: t.Boolean(),
        rootType: t.Union(
          [
            t.Literal("ASSET"),
            t.Literal("LIABILITY"),
            t.Literal("INCOME"),
            t.Literal("EXPENSE"),
            t.Literal("EQUITY"),
          ],
          { additionalProperties: false },
        ),
        reportType: t.Union(
          [t.Literal("BALANCE_SHEET"), t.Literal("PROFIT_AND_LOSS")],
          { additionalProperties: false },
        ),
        accountType: __nullable__(
          t.Union(
            [
              t.Literal("BANK"),
              t.Literal("CASH"),
              t.Literal("RECEIVABLE"),
              t.Literal("PAYABLE"),
              t.Literal("TAX"),
              t.Literal("STOCK"),
              t.Literal("FIXED_ASSET"),
              t.Literal("ACCUMULATED_DEPRECIATION"),
              t.Literal("DEPRECIATION"),
              t.Literal("EXPENSE_ACCOUNT"),
              t.Literal("INCOME_ACCOUNT"),
              t.Literal("CHARGEABLE"),
              t.Literal("ROUND_OFF"),
              t.Literal("ROUND_OFF_FOR_OPENING"),
              t.Literal("TEMPORARY"),
              t.Literal("EQUITY"),
              t.Literal("DIRECT_INCOME"),
              t.Literal("INDIRECT_INCOME"),
              t.Literal("DIRECT_EXPENSE"),
              t.Literal("INDIRECT_EXPENSE"),
              t.Literal("COST_OF_GOODS_SOLD"),
              t.Literal("CURRENT_ASSET"),
              t.Literal("CURRENT_LIABILITY"),
              t.Literal("CAPITAL_WORK_IN_PROGRESS"),
              t.Literal("ASSET_RECEIVED_BUT_NOT_BILLED"),
              t.Literal("STOCK_RECEIVED_BUT_NOT_BILLED"),
              t.Literal("SERVICE_RECEIVED_BUT_NOT_BILLED"),
              t.Literal("STOCK_ADJUSTMENT"),
            ],
            { additionalProperties: false },
          ),
        ),
        accountCurrencyCode: t.String(),
        taxRate: __nullable__(t.Number()),
        balanceMustBe: t.Union(
          [t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")],
          { additionalProperties: false },
        ),
        freezeAccount: t.Boolean(),
        disabled: t.Boolean(),
        lft: t.Integer(),
        rgt: t.Integer(),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    accountCurrency: t.Object(
      {
        code: t.String(),
        name: t.String(),
        nameAr: t.String(),
        symbol: __nullable__(t.String()),
        fractionUnits: t.Integer(),
        fractionNameEn: __nullable__(t.String()),
        fractionNameAr: __nullable__(t.String()),
        smallestUnit: t.Number(),
        enabled: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
  },
);

export const AdvancePaymentLedgerEntryPlainInputCreate = t.Object(
  {
    postingDate: t.Date(),
    accountCurrencyCode: t.String(),
    partyType: t.String({
      description: `the party the advance belongs to (C6) — the fact BR-4.3.3 will not let the GL row hold`,
    }),
    voucherType: t.String(),
    voucherNo: t.String(),
    againstVoucherType: t.String({
      description: `self while the advance is open; the invoice once released`,
    }),
    againstVoucherNo: t.Optional(__nullable__(t.String())),
    amount: t.Number(),
    amountInAccountCurrency: t.Number(),
    delinked: t.Optional(t.Boolean()),
    remarks: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
  },
);

export const AdvancePaymentLedgerEntryPlainInputUpdate = t.Object(
  {
    postingDate: t.Optional(t.Date()),
    accountCurrencyCode: t.Optional(t.String()),
    partyType: t.Optional(
      t.String({
        description: `the party the advance belongs to (C6) — the fact BR-4.3.3 will not let the GL row hold`,
      }),
    ),
    voucherType: t.Optional(t.String()),
    voucherNo: t.Optional(t.String()),
    againstVoucherType: t.Optional(
      t.String({
        description: `self while the advance is open; the invoice once released`,
      }),
    ),
    againstVoucherNo: t.Optional(__nullable__(t.String())),
    amount: t.Optional(t.Number()),
    amountInAccountCurrency: t.Optional(t.Number()),
    delinked: t.Optional(t.Boolean()),
    remarks: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
  },
);

export const AdvancePaymentLedgerEntryRelationsInputCreate = t.Object(
  {
    clinic: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    account: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    accountCurrency: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
  },
);

export const AdvancePaymentLedgerEntryRelationsInputUpdate = t.Partial(
  t.Object(
    {
      clinic: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      account: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      accountCurrency: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    },
    {
      additionalProperties: false,
      description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
    },
  ),
);

export const AdvancePaymentLedgerEntryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          postingDate: t.Date(),
          accountId: t.String({
            description: `the advance account itself — a plain liability/asset, so it carries NO party on the GL`,
          }),
          accountCurrencyCode: t.String(),
          partyType: t.String({
            description: `the party the advance belongs to (C6) — the fact BR-4.3.3 will not let the GL row hold`,
          }),
          partyId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          againstVoucherType: t.String({
            description: `self while the advance is open; the invoice once released`,
          }),
          againstVoucherId: t.String(),
          againstVoucherNo: t.String(),
          amount: t.Number(),
          amountInAccountCurrency: t.Number(),
          delinked: t.Boolean(),
          costCenterId: t.String(),
          remarks: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
        },
      ),
    { $id: "AdvancePaymentLedgerEntry" },
  ),
);

export const AdvancePaymentLedgerEntryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId: t.String(),
              postingDate: t.Date(),
              accountId: t.String({
                description: `the advance account itself — a plain liability/asset, so it carries NO party on the GL`,
              }),
              accountCurrencyCode: t.String(),
              partyType: t.String({
                description: `the party the advance belongs to (C6) — the fact BR-4.3.3 will not let the GL row hold`,
              }),
              partyId: t.String(),
              voucherType: t.String(),
              voucherId: t.String(),
              voucherNo: t.String(),
              againstVoucherType: t.String({
                description: `self while the advance is open; the invoice once released`,
              }),
              againstVoucherId: t.String(),
              againstVoucherNo: t.String(),
              amount: t.Number(),
              amountInAccountCurrency: t.Number(),
              delinked: t.Boolean(),
              costCenterId: t.String(),
              remarks: t.String(),
              createdById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AdvancePaymentLedgerEntry" },
);

export const AdvancePaymentLedgerEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      postingDate: t.Boolean(),
      accountId: t.Boolean(),
      accountCurrencyCode: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      voucherType: t.Boolean(),
      voucherId: t.Boolean(),
      voucherNo: t.Boolean(),
      againstVoucherType: t.Boolean(),
      againstVoucherId: t.Boolean(),
      againstVoucherNo: t.Boolean(),
      amount: t.Boolean(),
      amountInAccountCurrency: t.Boolean(),
      delinked: t.Boolean(),
      costCenterId: t.Boolean(),
      remarks: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      account: t.Boolean(),
      accountCurrency: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
    },
  ),
);

export const AdvancePaymentLedgerEntryInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      account: t.Boolean(),
      accountCurrency: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
    },
  ),
);

export const AdvancePaymentLedgerEntryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountCurrencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      againstVoucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      againstVoucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      againstVoucherNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amountInAccountCurrency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      delinked: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      remarks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
    },
  ),
);

export const AdvancePaymentLedgerEntry = t.Composite(
  [AdvancePaymentLedgerEntryPlain, AdvancePaymentLedgerEntryRelations],
  { additionalProperties: false },
);

export const AdvancePaymentLedgerEntryInputCreate = t.Composite(
  [
    AdvancePaymentLedgerEntryPlainInputCreate,
    AdvancePaymentLedgerEntryRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const AdvancePaymentLedgerEntryInputUpdate = t.Composite(
  [
    AdvancePaymentLedgerEntryPlainInputUpdate,
    AdvancePaymentLedgerEntryRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
