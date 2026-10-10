import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ChecklistResponseType, SopDomain } from "@/generated/prisma/enums";
import { labCategoryWhere } from "@sanad/contracts/runtime/server/lab-test-parameters/lab-test-parameters.type";
import { operationCategoryWhere } from "@sanad/contracts/runtime/server/operation-procedures/operation-procedures.type";
import { radiologyCategoryWhere } from "@sanad/contracts/runtime/server/radiology-exams/radiology-exams.type";

// ── بروتوكولات العمل القياسية (SOP) ────────────────────────────────────────
// قالب واحد يخدم الوحدات الثلاث. القالب معلّق على عقدة في شجرة الدورات، وأي
// عنصر بلا قالب خاص يرث قالب أقرب أب له (مجموعة ثم فئة).

/** شرط فئة الدورات لكل وحدة — يعيد استخدام مُحدِّدات الوحدات القائمة بلا تكرار */
export const sopDomainCategoryWhere = (domain: SopDomain): Prisma.ServiceWhereInput => {
	switch (domain) {
		case SopDomain.LAB:
			return labCategoryWhere();
		case SopDomain.RADIOLOGY:
			return radiologyCategoryWhere();
		case SopDomain.OPERATION:
			return operationCategoryWhere();
	}
};

/** تسميات الوحدات — تُستعمل في عناوين الشاشات ورسائل الخطأ */
export const SOP_DOMAIN_LABELS: Record<SopDomain, string> = {
	[SopDomain.LAB]: "التحاليل",
	[SopDomain.RADIOLOGY]: "الأشعة",
	[SopDomain.OPERATION]: "العمليات الجراحية",
};

// ── القوالب ────────────────────────────────────────────────────────────────

const sopTemplateSelect = {
	id: true,
	clinicId: true,
	domain: true,
	serviceId: true,
	titleAr: true,
	titleEn: true,
	reference: true,
	version: true,
	active: true,
	updatedAt: true,
	service: { select: { id: true, name: true, level: true, parentId: true } },
	sections: {
		select: {
			id: true,
			order: true,
			titleAr: true,
			titleEn: true,
			steps: {
				select: {
					id: true,
					order: true,
					textAr: true,
					textEn: true,
					ownerRole: true,
					duration: true,
					critical: true,
					required: true,
					note: true,
					responseType: true,
				},
				orderBy: { order: "asc" },
			},
		},
		orderBy: { order: "asc" },
	},
} as const;

export type SopTemplateResponse = Prisma.SopTemplateGetPayload<{
	select: typeof sopTemplateSelect;
}>;

export const sopTemplateSelectShape = sopTemplateSelect;

export type SopSectionResponse = SopTemplateResponse["sections"][number];
export type SopStepResponse = SopSectionResponse["steps"][number];

/**
 * القالب الفعّال لدورة، مع بيان مصدره: القالب الموروث يُعرض للقراءة ويُنسخ
 * عند أول تعديل، فلا يظن المستخدم أنه يحرّر قالب العنصر وهو يحرّر قالب الفئة.
 */
export type ResolvedSopResponse = {
	template: SopTemplateResponse | null;
	/** مصدر القالب: الدورة نفسها أم أب في الشجرة أم لا قالب */
	origin: "SERVICE" | "INHERITED" | "NONE";
	/** اسم العقدة التي جاء منها القالب — يُعرض في شارة «موروث من …» */
	inheritedFromName: string | null;
	/** قالب أكاديمية يعلو قالب النظام — تُعرض شارة «مخصّص» */
	isClinicOverride: boolean;
};

/** صف في مكتبة البروتوكولات — دورة + قالبها الفعّال مختصرًا */
export type SopLibraryRowResponse = {
	serviceId: string;
	serviceName: string;
	categoryName: string;
	domain: SopDomain;
	templateId: string | null;
	title: string | null;
	version: number | null;
	stepCount: number;
	criticalCount: number;
	origin: ResolvedSopResponse["origin"];
	inheritedFromName: string | null;
	isClinicOverride: boolean;
};

// ── التشغيلات ──────────────────────────────────────────────────────────────

const sopRunSelect = {
	id: true,
	templateId: true,
	templateVersion: true,
	domain: true,
	labItemId: true,
	radiologyItemId: true,
	operationCaseId: true,
	completedAt: true,
	createdAt: true,
	steps: {
		select: {
			id: true,
			order: true,
			sectionTitle: true,
			textSnapshot: true,
			ownerRole: true,
			duration: true,
			critical: true,
			required: true,
			responseType: true,
			response: true,
			valueText: true,
			valueNumber: true,
			respondedAt: true,
			respondedBy: { select: { id: true, name: true } },
		},
		orderBy: { order: "asc" },
	},
} as const;

export type SopRunResponse = Prisma.SopRunGetPayload<{ select: typeof sopRunSelect }>;

export const sopRunSelectShape = sopRunSelect;

export type SopRunStepResponse = SopRunResponse["steps"][number];

/** هدف التشغيل — عمود واحد فقط يُملأ، ويضمن @unique تشغيلًا واحدًا لكل هدف */
export type SopRunTarget =
	| { labItemId: string }
	| { radiologyItemId: string }
	| { operationCaseId: string };

// ── مخططات النماذج ─────────────────────────────────────────────────────────

export const sopStepSchema = z.object({
	textAr: z.string({ error: "نص الخطوة مطلوب" }).min(1, "نص الخطوة مطلوب"),
	textEn: z.string().nullable().optional(),
	ownerRole: z.string().nullable().optional(),
	duration: z.string().nullable().optional(),
	critical: z.boolean().default(false),
	required: z.boolean().default(true),
	note: z.string().nullable().optional(),
	responseType: z.enum(ChecklistResponseType).default(ChecklistResponseType.CONFIRM),
});

export const sopSectionSchema = z.object({
	titleAr: z.string({ error: "عنوان المرحلة مطلوب" }).min(1, "عنوان المرحلة مطلوب"),
	titleEn: z.string().nullable().optional(),
	steps: z.array(sopStepSchema).min(1, "المرحلة تحتاج خطوة واحدة على الأقل"),
});

export const sopTemplateSchema = z.object({
	domain: z.enum(SopDomain, { error: "الوحدة مطلوبة" }),
	serviceId: z.string({ error: "الدورة مطلوبة" }).min(1, "الدورة مطلوبة"),
	titleAr: z.string({ error: "عنوان البروتوكول مطلوب" }).min(1, "عنوان البروتوكول مطلوب"),
	titleEn: z.string().nullable().optional(),
	reference: z.string().nullable().optional(),
	sections: z.array(sopSectionSchema).min(1, "البروتوكول يحتاج مرحلة واحدة على الأقل"),
});

export type SopStepFormInput = z.input<typeof sopStepSchema>;
export type SopSectionFormInput = z.input<typeof sopSectionSchema>;
export type SopTemplateFormInput = z.input<typeof sopTemplateSchema>;
export type SopTemplateFormValues = z.output<typeof sopTemplateSchema>;

/** مدخل حفظ القالب في الـ DAO — مشتق من مخطط النموذج، لا يُكتب يدويًا */
export type SaveSopTemplateInput = SopTemplateFormValues & { clinicId: string };
