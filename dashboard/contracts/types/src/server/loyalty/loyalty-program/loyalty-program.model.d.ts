import Elysia from "elysia";
export declare const loyaltyProgramModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "loyaltyProgram.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            earnRate: import("@sinclair/typebox").TNumber;
            redemptionRate: import("@sinclair/typebox").TNumber;
            minRedemptionPoints: import("@sinclair/typebox").TInteger;
            maxRedemptionPercent: import("@sinclair/typebox").TNumber;
            pointsValidityMonths: import("@sinclair/typebox").TInteger;
            membershipMultiplier: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "loyaltyProgram.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            earnRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            redemptionRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            minRedemptionPoints: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            maxRedemptionPercent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            pointsValidityMonths: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            membershipMultiplier: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "loyaltyProgram.tier.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            minSpend: import("@sinclair/typebox").TNumber;
            earnMultiplier: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            order: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            colorToken: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"chart-1">, import("@sinclair/typebox").TLiteral<"chart-2">, import("@sinclair/typebox").TLiteral<"chart-3">, import("@sinclair/typebox").TLiteral<"chart-4">, import("@sinclair/typebox").TLiteral<"chart-5">, import("@sinclair/typebox").TLiteral<"chart-6">, import("@sinclair/typebox").TLiteral<"chart-7">, import("@sinclair/typebox").TLiteral<"chart-8">]>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "loyaltyProgram.tier.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            minSpend: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            earnMultiplier: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            order: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            colorToken: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"chart-1">, import("@sinclair/typebox").TLiteral<"chart-2">, import("@sinclair/typebox").TLiteral<"chart-3">, import("@sinclair/typebox").TLiteral<"chart-4">, import("@sinclair/typebox").TLiteral<"chart-5">, import("@sinclair/typebox").TLiteral<"chart-6">, import("@sinclair/typebox").TLiteral<"chart-7">, import("@sinclair/typebox").TLiteral<"chart-8">]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "loyaltyProgram.list.query": import("@sinclair/typebox").TObject<{
            includeInactive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
