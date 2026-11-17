import {
	IconClipboardCheck,
	IconLayoutGrid,
	IconRosetteDiscountCheck,
} from "@tabler/icons-react";
import {
	type SheetStep,
	SheetStepper,
} from "@/features/services/training/components/sheet-stepper";

export const COURSE_STEPS: readonly SheetStep[] = [
	{ step: 1, title: "المعلومات الأساسية", icon: IconLayoutGrid },
	{ step: 2, title: "إضافة المحتوى", icon: IconClipboardCheck },
	{ step: 3, title: "الإكمال والنشر", icon: IconRosetteDiscountCheck },
] as const;

// شريط تقدّم خطوات إنشاء الدورة داخل اللوحة — 3 خطوات بعد دمج تعيين الموظفين في الخطوة الأولى
export function CourseSheetStepper({
	step,
	furthest,
	onStepChange,
}: {
	step: number;
	furthest: number;
	onStepChange: (step: number) => void;
}) {
	return (
		<SheetStepper
			steps={COURSE_STEPS}
			step={step}
			furthest={furthest}
			onStepChange={onStepChange}
		/>
	);
}
