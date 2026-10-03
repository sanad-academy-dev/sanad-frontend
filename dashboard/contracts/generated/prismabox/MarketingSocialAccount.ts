import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MarketingSocialAccountPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
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
    externalId: t.String(),
    name: t.String(),
    accessToken: __nullable__(t.String()),
    connectedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
  },
);

export const MarketingSocialAccountRelations = t.Object(
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
    description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
  },
);

export const MarketingSocialAccountPlainInputCreate = t.Object(
  {
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
    name: t.String(),
    accessToken: t.Optional(__nullable__(t.String())),
    connectedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
  },
);

export const MarketingSocialAccountPlainInputUpdate = t.Object(
  {
    platform: t.Optional(
      t.Union(
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
    ),
    name: t.Optional(t.String()),
    accessToken: t.Optional(__nullable__(t.String())),
    connectedAt: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
  },
);

export const MarketingSocialAccountRelationsInputCreate = t.Object(
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
    description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
  },
);

export const MarketingSocialAccountRelationsInputUpdate = t.Partial(
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
      description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
    },
  ),
);

export const MarketingSocialAccountWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
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
          externalId: t.String(),
          name: t.String(),
          accessToken: t.String(),
          connectedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
        },
      ),
    { $id: "MarketingSocialAccount" },
  ),
);

export const MarketingSocialAccountWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_platform_externalId: t.Object(
                {
                  clinicId: t.String(),
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
                  externalId: t.String(),
                },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              clinicId_platform_externalId: t.Object(
                {
                  clinicId: t.String(),
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
                  externalId: t.String(),
                },
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
              externalId: t.String(),
              name: t.String(),
              accessToken: t.String(),
              connectedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MarketingSocialAccount" },
);

export const MarketingSocialAccountSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      platform: t.Boolean(),
      externalId: t.Boolean(),
      name: t.Boolean(),
      accessToken: t.Boolean(),
      connectedAt: t.Boolean(),
      clinic: t.Boolean(),
      campaigns: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
    },
  ),
);

export const MarketingSocialAccountInclude = t.Partial(
  t.Object(
    {
      platform: t.Boolean(),
      clinic: t.Boolean(),
      campaigns: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
    },
  ),
);

export const MarketingSocialAccountOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      externalId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accessToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      connectedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
    },
  ),
);

export const MarketingSocialAccount = t.Composite(
  [MarketingSocialAccountPlain, MarketingSocialAccountRelations],
  { additionalProperties: false },
);

export const MarketingSocialAccountInputCreate = t.Composite(
  [
    MarketingSocialAccountPlainInputCreate,
    MarketingSocialAccountRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const MarketingSocialAccountInputUpdate = t.Composite(
  [
    MarketingSocialAccountPlainInputUpdate,
    MarketingSocialAccountRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
