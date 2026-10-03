import { Fragment } from "react";

import { GROOMING_STATUS_ICONS } from "@/features/care/grooming/data/grooming-columns";
import { GroomingStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { GROOMING_PATHWAY, GROOMING_STATUS_LABELS } from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

/**
 * مسار سير عمل الجلسة — المسار كاملًا دائمًا مع تعليم ما أُنجز منه، لا خطوات
 * تظهر وتختفي.
 *
 * المسار هنا هو `GROOMING_PATHWAY` كاملًا («مكتملة» في آخره) لا أعمدة اللوحة:
 * اللوحة تُسقط المكتملة عمدًا لأنها لوحة عمل، أمّا المسار فوثيقة تقول ما جرى.
 * وبإسقاطها كانت الجلسة المكتملة تُخرج المسار كلّه رماديًّا — رتبتها ‎-1‎ فلا
 * خطوة «قبلها» — فيبدو أن شيئًا لم يحدث بينما كل شيء حدث.
 *
 * الجلسة المُنهاة خارج المسار (ملغاة / لم يحضر / محوَّلة للمدرّب) تُلوَّن وصلاتها
 * حمراء: المسار لم يكتمل، وإخفاء ذلك يجعل الورقة تكذب على قارئها.
 */
export function GroomingStepper({
	status,
	selected,
	interrupted = false,
	onStepClick,
}: {
	status: GroomingStatus;
	/** الخطوة المعروضة — قد تختلف عن حالة الجلسة عند تصفّح المسار */
	selected?: GroomingStatus;
	interrupted?: boolean;
	onStepClick?: (status: GroomingStatus) => void;
}) {
	const steps = GROOMING_PATHWAY;
	const currentIndex = (steps as readonly GroomingStatus[]).indexOf(status);
	// الجلسة المكتملة تُنجز المسار كلّه؛ رتبتها آخر خطوة لا خارجه
	const doneThrough = status === GroomingStatus.COMPLETED ? steps.length - 1 : currentIndex;

	return (
		<div className="flex items-start justify-center gap-1.5">
			{steps.map((step, i) => {
				const isDone = doneThrough >= 0 && i <= doneThrough;
				const isCurrent = i === currentIndex;
				const isSelected = selected != null && step === selected;
				const connectorActive = i > 0 && isDone;
				const connectorInterrupted = i > 0 && interrupted && !isDone;
				return (
					<Fragment key={step}>
						{i > 0 && (
							<span
								className={cn(
									"mt-2.5 h-0.5 min-w-2 flex-1 rounded-full",
									connectorActive
										? "bg-[#4f6ae0]"
										: connectorInterrupted
											? "bg-rose-300"
											: "bg-[#e5e7eb]",
								)}
							/>
						)}
						<button
							type="button"
							disabled={!onStepClick}
							onClick={() => onStepClick?.(step)}
							className={cn(
								"flex w-14 shrink-0 flex-col items-center gap-1 text-center",
								onStepClick && "cursor-pointer",
							)}
							title={GROOMING_STATUS_LABELS[step]}
						>
							<span
								className={cn(
									"flex size-5 shrink-0 items-center justify-center rounded-full",
									isDone
										? "bg-[#4f6ae0] text-white"
										: interrupted
											? "bg-rose-500 text-white"
											: "border bg-[#f3f4f6] text-muted-foreground",
									isCurrent && "ring-2 ring-[#4f6ae0]/30",
									// الخطوة المتصفَّحة تُميَّز بحلقة أوضح — التمييز عن «الحالية» مقصود
									isSelected && "ring-2 ring-[#4f6ae0]",
								)}
							>
								{GROOMING_STATUS_ICONS[step]}
							</span>
							<span
								className={cn(
									"font-medium text-[9px] leading-tight",
									isDone
										? "text-foreground"
										: interrupted
											? "text-rose-600"
											: "text-muted-foreground",
								)}
							>
								{GROOMING_STATUS_LABELS[step]}
							</span>
						</button>
					</Fragment>
				);
			})}
		</div>
	);
}
