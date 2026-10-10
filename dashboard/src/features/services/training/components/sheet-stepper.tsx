import type { ComponentType } from "react";

import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/ui/stepper";

const AR_STEP = ["١", "٢", "٣", "٤", "٥"] as const;

export type SheetStep = {
	step: number;
	title: string;
	icon: ComponentType<{ className?: string }>;
};

// شريط تقدّم خطوات اللوحات الجانبية (الدورة/الاختبار) — مؤشّر الخطوات المشترك بنفس المقاسات.
// الخطوات المزارة قابلة للنقر للرجوع، والقادمة معطّلة.
// ملاحظة: type="button" ضروري لأن المؤشّر يقع داخل <form> اللوحة (وإلا يُرسِل النموذج عند النقر).
export function SheetStepper({
	steps,
	step,
	furthest,
	onStepChange,
}: {
	steps: readonly SheetStep[];
	step: number;
	furthest: number;
	onStepChange: (step: number) => void;
}) {
	return (
		<div className="flex shrink-0 border-b border-[#E5E5E5] px-3 pt-0.5 pb-2">
			<Stepper
				value={step}
				onValueChange={(s) => {
					if (s <= furthest) onStepChange(s);
				}}
				className="flex min-w-0 justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				<StepperNav className="mx-auto flex-nowrap items-center justify-center gap-1">
					{steps.map((meta, idx) => {
						const Icon = meta.icon;
						const disabled = meta.step > furthest;
						return (
							<StepperItem
								key={meta.step}
								step={meta.step}
								disabled={disabled}
								className="relative shrink-0 items-center"
							>
								<StepperTrigger
									type="button"
									disabled={disabled}
									className="flex items-center gap-1.5 rounded-lg px-1 py-0.5"
								>
									<StepperIndicator className="size-6 shrink-0 border-[1.5px] text-[10px] font-bold data-[state=inactive]:border-[#E0E0E8] data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#9B9B9D]">
										<Icon className="size-[13px]" />
									</StepperIndicator>
									{/* التسمية الكاملة للخطوة النشطة دائمًا، ولغيرها على الشاشات العريضة فقط */}
									<StepperTitle className="whitespace-nowrap text-[11px] font-semibold group-data-[state=inactive]/step:text-[#9B9B9D]">
										<span className="text-[#9B9B9D]">{AR_STEP[idx]}.</span>{" "}
										{meta.step === step ? (
											meta.title
										) : (
											<span className="hidden md:inline">{meta.title}</span>
										)}
									</StepperTitle>
								</StepperTrigger>
								{idx < steps.length - 1 && (
									<StepperSeparator className="mx-0.5 h-[2px] w-4 shrink-0 self-center rounded-full bg-[#E7E7EE] group-data-[state=completed]/step:bg-primary" />
								)}
							</StepperItem>
						);
					})}
				</StepperNav>
			</Stepper>
		</div>
	);
}
