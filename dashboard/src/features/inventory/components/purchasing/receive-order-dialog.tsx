import { IconTruckDelivery } from "@tabler/icons-react";
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
import { usePurchaseOrderMutations } from "@/features/inventory/hooks/use-purchase-order-mutations";
import type { PurchaseOrderResponse } from "@/server/purchasing/purchasing.type";

interface ReceiveOrderDialogProps {
	order: PurchaseOrderResponse | null;
	onClose: () => void;
}

export function ReceiveOrderDialog({ order, onClose }: ReceiveOrderDialogProps) {
	const { receivePurchaseOrder, isReceiving } = usePurchaseOrderMutations();
	const [qty, setQty] = useState<Record<string, number>>({});
	const [batchNo, setBatchNo] = useState<Record<string, string>>({});
	const [expiry, setExpiry] = useState<Record<string, string>>({});

	// تهيئة الكميات الافتراضية = المتبقّي لكل سطر
	useEffect(() => {
		if (!order) return;
		const init: Record<string, number> = {};
		for (const it of order.items) init[it.itemId] = it.qtyOrdered - it.qtyReceived;
		setQty(init);
		setBatchNo({});
		setExpiry({});
	}, [order]);

	const handleReceive = async () => {
		if (!order) return;
		const lines = order.items.map((it) => ({
			itemId: it.itemId,
			qty: qty[it.itemId] ?? 0,
			...(it.item.tracksBatches
				? {
						batchNo: batchNo[it.itemId] || undefined,
						expiryDate: expiry[it.itemId] || undefined,
					}
				: {}),
		}));
		await receivePurchaseOrder(order.id, { lines });
		onClose();
	};

	const totalToReceive = order
		? order.items.reduce((s, it) => s + (qty[it.itemId] ?? 0), 0)
		: 0;

	return (
		<Dialog
			open={!!order}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				className="gap-0 p-0 sm:max-w-[560px]! rounded-[4px]"
				dir="rtl"
			>
				<DialogHeader className="border-b border-[#E5E5E5] px-4 py-3 space-y-0">
					<DialogTitle className="flex items-center gap-1.5 text-sm font-semibold">
						<IconTruckDelivery className="size-4 text-[#6366F1]" />
						استلام أمر شراء {order?.code}
					</DialogTitle>
					<DialogDescription className="sr-only">
						تسجيل الكميات المستلمة لأمر الشراء
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-2 px-4 py-3">
					<div className="grid grid-cols-[1fr_80px_80px_92px] gap-2 text-[11px] text-muted-foreground">
						<span>المنتج</span>
						<span className="text-center">مطلوب</span>
						<span className="text-center">مستلم</span>
						<span className="text-center">استلام الآن</span>
					</div>
					{order?.items.map((it) => {
						const remaining = it.qtyOrdered - it.qtyReceived;
						return (
							<div
								key={it.id}
								className="flex flex-col gap-1.5 border-b border-dashed border-[#EEE] pb-2 last:border-0"
							>
								<div className="grid grid-cols-[1fr_80px_80px_92px] items-center gap-2">
									<span className="text-sm">{it.item.name}</span>
									<span className="text-center text-sm tabular-nums">{it.qtyOrdered}</span>
									<span className="text-center text-sm tabular-nums text-muted-foreground">
										{it.qtyReceived}
									</span>
									<Input
										type="number"
										min={0}
										max={remaining}
										value={qty[it.itemId] ?? 0}
										onChange={(e) =>
											setQty((p) => ({
												...p,
												[it.itemId]: Math.max(
													0,
													Math.min(remaining, Number(e.target.value) || 0),
												),
											}))
										}
										disabled={isReceiving || remaining === 0}
										className="h-8 text-center text-sm"
									/>
								</div>
								{it.item.tracksBatches && (
									<div className="grid grid-cols-2 gap-2 pr-1">
										<Input
											placeholder="رقم الدفعة"
											value={batchNo[it.itemId] ?? ""}
											onChange={(e) =>
												setBatchNo((p) => ({ ...p, [it.itemId]: e.target.value }))
											}
											disabled={isReceiving || remaining === 0}
											className="h-8 text-sm"
										/>
										<Input
											type="date"
											value={expiry[it.itemId] ?? ""}
											onChange={(e) =>
												setExpiry((p) => ({ ...p, [it.itemId]: e.target.value }))
											}
											disabled={isReceiving || remaining === 0}
											className="h-8 text-sm"
										/>
									</div>
								)}
							</div>
						);
					})}
				</div>

				<div className="flex items-center justify-between border-t border-[#E5E5E5] px-4 py-3">
					<Button
						onClick={handleReceive}
						disabled={isReceiving || totalToReceive <= 0}
						size="sm"
					>
						<IconTruckDelivery className="size-3.5" />
						تأكيد الاستلام ({totalToReceive})
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isReceiving}
					>
						إلغاء
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
