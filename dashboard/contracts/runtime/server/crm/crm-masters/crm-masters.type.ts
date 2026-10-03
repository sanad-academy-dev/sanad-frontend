import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { CrmDealStatusKind, CrmLeadStatusKind } from "@/generated/prisma/enums";

/**
 * [CRM-P0] المصادر المشتركة لبيانات إدارة العملاء المرجعية (BRD §2).
 *
 * §18.2 يلزم بإعلان أي قائمة تُستهلك في أكثر من موضع مرّةً واحدة مع اختبار تكافؤ — وهذا
 * الملف هو ذلك الموضع الواحد: قائمة الأنواع الخمسة وقائمة رموز الألوان تُشتقّ منهما كل
 * مخططات التحقق والمسارات والبذور.
 */

/** الأنواع الخمسة كما يعرّفها §2.1/§2.2 — مسار الـ API لكل نوع هو المفتاح نفسه. */
export const CRM_MASTER_KINDS = [
	"lead-statuses",
	"deal-statuses",
	"lead-sources",
	"lost-reasons",
	"industries",
] as const;
export type CrmMasterKind = (typeof CRM_MASTER_KINDS)[number];

/**
 * §2.1 يقول «color». لا يوجد في المستودع كلّه لونُ واجهةٍ مخزَّن في قاعدة البيانات:
 * `mobile_unit.color` لون طلاء مركبة يُعرض نصًّا، وكل لون واجهة يأتي من رمز تصميم في
 * الشيفرة. وقاعدة CLAUDE.md الأولى تمنع الألوان الصريحة منعًا باتًّا — رموز التصميم فقط.
 * لذلك يخزّن العمود **مفتاح رمز** من هذه القائمة المغلقة، لا قيمة hex (قرار وليّ الأمر، §17.2
 * صف ٢). الرموز الثمانية معرَّفة في `src/styles.css` وتغطي لوحة كانبان بلا تكرار.
 */
export const CRM_STATUS_COLOR_TOKENS = [
	"chart-1",
	"chart-2",
	"chart-3",
	"chart-4",
	"chart-5",
	"chart-6",
	"chart-7",
	"chart-8",
] as const;
export type CrmStatusColorToken = (typeof CRM_STATUS_COLOR_TOKENS)[number];

const colorSchema = z.enum(CRM_STATUS_COLOR_TOKENS, { error: "لون الحالة غير مدعوم" });
const nameSchema = z
	.string({ error: "الاسم مطلوب" })
	.trim()
	.min(1, "الاسم مطلوب")
	.max(120, "الاسم أطول من المسموح");

/** §2.2 — الأنواع المسطّحة الثلاثة: اسم فقط. */
export const crmFlatMasterSchema = z.object({
	name: nameSchema,
	active: z.boolean({ error: "الحالة مطلوبة" }).optional().default(true),
});
export type CrmFlatMasterFormInput = z.infer<typeof crmFlatMasterSchema>;

/** §2.1 — حالة عميل محتمل. */
export const crmLeadStatusSchema = crmFlatMasterSchema.extend({
	color: colorSchema,
	order: z.coerce.number({ error: "الترتيب يجب أن يكون رقمًا" }).int("الترتيب عدد صحيح").min(0),
	kind: z.enum(CrmLeadStatusKind, { error: "نوع الحالة مطلوب" }),
});
export type CrmLeadStatusFormInput = z.infer<typeof crmLeadStatusSchema>;

/** §2.1 — حالة صفقة، ومعها الاحتمال الافتراضي للمرحلة. */
export const crmDealStatusSchema = crmFlatMasterSchema.extend({
	color: colorSchema,
	order: z.coerce.number({ error: "الترتيب يجب أن يكون رقمًا" }).int("الترتيب عدد صحيح").min(0),
	kind: z.enum(CrmDealStatusKind, { error: "نوع الحالة مطلوب" }),
	defaultProbability: z.coerce
		.number({ error: "الاحتمال يجب أن يكون رقمًا" })
		.min(0, "الاحتمال بين ٠ و١٠٠")
		.max(100, "الاحتمال بين ٠ و١٠٠"),
});
export type CrmDealStatusFormInput = z.infer<typeof crmDealStatusSchema>;

const leadStatusSelect = {
	id: true,
	name: true,
	color: true,
	order: true,
	kind: true,
	active: true,
} as const;
export type CrmLeadStatusResponse = Prisma.CrmLeadStatusGetPayload<{
	select: typeof leadStatusSelect;
}>;

const dealStatusSelect = {
	id: true,
	name: true,
	color: true,
	order: true,
	kind: true,
	defaultProbability: true,
	active: true,
} as const;
export type CrmDealStatusResponse = Prisma.CrmDealStatusGetPayload<{
	select: typeof dealStatusSelect;
}>;

const flatMasterSelect = { id: true, name: true, active: true } as const;
export type CrmLeadSourceResponse = Prisma.CrmLeadSourceGetPayload<{
	select: typeof flatMasterSelect;
}>;
export type CrmLostReasonResponse = Prisma.CrmLostReasonGetPayload<{
	select: typeof flatMasterSelect;
}>;
export type CrmIndustryResponse = Prisma.CrmIndustryGetPayload<{
	select: typeof flatMasterSelect;
}>;

export const CRM_SELECTS = {
	leadStatus: leadStatusSelect,
	dealStatus: dealStatusSelect,
	flat: flatMasterSelect,
} as const;
