import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { LabParameterType } from "@/generated/prisma/enums";

// ── قالب التحليل: مُحلِّلات (بنود) التحليل المركّب ──────────────────────────
// مثال: CBC يتكوّن من WBCs و RBCs و Platelets، لكلٍّ وحدة ونطاق طبيعي.

/** اسم فئة التحاليل الافتراضية في شجرة الدورات — الدورات تحتها وحدها تقبل مُحلِّلات */
export const LAB_CATEGORY_NAME = "التحاليل";

/**
 * أسماء فئة التحاليل عبر إصدارات البذرة. المصدر الموثوق هو العمود
 * `Service.isLabCategory`، لكن الفئات التي ينشئها المستخدم لا تحمله، ولا تصل
 * تغييرات البذرة إلى قاعدة مأهولة — فتبقى المطابقة بالاسم شبكة أمان.
 */
export const LAB_CATEGORY_ALIASES = [LAB_CATEGORY_NAME, "تحاليل"] as const;

/** فئة التحاليل: العلامة المخزَّنة أولًا، ثم الاسم لالتقاط الفئات غير المُعلَّمة */
export const resolveIsLabCategory = (category: {
	isLabCategory: boolean;
	name: string;
}): boolean => category.isLabCategory || LAB_CATEGORY_ALIASES.includes(category.name as never);

/** شرط Prisma لفئة التحاليل — يطابق `isLabCategory` أعلاه على مستوى الاستعلام */
export const labCategoryWhere = (): Prisma.ServiceWhereInput => ({
	OR: [{ isLabCategory: true }, { name: { in: [...LAB_CATEGORY_ALIASES] } }],
});

const parameterSelect = {
	id: true,
	clinicId: true,
	serviceId: true,
	section: true,
	name: true,
	unit: true,
	type: true,
	refLow: true,
	refHigh: true,
	order: true,
	active: true,
	editsCount: true,
} as const;

export type LabTestParameterResponse = Prisma.LabTestParameterGetPayload<{
	select: typeof parameterSelect;
}>;

export const parameterSelectShape = parameterSelect;

/** قالب تحليل = دورة (ITEM) + مُحلِّلاتها + سعرها/مدتها وتفعيلها من إعداد الأكاديمية */
export type LabTestTemplateResponse = {
	serviceId: string;
	name: string;
	price: number | null;
	duration: number | null;
	/** تفعيل الأكاديمية للدورة — غير المفعّلة لا تُعرض في مُنشئ الطلبات */
	isActive: boolean;
	parameters: LabTestParameterResponse[];
};

export type CreateLabParameterInput = Pick<
	Prisma.LabTestParameterUncheckedCreateInput,
	"clinicId" | "serviceId" | "name"
> &
	Partial<
		Pick<
			Prisma.LabTestParameterUncheckedCreateInput,
			"section" | "unit" | "type" | "refLow" | "refHigh" | "order" | "active"
		>
	>;

// ── مخططات النماذج ─────────────────────────────────────────────────────────

export const labParameterSchema = z
	.object({
		name: z.string({ error: "اسم المُحلِّل مطلوب" }).min(1, "اسم المُحلِّل مطلوب"),
		// قسم اختياري لتجميع المُحلِّلات في واجهة إدخال النتائج
		section: z.string().nullable().optional(),
		unit: z.string().nullable().optional(),
		type: z.enum(LabParameterType).default(LabParameterType.NUMERIC),
		refLow: z.coerce.number().nullable().optional(),
		refHigh: z.coerce.number().nullable().optional(),
		order: z.coerce.number().int().default(0),
		active: z.boolean().default(true),
	})
	// النطاق الطبيعي: الحد الأدنى يجب أن يكون أقل من الأعلى عند تحديد الاثنين
	.refine(
		(data) => data.refLow == null || data.refHigh == null || data.refLow < data.refHigh,
		{ path: ["refHigh"], message: "الحد الأعلى يجب أن يكون أكبر من الحد الأدنى" },
	);

export type LabParameterFormInput = z.input<typeof labParameterSchema>;
export type LabParameterFormValues = z.output<typeof labParameterSchema>;
