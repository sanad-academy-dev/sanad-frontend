import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SalesInvoiceAdvancePlain = t.Object(
  {
    id: t.String(),
    salesInvoiceId: t.String(),
    idx: t.Integer(),
    referenceType: t.String(),
    referenceId: t.String(),
    referenceRowId: __nullable__(t.String()),
    remarks: __nullable__(t.String()),
    advanceAmount: t.Number(),
    allocatedAmount: t.Number(),
    refExchangeRate: t.Number(),
    exchangeGainLoss: t.Number(),
    exchangeGainLossJeId: __nullable__(t.String()),
  },
  { additionalProperties: false },
);

export const SalesInvoiceAdvanceRelations = t.Object(
  {
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
  { additionalProperties: false },
);

export const SalesInvoiceAdvancePlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    referenceType: t.String(),
    remarks: t.Optional(__nullable__(t.String())),
    advanceAmount: t.Optional(t.Number()),
    allocatedAmount: t.Optional(t.Number()),
    refExchangeRate: t.Optional(t.Number()),
    exchangeGainLoss: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const SalesInvoiceAdvancePlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    referenceType: t.Optional(t.String()),
    remarks: t.Optional(__nullable__(t.String())),
    advanceAmount: t.Optional(t.Number()),
    allocatedAmount: t.Optional(t.Number()),
    refExchangeRate: t.Optional(t.Number()),
    exchangeGainLoss: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const SalesInvoiceAdvanceRelationsInputCreate = t.Object(
  {
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
  { additionalProperties: false },
);

export const SalesInvoiceAdvanceRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
    { additionalProperties: false },
  ),
);

export const SalesInvoiceAdvanceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          salesInvoiceId: t.String(),
          idx: t.Integer(),
          referenceType: t.String(),
          referenceId: t.String(),
          referenceRowId: t.String(),
          remarks: t.String(),
          advanceAmount: t.Number(),
          allocatedAmount: t.Number(),
          refExchangeRate: t.Number(),
          exchangeGainLoss: t.Number(),
          exchangeGainLossJeId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "SalesInvoiceAdvance" },
  ),
);

export const SalesInvoiceAdvanceWhereUnique = t.Recursive(
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
              salesInvoiceId: t.String(),
              idx: t.Integer(),
              referenceType: t.String(),
              referenceId: t.String(),
              referenceRowId: t.String(),
              remarks: t.String(),
              advanceAmount: t.Number(),
              allocatedAmount: t.Number(),
              refExchangeRate: t.Number(),
              exchangeGainLoss: t.Number(),
              exchangeGainLossJeId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SalesInvoiceAdvance" },
);

export const SalesInvoiceAdvanceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      salesInvoiceId: t.Boolean(),
      idx: t.Boolean(),
      referenceType: t.Boolean(),
      referenceId: t.Boolean(),
      referenceRowId: t.Boolean(),
      remarks: t.Boolean(),
      advanceAmount: t.Boolean(),
      allocatedAmount: t.Boolean(),
      refExchangeRate: t.Boolean(),
      exchangeGainLoss: t.Boolean(),
      exchangeGainLossJeId: t.Boolean(),
      salesInvoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SalesInvoiceAdvanceInclude = t.Partial(
  t.Object(
    { salesInvoice: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const SalesInvoiceAdvanceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      salesInvoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      idx: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      referenceRowId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      remarks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      advanceAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allocatedAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      refExchangeRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      exchangeGainLoss: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      exchangeGainLossJeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const SalesInvoiceAdvance = t.Composite(
  [SalesInvoiceAdvancePlain, SalesInvoiceAdvanceRelations],
  { additionalProperties: false },
);

export const SalesInvoiceAdvanceInputCreate = t.Composite(
  [
    SalesInvoiceAdvancePlainInputCreate,
    SalesInvoiceAdvanceRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const SalesInvoiceAdvanceInputUpdate = t.Composite(
  [
    SalesInvoiceAdvancePlainInputUpdate,
    SalesInvoiceAdvanceRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
