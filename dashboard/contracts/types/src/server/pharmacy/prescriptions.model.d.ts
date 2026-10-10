import Elysia from "elysia";
export declare const prescriptionsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "prescriptions.list": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAFT">, import("@sinclair/typebox").TLiteral<"ACTIVE">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            inpatientStayId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            prescriberId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.drugOptions": import("@sinclair/typebox").TObject<{
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.draftSig": import("@sinclair/typebox").TObject<{
            drugName: import("@sinclair/typebox").TString;
            doseText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            measuredText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            routeLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            frequencyLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            speciesLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            warnings: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "prescriptions.create": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            inpatientStayId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            notesAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.addItem": import("@sinclair/typebox").TObject<{
            nameSnapshot: import("@sinclair/typebox").TString;
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            catalogProductId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            frequency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            quantity: import("@sinclair/typebox").TString;
            quantityUnit: import("@sinclair/typebox").TString;
            prn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            instructionsAr: import("@sinclair/typebox").TString;
            refillsAllowed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            overrideReasonAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.updateItem": import("@sinclair/typebox").TObject<{
            nameSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            catalogProductId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            doseUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            frequency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            quantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            quantityUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            prn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            instructionsAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            refillsAllowed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            overrideReasonAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "prescriptions.cancel": import("@sinclair/typebox").TObject<{
            reasonAr: import("@sinclair/typebox").TString;
        }>;
        readonly "prescriptions.doseContext": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            genericKey: import("@sinclair/typebox").TString;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            frequencyCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            durationDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
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
