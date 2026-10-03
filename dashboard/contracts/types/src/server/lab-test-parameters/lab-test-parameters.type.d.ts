import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/** اسم فئة التحاليل الافتراضية في شجرة الدورات — الدورات تحتها وحدها تقبل مُحلِّلات */
export declare const LAB_CATEGORY_NAME = "\u0627\u0644\u062A\u062D\u0627\u0644\u064A\u0644";
/**
 * أسماء فئة التحاليل عبر إصدارات البذرة. المصدر الموثوق هو العمود
 * `Service.isLabCategory`، لكن الفئات التي ينشئها المستخدم لا تحمله، ولا تصل
 * تغييرات البذرة إلى قاعدة مأهولة — فتبقى المطابقة بالاسم شبكة أمان.
 */
export declare const LAB_CATEGORY_ALIASES: readonly ["التحاليل", "تحاليل"];
/** فئة التحاليل: العلامة المخزَّنة أولًا، ثم الاسم لالتقاط الفئات غير المُعلَّمة */
export declare const resolveIsLabCategory: (category: {
    isLabCategory: boolean;
    name: string;
}) => boolean;
/** شرط Prisma لفئة التحاليل — يطابق `isLabCategory` أعلاه على مستوى الاستعلام */
export declare const labCategoryWhere: () => Prisma.ServiceWhereInput;
declare const parameterSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly serviceId: true;
    readonly section: true;
    readonly name: true;
    readonly unit: true;
    readonly type: true;
    readonly refLow: true;
    readonly refHigh: true;
    readonly order: true;
    readonly active: true;
    readonly editsCount: true;
};
export type LabTestParameterResponse = Prisma.LabTestParameterGetPayload<{
    select: typeof parameterSelect;
}>;
export declare const parameterSelectShape: {
    readonly id: true;
    readonly clinicId: true;
    readonly serviceId: true;
    readonly section: true;
    readonly name: true;
    readonly unit: true;
    readonly type: true;
    readonly refLow: true;
    readonly refHigh: true;
    readonly order: true;
    readonly active: true;
    readonly editsCount: true;
};
/** قالب تحليل = دورة (ITEM) + مُحلِّلاتها + سعرها/مدتها وتفعيلها من إعداد الأكاديمية */
export type LabTestTemplateResponse = {
    serviceId: string;
    name: string;
    price: number | null;
    duration: number | null;
    /** تفعيل الأكاديمية للدورة — غير المفعّلة لا تُعرض في مُنشئ الطلبات */
    isActive: boolean;
    parameters: LabTestParameterResponse[];
};
export type CreateLabParameterInput = Pick<Prisma.LabTestParameterUncheckedCreateInput, "clinicId" | "serviceId" | "name"> & Partial<Pick<Prisma.LabTestParameterUncheckedCreateInput, "section" | "unit" | "type" | "refLow" | "refHigh" | "order" | "active">>;
export declare const labParameterSchema: z.ZodObject<{
    name: z.ZodString;
    section: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodDefault<z.ZodEnum<{
        readonly NUMERIC: "NUMERIC";
        readonly TEXT: "TEXT";
    }>>;
    refLow: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    refHigh: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    order: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type LabParameterFormInput = z.input<typeof labParameterSchema>;
export type LabParameterFormValues = z.output<typeof labParameterSchema>;
export {};
