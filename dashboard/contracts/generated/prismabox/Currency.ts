import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CurrencyPlain = t.Object(
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
);

export const CurrencyRelations = t.Object(
  {
    accountingSettings: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          defaultCurrencyCode: __nullable__(t.String()),
          defaultReceivableAccountId: __nullable__(t.String()),
          defaultPayableAccountId: __nullable__(t.String()),
          defaultIncomeAccountId: __nullable__(t.String()),
          defaultExpenseAccountId: __nullable__(t.String()),
          defaultCashAccountId: __nullable__(t.String()),
          defaultBankAccountId: __nullable__(t.String()),
          roundOffAccountId: __nullable__(t.String()),
          roundOffForOpeningAccountId: __nullable__(t.String()),
          writeOffAccountId: __nullable__(t.String()),
          exchangeGainLossAccountId: __nullable__(t.String()),
          unrealizedExchangeGainLossAccountId: __nullable__(t.String()),
          unrealizedProfitLossAccountId: __nullable__(t.String()),
          defaultDiscountAccountId: __nullable__(t.String()),
          defaultDeferredRevenueAccountId: __nullable__(t.String()),
          defaultDeferredExpenseAccountId: __nullable__(t.String()),
          defaultAdvanceReceivedAccountId: __nullable__(t.String()),
          defaultAdvancePaidAccountId: __nullable__(t.String()),
          roundOffCostCenterId: __nullable__(t.String()),
          defaultCostCenterId: __nullable__(t.String()),
          defaultFinanceBookId: __nullable__(t.String()),
          defaultPaymentTermsTemplateId: __nullable__(t.String()),
          creditLimit: __nullable__(t.Number()),
          bypassCreditLimitCheck: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    ledgerAccounts: t.Array(
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
      { additionalProperties: false },
    ),
    exchangeRatesFrom: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          date: t.Date(),
          fromCurrencyCode: t.String(),
          toCurrencyCode: t.String(),
          exchangeRate: t.Number(),
          forBuying: t.Boolean(),
          forSelling: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    exchangeRatesTo: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          date: t.Date(),
          fromCurrencyCode: t.String(),
          toCurrencyCode: t.String(),
          exchangeRate: t.Number(),
          forBuying: t.Boolean(),
          forSelling: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    glEntriesAccount: t.Array(
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
    glEntriesTransaction: t.Array(
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
    paymentLedgerEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          postingDate: t.Date(),
          dueDate: __nullable__(t.Date()),
          accountType: t.Union(
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
          accountId: t.String(),
          accountCurrencyCode: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          voucherDetailNo: __nullable__(t.String()),
          againstVoucherType: t.String(),
          againstVoucherId: t.String(),
          againstVoucherNo: __nullable__(t.String()),
          amount: t.Number(),
          amountInAccountCurrency: t.Number(),
          delinked: t.Boolean(),
          costCenterId: __nullable__(t.String()),
          projectId: __nullable__(t.String()),
          financeBookId: __nullable__(t.String()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    advancePaymentLedgerEntries: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          postingDate: t.Date(),
          accountId: t.String({
            description: `the advance account itself — a plain liability/asset, so it carries NO party on the GL`,
          }),
          accountCurrencyCode: t.String(),
          partyType: t.String({
            description: `the party the advance belongs to (C6) — the fact BR-4.3.3 will not let the GL row hold`,
          }),
          partyId: t.String(),
          voucherType: t.String(),
          voucherId: t.String(),
          voucherNo: t.String(),
          againstVoucherType: t.String({
            description: `self while the advance is open; the invoice once released`,
          }),
          againstVoucherId: t.String(),
          againstVoucherNo: __nullable__(t.String()),
          amount: t.Number(),
          amountInAccountCurrency: t.Number(),
          delinked: t.Boolean(),
          costCenterId: __nullable__(t.String()),
          remarks: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `[P12.6] FR-11.3 — the advance sub-ledger.
WHY A SECOND LEDGER EXISTS AT ALL. When \`book_advance_payments_in_separate_party_account\`
is on, an unallocated payment lands in «دفعات مقدمة مقبوضة/مدفوعة» — a plain liability or
asset, NOT a receivable. BR-4.3.3 therefore FORBIDS a party on that GL row, and §5.2
derives the payment ledger only for RECEIVABLE/PAYABLE accounts, so the party's claim
would be invisible to every advance-aware surface. This table is where the party, the
amount and the allocation target live for exactly that case — which is the reason ERPNext
has it too.
IT IS NOT A SECOND SOURCE OF TRUTH FOR OUTSTANDING. An advance in a separate account is
not a receivable until it is released; the moment it IS released, the release entry posts
a real AR/AP leg and the PLE derives from it as usual. The two ledgers describe different
states of the same money, never the same state twice.
Sign convention mirrors §5.2: a customer advance received is NEGATIVE (the party holds a
credit), a supplier advance paid is POSITIVE. \`delinked\` follows the same discipline as
the payment ledger — rows are neutralized and re-inserted, never edited in place (AR-2).`,
        },
      ),
      { additionalProperties: false },
    ),
    salesInvoices: t.Array(
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
    purchaseInvoices: t.Array(
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
  },
  { additionalProperties: false },
);

export const CurrencyPlainInputCreate = t.Object(
  {
    name: t.String(),
    nameAr: t.String(),
    symbol: t.Optional(__nullable__(t.String())),
    fractionUnits: t.Optional(t.Integer()),
    fractionNameEn: t.Optional(__nullable__(t.String())),
    fractionNameAr: t.Optional(__nullable__(t.String())),
    smallestUnit: t.Optional(t.Number()),
    enabled: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CurrencyPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    nameAr: t.Optional(t.String()),
    symbol: t.Optional(__nullable__(t.String())),
    fractionUnits: t.Optional(t.Integer()),
    fractionNameEn: t.Optional(__nullable__(t.String())),
    fractionNameAr: t.Optional(__nullable__(t.String())),
    smallestUnit: t.Optional(t.Number()),
    enabled: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const CurrencyRelationsInputCreate = t.Object(
  {
    accountingSettings: t.Optional(
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
    ledgerAccounts: t.Optional(
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
    exchangeRatesFrom: t.Optional(
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
    exchangeRatesTo: t.Optional(
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
    glEntriesAccount: t.Optional(
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
    glEntriesTransaction: t.Optional(
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
    paymentLedgerEntries: t.Optional(
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
    advancePaymentLedgerEntries: t.Optional(
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
    salesInvoices: t.Optional(
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
    purchaseInvoices: t.Optional(
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

export const CurrencyRelationsInputUpdate = t.Partial(
  t.Object(
    {
      accountingSettings: t.Partial(
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
      ledgerAccounts: t.Partial(
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
      exchangeRatesFrom: t.Partial(
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
      exchangeRatesTo: t.Partial(
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
      glEntriesAccount: t.Partial(
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
      glEntriesTransaction: t.Partial(
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
      paymentLedgerEntries: t.Partial(
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
      advancePaymentLedgerEntries: t.Partial(
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
      salesInvoices: t.Partial(
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
      purchaseInvoices: t.Partial(
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

export const CurrencyWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          code: t.String(),
          name: t.String(),
          nameAr: t.String(),
          symbol: t.String(),
          fractionUnits: t.Integer(),
          fractionNameEn: t.String(),
          fractionNameAr: t.String(),
          smallestUnit: t.Number(),
          enabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Currency" },
  ),
);

export const CurrencyWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ code: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ code: t.String() })], {
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
              code: t.String(),
              name: t.String(),
              nameAr: t.String(),
              symbol: t.String(),
              fractionUnits: t.Integer(),
              fractionNameEn: t.String(),
              fractionNameAr: t.String(),
              smallestUnit: t.Number(),
              enabled: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Currency" },
);

export const CurrencySelect = t.Partial(
  t.Object(
    {
      code: t.Boolean(),
      name: t.Boolean(),
      nameAr: t.Boolean(),
      symbol: t.Boolean(),
      fractionUnits: t.Boolean(),
      fractionNameEn: t.Boolean(),
      fractionNameAr: t.Boolean(),
      smallestUnit: t.Boolean(),
      enabled: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      accountingSettings: t.Boolean(),
      ledgerAccounts: t.Boolean(),
      exchangeRatesFrom: t.Boolean(),
      exchangeRatesTo: t.Boolean(),
      glEntriesAccount: t.Boolean(),
      glEntriesTransaction: t.Boolean(),
      paymentLedgerEntries: t.Boolean(),
      advancePaymentLedgerEntries: t.Boolean(),
      salesInvoices: t.Boolean(),
      purchaseInvoices: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CurrencyInclude = t.Partial(
  t.Object(
    {
      accountingSettings: t.Boolean(),
      ledgerAccounts: t.Boolean(),
      exchangeRatesFrom: t.Boolean(),
      exchangeRatesTo: t.Boolean(),
      glEntriesAccount: t.Boolean(),
      glEntriesTransaction: t.Boolean(),
      paymentLedgerEntries: t.Boolean(),
      advancePaymentLedgerEntries: t.Boolean(),
      salesInvoices: t.Boolean(),
      purchaseInvoices: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CurrencyOrderBy = t.Partial(
  t.Object(
    {
      code: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      nameAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      symbol: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fractionUnits: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fractionNameEn: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fractionNameAr: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      smallestUnit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      enabled: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Currency = t.Composite([CurrencyPlain, CurrencyRelations], {
  additionalProperties: false,
});

export const CurrencyInputCreate = t.Composite(
  [CurrencyPlainInputCreate, CurrencyRelationsInputCreate],
  { additionalProperties: false },
);

export const CurrencyInputUpdate = t.Composite(
  [CurrencyPlainInputUpdate, CurrencyRelationsInputUpdate],
  { additionalProperties: false },
);
