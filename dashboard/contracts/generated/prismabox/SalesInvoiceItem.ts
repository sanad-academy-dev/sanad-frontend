import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SalesInvoiceItemPlain = t.Object(
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
);

export const SalesInvoiceItemRelations = t.Object(
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
    discountAccount: __nullable__(
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
  },
  { additionalProperties: false },
);

export const SalesInvoiceItemPlainInputCreate = t.Object(
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
    enableDeferredRevenue: t.Optional(t.Boolean()),
    serviceStartDate: t.Optional(__nullable__(t.Date())),
    serviceEndDate: t.Optional(__nullable__(t.Date())),
    serviceStopDate: t.Optional(__nullable__(t.Date())),
    salesOrderRef: t.Optional(__nullable__(t.String())),
    soDetailRef: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const SalesInvoiceItemPlainInputUpdate = t.Object(
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
    enableDeferredRevenue: t.Optional(t.Boolean()),
    serviceStartDate: t.Optional(__nullable__(t.Date())),
    serviceEndDate: t.Optional(__nullable__(t.Date())),
    serviceStopDate: t.Optional(__nullable__(t.Date())),
    salesOrderRef: t.Optional(__nullable__(t.String())),
    soDetailRef: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const SalesInvoiceItemRelationsInputCreate = t.Object(
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
    discountAccount: t.Optional(
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
  },
  { additionalProperties: false },
);

export const SalesInvoiceItemRelationsInputUpdate = t.Partial(
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
      discountAccount: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const SalesInvoiceItemWhere = t.Partial(
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
          incomeAccountId: t.String(),
          costCenterId: t.String(),
          discountAccountId: t.String(),
          itemTaxTemplateId: t.String(),
          itemTaxRates: t.String(),
          enableDeferredRevenue: t.Boolean(),
          deferredAccountId: t.String(),
          serviceStartDate: t.Date(),
          serviceEndDate: t.Date(),
          serviceStopDate: t.Date(),
          salesOrderRef: t.String(),
          soDetailRef: t.String(),
          projectId: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "SalesInvoiceItem" },
  ),
);

export const SalesInvoiceItemWhereUnique = t.Recursive(
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
              incomeAccountId: t.String(),
              costCenterId: t.String(),
              discountAccountId: t.String(),
              itemTaxTemplateId: t.String(),
              itemTaxRates: t.String(),
              enableDeferredRevenue: t.Boolean(),
              deferredAccountId: t.String(),
              serviceStartDate: t.Date(),
              serviceEndDate: t.Date(),
              serviceStopDate: t.Date(),
              salesOrderRef: t.String(),
              soDetailRef: t.String(),
              projectId: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SalesInvoiceItem" },
);

export const SalesInvoiceItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      salesInvoiceId: t.Boolean(),
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
      incomeAccountId: t.Boolean(),
      costCenterId: t.Boolean(),
      discountAccountId: t.Boolean(),
      itemTaxTemplateId: t.Boolean(),
      itemTaxRates: t.Boolean(),
      enableDeferredRevenue: t.Boolean(),
      deferredAccountId: t.Boolean(),
      serviceStartDate: t.Boolean(),
      serviceEndDate: t.Boolean(),
      serviceStopDate: t.Boolean(),
      salesOrderRef: t.Boolean(),
      soDetailRef: t.Boolean(),
      projectId: t.Boolean(),
      salesInvoice: t.Boolean(),
      incomeAccount: t.Boolean(),
      discountAccount: t.Boolean(),
      deferredAccount: t.Boolean(),
      deferredSchedule: t.Boolean(),
      costCenter: t.Boolean(),
      itemTaxTemplate: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SalesInvoiceItemInclude = t.Partial(
  t.Object(
    {
      marginType: t.Boolean(),
      salesInvoice: t.Boolean(),
      incomeAccount: t.Boolean(),
      discountAccount: t.Boolean(),
      deferredAccount: t.Boolean(),
      deferredSchedule: t.Boolean(),
      costCenter: t.Boolean(),
      itemTaxTemplate: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SalesInvoiceItemOrderBy = t.Partial(
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
      incomeAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemTaxTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemTaxRates: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enableDeferredRevenue: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
      salesOrderRef: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      soDetailRef: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      projectId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const SalesInvoiceItem = t.Composite(
  [SalesInvoiceItemPlain, SalesInvoiceItemRelations],
  { additionalProperties: false },
);

export const SalesInvoiceItemInputCreate = t.Composite(
  [SalesInvoiceItemPlainInputCreate, SalesInvoiceItemRelationsInputCreate],
  { additionalProperties: false },
);

export const SalesInvoiceItemInputUpdate = t.Composite(
  [SalesInvoiceItemPlainInputUpdate, SalesInvoiceItemRelationsInputUpdate],
  { additionalProperties: false },
);
