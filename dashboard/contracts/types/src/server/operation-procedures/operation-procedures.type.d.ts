import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { OperationTier, WoundClass } from "@/generated/prisma/enums";
/** اسم فئة العمليات الافتراضية في شجرة الدورات — دوراتها وحدها تقبل تعريفات */
export declare const OPERATION_CATEGORY_NAME = "\u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u062C\u0631\u0627\u062D\u064A\u0629";
/**
 * أسماء فئة العمليات عبر إصدارات البذرة. المصدر الموثوق هو العمود
 * `Service.isOperationCategory`، والمطابقة بالاسم شبكة أمان للفئات التي
 * ينشئها المستخدم بلا علامة.
 */
export declare const OPERATION_CATEGORY_ALIASES: readonly ["العمليات الجراحية", "العمليات"];
/** فئة العمليات: العلامة المخزَّنة أولًا، ثم الاسم لالتقاط الفئات غير المُعلَّمة */
export declare const resolveIsOperationCategory: (category: {
    isOperationCategory: boolean;
    name: string;
}) => boolean;
/** شرط Prisma لفئة العمليات — العلامة المخزَّنة أولًا ثم الاسم */
export declare const operationCategoryWhere: () => Prisma.ServiceWhereInput;
export declare const WOUND_CLASS_LABELS: Record<WoundClass, string>;
export declare const BODY_SYSTEM_OPTIONS: readonly ["الجلد والأنسجة الرخوة", "الجهاز الهضمي", "الجهاز التناسلي والبولي", "الجهاز الهيكلي والعظام", "الفم والأسنان", "العيون", "الأذن", "الجهاز التنفسي", "القلب والأوعية", "الجهاز العصبي"];
declare const definitionSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly serviceId: true;
    readonly defaultTier: true;
    readonly defaultAnesthesia: true;
    readonly defaultWoundClass: true;
    readonly requiresLaterality: true;
    readonly bodySystem: true;
    readonly codes: true;
    readonly specializationId: true;
    readonly prepNotes: true;
    readonly active: true;
    readonly kitItems: {
        readonly select: {
            readonly id: true;
            readonly inventoryItemId: true;
            readonly quantity: true;
            readonly inventoryItem: {
                readonly select: {
                    readonly name: true;
                    readonly code: true;
                };
            };
        };
    };
};
export type OperationProcedureDefinitionResponse = Prisma.OperationProcedureDefinitionGetPayload<{
    select: typeof definitionSelect;
}>;
export declare const definitionSelectShape: {
    readonly id: true;
    readonly clinicId: true;
    readonly serviceId: true;
    readonly defaultTier: true;
    readonly defaultAnesthesia: true;
    readonly defaultWoundClass: true;
    readonly requiresLaterality: true;
    readonly bodySystem: true;
    readonly codes: true;
    readonly specializationId: true;
    readonly prepNotes: true;
    readonly active: true;
    readonly kitItems: {
        readonly select: {
            readonly id: true;
            readonly inventoryItemId: true;
            readonly quantity: true;
            readonly inventoryItem: {
                readonly select: {
                    readonly name: true;
                    readonly code: true;
                };
            };
        };
    };
};
/** قالب إجراء = دورة (ITEM) + تعريفها الجراحي + سعرها/مدتها من إعداد الأكاديمية */
export type OperationProcedureTemplateResponse = {
    serviceId: string;
    name: string;
    subcategoryName: string;
    price: number | null;
    duration: number | null;
    /** تفعيل الأكاديمية للدورة — غير المفعّلة لا تُعرض في مُنشئ الحالات */
    isActive: boolean;
    definition: OperationProcedureDefinitionResponse | null;
    /**
     * الدرجة الفعّالة: من التعريف إن وُجد، وإلا INTERMEDIATE — لا نستنتج
     * أبدًا متطلبات أمان أقل من غياب التعريف (الخطة §4.1).
     */
    effectiveTier: OperationTier;
    /** true حين تكون الدرجة افتراضًا آمنًا لا تعريفًا — الواجهة تُلمّح بذلك */
    tierInferred: boolean;
};
export type UpsertOperationDefinitionInput = Pick<Prisma.OperationProcedureDefinitionUncheckedCreateInput, "clinicId" | "serviceId"> & Partial<Pick<Prisma.OperationProcedureDefinitionUncheckedCreateInput, "defaultTier" | "defaultAnesthesia" | "defaultWoundClass" | "requiresLaterality" | "bodySystem" | "specializationId" | "prepNotes" | "active">> & {
    /** أكواد المصطلحات (S20) — تُخزَّن كما هي في codes Json */
    codes?: {
        snomed?: string;
        cpt?: string;
        icd10pcs?: string;
        venom?: string;
    } | null;
    /** عدة الإجراء — تستبدل القائمة الحالية بالكامل عند تمريرها */
    kitItems?: {
        inventoryItemId: string;
        quantity: number;
    }[];
};
declare const checklistTemplateSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly scope: true;
    readonly tier: true;
    readonly nameAr: true;
    readonly nameEn: true;
    readonly version: true;
    readonly active: true;
    readonly items: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly textAr: true;
            readonly textEn: true;
            readonly required: true;
            readonly responseType: true;
        };
        readonly orderBy: {
            readonly order: "asc";
        };
    };
};
export type ChecklistTemplateResponse = Prisma.ChecklistTemplateGetPayload<{
    select: typeof checklistTemplateSelect;
}>;
export declare const checklistTemplateSelectShape: {
    readonly id: true;
    readonly clinicId: true;
    readonly scope: true;
    readonly tier: true;
    readonly nameAr: true;
    readonly nameEn: true;
    readonly version: true;
    readonly active: true;
    readonly items: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly textAr: true;
            readonly textEn: true;
            readonly required: true;
            readonly responseType: true;
        };
        readonly orderBy: {
            readonly order: "asc";
        };
    };
};
export declare const operationDefinitionSchema: z.ZodObject<{
    defaultTier: z.ZodEnum<{
        readonly MINOR: "MINOR";
        readonly INTERMEDIATE: "INTERMEDIATE";
        readonly MAJOR: "MAJOR";
    }>;
    defaultAnesthesia: z.ZodDefault<z.ZodEnum<{
        readonly NONE: "NONE";
        readonly ANXIOLYSIS: "ANXIOLYSIS";
        readonly SEDATION: "SEDATION";
        readonly GENERAL_ANESTHESIA: "GENERAL_ANESTHESIA";
    }>>;
    defaultWoundClass: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly CLEAN: "CLEAN";
        readonly CLEAN_CONTAMINATED: "CLEAN_CONTAMINATED";
        readonly CONTAMINATED: "CONTAMINATED";
        readonly DIRTY: "DIRTY";
    }>>>;
    requiresLaterality: z.ZodDefault<z.ZodBoolean>;
    bodySystem: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    codes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        snomed: z.ZodOptional<z.ZodString>;
        cpt: z.ZodOptional<z.ZodString>;
        icd10pcs: z.ZodOptional<z.ZodString>;
        venom: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    specializationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    prepNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    active: z.ZodDefault<z.ZodBoolean>;
    kitItems: z.ZodOptional<z.ZodArray<z.ZodObject<{
        inventoryItemId: z.ZodString;
        quantity: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type OperationDefinitionFormInput = z.input<typeof operationDefinitionSchema>;
export type OperationDefinitionFormValues = z.output<typeof operationDefinitionSchema>;
export {};
