import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { type ConsentType, OperationLaterality, type OperationStatus, SedationLevel } from "@/generated/prisma/enums";
export declare const SEDATION_ORDER: readonly ["NONE", "ANXIOLYSIS", "SEDATION", "GENERAL_ANESTHESIA"];
export declare const maxSedationLevel: (levels: readonly SedationLevel[]) => SedationLevel;
export declare const OPERATION_LATERALITY_LABELS: Record<OperationLaterality, string>;
declare const caseCardSelect: {
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly stage: true;
    readonly tier: true;
    readonly urgency: true;
    readonly plannedAnesthesia: true;
    readonly scheduledAt: true;
    readonly estimatedDurationMin: true;
    readonly createdAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly age: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly room: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly procedures: {
        readonly select: {
            readonly id: true;
            readonly nameSnapshot: true;
            readonly laterality: true;
            readonly site: true;
        };
    };
    readonly team: {
        readonly select: {
            readonly id: true;
            readonly role: true;
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly _count: {
        readonly select: {
            readonly comments: true;
        };
    };
};
export type OperationCaseCardResponse = Prisma.OperationCaseGetPayload<{
    select: typeof caseCardSelect;
}>;
export declare const caseCardSelectShape: {
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly stage: true;
    readonly tier: true;
    readonly urgency: true;
    readonly plannedAnesthesia: true;
    readonly scheduledAt: true;
    readonly estimatedDurationMin: true;
    readonly createdAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly age: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly room: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly procedures: {
        readonly select: {
            readonly id: true;
            readonly nameSnapshot: true;
            readonly laterality: true;
            readonly site: true;
        };
    };
    readonly team: {
        readonly select: {
            readonly id: true;
            readonly role: true;
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly _count: {
        readonly select: {
            readonly comments: true;
        };
    };
};
declare const caseDetailSelect: {
    readonly branchId: true;
    readonly branch: {
        readonly select: {
            readonly name: true;
        };
    };
    readonly procedures: {
        readonly select: {
            readonly id: true;
            readonly serviceId: true;
            readonly nameSnapshot: true;
            readonly laterality: true;
            readonly site: true;
            readonly priceSnapshot: true;
            readonly performed: true;
        };
    };
    readonly appointmentId: true;
    readonly diagnosis: true;
    readonly clinicalSummary: true;
    readonly tierOverrideReason: true;
    readonly cancelKind: true;
    readonly cancelReason: true;
    readonly updatedAt: true;
    readonly consents: {
        readonly select: {
            readonly id: true;
            readonly type: true;
            readonly textSnapshot: true;
            readonly estimateLow: true;
            readonly estimateHigh: true;
            readonly signerName: true;
            readonly signerRelationship: true;
            readonly signatureMethod: true;
            readonly signatureUrl: true;
            readonly witnessStaff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly signedAt: true;
            readonly revokedAt: true;
            readonly revokeReason: true;
            readonly createdAt: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly assessment: {
        readonly select: {
            readonly id: true;
            readonly asaClass: true;
            readonly asaEmergency: true;
            readonly lastFoodAt: true;
            readonly lastWaterAt: true;
            readonly fastingVerified: true;
            readonly vitalsRecordId: true;
            readonly physicalFindings: true;
            readonly airwayAssessment: true;
            readonly medications: true;
            readonly allergies: true;
            readonly bloodworkReviewed: true;
            readonly imagingReviewed: true;
            readonly riskNotes: true;
            readonly premedPlan: true;
            readonly assessedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly assessedAt: true;
        };
    };
    readonly checklistRuns: {
        readonly select: {
            readonly id: true;
            readonly scope: true;
            readonly templateId: true;
            readonly templateVersion: true;
            readonly completedAt: true;
            readonly items: {
                readonly select: {
                    readonly id: true;
                    readonly order: true;
                    readonly textSnapshot: true;
                    readonly required: true;
                    readonly responseType: true;
                    readonly response: true;
                    readonly valueText: true;
                    readonly respondedAt: true;
                };
                readonly orderBy: {
                    readonly order: "asc";
                };
            };
        };
    };
    readonly anesthesia: {
        readonly select: {
            readonly id: true;
            readonly planned: true;
            readonly actual: true;
            readonly airway: true;
            readonly ettSize: true;
            readonly circuit: true;
            readonly ivAccess: true;
            readonly monitoringIntervalMin: true;
            readonly premedAt: true;
            readonly inductionAt: true;
            readonly incisionAt: true;
            readonly closureAt: true;
            readonly endAnesthesiaAt: true;
            readonly extubationAt: true;
            readonly notes: true;
            readonly anesthetistStaff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly events: {
                readonly select: {
                    readonly id: true;
                    readonly at: true;
                    readonly kind: true;
                    readonly agentName: true;
                    readonly dose: true;
                    readonly doseUnit: true;
                    readonly route: true;
                    readonly detail: true;
                    readonly recordedBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
                readonly orderBy: {
                    readonly at: "asc";
                };
            };
        };
    };
    readonly note: {
        readonly select: {
            readonly id: true;
            readonly proceduresPerformed: true;
            readonly findings: true;
            readonly technique: true;
            readonly estimatedBloodLossMl: true;
            readonly complicationsNarrative: true;
            readonly closureDetails: true;
            readonly drainsPlaced: true;
            readonly signedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly signedAt: true;
        };
    };
    readonly counts: {
        readonly select: {
            readonly id: true;
            readonly type: true;
            readonly initialCount: true;
            readonly finalCount: true;
            readonly reconciled: true;
            readonly discrepancyNote: true;
        };
    };
    readonly implants: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly manufacturer: true;
            readonly lotNumber: true;
            readonly serialNumber: true;
            readonly udi: true;
            readonly site: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly specimens: {
        readonly select: {
            readonly id: true;
            readonly label: true;
            readonly description: true;
            readonly containerCount: true;
            readonly sentToLabAt: true;
            readonly labOrderId: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly consumables: {
        readonly select: {
            readonly id: true;
            readonly inventoryItemId: true;
            readonly nameSnapshot: true;
            readonly quantity: true;
            readonly priceSnapshot: true;
            readonly type: true;
            readonly countedQuantity: true;
            readonly countNote: true;
            readonly issuedAt: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly invoice: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly subtotal: true;
            readonly vatRate: true;
            readonly vatAmount: true;
            readonly discount: true;
            readonly total: true;
            readonly amountPaid: true;
            readonly status: true;
            readonly paymentMethod: true;
            readonly paidAt: true;
        };
    };
    readonly complications: {
        readonly select: {
            readonly id: true;
            readonly phase: true;
            readonly clavienDindoGrade: true;
            readonly isSSI: true;
            readonly kind: true;
            readonly occurredAt: true;
            readonly detail: true;
            readonly reportedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly occurredAt: "desc";
        };
    };
    readonly comments: {
        readonly select: {
            readonly id: true;
            readonly body: true;
            readonly createdAt: true;
            readonly author: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly mentions: {
                readonly select: {
                    readonly staff: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly ssiSurveillanceUntil: true;
    readonly recoveryAssessments: {
        readonly select: {
            readonly id: true;
            readonly at: true;
            readonly score: true;
            readonly painScale: true;
            readonly painScore: true;
            readonly notes: true;
            readonly assessedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly at: "desc";
        };
        readonly take: 30;
    };
    readonly postOpOrders: {
        readonly select: {
            readonly id: true;
            readonly kind: true;
            readonly instructions: true;
            readonly dueAt: true;
            readonly followUpAppointmentId: true;
            readonly createdAt: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly vitalSignsRecords: {
        readonly select: {
            readonly id: true;
            readonly recordedAt: true;
            readonly temperature: true;
            readonly heartRate: true;
            readonly respiratoryRate: true;
            readonly oxygenSaturation: true;
            readonly bloodPressure: true;
        };
        readonly where: {
            readonly isDeleted: false;
        };
        readonly orderBy: {
            readonly recordedAt: "asc";
        };
        readonly take: 100;
    };
    readonly activity: {
        readonly select: {
            readonly id: true;
            readonly type: true;
            readonly detail: true;
            readonly createdAt: true;
            readonly author: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "desc";
        };
        readonly take: 30;
    };
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly stage: true;
    readonly tier: true;
    readonly urgency: true;
    readonly plannedAnesthesia: true;
    readonly scheduledAt: true;
    readonly estimatedDurationMin: true;
    readonly createdAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly age: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly room: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly team: {
        readonly select: {
            readonly id: true;
            readonly role: true;
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly _count: {
        readonly select: {
            readonly comments: true;
        };
    };
};
export type OperationCaseDetailResponse = Prisma.OperationCaseGetPayload<{
    select: typeof caseDetailSelect;
}>;
export declare const caseDetailSelectShape: {
    readonly branchId: true;
    readonly branch: {
        readonly select: {
            readonly name: true;
        };
    };
    readonly procedures: {
        readonly select: {
            readonly id: true;
            readonly serviceId: true;
            readonly nameSnapshot: true;
            readonly laterality: true;
            readonly site: true;
            readonly priceSnapshot: true;
            readonly performed: true;
        };
    };
    readonly appointmentId: true;
    readonly diagnosis: true;
    readonly clinicalSummary: true;
    readonly tierOverrideReason: true;
    readonly cancelKind: true;
    readonly cancelReason: true;
    readonly updatedAt: true;
    readonly consents: {
        readonly select: {
            readonly id: true;
            readonly type: true;
            readonly textSnapshot: true;
            readonly estimateLow: true;
            readonly estimateHigh: true;
            readonly signerName: true;
            readonly signerRelationship: true;
            readonly signatureMethod: true;
            readonly signatureUrl: true;
            readonly witnessStaff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly signedAt: true;
            readonly revokedAt: true;
            readonly revokeReason: true;
            readonly createdAt: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly assessment: {
        readonly select: {
            readonly id: true;
            readonly asaClass: true;
            readonly asaEmergency: true;
            readonly lastFoodAt: true;
            readonly lastWaterAt: true;
            readonly fastingVerified: true;
            readonly vitalsRecordId: true;
            readonly physicalFindings: true;
            readonly airwayAssessment: true;
            readonly medications: true;
            readonly allergies: true;
            readonly bloodworkReviewed: true;
            readonly imagingReviewed: true;
            readonly riskNotes: true;
            readonly premedPlan: true;
            readonly assessedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly assessedAt: true;
        };
    };
    readonly checklistRuns: {
        readonly select: {
            readonly id: true;
            readonly scope: true;
            readonly templateId: true;
            readonly templateVersion: true;
            readonly completedAt: true;
            readonly items: {
                readonly select: {
                    readonly id: true;
                    readonly order: true;
                    readonly textSnapshot: true;
                    readonly required: true;
                    readonly responseType: true;
                    readonly response: true;
                    readonly valueText: true;
                    readonly respondedAt: true;
                };
                readonly orderBy: {
                    readonly order: "asc";
                };
            };
        };
    };
    readonly anesthesia: {
        readonly select: {
            readonly id: true;
            readonly planned: true;
            readonly actual: true;
            readonly airway: true;
            readonly ettSize: true;
            readonly circuit: true;
            readonly ivAccess: true;
            readonly monitoringIntervalMin: true;
            readonly premedAt: true;
            readonly inductionAt: true;
            readonly incisionAt: true;
            readonly closureAt: true;
            readonly endAnesthesiaAt: true;
            readonly extubationAt: true;
            readonly notes: true;
            readonly anesthetistStaff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly events: {
                readonly select: {
                    readonly id: true;
                    readonly at: true;
                    readonly kind: true;
                    readonly agentName: true;
                    readonly dose: true;
                    readonly doseUnit: true;
                    readonly route: true;
                    readonly detail: true;
                    readonly recordedBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
                readonly orderBy: {
                    readonly at: "asc";
                };
            };
        };
    };
    readonly note: {
        readonly select: {
            readonly id: true;
            readonly proceduresPerformed: true;
            readonly findings: true;
            readonly technique: true;
            readonly estimatedBloodLossMl: true;
            readonly complicationsNarrative: true;
            readonly closureDetails: true;
            readonly drainsPlaced: true;
            readonly signedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly signedAt: true;
        };
    };
    readonly counts: {
        readonly select: {
            readonly id: true;
            readonly type: true;
            readonly initialCount: true;
            readonly finalCount: true;
            readonly reconciled: true;
            readonly discrepancyNote: true;
        };
    };
    readonly implants: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly manufacturer: true;
            readonly lotNumber: true;
            readonly serialNumber: true;
            readonly udi: true;
            readonly site: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly specimens: {
        readonly select: {
            readonly id: true;
            readonly label: true;
            readonly description: true;
            readonly containerCount: true;
            readonly sentToLabAt: true;
            readonly labOrderId: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly consumables: {
        readonly select: {
            readonly id: true;
            readonly inventoryItemId: true;
            readonly nameSnapshot: true;
            readonly quantity: true;
            readonly priceSnapshot: true;
            readonly type: true;
            readonly countedQuantity: true;
            readonly countNote: true;
            readonly issuedAt: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly invoice: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly subtotal: true;
            readonly vatRate: true;
            readonly vatAmount: true;
            readonly discount: true;
            readonly total: true;
            readonly amountPaid: true;
            readonly status: true;
            readonly paymentMethod: true;
            readonly paidAt: true;
        };
    };
    readonly complications: {
        readonly select: {
            readonly id: true;
            readonly phase: true;
            readonly clavienDindoGrade: true;
            readonly isSSI: true;
            readonly kind: true;
            readonly occurredAt: true;
            readonly detail: true;
            readonly reportedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly occurredAt: "desc";
        };
    };
    readonly comments: {
        readonly select: {
            readonly id: true;
            readonly body: true;
            readonly createdAt: true;
            readonly author: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly mentions: {
                readonly select: {
                    readonly staff: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly ssiSurveillanceUntil: true;
    readonly recoveryAssessments: {
        readonly select: {
            readonly id: true;
            readonly at: true;
            readonly score: true;
            readonly painScale: true;
            readonly painScore: true;
            readonly notes: true;
            readonly assessedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly at: "desc";
        };
        readonly take: 30;
    };
    readonly postOpOrders: {
        readonly select: {
            readonly id: true;
            readonly kind: true;
            readonly instructions: true;
            readonly dueAt: true;
            readonly followUpAppointmentId: true;
            readonly createdAt: true;
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly vitalSignsRecords: {
        readonly select: {
            readonly id: true;
            readonly recordedAt: true;
            readonly temperature: true;
            readonly heartRate: true;
            readonly respiratoryRate: true;
            readonly oxygenSaturation: true;
            readonly bloodPressure: true;
        };
        readonly where: {
            readonly isDeleted: false;
        };
        readonly orderBy: {
            readonly recordedAt: "asc";
        };
        readonly take: 100;
    };
    readonly activity: {
        readonly select: {
            readonly id: true;
            readonly type: true;
            readonly detail: true;
            readonly createdAt: true;
            readonly author: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "desc";
        };
        readonly take: 30;
    };
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly stage: true;
    readonly tier: true;
    readonly urgency: true;
    readonly plannedAnesthesia: true;
    readonly scheduledAt: true;
    readonly estimatedDurationMin: true;
    readonly createdAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly age: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly room: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly team: {
        readonly select: {
            readonly id: true;
            readonly role: true;
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly _count: {
        readonly select: {
            readonly comments: true;
        };
    };
};
/** إحصاءات اللوحة — تجميع محسوب، لا يقابله مخطط Prisma واحد */
export type OperationsStatsResponse = {
    total: number;
    byStatus: Partial<Record<OperationStatus, number>>;
    /** الحالات النشطة فورية أو عاجلة */
    urgent: number;
    /** حالات نشطة بلا موعد */
    unscheduled: number;
};
/** مؤشرات العمليات (§9) — تجاميع محسوبة على نافذة زمنية، لا مخطط Prisma واحدًا يقابلها */
export type OperationsMetricsResponse = {
    rangeDays: number;
    totalCases: number;
    completedCases: number;
    cancelledCases: number;
    cancellationByKind: Partial<Record<"OWNER" | "CLINIC" | "CLINICAL", number>>;
    casesByTier: Partial<Record<"MINOR" | "INTERMEDIATE" | "MAJOR", number>>;
    /** نسبة قوائم التحقق المكتملة إلى المتوقعة على الحالات المكتملة (S1) */
    checklistCompletionRatePct: number | null;
    /** تجاوزات بوابات الأمان — قائمة المراجعة (break-glass، S21) */
    gateOverrides: {
        count: number;
        entries: {
            caseCode: string;
            detail: string | null;
            at: Date | string;
            authorName: string | null;
        }[];
    };
    /** حالات تخدير عام مكتملة أُعطي فيها مضاد وقائي قبل الشق (S9) */
    abxProphylaxisRatePct: number | null;
    /** صفوف عدّ بفرق موثَّق (S10) */
    countDiscrepancies: number;
    complications: {
        total: number;
        ssi: number;
        mortality: number;
        byGrade: Partial<Record<string, number>>;
    };
    /** نسبة الحالات المكتملة التي سُجّلت لها مضاعفة */
    complicationRatePct: number | null;
    /** متوسط فرق المدة الفعلية (شق→إغلاق) عن المقدّرة بالدقائق — يغذّي تقديرات أدق */
    avgDurationDeltaMin: number | null;
};
/** تعارض جدولة — يُعاد مع 409 ليعرض المتعارضات بالرمز والوقت */
export type OperationScheduleConflict = {
    kind: "room" | "staff";
    caseCode: string;
    scheduledAt: Date | string;
};
export declare const createOperationSchema: z.ZodObject<{
    patientId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    procedures: z.ZodArray<z.ZodObject<{
        serviceId: z.ZodString;
        laterality: z.ZodOptional<z.ZodEnum<{
            readonly NONE: "NONE";
            readonly LEFT: "LEFT";
            readonly RIGHT: "RIGHT";
            readonly BILATERAL: "BILATERAL";
        }>>;
        site: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    surgeonStaffId: z.ZodString;
    anesthetistStaffId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    urgency: z.ZodDefault<z.ZodEnum<{
        readonly IMMEDIATE: "IMMEDIATE";
        readonly URGENT: "URGENT";
        readonly EXPEDITED: "EXPEDITED";
        readonly ELECTIVE: "ELECTIVE";
    }>>;
    scheduledAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    estimatedDurationMin: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    roomId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    diagnosis: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateOperationFormInput = z.input<typeof createOperationSchema>;
export type CreateOperationFormValues = z.output<typeof createOperationSchema>;
export declare const assessmentSchema: z.ZodObject<{
    asaClass: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    asaEmergency: z.ZodDefault<z.ZodBoolean>;
    lastFoodAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastWaterAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fastingVerified: z.ZodDefault<z.ZodBoolean>;
    physicalFindings: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    airwayAssessment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    medications: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    allergies: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bloodworkReviewed: z.ZodDefault<z.ZodBoolean>;
    imagingReviewed: z.ZodDefault<z.ZodBoolean>;
    riskNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    premedPlan: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type AssessmentFormInput = z.input<typeof assessmentSchema>;
export type AssessmentFormValues = z.output<typeof assessmentSchema>;
export declare const CONSENT_TYPE_LABELS: Record<ConsentType, string>;
/**
 * أنواع الموافقات التي تُنشأ داخل حالة عملية. بقية الأنواع (التنويم،
 * الخروج، الفندقة) نماذج على مستوى الطفل ولا معنى لعرضها في قائمة الجراحة.
 */
export declare const OPERATION_CONSENT_TYPES: readonly ["SURGICAL", "ANESTHESIA", "BLOOD_PRODUCTS", "EUTHANASIA", "FINANCIAL_ESTIMATE"];
export type OperationConsentType = (typeof OPERATION_CONSENT_TYPES)[number];
export declare const SIGNATURE_METHOD_LABELS: {
    readonly DRAWN: "توقيع مرسوم";
    readonly TYPED: "اسم مكتوب";
    readonly UPLOADED: "مستند مرفوع";
    readonly VERBAL_WITNESSED: "شفهية بشاهد";
};
export declare const DEFAULT_CONSENT_TEXTS: Record<OperationConsentType, string>;
export type CreateOperationCaseInput = Pick<Prisma.OperationCaseUncheckedCreateInput, "clinicId" | "patientId" | "urgency" | "estimatedDurationMin"> & Partial<Pick<Prisma.OperationCaseUncheckedCreateInput, "appointmentId" | "scheduledAt" | "roomId" | "diagnosis">> & {
    procedures: {
        serviceId: string;
        laterality?: OperationLaterality;
        site?: string | null;
    }[];
    surgeonStaffId: string;
    anesthetistStaffId?: string | null;
    userId: string;
};
export type OperationPaymentStatus = "PAID" | "UNPAID" | "UNBILLED";
export declare const operationPaymentStatus: (c: {
    invoice: {
        status: string;
        paidAt: Date | string | null;
    } | null;
}) => OperationPaymentStatus;
export declare const OPERATION_PAYMENT_META: Record<OperationPaymentStatus, {
    label: string;
    className: string;
}>;
export {};
