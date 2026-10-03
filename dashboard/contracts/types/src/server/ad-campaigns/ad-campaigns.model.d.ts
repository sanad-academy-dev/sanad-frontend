import Elysia from "elysia";
export declare const adCampaignsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "ad-campaigns.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            platform: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FACEBOOK">, import("@sinclair/typebox").TLiteral<"INSTAGRAM">]>;
            objective: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BRAND_AWARENESS">, import("@sinclair/typebox").TLiteral<"LEAD_GENERATION">, import("@sinclair/typebox").TLiteral<"STORE_VISITS">, import("@sinclair/typebox").TLiteral<"CUSTOMER_FEEDBACK">, import("@sinclair/typebox").TLiteral<"SALES">, import("@sinclair/typebox").TLiteral<"PRODUCT_AWARENESS">]>;
            socialAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "ad-campaigns.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            platform: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FACEBOOK">, import("@sinclair/typebox").TLiteral<"INSTAGRAM">]>>;
            objective: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BRAND_AWARENESS">, import("@sinclair/typebox").TLiteral<"LEAD_GENERATION">, import("@sinclair/typebox").TLiteral<"STORE_VISITS">, import("@sinclair/typebox").TLiteral<"CUSTOMER_FEEDBACK">, import("@sinclair/typebox").TLiteral<"SALES">, import("@sinclair/typebox").TLiteral<"PRODUCT_AWARENESS">]>>;
            socialAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            audienceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "ad-campaigns.status": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"PAUSED">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"FAILED">]>;
        }>;
        readonly "ad-campaigns.schedule": import("@sinclair/typebox").TObject<{
            startsAt: import("@sinclair/typebox").TString;
            endsAt: import("@sinclair/typebox").TString;
            budgetKind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DAILY">, import("@sinclair/typebox").TLiteral<"LIFETIME">]>;
            budgetAmount: import("@sinclair/typebox").TNumber;
            currency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "ad-campaigns.creative": import("@sinclair/typebox").TObject<{
            primaryText: import("@sinclair/typebox").TString;
            headline: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            linkUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            imageUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            source: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AI_GENERATED">, import("@sinclair/typebox").TLiteral<"LIBRARY">, import("@sinclair/typebox").TLiteral<"UPLOAD">, import("@sinclair/typebox").TLiteral<"TEMPLATE">]>;
            aiPrompt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            aiStyle: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            toneFormal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            toneFriendly: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            toneOptimist: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
        }>;
        readonly "ad-campaigns.list": import("@sinclair/typebox").TObject<{
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            platform: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FACEBOOK">, import("@sinclair/typebox").TLiteral<"INSTAGRAM">, import("@sinclair/typebox").TLiteral<"LINKEDIN">, import("@sinclair/typebox").TLiteral<"TIKTOK">, import("@sinclair/typebox").TLiteral<"X">, import("@sinclair/typebox").TLiteral<"PINTEREST">, import("@sinclair/typebox").TLiteral<"SNAPCHAT">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"PAUSED">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"FAILED">]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
