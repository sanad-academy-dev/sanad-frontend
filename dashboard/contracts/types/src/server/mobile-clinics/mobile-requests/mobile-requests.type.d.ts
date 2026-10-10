import { z } from "zod";
import { MobileBookingRequestStatus, PreferredWindow } from "@/generated/prisma/enums";
export { MobileBookingRequestStatus, PreferredWindow };
/**
 * [MC7.3] النموذج العام — أقلّ ما يجعل الطلب قابلًا للإسناد.
 *
 * `min(1)` قبل `min(n)` مقصود: الحقل الفارغ رسالته «مطلوب»، والقصير رسالته «قصير».
 * بـ`min(n)` وحده يقرأ المستخدم «الاسم قصير جدًا» وهو لم يكتب شيئًا أصلًا.
 */
export declare const publicRequestSchema: z.ZodObject<{
    ownerName: z.ZodString;
    phone: z.ZodString;
    addressLine: z.ZodString;
    email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    district: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    landmark: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    petName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    animalTypeId: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    serviceIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    preferredWindow: z.ZodOptional<z.ZodEnum<{
        readonly MORNING: "MORNING";
        readonly AFTERNOON: "AFTERNOON";
        readonly EVENING: "EVENING";
        readonly ANY: "ANY";
    }>>;
    notes: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    lat: z.ZodOptional<z.ZodNumber>;
    lng: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type PublicRequestFormInput = z.infer<typeof publicRequestSchema>;
/** [MC7.4] تحويل طلب إلى زيارة. المركبة اختيارية — الإسناد قد يتمّ لاحقًا من لوحة الإرسال. */
export declare const convertRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    staffId: z.ZodString;
    startsAt: z.ZodString;
    durationMinutes: z.ZodCoercedNumber<unknown>;
    mobileUnitId: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
}, z.core.$strip>;
export type ConvertRequestFormInput = z.infer<typeof convertRequestSchema>;
/**
 * سبب الرفض مطلوب نصًّا: طلبٌ يُرفض بلا سبب مكتوب يعود بعد أسبوع ولا أحد يعرف لماذا
 * رُفض أوّل مرّة.
 */
export declare const rejectRequestSchema: z.ZodObject<{
    rejectionReason: z.ZodString;
}, z.core.$strip>;
export type RejectRequestFormInput = z.infer<typeof rejectRequestSchema>;
