import Elysia from "elysia";
/** [LY-P1] تحقّق مدخلات دفتر النقاط (TypeBox). */
export declare const loyaltyLedgerModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "loyaltyLedger.redemption.query": import("@sinclair/typebox").TObject<{
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "loyaltyLedger.redemptionPreview": import("@sinclair/typebox").TObject<{
            redeemPoints: import("@sinclair/typebox").TInteger;
        }>;
        readonly "loyaltyLedger.adjustment": import("@sinclair/typebox").TObject<{
            ownerId: import("@sinclair/typebox").TString;
            points: import("@sinclair/typebox").TInteger;
            reason: import("@sinclair/typebox").TString;
        }>;
        readonly "loyaltyLedger.clinicStatement.query": import("@sinclair/typebox").TObject<{
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"EARN">, import("@sinclair/typebox").TLiteral<"REDEEM">, import("@sinclair/typebox").TLiteral<"EXPIRY">, import("@sinclair/typebox").TLiteral<"REVERSAL">, import("@sinclair/typebox").TLiteral<"REDEMPTION_RESTORE">, import("@sinclair/typebox").TLiteral<"ADJUSTMENT">]>>;
            from: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "loyaltyLedger.statement.query": import("@sinclair/typebox").TObject<{
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
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
