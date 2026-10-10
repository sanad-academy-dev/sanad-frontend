import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BudgetPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    docstatus: t.Union(
      [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
      { additionalProperties: false },
    ),
    amendedFromId: __nullable__(t.String()),
    fiscalYear: t.String(),
    budgetAgainst: t.Union([t.Literal("COST_CENTER"), t.Literal("PROJECT")], {
      additionalProperties: false,
    }),
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
);

export const BudgetRelations = t.Object(
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
    monthlyDistribution: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          distributionName: t.String(),
          fiscalYear: t.String(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    amendedFrom: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
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
    ),
    amendments: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
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
      { additionalProperties: false },
    ),
    accounts: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const BudgetPlainInputCreate = t.Object(
  {
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    fiscalYear: t.String(),
    budgetAgainst: t.Optional(
      t.Union([t.Literal("COST_CENTER"), t.Literal("PROJECT")], {
        additionalProperties: false,
      }),
    ),
    project: t.Optional(__nullable__(t.String())),
    applicableOnBookingActualExpenses: t.Optional(t.Boolean()),
    actionIfAnnualExceeded: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    actionIfAccumulatedMonthlyExceeded: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    applicableOnMaterialRequest: t.Optional(t.Boolean()),
    actionIfAnnualExceededOnMr: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    actionIfAccumulatedMonthlyExceededOnMr: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    applicableOnPurchaseOrder: t.Optional(t.Boolean()),
    actionIfAnnualExceededOnPo: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    actionIfAccumulatedMonthlyExceededOnPo: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const BudgetPlainInputUpdate = t.Object(
  {
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    fiscalYear: t.Optional(t.String()),
    budgetAgainst: t.Optional(
      t.Union([t.Literal("COST_CENTER"), t.Literal("PROJECT")], {
        additionalProperties: false,
      }),
    ),
    project: t.Optional(__nullable__(t.String())),
    applicableOnBookingActualExpenses: t.Optional(t.Boolean()),
    actionIfAnnualExceeded: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    actionIfAccumulatedMonthlyExceeded: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    applicableOnMaterialRequest: t.Optional(t.Boolean()),
    actionIfAnnualExceededOnMr: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    actionIfAccumulatedMonthlyExceededOnMr: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    applicableOnPurchaseOrder: t.Optional(t.Boolean()),
    actionIfAnnualExceededOnPo: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    actionIfAccumulatedMonthlyExceededOnPo: t.Optional(
      t.Union([t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")], {
        additionalProperties: false,
      }),
    ),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const BudgetRelationsInputCreate = t.Object(
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
    monthlyDistribution: t.Optional(
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
    amendedFrom: t.Optional(
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
    amendments: t.Optional(
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
    accounts: t.Optional(
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

export const BudgetRelationsInputUpdate = t.Partial(
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
      monthlyDistribution: t.Partial(
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
      amendedFrom: t.Partial(
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
      amendments: t.Partial(
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
      accounts: t.Partial(
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

export const BudgetWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: t.String(),
          fiscalYear: t.String(),
          budgetAgainst: t.Union(
            [t.Literal("COST_CENTER"), t.Literal("PROJECT")],
            { additionalProperties: false },
          ),
          costCenterId: t.String(),
          project: t.String(),
          monthlyDistributionId: t.String(),
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
          createdById: t.String(),
          submittedAt: t.Date(),
          submittedById: t.String(),
          cancelledAt: t.Date(),
          cancelledById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Budget" },
  ),
);

export const BudgetWhereUnique = t.Recursive(
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
              docstatus: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("SUBMITTED"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              amendedFromId: t.String(),
              fiscalYear: t.String(),
              budgetAgainst: t.Union(
                [t.Literal("COST_CENTER"), t.Literal("PROJECT")],
                { additionalProperties: false },
              ),
              costCenterId: t.String(),
              project: t.String(),
              monthlyDistributionId: t.String(),
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
              createdById: t.String(),
              submittedAt: t.Date(),
              submittedById: t.String(),
              cancelledAt: t.Date(),
              cancelledById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Budget" },
);

export const BudgetSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      docstatus: t.Boolean(),
      amendedFromId: t.Boolean(),
      fiscalYear: t.Boolean(),
      budgetAgainst: t.Boolean(),
      costCenterId: t.Boolean(),
      project: t.Boolean(),
      monthlyDistributionId: t.Boolean(),
      applicableOnBookingActualExpenses: t.Boolean(),
      actionIfAnnualExceeded: t.Boolean(),
      actionIfAccumulatedMonthlyExceeded: t.Boolean(),
      applicableOnMaterialRequest: t.Boolean(),
      actionIfAnnualExceededOnMr: t.Boolean(),
      actionIfAccumulatedMonthlyExceededOnMr: t.Boolean(),
      applicableOnPurchaseOrder: t.Boolean(),
      actionIfAnnualExceededOnPo: t.Boolean(),
      actionIfAccumulatedMonthlyExceededOnPo: t.Boolean(),
      createdById: t.Boolean(),
      submittedAt: t.Boolean(),
      submittedById: t.Boolean(),
      cancelledAt: t.Boolean(),
      cancelledById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      costCenter: t.Boolean(),
      monthlyDistribution: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      accounts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BudgetInclude = t.Partial(
  t.Object(
    {
      docstatus: t.Boolean(),
      budgetAgainst: t.Boolean(),
      actionIfAnnualExceeded: t.Boolean(),
      actionIfAccumulatedMonthlyExceeded: t.Boolean(),
      actionIfAnnualExceededOnMr: t.Boolean(),
      actionIfAccumulatedMonthlyExceededOnMr: t.Boolean(),
      actionIfAnnualExceededOnPo: t.Boolean(),
      actionIfAccumulatedMonthlyExceededOnPo: t.Boolean(),
      clinic: t.Boolean(),
      costCenter: t.Boolean(),
      monthlyDistribution: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      accounts: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const BudgetOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amendedFromId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fiscalYear: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      project: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      monthlyDistributionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      applicableOnBookingActualExpenses: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      applicableOnMaterialRequest: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      applicableOnPurchaseOrder: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Budget = t.Composite([BudgetPlain, BudgetRelations], {
  additionalProperties: false,
});

export const BudgetInputCreate = t.Composite(
  [BudgetPlainInputCreate, BudgetRelationsInputCreate],
  { additionalProperties: false },
);

export const BudgetInputUpdate = t.Composite(
  [BudgetPlainInputUpdate, BudgetRelationsInputUpdate],
  { additionalProperties: false },
);
