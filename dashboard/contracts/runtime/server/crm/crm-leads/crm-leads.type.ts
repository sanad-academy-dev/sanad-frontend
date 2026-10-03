import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { CrmTaskPriority, CrmTaskStatus, Gender } from "@/generated/prisma/enums";
import { optionalPhoneSchema, phoneSchema } from "@sanad/contracts/runtime/lib/validation/phone";

/** [CRM-P1] §3.1 + §8.2 — المصادر المشتركة لأنواع العميل المحتمل وأنشطته. */

/**
 * [CRM-P1] `.optional()` must come LAST. With `.optional().transform(...)` the schema is a
 * ZodPipe whose inferred key is REQUIRED-but-undefined (`x: string | undefined`), while the
 * TypeBox body the controller hands the service has an OPTIONAL key (`x?: string`) — so
 * every call site failed TS2345 with «Property is optional in type … but required in type …».
 * Wrapping the transform in `.optional()` keeps the key optional. Runtime behaviour is
 * unchanged: absent stays undefined, "" still collapses to undefined.
 */
const trimmedOptional = (max: number) =>
	z
		.string()
		.trim()
		.max(max, "أطول من المسموح")
		.transform((v) => (v && v.length > 0 ? v : undefined))
		.optional();

export const createLeadSchema = z.object({
	firstName: z
		.string({ error: "الاسم الأول مطلوب" })
		.trim()
		.min(1, "الاسم الأول مطلوب")
		.max(80),
	lastName: trimmedOptional(80),
	gender: z.enum(Gender).optional(),
	/** §3.1 — الجوال هو المفتاح الأساسي للتواصل، ومطلوب. */
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
	statusId: z.string({ error: "الحالة مطلوبة" }).min(1, "الحالة مطلوبة"),
	sourceId: trimmedOptional(40),
	ownerUserId: trimmedOptional(40),
	notes: trimmedOptional(4000),
});
export type CreateLeadFormInput = z.infer<typeof createLeadSchema>;
/**
 * What the FORM holds BEFORE Zod runs (`trimmedOptional` transforms "" → undefined, so the
 * input and output types genuinely differ). `useForm<CreateLeadFormValues, unknown,
 * CreateLeadFormInput>` — the repo's three-generic pattern, see `tax-template-sheet.tsx`.
 *
 * Note the naming reads backwards here versus the tax sheets: `CreateLeadFormInput` was
 * already the PARSED type consumed by the service, so the input side takes the other name
 * rather than renaming a type the server half depends on.
 */
export type CreateLeadFormValues = z.input<typeof createLeadSchema>;

export const updateLeadSchema = createLeadSchema.partial().omit({ statusId: true });
export type UpdateLeadFormInput = z.infer<typeof updateLeadSchema>;

/** §3 — تغيير الحالة مسارٌ واحد: السحب في اللوحة والقائمة المنسدلة في الصفحة كلاهما هنا. */
export const changeLeadStatusSchema = z.object({
	statusId: z.string({ error: "الحالة مطلوبة" }).min(1, "الحالة مطلوبة"),
	lostReasonId: z.string().trim().min(1).optional(),
	lostNotes: trimmedOptional(2000),
});
export type ChangeLeadStatusFormInput = z.infer<typeof changeLeadStatusSchema>;

export const crmNoteSchema = z.object({
	title: trimmedOptional(160),
	content: z.string({ error: "المحتوى مطلوب" }).trim().min(1, "المحتوى مطلوب").max(8000),
});
export type CrmNoteFormInput = z.infer<typeof crmNoteSchema>;

export const crmTaskSchema = z.object({
	title: z
		.string({ error: "عنوان المهمة مطلوب" })
		.trim()
		.min(1, "عنوان المهمة مطلوب")
		.max(200),
	description: trimmedOptional(4000),
	priority: z.enum(CrmTaskPriority).optional(),
	status: z.enum(CrmTaskStatus).optional(),
	dueAt: z.string().datetime({ offset: true }).optional().or(z.string().date().optional()),
	assignedToUserId: trimmedOptional(40),
});
export type CrmTaskFormInput = z.infer<typeof crmTaskSchema>;

/**
 * [CRM-P1] §8.2 — شكل PATCH للمهمة. `null` تعني «امسح الحقل»، و`undefined` تعني «لا تغيّره».
 *
 * This is a DIFFERENT shape from the create schema, not `Partial<CrmTaskFormInput>`: the
 * `crmLeads.taskUpdate` TypeBox model marks the three clearable fields `__nullable__`, and
 * `updateTask` already implements exactly that (`input.description ?? null`, `dueAt ? … :
 * null`). Only the declared parameter type disagreed, which is why the PATCH route failed
 * TS2345 on `null`. Mirrors the TypeBox model, which is what actually validates the request.
 */
export const crmTaskUpdateSchema = z.object({
	title: z.string().trim().min(1, "عنوان المهمة مطلوب").max(200).optional(),
	description: z.string().trim().max(4000).nullish(),
	priority: z.enum(CrmTaskPriority).optional(),
	status: z.enum(CrmTaskStatus).optional(),
	dueAt: z.string().max(40).nullish(),
	assignedToUserId: z.string().trim().max(40).nullish(),
});
export type CrmTaskUpdateFormInput = z.infer<typeof crmTaskUpdateSchema>;

export const crmCommentSchema = z.object({
	content: z.string({ error: "التعليق مطلوب" }).trim().min(1, "التعليق مطلوب").max(8000),
	mentionedUserIds: z.array(z.string().min(1)).max(50).optional(),
});
export type CrmCommentFormInput = z.infer<typeof crmCommentSchema>;

/* ── أشكال الاستجابة ─────────────────────────────────────────────────────────────────── */

export const leadListSelect = {
	id: true,
	code: true,
	fullName: true,
	mobile: true,
	email: true,
	city: true,
	statusId: true,
	sourceId: true,
	ownerUserId: true,
	createdAt: true,
	// [CRM-P5] §10.4 — الشارة تُشتقّ عند الرسم من هذين الحقلين: الاشتقاق على الخادم كان
	// سيحتاج «الآن» في كل صفّ، وقيمةٌ محسوبة تتقادم بين الجلب والعرض
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
export type CrmLeadListResponse = Prisma.CrmLeadGetPayload<{ select: typeof leadListSelect }>;

export const leadDetailSelect = {
	...leadListSelect,
	firstName: true,
	lastName: true,
	gender: true,
	phone: true,
	address: true,
	petSpecies: true,
	petCount: true,
	petNotes: true,
	lostReasonId: true,
	lostNotes: true,
	notes: true,
	// [CRM-P2] §5 — the conversion link; the page turns it into «فتح الصفقة» (BR-C3.5)
	convertedDealId: true,
	convertedAt: true,
	updatedAt: true,
	lostReason: { select: { id: true, name: true } },
} as const;
export type CrmLeadDetailResponse = Prisma.CrmLeadGetPayload<{
	select: typeof leadDetailSelect;
}>;

export const statusLogSelect = {
	id: true,
	fromStatusId: true,
	toStatusId: true,
	durationInPrevious: true,
	byUserId: true,
	at: true,
	byUser: { select: { id: true, name: true } },
} as const;
export type CrmStatusLogResponse = Prisma.CrmStatusChangeLogGetPayload<{
	select: typeof statusLogSelect;
}>;

export const noteSelect = {
	id: true,
	title: true,
	content: true,
	authorUserId: true,
	createdAt: true,
	author: { select: { id: true, name: true } },
} as const;
export type CrmNoteResponse = Prisma.CrmNoteGetPayload<{ select: typeof noteSelect }>;

export const taskSelect = {
	id: true,
	title: true,
	description: true,
	priority: true,
	status: true,
	dueAt: true,
	assignedToUserId: true,
	referenceId: true,
	createdAt: true,
	assignedTo: { select: { id: true, name: true } },
} as const;
export type CrmTaskResponse = Prisma.CrmTaskGetPayload<{ select: typeof taskSelect }>;

export const commentSelect = {
	id: true,
	content: true,
	mentionedUserIds: true,
	authorUserId: true,
	createdAt: true,
	author: { select: { id: true, name: true } },
} as const;
export type CrmCommentResponse = Prisma.CrmCommentGetPayload<{ select: typeof commentSelect }>;
