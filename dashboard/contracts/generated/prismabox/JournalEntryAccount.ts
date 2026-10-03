import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const JournalEntryAccountPlain = t.Object(
  {
    id: t.String(),
    journalEntryId: t.String(),
    idx: t.Integer(),
    accountId: t.String(),
    debit: t.Number(),
    credit: t.Number(),
    costCenterId: __nullable__(t.String()),
    userRemark: __nullable__(t.String()),
    dim1: __nullable__(t.String()),
    dim2: __nullable__(t.String()),
    dim3: __nullable__(t.String()),
    dim4: __nullable__(t.String()),
    clearanceDate: __nullable__(t.Date()),
    exchangeRate: t.Number(),
    debitInAccountCurrency: t.Number(),
    creditInAccountCurrency: t.Number(),
    partyType: __nullable__(t.String()),
    partyId: __nullable__(t.String()),
    referenceType: __nullable__(t.String()),
    referenceId: __nullable__(t.String()),
  },
  { additionalProperties: false },
);

export const JournalEntryAccountRelations = t.Object(
  {
    journalEntry: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        documentNo: __nullable__(t.String()),
        docstatus: t.Union(
          [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
          { additionalProperties: false },
        ),
        postingDate: t.Date(),
        amendedFromId: __nullable__(t.String()),
        voucherType: t.String(),
        chequeNo: __nullable__(t.String()),
        chequeDate: __nullable__(t.Date()),
        remark: __nullable__(t.String()),
        multiCurrency: t.Boolean(),
        isSystemGenerated: t.Boolean(),
        totalDebit: t.Number(),
        totalCredit: t.Number(),
        dim1: __nullable__(t.String()),
        dim2: __nullable__(t.String()),
        dim3: __nullable__(t.String()),
        dim4: __nullable__(t.String()),
        createdById: __nullable__(t.String()),
        submittedAt: __nullable__(t.Date()),
        submittedById: __nullable__(t.String()),
        cancelledAt: __nullable__(t.Date()),
        cancelledById: __nullable__(t.String()),
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
    costCenter: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          costCenterName: t.String(),
          costCenterNumber: __nullable__(t.String()),
          parentCostCenterId: __nullable__(t.String()),
          isGroup: t.Boolean(),
          disabled: t.Boolean(),
          lft: t.Integer(),
          rgt: t.Integer(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const JournalEntryAccountPlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    debit: t.Optional(t.Number()),
    credit: t.Optional(t.Number()),
    userRemark: t.Optional(__nullable__(t.String())),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    clearanceDate: t.Optional(__nullable__(t.Date())),
    exchangeRate: t.Optional(t.Number()),
    debitInAccountCurrency: t.Optional(t.Number()),
    creditInAccountCurrency: t.Optional(t.Number()),
    partyType: t.Optional(__nullable__(t.String())),
    referenceType: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const JournalEntryAccountPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    debit: t.Optional(t.Number()),
    credit: t.Optional(t.Number()),
    userRemark: t.Optional(__nullable__(t.String())),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    clearanceDate: t.Optional(__nullable__(t.Date())),
    exchangeRate: t.Optional(t.Number()),
    debitInAccountCurrency: t.Optional(t.Number()),
    creditInAccountCurrency: t.Optional(t.Number()),
    partyType: t.Optional(__nullable__(t.String())),
    referenceType: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const JournalEntryAccountRelationsInputCreate = t.Object(
  {
    journalEntry: t.Object(
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
    costCenter: t.Optional(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const JournalEntryAccountRelationsInputUpdate = t.Partial(
  t.Object(
    {
      journalEntry: t.Object(
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
      costCenter: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const JournalEntryAccountWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          journalEntryId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          debit: t.Number(),
          credit: t.Number(),
          costCenterId: t.String(),
          userRemark: t.String(),
          dim1: t.String(),
          dim2: t.String(),
          dim3: t.String(),
          dim4: t.String(),
          clearanceDate: t.Date(),
          exchangeRate: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          partyType: t.String(),
          partyId: t.String(),
          referenceType: t.String(),
          referenceId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "JournalEntryAccount" },
  ),
);

export const JournalEntryAccountWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
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
              journalEntryId: t.String(),
              idx: t.Integer(),
              accountId: t.String(),
              debit: t.Number(),
              credit: t.Number(),
              costCenterId: t.String(),
              userRemark: t.String(),
              dim1: t.String(),
              dim2: t.String(),
              dim3: t.String(),
              dim4: t.String(),
              clearanceDate: t.Date(),
              exchangeRate: t.Number(),
              debitInAccountCurrency: t.Number(),
              creditInAccountCurrency: t.Number(),
              partyType: t.String(),
              partyId: t.String(),
              referenceType: t.String(),
              referenceId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "JournalEntryAccount" },
);

export const JournalEntryAccountSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      journalEntryId: t.Boolean(),
      idx: t.Boolean(),
      accountId: t.Boolean(),
      debit: t.Boolean(),
      credit: t.Boolean(),
      costCenterId: t.Boolean(),
      userRemark: t.Boolean(),
      dim1: t.Boolean(),
      dim2: t.Boolean(),
      dim3: t.Boolean(),
      dim4: t.Boolean(),
      clearanceDate: t.Boolean(),
      exchangeRate: t.Boolean(),
      debitInAccountCurrency: t.Boolean(),
      creditInAccountCurrency: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      referenceType: t.Boolean(),
      referenceId: t.Boolean(),
      journalEntry: t.Boolean(),
      account: t.Boolean(),
      costCenter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const JournalEntryAccountInclude = t.Partial(
  t.Object(
    {
      journalEntry: t.Boolean(),
      account: t.Boolean(),
      costCenter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const JournalEntryAccountOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      journalEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      debit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      credit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userRemark: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim1: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim2: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim3: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim4: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clearanceDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      exchangeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      debitInAccountCurrency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      creditInAccountCurrency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const JournalEntryAccount = t.Composite(
  [JournalEntryAccountPlain, JournalEntryAccountRelations],
  { additionalProperties: false },
);

export const JournalEntryAccountInputCreate = t.Composite(
  [
    JournalEntryAccountPlainInputCreate,
    JournalEntryAccountRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const JournalEntryAccountInputUpdate = t.Composite(
  [
    JournalEntryAccountPlainInputUpdate,
    JournalEntryAccountRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
