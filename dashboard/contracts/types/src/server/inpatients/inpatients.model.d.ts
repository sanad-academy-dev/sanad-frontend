import Elysia from "elysia";
export declare const inpatientsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "inpatients.request": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            branchId: import("@sinclair/typebox").TString;
            attendingStaffId: import("@sinclair/typebox").TString;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEDICAL">, import("@sinclair/typebox").TLiteral<"SURGICAL">, import("@sinclair/typebox").TLiteral<"ICU">, import("@sinclair/typebox").TLiteral<"ISOLATION">, import("@sinclair/typebox").TLiteral<"BOARDING">]>>;
            acuity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            presentingComplaint: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            admissionDiagnosis: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isolationReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            monitoringIntervalMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dailyRateServiceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            expectedDischargeAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            importPostOpOrders: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "inpatients.admit": import("@sinclair/typebox").TObject<{
            cageId: import("@sinclair/typebox").TString;
            expectedDischargeAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dailyRateServiceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.update": import("@sinclair/typebox").TObject<{
            acuity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>>;
            attendingStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            monitoringIntervalMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            expectedDischargeAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            admissionDiagnosis: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isolationReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dailyRateServiceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.transition": import("@sinclair/typebox").TObject<{
            to: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"REQUESTED">, import("@sinclair/typebox").TLiteral<"ADMITTED">, import("@sinclair/typebox").TLiteral<"IN_CARE">, import("@sinclair/typebox").TLiteral<"DISCHARGE_PENDING">, import("@sinclair/typebox").TLiteral<"DISCHARGED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
            overrideReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            cancelReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.discharge": import("@sinclair/typebox").TObject<{
            dischargeKind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ROUTINE">, import("@sinclair/typebox").TLiteral<"AGAINST_MEDICAL_ADVICE">, import("@sinclair/typebox").TLiteral<"TRANSFERRED">, import("@sinclair/typebox").TLiteral<"DIED">, import("@sinclair/typebox").TLiteral<"EUTHANIZED">]>;
            dischargeSummaryAr: import("@sinclair/typebox").TString;
            dischargeInstructionsAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            overrideReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.assignCage": import("@sinclair/typebox").TObject<{
            cageId: import("@sinclair/typebox").TString;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.note": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
            mentionUserIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            handover: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "inpatients.createOrder": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEDICATION">, import("@sinclair/typebox").TLiteral<"FLUID">, import("@sinclair/typebox").TLiteral<"MONITORING">, import("@sinclair/typebox").TLiteral<"FEEDING">, import("@sinclair/typebox").TLiteral<"ACTIVITY">, import("@sinclair/typebox").TLiteral<"WOUND_CARE">, import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"IMAGING">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            catalogProductId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            nameSnapshot: import("@sinclair/typebox").TString;
            doseAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            doseUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IV">, import("@sinclair/typebox").TLiteral<"IM">, import("@sinclair/typebox").TLiteral<"SC">, import("@sinclair/typebox").TLiteral<"PO">, import("@sinclair/typebox").TLiteral<"INHALATION">, import("@sinclair/typebox").TLiteral<"TOPICAL">, import("@sinclair/typebox").TLiteral<"EPIDURAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            rateMlPerHour: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            overrideReasonAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            scheduleIntervalHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            scheduleTimes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            prn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            startAt: import("@sinclair/typebox").TString;
            endAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            instructionsAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.discontinueOrder": import("@sinclair/typebox").TObject<{
            reasonAr: import("@sinclair/typebox").TString;
        }>;
        readonly "inpatients.giveAdministration": import("@sinclair/typebox").TObject<{
            doseGivenAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            doseGivenUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            stockQuantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            batchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            witnessId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notesAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            eatenFraction: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            urination: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            defecation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            vomiting: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
        }>;
        readonly "inpatients.skipAdministration": import("@sinclair/typebox").TObject<{
            skipReasonAr: import("@sinclair/typebox").TString;
            hold: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        /** جرعة «عند اللزوم» — تُنشأ لحظة إعطائها لأنها بلا موعد مسبق */
        readonly "inpatients.prnAdministration": import("@sinclair/typebox").TObject<{
            orderId: import("@sinclair/typebox").TString;
            doseGivenAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            doseGivenUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            stockQuantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            batchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            witnessId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notesAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.recordVitals": import("@sinclair/typebox").TObject<{
            administrationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            recordedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            temperature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            heartRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            respiratoryRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            oxygenSaturation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            bloodPressure: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            painScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            bodyConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            capillaryRefillSec: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            mucousMembrane: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PINK">, import("@sinclair/typebox").TLiteral<"PALE">, import("@sinclair/typebox").TLiteral<"CYANOTIC">, import("@sinclair/typebox").TLiteral<"ICTERIC">, import("@sinclair/typebox").TLiteral<"CONGESTED">, import("@sinclair/typebox").TLiteral<"MUDDY">]>]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.payInvoice": import("@sinclair/typebox").TObject<{
            amountPaid: import("@sinclair/typebox").TNumber;
            paymentMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"TRANSFER">]>;
        }>;
        readonly "inpatients.createCage": import("@sinclair/typebox").TObject<{
            roomId: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TString;
            sizeClass: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"WALK_IN">]>]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.updateCage": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            sizeClass: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"WALK_IN">]>]>>;
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
