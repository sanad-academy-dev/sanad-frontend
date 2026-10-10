import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GlEntryPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    postingDate: t.Date(),
    transactionDate: __nullable__(t.Date()),
    fiscalYear: t.String(),
    accountId: t.String(),
    accountCurrencyCode: t.String(),
    debit: t.Number(),
    credit: t.Number(),
    debitInAccountCurrency: t.Number(),
    creditInAccountCurrency: t.Number(),
    transactionCurrencyCode: __nullable__(t.String()),
    transactionExchangeRate: __nullable__(t.Number()),
    debitInTransactionCurrency: t.Number(),
    creditInTransactionCurrency: t.Number(),
    partyType: __nullable__(t.String()),
    partyId: __nullable__(t.String()),
    against: __nullable__(t.String()),
    voucherType: t.String(),
    voucherSubtype: __nullable__(t.String()),
    voucherId: t.String(),
    voucherNo: t.String(),
    voucherDetailNo: __nullable__(t.String()),
    againstVoucherType: __nullable__(t.String()),
    againstVoucherId: __nullable__(t.String()),
    costCenterId: __nullable__(t.String()),
    projectId: __nullable__(t.String()),
    financeBookId: __nullable__(t.String()),
    dim1: __nullable__(t.String()),
    dim2: __nullable__(t.String()),
    dim3: __nullable__(t.String()),
    dim4: __nullable__(t.String()),
    isOpening: t.Boolean(),
    isAdvance: t.Boolean(),
    isCancelled: t.Boolean(),
    dueDate: __nullable__(t.Date()),
    remarks: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const GlEntryRelations = t.Object(
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
    transactionCurrency: __nullable__(
      t.Object(
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
    financeBook: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          financeBookName: t.String(),
          disabled: t.Boolean(),
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

export const GlEntryPlainInputCreate = t.Object(
  {
    postingDate: t.Date(),
    transactionDate: t.Optional(__nullable__(t.Date())),
    fiscalYear: t.String(),
    accountCurrencyCode: t.String(),
    debit: t.Optional(t.Number()),
    credit: t.Optional(t.Number()),
    debitInAccountCurrency: t.Optional(t.Number()),
    creditInAccountCurrency: t.Optional(t.Number()),
    transactionCurrencyCode: t.Optional(__nullable__(t.String())),
    transactionExchangeRate: t.Optional(__nullable__(t.Number())),
    debitInTransactionCurrency: t.Optional(t.Number()),
    creditInTransactionCurrency: t.Optional(t.Number()),
    partyType: t.Optional(__nullable__(t.String())),
    against: t.Optional(__nullable__(t.String())),
    voucherType: t.String(),
    voucherSubtype: t.Optional(__nullable__(t.String())),
    voucherNo: t.String(),
    voucherDetailNo: t.Optional(__nullable__(t.String())),
    againstVoucherType: t.Optional(__nullable__(t.String())),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    isOpening: t.Optional(t.Boolean()),
    isAdvance: t.Optional(t.Boolean()),
    isCancelled: t.Optional(t.Boolean()),
    dueDate: t.Optional(__nullable__(t.Date())),
    remarks: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const GlEntryPlainInputUpdate = t.Object(
  {
    postingDate: t.Optional(t.Date()),
    transactionDate: t.Optional(__nullable__(t.Date())),
    fiscalYear: t.Optional(t.String()),
    accountCurrencyCode: t.Optional(t.String()),
    debit: t.Optional(t.Number()),
    credit: t.Optional(t.Number()),
    debitInAccountCurrency: t.Optional(t.Number()),
    creditInAccountCurrency: t.Optional(t.Number()),
    transactionCurrencyCode: t.Optional(__nullable__(t.String())),
    transactionExchangeRate: t.Optional(__nullable__(t.Number())),
    debitInTransactionCurrency: t.Optional(t.Number()),
    creditInTransactionCurrency: t.Optional(t.Number()),
    partyType: t.Optional(__nullable__(t.String())),
    against: t.Optional(__nullable__(t.String())),
    voucherType: t.Optional(t.String()),
    voucherSubtype: t.Optional(__nullable__(t.String())),
    voucherNo: t.Optional(t.String()),
    voucherDetailNo: t.Optional(__nullable__(t.String())),
    againstVoucherType: t.Optional(__nullable__(t.String())),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    isOpening: t.Optional(t.Boolean()),
    isAdvance: t.Optional(t.Boolean()),
    isCancelled: t.Optional(t.Boolean()),
    dueDate: t.Optional(__nullable__(t.Date())),
    remarks: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const GlEntryRelationsInputCreate = t.Object(
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
    transactionCurrency: t.Optional(
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
    financeBook: t.Optional(
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

export const GlEntryRelationsInputUpdate = t.Partial(
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
      transactionCurrency: t.Partial(
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
      financeBook: t.Partial(
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

export const GlEntryWhere = t.Partial(
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
          transactionDate: t.Date(),
          fiscalYear: t.String(),
          accountId: t.String(),
          accountCurrencyCode: t.String(),
          debit: t.Number(),
          credit: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          transactionCurrencyCode: t.String(),
          transactionExchangeRate: t.Number(),
          debitInTransactionCurrency: t.Number(),
          creditInTransactionCurrency: t.Number(),
          partyType: t.String(),
          partyId: t.String(),
          against: t.String(),
          voucherType: t.String(),
          voucherSubtype: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          voucherDetailNo: t.String(),
          againstVoucherType: t.String(),
          againstVoucherId: t.String(),
          costCenterId: t.String(),
          projectId: t.String(),
          financeBookId: t.String(),
          dim1: t.String(),
          dim2: t.String(),
          dim3: t.String(),
          dim4: t.String(),
          isOpening: t.Boolean(),
          isAdvance: t.Boolean(),
          isCancelled: t.Boolean(),
          dueDate: t.Date(),
          remarks: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "GlEntry" },
  ),
);

export const GlEntryWhereUnique = t.Recursive(
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
              postingDate: t.Date(),
              transactionDate: t.Date(),
              fiscalYear: t.String(),
              accountId: t.String(),
              accountCurrencyCode: t.String(),
              debit: t.Number(),
              credit: t.Number(),
              debitInAccountCurrency: t.Number(),
              creditInAccountCurrency: t.Number(),
              transactionCurrencyCode: t.String(),
              transactionExchangeRate: t.Number(),
              debitInTransactionCurrency: t.Number(),
              creditInTransactionCurrency: t.Number(),
              partyType: t.String(),
              partyId: t.String(),
              against: t.String(),
              voucherType: t.String(),
              voucherSubtype: t.String(),
              voucherId: t.String(),
              voucherNo: t.String(),
              voucherDetailNo: t.String(),
              againstVoucherType: t.String(),
              againstVoucherId: t.String(),
              costCenterId: t.String(),
              projectId: t.String(),
              financeBookId: t.String(),
              dim1: t.String(),
              dim2: t.String(),
              dim3: t.String(),
              dim4: t.String(),
              isOpening: t.Boolean(),
              isAdvance: t.Boolean(),
              isCancelled: t.Boolean(),
              dueDate: t.Date(),
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
  { $id: "GlEntry" },
);

export const GlEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      postingDate: t.Boolean(),
      transactionDate: t.Boolean(),
      fiscalYear: t.Boolean(),
      accountId: t.Boolean(),
      accountCurrencyCode: t.Boolean(),
      debit: t.Boolean(),
      credit: t.Boolean(),
      debitInAccountCurrency: t.Boolean(),
      creditInAccountCurrency: t.Boolean(),
      transactionCurrencyCode: t.Boolean(),
      transactionExchangeRate: t.Boolean(),
      debitInTransactionCurrency: t.Boolean(),
      creditInTransactionCurrency: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      against: t.Boolean(),
      voucherType: t.Boolean(),
      voucherSubtype: t.Boolean(),
      voucherId: t.Boolean(),
      voucherNo: t.Boolean(),
      voucherDetailNo: t.Boolean(),
      againstVoucherType: t.Boolean(),
      againstVoucherId: t.Boolean(),
      costCenterId: t.Boolean(),
      projectId: t.Boolean(),
      financeBookId: t.Boolean(),
      dim1: t.Boolean(),
      dim2: t.Boolean(),
      dim3: t.Boolean(),
      dim4: t.Boolean(),
      isOpening: t.Boolean(),
      isAdvance: t.Boolean(),
      isCancelled: t.Boolean(),
      dueDate: t.Boolean(),
      remarks: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      account: t.Boolean(),
      accountCurrency: t.Boolean(),
      transactionCurrency: t.Boolean(),
      costCenter: t.Boolean(),
      financeBook: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const GlEntryInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      account: t.Boolean(),
      accountCurrency: t.Boolean(),
      transactionCurrency: t.Boolean(),
      costCenter: t.Boolean(),
      financeBook: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const GlEntryOrderBy = t.Partial(
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
      transactionDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fiscalYear: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountCurrencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      transactionCurrencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      transactionExchangeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      debitInTransactionCurrency: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      creditInTransactionCurrency: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      against: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherSubtype: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      voucherDetailNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      againstVoucherType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      againstVoucherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      projectId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      financeBookId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      isOpening: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isAdvance: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isCancelled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dueDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    { additionalProperties: false },
  ),
);

export const GlEntry = t.Composite([GlEntryPlain, GlEntryRelations], {
  additionalProperties: false,
});

export const GlEntryInputCreate = t.Composite(
  [GlEntryPlainInputCreate, GlEntryRelationsInputCreate],
  { additionalProperties: false },
);

export const GlEntryInputUpdate = t.Composite(
  [GlEntryPlainInputUpdate, GlEntryRelationsInputUpdate],
  { additionalProperties: false },
);
