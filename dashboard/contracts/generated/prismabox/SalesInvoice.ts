import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SalesInvoicePlain = t.Object(
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
);

export const SalesInvoiceRelations = t.Object(
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
    amendedFrom: __nullable__(
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
    ),
    amendments: t.Array(
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
      { additionalProperties: false },
    ),
    returnAgainst: __nullable__(
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
    ),
    returns: t.Array(
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
      { additionalProperties: false },
    ),
    currency: t.Object(
      {
        code: t.String(),
        name: t.String(),
        nameAr: t.String(),
        symbol: __nullable__(t.String()),
        fractionUnits: t.Integer(),
        fractionNameEn: __nullable__(t.String()),
        fractionNameAr: __nullable__(t.String()),
        smallestUnit: t.Number(),
        enabled: t.Boolean(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    debitTo: t.Object(
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
    unrealizedProfitLossAccount: __nullable__(
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
    additionalDiscountAccount: __nullable__(
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
    writeOffAccount: __nullable__(
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
    writeOffCostCenter: __nullable__(
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
    taxesAndChargesTemplate: __nullable__(
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
    taxCategory: __nullable__(
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
    paymentTermsTemplate: __nullable__(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          templateName: t.String(),
          allocatePaymentBasedOnPaymentTerms: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
    items: t.Array(
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
      { additionalProperties: false },
    ),
    taxes: t.Array(
      t.Object(
        {
          id: t.String(),
          salesInvoiceId: t.String(),
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
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    advances: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    payments: t.Array(
      t.Object(
        {
          id: t.String(),
          salesInvoiceId: t.String(),
          idx: t.Integer(),
          modeOfPaymentId: t.String(),
          amount: t.Number(),
          accountId: __nullable__(t.String()),
          isDefault: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    subscriptionInvoices: t.Array(
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
  },
  { additionalProperties: false },
);

export const SalesInvoicePlainInputCreate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union(
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
    ),
    postingDate: t.Date(),
    postingTime: t.Optional(__nullable__(t.String())),
    setPostingTime: t.Optional(t.Boolean()),
    dueDate: t.Optional(__nullable__(t.Date())),
    partyType: t.String(),
    currencyCode: t.String(),
    conversionRate: t.Optional(t.Number()),
    partyAccountCurrencyCode: t.Optional(__nullable__(t.String())),
    isReturn: t.Optional(t.Boolean()),
    updateOutstandingForSelf: t.Optional(t.Boolean()),
    isDebitNote: t.Optional(t.Boolean()),
    isPos: t.Optional(t.Boolean()),
    updateStock: t.Optional(t.Boolean()),
    isOpening: t.Optional(t.Boolean()),
    isConsolidated: t.Optional(t.Boolean()),
    isInternalCustomer: t.Optional(t.Boolean()),
    representsCompany: t.Optional(__nullable__(t.String())),
    poNo: t.Optional(__nullable__(t.String())),
    poDate: t.Optional(__nullable__(t.Date())),
    applyDiscountOn: t.Optional(
      t.Union([t.Literal("GRAND_TOTAL"), t.Literal("NET_TOTAL")], {
        additionalProperties: false,
      }),
    ),
    additionalDiscountPercentage: t.Optional(t.Number()),
    discountAmount: t.Optional(t.Number()),
    isCashOrNonTradeDiscount: t.Optional(t.Boolean()),
    total: t.Optional(t.Number()),
    netTotal: t.Optional(t.Number()),
    totalTaxesAndCharges: t.Optional(t.Number()),
    grandTotal: t.Optional(t.Number()),
    roundingAdjustment: t.Optional(t.Number()),
    roundedTotal: t.Optional(t.Number()),
    disableRoundedTotal: t.Optional(t.Boolean()),
    inWords: t.Optional(__nullable__(t.String())),
    outstandingAmount: t.Optional(t.Number()),
    allocateAdvancesAutomatically: t.Optional(t.Boolean()),
    onlyIncludeAllocatedPayments: t.Optional(t.Boolean()),
    totalAdvance: t.Optional(t.Number()),
    writeOffAmount: t.Optional(t.Number()),
    writeOffOutstandingAmountAutomatically: t.Optional(t.Boolean()),
    ignoreDefaultPaymentTermsTemplate: t.Optional(t.Boolean()),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    remarks: t.Optional(__nullable__(t.String())),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SalesInvoicePlainInputUpdate = t.Object(
  {
    documentNo: t.Optional(__nullable__(t.String())),
    docstatus: t.Optional(
      t.Union(
        [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union(
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
    ),
    postingDate: t.Optional(t.Date()),
    postingTime: t.Optional(__nullable__(t.String())),
    setPostingTime: t.Optional(t.Boolean()),
    dueDate: t.Optional(__nullable__(t.Date())),
    partyType: t.Optional(t.String()),
    currencyCode: t.Optional(t.String()),
    conversionRate: t.Optional(t.Number()),
    partyAccountCurrencyCode: t.Optional(__nullable__(t.String())),
    isReturn: t.Optional(t.Boolean()),
    updateOutstandingForSelf: t.Optional(t.Boolean()),
    isDebitNote: t.Optional(t.Boolean()),
    isPos: t.Optional(t.Boolean()),
    updateStock: t.Optional(t.Boolean()),
    isOpening: t.Optional(t.Boolean()),
    isConsolidated: t.Optional(t.Boolean()),
    isInternalCustomer: t.Optional(t.Boolean()),
    representsCompany: t.Optional(__nullable__(t.String())),
    poNo: t.Optional(__nullable__(t.String())),
    poDate: t.Optional(__nullable__(t.Date())),
    applyDiscountOn: t.Optional(
      t.Union([t.Literal("GRAND_TOTAL"), t.Literal("NET_TOTAL")], {
        additionalProperties: false,
      }),
    ),
    additionalDiscountPercentage: t.Optional(t.Number()),
    discountAmount: t.Optional(t.Number()),
    isCashOrNonTradeDiscount: t.Optional(t.Boolean()),
    total: t.Optional(t.Number()),
    netTotal: t.Optional(t.Number()),
    totalTaxesAndCharges: t.Optional(t.Number()),
    grandTotal: t.Optional(t.Number()),
    roundingAdjustment: t.Optional(t.Number()),
    roundedTotal: t.Optional(t.Number()),
    disableRoundedTotal: t.Optional(t.Boolean()),
    inWords: t.Optional(__nullable__(t.String())),
    outstandingAmount: t.Optional(t.Number()),
    allocateAdvancesAutomatically: t.Optional(t.Boolean()),
    onlyIncludeAllocatedPayments: t.Optional(t.Boolean()),
    totalAdvance: t.Optional(t.Number()),
    writeOffAmount: t.Optional(t.Number()),
    writeOffOutstandingAmountAutomatically: t.Optional(t.Boolean()),
    ignoreDefaultPaymentTermsTemplate: t.Optional(t.Boolean()),
    dim1: t.Optional(__nullable__(t.String())),
    dim2: t.Optional(__nullable__(t.String())),
    dim3: t.Optional(__nullable__(t.String())),
    dim4: t.Optional(__nullable__(t.String())),
    remarks: t.Optional(__nullable__(t.String())),
    submittedAt: t.Optional(__nullable__(t.Date())),
    cancelledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const SalesInvoiceRelationsInputCreate = t.Object(
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
    amendedFrom: t.Optional(
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
    amendments: t.Optional(
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
    returnAgainst: t.Optional(
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
    returns: t.Optional(
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
    currency: t.Object(
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
    debitTo: t.Object(
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
    unrealizedProfitLossAccount: t.Optional(
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
    additionalDiscountAccount: t.Optional(
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
    writeOffAccount: t.Optional(
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
    writeOffCostCenter: t.Optional(
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
    taxesAndChargesTemplate: t.Optional(
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
    taxCategory: t.Optional(
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
    paymentTermsTemplate: t.Optional(
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
    items: t.Optional(
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
    taxes: t.Optional(
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
    advances: t.Optional(
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
    payments: t.Optional(
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
    subscriptionInvoices: t.Optional(
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

export const SalesInvoiceRelationsInputUpdate = t.Partial(
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
      amendedFrom: t.Partial(
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
      amendments: t.Partial(
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
      returnAgainst: t.Partial(
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
      returns: t.Partial(
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
      currency: t.Object(
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
      debitTo: t.Object(
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
      unrealizedProfitLossAccount: t.Partial(
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
      additionalDiscountAccount: t.Partial(
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
      writeOffAccount: t.Partial(
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
      writeOffCostCenter: t.Partial(
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
      taxesAndChargesTemplate: t.Partial(
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
      taxCategory: t.Partial(
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
      paymentTermsTemplate: t.Partial(
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
      items: t.Partial(
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
      taxes: t.Partial(
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
      advances: t.Partial(
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
      payments: t.Partial(
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
      subscriptionInvoices: t.Partial(
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

export const SalesInvoiceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          documentNo: t.String(),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
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
          amendedFromId: t.String(),
          postingDate: t.Date(),
          postingTime: t.String(),
          setPostingTime: t.Boolean(),
          dueDate: t.Date(),
          partyType: t.String(),
          partyId: t.String(),
          currencyCode: t.String(),
          conversionRate: t.Number(),
          debitToId: t.String(),
          partyAccountCurrencyCode: t.String(),
          isReturn: t.Boolean(),
          returnAgainstId: t.String(),
          updateOutstandingForSelf: t.Boolean(),
          isDebitNote: t.Boolean(),
          isPos: t.Boolean(),
          updateStock: t.Boolean(),
          isOpening: t.Boolean(),
          isConsolidated: t.Boolean(),
          isInternalCustomer: t.Boolean(),
          representsCompany: t.String(),
          unrealizedProfitLossAccountId: t.String(),
          poNo: t.String(),
          poDate: t.Date(),
          taxesAndChargesTemplateId: t.String(),
          taxCategoryId: t.String(),
          applyDiscountOn: t.Union(
            [t.Literal("GRAND_TOTAL"), t.Literal("NET_TOTAL")],
            { additionalProperties: false },
          ),
          additionalDiscountPercentage: t.Number(),
          discountAmount: t.Number(),
          isCashOrNonTradeDiscount: t.Boolean(),
          additionalDiscountAccountId: t.String(),
          total: t.Number(),
          netTotal: t.Number(),
          totalTaxesAndCharges: t.Number(),
          grandTotal: t.Number(),
          roundingAdjustment: t.Number(),
          roundedTotal: t.Number(),
          disableRoundedTotal: t.Boolean(),
          inWords: t.String(),
          outstandingAmount: t.Number(),
          allocateAdvancesAutomatically: t.Boolean(),
          onlyIncludeAllocatedPayments: t.Boolean(),
          totalAdvance: t.Number(),
          writeOffAmount: t.Number(),
          writeOffAccountId: t.String(),
          writeOffCostCenterId: t.String(),
          writeOffOutstandingAmountAutomatically: t.Boolean(),
          paymentTermsTemplateId: t.String(),
          ignoreDefaultPaymentTermsTemplate: t.Boolean(),
          costCenterId: t.String(),
          projectId: t.String(),
          dim1: t.String(),
          dim2: t.String(),
          dim3: t.String(),
          dim4: t.String(),
          remarks: t.String(),
          createdById: t.String(),
          submittedAt: t.Date(),
          submittedById: t.String(),
          cancelledAt: t.Date(),
          cancelledById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "SalesInvoice" },
  ),
);

export const SalesInvoiceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_documentNo: t.Object(
                { clinicId: t.String(), documentNo: t.String() },
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
              clinicId_documentNo: t.Object(
                { clinicId: t.String(), documentNo: t.String() },
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
              documentNo: t.String(),
              docstatus: t.Union(
                [
                  t.Literal("DRAFT"),
                  t.Literal("SUBMITTED"),
                  t.Literal("CANCELLED"),
                ],
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
              amendedFromId: t.String(),
              postingDate: t.Date(),
              postingTime: t.String(),
              setPostingTime: t.Boolean(),
              dueDate: t.Date(),
              partyType: t.String(),
              partyId: t.String(),
              currencyCode: t.String(),
              conversionRate: t.Number(),
              debitToId: t.String(),
              partyAccountCurrencyCode: t.String(),
              isReturn: t.Boolean(),
              returnAgainstId: t.String(),
              updateOutstandingForSelf: t.Boolean(),
              isDebitNote: t.Boolean(),
              isPos: t.Boolean(),
              updateStock: t.Boolean(),
              isOpening: t.Boolean(),
              isConsolidated: t.Boolean(),
              isInternalCustomer: t.Boolean(),
              representsCompany: t.String(),
              unrealizedProfitLossAccountId: t.String(),
              poNo: t.String(),
              poDate: t.Date(),
              taxesAndChargesTemplateId: t.String(),
              taxCategoryId: t.String(),
              applyDiscountOn: t.Union(
                [t.Literal("GRAND_TOTAL"), t.Literal("NET_TOTAL")],
                { additionalProperties: false },
              ),
              additionalDiscountPercentage: t.Number(),
              discountAmount: t.Number(),
              isCashOrNonTradeDiscount: t.Boolean(),
              additionalDiscountAccountId: t.String(),
              total: t.Number(),
              netTotal: t.Number(),
              totalTaxesAndCharges: t.Number(),
              grandTotal: t.Number(),
              roundingAdjustment: t.Number(),
              roundedTotal: t.Number(),
              disableRoundedTotal: t.Boolean(),
              inWords: t.String(),
              outstandingAmount: t.Number(),
              allocateAdvancesAutomatically: t.Boolean(),
              onlyIncludeAllocatedPayments: t.Boolean(),
              totalAdvance: t.Number(),
              writeOffAmount: t.Number(),
              writeOffAccountId: t.String(),
              writeOffCostCenterId: t.String(),
              writeOffOutstandingAmountAutomatically: t.Boolean(),
              paymentTermsTemplateId: t.String(),
              ignoreDefaultPaymentTermsTemplate: t.Boolean(),
              costCenterId: t.String(),
              projectId: t.String(),
              dim1: t.String(),
              dim2: t.String(),
              dim3: t.String(),
              dim4: t.String(),
              remarks: t.String(),
              createdById: t.String(),
              submittedAt: t.Date(),
              submittedById: t.String(),
              cancelledAt: t.Date(),
              cancelledById: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "SalesInvoice" },
);

export const SalesInvoiceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      documentNo: t.Boolean(),
      docstatus: t.Boolean(),
      status: t.Boolean(),
      amendedFromId: t.Boolean(),
      postingDate: t.Boolean(),
      postingTime: t.Boolean(),
      setPostingTime: t.Boolean(),
      dueDate: t.Boolean(),
      partyType: t.Boolean(),
      partyId: t.Boolean(),
      currencyCode: t.Boolean(),
      conversionRate: t.Boolean(),
      debitToId: t.Boolean(),
      partyAccountCurrencyCode: t.Boolean(),
      isReturn: t.Boolean(),
      returnAgainstId: t.Boolean(),
      updateOutstandingForSelf: t.Boolean(),
      isDebitNote: t.Boolean(),
      isPos: t.Boolean(),
      updateStock: t.Boolean(),
      isOpening: t.Boolean(),
      isConsolidated: t.Boolean(),
      isInternalCustomer: t.Boolean(),
      representsCompany: t.Boolean(),
      unrealizedProfitLossAccountId: t.Boolean(),
      poNo: t.Boolean(),
      poDate: t.Boolean(),
      taxesAndChargesTemplateId: t.Boolean(),
      taxCategoryId: t.Boolean(),
      applyDiscountOn: t.Boolean(),
      additionalDiscountPercentage: t.Boolean(),
      discountAmount: t.Boolean(),
      isCashOrNonTradeDiscount: t.Boolean(),
      additionalDiscountAccountId: t.Boolean(),
      total: t.Boolean(),
      netTotal: t.Boolean(),
      totalTaxesAndCharges: t.Boolean(),
      grandTotal: t.Boolean(),
      roundingAdjustment: t.Boolean(),
      roundedTotal: t.Boolean(),
      disableRoundedTotal: t.Boolean(),
      inWords: t.Boolean(),
      outstandingAmount: t.Boolean(),
      allocateAdvancesAutomatically: t.Boolean(),
      onlyIncludeAllocatedPayments: t.Boolean(),
      totalAdvance: t.Boolean(),
      writeOffAmount: t.Boolean(),
      writeOffAccountId: t.Boolean(),
      writeOffCostCenterId: t.Boolean(),
      writeOffOutstandingAmountAutomatically: t.Boolean(),
      paymentTermsTemplateId: t.Boolean(),
      ignoreDefaultPaymentTermsTemplate: t.Boolean(),
      costCenterId: t.Boolean(),
      projectId: t.Boolean(),
      dim1: t.Boolean(),
      dim2: t.Boolean(),
      dim3: t.Boolean(),
      dim4: t.Boolean(),
      remarks: t.Boolean(),
      createdById: t.Boolean(),
      submittedAt: t.Boolean(),
      submittedById: t.Boolean(),
      cancelledAt: t.Boolean(),
      cancelledById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      returnAgainst: t.Boolean(),
      returns: t.Boolean(),
      currency: t.Boolean(),
      debitTo: t.Boolean(),
      unrealizedProfitLossAccount: t.Boolean(),
      additionalDiscountAccount: t.Boolean(),
      writeOffAccount: t.Boolean(),
      writeOffCostCenter: t.Boolean(),
      costCenter: t.Boolean(),
      taxesAndChargesTemplate: t.Boolean(),
      taxCategory: t.Boolean(),
      paymentTermsTemplate: t.Boolean(),
      items: t.Boolean(),
      taxes: t.Boolean(),
      advances: t.Boolean(),
      payments: t.Boolean(),
      subscriptionInvoices: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SalesInvoiceInclude = t.Partial(
  t.Object(
    {
      docstatus: t.Boolean(),
      status: t.Boolean(),
      applyDiscountOn: t.Boolean(),
      clinic: t.Boolean(),
      amendedFrom: t.Boolean(),
      amendments: t.Boolean(),
      returnAgainst: t.Boolean(),
      returns: t.Boolean(),
      currency: t.Boolean(),
      debitTo: t.Boolean(),
      unrealizedProfitLossAccount: t.Boolean(),
      additionalDiscountAccount: t.Boolean(),
      writeOffAccount: t.Boolean(),
      writeOffCostCenter: t.Boolean(),
      costCenter: t.Boolean(),
      taxesAndChargesTemplate: t.Boolean(),
      taxCategory: t.Boolean(),
      paymentTermsTemplate: t.Boolean(),
      items: t.Boolean(),
      taxes: t.Boolean(),
      advances: t.Boolean(),
      payments: t.Boolean(),
      subscriptionInvoices: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const SalesInvoiceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      documentNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amendedFromId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postingDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postingTime: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      setPostingTime: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dueDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyType: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      conversionRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      debitToId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      partyAccountCurrencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isReturn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      returnAgainstId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updateOutstandingForSelf: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isDebitNote: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isPos: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      updateStock: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isOpening: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isConsolidated: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isInternalCustomer: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      representsCompany: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unrealizedProfitLossAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      poNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      poDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxesAndChargesTemplateId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      taxCategoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      additionalDiscountPercentage: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      discountAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isCashOrNonTradeDiscount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      additionalDiscountAccountId: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      total: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      netTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalTaxesAndCharges: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      grandTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roundingAdjustment: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      roundedTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disableRoundedTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      inWords: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      outstandingAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      allocateAdvancesAutomatically: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      onlyIncludeAllocatedPayments: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      totalAdvance: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      writeOffAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      writeOffAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      writeOffCostCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      writeOffOutstandingAmountAutomatically: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      paymentTermsTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ignoreDefaultPaymentTermsTemplate: t.Union(
        [t.Literal("asc"), t.Literal("desc")],
        { additionalProperties: false },
      ),
      costCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      projectId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim1: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim2: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim3: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      dim4: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      remarks: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      submittedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      cancelledById: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const SalesInvoice = t.Composite(
  [SalesInvoicePlain, SalesInvoiceRelations],
  { additionalProperties: false },
);

export const SalesInvoiceInputCreate = t.Composite(
  [SalesInvoicePlainInputCreate, SalesInvoiceRelationsInputCreate],
  { additionalProperties: false },
);

export const SalesInvoiceInputUpdate = t.Composite(
  [SalesInvoicePlainInputUpdate, SalesInvoiceRelationsInputUpdate],
  { additionalProperties: false },
);
