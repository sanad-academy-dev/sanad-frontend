import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SaleMembershipAdjustmentPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    saleId: t.String(),
    idx: t.Integer(),
    lineRef: t.String(),
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
    membershipId: t.String(),
    benefitId: t.String(),
    amount: t.Number(),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
  },
);

export const SaleMembershipAdjustmentRelations = t.Object(
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
    sale: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        status: t.Union(
          [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("REFUNDED")],
          { additionalProperties: false },
        ),
        subtotal: t.Number(),
        discount: t.Number(),
        discountCode: __nullable__(t.String()),
        netTotal: t.Number(),
        taxRate: t.Number(),
        taxAmount: t.Number(),
        total: t.Number(),
        taxTemplateId: __nullable__(t.String()),
        cogsAmount: t.Number(),
        paymentMethod: t.Union(
          [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
          { additionalProperties: false },
        ),
        createdById: __nullable__(t.String()),
        posOpeningEntryId: __nullable__(t.String()),
        membershipId: __nullable__(t.String()),
        customerName: __nullable__(t.String()),
        customerPhone: __nullable__(t.String()),
        ownerId: __nullable__(
          t.String({
            description: `[LY-P1] المالك المختار على الكاشير — يُحفظ الآن بعد أن كان يُمرَّر للتسعير ويُرمى.
\`partyId\` كان يصل \`priceSale\` (قالب الضريبة) و\`membership.ownerId\` (خصم العضوية)
ثمّ لا يُكتب في أيّ عمود، فبيعٌ لمالكٍ غير عضو كان يفقد هويّته تمامًا. وذلك يجعل
كسب النقاط على نقطة البيع مستحيلًا (BR-L5.2 «نفس القاعدة بلا بُعد تأمين»)،
والاستبدال في LY-P2 كذلك (BR-L6.5 يشترط طرفًا مربوطًا). §17.2 صفّ ٧.
\`SetNull\` لا \`Cascade\`: حذف مالكٍ لا يجوز أن يمحو بيعًا — البيع واقعةٌ محاسبية.`,
          }),
        ),
        notes: __nullable__(t.String()),
        paidAt: __nullable__(t.Date()),
        fulfillment: t.Union(
          [t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")],
          { additionalProperties: false },
        ),
        dispensedAt: __nullable__(t.Date()),
        dispensedById: __nullable__(t.String()),
        refundedAt: __nullable__(t.Date()),
        refundReason: __nullable__(t.String()),
        refundedById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
  },
);

export const SaleMembershipAdjustmentPlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    lineRef: t.String(),
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
    amount: t.Number(),
  },
  {
    additionalProperties: false,
    description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
  },
);

export const SaleMembershipAdjustmentPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    lineRef: t.Optional(t.String()),
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
    amount: t.Optional(t.Number()),
  },
  {
    additionalProperties: false,
    description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
  },
);

export const SaleMembershipAdjustmentRelationsInputCreate = t.Object(
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
    sale: t.Object(
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
    description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
  },
);

export const SaleMembershipAdjustmentRelationsInputUpdate = t.Partial(
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
      sale: t.Object(
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
      description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
    },
  ),
);

export const SaleMembershipAdjustmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          saleId: t.String(),
          idx: t.Integer(),
          lineRef: t.String(),
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
          membershipId: t.String(),
          benefitId: t.String(),
          amount: t.Number(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
        },
      ),
    { $id: "SaleMembershipAdjustment" },
  ),
);

export const SaleMembershipAdjustmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
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
              saleId: t.String(),
              idx: t.Integer(),
              lineRef: t.String(),
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
              membershipId: t.String(),
              benefitId: t.String(),
              amount: t.Number(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SaleMembershipAdjustment" },
);

export const SaleMembershipAdjustmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      saleId: t.Boolean(),
      idx: t.Boolean(),
      lineRef: t.Boolean(),
      benefitType: t.Boolean(),
      membershipId: t.Boolean(),
      benefitId: t.Boolean(),
      amount: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      sale: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
    },
  ),
);

export const SaleMembershipAdjustmentInclude = t.Partial(
  t.Object(
    {
      benefitType: t.Boolean(),
      clinic: t.Boolean(),
      sale: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
    },
  ),
);

export const SaleMembershipAdjustmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      saleId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lineRef: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      membershipId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      benefitId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
    },
  ),
);

export const SaleMembershipAdjustment = t.Composite(
  [SaleMembershipAdjustmentPlain, SaleMembershipAdjustmentRelations],
  { additionalProperties: false },
);

export const SaleMembershipAdjustmentInputCreate = t.Composite(
  [
    SaleMembershipAdjustmentPlainInputCreate,
    SaleMembershipAdjustmentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const SaleMembershipAdjustmentInputUpdate = t.Composite(
  [
    SaleMembershipAdjustmentPlainInputUpdate,
    SaleMembershipAdjustmentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
