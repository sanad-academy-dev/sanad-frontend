import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MembershipPlanBenefitPlain = t.Object(
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
);

export const MembershipPlanBenefitRelations = t.Object(
  {
    plan: t.Object(
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
    ),
    service: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          level: t.Union(
            [
              t.Literal("CATEGORY"),
              t.Literal("SUBCATEGORY"),
              t.Literal("ITEM"),
            ],
            { additionalProperties: false },
          ),
          parentId: __nullable__(t.String()),
          isDefault: t.Boolean(),
          clinicId: __nullable__(t.String()),
          order: t.Integer(),
          isLabCategory: t.Boolean(),
          isRadiologyCategory: t.Boolean(),
          isOperationCategory: t.Boolean(),
          isGroomingCategory: t.Boolean(),
          consentCode: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
  },
);

export const MembershipPlanBenefitPlainInputCreate = t.Object(
  {
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
    discountPercent: t.Optional(__nullable__(t.Number())),
    discountAmount: t.Optional(__nullable__(t.Number())),
    unitsPerPeriod: t.Optional(__nullable__(t.Integer())),
    labelAr: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
  },
);

export const MembershipPlanBenefitPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    benefitType: t.Optional(
      t.Union(
        [
          t.Literal("SERVICE_DISCOUNT"),
          t.Literal("PRODUCT_DISCOUNT"),
          t.Literal("INCLUDED_UNITS"),
          t.Literal("PRIORITY_BOOKING"),
          t.Literal("PERK"),
        ],
        { additionalProperties: false },
      ),
    ),
    discountPercent: t.Optional(__nullable__(t.Number())),
    discountAmount: t.Optional(__nullable__(t.Number())),
    unitsPerPeriod: t.Optional(__nullable__(t.Integer())),
    labelAr: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
  },
);

export const MembershipPlanBenefitRelationsInputCreate = t.Object(
  {
    plan: t.Object(
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
    service: t.Optional(
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
    description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
  },
);

export const MembershipPlanBenefitRelationsInputUpdate = t.Partial(
  t.Object(
    {
      plan: t.Object(
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
      service: t.Partial(
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
      description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
    },
  ),
);

export const MembershipPlanBenefitWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          serviceId: t.String(),
          discountPercent: t.Number(),
          discountAmount: t.Number(),
          unitsPerPeriod: t.Integer(),
          labelAr: t.String(),
        },
        {
          additionalProperties: false,
          description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
        },
      ),
    { $id: "MembershipPlanBenefit" },
  ),
);

export const MembershipPlanBenefitWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
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
              serviceId: t.String(),
              discountPercent: t.Number(),
              discountAmount: t.Number(),
              unitsPerPeriod: t.Integer(),
              labelAr: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MembershipPlanBenefit" },
);

export const MembershipPlanBenefitSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      planId: t.Boolean(),
      idx: t.Boolean(),
      benefitType: t.Boolean(),
      serviceId: t.Boolean(),
      discountPercent: t.Boolean(),
      discountAmount: t.Boolean(),
      unitsPerPeriod: t.Boolean(),
      labelAr: t.Boolean(),
      plan: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
    },
  ),
);

export const MembershipPlanBenefitInclude = t.Partial(
  t.Object(
    {
      benefitType: t.Boolean(),
      plan: t.Boolean(),
      service: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
    },
  ),
);

export const MembershipPlanBenefitOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      planId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountPercent: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitsPerPeriod: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      labelAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `صف ميزة — FR-M4.2. قاعدة BR-M4.2.1 (أي الحقول لأي نوع) تُفرَض في الموديل والخدمة؛
القاعدة العلائقية لا تستطيع التعبير عنها.`,
    },
  ),
);

export const MembershipPlanBenefit = t.Composite(
  [MembershipPlanBenefitPlain, MembershipPlanBenefitRelations],
  { additionalProperties: false },
);

export const MembershipPlanBenefitInputCreate = t.Composite(
  [
    MembershipPlanBenefitPlainInputCreate,
    MembershipPlanBenefitRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const MembershipPlanBenefitInputUpdate = t.Composite(
  [
    MembershipPlanBenefitPlainInputUpdate,
    MembershipPlanBenefitRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
