import Elysia from "elysia";
export declare const operationsController: Elysia<"/operations", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "operations.list": import("@sinclair/typebox").TObject<{
            period: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"day">, import("@sinclair/typebox").TLiteral<"week">, import("@sinclair/typebox").TLiteral<"all">]>>;
            view: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"all">, import("@sinclair/typebox").TLiteral<"for-me">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"PREP">, import("@sinclair/typebox").TLiteral<"ANESTHESIA">, import("@sinclair/typebox").TLiteral<"SURGERY">, import("@sinclair/typebox").TLiteral<"RECOVERY">, import("@sinclair/typebox").TLiteral<"DISCHARGE">, import("@sinclair/typebox").TLiteral<"FOLLOW_UP">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>>;
            q: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "operations.create": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            procedures: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                serviceId: import("@sinclair/typebox").TString;
                laterality: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"LEFT">, import("@sinclair/typebox").TLiteral<"RIGHT">, import("@sinclair/typebox").TLiteral<"BILATERAL">]>>;
                site: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
            surgeonStaffId: import("@sinclair/typebox").TString;
            anesthetistStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            urgency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IMMEDIATE">, import("@sinclair/typebox").TLiteral<"URGENT">, import("@sinclair/typebox").TLiteral<"EXPEDITED">, import("@sinclair/typebox").TLiteral<"ELECTIVE">]>>;
            scheduledAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            estimatedDurationMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            roomId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            diagnosis: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.updateStatus": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SCHEDULED">, import("@sinclair/typebox").TLiteral<"PREP">, import("@sinclair/typebox").TLiteral<"ANESTHESIA">, import("@sinclair/typebox").TLiteral<"SURGERY">, import("@sinclair/typebox").TLiteral<"RECOVERY">, import("@sinclair/typebox").TLiteral<"DISCHARGE">, import("@sinclair/typebox").TLiteral<"FOLLOW_UP">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
            overrideReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            cancelKind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OWNER">, import("@sinclair/typebox").TLiteral<"CLINIC">, import("@sinclair/typebox").TLiteral<"CLINICAL">]>>;
            cancelReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "operations.advanceStage": import("@sinclair/typebox").TObject<{
            direction: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"next">, import("@sinclair/typebox").TLiteral<"previous">]>;
        }>;
        readonly "operations.schedule": import("@sinclair/typebox").TObject<{
            scheduledAt: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>;
            roomId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            estimatedDurationMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "operations.updateUrgency": import("@sinclair/typebox").TObject<{
            urgency: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IMMEDIATE">, import("@sinclair/typebox").TLiteral<"URGENT">, import("@sinclair/typebox").TLiteral<"EXPEDITED">, import("@sinclair/typebox").TLiteral<"ELECTIVE">]>;
        }>;
        readonly "operations.createConsent": import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SURGICAL">, import("@sinclair/typebox").TLiteral<"ANESTHESIA">, import("@sinclair/typebox").TLiteral<"BLOOD_PRODUCTS">, import("@sinclair/typebox").TLiteral<"EUTHANASIA">, import("@sinclair/typebox").TLiteral<"FINANCIAL_ESTIMATE">]>;
            textSnapshot: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            estimateLow: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            estimateHigh: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
        }>;
        readonly "operations.signConsent": import("@sinclair/typebox").TObject<{
            signerName: import("@sinclair/typebox").TString;
            signerRelationship: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            signatureMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRAWN">, import("@sinclair/typebox").TLiteral<"TYPED">, import("@sinclair/typebox").TLiteral<"UPLOADED">, import("@sinclair/typebox").TLiteral<"VERBAL_WITNESSED">]>;
            signatureUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            witnessStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.revokeConsent": import("@sinclair/typebox").TObject<{
            reason: import("@sinclair/typebox").TString;
        }>;
        readonly "operations.upsertAssessment": import("@sinclair/typebox").TObject<{
            asaClass: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            asaEmergency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            lastFoodAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            lastWaterAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            fastingVerified: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            physicalFindings: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            airwayAssessment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            medications: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            allergies: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            bloodworkReviewed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            imagingReviewed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            riskNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            premedPlan: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.checklistScope": import("@sinclair/typebox").TObject<{
            scope: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OPERATION_SIGN_IN">, import("@sinclair/typebox").TLiteral<"OPERATION_TIME_OUT">, import("@sinclair/typebox").TLiteral<"OPERATION_SIGN_OUT">, import("@sinclair/typebox").TLiteral<"OPERATION_MINOR_COMBINED">]>;
        }>;
        readonly "operations.respondChecklistItem": import("@sinclair/typebox").TObject<{
            response: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CONFIRMED">, import("@sinclair/typebox").TLiteral<"YES">, import("@sinclair/typebox").TLiteral<"NO">, import("@sinclair/typebox").TLiteral<"NA">]>;
            valueText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.upsertAnesthesia": import("@sinclair/typebox").TObject<{
            actual: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"ANXIOLYSIS">, import("@sinclair/typebox").TLiteral<"SEDATION">, import("@sinclair/typebox").TLiteral<"GENERAL_ANESTHESIA">]>]>>;
            airway: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            ettSize: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            circuit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            ivAccess: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            monitoringIntervalMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            premedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            inductionAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            incisionAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            closureAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            endAnesthesiaAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            extubationAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            anesthetistStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.addAnesthesiaEvent": import("@sinclair/typebox").TObject<{
            at: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DRUG">, import("@sinclair/typebox").TLiteral<"ABX_PROPHYLAXIS">, import("@sinclair/typebox").TLiteral<"FLUID">, import("@sinclair/typebox").TLiteral<"POSITION">, import("@sinclair/typebox").TLiteral<"EVENT">, import("@sinclair/typebox").TLiteral<"NOTE">]>;
            agentName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dose: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            doseUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IV">, import("@sinclair/typebox").TLiteral<"IM">, import("@sinclair/typebox").TLiteral<"SC">, import("@sinclair/typebox").TLiteral<"PO">, import("@sinclair/typebox").TLiteral<"INHALATION">, import("@sinclair/typebox").TLiteral<"TOPICAL">, import("@sinclair/typebox").TLiteral<"EPIDURAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            detail: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.upsertNote": import("@sinclair/typebox").TObject<{
            proceduresPerformed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            findings: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            technique: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            estimatedBloodLossMl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            complicationsNarrative: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            closureDetails: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            drainsPlaced: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.upsertCount": import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SPONGE">, import("@sinclair/typebox").TLiteral<"NEEDLE">, import("@sinclair/typebox").TLiteral<"INSTRUMENT">]>;
            initialCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            finalCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            reconciled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            discrepancyNote: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.addImplant": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            manufacturer: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            lotNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            serialNumber: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            udi: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            site: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.addSpecimen": import("@sinclair/typebox").TObject<{
            label: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            containerCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>;
        readonly "operations.addRecovery": import("@sinclair/typebox").TObject<{
            score: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            painScale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GLASGOW_CMPS">, import("@sinclair/typebox").TLiteral<"NRS">, import("@sinclair/typebox").TLiteral<"VAS">, import("@sinclair/typebox").TLiteral<"FLACC">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            painScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.addPostOpOrder": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEDICATION">, import("@sinclair/typebox").TLiteral<"MONITORING">, import("@sinclair/typebox").TLiteral<"FEEDING">, import("@sinclair/typebox").TLiteral<"ACTIVITY">, import("@sinclair/typebox").TLiteral<"WOUND_CARE">, import("@sinclair/typebox").TLiteral<"FOLLOW_UP">, import("@sinclair/typebox").TLiteral<"SUTURE_REMOVAL">]>;
            instructions: import("@sinclair/typebox").TString;
            dueAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.addConsumable": import("@sinclair/typebox").TObject<{
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            quantity: import("@sinclair/typebox").TInteger;
            price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BURNED">, import("@sinclair/typebox").TLiteral<"ADDITIONAL">]>>;
        }>;
        readonly "operations.countConsumable": import("@sinclair/typebox").TObject<{
            countedQuantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            countNote: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.payInvoice": import("@sinclair/typebox").TObject<{
            amountPaid: import("@sinclair/typebox").TNumber;
            paymentMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"TRANSFER">]>;
            insurance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                apply: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                excludedLineRefs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            }>>;
        }>;
        readonly "operations.addComplication": import("@sinclair/typebox").TObject<{
            phase: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"INTRA_OP">, import("@sinclair/typebox").TLiteral<"RECOVERY">, import("@sinclair/typebox").TLiteral<"POST_OP">]>;
            clavienDindoGrade: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GRADE_I">, import("@sinclair/typebox").TLiteral<"GRADE_II">, import("@sinclair/typebox").TLiteral<"GRADE_IIIA">, import("@sinclair/typebox").TLiteral<"GRADE_IIIB">, import("@sinclair/typebox").TLiteral<"GRADE_IVA">, import("@sinclair/typebox").TLiteral<"GRADE_IVB">, import("@sinclair/typebox").TLiteral<"GRADE_V">]>]>>;
            isSSI: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            kind: import("@sinclair/typebox").TString;
            occurredAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            detail: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "operations.addComment": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
            mentionStaffIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
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
    operations: {};
} & {
    operations: {
        get: {
            body: {};
            params: {};
            query: {
                status?: "CANCELLED" | "COMPLETED" | "SCHEDULED" | "FOLLOW_UP" | "PREP" | "ANESTHESIA" | "SURGERY" | "RECOVERY" | "DISCHARGE" | undefined;
                period?: "week" | "day" | "all" | undefined;
                view?: "all" | "for-me" | undefined;
                q?: string | undefined;
            };
            headers: {};
            response: {
                200: {
                    room: {
                        name: string;
                        id: string;
                    } | null;
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        name: string;
                        id: string;
                        code: string;
                        gender: import("../staff/staff.type").Gender;
                        age: number | null;
                    };
                    id: string;
                    createdAt: Date;
                    _count: {
                        comments: number;
                    };
                    code: string;
                    status: import("../../../generated/prisma/enums").OperationStatus;
                    team: {
                        staff: {
                            name: string;
                            id: string;
                        };
                        id: string;
                        role: import("../../../generated/prisma/enums").OperationTeamRole;
                    }[];
                    scheduledAt: Date | null;
                    stage: import("../../../generated/prisma/enums").OperationStage | null;
                    tier: import("../../../generated/prisma/enums").OperationTier;
                    estimatedDurationMin: number;
                    urgency: import("../../../generated/prisma/enums").OperationUrgency;
                    plannedAnesthesia: import("../../../generated/prisma/enums").SedationLevel;
                    procedures: {
                        id: string;
                        laterality: import("../../../generated/prisma/enums").OperationLaterality;
                        nameSnapshot: string;
                        site: string | null;
                    }[];
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
    operations: {
        stats: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./operations.type").OperationsStatsResponse;
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    operations: {
        theatres: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        type: import("../rooms/rooms.type").RoomType;
                        branch: {
                            name: string;
                        };
                        name: string;
                        id: string;
                        branchId: string;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    operations: {
        metrics: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        rangeDays: number;
                        totalCases: number;
                        completedCases: number;
                        cancelledCases: number;
                        cancellationByKind: Partial<Record<string, number>>;
                        casesByTier: Partial<Record<string, number>>;
                        checklistCompletionRatePct: number | null;
                        gateOverrides: {
                            count: number;
                            entries: {
                                caseCode: string;
                                detail: string | null;
                                at: Date;
                                authorName: string | null;
                            }[];
                        };
                        abxProphylaxisRatePct: number | null;
                        countDiscrepancies: number;
                        complications: {
                            total: number;
                            ssi: number;
                            mortality: number;
                            byGrade: Partial<Record<string, number>>;
                        };
                        complicationRatePct: number | null;
                        avgDurationDeltaMin: number | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                };
            };
        };
    };
} & {
    operations: {
        post: {
            body: {
                appointmentId?: string | null | undefined;
                roomId?: string | null | undefined;
                scheduledAt?: string | null | undefined;
                diagnosis?: string | null | undefined;
                estimatedDurationMin?: number | undefined;
                urgency?: "URGENT" | "IMMEDIATE" | "EXPEDITED" | "ELECTIVE" | undefined;
                anesthetistStaffId?: string | null | undefined;
                patientId: string;
                surgeonStaffId: string;
                procedures: {
                    laterality?: "NONE" | "LEFT" | "RIGHT" | "BILATERAL" | undefined;
                    site?: string | null | undefined;
                    serviceId: string;
                }[];
            };
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    room: {
                        name: string;
                        id: string;
                    } | null;
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        name: string;
                        id: string;
                        code: string;
                        gender: import("../staff/staff.type").Gender;
                        age: number | null;
                    };
                    id: string;
                    createdAt: Date;
                    _count: {
                        comments: number;
                    };
                    code: string;
                    status: import("../../../generated/prisma/enums").OperationStatus;
                    team: {
                        staff: {
                            name: string;
                            id: string;
                        };
                        id: string;
                        role: import("../../../generated/prisma/enums").OperationTeamRole;
                    }[];
                    scheduledAt: Date | null;
                    stage: import("../../../generated/prisma/enums").OperationStage | null;
                    tier: import("../../../generated/prisma/enums").OperationTier;
                    estimatedDurationMin: number;
                    urgency: import("../../../generated/prisma/enums").OperationUrgency;
                    plannedAnesthesia: import("../../../generated/prisma/enums").SedationLevel;
                    procedures: {
                        id: string;
                        laterality: import("../../../generated/prisma/enums").OperationLaterality;
                        nameSnapshot: string;
                        site: string | null;
                    }[];
                };
                401: {
                    readonly message: "غير مصرح";
                };
                404: {
                    readonly message: string;
                };
                409: {
                    readonly message: "تعارض في الجدولة مع عمليات أخرى";
                    readonly conflicts: import("./operations.type").OperationScheduleConflict[];
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
} & {
    operations: {
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
                        };
                        room: {
                            name: string;
                            id: string;
                        } | null;
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        };
                        patient: {
                            name: string;
                            id: string;
                            code: string;
                            gender: import("../staff/staff.type").Gender;
                            age: number | null;
                        };
                        invoice: {
                            discount: import("@prisma/client-runtime-utils").Decimal;
                            id: string;
                            vatRate: import("@prisma/client-runtime-utils").Decimal;
                            code: string;
                            status: import("../invoices/invoices.type").InvoiceStatus;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            vatAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                            paidAt: Date | null;
                            subtotal: import("@prisma/client-runtime-utils").Decimal;
                            amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        } | null;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        _count: {
                            comments: number;
                        };
                        code: string;
                        vitalSignsRecords: {
                            id: string;
                            recordedAt: Date;
                            temperature: import("@prisma/client-runtime-utils").Decimal | null;
                            heartRate: number | null;
                            respiratoryRate: number | null;
                            oxygenSaturation: number | null;
                            bloodPressure: string | null;
                        }[];
                        branchId: string;
                        status: import("../../../generated/prisma/enums").OperationStatus;
                        recoveryAssessments: {
                            at: Date;
                            id: string;
                            notes: string | null;
                            painScore: number | null;
                            assessedBy: {
                                name: string;
                                id: string;
                            };
                            score: number | null;
                            painScale: import("../../../generated/prisma/enums").PainScale | null;
                        }[];
                        team: {
                            staff: {
                                name: string;
                                id: string;
                            };
                            id: string;
                            role: import("../../../generated/prisma/enums").OperationTeamRole;
                        }[];
                        consents: {
                            type: import("../../../generated/prisma/enums").ConsentType;
                            id: string;
                            createdAt: Date;
                            signatureUrl: string | null;
                            revokedAt: Date | null;
                            textSnapshot: string;
                            signerName: string | null;
                            signerRelationship: string | null;
                            signatureMethod: import("../../../generated/prisma/enums").SignatureMethod | null;
                            signedAt: Date | null;
                            revokeReason: string | null;
                            witnessStaff: {
                                name: string;
                                id: string;
                            } | null;
                            estimateLow: import("@prisma/client-runtime-utils").Decimal | null;
                            estimateHigh: import("@prisma/client-runtime-utils").Decimal | null;
                        }[];
                        appointmentId: string | null;
                        cancelReason: string | null;
                        activity: {
                            type: import("../../../generated/prisma/enums").OperationActivityType;
                            id: string;
                            createdAt: Date;
                            detail: string | null;
                            author: {
                                name: string;
                                id: string;
                            } | null;
                        }[];
                        postOpOrders: {
                            id: string;
                            createdAt: Date;
                            kind: import("../../../generated/prisma/enums").PostOpOrderKind;
                            dueAt: Date | null;
                            instructions: string;
                            followUpAppointmentId: string | null;
                        }[];
                        scheduledAt: Date | null;
                        stage: import("../../../generated/prisma/enums").OperationStage | null;
                        note: {
                            id: string;
                            signedAt: Date | null;
                            proceduresPerformed: string | null;
                            findings: string | null;
                            technique: string | null;
                            estimatedBloodLossMl: number | null;
                            complicationsNarrative: string | null;
                            closureDetails: string | null;
                            drainsPlaced: string | null;
                            signedBy: {
                                name: string;
                                id: string;
                            } | null;
                        } | null;
                        tier: import("../../../generated/prisma/enums").OperationTier;
                        diagnosis: string | null;
                        assessment: {
                            id: string;
                            vitalsRecordId: string | null;
                            medications: string | null;
                            allergies: string | null;
                            asaClass: number | null;
                            assessedAt: Date | null;
                            assessedBy: {
                                name: string;
                                id: string;
                            } | null;
                            asaEmergency: boolean;
                            lastFoodAt: Date | null;
                            lastWaterAt: Date | null;
                            fastingVerified: boolean;
                            physicalFindings: string | null;
                            airwayAssessment: string | null;
                            bloodworkReviewed: boolean;
                            imagingReviewed: boolean;
                            riskNotes: string | null;
                            premedPlan: string | null;
                        } | null;
                        estimatedDurationMin: number;
                        tierOverrideReason: string | null;
                        urgency: import("../../../generated/prisma/enums").OperationUrgency;
                        plannedAnesthesia: import("../../../generated/prisma/enums").SedationLevel;
                        ssiSurveillanceUntil: Date | null;
                        clinicalSummary: string | null;
                        cancelKind: import("../../../generated/prisma/enums").OperationCancelKind | null;
                        procedures: {
                            id: string;
                            serviceId: string;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            laterality: import("../../../generated/prisma/enums").OperationLaterality;
                            nameSnapshot: string;
                            site: string | null;
                            performed: boolean;
                        }[];
                        checklistRuns: {
                            id: string;
                            templateId: string;
                            scope: import("../../../generated/prisma/enums").ChecklistScope;
                            items: {
                                id: string;
                                order: number;
                                required: boolean;
                                response: import("../../../generated/prisma/enums").ChecklistItemResponse | null;
                                responseType: import("../../../generated/prisma/enums").ChecklistResponseType;
                                textSnapshot: string;
                                valueText: string | null;
                                respondedAt: Date | null;
                            }[];
                            completedAt: Date | null;
                            templateVersion: number;
                        }[];
                        anesthesia: {
                            id: string;
                            notes: string | null;
                            events: {
                                at: Date;
                                id: string;
                                detail: string | null;
                                route: import("../../../generated/prisma/enums").DrugRoute | null;
                                kind: import("../../../generated/prisma/enums").AnesthesiaEventKind;
                                recordedBy: {
                                    name: string;
                                    id: string;
                                };
                                doseUnit: string | null;
                                dose: import("@prisma/client-runtime-utils").Decimal | null;
                                agentName: string | null;
                            }[];
                            planned: import("../../../generated/prisma/enums").SedationLevel;
                            actual: import("../../../generated/prisma/enums").SedationLevel | null;
                            airway: string | null;
                            ettSize: string | null;
                            circuit: string | null;
                            ivAccess: string | null;
                            monitoringIntervalMin: number;
                            premedAt: Date | null;
                            inductionAt: Date | null;
                            incisionAt: Date | null;
                            closureAt: Date | null;
                            endAnesthesiaAt: Date | null;
                            extubationAt: Date | null;
                            anesthetistStaff: {
                                name: string;
                                id: string;
                            } | null;
                        } | null;
                        counts: {
                            type: import("../../../generated/prisma/enums").CountType;
                            id: string;
                            initialCount: number | null;
                            finalCount: number | null;
                            reconciled: boolean;
                            discrepancyNote: string | null;
                        }[];
                        implants: {
                            name: string;
                            id: string;
                            site: string | null;
                            manufacturer: string | null;
                            lotNumber: string | null;
                            serialNumber: string | null;
                            udi: string | null;
                        }[];
                        specimens: {
                            id: string;
                            description: string | null;
                            labOrderId: string | null;
                            label: string;
                            containerCount: number;
                            sentToLabAt: Date | null;
                        }[];
                        consumables: {
                            type: import("../../../generated/prisma/enums").OperationConsumableType;
                            id: string;
                            quantity: number;
                            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
                            inventoryItemId: string | null;
                            nameSnapshot: string;
                            issuedAt: Date | null;
                            countedQuantity: number | null;
                            countNote: string | null;
                        }[];
                        complications: {
                            id: string;
                            detail: string | null;
                            kind: string;
                            phase: import("../../../generated/prisma/enums").ComplicationPhase;
                            clavienDindoGrade: import("../../../generated/prisma/enums").ClavienDindo | null;
                            isSSI: boolean;
                            occurredAt: Date;
                            reportedBy: {
                                name: string;
                                id: string;
                            };
                        }[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    404: {
                        readonly message: string;
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
} & {
    operations: {
        ":id": {
            status: {
                patch: {
                    body: {
                        cancelReason?: string | undefined;
                        overrideReason?: string | undefined;
                        cancelKind?: "OWNER" | "CLINIC" | "CLINICAL" | undefined;
                        status: "CANCELLED" | "COMPLETED" | "SCHEDULED" | "FOLLOW_UP" | "PREP" | "ANESTHESIA" | "SURGERY" | "RECOVERY" | "DISCHARGE";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                name: string;
                                id: string;
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                                gender: import("../staff/staff.type").Gender;
                                age: number | null;
                            };
                            id: string;
                            createdAt: Date;
                            _count: {
                                comments: number;
                            };
                            code: string;
                            status: import("../../../generated/prisma/enums").OperationStatus;
                            team: {
                                staff: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                role: import("../../../generated/prisma/enums").OperationTeamRole;
                            }[];
                            scheduledAt: Date | null;
                            stage: import("../../../generated/prisma/enums").OperationStage | null;
                            tier: import("../../../generated/prisma/enums").OperationTier;
                            estimatedDurationMin: number;
                            urgency: import("../../../generated/prisma/enums").OperationUrgency;
                            plannedAnesthesia: import("../../../generated/prisma/enums").SedationLevel;
                            procedures: {
                                id: string;
                                laterality: import("../../../generated/prisma/enums").OperationLaterality;
                                nameSnapshot: string;
                                site: string | null;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
                        } | {
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
    operations: {
        ":id": {
            stage: {
                patch: {
                    body: {
                        direction: "next" | "previous";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                name: string;
                                id: string;
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                                gender: import("../staff/staff.type").Gender;
                                age: number | null;
                            };
                            id: string;
                            createdAt: Date;
                            _count: {
                                comments: number;
                            };
                            code: string;
                            status: import("../../../generated/prisma/enums").OperationStatus;
                            team: {
                                staff: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                role: import("../../../generated/prisma/enums").OperationTeamRole;
                            }[];
                            scheduledAt: Date | null;
                            stage: import("../../../generated/prisma/enums").OperationStage | null;
                            tier: import("../../../generated/prisma/enums").OperationTier;
                            estimatedDurationMin: number;
                            urgency: import("../../../generated/prisma/enums").OperationUrgency;
                            plannedAnesthesia: import("../../../generated/prisma/enums").SedationLevel;
                            procedures: {
                                id: string;
                                laterality: import("../../../generated/prisma/enums").OperationLaterality;
                                nameSnapshot: string;
                                site: string | null;
                            }[];
                        } | import("@/server/operations/operations.dao").OperationsTransitionResult;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            schedule: {
                patch: {
                    body: {
                        roomId?: string | null | undefined;
                        estimatedDurationMin?: number | undefined;
                        scheduledAt: string | null;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                name: string;
                                id: string;
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                                gender: import("../staff/staff.type").Gender;
                                age: number | null;
                            };
                            id: string;
                            createdAt: Date;
                            _count: {
                                comments: number;
                            };
                            code: string;
                            status: import("../../../generated/prisma/enums").OperationStatus;
                            team: {
                                staff: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                role: import("../../../generated/prisma/enums").OperationTeamRole;
                            }[];
                            scheduledAt: Date | null;
                            stage: import("../../../generated/prisma/enums").OperationStage | null;
                            tier: import("../../../generated/prisma/enums").OperationTier;
                            estimatedDurationMin: number;
                            urgency: import("../../../generated/prisma/enums").OperationUrgency;
                            plannedAnesthesia: import("../../../generated/prisma/enums").SedationLevel;
                            procedures: {
                                id: string;
                                laterality: import("../../../generated/prisma/enums").OperationLaterality;
                                nameSnapshot: string;
                                site: string | null;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
                        };
                        409: {
                            readonly message: "تعارض في الجدولة مع عمليات أخرى";
                            readonly conflicts: import("./operations.type").OperationScheduleConflict[];
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
    operations: {
        ":id": {
            urgency: {
                patch: {
                    body: {
                        urgency: "URGENT" | "IMMEDIATE" | "EXPEDITED" | "ELECTIVE";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                name: string;
                                id: string;
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                name: string;
                                id: string;
                                code: string;
                                gender: import("../staff/staff.type").Gender;
                                age: number | null;
                            };
                            id: string;
                            createdAt: Date;
                            _count: {
                                comments: number;
                            };
                            code: string;
                            status: import("../../../generated/prisma/enums").OperationStatus;
                            team: {
                                staff: {
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                role: import("../../../generated/prisma/enums").OperationTeamRole;
                            }[];
                            scheduledAt: Date | null;
                            stage: import("../../../generated/prisma/enums").OperationStage | null;
                            tier: import("../../../generated/prisma/enums").OperationTier;
                            estimatedDurationMin: number;
                            urgency: import("../../../generated/prisma/enums").OperationUrgency;
                            plannedAnesthesia: import("../../../generated/prisma/enums").SedationLevel;
                            procedures: {
                                id: string;
                                laterality: import("../../../generated/prisma/enums").OperationLaterality;
                                nameSnapshot: string;
                                site: string | null;
                            }[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            consents: {
                post: {
                    body: {
                        textSnapshot?: string | undefined;
                        estimateLow?: number | null | undefined;
                        estimateHigh?: number | null | undefined;
                        type: "SURGICAL" | "ANESTHESIA" | "BLOOD_PRODUCTS" | "EUTHANASIA" | "FINANCIAL_ESTIMATE";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("../../../generated/prisma/enums").ConsentType;
                            id: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            consents: {
                ":consentId": {
                    sign: {
                        post: {
                            body: {
                                signatureUrl?: string | null | undefined;
                                signerRelationship?: string | null | undefined;
                                witnessStaffId?: string | null | undefined;
                                signerName: string;
                                signatureMethod: "DRAWN" | "TYPED" | "UPLOADED" | "VERBAL_WITNESSED";
                            };
                            params: {
                                id: string;
                                consentId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    type: import("../../../generated/prisma/enums").ConsentType;
                                    id: string;
                                    caseId: string;
                                    signedAt: Date | null;
                                };
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                404: {
                                    readonly message: string;
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
    };
} & {
    operations: {
        ":id": {
            consents: {
                ":consentId": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                            consentId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: string;
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
    operations: {
        ":id": {
            consents: {
                ":consentId": {
                    revoke: {
                        post: {
                            body: {
                                reason: string;
                            };
                            params: {
                                id: string;
                                consentId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    type: import("../../../generated/prisma/enums").ConsentType;
                                    id: string;
                                    revokedAt: Date | null;
                                    caseId: string;
                                };
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                404: {
                                    readonly message: string;
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
    };
} & {
    operations: {
        ":id": {
            assessment: {
                put: {
                    body: {
                        medications?: string | null | undefined;
                        allergies?: string | null | undefined;
                        asaClass?: number | null | undefined;
                        asaEmergency?: boolean | undefined;
                        lastFoodAt?: string | null | undefined;
                        lastWaterAt?: string | null | undefined;
                        fastingVerified?: boolean | undefined;
                        physicalFindings?: string | null | undefined;
                        airwayAssessment?: string | null | undefined;
                        bloodworkReviewed?: boolean | undefined;
                        imagingReviewed?: boolean | undefined;
                        riskNotes?: string | null | undefined;
                        premedPlan?: string | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            asaClass: number | null;
                            caseId: string;
                            fastingVerified: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            checklists: {
                start: {
                    post: {
                        body: {
                            scope: "OPERATION_SIGN_IN" | "OPERATION_TIME_OUT" | "OPERATION_SIGN_OUT" | "OPERATION_MINOR_COMBINED";
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: string;
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
    operations: {
        ":id": {
            checklists: {
                items: {
                    ":itemId": {
                        respond: {
                            post: {
                                body: {
                                    valueText?: string | null | undefined;
                                    response: "CONFIRMED" | "NA" | "NO" | "YES";
                                };
                                params: {
                                    id: string;
                                    itemId: string;
                                };
                                query: {};
                                headers: {};
                                response: {
                                    200: {
                                        id: string;
                                        response: import("../../../generated/prisma/enums").ChecklistItemResponse | null;
                                        respondedAt: Date | null;
                                    };
                                    401: {
                                        readonly message: "غير مصرح";
                                    };
                                    404: {
                                        readonly message: string;
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
        };
    };
} & {
    operations: {
        ":id": {
            checklists: {
                complete: {
                    post: {
                        body: {
                            scope: "OPERATION_SIGN_IN" | "OPERATION_TIME_OUT" | "OPERATION_SIGN_OUT" | "OPERATION_MINOR_COMBINED";
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                scope: import("../../../generated/prisma/enums").ChecklistScope;
                                completedAt: Date | null;
                                caseId: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: string;
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
    operations: {
        ":id": {
            anesthesia: {
                put: {
                    body: {
                        notes?: string | null | undefined;
                        actual?: "NONE" | "ANXIOLYSIS" | "SEDATION" | "GENERAL_ANESTHESIA" | null | undefined;
                        airway?: string | null | undefined;
                        ettSize?: string | null | undefined;
                        circuit?: string | null | undefined;
                        ivAccess?: string | null | undefined;
                        monitoringIntervalMin?: number | undefined;
                        premedAt?: string | null | undefined;
                        inductionAt?: string | null | undefined;
                        incisionAt?: string | null | undefined;
                        closureAt?: string | null | undefined;
                        endAnesthesiaAt?: string | null | undefined;
                        extubationAt?: string | null | undefined;
                        anesthetistStaffId?: string | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            caseId: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            anesthesia: {
                events: {
                    post: {
                        body: {
                            at?: string | null | undefined;
                            detail?: string | null | undefined;
                            route?: "OTHER" | "IV" | "IM" | "SC" | "PO" | "INHALATION" | "TOPICAL" | "EPIDURAL" | null | undefined;
                            doseUnit?: string | null | undefined;
                            dose?: number | null | undefined;
                            agentName?: string | null | undefined;
                            kind: "FLUID" | "NOTE" | "DRUG" | "ABX_PROPHYLAXIS" | "POSITION" | "EVENT";
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                at: Date;
                                id: string;
                                kind: import("../../../generated/prisma/enums").AnesthesiaEventKind;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: string;
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
    operations: {
        ":id": {
            note: {
                put: {
                    body: {
                        proceduresPerformed?: string | null | undefined;
                        findings?: string | null | undefined;
                        technique?: string | null | undefined;
                        estimatedBloodLossMl?: number | null | undefined;
                        complicationsNarrative?: string | null | undefined;
                        closureDetails?: string | null | undefined;
                        drainsPlaced?: string | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            caseId: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            note: {
                sign: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                caseId: string;
                                signedAt: Date | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: string;
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
    operations: {
        ":id": {
            note: {
                generate: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("@/server/operations/operations-ai.service").OperationNoteDraft;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الحالة غير موجودة";
                            };
                            422: {
                                readonly message: "التقرير موقَّع — لا تعديل بعد التوقيع";
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
                                readonly message: "تعذّر توليد المسودة — اكتب التقرير يدويًا أو أعد المحاولة";
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    operations: {
        ":id": {
            "discharge-instructions": {
                generate: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                instructions: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: "الحالة غير موجودة";
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
                            502: {
                                readonly message: "تعذّر توليد التعليمات — اكتبها يدويًا أو أعد المحاولة";
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    operations: {
        ":id": {
            counts: {
                put: {
                    body: {
                        initialCount?: number | null | undefined;
                        finalCount?: number | null | undefined;
                        reconciled?: boolean | undefined;
                        discrepancyNote?: string | null | undefined;
                        type: "SPONGE" | "NEEDLE" | "INSTRUMENT";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("../../../generated/prisma/enums").CountType;
                            id: string;
                            reconciled: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            implants: {
                post: {
                    body: {
                        site?: string | null | undefined;
                        manufacturer?: string | null | undefined;
                        lotNumber?: string | null | undefined;
                        serialNumber?: string | null | undefined;
                        udi?: string | null | undefined;
                        name: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            name: string;
                            id: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            specimens: {
                post: {
                    body: {
                        description?: string | null | undefined;
                        containerCount?: number | undefined;
                        label: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            label: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            recovery: {
                post: {
                    body: {
                        notes?: string | null | undefined;
                        painScore?: number | null | undefined;
                        score?: number | null | undefined;
                        painScale?: "OTHER" | "GLASGOW_CMPS" | "NRS" | "VAS" | "FLACC" | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            at: Date;
                            id: string;
                            score: number | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            "post-op-orders": {
                post: {
                    body: {
                        dueAt?: string | null | undefined;
                        kind: "MEDICATION" | "MONITORING" | "FEEDING" | "ACTIVITY" | "WOUND_CARE" | "FOLLOW_UP" | "SUTURE_REMOVAL";
                        instructions: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            kind: import("../../../generated/prisma/enums").PostOpOrderKind;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            consumables: {
                post: {
                    body: {
                        type?: "BURNED" | "ADDITIONAL" | undefined;
                        name?: string | null | undefined;
                        price?: number | null | undefined;
                        inventoryItemId?: string | null | undefined;
                        quantity: number;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            nameSnapshot: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            consumables: {
                ":consumableId": {
                    count: {
                        patch: {
                            body: {
                                countedQuantity?: number | null | undefined;
                                countNote?: string | null | undefined;
                            };
                            params: {
                                id: string;
                                consumableId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    id: string;
                                    countedQuantity: number | null;
                                    countNote: string | null;
                                };
                                401: {
                                    readonly message: "غير مصرح";
                                };
                                404: {
                                    readonly message: string;
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
    };
} & {
    operations: {
        ":id": {
            consumables: {
                ":consumableId": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                            consumableId: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: string;
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
    operations: {
        ":id": {
            invoice: {
                post: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            discount: import("@prisma/client-runtime-utils").Decimal;
                            id: string;
                            vatRate: import("@prisma/client-runtime-utils").Decimal;
                            currencyCode: string;
                            code: string;
                            status: import("../invoices/invoices.type").InvoiceStatus;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            vatAmount: import("@prisma/client-runtime-utils").Decimal;
                            paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                            paidAt: Date | null;
                            subtotal: import("@prisma/client-runtime-utils").Decimal;
                            amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            complications: {
                post: {
                    body: {
                        detail?: string | null | undefined;
                        clavienDindoGrade?: "GRADE_I" | "GRADE_II" | "GRADE_IIIA" | "GRADE_IIIB" | "GRADE_IVA" | "GRADE_IVB" | "GRADE_V" | null | undefined;
                        isSSI?: boolean | undefined;
                        occurredAt?: string | null | undefined;
                        kind: string;
                        phase: "RECOVERY" | "INTRA_OP" | "POST_OP";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            kind: string;
                            clavienDindoGrade: import("../../../generated/prisma/enums").ClavienDindo | null;
                            isSSI: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            comments: {
                post: {
                    body: {
                        mentionStaffIds?: string[] | undefined;
                        body: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        404: {
                            readonly message: string;
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
    operations: {
        ":id": {
            invoice: {
                pay: {
                    post: {
                        body: {
                            insurance?: {
                                excludedLineRefs?: string[] | undefined;
                                apply?: boolean | undefined;
                            } | undefined;
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
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                                paidAt: Date | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            404: {
                                readonly message: string;
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
