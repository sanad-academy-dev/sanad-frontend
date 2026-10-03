import Elysia from "elysia";
export declare const ownersModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "owners.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            phone: import("@sinclair/typebox").TString;
            email: import("@sinclair/typebox").TString;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>>;
            ownerType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"VIP">, import("@sinclair/typebox").TLiteral<"LOYALTY">, import("@sinclair/typebox").TLiteral<"NEW">, import("@sinclair/typebox").TLiteral<"CURRENT">]>>;
            relationship: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OWNER">, import("@sinclair/typebox").TLiteral<"GUARDIAN">, import("@sinclair/typebox").TLiteral<"DELEGATE">, import("@sinclair/typebox").TLiteral<"EMERGENCY">]>]>>;
            country: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            patientIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "owners.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            phone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>]>>;
            ownerType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"VIP">, import("@sinclair/typebox").TLiteral<"LOYALTY">, import("@sinclair/typebox").TLiteral<"NEW">, import("@sinclair/typebox").TLiteral<"CURRENT">]>>;
            relationship: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OWNER">, import("@sinclair/typebox").TLiteral<"GUARDIAN">, import("@sinclair/typebox").TLiteral<"DELEGATE">, import("@sinclair/typebox").TLiteral<"EMERGENCY">]>]>>;
            country: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            patientIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "owners.disable": import("@sinclair/typebox").TObject<{
            newOwnerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "owners.delete": import("@sinclair/typebox").TObject<{
            newOwnerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
