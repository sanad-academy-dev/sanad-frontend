import Elysia from "elysia";
export declare const patientConsentsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "patientConsents.list.query": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "patientConsents.templates.query": import("@sinclair/typebox").TObject<{
            speciesKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            activeOnly: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "patientConsents.create": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            templateKey: import("@sinclair/typebox").TString;
            locale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AR">, import("@sinclair/typebox").TLiteral<"EN">, import("@sinclair/typebox").TLiteral<"BOTH">]>>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            inpatientStayId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "patientConsents.update": import("@sinclair/typebox").TObject<{
            fieldValues: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>, import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNull]>>;
            locale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"AR">, import("@sinclair/typebox").TLiteral<"EN">, import("@sinclair/typebox").TLiteral<"BOTH">]>>;
        }>;
        readonly "patientConsents.sign": import("@sinclair/typebox").TObject<{
            signerName: import("@sinclair/typebox").TString;
            signerRelationship: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            signatureMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAWN">, import("@sinclair/typebox").TLiteral<"TYPED">, import("@sinclair/typebox").TLiteral<"UPLOADED">, import("@sinclair/typebox").TLiteral<"VERBAL_WITNESSED">]>;
            signatureUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            witnessStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "patientConsents.revoke": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TString;
        }>;
        readonly "patientConsents.draftField": import("@sinclair/typebox").TObject<{
            fieldKey: import("@sinclair/typebox").TString;
        }>;
        readonly "patientConsents.extractScan": import("@sinclair/typebox").TObject<{
            imageDataUrl: import("@sinclair/typebox").TString;
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
