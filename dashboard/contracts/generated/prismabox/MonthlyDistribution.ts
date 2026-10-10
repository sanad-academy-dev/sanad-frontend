import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MonthlyDistributionPlain = t.Object(
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
);

export const MonthlyDistributionRelations = t.Object(
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
    percentages: t.Array(
      t.Object(
        {
          id: t.String(),
          distributionId: t.String(),
          month: t.Integer(),
          percentage: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    budgets: t.Array(
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
  },
  { additionalProperties: false },
);

export const MonthlyDistributionPlainInputCreate = t.Object(
  { distributionName: t.String(), fiscalYear: t.String() },
  { additionalProperties: false },
);

export const MonthlyDistributionPlainInputUpdate = t.Object(
  {
    distributionName: t.Optional(t.String()),
    fiscalYear: t.Optional(t.String()),
  },
  { additionalProperties: false },
);

export const MonthlyDistributionRelationsInputCreate = t.Object(
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
    percentages: t.Optional(
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
    budgets: t.Optional(
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

export const MonthlyDistributionRelationsInputUpdate = t.Partial(
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
      percentages: t.Partial(
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
      budgets: t.Partial(
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

export const MonthlyDistributionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          distributionName: t.String(),
          fiscalYear: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "MonthlyDistribution" },
  ),
);

export const MonthlyDistributionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_distributionName: t.Object(
                { clinicId: t.String(), distributionName: t.String() },
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
              clinicId_distributionName: t.Object(
                { clinicId: t.String(), distributionName: t.String() },
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
              distributionName: t.String(),
              fiscalYear: t.String(),
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
  { $id: "MonthlyDistribution" },
);

export const MonthlyDistributionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      distributionName: t.Boolean(),
      fiscalYear: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      percentages: t.Boolean(),
      budgets: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MonthlyDistributionInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      percentages: t.Boolean(),
      budgets: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MonthlyDistributionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      distributionName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fiscalYear: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const MonthlyDistribution = t.Composite(
  [MonthlyDistributionPlain, MonthlyDistributionRelations],
  { additionalProperties: false },
);

export const MonthlyDistributionInputCreate = t.Composite(
  [
    MonthlyDistributionPlainInputCreate,
    MonthlyDistributionRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const MonthlyDistributionInputUpdate = t.Composite(
  [
    MonthlyDistributionPlainInputUpdate,
    MonthlyDistributionRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
