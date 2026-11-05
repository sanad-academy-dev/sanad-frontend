import {
	IconActivity,
	IconEye,
	IconCheck,
	IconClipboardCheck,
	IconCoin,
	IconHourglass,
	IconInbox,
	IconInfoCircle,
	IconX,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../../types/campaign-request.types";

interface RequestLifecycleStepperProps {
	request: CampaignRequestItem;
	onStepClick?: (stepId: string) => void;
}

interface StepDef {
	id: string;
	title: string;
	icon: any;
	matchedStatuses: string[];
}

const STEPS: StepDef[] = [
	{ id: "queue", title: "استلام الطلب", icon: IconInbox, matchedStatuses: ["QUEUE"] },
	{ id: "shortlist", title: "القائمة المختصرة", icon: IconClipboardCheck, matchedStatuses: ["SHORTLIST", "REVIEW"] },
	{ id: "interview", title: "المقابلة الشخصية", icon: IconActivity, matchedStatuses: ["INTERVIEW", "IN_EVALUATION", "EVALUATION"] },
	{ id: "waitlist", title: "قائمة الانتظار", icon: IconHourglass, matchedStatuses: ["WAITLIST"] },
	{ id: "accepted", title: "القبول", icon: IconCheck, matchedStatuses: ["ACCEPTED"] },
	{ id: "payment", title: "الدفع", icon: IconCoin, matchedStatuses: ["AWAITING_PAYMENT"] },
	{ id: "rejected", title: "الرفض", icon: IconX, matchedStatuses: ["REJECTED"] },
];

export function RequestLifecycleStepper({
	request,
	onStepClick,
}: RequestLifecycleStepperProps) {
	const currentStatus = request.status;
	const isRejected = currentStatus === "REJECTED";

	// Determine active step index
	let activeIndex = STEPS.findIndex((s) => s.matchedStatuses.includes(currentStatus));
	if (activeIndex === -1) activeIndex = 0;

	return (
		<div className="space-y-1.5 font-sans" dir="rtl">
			<div className="flex items-center justify-between">
				<h3 className="text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100">
					مسار الطلب
				</h3>
				<div className="flex items-center gap-1 text-xs text-zinc-500 select-none">
					<IconEye className="size-3.5 text-zinc-400" />
					<span>بروتوكول القبول</span>
				</div>
			</div>

			<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-2xs">
				{/* شريط المسار الأفقي */}
				<div className="relative flex items-center justify-between gap-1 pt-1 pb-1 overflow-x-auto">
				{STEPS.map((step, idx) => {
					const Icon = step.icon;
					const isStepRejected = step.id === "rejected";

					// State logic
					let statusState: "completed" | "active" | "rejected" | "pending" = "pending";

					if (isRejected && isStepRejected) {
						statusState = "rejected";
					} else if (!isRejected && idx < activeIndex && !isStepRejected) {
						statusState = "completed";
					} else if (idx === activeIndex) {
						statusState = isRejected ? "rejected" : "active";
					}

					return (
						<div
							key={step.id}
							className="flex-1 flex flex-col items-center relative group min-w-[62px] cursor-pointer"
							onClick={() => onStepClick?.(step.id)}
						>
							{/* الخط الرابط بين المحطات */}
							{idx > 0 && (
								<div
									className={cn(
										"absolute top-2.5 right-[-50%] w-full h-[2px] -z-0 transition-colors",
										statusState === "completed" || (statusState === "active" && !isStepRejected)
											? "bg-primary"
											: statusState === "rejected"
											? "bg-rose-500"
											: "bg-zinc-200 dark:bg-zinc-800",
									)}
								/>
							)}

							{/* الدائرة والأيقونة */}
							<div
								className={cn(
									"relative z-10 size-5.5 rounded-full flex items-center justify-center border transition-all shadow-2xs",
									statusState === "completed"
										? "bg-emerald-500 border-emerald-500 text-white"
										: statusState === "active"
										? "bg-primary border-primary text-primary-foreground ring-2 ring-primary/20"
										: statusState === "rejected"
										? "bg-rose-600 border-rose-600 text-white ring-2 ring-rose-500/20"
										: "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500",
								)}
							>
								<Icon className="size-2.5 shrink-0" />
							</div>

							{/* اسم المحطة */}
							<span
								className={cn(
									"mt-1.5 text-[9px] text-center font-bold transition-colors line-clamp-1",
									statusState === "active"
										? "text-primary font-extrabold"
										: statusState === "completed"
										? "text-emerald-600 dark:text-emerald-400"
										: statusState === "rejected"
										? "text-rose-600 dark:text-rose-400"
										: "text-zinc-500 dark:text-zinc-400 font-medium",
								)}
							>
								{step.title}
							</span>
						</div>
					);
				})}
				</div>
			</div>
		</div>
	);
}
