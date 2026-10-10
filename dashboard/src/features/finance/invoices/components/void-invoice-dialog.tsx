import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface VoidInvoiceDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isPending: boolean;
	invoiceCode: string;
}

export function VoidInvoiceDialog({
	open,
	onClose,
	onConfirm,
	isPending,
	invoiceCode,
}: VoidInvoiceDialogProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(v) => !v && onClose()}
		>
			<DialogContent
				dir="rtl"
				className="max-w-sm"
			>
				<DialogHeader>
					<DialogTitle>إلغاء الفاتورة {invoiceCode}</DialogTitle>
					<DialogDescription>
						هذا الإجراء لا يمكن التراجع عنه. سيتم تغيير حالة الفاتورة إلى "ملغاة" ولن تُحتسب في
						الإيرادات.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isPending}
					>
						تراجع
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isPending}
					>
						إلغاء الفاتورة
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
