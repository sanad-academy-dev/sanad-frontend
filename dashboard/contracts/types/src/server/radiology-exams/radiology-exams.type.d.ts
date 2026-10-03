import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { RadiologyModality } from "@/generated/prisma/enums";
/** اسم فئة الأشعة الافتراضية في شجرة الدورات — الدورات تحتها وحدها تقبل تعريفات */
export declare const RADIOLOGY_CATEGORY_NAME = "\u0627\u0644\u0623\u0634\u0639\u0629";
/**
 * أسماء فئة الأشعة عبر إصدارات البذرة. المصدر الموثوق هو العمود
 * `Service.isRadiologyCategory`، لكن الفئات التي ينشئها المستخدم لا تحمله —
 * فتبقى المطابقة بالاسم شبكة أمان.
 */
export declare const RADIOLOGY_CATEGORY_ALIASES: readonly ["الأشعة", "أشعة"];
/** فئة الأشعة: العلامة المخزَّنة أولًا، ثم الاسم لالتقاط الفئات غير المُعلَّمة */
export declare const resolveIsRadiologyCategory: (category: {
    isRadiologyCategory: boolean;
    name: string;
}) => boolean;
/** شرط Prisma لفئة الأشعة — يطابق `isRadiologyCategory` أعلاه على مستوى الاستعلام */
export declare const radiologyCategoryWhere: () => Prisma.ServiceWhereInput;
declare const definitionSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly serviceId: true;
    readonly modality: true;
    readonly bodyPart: true;
    readonly defaultViews: true;
    readonly lateralityRequired: true;
    readonly contrastDefault: true;
    readonly sedationDefault: true;
    readonly prepNotes: true;
    readonly active: true;
};
export type RadiologyExamDefinitionResponse = Prisma.RadiologyExamDefinitionGetPayload<{
    select: typeof definitionSelect;
}>;
export declare const definitionSelectShape: {
    readonly id: true;
    readonly clinicId: true;
    readonly serviceId: true;
    readonly modality: true;
    readonly bodyPart: true;
    readonly defaultViews: true;
    readonly lateralityRequired: true;
    readonly contrastDefault: true;
    readonly sedationDefault: true;
    readonly prepNotes: true;
    readonly active: true;
};
/** قالب فحص = دورة (ITEM) + تعريفها + سعرها/مدتها وتفعيلها من إعداد الأكاديمية */
export type RadiologyExamTemplateResponse = {
    serviceId: string;
    name: string;
    price: number | null;
    duration: number | null;
    /** تفعيل الأكاديمية للدورة — غير المفعّلة لا تُعرض في مُنشئ الطلبات */
    isActive: boolean;
    definition: RadiologyExamDefinitionResponse | null;
    /**
     * طريقة التصوير الفعّالة: من التعريف إن وُجد، وإلا مستنتَجة من اسم الفحص
     * ومجموعته — فلا يسقط فحص مقطعية إلى «أشعة سينية» لغياب التعريف.
     */
    effectiveModality: RadiologyModality;
    /** true حين تكون الطريقة مستنتَجة لا معرَّفة — الواجهة تُلمّح بذلك */
    modalityInferred: boolean;
};
export type UpsertRadiologyDefinitionInput = Pick<Prisma.RadiologyExamDefinitionUncheckedCreateInput, "clinicId" | "serviceId"> & Partial<Pick<Prisma.RadiologyExamDefinitionUncheckedCreateInput, "modality" | "bodyPart" | "defaultViews" | "lateralityRequired" | "contrastDefault" | "sedationDefault" | "prepNotes" | "active">>;
export declare const radiologyDefinitionSchema: z.ZodObject<{
    modality: z.ZodEnum<{
        readonly XRAY: "XRAY";
        readonly CT: "CT";
        readonly MRI: "MRI";
        readonly ULTRASOUND: "ULTRASOUND";
        readonly FLUOROSCOPY: "FLUOROSCOPY";
        readonly MAMMOGRAPHY: "MAMMOGRAPHY";
        readonly NUCLEAR: "NUCLEAR";
        readonly PET: "PET";
        readonly DENTAL: "DENTAL";
        readonly OTHER: "OTHER";
    }>;
    bodyPart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    defaultViews: z.ZodDefault<z.ZodArray<z.ZodString>>;
    lateralityRequired: z.ZodDefault<z.ZodBoolean>;
    contrastDefault: z.ZodDefault<z.ZodBoolean>;
    sedationDefault: z.ZodDefault<z.ZodEnum<{
        readonly NONE: "NONE";
        readonly ANXIOLYSIS: "ANXIOLYSIS";
        readonly SEDATION: "SEDATION";
        readonly GENERAL_ANESTHESIA: "GENERAL_ANESTHESIA";
    }>>;
    prepNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type RadiologyDefinitionFormInput = z.input<typeof radiologyDefinitionSchema>;
export type RadiologyDefinitionFormValues = z.output<typeof radiologyDefinitionSchema>;
export {};
