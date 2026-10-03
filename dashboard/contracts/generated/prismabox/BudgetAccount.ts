import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BudgetAccountPlain = t.Object(
  {
    id: t.String(),
    budgetId: t.String(),
    idx: t.Integer(),
    accountId: t.String(),
    budgetAmount: t.Number(),
  },
  { additionalProperties: false },
);

export const BudgetAccountRelations = t.Object(
  {
    budget: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        docstatus: t.Union(
          [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
          { additionalProperties: false },
        ),
        amendedFromId: __nullable__(t.String()),
        fiscalYear: t.String(),
        budgetAgainst: t.Union(
          [t.Literal("COST_CENTER"), t.Literal("PROJECT")],
          { additionalProperties: false },
        ),
        costCenterId: __nullable__(t.String()),
        project: __nullable__(t.String()),
        monthlyDistributionId: __nullable__(t.String()),
        applicableOnBookingActualExpenses: t.Boolean(),
        actionIfAnnualExceeded: t.Union(
          [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
          { additionalProperties: false },
        ),
        actionIfAccumulatedMonthlyExceeded: t.Union(
          [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
          { additionalProperties: false },
        ),
        applicableOnMaterialRequest: t.Boolean(),
        actionIfAnnualExceededOnMr: t.Union(
          [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
          { additionalProperties: false },
        ),
        actionIfAccumulatedMonthlyExceededOnMr: t.Union(
          [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
          { additionalProperties: false },
        ),
        applicableOnPurchaseOrder: t.Boolean(),
        actionIfAnnualExceededOnPo: t.Union(
          [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
          { additionalProperties: false },
        ),
        actionIfAccumulatedMonthlyExceededOnPo: t.Union(
          [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
          { additionalProperties: false },
        ),
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

export const BudgetAccountPlainInputCreate = t.Object(
  { idx: t.Integer(), budgetAmount: t.Number() },
  { additionalProperties: false },
);

export const BudgetAccountPlainInputUpdate = t.Object(
  { idx: t.Optional(t.Integer()), budgetAmount: t.Optional(t.Number()) },
  { additionalProperties: false },
);

export const BudgetAccountRelationsInputCreate = t.Object(
  {
    budget: t.Object(
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

export const BudgetAccountRelationsInputUpdate = t.Partial(
  t.Object(
    {
      budget: t.Object(
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

export const BudgetAccountWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          budgetId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          budgetAmount: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "BudgetAccount" },
  ),
);

export const BudgetAccountWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              budgetId_accountId: t.Object(
                { budgetId: t.String(), accountId: t.String() },
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
              budgetId_accountId: t.Object(
                { budgetId: t.String(), accountId: t.String() },
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
              budgetId: t.String(),
              idx: t.Integer(),
              accountId: t.String(),
              budgetAmount: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "BudgetAccount" },
);

export const BudgetAccountSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      budgetId: t.Boolean(),
      idx: t.Boolean(),
      accountId: t.Boolean(),
      budgetAmount: t.Boolean(),
      budget: t.Boolean(),
      account: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BudgetAccountInclude = t.Partial(
  t.Object(
    { budget: t.Boolean(), account: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const BudgetAccountOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      budgetId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      budgetAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const BudgetAccount = t.Composite(
  [BudgetAccountPlain, BudgetAccountRelations],
  { additionalProperties: false },
);

export const BudgetAccountInputCreate = t.Composite(
  [BudgetAccountPlainInputCreate, BudgetAccountRelationsInputCreate],
  { additionalProperties: false },
);

export const BudgetAccountInputUpdate = t.Composite(
  [BudgetAccountPlainInputUpdate, BudgetAccountRelationsInputUpdate],
  { additionalProperties: false },
);
