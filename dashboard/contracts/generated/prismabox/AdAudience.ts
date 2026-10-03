import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdAudiencePlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    name: t.String(),
    ageMin: __nullable__(t.Integer()),
    ageMax: __nullable__(t.Integer()),
    locations: t.Array(t.String(), { additionalProperties: false }),
    languages: t.Array(t.String(), { additionalProperties: false }),
    interests: t.Array(t.String(), { additionalProperties: false }),
    estimatedReach: __nullable__(t.Integer()),
    isAiSuggested: t.Boolean(),
    aiRationale: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
  },
);

export const AdAudienceRelations = t.Object(
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
    campaigns: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: __nullable__(t.String()),
          name: t.String(),
          platform: t.Union(
            [
              t.Literal("FACEBOOK"),
              t.Literal("INSTAGRAM"),
              t.Literal("LINKEDIN"),
              t.Literal("TIKTOK"),
              t.Literal("X"),
              t.Literal("PINTEREST"),
              t.Literal("SNAPCHAT"),
            ],
            { additionalProperties: false },
          ),
          objective: t.Union(
            [
              t.Literal("BRAND_AWARENESS"),
              t.Literal("LEAD_GENERATION"),
              t.Literal("STORE_VISITS"),
              t.Literal("CUSTOMER_FEEDBACK"),
              t.Literal("SALES"),
              t.Literal("PRODUCT_AWARENESS"),
            ],
            {
              additionalProperties: false,
              description: `أهداف الحملة الستة كما في التصميم (شاشة 538697)`,
            },
          ),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("PENDING"),
              t.Literal("SCHEDULED"),
              t.Literal("ACTIVE"),
              t.Literal("PAUSED"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          socialAccountId: __nullable__(t.String()),
          audienceId: __nullable__(t.String()),
          startsAt: __nullable__(t.Date()),
          endsAt: __nullable__(t.Date()),
          durationDays: __nullable__(t.Integer()),
          budgetAmount: __nullable__(t.Number()),
          budgetKind: __nullable__(
            t.Union([t.Literal("DAILY"), t.Literal("LIFETIME")], {
              additionalProperties: false,
            }),
          ),
          currency: t.String(),
          feeAmount: __nullable__(t.Number()),
          totalAmount: __nullable__(t.Number()),
          externalId: __nullable__(t.String()),
          externalError: __nullable__(t.String()),
          launchedAt: __nullable__(t.Date()),
          createdByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
  },
);

export const AdAudiencePlainInputCreate = t.Object(
  {
    name: t.String(),
    ageMin: t.Optional(__nullable__(t.Integer())),
    ageMax: t.Optional(__nullable__(t.Integer())),
    locations: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    languages: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    interests: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    estimatedReach: t.Optional(__nullable__(t.Integer())),
    isAiSuggested: t.Optional(t.Boolean()),
    aiRationale: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
  },
);

export const AdAudiencePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    ageMin: t.Optional(__nullable__(t.Integer())),
    ageMax: t.Optional(__nullable__(t.Integer())),
    locations: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    languages: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    interests: t.Optional(t.Array(t.String(), { additionalProperties: false })),
    estimatedReach: t.Optional(__nullable__(t.Integer())),
    isAiSuggested: t.Optional(t.Boolean()),
    aiRationale: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
  },
);

export const AdAudienceRelationsInputCreate = t.Object(
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
    campaigns: t.Optional(
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
  {
    additionalProperties: false,
    description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
  },
);

export const AdAudienceRelationsInputUpdate = t.Partial(
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
      campaigns: t.Partial(
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
    {
      additionalProperties: false,
      description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
    },
  ),
);

export const AdAudienceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          ageMin: t.Integer(),
          ageMax: t.Integer(),
          locations: t.Array(t.String(), { additionalProperties: false }),
          languages: t.Array(t.String(), { additionalProperties: false }),
          interests: t.Array(t.String(), { additionalProperties: false }),
          estimatedReach: t.Integer(),
          isAiSuggested: t.Boolean(),
          aiRationale: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
        },
      ),
    { $id: "AdAudience" },
  ),
);

export const AdAudienceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
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
              name: t.String(),
              ageMin: t.Integer(),
              ageMax: t.Integer(),
              locations: t.Array(t.String(), { additionalProperties: false }),
              languages: t.Array(t.String(), { additionalProperties: false }),
              interests: t.Array(t.String(), { additionalProperties: false }),
              estimatedReach: t.Integer(),
              isAiSuggested: t.Boolean(),
              aiRationale: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AdAudience" },
);

export const AdAudienceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      ageMin: t.Boolean(),
      ageMax: t.Boolean(),
      locations: t.Boolean(),
      languages: t.Boolean(),
      interests: t.Boolean(),
      estimatedReach: t.Boolean(),
      isAiSuggested: t.Boolean(),
      aiRationale: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      campaigns: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
    },
  ),
);

export const AdAudienceInclude = t.Partial(
  t.Object(
    { clinic: t.Boolean(), campaigns: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
    },
  ),
);

export const AdAudienceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ageMin: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ageMax: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      locations: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      languages: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      interests: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      estimatedReach: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isAiSuggested: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      aiRationale: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `جمهور محفوظ. \`aiRationale\` هو ما يجعل «لماذا هذا موصى به؟» شرحًا حقيقيًا لا
زخرفة — يُخزَّن الآن وإن كانت لوحته غير مرسومة بعد (G3).`,
    },
  ),
);

export const AdAudience = t.Composite([AdAudiencePlain, AdAudienceRelations], {
  additionalProperties: false,
});

export const AdAudienceInputCreate = t.Composite(
  [AdAudiencePlainInputCreate, AdAudienceRelationsInputCreate],
  { additionalProperties: false },
);

export const AdAudienceInputUpdate = t.Composite(
  [AdAudiencePlainInputUpdate, AdAudienceRelationsInputUpdate],
  { additionalProperties: false },
);
