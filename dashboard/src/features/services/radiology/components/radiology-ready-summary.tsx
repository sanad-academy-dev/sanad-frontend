import { IconCircleCheck, IconInfoCircle } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { FASTING_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-sample.type";
import {
	LATERALITY_LABELS,
	type RadiologyItemResponse,
	type RadiologyOrderResponse,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";
import { MODALITY_META, SEDATION_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// ④ الملخص والتسليم — مراجعة أخيرة قبل تسليم الطفل لقاعة التصوير.
// «إرسال إلى التصوير» في تذييل اللوحة هو الذي ينقل الحالة فعلًا.

function SummaryRow({ label, value }: { label: string; value: string | null }) {
	return (
		<div className="flex items-start justify-between gap-2 border-b border-dashed py-1.5 last:border-0">
			<span className="shrink-0 text-xs text-muted-foreground">{label}</span>
			<span className="text-end text-sm font-medium">{value ?? "—"}</span>
		</div>
	);
}

export function RadiologyReadySummary({
	order,
	item,
}: {
	order: RadiologyOrderResponse;
	item: RadiologyItemResponse;
}) {
	const screening = order.safetyScreening;
	const execution = item.execution;

	const safetyFlags = [
		screening?.pregnancyPossible ? "احتمال حمل" : null,
		screening?.metalImplants ? "غرسات معدنية" : null,
		screening?.priorContrastReaction ? "تفاعل سابق مع التباين" : null,
	].filter(Boolean) as string[];

	return (
		<div className="flex flex-col gap-4">
			<div className="rounded-md border bg-card p-3">
				<SummaryRow
					label="الطفل"
					value={`${order.patient.name} (${order.patient.code})`}
				/>
				<SummaryRow
					label="الفحص"
					value={`${item.service.name} — ${item.accession}`}
				/>
				<SummaryRow
					label="طريقة التصوير"
					value={MODALITY_META[item.modality].label}
				/>
				<SummaryRow
					label="منطقة التصوير"
					value={
						[
							item.bodyPart,
							item.laterality !== "NONE" ? LATERALITY_LABELS[item.laterality] : null,
						]
							.filter(Boolean)
							.join(" — ") || null
					}
				/>
				<SummaryRow
					label="الإسقاطات المطلوبة"
					value={item.views.length ? item.views.join("، ") : null}
				/>
				<SummaryRow
					label="التباين"
					value={item.withContrast ? "مطلوب بالتباين" : "بدون تباين"}
				/>
				<SummaryRow
					label="الصيام"
					value={screening?.fastingStatus ? FASTING_LABELS[screening.fastingStatus] : null}
				/>
				<SummaryRow
					label="التهدئة"
					value={
						execution?.sedationUsed
							? [SEDATION_LABELS[execution.sedationUsed], execution.sedationAgent]
									.filter(Boolean)
									.join(" — ")
							: null
					}
				/>
				<SummaryRow
					label="الجهاز والقاعة"
					value={
						[execution?.machineName, execution?.roomName].filter(Boolean).join(" · ") || null
					}
				/>
			</div>

			{/* أعلام السلامة تُعاد هنا عمدًا — آخر نقطة تحقّق قبل التعريض */}
			{safetyFlags.length > 0 ? (
				<div className="flex flex-wrap items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 p-2.5">
					<IconInfoCircle className="size-4 shrink-0 text-amber-700" />
					{safetyFlags.map((flag) => (
						<Badge
							key={flag}
							variant="outline"
							className="border-amber-300 bg-amber-100 text-[10px] text-amber-800"
						>
							{flag}
						</Badge>
					))}
				</div>
			) : (
				<p className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-700">
					<IconCircleCheck className="size-4 shrink-0" />
					لا موانع سلامة مسجّلة — الطفل جاهز للتسليم لقاعة التصوير.
				</p>
			)}

			{!execution?.machineId && (
				<p className="rounded-md border bg-muted/30 p-2.5 text-xs text-muted-foreground">
					لم يُعيَّن جهاز تصوير بعد — عُد خطوةً لتعيينه قبل التسليم.
				</p>
			)}
		</div>
	);
}
