import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { CrmDealProductItemType, Gender } from "@/generated/prisma/enums";
import { optionalPhoneSchema, phoneSchema } from "@sanad/contracts/runtime/lib/validation/phone";

/**
 * [CRM-P2] §4/§6 — المصادر المشتركة لأنواع الصفقة وسطور منتجاتها.
 *
 * **مصدر الصفقة (`sourceId`) عمودٌ هنا** (قرار وليّ الأمر، §17.2 صفّ ٩). §4.1 أغفله في
 * تعداد الحقول — ثغرة مواءمة مع النظام المرجعي الذي يحمله على الصفقة أصلًا — و§5 يعدّ
 * «المصدر» ضمن المنسوخ عند التحويل، وهي قراءةٌ حرفية: لقطةٌ عند التحويل، قابلة للتحرير
 * على الصفقة المُنشأة مباشرةً. القراءة عبر `leadId` كانت ستفشل مرّتين: قمع §12 يجمع
 * بالمصدر فيحتاج ضمًّا عبر عمودٍ يقبل الفراغ، و`leadId` نفسه `SetNull` — فحذف العميل
 * المحتمل كان سيمحو مصدر صفقةٍ قائمة.
 */

/** نفس تحويل [CRM-P1]: `.optional()` تأتي أخيرًا وإلّا صار المفتاح مطلوبًا-بقيمة-undefined. */
const trimmedOptional = (max: number) =>
	z
		.string()
		.trim()
		.max(max, "أطول من المسموح")
		.transform((v) => (v && v.length > 0 ? v : undefined))
		.optional();

/** §4.1 — لقطة الشخص. تُنسخ عند التحويل وتبقى قابلة للتحرير في الصفقة. */
const personSnapshot = {
	firstName: z
		.string({ error: "الاسم الأول مطلوب" })
		.trim()
		.min(1, "الاسم الأول مطلوب")
		.max(80),
	lastName: trimmedOptional(80),
	gender: z.enum(Gender).optional(),
	mobile: phoneSchema,
	phone: optionalPhoneSchema,
	email: z
		.string()
		.trim()
		.email("بريد إلكتروني غير صالح")
		.optional()
		.or(z.literal("").transform(() => undefined)),
	city: trimmedOptional(80),
	address: trimmedOptional(240),
	petSpecies: trimmedOptional(80),
	petCount: z.coerce.number().int("عدد الأطفال عدد صحيح").min(0).max(999).optional(),
	petNotes: trimmedOptional(2000),
};

/** المبلغ يصل نصًّا من الشبكة ويبقى نصًّا حتى `Prisma.Decimal` — لا يمرّ بـ`number` أبدًا (C2). */
const moneyString = (label: string) =>
	z
		.string()
		.trim()
		.regex(/^\d{1,12}(\.\d{1,2})?$/, label)
		.optional();

export const createDealSchema = z.object({
	...personSnapshot,
	/** يُملأ من التحويل وحده (§5)؛ الإنشاء اليدوي يتركه فارغًا. */
	leadId: trimmedOptional(40),
	/** BR-C5.3 — وليّ أمرٌ قائم طُوبق بالجوال. */
	ownerId: trimmedOptional(40),
	/** §5 — يُنسخ من العميل المحتمل عند التحويل، ويُختار يدويًّا على الصفقة المباشرة. */
	sourceId: trimmedOptional(40),
	statusId: z.string({ error: "الحالة مطلوبة" }).min(1, "الحالة مطلوبة"),
	/** حين تُرسَل صراحةً تعني تجاوزًا يدويًّا (BR-C4.2)، وحين تغيب تُؤخذ من الحالة. */
	probability: z.coerce.number().min(0, "بين ٠ و١٠٠").max(100, "بين ٠ و١٠٠").optional(),
	expectedCloseDate: z.string().max(40).optional(),
	dealValue: moneyString("قيمة الصفقة رقم بمنزلتين عشريتين على الأكثر"),
	ownerUserId: trimmedOptional(40),
	notes: trimmedOptional(4000),
});
export type CreateDealFormInput = z.infer<typeof createDealSchema>;
/** ما يحمله النموذج قبل تشغيل Zod — نمط الثلاثة معاملات في `useForm` (كما في العملاء المحتملين). */
export type CreateDealFormValues = z.input<typeof createDealSchema>;

/** التحرير لا يمسّ الحالة ولا الروابط: للحالة مسارها الوحيد، وللروابط التحويل والفوز. */
export const updateDealSchema = createDealSchema
	.partial()
	.omit({ statusId: true, leadId: true, ownerId: true });
export type UpdateDealFormInput = z.infer<typeof updateDealSchema>;

/** §4 — تغيير الحالة مسارٌ واحد: السحب في اللوحة والقائمة في الصفحة كلاهما هنا. */
export const changeDealStatusSchema = z.object({
	statusId: z.string({ error: "الحالة مطلوبة" }).min(1, "الحالة مطلوبة"),
	lostReasonId: z.string().trim().min(1).optional(),
	lostNotes: trimmedOptional(2000),
});
export type ChangeDealStatusFormInput = z.infer<typeof changeDealStatusSchema>;

/**
 * BR-C4.2 — تعديل النسبة صراحةً. مسارٌ مستقلّ عن `updateDeal` لأنّ له أثرًا ثانيًا:
 * رفع علم التجاوز. `reset: true` هو الفعل الصريح المقابل («إعادة الافتراضي»).
 */
export const dealProbabilitySchema = z.object({
	probability: z.coerce.number().min(0, "بين ٠ و١٠٠").max(100, "بين ٠ و١٠٠").optional(),
	reset: z.boolean().optional(),
});
export type DealProbabilityFormInput = z.infer<typeof dealProbabilitySchema>;

/* ── §6 سطور المنتجات ────────────────────────────────────────────────────────────────── */

export const dealProductSchema = z.object({
	itemType: z.enum(CrmDealProductItemType, { error: "نوع السطر مطلوب" }),
	itemId: trimmedOptional(40),
	label: z.string({ error: "الوصف مطلوب" }).trim().min(1, "الوصف مطلوب").max(200),
	qty: z
		.string()
		.trim()
		.regex(/^\d{1,8}(\.\d{1,2})?$/, "الكمية رقم بمنزلتين عشريتين على الأكثر"),
	unitPrice: z
		.string()
		.trim()
		.regex(/^\d{1,12}(\.\d{1,2})?$/, "السعر رقم بمنزلتين عشريتين على الأكثر"),
});
export type DealProductFormInput = z.infer<typeof dealProductSchema>;

/** §6 — المحرّر يحفظ القائمة كاملة: صفٌّ غاب عن الحمولة صفٌّ حُذف. */
export const dealProductsSchema = z.object({
	products: z.array(dealProductSchema).max(100, "أكثر من المسموح"),
	/** BR-C6.1 — يُستعمل فقط حين تكون القائمة فارغة. */
	manualDealValue: moneyString("قيمة الصفقة رقم بمنزلتين عشريتين على الأكثر"),
});
export type DealProductsFormInput = z.infer<typeof dealProductsSchema>;

/* ── أشكال الاستجابة ─────────────────────────────────────────────────────────────────── */

export const dealListSelect = {
	id: true,
	code: true,
	fullName: true,
	mobile: true,
	email: true,
	city: true,
	statusId: true,
	sourceId: true,
	probability: true,
	dealValue: true,
	expectedValue: true,
	expectedCloseDate: true,
	closedDate: true,
	ownerUserId: true,
	leadId: true,
	ownerId: true,
	wonOwnerId: true,
	createdAt: true,
	// [CRM-P5] §10.4 — كالعميل المحتمل: الحقول تسافر والشارة تُشتقّ عند الرسم
	// `slaPolicyId` معها: أيّ سياسةٍ طُبِّقت سؤالٌ تجيبه اللقطة، وبدونه لا سبيل
	// لمعرفة ذلك من الواجهة أصلًا — وهو ما كشفته جولة §16 حين طلبته فلم تجده
	slaPolicyId: true,
	responseBy: true,
	firstRespondedAt: true,
	slaStatus: true,
	status: { select: { id: true, name: true, color: true, kind: true, order: true } },
	source: { select: { id: true, name: true } },
	ownerUser: { select: { id: true, name: true } },
} as const;
export type CrmDealListResponse = Prisma.CrmDealGetPayload<{ select: typeof dealListSelect }>;

export const dealProductSelect = {
	id: true,
	dealId: true,
	itemType: true,
	itemId: true,
	label: true,
	qty: true,
	unitPrice: true,
	lineTotal: true,
} as const;
export type CrmDealProductResponse = Prisma.CrmDealProductGetPayload<{
	select: typeof dealProductSelect;
}>;

export const dealDetailSelect = {
	...dealListSelect,
	firstName: true,
	lastName: true,
	gender: true,
	phone: true,
	address: true,
	petSpecies: true,
	petCount: true,
	petNotes: true,
	probabilityOverridden: true,
	lostReasonId: true,
	lostNotes: true,
	notes: true,
	updatedAt: true,
	lostReason: { select: { id: true, name: true } },
	lead: { select: { id: true, code: true, fullName: true } },
	owner: { select: { id: true, code: true, name: true } },
	wonOwner: { select: { id: true, code: true, name: true } },
	products: { select: dealProductSelect, orderBy: { createdAt: "asc" } },
} as const;
export type CrmDealDetailResponse = Prisma.CrmDealGetPayload<{
	select: typeof dealDetailSelect;
}>;
