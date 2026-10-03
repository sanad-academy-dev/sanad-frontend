import type { AdverseReactionSeverity, InjectionSite, VaccinationDoseKind, VaccineRoute } from "@/generated/prisma/enums";
/**
 * مسار الإعطاء والإبطال — معاملة واحدة لكل عملية.
 *
 * لماذا معاملة واحدة: جرعة تُسجَّل دون أن تُنقص المخزون تجعل الدفتر يكذب، وحركة
 * مخزون بلا سجل تجعل الجرعة تختفي من ملف الطفل. الحالتان أسوأ من الفشل الصريح.
 */
export type AdministerInput = {
    patientId: string;
    vaccineId: string;
    appointmentId?: string | null;
    branchId?: string | null;
    administeredById?: string | null;
    administeredAt: Date;
    doseNumber?: number;
    doseKind?: VaccinationDoseKind;
    route: VaccineRoute;
    site?: InjectionSite | null;
    doseVolumeMl?: number | null;
    batchId?: string | null;
    allowExpiredBatch?: boolean;
    expiredBatchReason?: string | null;
    adverseReaction?: AdverseReactionSeverity;
    adverseReactionNotes?: string | null;
    protocolDoseId?: string | null;
    carePlanEnrollmentVisitId?: string | null;
    notes?: string | null;
};
export declare function administerVaccination(clinicId: string, input: AdministerInput, createdById?: string | null): Promise<{
    branch: {
        name: string;
        id: string;
    } | null;
    patient: {
        animalType: {
            id: string;
            arName: string;
            species: import("@/generated/prisma/enums").CatalogSpecies | null;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        } | null;
        name: string;
        id: string;
        code: string;
        birthDate: Date | null;
    };
    appointment: {
        id: string;
        startsAt: Date;
    } | null;
    vaccine: {
        name: string;
        id: string;
        kind: import("@/generated/prisma/enums").VaccineKind;
        antigens: {
            antigenCode: string;
        }[];
    };
    id: string;
    createdAt: Date;
    code: string;
    notes: string | null;
    route: VaccineRoute;
    patientId: string;
    nextDueAt: Date | null;
    batchId: string | null;
    site: InjectionSite | null;
    batchNo: string | null;
    protectiveFromAt: Date | null;
    protectiveUntilAt: Date | null;
    immunityOnsetDaysSnapshot: number | null;
    administeredAt: Date;
    vaccineNameSnapshot: string;
    doseNumber: number;
    doseKind: VaccinationDoseKind;
    doseVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
    batchExpiryDate: Date | null;
    manufacturerSnapshot: string | null;
    adverseReaction: AdverseReactionSeverity;
    adverseReactionNotes: string | null;
    boosterIntervalDaysSnapshot: number | null;
    isVoided: boolean;
    voidedAt: Date | null;
    voidReason: string | null;
    administeredBy: {
        name: string;
        prefix: import("@/generated/prisma/enums").StaffPrefix | null;
        id: string;
        licenseNumber: string | null;
    } | null;
    protocolDose: {
        id: string;
        label: string;
        antigenCode: string;
    } | null;
}>;
/**
 * إبطال سجل تطعيم. السجل الطبي إلحاقي: لا حذف، بل علامة إبطال بسبب موثّق.
 * الكمية تعود إلى الدفعة بحركة معاكسة لا بحذف سطر الدفتر.
 */
export declare function voidVaccinationRecord(clinicId: string, recordId: string, input: {
    voidReason: string;
    restoreStock?: boolean;
}, userId?: string | null): Promise<{
    branch: {
        name: string;
        id: string;
    } | null;
    patient: {
        animalType: {
            id: string;
            arName: string;
            species: import("@/generated/prisma/enums").CatalogSpecies | null;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        } | null;
        name: string;
        id: string;
        code: string;
        birthDate: Date | null;
    };
    appointment: {
        id: string;
        startsAt: Date;
    } | null;
    vaccine: {
        name: string;
        id: string;
        kind: import("@/generated/prisma/enums").VaccineKind;
        antigens: {
            antigenCode: string;
        }[];
    };
    id: string;
    createdAt: Date;
    code: string;
    notes: string | null;
    route: VaccineRoute;
    patientId: string;
    nextDueAt: Date | null;
    batchId: string | null;
    site: InjectionSite | null;
    batchNo: string | null;
    protectiveFromAt: Date | null;
    protectiveUntilAt: Date | null;
    immunityOnsetDaysSnapshot: number | null;
    administeredAt: Date;
    vaccineNameSnapshot: string;
    doseNumber: number;
    doseKind: VaccinationDoseKind;
    doseVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
    batchExpiryDate: Date | null;
    manufacturerSnapshot: string | null;
    adverseReaction: AdverseReactionSeverity;
    adverseReactionNotes: string | null;
    boosterIntervalDaysSnapshot: number | null;
    isVoided: boolean;
    voidedAt: Date | null;
    voidReason: string | null;
    administeredBy: {
        name: string;
        prefix: import("@/generated/prisma/enums").StaffPrefix | null;
        id: string;
        licenseNumber: string | null;
    } | null;
    protocolDose: {
        id: string;
        label: string;
        antigenCode: string;
    } | null;
}>;
/**
 * إعادة حساب الكاش لكل أطفال الأكاديمية. يُستدعى بعد تعديل بروتوكول: تغيير جدول
 * لا يلمس السجلات لكنه يغيّر كل تواريخ الاستحقاق المشتقّة منها.
 */
export declare function recomputeClinicNextDue(clinicId: string): Promise<number>;
