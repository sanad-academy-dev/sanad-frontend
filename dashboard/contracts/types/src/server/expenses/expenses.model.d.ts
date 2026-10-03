import Elysia from "elysia";
export declare const expensesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "expenses.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            amount: import("@sinclair/typebox").TNumber;
            requesterId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            paymentMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"BANK_TRANSFER">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"CHEQUE">, import("@sinclair/typebox").TLiteral<"TREASURY">]>]>>;
            categoryLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            departmentLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            supplierId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            staffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            recoverFromPayroll: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            reminderEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            reminderOffset: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ONE_DAY">, import("@sinclair/typebox").TLiteral<"TWO_DAYS">, import("@sinclair/typebox").TLiteral<"THREE_DAYS">]>]>>;
            attachments: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LINK">, import("@sinclair/typebox").TLiteral<"DOCUMENT">]>;
                label: import("@sinclair/typebox").TString;
                url: import("@sinclair/typebox").TString;
                sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            }>>>;
        }>;
        readonly "expenses.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            amount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            paymentMethod: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"BANK_TRANSFER">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"CHEQUE">, import("@sinclair/typebox").TLiteral<"TREASURY">]>]>>;
            categoryLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            departmentLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            supplierId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            staffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            recoverFromPayroll: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            reminderEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            reminderOffset: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ONE_DAY">, import("@sinclair/typebox").TLiteral<"TWO_DAYS">, import("@sinclair/typebox").TLiteral<"THREE_DAYS">]>]>>;
            attachments: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LINK">, import("@sinclair/typebox").TLiteral<"DOCUMENT">]>;
                label: import("@sinclair/typebox").TString;
                url: import("@sinclair/typebox").TString;
                sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            }>>>;
        }>;
        readonly "expenses.sendReview": import("@sinclair/typebox").TObject<{
            recipientIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            subject: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            body: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "expenses.decision": import("@sinclair/typebox").TObject<{
            decision: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"approve">, import("@sinclair/typebox").TLiteral<"reject">, import("@sinclair/typebox").TLiteral<"disburse">]>;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            signed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            signatureName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notify: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "expenses.cancel": import("@sinclair/typebox").TObject<{
            cancelReason: import("@sinclair/typebox").TString;
        }>;
        readonly "expenses.addAttachment": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LINK">, import("@sinclair/typebox").TLiteral<"DOCUMENT">]>;
            label: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
            sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
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
