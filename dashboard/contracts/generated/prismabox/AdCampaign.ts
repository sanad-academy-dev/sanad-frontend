import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdCampaignPlain = t.Object(
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
);

export const AdCampaignRelations = t.Object(
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
    branch: __nullable__(
      t.Object(
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
    ),
    socialAccount: __nullable__(
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
          accessToken: __nullable__(t.String()),
          connectedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `حساب/صفحة منصّة مرتبطة بالعيادة. \`accessToken\` يبقى فارغًا تحت D1 — لا رمز
وصول يُطلب ما دمنا لا ننشر نيابةً عن أحد.`,
        },
      ),
    ),
    audience: __nullable__(
      t.Object(
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
      ),
    ),
    creatives: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    metrics: t.Array(
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
        {
          additionalProperties: false,
          description: `أداء الحملة — صفّ واحد لكل حملة لكل يوم. تحت D1 تُدخَل يدويًّا أو تُستورد،
لا تُسحب مباشرة من المنصّة. القيد الفريد يجعل الاستيراد قابلًا للتكرار.`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
  },
);

export const AdCampaignPlainInputCreate = t.Object(
  {
    code: t.String(),
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
    status: t.Optional(
      t.Union(
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
    ),
    startsAt: t.Optional(__nullable__(t.Date())),
    endsAt: t.Optional(__nullable__(t.Date())),
    durationDays: t.Optional(__nullable__(t.Integer())),
    budgetAmount: t.Optional(__nullable__(t.Number())),
    budgetKind: t.Optional(
      __nullable__(
        t.Union([t.Literal("DAILY"), t.Literal("LIFETIME")], {
          additionalProperties: false,
        }),
      ),
    ),
    currency: t.Optional(t.String()),
    feeAmount: t.Optional(__nullable__(t.Number())),
    totalAmount: t.Optional(__nullable__(t.Number())),
    externalError: t.Optional(__nullable__(t.String())),
    launchedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
  },
);

export const AdCampaignPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
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
    objective: t.Optional(
      t.Union(
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
    ),
    status: t.Optional(
      t.Union(
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
    ),
    startsAt: t.Optional(__nullable__(t.Date())),
    endsAt: t.Optional(__nullable__(t.Date())),
    durationDays: t.Optional(__nullable__(t.Integer())),
    budgetAmount: t.Optional(__nullable__(t.Number())),
    budgetKind: t.Optional(
      __nullable__(
        t.Union([t.Literal("DAILY"), t.Literal("LIFETIME")], {
          additionalProperties: false,
        }),
      ),
    ),
    currency: t.Optional(t.String()),
    feeAmount: t.Optional(__nullable__(t.Number())),
    totalAmount: t.Optional(__nullable__(t.Number())),
    externalError: t.Optional(__nullable__(t.String())),
    launchedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
  },
);

export const AdCampaignRelationsInputCreate = t.Object(
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
    branch: t.Optional(
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
    socialAccount: t.Optional(
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
    audience: t.Optional(
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
    creatives: t.Optional(
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
    metrics: t.Optional(
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
    description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
  },
);

export const AdCampaignRelationsInputUpdate = t.Partial(
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
      branch: t.Partial(
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
      socialAccount: t.Partial(
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
      audience: t.Partial(
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
      creatives: t.Partial(
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
      metrics: t.Partial(
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
      description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
    },
  ),
);

export const AdCampaignWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          branchId: t.String(),
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
          socialAccountId: t.String(),
          audienceId: t.String(),
          startsAt: t.Date(),
          endsAt: t.Date(),
          durationDays: t.Integer(),
          budgetAmount: t.Number(),
          budgetKind: t.Union([t.Literal("DAILY"), t.Literal("LIFETIME")], {
            additionalProperties: false,
          }),
          currency: t.String(),
          feeAmount: t.Number(),
          totalAmount: t.Number(),
          externalId: t.String(),
          externalError: t.String(),
          launchedAt: t.Date(),
          createdByUserId: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
        },
      ),
    { $id: "AdCampaign" },
  ),
);

export const AdCampaignWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            {
              additionalProperties: false,
              description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ code: t.String() })],
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
              code: t.String(),
              clinicId: t.String(),
              branchId: t.String(),
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
              socialAccountId: t.String(),
              audienceId: t.String(),
              startsAt: t.Date(),
              endsAt: t.Date(),
              durationDays: t.Integer(),
              budgetAmount: t.Number(),
              budgetKind: t.Union([t.Literal("DAILY"), t.Literal("LIFETIME")], {
                additionalProperties: false,
              }),
              currency: t.String(),
              feeAmount: t.Number(),
              totalAmount: t.Number(),
              externalId: t.String(),
              externalError: t.String(),
              launchedAt: t.Date(),
              createdByUserId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AdCampaign" },
);

export const AdCampaignSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      branchId: t.Boolean(),
      name: t.Boolean(),
      platform: t.Boolean(),
      objective: t.Boolean(),
      status: t.Boolean(),
      socialAccountId: t.Boolean(),
      audienceId: t.Boolean(),
      startsAt: t.Boolean(),
      endsAt: t.Boolean(),
      durationDays: t.Boolean(),
      budgetAmount: t.Boolean(),
      budgetKind: t.Boolean(),
      currency: t.Boolean(),
      feeAmount: t.Boolean(),
      totalAmount: t.Boolean(),
      externalId: t.Boolean(),
      externalError: t.Boolean(),
      launchedAt: t.Boolean(),
      createdByUserId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      socialAccount: t.Boolean(),
      audience: t.Boolean(),
      creatives: t.Boolean(),
      metrics: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
    },
  ),
);

export const AdCampaignInclude = t.Partial(
  t.Object(
    {
      platform: t.Boolean(),
      objective: t.Boolean(),
      status: t.Boolean(),
      budgetKind: t.Boolean(),
      clinic: t.Boolean(),
      branch: t.Boolean(),
      socialAccount: t.Boolean(),
      audience: t.Boolean(),
      creatives: t.Boolean(),
      metrics: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
    },
  ),
);

export const AdCampaignOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      branchId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      socialAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      audienceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startsAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endsAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      durationDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      budgetAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      feeAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      externalId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      externalError: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      launchedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdByUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `الحملة الاعلانية — الكيان الجذر. تبقى \`DRAFT\` حتى الإطلاق، وتحت D1 لا يترتّب
على الإطلاق أيّ إنفاق داخل النظام.`,
    },
  ),
);

export const AdCampaign = t.Composite([AdCampaignPlain, AdCampaignRelations], {
  additionalProperties: false,
});

export const AdCampaignInputCreate = t.Composite(
  [AdCampaignPlainInputCreate, AdCampaignRelationsInputCreate],
  { additionalProperties: false },
);

export const AdCampaignInputUpdate = t.Composite(
  [AdCampaignPlainInputUpdate, AdCampaignRelationsInputUpdate],
  { additionalProperties: false },
);
