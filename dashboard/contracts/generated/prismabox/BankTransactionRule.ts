import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BankTransactionRulePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    ruleName: t.String(),
    priority: t.Integer(),
    disabled: t.Boolean(),
    descriptionContains: __nullable__(t.String()),
    direction: t.Union(
      [t.Literal("ANY"), t.Literal("DEPOSIT"), t.Literal("WITHDRAWAL")],
      { additionalProperties: false },
    ),
    minAmount: __nullable__(t.Number()),
    maxAmount: __nullable__(t.Number()),
    bankAccountId: __nullable__(t.String()),
    contraAccountId: t.String(),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const BankTransactionRuleRelations = t.Object(
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
    contraAccount: t.Object(
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

export const BankTransactionRulePlainInputCreate = t.Object(
  {
    ruleName: t.String(),
    priority: t.Optional(t.Integer()),
    disabled: t.Optional(t.Boolean()),
    descriptionContains: t.Optional(__nullable__(t.String())),
    direction: t.Optional(
      t.Union(
        [t.Literal("ANY"), t.Literal("DEPOSIT"), t.Literal("WITHDRAWAL")],
        { additionalProperties: false },
      ),
    ),
    minAmount: t.Optional(__nullable__(t.Number())),
    maxAmount: t.Optional(__nullable__(t.Number())),
  },
  { additionalProperties: false },
);

export const BankTransactionRulePlainInputUpdate = t.Object(
  {
    ruleName: t.Optional(t.String()),
    priority: t.Optional(t.Integer()),
    disabled: t.Optional(t.Boolean()),
    descriptionContains: t.Optional(__nullable__(t.String())),
    direction: t.Optional(
      t.Union(
        [t.Literal("ANY"), t.Literal("DEPOSIT"), t.Literal("WITHDRAWAL")],
        { additionalProperties: false },
      ),
    ),
    minAmount: t.Optional(__nullable__(t.Number())),
    maxAmount: t.Optional(__nullable__(t.Number())),
  },
  { additionalProperties: false },
);

export const BankTransactionRuleRelationsInputCreate = t.Object(
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
    contraAccount: t.Object(
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

export const BankTransactionRuleRelationsInputUpdate = t.Partial(
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
      contraAccount: t.Object(
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

export const BankTransactionRuleWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          ruleName: t.String(),
          priority: t.Integer(),
          disabled: t.Boolean(),
          descriptionContains: t.String(),
          direction: t.Union(
            [t.Literal("ANY"), t.Literal("DEPOSIT"), t.Literal("WITHDRAWAL")],
            { additionalProperties: false },
          ),
          minAmount: t.Number(),
          maxAmount: t.Number(),
          bankAccountId: t.String(),
          contraAccountId: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "BankTransactionRule" },
  ),
);

export const BankTransactionRuleWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_ruleName: t.Object(
                { clinicId: t.String(), ruleName: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_ruleName: t.Object(
                { clinicId: t.String(), ruleName: t.String() },
                { additionalProperties: false },
              ),
            }),
          ],
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
              ruleName: t.String(),
              priority: t.Integer(),
              disabled: t.Boolean(),
              descriptionContains: t.String(),
              direction: t.Union(
                [
                  t.Literal("ANY"),
                  t.Literal("DEPOSIT"),
                  t.Literal("WITHDRAWAL"),
                ],
                { additionalProperties: false },
              ),
              minAmount: t.Number(),
              maxAmount: t.Number(),
              bankAccountId: t.String(),
              contraAccountId: t.String(),
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
  { $id: "BankTransactionRule" },
);

export const BankTransactionRuleSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      ruleName: t.Boolean(),
      priority: t.Boolean(),
      disabled: t.Boolean(),
      descriptionContains: t.Boolean(),
      direction: t.Boolean(),
      minAmount: t.Boolean(),
      maxAmount: t.Boolean(),
      bankAccountId: t.Boolean(),
      contraAccountId: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      contraAccount: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BankTransactionRuleInclude = t.Partial(
  t.Object(
    {
      direction: t.Boolean(),
      clinic: t.Boolean(),
      contraAccount: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BankTransactionRuleOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ruleName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priority: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      descriptionContains: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      minAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      bankAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      contraAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const BankTransactionRule = t.Composite(
  [BankTransactionRulePlain, BankTransactionRuleRelations],
  { additionalProperties: false },
);

export const BankTransactionRuleInputCreate = t.Composite(
  [
    BankTransactionRulePlainInputCreate,
    BankTransactionRuleRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const BankTransactionRuleInputUpdate = t.Composite(
  [
    BankTransactionRulePlainInputUpdate,
    BankTransactionRuleRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
