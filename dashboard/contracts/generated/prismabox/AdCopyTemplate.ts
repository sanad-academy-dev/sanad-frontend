import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdCopyTemplatePlain = t.Object(
  {
    id: t.String(),
    clinicId: __nullable__(t.String()),
    category: t.Union(
      [
        t.Literal("SEO"),
        t.Literal("PAID_ADS"),
        t.Literal("SALES"),
        t.Literal("SOCIAL"),
        t.Literal("EMAIL"),
      ],
      {
        additionalProperties: false,
        description: `تبويبات مكتبة القوالب (شاشة 540226)`,
      },
    ),
    title: t.String(),
    body: t.String(),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
  },
);

export const AdCopyTemplateRelations = t.Object(
  {
    clinic: __nullable__(
      t.Object(
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
    ),
  },
  {
    additionalProperties: false,
    description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
  },
);

export const AdCopyTemplatePlainInputCreate = t.Object(
  {
    category: t.Union(
      [
        t.Literal("SEO"),
        t.Literal("PAID_ADS"),
        t.Literal("SALES"),
        t.Literal("SOCIAL"),
        t.Literal("EMAIL"),
      ],
      {
        additionalProperties: false,
        description: `تبويبات مكتبة القوالب (شاشة 540226)`,
      },
    ),
    title: t.String(),
    body: t.String(),
  },
  {
    additionalProperties: false,
    description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
  },
);

export const AdCopyTemplatePlainInputUpdate = t.Object(
  {
    category: t.Optional(
      t.Union(
        [
          t.Literal("SEO"),
          t.Literal("PAID_ADS"),
          t.Literal("SALES"),
          t.Literal("SOCIAL"),
          t.Literal("EMAIL"),
        ],
        {
          additionalProperties: false,
          description: `تبويبات مكتبة القوالب (شاشة 540226)`,
        },
      ),
    ),
    title: t.Optional(t.String()),
    body: t.Optional(t.String()),
  },
  {
    additionalProperties: false,
    description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
  },
);

export const AdCopyTemplateRelationsInputCreate = t.Object(
  {
    clinic: t.Optional(
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
    description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
  },
);

export const AdCopyTemplateRelationsInputUpdate = t.Partial(
  t.Object(
    {
      clinic: t.Partial(
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
      description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
    },
  ),
);

export const AdCopyTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          category: t.Union(
            [
              t.Literal("SEO"),
              t.Literal("PAID_ADS"),
              t.Literal("SALES"),
              t.Literal("SOCIAL"),
              t.Literal("EMAIL"),
            ],
            {
              additionalProperties: false,
              description: `تبويبات مكتبة القوالب (شاشة 540226)`,
            },
          ),
          title: t.String(),
          body: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
        },
      ),
    { $id: "AdCopyTemplate" },
  ),
);

export const AdCopyTemplateWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
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
              category: t.Union(
                [
                  t.Literal("SEO"),
                  t.Literal("PAID_ADS"),
                  t.Literal("SALES"),
                  t.Literal("SOCIAL"),
                  t.Literal("EMAIL"),
                ],
                {
                  additionalProperties: false,
                  description: `تبويبات مكتبة القوالب (شاشة 540226)`,
                },
              ),
              title: t.String(),
              body: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AdCopyTemplate" },
);

export const AdCopyTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      category: t.Boolean(),
      title: t.Boolean(),
      body: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
    },
  ),
);

export const AdCopyTemplateInclude = t.Partial(
  t.Object(
    { category: t.Boolean(), clinic: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
    },
  ),
);

export const AdCopyTemplateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `قوالب نصّ الإعلان. \`clinicId = null\` يعني قالبًا عامًّا مبذورًا للجميع.`,
    },
  ),
);

export const AdCopyTemplate = t.Composite(
  [AdCopyTemplatePlain, AdCopyTemplateRelations],
  { additionalProperties: false },
);

export const AdCopyTemplateInputCreate = t.Composite(
  [AdCopyTemplatePlainInputCreate, AdCopyTemplateRelationsInputCreate],
  { additionalProperties: false },
);

export const AdCopyTemplateInputUpdate = t.Composite(
  [AdCopyTemplatePlainInputUpdate, AdCopyTemplateRelationsInputUpdate],
  { additionalProperties: false },
);
