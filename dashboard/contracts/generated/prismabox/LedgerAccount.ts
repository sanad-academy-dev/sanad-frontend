import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LedgerAccountPlain = t.Object(
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
);

export const LedgerAccountRelations = t.Object(
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
    parentAccount: __nullable__(
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
    children: t.Array(
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
    defaultForModesOfPayment: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          modeOfPaymentName: t.String(),
          type: t.Union(
            [
              t.Literal("CASH"),
              t.Literal("BANK"),
              t.Literal("GENERAL"),
              t.Literal("PHONE"),
            ],
            { additionalProperties: false },
          ),
          enabled: t.Boolean(),
          defaultAccountId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    offsettingForDimensions: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          slot: t.Integer(),
          dimensionName: t.String(),
          referenceDoctype: __nullable__(t.String()),
          disabled: t.Boolean(),
          mandatoryForBalanceSheet: t.Boolean(),
          mandatoryForProfitAndLoss: t.Boolean(),
          defaultDimensionValue: __nullable__(t.String()),
          autoPostBalancingEntry: t.Boolean(),
          offsettingAccountId: __nullable__(t.String()),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    closingHeadForPcvs: t.Array(
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
          fiscalYear: t.String(),
          periodStartDate: t.Date(),
          periodEndDate: t.Date(),
          closingAccountHeadId: t.String(),
          remarks: __nullable__(t.String()),
          granularByDimensions: t.Boolean(),
          gleProcessingStatus: t.Union(
            [
              t.Literal("QUEUED"),
              t.Literal("IN_PROGRESS"),
              t.Literal("COMPLETED"),
              t.Literal("FAILED"),
            ],
            { additionalProperties: false },
          ),
          errorMessage: __nullable__(t.String()),
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
    closingBalances: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          periodClosingVoucherId: t.String(),
          closingDate: t.Date(),
          accountId: t.String(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          costCenterId: __nullable__(t.String()),
          dim1: __nullable__(t.String()),
          dim2: __nullable__(t.String()),
          dim3: __nullable__(t.String()),
          dim4: __nullable__(t.String()),
          debit: t.Number(),
          credit: t.Number(),
          debitInAccountCurrency: t.Number(),
          creditInAccountCurrency: t.Number(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    budgetRows: t.Array(
      t.Object(
        {
          id: t.String(),
          budgetId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          budgetAmount: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    dimensionFilterRows: t.Array(
      t.Object(
        { id: t.String(), filterId: t.String(), accountId: t.String() },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    bankAccounts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          bankId: t.String(),
          accountName: t.String(),
          isCompanyAccount: t.Boolean(),
          glAccountId: __nullable__(t.String()),
          accountType: __nullable__(t.String()),
          accountSubtype: __nullable__(t.String()),
          iban: __nullable__(t.String()),
          branchCode: __nullable__(t.String()),
          bankAccountNo: __nullable__(t.String()),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          integrationId: __nullable__(t.String()),
          disabled: t.Boolean(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    bankRuleContras: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          ruleName: t.String(),
          priority: t.Integer(),
          disabled: t.Boolean(),
          descriptionContains: __nullable__(t.String()),
          direction: t.Union(
            [t.Literal("ANY"), t.Literal("DEPOSIT"), t.Literal("WITHDRAWAL")],
            { additionalProperties: false },
          ),
          minAmount: __nullable__(t.Number()),
          maxAmount: __nullable__(t.Number()),
          bankAccountId: __nullable__(t.String()),
          contraAccountId: t.String(),
          createdById: __nullable__(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
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
    revaluationRows: t.Array(
      t.Object(
        {
          id: t.String(),
          revaluationId: t.String(),
          idx: t.Integer(),
          accountId: t.String(),
          accountCurrencyCode: t.String(),
          partyType: __nullable__(t.String()),
          partyId: __nullable__(t.String()),
          balanceInAccountCurrency: t.Number(),
          bookedBase: t.Number(),
          currentExchangeRate: t.Number(),
          newBase: t.Number(),
          gainLoss: t.Number(),
          isZeroForeignSweep: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    partyAccounts: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          partyType: t.String(),
          partyId: t.String(),
          accountId: t.String(),
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
    advanceLedgerEntries: t.Array(
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
    itemTaxDetails: t.Array(
      t.Object(
        {
          id: t.String(),
          templateId: t.String(),
          taxTypeAccountId: t.String(),
          taxRate: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    salesInvoicesDebitTo: t.Array(
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
    salesInvoicesUnrealizedPL: t.Array(
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
    salesInvoicesAdditionalDiscount: t.Array(
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
    salesInvoiceItemsIncome: t.Array(
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
    salesInvoiceItemsDiscount: t.Array(
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
    saleTaxRows: t.Array(
      t.Object(
        {
          id: t.String(),
          saleId: t.String(),
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
          total: t.Number(),
          rowId: __nullable__(t.Integer()),
          description: t.String(),
          includedInPrintRate: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    salesInvoiceDeferredItems: t.Array(
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
    purchaseInvoiceDeferredItems: t.Array(
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
    taxWithholdingCategories: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          basis: t.Union([t.Literal("GROSS"), t.Literal("NET")], {
            additionalProperties: false,
          }),
          taxOnExcessAmount: t.Boolean({
            description: `الضريبة على ما تجاوز العتبة فقط، لا على المبلغ كاملًا`,
          }),
          roundOffTaxAmount: t.Boolean(),
          disableSingleThreshold: t.Boolean(),
          disableCumulativeThreshold: t.Boolean(),
          disabled: t.Boolean(),
          accountId: __nullable__(
            t.String({
              description: `حساب الالتزام الذي يُقيَّد عليه المبلغ المستقطَع (دائن على فاتورة الشراء)`,
            }),
          ),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `فئة استقطاع: نِسَبها بنوافذ تاريخية، وحسابها لكل شركة، وسلوك عتباتها.`,
        },
      ),
      { additionalProperties: false },
    ),
    posProfileWriteOffs: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          name: t.String(),
          warehouseId: __nullable__(t.String()),
          writeOffLimit: t.Number({
            description: `فرق النقد الذي يُقبل شطبه تلقائيًا عند الإقفال؛ ما فوقه يحتاج قرارًا`,
          }),
          writeOffAccountId: __nullable__(
            t.String({
              description: `حساب فروق النقد (زيادة/عجز الدرج) — بلا حساب يُرفض الإقفال بفارق`,
            }),
          ),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `ملف نقطة بيع: الإعدادات التي تحكم طاولة الكاشير في هذه العيادة.`,
        },
      ),
      { additionalProperties: false },
    ),
    dunningTypeIncomes: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          title: t.String(),
          rateOfInterest: t.Number(),
          dunningFee: t.Number(),
          letterBody: __nullable__(t.String()),
          incomeAccountId: __nullable__(
            t.String({
              description: `حساب الإيراد الذي يستقبل الرسوم والفائدة عند التحصيل`,
            }),
          ),
          disabled: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        {
          additionalProperties: false,
          description: `نوع مطالبة: الرسوم والفائدة الافتراضية ونصّ الخطاب. النصّ عربي فقط اليوم (قاعدة 5).`,
        },
      ),
      { additionalProperties: false },
    ),
    subscriptionPlanIncomes: t.Array(
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
    subscriptionPlanDeferred: t.Array(
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
    clinicInvoiceTaxRows: t.Array(
      t.Object(
        {
          id: t.String(),
          invoiceId: t.String(),
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
          total: t.Number(),
          rowId: __nullable__(t.Integer()),
          description: t.String(),
          includedInPrintRate: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    salesInvoicePayments: t.Array(
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
    purchaseInvoicesCreditTo: t.Array(
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
    purchaseInvoicesCashBank: t.Array(
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
    purchaseInvoicesUnrealizedPL: t.Array(
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
    purchaseInvoicesAdditionalDiscount: t.Array(
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
    purchaseInvoiceItemsExpense: t.Array(
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
    paymentEntriesPaidFrom: t.Array(
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
    paymentEntriesPaidTo: t.Array(
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
    paymentEntryReferences: t.Array(
      t.Object(
        {
          id: t.String(),
          clinicId: t.String(),
          paymentEntryId: t.String(),
          idx: t.Integer(),
          referenceDoctype: t.String(),
          referenceId: t.String(),
          dueDate: __nullable__(t.Date()),
          billNo: __nullable__(t.String()),
          totalAmount: t.Number(),
          outstandingAmount: t.Number(),
          allocatedAmount: t.Number(),
          exchangeRate: t.Number(),
          exchangeGainLossJeId: __nullable__(t.String()),
          exchangeGainLoss: t.Number(),
          paymentTermId: __nullable__(t.String()),
          accountId: __nullable__(t.String()),
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
  },
  { additionalProperties: false },
);

export const LedgerAccountPlainInputCreate = t.Object(
  {
    accountName: t.String(),
    accountNumber: t.Optional(__nullable__(t.String())),
    isGroup: t.Optional(t.Boolean()),
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
    accountType: t.Optional(
      __nullable__(
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
    ),
    accountCurrencyCode: t.String(),
    taxRate: t.Optional(__nullable__(t.Number())),
    balanceMustBe: t.Optional(
      t.Union([t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")], {
        additionalProperties: false,
      }),
    ),
    freezeAccount: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
    lft: t.Integer(),
    rgt: t.Integer(),
  },
  { additionalProperties: false },
);

export const LedgerAccountPlainInputUpdate = t.Object(
  {
    accountName: t.Optional(t.String()),
    accountNumber: t.Optional(__nullable__(t.String())),
    isGroup: t.Optional(t.Boolean()),
    rootType: t.Optional(
      t.Union(
        [
          t.Literal("ASSET"),
          t.Literal("LIABILITY"),
          t.Literal("INCOME"),
          t.Literal("EXPENSE"),
          t.Literal("EQUITY"),
        ],
        { additionalProperties: false },
      ),
    ),
    reportType: t.Optional(
      t.Union([t.Literal("BALANCE_SHEET"), t.Literal("PROFIT_AND_LOSS")], {
        additionalProperties: false,
      }),
    ),
    accountType: t.Optional(
      __nullable__(
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
    ),
    accountCurrencyCode: t.Optional(t.String()),
    taxRate: t.Optional(__nullable__(t.Number())),
    balanceMustBe: t.Optional(
      t.Union([t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")], {
        additionalProperties: false,
      }),
    ),
    freezeAccount: t.Optional(t.Boolean()),
    disabled: t.Optional(t.Boolean()),
    lft: t.Optional(t.Integer()),
    rgt: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const LedgerAccountRelationsInputCreate = t.Object(
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
    parentAccount: t.Optional(
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
    defaultForModesOfPayment: t.Optional(
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
    offsettingForDimensions: t.Optional(
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
    closingHeadForPcvs: t.Optional(
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
    closingBalances: t.Optional(
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
    budgetRows: t.Optional(
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
    dimensionFilterRows: t.Optional(
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
    bankAccounts: t.Optional(
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
    bankRuleContras: t.Optional(
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
    revaluationRows: t.Optional(
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
    partyAccounts: t.Optional(
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
    advanceLedgerEntries: t.Optional(
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
    itemTaxDetails: t.Optional(
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
    salesInvoicesDebitTo: t.Optional(
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
    salesInvoicesUnrealizedPL: t.Optional(
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
    salesInvoicesAdditionalDiscount: t.Optional(
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
    salesInvoiceItemsIncome: t.Optional(
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
    salesInvoiceItemsDiscount: t.Optional(
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
    saleTaxRows: t.Optional(
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
    salesInvoiceDeferredItems: t.Optional(
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
    purchaseInvoiceDeferredItems: t.Optional(
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
    taxWithholdingCategories: t.Optional(
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
    posProfileWriteOffs: t.Optional(
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
    dunningTypeIncomes: t.Optional(
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
    subscriptionPlanIncomes: t.Optional(
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
    subscriptionPlanDeferred: t.Optional(
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
    clinicInvoiceTaxRows: t.Optional(
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
    salesInvoicePayments: t.Optional(
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
    purchaseInvoicesCreditTo: t.Optional(
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
    purchaseInvoicesCashBank: t.Optional(
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
    purchaseInvoicesUnrealizedPL: t.Optional(
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
    purchaseInvoicesAdditionalDiscount: t.Optional(
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
    purchaseInvoiceItemsExpense: t.Optional(
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
    paymentEntriesPaidFrom: t.Optional(
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
    paymentEntriesPaidTo: t.Optional(
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
    paymentEntryReferences: t.Optional(
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
  },
  { additionalProperties: false },
);

export const LedgerAccountRelationsInputUpdate = t.Partial(
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
      parentAccount: t.Partial(
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
      defaultForModesOfPayment: t.Partial(
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
      offsettingForDimensions: t.Partial(
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
      closingHeadForPcvs: t.Partial(
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
      closingBalances: t.Partial(
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
      budgetRows: t.Partial(
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
      dimensionFilterRows: t.Partial(
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
      bankAccounts: t.Partial(
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
      bankRuleContras: t.Partial(
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
      revaluationRows: t.Partial(
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
      partyAccounts: t.Partial(
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
      advanceLedgerEntries: t.Partial(
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
      itemTaxDetails: t.Partial(
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
      salesInvoicesDebitTo: t.Partial(
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
      salesInvoicesUnrealizedPL: t.Partial(
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
      salesInvoicesAdditionalDiscount: t.Partial(
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
      salesInvoiceItemsIncome: t.Partial(
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
      salesInvoiceItemsDiscount: t.Partial(
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
      saleTaxRows: t.Partial(
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
      salesInvoiceDeferredItems: t.Partial(
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
      purchaseInvoiceDeferredItems: t.Partial(
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
      taxWithholdingCategories: t.Partial(
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
      posProfileWriteOffs: t.Partial(
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
      dunningTypeIncomes: t.Partial(
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
      subscriptionPlanIncomes: t.Partial(
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
      subscriptionPlanDeferred: t.Partial(
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
      clinicInvoiceTaxRows: t.Partial(
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
      salesInvoicePayments: t.Partial(
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
      purchaseInvoicesCreditTo: t.Partial(
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
      purchaseInvoicesCashBank: t.Partial(
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
      purchaseInvoicesUnrealizedPL: t.Partial(
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
      purchaseInvoicesAdditionalDiscount: t.Partial(
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
      purchaseInvoiceItemsExpense: t.Partial(
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
      paymentEntriesPaidFrom: t.Partial(
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
      paymentEntriesPaidTo: t.Partial(
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
      paymentEntryReferences: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const LedgerAccountWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          clinicId: t.String(),
          accountName: t.String(),
          accountNumber: t.String(),
          parentAccountId: t.String(),
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
          accountCurrencyCode: t.String(),
          taxRate: t.Number(),
          balanceMustBe: t.Union(
            [t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")],
            { additionalProperties: false },
          ),
          freezeAccount: t.Boolean(),
          disabled: t.Boolean(),
          lft: t.Integer(),
          rgt: t.Integer(),
          createdById: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "LedgerAccount" },
  ),
);

export const LedgerAccountWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              clinicId_accountNumber: t.Object(
                { clinicId: t.String(), accountNumber: t.String() },
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
              clinicId_accountNumber: t.Object(
                { clinicId: t.String(), accountNumber: t.String() },
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
              accountName: t.String(),
              accountNumber: t.String(),
              parentAccountId: t.String(),
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
              accountCurrencyCode: t.String(),
              taxRate: t.Number(),
              balanceMustBe: t.Union(
                [t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")],
                { additionalProperties: false },
              ),
              freezeAccount: t.Boolean(),
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
  { $id: "LedgerAccount" },
);

export const LedgerAccountSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      clinicId: t.Boolean(),
      accountName: t.Boolean(),
      accountNumber: t.Boolean(),
      parentAccountId: t.Boolean(),
      isGroup: t.Boolean(),
      rootType: t.Boolean(),
      reportType: t.Boolean(),
      accountType: t.Boolean(),
      accountCurrencyCode: t.Boolean(),
      taxRate: t.Boolean(),
      balanceMustBe: t.Boolean(),
      freezeAccount: t.Boolean(),
      disabled: t.Boolean(),
      lft: t.Boolean(),
      rgt: t.Boolean(),
      createdById: t.Boolean(),
      createdAt: t.Boolean(),
      updatedAt: t.Boolean(),
      clinic: t.Boolean(),
      currency: t.Boolean(),
      parentAccount: t.Boolean(),
      children: t.Boolean(),
      defaultForModesOfPayment: t.Boolean(),
      offsettingForDimensions: t.Boolean(),
      closingHeadForPcvs: t.Boolean(),
      closingBalances: t.Boolean(),
      budgetRows: t.Boolean(),
      dimensionFilterRows: t.Boolean(),
      bankAccounts: t.Boolean(),
      bankRuleContras: t.Boolean(),
      glEntries: t.Boolean(),
      journalEntryRows: t.Boolean(),
      revaluationRows: t.Boolean(),
      partyAccounts: t.Boolean(),
      paymentLedgerEntries: t.Boolean(),
      advanceLedgerEntries: t.Boolean(),
      salesTaxRows: t.Boolean(),
      purchaseTaxRows: t.Boolean(),
      itemTaxDetails: t.Boolean(),
      salesInvoicesDebitTo: t.Boolean(),
      salesInvoicesUnrealizedPL: t.Boolean(),
      salesInvoicesAdditionalDiscount: t.Boolean(),
      salesInvoicesWriteOff: t.Boolean(),
      salesInvoiceItemsIncome: t.Boolean(),
      salesInvoiceItemsDiscount: t.Boolean(),
      salesInvoiceTaxRows: t.Boolean(),
      saleTaxRows: t.Boolean(),
      salesInvoiceDeferredItems: t.Boolean(),
      purchaseInvoiceDeferredItems: t.Boolean(),
      taxWithholdingCategories: t.Boolean(),
      posProfileWriteOffs: t.Boolean(),
      dunningTypeIncomes: t.Boolean(),
      subscriptionPlanIncomes: t.Boolean(),
      subscriptionPlanDeferred: t.Boolean(),
      clinicInvoiceTaxRows: t.Boolean(),
      salesInvoicePayments: t.Boolean(),
      purchaseInvoicesCreditTo: t.Boolean(),
      purchaseInvoicesCashBank: t.Boolean(),
      purchaseInvoicesUnrealizedPL: t.Boolean(),
      purchaseInvoicesAdditionalDiscount: t.Boolean(),
      purchaseInvoicesWriteOff: t.Boolean(),
      purchaseInvoiceItemsExpense: t.Boolean(),
      purchaseInvoiceTaxRows: t.Boolean(),
      paymentEntriesPaidFrom: t.Boolean(),
      paymentEntriesPaidTo: t.Boolean(),
      paymentEntryReferences: t.Boolean(),
      paymentEntryDeductions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LedgerAccountInclude = t.Partial(
  t.Object(
    {
      rootType: t.Boolean(),
      reportType: t.Boolean(),
      accountType: t.Boolean(),
      balanceMustBe: t.Boolean(),
      clinic: t.Boolean(),
      currency: t.Boolean(),
      parentAccount: t.Boolean(),
      children: t.Boolean(),
      defaultForModesOfPayment: t.Boolean(),
      offsettingForDimensions: t.Boolean(),
      closingHeadForPcvs: t.Boolean(),
      closingBalances: t.Boolean(),
      budgetRows: t.Boolean(),
      dimensionFilterRows: t.Boolean(),
      bankAccounts: t.Boolean(),
      bankRuleContras: t.Boolean(),
      glEntries: t.Boolean(),
      journalEntryRows: t.Boolean(),
      revaluationRows: t.Boolean(),
      partyAccounts: t.Boolean(),
      paymentLedgerEntries: t.Boolean(),
      advanceLedgerEntries: t.Boolean(),
      salesTaxRows: t.Boolean(),
      purchaseTaxRows: t.Boolean(),
      itemTaxDetails: t.Boolean(),
      salesInvoicesDebitTo: t.Boolean(),
      salesInvoicesUnrealizedPL: t.Boolean(),
      salesInvoicesAdditionalDiscount: t.Boolean(),
      salesInvoicesWriteOff: t.Boolean(),
      salesInvoiceItemsIncome: t.Boolean(),
      salesInvoiceItemsDiscount: t.Boolean(),
      salesInvoiceTaxRows: t.Boolean(),
      saleTaxRows: t.Boolean(),
      salesInvoiceDeferredItems: t.Boolean(),
      purchaseInvoiceDeferredItems: t.Boolean(),
      taxWithholdingCategories: t.Boolean(),
      posProfileWriteOffs: t.Boolean(),
      dunningTypeIncomes: t.Boolean(),
      subscriptionPlanIncomes: t.Boolean(),
      subscriptionPlanDeferred: t.Boolean(),
      clinicInvoiceTaxRows: t.Boolean(),
      salesInvoicePayments: t.Boolean(),
      purchaseInvoicesCreditTo: t.Boolean(),
      purchaseInvoicesCashBank: t.Boolean(),
      purchaseInvoicesUnrealizedPL: t.Boolean(),
      purchaseInvoicesAdditionalDiscount: t.Boolean(),
      purchaseInvoicesWriteOff: t.Boolean(),
      purchaseInvoiceItemsExpense: t.Boolean(),
      purchaseInvoiceTaxRows: t.Boolean(),
      paymentEntriesPaidFrom: t.Boolean(),
      paymentEntriesPaidTo: t.Boolean(),
      paymentEntryReferences: t.Boolean(),
      paymentEntryDeductions: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const LedgerAccountOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      clinicId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parentAccountId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isGroup: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      accountCurrencyCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      taxRate: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      freezeAccount: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const LedgerAccount = t.Composite(
  [LedgerAccountPlain, LedgerAccountRelations],
  { additionalProperties: false },
);

export const LedgerAccountInputCreate = t.Composite(
  [LedgerAccountPlainInputCreate, LedgerAccountRelationsInputCreate],
  { additionalProperties: false },
);

export const LedgerAccountInputUpdate = t.Composite(
  [LedgerAccountPlainInputUpdate, LedgerAccountRelationsInputUpdate],
  { additionalProperties: false },
);
