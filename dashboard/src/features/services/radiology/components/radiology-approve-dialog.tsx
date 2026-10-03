import { IconAlertTriangleFilled, IconCircleCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { FieldLabel } from "@/components/common/field-label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useApproveRadiology } from "@/features/services/radiology/hooks/use-radiology-mutations";
import type {
	RadiologyItemResponse,
	RadiologyOrderResponse,
} from "@/server/radiology/radiology.type";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// نفس بنية حوار قرار المراجعة في التحاليل — تخطيط LTR داخلي بمحاذاة يمينية،
// ورأس/تذييل RTL. التقرير مكتوب ومحفوظ مسبقًا، وهنا يُراجَع ويُختم.

export function RadiologyApproveDialog({
	order,
	item,
	open,
	onOpenChange,
}: {
	order: RadiologyOrderResponse;
	item: RadiologyItemResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { approve, isPending } = useApproveRadiology();
	const [note, setNote] = useState("");

	// نبدأ من ملاحظة فارغة عند كل فتح — الملاحظة تخصّ قرار المراجعة لا التقرير
	useEffect(() => {
		if (open) setNote("");
	}, [open]);

	const imagesCount = item.studies.reduce(
		(sum, study) => sum + study.series.reduce((s, series) => s + series.instances.length, 0),
		0,
	);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await approve({ itemId: item.id, note: note.trim() || null });
		} catch {
			return; // الفشل يُبقي النافذة مفتوحة (التوست يعرض السبب)
		}
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-xl"
			>
				<DialogTitle className="sr-only">اعتماد تقرير الأشعة</DialogTitle>

				<form
					dir="ltr"
					className="flex max-h-[85vh] flex-col"
					onSubmit={onSubmit}
				>
					{/* Header — RTL: المسار يمين وأزرار التحكم يسار */}
					<div
						dir="rtl"
						className="flex items-center justify-between gap-2 border-b p-3"
					>
						<div className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold">
							<span className="text-emerald-600">اعتماد التقرير</span>
							<span className="text-muted-foreground">›</span>
							<span className="text-muted-foreground">أشعة</span>
							<span className="text-muted-foreground">›</span>
							<span className="truncate text-foreground">
								{`${item.service.name} . ${order.code}#`}
							</span>
						</div>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconX className="size-4" />
							<span className="sr-only">إغلاق</span>
						</button>
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto p-3">
						<p className="text-right text-[13px] text-foreground">
							هل أنت متأكد من اعتماد تقرير هذا الفحص؟ سينتقل إلى «مكتملة» ويُختم التقرير باسمك،
							ولن يعود قابلًا للتعديل.
						</p>

						{item.report?.criticalFinding && (
							<div className="flex items-start gap-2 rounded-[4px] border border-red-200 bg-red-50 p-3">
								<IconAlertTriangleFilled className="mt-0.5 size-4 shrink-0 text-red-600" />
								<p className="text-right text-[12px] text-red-700">
									التقرير مُعلَّم بنتيجة حرجة
									{item.report.criticalNotifiedTo
										? ` — أُبلغ بها: ${item.report.criticalNotifiedTo}`
										: " — لم يُوثَّق تبليغها بعد، تأكّد من إبلاغ المدرّب المعالج"}
									.
								</p>
							</div>
						)}

						{/* تفاصيل الفحص — القيمة يسار والتسمية يمين */}
						<div className="space-y-1.5 rounded-[4px] border px-4 py-3">
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{item.service.name}
								</span>
								<span className="text-[12px] text-muted-foreground">الفحص</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{order.patient.name}
								</span>
								<span className="text-[12px] text-muted-foreground">الطفل</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{MODALITY_META[item.modality].label}
								</span>
								<span className="text-[12px] text-muted-foreground">طريقة التصوير</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium tabular-nums text-foreground">
									{imagesCount}
								</span>
								<span className="text-[12px] text-muted-foreground">عدد الصور</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{item.assignedTo?.name ?? "غير معيَّن"}
								</span>
								<span className="text-[12px] text-muted-foreground">فنّي الأشعة</span>
							</div>
						</div>

						{/* خلاصة التقرير — الموجودات والانطباع كما ستُختم */}
						{(item.report?.findings || item.report?.impression) && (
							<div className="space-y-2 rounded-[4px] border px-4 py-3">
								{item.report?.findings && (
									<div className="space-y-1">
										<p className="text-right text-[11px] text-muted-foreground">الموجودات</p>
										<p className="whitespace-pre-wrap text-right text-[12px] text-foreground">
											{item.report.findings}
										</p>
									</div>
								)}
								{item.report?.impression && (
									<div className="space-y-1">
										<p className="text-right text-[11px] text-muted-foreground">الانطباع</p>
										<p className="whitespace-pre-wrap text-right text-[12px] text-foreground">
											{item.report.impression}
										</p>
									</div>
								)}
							</div>
						)}

						{/* ملاحظة المراجع */}
						<div className="space-y-1.5">
							{/* جسم الحوار LTR — نعكس الصف ليطابق ترتيب نماذج الإنشاء */}
							<FieldLabel className="flex-row-reverse">
								<span className="text-[12px] font-medium text-foreground">
									ملاحظة المراجع (اختياري)
								</span>
							</FieldLabel>
							<Textarea
								value={note}
								onChange={(e) => setNote(e.target.value)}
								disabled={isPending}
								placeholder="ملاحظة تُسجَّل في سجل النشاط مع الاعتماد"
								className="min-h-20 text-right"
							/>
						</div>
					</div>

					{/* Footer — RTL: الزر الرئيسي يمين */}
					<div className="flex items-center gap-2 border-t p-3">
						<Button
							type="submit"
							className="bg-emerald-500 primaryhover:bg-emerald-600"
							disabled={isPending}
						>
							<IconCircleCheck className="size-4" />
							اعتماد التقرير
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							إلغاء
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
