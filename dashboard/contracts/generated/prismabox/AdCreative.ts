import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdCreativePlain = t.Object(
  {
    id: t.String(),
    campaignId: t.String(),
    primaryText: t.String(),
    headline: __nullable__(t.String()),
    description: __nullable__(t.String()),
    linkUrl: __nullable__(t.String()),
    imageUrl: __nullable__(t.String()),
    source: t.Union(
      [
        t.Literal("AI_GENERATED"),
        t.Literal("LIBRARY"),
        t.Literal("UPLOAD"),
        t.Literal("TEMPLATE"),
      ],
      { additionalProperties: false },
    ),
    aiPrompt: __nullable__(t.String()),
    aiStyle: __nullable__(t.String()),
    toneFormal: __nullable__(t.Integer()),
    toneFriendly: __nullable__(t.Integer()),
    toneOptimist: __nullable__(t.Integer()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
  },
);

export const AdCreativeRelations = t.Object(
  {
    campaign: t.Object(
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
  },
  {
    additionalProperties: false,
    description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
  },
);

export const AdCreativePlainInputCreate = t.Object(
  {
    primaryText: t.String(),
    headline: t.Optional(__nullable__(t.String())),
    description: t.Optional(__nullable__(t.String())),
    linkUrl: t.Optional(__nullable__(t.String())),
    imageUrl: t.Optional(__nullable__(t.String())),
    source: t.Union(
      [
        t.Literal("AI_GENERATED"),
        t.Literal("LIBRARY"),
        t.Literal("UPLOAD"),
        t.Literal("TEMPLATE"),
      ],
      { additionalProperties: false },
    ),
    aiPrompt: t.Optional(__nullable__(t.String())),
    aiStyle: t.Optional(__nullable__(t.String())),
    toneFormal: t.Optional(__nullable__(t.Integer())),
    toneFriendly: t.Optional(__nullable__(t.Integer())),
    toneOptimist: t.Optional(__nullable__(t.Integer())),
  },
  {
    additionalProperties: false,
    description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
  },
);

export const AdCreativePlainInputUpdate = t.Object(
  {
    primaryText: t.Optional(t.String()),
    headline: t.Optional(__nullable__(t.String())),
    description: t.Optional(__nullable__(t.String())),
    linkUrl: t.Optional(__nullable__(t.String())),
    imageUrl: t.Optional(__nullable__(t.String())),
    source: t.Optional(
      t.Union(
        [
          t.Literal("AI_GENERATED"),
          t.Literal("LIBRARY"),
          t.Literal("UPLOAD"),
          t.Literal("TEMPLATE"),
        ],
        { additionalProperties: false },
      ),
    ),
    aiPrompt: t.Optional(__nullable__(t.String())),
    aiStyle: t.Optional(__nullable__(t.String())),
    toneFormal: t.Optional(__nullable__(t.Integer())),
    toneFriendly: t.Optional(__nullable__(t.Integer())),
    toneOptimist: t.Optional(__nullable__(t.Integer())),
  },
  {
    additionalProperties: false,
    description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
  },
);

export const AdCreativeRelationsInputCreate = t.Object(
  {
    campaign: t.Object(
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
    description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
  },
);

export const AdCreativeRelationsInputUpdate = t.Partial(
  t.Object(
    {
      campaign: t.Object(
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
      description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
    },
  ),
);

export const AdCreativeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          campaignId: t.String(),
          primaryText: t.String(),
          headline: t.String(),
          description: t.String(),
          linkUrl: t.String(),
          imageUrl: t.String(),
          source: t.Union(
            [
              t.Literal("AI_GENERATED"),
              t.Literal("LIBRARY"),
              t.Literal("UPLOAD"),
              t.Literal("TEMPLATE"),
            ],
            { additionalProperties: false },
          ),
          aiPrompt: t.String(),
          aiStyle: t.String(),
          toneFormal: t.Integer(),
          toneFriendly: t.Integer(),
          toneOptimist: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
        },
      ),
    { $id: "AdCreative" },
  ),
);

export const AdCreativeWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
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
              campaignId: t.String(),
              primaryText: t.String(),
              headline: t.String(),
              description: t.String(),
              linkUrl: t.String(),
              imageUrl: t.String(),
              source: t.Union(
                [
                  t.Literal("AI_GENERATED"),
                  t.Literal("LIBRARY"),
                  t.Literal("UPLOAD"),
                  t.Literal("TEMPLATE"),
                ],
                { additionalProperties: false },
              ),
              aiPrompt: t.String(),
              aiStyle: t.String(),
              toneFormal: t.Integer(),
              toneFriendly: t.Integer(),
              toneOptimist: t.Integer(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AdCreative" },
);

export const AdCreativeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      campaignId: t.Boolean(),
      primaryText: t.Boolean(),
      headline: t.Boolean(),
      description: t.Boolean(),
      linkUrl: t.Boolean(),
      imageUrl: t.Boolean(),
      source: t.Boolean(),
      aiPrompt: t.Boolean(),
      aiStyle: t.Boolean(),
      toneFormal: t.Boolean(),
      toneFriendly: t.Boolean(),
      toneOptimist: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      campaign: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
    },
  ),
);

export const AdCreativeInclude = t.Partial(
  t.Object(
    { source: t.Boolean(), campaign: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
    },
  ),
);

export const AdCreativeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      campaignId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      primaryText: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      headline: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      linkUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      imageUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      aiPrompt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      aiStyle: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toneFormal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toneFriendly: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      toneOptimist: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `نصّ الإعلان وصورته. مفصولة عن الحملة لأن الاختلافات (variants) قادمة، ولأن
إعادة توليد الصورة تستبدل السجل ولا تلمس الحملة.`,
    },
  ),
);

export const AdCreative = t.Composite([AdCreativePlain, AdCreativeRelations], {
  additionalProperties: false,
});

export const AdCreativeInputCreate = t.Composite(
  [AdCreativePlainInputCreate, AdCreativeRelationsInputCreate],
  { additionalProperties: false },
);

export const AdCreativeInputUpdate = t.Composite(
  [AdCreativePlainInputUpdate, AdCreativeRelationsInputUpdate],
  { additionalProperties: false },
);
