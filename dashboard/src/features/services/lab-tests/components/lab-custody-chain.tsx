import {
	IconFileCheck,
	IconMicroscope,
	IconPackageImport,
	IconShieldCheck,
	IconTestPipe,
} from "@tabler/icons-react";
import { Fragment } from "react";

import { LabActivityType, LabTestStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type {
	LabTestItemResponse,
	LabTestOrderResponse,
} from "@/server/lab-tests/lab-tests.type";
import { LAB_STATUS_ORDER } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";

// سلسلة الحفاظ على العيّنة — خمس محطات، كل واحدة تُشتقّ من حالة التحاليل نفسها
// لا من ختم زمني قد يغيب:
//   جمع العيّنة     ← كل التحاليل سُحبت عيّناتها
//   استلام المختبر  ← كل التحاليل بلغت «في المختبر» فأبعد
//   التحليل         ← كل التحاليل صارت لها نتائج
//   مراجعة QC       ← اعتُمدت مراجعة Westgard للطلب (والرفض يُظهرها مرفوضة)
//   التقرير النهائي ← كل التحاليل كُتب تقريرها
// الطلب قد يضمّ عدة تحاليل، فالمحطة لا تكتمل إلا حين يجتازها كلّها — والوقت
// المعروض هو وقت أبطئها، تمامًا كما تُشتقّ حالة الطلب من أقلّ تحاليله تقدّمًا.
// الختم الزمني للعرض فقط: غيابه لا يمنع اكتمال المحطة (تُعرض «—» مكانه).

const STEPS = [
	{ key: "collected", label: "جمع العيّنة", icon: IconTestPipe },
	{ key: "received", label: "استلام المختبر", icon: IconPackageImport },
	{ key: "analyzed", label: "التحليل", icon: IconMicroscope },
	{ key: "reviewed", label: "مراجعة QC", icon: IconShieldCheck },
	{ key: "reported", label: "التقرير النهائي", icon: IconFileCheck },
] as const;

type CustodyStep = {
	/** اجتاز هذا التحليل المحطة — مشتقّ من الحالة لا من الختم */
	done: boolean;
	/** الختم الزمني للعرض، إن وُجد */
	at: Date | null;
	/** رُفضت النتائج ولم تُعتمد بعد — المحطة متوقّفة لا منتظرة */
	rejected: boolean;
};

const asDate = (value: Date | string | null | undefined) => (value ? new Date(value) : null);

const statusRank = (status: LabTestStatus) =>
	LAB_STATUS_ORDER.indexOf(status as (typeof LAB_STATUS_ORDER)[number]);

const IN_LAB_RANK = LAB_STATUS_ORDER.indexOf(LabTestStatus.IN_LAB);

/** محطات تحليل واحد بترتيب STEPS */
const itemChain = (order: LabTestOrderResponse, item: LabTestItemResponse): CustodyStep[] => {
	const collection = item.sampleCollection;
	const rank = statusRank(item.status);

	// النتائج لا تحمل ختمًا زمنيًا في شكل الاستجابة، فنقرأ لحظة حفظها من السجل
	const savedAt = order.activity
		.filter(
			(entry) => entry.itemId === item.id && entry.type === LabActivityType.RESULTS_SAVED,
		)
		.map((entry) => new Date(entry.createdAt).getTime())
		.sort((a, b) => a - b)[0];

	const collectedAt = asDate(collection?.collectedAt);
	// بلوغ المختبر يعني أن العيّنة سُحبت حتمًا، حتى لو غاب سجلّ السحب
	const isCollected = !!collectedAt || rank >= IN_LAB_RANK;

	return [
		{ done: isCollected, at: collectedAt, rejected: false },
		{ done: rank >= IN_LAB_RANK, at: asDate(collection?.handedOverAt), rejected: false },
		{
			done: item.results.length > 0,
			at: savedAt != null ? new Date(savedAt) : null,
			rejected: false,
		},
		// مراجعة QC ختمها على الطلب لا على التحليل — الضوابط تخصّ شوط الجهاز
		{
			done: !!order.qcReviewedAt,
			at: asDate(order.qcReviewedAt),
			rejected: !!item.rejectedAt && !item.reviewedAt,
		},
		{
			done: !!item.report?.trim(),
			at: asDate(item.completedAt),
			rejected: false,
		},
	];
};

/** دمج سلاسل تحاليل الطلب في سلسلة واحدة — المحطة تكتمل بأبطأ تحليل */
const orderChain = (order: LabTestOrderResponse): CustodyStep[] => {
	const active = order.items.filter((item) => item.status !== LabTestStatus.CANCELLED);
	const scope = active.length > 0 ? active : order.items;
	const chains = scope.map((item) => itemChain(order, item));

	return STEPS.map((_, index) => {
		const cells = chains.map((chain) => chain[index]);
		const done = cells.length > 0 && cells.every((cell) => cell.done);
		const stamps = cells.map((cell) => cell.at).filter((at): at is Date => at !== null);
		return {
			done,
			// الوقت يظهر حين تكتمل المحطة وتتوفّر أختام كل تحاليلها
			at:
				done && stamps.length === cells.length
					? new Date(Math.max(...stamps.map((s) => s.getTime())))
					: null,
			rejected: cells.some((cell) => cell.rejected),
		};
	});
};

const timeLabel = (date: Date) =>
	date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

export function LabCustodyChain({ order }: { order: LabTestOrderResponse }) {
	const chain = orderChain(order);
	// المحطة الجارية = أوّل محطة لم تكتمل؛ ما بعدها لم يبدأ بعد
	const currentIndex = chain.findIndex((step) => !step.done);

	return (
		<div className="flex flex-col gap-2">
			<p className="flex items-center gap-1.5 text-xs font-bold">
				<IconShieldCheck className="size-3.5 text-muted-foreground" />
				سلسلة الحفاظ على العيّنة
			</p>

			<div className="flex items-start rounded-md border p-4">
				{STEPS.map((step, index) => {
					const { at, done, rejected } = chain[index];
					const current = !done && index === currentIndex;
					const Icon = step.icon;

					return (
						<Fragment key={step.key}>
							<div className="flex min-w-0 flex-col items-center gap-1.5 px-1">
								<span
									className={cn(
										"flex size-7 shrink-0 items-center justify-center rounded-full",
										rejected
											? "bg-rose-50 text-rose-600"
											: done
												? "bg-emerald-50 text-emerald-600"
												: current
													? "bg-indigo-50 text-indigo-600"
													: "bg-muted text-muted-foreground",
									)}
								>
									<Icon className="size-4" />
								</span>

								<span
									className={cn(
										"truncate text-center text-[11px] font-medium",
										done || current ? "text-foreground" : "text-muted-foreground",
									)}
								>
									{step.label}
								</span>

								<span className="text-center text-[11px] tabular-nums text-muted-foreground">
									{at ? timeLabel(at) : "—"}
								</span>

								{/* السطر الأخير يقول ما جرى للمحطة لا ما هو مكتوب فيها */}
								<span
									className={cn(
										"text-center text-[10px]",
										rejected
											? "text-rose-600"
											: done
												? "text-emerald-600"
												: current
													? "text-indigo-600"
													: "text-muted-foreground/60",
									)}
								>
									{rejected ? "مرفوضة" : done ? "مضى" : current ? "جارية" : "—"}
								</span>
							</div>

							{/* الوصلة تخضرّ حين تُقطع فعلًا — أي حين تكتمل المحطة التالية */}
							{index < STEPS.length - 1 && (
								<span
									className={cn(
										"mt-3.5 h-px flex-1 shrink-0",
										chain[index + 1].done ? "bg-emerald-200" : "bg-border",
									)}
								/>
							)}
						</Fragment>
					);
				})}
			</div>
		</div>
	);
}
