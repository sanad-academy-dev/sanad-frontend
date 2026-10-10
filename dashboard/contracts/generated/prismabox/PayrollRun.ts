import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollRunPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    type: t.Union([t.Literal("REGULAR"), t.Literal("OFF_CYCLE")], {
      additionalProperties: false,
    }),
    status: t.Union(
      [
        t.Literal("DRAFT"),
        t.Literal("CALCULATED"),
        t.Literal("PENDING_APPROVAL"),
        t.Literal("APPROVED"),
        t.Literal("PAID"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    periodYear: t.Integer(),
    periodMonth: t.Integer(),
    payDate: __nullable__(t.Date()),
    scope: t.Union(
      [
        t.Literal("ALL"),
        t.Literal("BRANCH"),
        t.Literal("DEPARTMENT"),
        t.Literal("CONTRACT"),
        t.Literal("SPECIFIC"),
      ],
      { additionalProperties: false },
    ),
    scopeBranchId: __nullable__(t.String()),
    scopeRoleId: __nullable__(t.String()),
    totalGross: __nullable__(t.Number()),
    totalEmployeeGosi: __nullable__(t.Number()),
    totalCompanyGosi: __nullable__(t.Number()),
    totalNet: __nullable__(t.Number()),
    totalCompanyCost: __nullable__(t.Number()),
    distribution: __nullable__(t.Any()),
    approvedAt: __nullable__(t.Date()),
    paidAt: __nullable__(t.Date()),
    cancelledAt: __nullable__(t.Date()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PayrollRunRelations = t.Object(
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
    createdBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    lines: t.Array(
      t.Object(
        {
          id: t.String(),
          runId: t.String(),
          staffId: t.String(),
          staffName: t.String(),
          staffCode: t.String(),
          baseSalary: t.Number(),
          allowancesTotal: t.Number(),
          overtimeHoursSuggested: t.Number(),
          overtimeHoursOverride: __nullable__(t.Number()),
          paymentMethodSuggested: t.Union(
            [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
            { additionalProperties: false },
          ),
          paymentMethodOverride: __nullable__(
            t.Union(
              [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
              { additionalProperties: false },
            ),
          ),
          note: __nullable__(t.String()),
          overtimePay: t.Number(),
          leaveDeduction: t.Number(),
          grossEarnings: t.Number(),
          gosiBase: t.Number(),
          employeeGosi: t.Number(),
          companyGosi: t.Number(),
          netPay: t.Number(),
          companyCost: t.Number(),
          issues: __nullable__(t.Any()),
          excluded: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    approvalSteps: t.Array(
      t.Object(
        {
          id: t.String(),
          runId: t.String(),
          order: t.Integer(),
          title: t.String(),
          state: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("APPROVED"),
              t.Literal("REJECTED"),
            ],
            { additionalProperties: false },
          ),
          approverId: __nullable__(t.String()),
          actedAt: __nullable__(t.Date()),
          comment: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PayrollRunPlainInputCreate = t.Object(
  {
    code: t.String(),
    type: t.Optional(
      t.Union([t.Literal("REGULAR"), t.Literal("OFF_CYCLE")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("CALCULATED"),
          t.Literal("PENDING_APPROVAL"),
          t.Literal("APPROVED"),
          t.Literal("PAID"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    periodYear: t.Integer(),
    periodMonth: t.Integer(),
    payDate: t.Optional(__nullable__(t.Date())),
    scope: t.Optional(
      t.Union(
        [
          t.Literal("ALL"),
          t.Literal("BRANCH"),
          t.Literal("DEPARTMENT"),
          t.Literal("CONTRACT"),
          t.Literal("SPECIFIC"),
        ],
        { additionalProperties: false },
      ),
    ),
    totalGross: t.Optional(__nullable__(t.Number())),
    totalEmployeeGosi: t.Optional(__nullable__(t.Number())),
    totalCompanyGosi: t.Optional(__nullable__(t.Number())),
    totalNet: t.Optional(__nullable__(t.Number())),
    totalCompanyCost: t.Optional(__nullable__(t.Number())),
    distribution: t.Optional(__nullable__(t.Any())),
    approvedAt: t.Optional(__nullable__(t.Date())),
    paidAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PayrollRunPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    type: t.Optional(
      t.Union([t.Literal("REGULAR"), t.Literal("OFF_CYCLE")], {
        additionalProperties: false,
      }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("CALCULATED"),
          t.Literal("PENDING_APPROVAL"),
          t.Literal("APPROVED"),
          t.Literal("PAID"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    periodYear: t.Optional(t.Integer()),
    periodMonth: t.Optional(t.Integer()),
    payDate: t.Optional(__nullable__(t.Date())),
    scope: t.Optional(
      t.Union(
        [
          t.Literal("ALL"),
          t.Literal("BRANCH"),
          t.Literal("DEPARTMENT"),
          t.Literal("CONTRACT"),
          t.Literal("SPECIFIC"),
        ],
        { additionalProperties: false },
      ),
    ),
    totalGross: t.Optional(__nullable__(t.Number())),
    totalEmployeeGosi: t.Optional(__nullable__(t.Number())),
    totalCompanyGosi: t.Optional(__nullable__(t.Number())),
    totalNet: t.Optional(__nullable__(t.Number())),
    totalCompanyCost: t.Optional(__nullable__(t.Number())),
    distribution: t.Optional(__nullable__(t.Any())),
    approvedAt: t.Optional(__nullable__(t.Date())),
    paidAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PayrollRunRelationsInputCreate = t.Object(
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
    createdBy: t.Optional(
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
    lines: t.Optional(
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
    approvalSteps: t.Optional(
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

export const PayrollRunRelationsInputUpdate = t.Partial(
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
      createdBy: t.Partial(
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
      lines: t.Partial(
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
      approvalSteps: t.Partial(
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

export const PayrollRunWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          type: t.Union([t.Literal("REGULAR"), t.Literal("OFF_CYCLE")], {
            additionalProperties: false,
          }),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("CALCULATED"),
              t.Literal("PENDING_APPROVAL"),
              t.Literal("APPROVED"),
              t.Literal("PAID"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          periodYear: t.Integer(),
          periodMonth: t.Integer(),
          payDate: t.Date(),
          scope: t.Union(
            [
              t.Literal("ALL"),
              t.Literal("BRANCH"),
              t.Literal("DEPARTMENT"),
              t.Literal("CONTRACT"),
              t.Literal("SPECIFIC"),
            ],
            { additionalProperties: false },
          ),
          scopeBranchId: t.String(),
          scopeRoleId: t.String(),
          totalGross: t.Number(),
          totalEmployeeGosi: t.Number(),
          totalCompanyGosi: t.Number(),
          totalNet: t.Number(),
          totalCompanyCost: t.Number(),
          distribution: t.Any(),
          approvedAt: t.Date(),
          paidAt: t.Date(),
          cancelledAt: t.Date(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PayrollRun" },
  ),
);

export const PayrollRunWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              clinicId: t.String(),
              type: t.Union([t.Literal("REGULAR"), t.Literal("OFF_CYCLE")], {
                additionalProperties: false,
              }),
              status: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("CALCULATED"),
                  t.Literal("PENDING_APPROVAL"),
                  t.Literal("APPROVED"),
                  t.Literal("PAID"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              periodYear: t.Integer(),
              periodMonth: t.Integer(),
              payDate: t.Date(),
              scope: t.Union(
                [
                  t.Literal("ALL"),
                  t.Literal("BRANCH"),
                  t.Literal("DEPARTMENT"),
                  t.Literal("CONTRACT"),
                  t.Literal("SPECIFIC"),
                ],
                { additionalProperties: false },
              ),
              scopeBranchId: t.String(),
              scopeRoleId: t.String(),
              totalGross: t.Number(),
              totalEmployeeGosi: t.Number(),
              totalCompanyGosi: t.Number(),
              totalNet: t.Number(),
              totalCompanyCost: t.Number(),
              distribution: t.Any(),
              approvedAt: t.Date(),
              paidAt: t.Date(),
              cancelledAt: t.Date(),
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
  { $id: "PayrollRun" },
);

export const PayrollRunSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      type: t.Boolean(),
      status: t.Boolean(),
      periodYear: t.Boolean(),
      periodMonth: t.Boolean(),
      payDate: t.Boolean(),
      scope: t.Boolean(),
      scopeBranchId: t.Boolean(),
      scopeRoleId: t.Boolean(),
      totalGross: t.Boolean(),
      totalEmployeeGosi: t.Boolean(),
      totalCompanyGosi: t.Boolean(),
      totalNet: t.Boolean(),
      totalCompanyCost: t.Boolean(),
      distribution: t.Boolean(),
      approvedAt: t.Boolean(),
      paidAt: t.Boolean(),
      cancelledAt: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      createdBy: t.Boolean(),
      lines: t.Boolean(),
      approvalSteps: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PayrollRunInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      status: t.Boolean(),
      scope: t.Boolean(),
      clinic: t.Boolean(),
      createdBy: t.Boolean(),
      lines: t.Boolean(),
      approvalSteps: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PayrollRunOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodYear: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodMonth: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      payDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scopeBranchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scopeRoleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalGross: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalEmployeeGosi: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalCompanyGosi: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalNet: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalCompanyCost: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      distribution: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      approvedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PayrollRun = t.Composite([PayrollRunPlain, PayrollRunRelations], {
  additionalProperties: false,
});

export const PayrollRunInputCreate = t.Composite(
  [PayrollRunPlainInputCreate, PayrollRunRelationsInputCreate],
  { additionalProperties: false },
);

export const PayrollRunInputUpdate = t.Composite(
  [PayrollRunPlainInputUpdate, PayrollRunRelationsInputUpdate],
  { additionalProperties: false },
);
