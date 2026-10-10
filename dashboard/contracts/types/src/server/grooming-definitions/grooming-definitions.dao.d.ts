import { GroomingLane } from "@/generated/prisma/enums";
import { type GroomingCapacityResponse, type GroomingModifierResponse, type GroomingPriceRuleInputRow, type GroomingTemplateResponse, type UpsertGroomingCapacityInput, type UpsertGroomingDefinitionInput, type UpsertGroomingModifierInput } from "@/server/grooming-definitions/grooming-definitions.type";
export declare const groomingDefinitionsDao: {
    /** كل قوالب التجميل: دورات ITEM تحت فئة «التجميل» + تعريفاتها + السعر/المدة */
    listTemplates(clinicId: string): Promise<GroomingTemplateResponse[]>;
    findByService(clinicId: string, serviceId: string): Promise<{
        id: string;
        clinicId: string;
        active: boolean;
        serviceId: string;
        kind: import("@/generated/prisma/enums").GroomingServiceKind;
        dryingMinutes: number;
        lane: GroomingLane;
        requiresVetOrder: boolean;
        isAddOn: boolean;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
        baseDurationMin: number;
        speciesScope: string[];
        requiresStation: boolean;
        priceRules: {
            id: string;
            createdAt: Date;
            animalTypeId: string | null;
            animalStrainId: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            definitionId: string;
            sizeBand: import("@/generated/prisma/enums").GroomingSizeBand | null;
            coatType: import("@/generated/prisma/enums").HairType | null;
            durationMin: number;
            dryingMinutes: number | null;
        }[];
    } | null>;
    /** التعريف يُنشأ عند أول حفظ ثم يُحدَّث — upsert على (الأكاديمية، الدورة) */
    upsertDefinition(input: UpsertGroomingDefinitionInput): Promise<{
        id: string;
        clinicId: string;
        active: boolean;
        serviceId: string;
        kind: import("@/generated/prisma/enums").GroomingServiceKind;
        dryingMinutes: number;
        lane: GroomingLane;
        requiresVetOrder: boolean;
        isAddOn: boolean;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
        baseDurationMin: number;
        speciesScope: string[];
        requiresStation: boolean;
        priceRules: {
            id: string;
            createdAt: Date;
            animalTypeId: string | null;
            animalStrainId: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            definitionId: string;
            sizeBand: import("@/generated/prisma/enums").GroomingSizeBand | null;
            coatType: import("@/generated/prisma/enums").HairType | null;
            durationMin: number;
            dryingMinutes: number | null;
        }[];
    }>;
    listPriceRules(clinicId: string, definitionId: string): Promise<{
        id: string;
        createdAt: Date;
        animalTypeId: string | null;
        animalStrainId: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        definitionId: string;
        sizeBand: import("@/generated/prisma/enums").GroomingSizeBand | null;
        coatType: import("@/generated/prisma/enums").HairType | null;
        durationMin: number;
        dryingMinutes: number | null;
    }[]>;
    /**
     * استبدال المصفوفة بالكامل لهذا التعريف، في معاملة واحدة.
     *
     * الاستبدال لا الدمج: محرّر المصفوفة شبكة كاملة، وحذف خلية فيه يجب أن يحذف
     * الصفّ فعلًا. والتكرار يُمنع هنا قبل الكتابة على مفتاح الهوية الرباعي، لأن
     * القيد الفريد في Postgres لا يمسك الصفوف التي أبعادها NULL.
     */
    replacePriceRules(clinicId: string, definitionId: string, rows: readonly GroomingPriceRuleInputRow[]): Promise<{
        id: string;
        createdAt: Date;
        animalTypeId: string | null;
        animalStrainId: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        definitionId: string;
        sizeBand: import("@/generated/prisma/enums").GroomingSizeBand | null;
        coatType: import("@/generated/prisma/enums").HairType | null;
        durationMin: number;
        dryingMinutes: number | null;
    }[]>;
    listModifiers(clinicId: string): Promise<GroomingModifierResponse[]>;
    upsertModifier(input: UpsertGroomingModifierInput): Promise<{
        value: import("@prisma/client-runtime-utils").Decimal;
        id: string;
        code: import("@/generated/prisma/enums").GroomingModifierCode;
        active: boolean;
        labelAr: string;
        calc: import("@/generated/prisma/enums").GroomingModifierCalc;
        autoAppliesFrom: number | null;
        requiresOwnerApproval: boolean;
    }>;
    findCapacity(clinicId: string, branchId: string): Promise<GroomingCapacityResponse | null>;
    upsertCapacity(input: UpsertGroomingCapacityInput): Promise<{
        id: string;
        clinicId: string;
        branchId: string;
        stations: number;
        dryerSlots: number;
        maxPetsPerDay: number | null;
        maxHeatSensitiveConcurrent: number;
        dropOffWindowMin: number;
        requireDepositPercent: import("@prisma/client-runtime-utils").Decimal | null;
        seniorAgeYears: number;
        quoteReapprovalPercent: import("@prisma/client-runtime-utils").Decimal;
    }>;
    /** يخصّ هذا الفرع هذه الأكاديمية؟ حارس يسبق أي كتابة على إعداد فرع */
    branchBelongsToClinic(clinicId: string, branchId: string): Promise<boolean>;
    /** تخصّ هذه الدورة فئة التجميل؟ حارس يمنع تعليق تعريف على دورة مختبر */
    serviceIsGrooming(clinicId: string, serviceId: string): Promise<boolean>;
    /** التعريف يخصّ هذه الأكاديمية؟ حارس يسبق أي كتابة على المصفوفة */
    definitionBelongsToClinic(clinicId: string, definitionId: string): Promise<boolean>;
};
