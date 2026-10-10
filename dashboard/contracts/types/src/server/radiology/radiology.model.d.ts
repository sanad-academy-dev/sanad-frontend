import Elysia from "elysia";
export declare const radiologyModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
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
