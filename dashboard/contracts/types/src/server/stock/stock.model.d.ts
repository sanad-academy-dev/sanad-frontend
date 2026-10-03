import Elysia from "elysia";
export declare const stockModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "stock.movement": import("@sinclair/typebox").TObject<{
            warehouseId: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"RECEIPT">, import("@sinclair/typebox").TLiteral<"ISSUE">]>;
            note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lines: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemId: import("@sinclair/typebox").TString;
                qty: import("@sinclair/typebox").TInteger;
            }>>;
        }>;
        readonly "stock.transfer": import("@sinclair/typebox").TObject<{
            fromWarehouseId: import("@sinclair/typebox").TString;
            toWarehouseId: import("@sinclair/typebox").TString;
            note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lines: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemId: import("@sinclair/typebox").TString;
                qty: import("@sinclair/typebox").TInteger;
            }>>;
        }>;
        readonly "stock.writeOff": import("@sinclair/typebox").TObject<{
            qty: import("@sinclair/typebox").TInteger;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "stock.warehouse.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            isDefault: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "stock.warehouse.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isDefault: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "stock.reconcile": import("@sinclair/typebox").TObject<{
            warehouseId: import("@sinclair/typebox").TString;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            lines: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                itemId: import("@sinclair/typebox").TString;
                actualQty: import("@sinclair/typebox").TInteger;
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
