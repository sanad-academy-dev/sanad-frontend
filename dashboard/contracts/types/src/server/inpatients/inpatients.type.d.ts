import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { CageSizeClass, InpatientAdministrationStatus, InpatientStayStatus } from "@/generated/prisma/enums";
export declare const cageSelect: {
    readonly id: true;
    readonly name: true;
    readonly sizeClass: true;
    readonly notes: true;
    readonly active: true;
    readonly roomId: true;
    readonly branchId: true;
    readonly room: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly type: true;
        };
    };
};
export type CageResponse = Prisma.CageGetPayload<{
    select: typeof cageSelect;
}>;
/** القفص مع شاغله الحالي — ما تعرضه شاشة الإشغال وقائمة اختيار القفص */
export type CageWithOccupancy = CageResponse & {
    occupiedBy: {
        stayId: string;
        code: string;
        patientId: string;
        patientName: string;
        assignedAt: Date;
    } | null;
};
/** [IP2] صفّ في قائمة طلبات الإقامة (تحليل/أشعّة) — عنصر واحد لكل صفّ */
export type InpatientRequestRow = {
    kind: "LAB" | "IMAGING" | "PHARMACY";
    orderId: string;
    itemId: string;
    code: string;
    serviceName: string;
    status: string;
    createdAt: Date;
};
/** كرت اللوحة — أخفّ ما يكفي للعرض والفرز بالإلحاح */
export declare const inpatientStayCardSelect: {
    readonly id: true;
    readonly code: true;
    readonly kind: true;
    readonly status: true;
    readonly acuity: true;
    readonly admittedAt: true;
    readonly expectedDischargeAt: true;
    readonly dischargedAt: true;
    readonly monitoringIntervalMinutes: true;
    readonly nextDueAt: true;
    readonly branchId: true;
    readonly admissionDiagnosis: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly animalType: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                    readonly enName: true;
                };
            };
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly attendingStaff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly cageAssignments: {
        readonly where: {
            readonly releasedAt: null;
        };
        readonly take: 1;
        readonly select: {
            readonly id: true;
            readonly assignedAt: true;
            readonly cage: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly room: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                            readonly type: true;
                        };
                    };
                };
            };
        };
    };
};
export type InpatientStayCard = Prisma.InpatientStayGetPayload<{
    select: typeof inpatientStayCardSelect;
}>;
export declare const inpatientStayDetailSelect: {
    readonly presentingComplaint: true;
    readonly isolationReason: true;
    readonly dischargeKind: true;
    readonly dischargeSummaryAr: true;
    readonly dischargeInstructionsAr: true;
    readonly cancelReasonAr: true;
    readonly dailyRateSnapshot: true;
    readonly appointmentId: true;
    readonly operationCaseId: true;
    readonly admissionWeightRecordId: true;
    readonly createdAt: true;
    readonly clinicId: true;
    readonly dailyRateService: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly admittedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly dischargedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly admissionWeightRecord: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly weight: true;
            readonly recordedAt: true;
        };
    };
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly gender: true;
            readonly birthDate: true;
            readonly weight: true;
            readonly microchipNumber: true;
            readonly coat: true;
            readonly animalType: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                    readonly enName: true;
                    readonly species: true;
                };
            };
            readonly animalStrain: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                    readonly enName: true;
                };
            };
        };
    };
    readonly invoice: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly subtotal: true;
            readonly vatAmount: true;
            readonly discount: true;
            readonly total: true;
            readonly amountPaid: true;
            readonly status: true;
            readonly currencyCode: true;
        };
    };
    readonly id: true;
    readonly code: true;
    readonly kind: true;
    readonly status: true;
    readonly acuity: true;
    readonly admittedAt: true;
    readonly expectedDischargeAt: true;
    readonly dischargedAt: true;
    readonly monitoringIntervalMinutes: true;
    readonly nextDueAt: true;
    readonly branchId: true;
    readonly admissionDiagnosis: true;
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly attendingStaff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly cageAssignments: {
        readonly where: {
            readonly releasedAt: null;
        };
        readonly take: 1;
        readonly select: {
            readonly id: true;
            readonly assignedAt: true;
            readonly cage: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly room: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                            readonly type: true;
                        };
                    };
                };
            };
        };
    };
};
export type InpatientStayDetail = Prisma.InpatientStayGetPayload<{
    select: typeof inpatientStayDetailSelect;
}>;
export declare const inpatientOrderSelect: {
    readonly id: true;
    readonly stayId: true;
    readonly idx: true;
    readonly kind: true;
    readonly status: true;
    readonly inventoryItemId: true;
    readonly catalogProductId: true;
    readonly prescriptionItemId: true;
    readonly nameSnapshot: true;
    readonly doseAmount: true;
    readonly doseUnit: true;
    readonly route: true;
    readonly rateMlPerHour: true;
    readonly doseSource: true;
    readonly overrideReasonAr: true;
    readonly scheduleIntervalHours: true;
    readonly scheduleTimes: true;
    readonly prn: true;
    readonly startAt: true;
    readonly endAt: true;
    readonly instructionsAr: true;
    readonly discontinuedAt: true;
    readonly discontinueReasonAr: true;
    readonly createdAt: true;
    readonly orderedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly discontinuedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type InpatientOrderResponse = Prisma.InpatientOrderGetPayload<{
    select: typeof inpatientOrderSelect;
}>;
export declare const inpatientAdministrationSelect: {
    readonly id: true;
    readonly stayId: true;
    readonly orderId: true;
    readonly dueAt: true;
    readonly status: true;
    readonly givenAt: true;
    readonly doseGivenAmount: true;
    readonly doseGivenUnit: true;
    readonly batchNoSnapshot: true;
    readonly expiryDateSnapshot: true;
    readonly vitalSignsRecordId: true;
    readonly eatenFraction: true;
    readonly urination: true;
    readonly defecation: true;
    readonly vomiting: true;
    readonly notesAr: true;
    readonly skipReasonAr: true;
    readonly correctsId: true;
    readonly createdAt: true;
    readonly performedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly witness: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly order: {
        readonly select: {
            readonly id: true;
            readonly kind: true;
            readonly nameSnapshot: true;
            readonly prescriptionItemId: true;
            readonly doseAmount: true;
            readonly doseUnit: true;
            readonly route: true;
            readonly rateMlPerHour: true;
            readonly instructionsAr: true;
            readonly prn: true;
            readonly status: true;
        };
    };
};
export type InpatientAdministrationResponse = Prisma.InpatientAdministrationGetPayload<{
    select: typeof inpatientAdministrationSelect;
}>;
export declare const inpatientActivitySelect: {
    readonly id: true;
    readonly type: true;
    readonly body: true;
    readonly metadata: true;
    readonly createdAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly image: true;
        };
    };
};
export type InpatientActivityResponse = Prisma.InpatientActivityGetPayload<{
    select: typeof inpatientActivitySelect;
}>;
export declare const admitInpatientSchema: z.ZodObject<{
    patientId: z.ZodString;
    branchId: z.ZodString;
    attendingStaffId: z.ZodString;
    kind: z.ZodEnum<{
        readonly MEDICAL: "MEDICAL";
        readonly SURGICAL: "SURGICAL";
        readonly ICU: "ICU";
        readonly ISOLATION: "ISOLATION";
        readonly BOARDING: "BOARDING";
    }>;
    acuity: z.ZodEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
        readonly CRITICAL: "CRITICAL";
    }>;
    cageId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    appointmentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    operationCaseId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    presentingComplaint: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    admissionDiagnosis: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isolationReason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    monitoringIntervalMinutes: z.ZodCoercedNumber<unknown>;
    dailyRateServiceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    expectedDischargeAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type AdmitInpatientFormInput = z.input<typeof admitInpatientSchema>;
export type AdmitInpatientFormValues = z.output<typeof admitInpatientSchema>;
export declare const createInpatientOrderSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        readonly MEDICATION: "MEDICATION";
        readonly FLUID: "FLUID";
        readonly MONITORING: "MONITORING";
        readonly FEEDING: "FEEDING";
        readonly ACTIVITY: "ACTIVITY";
        readonly WOUND_CARE: "WOUND_CARE";
        readonly LAB: "LAB";
        readonly IMAGING: "IMAGING";
        readonly OTHER: "OTHER";
    }>;
    inventoryItemId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    catalogProductId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    nameSnapshot: z.ZodString;
    doseAmount: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    doseUnit: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    route: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        readonly IV: "IV";
        readonly IM: "IM";
        readonly SC: "SC";
        readonly PO: "PO";
        readonly INHALATION: "INHALATION";
        readonly TOPICAL: "TOPICAL";
        readonly EPIDURAL: "EPIDURAL";
        readonly OTHER: "OTHER";
    }>>>;
    rateMlPerHour: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    overrideReasonAr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    scheduleIntervalHours: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    scheduleTimes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    prn: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    startAt: z.ZodString;
    endAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    instructionsAr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateInpatientOrderFormInput = z.infer<typeof createInpatientOrderSchema>;
export declare const giveAdministrationSchema: z.ZodObject<{
    doseGivenAmount: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    doseGivenUnit: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    batchId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    witnessId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notesAr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    eatenFraction: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    urination: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    defecation: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    vomiting: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type GiveAdministrationFormInput = z.infer<typeof giveAdministrationSchema>;
export declare const skipAdministrationSchema: z.ZodObject<{
    skipReasonAr: z.ZodString;
    hold: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type SkipAdministrationFormInput = z.infer<typeof skipAdministrationSchema>;
export declare const dischargeInpatientSchema: z.ZodObject<{
    dischargeKind: z.ZodEnum<{
        readonly ROUTINE: "ROUTINE";
        readonly AGAINST_MEDICAL_ADVICE: "AGAINST_MEDICAL_ADVICE";
        readonly TRANSFERRED: "TRANSFERRED";
        readonly DIED: "DIED";
        readonly EUTHANIZED: "EUTHANIZED";
    }>;
    dischargeSummaryAr: z.ZodString;
    dischargeInstructionsAr: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    overrideReason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type DischargeInpatientFormInput = z.infer<typeof dischargeInpatientSchema>;
export declare const createCageSchema: z.ZodObject<{
    roomId: z.ZodString;
    name: z.ZodString;
    sizeClass: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        readonly SMALL: "SMALL";
        readonly MEDIUM: "MEDIUM";
        readonly LARGE: "LARGE";
        readonly WALK_IN: "WALK_IN";
    }>>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateCageFormInput = z.infer<typeof createCageSchema>;
export declare const INPATIENT_ADMINISTRATION_STATUS_LABELS: Record<InpatientAdministrationStatus, string>;
export declare const CAGE_SIZE_LABELS: Record<CageSizeClass, string>;
/** الحالات التي تعدّ الإقامة فيها «قائمة» — تُستعمل في فلاتر الاستعلام */
export declare const INPATIENT_BOARD_VIEWS: readonly ["active", "discharged", "all"];
export type InpatientBoardView = (typeof INPATIENT_BOARD_VIEWS)[number];
export declare const INPATIENT_STATUS_ORDER: readonly InpatientStayStatus[];
