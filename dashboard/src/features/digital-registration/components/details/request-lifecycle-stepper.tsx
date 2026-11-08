import {
	IconActivity,
	IconCheck,
	IconClipboardCheck,
	IconCoin,
	IconCopy,
	IconEye,
	IconHourglass,
	IconInbox,
	IconX,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../../types/campaign-request.types";

interface RequestLifecycleStepperProps {
	request: CampaignRequestItem;
}

interface StepDef {
	id: string;
	title: string;
	icon: any;
	matchedStatuses: string[];
}

/** المراحل السبع الرسمية لمسار اعتماد وتسجيل الطالب - قائمة الانتظار بعد القائمة المختصرة */
const SEVEN_LIFECYCLE_STEPS: StepDef[] = [
	{ id: "queue", title: "استلام الطلب", icon: IconInbox, matchedStatuses: ["QUEUE"] },
	{ id: "shortlist", title: "القائمة المختصرة", icon: IconClipboardCheck, matchedStatuses: ["SHORTLIST", "REVIEW"] },
	{ id: "waitlist", title: "قائمة الانتظار", icon: IconHourglass, matchedStatuses: ["WAITLIST"] },
	{ id: "interview", title: "المقابلة الشخصية", icon: IconActivity, matchedStatuses: ["INTERVIEW", "IN_EVALUATION", "EVALUATION"] },
	{ id: "payment", title: "انتظار الدفع", icon: IconCoin, matchedStatuses: ["AWAITING_PAYMENT"] },
	{ id: "accepted", title: "الاعتماد والقبول", icon: IconCheck, matchedStatuses: ["ACCEPTED"] },
	{ id: "rejected", title: "الرفض", icon: IconX, matchedStatuses: ["REJECTED"] },
];

type VisualState =
	| "active-primary"
	| "active-interview"
	| "active-payment"
	| "active-accepted"
	| "active-waitlist"
	| "active-rejected"
	| "completed"
	| "pending";

export function RequestLifecycleStepper({
	request,
}: RequestLifecycleStepperProps) {
	const currentStatus = request.status;
	const isWaitlist = currentStatus === "WAITLIST";
	const isRejected = currentStatus === "REJECTED";
	const isDuplicate = currentStatus === "DUPLICATE";
	const isAccepted = currentStatus === "ACCEPTED";

	const getStepVisualState = (step: StepDef): VisualState => {
		if (step.id === "rejected") {
			return isRejected ? "active-rejected" : "pending";
		}
		if (step.id === "waitlist") {
			return isWaitlist ? "active-waitlist" : "pending";
		}

		if (isRejected) {
			const reachedInterview = Boolean(request.appointmentDate || request.assessmentAppointment);
			if (step.id === "queue") return "completed";
			if (reachedInterview) {
				if (step.id === "shortlist" || step.id === "waitlist" || step.id === "interview") {
					return "completed";
				}
			}
			return "pending";
		}

		if (isWaitlist) {
			if (step.id === "queue" || step.id === "shortlist") return "completed";
			return "pending";
		}

		if (currentStatus === "QUEUE") {
			if (step.id === "queue") return "active-primary";
			return "pending";
		}

		if (currentStatus === "SHORTLIST" || currentStatus === "REVIEW") {
			if (step.id === "queue") return "completed";
			if (step.id === "shortlist") return "active-primary";
			return "pending";
		}

		if (
			currentStatus === "INTERVIEW" ||
			currentStatus === "IN_EVALUATION" ||
			currentStatus === "EVALUATION"
		) {
			if (step.id === "queue" || step.id === "shortlist" || step.id === "waitlist") {
				return "completed";
			}
			if (step.id === "interview") return "active-interview";
			return "pending";
		}

		if (currentStatus === "AWAITING_PAYMENT") {
			if (
				step.id === "queue" ||
				step.id === "shortlist" ||
				step.id === "waitlist" ||
				step.id === "interview"
			) {
				return "completed";
			}
			if (step.id === "payment") return "active-payment";
			return "pending";
		}

		if (isAccepted) {
			if (
				step.id === "queue" ||
				step.id === "shortlist" ||
				step.id === "waitlist" ||
				step.id === "interview" ||
				step.id === "payment"
			) {
				return "completed";
			}
			if (step.id === "accepted") return "active-accepted";
			return "pending";
		}

		return "pending";
	};

	const getLineColor = (idx: number) => {
		const step = SEVEN_LIFECYCLE_STEPS[idx];
		const visual = getStepVisualState(step);

		if (visual === "active-waitlist") return "bg-amber-500 dark:bg-amber-600";
		if (visual === "active-accepted" || visual === "completed") {
			return "bg-emerald-500 dark:bg-emerald-600";
		}
		if (visual === "active-payment") return "bg-purple-500 dark:bg-purple-600";
		if (visual === "active-interview") return "bg-indigo-500 dark:bg-indigo-600";
		if (visual === "active-primary") return "bg-primary";
		return "bg-zinc-200 dark:bg-zinc-800";
	};

	return (
		<div className="space-y-1.5 font-sans" dir="rtl">
			<div className="flex items-center justify-between flex-wrap gap-2">
				<div className="flex items-center gap-2 flex-wrap">
					<h3 className="text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100">
						مسار الطلب
					</h3>
					<span className="text-[10px] text-zinc-400 font-medium">(7 مراحل)</span>

					{isAccepted && (
						<Badge
							variant="outline"
							className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 gap-1"
						>
							<IconCheck className="size-3 text-emerald-600" />
							<span>معتمد ومقبول رسمياً</span>
						</Badge>
					)}
					{isDuplicate && (
						<Badge
							variant="outline"
							className="text-[10px] font-bold bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 gap-1"
						>
							<IconCopy className="size-3 text-zinc-500" />
							<span>طلب مكرر (معلق)</span>
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-1 text-xs text-zinc-500 select-none">
					<IconEye className="size-3.5 text-zinc-400" />
					<span>بروتوكول القبول</span>
				</div>
			</div>

			<div
				className={cn(
					"rounded-lg border p-3 shadow-2xs transition-colors",
					isAccepted
						? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/15"
						: "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
				)}
			>
				{/* شريط المسار الأفقي بالمراحل السبع */}
				<div className="relative flex items-center justify-between gap-1 pt-1 pb-1 overflow-x-auto [scrollbar-gutter:stable]">
					{SEVEN_LIFECYCLE_STEPS.map((step, idx) => {
						const Icon = step.icon;
						const visualState = getStepVisualState(step);

						return (
							<div
								key={step.id}
								className="flex-1 flex flex-col items-center relative group min-w-[56px] select-none cursor-default"
								title={step.title}
							>
								{/* الخط الرابط بين المحطات - لا يتم وصل الاعتماد بالرفض */}
								{idx > 0 && step.id !== "rejected" && (
									<div
										className={cn(
											"absolute top-2.5 right-[-50%] w-full h-[2px] -z-0 transition-colors",
											getLineColor(idx),
										)}
									/>
								)}

								{/* الدائرة والأيقونة */}
								<div
									className={cn(
										"relative z-10 size-6 rounded-full flex items-center justify-center border transition-all shadow-2xs",
										visualState === "completed" &&
											"bg-emerald-500 border-emerald-500 text-white",
										visualState === "active-primary" &&
											"bg-primary border-primary text-primary-foreground ring-2 ring-primary/20",
										visualState === "active-interview" &&
											"bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-400/30",
										visualState === "active-payment" &&
											"bg-purple-600 border-purple-600 text-white ring-2 ring-purple-400/30",
										visualState === "active-accepted" &&
											"bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-500/25",
										visualState === "active-waitlist" &&
											"bg-amber-500 border-amber-500 text-white ring-2 ring-amber-400/30",
										visualState === "active-rejected" &&
											"bg-rose-600 border-rose-600 text-white ring-2 ring-rose-500/30",
										visualState === "pending" &&
											"bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500",
									)}
								>
									{visualState === "completed" ? (
										<IconCheck className="size-3 shrink-0" />
									) : (
										<Icon className="size-3 shrink-0" />
									)}
								</div>

								{/* اسم المحطة */}
								<span
									className={cn(
										"mt-1.5 text-[9px] text-center font-bold transition-colors line-clamp-1",
										visualState === "active-primary" && "text-primary font-extrabold",
										visualState === "active-interview" && "text-indigo-600 dark:text-indigo-400 font-extrabold",
										visualState === "active-payment" && "text-purple-600 dark:text-purple-400 font-extrabold",
										visualState === "active-accepted" && "text-emerald-700 dark:text-emerald-300 font-black",
										visualState === "active-waitlist" && "text-amber-700 dark:text-amber-400 font-extrabold",
										visualState === "active-rejected" && "text-rose-600 dark:text-rose-400 font-extrabold",
										visualState === "completed" && "text-emerald-600 dark:text-emerald-400 font-medium",
										visualState === "pending" && "text-zinc-500 dark:text-zinc-400 font-medium",
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
