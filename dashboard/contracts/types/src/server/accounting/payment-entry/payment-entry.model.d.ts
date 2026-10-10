import type { TLiteral } from "@sinclair/typebox";
import Elysia from "elysia";
export declare const paymentEntryReferenceRowSchema: import("@sinclair/typebox").TObject<{
    referenceDoctype: import("@sinclair/typebox").TUnion<[TLiteral<"sales_invoice">, TLiteral<"purchase_invoice">, TLiteral<"journal_entry">, TLiteral<"insurance_claim">]>;
    referenceId: import("@sinclair/typebox").TString;
    allocatedAmount: import("@sinclair/typebox").TString;
}>;
export declare const paymentEntryModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-payment-entry.create": import("@sinclair/typebox").TObject<{
            paymentType: import("@sinclair/typebox").TUnion<[TLiteral<"RECEIVE">, TLiteral<"PAY">, TLiteral<"INTERNAL_TRANSFER">]>;
            postingDate: import("@sinclair/typebox").TString;
            partyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            modeOfPaymentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidFromId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            paidAmount: import("@sinclair/typebox").TString;
            receivedAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            referenceNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            referenceDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            isOpening: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            costCenterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            projectId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            remarks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            references: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                referenceDoctype: import("@sinclair/typebox").TUnion<[TLiteral<"sales_invoice">, TLiteral<"purchase_invoice">, TLiteral<"journal_entry">, TLiteral<"insurance_claim">]>;
                referenceId: import("@sinclair/typebox").TString;
                allocatedAmount: import("@sinclair/typebox").TString;
            }>>>;
            deductions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                accountId: import("@sinclair/typebox").TString;
                costCenterId: import("@sinclair/typebox").TString;
                amount: import("@sinclair/typebox").TString;
            }>>>;
        }>;
        readonly "accounting-payment-entry.outstanding": import("@sinclair/typebox").TObject<{
            partyType: import("@sinclair/typebox").TString;
            partyId: import("@sinclair/typebox").TString;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            minAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            maxAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "accounting-payment-entry.list": import("@sinclair/typebox").TObject<{
            docstatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[TLiteral<"DRAFT">, TLiteral<"SUBMITTED">, TLiteral<"CANCELLED">]>>;
            paymentType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[TLiteral<"RECEIVE">, TLiteral<"PAY">, TLiteral<"INTERNAL_TRANSFER">]>>;
            partyId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            fromDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            toDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
