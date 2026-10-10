import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { OperationTier, SedationLevel, WoundClass } from "@/generated/prisma/enums";

// ── كتالوج الإجراءات الجراحية: دورات ITEM تحت فئة «العمليات الجراحية» ───────
// التعريف يحدّد الدرجة والتخدير والخصائص الافتراضية التي تُنسخ إلى الحالة عند
// إنشائها (نمط كتالوج الأشعة). الخطة: docs/operations-module-plan.md §4.1.

/** اسم فئة العمليات الافتراضية في شجرة الدورات — دوراتها وحدها تقبل تعريفات */
export const OPERATION_CATEGORY_NAME = "العمليات الجراحية";

/**
 * أسماء فئة العمليات عبر إصدارات البذرة. المصدر الموثوق هو العمود
 * `Service.isOperationCategory`، والمطابقة بالاسم شبكة أمان للفئات التي
 * ينشئها المستخدم بلا علامة.
 */
export const OPERATION_CATEGORY_ALIASES = [OPERATION_CATEGORY_NAME, "العمليات"] as const;

/** فئة العمليات: العلامة المخزَّنة أولًا، ثم الاسم لالتقاط الفئات غير المُعلَّمة */
export const resolveIsOperationCategory = (category: {
	isOperationCategory: boolean;
	name: string;
}): boolean =>
	category.isOperationCategory || OPERATION_CATEGORY_ALIASES.includes(category.name as never);

/** شرط Prisma لفئة العمليات — العلامة المخزَّنة أولًا ثم الاسم */
export const operationCategoryWhere = (): Prisma.ServiceWhereInput => ({
	OR: [{ isOperationCategory: true }, { name: { in: [...OPERATION_CATEGORY_ALIASES] } }],
});

// ── تسميات عربية مشتركة (نظير SEDATION_LABELS في الأشعة) ────────────────────

export const WOUND_CLASS_LABELS: Record<WoundClass, string> = {
	[WoundClass.CLEAN]: "نظيف",
	[WoundClass.CLEAN_CONTAMINATED]: "نظيف ملوث",
	[WoundClass.CONTAMINATED]: "ملوث",
	[WoundClass.DIRTY]: "قذر / ملتهب",
};

export const BODY_SYSTEM_OPTIONS = [
	"الجلد والأنسجة الرخوة",
	"الجهاز الهضمي",
	"الجهاز التناسلي والبولي",
	"الجهاز الهيكلي والعظام",
	"الفم والأسنان",
	"العيون",
	"الأذن",
	"الجهاز التنفسي",
	"القلب والأوعية",
	"الجهاز العصبي",
] as const;

const kitItemSelect = {
	id: true,
	inventoryItemId: true,
	quantity: true,
	inventoryItem: { select: { name: true, code: true } },
} as const;

const definitionSelect = {
	id: true,
	clinicId: true,
	serviceId: true,
	defaultTier: true,
	defaultAnesthesia: true,
	defaultWoundClass: true,
	requiresLaterality: true,
	bodySystem: true,
	codes: true,
	specializationId: true,
	prepNotes: true,
	active: true,
	kitItems: { select: kitItemSelect },
} as const;

export type OperationProcedureDefinitionResponse =
	Prisma.OperationProcedureDefinitionGetPayload<{
		select: typeof definitionSelect;
	}>;

export const definitionSelectShape = definitionSelect;

/** قالب إجراء = دورة (ITEM) + تعريفها الجراحي + سعرها/مدتها من إعداد الأكاديمية */
export type OperationProcedureTemplateResponse = {
	serviceId: string;
	name: string;
	subcategoryName: string;
	price: number | null;
	duration: number | null;
	/** تفعيل الأكاديمية للدورة — غير المفعّلة لا تُعرض في مُنشئ الحالات */
	isActive: boolean;
	definition: OperationProcedureDefinitionResponse | null;
	/**
	 * الدرجة الفعّالة: من التعريف إن وُجد، وإلا INTERMEDIATE — لا نستنتج
	 * أبدًا متطلبات أمان أقل من غياب التعريف (الخطة §4.1).
	 */
	effectiveTier: OperationTier;
	/** true حين تكون الدرجة افتراضًا آمنًا لا تعريفًا — الواجهة تُلمّح بذلك */
	tierInferred: boolean;
};

export type UpsertOperationDefinitionInput = Pick<
	Prisma.OperationProcedureDefinitionUncheckedCreateInput,
	"clinicId" | "serviceId"
> &
	Partial<
		Pick<
			Prisma.OperationProcedureDefinitionUncheckedCreateInput,
			| "defaultTier"
			| "defaultAnesthesia"
			| "defaultWoundClass"
			| "requiresLaterality"
			| "bodySystem"
			| "specializationId"
			| "prepNotes"
			| "active"
		>
	> & {
		/** أكواد المصطلحات (S20) — تُخزَّن كما هي في codes Json */
		codes?: { snomed?: string; cpt?: string; icd10pcs?: string; venom?: string } | null;
		/** عدة الإجراء — تستبدل القائمة الحالية بالكامل عند تمريرها */
		kitItems?: { inventoryItemId: string; quantity: number }[];
	};

// ── قوالب قوائم التحقق (قراءة فقط في OP0 — المحرر في OP8) ──────────────────

const checklistTemplateSelect = {
	id: true,
	clinicId: true,
	scope: true,
	tier: true,
	nameAr: true,
	nameEn: true,
	version: true,
	active: true,
	items: {
		select: {
			id: true,
			order: true,
			textAr: true,
			textEn: true,
			required: true,
			responseType: true,
		},
		orderBy: { order: "asc" },
	},
} as const;

export type ChecklistTemplateResponse = Prisma.ChecklistTemplateGetPayload<{
	select: typeof checklistTemplateSelect;
}>;

export const checklistTemplateSelectShape = checklistTemplateSelect;

// ── مخططات النماذج ─────────────────────────────────────────────────────────

export const operationDefinitionSchema = z.object({
	defaultTier: z.enum(OperationTier, { error: "درجة التعقيد مطلوبة" }),
	defaultAnesthesia: z.enum(SedationLevel).default(SedationLevel.GENERAL_ANESTHESIA),
	defaultWoundClass: z.enum(WoundClass).nullable().optional(),
	requiresLaterality: z.boolean().default(false),
	bodySystem: z.string().nullable().optional(),
	codes: z
		.object({
			snomed: z.string().optional(),
			cpt: z.string().optional(),
			icd10pcs: z.string().optional(),
			venom: z.string().optional(),
		})
		.nullable()
		.optional(),
	specializationId: z.string().nullable().optional(),
	prepNotes: z.string().nullable().optional(),
	active: z.boolean().default(true),
	kitItems: z
		.array(
			z.object({
				inventoryItemId: z.string().min(1),
				quantity: z.coerce.number().int("الكمية عدد صحيح").min(1, "الكمية 1 على الأقل"),
			}),
		)
		.optional(),
});

export type OperationDefinitionFormInput = z.input<typeof operationDefinitionSchema>;
export type OperationDefinitionFormValues = z.output<typeof operationDefinitionSchema>;
