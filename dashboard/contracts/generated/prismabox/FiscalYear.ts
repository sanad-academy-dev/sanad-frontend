import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const FiscalYearPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    year: t.String(),
    yearStartDate: t.Date(),
    yearEndDate: t.Date(),
    isShortYear: t.Boolean(),
    disabled: t.Boolean(),
    autoCreated: t.Boolean(),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const FiscalYearRelations = t.Object(
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

export const FiscalYearPlainInputCreate = t.Object(
  {
    year: t.String(),
    yearStartDate: t.Date(),
    yearEndDate: t.Date(),
    isShortYear: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
    autoCreated: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const FiscalYearPlainInputUpdate = t.Object(
  {
    year: t.Optional(t.String()),
    yearStartDate: t.Optional(t.Date()),
    yearEndDate: t.Optional(t.Date()),
    isShortYear: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
    autoCreated: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const FiscalYearRelationsInputCreate = t.Object(
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

export const FiscalYearRelationsInputUpdate = t.Partial(
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

export const FiscalYearWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          year: t.String(),
          yearStartDate: t.Date(),
          yearEndDate: t.Date(),
          isShortYear: t.Boolean(),
          disabled: t.Boolean(),
          autoCreated: t.Boolean(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "FiscalYear" },
  ),
);

export const FiscalYearWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_year: t.Object(
                { clinicId: t.String(), year: t.String() },
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
              clinicId_year: t.Object(
                { clinicId: t.String(), year: t.String() },
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
              year: t.String(),
              yearStartDate: t.Date(),
              yearEndDate: t.Date(),
              isShortYear: t.Boolean(),
              disabled: t.Boolean(),
              autoCreated: t.Boolean(),
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
  { $id: "FiscalYear" },
);

export const FiscalYearSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      year: t.Boolean(),
      yearStartDate: t.Boolean(),
      yearEndDate: t.Boolean(),
      isShortYear: t.Boolean(),
      disabled: t.Boolean(),
      autoCreated: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const FiscalYearInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const FiscalYearOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      year: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      yearStartDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      yearEndDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isShortYear: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      autoCreated: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const FiscalYear = t.Composite([FiscalYearPlain, FiscalYearRelations], {
  additionalProperties: false,
});

export const FiscalYearInputCreate = t.Composite(
  [FiscalYearPlainInputCreate, FiscalYearRelationsInputCreate],
  { additionalProperties: false },
);

export const FiscalYearInputUpdate = t.Composite(
  [FiscalYearPlainInputUpdate, FiscalYearRelationsInputUpdate],
  { additionalProperties: false },
);
