import { IconAlertTriangleFilled, IconChevronLeft, IconFlask } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { LabMiniStepper } from "@/features/services/lab-tests/components/lab-mini-stepper";
import { LabResultFlag, LabTestStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	type LabTestOrderResponse,
	labPaymentStatus,
	paymentBlockMessage,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";
import { LAB_STATUS_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";

// جدول تحاليل الطلب — لكل تحليل سطر بسير عمله وزر يفتح لوحته الجانبية.

const STATUS_CLASS: Record<LabTestStatus, string> = {
	[LabTestStatus.QUEUE]: "border-muted bg-muted text-muted-foreground",
	[LabTestStatus.SCHEDULED]: "border-amber-200 bg-amber-50 text-amber-700",
	[LabTestStatus.SAMPLE_COLLECTION]: "border-rose-200 bg-rose-50 text-rose-700",
	[LabTestStatus.IN_LAB]: "border-indigo-200 bg-indigo-50 text-indigo-700",
	[LabTestStatus.UNDER_REVIEW]: "border-blue-200 bg-blue-50 text-blue-700",
	[LabTestStatus.COMPLETED]: "border-emerald-200 bg-emerald-50 text-emerald-700",
	[LabTestStatus.CANCELLED]: "border-muted bg-muted text-muted-foreground",
};

// نص زر الصف يتبع حالة التحليل — الخطوة التالية لا عبارة عامة
const ROW_ACTION_LABELS: Record<LabTestStatus, string> = {
	// الطابور بعد السداد ينتظر تأكيد المختبر — وقبله ينتظر السداد (يُحسب أدناه)
	[LabTestStatus.QUEUE]: "بانتظار التأكيد",
	[LabTestStatus.SCHEDULED]: "بدء سحب العيّنة",
	[LabTestStatus.SAMPLE_COLLECTION]: "سحب العيّنة",
	[LabTestStatus.IN_LAB]: "إدخال النتائج",
	[LabTestStatus.UNDER_REVIEW]: "إدخال التقرير",
	[LabTestStatus.COMPLETED]: "عرض النتائج",
	[LabTestStatus.CANCELLED]: "عرض التحليل",
};

export function LabOrderTestsTable({
	order,
	onOpenItem,
	activeItemId,
	focusItemId = null,
}: {
	order: LabTestOrderResponse;
	onOpenItem: (itemId: string) => void;
	activeItemId: string | null;
	/** حصر الجدول في تحليل واحد — الشيت المفتوح من بطاقة تحليل يعرضه وحده */
	focusItemId?: string | null;
}) {
	const payment = labPaymentStatus(order);
	// المعرّف المجهول (طلب قديم أُعيد جلبه) يسقط إلى عرض الكل بدل جدول فارغ
	const focused = focusItemId ? order.items.filter((i) => i.id === focusItemId) : [];
	const items = focused.length > 0 ? focused : order.items;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<p className="flex items-center gap-1.5 text-xs font-bold">
					<IconFlask className="size-3.5 text-muted-foreground" />
					{items.length === 1 ? "التحليل" : "تحاليل الطلب"}
					{items.length > 1 && (
						<span className="font-normal text-muted-foreground">({items.length})</span>
					)}
				</p>
			</div>

			<div className="rounded-[4px] border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">التحليل</TableHead>
							<TableHead className="text-center">الحالة</TableHead>
							<TableHead className="text-center">المسار</TableHead>
							<TableHead className="text-center">النتائج</TableHead>
							<TableHead className="text-center">فنّي المختبر</TableHead>
							<TableHead className="text-center" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center text-xs text-muted-foreground"
								>
									لا توجد تحاليل في هذا الطلب.
								</TableCell>
							</TableRow>
						)}
						{items.map((item) => {
							const criticalCount = item.results.filter(
								(r) => r.flag !== LabResultFlag.NORMAL,
							).length;
							// السداد لكل تحليل: بنده مسدَّد، أو فاتورة الطلب مسدَّدة كاملةً.
							// ما دام في الطابور غير مسدَّد فلا إجراء منه — ينتظر السداد.
							// المربوط بإقامة يُحاسَب على فاتورتها — لا ينتظر سدادًا هنا
							const isItemPaid =
								item.paidAt !== null || payment === "PAID" || payment === "INPATIENT";
							const isAwaitingPayment = item.status === LabTestStatus.QUEUE && !isItemPaid;
							return (
								<TableRow
									key={item.id}
									className={cn(
										// الصف المنتظر للسداد لا يُفتح بالنقر أيضًا، وإلا ناقض زرَّه المعطَّل
										isAwaitingPayment ? "cursor-default" : "cursor-pointer",
										activeItemId === item.id && "bg-muted/40 hover:bg-muted/40",
									)}
									onClick={() => {
										if (!isAwaitingPayment) onOpenItem(item.id);
									}}
								>
									<TableCell className="text-sm font-medium">
										<div className="flex items-center gap-1.5">
											{item.service.name}
											{item.rejectedAt && (
												<Badge
													variant="outline"
													className="border-rose-200 bg-rose-50 text-[10px] text-rose-700"
												>
													تم رفضها
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="outline"
											className={cn("text-[10px]", STATUS_CLASS[item.status])}
										>
											{LAB_STATUS_LABELS[item.status]}
										</Badge>
									</TableCell>
									{/* المسار — مراحل العيّنة كاملة مع تقدّم التحليل، كعمود مسار المصروفات */}
									<TableCell className="text-center">
										<div className="mx-auto w-[150px]">
											<LabMiniStepper
												status={item.status}
												stage={item.sampleStage}
												showLabels={false}
												rejected={!!item.rejectedAt}
											/>
										</div>
									</TableCell>
									<TableCell className="text-center">
										<div className="flex items-center justify-center gap-1.5">
											<span className="text-xs tabular-nums text-muted-foreground">
												{item.results.length || "—"}
											</span>
											{criticalCount > 0 && (
												<Badge
													variant="outline"
													className="gap-1 border-red-200 bg-red-50 text-[10px] text-red-700"
												>
													<IconAlertTriangleFilled className="size-3" />
													{criticalCount}
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell className="text-center text-xs text-muted-foreground">
										{item.assignedTo?.name ?? "غير معيَّن"}
									</TableCell>
									<TableCell
										className="text-center"
										onClick={(e) => e.stopPropagation()}
									>
										<Button
											size="sm"
											variant="outline"
											className="gap-1"
											// لا إجراء على تحليل ينتظر السداد — نفس بوابة الخادم
											disabled={isAwaitingPayment}
											title={isAwaitingPayment ? paymentBlockMessage(payment) : undefined}
											onClick={() => onOpenItem(item.id)}
										>
											{isAwaitingPayment ? "بانتظار السداد" : ROW_ACTION_LABELS[item.status]}
											{/* الشيفرون يشير لجهة فتح اللوحة — يُقلب في RTL */}
											{!isAwaitingPayment && (
												<IconChevronLeft className="size-3.5 rtl:rotate-180" />
											)}
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
