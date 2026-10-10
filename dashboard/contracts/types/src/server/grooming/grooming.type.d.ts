import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { CoatCondition, EarCondition, GroomingActivityType, GroomingCancelKind, type GroomingDryingMethod, GroomingFindingCategory, GroomingFindingSeverity, GroomingIncidentKind, GroomingIncidentSeverity, GroomingMoodScore, GroomingPhotoKind, type GroomingStage, NailCondition } from "@/generated/prisma/enums";
declare const intakeSelect: {
    readonly id: true;
    readonly weightKg: true;
    readonly temperatureC: true;
    readonly mattingGrade: true;
    readonly coatCondition: true;
    readonly parasiteFinding: true;
    readonly skinFindings: true;
    readonly earCondition: true;
    readonly nailCondition: true;
    readonly dentalNote: true;
    readonly behaviorScore: true;
    readonly muzzleUsed: true;
    readonly rabiesValidUntil: true;
    readonly vaccinationOverrideReason: true;
    readonly shaveDownRecommended: true;
    readonly shaveDownApprovedAt: true;
    readonly heatDryProhibitedSnapshot: true;
    readonly heatDryReasonsSnapshot: true;
    readonly parasiteTreatedAt: true;
    readonly parasiteOwnerNotifiedAt: true;
    readonly isolationAcknowledgedAt: true;
    readonly belongings: true;
    readonly notes: true;
    readonly performedAt: true;
};
/** بطاقة اللوحة — أخفّ ما يكفي لرسم عمود كامل بلا جلب التفاصيل */
export declare const sessionCardSelect: {
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly stage: true;
    readonly lane: true;
    readonly scheduledAt: true;
    readonly promisedReadyAt: true;
    readonly readyAt: true;
    readonly estimatedDurationMin: true;
    readonly quoteTotal: true;
    readonly sedationPlanned: true;
    readonly dryingMethod: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly animalType: {
                readonly select: {
                    readonly arName: true;
                };
            };
            readonly animalStrain: {
                readonly select: {
                    readonly arName: true;
                    readonly isBrachycephalic: true;
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
    readonly groomer: {
        readonly select: {
            readonly id: true;
            readonly user: {
                readonly select: {
                    readonly name: true;
                };
            };
        };
    };
    readonly station: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly intake: {
        readonly select: {
            readonly mattingGrade: true;
            readonly parasiteFinding: true;
            readonly behaviorScore: true;
            readonly heatDryProhibitedSnapshot: true;
        };
    };
    readonly _count: {
        readonly select: {
            readonly incidents: true;
            readonly findings: true;
        };
    };
};
export type GroomingSessionCard = Prisma.GroomingSessionGetPayload<{
    select: typeof sessionCardSelect;
}>;
/** التفاصيل الكاملة — ما تعرضه ورقة الجلسة */
export declare const sessionDetailSelect: {
    readonly intake: {
        readonly select: {
            readonly id: true;
            readonly weightKg: true;
            readonly temperatureC: true;
            readonly mattingGrade: true;
            readonly coatCondition: true;
            readonly parasiteFinding: true;
            readonly skinFindings: true;
            readonly earCondition: true;
            readonly nailCondition: true;
            readonly dentalNote: true;
            readonly behaviorScore: true;
            readonly muzzleUsed: true;
            readonly rabiesValidUntil: true;
            readonly vaccinationOverrideReason: true;
            readonly shaveDownRecommended: true;
            readonly shaveDownApprovedAt: true;
            readonly heatDryProhibitedSnapshot: true;
            readonly heatDryReasonsSnapshot: true;
            readonly parasiteTreatedAt: true;
            readonly parasiteOwnerNotifiedAt: true;
            readonly isolationAcknowledgedAt: true;
            readonly belongings: true;
            readonly notes: true;
            readonly performedAt: true;
        };
    };
    readonly branchId: true;
    readonly appointmentId: true;
    readonly assistantId: true;
    readonly vetOrderStaffId: true;
    readonly vetOrderNote: true;
    readonly dropOffAt: true;
    readonly checkedInAt: true;
    readonly startedAt: true;
    readonly dryingStartedAt: true;
    readonly pickedUpAt: true;
    readonly completedAt: true;
    readonly quoteSubtotal: true;
    readonly quoteAdjustments: true;
    readonly bookedQuoteTotal: true;
    readonly ownerApprovedQuoteAt: true;
    readonly cancelKind: true;
    readonly cancelReason: true;
    readonly createdAt: true;
    readonly items: {
        readonly select: {
            readonly id: true;
            readonly definitionId: true;
            readonly serviceId: true;
            readonly nameSnapshot: true;
            readonly laneSnapshot: true;
            readonly priceSnapshot: true;
            readonly durationSnapshot: true;
            readonly dryingSnapshot: true;
            readonly priceLevelSnapshot: true;
            readonly matchedRuleId: true;
            readonly quantity: true;
            readonly performed: true;
            readonly notes: true;
        };
    };
    readonly adjustments: {
        readonly select: {
            readonly id: true;
            readonly modifierCode: true;
            readonly labelSnapshot: true;
            readonly amount: true;
            readonly source: true;
            readonly reason: true;
            readonly approvedByOwnerAt: true;
        };
    };
    readonly photos: {
        readonly select: {
            readonly id: true;
            readonly kind: true;
            readonly url: true;
            readonly caption: true;
            readonly bodyZone: true;
            readonly createdAt: true;
        };
    };
    readonly products: {
        readonly select: {
            readonly id: true;
            readonly inventoryItemId: true;
            readonly nameSnapshot: true;
            readonly priceSnapshot: true;
            readonly quantity: true;
            readonly billable: true;
            readonly dilution: true;
            readonly contactTimeMin: true;
            readonly bodyZones: true;
            readonly issuedAt: true;
        };
    };
    readonly incidents: {
        readonly select: {
            readonly id: true;
            readonly kind: true;
            readonly severity: true;
            readonly description: true;
            readonly actionTaken: true;
            readonly ownerNotifiedAt: true;
            readonly vetAssessedByStaffId: true;
            readonly vetAssessmentNote: true;
            readonly followUpAppointmentId: true;
            readonly resolvedAt: true;
            readonly createdAt: true;
        };
    };
    readonly findings: {
        readonly select: {
            readonly id: true;
            readonly category: true;
            readonly bodyZone: true;
            readonly severity: true;
            readonly note: true;
            readonly photoId: true;
            readonly acknowledgedAt: true;
            readonly referralAppointmentId: true;
            readonly labOrderId: true;
            readonly dismissedReason: true;
            readonly createdAt: true;
        };
    };
    readonly reportCard: {
        readonly select: {
            readonly id: true;
            readonly summary: true;
            readonly moodScore: true;
            readonly recommendedIntervalWeeks: true;
            readonly nextRecommendedAt: true;
            readonly publicToken: true;
            readonly sentAt: true;
            readonly channel: true;
            readonly rebookedSessionId: true;
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
            readonly currencyCode: true;
            readonly status: true;
            readonly paymentMethod: true;
            readonly paidAt: true;
        };
    };
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly stage: true;
    readonly lane: true;
    readonly scheduledAt: true;
    readonly promisedReadyAt: true;
    readonly readyAt: true;
    readonly estimatedDurationMin: true;
    readonly quoteTotal: true;
    readonly sedationPlanned: true;
    readonly dryingMethod: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly animalType: {
                readonly select: {
                    readonly arName: true;
                };
            };
            readonly animalStrain: {
                readonly select: {
                    readonly arName: true;
                    readonly isBrachycephalic: true;
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
    readonly groomer: {
        readonly select: {
            readonly id: true;
            readonly user: {
                readonly select: {
                    readonly name: true;
                };
            };
        };
    };
    readonly station: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly _count: {
        readonly select: {
            readonly incidents: true;
            readonly findings: true;
        };
    };
};
export type GroomingSessionDetail = Prisma.GroomingSessionGetPayload<{
    select: typeof sessionDetailSelect;
}>;
export type GroomingIntakeResponse = Prisma.GroomingIntakeGetPayload<{
    select: typeof intakeSelect;
}>;
export declare const groomingSelects: {
    readonly item: {
        readonly id: true;
        readonly definitionId: true;
        readonly serviceId: true;
        readonly nameSnapshot: true;
        readonly laneSnapshot: true;
        readonly priceSnapshot: true;
        readonly durationSnapshot: true;
        readonly dryingSnapshot: true;
        readonly priceLevelSnapshot: true;
        readonly matchedRuleId: true;
        readonly quantity: true;
        readonly performed: true;
        readonly notes: true;
    };
    readonly adjustment: {
        readonly id: true;
        readonly modifierCode: true;
        readonly labelSnapshot: true;
        readonly amount: true;
        readonly source: true;
        readonly reason: true;
        readonly approvedByOwnerAt: true;
    };
    readonly intake: {
        readonly id: true;
        readonly weightKg: true;
        readonly temperatureC: true;
        readonly mattingGrade: true;
        readonly coatCondition: true;
        readonly parasiteFinding: true;
        readonly skinFindings: true;
        readonly earCondition: true;
        readonly nailCondition: true;
        readonly dentalNote: true;
        readonly behaviorScore: true;
        readonly muzzleUsed: true;
        readonly rabiesValidUntil: true;
        readonly vaccinationOverrideReason: true;
        readonly shaveDownRecommended: true;
        readonly shaveDownApprovedAt: true;
        readonly heatDryProhibitedSnapshot: true;
        readonly heatDryReasonsSnapshot: true;
        readonly parasiteTreatedAt: true;
        readonly parasiteOwnerNotifiedAt: true;
        readonly isolationAcknowledgedAt: true;
        readonly belongings: true;
        readonly notes: true;
        readonly performedAt: true;
    };
    readonly photo: {
        readonly id: true;
        readonly kind: true;
        readonly url: true;
        readonly caption: true;
        readonly bodyZone: true;
        readonly createdAt: true;
    };
    readonly product: {
        readonly id: true;
        readonly inventoryItemId: true;
        readonly nameSnapshot: true;
        readonly priceSnapshot: true;
        readonly quantity: true;
        readonly billable: true;
        readonly dilution: true;
        readonly contactTimeMin: true;
        readonly bodyZones: true;
        readonly issuedAt: true;
    };
    readonly incident: {
        readonly id: true;
        readonly kind: true;
        readonly severity: true;
        readonly description: true;
        readonly actionTaken: true;
        readonly ownerNotifiedAt: true;
        readonly vetAssessedByStaffId: true;
        readonly vetAssessmentNote: true;
        readonly followUpAppointmentId: true;
        readonly resolvedAt: true;
        readonly createdAt: true;
    };
    readonly finding: {
        readonly id: true;
        readonly category: true;
        readonly bodyZone: true;
        readonly severity: true;
        readonly note: true;
        readonly photoId: true;
        readonly acknowledgedAt: true;
        readonly referralAppointmentId: true;
        readonly labOrderId: true;
        readonly dismissedReason: true;
        readonly createdAt: true;
    };
    readonly reportCard: {
        readonly id: true;
        readonly summary: true;
        readonly moodScore: true;
        readonly recommendedIntervalWeeks: true;
        readonly nextRecommendedAt: true;
        readonly publicToken: true;
        readonly sentAt: true;
        readonly channel: true;
        readonly rebookedSessionId: true;
    };
};
declare const profileSelect: {
    readonly id: true;
    readonly patientId: true;
    readonly preferredGroomerId: true;
    readonly sizeBand: true;
    readonly coatType: true;
    readonly clipperPlan: true;
    readonly shampooItemId: true;
    readonly sensitivities: true;
    readonly behaviorScore: true;
    readonly muzzleRequired: true;
    readonly requiresTwoHandlers: true;
    readonly handlingNotes: true;
    readonly heatDryProhibited: true;
    readonly heatDryProhibitedReason: true;
    readonly groomIntervalWeeks: true;
    readonly lastGroomedAt: true;
    readonly nextGroomDueAt: true;
    readonly customPrice: true;
    readonly customDurationMin: true;
    readonly notes: true;
};
export type GroomingProfileResponse = Prisma.PatientGroomingProfileGetPayload<{
    select: typeof profileSelect;
}>;
export declare const profileSelectShape: {
    readonly id: true;
    readonly patientId: true;
    readonly preferredGroomerId: true;
    readonly sizeBand: true;
    readonly coatType: true;
    readonly clipperPlan: true;
    readonly shampooItemId: true;
    readonly sensitivities: true;
    readonly behaviorScore: true;
    readonly muzzleRequired: true;
    readonly requiresTwoHandlers: true;
    readonly handlingNotes: true;
    readonly heatDryProhibited: true;
    readonly heatDryProhibitedReason: true;
    readonly groomIntervalWeeks: true;
    readonly lastGroomedAt: true;
    readonly nextGroomDueAt: true;
    readonly customPrice: true;
    readonly customDurationMin: true;
    readonly notes: true;
};
/** صفّ قائمة الاستحقاق — «من تأخّر عن موعد تجميله؟» */
export type GroomingDueRow = {
    patientId: string;
    patientName: string;
    patientCode: string;
    ownerId: string | null;
    ownerName: string | null;
    ownerPhone: string | null;
    lastGroomedAt: Date | null;
    nextGroomDueAt: Date | null;
    daysOverdue: number;
    preferredGroomerName: string | null;
};
export type CreateGroomingSessionInput = Pick<Prisma.GroomingSessionUncheckedCreateInput, "clinicId" | "branchId" | "patientId" | "ownerId" | "groomerId" | "scheduledAt"> & Partial<Pick<Prisma.GroomingSessionUncheckedCreateInput, "appointmentId" | "assistantId" | "stationId" | "lane" | "sedationPlanned" | "vetOrderStaffId" | "vetOrderNote" | "dropOffAt">> & {
    /** تعريفات دورات التجميل المطلوبة — تُسعَّر على الخادم، والعميل لا يرسل سعرًا */
    definitionIds: string[];
    userId?: string;
};
export declare const createGroomingSessionSchema: z.ZodObject<{
    patientId: z.ZodString;
    branchId: z.ZodString;
    groomerId: z.ZodString;
    assistantId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    stationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    scheduledAt: z.ZodString;
    dropOffAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    definitionIds: z.ZodArray<z.ZodString>;
    sedationPlanned: z.ZodDefault<z.ZodBoolean>;
    vetOrderStaffId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vetOrderNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateGroomingSessionFormInput = z.input<typeof createGroomingSessionSchema>;
export declare const groomingIntakeSchema: z.ZodObject<{
    weightKg: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    temperatureC: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    mattingGrade: z.ZodEnum<{
        readonly NONE: "NONE";
        readonly LIGHT: "LIGHT";
        readonly MODERATE: "MODERATE";
        readonly SEVERE: "SEVERE";
        readonly PELTED: "PELTED";
    }>;
    coatCondition: z.ZodDefault<z.ZodEnum<{
        readonly HEALTHY: "HEALTHY";
        readonly DRY: "DRY";
        readonly GREASY: "GREASY";
        readonly DANDRUFF: "DANDRUFF";
        readonly SHEDDING_HEAVY: "SHEDDING_HEAVY";
        readonly DAMAGED: "DAMAGED";
    }>>;
    parasiteFinding: z.ZodDefault<z.ZodEnum<{
        readonly NONE: "NONE";
        readonly FLEAS: "FLEAS";
        readonly TICKS: "TICKS";
        readonly LICE: "LICE";
        readonly MITES_SUSPECTED: "MITES_SUSPECTED";
        readonly MULTIPLE: "MULTIPLE";
    }>>;
    skinFindings: z.ZodDefault<z.ZodArray<z.ZodString>>;
    earCondition: z.ZodDefault<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly WAXY: "WAXY";
        readonly REDNESS: "REDNESS";
        readonly ODOR: "ODOR";
        readonly DISCHARGE: "DISCHARGE";
        readonly PAINFUL: "PAINFUL";
    }>>;
    nailCondition: z.ZodDefault<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly OVERGROWN: "OVERGROWN";
        readonly SPLIT: "SPLIT";
        readonly INGROWN: "INGROWN";
        readonly MISSING: "MISSING";
    }>>;
    dentalNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    behaviorScore: z.ZodEnum<{
        readonly GREEN: "GREEN";
        readonly YELLOW: "YELLOW";
        readonly RED: "RED";
    }>;
    muzzleUsed: z.ZodDefault<z.ZodBoolean>;
    belongings: z.ZodDefault<z.ZodArray<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type GroomingIntakeFormInput = z.input<typeof groomingIntakeSchema>;
export declare const groomingFindingSchema: z.ZodObject<{
    category: z.ZodEnum<{
        readonly SKIN: "SKIN";
        readonly EARS: "EARS";
        readonly EYES: "EYES";
        readonly NAILS: "NAILS";
        readonly DENTAL: "DENTAL";
        readonly LUMP: "LUMP";
        readonly PARASITE: "PARASITE";
        readonly WEIGHT: "WEIGHT";
        readonly PAIN: "PAIN";
        readonly BEHAVIOR: "BEHAVIOR";
        readonly OTHER: "OTHER";
    }>;
    severity: z.ZodDefault<z.ZodEnum<{
        readonly INFO: "INFO";
        readonly ATTENTION: "ATTENTION";
        readonly URGENT: "URGENT";
    }>>;
    bodyZone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    note: z.ZodString;
    photoId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type GroomingFindingFormInput = z.input<typeof groomingFindingSchema>;
export declare const groomingIncidentSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        readonly CLIPPER_BURN: "CLIPPER_BURN";
        readonly NICK_CUT: "NICK_CUT";
        readonly QUICKED_NAIL: "QUICKED_NAIL";
        readonly HEAT_STRESS: "HEAT_STRESS";
        readonly MEDICAL_EVENT: "MEDICAL_EVENT";
        readonly ESCAPE: "ESCAPE";
        readonly BITE_TO_STAFF: "BITE_TO_STAFF";
        readonly EQUIPMENT_FAILURE: "EQUIPMENT_FAILURE";
        readonly OTHER: "OTHER";
    }>;
    severity: z.ZodDefault<z.ZodEnum<{
        readonly MINOR: "MINOR";
        readonly MODERATE: "MODERATE";
        readonly MAJOR: "MAJOR";
    }>>;
    description: z.ZodString;
    actionTaken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    photoId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type GroomingIncidentFormInput = z.input<typeof groomingIncidentSchema>;
export declare const groomingReportCardSchema: z.ZodObject<{
    summary: z.ZodString;
    moodScore: z.ZodDefault<z.ZodEnum<{
        readonly CALM: "CALM";
        readonly HAPPY: "HAPPY";
        readonly ANXIOUS: "ANXIOUS";
        readonly STRESSED: "STRESSED";
        readonly AGGRESSIVE: "AGGRESSIVE";
    }>>;
    recommendedIntervalWeeks: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    channel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly WHATSAPP: "WHATSAPP";
        readonly EMAIL: "EMAIL";
        readonly SMS: "SMS";
        readonly IN_APP: "IN_APP";
        readonly PRINTED: "PRINTED";
    }>>>;
}, z.core.$strip>;
export type GroomingReportCardFormInput = z.input<typeof groomingReportCardSchema>;
export declare const groomingProfileSchema: z.ZodObject<{
    preferredGroomerId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBand: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    coatType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    shampooItemId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sensitivities: z.ZodDefault<z.ZodArray<z.ZodString>>;
    behaviorScore: z.ZodDefault<z.ZodEnum<{
        readonly GREEN: "GREEN";
        readonly YELLOW: "YELLOW";
        readonly RED: "RED";
    }>>;
    muzzleRequired: z.ZodDefault<z.ZodBoolean>;
    requiresTwoHandlers: z.ZodDefault<z.ZodBoolean>;
    handlingNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    heatDryProhibited: z.ZodDefault<z.ZodBoolean>;
    heatDryProhibitedReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    groomIntervalWeeks: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    customPrice: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    customDurationMin: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type GroomingProfileFormInput = z.input<typeof groomingProfileSchema>;
export declare const GROOMING_PHOTO_KIND_LABELS: Record<GroomingPhotoKind, string>;
export declare const GROOMING_INCIDENT_KIND_LABELS: Record<GroomingIncidentKind, string>;
export declare const GROOMING_INCIDENT_SEVERITY_LABELS: Record<GroomingIncidentSeverity, string>;
export declare const GROOMING_FINDING_CATEGORY_LABELS: Record<GroomingFindingCategory, string>;
export declare const GROOMING_FINDING_SEVERITY_LABELS: Record<GroomingFindingSeverity, string>;
export declare const COAT_CONDITION_LABELS: Record<CoatCondition, string>;
export declare const EAR_CONDITION_LABELS: Record<EarCondition, string>;
export declare const NAIL_CONDITION_LABELS: Record<NailCondition, string>;
export declare const GROOMING_MOOD_LABELS: Record<GroomingMoodScore, string>;
export declare const GROOMING_CANCEL_KIND_LABELS: Record<GroomingCancelKind, string>;
/** أعمدة اللوحة بالترتيب — الاعتراضية خارجها، تُعرض كمرشّح لا كعمود */
/** قيد في سجل الجلسة — مع اسم الفاعل المركَّب في الـ DAO */
export type GroomingActivityResponse = Prisma.GroomingActivityGetPayload<{
    select: {
        id: true;
        type: true;
        detail: true;
        gate: true;
        createdAt: true;
        authorUserId: true;
    };
}> & {
    author: {
        name: string | null;
    } | null;
};
/**
 * تسميات أنواع السجل — الفعل الذي يُقرأ حين لا يحمل القيد تفصيلًا.
 * مكانها هنا لا في المكوّن: يستعملها السجل والتقرير المطبوع معًا.
 */
export declare const GROOMING_ACTIVITY_LABELS: Record<GroomingActivityType, string>;
/** الأنواع التي تفصيلها نصّ حرّ يستحق بطاقة مستقلّة تحت السطر */
export declare const GROOMING_ACTIVITY_CARD_TYPES: readonly GroomingActivityType[];
export declare const GROOMING_BOARD_COLUMNS: readonly ["SCHEDULED", "CHECK_IN", "INTAKE", "IN_PROGRESS", "FINISHING", "READY", "PICKED_UP"];
export declare const GROOMING_PERIODS: readonly ["today", "week", "all"];
export type GroomingPeriod = (typeof GROOMING_PERIODS)[number];
export declare const GROOMING_VIEWS: readonly ["all", "mine", "attention"];
export type GroomingView = (typeof GROOMING_VIEWS)[number];
export type GroomingStageValue = GroomingStage;
export type GroomingDryingMethodValue = GroomingDryingMethod;
export {};
