import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MembershipPlain = t.Object(
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
);

export const MembershipRelations = t.Object(
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
    owner: t.Object(
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
    scheduledPlan: __nullable__(
      t.Object(
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
    ),
    subscription: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        partyType: t.String(),
        partyId: t.String(),
        status: t.Union(
          [
            t.Literal("TRIALING"),
            t.Literal("ACTIVE"),
            t.Literal("PAST_DUE"),
            t.Literal("UNPAID"),
            t.Literal("CANCELLED"),
            t.Literal("COMPLETED"),
          ],
          { additionalProperties: false },
        ),
        interval: t.Union(
          [
            t.Literal("DAY"),
            t.Literal("WEEK"),
            t.Literal("MONTH"),
            t.Literal("YEAR"),
          ],
          { additionalProperties: false },
        ),
        intervalCount: t.Integer(),
        startDate: t.Date(),
        endDate: __nullable__(t.Date()),
        trialEndDate: __nullable__(t.Date()),
        lastInvoicedPeriodEnd: __nullable__(
          t.Date({
            description: `آخر فترة وُلِّدت لها فاتورة — مفتاح عدم التكرار الزمني`,
          }),
        ),
        generateInvoiceAtPeriodStart: t.Boolean({
          description: `مقدَّم أو مؤخَّر: هل تُصدر الفاتورة في بداية الفترة أم نهايتها`,
        }),
        daysUntilDue: t.Integer(),
        submitGeneratedInvoice: t.Boolean({
          description: `تُرحَّل الفاتورة المولَّدة تلقائيًا أم تبقى مسودّة لمراجعة بشرية`,
        }),
        taxTemplateId: __nullable__(t.String()),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      {
        additionalProperties: false,
        description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
      },
    ),
    benefits: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    entitlements: t.Array(
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
        {
          additionalProperties: false,
          description: `عداد استحقاق فترة — FR-M5.3. صف لكل (عضوية، ميزة INCLUDED_UNITS، فترة)؛
unitsConsumed يبقى 0 في MI-P1 — الاستهلاك يمرّ حصرًا من مقعد التسعير (MI-P2).`,
        },
      ),
      { additionalProperties: false },
    ),
    invoices: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
    sales: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
  },
);

export const MembershipPlainInputCreate = t.Object(
  {
    code: t.String(),
    status: t.Optional(
      t.Union(
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
    cancelledAt: t.Optional(__nullable__(t.Date())),
    cancelReason: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
  },
);

export const MembershipPlainInputUpdate = t.Object(
  {
    code: t.Optional(t.String()),
    status: t.Optional(
      t.Union(
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
    ),
    currentPeriodStart: t.Optional(t.Date()),
    currentPeriodEnd: t.Optional(t.Date()),
    feeSnapshot: t.Optional(t.Number()),
    intervalSnapshot: t.Optional(
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
    intervalCountSnapshot: t.Optional(t.Integer()),
    graceDaysSnapshot: t.Optional(t.Integer()),
    autoRenewSnapshot: t.Optional(t.Boolean()),
    cancelledAt: t.Optional(__nullable__(t.Date())),
    cancelReason: t.Optional(__nullable__(t.String())),
  },
  {
    additionalProperties: false,
    description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
  },
);

export const MembershipRelationsInputCreate = t.Object(
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
    owner: t.Object(
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
    scheduledPlan: t.Optional(
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
    subscription: t.Object(
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
    entitlements: t.Optional(
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
    invoices: t.Optional(
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
    sales: t.Optional(
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
    description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
  },
);

export const MembershipRelationsInputUpdate = t.Partial(
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
      owner: t.Object(
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
      scheduledPlan: t.Partial(
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
      subscription: t.Object(
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
      entitlements: t.Partial(
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
      invoices: t.Partial(
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
      sales: t.Partial(
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
      description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
    },
  ),
);

export const MembershipWhere = t.Partial(
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
          scheduledPlanId: t.String({
            description: `BR-M5.4.2: تبديل الخطة المجدول — يُطبَّق عند التدوير التالي ثم يُصفَّر`,
          }),
          cancelledAt: t.Date(),
          cancelReason: t.String(),
          cancelledByUserId: t.String(),
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
    { $id: "Membership" },
  ),
);

export const MembershipWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              code: t.String(),
              subscriptionId: t.String({
                description: `الاشتراك المحاسبي الحامل للفوترة (MI-C2) — واحد لواحد`,
              }),
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
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ code: t.String() }),
            t.Object({
              subscriptionId: t.String({
                description: `الاشتراك المحاسبي الحامل للفوترة (MI-C2) — واحد لواحد`,
              }),
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
              scheduledPlanId: t.String({
                description: `BR-M5.4.2: تبديل الخطة المجدول — يُطبَّق عند التدوير التالي ثم يُصفَّر`,
              }),
              cancelledAt: t.Date(),
              cancelReason: t.String(),
              cancelledByUserId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Membership" },
);

export const MembershipSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      code: t.Boolean(),
      clinicId: t.Boolean(),
      ownerId: t.Boolean(),
      planId: t.Boolean(),
      subscriptionId: t.Boolean(),
      status: t.Boolean(),
      currentPeriodStart: t.Boolean(),
      currentPeriodEnd: t.Boolean(),
      feeSnapshot: t.Boolean(),
      intervalSnapshot: t.Boolean(),
      intervalCountSnapshot: t.Boolean(),
      graceDaysSnapshot: t.Boolean(),
      autoRenewSnapshot: t.Boolean(),
      scheduledPlanId: t.Boolean(),
      cancelledAt: t.Boolean(),
      cancelReason: t.Boolean(),
      cancelledByUserId: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      plan: t.Boolean(),
      scheduledPlan: t.Boolean(),
      subscription: t.Boolean(),
      benefits: t.Boolean(),
      entitlements: t.Boolean(),
      invoices: t.Boolean(),
      sales: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
    },
  ),
);

export const MembershipInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      intervalSnapshot: t.Boolean(),
      clinic: t.Boolean(),
      owner: t.Boolean(),
      plan: t.Boolean(),
      scheduledPlan: t.Boolean(),
      subscription: t.Boolean(),
      benefits: t.Boolean(),
      entitlements: t.Boolean(),
      invoices: t.Boolean(),
      sales: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
    },
  ),
);

export const MembershipOrderBy = t.Partial(
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
      ownerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      planId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subscriptionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currentPeriodStart: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currentPeriodEnd: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      feeSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      intervalCountSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      graceDaysSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      autoRenewSnapshot: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      scheduledPlanId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelReason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledByUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `عضوية مالك — FR-M5.1. اللقطات (AR-M2) تجمّد شروط الخطة وقت التسجيل؛ تعديل الخطة
لا يمسّها إلا عند تدوير الفترة (BR-M5.4.1). تفرُّد BR-M5.1.1 (عضوية واحدة غير
نهائية لكل مالك) يُفرَض في معاملة التسجيل التسلسلية — فهرس جزئي شرطي لا يُعبَّر
عنه في برزما ولا يمرّ من فحص انجراف الهجرات (قاعدة 8).`,
    },
  ),
);

export const Membership = t.Composite([MembershipPlain, MembershipRelations], {
  additionalProperties: false,
});

export const MembershipInputCreate = t.Composite(
  [MembershipPlainInputCreate, MembershipRelationsInputCreate],
  { additionalProperties: false },
);

export const MembershipInputUpdate = t.Composite(
  [MembershipPlainInputUpdate, MembershipRelationsInputUpdate],
  { additionalProperties: false },
);
