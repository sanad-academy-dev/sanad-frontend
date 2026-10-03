import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { GroomingLane, GroomingModifierCode, GroomingServiceKind, GroomingSizeBand, HairType } from "@/generated/prisma/enums";
/** اسم فئة التجميل الافتراضية في شجرة الدورات — دوراتها وحدها تقبل تعريفات */
export declare const GROOMING_CATEGORY_NAME = "\u0627\u0644\u062A\u062C\u0645\u064A\u0644";
/**
 * أسماء فئة التجميل عبر إصدارات البذرة. المصدر الموثوق هو العمود
 * `Service.isGroomingCategory`، والمطابقة بالاسم شبكة أمان للفئات التي ينشئها
 * المستخدم بلا علامة — نفس عقد `resolveIsOperationCategory`.
 */
export declare const GROOMING_CATEGORY_ALIASES: readonly ["التجميل", "العناية والتجميل", "الاستحمام والتجميل"];
export declare const resolveIsGroomingCategory: (category: {
    isGroomingCategory: boolean;
    name: string;
}) => boolean;
/** شرط Prisma لفئة التجميل — العلامة المخزَّنة أولًا ثم الاسم */
export declare const groomingCategoryWhere: () => Prisma.ServiceWhereInput;
export declare const GROOMING_SERVICE_KIND_LABELS: Record<GroomingServiceKind, string>;
export declare const GROOMING_MODIFIER_CODE_LABELS: Record<GroomingModifierCode, string>;
/** الرموز التي لا تُطبَّق آليًا مهما كانت العتبة — يطبّقها الطاقم بقرار */
export declare const MANUAL_ONLY_MODIFIER_CODES: readonly ["EXPRESS", "OUT_OF_HOURS"];
declare const priceRuleSelect: {
    readonly id: true;
    readonly definitionId: true;
    readonly animalTypeId: true;
    readonly animalStrainId: true;
    readonly sizeBand: true;
    readonly coatType: true;
    readonly price: true;
    readonly durationMin: true;
    readonly dryingMinutes: true;
    readonly createdAt: true;
};
export type GroomingPriceRuleResponse = Prisma.GroomingPriceRuleGetPayload<{
    select: typeof priceRuleSelect;
}>;
export declare const priceRuleSelectShape: {
    readonly id: true;
    readonly definitionId: true;
    readonly animalTypeId: true;
    readonly animalStrainId: true;
    readonly sizeBand: true;
    readonly coatType: true;
    readonly price: true;
    readonly durationMin: true;
    readonly dryingMinutes: true;
    readonly createdAt: true;
};
declare const definitionSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly serviceId: true;
    readonly kind: true;
    readonly lane: true;
    readonly requiresVetOrder: true;
    readonly isAddOn: true;
    readonly basePrice: true;
    readonly baseDurationMin: true;
    readonly dryingMinutes: true;
    readonly speciesScope: true;
    readonly requiresStation: true;
    readonly active: true;
    readonly priceRules: {
        readonly select: {
            readonly id: true;
            readonly definitionId: true;
            readonly animalTypeId: true;
            readonly animalStrainId: true;
            readonly sizeBand: true;
            readonly coatType: true;
            readonly price: true;
            readonly durationMin: true;
            readonly dryingMinutes: true;
            readonly createdAt: true;
        };
    };
};
export type GroomingServiceDefinitionResponse = Prisma.GroomingServiceDefinitionGetPayload<{
    select: typeof definitionSelect;
}>;
export declare const definitionSelectShape: {
    readonly id: true;
    readonly clinicId: true;
    readonly serviceId: true;
    readonly kind: true;
    readonly lane: true;
    readonly requiresVetOrder: true;
    readonly isAddOn: true;
    readonly basePrice: true;
    readonly baseDurationMin: true;
    readonly dryingMinutes: true;
    readonly speciesScope: true;
    readonly requiresStation: true;
    readonly active: true;
    readonly priceRules: {
        readonly select: {
            readonly id: true;
            readonly definitionId: true;
            readonly animalTypeId: true;
            readonly animalStrainId: true;
            readonly sizeBand: true;
            readonly coatType: true;
            readonly price: true;
            readonly durationMin: true;
            readonly dryingMinutes: true;
            readonly createdAt: true;
        };
    };
};
declare const modifierSelect: {
    readonly id: true;
    readonly code: true;
    readonly labelAr: true;
    readonly calc: true;
    readonly value: true;
    readonly autoAppliesFrom: true;
    readonly requiresOwnerApproval: true;
    readonly active: true;
};
export type GroomingModifierResponse = Prisma.GroomingModifierGetPayload<{
    select: typeof modifierSelect;
}>;
export declare const modifierSelectShape: {
    readonly id: true;
    readonly code: true;
    readonly labelAr: true;
    readonly calc: true;
    readonly value: true;
    readonly autoAppliesFrom: true;
    readonly requiresOwnerApproval: true;
    readonly active: true;
};
declare const capacitySelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly branchId: true;
    readonly stations: true;
    readonly dryerSlots: true;
    readonly maxPetsPerDay: true;
    readonly maxHeatSensitiveConcurrent: true;
    readonly dropOffWindowMin: true;
    readonly requireDepositPercent: true;
    readonly seniorAgeYears: true;
    readonly quoteReapprovalPercent: true;
};
export type GroomingCapacityResponse = Prisma.GroomingCapacityConfigGetPayload<{
    select: typeof capacitySelect;
}>;
export declare const capacitySelectShape: {
    readonly id: true;
    readonly clinicId: true;
    readonly branchId: true;
    readonly stations: true;
    readonly dryerSlots: true;
    readonly maxPetsPerDay: true;
    readonly maxHeatSensitiveConcurrent: true;
    readonly dropOffWindowMin: true;
    readonly requireDepositPercent: true;
    readonly seniorAgeYears: true;
    readonly quoteReapprovalPercent: true;
};
/** قالب دورة تجميل = دورة (ITEM) + تعريفها + سعرها/مدتها من إعداد الأكاديمية */
export type GroomingTemplateResponse = {
    serviceId: string;
    name: string;
    subcategoryName: string;
    price: number | null;
    duration: number | null;
    /** تفعيل الأكاديمية للدورة — غير المفعّلة لا تُعرض في مُنشئ الجلسات */
    isActive: boolean;
    definition: GroomingServiceDefinitionResponse | null;
    /**
     * المسار الفعّال: من التعريف إن وُجد، وإلا COSMETIC. غياب التعريف لا يرفع
     * متطلبات الأمان تلقائيًا — لكن التهدئة تفعل، وهي تُقرَّر على الجلسة لا هنا.
     */
    effectiveLane: GroomingLane;
    /** true حين يكون المسار افتراضًا لا تعريفًا — الواجهة تُلمّح بذلك */
    laneInferred: boolean;
};
export type UpsertGroomingDefinitionInput = Pick<Prisma.GroomingServiceDefinitionUncheckedCreateInput, "clinicId" | "serviceId" | "kind"> & Partial<Pick<Prisma.GroomingServiceDefinitionUncheckedCreateInput, "lane" | "requiresVetOrder" | "isAddOn" | "basePrice" | "baseDurationMin" | "dryingMinutes" | "requiresStation" | "active">> & {
    /** نطاق الأنواع — يستبدل القائمة الحالية بالكامل عند تمريره */
    speciesScope?: string[];
};
/** صفّ مصفوفة — الأبعاد الغائبة تعني «لا يقيّد هذا البُعد» */
export type GroomingPriceRuleInputRow = Pick<Prisma.GroomingPriceRuleUncheckedCreateInput, "price" | "durationMin"> & Partial<Pick<Prisma.GroomingPriceRuleUncheckedCreateInput, "animalTypeId" | "animalStrainId" | "sizeBand" | "coatType" | "dryingMinutes">>;
export type UpsertGroomingModifierInput = Pick<Prisma.GroomingModifierUncheckedCreateInput, "clinicId" | "code" | "labelAr" | "calc" | "value"> & Partial<Pick<Prisma.GroomingModifierUncheckedCreateInput, "autoAppliesFrom" | "requiresOwnerApproval" | "active">>;
export type UpsertGroomingCapacityInput = Pick<Prisma.GroomingCapacityConfigUncheckedCreateInput, "clinicId" | "branchId"> & Partial<Pick<Prisma.GroomingCapacityConfigUncheckedCreateInput, "stations" | "dryerSlots" | "maxPetsPerDay" | "maxHeatSensitiveConcurrent" | "dropOffWindowMin" | "requireDepositPercent" | "seniorAgeYears" | "quoteReapprovalPercent">>;
/**
 * مفتاح هوية صفّ المصفوفة. القيد الفريد في Postgres لا يمنع التكرار حين تكون
 * الأبعاد NULL (فـ NULL مميّز عن NULL في الفهارس الفريدة)، فمسار الكتابة يطابق
 * على هذا المفتاح قبل الإنشاء. الحزام الثاني هو الترتيب الحتمي في محرّك التسعير.
 */
export declare const priceRuleIdentityKey: (row: {
    animalTypeId?: string | null;
    animalStrainId?: string | null;
    sizeBand?: GroomingSizeBand | null;
    coatType?: HairType | null;
}) => string;
export declare const groomingDefinitionSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        readonly BATH: "BATH";
        readonly FULL_GROOM: "FULL_GROOM";
        readonly TIDY_UP: "TIDY_UP";
        readonly DESHED: "DESHED";
        readonly NAIL_TRIM: "NAIL_TRIM";
        readonly EAR_CLEAN: "EAR_CLEAN";
        readonly ANAL_GLANDS: "ANAL_GLANDS";
        readonly TEETH_BRUSH: "TEETH_BRUSH";
        readonly DEMATTING: "DEMATTING";
        readonly SHAVE_DOWN: "SHAVE_DOWN";
        readonly MEDICATED_BATH: "MEDICATED_BATH";
        readonly PARASITE_DIP: "PARASITE_DIP";
        readonly WOUND_CARE_CLIP: "WOUND_CARE_CLIP";
        readonly SPA_ADDON: "SPA_ADDON";
        readonly OTHER: "OTHER";
    }>;
    lane: z.ZodDefault<z.ZodEnum<{
        readonly COSMETIC: "COSMETIC";
        readonly MEDICAL: "MEDICAL";
    }>>;
    requiresVetOrder: z.ZodDefault<z.ZodBoolean>;
    isAddOn: z.ZodDefault<z.ZodBoolean>;
    basePrice: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    baseDurationMin: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    dryingMinutes: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    speciesScope: z.ZodDefault<z.ZodArray<z.ZodString>>;
    requiresStation: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type GroomingDefinitionFormInput = z.input<typeof groomingDefinitionSchema>;
export type GroomingDefinitionFormValues = z.output<typeof groomingDefinitionSchema>;
export declare const groomingPriceRuleSchema: z.ZodObject<{
    animalTypeId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    animalStrainId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBand: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly TOY: "TOY";
        readonly SMALL: "SMALL";
        readonly MEDIUM: "MEDIUM";
        readonly LARGE: "LARGE";
        readonly GIANT: "GIANT";
    }>>>;
    coatType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly LONG_THICK: "LONG_THICK";
        readonly SHORT_THICK: "SHORT_THICK";
        readonly LIGHT: "LIGHT";
        readonly MEDIUM: "MEDIUM";
        readonly DOUBLE_COAT: "DOUBLE_COAT";
        readonly NONE: "NONE";
    }>>>;
    price: z.ZodCoercedNumber<unknown>;
    durationMin: z.ZodCoercedNumber<unknown>;
    dryingMinutes: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type GroomingPriceRuleFormInput = z.input<typeof groomingPriceRuleSchema>;
export declare const groomingModifierSchema: z.ZodObject<{
    code: z.ZodEnum<{
        readonly MATTING: "MATTING";
        readonly SHAVE_DOWN: "SHAVE_DOWN";
        readonly BEHAVIOR: "BEHAVIOR";
        readonly SENIOR: "SENIOR";
        readonly FLEA: "FLEA";
        readonly SECOND_PET: "SECOND_PET";
        readonly EXPRESS: "EXPRESS";
        readonly OUT_OF_HOURS: "OUT_OF_HOURS";
    }>;
    labelAr: z.ZodString;
    calc: z.ZodEnum<{
        readonly PERCENT: "PERCENT";
        readonly FIXED: "FIXED";
        readonly PER_MINUTE: "PER_MINUTE";
    }>;
    value: z.ZodCoercedNumber<unknown>;
    autoAppliesFrom: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    requiresOwnerApproval: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type GroomingModifierFormInput = z.input<typeof groomingModifierSchema>;
export declare const groomingCapacitySchema: z.ZodObject<{
    stations: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    dryerSlots: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    maxPetsPerDay: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    maxHeatSensitiveConcurrent: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    dropOffWindowMin: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    requireDepositPercent: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    seniorAgeYears: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    quoteReapprovalPercent: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type GroomingCapacityFormInput = z.input<typeof groomingCapacitySchema>;
/** معامل المدّة لكل شريحة حجم — مضروبًا في مدّة الدورة الأساسية */
export declare const GROOMING_SIZE_DURATION_FACTOR: Record<GroomingSizeBand, number>;
/** معامل المدّة لكل نوع فرو — الفرو المزدوج والطويل الكثيف أثقل تجفيفًا وتمشيطًا */
export declare const GROOMING_COAT_DURATION_FACTOR: Record<HairType, number>;
export type GroomingDurationGridCell = {
    sizeBand: GroomingSizeBand;
    coatType: HairType;
    durationMin: number;
    dryingMinutes: number;
};
/**
 * الشبكة المقترحة لدورة بمدّة أساسية ودقائق تجفيف معلومتين. تُقرأ في الواجهة
 * فقط — لا يكتبها الخادم تلقائيًا في أي مكان.
 */
export declare const buildGroomingDurationGrid: (baseDurationMin: number, baseDryingMinutes: number) => GroomingDurationGridCell[];
export {};
