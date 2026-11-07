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
	onStepClick?: (stepId: string) => void;
}

interface StepDef {
	id: string;
	title: string;
	icon: any;
	matchedStatuses: string[];
}

/** المراحل الخمس الرسمية لمسار اعتماد وتسجيل الطالب */
const FIVE_FUNNEL_STEPS: StepDef[] = [
	{ id: "queue", title: "استلام الطلب", icon: IconInbox, matchedStatuses: ["QUEUE"] },
	{ id: "shortlist", title: "القائمة المختصرة", icon: IconClipboardCheck, matchedStatuses: ["SHORTLIST", "REVIEW"] },
	{ id: "interview", title: "المقابلة الشخصية", icon: IconActivity, matchedStatuses: ["INTERVIEW", "IN_EVALUATION", "EVALUATION"] },
	{ id: "payment", title: "انتظار الدفع", icon: IconCoin, matchedStatuses: ["AWAITING_PAYMENT"] },
	{ id: "accepted", title: "الاعتماد والقبول", icon: IconCheck, matchedStatuses: ["ACCEPTED"] },
];

type VisualState =
	| "active-primary"
	| "active-interview"
	| "active-payment"
	| "active-accepted"
	| "completed"
	| "pending";

export function RequestLifecycleStepper({
	request,
	onStepClick,
}: RequestLifecycleStepperProps) {
	const currentStatus = request.status;
	const isWaitlist = currentStatus === "WAITLIST";
	const isRejected = currentStatus === "REJECTED";
	const isDuplicate = currentStatus === "DUPLICATE";
	const isAccepted = currentStatus === "ACCEPTED";

	// تحديد موقع الطلب الحالي في مسار المراحل الخمس (من 0 إلى 4)
	const getEffectiveStepIndex = (): number => {
		if (isAccepted) return 4;
		if (currentStatus === "AWAITING_PAYMENT") return 3;
		if (
			currentStatus === "INTERVIEW" ||
			currentStatus === "IN_EVALUATION" ||
			currentStatus === "EVALUATION"
		) {
			return 2;
		}
		if (currentStatus === "SHORTLIST" || currentStatus === "REVIEW") {
			return 1;
		}
		// QUEUE أو WAITLIST أو DUPLICATE أو REJECTED قبل مرحلة متقدمة
		if (isWaitlist || isDuplicate) return 0;
		if (isRejected) {
			const reachedInterview = Boolean(request.appointmentDate || request.assessmentAppointment);
			if (reachedInterview) return 2;
			return 0;
		}
		return 0;
	};

	const currentStepIdx = getEffectiveStepIndex();

	const getStepVisualState = (idx: number): VisualState => {
		if (idx < currentStepIdx) {
			return "completed";
		}
		if (idx === currentStepIdx) {
			if (isAccepted) return "active-accepted";
			if (currentStatus === "AWAITING_PAYMENT") return "active-payment";
			if (
				currentStatus === "INTERVIEW" ||
				currentStatus === "IN_EVALUATION" ||
				currentStatus === "EVALUATION"
			) {
				return "active-interview";
			}
			return "active-primary";
		}
		return "pending";
	};

	const getLineColor = (idx: number) => {
		if (idx <= currentStepIdx) {
			if (isAccepted && currentStepIdx === 4) return "bg-emerald-500 dark:bg-emerald-600";
			if (currentStatus === "AWAITING_PAYMENT") return "bg-indigo-500 dark:bg-indigo-600";
			if (
				currentStatus === "INTERVIEW" ||
				currentStatus === "IN_EVALUATION" ||
				currentStatus === "EVALUATION"
			) {
				return "bg-indigo-500 dark:bg-indigo-600";
			}
			return "bg-primary";
		}
		return "bg-zinc-200 dark:bg-zinc-800";
	};

	return (
		<div className="space-y-1.5 font-sans" dir="rtl">
			<div className="flex items-center justify-between flex-wrap gap-2">
				<div className="flex items-center gap-2 flex-wrap">
					<h3 className="text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100">
						مسار الطلب
					</h3>
					<span className="text-[10px] text-zinc-400 font-medium">(5 مراحل)</span>

					{isWaitlist && (
						<Badge
							variant="outline"
							className="text-[10px] font-bold bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 gap-1"
						>
							<IconHourglass className="size-3 text-amber-600" />
							<span>مُعلّق في قائمة الانتظار {request.queueRank ? `(#${request.queueRank})` : ""}</span>
						</Badge>
					)}
					{isRejected && (
						<div className="flex items-center gap-1.5 flex-wrap">
							<Badge
								variant="outline"
								className="text-[10px] font-bold bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-200 gap-1 px-2 py-0.5"
							>
								<IconX className="size-3 text-rose-600" />
								<span>تم رفض الطلب والاعتذار</span>
							</Badge>
							{request.rejectionReason && (
								<span className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold truncate max-w-[240px]">
									({request.rejectionReason})
								</span>
							)}
						</div>
					)}
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
					isRejected
						? "border-rose-300 bg-rose-50/30 dark:border-rose-900/60 dark:bg-rose-950/20"
						: isWaitlist
						? "border-amber-200 bg-amber-50/20 dark:border-amber-900/50 dark:bg-amber-950/15"
						: isAccepted
						? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/15"
						: "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
				)}
			>
				{/* شريط المسار الأفقي بالمراحل الخمس الأساسية */}
				<div className="relative flex items-center justify-between gap-1 pt-1 pb-1 overflow-x-auto [scrollbar-gutter:stable]">
					{FIVE_FUNNEL_STEPS.map((step, idx) => {
						const Icon = step.icon;
						const visualState = getStepVisualState(idx);

						return (
							<div
								key={step.id}
								className="flex-1 flex flex-col items-center relative group min-w-[64px] cursor-pointer"
								onClick={() => onStepClick?.(step.id)}
								title={`المرحلة ${idx + 1}: ${step.title}`}
							>
								{/* الخط الرابط بين المحطات */}
								{idx > 0 && (
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

								{/* اسم المحطة ورقمها */}
								<span
									className={cn(
										"mt-1.5 text-[9px] text-center font-bold transition-colors line-clamp-1",
										visualState === "active-primary" && "text-primary font-extrabold",
										visualState === "active-interview" && "text-indigo-600 dark:text-indigo-400 font-extrabold",
										visualState === "active-payment" && "text-purple-600 dark:text-purple-400 font-extrabold",
										visualState === "active-accepted" && "text-emerald-700 dark:text-emerald-300 font-black",
										visualState === "completed" && "text-emerald-600 dark:text-emerald-400 font-medium",
										visualState === "pending" && "text-zinc-500 dark:text-zinc-400 font-medium",
									)}
								>
									{step.title}
								</span>

								{/* رقم المرحلة */}
								<span className="text-[7.5px] text-zinc-400 font-mono mt-0.5 select-none">
									{idx + 1}/5
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
