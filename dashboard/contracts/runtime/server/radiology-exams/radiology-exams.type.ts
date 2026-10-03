import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { RadiologyModality, SedationLevel } from "@/generated/prisma/enums";

// ── كتالوج فحوصات الأشعة: دورات ITEM تحت فئة «الأشعة» + تعريفاتها ───────────
// التعريف يحدّد طريقة التصوير وخصائص الفحص الافتراضية التي تُنسخ عند الطلب.

/** اسم فئة الأشعة الافتراضية في شجرة الدورات — الدورات تحتها وحدها تقبل تعريفات */
export const RADIOLOGY_CATEGORY_NAME = "الأشعة";

/**
 * أسماء فئة الأشعة عبر إصدارات البذرة. المصدر الموثوق هو العمود
 * `Service.isRadiologyCategory`، لكن الفئات التي ينشئها المستخدم لا تحمله —
 * فتبقى المطابقة بالاسم شبكة أمان.
 */
export const RADIOLOGY_CATEGORY_ALIASES = [RADIOLOGY_CATEGORY_NAME, "أشعة"] as const;

/** فئة الأشعة: العلامة المخزَّنة أولًا، ثم الاسم لالتقاط الفئات غير المُعلَّمة */
export const resolveIsRadiologyCategory = (category: {
	isRadiologyCategory: boolean;
	name: string;
}): boolean =>
	category.isRadiologyCategory || RADIOLOGY_CATEGORY_ALIASES.includes(category.name as never);

/** شرط Prisma لفئة الأشعة — يطابق `isRadiologyCategory` أعلاه على مستوى الاستعلام */
export const radiologyCategoryWhere = (): Prisma.ServiceWhereInput => ({
	OR: [{ isRadiologyCategory: true }, { name: { in: [...RADIOLOGY_CATEGORY_ALIASES] } }],
});

const definitionSelect = {
	id: true,
	clinicId: true,
	serviceId: true,
	modality: true,
	bodyPart: true,
	defaultViews: true,
	lateralityRequired: true,
	contrastDefault: true,
	sedationDefault: true,
	prepNotes: true,
	active: true,
} as const;

export type RadiologyExamDefinitionResponse = Prisma.RadiologyExamDefinitionGetPayload<{
	select: typeof definitionSelect;
}>;

export const definitionSelectShape = definitionSelect;

/** قالب فحص = دورة (ITEM) + تعريفها + سعرها/مدتها وتفعيلها من إعداد الأكاديمية */
export type RadiologyExamTemplateResponse = {
	serviceId: string;
	name: string;
	price: number | null;
	duration: number | null;
	/** تفعيل الأكاديمية للدورة — غير المفعّلة لا تُعرض في مُنشئ الطلبات */
	isActive: boolean;
	definition: RadiologyExamDefinitionResponse | null;
	/**
	 * طريقة التصوير الفعّالة: من التعريف إن وُجد، وإلا مستنتَجة من اسم الفحص
	 * ومجموعته — فلا يسقط فحص مقطعية إلى «أشعة سينية» لغياب التعريف.
	 */
	effectiveModality: RadiologyModality;
	/** true حين تكون الطريقة مستنتَجة لا معرَّفة — الواجهة تُلمّح بذلك */
	modalityInferred: boolean;
};

export type UpsertRadiologyDefinitionInput = Pick<
	Prisma.RadiologyExamDefinitionUncheckedCreateInput,
	"clinicId" | "serviceId"
> &
	Partial<
		Pick<
			Prisma.RadiologyExamDefinitionUncheckedCreateInput,
			| "modality"
			| "bodyPart"
			| "defaultViews"
			| "lateralityRequired"
			| "contrastDefault"
			| "sedationDefault"
			| "prepNotes"
			| "active"
		>
	>;

// ── مخططات النماذج ─────────────────────────────────────────────────────────

export const radiologyDefinitionSchema = z.object({
	modality: z.enum(RadiologyModality, { error: "طريقة التصوير مطلوبة" }),
	bodyPart: z.string().nullable().optional(),
	defaultViews: z.array(z.string()).default([]),
	lateralityRequired: z.boolean().default(false),
	contrastDefault: z.boolean().default(false),
	sedationDefault: z.enum(SedationLevel).default(SedationLevel.NONE),
	prepNotes: z.string().nullable().optional(),
	active: z.boolean().default(true),
});

export type RadiologyDefinitionFormInput = z.input<typeof radiologyDefinitionSchema>;
export type RadiologyDefinitionFormValues = z.output<typeof radiologyDefinitionSchema>;
