import { IconPlayerPause } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HoldPurchaseInvoiceFormInput } from "@/server/accounting/purchase-invoice/purchase-invoice.type";

/**
 * [P6.3/P6.5] «تعليق الدفع» (BR-7.3.2) — a small Dialog per CONTRACT §4.2 (a two-field
 * prompt is not a Sheet-sized form). Collects the mandatory hold reason and the optional
 * future release date; the flag filters payable pulls without touching settlement truth.
 */
export type PurchaseInvoiceHoldDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** the document number shown in the title (null for drafts — never reachable here) */
	documentNo: string | null;
	onConfirm: (input: HoldPurchaseInvoiceFormInput) => void;
	isPending?: boolean;
};

export const PurchaseInvoiceHoldDialog = ({
	open,
	onOpenChange,
	documentNo,
	onConfirm,
	isPending = false,
}: PurchaseInvoiceHoldDialogProps) => {
	const [holdComment, setHoldComment] = useState("");
	const [releaseDate, setReleaseDate] = useState("");

	useEffect(() => {
		if (open) {
			setHoldComment("");
			setReleaseDate("");
		}
	}, [open]);

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="sm:max-w-sm"
			>
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
							<IconPlayerPause className="size-5 text-muted-foreground" />
						</div>
						<DialogTitle>تعليق {documentNo ?? "الفاتورة"}؟</DialogTitle>
					</div>
					<DialogDescription>
						الفاتورة المعلّقة تُستبعد من سحب المدفوعات حتى الإفراج عنها أو مرور تاريخ الإفراج
						(BR-7.3.2) — رصيدها وحالتها لا يتغيران.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-3">
					<Field>
						<Label htmlFor="pi-hold-comment">
							سبب التعليق <span className="text-rose-500">*</span>
						</Label>
						<Input
							id="pi-hold-comment"
							value={holdComment}
							onChange={(event) => setHoldComment(event.target.value)}
							disabled={isPending}
						/>
					</Field>
					<Field>
						<Label htmlFor="pi-hold-release">تاريخ الإفراج (اختياري — مستقبلي)</Label>
						<Input
							id="pi-hold-release"
							dir="ltr"
							type="date"
							value={releaseDate}
							onChange={(event) => setReleaseDate(event.target.value)}
							disabled={isPending}
						/>
					</Field>
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						onClick={() =>
							onConfirm({
								holdComment: holdComment.trim(),
								releaseDate: releaseDate === "" ? null : releaseDate,
							})
						}
						disabled={isPending || holdComment.trim() === ""}
					>
						تعليق الدفع
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
