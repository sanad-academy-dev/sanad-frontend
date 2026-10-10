import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ProcessDeferredAccountingPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    type: __nullable__(
      t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
        additionalProperties: false,
      }),
    ),
    periodStartDate: t.Date(),
    periodEndDate: t.Date(),
    entriesCreated: t.Integer(),
    amountPosted: t.Number(),
    status: t.String(),
    errorMessage: __nullable__(t.String()),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ProcessDeferredAccountingRelations = t.Object(
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
  },
  { additionalProperties: false },
);

export const ProcessDeferredAccountingPlainInputCreate = t.Object(
  {
    type: t.Optional(
      __nullable__(
        t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
          additionalProperties: false,
        }),
      ),
    ),
    periodStartDate: t.Date(),
    periodEndDate: t.Date(),
    entriesCreated: t.Optional(t.Integer()),
    amountPosted: t.Optional(t.Number()),
    status: t.Optional(t.String()),
    errorMessage: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ProcessDeferredAccountingPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      __nullable__(
        t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
          additionalProperties: false,
        }),
      ),
    ),
    periodStartDate: t.Optional(t.Date()),
    periodEndDate: t.Optional(t.Date()),
    entriesCreated: t.Optional(t.Integer()),
    amountPosted: t.Optional(t.Number()),
    status: t.Optional(t.String()),
    errorMessage: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ProcessDeferredAccountingRelationsInputCreate = t.Object(
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
  },
  { additionalProperties: false },
);

export const ProcessDeferredAccountingRelationsInputUpdate = t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const ProcessDeferredAccountingWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          type: t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
            additionalProperties: false,
          }),
          periodStartDate: t.Date(),
          periodEndDate: t.Date(),
          entriesCreated: t.Integer(),
          amountPosted: t.Number(),
          status: t.String(),
          errorMessage: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ProcessDeferredAccounting" },
  ),
);

export const ProcessDeferredAccountingWhereUnique = t.Recursive(
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
              type: t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
                additionalProperties: false,
              }),
              periodStartDate: t.Date(),
              periodEndDate: t.Date(),
              entriesCreated: t.Integer(),
              amountPosted: t.Number(),
              status: t.String(),
              errorMessage: t.String(),
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
  { $id: "ProcessDeferredAccounting" },
);

export const ProcessDeferredAccountingSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      type: t.Boolean(),
      periodStartDate: t.Boolean(),
      periodEndDate: t.Boolean(),
      entriesCreated: t.Boolean(),
      amountPosted: t.Boolean(),
      status: t.Boolean(),
      errorMessage: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ProcessDeferredAccountingInclude = t.Partial(
  t.Object(
    { type: t.Boolean(), clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ProcessDeferredAccountingOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodStartDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodEndDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      entriesCreated: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amountPosted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      status: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      errorMessage: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ProcessDeferredAccounting = t.Composite(
  [ProcessDeferredAccountingPlain, ProcessDeferredAccountingRelations],
  { additionalProperties: false },
);

export const ProcessDeferredAccountingInputCreate = t.Composite(
  [
    ProcessDeferredAccountingPlainInputCreate,
    ProcessDeferredAccountingRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ProcessDeferredAccountingInputUpdate = t.Composite(
  [
    ProcessDeferredAccountingPlainInputUpdate,
    ProcessDeferredAccountingRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
