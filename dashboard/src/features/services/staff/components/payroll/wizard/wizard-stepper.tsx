// ترويسة مراحل معالج الرواتب — 6 مراحل أفقية (RTL) مع موصّلات وحالات
// (مكتملة / نشطة / قادمة) مطابقة للغة تصميم النظام.
import { IconCheck } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export const WIZARD_STEPS = [
	"مراجعة الفترة",
	"الاحتساب",
	"اكتشاف المشاكل",
	"ملخص المسير",
	"الاعتماد",
	"الإنهاء",
] as const;

export function WizardStepper({ current }: { current: number }) {
	return (
		<div className="flex w-full items-center">
			{WIZARD_STEPS.map((label, i) => {
				const done = i < current;
				const active = i === current;
				const isLast = i === WIZARD_STEPS.length - 1;
				return (
					<div
						key={label}
						className={cn("flex items-center", !isLast && "flex-1")}
					>
						<div className="flex shrink-0 flex-col items-center gap-1.5">
							<span
								className={cn(
									"flex size-7 items-center justify-center rounded-full border text-[11px] font-bold tabular-nums transition-colors",
									done && "border-[#6366F1] bg-[#6366F1] text-white",
									active && "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]",
									!done && !active && "border-[#E5E5E5] bg-white text-[#9B9B9D]",
								)}
							>
								{done ? <IconCheck className="size-4" /> : i + 1}
							</span>
							<span
								className={cn(
									"whitespace-nowrap text-[10px] font-medium transition-colors",
									active ? "text-[#08090A]" : "text-[#9B9B9D]",
								)}
							>
								{label}
							</span>
						</div>
						{!isLast && (
							<span
								className={cn(
									"mx-1.5 mb-5 h-px flex-1 transition-colors",
									done ? "bg-[#6366F1]" : "bg-[#E5E5E5]",
								)}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
