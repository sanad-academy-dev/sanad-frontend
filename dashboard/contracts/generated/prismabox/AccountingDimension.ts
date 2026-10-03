import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountingDimensionPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    slot: t.Integer(),
    dimensionName: t.String(),
    referenceDoctype: __nullable__(t.String()),
    disabled: t.Boolean(),
    mandatoryForBalanceSheet: t.Boolean(),
    mandatoryForProfitAndLoss: t.Boolean(),
    defaultDimensionValue: __nullable__(t.String()),
    autoPostBalancingEntry: t.Boolean(),
    offsettingAccountId: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AccountingDimensionRelations = t.Object(
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
    offsettingAccount: __nullable__(
      t.Object(
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
    ),
    filters: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          dimensionId: t.String(),
          allowOnly: t.Boolean(),
          disabled: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AccountingDimensionPlainInputCreate = t.Object(
  {
    slot: t.Integer(),
    dimensionName: t.String(),
    referenceDoctype: t.Optional(__nullable__(t.String())),
    disabled: t.Optional(t.Boolean()),
    mandatoryForBalanceSheet: t.Optional(t.Boolean()),
    mandatoryForProfitAndLoss: t.Optional(t.Boolean()),
    defaultDimensionValue: t.Optional(__nullable__(t.String())),
    autoPostBalancingEntry: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const AccountingDimensionPlainInputUpdate = t.Object(
  {
    slot: t.Optional(t.Integer()),
    dimensionName: t.Optional(t.String()),
    referenceDoctype: t.Optional(__nullable__(t.String())),
    disabled: t.Optional(t.Boolean()),
    mandatoryForBalanceSheet: t.Optional(t.Boolean()),
    mandatoryForProfitAndLoss: t.Optional(t.Boolean()),
    defaultDimensionValue: t.Optional(__nullable__(t.String())),
    autoPostBalancingEntry: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const AccountingDimensionRelationsInputCreate = t.Object(
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
    offsettingAccount: t.Optional(
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
    filters: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const AccountingDimensionRelationsInputUpdate = t.Partial(
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
      offsettingAccount: t.Partial(
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
      filters: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const AccountingDimensionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          slot: t.Integer(),
          dimensionName: t.String(),
          referenceDoctype: t.String(),
          disabled: t.Boolean(),
          mandatoryForBalanceSheet: t.Boolean(),
          mandatoryForProfitAndLoss: t.Boolean(),
          defaultDimensionValue: t.String(),
          autoPostBalancingEntry: t.Boolean(),
          offsettingAccountId: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AccountingDimension" },
  ),
);

export const AccountingDimensionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_slot: t.Object(
                { clinicId: t.String(), slot: t.Integer() },
                { additionalProperties: false },
              ),
              clinicId_dimensionName: t.Object(
                { clinicId: t.String(), dimensionName: t.String() },
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
              clinicId_slot: t.Object(
                { clinicId: t.String(), slot: t.Integer() },
                { additionalProperties: false },
              ),
            }),
            t.Object({
              clinicId_dimensionName: t.Object(
                { clinicId: t.String(), dimensionName: t.String() },
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
              slot: t.Integer(),
              dimensionName: t.String(),
              referenceDoctype: t.String(),
              disabled: t.Boolean(),
              mandatoryForBalanceSheet: t.Boolean(),
              mandatoryForProfitAndLoss: t.Boolean(),
              defaultDimensionValue: t.String(),
              autoPostBalancingEntry: t.Boolean(),
              offsettingAccountId: t.String(),
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
  { $id: "AccountingDimension" },
);

export const AccountingDimensionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      slot: t.Boolean(),
      dimensionName: t.Boolean(),
      referenceDoctype: t.Boolean(),
      disabled: t.Boolean(),
      mandatoryForBalanceSheet: t.Boolean(),
      mandatoryForProfitAndLoss: t.Boolean(),
      defaultDimensionValue: t.Boolean(),
      autoPostBalancingEntry: t.Boolean(),
      offsettingAccountId: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      offsettingAccount: t.Boolean(),
      filters: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AccountingDimensionInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      offsettingAccount: t.Boolean(),
      filters: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AccountingDimensionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      slot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dimensionName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceDoctype: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mandatoryForBalanceSheet: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mandatoryForProfitAndLoss: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      defaultDimensionValue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      autoPostBalancingEntry: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      offsettingAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const AccountingDimension = t.Composite(
  [AccountingDimensionPlain, AccountingDimensionRelations],
  { additionalProperties: false },
);

export const AccountingDimensionInputCreate = t.Composite(
  [
    AccountingDimensionPlainInputCreate,
    AccountingDimensionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const AccountingDimensionInputUpdate = t.Composite(
  [
    AccountingDimensionPlainInputUpdate,
    AccountingDimensionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
