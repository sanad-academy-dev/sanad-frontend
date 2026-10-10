import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PurchaseInvoiceTaxPlain = t.Object(
  {
    id: t.String(),
    purchaseInvoiceId: t.String(),
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
    taxAmountAfterDiscountAmount: t.Number(),
    total: t.Number(),
    rowId: __nullable__(t.Integer()),
    description: t.String(),
    includedInPrintRate: t.Boolean(),
    costCenterId: __nullable__(t.String()),
    category: t.Union(
      [
        t.Literal("TOTAL"),
        t.Literal("VALUATION"),
        t.Literal("VALUATION_AND_TOTAL"),
      ],
      { additionalProperties: false },
    ),
    addDeductTax: t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
      additionalProperties: false,
    }),
  },
  { additionalProperties: false },
);

export const PurchaseInvoiceTaxRelations = t.Object(
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
    accountHead: t.Object(
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
    costCenter: __nullable__(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const PurchaseInvoiceTaxPlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    chargeType: t.Optional(
      t.Union(
        [
          t.Literal("ACTUAL"),
          t.Literal("ON_NET_TOTAL"),
          t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
          t.Literal("ON_PREVIOUS_ROW_TOTAL"),
          t.Literal("ON_ITEM_QUANTITY"),
        ],
        { additionalProperties: false },
      ),
    ),
    rate: t.Optional(t.Number()),
    taxAmount: t.Optional(t.Number()),
    taxAmountAfterDiscountAmount: t.Optional(t.Number()),
    total: t.Optional(t.Number()),
    description: t.String(),
    includedInPrintRate: t.Optional(t.Boolean()),
    category: t.Optional(
      t.Union(
        [
          t.Literal("TOTAL"),
          t.Literal("VALUATION"),
          t.Literal("VALUATION_AND_TOTAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    addDeductTax: t.Optional(
      t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const PurchaseInvoiceTaxPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    chargeType: t.Optional(
      t.Union(
        [
          t.Literal("ACTUAL"),
          t.Literal("ON_NET_TOTAL"),
          t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
          t.Literal("ON_PREVIOUS_ROW_TOTAL"),
          t.Literal("ON_ITEM_QUANTITY"),
        ],
        { additionalProperties: false },
      ),
    ),
    rate: t.Optional(t.Number()),
    taxAmount: t.Optional(t.Number()),
    taxAmountAfterDiscountAmount: t.Optional(t.Number()),
    total: t.Optional(t.Number()),
    description: t.Optional(t.String()),
    includedInPrintRate: t.Optional(t.Boolean()),
    category: t.Optional(
      t.Union(
        [
          t.Literal("TOTAL"),
          t.Literal("VALUATION"),
          t.Literal("VALUATION_AND_TOTAL"),
        ],
        { additionalProperties: false },
      ),
    ),
    addDeductTax: t.Optional(
      t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
        additionalProperties: false,
      }),
    ),
  },
  { additionalProperties: false },
);

export const PurchaseInvoiceTaxRelationsInputCreate = t.Object(
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
    accountHead: t.Object(
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
    costCenter: t.Optional(
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

export const PurchaseInvoiceTaxRelationsInputUpdate = t.Partial(
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
      accountHead: t.Object(
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
      costCenter: t.Partial(
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

export const PurchaseInvoiceTaxWhere = t.Partial(
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
          taxAmountAfterDiscountAmount: t.Number(),
          total: t.Number(),
          rowId: t.Integer(),
          description: t.String(),
          includedInPrintRate: t.Boolean(),
          costCenterId: t.String(),
          category: t.Union(
            [
              t.Literal("TOTAL"),
              t.Literal("VALUATION"),
              t.Literal("VALUATION_AND_TOTAL"),
            ],
            { additionalProperties: false },
          ),
          addDeductTax: t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
            additionalProperties: false,
          }),
        },
        { additionalProperties: false },
      ),
    { $id: "PurchaseInvoiceTax" },
  ),
);

export const PurchaseInvoiceTaxWhereUnique = t.Recursive(
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
              taxAmountAfterDiscountAmount: t.Number(),
              total: t.Number(),
              rowId: t.Integer(),
              description: t.String(),
              includedInPrintRate: t.Boolean(),
              costCenterId: t.String(),
              category: t.Union(
                [
                  t.Literal("TOTAL"),
                  t.Literal("VALUATION"),
                  t.Literal("VALUATION_AND_TOTAL"),
                ],
                { additionalProperties: false },
              ),
              addDeductTax: t.Union([t.Literal("ADD"), t.Literal("DEDUCT")], {
                additionalProperties: false,
              }),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PurchaseInvoiceTax" },
);

export const PurchaseInvoiceTaxSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      purchaseInvoiceId: t.Boolean(),
      idx: t.Boolean(),
      chargeType: t.Boolean(),
      accountHeadId: t.Boolean(),
      rate: t.Boolean(),
      taxAmount: t.Boolean(),
      taxAmountAfterDiscountAmount: t.Boolean(),
      total: t.Boolean(),
      rowId: t.Boolean(),
      description: t.Boolean(),
      includedInPrintRate: t.Boolean(),
      costCenterId: t.Boolean(),
      category: t.Boolean(),
      addDeductTax: t.Boolean(),
      purchaseInvoice: t.Boolean(),
      accountHead: t.Boolean(),
      costCenter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseInvoiceTaxInclude = t.Partial(
  t.Object(
    {
      chargeType: t.Boolean(),
      category: t.Boolean(),
      addDeductTax: t.Boolean(),
      purchaseInvoice: t.Boolean(),
      accountHead: t.Boolean(),
      costCenter: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseInvoiceTaxOrderBy = t.Partial(
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
      accountHeadId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxAmountAfterDiscountAmount: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      total: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rowId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      includedInPrintRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseInvoiceTax = t.Composite(
  [PurchaseInvoiceTaxPlain, PurchaseInvoiceTaxRelations],
  { additionalProperties: false },
);

export const PurchaseInvoiceTaxInputCreate = t.Composite(
  [PurchaseInvoiceTaxPlainInputCreate, PurchaseInvoiceTaxRelationsInputCreate],
  { additionalProperties: false },
);

export const PurchaseInvoiceTaxInputUpdate = t.Composite(
  [PurchaseInvoiceTaxPlainInputUpdate, PurchaseInvoiceTaxRelationsInputUpdate],
  { additionalProperties: false },
);
