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

interface RefundSaleDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (reason: string) => void;
	isPending: boolean;
	saleCode: string;
}

// نفس حدّ الخادم (sales.refund)
const MIN_REASON = 3;

/**
 * [P12B.2] إرجاع بيع نقطة بيع. النصّ يذكر إعادة المخزون صراحةً لأنها أثر مادّي
 * يقع فورًا — لا تأجيل فيه ولا تراجع عنه.
 */
export function RefundSaleDialog({
	open,
	onClose,
	onConfirm,
	isPending,
	saleCode,
}: RefundSaleDialogProps) {
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
					<DialogTitle>إرجاع الفاتورة {saleCode}</DialogTitle>
					<DialogDescription>
						تعود أصناف الفاتورة إلى المخزون فورًا (إلى نفس المستودع والدفعات التي خرجت منها)،
						وتُسجَّل الفاتورة «مُرتجَعة». لا يمكن التراجع عن هذا الإجراء.
					</DialogDescription>
				</DialogHeader>

				<Field data-invalid={touched && tooShort}>
					<Label htmlFor="sale-refund-reason">سبب الإرجاع</Label>
					<Textarea
						id="sale-refund-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						onBlur={() => setTouched(true)}
						disabled={isPending}
						maxLength={500}
						rows={3}
						placeholder="مثال: العميل أعاد المنتج، أو خطأ في الصنف المُباع"
						aria-invalid={touched && tooShort}
					/>
					{touched && tooShort ? (
						<FieldError errors={[{ message: "اذكر سبب الإرجاع" }]} />
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
						تأكيد الإرجاع
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
