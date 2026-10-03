import { IconBone, IconChevronLeft, IconShoppingCart, IconX } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { OrderReceiveSheet } from "@/features/inventory/components/order-receive-sheet";
import { OrderTrackingSheet } from "@/features/inventory/components/order-tracking-sheet";
import { PurchaseRequestSheet } from "@/features/inventory/components/purchase-request-sheet";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { usePurchaseOrders } from "@/features/inventory/hooks/use-purchase-orders";
import type { InventoryResponse } from "@/server/inventory/inventory.type";
import type { PurchaseOrderResponse } from "@/server/purchasing/purchasing.type";

interface StockAlertsSheetProps {
	open: boolean;
	onClose: () => void;
	/** يفتح سلسلة الشراء لتجديد المخزون */
	onRestock?: () => void;
}

export function StockAlertsSheet({ open, onClose, onRestock }: StockAlertsSheetProps) {
	const { inventory } = useInventory();
	const { purchaseOrders } = usePurchaseOrders();
	const [restockItem, setRestockItem] = useState<InventoryResponse | null>(null);
	const [trackingOrder, setTrackingOrder] = useState<PurchaseOrderResponse | null>(null);
	const [receiveOrder, setReceiveOrder] = useState<PurchaseOrderResponse | null>(null);

	// المنتجات تحت الحد الأدنى أو نفدت
	const lowItems = inventory.filter((i: InventoryResponse) => i.stock <= i.reorderPoint);

	// أحدث أمر شراء مفتوح لكل منتج — مصدره قاعدة البيانات فيبقى بعد إعادة التحميل
	const orderByItem = useMemo(() => {
		const map = new Map<string, PurchaseOrderResponse>();
		for (const po of purchaseOrders) {
			if (po.status === "CANCELLED" || po.status === "RECEIVED") continue;
			for (const line of po.items) {
				if (!map.has(line.itemId)) map.set(line.itemId, po);
			}
		}
		return map;
	}, [purchaseOrders]);

	// "تجديد الكل" يفتح سلسلة الشراء الكاملة
	const restockAll = () => {
		onRestock?.();
		onClose();
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[605px]!"
			>
				{/* الهيدر */}
				<div
					className="flex items-center justify-between border-b px-4 py-2"
					dir="rtl"
				>
					<SheetTitle className="text-[13px] font-bold text-[#08090A]">
						تنبيهات المخزون
					</SheetTitle>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						type="button"
					>
						<IconX className="size-4" />
					</Button>
				</div>

				{/* القائمة */}
				<div
					className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 pt-4"
					dir="rtl"
				>
					{lowItems.length === 0 && (
						<div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
							<span className="flex size-12 items-center justify-center rounded-full bg-emerald-50">
								<IconBone className="size-6 text-emerald-500" />
							</span>
							<p className="text-sm font-medium text-[#08090A]">المخزون بحالة جيدة</p>
							<p className="text-xs text-muted-foreground">
								لا توجد منتجات تحت الحد الأدنى حاليًا.
							</p>
						</div>
					)}

					{lowItems.map((item) => {
						const order = orderByItem.get(item.id);
						const ordered = !!order;
						return (
							<div
								key={item.id}
								className="flex items-center justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] px-3 py-2.5"
							>
								{/* يمين: الأيقونة على أقصى اليمين ثم التفاصيل على يسارها — RTL */}
								<div className="flex items-center gap-2">
									<span className="flex size-[27px] items-center justify-center rounded-[4px] bg-[#F5F5F6]">
										<IconBone className="size-[14px] text-[#A3A8B0]" />
									</span>
									<div className="flex flex-col items-start gap-1 text-right">
										<span className="text-[12px] font-medium text-[#08090A]">{item.name}</span>
										{ordered ? (
											<span className="text-[11px] text-[#008A2E]">
												تم الطلب وجاري التجديد
											</span>
										) : (
											<span className="text-[11px] text-[#DC2626]">
												متبقي: {item.stock} · نقطة الإعادة: {item.reorderPoint}
											</span>
										)}
									</div>
								</div>

								{/* يسار: طلب الشراء أو تتبع حالة الطلب بعد الإرسال — مطابق Figma */}
								{ordered ? (
									<button
										type="button"
										onClick={() => setTrackingOrder(order ?? null)}
										className="flex h-[22px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#4F6AE0] px-[5px] text-[9px] font-medium text-[#4F6AE0]"
									>
										<IconChevronLeft className="size-[9px] text-[#4F6AE0]" />
										تتبع حالة الطلب
									</button>
								) : (
									<button
										type="button"
										onClick={() => setRestockItem(item)}
										className="flex h-[22px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[5px] text-[9px] font-medium text-[#08090A]"
									>
										<IconShoppingCart className="size-[9px] text-[#08090A]" />
										طلب شراء
									</button>
								)}
							</div>
						);
					})}
				</div>

				{/* الفوتر */}
				<div
					className="flex items-center justify-between border-t px-4 py-2"
					dir="ltr"
				>
					<Button
						size="sm"
						onClick={restockAll}
						disabled={lowItems.length === 0}
					>
						تجديد الكل
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
					>
						إلغاء
					</Button>
				</div>
			</SheetContent>

			<PurchaseRequestSheet
				product={restockItem}
				onClose={() => setRestockItem(null)}
			/>

			<OrderTrackingSheet
				order={trackingOrder}
				onClose={() => setTrackingOrder(null)}
				onReceive={() => {
					setReceiveOrder(trackingOrder);
					setTrackingOrder(null);
				}}
			/>

			<OrderReceiveSheet
				order={receiveOrder}
				open={!!receiveOrder}
				onClose={() => setReceiveOrder(null)}
				onReceived={() => setReceiveOrder(null)}
			/>
		</Sheet>
	);
}
