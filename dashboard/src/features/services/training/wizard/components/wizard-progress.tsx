import { WIZARD_STEPS, type WizardStep } from "../wizard.types";

// خط تقدّم رفيع أسفل الشريط: قطعة لكل خطوة، تمتلئ عند إكمالها وتتحرّك عند الانتقال.
// القطعة الحالية تمتلئ جزئيًّا (نصفها) لإظهار أنها قيد التنفيذ.
export function WizardProgress({ current }: { current: WizardStep }) {
	return (
		<div className="flex h-[3px] w-full gap-1 px-3">
			{WIZARD_STEPS.map((step) => {
				const fill = step < current ? "100%" : step === current ? "45%" : "0%";
				return (
					<div
						key={step}
						className="h-full flex-1 overflow-hidden rounded-full bg-[#E7E7EE]"
					>
						<div
							className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
							style={{ width: fill }}
						/>
					</div>
				);
			})}
		</div>
	);
}
