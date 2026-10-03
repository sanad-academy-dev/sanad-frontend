import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DeferredScheduleEntryPlain = t.Object(
  {
    id: t.String(),
    clinicId: t.String(),
    type: t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
      additionalProperties: false,
    }),
    salesInvoiceItemId: __nullable__(t.String()),
    purchaseInvoiceItemId: __nullable__(t.String()),
    periodEndDate: t.Date({
      description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
    }),
    amount: t.Number(),
    journalEntryId: __nullable__(
      t.String({
        description: `القيد الذي حمل الاعتراف: مباشر إلى الأستاذ أو عبر قيد يومية (§19 علم الإعداد)`,
      }),
    ),
    postedAt: t.Date(),
    createdById: __nullable__(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const DeferredScheduleEntryRelations = t.Object(
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
    salesInvoiceItem: __nullable__(
      t.Object(
        {
          id: t.String(),
          salesInvoiceId: t.String(),
          idx: t.Integer(),
          itemCode: __nullable__(t.String()),
          itemName: t.String(),
          description: __nullable__(t.String()),
          qty: t.Number(),
          uom: __nullable__(t.String()),
          conversionFactor: t.Number(),
          priceListRate: __nullable__(t.Number()),
          marginType: __nullable__(
            t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
              additionalProperties: false,
            }),
          ),
          marginRateOrAmount: __nullable__(t.Number()),
          discountPercentage: __nullable__(t.Number()),
          discountAmount: __nullable__(t.Number()),
          rate: t.Number(),
          amount: t.Number(),
          netRate: t.Number(),
          netAmount: t.Number(),
          isFreeItem: t.Boolean(),
          incomeAccountId: t.String(),
          costCenterId: t.String(),
          discountAccountId: __nullable__(t.String()),
          itemTaxTemplateId: __nullable__(t.String()),
          itemTaxRates: __nullable__(t.String()),
          enableDeferredRevenue: t.Boolean(),
          deferredAccountId: __nullable__(t.String()),
          serviceStartDate: __nullable__(t.Date()),
          serviceEndDate: __nullable__(t.Date()),
          serviceStopDate: __nullable__(t.Date()),
          salesOrderRef: __nullable__(t.String()),
          soDetailRef: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
    ),
    purchaseInvoiceItem: __nullable__(
      t.Object(
        {
          id: t.String(),
          purchaseInvoiceId: t.String(),
          idx: t.Integer(),
          itemCode: __nullable__(t.String()),
          itemName: t.String(),
          description: __nullable__(t.String()),
          qty: t.Number(),
          uom: __nullable__(t.String()),
          conversionFactor: t.Number(),
          priceListRate: __nullable__(t.Number()),
          marginType: __nullable__(
            t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
              additionalProperties: false,
            }),
          ),
          marginRateOrAmount: __nullable__(t.Number()),
          discountPercentage: __nullable__(t.Number()),
          discountAmount: __nullable__(t.Number()),
          rate: t.Number(),
          amount: t.Number(),
          netRate: t.Number(),
          netAmount: t.Number(),
          isFreeItem: t.Boolean(),
          expenseAccountId: t.String(),
          costCenterId: t.String(),
          itemTaxTemplateId: __nullable__(t.String()),
          itemTaxRates: __nullable__(t.String()),
          enableDeferredExpense: t.Boolean(),
          deferredAccountId: __nullable__(t.String()),
          serviceStartDate: __nullable__(t.Date()),
          serviceEndDate: __nullable__(t.Date()),
          serviceStopDate: __nullable__(t.Date()),
          projectId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
    ),
    journalEntry: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          documentNo: __nullable__(t.String()),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          amendedFromId: __nullable__(t.String()),
          voucherType: t.String(),
          chequeNo: __nullable__(t.String()),
          chequeDate: __nullable__(t.Date()),
          remark: __nullable__(t.String()),
          multiCurrency: t.Boolean(),
          isSystemGenerated: t.Boolean(),
          totalDebit: t.Number(),
          totalCredit: t.Number(),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          submittedAt: __nullable__(t.Date()),
          submittedById: __nullable__(t.String()),
          cancelledAt: __nullable__(t.Date()),
          cancelledById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const DeferredScheduleEntryPlainInputCreate = t.Object(
  {
    type: t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
      additionalProperties: false,
    }),
    periodEndDate: t.Date({
      description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
    }),
    amount: t.Number(),
    postedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const DeferredScheduleEntryPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
        additionalProperties: false,
      }),
    ),
    periodEndDate: t.Optional(
      t.Date({
        description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
      }),
    ),
    amount: t.Optional(t.Number()),
    postedAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const DeferredScheduleEntryRelationsInputCreate = t.Object(
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
    salesInvoiceItem: t.Optional(
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
    purchaseInvoiceItem: t.Optional(
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
    journalEntry: t.Optional(
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

export const DeferredScheduleEntryRelationsInputUpdate = t.Partial(
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
      salesInvoiceItem: t.Partial(
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
      purchaseInvoiceItem: t.Partial(
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
      journalEntry: t.Partial(
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

export const DeferredScheduleEntryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          type: t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
            additionalProperties: false,
          }),
          salesInvoiceItemId: t.String(),
          purchaseInvoiceItemId: t.String(),
          periodEndDate: t.Date({
            description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
          }),
          amount: t.Number(),
          journalEntryId: t.String({
            description: `القيد الذي حمل الاعتراف: مباشر إلى الأستاذ أو عبر قيد يومية (§19 علم الإعداد)`,
          }),
          postedAt: t.Date(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "DeferredScheduleEntry" },
  ),
);

export const DeferredScheduleEntryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              salesInvoiceItemId_periodEndDate: t.Object(
                {
                  salesInvoiceItemId: t.String(),
                  periodEndDate: t.Date({
                    description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
                  }),
                },
                { additionalProperties: false },
              ),
              purchaseInvoiceItemId_periodEndDate: t.Object(
                {
                  purchaseInvoiceItemId: t.String(),
                  periodEndDate: t.Date({
                    description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
                  }),
                },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              salesInvoiceItemId_periodEndDate: t.Object(
                {
                  salesInvoiceItemId: t.String(),
                  periodEndDate: t.Date({
                    description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
                  }),
                },
                { additionalProperties: false },
              ),
            }),
            t.Object({
              purchaseInvoiceItemId_periodEndDate: t.Object(
                {
                  purchaseInvoiceItemId: t.String(),
                  periodEndDate: t.Date({
                    description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
                  }),
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
              clinicId: t.String(),
              type: t.Union([t.Literal("REVENUE"), t.Literal("EXPENSE")], {
                additionalProperties: false,
              }),
              salesInvoiceItemId: t.String(),
              purchaseInvoiceItemId: t.String(),
              periodEndDate: t.Date({
                description: `آخر يوم في الفترة المعترَف بها — المفتاح الزمني للفريدة`,
              }),
              amount: t.Number(),
              journalEntryId: t.String({
                description: `القيد الذي حمل الاعتراف: مباشر إلى الأستاذ أو عبر قيد يومية (§19 علم الإعداد)`,
              }),
              postedAt: t.Date(),
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
  { $id: "DeferredScheduleEntry" },
);

export const DeferredScheduleEntrySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      type: t.Boolean(),
      salesInvoiceItemId: t.Boolean(),
      purchaseInvoiceItemId: t.Boolean(),
      periodEndDate: t.Boolean(),
      amount: t.Boolean(),
      journalEntryId: t.Boolean(),
      postedAt: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      salesInvoiceItem: t.Boolean(),
      purchaseInvoiceItem: t.Boolean(),
      journalEntry: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DeferredScheduleEntryInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      clinic: t.Boolean(),
      salesInvoiceItem: t.Boolean(),
      purchaseInvoiceItem: t.Boolean(),
      journalEntry: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DeferredScheduleEntryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      salesInvoiceItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      purchaseInvoiceItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodEndDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      journalEntryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
    { additionalProperties: false },
  ),
);

export const DeferredScheduleEntry = t.Composite(
  [DeferredScheduleEntryPlain, DeferredScheduleEntryRelations],
  { additionalProperties: false },
);

export const DeferredScheduleEntryInputCreate = t.Composite(
  [
    DeferredScheduleEntryPlainInputCreate,
    DeferredScheduleEntryRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const DeferredScheduleEntryInputUpdate = t.Composite(
  [
    DeferredScheduleEntryPlainInputUpdate,
    DeferredScheduleEntryRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
