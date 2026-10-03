import Elysia from "elysia";
export declare const purchaseInvoiceModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-purchase-invoice.create": import("@sinclair/typebox").TObject<{
            postingDate: import("@sinclair/typebox").TString;
            dueDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            partyId: import("@sinclair/typebox").TString;
            creditToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            billNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            billDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            isPaid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            cashBankAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isReturn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            returnAgainstId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            updateOutstandingForSelf: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isOpening: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            taxesAndChargesTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            taxCategoryId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            applyDiscountOn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRAND_TOTAL">, import("@sinclair/typebox").TLiteral<"NET_TOTAL">]>>;
            additionalDiscountPercentage: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            discountAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isCashOrNonTradeDiscount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            additionalDiscountAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            disableRoundedTotal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            writeOffAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            writeOffAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            writeOffCostCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paymentTermsTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            ignoreDefaultPaymentTermsTemplate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                itemName: import("@sinclair/typebox").TString;
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                qty: import("@sinclair/typebox").TString;
                uom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                priceListRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                marginType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PERCENTAGE">, import("@sinclair/typebox").TLiteral<"AMOUNT">]>, import("@sinclair/typebox").TNull]>>;
                marginRateOrAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                discountPercentage: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                discountAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                rate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                isFreeItem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                expenseAccountId: import("@sinclair/typebox").TString;
                costCenterId: import("@sinclair/typebox").TString;
                itemTaxTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>;
            taxes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                chargeType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ACTUAL">, import("@sinclair/typebox").TLiteral<"ON_NET_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_AMOUNT">, import("@sinclair/typebox").TLiteral<"ON_PREVIOUS_ROW_TOTAL">, import("@sinclair/typebox").TLiteral<"ON_ITEM_QUANTITY">]>;
                accountHeadId: import("@sinclair/typebox").TString;
                rate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                taxAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                rowId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TNull]>>;
                description: import("@sinclair/typebox").TString;
                includedInPrintRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"TOTAL">, import("@sinclair/typebox").TLiteral<"VALUATION">, import("@sinclair/typebox").TLiteral<"VALUATION_AND_TOTAL">]>>;
                addDeductTax: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ADD">, import("@sinclair/typebox").TLiteral<"DEDUCT">]>>;
            }>>>;
            schedule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
                dueDate: import("@sinclair/typebox").TString;
                invoicePortion: import("@sinclair/typebox").TString;
                paymentAmount: import("@sinclair/typebox").TString;
                modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            }>>>;
            allocateAdvancesAutomatically: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            advances: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                referenceType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"payment_entry">, import("@sinclair/typebox").TLiteral<"journal_entry">]>;
                referenceId: import("@sinclair/typebox").TString;
                allocatedAmount: import("@sinclair/typebox").TString;
            }>>>;
        }>;
        readonly "accounting-purchase-invoice.hold": import("@sinclair/typebox").TObject<{
            holdComment: import("@sinclair/typebox").TString;
            releaseDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        }>;
        readonly "accounting-purchase-invoice.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"SUBMITTED">, import("@sinclair/typebox").TLiteral<"UNPAID">, import("@sinclair/typebox").TLiteral<"PAID">, import("@sinclair/typebox").TLiteral<"PARTLY_PAID">, import("@sinclair/typebox").TLiteral<"OVERDUE">, import("@sinclair/typebox").TLiteral<"RETURN">, import("@sinclair/typebox").TLiteral<"DEBIT_NOTE_ISSUED">, import("@sinclair/typebox").TLiteral<"INTERNAL_TRANSFER">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isReturn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            onHold: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
}, {}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
