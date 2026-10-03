import Elysia from "elysia";
export declare const sopsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "sops.saveTemplate": import("@sinclair/typebox").TObject<{
            domain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"RADIOLOGY">, import("@sinclair/typebox").TLiteral<"OPERATION">]>;
            serviceId: import("@sinclair/typebox").TString;
            titleAr: import("@sinclair/typebox").TString;
            titleEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            reference: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sections: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                titleAr: import("@sinclair/typebox").TString;
                titleEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                steps: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    textAr: import("@sinclair/typebox").TString;
                    textEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    ownerRole: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    duration: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    critical: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                    required: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                    note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    responseType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CONFIRM">, import("@sinclair/typebox").TLiteral<"YES_NO_NA">, import("@sinclair/typebox").TLiteral<"TEXT">, import("@sinclair/typebox").TLiteral<"NUMBER">]>>;
                }>>;
            }>>;
        }>;
        readonly "sops.domainQuery": import("@sinclair/typebox").TObject<{
            domain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"RADIOLOGY">, import("@sinclair/typebox").TLiteral<"OPERATION">]>;
        }>;
        readonly "sops.runQuery": import("@sinclair/typebox").TObject<{
            labItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            radiologyItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "sops.ensureRun": import("@sinclair/typebox").TObject<{
            domain: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"RADIOLOGY">, import("@sinclair/typebox").TLiteral<"OPERATION">]>;
            serviceId: import("@sinclair/typebox").TString;
            labItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            radiologyItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "sops.respondStep": import("@sinclair/typebox").TObject<{
            response: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CONFIRMED">, import("@sinclair/typebox").TLiteral<"YES">, import("@sinclair/typebox").TLiteral<"NO">, import("@sinclair/typebox").TLiteral<"NA">]>]>;
            valueText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            valueNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
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
