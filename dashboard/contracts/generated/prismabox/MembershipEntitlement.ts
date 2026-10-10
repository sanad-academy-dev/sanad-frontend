import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MembershipEntitlementPlain = t.Object(
  {
    id: t.String(),
    membershipId: t.String(),
    benefitId: t.String(),
    periodStart: t.Date(),
    periodEnd: t.Date(),
    unitsGranted: t.Integer(),
    unitsConsumed: t.Integer(),
  },
  {
    additionalProperties: false,
    description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
  },
);

export const MembershipEntitlementRelations = t.Object(
  {
    membership: t.Object(
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
    benefit: t.Object(
      {
        id: t.String(),
        membershipId: t.String(),
        sourceBenefitId: __nullable__(t.String()),
        idx: t.Integer(),
        supersededAt: __nullable__(
          t.Date({
            description: `BR-M5.4.1: عند تدوير الفترة تُنشأ لقطات جديدة ويُختم القديم هنا بدل حذفه —
الحذف كان سيجرّ استحقاقات الفترات الماضية معه (cascade). null = اللقطة الحالية.`,
          }),
        ),
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
        description: `لقطة ميزة (AR-M2) — نسخة صفوف الخطة وقت التسجيل/التدوير. sourceBenefitId مرجع
معلوماتي فقط (لا FK — صف الخطة قد يُحذف باستبدال كامل ولا يجوز أن يجرّ اللقطة).`,
      },
    ),
  },
  {
    additionalProperties: false,
    description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
  },
);

export const MembershipEntitlementPlainInputCreate = t.Object(
  {
    periodStart: t.Date(),
    periodEnd: t.Date(),
    unitsGranted: t.Integer(),
    unitsConsumed: t.Optional(t.Integer()),
  },
  {
    additionalProperties: false,
    description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
  },
);

export const MembershipEntitlementPlainInputUpdate = t.Object(
  {
    periodStart: t.Optional(t.Date()),
    periodEnd: t.Optional(t.Date()),
    unitsGranted: t.Optional(t.Integer()),
    unitsConsumed: t.Optional(t.Integer()),
  },
  {
    additionalProperties: false,
    description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
  },
);

export const MembershipEntitlementRelationsInputCreate = t.Object(
  {
    membership: t.Object(
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
    benefit: t.Object(
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
    description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
  },
);

export const MembershipEntitlementRelationsInputUpdate = t.Partial(
  t.Object(
    {
      membership: t.Object(
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
      benefit: t.Object(
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
      description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
    },
  ),
);

export const MembershipEntitlementWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          membershipId: t.String(),
          benefitId: t.String(),
          periodStart: t.Date(),
          periodEnd: t.Date(),
          unitsGranted: t.Integer(),
          unitsConsumed: t.Integer(),
        },
        {
          additionalProperties: false,
          description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
        },
      ),
    { $id: "MembershipEntitlement" },
  ),
);

export const MembershipEntitlementWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              membershipId_benefitId_periodStart: t.Object(
                {
                  membershipId: t.String(),
                  benefitId: t.String(),
                  periodStart: t.Date(),
                },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              membershipId_benefitId_periodStart: t.Object(
                {
                  membershipId: t.String(),
                  benefitId: t.String(),
                  periodStart: t.Date(),
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
              membershipId: t.String(),
              benefitId: t.String(),
              periodStart: t.Date(),
              periodEnd: t.Date(),
              unitsGranted: t.Integer(),
              unitsConsumed: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MembershipEntitlement" },
);

export const MembershipEntitlementSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      membershipId: t.Boolean(),
      benefitId: t.Boolean(),
      periodStart: t.Boolean(),
      periodEnd: t.Boolean(),
      unitsGranted: t.Boolean(),
      unitsConsumed: t.Boolean(),
      membership: t.Boolean(),
      benefit: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
    },
  ),
);

export const MembershipEntitlementInclude = t.Partial(
  t.Object(
    { membership: t.Boolean(), benefit: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
    },
  ),
);

export const MembershipEntitlementOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      membershipId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      benefitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodStart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodEnd: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitsGranted: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitsConsumed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
    },
  ),
);

export const MembershipEntitlement = t.Composite(
  [MembershipEntitlementPlain, MembershipEntitlementRelations],
  { additionalProperties: false },
);

export const MembershipEntitlementInputCreate = t.Composite(
  [
    MembershipEntitlementPlainInputCreate,
    MembershipEntitlementRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const MembershipEntitlementInputUpdate = t.Composite(
  [
    MembershipEntitlementPlainInputUpdate,
    MembershipEntitlementRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
