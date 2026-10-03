import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LabOrderResults } from "@/features/services/lab-tests/components/lab-order-results";
import { RadiologyImageUpload } from "@/features/services/radiology/components/radiology-image-upload";
import { RadiologyReportView } from "@/features/services/radiology/components/radiology-report-view";
import type {
	LabTestItemResponse,
	LabTestOrderResponse,
} from "@/server/lab-tests/lab-tests.type";
import { LAB_STATUS_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";
import type {
	RadiologyItemResponse,
	RadiologyOrderResponse,
} from "@/server/radiology/radiology.type";
import { RADIOLOGY_STATUS_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology.workflow";

// مطالعة نتيجة فحص من داخل الزيارة — للقراءة فقط. إجراءات سير العمل (إدخال
// النتائج، اعتماد التقرير) تبقى في لوحتَي التحاليل والأشعة، فالمدرّب هنا مُطالِع
// لا منفِّذ. النافذة تخدم النوعين حتى يبقى للجدول إجراء واحد لا اثنان.

export type ExamResultsTarget =
	| { kind: "LAB"; order: LabTestOrderResponse; item: LabTestItemResponse }
	| { kind: "RADIOLOGY"; order: RadiologyOrderResponse; item: RadiologyItemResponse };

/** هل صدر عن الفحص ما يُعرض؟ الإجراء يبقى ظاهرًا لكنه معطّل قبل ذلك */
export const hasLabResults = (item: LabTestItemResponse) =>
	item.results.length > 0 || !!item.report;

export const hasRadiologyResults = (item: RadiologyItemResponse) =>
	!!item.report || item.studies.length > 0;

export function ExamResultsDialog({
	target,
	onOpenChange,
}: {
	/** الفحص المعروض — null يعني النافذة مغلقة */
	target: ExamResultsTarget | null;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Dialog
			open={!!target}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-3xl"
				dir="rtl"
			>
				{target && (
					<>
						<div className="flex flex-col gap-0.5 border-b px-4 py-2 pe-10">
							<DialogTitle className="flex items-center gap-2 text-sm font-semibold">
								{target.item.service.name}
								<Badge
									variant="outline"
									className="rounded-sm text-[10px] font-normal"
								>
									{target.kind === "LAB"
										? LAB_STATUS_LABELS[target.item.status]
										: RADIOLOGY_STATUS_LABELS[target.item.status]}
								</Badge>
							</DialogTitle>
							<DialogDescription className="text-xs">
								{target.kind === "LAB"
									? "نتائج التحليل وتقرير المراجعة — للقراءة فقط."
									: "تقرير الأشعة وصوره — للقراءة فقط."}
							</DialogDescription>
						</div>

						<div className="max-h-[70vh] overflow-y-auto px-4 py-3">
							{target.kind === "LAB" ? (
								// الطلب الواحد قد يضم تحاليل عدة — نقصره على تحليل هذا الصف
								<LabOrderResults order={{ ...target.order, items: [target.item] }} />
							) : (
								<div className="flex flex-col gap-4">
									<RadiologyReportView
										item={target.item}
										order={target.order}
									/>
									{/* متصفّح الدراسات — يفتح عارض DICOM فوق هذه النافذة */}
									<RadiologyImageUpload
										item={target.item}
										orderId={target.order.id}
										readOnly
									/>
								</div>
							)}
						</div>

						<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => onOpenChange(false)}
							>
								إغلاق
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
