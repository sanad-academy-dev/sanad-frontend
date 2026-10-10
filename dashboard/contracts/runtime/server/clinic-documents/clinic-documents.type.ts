import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { ClinicDocumentCategory, DocumentKind } from "@/generated/prisma/enums";

export { ClinicDocumentCategory, DocumentKind };

// ─── حالة الصلاحية — مشتقّة لا مخزّنة ─────────────────────
//
// لا شيء يعيد التشغيل عند مرور تاريخ، فعمود مخزَّن كان سيتقادم بصمت. تُحسب هنا مرة
// واحدة وتُستهلك من الخادم (فلترة/عدّادات) ومن العميل (الشارة) معًا.

/** المدة التي يُعتبر المستند خلالها «ينتهي قريبًا». */
export const EXPIRY_SOON_DAYS = 30;

export type ExpiryStatus = "NONE" | "VALID" | "EXPIRING" | "EXPIRED";

/** يوم تقويمي كعدد مللي ثانية عند منتصف ليل UTC — يلغي أثر المنطقة الزمنية من المقارنة. */
const toUtcDay = (value: Date) =>
	Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());

// «اليوم» كما يراه المشغّل (مكوّنات محلية) مُسقَطًا على UTC ليقارَن بعمود DATE المخزَّن.
const todayUtcDay = () => {
	const now = new Date();
	return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
};

const DAY_MS = 86_400_000;

/** الأيام المتبقية حتى الانتهاء (سالبة = منتهية، null = بلا تاريخ انتهاء). */
export function daysUntilExpiry(expiresAt: Date | string | null | undefined): number | null {
	if (!expiresAt) return null;
	const target = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
	if (Number.isNaN(target.getTime())) return null;
	return Math.round((toUtcDay(target) - todayUtcDay()) / DAY_MS);
}

export function resolveExpiryStatus(
	expiresAt: Date | string | null | undefined,
): ExpiryStatus {
	const days = daysUntilExpiry(expiresAt);
	if (days === null) return "NONE";
	if (days < 0) return "EXPIRED";
	if (days <= EXPIRY_SOON_DAYS) return "EXPIRING";
	return "VALID";
}

/** خيارات فلتر الصلاحية في شريط الأدوات. */
export const EXPIRY_FILTERS = ["all", "valid", "expiring", "expired"] as const;
export type ExpiryFilter = (typeof EXPIRY_FILTERS)[number];

// ─── مخطط النموذج (Zod — مصدر الحقيقة لورقة الإضافة/التعديل) ─

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

// التواريخ نصوص "yyyy-MM-dd" لأن DateField يخزّنها هكذا، وعمود DATE لا يحمل وقتًا.
const isoDay = z
	.string()
	.regex(ISO_DAY, "التاريخ غير صالح")
	.nullish()
	.or(z.literal(""))
	.transform((value) => (value ? value : null));

export const clinicDocumentFormSchema = z
	.object({
		category: z.enum(ClinicDocumentCategory, { error: "التصنيف مطلوب" }),
		kind: z.enum(DocumentKind, { error: "نوع المستند مطلوب" }),
		title: z
			.string({ error: "العنوان مطلوب" })
			.trim()
			.min(1, "العنوان مطلوب")
			.max(160, "العنوان طويل جدًا"),
		description: z.string().trim().max(500, "الوصف طويل جدًا").nullish(),
		// "" = كل الفروع؛ يُطبَّع إلى null في الـ DAO قبل أن يصل Prisma
		branchId: z.string().nullish(),
		issuedAt: isoDay,
		expiresAt: isoDay,
		url: z.string().trim().default(""),
		mimeType: z.string().nullish(),
		sizeBytes: z.coerce.number().int().min(0).nullish(),
	})
	.superRefine((value, ctx) => {
		if (value.kind === "FILE" && !value.url)
			ctx.addIssue({ code: "custom", path: ["url"], message: "يجب رفع ملف" });

		if (value.kind === "LINK" && !/^https?:\/\//i.test(value.url))
			ctx.addIssue({
				code: "custom",
				path: ["url"],
				message: "الرابط يجب أن يبدأ بـ http أو https",
			});

		// نصوص "yyyy-MM-dd" تُقارَن معجميًا مقارنةً صحيحة زمنيًا
		if (value.issuedAt && value.expiresAt && value.expiresAt < value.issuedAt)
			ctx.addIssue({
				code: "custom",
				path: ["expiresAt"],
				message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ الإصدار",
			});
	});

export type ClinicDocumentFormInput = z.input<typeof clinicDocumentFormSchema>;
export type ClinicDocumentFormValues = z.output<typeof clinicDocumentFormSchema>;

// ─── مدخلات الـ DAO — مشتقّة من أنواع Prisma المولّدة ──────

export type CreateClinicDocumentInput = Pick<
	Prisma.ClinicDocumentUncheckedCreateInput,
	"category" | "title" | "kind" | "url"
> &
	Partial<
		Pick<
			Prisma.ClinicDocumentUncheckedCreateInput,
			"description" | "branchId" | "mimeType" | "sizeBytes" | "issuedAt" | "expiresAt"
		>
	>;

export type UpdateClinicDocumentInput = Partial<CreateClinicDocumentInput>;

// ─── شكل الاستجابة ───────────────────────────────────────

const clinicDocumentSelect = {
	id: true,
	clinicId: true,
	branchId: true,
	category: true,
	title: true,
	description: true,
	kind: true,
	url: true,
	mimeType: true,
	sizeBytes: true,
	issuedAt: true,
	expiresAt: true,
	createdAt: true,
	updatedAt: true,
	branch: { select: { id: true, name: true } },
	author: { select: { id: true, name: true } },
} satisfies Prisma.ClinicDocumentSelect;

export const clinicDocumentSelectShape = clinicDocumentSelect;

export type ClinicDocumentResponse = Prisma.ClinicDocumentGetPayload<{
	select: typeof clinicDocumentSelect;
}>;

/** عدّادات بطاقات الإحصاء — قيم محسوبة، لا شكل جدول، فلا مصدر Prisma تُشتق منه. */
export type ClinicDocumentSummary = {
	total: number;
	expiring: number;
	expired: number;
	addedThisMonth: number;
};
