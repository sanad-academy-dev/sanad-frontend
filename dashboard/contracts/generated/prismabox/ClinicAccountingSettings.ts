import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicAccountingSettingsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    defaultCurrencyCode: __nullable__(t.String()),
    defaultReceivableAccountId: __nullable__(t.String()),
    defaultPayableAccountId: __nullable__(t.String()),
    defaultIncomeAccountId: __nullable__(t.String()),
    defaultExpenseAccountId: __nullable__(t.String()),
    defaultCashAccountId: __nullable__(t.String()),
    defaultBankAccountId: __nullable__(t.String()),
    roundOffAccountId: __nullable__(t.String()),
    roundOffForOpeningAccountId: __nullable__(t.String()),
    writeOffAccountId: __nullable__(t.String()),
    exchangeGainLossAccountId: __nullable__(t.String()),
    unrealizedExchangeGainLossAccountId: __nullable__(t.String()),
    unrealizedProfitLossAccountId: __nullable__(t.String()),
    defaultDiscountAccountId: __nullable__(t.String()),
    defaultDeferredRevenueAccountId: __nullable__(t.String()),
    defaultDeferredExpenseAccountId: __nullable__(t.String()),
    defaultAdvanceReceivedAccountId: __nullable__(t.String()),
    defaultAdvancePaidAccountId: __nullable__(t.String()),
    roundOffCostCenterId: __nullable__(t.String()),
    defaultCostCenterId: __nullable__(t.String()),
    defaultFinanceBookId: __nullable__(t.String()),
    defaultPaymentTermsTemplateId: __nullable__(t.String()),
    creditLimit: __nullable__(t.Number()),
    bypassCreditLimitCheck: t.Boolean(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClinicAccountingSettingsRelations = t.Object(
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
    defaultCurrency: __nullable__(
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
  },
  { additionalProperties: false },
);

export const ClinicAccountingSettingsPlainInputCreate = t.Object(
  {
    defaultCurrencyCode: t.Optional(__nullable__(t.String())),
    creditLimit: t.Optional(__nullable__(t.Number())),
    bypassCreditLimitCheck: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ClinicAccountingSettingsPlainInputUpdate = t.Object(
  {
    defaultCurrencyCode: t.Optional(__nullable__(t.String())),
    creditLimit: t.Optional(__nullable__(t.Number())),
    bypassCreditLimitCheck: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const ClinicAccountingSettingsRelationsInputCreate = t.Object(
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
    defaultCurrency: t.Optional(
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

export const ClinicAccountingSettingsRelationsInputUpdate = t.Partial(
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
      defaultCurrency: t.Partial(
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

export const ClinicAccountingSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          defaultCurrencyCode: t.String(),
          defaultReceivableAccountId: t.String(),
          defaultPayableAccountId: t.String(),
          defaultIncomeAccountId: t.String(),
          defaultExpenseAccountId: t.String(),
          defaultCashAccountId: t.String(),
          defaultBankAccountId: t.String(),
          roundOffAccountId: t.String(),
          roundOffForOpeningAccountId: t.String(),
          writeOffAccountId: t.String(),
          exchangeGainLossAccountId: t.String(),
          unrealizedExchangeGainLossAccountId: t.String(),
          unrealizedProfitLossAccountId: t.String(),
          defaultDiscountAccountId: t.String(),
          defaultDeferredRevenueAccountId: t.String(),
          defaultDeferredExpenseAccountId: t.String(),
          defaultAdvanceReceivedAccountId: t.String(),
          defaultAdvancePaidAccountId: t.String(),
          roundOffCostCenterId: t.String(),
          defaultCostCenterId: t.String(),
          defaultFinanceBookId: t.String(),
          defaultPaymentTermsTemplateId: t.String(),
          creditLimit: t.Number(),
          bypassCreditLimitCheck: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicAccountingSettings" },
  ),
);

export const ClinicAccountingSettingsWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), clinicId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ clinicId: t.String() })],
          { additionalProperties: false },
        ),
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
              defaultCurrencyCode: t.String(),
              defaultReceivableAccountId: t.String(),
              defaultPayableAccountId: t.String(),
              defaultIncomeAccountId: t.String(),
              defaultExpenseAccountId: t.String(),
              defaultCashAccountId: t.String(),
              defaultBankAccountId: t.String(),
              roundOffAccountId: t.String(),
              roundOffForOpeningAccountId: t.String(),
              writeOffAccountId: t.String(),
              exchangeGainLossAccountId: t.String(),
              unrealizedExchangeGainLossAccountId: t.String(),
              unrealizedProfitLossAccountId: t.String(),
              defaultDiscountAccountId: t.String(),
              defaultDeferredRevenueAccountId: t.String(),
              defaultDeferredExpenseAccountId: t.String(),
              defaultAdvanceReceivedAccountId: t.String(),
              defaultAdvancePaidAccountId: t.String(),
              roundOffCostCenterId: t.String(),
              defaultCostCenterId: t.String(),
              defaultFinanceBookId: t.String(),
              defaultPaymentTermsTemplateId: t.String(),
              creditLimit: t.Number(),
              bypassCreditLimitCheck: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicAccountingSettings" },
);

export const ClinicAccountingSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      defaultCurrencyCode: t.Boolean(),
      defaultReceivableAccountId: t.Boolean(),
      defaultPayableAccountId: t.Boolean(),
      defaultIncomeAccountId: t.Boolean(),
      defaultExpenseAccountId: t.Boolean(),
      defaultCashAccountId: t.Boolean(),
      defaultBankAccountId: t.Boolean(),
      roundOffAccountId: t.Boolean(),
      roundOffForOpeningAccountId: t.Boolean(),
      writeOffAccountId: t.Boolean(),
      exchangeGainLossAccountId: t.Boolean(),
      unrealizedExchangeGainLossAccountId: t.Boolean(),
      unrealizedProfitLossAccountId: t.Boolean(),
      defaultDiscountAccountId: t.Boolean(),
      defaultDeferredRevenueAccountId: t.Boolean(),
      defaultDeferredExpenseAccountId: t.Boolean(),
      defaultAdvanceReceivedAccountId: t.Boolean(),
      defaultAdvancePaidAccountId: t.Boolean(),
      roundOffCostCenterId: t.Boolean(),
      defaultCostCenterId: t.Boolean(),
      defaultFinanceBookId: t.Boolean(),
      defaultPaymentTermsTemplateId: t.Boolean(),
      creditLimit: t.Boolean(),
      bypassCreditLimitCheck: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      defaultCurrency: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicAccountingSettingsInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), defaultCurrency: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ClinicAccountingSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultCurrencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultReceivableAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      defaultPayableAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultIncomeAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultExpenseAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultCashAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultBankAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roundOffAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roundOffForOpeningAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      writeOffAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      exchangeGainLossAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      unrealizedExchangeGainLossAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      unrealizedProfitLossAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      defaultDiscountAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultDeferredRevenueAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      defaultDeferredExpenseAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      defaultAdvanceReceivedAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      defaultAdvancePaidAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      roundOffCostCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultCostCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultFinanceBookId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      defaultPaymentTermsTemplateId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      creditLimit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bypassCreditLimitCheck: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ClinicAccountingSettings = t.Composite(
  [ClinicAccountingSettingsPlain, ClinicAccountingSettingsRelations],
  { additionalProperties: false },
);

export const ClinicAccountingSettingsInputCreate = t.Composite(
  [
    ClinicAccountingSettingsPlainInputCreate,
    ClinicAccountingSettingsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicAccountingSettingsInputUpdate = t.Composite(
  [
    ClinicAccountingSettingsPlainInputUpdate,
    ClinicAccountingSettingsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
