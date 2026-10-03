import {
	IconArrowUp,
	IconBoxSeam,
	IconBuilding,
	IconCircleCheck,
	IconCircleX,
	IconMinus,
	IconPlus,
	IconSend,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { usePurchaseOrderMutations } from "@/features/inventory/hooks/use-purchase-order-mutations";
import type { PurchaseOrderResponse } from "@/server/purchasing/purchasing.type";

interface OrderReceiveSheetProps {
	order: PurchaseOrderResponse | null;
	open: boolean;
	onClose: () => void;
	/** يُستدعى بعد نجاح الاستلام */
	onReceived: () => void;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function OrderReceiveSheet({
	order,
	open,
	onClose,
	onReceived,
}: OrderReceiveSheetProps) {
	return (
		<Sheet
			open={open && !!order}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				dir="rtl"
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[547px]!"
			>
				{order && (
					<OrderReceiveBody
						order={order}
						onClose={onClose}
						onReceived={onReceived}
					/>
				)}
			</SheetContent>
		</Sheet>
	);
}

function OrderReceiveBody({
	order,
	onClose,
	onReceived,
}: {
	order: PurchaseOrderResponse;
	onClose: () => void;
	onReceived: () => void;
}) {
	const { receivePurchaseOrder, isReceiving } = usePurchaseOrderMutations();
	const { supplier, items } = order;

	// الكمية المتبقية للاستلام لكل سطر
	const remainingOf = (it: PurchaseOrderResponse["items"][number]) =>
		Math.max(0, it.qtyOrdered - it.qtyReceived);

	const [accepted, setAccepted] = useState<Record<string, number>>(() =>
		Object.fromEntries(items.map((it) => [it.itemId, remainingOf(it)])),
	);

	const setAcc = (itemId: string, val: number, max: number) =>
		setAccepted((prev) => ({ ...prev, [itemId]: clamp(val, 0, max) }));
	const acceptAll = () =>
		setAccepted(Object.fromEntries(items.map((it) => [it.itemId, remainingOf(it)])));
	const rejectAll = () => setAccepted(Object.fromEntries(items.map((it) => [it.itemId, 0])));

	const submit = async () => {
		try {
			await receivePurchaseOrder(order.id, {
				lines: items.map((it) => ({ itemId: it.itemId, qty: accepted[it.itemId] ?? 0 })),
			});
			onReceived();
		} catch {
			// الخطأ يظهر عبر toast.promise
		}
	};

	return (
		<>
			{/* ─── الهيدر ─── */}
			<div className="flex items-center justify-between border-b px-4 py-2">
				<SheetTitle className="text-[17px] font-semibold text-[#101828]">
					استلام المنتج
				</SheetTitle>
				<button
					type="button"
					onClick={onClose}
					className="text-[#99A1AF]"
				>
					<IconX className="size-[18px]" />
				</button>
			</div>

			<div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
				{/* ─── بطاقة المورد ─── */}
				<div className="flex items-center justify-between rounded-[4px] border border-[#F3F4F6] p-3">
					<div className="flex items-start gap-1.5">
						<IconBuilding className="size-4 shrink-0 text-[#08090A]" />
						<div className="flex flex-col items-end">
							<span className="text-[12px] text-[#08090A]">{supplier.legalName}</span>
							<span className="text-[8px] text-[#9B9B9D]">
								{[supplier.city, supplier.country].filter(Boolean).join("، ") || "—"}
							</span>
						</div>
					</div>
					<span className="text-[12px] font-medium text-[#08090A]">#{supplier.code}</span>
				</div>

				{/* ─── العنوان + قبول/رفض الكل ─── */}
				<div className="flex items-center justify-between">
					<span className="text-[14px] font-semibold text-[#101828]">المنتجات المستلمة</span>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={acceptAll}
							className="flex h-6 items-center gap-1.5 rounded-[4px] bg-[#506AE0]/10 px-3 text-[10px] font-medium text-[#506AE0]"
						>
							<IconCircleCheck className="size-3" />
							قبول الكل
						</button>
						<button
							type="button"
							onClick={rejectAll}
							className="flex h-6 items-center gap-1.5 rounded-[4px] bg-[#FAEAEA] px-3 text-[10px] font-medium text-[#EF4444]"
						>
							<IconCircleX className="size-3" />
							رفض الكل
						</button>
					</div>
				</div>

				{/* ─── جدول المنتجات ─── */}
				<div className="flex flex-col gap-3 rounded-[4px] border-[0.5px] border-[#D8D8D8] p-3">
					{/* رأس الأعمدة */}
					<div className="flex items-center justify-between rounded-[4px] bg-[#F3F4F6]/50 px-3 py-2 text-[12px] font-semibold text-[#08090A]">
						<span>اسم المنتج</span>
						<span>قبول</span>
						<span>رفض</span>
					</div>

					{items.map((it) => {
						const max = remainingOf(it);
						const acc = accepted[it.itemId] ?? 0;
						const rej = max - acc;
						const pct = max > 0 ? (acc / max) * 100 : 0;
						return (
							<div
								key={it.id}
								className="flex flex-col gap-2 border-b-[0.5px] border-[#D8D8D8] pb-3 last:border-0 last:pb-0"
							>
								<div className="flex items-center justify-between gap-2">
									{/* معلومات المنتج (يمين) */}
									<div className="flex items-center gap-2">
										<span className="flex size-[27px] items-center justify-center rounded-full bg-[#F4F4F4]">
											<IconBoxSeam className="size-3.5 text-[#A3A8B0]" />
										</span>
										<div className="flex flex-col items-end">
											<span className="text-[12px] font-medium text-[#08090A]">
												{it.item.name}
											</span>
											<span className="text-[10px] text-[#9B9B9D]">{it.item.code}</span>
										</div>
									</div>
									{/* قبول (وسط) */}
									<Stepper
										value={acc}
										max={max}
										onChange={(v) => setAcc(it.itemId, v, max)}
										onAll={() => setAcc(it.itemId, max, max)}
									/>
									{/* رفض (يسار) */}
									<Stepper
										value={rej}
										max={max}
										onChange={(v) => setAcc(it.itemId, max - v, max)}
										onAll={() => setAcc(it.itemId, 0, max)}
									/>
								</div>
								{/* شريط التقدّم */}
								<div className="flex items-center gap-2">
									<div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#F3F4F7]">
										<div
											className="absolute top-0 right-0 h-full rounded-full bg-[#506AE0]"
											style={{ width: `${pct}%` }}
										/>
									</div>
									<span className="text-[12px] font-semibold tabular-nums text-[#08090A]">
										{acc}/{max}
									</span>
								</div>
							</div>
						);
					})}
				</div>

				{/* ─── ملاحظات ─── */}
				<div className="flex flex-col gap-2">
					<span className="text-[11px] text-[#08090A]">ملاحظات</span>
					<div className="relative rounded-[4px] border-[0.75px] border-[#E5E5E5] p-2.5">
						<textarea
							placeholder="أضف ملاحظاتك قبل ارسال الطلب..."
							rows={2}
							className="w-full resize-none bg-transparent text-right text-[11px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
						/>
						<button
							type="button"
							className="absolute bottom-2.5 left-2.5 flex size-[17px] items-center justify-center rounded-full border-[0.75px] border-[#E5E5E5]"
						>
							<IconArrowUp className="size-3 text-[#9CA3AF]" />
						</button>
					</div>
				</div>
			</div>

			{/* ─── الفوتر: إلغاء (يسار) · استلام بجانبه على يمينه ─── */}
			<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
				<button
					type="button"
					onClick={submit}
					disabled={isReceiving}
					className="flex h-7 items-center gap-1.5 rounded-[4px] bg-[#506AE0] px-4 text-[12px] font-medium primarydisabled:opacity-50"
				>
					<IconSend className="size-3.5" />
					استلام
				</button>
				<button
					type="button"
					onClick={onClose}
					className="flex h-7 items-center rounded-[4px] border border-black/[0.13] bg-[#F9FAFB] px-4 text-[12px] font-medium text-[#08090A]"
				>
					إلغاء
				</button>
			</div>
		</>
	);
}

function Stepper({
	value,
	max,
	onChange,
	onAll,
}: {
	value: number;
	max: number;
	onChange: (v: number) => void;
	onAll: () => void;
}) {
	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={onAll}
				className="text-[12px] text-[#506AE0]"
			>
				الكل
			</button>
			<button
				type="button"
				onClick={() => onChange(value + 1)}
				disabled={value >= max}
				className="flex size-[18.75px] items-center justify-center rounded-[4px] border border-black/10 text-[#4A5565] disabled:opacity-40"
			>
				<IconPlus className="size-[9px]" />
			</button>
			<span className="w-[15px] text-center text-[12px] tabular-nums text-[#0A0A0A]">
				{value}
			</span>
			<button
				type="button"
				onClick={() => onChange(value - 1)}
				disabled={value <= 0}
				className="flex size-[18.75px] items-center justify-center rounded-[4px] border border-black/10 text-[#4A5565] disabled:opacity-40"
			>
				<IconMinus className="size-[9px]" />
			</button>
		</div>
	);
}
