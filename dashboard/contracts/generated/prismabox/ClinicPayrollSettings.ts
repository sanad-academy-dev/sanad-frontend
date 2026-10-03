import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicPayrollSettingsPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    gosiSaudiEmployeeRate: t.Number(),
    gosiSaudiCompanyRate: t.Number(),
    gosiNonSaudiEmployeeRate: t.Number(),
    gosiNonSaudiCompanyRate: t.Number(),
    gosiCeiling: t.Number(),
    overtimeBase: t.Union([t.Literal("BASIC"), t.Literal("TOTAL")], {
      additionalProperties: false,
    }),
    overtimeMultiplier: t.Number(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClinicPayrollSettingsRelations = t.Object(
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

export const ClinicPayrollSettingsPlainInputCreate = t.Object(
  {
    gosiSaudiEmployeeRate: t.Optional(t.Number()),
    gosiSaudiCompanyRate: t.Optional(t.Number()),
    gosiNonSaudiEmployeeRate: t.Optional(t.Number()),
    gosiNonSaudiCompanyRate: t.Optional(t.Number()),
    gosiCeiling: t.Optional(t.Number()),
    overtimeBase: t.Optional(
      t.Union([t.Literal("BASIC"), t.Literal("TOTAL")], {
        additionalProperties: false,
      }),
    ),
    overtimeMultiplier: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const ClinicPayrollSettingsPlainInputUpdate = t.Object(
  {
    gosiSaudiEmployeeRate: t.Optional(t.Number()),
    gosiSaudiCompanyRate: t.Optional(t.Number()),
    gosiNonSaudiEmployeeRate: t.Optional(t.Number()),
    gosiNonSaudiCompanyRate: t.Optional(t.Number()),
    gosiCeiling: t.Optional(t.Number()),
    overtimeBase: t.Optional(
      t.Union([t.Literal("BASIC"), t.Literal("TOTAL")], {
        additionalProperties: false,
      }),
    ),
    overtimeMultiplier: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const ClinicPayrollSettingsRelationsInputCreate = t.Object(
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

export const ClinicPayrollSettingsRelationsInputUpdate = t.Partial(
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

export const ClinicPayrollSettingsWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          gosiSaudiEmployeeRate: t.Number(),
          gosiSaudiCompanyRate: t.Number(),
          gosiNonSaudiEmployeeRate: t.Number(),
          gosiNonSaudiCompanyRate: t.Number(),
          gosiCeiling: t.Number(),
          overtimeBase: t.Union([t.Literal("BASIC"), t.Literal("TOTAL")], {
            additionalProperties: false,
          }),
          overtimeMultiplier: t.Number(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicPayrollSettings" },
  ),
);

export const ClinicPayrollSettingsWhereUnique = t.Recursive(
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
              gosiSaudiEmployeeRate: t.Number(),
              gosiSaudiCompanyRate: t.Number(),
              gosiNonSaudiEmployeeRate: t.Number(),
              gosiNonSaudiCompanyRate: t.Number(),
              gosiCeiling: t.Number(),
              overtimeBase: t.Union([t.Literal("BASIC"), t.Literal("TOTAL")], {
                additionalProperties: false,
              }),
              overtimeMultiplier: t.Number(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicPayrollSettings" },
);

export const ClinicPayrollSettingsSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      gosiSaudiEmployeeRate: t.Boolean(),
      gosiSaudiCompanyRate: t.Boolean(),
      gosiNonSaudiEmployeeRate: t.Boolean(),
      gosiNonSaudiCompanyRate: t.Boolean(),
      gosiCeiling: t.Boolean(),
      overtimeBase: t.Boolean(),
      overtimeMultiplier: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicPayrollSettingsInclude = t.Partial(
  t.Object(
    { overtimeBase: t.Boolean(), clinic: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ClinicPayrollSettingsOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gosiSaudiEmployeeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gosiSaudiCompanyRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gosiNonSaudiEmployeeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gosiNonSaudiCompanyRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      gosiCeiling: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      overtimeMultiplier: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ClinicPayrollSettings = t.Composite(
  [ClinicPayrollSettingsPlain, ClinicPayrollSettingsRelations],
  { additionalProperties: false },
);

export const ClinicPayrollSettingsInputCreate = t.Composite(
  [
    ClinicPayrollSettingsPlainInputCreate,
    ClinicPayrollSettingsRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ClinicPayrollSettingsInputUpdate = t.Composite(
  [
    ClinicPayrollSettingsPlainInputUpdate,
    ClinicPayrollSettingsRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
