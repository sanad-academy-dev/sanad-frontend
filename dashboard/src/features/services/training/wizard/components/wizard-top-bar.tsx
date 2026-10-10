import { IconChevronLeft, IconLayoutSidebarRightCollapse, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/ui/stepper";
import { cn } from "@/lib/utils";
import { STEP_META, type WizardStep, type WizardSubStep } from "../wizard.types";

const AR_STEP = ["١", "٢", "٣", "٤"] as const;

// نقطتان للخطوة 3 (اختيار المتدربين / وقت التعيين)
function SubStepDots({ active }: { active: WizardSubStep }) {
	return (
		<div className="mt-1 flex items-center gap-1">
			{(["learners", "time"] as const).map((key) => (
				<span
					key={key}
					className={cn(
						"size-1.5 rounded-full transition-colors",
						key === active ? "bg-primary" : "bg-[#D4D4DE]",
					)}
				/>
			))}
		</div>
	);
}

export function WizardTopBar({
	step,
	sub,
	furthest,
	onStepChange,
	hint,
	canContinue,
	isBusy,
	onContinue,
	onClose,
	onToggleCollapse,
}: {
	step: WizardStep;
	sub: WizardSubStep;
	furthest: WizardStep;
	onStepChange: (step: WizardStep) => void;
	hint: string | null;
	canContinue: boolean;
	isBusy: boolean;
	onContinue: () => void;
	onClose: () => void;
	onToggleCollapse?: () => void;
}) {
	return (
		<div className="flex shrink-0 flex-col gap-2 overflow-hidden border-b border-[#E7E7EE] bg-white/80 pt-2.5 pb-2 backdrop-blur">
			<div className="flex max-w-full items-center justify-between gap-4 px-3">
				{/* بداية السطر (يمين): إغلاق + العنوان */}
				<div className="flex shrink-0 items-center gap-2">
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						aria-label="إغلاق"
						className="text-[#6B6B67]"
					>
						<IconX className="size-[18px]" />
					</Button>
					<span className="truncate text-[14px] font-bold text-[#08090A]">
						إنشاء دورة تدريبية
					</span>
				</div>

				{/* الوسط: المؤشّر */}
				<Stepper
					value={step}
					onValueChange={(s) => {
						if (s <= furthest) onStepChange(s as WizardStep);
					}}
					className="hidden min-w-0 flex-1 justify-center overflow-x-auto [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden"
				>
					<StepperNav className="mx-auto flex-nowrap items-center justify-center gap-1.5">
						{STEP_META.map((meta, idx) => {
							const Icon = meta.icon;
							const disabled = meta.step > furthest;
							return (
								<StepperItem
									key={meta.step}
									step={meta.step}
									disabled={disabled}
									className="relative shrink-0 items-start"
								>
									<StepperTrigger
										disabled={disabled}
										className="flex items-center gap-2 rounded-lg px-1.5 py-1"
									>
										<StepperIndicator className="size-7 shrink-0 border-2 text-[11px] font-bold data-[state=inactive]:border-[#E0E0E8] data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#9B9B9D]">
											<Icon className="size-[15px]" />
										</StepperIndicator>
										{/* التسمية الكاملة تظهر للخطوة النشطة دائمًا، وللبقية على الشاشات العريضة فقط */}
										<span className="flex flex-col items-start">
											<StepperTitle className="whitespace-nowrap text-[11.5px] font-semibold group-data-[state=inactive]/step:text-[#9B9B9D]">
												<span className="text-[#9B9B9D]">{AR_STEP[idx]}.</span>{" "}
												{meta.step === step ? (
													meta.title
												) : (
													<span className="hidden xl:inline">{meta.title}</span>
												)}
											</StepperTitle>
											{meta.subSteps && meta.step === step && <SubStepDots active={sub} />}
										</span>
									</StepperTrigger>
									{idx < STEP_META.length - 1 && (
										<StepperSeparator className="mx-0.5 h-[2px] w-4 shrink-0 self-center rounded-full bg-[#E7E7EE] group-data-[state=completed]/step:bg-primary" />
									)}
								</StepperItem>
							);
						})}
					</StepperNav>
				</Stepper>

				{/* نهاية السطر (يسار): تلميح التالي + طي + متابعة */}
				<div className="flex shrink-0 items-center gap-2">
					{hint && (
						<span className="hidden items-center gap-1 text-[11px] text-[#9B9B9D] md:flex">
							التالي:
							<span className="font-semibold text-[#6B6B67]">{hint}</span>
							<IconChevronLeft className="size-3" />
						</span>
					)}
					{onToggleCollapse && (
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={onToggleCollapse}
							aria-label="طي اللوحة"
							className="hidden text-[#9B9B9D] xl:inline-flex"
						>
							<IconLayoutSidebarRightCollapse className="size-[18px]" />
						</Button>
					)}
					<Button
						type="button"
						onClick={onContinue}
						disabled={!canContinue || isBusy}
						className="h-9 gap-1.5 rounded-lg px-5 text-[13px] font-semibold"
					>
						{isBusy ? "جارٍ الحفظ..." : "متابعة"}
					</Button>
				</div>
			</div>

			{/* خط التقدّم يُركّب من الأب أسفل الشريط */}
		</div>
	);
}
