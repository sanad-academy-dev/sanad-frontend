import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SubscriptionInvoicePlain = t.Object(
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
);

export const SubscriptionInvoiceRelations = t.Object(
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
    salesInvoice: t.Object(
      {
        id: t.String(),
        clinicId: t.String(),
        documentNo: __nullable__(t.String()),
        docstatus: t.Union(
          [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
          { additionalProperties: false },
        ),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("SUBMITTED"),
            t.Literal("UNPAID"),
            t.Literal("PAID"),
            t.Literal("PARTLY_PAID"),
            t.Literal("OVERDUE"),
            t.Literal("RETURN"),
            t.Literal("CREDIT_NOTE_ISSUED"),
            t.Literal("INTERNAL_TRANSFER"),
            t.Literal("CONSOLIDATED"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        amendedFromId: __nullable__(t.String()),
        postingDate: t.Date(),
        postingTime: __nullable__(t.String()),
        setPostingTime: t.Boolean(),
        dueDate: __nullable__(t.Date()),
        partyType: t.String(),
        partyId: t.String(),
        currencyCode: t.String(),
        conversionRate: t.Number(),
        debitToId: t.String(),
        partyAccountCurrencyCode: __nullable__(t.String()),
        isReturn: t.Boolean(),
        returnAgainstId: __nullable__(t.String()),
        updateOutstandingForSelf: t.Boolean(),
        isDebitNote: t.Boolean(),
        isPos: t.Boolean(),
        updateStock: t.Boolean(),
        isOpening: t.Boolean(),
        isConsolidated: t.Boolean(),
        isInternalCustomer: t.Boolean(),
        representsCompany: __nullable__(t.String()),
        unrealizedProfitLossAccountId: __nullable__(t.String()),
        poNo: __nullable__(t.String()),
        poDate: __nullable__(t.Date()),
        taxesAndChargesTemplateId: __nullable__(t.String()),
        taxCategoryId: __nullable__(t.String()),
        applyDiscountOn: t.Union(
          [t.Literal("GRAND_TOTAL"), t.Literal("NET_TOTAL")],
          { additionalProperties: false },
        ),
        additionalDiscountPercentage: t.Number(),
        discountAmount: t.Number(),
        isCashOrNonTradeDiscount: t.Boolean(),
        additionalDiscountAccountId: __nullable__(t.String()),
        total: t.Number(),
        netTotal: t.Number(),
        totalTaxesAndCharges: t.Number(),
        grandTotal: t.Number(),
        roundingAdjustment: t.Number(),
        roundedTotal: t.Number(),
        disableRoundedTotal: t.Boolean(),
        inWords: __nullable__(t.String()),
        outstandingAmount: t.Number(),
        allocateAdvancesAutomatically: t.Boolean(),
        onlyIncludeAllocatedPayments: t.Boolean(),
        totalAdvance: t.Number(),
        writeOffAmount: t.Number(),
        writeOffAccountId: __nullable__(t.String()),
        writeOffCostCenterId: __nullable__(t.String()),
        writeOffOutstandingAmountAutomatically: t.Boolean(),
        paymentTermsTemplateId: __nullable__(t.String()),
        ignoreDefaultPaymentTermsTemplate: t.Boolean(),
        costCenterId: __nullable__(t.String()),
        projectId: __nullable__(t.String()),
        dim1: __nullable__(t.String()),
        dim2: __nullable__(t.String()),
        dim3: __nullable__(t.String()),
        dim4: __nullable__(t.String()),
        remarks: __nullable__(t.String()),
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
  },
  {
    additionalProperties: false,
    description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
  },
);

export const SubscriptionInvoicePlainInputCreate = t.Object(
  { periodStartDate: t.Date(), periodEndDate: t.Date() },
  {
    additionalProperties: false,
    description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
  },
);

export const SubscriptionInvoicePlainInputUpdate = t.Object(
  {
    periodStartDate: t.Optional(t.Date()),
    periodEndDate: t.Optional(t.Date()),
  },
  {
    additionalProperties: false,
    description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
  },
);

export const SubscriptionInvoiceRelationsInputCreate = t.Object(
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
    salesInvoice: t.Object(
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
    description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
  },
);

export const SubscriptionInvoiceRelationsInputUpdate = t.Partial(
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
      salesInvoice: t.Object(
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
      description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
    },
  ),
);

export const SubscriptionInvoiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
    { $id: "SubscriptionInvoice" },
  ),
);

export const SubscriptionInvoiceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              subscriptionId_periodEndDate: t.Object(
                { subscriptionId: t.String(), periodEndDate: t.Date() },
                { additionalProperties: false },
              ),
            },
            {
              additionalProperties: false,
              description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
            },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              subscriptionId_periodEndDate: t.Object(
                { subscriptionId: t.String(), periodEndDate: t.Date() },
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
              subscriptionId: t.String(),
              periodStartDate: t.Date(),
              periodEndDate: t.Date(),
              salesInvoiceId: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SubscriptionInvoice" },
);

export const SubscriptionInvoiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      subscriptionId: t.Boolean(),
      periodStartDate: t.Boolean(),
      periodEndDate: t.Boolean(),
      salesInvoiceId: t.Boolean(),
      createdAt: t.Boolean(),
      subscription: t.Boolean(),
      salesInvoice: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
    },
  ),
);

export const SubscriptionInvoiceInclude = t.Partial(
  t.Object(
    {
      subscription: t.Boolean(),
      salesInvoice: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
    },
  ),
);

export const SubscriptionInvoiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subscriptionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodStartDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      periodEndDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      salesInvoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    {
      additionalProperties: false,
      description: `فاتورة فترة: الرابط بين الاشتراك والفاتورة المولَّدة، وحارس عدم التكرار.`,
    },
  ),
);

export const SubscriptionInvoice = t.Composite(
  [SubscriptionInvoicePlain, SubscriptionInvoiceRelations],
  { additionalProperties: false },
);

export const SubscriptionInvoiceInputCreate = t.Composite(
  [
    SubscriptionInvoicePlainInputCreate,
    SubscriptionInvoiceRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const SubscriptionInvoiceInputUpdate = t.Composite(
  [
    SubscriptionInvoicePlainInputUpdate,
    SubscriptionInvoiceRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
