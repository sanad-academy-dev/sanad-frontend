import { IconAlertCircle, IconArrowsDiagonal, IconPencil, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { SubmittedExpenseRequest } from "@/features/finance/expenses/data/expense-review";

// حوار "تفاصيل الرفض" (Figma 2973-56432) — يُعرض بعد رفض الطلب من القائمة.
// ملاحظة RTL: التصميم LTR بمحاذاة نص يمينية (صفوف justify-between، القيمة أولاً).
// نضع dir="ltr" على غلاف داخلي (لا على DialogContent حتى يبقى التوسيط)، والتذييل RTL.

function DetailRow({
	label,
	value,
	valueClass,
}: {
	label: string;
	value: string;
	valueClass?: string;
}) {
	return (
		<div className="flex items-start justify-between">
			<span className={valueClass ?? "text-[12px] text-foreground"}>{value}</span>
			<span className="text-[12px] font-medium text-foreground">{label}</span>
		</div>
	);
}

export function ExpenseRejectionSummaryDialog({
	open,
	onOpenChange,
	request,
	rejectionReason,
	onEdit,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: SubmittedExpenseRequest;
	rejectionReason: string;
	onEdit: () => void;
}) {
	const title = request.title.replace("مراجعة ", "");

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				// لوحة جانبية على اليسار تملأ المحور الرأسي مع هامش بسيط (بدل التوسيط)
				className="start-auto top-2 bottom-2 left-2 h-auto max-h-none translate-x-0 translate-y-0 gap-0 overflow-hidden p-0 rtl:translate-x-0 sm:max-w-md"
			>
				<DialogTitle className="sr-only">تفاصيل رفض طلب المصروف</DialogTitle>

				<div
					dir="ltr"
					className="flex h-full flex-col"
				>
					{/* Header — الأيقونات يسار، المسار يمين */}
					<div className="flex items-center justify-between gap-2 border-b p-3">
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => onOpenChange(false)}
								className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								<IconX className="size-4" />
								<span className="sr-only">إغلاق</span>
							</button>
							<button
								type="button"
								className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								<IconArrowsDiagonal className="size-4" />
								<span className="sr-only">توسيع</span>
							</button>
						</div>
						<div className="flex items-center gap-1.5 text-[13px] font-semibold">
							<span className="text-rose-600">رفض طلب المصروف</span>
							<span className="text-muted-foreground">›</span>
							<span className="text-foreground">
								شراء {title} . {request.code}#
							</span>
						</div>
					</div>

					<div className="flex-1 space-y-5 overflow-y-auto p-4">
						{/* Hero */}
						<div className="flex flex-col items-center gap-2 text-center">
							<img
								src="/illustrations/expense-rejected.svg"
								alt=""
								className="size-24"
							/>
							<h2 className="text-base font-bold text-foreground">
								تم رفض طلب الصرف وتحديث حالتها إلى مرفوضة
							</h2>
							<p className="text-[13px] text-muted-foreground">
								تم رفض طلب المصروف. يُرجى مراجعة سبب الرفض وتعديل الطلب قبل إعادة إرساله.
							</p>
							<p className="text-[11px] text-muted-foreground">
								مقدم الطلب: {request.requesterName} · {request.dateLabel}
							</p>
						</div>

						{/* ملخص الطلب */}
						<div className="space-y-2">
							<h3 className="text-right text-[13px] font-semibold text-foreground">
								ملخص الطلب
							</h3>
							<div className="rounded-[4px] border">
								<div className="flex items-center justify-between border-b px-3 py-2 text-[11px] font-medium text-muted-foreground">
									<span>السعر</span>
									<span>البند</span>
								</div>
								<div className="flex items-center justify-between px-3 py-2 text-[12px] text-foreground">
									<span>إجمالي: {request.amountLabel}</span>
									<span>شراء {title}</span>
								</div>
							</div>
						</div>

						{/* تفاصيل الطلب */}
						<div className="space-y-2">
							<h3 className="text-right text-[13px] font-semibold text-foreground">
								تفاصيل الطلب
							</h3>
							<div className="space-y-2 rounded-[4px] border px-4 py-3">
								<DetailRow
									label="إجمالي المصروف"
									value={request.amountLabel}
								/>
								<DetailRow
									label="القسم"
									value={request.departmentLabel}
								/>
								<DetailRow
									label="الفرع"
									value={request.branchLabel}
								/>
								<DetailRow
									label="طريقة الصرف"
									value={request.paymentMethodLabel}
								/>
								<DetailRow
									label="الحالة"
									value="مرفوضة"
									valueClass="text-[12px] font-medium text-rose-600"
								/>
								<DetailRow
									label="تاريخ القرار"
									value={request.dateLabel}
								/>
							</div>
						</div>

						{/* سبب الرفض */}
						<div className="space-y-2 rounded-[4px] border border-rose-200 bg-rose-50/60 p-3">
							<div className="flex items-center justify-end gap-1 text-[13px] font-semibold text-rose-600">
								سبب الرفض:
								<IconAlertCircle className="size-3.5" />
							</div>
							<p className="text-right text-[12px] text-rose-600/90">
								{rejectionReason || "لم يُذكر سبب الرفض."}
							</p>
						</div>

						{/* Footnote */}
						<p className="text-center text-[11px] text-muted-foreground">
							لن يتم احتسابها ضمن الإيرادات أو التقارير المالية، مع الاحتفاظ بسجل العملية
							لأغراض المراجعة.
						</p>
					</div>

					{/* Footer — RTL: تعديل الطلب يمين، إلغاء يساره */}
					<div
						dir="rtl"
						className="flex items-center justify-between gap-2 border-t px-4 py-2"
					>
						<Button
							type="button"
							onClick={onEdit}
						>
							<IconPencil className="size-3.5" />
							تعديل الطلب
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							إلغاء
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
