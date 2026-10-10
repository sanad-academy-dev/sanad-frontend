import {
	IconAlertCircle,
	IconArrowsDiagonal,
	IconBan,
	IconInfoCircle,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { SubmittedExpenseRequest } from "@/features/finance/expenses/data/expense-review";

// ملاحظة RTL: التصميم LTR بمحاذاة نص يمينية (على نمط حوار الحذف). نضع dir="ltr" على
// الغلاف الداخلي (لا على DialogContent حتى يبقى التوسيط)، والتذييل RTL.

export function CancelExpenseRequestDialog({
	open,
	onOpenChange,
	request,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: SubmittedExpenseRequest;
	onConfirm: (reason: string) => void;
}) {
	const title = request.title.replace("مراجعة ", "");
	const [reason, setReason] = useState("");

	useEffect(() => {
		if (!open) return;
		setReason("");
	}, [open]);

	const canConfirm = reason.trim().length > 0;

	const handleConfirm = () => {
		if (!canConfirm) return;
		onConfirm(reason.trim());
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
				<DialogTitle className="sr-only">إلغاء طلب مصروف</DialogTitle>

				<div
					dir="ltr"
					className="flex max-h-[85vh] flex-col"
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
							<span className="text-muted-foreground">مراجعة {title}</span>
							<span className="text-muted-foreground">›</span>
							<span className="flex items-center gap-1 text-rose-600">
								<IconBan className="size-3.5" />
								إلغاء طلب مصروف
							</span>
						</div>
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto p-3">
						{/* Intro */}
						<p className="text-right text-[13px] text-foreground">
							هل أنت متأكد من إلغاء طلب (<span className="font-semibold">مراجعة {title}</span>)
							؟ سيتم إيقاف مسار الموافقات بالكامل ولا يمكن استئنافه إلا بإعادة إرسال الطلب.
						</p>

						{/* Reason — مطلوب */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-end gap-1.5">
								<span className="rounded-[4px] bg-rose-600/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-rose-600">
									مطلوب
								</span>
								<span className="text-[12px] font-medium text-foreground">سبب الإلغاء</span>
								<IconInfoCircle className="size-3.5 text-muted-foreground" />
							</div>
							<Textarea
								autoFocus
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder="اكتب سبب إلغاء الطلب..."
								className="min-h-24 text-right"
							/>
						</div>

						{/* Consequences box */}
						<div className="space-y-2 rounded-[4px] border border-rose-200 bg-rose-50/60 p-3">
							<div className="flex items-center justify-end gap-1 text-[13px] font-semibold text-rose-600">
								النتائج المترتبة:
								<IconAlertCircle className="size-3.5" />
							</div>
							<ul className="space-y-1">
								{[
									"تغيير حالة الطلب إلى «ملغى» وإيقاف جميع الاعتمادات قيد التنفيذ.",
									"إشعار مقدم الطلب والمسؤولين بأن الطلب أُلغي مع سببه.",
									// [P12A-fix5] النتيجة المحاسبية تُذكر صراحةً للمصروف المدفوع: الإلغاء هو
									// مُطلِق عكس القيد (AR-2)، والعكس إضافي لا يمحو شيئًا.
									...(request.status === "paid"
										? [
												"عكس القيد المحاسبي عند تشغيل محول المصروفات — قيد عكسي جديد يُلغي الأثر دون حذف أي حركة (AR-2).",
											]
										: []),
								].map((line) => (
									<li
										key={line}
										className="flex items-center justify-end gap-1.5 text-[12px] text-rose-600/90"
									>
										{line}
										<IconAlertCircle className="size-3 shrink-0" />
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Footer — RTL: زر الإلغاء يمين، والتذكير يساره */}
					<div
						dir="rtl"
						className="flex items-center gap-2 border-t p-3"
					>
						<Button
							type="button"
							variant="destructive"
							disabled={!canConfirm}
							onClick={handleConfirm}
						>
							<IconBan className="size-4" />
							إلغاء الطلب
						</Button>
						<span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
							<Switch size="sm" />
							ارسل اشعار
						</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
