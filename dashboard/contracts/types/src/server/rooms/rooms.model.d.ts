import Elysia from "elysia";
export declare const roomsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "rooms.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"EXAMINATION">, import("@sinclair/typebox").TLiteral<"LABORATORY">, import("@sinclair/typebox").TLiteral<"WAITING">, import("@sinclair/typebox").TLiteral<"OPERATING">, import("@sinclair/typebox").TLiteral<"VACCINATION">, import("@sinclair/typebox").TLiteral<"ICU">, import("@sinclair/typebox").TLiteral<"GROOMING">, import("@sinclair/typebox").TLiteral<"WARD">, import("@sinclair/typebox").TLiteral<"ISOLATION">]>;
            capacity: import("@sinclair/typebox").TInteger;
            managerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            availableDevices: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            abilities: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "rooms.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"EXAMINATION">, import("@sinclair/typebox").TLiteral<"LABORATORY">, import("@sinclair/typebox").TLiteral<"WAITING">, import("@sinclair/typebox").TLiteral<"OPERATING">, import("@sinclair/typebox").TLiteral<"VACCINATION">, import("@sinclair/typebox").TLiteral<"ICU">, import("@sinclair/typebox").TLiteral<"GROOMING">, import("@sinclair/typebox").TLiteral<"WARD">, import("@sinclair/typebox").TLiteral<"ISOLATION">]>>;
            capacity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            managerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            availableDevices: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            abilities: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
