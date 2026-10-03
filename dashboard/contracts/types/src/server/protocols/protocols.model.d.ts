import Elysia from "elysia";
export declare const protocolsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "protocols.update": import("@sinclair/typebox").TObject<{
            avma: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            soapNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            avmaMedicine: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            fecava: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            wsava: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            esccap: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            operationPaymentGate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            operationCountsForMinor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            operationRecoveryScoreMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
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
