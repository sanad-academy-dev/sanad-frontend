import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ConsentLocale, ConsentStatus, SignatureMethod } from "@/generated/prisma/enums";

// ── الموافقات على مستوى الطفل — الأنواع المشتركة بين الخادم والواجهة ───────
// الخطة الحاكمة: docs/patient-consents-plan.md

// ── أشكال الاستعلام والأنواع المشتقة ───────────────────────────────────────

const consentListSelect = {
	id: true,
	type: true,
	status: true,
	locale: true,
	templateKey: true,
	templateVersion: true,
	operationCaseId: true,
	appointmentId: true,
	signerName: true,
	signedAt: true,
	revokedAt: true,
	revokeReason: true,
	extractedByAi: true,
	createdAt: true,
	patient: { select: { id: true, code: true, name: true } },
	owner: { select: { id: true, name: true, phone: true } },
} as const;

export type PatientConsentListResponse = Prisma.PatientConsentGetPayload<{
	select: typeof consentListSelect;
}>;

export const patientConsentListSelect = consentListSelect;

const consentDetailSelect = {
	...consentListSelect,
	fieldValues: true,
	textSnapshot: true,
	signerRelationship: true,
	signatureMethod: true,
	signatureUrl: true,
	sourceScanUrl: true,
	updatedAt: true,
	witnessStaff: { select: { id: true, name: true } },
	signedByStaff: { select: { id: true, name: true } },
	template: {
		select: {
			id: true,
			key: true,
			version: true,
			titleAr: true,
			titleEn: true,
			defaultLocale: true,
			speciesKey: true,
			blocks: true,
		},
	},
} as const;

export type PatientConsentDetailResponse = Prisma.PatientConsentGetPayload<{
	select: typeof consentDetailSelect;
}>;

export const patientConsentDetailSelect = consentDetailSelect;

const templateListSelect = {
	id: true,
	key: true,
	version: true,
	type: true,
	titleAr: true,
	titleEn: true,
	defaultLocale: true,
	speciesKey: true,
	active: true,
	isDefault: true,
} as const;

export type ConsentTemplateListResponse = Prisma.ConsentTemplateGetPayload<{
	select: typeof templateListSelect;
}>;

export const consentTemplateListSelect = templateListSelect;

// ── مخططات النماذج (Zod) ───────────────────────────────────────────────────

/** قيم الحقول — مفتاح الحقل إلى قيمته: نص، أو مصفوفة في قوائم التحقق */
export const consentFieldValuesSchema = z.record(
	z.string(),
	z.union([z.string(), z.array(z.string()), z.boolean(), z.null()]),
);
export type ConsentFieldValues = z.infer<typeof consentFieldValuesSchema>;

export const signConsentSchema = z
	.object({
		signerName: z.string({ error: "اسم الموقِّع مطلوب" }).min(1, "اسم الموقِّع مطلوب"),
		signerRelationship: z.string().nullable().optional(),
		signatureMethod: z.enum(SignatureMethod, { error: "طريقة التوقيع مطلوبة" }),
		signatureUrl: z.string().nullable().optional(),
		witnessStaffId: z.string().nullable().optional(),
	})
	// لكل طريقة شرطها — الرسم/الرفع يتطلب صورة، والشفهية تتطلب شاهدًا
	.refine(
		(v) =>
			v.signatureMethod === SignatureMethod.TYPED ||
			v.signatureMethod === SignatureMethod.VERBAL_WITNESSED ||
			!!v.signatureUrl,
		{ error: "التوقيع المرسوم أو المرفوع يتطلب صورة", path: ["signatureUrl"] },
	)
	.refine(
		(v) => v.signatureMethod !== SignatureMethod.VERBAL_WITNESSED || !!v.witnessStaffId,
		{ error: "الموافقة الشفهية تتطلب شاهدًا", path: ["witnessStaffId"] },
	);
export type SignConsentFormInput = z.infer<typeof signConsentSchema>;

// ── تسميات العرض ───────────────────────────────────────────────────────────

export const CONSENT_STATUS_LABELS: Record<ConsentStatus, string> = {
	[ConsentStatus.DRAFT]: "مسودة",
	[ConsentStatus.AWAITING_SIGNATURE]: "بانتظار التوقيع",
	[ConsentStatus.SIGNED]: "موقَّعة",
	[ConsentStatus.REVOKED]: "مُبطلة",
};

export const CONSENT_LOCALE_LABELS: Record<ConsentLocale, string> = {
	[ConsentLocale.AR]: "عربي",
	[ConsentLocale.EN]: "إنجليزي",
	[ConsentLocale.BOTH]: "عربي وإنجليزي",
};

/** الموافقة الموقَّعة سجل قانوني — لا تُحرَّر ولا تُحذف، وتصحيحها بموافقة جديدة */
export const isConsentEditable = (status: ConsentStatus): boolean =>
	status === ConsentStatus.DRAFT || status === ConsentStatus.AWAITING_SIGNATURE;

// ── أنواع مدخلات الـ DAO (مشتقة من Prisma) ─────────────────────────────────

export type CreatePatientConsentInput = Pick<
	Prisma.PatientConsentUncheckedCreateInput,
	"clinicId" | "patientId" | "ownerId" | "templateKey" | "templateVersion" | "type" | "locale"
> &
	Partial<
		Pick<
			Prisma.PatientConsentUncheckedCreateInput,
			| "templateId"
			| "operationCaseId"
			| "appointmentId"
			// [IP1] إقرار التنويم يُربط بالإقامة — البوابة G3 تقرأ هذا الحقل
			| "inpatientStayId"
			| "fieldValues"
			| "textSnapshot"
		>
	>;
