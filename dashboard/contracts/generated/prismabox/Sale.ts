import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SalePlain = t.Object(
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
    fulfillment: t.Union([t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")], {
      additionalProperties: false,
    }),
    dispensedAt: __nullable__(t.Date()),
    dispensedById: __nullable__(t.String()),
    refundedAt: __nullable__(t.Date()),
    refundReason: __nullable__(t.String()),
    refundedById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const SaleRelations = t.Object(
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
    owner: __nullable__(
      t.Object(
        {
          id: t.String(),
          code: t.String(),
          clinicId: t.String(),
          name: t.String(),
          phone: t.String(),
          phoneE164: __nullable__(t.String()),
          email: __nullable__(t.String()),
          gender: __nullable__(
            t.Union(
              [t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")],
              { additionalProperties: false },
            ),
          ),
          ownerType: t.Union(
            [
              t.Literal("ALL"),
              t.Literal("VIP"),
              t.Literal("LOYALTY"),
              t.Literal("NEW"),
              t.Literal("CURRENT"),
            ],
            { additionalProperties: false },
          ),
          relationship: __nullable__(
            t.Union(
              [
                t.Literal("OWNER"),
                t.Literal("GUARDIAN"),
                t.Literal("DELEGATE"),
                t.Literal("EMERGENCY"),
              ],
              { additionalProperties: false },
            ),
          ),
          country: __nullable__(t.String()),
          city: __nullable__(t.String()),
          address: __nullable__(t.String()),
          notes: __nullable__(t.String()),
          active: t.Boolean(),
          isDeleted: t.Boolean(),
          deletedAt: __nullable__(t.Date()),
          editsCount: t.Integer(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    createdBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    posOpeningEntry: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          profileId: t.String(),
          cashierUserId: t.String(),
          openedAt: t.Date(),
          status: t.Union([t.Literal("OPEN"), t.Literal("CLOSED")], {
            additionalProperties: false,
          }),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `فتح وردية: الكاشير ورصيد الدرج الافتتاحي لكل وسيلة دفع.`,
        },
      ),
    ),
    refundedBy: __nullable__(
      t.Object(
        {
          id: t.String(),
          name: t.String(),
          email: t.String(),
          emailVerified: t.Boolean(),
          image: __nullable__(t.String()),
          phone: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    taxTemplate: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          isDefault: t.Boolean(),
          disabled: t.Boolean(),
          taxCategoryId: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          saleId: t.String(),
          inventoryItemId: __nullable__(t.String()),
          name: t.String(),
          unitPrice: t.Number(),
          quantity: t.Integer(),
          lineTotal: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    taxes: t.Array(
      t.Object(
        {
          id: t.String(),
          saleId: t.String(),
          idx: t.Integer(),
          chargeType: t.Union(
            [
              t.Literal("ACTUAL"),
              t.Literal("ON_NET_TOTAL"),
              t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
              t.Literal("ON_PREVIOUS_ROW_TOTAL"),
              t.Literal("ON_ITEM_QUANTITY"),
            ],
            { additionalProperties: false },
          ),
          accountHeadId: t.String(),
          rate: t.Number(),
          taxAmount: t.Number(),
          total: t.Number(),
          rowId: __nullable__(t.Integer()),
          description: t.String(),
          includedInPrintRate: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    membership: __nullable__(
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
    ),
    membershipAdjustments: t.Array(
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
        {
          additionalProperties: false,
          description: `[MI-P2] نظيرتها لبيع نقطة البيع — خصومات منتجات فقط (لا استهلاك وحدات: الوحدات
المشمولة خدماتٌ ولا تظهر في السلة).`,
        },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const SalePlainInputCreate = t.Object(
  {
    code: t.String(),
    status: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("REFUNDED")],
        { additionalProperties: false },
      ),
    ),
    subtotal: t.Number(),
    discount: t.Optional(t.Number()),
    discountCode: t.Optional(__nullable__(t.String())),
    netTotal: t.Optional(t.Number()),
    taxRate: t.Optional(t.Number()),
    taxAmount: t.Number(),
    total: t.Number(),
    cogsAmount: t.Optional(t.Number()),
    paymentMethod: t.Optional(
      t.Union([t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")], {
        additionalProperties: false,
      }),
    ),
    customerName: t.Optional(__nullable__(t.String())),
    customerPhone: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    paidAt: t.Optional(__nullable__(t.Date())),
    fulfillment: t.Optional(
      t.Union([t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")], {
        additionalProperties: false,
      }),
    ),
    dispensedAt: t.Optional(__nullable__(t.Date())),
    refundedAt: t.Optional(__nullable__(t.Date())),
    refundReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const SalePlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    status: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("REFUNDED")],
        { additionalProperties: false },
      ),
    ),
    subtotal: t.Optional(t.Number()),
    discount: t.Optional(t.Number()),
    discountCode: t.Optional(__nullable__(t.String())),
    netTotal: t.Optional(t.Number()),
    taxRate: t.Optional(t.Number()),
    taxAmount: t.Optional(t.Number()),
    total: t.Optional(t.Number()),
    cogsAmount: t.Optional(t.Number()),
    paymentMethod: t.Optional(
      t.Union([t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")], {
        additionalProperties: false,
      }),
    ),
    customerName: t.Optional(__nullable__(t.String())),
    customerPhone: t.Optional(__nullable__(t.String())),
    notes: t.Optional(__nullable__(t.String())),
    paidAt: t.Optional(__nullable__(t.Date())),
    fulfillment: t.Optional(
      t.Union([t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")], {
        additionalProperties: false,
      }),
    ),
    dispensedAt: t.Optional(__nullable__(t.Date())),
    refundedAt: t.Optional(__nullable__(t.Date())),
    refundReason: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const SaleRelationsInputCreate = t.Object(
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
    owner: t.Optional(
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
    createdBy: t.Optional(
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
    posOpeningEntry: t.Optional(
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
    refundedBy: t.Optional(
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
    taxTemplate: t.Optional(
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
    items: t.Optional(
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
    taxes: t.Optional(
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
    membership: t.Optional(
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
    membershipAdjustments: t.Optional(
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
  { additionalProperties: false },
);

export const SaleRelationsInputUpdate = t.Partial(
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
      owner: t.Partial(
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
      createdBy: t.Partial(
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
      posOpeningEntry: t.Partial(
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
      refundedBy: t.Partial(
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
      taxTemplate: t.Partial(
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
      items: t.Partial(
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
      taxes: t.Partial(
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
      membership: t.Partial(
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
      membershipAdjustments: t.Partial(
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
    { additionalProperties: false },
  ),
);

export const SaleWhere = t.Partial(
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
          status: t.Union(
            [t.Literal("PENDING"), t.Literal("PAID"), t.Literal("REFUNDED")],
            { additionalProperties: false },
          ),
          subtotal: t.Number(),
          discount: t.Number(),
          discountCode: t.String(),
          netTotal: t.Number(),
          taxRate: t.Number(),
          taxAmount: t.Number(),
          total: t.Number(),
          taxTemplateId: t.String(),
          cogsAmount: t.Number(),
          paymentMethod: t.Union(
            [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
            { additionalProperties: false },
          ),
          createdById: t.String(),
          posOpeningEntryId: t.String(),
          membershipId: t.String(),
          customerName: t.String(),
          customerPhone: t.String(),
          ownerId: t.String({
            description: `[LY-P1] المالك المختار على الكاشير — يُحفظ الآن بعد أن كان يُمرَّر للتسعير ويُرمى.
\`partyId\` كان يصل \`priceSale\` (قالب الضريبة) و\`membership.ownerId\` (خصم العضوية)
ثمّ لا يُكتب في أيّ عمود، فبيعٌ لمالكٍ غير عضو كان يفقد هويّته تمامًا. وذلك يجعل
كسب النقاط على نقطة البيع مستحيلًا (BR-L5.2 «نفس القاعدة بلا بُعد تأمين»)،
والاستبدال في LY-P2 كذلك (BR-L6.5 يشترط طرفًا مربوطًا). §17.2 صفّ ٧.
\`SetNull\` لا \`Cascade\`: حذف مالكٍ لا يجوز أن يمحو بيعًا — البيع واقعةٌ محاسبية.`,
          }),
          notes: t.String(),
          paidAt: t.Date(),
          fulfillment: t.Union(
            [t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")],
            { additionalProperties: false },
          ),
          dispensedAt: t.Date(),
          dispensedById: t.String(),
          refundedAt: t.Date(),
          refundReason: t.String(),
          refundedById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Sale" },
  ),
);

export const SaleWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), code: t.String() },
            { additionalProperties: false },
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
              status: t.Union(
                [
                  t.Literal("PENDING"),
                  t.Literal("PAID"),
                  t.Literal("REFUNDED"),
                ],
                { additionalProperties: false },
              ),
              subtotal: t.Number(),
              discount: t.Number(),
              discountCode: t.String(),
              netTotal: t.Number(),
              taxRate: t.Number(),
              taxAmount: t.Number(),
              total: t.Number(),
              taxTemplateId: t.String(),
              cogsAmount: t.Number(),
              paymentMethod: t.Union(
                [t.Literal("CASH"), t.Literal("CARD"), t.Literal("TRANSFER")],
                { additionalProperties: false },
              ),
              createdById: t.String(),
              posOpeningEntryId: t.String(),
              membershipId: t.String(),
              customerName: t.String(),
              customerPhone: t.String(),
              ownerId: t.String({
                description: `[LY-P1] المالك المختار على الكاشير — يُحفظ الآن بعد أن كان يُمرَّر للتسعير ويُرمى.
\`partyId\` كان يصل \`priceSale\` (قالب الضريبة) و\`membership.ownerId\` (خصم العضوية)
ثمّ لا يُكتب في أيّ عمود، فبيعٌ لمالكٍ غير عضو كان يفقد هويّته تمامًا. وذلك يجعل
كسب النقاط على نقطة البيع مستحيلًا (BR-L5.2 «نفس القاعدة بلا بُعد تأمين»)،
والاستبدال في LY-P2 كذلك (BR-L6.5 يشترط طرفًا مربوطًا). §17.2 صفّ ٧.
\`SetNull\` لا \`Cascade\`: حذف مالكٍ لا يجوز أن يمحو بيعًا — البيع واقعةٌ محاسبية.`,
              }),
              notes: t.String(),
              paidAt: t.Date(),
              fulfillment: t.Union(
                [t.Literal("AT_PAYMENT"), t.Literal("ON_DISPENSE")],
                { additionalProperties: false },
              ),
              dispensedAt: t.Date(),
              dispensedById: t.String(),
              refundedAt: t.Date(),
              refundReason: t.String(),
              refundedById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Sale" },
);

export const SaleSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      status: t.Boolean(),
      subtotal: t.Boolean(),
      discount: t.Boolean(),
      discountCode: t.Boolean(),
      netTotal: t.Boolean(),
      taxRate: t.Boolean(),
      taxAmount: t.Boolean(),
      total: t.Boolean(),
      taxTemplateId: t.Boolean(),
      cogsAmount: t.Boolean(),
      paymentMethod: t.Boolean(),
      createdById: t.Boolean(),
      posOpeningEntryId: t.Boolean(),
      membershipId: t.Boolean(),
      customerName: t.Boolean(),
      customerPhone: t.Boolean(),
      ownerId: t.Boolean(),
      notes: t.Boolean(),
      paidAt: t.Boolean(),
      fulfillment: t.Boolean(),
      dispensedAt: t.Boolean(),
      dispensedById: t.Boolean(),
      refundedAt: t.Boolean(),
      refundReason: t.Boolean(),
      refundedById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      createdBy: t.Boolean(),
      posOpeningEntry: t.Boolean(),
      refundedBy: t.Boolean(),
      taxTemplate: t.Boolean(),
      items: t.Boolean(),
      taxes: t.Boolean(),
      membership: t.Boolean(),
      membershipAdjustments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SaleInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      paymentMethod: t.Boolean(),
      fulfillment: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      createdBy: t.Boolean(),
      posOpeningEntry: t.Boolean(),
      refundedBy: t.Boolean(),
      taxTemplate: t.Boolean(),
      items: t.Boolean(),
      taxes: t.Boolean(),
      membership: t.Boolean(),
      membershipAdjustments: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SaleOrderBy = t.Partial(
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
      subtotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      netTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      total: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cogsAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      posOpeningEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      membershipId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      customerName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      customerPhone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dispensedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dispensedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refundedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refundReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refundedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Sale = t.Composite([SalePlain, SaleRelations], {
  additionalProperties: false,
});

export const SaleInputCreate = t.Composite(
  [SalePlainInputCreate, SaleRelationsInputCreate],
  { additionalProperties: false },
);

export const SaleInputUpdate = t.Composite(
  [SalePlainInputUpdate, SaleRelationsInputUpdate],
  { additionalProperties: false },
);
