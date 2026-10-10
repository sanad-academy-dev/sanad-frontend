import Elysia from "elysia";
export declare const purchasingModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "purchasing.create": import("@sinclair/typebox").TObject<{
            supplierId: import("@sinclair/typebox").TString;
            warehouseId: import("@sinclair/typebox").TString;
            expectedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lines: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemId: import("@sinclair/typebox").TString;
                qtyOrdered: import("@sinclair/typebox").TInteger;
                unitCost: import("@sinclair/typebox").TNumber;
            }>>;
        }>;
        readonly "purchasing.receive": import("@sinclair/typebox").TObject<{
            lines: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemId: import("@sinclair/typebox").TString;
                qty: import("@sinclair/typebox").TInteger;
                batchNo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                expiryDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>>;
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
