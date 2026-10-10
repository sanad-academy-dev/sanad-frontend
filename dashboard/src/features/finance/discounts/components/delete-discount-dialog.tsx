import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { DiscountResponse } from "@/server/discounts/discounts.type";

export function DeleteDiscountDialog({
	discount,
	onOpenChange,
	onConfirm,
	isDeleting,
}: {
	discount: DiscountResponse | null;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isDeleting: boolean;
}) {
	return (
		<Dialog
			open={!!discount}
			onOpenChange={onOpenChange}
		>
			<DialogContent dir="rtl">
				<DialogHeader>
					<DialogTitle>حذف الخصم</DialogTitle>
					<DialogDescription>
						هل أنت متأكد من حذف الخصم «{discount?.name}»؟ لا يمكن التراجع عن هذا الإجراء.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:justify-start">
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
					>
						حذف
					</Button>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
					>
						إلغاء
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
