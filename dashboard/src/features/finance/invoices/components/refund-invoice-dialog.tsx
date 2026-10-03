import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RefundInvoiceDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (reason: string) => void;
	isPending: boolean;
	invoiceCode: string;
}

// الحدّ نفسه المفروض على الخادم (invoices.refund) — سطر أطول أو أقصر يُرفض هناك،
// فالتحقّق هنا للراحة لا للأمان
const MIN_REASON = 3;

/**
 * [P12B.1] ردّ فاتورة مدفوعة. يفترق عن حوار الإلغاء في أمرين مقصودين: السبب مطلوب
 * (يُقرأ في أثر التدقيق وفي عكس القيد)، والنصّ يقول صراحةً إن الأثر المحاسبي يُعكَس
 * ولا يُمحى — فالمستخدم يعرف أن الفاتورة تبقى في السجل.
 */
export function RefundInvoiceDialog({
	open,
	onClose,
	onConfirm,
	isPending,
	invoiceCode,
}: RefundInvoiceDialogProps) {
	const [reason, setReason] = useState("");
	const [touched, setTouched] = useState(false);
	const tooShort = reason.trim().length < MIN_REASON;

	const close = () => {
		setReason("");
		setTouched(false);
		onClose();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => !v && close()}
		>
			<DialogContent
				dir="rtl"
				className="max-w-sm"
			>
				<DialogHeader>
					<DialogTitle>استرجاع الفاتورة {invoiceCode}</DialogTitle>
					<DialogDescription>
						ستُسجَّل الفاتورة «مسترجعة» ويبقى المستند في السجل. يُعكَس أثرها المحاسبي بقيد مضاد عند
						تشغيل محول فواتير الأكاديمية — لا يُحذف القيد الأصلي.
					</DialogDescription>
				</DialogHeader>

				<Field data-invalid={touched && tooShort}>
					<Label htmlFor="refund-reason">سبب الاسترجاع</Label>
					<Textarea
						id="refund-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						onBlur={() => setTouched(true)}
						disabled={isPending}
						maxLength={500}
						rows={3}
						placeholder="مثال: خطأ في التحصيل، أو طلب العميل إلغاء الدورة بعد الدفع"
						aria-invalid={touched && tooShort}
					/>
					{touched && tooShort ? (
						<FieldError errors={[{ message: "اذكر سبب الاسترجاع" }]} />
					) : null}
				</Field>

				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={close}
						disabled={isPending}
					>
						تراجع
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							setTouched(true);
							if (tooShort) return;
							onConfirm(reason.trim());
						}}
						disabled={isPending || tooShort}
					>
						تأكيد الاسترجاع
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
