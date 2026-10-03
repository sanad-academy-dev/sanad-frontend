import type { Prisma } from "@/generated/prisma/client";
/**
 * [PH0.3] إعدادات صيدلية الأكاديمية — BRD_Pharmacy_Module.md §14.
 *
 * `id` و`clinicId` غير مُعادين: العميل لا يحتاجهما ولا يجب أن يرسلهما (نمط
 * `inbox-settings.type.ts`).
 */
export declare const pharmacySettingsSelect: {
    enabled: true;
    requireWitnessOnWaste: true;
    defaultLabelCopies: true;
    fefoSuggestion: true;
    blockExpiredDispense: true;
    controlledRegisterEnabled: true;
};
export type PharmacySettingsResponse = Prisma.ClinicPharmacySettingsGetPayload<{
    select: typeof pharmacySettingsSelect;
}>;
/**
 * `blockExpiredDispense` غائب عمدًا: صرف دفعة منتهية الصلاحية ليس تفضيلًا للأكاديمية
 * (BR-P7.3.4). العمود موجود ليشرح نفسه في الشاشة معطّلًا، لا ليُطفأ عبر الـAPI —
 * ولو كان قابلًا للتعديل هنا لكان وجوده في الشاشة معطّلًا كذبة.
 */
export type UpdatePharmacySettingsInput = Partial<Omit<PharmacySettingsResponse, "blockExpiredDispense">>;
/**
 * نفس قيم `@default` في `prisma/schema.prisma`. تُعاد حرفيًا عندما لا يوجد صفّ
 * للأكاديمية، فلا يحتاج العميل إلى `?? false` عند كل حقل — والأهم: **غياب الصفّ يُقرأ
 * «مطفأة»**، وهو ما يجعل خمول الراية (BRD §0.3) صحيحًا لكل أكاديمية قائمة دون أن
 * ينشئ الترحيل صفًّا واحدًا.
 */
export declare const DEFAULT_PHARMACY_SETTINGS: PharmacySettingsResponse;
