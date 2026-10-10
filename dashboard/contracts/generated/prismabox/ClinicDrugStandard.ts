import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicDrugStandardPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    standardId: t.String(),
    enabled: t.Boolean(),
    enabledAt: __nullable__(t.Date()),
    enabledById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ClinicDrugStandardRelations = t.Object(
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
    standard: t.Object(
      {
        id: t.String(),
        code: t.String(),
        nameEn: t.String(),
        nameAr: t.String(),
        countryCode: t.String(),
        authorityEn: t.String(),
        authorityAr: t.String(),
        sourceUrl: t.String(),
        dataVersion: t.String(),
        fetchedAt: t.Date(),
        productCount: t.Integer(),
        isActive: t.Boolean(),
        coverageNoteAr: __nullable__(t.String()),
        coverageNoteEn: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ClinicDrugStandardPlainInputCreate = t.Object(
  {
    enabled: t.Optional(t.Boolean()),
    enabledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ClinicDrugStandardPlainInputUpdate = t.Object(
  {
    enabled: t.Optional(t.Boolean()),
    enabledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const ClinicDrugStandardRelationsInputCreate = t.Object(
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
    standard: t.Object(
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

export const ClinicDrugStandardRelationsInputUpdate = t.Partial(
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
      standard: t.Object(
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

export const ClinicDrugStandardWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          standardId: t.String(),
          enabled: t.Boolean(),
          enabledAt: t.Date(),
          enabledById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "ClinicDrugStandard" },
  ),
);

export const ClinicDrugStandardWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_standardId: t.Object(
                { clinicId: t.String(), standardId: t.String() },
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
              clinicId_standardId: t.Object(
                { clinicId: t.String(), standardId: t.String() },
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
              standardId: t.String(),
              enabled: t.Boolean(),
              enabledAt: t.Date(),
              enabledById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ClinicDrugStandard" },
);

export const ClinicDrugStandardSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      standardId: t.Boolean(),
      enabled: t.Boolean(),
      enabledAt: t.Boolean(),
      enabledById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      standard: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ClinicDrugStandardInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), standard: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ClinicDrugStandardOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      standardId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enabledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enabledById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const ClinicDrugStandard = t.Composite(
  [ClinicDrugStandardPlain, ClinicDrugStandardRelations],
  { additionalProperties: false },
);

export const ClinicDrugStandardInputCreate = t.Composite(
  [ClinicDrugStandardPlainInputCreate, ClinicDrugStandardRelationsInputCreate],
  { additionalProperties: false },
);

export const ClinicDrugStandardInputUpdate = t.Composite(
  [ClinicDrugStandardPlainInputUpdate, ClinicDrugStandardRelationsInputUpdate],
  { additionalProperties: false },
);
