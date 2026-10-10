import Elysia from "elysia";
export declare const branchesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "branches.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            branchCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            icon: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            address: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PRIMARY">, import("@sinclair/typebox").TLiteral<"SUB">]>;
            managerIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            phone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            enableWarehouse: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "branches.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            icon: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            address: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PRIMARY">, import("@sinclair/typebox").TLiteral<"SUB">]>>;
            managerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            city: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            phone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            emergencyNotifications: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "branches.assignUser": import("@sinclair/typebox").TObject<{
            userId: import("@sinclair/typebox").TString;
        }>;
        readonly "branches.updateSettings": import("@sinclair/typebox").TUnknown;
        readonly "branches.setManagers": import("@sinclair/typebox").TObject<{
            managerIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        }>;
        readonly "branches.warehouseState": import("@sinclair/typebox").TObject<{
            enabled: import("@sinclair/typebox").TBoolean;
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
