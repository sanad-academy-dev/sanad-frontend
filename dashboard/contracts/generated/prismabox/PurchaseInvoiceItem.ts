import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PurchaseInvoiceItemPlain = t.Object(
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
);

export const PurchaseInvoiceItemRelations = t.Object(
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
    expenseAccount: t.Object(
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
    itemTaxTemplate: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
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
    deferredSchedule: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PurchaseInvoiceItemPlainInputCreate = t.Object(
  {
    idx: t.Integer(),
    itemCode: t.Optional(__nullable__(t.String())),
    itemName: t.String(),
    description: t.Optional(__nullable__(t.String())),
    qty: t.Number(),
    uom: t.Optional(__nullable__(t.String())),
    conversionFactor: t.Optional(t.Number()),
    priceListRate: t.Optional(__nullable__(t.Number())),
    marginType: t.Optional(
      __nullable__(
        t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
          additionalProperties: false,
        }),
      ),
    ),
    marginRateOrAmount: t.Optional(__nullable__(t.Number())),
    discountPercentage: t.Optional(__nullable__(t.Number())),
    discountAmount: t.Optional(__nullable__(t.Number())),
    rate: t.Optional(t.Number()),
    amount: t.Optional(t.Number()),
    netRate: t.Optional(t.Number()),
    netAmount: t.Optional(t.Number()),
    isFreeItem: t.Optional(t.Boolean()),
    itemTaxRates: t.Optional(__nullable__(t.String())),
    enableDeferredExpense: t.Optional(t.Boolean()),
    serviceStartDate: t.Optional(__nullable__(t.Date())),
    serviceEndDate: t.Optional(__nullable__(t.Date())),
    serviceStopDate: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PurchaseInvoiceItemPlainInputUpdate = t.Object(
  {
    idx: t.Optional(t.Integer()),
    itemCode: t.Optional(__nullable__(t.String())),
    itemName: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    qty: t.Optional(t.Number()),
    uom: t.Optional(__nullable__(t.String())),
    conversionFactor: t.Optional(t.Number()),
    priceListRate: t.Optional(__nullable__(t.Number())),
    marginType: t.Optional(
      __nullable__(
        t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
          additionalProperties: false,
        }),
      ),
    ),
    marginRateOrAmount: t.Optional(__nullable__(t.Number())),
    discountPercentage: t.Optional(__nullable__(t.Number())),
    discountAmount: t.Optional(__nullable__(t.Number())),
    rate: t.Optional(t.Number()),
    amount: t.Optional(t.Number()),
    netRate: t.Optional(t.Number()),
    netAmount: t.Optional(t.Number()),
    isFreeItem: t.Optional(t.Boolean()),
    itemTaxRates: t.Optional(__nullable__(t.String())),
    enableDeferredExpense: t.Optional(t.Boolean()),
    serviceStartDate: t.Optional(__nullable__(t.Date())),
    serviceEndDate: t.Optional(__nullable__(t.Date())),
    serviceStopDate: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PurchaseInvoiceItemRelationsInputCreate = t.Object(
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
    expenseAccount: t.Object(
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
    itemTaxTemplate: t.Optional(
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
    deferredSchedule: t.Optional(
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

export const PurchaseInvoiceItemRelationsInputUpdate = t.Partial(
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
      expenseAccount: t.Object(
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
      itemTaxTemplate: t.Partial(
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
      deferredSchedule: t.Partial(
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

export const PurchaseInvoiceItemWhere = t.Partial(
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
          itemCode: t.String(),
          itemName: t.String(),
          description: t.String(),
          qty: t.Number(),
          uom: t.String(),
          conversionFactor: t.Number(),
          priceListRate: t.Number(),
          marginType: t.Union([t.Literal("PERCENTAGE"), t.Literal("AMOUNT")], {
            additionalProperties: false,
          }),
          marginRateOrAmount: t.Number(),
          discountPercentage: t.Number(),
          discountAmount: t.Number(),
          rate: t.Number(),
          amount: t.Number(),
          netRate: t.Number(),
          netAmount: t.Number(),
          isFreeItem: t.Boolean(),
          expenseAccountId: t.String(),
          costCenterId: t.String(),
          itemTaxTemplateId: t.String(),
          itemTaxRates: t.String(),
          enableDeferredExpense: t.Boolean(),
          deferredAccountId: t.String(),
          serviceStartDate: t.Date(),
          serviceEndDate: t.Date(),
          serviceStopDate: t.Date(),
          projectId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "PurchaseInvoiceItem" },
  ),
);

export const PurchaseInvoiceItemWhereUnique = t.Recursive(
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
              itemCode: t.String(),
              itemName: t.String(),
              description: t.String(),
              qty: t.Number(),
              uom: t.String(),
              conversionFactor: t.Number(),
              priceListRate: t.Number(),
              marginType: t.Union(
                [t.Literal("PERCENTAGE"), t.Literal("AMOUNT")],
                { additionalProperties: false },
              ),
              marginRateOrAmount: t.Number(),
              discountPercentage: t.Number(),
              discountAmount: t.Number(),
              rate: t.Number(),
              amount: t.Number(),
              netRate: t.Number(),
              netAmount: t.Number(),
              isFreeItem: t.Boolean(),
              expenseAccountId: t.String(),
              costCenterId: t.String(),
              itemTaxTemplateId: t.String(),
              itemTaxRates: t.String(),
              enableDeferredExpense: t.Boolean(),
              deferredAccountId: t.String(),
              serviceStartDate: t.Date(),
              serviceEndDate: t.Date(),
              serviceStopDate: t.Date(),
              projectId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PurchaseInvoiceItem" },
);

export const PurchaseInvoiceItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      purchaseInvoiceId: t.Boolean(),
      idx: t.Boolean(),
      itemCode: t.Boolean(),
      itemName: t.Boolean(),
      description: t.Boolean(),
      qty: t.Boolean(),
      uom: t.Boolean(),
      conversionFactor: t.Boolean(),
      priceListRate: t.Boolean(),
      marginType: t.Boolean(),
      marginRateOrAmount: t.Boolean(),
      discountPercentage: t.Boolean(),
      discountAmount: t.Boolean(),
      rate: t.Boolean(),
      amount: t.Boolean(),
      netRate: t.Boolean(),
      netAmount: t.Boolean(),
      isFreeItem: t.Boolean(),
      expenseAccountId: t.Boolean(),
      costCenterId: t.Boolean(),
      itemTaxTemplateId: t.Boolean(),
      itemTaxRates: t.Boolean(),
      enableDeferredExpense: t.Boolean(),
      deferredAccountId: t.Boolean(),
      serviceStartDate: t.Boolean(),
      serviceEndDate: t.Boolean(),
      serviceStopDate: t.Boolean(),
      projectId: t.Boolean(),
      purchaseInvoice: t.Boolean(),
      expenseAccount: t.Boolean(),
      costCenter: t.Boolean(),
      itemTaxTemplate: t.Boolean(),
      deferredAccount: t.Boolean(),
      deferredSchedule: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseInvoiceItemInclude = t.Partial(
  t.Object(
    {
      marginType: t.Boolean(),
      purchaseInvoice: t.Boolean(),
      expenseAccount: t.Boolean(),
      costCenter: t.Boolean(),
      itemTaxTemplate: t.Boolean(),
      deferredAccount: t.Boolean(),
      deferredSchedule: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseInvoiceItemOrderBy = t.Partial(
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
      itemCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      qty: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      uom: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      conversionFactor: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceListRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      marginRateOrAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountPercentage: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      netRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      netAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isFreeItem: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expenseAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemTaxTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemTaxRates: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enableDeferredExpense: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      deferredAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceStartDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceEndDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      serviceStopDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      projectId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PurchaseInvoiceItem = t.Composite(
  [PurchaseInvoiceItemPlain, PurchaseInvoiceItemRelations],
  { additionalProperties: false },
);

export const PurchaseInvoiceItemInputCreate = t.Composite(
  [
    PurchaseInvoiceItemPlainInputCreate,
    PurchaseInvoiceItemRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PurchaseInvoiceItemInputUpdate = t.Composite(
  [
    PurchaseInvoiceItemPlainInputUpdate,
    PurchaseInvoiceItemRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
