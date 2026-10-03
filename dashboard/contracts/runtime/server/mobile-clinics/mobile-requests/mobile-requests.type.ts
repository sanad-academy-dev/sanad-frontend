import { z } from "zod";

import { MobileBookingRequestStatus, PreferredWindow } from "@/generated/prisma/enums";

export { MobileBookingRequestStatus, PreferredWindow };

/**
 * مخطّطات نماذج طلبات الزيارة المتنقلة.
 *
 * موضعها هنا لا داخل المكوّنات (اصطلاح AGENTS.md): المخطّط مصدر الحقيقة للتحقّق،
 * والنوع يُشتقّ منه بـ `z.infer` فلا ينحرف عنه.
 */

const optionalText = (max: number) =>
	z.preprocess(
		(value) => (value === "" || value === null ? undefined : value),
		z.string().max(max).optional(),
	);

/**
 * [MC7.3] النموذج العام — أقلّ ما يجعل الطلب قابلًا للإسناد.
 *
 * `min(1)` قبل `min(n)` مقصود: الحقل الفارغ رسالته «مطلوب»، والقصير رسالته «قصير».
 * بـ`min(n)` وحده يقرأ المستخدم «الاسم قصير جدًا» وهو لم يكتب شيئًا أصلًا.
 */
export const publicRequestSchema = z.object({
	ownerName: z
		.string({ error: "الاسم مطلوب" })
		.min(1, "الاسم مطلوب")
		.min(2, "الاسم قصير جدًا")
		.max(120, "الاسم طويل"),
	// الطول أدنى حدّ فقط: أرقام الخليج تختلف صيغها، وتضييق النمط يرفض أرقامًا صحيحة
	phone: z
		.string({ error: "رقم الجوال مطلوب" })
		.min(1, "رقم الجوال مطلوب")
		.min(6, "رقم الجوال غير مكتمل")
		.max(30, "رقم الجوال طويل"),
	addressLine: z
		.string({ error: "العنوان مطلوب" })
		.min(1, "العنوان مطلوب")
		.min(3, "العنوان قصير جدًا")
		.max(300, "العنوان طويل"),
	email: optionalText(160),
	district: optionalText(120),
	landmark: optionalText(200),
	petName: optionalText(120),
	animalTypeId: optionalText(40),
	// الدورات المطلوبة: تُطابَق على سجلّ الدورات المتنقلة في الخادم، والقائمة المعروضة
	// تأتي منه أصلًا — فالتحقّق هنا حدٌّ للحجم لا بديلٌ عن تحقّق الخادم.
	serviceIds: z.array(z.string().min(1)).max(20, "عدد الدورات كبير جدًا").optional(),
	preferredWindow: z.enum(PreferredWindow).optional(),
	notes: optionalText(1000),
	lat: z.number().min(-90).max(90).optional(),
	lng: z.number().min(-180).max(180).optional(),
});

export type PublicRequestFormInput = z.infer<typeof publicRequestSchema>;

/** [MC7.4] تحويل طلب إلى زيارة. المركبة اختيارية — الإسناد قد يتمّ لاحقًا من لوحة الإرسال. */
export const convertRequestSchema = z.object({
	branchId: z.string({ error: "الفرع مطلوب" }).min(1, "الفرع مطلوب"),
	staffId: z.string({ error: "المدرّب مطلوب" }).min(1, "المدرّب مطلوب"),
	startsAt: z.string({ error: "الموعد مطلوب" }).min(1, "الموعد مطلوب"),
	durationMinutes: z.coerce
		.number({ error: "المدّة يجب أن تكون رقمًا" })
		.int("المدّة يجب أن تكون عددًا صحيحًا")
		.min(5, "المدّة قصيرة جدًا")
		.max(600, "المدّة طويلة جدًا"),
	mobileUnitId: optionalText(40),
});

export type ConvertRequestFormInput = z.infer<typeof convertRequestSchema>;

/**
 * سبب الرفض مطلوب نصًّا: طلبٌ يُرفض بلا سبب مكتوب يعود بعد أسبوع ولا أحد يعرف لماذا
 * رُفض أوّل مرّة.
 */
export const rejectRequestSchema = z.object({
	rejectionReason: z
		.string({ error: "سبب الرفض مطلوب" })
		.min(1, "سبب الرفض مطلوب")
		.min(3, "اكتب سببًا مفهومًا")
		.max(300, "السبب طويل"),
});

export type RejectRequestFormInput = z.infer<typeof rejectRequestSchema>;
