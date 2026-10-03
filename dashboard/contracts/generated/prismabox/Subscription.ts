import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SubscriptionPlain = t.Object(
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
);

export const SubscriptionRelations = t.Object(
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
    template: __nullable__(
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
    plans: t.Array(
      t.Object(
        {
          id: t.String(),
          subscriptionId: t.String(),
          itemName: t.String(),
          qty: t.Number(),
          rate: t.Number(),
          incomeAccountId: t.String(),
          costCenterId: t.String(),
          firstPeriodOnly: t.Boolean({
            description: `[MI-P1] FR-17.2 امتداد: صفّ يظهر على فاتورة الفترة الأولى فقط (رسم تسجيل العضوية) —
الفترات اللاحقة لا تحمله. قرار المالك 2026-08-23 (MI-P1 س1).`,
          }),
          enableDeferredRevenue: t.Boolean({
            description: `[MI-P1] FR-17.2 امتداد: تمرير التأجيل إلى بند الفاتورة المولَّدة — محرك P12.2 يتولى
الاعتراف؛ مدى الخدمة = حدود فترة الفوترة (MI-P1 س2).`,
          }),
          deferredAccountId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    invoices: t.Array(
      t.Object(
        {
          id: t.String(),
          subscriptionId: t.String(),
          periodStartDate: t.Date(),
          periodEndDate: t.Date(),
          salesInvoiceId: t.String(),
          createdAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
        },
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
  },
  {
    additionalProperties: false,
    description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
  },
);

export const SubscriptionPlainInputCreate = t.Object(
  {
    partyType: t.String(),
    status: t.Optional(
      t.Union(
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
    ),
    interval: t.Optional(
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
    startDate: t.Date(),
    endDate: t.Optional(__nullable__(t.Date())),
    trialEndDate: t.Optional(__nullable__(t.Date())),
    lastInvoicedPeriodEnd: t.Optional(
      __nullable__(
        t.Date({
          description: `آخر فترة وُلِّدت لها فاتورة — مفتاح عدم التكرار الزمني`,
        }),
      ),
    ),
    generateInvoiceAtPeriodStart: t.Optional(
      t.Boolean({
        description: `مقدَّم أو مؤخَّر: هل تُصدر الفاتورة في بداية الفترة أم نهايتها`,
      }),
    ),
    daysUntilDue: t.Optional(t.Integer()),
    submitGeneratedInvoice: t.Optional(
      t.Boolean({
        description: `تُرحَّل الفاتورة المولَّدة تلقائيًا أم تبقى مسودّة لمراجعة بشرية`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
  },
);

export const SubscriptionPlainInputUpdate = t.Object(
  {
    partyType: t.Optional(t.String()),
    status: t.Optional(
      t.Union(
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
    ),
    interval: t.Optional(
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
    startDate: t.Optional(t.Date()),
    endDate: t.Optional(__nullable__(t.Date())),
    trialEndDate: t.Optional(__nullable__(t.Date())),
    lastInvoicedPeriodEnd: t.Optional(
      __nullable__(
        t.Date({
          description: `آخر فترة وُلِّدت لها فاتورة — مفتاح عدم التكرار الزمني`,
        }),
      ),
    ),
    generateInvoiceAtPeriodStart: t.Optional(
      t.Boolean({
        description: `مقدَّم أو مؤخَّر: هل تُصدر الفاتورة في بداية الفترة أم نهايتها`,
      }),
    ),
    daysUntilDue: t.Optional(t.Integer()),
    submitGeneratedInvoice: t.Optional(
      t.Boolean({
        description: `تُرحَّل الفاتورة المولَّدة تلقائيًا أم تبقى مسودّة لمراجعة بشرية`,
      }),
    ),
  },
  {
    additionalProperties: false,
    description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
  },
);

export const SubscriptionRelationsInputCreate = t.Object(
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
    template: t.Optional(
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
    plans: t.Optional(
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
  },
  {
    additionalProperties: false,
    description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
  },
);

export const SubscriptionRelationsInputUpdate = t.Partial(
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
      template: t.Partial(
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
      plans: t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
    },
  ),
);

export const SubscriptionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          endDate: t.Date(),
          trialEndDate: t.Date(),
          lastInvoicedPeriodEnd: t.Date({
            description: `آخر فترة وُلِّدت لها فاتورة — مفتاح عدم التكرار الزمني`,
          }),
          generateInvoiceAtPeriodStart: t.Boolean({
            description: `مقدَّم أو مؤخَّر: هل تُصدر الفاتورة في بداية الفترة أم نهايتها`,
          }),
          daysUntilDue: t.Integer(),
          submitGeneratedInvoice: t.Boolean({
            description: `تُرحَّل الفاتورة المولَّدة تلقائيًا أم تبقى مسودّة لمراجعة بشرية`,
          }),
          taxTemplateId: t.String(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
        },
      ),
    { $id: "Subscription" },
  ),
);

export const SubscriptionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String() },
            {
              additionalProperties: false,
              description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
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
              endDate: t.Date(),
              trialEndDate: t.Date(),
              lastInvoicedPeriodEnd: t.Date({
                description: `آخر فترة وُلِّدت لها فاتورة — مفتاح عدم التكرار الزمني`,
              }),
              generateInvoiceAtPeriodStart: t.Boolean({
                description: `مقدَّم أو مؤخَّر: هل تُصدر الفاتورة في بداية الفترة أم نهايتها`,
              }),
              daysUntilDue: t.Integer(),
              submitGeneratedInvoice: t.Boolean({
                description: `تُرحَّل الفاتورة المولَّدة تلقائيًا أم تبقى مسودّة لمراجعة بشرية`,
              }),
              taxTemplateId: t.String(),
              createdById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Subscription" },
);

export const SubscriptionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      status: t.Boolean(),
      interval: t.Boolean(),
      intervalCount: t.Boolean(),
      startDate: t.Boolean(),
      endDate: t.Boolean(),
      trialEndDate: t.Boolean(),
      lastInvoicedPeriodEnd: t.Boolean(),
      generateInvoiceAtPeriodStart: t.Boolean(),
      daysUntilDue: t.Boolean(),
      submitGeneratedInvoice: t.Boolean(),
      taxTemplateId: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      template: t.Boolean(),
      plans: t.Boolean(),
      invoices: t.Boolean(),
      membership: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
    },
  ),
);

export const SubscriptionInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      interval: t.Boolean(),
      clinic: t.Boolean(),
      template: t.Boolean(),
      plans: t.Boolean(),
      invoices: t.Boolean(),
      membership: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
    },
  ),
);

export const SubscriptionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      intervalCount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      trialEndDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lastInvoicedPeriodEnd: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      generateInvoiceAtPeriodStart: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      daysUntilDue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submitGeneratedInvoice: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      description: `اشتراك: طرف + خطط + دورة فوترة. مهمة يومية تُولّد فواتير الفترات المستحقّة.`,
    },
  ),
);

export const Subscription = t.Composite(
  [SubscriptionPlain, SubscriptionRelations],
  { additionalProperties: false },
);

export const SubscriptionInputCreate = t.Composite(
  [SubscriptionPlainInputCreate, SubscriptionRelationsInputCreate],
  { additionalProperties: false },
);

export const SubscriptionInputUpdate = t.Composite(
  [SubscriptionPlainInputUpdate, SubscriptionRelationsInputUpdate],
  { additionalProperties: false },
);
