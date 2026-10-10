import {
	IconClipboardCheck,
	IconLayoutGrid,
	IconRosetteDiscountCheck,
	IconUsers,
	type TablerIcon,
} from "@tabler/icons-react";
import { z } from "zod";

// خطوات معالج إنشاء الدورة — الخطوة 3 لها خطوتان فرعيتان (نقطتان في المؤشّر)
export const WIZARD_STEPS = [1, 2, 3, 4] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];

// الخطوة الفرعية للخطوة 3 (تعيين المتدربين)
export const WIZARD_SUBSTEPS = ["learners", "time"] as const;
export type WizardSubStep = (typeof WIZARD_SUBSTEPS)[number];

// حالة الملاحة تعيش في بارامترات URL (deep-link + زر رجوع المتصفح)
export const wizardSearchSchema = z.object({
	step: z.coerce.number().int().min(1).max(4).optional(),
	sub: z.enum(WIZARD_SUBSTEPS).optional(),
});
export type WizardSearch = z.infer<typeof wizardSearchSchema>;

export type StepMeta = {
	step: WizardStep;
	title: string;
	icon: TablerIcon;
	subSteps?: readonly { key: WizardSubStep; title: string }[];
};

export const STEP_META: readonly StepMeta[] = [
	{ step: 1, title: "المعلومات الأساسية", icon: IconLayoutGrid },
	{ step: 2, title: "إضافة المحتوى", icon: IconClipboardCheck },
	{
		step: 3,
		title: "تعيين المتدربين",
		icon: IconUsers,
		subSteps: [
			{ key: "learners", title: "اختيار المتدربين" },
			{ key: "time", title: "وقت التعيين" },
		],
	},
	{ step: 4, title: "الإكمال", icon: IconRosetteDiscountCheck },
] as const;

// عنوان الخطوة التالية لعرض «التالي: ...» في شريط العلوي
export function nextStepHint(step: WizardStep, sub: WizardSubStep): string | null {
	if (step === 3 && sub === "learners") return "وقت التعيين";
	if (step >= 4) return null;
	return STEP_META[step]?.title ?? null; // STEP_META[step] هو عنصر الخطوة step+1 (0-based)
}
