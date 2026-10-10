import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExchangeRateRevaluationAccountPlain = t.Object(
  {
    id: t.String(),
    revaluationId: t.String(),
    idx: t.Integer(),
    accountId: t.String(),
    accountCurrencyCode: t.String(),
    partyType: __nullable__(t.String()),
    partyId: __nullable__(t.String()),
    balanceInAccountCurrency: t.Number(),
    bookedBase: t.Number(),
    currentExchangeRate: t.Number(),
    newBase: t.Number(),
    gainLoss: t.Number(),
    isZeroForeignSweep: t.Boolean(),
  },
  { additionalProperties: false },
);

export const ExchangeRateRevaluationAccountRelations = t.Object(
  {
    revaluation: t.Object(
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
        roundingLossAllowance: t.Number(),
        totalGainLoss: t.Number(),
        journalEntryId: __nullable__(t.String()),
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
  },
  { additionalProperties: false },
);

export const ExchangeRateRevaluationAccountPlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    accountCurrencyCode: t.String(),
    partyType: t.Optional(__nullable__(t.String())),
    balanceInAccountCurrency: t.Optional(t.Number()),
    bookedBase: t.Optional(t.Number()),
    currentExchangeRate: t.Optional(t.Number()),
    newBase: t.Optional(t.Number()),
    gainLoss: t.Optional(t.Number()),
    isZeroForeignSweep: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ExchangeRateRevaluationAccountPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    accountCurrencyCode: t.Optional(t.String()),
    partyType: t.Optional(__nullable__(t.String())),
    balanceInAccountCurrency: t.Optional(t.Number()),
    bookedBase: t.Optional(t.Number()),
    currentExchangeRate: t.Optional(t.Number()),
    newBase: t.Optional(t.Number()),
    gainLoss: t.Optional(t.Number()),
    isZeroForeignSweep: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ExchangeRateRevaluationAccountRelationsInputCreate = t.Object(
  {
    revaluation: t.Object(
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
  },
  { additionalProperties: false },
);

export const ExchangeRateRevaluationAccountRelationsInputUpdate = t.Partial(
  t.Object(
    {
      revaluation: t.Object(
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
    },
    { additionalProperties: false },
  ),
);

export const ExchangeRateRevaluationAccountWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          revaluationId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          accountCurrencyCode: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          balanceInAccountCurrency: t.Number(),
          bookedBase: t.Number(),
          currentExchangeRate: t.Number(),
          newBase: t.Number(),
          gainLoss: t.Number(),
          isZeroForeignSweep: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "ExchangeRateRevaluationAccount" },
  ),
);

export const ExchangeRateRevaluationAccountWhereUnique = t.Recursive(
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
              revaluationId: t.String(),
              idx: t.Integer(),
              accountId: t.String(),
              accountCurrencyCode: t.String(),
              partyType: t.String(),
              partyId: t.String(),
              balanceInAccountCurrency: t.Number(),
              bookedBase: t.Number(),
              currentExchangeRate: t.Number(),
              newBase: t.Number(),
              gainLoss: t.Number(),
              isZeroForeignSweep: t.Boolean(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ExchangeRateRevaluationAccount" },
);

export const ExchangeRateRevaluationAccountSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      revaluationId: t.Boolean(),
      idx: t.Boolean(),
      accountId: t.Boolean(),
      accountCurrencyCode: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      balanceInAccountCurrency: t.Boolean(),
      bookedBase: t.Boolean(),
      currentExchangeRate: t.Boolean(),
      newBase: t.Boolean(),
      gainLoss: t.Boolean(),
      isZeroForeignSweep: t.Boolean(),
      revaluation: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ExchangeRateRevaluationAccountInclude = t.Partial(
  t.Object(
    { revaluation: t.Boolean(), account: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ExchangeRateRevaluationAccountOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      revaluationId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      balanceInAccountCurrency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bookedBase: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currentExchangeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      newBase: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gainLoss: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isZeroForeignSweep: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ExchangeRateRevaluationAccount = t.Composite(
  [
    ExchangeRateRevaluationAccountPlain,
    ExchangeRateRevaluationAccountRelations,
  ],
  { additionalProperties: false },
);

export const ExchangeRateRevaluationAccountInputCreate = t.Composite(
  [
    ExchangeRateRevaluationAccountPlainInputCreate,
    ExchangeRateRevaluationAccountRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ExchangeRateRevaluationAccountInputUpdate = t.Composite(
  [
    ExchangeRateRevaluationAccountPlainInputUpdate,
    ExchangeRateRevaluationAccountRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
