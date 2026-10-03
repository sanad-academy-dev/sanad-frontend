import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingCapacityConfigPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    branchId: t.String(),
    stations: t.Integer(),
    dryerSlots: t.Integer(),
    maxPetsPerDay: __nullable__(t.Integer()),
    maxHeatSensitiveConcurrent: t.Integer(),
    dropOffWindowMin: t.Integer(),
    requireDepositPercent: __nullable__(t.Number()),
    seniorAgeYears: t.Integer(),
    quoteReapprovalPercent: t.Number(),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
  },
);

export const GroomingCapacityConfigRelations = t.Object(
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
    branch: t.Object(
      {
        id: t.String(),
        branchCode: t.String(),
        clinicId: t.String(),
        name: t.String(),
        icon: __nullable__(t.String()),
        type: t.Union([t.Literal("PRIMARY"), t.Literal("SUB")], {
          additionalProperties: false,
        }),
        managerId: __nullable__(t.String()),
        email: __nullable__(t.String()),
        city: __nullable__(t.String()),
        phone: __nullable__(t.String()),
        address: __nullable__(t.String()),
        active: t.Boolean(),
        emergencyNotifications: t.Boolean(),
        settings: __nullable__(t.Any()),
        isDeleted: t.Boolean(),
        deletedAt: __nullable__(t.Date()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
  },
);

export const GroomingCapacityConfigPlainInputCreate = t.Object(
  {
    stations: t.Optional(t.Integer()),
    dryerSlots: t.Optional(t.Integer()),
    maxPetsPerDay: t.Optional(__nullable__(t.Integer())),
    maxHeatSensitiveConcurrent: t.Optional(t.Integer()),
    dropOffWindowMin: t.Optional(t.Integer()),
    requireDepositPercent: t.Optional(__nullable__(t.Number())),
    seniorAgeYears: t.Optional(t.Integer()),
    quoteReapprovalPercent: t.Optional(t.Number()),
  },
  {
    additionalProperties: false,
    description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
  },
);

export const GroomingCapacityConfigPlainInputUpdate = t.Object(
  {
    stations: t.Optional(t.Integer()),
    dryerSlots: t.Optional(t.Integer()),
    maxPetsPerDay: t.Optional(__nullable__(t.Integer())),
    maxHeatSensitiveConcurrent: t.Optional(t.Integer()),
    dropOffWindowMin: t.Optional(t.Integer()),
    requireDepositPercent: t.Optional(__nullable__(t.Number())),
    seniorAgeYears: t.Optional(t.Integer()),
    quoteReapprovalPercent: t.Optional(t.Number()),
  },
  {
    additionalProperties: false,
    description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
  },
);

export const GroomingCapacityConfigRelationsInputCreate = t.Object(
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
    branch: t.Object(
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
  {
    additionalProperties: false,
    description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
  },
);

export const GroomingCapacityConfigRelationsInputUpdate = t.Partial(
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
      branch: t.Object(
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
    {
      additionalProperties: false,
      description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
    },
  ),
);

export const GroomingCapacityConfigWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
          stations: t.Integer(),
          dryerSlots: t.Integer(),
          maxPetsPerDay: t.Integer(),
          maxHeatSensitiveConcurrent: t.Integer(),
          dropOffWindowMin: t.Integer(),
          requireDepositPercent: t.Number(),
          seniorAgeYears: t.Integer(),
          quoteReapprovalPercent: t.Number(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
        },
      ),
    { $id: "GroomingCapacityConfig" },
  ),
);

export const GroomingCapacityConfigWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), branchId: t.String() },
            {
              additionalProperties: false,
              description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ branchId: t.String() })],
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
              branchId: t.String(),
              stations: t.Integer(),
              dryerSlots: t.Integer(),
              maxPetsPerDay: t.Integer(),
              maxHeatSensitiveConcurrent: t.Integer(),
              dropOffWindowMin: t.Integer(),
              requireDepositPercent: t.Number(),
              seniorAgeYears: t.Integer(),
              quoteReapprovalPercent: t.Number(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "GroomingCapacityConfig" },
);

export const GroomingCapacityConfigSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      stations: t.Boolean(),
      dryerSlots: t.Boolean(),
      maxPetsPerDay: t.Boolean(),
      maxHeatSensitiveConcurrent: t.Boolean(),
      dropOffWindowMin: t.Boolean(),
      requireDepositPercent: t.Boolean(),
      seniorAgeYears: t.Boolean(),
      quoteReapprovalPercent: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
    },
  ),
);

export const GroomingCapacityConfigInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), branch: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
    },
  ),
);

export const GroomingCapacityConfigOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      stations: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dryerSlots: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxPetsPerDay: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxHeatSensitiveConcurrent: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      dropOffWindowMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requireDepositPercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      seniorAgeYears: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quoteReapprovalPercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `سعة التجميل لكل فرع (§7). القيد ثلاثي: دقائق المُجمِّل، والمحطة، وفتحات
التجفيف — والأخيرة هي عنق الزجاجة الحقيقي الذي لا تنمذجه أنظمة الصالونات.`,
    },
  ),
);

export const GroomingCapacityConfig = t.Composite(
  [GroomingCapacityConfigPlain, GroomingCapacityConfigRelations],
  { additionalProperties: false },
);

export const GroomingCapacityConfigInputCreate = t.Composite(
  [
    GroomingCapacityConfigPlainInputCreate,
    GroomingCapacityConfigRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const GroomingCapacityConfigInputUpdate = t.Composite(
  [
    GroomingCapacityConfigPlainInputUpdate,
    GroomingCapacityConfigRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
