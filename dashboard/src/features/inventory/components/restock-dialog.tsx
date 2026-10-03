import {
	IconBell,
	IconCalendar,
	IconChevronDown,
	IconShoppingCart,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { usePurchaseOrderMutations } from "@/features/inventory/hooks/use-purchase-order-mutations";
import { useSuppliers } from "@/features/inventory/hooks/use-suppliers";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

interface RestockDialogProps {
	product: InventoryResponse | null;
	onClose: () => void;
}

const money = (n: number) =>
	`${n.toLocaleString("ar-EG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ر.س`;

const dayFmt = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" });

export function RestockDialog({ product, onClose }: RestockDialogProps) {
	const { suppliers } = useSuppliers();
	const { warehouses } = useWarehouses();
	const { createPurchaseOrderAsync, isCreating } = usePurchaseOrderMutations();

	const [qty, setQty] = useState(1);
	const [supplierId, setSupplierId] = useState("");
	const [warehouseId, setWarehouseId] = useState("");
	const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
	const [supplierOpen, setSupplierOpen] = useState(false);
	const [dateOpen, setDateOpen] = useState(false);
	const [notify, setNotify] = useState(false);

	const selectedSupplier = suppliers.find((s) => s.id === supplierId);

	const cost = product ? Number(product.valuationRate) || Number(product.unitCost ?? 0) : 0;
	const total = qty * cost;

	// كمية مقترحة: ما يكفي للوصول للحد الأقصى أو ضعف نقطة الإعادة
	useEffect(() => {
		if (!product) return;
		const target = product.maxQuantity ?? product.reorderPoint * 2;
		setQty(Math.max(1, target - product.stock));
		setSupplierId("");
		setDeliveryDate(undefined);
		setNotify(false);
	}, [product]);

	useEffect(() => {
		const def = warehouses.find((w) => w.isDefault) ?? warehouses[0];
		if (def) setWarehouseId(def.id);
	}, [warehouses]);

	const submit = async () => {
		if (!product || !supplierId || !warehouseId || qty < 1) return;
		try {
			await createPurchaseOrderAsync({
				supplierId,
				warehouseId,
				lines: [{ itemId: product.id, qtyOrdered: qty, unitCost: cost }],
			});
			toast.success(
				`تم إرسال طلب تجديد مخزون لشركة (${selectedSupplier?.legalName ?? ""}) بنجاح`,
				{ position: "bottom-left" },
			);
			onClose();
		} catch (e) {
			toast.error((e as Error).message || "فشل إرسال الطلب", { position: "bottom-left" });
		}
	};

	return (
		<Dialog
			open={!!product}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				className="gap-0 p-0 sm:max-w-[620px]! rounded-[4px]"
				showCloseButton={false}
				dir="rtl"
			>
				{/* الهيدر */}
				<DialogHeader className="flex-row items-center justify-between border-b border-[#E5E5E5] px-3 py-2 space-y-0">
					<DialogTitle className="flex items-center gap-1.5 text-[11px]">
						<IconShoppingCart className="size-3.5 text-[#08090A]" />
						<span className="font-bold text-[#08090A]">طلب تجديد مخزون</span>
						<span className="font-normal text-[#9B9B9D]">· {product?.name}</span>
					</DialogTitle>
					<DialogDescription className="sr-only">
						إنشاء طلب شراء لتجديد المخزون
					</DialogDescription>
					<button
						type="button"
						onClick={onClose}
						className="flex size-[18px] items-center justify-center rounded-[4px]"
					>
						<IconX className="size-3.5 text-[#9B9B9D]" />
					</button>
				</DialogHeader>

				{/* الجسم */}
				<div
					className="flex flex-col gap-1.5 px-4 py-3"
					dir="rtl"
				>
					{/* سطر المنتج — الاسم يمين، الكمية وسط، التكلفة يسار */}
					<div
						className="flex items-center gap-3 rounded-[4px] border-[0.75px] border-[#E5E7EB] p-2.5"
						dir="rtl"
					>
						{/* المنتج + المورد (يمين) */}
						<div className="flex flex-1 flex-col items-start text-right">
							<span className="text-[12px] font-medium text-[#1F2937]">{product?.name}</span>
							<span className="text-[11px] text-[#6B7280]">
								{product?.supplier || "—"} · {product?.code}
							</span>
						</div>
						{/* الكمية (وسط) */}
						<div className="flex w-[115px] flex-col gap-1">
							<span className="text-right text-[11px] text-[#6B7280]">الكمية</span>
							<Input
								type="number"
								min={1}
								value={qty}
								onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
								disabled={isCreating}
								className="h-[26px] text-center text-sm"
							/>
						</div>
						{/* التكلفة (يسار) */}
						<div className="flex flex-col">
							<span className="text-[11px] text-[#6B7280]">التكلفة</span>
							<span className="text-[12px] font-medium text-[#506AE0]">{money(total)}</span>
						</div>
					</div>

					{/* الإجمالي — التسمية يمين والقيمة يسار */}
					<div
						className="flex items-center justify-between rounded-[4px] bg-[#F3F4F6] p-2.5"
						dir="rtl"
					>
						<span className="text-[12px] font-medium text-[#1F2937]">إجمالي الطلب</span>
						<span className="text-[15px] font-bold text-[#506AE0]">{money(total)}</span>
					</div>

					{/* تاريخ التسليم + إسناد إلى مورد (يمين) */}
					<div
						className="mt-1 flex items-center justify-start gap-2"
						dir="rtl"
					>
						{/* إسناد إلى مورد — دروب داون مخصّص */}
						<Popover
							open={supplierOpen}
							onOpenChange={setSupplierOpen}
						>
							<PopoverTrigger asChild>
								<button
									type="button"
									disabled={isCreating}
									className="flex h-[26px] items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 text-[11px] text-[#1F2937]"
								>
									<IconChevronDown className="size-3 text-[#575759]" />
									<span className={selectedSupplier ? "text-[#1F2937]" : "text-[#737373]"}>
										{selectedSupplier ? selectedSupplier.legalName : "إسناد إلى مورد..."}
									</span>
								</button>
							</PopoverTrigger>
							<PopoverContent
								align="end"
								dir="rtl"
								className="w-[315px] rounded-[4px] p-2.5"
							>
								<p className="px-2 pb-2 text-right text-[11px] text-[#08090A]">
									إسناد طلب تجديد مخزون إلى...
								</p>
								<div className="h-px w-full bg-[#E5E5E5]" />
								<div className="mt-1.5 flex flex-col gap-1">
									{suppliers.length === 0 && (
										<p className="px-2 py-3 text-center text-[11px] text-muted-foreground">
											لا يوجد موردون.
										</p>
									)}
									{suppliers.map((s) => {
										const active = s.id === supplierId;
										return (
											<button
												key={s.id}
												type="button"
												onClick={() => {
													setSupplierId(s.id);
													setSupplierOpen(false);
												}}
												className={`flex items-center justify-between rounded-[4px] px-2 py-1.5 ${
													active ? "bg-[#F2F2F2]" : ""
												}`}
											>
												<span className="flex items-center gap-1.5">
													<span className="flex size-[18px] items-center justify-center rounded-full bg-[#4F6AE0] text-[9px] text-white">
														{s.legalName.trim().slice(0, 2)}
													</span>
													<span className="text-[10px] font-medium text-[#000]">
														{s.legalName}
													</span>
												</span>
												<span className="rounded-[4px] bg-[#6366F1]/[0.125] px-1.5 py-1 text-[10px] text-[#5B6ABF]">
													خلال 3 أيام عمل
												</span>
											</button>
										);
									})}
								</div>
							</PopoverContent>
						</Popover>

						{/* تاريخ التسليم */}
						<Popover
							open={dateOpen}
							onOpenChange={setDateOpen}
						>
							<PopoverTrigger asChild>
								<button
									type="button"
									disabled={isCreating}
									className="flex h-[26px] items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 text-[10px] text-[#737373]"
								>
									<IconCalendar className="size-3.5 text-[#737373]" />
									{deliveryDate ? dayFmt.format(deliveryDate) : "تاريخ التسليم"}
								</button>
							</PopoverTrigger>
							<PopoverContent
								align="start"
								className="w-auto p-0"
							>
								<Calendar
									mode="single"
									selected={deliveryDate}
									onSelect={(d) => {
										setDeliveryDate(d);
										setDateOpen(false);
									}}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				{/* الفوتر */}
				<div
					className="flex items-center justify-between border-t border-[#E5E5E5] px-3 py-2.5"
					dir="rtl"
				>
					<Button
						size="sm"
						onClick={submit}
						disabled={isCreating || !supplierId || !warehouseId || qty < 1}
					>
						<IconShoppingCart className="size-3.5" />
						إرسال طلب
					</Button>
					<button
						type="button"
						onClick={() => setNotify((v) => !v)}
						className="flex items-center gap-2 text-[10px] text-[#737373]"
					>
						<IconBell className="size-3.5" />
						إشعار عبر البريد
						<Switch
							checked={notify}
							onCheckedChange={setNotify}
						/>
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
