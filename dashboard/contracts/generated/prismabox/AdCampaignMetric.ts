import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdCampaignMetricPlain = t.Object(
  {
    id: t.String(),
    campaignId: t.String(),
    date: t.Date(),
    impressions: t.Integer(),
    reach: t.Integer(),
    engagements: t.Integer(),
    clicks: t.Integer(),
    spend: t.Number(),
  },
  {
    additionalProperties: false,
    description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
  },
);

export const AdCampaignMetricRelations = t.Object(
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
    description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
  },
);

export const AdCampaignMetricPlainInputCreate = t.Object(
  {
    date: t.Date(),
    impressions: t.Optional(t.Integer()),
    reach: t.Optional(t.Integer()),
    engagements: t.Optional(t.Integer()),
    clicks: t.Optional(t.Integer()),
    spend: t.Optional(t.Number()),
  },
  {
    additionalProperties: false,
    description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
  },
);

export const AdCampaignMetricPlainInputUpdate = t.Object(
  {
    date: t.Optional(t.Date()),
    impressions: t.Optional(t.Integer()),
    reach: t.Optional(t.Integer()),
    engagements: t.Optional(t.Integer()),
    clicks: t.Optional(t.Integer()),
    spend: t.Optional(t.Number()),
  },
  {
    additionalProperties: false,
    description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
  },
);

export const AdCampaignMetricRelationsInputCreate = t.Object(
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
    description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
  },
);

export const AdCampaignMetricRelationsInputUpdate = t.Partial(
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
      description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
    },
  ),
);

export const AdCampaignMetricWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          campaignId: t.String(),
          date: t.Date(),
          impressions: t.Integer(),
          reach: t.Integer(),
          engagements: t.Integer(),
          clicks: t.Integer(),
          spend: t.Number(),
        },
        {
          additionalProperties: false,
          description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
        },
      ),
    { $id: "AdCampaignMetric" },
  ),
);

export const AdCampaignMetricWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              campaignId_date: t.Object(
                { campaignId: t.String(), date: t.Date() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              campaignId_date: t.Object(
                { campaignId: t.String(), date: t.Date() },
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
              campaignId: t.String(),
              date: t.Date(),
              impressions: t.Integer(),
              reach: t.Integer(),
              engagements: t.Integer(),
              clicks: t.Integer(),
              spend: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AdCampaignMetric" },
);

export const AdCampaignMetricSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      campaignId: t.Boolean(),
      date: t.Boolean(),
      impressions: t.Boolean(),
      reach: t.Boolean(),
      engagements: t.Boolean(),
      clicks: t.Boolean(),
      spend: t.Boolean(),
      campaign: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
    },
  ),
);

export const AdCampaignMetricInclude = t.Partial(
  t.Object(
    { campaign: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
    },
  ),
);

export const AdCampaignMetricOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      campaignId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      date: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      impressions: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reach: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      engagements: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clicks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      spend: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
    },
  ),
);

export const AdCampaignMetric = t.Composite(
  [AdCampaignMetricPlain, AdCampaignMetricRelations],
  { additionalProperties: false },
);

export const AdCampaignMetricInputCreate = t.Composite(
  [AdCampaignMetricPlainInputCreate, AdCampaignMetricRelationsInputCreate],
  { additionalProperties: false },
);

export const AdCampaignMetricInputUpdate = t.Composite(
  [AdCampaignMetricPlainInputUpdate, AdCampaignMetricRelationsInputUpdate],
  { additionalProperties: false },
);
