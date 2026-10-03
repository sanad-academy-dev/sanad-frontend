import Elysia from "elysia";
import { RadiologyLaterality, RadiologyStage, RadiologyStatus } from "@/generated/prisma/enums";
export declare const radiologyController: Elysia<"/radiology", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "radiology.create": import("@sinclair/typebox").TObject<{
            branchId: import("@sinclair/typebox").TString;
            patientId: import("@sinclair/typebox").TString;
            ownerId: import("@sinclair/typebox").TString;
            serviceIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            inpatientStayId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            assignedToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            requestedById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>]>>;
            isUrgent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            clinicalInfo: import("@sinclair/typebox").TString;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bodyPart: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            laterality: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"LEFT">, import("@sinclair/typebox").TLiteral<"RIGHT">, import("@sinclair/typebox").TLiteral<"BILATERAL">]>]>>;
            views: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            withContrast: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            origin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VISIT">, import("@sinclair/typebox").TLiteral<"DIRECT">]>>;
            scheduledAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "radiology.updateStatus": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"QUEUE">, import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"PREPARATION">, import("@sinclair/typebox").TLiteral<"IMAGING">, import("@sinclair/typebox").TLiteral<"REPORTING">, import("@sinclair/typebox").TLiteral<"UNDER_REVIEW">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
        }>;
        readonly "radiology.updateStage": import("@sinclair/typebox").TObject<{
            stage: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SAFETY_SCREENING">, import("@sinclair/typebox").TLiteral<"PATIENT_PREP">, import("@sinclair/typebox").TLiteral<"ROOM_ASSIGNMENT">, import("@sinclair/typebox").TLiteral<"READY_CHECK">, import("@sinclair/typebox").TLiteral<"ACQUISITION">, import("@sinclair/typebox").TLiteral<"IMAGE_UPLOAD">, import("@sinclair/typebox").TLiteral<"IMAGE_QC">]>;
        }>;
        readonly "radiology.assign": import("@sinclair/typebox").TObject<{
            assignedToId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "radiology.safety": import("@sinclair/typebox").TObject<{
            fastingStatus: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FASTED">, import("@sinclair/typebox").TLiteral<"PARTIAL">, import("@sinclair/typebox").TLiteral<"NOT_FASTED">]>]>>;
            fastingHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            medications: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            pregnancyPossible: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            metalImplants: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            implantNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            priorContrastReaction: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            allergies: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            asaClass: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
        }>;
        readonly "radiology.prep": import("@sinclair/typebox").TObject<{
            positioning: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sedationUsed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"ANXIOLYSIS">, import("@sinclair/typebox").TLiteral<"SEDATION">, import("@sinclair/typebox").TLiteral<"GENERAL_ANESTHESIA">]>]>>;
            sedationAgent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "radiology.assignMachine": import("@sinclair/typebox").TObject<{
            machineId: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
        }>;
        readonly "radiology.acquisition": import("@sinclair/typebox").TObject<{
            performedById: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            viewsPerformed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            exposuresCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            retakeCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            kvp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            mas: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            doseDap: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            ctdiVol: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            dlp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            contrastUsed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            contrastAgent: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            contrastRoute: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IV">, import("@sinclair/typebox").TLiteral<"ORAL">, import("@sinclair/typebox").TLiteral<"RECTAL">, import("@sinclair/typebox").TLiteral<"INTRA_ARTICULAR">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            contrastVolumeMl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            contrastLot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            executionNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "radiology.registerStudy": import("@sinclair/typebox").TObject<{
            studyUid: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            studyDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            modality: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"XRAY">, import("@sinclair/typebox").TLiteral<"CT">, import("@sinclair/typebox").TLiteral<"MRI">, import("@sinclair/typebox").TLiteral<"ULTRASOUND">, import("@sinclair/typebox").TLiteral<"FLUOROSCOPY">, import("@sinclair/typebox").TLiteral<"MAMMOGRAPHY">, import("@sinclair/typebox").TLiteral<"NUCLEAR">, import("@sinclair/typebox").TLiteral<"PET">, import("@sinclair/typebox").TLiteral<"DENTAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            series: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                seriesUid: import("@sinclair/typebox").TString;
                seriesNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                modalityCode: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                bodyPart: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                instances: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    sopUid: import("@sinclair/typebox").TString;
                    instanceNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                    kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DICOM">, import("@sinclair/typebox").TLiteral<"IMAGE">]>>;
                    fileKey: import("@sinclair/typebox").TString;
                    fileName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                    mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    transferSyntax: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                    rows: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                    columns: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                    frames: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
                }>>;
            }>>;
        }>;
        readonly "radiology.imageQc": import("@sinclair/typebox").TObject<{
            imageQuality: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DIAGNOSTIC">, import("@sinclair/typebox").TLiteral<"LIMITED">, import("@sinclair/typebox").TLiteral<"NON_DIAGNOSTIC">]>;
            qcNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "radiology.saveReport": import("@sinclair/typebox").TObject<{
            technique: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            comparison: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            findings: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            impression: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            recommendations: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            criticalFinding: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            criticalNotifiedTo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            criticalNotifiedToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "radiology.askAi": import("@sinclair/typebox").TObject<{
            imageDataUrl: import("@sinclair/typebox").TString;
            question: import("@sinclair/typebox").TString;
        }>;
        readonly "radiology.reject": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TString;
        }>;
        readonly "radiology.decline": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TString;
        }>;
        readonly "radiology.confirm": import("@sinclair/typebox").TObject<{
            scheduledAt: import("@sinclair/typebox").TString;
            assignedToId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "radiology.template": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            modality: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"XRAY">, import("@sinclair/typebox").TLiteral<"CT">, import("@sinclair/typebox").TLiteral<"MRI">, import("@sinclair/typebox").TLiteral<"ULTRASOUND">, import("@sinclair/typebox").TLiteral<"FLUOROSCOPY">, import("@sinclair/typebox").TLiteral<"MAMMOGRAPHY">, import("@sinclair/typebox").TLiteral<"NUCLEAR">, import("@sinclair/typebox").TLiteral<"PET">, import("@sinclair/typebox").TLiteral<"DENTAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            serviceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            technique: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            comparison: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            findings: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            impression: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            recommendations: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isDefault: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "radiology.addendum": import("@sinclair/typebox").TObject<{
            text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            mentionedStaffIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            attachments: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                fileKey: import("@sinclair/typebox").TString;
                fileName: import("@sinclair/typebox").TString;
                mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            }>>>;
        }>;
        readonly "radiology.comment": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
            mentionedStaffIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "radiology.reschedule": import("@sinclair/typebox").TObject<{
            scheduledAt: import("@sinclair/typebox").TString;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "radiology.approve": import("@sinclair/typebox").TObject<{
            note: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "radiology.updatePriority": import("@sinclair/typebox").TObject<{
            priority: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>]>;
        }>;
        readonly "radiology.payInvoice": import("@sinclair/typebox").TObject<{
            amountPaid: import("@sinclair/typebox").TNumber;
            paymentMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"TRANSFER">]>;
            itemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            insurance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                apply: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                excludedLineRefs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            }>>;
        }>;
        readonly "radiology.listQuery": import("@sinclair/typebox").TObject<{
            period: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"day">, import("@sinclair/typebox").TLiteral<"week">, import("@sinclair/typebox").TLiteral<"all">]>>;
            view: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"all">, import("@sinclair/typebox").TLiteral<"for-me">]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requireClinic: boolean;
    }>;
    macroFn: {
        readonly requireClinic: {
            readonly resolve: ({ request }: {
                body: unknown;
                query: Record<string, string>;
                params: {};
                headers: Record<string, string | undefined>;
                cookie: Record<string, import("elysia").Cookie<unknown>>;
                server: import("elysia/universal/server").Server | null;
                redirect: import("elysia").redirect;
                set: {
                    headers: import("elysia").HTTPHeaders;
                    status?: number | keyof import("elysia").StatusMap;
                    redirect?: string;
                    cookie?: Record<string, import("elysia/cookies").ElysiaCookie>;
                };
                path: string;
                route: string;
                request: Request;
                store: {};
                status: <const Code extends number | keyof import("elysia").StatusMap, const T = Code extends 200 | 100 | 101 | 102 | 103 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 300 | 301 | 302 | 303 | 304 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 ? {
                    readonly 100: "Continue";
                    readonly 101: "Switching Protocols";
                    readonly 102: "Processing";
                    readonly 103: "Early Hints";
                    readonly 200: "OK";
                    readonly 201: "Created";
                    readonly 202: "Accepted";
                    readonly 203: "Non-Authoritative Information";
                    readonly 204: "No Content";
                    readonly 205: "Reset Content";
                    readonly 206: "Partial Content";
                    readonly 207: "Multi-Status";
                    readonly 208: "Already Reported";
                    readonly 300: "Multiple Choices";
                    readonly 301: "Moved Permanently";
                    readonly 302: "Found";
                    readonly 303: "See Other";
                    readonly 304: "Not Modified";
                    readonly 307: "Temporary Redirect";
                    readonly 308: "Permanent Redirect";
                    readonly 400: "Bad Request";
                    readonly 401: "Unauthorized";
                    readonly 402: "Payment Required";
                    readonly 403: "Forbidden";
                    readonly 404: "Not Found";
                    readonly 405: "Method Not Allowed";
                    readonly 406: "Not Acceptable";
                    readonly 407: "Proxy Authentication Required";
                    readonly 408: "Request Timeout";
                    readonly 409: "Conflict";
                    readonly 410: "Gone";
                    readonly 411: "Length Required";
                    readonly 412: "Precondition Failed";
                    readonly 413: "Payload Too Large";
                    readonly 414: "URI Too Long";
                    readonly 415: "Unsupported Media Type";
                    readonly 416: "Range Not Satisfiable";
                    readonly 417: "Expectation Failed";
                    readonly 418: "I'm a teapot";
                    readonly 420: "Enhance Your Calm";
                    readonly 421: "Misdirected Request";
                    readonly 422: "Unprocessable Content";
                    readonly 423: "Locked";
                    readonly 424: "Failed Dependency";
                    readonly 425: "Too Early";
                    readonly 426: "Upgrade Required";
                    readonly 428: "Precondition Required";
                    readonly 429: "Too Many Requests";
                    readonly 431: "Request Header Fields Too Large";
                    readonly 451: "Unavailable For Legal Reasons";
                    readonly 500: "Internal Server Error";
                    readonly 501: "Not Implemented";
                    readonly 502: "Bad Gateway";
                    readonly 503: "Service Unavailable";
                    readonly 504: "Gateway Timeout";
                    readonly 505: "HTTP Version Not Supported";
                    readonly 506: "Variant Also Negotiates";
                    readonly 507: "Insufficient Storage";
                    readonly 508: "Loop Detected";
                    readonly 510: "Not Extended";
                    readonly 511: "Network Authentication Required";
                }[Code] : Code>(code: Code, response?: T) => import("elysia").ElysiaCustomStatusResponse<Code, T, Code extends "Continue" | "Switching Protocols" | "Processing" | "Early Hints" | "OK" | "Created" | "Accepted" | "Non-Authoritative Information" | "No Content" | "Reset Content" | "Partial Content" | "Multi-Status" | "Already Reported" | "Multiple Choices" | "Moved Permanently" | "Found" | "See Other" | "Not Modified" | "Temporary Redirect" | "Permanent Redirect" | "Bad Request" | "Unauthorized" | "Payment Required" | "Forbidden" | "Not Found" | "Method Not Allowed" | "Not Acceptable" | "Proxy Authentication Required" | "Request Timeout" | "Conflict" | "Gone" | "Length Required" | "Precondition Failed" | "Payload Too Large" | "URI Too Long" | "Unsupported Media Type" | "Range Not Satisfiable" | "Expectation Failed" | "I'm a teapot" | "Enhance Your Calm" | "Misdirected Request" | "Unprocessable Content" | "Locked" | "Failed Dependency" | "Too Early" | "Upgrade Required" | "Precondition Required" | "Too Many Requests" | "Request Header Fields Too Large" | "Unavailable For Legal Reasons" | "Internal Server Error" | "Not Implemented" | "Bad Gateway" | "Service Unavailable" | "Gateway Timeout" | "HTTP Version Not Supported" | "Variant Also Negotiates" | "Insufficient Storage" | "Loop Detected" | "Not Extended" | "Network Authentication Required" ? {
                    readonly Continue: 100;
                    readonly "Switching Protocols": 101;
                    readonly Processing: 102;
                    readonly "Early Hints": 103;
                    readonly OK: 200;
                    readonly Created: 201;
                    readonly Accepted: 202;
                    readonly "Non-Authoritative Information": 203;
                    readonly "No Content": 204;
                    readonly "Reset Content": 205;
                    readonly "Partial Content": 206;
                    readonly "Multi-Status": 207;
                    readonly "Already Reported": 208;
                    readonly "Multiple Choices": 300;
                    readonly "Moved Permanently": 301;
                    readonly Found: 302;
                    readonly "See Other": 303;
                    readonly "Not Modified": 304;
                    readonly "Temporary Redirect": 307;
                    readonly "Permanent Redirect": 308;
                    readonly "Bad Request": 400;
                    readonly Unauthorized: 401;
                    readonly "Payment Required": 402;
                    readonly Forbidden: 403;
                    readonly "Not Found": 404;
                    readonly "Method Not Allowed": 405;
                    readonly "Not Acceptable": 406;
                    readonly "Proxy Authentication Required": 407;
                    readonly "Request Timeout": 408;
                    readonly Conflict: 409;
                    readonly Gone: 410;
                    readonly "Length Required": 411;
                    readonly "Precondition Failed": 412;
                    readonly "Payload Too Large": 413;
                    readonly "URI Too Long": 414;
                    readonly "Unsupported Media Type": 415;
                    readonly "Range Not Satisfiable": 416;
                    readonly "Expectation Failed": 417;
                    readonly "I'm a teapot": 418;
                    readonly "Enhance Your Calm": 420;
                    readonly "Misdirected Request": 421;
                    readonly "Unprocessable Content": 422;
                    readonly Locked: 423;
                    readonly "Failed Dependency": 424;
                    readonly "Too Early": 425;
                    readonly "Upgrade Required": 426;
                    readonly "Precondition Required": 428;
                    readonly "Too Many Requests": 429;
                    readonly "Request Header Fields Too Large": 431;
                    readonly "Unavailable For Legal Reasons": 451;
                    readonly "Internal Server Error": 500;
                    readonly "Not Implemented": 501;
                    readonly "Bad Gateway": 502;
                    readonly "Service Unavailable": 503;
                    readonly "Gateway Timeout": 504;
                    readonly "HTTP Version Not Supported": 505;
                    readonly "Variant Also Negotiates": 506;
                    readonly "Insufficient Storage": 507;
                    readonly "Loop Detected": 508;
                    readonly "Not Extended": 510;
                    readonly "Network Authentication Required": 511;
                }[Code] : Code>;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | {
                clinicId: string;
                userId: string;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    radiology: {};
} & {
    radiology: {
        stats: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        total: number;
                        queue: number;
                        scheduled: number;
                        preparation: number;
                        imaging: number;
                        reporting: number;
                        underReview: number;
                        completed: number;
                        urgent: number;
                        criticalFindings: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    radiology: {
        get: {
            body: {};
            params: {};
            query: {
                branchId?: string | undefined;
                period?: "week" | "day" | "all" | undefined;
                appointmentId?: string | undefined;
                view?: "all" | "for-me" | undefined;
            };
            headers: {};
            response: {
                200: {
                    comments: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        body: string;
                        author: {
                            name: string;
                            id: string;
                        };
                        mentions: {
                            staff: {
                                name: string;
                                id: string;
                            };
                        }[];
                    }[];
                    branch: {
                        name: string;
                        id: string;
                    };
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        animalType: {
                            id: string;
                            arName: string;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                        } | null;
                        name: string;
                        id: string;
                        code: string;
                        gender: import("@/generated/prisma/enums").Gender;
                        age: number | null;
                    };
                    appointment: {
                        id: string;
                        code: string;
                        startsAt: Date;
                    } | null;
                    invoice: {
                        discount: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        vatRate: import("@prisma/client-runtime-utils").Decimal;
                        currencyCode: string;
                        code: string;
                        status: import("@/generated/prisma/enums").InvoiceStatus;
                        total: import("@prisma/client-runtime-utils").Decimal;
                        vatAmount: import("@prisma/client-runtime-utils").Decimal;
                        paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                        paidAt: Date | null;
                        appointmentId: string | null;
                        radiologyOrderId: string | null;
                        subtotal: import("@prisma/client-runtime-utils").Decimal;
                        amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        membershipId: string | null;
                        refundedAt: Date | null;
                        refundReason: string | null;
                        membershipAdjustments: {
                            id: string;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            lineRef: string;
                            benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                            unitsConsumed: number;
                        }[];
                    } | null;
                    priority: import("@/generated/prisma/enums").TaskPriority | null;
                    id: string;
                    clinicId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    branchId: string;
                    notes: string | null;
                    items: {
                        service: {
                            name: string;
                            id: string;
                        };
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        report: {
                            id: string;
                            updatedAt: Date;
                            itemId: string;
                            authoredBy: {
                                name: string;
                                id: string;
                            } | null;
                            findings: string | null;
                            technique: string | null;
                            comparison: string | null;
                            impression: string | null;
                            recommendations: string | null;
                            criticalFinding: boolean;
                            criticalNotifiedAt: Date | null;
                            criticalNotifiedTo: string | null;
                            criticalNotifiedToId: string | null;
                            aiDrafted: boolean;
                        } | null;
                        status: RadiologyStatus;
                        serviceId: string;
                        paidAt: Date | null;
                        rejectionReason: string | null;
                        completedAt: Date | null;
                        orderId: string;
                        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                        scheduledAt: Date | null;
                        reviewedAt: Date | null;
                        rejectedAt: Date | null;
                        assignedTo: {
                            name: string;
                            id: string;
                        } | null;
                        reviewedBy: {
                            name: string;
                            id: string;
                        } | null;
                        rejectedBy: {
                            name: string;
                            id: string;
                        } | null;
                        accession: string;
                        stage: RadiologyStage;
                        modality: import("@/generated/prisma/enums").RadiologyModality;
                        bodyPart: string | null;
                        laterality: RadiologyLaterality;
                        views: string[];
                        withContrast: boolean;
                        execution: {
                            id: string;
                            startedAt: Date | null;
                            finishedAt: Date | null;
                            itemId: string;
                            performedBy: {
                                name: string;
                                id: string;
                            } | null;
                            readyAt: Date | null;
                            machineId: string | null;
                            machineName: string | null;
                            roomName: string | null;
                            positioning: string | null;
                            sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                            sedationAgent: string | null;
                            viewsPerformed: string[];
                            exposuresCount: number | null;
                            retakeCount: number | null;
                            kvp: import("@prisma/client-runtime-utils").Decimal | null;
                            mas: import("@prisma/client-runtime-utils").Decimal | null;
                            doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                            ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                            dlp: import("@prisma/client-runtime-utils").Decimal | null;
                            contrastUsed: boolean | null;
                            contrastAgent: string | null;
                            contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                            contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                            contrastLot: string | null;
                            imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                            qcNotes: string | null;
                            executionNotes: string | null;
                        } | null;
                        studies: {
                            id: string;
                            createdAt: Date;
                            description: string | null;
                            itemId: string;
                            modality: import("@/generated/prisma/enums").RadiologyModality | null;
                            series: {
                                id: string;
                                description: string | null;
                                bodyPart: string | null;
                                seriesUid: string;
                                seriesNumber: number | null;
                                modalityCode: string | null;
                                instances: {
                                    id: string;
                                    rows: number | null;
                                    fileName: string | null;
                                    kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                    mimeType: string | null;
                                    sizeBytes: number | null;
                                    sopUid: string;
                                    instanceNumber: number | null;
                                    transferSyntax: string | null;
                                    columns: number | null;
                                    frames: number | null;
                                }[];
                            }[];
                            studyUid: string;
                            studyDate: Date | null;
                            uploadedBy: {
                                name: string;
                                id: string;
                            } | null;
                        }[];
                    }[];
                    appointmentId: string | null;
                    inpatientStayId: string | null;
                    patientId: string;
                    ownerId: string;
                    activity: {
                        type: import("@/generated/prisma/enums").RadiologyActivityType;
                        id: string;
                        createdAt: Date;
                        detail: string | null;
                        itemId: string | null;
                        author: {
                            name: string;
                            id: string;
                        } | null;
                    }[];
                    isUrgent: boolean;
                    requestedBy: {
                        name: string;
                        id: string;
                        phone: string | null;
                    } | null;
                    clinicalInfo: string | null;
                    safetyScreening: {
                        id: string;
                        vitalsRecordId: string | null;
                        vitalsRecord: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string | null;
                            notes: string | null;
                            editsCount: number;
                            operationId: string | null;
                            appointmentId: string | null;
                            labOrderId: string | null;
                            radiologyOrderId: string | null;
                            patientId: string;
                            source: import("@/generated/prisma/enums").VitalSignsSource;
                            weight: import("@prisma/client-runtime-utils").Decimal | null;
                            recordedAt: Date;
                            temperature: import("@prisma/client-runtime-utils").Decimal | null;
                            heartRate: number | null;
                            respiratoryRate: number | null;
                            oxygenSaturation: number | null;
                            bloodPressure: string | null;
                            painScore: number | null;
                            bodyConditionScore: number | null;
                            capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                            mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                            correctsId: string | null;
                            recordedBy: {
                                name: string;
                                id: string;
                            } | null;
                            correction: {
                                id: string;
                                code: string;
                                recordedAt: Date;
                            } | null;
                        } | null;
                        orderId: string;
                        fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                        fastingHours: number | null;
                        medications: string[];
                        pregnancyPossible: boolean | null;
                        metalImplants: boolean | null;
                        implantNotes: string | null;
                        priorContrastReaction: boolean | null;
                        allergies: string | null;
                        asaClass: number | null;
                    } | null;
                }[];
                401: {
                    readonly message: "غير مصرح";
                };
                422: {
                    type: "validation";
                    on: string;
                    summary?: string;
                    message?: string;
                    found?: unknown;
                    property?: string;
                    expected?: string;
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                status: {
                    patch: {
                        body: {
                            status: "CANCELLED" | "COMPLETED" | "SCHEDULED" | "QUEUE" | "UNDER_REVIEW" | "PREPARATION" | "IMAGING" | "REPORTING";
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            } | null;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: string;
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                stage: {
                    patch: {
                        body: {
                            stage: "SAFETY_SCREENING" | "PATIENT_PREP" | "ROOM_ASSIGNMENT" | "READY_CHECK" | "ACQUISITION" | "IMAGE_UPLOAD" | "IMAGE_QC";
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "المراحل الفرعية متاحة داخل «تحضير الطفل» و«التصوير» فقط";
                            } | {
                                readonly message: "هذه المرحلة لا تنتمي إلى حالة الفحص الحالية";
                            } | {
                                readonly message: "يمكن الانتقال خطوة واحدة بين المراحل";
                            } | {
                                readonly message: "ارفع صور الفحص أولًا قبل فحص جودتها";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                assign: {
                    patch: {
                        body: {
                            assignedToId: string | null;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        metrics: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("@/server/radiology/radiology.type").RadiologyTatMetrics;
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    radiology: {
        templates: {
            get: {
                body: {};
                params: {};
                query: {
                    serviceId?: string | undefined;
                    all?: string | undefined;
                    modality?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        service: {
                            name: string;
                            id: string;
                        } | null;
                        name: string;
                        id: string;
                        isDefault: boolean;
                        active: boolean;
                        serviceId: string | null;
                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                        findings: string | null;
                        technique: string | null;
                        comparison: string | null;
                        impression: string | null;
                        recommendations: string | null;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    radiology: {
        templates: {
            post: {
                body: {
                    isDefault?: boolean | undefined;
                    active?: boolean | undefined;
                    serviceId?: string | null | undefined;
                    modality?: "XRAY" | "CT" | "MRI" | "ULTRASOUND" | "FLUOROSCOPY" | "MAMMOGRAPHY" | "NUCLEAR" | "PET" | "DENTAL" | "OTHER" | null | undefined;
                    findings?: string | null | undefined;
                    technique?: string | null | undefined;
                    comparison?: string | null | undefined;
                    impression?: string | null | undefined;
                    recommendations?: string | null | undefined;
                    name: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    201: {
                        service: {
                            name: string;
                            id: string;
                        } | null;
                        name: string;
                        id: string;
                        isDefault: boolean;
                        active: boolean;
                        serviceId: string | null;
                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                        findings: string | null;
                        technique: string | null;
                        comparison: string | null;
                        impression: string | null;
                        recommendations: string | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    422: {
                        readonly message: "اربط القالب بفحص أو بطريقة تصوير";
                    } | {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    radiology: {
        templates: {
            ":templateId": {
                put: {
                    body: {
                        isDefault?: boolean | undefined;
                        active?: boolean | undefined;
                        serviceId?: string | null | undefined;
                        modality?: "XRAY" | "CT" | "MRI" | "ULTRASOUND" | "FLUOROSCOPY" | "MAMMOGRAPHY" | "NUCLEAR" | "PET" | "DENTAL" | "OTHER" | null | undefined;
                        findings?: string | null | undefined;
                        technique?: string | null | undefined;
                        comparison?: string | null | undefined;
                        impression?: string | null | undefined;
                        recommendations?: string | null | undefined;
                        name: string;
                    };
                    params: {
                        templateId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            service: {
                                name: string;
                                id: string;
                            } | null;
                            name: string;
                            id: string;
                            isDefault: boolean;
                            active: boolean;
                            serviceId: string | null;
                            modality: import("@/generated/prisma/enums").RadiologyModality | null;
                            findings: string | null;
                            technique: string | null;
                            comparison: string | null;
                            impression: string | null;
                            recommendations: string | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "القالب غير موجود";
                        };
                        422: {
                            readonly message: "اربط القالب بفحص أو بطريقة تصوير";
                        } | {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        templates: {
            ":templateId": {
                delete: {
                    body: {};
                    params: {
                        templateId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "القالب غير موجود";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                addenda: {
                    get: {
                        body: {};
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                text: string;
                                attachments: {
                                    id: string;
                                    fileName: string;
                                    mimeType: string | null;
                                    sizeBytes: number | null;
                                    fileKey: string;
                                }[];
                                id: string;
                                createdAt: Date;
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                                authoredBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                reportId: string;
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                addenda: {
                    post: {
                        body: {
                            text?: string | undefined;
                            attachments?: {
                                mimeType?: string | null | undefined;
                                sizeBytes?: number | null | undefined;
                                fileName: string;
                                fileKey: string;
                            }[] | undefined;
                            mentionedStaffIds?: string[] | undefined;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            201: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "اكتب نص الملحق أو أرفق ملفًا";
                            } | {
                                readonly message: "الملحق يُضاف بعد اعتماد التقرير فقط" | "لا يوجد تقرير لإلحاقه";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        ":id": {
            comments: {
                post: {
                    body: {
                        mentionedStaffIds?: string[] | undefined;
                        body: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        201: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                radiologyOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: {
                                    id: string;
                                    updatedAt: Date;
                                    itemId: string;
                                    authoredBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    findings: string | null;
                                    technique: string | null;
                                    comparison: string | null;
                                    impression: string | null;
                                    recommendations: string | null;
                                    criticalFinding: boolean;
                                    criticalNotifiedAt: Date | null;
                                    criticalNotifiedTo: string | null;
                                    criticalNotifiedToId: string | null;
                                    aiDrafted: boolean;
                                } | null;
                                status: RadiologyStatus;
                                serviceId: string;
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                accession: string;
                                stage: RadiologyStage;
                                modality: import("@/generated/prisma/enums").RadiologyModality;
                                bodyPart: string | null;
                                laterality: RadiologyLaterality;
                                views: string[];
                                withContrast: boolean;
                                execution: {
                                    id: string;
                                    startedAt: Date | null;
                                    finishedAt: Date | null;
                                    itemId: string;
                                    performedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    readyAt: Date | null;
                                    machineId: string | null;
                                    machineName: string | null;
                                    roomName: string | null;
                                    positioning: string | null;
                                    sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                    sedationAgent: string | null;
                                    viewsPerformed: string[];
                                    exposuresCount: number | null;
                                    retakeCount: number | null;
                                    kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                    mas: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                    ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                    dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastUsed: boolean | null;
                                    contrastAgent: string | null;
                                    contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                    contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastLot: string | null;
                                    imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                    qcNotes: string | null;
                                    executionNotes: string | null;
                                } | null;
                                studies: {
                                    id: string;
                                    createdAt: Date;
                                    description: string | null;
                                    itemId: string;
                                    modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                    series: {
                                        id: string;
                                        description: string | null;
                                        bodyPart: string | null;
                                        seriesUid: string;
                                        seriesNumber: number | null;
                                        modalityCode: string | null;
                                        instances: {
                                            id: string;
                                            rows: number | null;
                                            fileName: string | null;
                                            kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                            mimeType: string | null;
                                            sizeBytes: number | null;
                                            sopUid: string;
                                            instanceNumber: number | null;
                                            transferSyntax: string | null;
                                            columns: number | null;
                                            frames: number | null;
                                        }[];
                                    }[];
                                    studyUid: string;
                                    studyDate: Date | null;
                                    uploadedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").RadiologyActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            clinicalInfo: string | null;
                            safetyScreening: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                pregnancyPossible: boolean | null;
                                metalImplants: boolean | null;
                                implantNotes: string | null;
                                priorContrastReaction: boolean | null;
                                allergies: string | null;
                                asaClass: number | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
                        };
                        422: {
                            readonly message: "اكتب التعليق";
                        } | {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        comments: {
            ":commentId": {
                delete: {
                    body: {};
                    params: {
                        commentId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                radiologyOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: {
                                    id: string;
                                    updatedAt: Date;
                                    itemId: string;
                                    authoredBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    findings: string | null;
                                    technique: string | null;
                                    comparison: string | null;
                                    impression: string | null;
                                    recommendations: string | null;
                                    criticalFinding: boolean;
                                    criticalNotifiedAt: Date | null;
                                    criticalNotifiedTo: string | null;
                                    criticalNotifiedToId: string | null;
                                    aiDrafted: boolean;
                                } | null;
                                status: RadiologyStatus;
                                serviceId: string;
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                accession: string;
                                stage: RadiologyStage;
                                modality: import("@/generated/prisma/enums").RadiologyModality;
                                bodyPart: string | null;
                                laterality: RadiologyLaterality;
                                views: string[];
                                withContrast: boolean;
                                execution: {
                                    id: string;
                                    startedAt: Date | null;
                                    finishedAt: Date | null;
                                    itemId: string;
                                    performedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    readyAt: Date | null;
                                    machineId: string | null;
                                    machineName: string | null;
                                    roomName: string | null;
                                    positioning: string | null;
                                    sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                    sedationAgent: string | null;
                                    viewsPerformed: string[];
                                    exposuresCount: number | null;
                                    retakeCount: number | null;
                                    kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                    mas: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                    ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                    dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastUsed: boolean | null;
                                    contrastAgent: string | null;
                                    contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                    contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastLot: string | null;
                                    imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                    qcNotes: string | null;
                                    executionNotes: string | null;
                                } | null;
                                studies: {
                                    id: string;
                                    createdAt: Date;
                                    description: string | null;
                                    itemId: string;
                                    modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                    series: {
                                        id: string;
                                        description: string | null;
                                        bodyPart: string | null;
                                        seriesUid: string;
                                        seriesNumber: number | null;
                                        modalityCode: string | null;
                                        instances: {
                                            id: string;
                                            rows: number | null;
                                            fileName: string | null;
                                            kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                            mimeType: string | null;
                                            sizeBytes: number | null;
                                            sopUid: string;
                                            instanceNumber: number | null;
                                            transferSyntax: string | null;
                                            columns: number | null;
                                            frames: number | null;
                                        }[];
                                    }[];
                                    studyUid: string;
                                    studyDate: Date | null;
                                    uploadedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").RadiologyActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            clinicalInfo: string | null;
                            safetyScreening: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                pregnancyPossible: boolean | null;
                                metalImplants: boolean | null;
                                implantNotes: string | null;
                                priorContrastReaction: boolean | null;
                                allergies: string | null;
                                asaClass: number | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: "لا يمكنك حذف تعليق غيرك";
                        };
                        404: {
                            readonly message: "التعليق غير موجود";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                priors: {
                    get: {
                        body: {};
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                report: {
                                    findings: string | null;
                                    impression: string | null;
                                    criticalFinding: boolean;
                                } | null;
                                order: {
                                    id: string;
                                    code: string;
                                    clinicalInfo: string | null;
                                };
                                completedAt: Date | null;
                                accession: string;
                                modality: import("@/generated/prisma/enums").RadiologyModality;
                                bodyPart: string | null;
                                laterality: RadiologyLaterality;
                                studies: {
                                    id: string;
                                    description: string | null;
                                    series: {
                                        id: string;
                                        instances: {
                                            id: string;
                                        }[];
                                    }[];
                                    studyDate: Date | null;
                                }[];
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                schedule: {
                    patch: {
                        body: {
                            reason?: string | null | undefined;
                            scheduledAt: string;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "الموعد غير صالح";
                            } | {
                                readonly message: "لا يمكن تغيير موعد فحص بدأ العمل عليه";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                prep: {
                    patch: {
                        body: {
                            positioning?: string | null | undefined;
                            sedationUsed?: "NONE" | "ANXIOLYSIS" | "SEDATION" | "GENERAL_ANESTHESIA" | null | undefined;
                            sedationAgent?: string | null | undefined;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                machines: {
                    get: {
                        body: {};
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/radiology/radiology-machines.service").RadiologyMachineAvailability[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                machine: {
                    patch: {
                        body: {
                            machineId: string | null;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: string;
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                acquisition: {
                    patch: {
                        body: {
                            performedById?: string | null | undefined;
                            viewsPerformed?: string[] | undefined;
                            exposuresCount?: number | null | undefined;
                            retakeCount?: number | null | undefined;
                            kvp?: number | null | undefined;
                            mas?: number | null | undefined;
                            doseDap?: number | null | undefined;
                            ctdiVol?: number | null | undefined;
                            dlp?: number | null | undefined;
                            contrastUsed?: boolean | null | undefined;
                            contrastAgent?: string | null | undefined;
                            contrastRoute?: "OTHER" | "IV" | "ORAL" | "RECTAL" | "INTRA_ARTICULAR" | null | undefined;
                            contrastVolumeMl?: number | null | undefined;
                            contrastLot?: string | null | undefined;
                            executionNotes?: string | null | undefined;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                studies: {
                    post: {
                        body: {
                            description?: string | null | undefined;
                            modality?: "XRAY" | "CT" | "MRI" | "ULTRASOUND" | "FLUOROSCOPY" | "MAMMOGRAPHY" | "NUCLEAR" | "PET" | "DENTAL" | "OTHER" | null | undefined;
                            studyDate?: string | null | undefined;
                            series: {
                                description?: string | null | undefined;
                                bodyPart?: string | null | undefined;
                                seriesNumber?: number | null | undefined;
                                modalityCode?: string | null | undefined;
                                seriesUid: string;
                                instances: {
                                    rows?: number | null | undefined;
                                    fileName?: string | null | undefined;
                                    kind?: "DICOM" | "IMAGE" | undefined;
                                    mimeType?: string | null | undefined;
                                    sizeBytes?: number | null | undefined;
                                    instanceNumber?: number | null | undefined;
                                    transferSyntax?: string | null | undefined;
                                    columns?: number | null | undefined;
                                    frames?: number | null | undefined;
                                    sopUid: string;
                                    fileKey: string;
                                }[];
                            }[];
                            studyUid: string;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            201: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "لا يمكن إضافة صور لفحص مكتمل";
                            } | {
                                readonly message: "هذه الدراسة مسجّلة على فحص آخر — تحقّق من الملفات المرفوعة";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                "image-qc": {
                    patch: {
                        body: {
                            qcNotes?: string | null | undefined;
                            imageQuality: "DIAGNOSTIC" | "LIMITED" | "NON_DIAGNOSTIC";
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                report: {
                    patch: {
                        body: {
                            findings?: string | null | undefined;
                            technique?: string | null | undefined;
                            comparison?: string | null | undefined;
                            impression?: string | null | undefined;
                            recommendations?: string | null | undefined;
                            criticalFinding?: boolean | undefined;
                            criticalNotifiedTo?: string | null | undefined;
                            criticalNotifiedToId?: string | null | undefined;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "لا يمكن تعديل تقرير فحص مكتمل";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                "ask-ai": {
                    post: {
                        body: {
                            imageDataUrl: string;
                            question: string;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                answer: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "اكتب سؤالك عن المنطقة المحدّدة";
                            } | {
                                readonly message: "تعذّر قراءة المنطقة المحدّدة — أعد التحديد";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                            502: {
                                readonly message: "تعذّر الحصول على إجابة — أعد المحاولة";
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                approve: {
                    post: {
                        body: {
                            note?: string | null | undefined;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "الاعتماد متاح للفحوصات قيد المراجعة فقط";
                            } | {
                                readonly message: "اكتب الموجودات والانطباع في التقرير أولًا قبل إرساله للمراجعة";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        items: {
            ":itemId": {
                reject: {
                    post: {
                        body: {
                            reason: string;
                        };
                        params: {
                            itemId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "الرفض متاح للفحوصات قيد المراجعة فقط";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        instances: {
            ":instanceId": {
                file: {
                    get: {
                        body: {};
                        params: {
                            instanceId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: Response;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        images: {
            ":kind": {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                            kind: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                comments: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    body: string;
                                    author: {
                                        name: string;
                                        id: string;
                                    };
                                    mentions: {
                                        staff: {
                                            name: string;
                                            id: string;
                                        };
                                    }[];
                                }[];
                                branch: {
                                    name: string;
                                    id: string;
                                };
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                };
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    animalStrain: {
                                        id: string;
                                        arName: string;
                                    } | null;
                                    name: string;
                                    id: string;
                                    code: string;
                                    gender: import("@/generated/prisma/enums").Gender;
                                    age: number | null;
                                };
                                appointment: {
                                    id: string;
                                    code: string;
                                    startsAt: Date;
                                } | null;
                                invoice: {
                                    discount: import("@prisma/client-runtime-utils").Decimal;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    vatRate: import("@prisma/client-runtime-utils").Decimal;
                                    currencyCode: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").InvoiceStatus;
                                    total: import("@prisma/client-runtime-utils").Decimal;
                                    vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                    paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                    paidAt: Date | null;
                                    appointmentId: string | null;
                                    radiologyOrderId: string | null;
                                    subtotal: import("@prisma/client-runtime-utils").Decimal;
                                    amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                    membershipId: string | null;
                                    refundedAt: Date | null;
                                    refundReason: string | null;
                                    membershipAdjustments: {
                                        id: string;
                                        amount: import("@prisma/client-runtime-utils").Decimal;
                                        lineRef: string;
                                        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                        unitsConsumed: number;
                                    }[];
                                } | null;
                                priority: import("@/generated/prisma/enums").TaskPriority | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string;
                                notes: string | null;
                                items: {
                                    service: {
                                        name: string;
                                        id: string;
                                    };
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    report: {
                                        id: string;
                                        updatedAt: Date;
                                        itemId: string;
                                        authoredBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        findings: string | null;
                                        technique: string | null;
                                        comparison: string | null;
                                        impression: string | null;
                                        recommendations: string | null;
                                        criticalFinding: boolean;
                                        criticalNotifiedAt: Date | null;
                                        criticalNotifiedTo: string | null;
                                        criticalNotifiedToId: string | null;
                                        aiDrafted: boolean;
                                    } | null;
                                    status: RadiologyStatus;
                                    serviceId: string;
                                    paidAt: Date | null;
                                    rejectionReason: string | null;
                                    completedAt: Date | null;
                                    orderId: string;
                                    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                    scheduledAt: Date | null;
                                    reviewedAt: Date | null;
                                    rejectedAt: Date | null;
                                    assignedTo: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    reviewedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    rejectedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    accession: string;
                                    stage: RadiologyStage;
                                    modality: import("@/generated/prisma/enums").RadiologyModality;
                                    bodyPart: string | null;
                                    laterality: RadiologyLaterality;
                                    views: string[];
                                    withContrast: boolean;
                                    execution: {
                                        id: string;
                                        startedAt: Date | null;
                                        finishedAt: Date | null;
                                        itemId: string;
                                        performedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        readyAt: Date | null;
                                        machineId: string | null;
                                        machineName: string | null;
                                        roomName: string | null;
                                        positioning: string | null;
                                        sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                        sedationAgent: string | null;
                                        viewsPerformed: string[];
                                        exposuresCount: number | null;
                                        retakeCount: number | null;
                                        kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                        mas: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                        ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                        dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastUsed: boolean | null;
                                        contrastAgent: string | null;
                                        contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                        contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                        contrastLot: string | null;
                                        imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                        qcNotes: string | null;
                                        executionNotes: string | null;
                                    } | null;
                                    studies: {
                                        id: string;
                                        createdAt: Date;
                                        description: string | null;
                                        itemId: string;
                                        modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                        series: {
                                            id: string;
                                            description: string | null;
                                            bodyPart: string | null;
                                            seriesUid: string;
                                            seriesNumber: number | null;
                                            modalityCode: string | null;
                                            instances: {
                                                id: string;
                                                rows: number | null;
                                                fileName: string | null;
                                                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                                mimeType: string | null;
                                                sizeBytes: number | null;
                                                sopUid: string;
                                                instanceNumber: number | null;
                                                transferSyntax: string | null;
                                                columns: number | null;
                                                frames: number | null;
                                            }[];
                                        }[];
                                        studyUid: string;
                                        studyDate: Date | null;
                                        uploadedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                    }[];
                                }[];
                                appointmentId: string | null;
                                inpatientStayId: string | null;
                                patientId: string;
                                ownerId: string;
                                activity: {
                                    type: import("@/generated/prisma/enums").RadiologyActivityType;
                                    id: string;
                                    createdAt: Date;
                                    detail: string | null;
                                    itemId: string | null;
                                    author: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                                isUrgent: boolean;
                                requestedBy: {
                                    name: string;
                                    id: string;
                                    phone: string | null;
                                } | null;
                                clinicalInfo: string | null;
                                safetyScreening: {
                                    id: string;
                                    vitalsRecordId: string | null;
                                    vitalsRecord: {
                                        id: string;
                                        createdAt: Date;
                                        updatedAt: Date;
                                        code: string;
                                        branchId: string | null;
                                        notes: string | null;
                                        editsCount: number;
                                        operationId: string | null;
                                        appointmentId: string | null;
                                        labOrderId: string | null;
                                        radiologyOrderId: string | null;
                                        patientId: string;
                                        source: import("@/generated/prisma/enums").VitalSignsSource;
                                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                                        recordedAt: Date;
                                        temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                        heartRate: number | null;
                                        respiratoryRate: number | null;
                                        oxygenSaturation: number | null;
                                        bloodPressure: string | null;
                                        painScore: number | null;
                                        bodyConditionScore: number | null;
                                        capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                        correctsId: string | null;
                                        recordedBy: {
                                            name: string;
                                            id: string;
                                        } | null;
                                        correction: {
                                            id: string;
                                            code: string;
                                            recordedAt: Date;
                                        } | null;
                                    } | null;
                                    orderId: string;
                                    fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                    fastingHours: number | null;
                                    medications: string[];
                                    pregnancyPossible: boolean | null;
                                    metalImplants: boolean | null;
                                    implantNotes: string | null;
                                    priorContrastReaction: boolean | null;
                                    allergies: string | null;
                                    asaClass: number | null;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "نوع الحذف غير معروف";
                            } | {
                                readonly message: "لا يمكن حذف صور فحص معتمد — التقرير يستند إليها";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        studies: {
            ":studyId": {
                get: {
                    body: {};
                    params: {
                        studyId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                            description: string | null;
                            item: {
                                service: {
                                    name: string;
                                };
                                id: string;
                                order: {
                                    owner: {
                                        name: string;
                                        id: string;
                                    };
                                    patient: {
                                        animalType: {
                                            arName: string;
                                        };
                                        name: string;
                                        id: string;
                                        code: string;
                                        gender: import("@/generated/prisma/enums").Gender;
                                        age: number | null;
                                    };
                                    id: string;
                                    code: string;
                                    clinicalInfo: string | null;
                                };
                                accession: string;
                                modality: import("@/generated/prisma/enums").RadiologyModality;
                                bodyPart: string | null;
                                laterality: RadiologyLaterality;
                            };
                            itemId: string;
                            modality: import("@/generated/prisma/enums").RadiologyModality | null;
                            series: {
                                id: string;
                                description: string | null;
                                bodyPart: string | null;
                                seriesUid: string;
                                seriesNumber: number | null;
                                modalityCode: string | null;
                                instances: {
                                    id: string;
                                    rows: number | null;
                                    fileName: string | null;
                                    kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                    mimeType: string | null;
                                    sizeBytes: number | null;
                                    sopUid: string;
                                    instanceNumber: number | null;
                                    transferSyntax: string | null;
                                    columns: number | null;
                                    frames: number | null;
                                }[];
                            }[];
                            studyUid: string;
                            studyDate: Date | null;
                            uploadedBy: {
                                name: string;
                                id: string;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: "الدراسة غير موجودة";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        ":id": {
            get: {
                body: {};
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        comments: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            body: string;
                            author: {
                                name: string;
                                id: string;
                            };
                            mentions: {
                                staff: {
                                    name: string;
                                    id: string;
                                };
                            }[];
                        }[];
                        branch: {
                            name: string;
                            id: string;
                        };
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        };
                        patient: {
                            animalType: {
                                id: string;
                                arName: string;
                            };
                            animalStrain: {
                                id: string;
                                arName: string;
                            } | null;
                            name: string;
                            id: string;
                            code: string;
                            gender: import("@/generated/prisma/enums").Gender;
                            age: number | null;
                        };
                        appointment: {
                            id: string;
                            code: string;
                            startsAt: Date;
                        } | null;
                        invoice: {
                            discount: import("@prisma/client-runtime-utils").Decimal;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            vatRate: import("@prisma/client-runtime-utils").Decimal;
                            currencyCode: string;
                            code: string;
                            status: import("@/generated/prisma/enums").InvoiceStatus;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            vatAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                            paidAt: Date | null;
                            appointmentId: string | null;
                            radiologyOrderId: string | null;
                            subtotal: import("@prisma/client-runtime-utils").Decimal;
                            amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            membershipId: string | null;
                            refundedAt: Date | null;
                            refundReason: string | null;
                            membershipAdjustments: {
                                id: string;
                                amount: import("@prisma/client-runtime-utils").Decimal;
                                lineRef: string;
                                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                unitsConsumed: number;
                            }[];
                        } | null;
                        priority: import("@/generated/prisma/enums").TaskPriority | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        code: string;
                        branchId: string;
                        notes: string | null;
                        items: {
                            service: {
                                name: string;
                                id: string;
                            };
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            report: {
                                id: string;
                                updatedAt: Date;
                                itemId: string;
                                authoredBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                findings: string | null;
                                technique: string | null;
                                comparison: string | null;
                                impression: string | null;
                                recommendations: string | null;
                                criticalFinding: boolean;
                                criticalNotifiedAt: Date | null;
                                criticalNotifiedTo: string | null;
                                criticalNotifiedToId: string | null;
                                aiDrafted: boolean;
                            } | null;
                            status: RadiologyStatus;
                            serviceId: string;
                            paidAt: Date | null;
                            rejectionReason: string | null;
                            completedAt: Date | null;
                            orderId: string;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            scheduledAt: Date | null;
                            reviewedAt: Date | null;
                            rejectedAt: Date | null;
                            assignedTo: {
                                name: string;
                                id: string;
                            } | null;
                            reviewedBy: {
                                name: string;
                                id: string;
                            } | null;
                            rejectedBy: {
                                name: string;
                                id: string;
                            } | null;
                            accession: string;
                            stage: RadiologyStage;
                            modality: import("@/generated/prisma/enums").RadiologyModality;
                            bodyPart: string | null;
                            laterality: RadiologyLaterality;
                            views: string[];
                            withContrast: boolean;
                            execution: {
                                id: string;
                                startedAt: Date | null;
                                finishedAt: Date | null;
                                itemId: string;
                                performedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                readyAt: Date | null;
                                machineId: string | null;
                                machineName: string | null;
                                roomName: string | null;
                                positioning: string | null;
                                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                sedationAgent: string | null;
                                viewsPerformed: string[];
                                exposuresCount: number | null;
                                retakeCount: number | null;
                                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                mas: import("@prisma/client-runtime-utils").Decimal | null;
                                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                contrastUsed: boolean | null;
                                contrastAgent: string | null;
                                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                contrastLot: string | null;
                                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                qcNotes: string | null;
                                executionNotes: string | null;
                            } | null;
                            studies: {
                                id: string;
                                createdAt: Date;
                                description: string | null;
                                itemId: string;
                                modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                series: {
                                    id: string;
                                    description: string | null;
                                    bodyPart: string | null;
                                    seriesUid: string;
                                    seriesNumber: number | null;
                                    modalityCode: string | null;
                                    instances: {
                                        id: string;
                                        rows: number | null;
                                        fileName: string | null;
                                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                        mimeType: string | null;
                                        sizeBytes: number | null;
                                        sopUid: string;
                                        instanceNumber: number | null;
                                        transferSyntax: string | null;
                                        columns: number | null;
                                        frames: number | null;
                                    }[];
                                }[];
                                studyUid: string;
                                studyDate: Date | null;
                                uploadedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                        }[];
                        appointmentId: string | null;
                        inpatientStayId: string | null;
                        patientId: string;
                        ownerId: string;
                        activity: {
                            type: import("@/generated/prisma/enums").RadiologyActivityType;
                            id: string;
                            createdAt: Date;
                            detail: string | null;
                            itemId: string | null;
                            author: {
                                name: string;
                                id: string;
                            } | null;
                        }[];
                        isUrgent: boolean;
                        requestedBy: {
                            name: string;
                            id: string;
                            phone: string | null;
                        } | null;
                        clinicalInfo: string | null;
                        safetyScreening: {
                            id: string;
                            vitalsRecordId: string | null;
                            vitalsRecord: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                code: string;
                                branchId: string | null;
                                notes: string | null;
                                editsCount: number;
                                operationId: string | null;
                                appointmentId: string | null;
                                labOrderId: string | null;
                                radiologyOrderId: string | null;
                                patientId: string;
                                source: import("@/generated/prisma/enums").VitalSignsSource;
                                weight: import("@prisma/client-runtime-utils").Decimal | null;
                                recordedAt: Date;
                                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                heartRate: number | null;
                                respiratoryRate: number | null;
                                oxygenSaturation: number | null;
                                bloodPressure: string | null;
                                painScore: number | null;
                                bodyConditionScore: number | null;
                                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                correctsId: string | null;
                                recordedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                correction: {
                                    id: string;
                                    code: string;
                                    recordedAt: Date;
                                } | null;
                            } | null;
                            orderId: string;
                            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                            fastingHours: number | null;
                            medications: string[];
                            pregnancyPossible: boolean | null;
                            metalImplants: boolean | null;
                            implantNotes: string | null;
                            priorContrastReaction: boolean | null;
                            allergies: string | null;
                            asaClass: number | null;
                        } | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        message: string;
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    radiology: {
        post: {
            body: {
                priority?: "MEDIUM" | "LOW" | "HIGH" | "URGENT" | null | undefined;
                notes?: string | null | undefined;
                origin?: "VISIT" | "DIRECT" | undefined;
                appointmentId?: string | null | undefined;
                inpatientStayId?: string | null | undefined;
                requestedById?: string | null | undefined;
                isUrgent?: boolean | undefined;
                assignedToId?: string | null | undefined;
                scheduledAt?: string | null | undefined;
                bodyPart?: string | null | undefined;
                laterality?: "NONE" | "LEFT" | "RIGHT" | "BILATERAL" | null | undefined;
                views?: string[] | undefined;
                withContrast?: boolean | null | undefined;
                branchId: string;
                patientId: string;
                ownerId: string;
                clinicalInfo: string;
                serviceIds: string[];
            };
            params: {};
            query: {};
            headers: {};
            response: {
                201: {
                    comments: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        body: string;
                        author: {
                            name: string;
                            id: string;
                        };
                        mentions: {
                            staff: {
                                name: string;
                                id: string;
                            };
                        }[];
                    }[];
                    branch: {
                        name: string;
                        id: string;
                    };
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        animalType: {
                            id: string;
                            arName: string;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                        } | null;
                        name: string;
                        id: string;
                        code: string;
                        gender: import("@/generated/prisma/enums").Gender;
                        age: number | null;
                    };
                    appointment: {
                        id: string;
                        code: string;
                        startsAt: Date;
                    } | null;
                    invoice: {
                        discount: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        vatRate: import("@prisma/client-runtime-utils").Decimal;
                        currencyCode: string;
                        code: string;
                        status: import("@/generated/prisma/enums").InvoiceStatus;
                        total: import("@prisma/client-runtime-utils").Decimal;
                        vatAmount: import("@prisma/client-runtime-utils").Decimal;
                        paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                        paidAt: Date | null;
                        appointmentId: string | null;
                        radiologyOrderId: string | null;
                        subtotal: import("@prisma/client-runtime-utils").Decimal;
                        amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        membershipId: string | null;
                        refundedAt: Date | null;
                        refundReason: string | null;
                        membershipAdjustments: {
                            id: string;
                            amount: import("@prisma/client-runtime-utils").Decimal;
                            lineRef: string;
                            benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                            unitsConsumed: number;
                        }[];
                    } | null;
                    priority: import("@/generated/prisma/enums").TaskPriority | null;
                    id: string;
                    clinicId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    branchId: string;
                    notes: string | null;
                    items: {
                        service: {
                            name: string;
                            id: string;
                        };
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        report: {
                            id: string;
                            updatedAt: Date;
                            itemId: string;
                            authoredBy: {
                                name: string;
                                id: string;
                            } | null;
                            findings: string | null;
                            technique: string | null;
                            comparison: string | null;
                            impression: string | null;
                            recommendations: string | null;
                            criticalFinding: boolean;
                            criticalNotifiedAt: Date | null;
                            criticalNotifiedTo: string | null;
                            criticalNotifiedToId: string | null;
                            aiDrafted: boolean;
                        } | null;
                        status: RadiologyStatus;
                        serviceId: string;
                        paidAt: Date | null;
                        rejectionReason: string | null;
                        completedAt: Date | null;
                        orderId: string;
                        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                        scheduledAt: Date | null;
                        reviewedAt: Date | null;
                        rejectedAt: Date | null;
                        assignedTo: {
                            name: string;
                            id: string;
                        } | null;
                        reviewedBy: {
                            name: string;
                            id: string;
                        } | null;
                        rejectedBy: {
                            name: string;
                            id: string;
                        } | null;
                        accession: string;
                        stage: RadiologyStage;
                        modality: import("@/generated/prisma/enums").RadiologyModality;
                        bodyPart: string | null;
                        laterality: RadiologyLaterality;
                        views: string[];
                        withContrast: boolean;
                        execution: {
                            id: string;
                            startedAt: Date | null;
                            finishedAt: Date | null;
                            itemId: string;
                            performedBy: {
                                name: string;
                                id: string;
                            } | null;
                            readyAt: Date | null;
                            machineId: string | null;
                            machineName: string | null;
                            roomName: string | null;
                            positioning: string | null;
                            sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                            sedationAgent: string | null;
                            viewsPerformed: string[];
                            exposuresCount: number | null;
                            retakeCount: number | null;
                            kvp: import("@prisma/client-runtime-utils").Decimal | null;
                            mas: import("@prisma/client-runtime-utils").Decimal | null;
                            doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                            ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                            dlp: import("@prisma/client-runtime-utils").Decimal | null;
                            contrastUsed: boolean | null;
                            contrastAgent: string | null;
                            contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                            contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                            contrastLot: string | null;
                            imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                            qcNotes: string | null;
                            executionNotes: string | null;
                        } | null;
                        studies: {
                            id: string;
                            createdAt: Date;
                            description: string | null;
                            itemId: string;
                            modality: import("@/generated/prisma/enums").RadiologyModality | null;
                            series: {
                                id: string;
                                description: string | null;
                                bodyPart: string | null;
                                seriesUid: string;
                                seriesNumber: number | null;
                                modalityCode: string | null;
                                instances: {
                                    id: string;
                                    rows: number | null;
                                    fileName: string | null;
                                    kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                    mimeType: string | null;
                                    sizeBytes: number | null;
                                    sopUid: string;
                                    instanceNumber: number | null;
                                    transferSyntax: string | null;
                                    columns: number | null;
                                    frames: number | null;
                                }[];
                            }[];
                            studyUid: string;
                            studyDate: Date | null;
                            uploadedBy: {
                                name: string;
                                id: string;
                            } | null;
                        }[];
                    }[];
                    appointmentId: string | null;
                    inpatientStayId: string | null;
                    patientId: string;
                    ownerId: string;
                    activity: {
                        type: import("@/generated/prisma/enums").RadiologyActivityType;
                        id: string;
                        createdAt: Date;
                        detail: string | null;
                        itemId: string | null;
                        author: {
                            name: string;
                            id: string;
                        } | null;
                    }[];
                    isUrgent: boolean;
                    requestedBy: {
                        name: string;
                        id: string;
                        phone: string | null;
                    } | null;
                    clinicalInfo: string | null;
                    safetyScreening: {
                        id: string;
                        vitalsRecordId: string | null;
                        vitalsRecord: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string | null;
                            notes: string | null;
                            editsCount: number;
                            operationId: string | null;
                            appointmentId: string | null;
                            labOrderId: string | null;
                            radiologyOrderId: string | null;
                            patientId: string;
                            source: import("@/generated/prisma/enums").VitalSignsSource;
                            weight: import("@prisma/client-runtime-utils").Decimal | null;
                            recordedAt: Date;
                            temperature: import("@prisma/client-runtime-utils").Decimal | null;
                            heartRate: number | null;
                            respiratoryRate: number | null;
                            oxygenSaturation: number | null;
                            bloodPressure: string | null;
                            painScore: number | null;
                            bodyConditionScore: number | null;
                            capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                            mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                            correctsId: string | null;
                            recordedBy: {
                                name: string;
                                id: string;
                            } | null;
                            correction: {
                                id: string;
                                code: string;
                                recordedAt: Date;
                            } | null;
                        } | null;
                        orderId: string;
                        fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                        fastingHours: number | null;
                        medications: string[];
                        pregnancyPossible: boolean | null;
                        metalImplants: boolean | null;
                        implantNotes: string | null;
                        priorContrastReaction: boolean | null;
                        allergies: string | null;
                        asaClass: number | null;
                    } | null;
                } | null;
                401: {
                    readonly message: "غير مصرح";
                };
                422: {
                    readonly message: "حدّد جهة التصوير — هذا الفحص يشترطها";
                } | {
                    type: "validation";
                    on: string;
                    summary?: string;
                    message?: string;
                    found?: unknown;
                    property?: string;
                    expected?: string;
                };
            };
        };
    };
} & {
    radiology: {
        ":id": {
            safety: {
                patch: {
                    body: {
                        fastingStatus?: "PARTIAL" | "FASTED" | "NOT_FASTED" | null | undefined;
                        fastingHours?: number | null | undefined;
                        medications?: string[] | undefined;
                        pregnancyPossible?: boolean | null | undefined;
                        metalImplants?: boolean | null | undefined;
                        implantNotes?: string | null | undefined;
                        priorContrastReaction?: boolean | null | undefined;
                        allergies?: string | null | undefined;
                        asaClass?: number | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                radiologyOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: {
                                    id: string;
                                    updatedAt: Date;
                                    itemId: string;
                                    authoredBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    findings: string | null;
                                    technique: string | null;
                                    comparison: string | null;
                                    impression: string | null;
                                    recommendations: string | null;
                                    criticalFinding: boolean;
                                    criticalNotifiedAt: Date | null;
                                    criticalNotifiedTo: string | null;
                                    criticalNotifiedToId: string | null;
                                    aiDrafted: boolean;
                                } | null;
                                status: RadiologyStatus;
                                serviceId: string;
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                accession: string;
                                stage: RadiologyStage;
                                modality: import("@/generated/prisma/enums").RadiologyModality;
                                bodyPart: string | null;
                                laterality: RadiologyLaterality;
                                views: string[];
                                withContrast: boolean;
                                execution: {
                                    id: string;
                                    startedAt: Date | null;
                                    finishedAt: Date | null;
                                    itemId: string;
                                    performedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    readyAt: Date | null;
                                    machineId: string | null;
                                    machineName: string | null;
                                    roomName: string | null;
                                    positioning: string | null;
                                    sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                    sedationAgent: string | null;
                                    viewsPerformed: string[];
                                    exposuresCount: number | null;
                                    retakeCount: number | null;
                                    kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                    mas: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                    ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                    dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastUsed: boolean | null;
                                    contrastAgent: string | null;
                                    contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                    contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastLot: string | null;
                                    imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                    qcNotes: string | null;
                                    executionNotes: string | null;
                                } | null;
                                studies: {
                                    id: string;
                                    createdAt: Date;
                                    description: string | null;
                                    itemId: string;
                                    modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                    series: {
                                        id: string;
                                        description: string | null;
                                        bodyPart: string | null;
                                        seriesUid: string;
                                        seriesNumber: number | null;
                                        modalityCode: string | null;
                                        instances: {
                                            id: string;
                                            rows: number | null;
                                            fileName: string | null;
                                            kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                            mimeType: string | null;
                                            sizeBytes: number | null;
                                            sopUid: string;
                                            instanceNumber: number | null;
                                            transferSyntax: string | null;
                                            columns: number | null;
                                            frames: number | null;
                                        }[];
                                    }[];
                                    studyUid: string;
                                    studyDate: Date | null;
                                    uploadedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").RadiologyActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            clinicalInfo: string | null;
                            safetyScreening: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                pregnancyPossible: boolean | null;
                                metalImplants: boolean | null;
                                implantNotes: string | null;
                                priorContrastReaction: boolean | null;
                                allergies: string | null;
                                asaClass: number | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        ":id": {
            invoice: {
                pay: {
                    post: {
                        body: {
                            insurance?: {
                                excludedLineRefs?: string[] | undefined;
                                apply?: boolean | undefined;
                            } | undefined;
                            itemId?: string | undefined;
                            paymentMethod: "CASH" | "CARD" | "TRANSFER";
                            amountPaid: number;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                radiologyOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                message: string;
                            };
                            422: {
                                readonly message: "لا توجد فحوصات في هذا الطلب";
                            } | {
                                readonly message: "الفاتورة مسدَّدة بالفعل";
                            } | {
                                readonly message: "هذا الفحص مسدَّد مسبقًا";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        ":id": {
            priority: {
                patch: {
                    body: {
                        priority: "MEDIUM" | "LOW" | "HIGH" | "URGENT" | null;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                radiologyOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: {
                                    id: string;
                                    updatedAt: Date;
                                    itemId: string;
                                    authoredBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    findings: string | null;
                                    technique: string | null;
                                    comparison: string | null;
                                    impression: string | null;
                                    recommendations: string | null;
                                    criticalFinding: boolean;
                                    criticalNotifiedAt: Date | null;
                                    criticalNotifiedTo: string | null;
                                    criticalNotifiedToId: string | null;
                                    aiDrafted: boolean;
                                } | null;
                                status: RadiologyStatus;
                                serviceId: string;
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                accession: string;
                                stage: RadiologyStage;
                                modality: import("@/generated/prisma/enums").RadiologyModality;
                                bodyPart: string | null;
                                laterality: RadiologyLaterality;
                                views: string[];
                                withContrast: boolean;
                                execution: {
                                    id: string;
                                    startedAt: Date | null;
                                    finishedAt: Date | null;
                                    itemId: string;
                                    performedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    readyAt: Date | null;
                                    machineId: string | null;
                                    machineName: string | null;
                                    roomName: string | null;
                                    positioning: string | null;
                                    sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                    sedationAgent: string | null;
                                    viewsPerformed: string[];
                                    exposuresCount: number | null;
                                    retakeCount: number | null;
                                    kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                    mas: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                    ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                    dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastUsed: boolean | null;
                                    contrastAgent: string | null;
                                    contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                    contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastLot: string | null;
                                    imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                    qcNotes: string | null;
                                    executionNotes: string | null;
                                } | null;
                                studies: {
                                    id: string;
                                    createdAt: Date;
                                    description: string | null;
                                    itemId: string;
                                    modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                    series: {
                                        id: string;
                                        description: string | null;
                                        bodyPart: string | null;
                                        seriesUid: string;
                                        seriesNumber: number | null;
                                        modalityCode: string | null;
                                        instances: {
                                            id: string;
                                            rows: number | null;
                                            fileName: string | null;
                                            kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                            mimeType: string | null;
                                            sizeBytes: number | null;
                                            sopUid: string;
                                            instanceNumber: number | null;
                                            transferSyntax: string | null;
                                            columns: number | null;
                                            frames: number | null;
                                        }[];
                                    }[];
                                    studyUid: string;
                                    studyDate: Date | null;
                                    uploadedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").RadiologyActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            clinicalInfo: string | null;
                            safetyScreening: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                pregnancyPossible: boolean | null;
                                metalImplants: boolean | null;
                                implantNotes: string | null;
                                priorContrastReaction: boolean | null;
                                allergies: string | null;
                                asaClass: number | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
                        };
                        422: {
                            readonly message: "لا يمكن تغيير الأولوية بعد بدء تحضير الطفل";
                        } | {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        ":id": {
            confirm: {
                post: {
                    body: {
                        priority?: "MEDIUM" | "LOW" | "HIGH" | "URGENT" | null | undefined;
                        notes?: string | null | undefined;
                        assignedToId?: string | null | undefined;
                        scheduledAt: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            comments: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                body: string;
                                author: {
                                    name: string;
                                    id: string;
                                };
                                mentions: {
                                    staff: {
                                        name: string;
                                        id: string;
                                    };
                                }[];
                            }[];
                            branch: {
                                name: string;
                                id: string;
                            };
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("@/generated/prisma/enums").Gender;
                                age: number | null;
                            };
                            appointment: {
                                id: string;
                                code: string;
                                startsAt: Date;
                            } | null;
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                updatedAt: Date;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("@/generated/prisma/enums").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
                                paidAt: Date | null;
                                appointmentId: string | null;
                                radiologyOrderId: string | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                                membershipId: string | null;
                                refundedAt: Date | null;
                                refundReason: string | null;
                                membershipAdjustments: {
                                    id: string;
                                    amount: import("@prisma/client-runtime-utils").Decimal;
                                    lineRef: string;
                                    benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                                    unitsConsumed: number;
                                }[];
                            } | null;
                            priority: import("@/generated/prisma/enums").TaskPriority | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            updatedAt: Date;
                            code: string;
                            branchId: string;
                            notes: string | null;
                            items: {
                                service: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                report: {
                                    id: string;
                                    updatedAt: Date;
                                    itemId: string;
                                    authoredBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    findings: string | null;
                                    technique: string | null;
                                    comparison: string | null;
                                    impression: string | null;
                                    recommendations: string | null;
                                    criticalFinding: boolean;
                                    criticalNotifiedAt: Date | null;
                                    criticalNotifiedTo: string | null;
                                    criticalNotifiedToId: string | null;
                                    aiDrafted: boolean;
                                } | null;
                                status: RadiologyStatus;
                                serviceId: string;
                                paidAt: Date | null;
                                rejectionReason: string | null;
                                completedAt: Date | null;
                                orderId: string;
                                priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                                scheduledAt: Date | null;
                                reviewedAt: Date | null;
                                rejectedAt: Date | null;
                                assignedTo: {
                                    name: string;
                                    id: string;
                                } | null;
                                reviewedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                rejectedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                accession: string;
                                stage: RadiologyStage;
                                modality: import("@/generated/prisma/enums").RadiologyModality;
                                bodyPart: string | null;
                                laterality: RadiologyLaterality;
                                views: string[];
                                withContrast: boolean;
                                execution: {
                                    id: string;
                                    startedAt: Date | null;
                                    finishedAt: Date | null;
                                    itemId: string;
                                    performedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    readyAt: Date | null;
                                    machineId: string | null;
                                    machineName: string | null;
                                    roomName: string | null;
                                    positioning: string | null;
                                    sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                                    sedationAgent: string | null;
                                    viewsPerformed: string[];
                                    exposuresCount: number | null;
                                    retakeCount: number | null;
                                    kvp: import("@prisma/client-runtime-utils").Decimal | null;
                                    mas: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                                    ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                                    dlp: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastUsed: boolean | null;
                                    contrastAgent: string | null;
                                    contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                                    contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                                    contrastLot: string | null;
                                    imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                                    qcNotes: string | null;
                                    executionNotes: string | null;
                                } | null;
                                studies: {
                                    id: string;
                                    createdAt: Date;
                                    description: string | null;
                                    itemId: string;
                                    modality: import("@/generated/prisma/enums").RadiologyModality | null;
                                    series: {
                                        id: string;
                                        description: string | null;
                                        bodyPart: string | null;
                                        seriesUid: string;
                                        seriesNumber: number | null;
                                        modalityCode: string | null;
                                        instances: {
                                            id: string;
                                            rows: number | null;
                                            fileName: string | null;
                                            kind: import("@/generated/prisma/enums").RadiologyImageKind;
                                            mimeType: string | null;
                                            sizeBytes: number | null;
                                            sopUid: string;
                                            instanceNumber: number | null;
                                            transferSyntax: string | null;
                                            columns: number | null;
                                            frames: number | null;
                                        }[];
                                    }[];
                                    studyUid: string;
                                    studyDate: Date | null;
                                    uploadedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                }[];
                            }[];
                            appointmentId: string | null;
                            inpatientStayId: string | null;
                            patientId: string;
                            ownerId: string;
                            activity: {
                                type: import("@/generated/prisma/enums").RadiologyActivityType;
                                id: string;
                                createdAt: Date;
                                detail: string | null;
                                itemId: string | null;
                                author: {
                                    name: string;
                                    id: string;
                                } | null;
                            }[];
                            isUrgent: boolean;
                            requestedBy: {
                                name: string;
                                id: string;
                                phone: string | null;
                            } | null;
                            clinicalInfo: string | null;
                            safetyScreening: {
                                id: string;
                                vitalsRecordId: string | null;
                                vitalsRecord: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    code: string;
                                    branchId: string | null;
                                    notes: string | null;
                                    editsCount: number;
                                    operationId: string | null;
                                    appointmentId: string | null;
                                    labOrderId: string | null;
                                    radiologyOrderId: string | null;
                                    patientId: string;
                                    source: import("@/generated/prisma/enums").VitalSignsSource;
                                    weight: import("@prisma/client-runtime-utils").Decimal | null;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    bloodPressure: string | null;
                                    painScore: number | null;
                                    bodyConditionScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                    correctsId: string | null;
                                    recordedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    correction: {
                                        id: string;
                                        code: string;
                                        recordedAt: Date;
                                    } | null;
                                } | null;
                                orderId: string;
                                fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
                                fastingHours: number | null;
                                medications: string[];
                                pregnancyPossible: boolean | null;
                                metalImplants: boolean | null;
                                implantNotes: string | null;
                                priorContrastReaction: boolean | null;
                                allergies: string | null;
                                asaClass: number | null;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
                        };
                        422: {
                            readonly message: string;
                        } | {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        ":id": {
            decline: {
                post: {
                    body: {
                        reason: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            success: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            message: string;
                        };
                        422: {
                            readonly message: "رفض الطلب متاح في الطلبات فقط";
                        } | {
                            readonly message: "اكتب سبب رفض الطلب";
                        } | {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    radiology: {
        ":id": {
            delete: {
                body: {};
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        success: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        message: string;
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
}, {
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
} & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
