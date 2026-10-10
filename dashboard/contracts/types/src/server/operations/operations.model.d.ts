import Elysia from "elysia";
export declare const operationsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
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
