import { SheetStepper } from "@/features/services/training/components/sheet-stepper";
import { STEP_META } from "@/features/services/training/wizard/wizard.types";

// شريط تقدّم خطوات إنشاء الدورة داخل اللوحة الجانبية — غلاف رفيع حول المؤشّر المشترك
// الذي تستخدمه أيضًا لوحة إنشاء الاختبار.
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
			steps={STEP_META}
			step={step}
			furthest={furthest}
			onStepChange={onStepChange}
		/>
	);
}
