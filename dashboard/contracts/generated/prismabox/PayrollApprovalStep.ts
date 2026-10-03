import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollApprovalStepPlain = t.Object(
  {
    id: t.String(),
    runId: t.String(),
    order: t.Integer(),
    title: t.String(),
    state: t.Union(
      [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("REJECTED")],
      { additionalProperties: false },
    ),
    approverId: __nullable__(t.String()),
    actedAt: __nullable__(t.Date()),
    comment: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const PayrollApprovalStepRelations = t.Object(
  {
    run: t.Object(
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
    ),
    approver: __nullable__(
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
  },
  { additionalProperties: false },
);

export const PayrollApprovalStepPlainInputCreate = t.Object(
  {
    order: t.Integer(),
    title: t.String(),
    state: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("REJECTED")],
        { additionalProperties: false },
      ),
    ),
    actedAt: t.Optional(__nullable__(t.Date())),
    comment: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PayrollApprovalStepPlainInputUpdate = t.Object(
  {
    order: t.Optional(t.Integer()),
    title: t.Optional(t.String()),
    state: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("REJECTED")],
        { additionalProperties: false },
      ),
    ),
    actedAt: t.Optional(__nullable__(t.Date())),
    comment: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const PayrollApprovalStepRelationsInputCreate = t.Object(
  {
    run: t.Object(
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
    approver: t.Optional(
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

export const PayrollApprovalStepRelationsInputUpdate = t.Partial(
  t.Object(
    {
      run: t.Object(
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
      approver: t.Partial(
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

export const PayrollApprovalStepWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          approverId: t.String(),
          actedAt: t.Date(),
          comment: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "PayrollApprovalStep" },
  ),
);

export const PayrollApprovalStepWhereUnique = t.Recursive(
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
              approverId: t.String(),
              actedAt: t.Date(),
              comment: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PayrollApprovalStep" },
);

export const PayrollApprovalStepSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      runId: t.Boolean(),
      order: t.Boolean(),
      title: t.Boolean(),
      state: t.Boolean(),
      approverId: t.Boolean(),
      actedAt: t.Boolean(),
      comment: t.Boolean(),
      createdAt: t.Boolean(),
      run: t.Boolean(),
      approver: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PayrollApprovalStepInclude = t.Partial(
  t.Object(
    {
      state: t.Boolean(),
      run: t.Boolean(),
      approver: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PayrollApprovalStepOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      runId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      order: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      approverId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      actedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      comment: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PayrollApprovalStep = t.Composite(
  [PayrollApprovalStepPlain, PayrollApprovalStepRelations],
  { additionalProperties: false },
);

export const PayrollApprovalStepInputCreate = t.Composite(
  [
    PayrollApprovalStepPlainInputCreate,
    PayrollApprovalStepRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PayrollApprovalStepInputUpdate = t.Composite(
  [
    PayrollApprovalStepPlainInputUpdate,
    PayrollApprovalStepRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
