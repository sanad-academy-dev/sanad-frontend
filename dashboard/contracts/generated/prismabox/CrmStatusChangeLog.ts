import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmStatusChangeLogPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
      additionalProperties: false,
      description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
    }),
    referenceId: t.String(),
    fromStatusId: __nullable__(t.String()),
    toStatusId: t.String(),
    durationInPrevious: __nullable__(
      t.Integer({
        description: `الثواني التي قضاها المستند في حالته السابقة؛ null لأول تسجيل (لا سابقة له)`,
      }),
    ),
    byUserId: __nullable__(t.String()),
    at: t.Date(),
  },
  {
    additionalProperties: false,
    description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
  },
);

export const CrmStatusChangeLogRelations = t.Object(
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
    byUser: __nullable__(
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
  {
    additionalProperties: false,
    description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
  },
);

export const CrmStatusChangeLogPlainInputCreate = t.Object(
  {
    referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
      additionalProperties: false,
      description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
    }),
    durationInPrevious: t.Optional(
      __nullable__(
        t.Integer({
          description: `الثواني التي قضاها المستند في حالته السابقة؛ null لأول تسجيل (لا سابقة له)`,
        }),
      ),
    ),
    at: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
  },
);

export const CrmStatusChangeLogPlainInputUpdate = t.Object(
  {
    referenceType: t.Optional(
      t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
        additionalProperties: false,
        description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
      }),
    ),
    durationInPrevious: t.Optional(
      __nullable__(
        t.Integer({
          description: `الثواني التي قضاها المستند في حالته السابقة؛ null لأول تسجيل (لا سابقة له)`,
        }),
      ),
    ),
    at: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
  },
);

export const CrmStatusChangeLogRelationsInputCreate = t.Object(
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
    byUser: t.Optional(
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
  {
    additionalProperties: false,
    description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
  },
);

export const CrmStatusChangeLogRelationsInputUpdate = t.Partial(
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
      byUser: t.Partial(
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
    {
      additionalProperties: false,
      description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
    },
  ),
);

export const CrmStatusChangeLogWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
            additionalProperties: false,
            description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
          }),
          referenceId: t.String(),
          fromStatusId: t.String(),
          toStatusId: t.String(),
          durationInPrevious: t.Integer({
            description: `الثواني التي قضاها المستند في حالته السابقة؛ null لأول تسجيل (لا سابقة له)`,
          }),
          byUserId: t.String(),
          at: t.Date(),
        },
        {
          additionalProperties: false,
          description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
        },
      ),
    { $id: "CrmStatusChangeLog" },
  ),
);

export const CrmStatusChangeLogWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
            },
          ),
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
              referenceType: t.Union([t.Literal("LEAD"), t.Literal("DEAL")], {
                additionalProperties: false,
                description: `*
* §8.1 — one polymorphic pattern for every activity and the status log.`,
              }),
              referenceId: t.String(),
              fromStatusId: t.String(),
              toStatusId: t.String(),
              durationInPrevious: t.Integer({
                description: `الثواني التي قضاها المستند في حالته السابقة؛ null لأول تسجيل (لا سابقة له)`,
              }),
              byUserId: t.String(),
              at: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "CrmStatusChangeLog" },
);

export const CrmStatusChangeLogSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      referenceType: t.Boolean(),
      referenceId: t.Boolean(),
      fromStatusId: t.Boolean(),
      toStatusId: t.Boolean(),
      durationInPrevious: t.Boolean(),
      byUserId: t.Boolean(),
      at: t.Boolean(),
      clinic: t.Boolean(),
      byUser: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
    },
  ),
);

export const CrmStatusChangeLogInclude = t.Partial(
  t.Object(
    {
      referenceType: t.Boolean(),
      clinic: t.Boolean(),
      byUser: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
    },
  ),
);

export const CrmStatusChangeLogOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fromStatusId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toStatusId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationInPrevious: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      byUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      at: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `BR-C3.4 — كل انتقال حالة يُسجَّل ومعه مدة البقاء في الحالة السابقة: وقود تقارير
السرعة في §12. جدول واحد يخدم العملاء المحتملين والصفقات عبر نمط §8.1.`,
    },
  ),
);

export const CrmStatusChangeLog = t.Composite(
  [CrmStatusChangeLogPlain, CrmStatusChangeLogRelations],
  { additionalProperties: false },
);

export const CrmStatusChangeLogInputCreate = t.Composite(
  [CrmStatusChangeLogPlainInputCreate, CrmStatusChangeLogRelationsInputCreate],
  { additionalProperties: false },
);

export const CrmStatusChangeLogInputUpdate = t.Composite(
  [CrmStatusChangeLogPlainInputUpdate, CrmStatusChangeLogRelationsInputUpdate],
  { additionalProperties: false },
);
