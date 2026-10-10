import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { MobileVisitServiceSource } from "@/generated/prisma/enums";
export { MobileVisitServiceSource };
/**
 * [MC10] سجلّ الدورات المتنقلة: ما يُسمح به، وما نُفِّذ فعلًا.
 *
 * الأخطاء هنا من عائلة الأخطاء العميلية (`src/server/app.ts`) فتصل بالعربية ورمز 4xx،
 * لا 500 مبهمًا.
 */
export declare class MobileServiceValidationError extends Error {
    constructor(message: string);
}
export declare class MobileServiceConflictError extends Error {
    constructor(message: string);
}
/** دورة غير مسموح بها للمركبات — تُميَّز عن بقيّة أخطاء التحقّق لتُعرض برسالة خاصّة. */
export declare class MobileServiceNotAllowedError extends Error {
    constructor(message: string);
}
export declare const mobileCatalogSelect: {
    readonly id: true;
    readonly serviceId: true;
    readonly price: true;
    readonly duration: true;
    readonly isActive: true;
    readonly notes: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly level: true;
            readonly parentId: true;
            readonly parent: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly parentId: true;
                };
            };
        };
    };
};
export type MobileCatalogEntryResponse = Prisma.MobileServiceCatalogGetPayload<{
    select: typeof mobileCatalogSelect;
}>;
/**
 * السعر والمدّة اختياريّان: الفراغ يعني «خذ ما في `ClinicServiceConfig`». لذلك لا
 * `.default(0)` هنا — صفرٌ ضمنيّ كان سيحوّل كل دورة مضافة بلا سعر إلى دورة مجّانية.
 */
export declare const upsertCatalogEntrySchema: z.ZodObject<{
    serviceId: z.ZodString;
    price: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    duration: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    notes: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null | undefined, string | null | undefined>>;
}, z.core.$strip>;
export type UpsertCatalogEntryFormInput = z.infer<typeof upsertCatalogEntrySchema>;
/** إضافة جماعية: اختيار عدّة دورات دفعةً واحدة من شجرة الدورات. */
export declare const bulkAddCatalogSchema: z.ZodObject<{
    serviceIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type BulkAddCatalogFormInput = z.infer<typeof bulkAddCatalogSchema>;
export declare const mobileVisitServiceSelect: {
    readonly id: true;
    readonly serviceId: true;
    readonly quantity: true;
    readonly priceSnapshot: true;
    readonly durationSnapshot: true;
    readonly source: true;
    readonly performedAt: true;
    readonly notes: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly performedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type MobileVisitServiceResponse = Prisma.MobileVisitServiceGetPayload<{
    select: typeof mobileVisitServiceSelect;
}>;
/**
 * تسجيل دورة نُفِّذت في الموقع.
 *
 * السعر لا يُرسله العميل: يُشتقّ في الخادم من سجلّ المسموح (ثمّ من إعداد الأكاديمية). سعرٌ
 * يأتي من تطبيق المركبة يعني أنّ من يملك الجهاز يملك تحديد الفاتورة.
 */
export declare const recordVisitServiceSchema: z.ZodObject<{
    serviceId: z.ZodString;
    quantity: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    notes: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null | undefined, string | null | undefined>>;
}, z.core.$strip>;
export type RecordVisitServiceFormInput = z.infer<typeof recordVisitServiceSchema>;
