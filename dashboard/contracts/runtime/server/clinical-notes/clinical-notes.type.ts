import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import {
	ClinicalNoteStatus,
	DiagnosisKind,
	DiagnosisSeverity,
	ExamCondition,
} from "@/generated/prisma/enums";

export { ClinicalNoteStatus, DiagnosisKind, DiagnosisSeverity, ExamCondition };

// ── وصف الكتلة ────────────────────────────────────────────────────────────────
// كتلة واحدة تُغذّي ثلاثة مخرجات من تعريف واحد — تمامًا كما يفعل `ConsentBlock`:
// حقلَ الإدخال في شاشة الزيارة، ومفتاحَ الإجابة في `answers`، والسطرَ المُصيَّر في
// النصّ الذي يُجمَّد عند التوثيق.
//
// الفرق عن `ConsentBlock`: كل كتلة هنا تحمل قسمها S|O|A|P. هذا الحقل وحده هو ما
// يجعل هذا قالب SOAP لا بانيَ نماذج عامًّا.
//
// ولماذا Zod مصدرًا وحيدًا للحقيقة هنا بينما ConsentBlock نوعٌ مكتوب يدويًا:
// قوالب الموافقات تُكتب في المستودع ويراجعها إنسان، أمّا هذه فتُحرَّر من الإعدادات
// في [S3]. مُدخَلٌ من مستخدم يحتاج تحقّقًا في وقت التشغيل، لا نوعًا يختفي عند
// الترجمة. ولذلك يبقى TypeBox عند حدّ HTTP فضفاضًا، والتحقّق الحقيقي يجري بهذه
// المخطّطات — مصدرٌ واحد للحقيقة لا اثنان يفترقان بصمت.

export const SOAP_SECTIONS = ["S", "O", "A", "P"] as const;
export type SoapSection = (typeof SOAP_SECTIONS)[number];

/** عناوين الأقسام كما تُطبع في النصّ المُصيَّر */
export const SOAP_SECTION_LABEL_AR: Record<SoapSection, string> = {
	S: "الشكوى والتاريخ",
	O: "الفحص الموضوعي",
	A: "التقييم",
	P: "الخطة",
};

export type BlockOption = { value: string; labelAr: string; labelEn?: string };
export type ChecklistItem = {
	key: string;
	labelAr: string;
	labelEn?: string;
	required?: boolean;
};
export type BodySystem = { key: string; labelAr: string; labelEn?: string };

type ExamBlockBase = {
	/**
	 * ثابت مدى حياة القالب — وهو مفتاح `answers`. تغييره ييتّم كل إجابة مخزّنة،
	 * ولذلك يُحرَّر القالب بإصدار جديد ولا تُعدَّل المعرّفات في مكانها ([S3]).
	 */
	id: string;
	section: SoapSection;
	labelAr: string;
	labelEn?: string;
	required?: boolean;
};

export type ExamBlock = ExamBlockBase &
	(
		| { kind: "prose"; placeholderAr?: string }
		| { kind: "select"; options: BlockOption[] }
		| { kind: "multiselect"; options: BlockOption[] }
		| { kind: "scale"; min: number; max: number; labelsAr?: string[] }
		| { kind: "bodySystems"; systems: BodySystem[] }
		| { kind: "checklist"; items: ChecklistItem[] }
		| { kind: "vitalsRef" }
	);

export type ExamBlockKind = ExamBlock["kind"];

export const EXAM_BLOCK_KINDS = [
	"prose",
	"select",
	"multiselect",
	"scale",
	"bodySystems",
	"checklist",
	"vitalsRef",
] as const;

// ── التحقّق من الكتل ──────────────────────────────────────────────────────────
// مُتحقِّق مكتوب بخطّ اليد، لا `z.discriminatedUnion`.
//
// وهذا قياسٌ لا ذوق: اتّحاد Zod من سبعة أفرع، كلٌّ منها ينشر `...blockBase`، كلّف
// برنامجَ العميل نحو **٩٤٠ ألف رمز و٣.١ مليون تنسيخ** — وهو ما دفع الفحص البارد
// فوق سقف 9216 ميغابايت في CI (خروج 134 بعد ٣٨ دقيقة). الاستنتاج من اتّحاد مُميَّز
// بهذا الحجم يُقيَّم عند كل مُستورِد، وسلسلة Treaty تجعل المستورِد هو التطبيق كلّه.
//
// و`ConsentBlock` — أقرب شيء قائم في المستودع — مكتوب هكذا تمامًا: اتّحاد TS بخطّ
// اليد بلا Zod. فهذا اتّباعٌ لسابقة لا انحراف عنها. وما يُفقَد (رسائل Zod) يُستعاد
// هنا حرفيًّا: الدالّة تُعيد رسالة عربية واحدة تسمّي الكتلة المعطوبة.
//
// أمّا مخطّطات Zod الباقية في هذا الملفّ فتبقى: كلّها كائنات مسطّحة رخيصة الاستنتاج.

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
	typeof value === "string" && value.trim().length > 0;

const optionsValid = (value: unknown): boolean =>
	Array.isArray(value) &&
	value.length > 0 &&
	value.every(
		(option) =>
			isRecord(option) && isNonEmptyString(option.value) && isNonEmptyString(option.labelAr),
	);

const keyedListValid = (value: unknown): boolean =>
	Array.isArray(value) &&
	value.length > 0 &&
	value.every(
		(item) => isRecord(item) && isNonEmptyString(item.key) && isNonEmptyString(item.labelAr),
	);

/** رسالة الخطأ العربية، أو `null` إن كانت الكتلة سليمة */
function validateBlock(block: unknown, index: number): string | null {
	const at = `الكتلة رقم ${index + 1}`;
	if (!isRecord(block)) return `${at}: صيغة غير صالحة`;
	if (!isNonEmptyString(block.id)) return `${at}: معرّف الكتلة مطلوب`;
	if (!isNonEmptyString(block.labelAr)) return `${at}: عنوان الكتلة مطلوب`;
	if (!SOAP_SECTIONS.includes(block.section as SoapSection)) {
		return `${at}: قسم الكتلة يجب أن يكون S أو O أو A أو P`;
	}
	if (!EXAM_BLOCK_KINDS.includes(block.kind as ExamBlockKind)) {
		return `${at}: نوع الكتلة غير معروف`;
	}

	switch (block.kind as ExamBlockKind) {
		case "select":
		case "multiselect":
			return optionsValid(block.options)
				? null
				: `${at}: الاختيار يحتاج خيارًا واحدًا على الأقل، ولكلّ خيار قيمة واسم`;
		case "checklist":
			return keyedListValid(block.items)
				? null
				: `${at}: القائمة تحتاج بندًا واحدًا على الأقل، ولكلّ بند مفتاح واسم`;
		case "bodySystems":
			return keyedListValid(block.systems)
				? null
				: `${at}: فحص الأجهزة يحتاج جهازًا واحدًا على الأقل، ولكلّ جهاز مفتاح واسم`;
		case "scale": {
			const { min, max } = block;
			if (typeof min !== "number" || typeof max !== "number" || !Number.isInteger(min)) {
				return `${at}: حدّا المقياس عددان صحيحان`;
			}
			return min < max ? null : `${at}: الحدّ الأدنى يجب أن يقلّ عن الحدّ الأعلى`;
		}
		default:
			return null;
	}
}

export type ParsedBlocks = { ok: true; blocks: ExamBlock[] } | { ok: false; error: string };

/** يتحقّق من الكتل ويُعيدها مصنّفة، أو رسالة عربية واحدة تسمّي أوّل عطب */
export function parseExamBlocks(input: unknown): ParsedBlocks {
	if (!Array.isArray(input) || input.length === 0) {
		return { ok: false, error: "القالب يحتاج كتلة واحدة على الأقل" };
	}

	for (const [index, block] of input.entries()) {
		const error = validateBlock(block, index);
		if (error) return { ok: false, error };
	}

	const ids = input.map((block) => (block as { id: string }).id);
	if (new Set(ids).size !== ids.length) {
		return { ok: false, error: "معرّفات الكتل مكرّرة — لكل كتلة معرّف فريد" };
	}

	return { ok: true, blocks: input as ExamBlock[] };
}

// ── الإجابات ──────────────────────────────────────────────────────────────────
// `{ [blockId]: value }`. شكل القيمة يتبع نوع الكتلة:
//   prose/select → نصّ · multiselect → نصوص · scale → رقم
//   bodySystems  → { [systemKey]: ExamCondition } · checklist → { [itemKey]: boolean }
//   vitalsRef    → لا يُخزَّن هنا إطلاقًا: القياس يُشار إليه بـ vitalsRecordId،
//                  ووحدة العلامات الحيوية تبقى كاتبه الوحيد.

export const noteAnswerValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.string()),
	z.record(z.string(), z.union([z.string(), z.boolean()])),
	z.null(),
]);

export const noteAnswersSchema = z.record(z.string(), noteAnswerValueSchema);
export type NoteAnswerValue = z.infer<typeof noteAnswerValueSchema>;
export type NoteAnswers = z.infer<typeof noteAnswersSchema>;

// ── مخطّطات النماذج ───────────────────────────────────────────────────────────

export const noteDiagnosisSchema = z.object({
	text: z.string({ error: "نصّ التشخيص مطلوب" }).min(1, "نصّ التشخيص مطلوب"),
	kind: z.enum(DiagnosisKind, { error: "نوع التشخيص مطلوب" }),
	severity: z.enum(DiagnosisSeverity).nullish(),
	/** يبقى فارغًا حتى يصل كتالوج الترميز — الحقل موجود ليُملأ لا ليُهاجَر إليه لاحقًا */
	code: z.string().nullish(),
	codeSystem: z.string().nullish(),
});

export const createClinicalNoteSchema = z.object({
	patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
	appointmentId: z.string().nullish(),
	templateId: z.string().nullish(),
	vitalsRecordId: z.string().nullish(),
	answers: noteAnswersSchema.optional(),
	diagnoses: z.array(noteDiagnosisSchema).optional(),
});

export const updateClinicalNoteSchema = z.object({
	answers: noteAnswersSchema.optional(),
	vitalsRecordId: z.string().nullish(),
	diagnoses: z.array(noteDiagnosisSchema).optional(),
});

export const addendumSchema = z.object({
	text: z.string({ error: "نصّ التصحيح مطلوب" }).min(1, "نصّ التصحيح مطلوب"),
});

export const upsertExamTemplateSchema = z.object({
	key: z
		.string({ error: "مفتاح القالب مطلوب" })
		.min(1, "مفتاح القالب مطلوب")
		.regex(/^[A-Z0-9_]+$/, "المفتاح بحروف إنجليزية كبيرة وأرقام وشرطة سفلية فقط"),
	titleAr: z.string({ error: "عنوان القالب مطلوب" }).min(1, "عنوان القالب مطلوب"),
	titleEn: z.string().nullish(),
	presentingComplaint: z.string().nullish(),
	animalTypeId: z.string().nullish(),
	// تُتحقَّق بـ`parseExamBlocks` في المتحكّم — راجع التعليق أعلاه
	blocks: z.array(z.unknown()),
	isDefault: z.boolean().optional(),
	active: z.boolean().optional(),
});

export type CreateClinicalNoteFormInput = z.infer<typeof createClinicalNoteSchema>;
export type UpdateClinicalNoteFormInput = z.infer<typeof updateClinicalNoteSchema>;
export type AddendumFormInput = z.infer<typeof addendumSchema>;
export type UpsertExamTemplateFormInput = z.infer<typeof upsertExamTemplateSchema>;
export type NoteDiagnosisFormInput = z.infer<typeof noteDiagnosisSchema>;

// ── أشكال الاستجابة ───────────────────────────────────────────────────────────

export const examTemplateSelect = {
	id: true,
	clinicId: true,
	key: true,
	version: true,
	titleAr: true,
	titleEn: true,
	presentingComplaint: true,
	animalTypeId: true,
	blocks: true,
	isDefault: true,
	active: true,
	createdAt: true,
	updatedAt: true,
	/**
	 * [S3] عدد الملاحظات المثبَّتة على هذا القالب. المحرّر يقرؤه ليُنذر قبل الحفظ:
	 * قالبٌ استُعمل لا يُعدَّل في مكانه بل يُصدَر من جديد، لأن معرّفات كتله هي
	 * مفاتيح `answers` المخزّنة. الخادم يفرض القاعدة؛ هذا الرقم يجعلها مرئية.
	 */
	_count: { select: { notes: true } },
} as const;

export type ExamTemplateResponse = Prisma.ExamTemplateGetPayload<{
	select: typeof examTemplateSelect;
}>;

export const clinicalNoteSelect = {
	id: true,
	clinicId: true,
	patientId: true,
	appointmentId: true,
	templateId: true,
	templateKey: true,
	templateVersion: true,
	authorUserId: true,
	status: true,
	subjective: true,
	objective: true,
	assessment: true,
	plan: true,
	answers: true,
	vitalsRecordId: true,
	finalizedAt: true,
	finalizedById: true,
	createdAt: true,
	updatedAt: true,
	author: { select: { id: true, name: true } },
	finalizedBy: { select: { id: true, name: true } },
	/**
	 * كتل القالب الذي **ثُبِّتت عليه** الملاحظة، لا القالب النشط الآن. الفرق ليس
	 * نظريًّا: ملاحظةٌ على الإصدار الأوّل بينما صدر ثانٍ كانت ستُعرض بكتل الإصدار
	 * الثاني — أو بلا كتل أصلًا لو عُطِّل الأوّل — فتُقرأ إجاباتها في نموذج لم تُكتب فيه.
	 */
	template: { select: { id: true, key: true, version: true, blocks: true } },
	diagnoses: {
		select: {
			id: true,
			idx: true,
			text: true,
			code: true,
			codeSystem: true,
			kind: true,
			severity: true,
		},
	},
	addenda: {
		select: {
			id: true,
			text: true,
			authoredById: true,
			createdAt: true,
			authoredBy: { select: { id: true, name: true } },
		},
	},
} as const;

export type ClinicalNoteResponse = Prisma.ClinicalNoteGetPayload<{
	select: typeof clinicalNoteSelect;
}>;
