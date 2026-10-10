import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PurchaseInvoiceAdvancePlain = t.Object(
  {
    id: t.String(),
    purchaseInvoiceId: t.String(),
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

export const PurchaseInvoiceAdvanceRelations = t.Object(
  {
    purchaseInvoice: t.Object(
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
            t.Literal("DEBIT_NOTE_ISSUED"),
            t.Literal("INTERNAL_TRANSFER"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        amendedFromId: __nullable__(t.String()),
        postingDate: t.Date(),
        dueDate: __nullable__(t.Date()),
        partyType: t.String(),
        partyId: t.String(),
        currencyCode: t.String(),
        conversionRate: t.Number(),
        creditToId: t.String(),
        partyAccountCurrencyCode: __nullable__(t.String()),
        billNo: __nullable__(t.String()),
        billDate: __nullable__(t.Date()),
        onHold: t.Boolean(),
        releaseDate: __nullable__(t.Date()),
        holdComment: __nullable__(t.String()),
        isPaid: t.Boolean(),
        modeOfPaymentId: __nullable__(t.String()),
        cashBankAccountId: __nullable__(t.String()),
        paidAmount: t.Number(),
        isReturn: t.Boolean(),
        returnAgainstId: __nullable__(t.String()),
        updateOutstandingForSelf: t.Boolean(),
        isOpening: t.Boolean(),
        isInternalSupplier: t.Boolean(),
        unrealizedProfitLossAccountId: __nullable__(t.String()),
        taxesAndChargesTemplateId: __nullable__(t.String()),
        taxCategoryId: __nullable__(t.String()),
        applyTds: t.Boolean(),
        taxWithholdingCategoryId: __nullable__(t.String()),
        taxWithholdingAmount: t.Number(),
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
        totalAdvance: t.Number(),
        writeOffAmount: t.Number(),
        writeOffAccountId: __nullable__(t.String()),
        writeOffCostCenterId: __nullable__(t.String()),
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

export const PurchaseInvoiceAdvancePlainInputCreate = t.Object(
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

export const PurchaseInvoiceAdvancePlainInputUpdate = t.Object(
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

export const PurchaseInvoiceAdvanceRelationsInputCreate = t.Object(
  {
    purchaseInvoice: t.Object(
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

export const PurchaseInvoiceAdvanceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      purchaseInvoice: t.Object(
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

export const PurchaseInvoiceAdvanceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          purchaseInvoiceId: t.String(),
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
    { $id: "PurchaseInvoiceAdvance" },
  ),
);

export const PurchaseInvoiceAdvanceWhereUnique = t.Recursive(
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
              purchaseInvoiceId: t.String(),
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
  { $id: "PurchaseInvoiceAdvance" },
);

export const PurchaseInvoiceAdvanceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      purchaseInvoiceId: t.Boolean(),
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
      purchaseInvoice: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseInvoiceAdvanceInclude = t.Partial(
  t.Object(
    { purchaseInvoice: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PurchaseInvoiceAdvanceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      purchaseInvoiceId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const PurchaseInvoiceAdvance = t.Composite(
  [PurchaseInvoiceAdvancePlain, PurchaseInvoiceAdvanceRelations],
  { additionalProperties: false },
);

export const PurchaseInvoiceAdvanceInputCreate = t.Composite(
  [
    PurchaseInvoiceAdvancePlainInputCreate,
    PurchaseInvoiceAdvanceRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PurchaseInvoiceAdvanceInputUpdate = t.Composite(
  [
    PurchaseInvoiceAdvancePlainInputUpdate,
    PurchaseInvoiceAdvanceRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
