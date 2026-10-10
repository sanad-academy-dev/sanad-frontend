import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountClosingBalancePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    periodClosingVoucherId: t.String(),
    closingDate: t.Date(),
    accountId: t.String(),
    partyType: __nullable__(t.String()),
    partyId: __nullable__(t.String()),
    costCenterId: __nullable__(t.String()),
    dim1: __nullable__(t.String()),
    dim2: __nullable__(t.String()),
    dim3: __nullable__(t.String()),
    dim4: __nullable__(t.String()),
    debit: t.Number(),
    credit: t.Number(),
    debitInAccountCurrency: t.Number(),
    creditInAccountCurrency: t.Number(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AccountClosingBalanceRelations = t.Object(
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
    pcv: t.Object(
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
        fiscalYear: t.String(),
        periodStartDate: t.Date(),
        periodEndDate: t.Date(),
        closingAccountHeadId: t.String(),
        remarks: __nullable__(t.String()),
        granularByDimensions: t.Boolean(),
        gleProcessingStatus: t.Union(
          [
            t.Literal("QUEUED"),
            t.Literal("IN_PROGRESS"),
            t.Literal("COMPLETED"),
            t.Literal("FAILED"),
          ],
          { additionalProperties: false },
        ),
        errorMessage: __nullable__(t.String()),
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

export const AccountClosingBalancePlainInputCreate = t.Object(
  {
    closingDate: t.Date(),
    partyType: t.Optional(__nullable__(t.String())),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    debit: t.Optional(t.Number()),
    credit: t.Optional(t.Number()),
    debitInAccountCurrency: t.Optional(t.Number()),
    creditInAccountCurrency: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const AccountClosingBalancePlainInputUpdate = t.Object(
  {
    closingDate: t.Optional(t.Date()),
    partyType: t.Optional(__nullable__(t.String())),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    debit: t.Optional(t.Number()),
    credit: t.Optional(t.Number()),
    debitInAccountCurrency: t.Optional(t.Number()),
    creditInAccountCurrency: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const AccountClosingBalanceRelationsInputCreate = t.Object(
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
    pcv: t.Object(
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

export const AccountClosingBalanceRelationsInputUpdate = t.Partial(
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
      pcv: t.Object(
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

export const AccountClosingBalanceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          periodClosingVoucherId: t.String(),
          closingDate: t.Date(),
          accountId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          costCenterId: t.String(),
          dim1: t.String(),
          dim2: t.String(),
          dim3: t.String(),
          dim4: t.String(),
          debit: t.Number(),
          credit: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AccountClosingBalance" },
  ),
);

export const AccountClosingBalanceWhereUnique = t.Recursive(
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
              clinicId: t.String(),
              periodClosingVoucherId: t.String(),
              closingDate: t.Date(),
              accountId: t.String(),
              partyType: t.String(),
              partyId: t.String(),
              costCenterId: t.String(),
              dim1: t.String(),
              dim2: t.String(),
              dim3: t.String(),
              dim4: t.String(),
              debit: t.Number(),
              credit: t.Number(),
              debitInAccountCurrency: t.Number(),
              creditInAccountCurrency: t.Number(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AccountClosingBalance" },
);

export const AccountClosingBalanceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      periodClosingVoucherId: t.Boolean(),
      closingDate: t.Boolean(),
      accountId: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      costCenterId: t.Boolean(),
      dim1: t.Boolean(),
      dim2: t.Boolean(),
      dim3: t.Boolean(),
      dim4: t.Boolean(),
      debit: t.Boolean(),
      credit: t.Boolean(),
      debitInAccountCurrency: t.Boolean(),
      creditInAccountCurrency: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      pcv: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AccountClosingBalanceInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      pcv: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AccountClosingBalanceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodClosingVoucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      closingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      debit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      credit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      debitInAccountCurrency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      creditInAccountCurrency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const AccountClosingBalance = t.Composite(
  [AccountClosingBalancePlain, AccountClosingBalanceRelations],
  { additionalProperties: false },
);

export const AccountClosingBalanceInputCreate = t.Composite(
  [
    AccountClosingBalancePlainInputCreate,
    AccountClosingBalanceRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const AccountClosingBalanceInputUpdate = t.Composite(
  [
    AccountClosingBalancePlainInputUpdate,
    AccountClosingBalanceRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
