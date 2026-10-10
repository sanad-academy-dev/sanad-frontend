import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InvoiceMembershipAdjustmentPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    invoiceId: t.String(),
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
    serviceId: __nullable__(t.String()),
    amount: t.Number(),
    unitsConsumed: t.Integer(),
    entitlementId: __nullable__(t.String()),
    periodStart: __nullable__(t.Date()),
    periodEnd: __nullable__(t.Date()),
    consumedAt: __nullable__(t.Date()),
    createdAt: t.Date(),
  },
  {
    additionalProperties: false,
    description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
  },
);

export const InvoiceMembershipAdjustmentRelations = t.Object(
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
    invoice: t.Object(
      {
        id: t.String(),
        code: t.String(),
        clinicId: t.String(),
        appointmentId: __nullable__(t.String()),
        labOrderId: __nullable__(t.String()),
        radiologyOrderId: __nullable__(t.String()),
        operationId: __nullable__(t.String()),
        groomingSessionId: __nullable__(t.String()),
        inpatientStayId: __nullable__(t.String()),
        subtotal: t.Number(),
        vatRate: t.Number(),
        vatAmount: t.Number(),
        taxTemplateId: __nullable__(t.String()),
        discount: t.Number(),
        total: t.Number(),
        amountPaid: t.Number(),
        currencyCode: t.String(),
        membershipId: __nullable__(t.String()),
        insurerShare: __nullable__(t.Number()),
        copayShare: __nullable__(t.Number()),
        status: t.Union(
          [
            t.Literal("PENDING"),
            t.Literal("PARTIAL"),
            t.Literal("PAID"),
            t.Literal("VOIDED"),
            t.Literal("REFUNDED"),
          ],
          { additionalProperties: false },
        ),
        paymentMethod: __nullable__(
          t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
        ),
        paidAt: __nullable__(t.Date()),
        refundedAt: __nullable__(t.Date()),
        refundReason: __nullable__(t.String()),
        refundedById: __nullable__(t.String()),
        stripePaymentIntentId: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
  },
);

export const InvoiceMembershipAdjustmentPlainInputCreate = t.Object(
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
    unitsConsumed: t.Optional(t.Integer()),
    periodStart: t.Optional(__nullable__(t.Date())),
    periodEnd: t.Optional(__nullable__(t.Date())),
    consumedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
  },
);

export const InvoiceMembershipAdjustmentPlainInputUpdate = t.Object(
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
    unitsConsumed: t.Optional(t.Integer()),
    periodStart: t.Optional(__nullable__(t.Date())),
    periodEnd: t.Optional(__nullable__(t.Date())),
    consumedAt: t.Optional(__nullable__(t.Date())),
  },
  {
    additionalProperties: false,
    description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
  },
);

export const InvoiceMembershipAdjustmentRelationsInputCreate = t.Object(
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
    invoice: t.Object(
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
    description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
  },
);

export const InvoiceMembershipAdjustmentRelationsInputUpdate = t.Partial(
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
      invoice: t.Object(
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
      description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
    },
  ),
);

export const InvoiceMembershipAdjustmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          invoiceId: t.String(),
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
          serviceId: t.String(),
          amount: t.Number(),
          unitsConsumed: t.Integer(),
          entitlementId: t.String(),
          periodStart: t.Date(),
          periodEnd: t.Date(),
          consumedAt: t.Date(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
        },
      ),
    { $id: "InvoiceMembershipAdjustment" },
  ),
);

export const InvoiceMembershipAdjustmentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
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
              invoiceId: t.String(),
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
              serviceId: t.String(),
              amount: t.Number(),
              unitsConsumed: t.Integer(),
              entitlementId: t.String(),
              periodStart: t.Date(),
              periodEnd: t.Date(),
              consumedAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InvoiceMembershipAdjustment" },
);

export const InvoiceMembershipAdjustmentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      invoiceId: t.Boolean(),
      idx: t.Boolean(),
      lineRef: t.Boolean(),
      benefitType: t.Boolean(),
      membershipId: t.Boolean(),
      benefitId: t.Boolean(),
      serviceId: t.Boolean(),
      amount: t.Boolean(),
      unitsConsumed: t.Boolean(),
      entitlementId: t.Boolean(),
      periodStart: t.Boolean(),
      periodEnd: t.Boolean(),
      consumedAt: t.Boolean(),
      createdAt: t.Boolean(),
      clinic: t.Boolean(),
      invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
    },
  ),
);

export const InvoiceMembershipAdjustmentInclude = t.Partial(
  t.Object(
    {
      benefitType: t.Boolean(),
      clinic: t.Boolean(),
      invoice: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
    },
  ),
);

export const InvoiceMembershipAdjustmentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      invoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      serviceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitsConsumed: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      entitlementId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodStart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodEnd: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      consumedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `[MI-P2] BR-M6.7 — أثر تسوية العضوية على فاتورة العيادة: صف لكل تخفيض طُبّق على سطر،
بمرجع لقطة الميزة والفترة. المراجع النصية (membershipId/benefitId/entitlementId) بلا
FK عمدًا — سابقة sourceBenefitId: الأثر التدقيقي لا يجوز أن يُجرّ بحذف مصدره.
unitsConsumed هي «نية» الاستهلاك (BR-M5.3.1) — تُلتزم عند PAID بختم consumedAt.`,
    },
  ),
);

export const InvoiceMembershipAdjustment = t.Composite(
  [InvoiceMembershipAdjustmentPlain, InvoiceMembershipAdjustmentRelations],
  { additionalProperties: false },
);

export const InvoiceMembershipAdjustmentInputCreate = t.Composite(
  [
    InvoiceMembershipAdjustmentPlainInputCreate,
    InvoiceMembershipAdjustmentRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const InvoiceMembershipAdjustmentInputUpdate = t.Composite(
  [
    InvoiceMembershipAdjustmentPlainInputUpdate,
    InvoiceMembershipAdjustmentRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
