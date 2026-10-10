import Elysia from "elysia";
export declare const mobileUnitsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "mobileUnits.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            branchId: import("@sinclair/typebox").TString;
            plateNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            vehicleMake: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            vehicleModel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            year: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            color: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "mobileUnits.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            plateNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            vehicleMake: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            vehicleModel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            year: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            color: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "mobileUnits.status": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OFFLINE">, import("@sinclair/typebox").TLiteral<"AVAILABLE">, import("@sinclair/typebox").TLiteral<"EN_ROUTE">, import("@sinclair/typebox").TLiteral<"ON_SITE">, import("@sinclair/typebox").TLiteral<"RETURNING">, import("@sinclair/typebox").TLiteral<"ON_BREAK">, import("@sinclair/typebox").TLiteral<"OUT_OF_SERVICE">]>;
        }>;
        readonly "mobileUnits.device.pair": import("@sinclair/typebox").TObject<{
            label: import("@sinclair/typebox").TString;
        }>;
        readonly "mobileUnits.crew.add": import("@sinclair/typebox").TObject<{
            staffId: import("@sinclair/typebox").TString;
            role: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRIVER">, import("@sinclair/typebox").TLiteral<"VET">, import("@sinclair/typebox").TLiteral<"TECHNICIAN">, import("@sinclair/typebox").TLiteral<"GROOMER">, import("@sinclair/typebox").TLiteral<"ASSISTANT">]>;
            isPrimary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "mobileUnits.list.query": import("@sinclair/typebox").TObject<{
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OFFLINE">, import("@sinclair/typebox").TLiteral<"AVAILABLE">, import("@sinclair/typebox").TLiteral<"EN_ROUTE">, import("@sinclair/typebox").TLiteral<"ON_SITE">, import("@sinclair/typebox").TLiteral<"RETURNING">, import("@sinclair/typebox").TLiteral<"ON_BREAK">, import("@sinclair/typebox").TLiteral<"OUT_OF_SERVICE">]>>;
            scope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"active">, import("@sinclair/typebox").TLiteral<"all">]>>;
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
