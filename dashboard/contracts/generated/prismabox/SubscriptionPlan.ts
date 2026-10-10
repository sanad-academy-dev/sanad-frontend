import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SubscriptionPlanPlain = t.Object(
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
);

export const SubscriptionPlanRelations = t.Object(
  {
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
    incomeAccount: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        accountName: t.String(),
        accountNumber: __nullable__(t.String()),
        parentAccountId: __nullable__(t.String()),
        isGroup: t.Boolean(),
        rootType: t.Union(
          [
            t.Literal("ASSET"),
            t.Literal("LIABILITY"),
            t.Literal("INCOME"),
            t.Literal("EXPENSE"),
            t.Literal("EQUITY"),
          ],
          { additionalProperties: false },
        ),
        reportType: t.Union(
          [t.Literal("BALANCE_SHEET"), t.Literal("PROFIT_AND_LOSS")],
          { additionalProperties: false },
        ),
        accountType: __nullable__(
          t.Union(
            [
              t.Literal("BANK"),
              t.Literal("CASH"),
              t.Literal("RECEIVABLE"),
              t.Literal("PAYABLE"),
              t.Literal("TAX"),
              t.Literal("STOCK"),
              t.Literal("FIXED_ASSET"),
              t.Literal("ACCUMULATED_DEPRECIATION"),
              t.Literal("DEPRECIATION"),
              t.Literal("EXPENSE_ACCOUNT"),
              t.Literal("INCOME_ACCOUNT"),
              t.Literal("CHARGEABLE"),
              t.Literal("ROUND_OFF"),
              t.Literal("ROUND_OFF_FOR_OPENING"),
              t.Literal("TEMPORARY"),
              t.Literal("EQUITY"),
              t.Literal("DIRECT_INCOME"),
              t.Literal("INDIRECT_INCOME"),
              t.Literal("DIRECT_EXPENSE"),
              t.Literal("INDIRECT_EXPENSE"),
              t.Literal("COST_OF_GOODS_SOLD"),
              t.Literal("CURRENT_ASSET"),
              t.Literal("CURRENT_LIABILITY"),
              t.Literal("CAPITAL_WORK_IN_PROGRESS"),
              t.Literal("ASSET_RECEIVED_BUT_NOT_BILLED"),
              t.Literal("STOCK_RECEIVED_BUT_NOT_BILLED"),
              t.Literal("SERVICE_RECEIVED_BUT_NOT_BILLED"),
              t.Literal("STOCK_ADJUSTMENT"),
            ],
            { additionalProperties: false },
          ),
        ),
        accountCurrencyCode: t.String(),
        taxRate: __nullable__(t.Number()),
        balanceMustBe: t.Union(
          [t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")],
          { additionalProperties: false },
        ),
        freezeAccount: t.Boolean(),
        disabled: t.Boolean(),
        lft: t.Integer(),
        rgt: t.Integer(),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    costCenter: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        costCenterName: t.String(),
        costCenterNumber: __nullable__(t.String()),
        parentCostCenterId: __nullable__(t.String()),
        isGroup: t.Boolean(),
        disabled: t.Boolean(),
        lft: t.Integer(),
        rgt: t.Integer(),
        createdById: __nullable__(t.String()),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    deferredAccount: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          accountName: t.String(),
          accountNumber: __nullable__(t.String()),
          parentAccountId: __nullable__(t.String()),
          isGroup: t.Boolean(),
          rootType: t.Union(
            [
              t.Literal("ASSET"),
              t.Literal("LIABILITY"),
              t.Literal("INCOME"),
              t.Literal("EXPENSE"),
              t.Literal("EQUITY"),
            ],
            { additionalProperties: false },
          ),
          reportType: t.Union(
            [t.Literal("BALANCE_SHEET"), t.Literal("PROFIT_AND_LOSS")],
            { additionalProperties: false },
          ),
          accountType: __nullable__(
            t.Union(
              [
                t.Literal("BANK"),
                t.Literal("CASH"),
                t.Literal("RECEIVABLE"),
                t.Literal("PAYABLE"),
                t.Literal("TAX"),
                t.Literal("STOCK"),
                t.Literal("FIXED_ASSET"),
                t.Literal("ACCUMULATED_DEPRECIATION"),
                t.Literal("DEPRECIATION"),
                t.Literal("EXPENSE_ACCOUNT"),
                t.Literal("INCOME_ACCOUNT"),
                t.Literal("CHARGEABLE"),
                t.Literal("ROUND_OFF"),
                t.Literal("ROUND_OFF_FOR_OPENING"),
                t.Literal("TEMPORARY"),
                t.Literal("EQUITY"),
                t.Literal("DIRECT_INCOME"),
                t.Literal("INDIRECT_INCOME"),
                t.Literal("DIRECT_EXPENSE"),
                t.Literal("INDIRECT_EXPENSE"),
                t.Literal("COST_OF_GOODS_SOLD"),
                t.Literal("CURRENT_ASSET"),
                t.Literal("CURRENT_LIABILITY"),
                t.Literal("CAPITAL_WORK_IN_PROGRESS"),
                t.Literal("ASSET_RECEIVED_BUT_NOT_BILLED"),
                t.Literal("STOCK_RECEIVED_BUT_NOT_BILLED"),
                t.Literal("SERVICE_RECEIVED_BUT_NOT_BILLED"),
                t.Literal("STOCK_ADJUSTMENT"),
              ],
              { additionalProperties: false },
            ),
          ),
          accountCurrencyCode: t.String(),
          taxRate: __nullable__(t.Number()),
          balanceMustBe: t.Union(
            [t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")],
            { additionalProperties: false },
          ),
          freezeAccount: t.Boolean(),
          disabled: t.Boolean(),
          lft: t.Integer(),
          rgt: t.Integer(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const SubscriptionPlanPlainInputCreate = t.Object(
  {
    itemName: t.String(),
    qty: t.Optional(t.Number()),
    rate: t.Optional(t.Number()),
    firstPeriodOnly: t.Optional(
      t.Boolean({
        description: `[MI-P1] FR-17.2 امتداد: صفّ يظهر على فاتورة الفترة الأولى فقط (رسم تسجيل العضوية) —
الفترات اللاحقة لا تحمله. قرار المالك 2026-08-23 (MI-P1 س1).`,
      }),
    ),
    enableDeferredRevenue: t.Optional(
      t.Boolean({
        description: `[MI-P1] FR-17.2 امتداد: تمرير التأجيل إلى بند الفاتورة المولَّدة — محرك P12.2 يتولى
الاعتراف؛ مدى الخدمة = حدود فترة الفوترة (MI-P1 س2).`,
      }),
    ),
  },
  { additionalProperties: false },
);

export const SubscriptionPlanPlainInputUpdate = t.Object(
  {
    itemName: t.Optional(t.String()),
    qty: t.Optional(t.Number()),
    rate: t.Optional(t.Number()),
    firstPeriodOnly: t.Optional(
      t.Boolean({
        description: `[MI-P1] FR-17.2 امتداد: صفّ يظهر على فاتورة الفترة الأولى فقط (رسم تسجيل العضوية) —
الفترات اللاحقة لا تحمله. قرار المالك 2026-08-23 (MI-P1 س1).`,
      }),
    ),
    enableDeferredRevenue: t.Optional(
      t.Boolean({
        description: `[MI-P1] FR-17.2 امتداد: تمرير التأجيل إلى بند الفاتورة المولَّدة — محرك P12.2 يتولى
الاعتراف؛ مدى الخدمة = حدود فترة الفوترة (MI-P1 س2).`,
      }),
    ),
  },
  { additionalProperties: false },
);

export const SubscriptionPlanRelationsInputCreate = t.Object(
  {
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
    incomeAccount: t.Object(
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
    costCenter: t.Object(
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
    deferredAccount: t.Optional(
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
  { additionalProperties: false },
);

export const SubscriptionPlanRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      incomeAccount: t.Object(
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
      costCenter: t.Object(
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
      deferredAccount: t.Partial(
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
    { additionalProperties: false },
  ),
);

export const SubscriptionPlanWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          deferredAccountId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "SubscriptionPlan" },
  ),
);

export const SubscriptionPlanWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
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
              deferredAccountId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SubscriptionPlan" },
);

export const SubscriptionPlanSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      subscriptionId: t.Boolean(),
      itemName: t.Boolean(),
      qty: t.Boolean(),
      rate: t.Boolean(),
      incomeAccountId: t.Boolean(),
      costCenterId: t.Boolean(),
      firstPeriodOnly: t.Boolean(),
      enableDeferredRevenue: t.Boolean(),
      deferredAccountId: t.Boolean(),
      subscription: t.Boolean(),
      incomeAccount: t.Boolean(),
      costCenter: t.Boolean(),
      deferredAccount: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SubscriptionPlanInclude = t.Partial(
  t.Object(
    {
      subscription: t.Boolean(),
      incomeAccount: t.Boolean(),
      costCenter: t.Boolean(),
      deferredAccount: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SubscriptionPlanOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subscriptionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qty: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      incomeAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      firstPeriodOnly: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enableDeferredRevenue: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deferredAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const SubscriptionPlan = t.Composite(
  [SubscriptionPlanPlain, SubscriptionPlanRelations],
  { additionalProperties: false },
);

export const SubscriptionPlanInputCreate = t.Composite(
  [SubscriptionPlanPlainInputCreate, SubscriptionPlanRelationsInputCreate],
  { additionalProperties: false },
);

export const SubscriptionPlanInputUpdate = t.Composite(
  [SubscriptionPlanPlainInputUpdate, SubscriptionPlanRelationsInputUpdate],
  { additionalProperties: false },
);
