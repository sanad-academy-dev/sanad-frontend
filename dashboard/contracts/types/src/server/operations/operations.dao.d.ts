import { type OperationCancelKind, OperationStatus, type OperationTier, type OperationUrgency, type SedationLevel } from "@/generated/prisma/enums";
import { type CreateOperationCaseInput, DEFAULT_CONSENT_TEXTS, type OperationCaseCardResponse, type OperationScheduleConflict, type OperationsStatsResponse } from "@/server/operations/operations.type";
export type OperationsDaoError = "patient-not-found" | "patient-has-no-owner" | "surgeon-not-found" | "anesthetist-not-found" | "service-not-found" | "room-not-found" | "room-not-operating" | "case-not-found" | "cancel-blocked" | "cancel-reason-required" | "override-forbidden" | "override-reason-required" | "no-stage-step" | "urgency-locked" | "consent-not-found" | "consent-already-signed" | "consent-not-signed" | "consent-revoked" | "checklist-template-not-found" | "checklist-not-found" | "checklist-completed-immutable" | "checklist-incomplete" | "checklist-item-not-found" | "note-signed-immutable" | "note-incomplete" | "note-not-found" | "consent-signed-immutable" | "consumable-item-not-found" | "consumable-name-required" | "consumable-not-found" | "consumable-kit-immutable" | "consumable-issued-immutable" | "consumable-invoiced-immutable" | "invoice-empty" | "invoice-already-paid";
export type OperationsConflictResult = {
    error: "schedule-conflict";
    conflicts: OperationScheduleConflict[];
};
export type OperationsTransitionResult = {
    error: "invalid-transition" | "gate-blocked";
    message: string;
};
declare const isErr: (v: unknown) => v is OperationsDaoError;
export declare const operationsDao: {
    create(input: CreateOperationCaseInput): Promise<OperationsDaoError | OperationsConflictResult | OperationCaseCardResponse>;
    list(args: {
        clinicId: string;
        period?: "day" | "week" | "all";
        view?: "all" | "for-me";
        userId: string;
        status?: OperationStatus;
        q?: string;
    }): Promise<OperationCaseCardResponse[]>;
    stats(clinicId: string): Promise<OperationsStatsResponse>;
    getById(clinicId: string, id: string): Promise<"case-not-found" | {
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
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
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
        status: OperationStatus;
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
            painScale: import("@/generated/prisma/enums").PainScale | null;
        }[];
        team: {
            staff: {
                name: string;
                id: string;
            };
            id: string;
            role: import("@/generated/prisma/enums").OperationTeamRole;
        }[];
        consents: {
            type: import("@/generated/prisma/enums").ConsentType;
            id: string;
            createdAt: Date;
            signatureUrl: string | null;
            revokedAt: Date | null;
            textSnapshot: string;
            signerName: string | null;
            signerRelationship: string | null;
            signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
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
            type: import("@/generated/prisma/enums").OperationActivityType;
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
            kind: import("@/generated/prisma/enums").PostOpOrderKind;
            dueAt: Date | null;
            instructions: string;
            followUpAppointmentId: string | null;
        }[];
        scheduledAt: Date | null;
        stage: import("@/generated/prisma/enums").OperationStage | null;
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
        tier: OperationTier;
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
        urgency: OperationUrgency;
        plannedAnesthesia: SedationLevel;
        ssiSurveillanceUntil: Date | null;
        clinicalSummary: string | null;
        cancelKind: OperationCancelKind | null;
        procedures: {
            id: string;
            serviceId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            laterality: import("@/generated/prisma/enums").OperationLaterality;
            nameSnapshot: string;
            site: string | null;
            performed: boolean;
        }[];
        checklistRuns: {
            id: string;
            templateId: string;
            scope: import("@/generated/prisma/enums").ChecklistScope;
            items: {
                id: string;
                order: number;
                required: boolean;
                response: import("@/generated/prisma/enums").ChecklistItemResponse | null;
                responseType: import("@/generated/prisma/enums").ChecklistResponseType;
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
                route: import("@/generated/prisma/enums").DrugRoute | null;
                kind: import("@/generated/prisma/enums").AnesthesiaEventKind;
                recordedBy: {
                    name: string;
                    id: string;
                };
                doseUnit: string | null;
                dose: import("@prisma/client-runtime-utils").Decimal | null;
                agentName: string | null;
            }[];
            planned: SedationLevel;
            actual: SedationLevel | null;
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
            type: import("@/generated/prisma/enums").CountType;
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
            type: import("@/generated/prisma/enums").OperationConsumableType;
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
            phase: import("@/generated/prisma/enums").ComplicationPhase;
            clavienDindoGrade: import("@/generated/prisma/enums").ClavienDindo | null;
            isSSI: boolean;
            occurredAt: Date;
            reportedBy: {
                name: string;
                id: string;
            };
        }[];
    }>;
    /**
     * انتقال الحالة — البوابة المركزية (الخطة §5.2):
     * الانتقالات تُفرض من آلة الحالات؛ بوابات المستندات G1–G9 تُحتسب لكنها غير
     * مُفعَّلة بعد — نماذجها (الموافقات/التقييم/القوائم) تصل في OP2/OP3،
     * ومسار التجاوز (break-glass) مفعَّل ومسجَّل من الآن.
     */
    updateStatus(args: {
        clinicId: string;
        id: string;
        to: OperationStatus;
        userId: string;
        overrideReason?: string;
        cancelKind?: OperationCancelKind;
        cancelReason?: string;
    }): Promise<OperationsDaoError | OperationsTransitionResult | OperationCaseCardResponse>;
    /** تقدّم المرحلة خطوة واحدة داخل الحالة — G5 (الوقفة الآمنة) تُفرض في OP3 */
    advanceStage(args: {
        clinicId: string;
        id: string;
        direction: "next" | "previous";
        userId: string;
    }): Promise<OperationsDaoError | OperationsTransitionResult | OperationCaseCardResponse>;
    reschedule(args: {
        clinicId: string;
        id: string;
        scheduledAt: string | null;
        roomId?: string | null;
        estimatedDurationMin?: number;
        userId: string;
    }): Promise<OperationsDaoError | OperationsConflictResult | OperationCaseCardResponse>;
    createConsent(args: {
        clinicId: string;
        caseId: string;
        type: keyof typeof DEFAULT_CONSENT_TEXTS;
        textSnapshot?: string;
        estimateLow?: number | null;
        estimateHigh?: number | null;
        userId: string;
    }): Promise<"case-not-found" | {
        type: import("@/generated/prisma/enums").ConsentType;
        id: string;
    }>;
    /** التوقيع يجمّد الموافقة — التصحيح إبطالٌ وموافقة جديدة (S21) */
    /** حذف موافقة قبل التوقيع فقط — الموقّعة تاريخ يُبطل ولا يُمحى (S21) */
    deleteConsent(args: {
        clinicId: string;
        caseId: string;
        consentId: string;
    }): Promise<"consent-not-found" | "consent-signed-immutable" | {
        id: string;
    }>;
    signConsent(args: {
        clinicId: string;
        caseId: string;
        consentId: string;
        signerName: string;
        signerRelationship?: string | null;
        signatureMethod: "DRAWN" | "TYPED" | "UPLOADED" | "VERBAL_WITNESSED";
        signatureUrl?: string | null;
        witnessStaffId?: string | null;
        userId: string;
    }): Promise<"consent-not-found" | "consent-already-signed" | "consent-revoked" | {
        type: import("@/generated/prisma/enums").ConsentType;
        id: string;
        caseId: string;
        signedAt: Date | null;
    }>;
    revokeConsent(args: {
        clinicId: string;
        caseId: string;
        consentId: string;
        reason: string;
        userId: string;
    }): Promise<"consent-not-found" | "consent-not-signed" | "consent-revoked" | {
        type: import("@/generated/prisma/enums").ConsentType;
        id: string;
        revokedAt: Date | null;
        caseId: string;
    }>;
    upsertAssessment(args: {
        clinicId: string;
        caseId: string;
        userId: string;
        data: {
            asaClass?: number | null;
            asaEmergency?: boolean;
            lastFoodAt?: string | null;
            lastWaterAt?: string | null;
            fastingVerified?: boolean;
            physicalFindings?: string | null;
            airwayAssessment?: string | null;
            medications?: string | null;
            allergies?: string | null;
            bloodworkReviewed?: boolean;
            imagingReviewed?: boolean;
            riskNotes?: string | null;
            premedPlan?: string | null;
        };
    }): Promise<"case-not-found" | {
        id: string;
        asaClass: number | null;
        caseId: string;
        fastingVerified: boolean;
    }>;
    /**
     * بدء تشغيل قائمة: لقطة من أحدث قالب فعّال مطابق للنطاق — قالب الأكاديمية
     * أولًا ثم قالب النظام، والدرجة المطابقة أو العامة. متسامح مع التكرار:
     * التشغيل القائم يُعاد كما هو.
     */
    startChecklist(args: {
        clinicId: string;
        caseId: string;
        scope: "OPERATION_SIGN_IN" | "OPERATION_TIME_OUT" | "OPERATION_SIGN_OUT" | "OPERATION_MINOR_COMBINED";
        userId: string;
    }): Promise<"case-not-found" | "checklist-template-not-found" | {
        id: string;
    }>;
    respondChecklistItem(args: {
        clinicId: string;
        caseId: string;
        itemId: string;
        response: "CONFIRMED" | "YES" | "NO" | "NA";
        valueText?: string | null;
        userId: string;
    }): Promise<"checklist-completed-immutable" | "checklist-item-not-found" | {
        id: string;
        response: import("@/generated/prisma/enums").ChecklistItemResponse | null;
        respondedAt: Date | null;
    }>;
    /** الاكتمال يتطلب استجابة كل البنود الإلزامية — وبعده التشغيل مصون (S21) */
    completeChecklist(args: {
        clinicId: string;
        caseId: string;
        scope: "OPERATION_SIGN_IN" | "OPERATION_TIME_OUT" | "OPERATION_SIGN_OUT" | "OPERATION_MINOR_COMBINED";
        userId: string;
    }): Promise<"checklist-not-found" | "checklist-completed-immutable" | "checklist-incomplete" | {
        id: string;
        scope: import("@/generated/prisma/enums").ChecklistScope;
        completedAt: Date | null;
        caseId: string;
    }>;
    upsertAnesthesia(args: {
        clinicId: string;
        caseId: string;
        userId: string;
        data: {
            actual?: SedationLevel | null;
            airway?: string | null;
            ettSize?: string | null;
            circuit?: string | null;
            ivAccess?: string | null;
            monitoringIntervalMin?: number;
            premedAt?: string | null;
            inductionAt?: string | null;
            incisionAt?: string | null;
            closureAt?: string | null;
            endAnesthesiaAt?: string | null;
            extubationAt?: string | null;
            anesthetistStaffId?: string | null;
            notes?: string | null;
        };
    }): Promise<"case-not-found" | {
        id: string;
        caseId: string;
    }>;
    /** حدث تخدير — إلحاقي فقط، لا يُعدَّل ولا يُحذف (S8، S21) */
    addAnesthesiaEvent(args: {
        clinicId: string;
        caseId: string;
        userId: string;
        data: {
            at?: string | null;
            kind: "DRUG" | "ABX_PROPHYLAXIS" | "FLUID" | "POSITION" | "EVENT" | "NOTE";
            agentName?: string | null;
            dose?: number | null;
            doseUnit?: string | null;
            route?: string | null;
            detail?: string | null;
        };
    }): Promise<"case-not-found" | {
        at: Date;
        id: string;
        kind: import("@/generated/prisma/enums").AnesthesiaEventKind;
    }>;
    upsertNote(args: {
        clinicId: string;
        caseId: string;
        userId: string;
        data: {
            proceduresPerformed?: string | null;
            findings?: string | null;
            technique?: string | null;
            estimatedBloodLossMl?: number | null;
            complicationsNarrative?: string | null;
            closureDetails?: string | null;
            drainsPlaced?: string | null;
        };
    }): Promise<"case-not-found" | "note-signed-immutable" | {
        id: string;
        caseId: string;
    }>;
    /** التوقيع يجمّد التقرير — بوابة G7 لمغادرة الإفاقة (S11، S21) */
    signNote(args: {
        clinicId: string;
        caseId: string;
        userId: string;
    }): Promise<"note-signed-immutable" | "note-incomplete" | "note-not-found" | {
        id: string;
        caseId: string;
        signedAt: Date | null;
    }>;
    upsertCount(args: {
        clinicId: string;
        caseId: string;
        type: "SPONGE" | "NEEDLE" | "INSTRUMENT";
        initialCount?: number | null;
        finalCount?: number | null;
        reconciled?: boolean;
        discrepancyNote?: string | null;
    }): Promise<"case-not-found" | {
        type: import("@/generated/prisma/enums").CountType;
        id: string;
        reconciled: boolean;
    }>;
    addImplant(args: {
        clinicId: string;
        caseId: string;
        data: {
            name: string;
            manufacturer?: string | null;
            lotNumber?: string | null;
            serialNumber?: string | null;
            udi?: string | null;
            site?: string | null;
        };
    }): Promise<"case-not-found" | {
        name: string;
        id: string;
    }>;
    addSpecimen(args: {
        clinicId: string;
        caseId: string;
        data: {
            label: string;
            description?: string | null;
            containerCount?: number;
        };
    }): Promise<"case-not-found" | {
        id: string;
        label: string;
    }>;
    /** مضاعفة إلحاقية — العدوى والوفاة تبثّان إشعارًا عالي الأهمية للأكاديمية */
    addComplication(args: {
        clinicId: string;
        caseId: string;
        userId: string;
        data: {
            phase: "INTRA_OP" | "RECOVERY" | "POST_OP";
            clavienDindoGrade?: "GRADE_I" | "GRADE_II" | "GRADE_IIIA" | "GRADE_IIIB" | "GRADE_IVA" | "GRADE_IVB" | "GRADE_V" | null;
            isSSI?: boolean;
            kind: string;
            occurredAt?: string | null;
            detail?: string | null;
        };
    }): Promise<"case-not-found" | {
        id: string;
        kind: string;
        clavienDindoGrade: import("@/generated/prisma/enums").ClavienDindo | null;
        isSSI: boolean;
    }>;
    addComment(args: {
        clinicId: string;
        caseId: string;
        userId: string;
        body: string;
        mentionStaffIds?: string[];
    }): Promise<"case-not-found" | {
        id: string;
        createdAt: Date;
    }>;
    /** تقييم إفاقة إلحاقي — آخر درجة هي المعتبرة لبوابة G8 */
    addRecoveryAssessment(args: {
        clinicId: string;
        caseId: string;
        userId: string;
        data: {
            score?: number | null;
            painScale?: "GLASGOW_CMPS" | "NRS" | "VAS" | "FLACC" | "OTHER" | null;
            painScore?: number | null;
            notes?: string | null;
        };
    }): Promise<"case-not-found" | {
        at: Date;
        id: string;
        score: number | null;
    }>;
    /** أمر ما بعد الجراحة — إصدار أول أمر يفتح بوابة الخروج G9 */
    addPostOpOrder(args: {
        clinicId: string;
        caseId: string;
        userId: string;
        data: {
            kind: "MEDICATION" | "MONITORING" | "FEEDING" | "ACTIVITY" | "WOUND_CARE" | "FOLLOW_UP" | "SUTURE_REMOVAL";
            instructions: string;
            dueAt?: string | null;
        };
    }): Promise<"case-not-found" | {
        id: string;
        kind: import("@/generated/prisma/enums").PostOpOrderKind;
    }>;
    addConsumable(args: {
        clinicId: string;
        caseId: string;
        data: {
            inventoryItemId?: string | null;
            name?: string | null;
            quantity: number;
            price?: number | null;
            /** لا يُضاف KIT من الواجهة — عدة القالب تُنسخ عند الإنشاء فقط */
            type?: "BURNED" | "ADDITIONAL";
        };
    }): Promise<"case-not-found" | "consumable-item-not-found" | "consumable-name-required" | {
        id: string;
        nameSnapshot: string;
    }>;
    /** عدّ بند مستهلك عند الخروج (S10) — الفرق عن الكمية المصروفة يُوثّق */
    countConsumable(args: {
        clinicId: string;
        caseId: string;
        consumableId: string;
        countedQuantity?: number | null;
        countNote?: string | null;
    }): Promise<"consumable-not-found" | {
        id: string;
        countedQuantity: number | null;
        countNote: string | null;
    }>;
    /** الحذف قبل الصرف وقبل سداد الفاتورة فقط — المصروف والمُفوتر تاريخ لا يُمحى */
    removeConsumable(args: {
        clinicId: string;
        caseId: string;
        consumableId: string;
    }): Promise<"consumable-not-found" | "consumable-kit-immutable" | "consumable-issued-immutable" | "consumable-invoiced-immutable" | {
        id: string;
    }>;
    /**
     * مؤشرات الجودة والالتزام على نافذة زمنية: الإلغاءات بأسبابها، التزام
     * قوائم التحقق، تجاوزات البوابات، توقيت المضاد الوقائي (S9)، فروق العدّ
     * (S10)، المضاعفات وSSI والوفيات (S17–S19)، وفرق المدة الفعلية عن المقدّرة.
     */
    metrics(clinicId: string, rangeDays?: number): Promise<{
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
    }>;
    /** غرف العمليات والفحص النشطة — لاختيار المسرح في إنشاء الحالة وجدولتها */
    listTheatres(clinicId: string): Promise<{
        type: import("@/generated/prisma/enums").RoomType;
        branch: {
            name: string;
        };
        name: string;
        id: string;
        branchId: string;
    }[]>;
    updateUrgency(args: {
        clinicId: string;
        id: string;
        urgency: OperationUrgency;
        userId: string;
    }): Promise<OperationsDaoError | OperationCaseCardResponse>;
};
export { isErr as isOperationsDaoError };
