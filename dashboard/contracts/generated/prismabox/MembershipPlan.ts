import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MembershipPlanPlain = t.Object(
  {
    id: t.String(),
    code: t.String(),
    clinicId: t.String(),
    name: t.String(),
    description: __nullable__(t.String()),
    tierRank: t.Integer(),
    billingInterval: t.Union(
      [
        t.Literal("DAY"),
        t.Literal("WEEK"),
        t.Literal("MONTH"),
        t.Literal("YEAR"),
      ],
      { additionalProperties: false },
    ),
    intervalCount: t.Integer(),
    fee: t.Number(),
    enrollmentFee: t.Number(),
    deferRevenue: t.Boolean(),
    maxPatients: __nullable__(t.Integer()),
    autoRenew: t.Boolean(),
    graceDays: t.Integer(),
    status: t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
      additionalProperties: false,
    }),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
  },
);

export const MembershipPlanRelations = t.Object(
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
    benefits: t.Array(
      t.Object(
        {
          id: t.String(),
          planId: t.String(),
          idx: t.Integer(),
          benefitType: t.Union(
            [
              t.Literal("SERVICE_DISCOUNT"),
              t.Literal("PRODUCT_DISCOUNT"),
              t.Literal("INCLUDED_UNITS"),
              t.Literal("PRIORITY_BOOKING"),
              t.Literal("PERK"),
            ],
            { additionalProperties: false },
          ),
          serviceId: __nullable__(t.String()),
          discountPercent: __nullable__(t.Number()),
          discountAmount: __nullable__(t.Number()),
          unitsPerPeriod: __nullable__(t.Integer()),
          labelAr: __nullable__(t.String()),
        },
        {
          additionalProperties: false,
          description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
        },
      ),
      { additionalProperties: false },
    ),
    memberships: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          planId: t.String(),
          subscriptionId: t.String({
            description: `الاشتراك المحاسبي الحامل للفوترة (MI-C2) — واحد لواحد`,
          }),
          status: t.Union(
            [
              t.Literal("PENDING_PAYMENT"),
              t.Literal("ACTIVE"),
              t.Literal("PAST_DUE"),
              t.Literal("LAPSED"),
              t.Literal("CANCELLED"),
              t.Literal("EXPIRED"),
            ],
            {
              additionalProperties: false,
              description: `§5.2 — CANCELLED وEXPIRED نهائيتان دومًا؛ LAPSED نهائية بعد انقضاء فترتها فقط
(قرار المالك MI-P1 س5: داخل الفترة تبقى غير نهائية لأنها قابلة للإحياء بالدفع).`,
            },
          ),
          currentPeriodStart: t.Date(),
          currentPeriodEnd: t.Date(),
          feeSnapshot: t.Number(),
          intervalSnapshot: t.Union(
            [
              t.Literal("DAY"),
              t.Literal("WEEK"),
              t.Literal("MONTH"),
              t.Literal("YEAR"),
            ],
            { additionalProperties: false },
          ),
          intervalCountSnapshot: t.Integer(),
          graceDaysSnapshot: t.Integer(),
          autoRenewSnapshot: t.Boolean(),
          scheduledPlanId: __nullable__(
            t.String({
              description: `BR-M5.4.2: تبديل الخطة المجدول — يُطبَّق عند التدوير التالي ثم يُصفَّر`,
            }),
          ),
          cancelledAt: __nullable__(t.Date()),
          cancelReason: __nullable__(t.String()),
          cancelledByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
        },
      ),
      { additionalProperties: false },
    ),
    scheduledMemberships: t.Array(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          ownerId: t.String(),
          planId: t.String(),
          subscriptionId: t.String({
            description: `الاشتراك المحاسبي الحامل للفوترة (MI-C2) — واحد لواحد`,
          }),
          status: t.Union(
            [
              t.Literal("PENDING_PAYMENT"),
              t.Literal("ACTIVE"),
              t.Literal("PAST_DUE"),
              t.Literal("LAPSED"),
              t.Literal("CANCELLED"),
              t.Literal("EXPIRED"),
            ],
            {
              additionalProperties: false,
              description: `§5.2 — CANCELLED وEXPIRED نهائيتان دومًا؛ LAPSED نهائية بعد انقضاء فترتها فقط
(قرار المالك MI-P1 س5: داخل الفترة تبقى غير نهائية لأنها قابلة للإحياء بالدفع).`,
            },
          ),
          currentPeriodStart: t.Date(),
          currentPeriodEnd: t.Date(),
          feeSnapshot: t.Number(),
          intervalSnapshot: t.Union(
            [
              t.Literal("DAY"),
              t.Literal("WEEK"),
              t.Literal("MONTH"),
              t.Literal("YEAR"),
            ],
            { additionalProperties: false },
          ),
          intervalCountSnapshot: t.Integer(),
          graceDaysSnapshot: t.Integer(),
          autoRenewSnapshot: t.Boolean(),
          scheduledPlanId: __nullable__(
            t.String({
              description: `BR-M5.4.2: تبديل الخطة المجدول — يُطبَّق عند التدوير التالي ثم يُصفَّر`,
            }),
          ),
          cancelledAt: __nullable__(t.Date()),
          cancelReason: __nullable__(t.String()),
          cancelledByUserId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
  },
);

export const MembershipPlanPlainInputCreate = t.Object(
  {
    code: t.String(),
    name: t.String(),
    description: t.Optional(__nullable__(t.String())),
    tierRank: t.Optional(t.Integer()),
    billingInterval: t.Optional(
      t.Union(
        [
          t.Literal("DAY"),
          t.Literal("WEEK"),
          t.Literal("MONTH"),
          t.Literal("YEAR"),
        ],
        { additionalProperties: false },
      ),
    ),
    intervalCount: t.Optional(t.Integer()),
    fee: t.Number(),
    enrollmentFee: t.Optional(t.Number()),
    deferRevenue: t.Optional(t.Boolean()),
    maxPatients: t.Optional(__nullable__(t.Integer())),
    autoRenew: t.Optional(t.Boolean()),
    graceDays: t.Optional(t.Integer()),
    status: t.Optional(
      t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
        additionalProperties: false,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
  },
);

export const MembershipPlanPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    name: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    tierRank: t.Optional(t.Integer()),
    billingInterval: t.Optional(
      t.Union(
        [
          t.Literal("DAY"),
          t.Literal("WEEK"),
          t.Literal("MONTH"),
          t.Literal("YEAR"),
        ],
        { additionalProperties: false },
      ),
    ),
    intervalCount: t.Optional(t.Integer()),
    fee: t.Optional(t.Number()),
    enrollmentFee: t.Optional(t.Number()),
    deferRevenue: t.Optional(t.Boolean()),
    maxPatients: t.Optional(__nullable__(t.Integer())),
    autoRenew: t.Optional(t.Boolean()),
    graceDays: t.Optional(t.Integer()),
    status: t.Optional(
      t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
        additionalProperties: false,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
  },
);

export const MembershipPlanRelationsInputCreate = t.Object(
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
    benefits: t.Optional(
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
    memberships: t.Optional(
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
    scheduledMemberships: t.Optional(
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
    description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
  },
);

export const MembershipPlanRelationsInputUpdate = t.Partial(
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
      benefits: t.Partial(
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
      memberships: t.Partial(
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
      scheduledMemberships: t.Partial(
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
      description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
    },
  ),
);

export const MembershipPlanWhere = t.Partial(
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
          name: t.String(),
          description: t.String(),
          tierRank: t.Integer(),
          billingInterval: t.Union(
            [
              t.Literal("DAY"),
              t.Literal("WEEK"),
              t.Literal("MONTH"),
              t.Literal("YEAR"),
            ],
            { additionalProperties: false },
          ),
          intervalCount: t.Integer(),
          fee: t.Number(),
          enrollmentFee: t.Number(),
          deferRevenue: t.Boolean(),
          maxPatients: t.Integer(),
          autoRenew: t.Boolean(),
          graceDays: t.Integer(),
          status: t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
            additionalProperties: false,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
        },
      ),
    { $id: "MembershipPlan" },
  ),
);

export const MembershipPlanWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            {
              additionalProperties: false,
              description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
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
              name: t.String(),
              description: t.String(),
              tierRank: t.Integer(),
              billingInterval: t.Union(
                [
                  t.Literal("DAY"),
                  t.Literal("WEEK"),
                  t.Literal("MONTH"),
                  t.Literal("YEAR"),
                ],
                { additionalProperties: false },
              ),
              intervalCount: t.Integer(),
              fee: t.Number(),
              enrollmentFee: t.Number(),
              deferRevenue: t.Boolean(),
              maxPatients: t.Integer(),
              autoRenew: t.Boolean(),
              graceDays: t.Integer(),
              status: t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")], {
                additionalProperties: false,
              }),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MembershipPlan" },
);

export const MembershipPlanSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      name: t.Boolean(),
      description: t.Boolean(),
      tierRank: t.Boolean(),
      billingInterval: t.Boolean(),
      intervalCount: t.Boolean(),
      fee: t.Boolean(),
      enrollmentFee: t.Boolean(),
      deferRevenue: t.Boolean(),
      maxPatients: t.Boolean(),
      autoRenew: t.Boolean(),
      graceDays: t.Boolean(),
      status: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      benefits: t.Boolean(),
      memberships: t.Boolean(),
      scheduledMemberships: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
    },
  ),
);

export const MembershipPlanInclude = t.Partial(
  t.Object(
    {
      billingInterval: t.Boolean(),
      status: t.Boolean(),
      clinic: t.Boolean(),
      benefits: t.Boolean(),
      memberships: t.Boolean(),
      scheduledMemberships: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
    },
  ),
);

export const MembershipPlanOrderBy = t.Partial(
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
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tierRank: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      intervalCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fee: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enrollmentFee: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deferRevenue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxPatients: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      autoRenew: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      graceDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `خطة العضوية — FR-M4.1. billingInterval يعيد استخدام SubscriptionInterval قصدًا
(لا union نصي — قاعدة الأنواع)، ويُقصَر على MONTH|YEAR في طبقتي الموديل والخدمة.`,
    },
  ),
);

export const MembershipPlan = t.Composite(
  [MembershipPlanPlain, MembershipPlanRelations],
  { additionalProperties: false },
);

export const MembershipPlanInputCreate = t.Composite(
  [MembershipPlanPlainInputCreate, MembershipPlanRelationsInputCreate],
  { additionalProperties: false },
);

export const MembershipPlanInputUpdate = t.Composite(
  [MembershipPlanPlainInputUpdate, MembershipPlanRelationsInputUpdate],
  { additionalProperties: false },
);
