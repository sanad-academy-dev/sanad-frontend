import { IconSend } from "@tabler/icons-react";
import { Fragment } from "react";

import { IconValidationApproval } from "@/features/finance/expenses/components/approval-step-icons";
import type { ExpenseCardStep } from "@/features/finance/expenses/data/expense-records";
import { cn } from "@/lib/utils";

// المسار المصغّر (بطاقات + جدول). الترتيب من اليمين (الدفع) لليسار (إرسال).
// عند rejected: الخطوات غير المكتملة (والوصلات بينها) تُعرض بالأحمر.
export function ExpenseMiniStepper({
	steps,
	showLabels = true,
	rejected = false,
}: {
	steps: ExpenseCardStep[];
	showLabels?: boolean;
	rejected?: boolean;
}) {
	return (
		<div className="flex items-start justify-center gap-0.5">
			{steps.map((step, i) => {
				const prev = steps[i - 1];
				const connectorActive = i > 0 && prev.active && step.active;
				// الوصلة حمراء إذا كان الطلب مرفوضاً وأحد طرفيها غير مكتمل
				const connectorRejected = i > 0 && rejected && !(prev.active && step.active);
				return (
					<Fragment key={step.key}>
						{i > 0 && (
							<span
								className={cn(
									"mt-2.5 h-px flex-1",
									connectorActive
										? "bg-[#4f6ae0]"
										: connectorRejected
											? "bg-rose-300"
											: "bg-[#e5e7eb]",
								)}
							/>
						)}
						<span
							className={cn(
								"flex shrink-0 flex-col items-center gap-1 text-center",
								showLabels && "w-[52px]",
							)}
						>
							<span
								className={cn(
									"flex size-5 shrink-0 items-center justify-center rounded-full",
									step.active
										? "bg-[#4f6ae0] text-white"
										: rejected
											? "bg-rose-500 text-white"
											: "border bg-[#f3f4f6] text-muted-foreground",
								)}
							>
								{step.key === "send" ? (
									<IconSend className="size-2.5" />
								) : (
									<IconValidationApproval className="size-2.5" />
								)}
							</span>
							{showLabels && (
								<span
									className={cn(
										"text-[10px] font-medium",
										step.active
											? "text-foreground"
											: rejected
												? "text-rose-600"
												: "text-muted-foreground",
									)}
								>
									{step.label}
								</span>
							)}
						</span>
					</Fragment>
				);
			})}
		</div>
	);
}
