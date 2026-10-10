import { Fragment } from "react";

import { LAB_STAGE_ICONS } from "@/features/services/lab-tests/data/lab-tests-data";
import type { LabSampleStage, LabTestStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	LAB_STAGE_LABELS,
	LAB_STAGE_ORDER,
	labStageProgress,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";

// مسار مراحل العيّنة المصغّر — نفس تصميم مسار المصروفات: المسار كاملًا دائمًا
// مع تعليم ما أُنجز منه. الوصلة تُلوَّن بين خطوتين مكتملتين وتحمرّ عند الرفض.
export function LabMiniStepper({
	status,
	stage,
	rejected = false,
	showLabels = true,
}: {
	status: LabTestStatus;
	stage: LabSampleStage;
	rejected?: boolean;
	showLabels?: boolean;
}) {
	// الحالة تحكم التقدّم — المرحلة الفرعية تُصفَّر خارج السحب والمختبر
	const currentIndex = labStageProgress(status, stage);

	return (
		<div className="flex items-start justify-center gap-1.5">
			{LAB_STAGE_ORDER.map((s, i) => {
				const Icon = LAB_STAGE_ICONS[s];
				const isDone = i <= currentIndex;
				const prevDone = i - 1 <= currentIndex;
				const connectorActive = i > 0 && prevDone && isDone;
				const connectorRejected = i > 0 && rejected && !(prevDone && isDone);
				return (
					<Fragment key={s}>
						{i > 0 && (
							<span
								className={cn(
									"mt-2.5 h-0.5 min-w-2 flex-1 rounded-full",
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
								showLabels && "w-14",
							)}
							// المسار بلا تسميات يحتاج ما يعرّف كل أيقونة عند التحويم
							title={showLabels ? undefined : `${i + 1}. ${LAB_STAGE_LABELS[s]}`}
						>
							<span
								className={cn(
									"flex size-5 shrink-0 items-center justify-center rounded-full",
									isDone
										? "bg-[#4f6ae0] text-white"
										: rejected
											? "bg-rose-500 text-white"
											: "border bg-[#f3f4f6] text-muted-foreground",
								)}
							>
								<Icon className="size-3" />
							</span>
							{showLabels && (
								<span
									className={cn(
										"text-[9px] font-medium leading-tight",
										isDone
											? "text-foreground"
											: rejected
												? "text-rose-600"
												: "text-muted-foreground",
									)}
								>
									{LAB_STAGE_LABELS[s]}
								</span>
							)}
						</span>
					</Fragment>
				);
			})}
		</div>
	);
}
