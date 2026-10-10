import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CostCenterPlain = t.Object(
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
);

export const CostCenterRelations = t.Object(
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
    parent: __nullable__(
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
    children: t.Array(
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
      { additionalProperties: false },
    ),
    budgets: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          docstatus: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("SUBMITTED"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: __nullable__(t.String()),
          fiscalYear: t.String(),
          budgetAgainst: t.Union(
            [t.Literal("COST_CENTER"), t.Literal("PROJECT")],
            { additionalProperties: false },
          ),
          costCenterId: __nullable__(t.String()),
          project: __nullable__(t.String()),
          monthlyDistributionId: __nullable__(t.String()),
          applicableOnBookingActualExpenses: t.Boolean(),
          actionIfAnnualExceeded: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          actionIfAccumulatedMonthlyExceeded: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          applicableOnMaterialRequest: t.Boolean(),
          actionIfAnnualExceededOnMr: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          actionIfAccumulatedMonthlyExceededOnMr: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          applicableOnPurchaseOrder: t.Boolean(),
          actionIfAnnualExceededOnPo: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
          actionIfAccumulatedMonthlyExceededOnPo: t.Union(
            [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
            { additionalProperties: false },
          ),
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
    allocationsAsMain: t.Array(
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
          amendedFromId: __nullable__(t.String()),
          mainCostCenterId: t.String(),
          validFrom: t.Date(),
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
    allocationRows: t.Array(
      t.Object(
        {
          id: t.String(),
          allocationId: t.String(),
          costCenterId: t.String(),
          percentage: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    glEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          postingDate: t.Date(),
          transactionDate: __nullable__(t.Date()),
          fiscalYear: t.String(),
          accountId: t.String(),
          accountCurrencyCode: t.String(),
          debit: t.Number(),
          credit: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          transactionCurrencyCode: __nullable__(t.String()),
          transactionExchangeRate: __nullable__(t.Number()),
          debitInTransactionCurrency: t.Number(),
          creditInTransactionCurrency: t.Number(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          against: __nullable__(t.String()),
          voucherType: t.String(),
          voucherSubtype: __nullable__(t.String()),
          voucherId: t.String(),
          voucherNo: t.String(),
          voucherDetailNo: __nullable__(t.String()),
          againstVoucherType: __nullable__(t.String()),
          againstVoucherId: __nullable__(t.String()),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          financeBookId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          isOpening: t.Boolean(),
          isAdvance: t.Boolean(),
          isCancelled: t.Boolean(),
          dueDate: __nullable__(t.Date()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    journalEntryRows: t.Array(
      t.Object(
        {
          id: t.String(),
          journalEntryId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          debit: t.Number(),
          credit: t.Number(),
          costCenterId: __nullable__(t.String()),
          userRemark: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          clearanceDate: __nullable__(t.Date()),
          exchangeRate: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          referenceType: __nullable__(t.String()),
          referenceId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    salesTaxRows: t.Array(
      t.Object(
        {
          id: t.String(),
          templateId: t.String(),
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
          rowId: __nullable__(t.Integer()),
          description: t.String(),
          includedInPrintRate: t.Boolean(),
          costCenterId: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    purchaseTaxRows: t.Array(
      t.Object(
        {
          id: t.String(),
          templateId: t.String(),
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
      ),
      { additionalProperties: false },
    ),
    salesInvoicesHeader: t.Array(
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
    salesInvoicesWriteOff: t.Array(
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
    salesInvoiceItems: t.Array(
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
    salesInvoiceTaxRows: t.Array(
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
    purchaseInvoicesHeader: t.Array(
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
      { additionalProperties: false },
    ),
    purchaseInvoicesWriteOff: t.Array(
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
      { additionalProperties: false },
    ),
    purchaseInvoiceItems: t.Array(
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
      { additionalProperties: false },
    ),
    purchaseInvoiceTaxRows: t.Array(
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
      ),
      { additionalProperties: false },
    ),
    paymentEntries: t.Array(
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
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          amendedFromId: __nullable__(t.String()),
          paymentType: t.Union(
            [
              t.Literal("RECEIVE"),
              t.Literal("PAY"),
              t.Literal("INTERNAL_TRANSFER"),
            ],
            { additionalProperties: false },
          ),
          postingDate: t.Date(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          modeOfPaymentId: __nullable__(t.String()),
          paidFromId: t.String(),
          paidFromAccountCurrencyCode: __nullable__(t.String()),
          paidToId: t.String(),
          paidToAccountCurrencyCode: __nullable__(t.String()),
          paidAmount: t.Number(),
          sourceExchangeRate: t.Number(),
          basePaidAmount: t.Number(),
          receivedAmount: t.Number(),
          targetExchangeRate: t.Number(),
          baseReceivedAmount: t.Number(),
          totalAllocatedAmount: t.Number(),
          unallocatedAmount: t.Number(),
          differenceAmount: t.Number(),
          referenceNo: __nullable__(t.String()),
          referenceDate: __nullable__(t.Date()),
          clearanceDate: __nullable__(t.Date()),
          isOpening: t.Boolean(),
          bookAdvanceInSeparateAccount: t.Boolean({
            description: `[P12.6] FR-11.3 — snapshot of \`book_advance_payments_in_separate_party_account\` taken
when the draft was created. Snapshotted, not read live: a flag toggled between draft
and submit would post the advance somewhere other than where the operator was told,
and the document must record the regime it was written under.`,
          }),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          inWords: __nullable__(t.String()),
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
    paymentEntryDeductions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          paymentEntryId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          costCenterId: t.String(),
          amount: t.Number(),
          isExchangeGainLoss: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    subscriptionPlans: t.Array(
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
  },
  { additionalProperties: false },
);

export const CostCenterPlainInputCreate = t.Object(
  {
    costCenterName: t.String(),
    costCenterNumber: t.Optional(__nullable__(t.String())),
    isGroup: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
    lft: t.Integer(),
    rgt: t.Integer(),
  },
  { additionalProperties: false },
);

export const CostCenterPlainInputUpdate = t.Object(
  {
    costCenterName: t.Optional(t.String()),
    costCenterNumber: t.Optional(__nullable__(t.String())),
    isGroup: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
    lft: t.Optional(t.Integer()),
    rgt: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const CostCenterRelationsInputCreate = t.Object(
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
    parent: t.Optional(
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
    children: t.Optional(
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
    budgets: t.Optional(
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
    allocationsAsMain: t.Optional(
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
    allocationRows: t.Optional(
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
    glEntries: t.Optional(
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
    journalEntryRows: t.Optional(
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
    salesTaxRows: t.Optional(
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
    purchaseTaxRows: t.Optional(
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
    salesInvoicesHeader: t.Optional(
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
    salesInvoicesWriteOff: t.Optional(
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
    salesInvoiceItems: t.Optional(
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
    salesInvoiceTaxRows: t.Optional(
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
    purchaseInvoicesHeader: t.Optional(
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
    purchaseInvoicesWriteOff: t.Optional(
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
    purchaseInvoiceItems: t.Optional(
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
    purchaseInvoiceTaxRows: t.Optional(
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
    paymentEntries: t.Optional(
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
    paymentEntryDeductions: t.Optional(
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
    subscriptionPlans: t.Optional(
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

export const CostCenterRelationsInputUpdate = t.Partial(
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
      parent: t.Partial(
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
      children: t.Partial(
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
      budgets: t.Partial(
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
      allocationsAsMain: t.Partial(
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
      allocationRows: t.Partial(
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
      glEntries: t.Partial(
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
      journalEntryRows: t.Partial(
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
      salesTaxRows: t.Partial(
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
      purchaseTaxRows: t.Partial(
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
      salesInvoicesHeader: t.Partial(
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
      salesInvoicesWriteOff: t.Partial(
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
      salesInvoiceItems: t.Partial(
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
      salesInvoiceTaxRows: t.Partial(
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
      purchaseInvoicesHeader: t.Partial(
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
      purchaseInvoicesWriteOff: t.Partial(
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
      purchaseInvoiceItems: t.Partial(
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
      purchaseInvoiceTaxRows: t.Partial(
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
      paymentEntries: t.Partial(
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
      paymentEntryDeductions: t.Partial(
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
      subscriptionPlans: t.Partial(
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

export const CostCenterWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          costCenterName: t.String(),
          costCenterNumber: t.String(),
          parentCostCenterId: t.String(),
          isGroup: t.Boolean(),
          disabled: t.Boolean(),
          lft: t.Integer(),
          rgt: t.Integer(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "CostCenter" },
  ),
);

export const CostCenterWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_costCenterNumber: t.Object(
                { clinicId: t.String(), costCenterNumber: t.String() },
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
              clinicId_costCenterNumber: t.Object(
                { clinicId: t.String(), costCenterNumber: t.String() },
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
              costCenterName: t.String(),
              costCenterNumber: t.String(),
              parentCostCenterId: t.String(),
              isGroup: t.Boolean(),
              disabled: t.Boolean(),
              lft: t.Integer(),
              rgt: t.Integer(),
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
  { $id: "CostCenter" },
);

export const CostCenterSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      costCenterName: t.Boolean(),
      costCenterNumber: t.Boolean(),
      parentCostCenterId: t.Boolean(),
      isGroup: t.Boolean(),
      disabled: t.Boolean(),
      lft: t.Boolean(),
      rgt: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      parent: t.Boolean(),
      children: t.Boolean(),
      budgets: t.Boolean(),
      allocationsAsMain: t.Boolean(),
      allocationRows: t.Boolean(),
      glEntries: t.Boolean(),
      journalEntryRows: t.Boolean(),
      salesTaxRows: t.Boolean(),
      purchaseTaxRows: t.Boolean(),
      salesInvoicesHeader: t.Boolean(),
      salesInvoicesWriteOff: t.Boolean(),
      salesInvoiceItems: t.Boolean(),
      salesInvoiceTaxRows: t.Boolean(),
      purchaseInvoicesHeader: t.Boolean(),
      purchaseInvoicesWriteOff: t.Boolean(),
      purchaseInvoiceItems: t.Boolean(),
      purchaseInvoiceTaxRows: t.Boolean(),
      paymentEntries: t.Boolean(),
      paymentEntryDeductions: t.Boolean(),
      subscriptionPlans: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CostCenterInclude = t.Partial(
  t.Object(
    {
      clinic: t.Boolean(),
      parent: t.Boolean(),
      children: t.Boolean(),
      budgets: t.Boolean(),
      allocationsAsMain: t.Boolean(),
      allocationRows: t.Boolean(),
      glEntries: t.Boolean(),
      journalEntryRows: t.Boolean(),
      salesTaxRows: t.Boolean(),
      purchaseTaxRows: t.Boolean(),
      salesInvoicesHeader: t.Boolean(),
      salesInvoicesWriteOff: t.Boolean(),
      salesInvoiceItems: t.Boolean(),
      salesInvoiceTaxRows: t.Boolean(),
      purchaseInvoicesHeader: t.Boolean(),
      purchaseInvoicesWriteOff: t.Boolean(),
      purchaseInvoiceItems: t.Boolean(),
      purchaseInvoiceTaxRows: t.Boolean(),
      paymentEntries: t.Boolean(),
      paymentEntryDeductions: t.Boolean(),
      subscriptionPlans: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CostCenterOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      costCenterNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parentCostCenterId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isGroup: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lft: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rgt: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const CostCenter = t.Composite([CostCenterPlain, CostCenterRelations], {
  additionalProperties: false,
});

export const CostCenterInputCreate = t.Composite(
  [CostCenterPlainInputCreate, CostCenterRelationsInputCreate],
  { additionalProperties: false },
);

export const CostCenterInputUpdate = t.Composite(
  [CostCenterPlainInputUpdate, CostCenterRelationsInputUpdate],
  { additionalProperties: false },
);
