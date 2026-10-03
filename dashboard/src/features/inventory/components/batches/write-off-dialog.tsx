import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWriteOffBatch } from "@/features/inventory/hooks/use-write-off-batch";
import type { StockBatchResponse } from "@/server/stock/stock.type";

interface WriteOffDialogProps {
	batch: StockBatchResponse | null;
	onClose: () => void;
}

export function WriteOffDialog({ batch, onClose }: WriteOffDialogProps) {
	const { writeOffBatch, isPending } = useWriteOffBatch();
	const [qty, setQty] = useState(0);
	const [reason, setReason] = useState("");

	useEffect(() => {
		if (batch) {
			setQty(batch.qty);
			setReason("");
		}
	}, [batch]);

	const handleWriteOff = async () => {
		if (!batch) return;
		await writeOffBatch(batch.id, { qty, reason: reason || undefined });
		onClose();
	};

	return (
		<Dialog
			open={!!batch}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				className="gap-0 p-0 sm:max-w-[460px]! rounded-[4px]"
				dir="rtl"
			>
				<DialogHeader className="border-b border-[#E5E5E5] px-4 py-3 space-y-0">
					<DialogTitle className="flex items-center gap-1.5 text-sm font-semibold text-[#DC2626]">
						<IconTrash className="size-4" />
						إتلاف / صرف دفعة
					</DialogTitle>
					<DialogDescription className="sr-only">
						صرف أو إتلاف كمية من الدفعة
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3 px-4 py-3">
					{batch && (
						<p className="text-sm text-muted-foreground">
							{batch.item.name} — دفعة{" "}
							<span className="font-mono text-foreground">{batch.batchNo}</span> (الرصيد:{" "}
							{batch.qty})
						</p>
					)}
					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">الكمية المراد إتلافها</Label>
						<Input
							type="number"
							min={1}
							max={batch?.qty ?? 1}
							value={qty}
							onChange={(e) =>
								setQty(Math.max(0, Math.min(batch?.qty ?? 0, Number(e.target.value) || 0)))
							}
							disabled={isPending}
							className="text-sm"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">السبب (اختياري)</Label>
						<Textarea
							placeholder="مثال: انتهت الصلاحية، تلف..."
							className="min-h-16 resize-none text-sm"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							disabled={isPending}
						/>
					</div>
				</div>

				<div className="flex items-center gap-2 border-t border-[#E5E5E5] px-4 py-3">
					<Button
						onClick={handleWriteOff}
						disabled={isPending || qty <= 0}
						variant="destructive"
						size="sm"
					>
						<IconTrash className="size-3.5" />
						تأكيد الإتلاف
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isPending}
					>
						إلغاء
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
