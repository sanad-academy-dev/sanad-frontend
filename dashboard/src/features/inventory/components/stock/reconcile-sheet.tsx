import { IconClipboardCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useReconcile } from "@/features/inventory/hooks/use-reconcile";
import { useWarehouseBins } from "@/features/inventory/hooks/use-warehouse-bins";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import { cn } from "@/lib/utils";

interface ReconcileSheetProps {
	open: boolean;
	onClose: () => void;
}

export function ReconcileSheet({ open, onClose }: ReconcileSheetProps) {
	const { warehouses } = useWarehouses();
	const [warehouseId, setWarehouseId] = useState("");
	const { bins, isLoading } = useWarehouseBins(warehouseId || undefined);
	const { reconcile, isPending } = useReconcile();
	const [actual, setActual] = useState<Record<string, number>>({});
	const [reason, setReason] = useState("");

	// تهيئة الكمية الفعلية = الدفترية عند تحميل الأرصدة
	useEffect(() => {
		const init: Record<string, number> = {};
		for (const b of bins) init[b.itemId] = b.qty;
		setActual(init);
	}, [bins]);

	useEffect(() => {
		if (!open) {
			setWarehouseId("");
			setActual({});
			setReason("");
		}
	}, [open]);

	const diffCount = bins.filter((b) => (actual[b.itemId] ?? b.qty) !== b.qty).length;

	const handleSubmit = async () => {
		if (!warehouseId) return;
		const lines = bins.map((b) => ({
			itemId: b.itemId,
			actualQty: actual[b.itemId] ?? b.qty,
		}));
		await reconcile({ warehouseId, reason: reason || undefined, lines });
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
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[600px]!"
			>
				<div
					className="flex items-center justify-between border-b px-4 py-2"
					dir="rtl"
				>
					<SheetTitle className="flex items-center gap-1.5 text-base font-semibold">
						<IconClipboardCheck className="size-4 text-[#6366F1]" />
						جرد وتسوية المخزون
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

				<div
					className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
					dir="rtl"
				>
					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium">المستودع</Label>
						<Select
							value={warehouseId}
							onValueChange={setWarehouseId}
							dir="rtl"
							disabled={isPending}
						>
							<SelectTrigger className="text-sm">
								<SelectValue placeholder="اختر المستودع للجرد..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{warehouses.map((w) => (
									<SelectItem
										key={w.id}
										value={w.id}
									>
										{w.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{warehouseId && (
						<>
							<Separator />
							<div className="grid grid-cols-[1fr_80px_92px_72px] gap-2 text-[11px] text-muted-foreground">
								<span>المنتج</span>
								<span className="text-center">الدفترية</span>
								<span className="text-center">الفعلية</span>
								<span className="text-center">الفرق</span>
							</div>

							{isLoading && <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>}
							{!isLoading && bins.length === 0 && (
								<p className="text-sm text-muted-foreground">لا توجد أصناف في هذا المستودع.</p>
							)}

							<div className="flex flex-col gap-2">
								{bins.map((b) => {
									const a = actual[b.itemId] ?? b.qty;
									const diff = a - b.qty;
									return (
										<div
											key={b.id}
											className="grid grid-cols-[1fr_80px_92px_72px] items-center gap-2"
										>
											<span className="text-sm">{b.item.name}</span>
											<span className="text-center text-sm tabular-nums text-muted-foreground">
												{b.qty}
											</span>
											<Input
												type="number"
												min={0}
												value={a}
												onChange={(e) =>
													setActual((p) => ({
														...p,
														[b.itemId]: Math.max(0, Number(e.target.value) || 0),
													}))
												}
												disabled={isPending}
												className="h-8 text-center text-sm"
											/>
											<span
												className={cn(
													"text-center text-sm font-semibold tabular-nums",
													diff > 0
														? "text-emerald-600"
														: diff < 0
															? "text-red-600"
															: "text-muted-foreground",
												)}
											>
												{diff > 0 ? `+${diff}` : diff}
											</span>
										</div>
									);
								})}
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">سبب التسوية</Label>
								<Textarea
									placeholder="مثال: جرد ربع سنوي، تلف، فروقات تسليم..."
									className="min-h-14 resize-none text-sm"
									value={reason}
									onChange={(e) => setReason(e.target.value)}
									disabled={isPending}
								/>
							</div>
						</>
					)}
				</div>

				<div
					className="flex items-center gap-2 border-t px-4 py-2"
					dir="ltr"
				>
					<Button
						onClick={handleSubmit}
						size="sm"
						disabled={isPending || !warehouseId || diffCount === 0}
					>
						<IconClipboardCheck className="size-3.5" />
						تسجيل التسوية ({diffCount})
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isPending}
					>
						إلغاء
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
