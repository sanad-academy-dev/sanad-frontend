import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { AdverseReactionSeverity, InjectionSite, VaccinationDoseKind, VaccineKind, VaccineRoute } from "@/generated/prisma/enums";
import type { DueProjection, VaccinationDueStatus } from "@/server/vaccinations/vaccination-due.service";
export type { AdverseReactionSeverity, InjectionSite, VaccinationDoseKind, VaccineKind, VaccineRoute, } from "@/generated/prisma/enums";
export type { DueProjection, VaccinationDueStatus, } from "@/server/vaccinations/vaccination-due.service";
declare const antigenSelect: {
    code: true;
    nameAr: true;
    nameEn: true;
    noteAr: true;
    order: true;
    immunityOnsetDays: true;
};
export type AntigenResponse = Prisma.AntigenGetPayload<{
    select: typeof antigenSelect;
}>;
export declare const antigenSelectShape: {
    code: true;
    nameAr: true;
    nameEn: true;
    noteAr: true;
    order: true;
    immunityOnsetDays: true;
};
declare const vaccineSelect: {
    id: true;
    code: true;
    name: true;
    nameEn: true;
    kind: true;
    manufacturerName: true;
    primarySeriesDoses: true;
    primarySeriesIntervalDays: true;
    boosterIntervalDays: true;
    immunityOnsetDays: true;
    defaultRoute: true;
    defaultSite: true;
    defaultDoseVolumeMl: true;
    notes: true;
    active: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    catalogProduct: {
        select: {
            id: true;
            tradeName: true;
            registerNumber: true;
            manufacturerName: true;
            manufacturerCountry: true;
            authorizationStatus: true;
        };
    };
    inventoryItem: {
        select: {
            id: true;
            name: true;
            code: true;
            stock: true;
            tracksBatches: true;
        };
    };
    antigens: {
        select: {
            antigenCode: true;
            antigen: {
                select: {
                    nameAr: true;
                    nameEn: true;
                };
            };
        };
    };
    species: {
        select: {
            species: true;
        };
    };
};
export type VaccineResponse = Prisma.VaccineGetPayload<{
    select: typeof vaccineSelect;
}>;
export declare const vaccineSelectShape: {
    id: true;
    code: true;
    name: true;
    nameEn: true;
    kind: true;
    manufacturerName: true;
    primarySeriesDoses: true;
    primarySeriesIntervalDays: true;
    boosterIntervalDays: true;
    immunityOnsetDays: true;
    defaultRoute: true;
    defaultSite: true;
    defaultDoseVolumeMl: true;
    notes: true;
    active: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    catalogProduct: {
        select: {
            id: true;
            tradeName: true;
            registerNumber: true;
            manufacturerName: true;
            manufacturerCountry: true;
            authorizationStatus: true;
        };
    };
    inventoryItem: {
        select: {
            id: true;
            name: true;
            code: true;
            stock: true;
            tracksBatches: true;
        };
    };
    antigens: {
        select: {
            antigenCode: true;
            antigen: {
                select: {
                    nameAr: true;
                    nameEn: true;
                };
            };
        };
    };
    species: {
        select: {
            species: true;
        };
    };
};
declare const protocolDoseSelect: {
    id: true;
    order: true;
    antigenCode: true;
    label: true;
    kind: true;
    ageWeeksMin: true;
    ageWeeksMax: true;
    intervalDaysFromPrev: true;
    boosterIntervalDays: true;
    notes: true;
    antigen: {
        select: {
            nameAr: true;
            nameEn: true;
        };
    };
};
export type ProtocolDoseResponse = Prisma.VaccinationProtocolDoseGetPayload<{
    select: typeof protocolDoseSelect;
}>;
declare const protocolSelect: {
    id: true;
    code: true;
    clinicId: true;
    name: true;
    nameEn: true;
    species: true;
    animalTypeId: true;
    animalStrainId: true;
    isCore: true;
    isDefault: true;
    active: true;
    notes: true;
    createdAt: true;
    updatedAt: true;
    animalType: {
        select: {
            id: true;
            arName: true;
            enName: true;
        };
    };
    animalStrain: {
        select: {
            id: true;
            arName: true;
            enName: true;
        };
    };
    doses: {
        select: {
            id: true;
            order: true;
            antigenCode: true;
            label: true;
            kind: true;
            ageWeeksMin: true;
            ageWeeksMax: true;
            intervalDaysFromPrev: true;
            boosterIntervalDays: true;
            notes: true;
            antigen: {
                select: {
                    nameAr: true;
                    nameEn: true;
                };
            };
        };
        orderBy: {
            order: "asc";
        };
    };
};
export type VaccinationProtocolResponse = Prisma.VaccinationProtocolGetPayload<{
    select: typeof protocolSelect;
}>;
export declare const protocolSelectShape: {
    id: true;
    code: true;
    clinicId: true;
    name: true;
    nameEn: true;
    species: true;
    animalTypeId: true;
    animalStrainId: true;
    isCore: true;
    isDefault: true;
    active: true;
    notes: true;
    createdAt: true;
    updatedAt: true;
    animalType: {
        select: {
            id: true;
            arName: true;
            enName: true;
        };
    };
    animalStrain: {
        select: {
            id: true;
            arName: true;
            enName: true;
        };
    };
    doses: {
        select: {
            id: true;
            order: true;
            antigenCode: true;
            label: true;
            kind: true;
            ageWeeksMin: true;
            ageWeeksMax: true;
            intervalDaysFromPrev: true;
            boosterIntervalDays: true;
            notes: true;
            antigen: {
                select: {
                    nameAr: true;
                    nameEn: true;
                };
            };
        };
        orderBy: {
            order: "asc";
        };
    };
};
declare const recordSelect: {
    id: true;
    code: true;
    patientId: true;
    administeredAt: true;
    doseNumber: true;
    doseKind: true;
    route: true;
    site: true;
    doseVolumeMl: true;
    batchId: true;
    batchNo: true;
    batchExpiryDate: true;
    vaccineNameSnapshot: true;
    manufacturerSnapshot: true;
    adverseReaction: true;
    adverseReactionNotes: true;
    notes: true;
    immunityOnsetDaysSnapshot: true;
    protectiveFromAt: true;
    boosterIntervalDaysSnapshot: true;
    protectiveUntilAt: true;
    nextDueAt: true;
    isVoided: true;
    voidedAt: true;
    voidReason: true;
    createdAt: true;
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
            birthDate: true;
            animalType: {
                select: {
                    id: true;
                    arName: true;
                    species: true;
                };
            };
            owner: {
                select: {
                    id: true;
                    name: true;
                    phone: true;
                };
            };
        };
    };
    vaccine: {
        select: {
            id: true;
            name: true;
            kind: true;
            antigens: {
                select: {
                    antigenCode: true;
                };
            };
        };
    };
    administeredBy: {
        select: {
            id: true;
            name: true;
            prefix: true;
            licenseNumber: true;
        };
    };
    branch: {
        select: {
            id: true;
            name: true;
        };
    };
    appointment: {
        select: {
            id: true;
            startsAt: true;
        };
    };
    protocolDose: {
        select: {
            id: true;
            label: true;
            antigenCode: true;
        };
    };
};
export type VaccinationRecordResponse = Prisma.VaccinationRecordGetPayload<{
    select: typeof recordSelect;
}>;
export declare const recordSelectShape: {
    id: true;
    code: true;
    patientId: true;
    administeredAt: true;
    doseNumber: true;
    doseKind: true;
    route: true;
    site: true;
    doseVolumeMl: true;
    batchId: true;
    batchNo: true;
    batchExpiryDate: true;
    vaccineNameSnapshot: true;
    manufacturerSnapshot: true;
    adverseReaction: true;
    adverseReactionNotes: true;
    notes: true;
    immunityOnsetDaysSnapshot: true;
    protectiveFromAt: true;
    boosterIntervalDaysSnapshot: true;
    protectiveUntilAt: true;
    nextDueAt: true;
    isVoided: true;
    voidedAt: true;
    voidReason: true;
    createdAt: true;
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
            birthDate: true;
            animalType: {
                select: {
                    id: true;
                    arName: true;
                    species: true;
                };
            };
            owner: {
                select: {
                    id: true;
                    name: true;
                    phone: true;
                };
            };
        };
    };
    vaccine: {
        select: {
            id: true;
            name: true;
            kind: true;
            antigens: {
                select: {
                    antigenCode: true;
                };
            };
        };
    };
    administeredBy: {
        select: {
            id: true;
            name: true;
            prefix: true;
            licenseNumber: true;
        };
    };
    branch: {
        select: {
            id: true;
            name: true;
        };
    };
    appointment: {
        select: {
            id: true;
            startsAt: true;
        };
    };
    protocolDose: {
        select: {
            id: true;
            label: true;
            antigenCode: true;
        };
    };
};
/** حالة تطعيم طفل واحد: البروتوكول المُطبَّق، الإسقاطات، والخلاصة. */
export type PatientVaccinationStatus = {
    patientId: string;
    birthDate: Date | null;
    protocol: Pick<VaccinationProtocolResponse, "id" | "name" | "species" | "isCore"> | null;
    projections: DueProjection[];
    /** أخطر حالة عبر المُستضِدّات — الشارة المعروضة */
    status: VaccinationDueStatus | null;
    nextDueAt: Date | null;
    records: VaccinationRecordResponse[];
};
/**
 * طفل ينطبق عليه بروتوكول لكن لا يمكن جدولته: تاريخ ميلاده ناقص.
 * ليس حالة خطر بل نقص بيانات — يُعرض منفصلًا عن الطابور التشغيلي كي لا يُقرأ إنذارًا.
 */
export type UnschedulablePatientRow = {
    patientId: string;
    patientCode: string;
    patientName: string;
    animalTypeName: string;
    ownerName: string | null;
};
/** صف في طابور «الجرعات المستحقة» — طفل واحد وأقرب ما يستحقه. */
export type VaccinationDueRow = {
    patientId: string;
    patientCode: string;
    patientName: string;
    animalTypeName: string;
    ownerId: string | null;
    ownerName: string | null;
    ownerPhone: string | null;
    status: VaccinationDueStatus;
    dueAt: Date | null;
    daysUntilDue: number | null;
    /** المُستضِدّات المستحقة الآن، بالاسم العربي، للعرض في الصف */
    dueAntigens: string[];
    /**
     * الرموز المقابلة — تُمرَّر إلى نافذة الإعطاء لترشيح اللقاحات التي تغطّي المستحق.
     * الأسماء العربية للعرض والرموز للمطابقة: خلطهما يجعل الواجهة تطابق نصًّا مترجمًا.
     */
    dueAntigenCodes: string[];
    lastGivenAt: Date | null;
};
export declare const vaccineSchema: z.ZodObject<{
    name: z.ZodString;
    nameEn: z.ZodOptional<z.ZodString>;
    kind: z.ZodEnum<{
        readonly MODIFIED_LIVE: "MODIFIED_LIVE";
        readonly KILLED: "KILLED";
        readonly RECOMBINANT: "RECOMBINANT";
        readonly TOXOID: "TOXOID";
        readonly SUBUNIT: "SUBUNIT";
        readonly OTHER: "OTHER";
    }>;
    manufacturerName: z.ZodOptional<z.ZodString>;
    catalogProductId: z.ZodOptional<z.ZodString>;
    inventoryItemId: z.ZodOptional<z.ZodString>;
    antigenCodes: z.ZodArray<z.ZodString>;
    species: z.ZodArray<z.ZodString>;
    primarySeriesDoses: z.ZodCoercedNumber<unknown>;
    primarySeriesIntervalDays: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    boosterIntervalDays: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    immunityOnsetDays: z.ZodCoercedNumber<unknown>;
    defaultRoute: z.ZodEnum<{
        readonly SUBCUTANEOUS: "SUBCUTANEOUS";
        readonly INTRAMUSCULAR: "INTRAMUSCULAR";
        readonly INTRANASAL: "INTRANASAL";
        readonly ORAL: "ORAL";
        readonly INTRADERMAL: "INTRADERMAL";
        readonly TOPICAL: "TOPICAL";
        readonly OTHER: "OTHER";
    }>;
    defaultSite: z.ZodOptional<z.ZodEnum<{
        readonly LEFT_SHOULDER: "LEFT_SHOULDER";
        readonly RIGHT_SHOULDER: "RIGHT_SHOULDER";
        readonly LEFT_HIND_LIMB: "LEFT_HIND_LIMB";
        readonly RIGHT_HIND_LIMB: "RIGHT_HIND_LIMB";
        readonly INTERSCAPULAR: "INTERSCAPULAR";
        readonly LEFT_FLANK: "LEFT_FLANK";
        readonly RIGHT_FLANK: "RIGHT_FLANK";
        readonly NASAL: "NASAL";
        readonly ORAL: "ORAL";
        readonly OTHER: "OTHER";
    }>>;
    defaultDoseVolumeMl: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    notes: z.ZodOptional<z.ZodString>;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type VaccineFormInput = z.infer<typeof vaccineSchema>;
export declare const administerVaccinationSchema: z.ZodObject<{
    patientId: z.ZodString;
    vaccineId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodString>;
    branchId: z.ZodOptional<z.ZodString>;
    administeredById: z.ZodOptional<z.ZodString>;
    administeredAt: z.ZodCoercedDate<unknown>;
    doseNumber: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    doseKind: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly PRIMARY: "PRIMARY";
        readonly BOOSTER: "BOOSTER";
        readonly ANNUAL: "ANNUAL";
        readonly CATCH_UP: "CATCH_UP";
    }>>>;
    route: z.ZodEnum<{
        readonly SUBCUTANEOUS: "SUBCUTANEOUS";
        readonly INTRAMUSCULAR: "INTRAMUSCULAR";
        readonly INTRANASAL: "INTRANASAL";
        readonly ORAL: "ORAL";
        readonly INTRADERMAL: "INTRADERMAL";
        readonly TOPICAL: "TOPICAL";
        readonly OTHER: "OTHER";
    }>;
    site: z.ZodOptional<z.ZodEnum<{
        readonly LEFT_SHOULDER: "LEFT_SHOULDER";
        readonly RIGHT_SHOULDER: "RIGHT_SHOULDER";
        readonly LEFT_HIND_LIMB: "LEFT_HIND_LIMB";
        readonly RIGHT_HIND_LIMB: "RIGHT_HIND_LIMB";
        readonly INTERSCAPULAR: "INTERSCAPULAR";
        readonly LEFT_FLANK: "LEFT_FLANK";
        readonly RIGHT_FLANK: "RIGHT_FLANK";
        readonly NASAL: "NASAL";
        readonly ORAL: "ORAL";
        readonly OTHER: "OTHER";
    }>>;
    doseVolumeMl: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    batchId: z.ZodOptional<z.ZodString>;
    allowExpiredBatch: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    expiredBatchReason: z.ZodOptional<z.ZodString>;
    adverseReaction: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly NONE: "NONE";
        readonly MILD: "MILD";
        readonly MODERATE: "MODERATE";
        readonly SEVERE: "SEVERE";
        readonly ANAPHYLACTIC: "ANAPHYLACTIC";
    }>>>;
    adverseReactionNotes: z.ZodOptional<z.ZodString>;
    protocolDoseId: z.ZodOptional<z.ZodString>;
    carePlanEnrollmentVisitId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdministerVaccinationFormInput = z.infer<typeof administerVaccinationSchema>;
export declare const voidVaccinationSchema: z.ZodObject<{
    voidReason: z.ZodString;
    restoreStock: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type VoidVaccinationFormInput = z.infer<typeof voidVaccinationSchema>;
export declare const protocolDoseSchema: z.ZodObject<{
    antigenCode: z.ZodString;
    label: z.ZodString;
    kind: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly PRIMARY: "PRIMARY";
        readonly BOOSTER: "BOOSTER";
        readonly ANNUAL: "ANNUAL";
        readonly CATCH_UP: "CATCH_UP";
    }>>>;
    ageWeeksMin: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    ageWeeksMax: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    intervalDaysFromPrev: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    boosterIntervalDays: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const vaccinationProtocolSchema: z.ZodObject<{
    name: z.ZodString;
    nameEn: z.ZodOptional<z.ZodString>;
    species: z.ZodString;
    animalTypeId: z.ZodOptional<z.ZodString>;
    animalStrainId: z.ZodOptional<z.ZodString>;
    isCore: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    notes: z.ZodOptional<z.ZodString>;
    doses: z.ZodArray<z.ZodObject<{
        antigenCode: z.ZodString;
        label: z.ZodString;
        kind: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            readonly PRIMARY: "PRIMARY";
            readonly BOOSTER: "BOOSTER";
            readonly ANNUAL: "ANNUAL";
            readonly CATCH_UP: "CATCH_UP";
        }>>>;
        ageWeeksMin: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        ageWeeksMax: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        intervalDaysFromPrev: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        boosterIntervalDays: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type VaccinationProtocolFormInput = z.infer<typeof vaccinationProtocolSchema>;
export declare const VACCINE_KIND_LABELS: Record<VaccineKind, string>;
export declare const VACCINE_ROUTE_LABELS: Record<VaccineRoute, string>;
export declare const INJECTION_SITE_LABELS: Record<InjectionSite, string>;
export declare const DOSE_KIND_LABELS: Record<VaccinationDoseKind, string>;
export declare const ADVERSE_REACTION_LABELS: Record<AdverseReactionSeverity, string>;
export declare const DUE_STATUS_LABELS: Record<VaccinationDueStatus, string>;
