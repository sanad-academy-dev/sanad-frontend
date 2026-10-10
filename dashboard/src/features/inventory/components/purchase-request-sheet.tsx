import {
	IconAlignRight,
	IconArrowsDiagonal,
	IconArrowUp,
	IconBold,
	IconBuildingStore,
	IconCalendar,
	IconChevronDown,
	IconChevronLeft,
	IconCircleCheckFilled,
	IconDotsVertical,
	IconDownload,
	IconFileText,
	IconMail,
	IconMapPin,
	IconMinus,
	IconMoodSmile,
	IconPaperclip,
	IconPhone,
	IconPlus,
	IconPrinter,
	IconSearch,
	IconSend,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { usePurchaseOrderMutations } from "@/features/inventory/hooks/use-purchase-order-mutations";
import { useSuppliers } from "@/features/inventory/hooks/use-suppliers";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import { cn } from "@/lib/utils";
import type { InventoryResponse } from "@/server/inventory/inventory.type";
import type { SupplierResponse } from "@/server/suppliers/suppliers.type";

interface PurchaseRequestSheetProps {
	/** المنتج القادم من تنبيه المخزون — يُضاف كأول سطر */
	product: InventoryResponse | null;
	onClose: () => void;
	/** يُستدعى بعد إرسال الطلب للمورد — لتحديث حالة تنبيه المخزون */
	onOrdered?: (order: TrackedOrder) => void;
}

const money = (n: number) =>
	`${n.toLocaleString("ar-EG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ر.س`;
const dayFmt = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" });
const unitCostOf = (p: InventoryResponse) =>
	Number(p.valuationRate) || Number(p.unitCost ?? 0);
const initials = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0])
		.join("");

const esc = (s: unknown) =>
	String(s ?? "").replace(
		/[&<>"]/g,
		(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c,
	);

interface InvoiceData {
	code: string;
	supplier: SupplierResponse;
	lines: Line[];
	deliveryDate?: Date;
	total: number;
}

// قالب فاتورة الطلب (PDF) — يحوي معلومات الطلب كاملة، يُرفق تلقائيًا مع البريد
function buildInvoiceHtml({ code, supplier, lines, deliveryDate, total }: InvoiceData) {
	const rows = lines
		.map(
			(l) => `
			<tr>
				<td>${esc(l.product.name)}</td>
				<td class="num">${esc(l.product.sku || l.product.code)}</td>
				<td class="num">${l.qty} وحدة</td>
				<td class="num">${esc(money(unitCostOf(l.product)))}</td>
				<td class="num">${esc(money(l.qty * unitCostOf(l.product)))}</td>
			</tr>`,
		)
		.join("");
	return `<!doctype html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>فاتورة الطلب #${esc(code)}</title>
<style>
	* { box-sizing: border-box; margin: 0; padding: 0; }
	body { font-family: "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif; color: #08090A; padding: 32px; }
	.head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
	.title { font-size: 20px; font-weight: 700; }
	.code { font-size: 13px; color: #6A7282; margin-top: 4px; }
	.date { font-size: 13px; color: #6A7282; }
	.supplier { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
	.meta { font-size: 12px; color: #6A7282; line-height: 20px; }
	table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 13px; }
	th, td { border: 0.5px solid #D8D8D8; padding: 10px 12px; text-align: right; }
	th { background: #F9FAFB; font-weight: 600; color: #5C5C5E; }
	.num { font-variant-numeric: tabular-nums; }
	.total-row td { font-weight: 700; background: #F9FAFB; }
	@media print { body { padding: 16px; } }
</style>
</head>
<body>
	<div class="head">
		<div>
			<div class="title">طلب شراء</div>
			<div class="code">#${esc(code)}</div>
		</div>
		<div class="date">${esc(deliveryDate ? dayFmt.format(deliveryDate) : dayFmt.format(new Date()))}</div>
	</div>
	<div>
		<div class="supplier">${esc(supplier.legalName)}</div>
		<div class="meta">
			${supplier.phone ? `الجوال: ${esc(supplier.phone)}<br/>` : ""}
			${supplier.email ? `البريد: ${esc(supplier.email)}<br/>` : ""}
			${supplier.address || supplier.city ? `العنوان: ${esc(supplier.address || supplier.city)}` : ""}
		</div>
	</div>
	<table>
		<thead>
			<tr>
				<th>اسم المنتج</th>
				<th>رقم المنتج</th>
				<th>الكمية</th>
				<th>تكلفة المنتج</th>
				<th>التكلفة الاجمالية</th>
			</tr>
		</thead>
		<tbody>
			${rows}
			<tr class="total-row">
				<td colspan="4">الاجمالي</td>
				<td class="num">${esc(money(total))}</td>
			</tr>
		</tbody>
	</table>
	<script>window.onload = function () { window.print(); };</script>
</body>
</html>`;
}

const openInvoiceWindow = (html: string) => {
	const w = window.open("", "_blank", "width=820,height=1000");
	if (!w) return;
	w.document.write(html);
	w.document.close();
	w.focus();
};

// توست مخصّص يظهر على يمين شيت الطلب (مطابق Figma)
const showCreatedToast = (supplierName: string) =>
	toast.custom(
		(t) => (
			<div
				dir="rtl"
				// إزاحة لليمين لتظهر بجانب شيت الطلب (نفس موقع dropdown إسناد المورد) في الشاشات الكبيرة
				className="flex w-[345px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)] sm:ml-[615px]"
			>
				<IconCircleCheckFilled className="size-5 shrink-0 text-[#008A2E]" />
				<span className="flex-1 text-right text-[11px] font-medium leading-[18px] text-black">
					تم إنشاء طلب شراء لشركة ({supplierName}) بنجاح، أرسل لهم عندما تكون مستعد
				</span>
				<button
					type="button"
					onClick={() => toast.dismiss(t)}
					className="shrink-0 opacity-40"
				>
					<IconX className="size-3 text-[#9B9B9D]" />
				</button>
			</div>
		),
		{ position: "bottom-left", duration: 6000 },
	);

// توست تأكيد إرسال الطلب للمورد (أسفل يسار الشاشة — مطابق Figma)
const showSentToast = (supplierName: string) =>
	toast.custom(
		(t) => (
			<div
				dir="rtl"
				// إزاحة لليمين لتظهر بجانب شيت التنبيهات بدل أن تغطّيه (مطابق توست الإنشاء)
				className="flex w-[345px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)] sm:ml-[615px]"
			>
				<IconCircleCheckFilled className="size-5 shrink-0 text-[#008A2E]" />
				<span className="flex-1 text-right text-[10px] font-medium leading-[18px] text-black">
					تم إرسال طلب شراء منتجات لشركة ({supplierName}) بنجاح
				</span>
				<button
					type="button"
					onClick={() => toast.dismiss(t)}
					className="shrink-0 opacity-40"
				>
					<IconX className="size-3 text-[#9B9B9D]" />
				</button>
			</div>
		),
		{ position: "bottom-left", duration: 6000 },
	);

export interface Line {
	product: InventoryResponse;
	qty: number;
}

/** بيانات الطلب المُرسل — تُستخدم لشاشة تتبع حالة الطلب */
export interface TrackedOrder {
	productId: string;
	code: string;
	supplier: SupplierResponse;
	lines: Line[];
	total: number;
	createdAt: string;
}

export function PurchaseRequestSheet({
	product,
	onClose,
	onOrdered,
}: PurchaseRequestSheetProps) {
	const { suppliers } = useSuppliers();
	const { warehouses } = useWarehouses();
	const { inventory } = useInventory();
	const { createPurchaseOrderAsync, isCreating } = usePurchaseOrderMutations();

	const [lines, setLines] = useState<Line[]>([]);
	const [supplierId, setSupplierId] = useState("");
	const [warehouseId, setWarehouseId] = useState("");
	const [notes, setNotes] = useState("");
	const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
	const [notify, setNotify] = useState(false);
	const [search, setSearch] = useState("");
	const [supplierOpen, setSupplierOpen] = useState(false);
	const [dateOpen, setDateOpen] = useState(false);
	// الانتقال بين: نموذج الإنشاء ← عرض الطلب ← إنشاء البريد
	const [view, setView] = useState<"form" | "review" | "email">("form");
	const [createdCode, setCreatedCode] = useState("");

	const open = !!product;
	const supplier = suppliers.find((s) => s.id === supplierId);

	// تهيئة عند الفتح: المنتج المُنبَّه كأول سطر بكمية مقترحة
	useEffect(() => {
		if (!product) return;
		const target = product.maxQuantity ?? product.reorderPoint * 2;
		setLines([{ product, qty: Math.max(1, target - product.stock) }]);
		// لا نختار موردًا تلقائيًا — المستخدم يختاره يدويًا عبر "إسناد إلى مورد"
		setSupplierId("");
		setNotes("");
		setDeliveryDate(undefined);
		setNotify(false);
		setSearch("");
		setView("form");
		setCreatedCode("");
	}, [product]);

	useEffect(() => {
		const def = warehouses.find((w) => w.isDefault) ?? warehouses[0];
		if (def) setWarehouseId(def.id);
	}, [warehouses]);

	const total = lines.reduce((s, l) => s + l.qty * unitCostOf(l.product), 0);

	const searchResults = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return [];
		const added = new Set(lines.map((l) => l.product.id));
		return inventory
			.filter(
				(p) =>
					!added.has(p.id) &&
					(p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)),
			)
			.slice(0, 6);
	}, [search, inventory, lines]);

	const setQty = (id: string, delta: number) =>
		setLines((prev) =>
			prev.map((l) => (l.product.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l)),
		);
	const addProduct = (p: InventoryResponse) => {
		setLines((prev) => [...prev, { product: p, qty: 1 }]);
		setSearch("");
	};
	const removeLine = (id: string) =>
		setLines((prev) => prev.filter((l) => l.product.id !== id));

	const canSubmit = !!supplierId && !!warehouseId && lines.length > 0 && !isCreating;

	const submit = async () => {
		if (!supplierId) {
			toast.error("اختر موردًا أولًا (إسناد إلى مورد)", { position: "bottom-left" });
			return;
		}
		if (!warehouseId || lines.length === 0) return;
		try {
			const po = await createPurchaseOrderAsync({
				supplierId,
				warehouseId,
				expectedAt: deliveryDate ? deliveryDate.toISOString() : undefined,
				notes: notes || undefined,
				lines: lines.map((l) => ({
					itemId: l.product.id,
					qtyOrdered: l.qty,
					unitCost: unitCostOf(l.product),
				})),
			});
			setCreatedCode(po.code);
			setView("review");
			showCreatedToast(supplier?.legalName ?? "المورد");
		} catch (e) {
			toast.error((e as Error).message || "فشل إرسال الطلب", { position: "bottom-left" });
		}
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				dir="rtl"
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[603px]!"
			>
				{/* ─── الهيدر ─── */}
				<div className="flex items-center justify-between border-b px-4 py-2">
					<SheetTitle className="flex items-center gap-1.5 text-[13px]">
						{view === "email" ? (
							<span className="text-[15px] font-semibold text-[#101828]">
								إرسال طلب المخزون
							</span>
						) : view === "review" ? (
							<>
								<span className="font-bold text-[#101828]">عرض الطلب</span>
								<span className="font-mono font-bold text-[11px] text-[#101828]">
									#{createdCode}
								</span>
							</>
						) : (
							<>
								<span className="font-bold text-[#08090A]">طلب شراء</span>
								{product && (
									<>
										<IconChevronLeft className="size-3.5 text-[#9B9B9D]" />
										<span className="font-bold text-[#08090A]">{product.name}</span>
										<IconChevronLeft className="size-3.5 text-[#9B9B9D]" />
										<span className="font-mono font-bold text-[10px] text-[#9B9B9D]">
											{product.code}
										</span>
									</>
								)}
							</>
						)}
					</SheetTitle>
					<div className="flex items-center gap-1">
						<button
							type="button"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]"
						>
							<IconArrowsDiagonal className="size-3.5" />
						</button>
						<button
							type="button"
							onClick={onClose}
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{view === "form" && (
					<>
						<div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
							{/* ─── كروت بيانات المورد ─── */}
							<div className="grid grid-cols-4 gap-1.5">
								<InfoCard
									label="الاسم"
									icon={IconUser}
									value={supplier?.contactName || supplier?.legalName}
								/>
								<InfoCard
									label="رقم الجوال"
									icon={IconPhone}
									value={supplier?.phone}
								/>
								<InfoCard
									label="البريد الالكتروني"
									icon={IconMail}
									value={supplier?.email}
								/>
								<InfoCard
									label="العنوان"
									icon={IconMapPin}
									value={supplier?.address || supplier?.city}
								/>
							</div>

							{/* ─── المنتجات + البحث ─── */}
							<div className="flex flex-col gap-2">
								<h4 className="text-[12px] font-medium text-[#08090A]">المنتجات</h4>
								<div className="relative">
									<div className="flex h-[30px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-3">
										<input
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											placeholder="ابحث عن منتج..."
											className="min-w-0 flex-1 bg-transparent text-right text-[12px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
										/>
										<IconSearch className="size-4 shrink-0 text-[#9B9B9D]" />
									</div>
									{searchResults.length > 0 && (
										<div className="absolute z-10 mt-1 w-full overflow-hidden rounded-[4px] border border-[#E5E5E5] bg-white shadow-md">
											{searchResults.map((p) => (
												<button
													key={p.id}
													type="button"
													onClick={() => addProduct(p)}
													className="flex w-full items-center justify-between px-3 py-2 text-right hover:bg-muted"
												>
													<span className="font-mono text-[11px] text-[#9B9B9D]">
														{p.code}
													</span>
													<span className="text-[12px] text-[#08090A]">{p.name}</span>
												</button>
											))}
										</div>
									)}
								</div>

								{/* جدول السطور */}
								<div className="overflow-hidden rounded-[4px] border-[0.5px] border-[#D8D8D8]">
									<table className="w-full border-collapse text-right">
										<thead>
											<tr className="border-b-[0.5px] border-[#D8D8D8]">
												<HeadCell label="اسم المنتج" />
												<HeadCell label="رقم المنتج" />
												<HeadCell label="الكمية" />
												<HeadCell label="التكلفة" />
											</tr>
										</thead>
										<tbody>
											{lines.length === 0 ? (
												<tr>
													<td
														colSpan={4}
														className="px-3 py-6 text-center text-[12px] text-[#9B9B9D]"
													>
														ابحث وأضف منتجات للطلب
													</td>
												</tr>
											) : (
												lines.map((l) => (
													<tr
														key={l.product.id}
														className="border-b-[0.5px] border-[#D8D8D8] last:border-0"
													>
														<td className="px-3 py-2.5">
															<div
																className="flex items-center gap-2"
																dir="rtl"
															>
																<span className="flex size-6 items-center justify-center rounded-full bg-[#F4F4F4] text-[9px] text-[#A3A8B0]">
																	<IconBuildingStore className="size-3" />
																</span>
																<span className="text-[12px] text-[#08090A]">
																	{l.product.name}
																</span>
															</div>
														</td>
														<td className="px-3 py-2.5">
															<span className="text-[12px] tabular-nums text-[#08090A]">
																{l.product.sku || l.product.code}
															</span>
														</td>
														<td className="px-3 py-2.5">
															<div className="flex items-center gap-2">
																<button
																	type="button"
																	onClick={() => setQty(l.product.id, 1)}
																	className="flex size-[18.75px] items-center justify-center rounded-[4px] border border-black/10 text-[#4A5565]"
																>
																	<IconPlus className="size-[9px]" />
																</button>
																<span className="w-[15px] text-center text-[12px] tabular-nums text-[#0A0A0A]">
																	{l.qty}
																</span>
																<button
																	type="button"
																	onClick={() => setQty(l.product.id, -1)}
																	className="flex size-[18.75px] items-center justify-center rounded-[4px] border border-black/10 text-[#4A5565]"
																>
																	<IconMinus className="size-[9px]" />
																</button>
															</div>
														</td>
														<td className="px-3 py-2.5">
															<div className="flex items-center justify-between gap-2">
																<span className="text-[12px] tabular-nums text-[#08090A]">
																	{money(unitCostOf(l.product))}
																</span>
																<button
																	type="button"
																	onClick={() => removeLine(l.product.id)}
																	className="text-[#9B9B9D] hover:text-[#DC2626]"
																>
																	<IconX className="size-3.5" />
																</button>
															</div>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* ─── الملاحظات ─── */}
							<div className="flex flex-col gap-2">
								<h4 className="text-[11px] text-[#08090A]">ملاحظات</h4>
								<div className="relative rounded-[4px] border-[0.75px] border-[#E5E5E5] p-2.5">
									<textarea
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
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

						{/* ─── إسناد إلى مورد (يمين) + تاريخ التسليم ─── */}
						<div className="flex items-center justify-start gap-2 border-t border-[#F3F4F6] px-3 pt-3">
							<Popover
								open={supplierOpen}
								onOpenChange={setSupplierOpen}
							>
								<PopoverTrigger asChild>
									<button
										type="button"
										className="flex h-[24.5px] items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 text-[10px] font-medium text-[#737373]"
									>
										<IconBuildingStore className="size-3.5" />
										<span>{supplier ? supplier.legalName : "إسناد إلى مورد..."}</span>
									</button>
								</PopoverTrigger>
								<PopoverContent
									className="w-[325px] p-0"
									side="right"
									align="end"
									sideOffset={16}
									alignOffset={-60}
									dir="rtl"
								>
									<p className="px-[9px] py-[7px] text-right text-[11px] text-[#08090A]">
										إسناد طلب تجديد مخزون إلى...
									</p>
									<div className="h-px w-full bg-[#E5E5E5]" />
									<div className="flex max-h-[260px] flex-col gap-1 overflow-y-auto p-2.5">
										{suppliers.length === 0 && (
											<span className="px-2 py-3 text-center text-[12px] text-muted-foreground">
												لا يوجد موردون
											</span>
										)}
										{suppliers.map((s) => (
											<button
												key={s.id}
												type="button"
												onClick={() => {
													setSupplierId(s.id);
													setSupplierOpen(false);
												}}
												className={cn(
													"flex items-center justify-between gap-2 rounded-[4px] px-2 py-2 hover:bg-[#F2F2F2]",
													s.id === supplierId && "bg-[#F2F2F2]",
												)}
											>
												<div className="flex items-center gap-1.5">
													<span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#4F6AE0] text-[9px] text-white">
														{initials(s.legalName)}
													</span>
													<span className="text-[10px] font-medium text-black">
														{s.legalName}
													</span>
												</div>
												<span className="shrink-0 rounded-[4px] bg-[#6366F1]/[0.125] px-1 py-0.5 text-[10px] text-[#5B6ABF]">
													خلال {s.leadTimeDays ?? 3} أيام عمل
												</span>
											</button>
										))}
									</div>
								</PopoverContent>
							</Popover>
							<Popover
								open={dateOpen}
								onOpenChange={setDateOpen}
							>
								<PopoverTrigger asChild>
									<button
										type="button"
										className="flex h-[24px] items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 text-[10px] font-medium text-[#737373]"
									>
										<IconCalendar className="size-3.5" />
										<span>{deliveryDate ? dayFmt.format(deliveryDate) : "تاريخ التسليم"}</span>
									</button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto rounded-[4px] border border-[#E5E5E5] p-2 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
									side="right"
									align="end"
									sideOffset={140}
									alignOffset={-60}
								>
									<Calendar
										mode="single"
										selected={deliveryDate}
										onSelect={(d) => {
											setDeliveryDate(d);
											setDateOpen(false);
										}}
										className="[--cell-radius:9999px] [--cell-size:2.4rem]"
										classNames={{
											today: "bg-transparent border border-primary text-foreground",
										}}
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* ─── الشريط السفلي: الإجمالي يمين · مراجعة الطلب يسار بعد إشعار البريد ─── */}
						<div className="flex items-center justify-between gap-2 border-t px-4 py-2">
							<span className="text-[12px] text-[#08090A]/50">
								حدد الكمية وسيتم حساب السعر تلقائيًا
								{lines.length > 0 && ` · الإجمالي ${money(total)}`}
							</span>
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-2">
									<span className="text-[10px] text-[#737373]">إشعار عبر البريد</span>
									<Switch
										checked={notify}
										onCheckedChange={setNotify}
									/>
								</div>
								<button
									type="button"
									onClick={submit}
									disabled={!canSubmit}
									className="flex h-[24px] items-center gap-1.5 rounded-[4px] bg-[#506AE0] px-3 text-[11px] font-semibold primarydisabled:opacity-50"
								>
									<span className="rounded-[4px] bg-white/20 px-1.5 py-0.5 text-[8px]">
										⌘↵
									</span>
									مراجعة الطلب
								</button>
							</div>
						</div>
					</>
				)}

				{view === "review" && supplier && (
					<OrderReviewView
						code={createdCode}
						supplier={supplier}
						lines={lines}
						deliveryDate={deliveryDate}
						total={total}
						onSend={() => setView("email")}
					/>
				)}

				{view === "email" && supplier && (
					<EmailComposeView
						email={supplier.email ?? ""}
						code={createdCode}
						supplier={supplier}
						lines={lines}
						deliveryDate={deliveryDate}
						total={total}
						onSent={() => {
							showSentToast(supplier.legalName);
							if (product)
								onOrdered?.({
									productId: product.id,
									code: createdCode,
									supplier,
									lines,
									total,
									createdAt: new Date().toISOString(),
								});
							onClose();
						}}
						onCancel={() => setView("review")}
					/>
				)}
			</SheetContent>
		</Sheet>
	);
}

function InfoCard({
	label,
	icon: Icon,
	value,
}: {
	label: string;
	icon: typeof IconUser;
	value?: string | null;
}) {
	return (
		<div className="flex flex-col items-start gap-1 rounded-[4px] border border-[#E5E5E5] bg-white px-3 py-1.5 text-right">
			<span className="flex items-center gap-1 text-[12px] text-[#9B9B9D]">
				<Icon className="size-3" />
				{label}
			</span>
			<span className="w-full truncate text-right text-[11px] font-medium text-[#08090A]">
				{value || "—"}
			</span>
		</div>
	);
}

function HeadCell({ label }: { label: string }) {
	return (
		<th className="px-3 py-2.5 text-right text-[12px] font-semibold text-[#5C5C5E]">
			{label}
		</th>
	);
}

// عرض الطلب بعد الإنشاء (للقراءة فقط) — مطابق Figma
function OrderReviewView({
	code,
	supplier,
	lines,
	deliveryDate,
	total,
	onSend,
}: {
	code: string;
	supplier: SupplierResponse;
	lines: Line[];
	deliveryDate?: Date;
	total: number;
	onSend: () => void;
}) {
	return (
		<>
			<div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
				<div className="flex flex-col gap-3 rounded-[4px] border-[0.5px] border-[#D8D8D8] p-3">
					{/* اسم المورد (اليمين، الأيقونة قبل النص) + التاريخ (اليسار) */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							<IconBuildingStore className="size-4 text-[#08090A]" />
							<span className="text-[14px] font-medium text-[#08090A]">
								{supplier.legalName}
							</span>
						</div>
						<span className="text-[12px] text-[#08090A]">
							{deliveryDate ? dayFmt.format(deliveryDate) : "—"}
						</span>
					</div>

					{/* كروت التواصل */}
					<div className="grid grid-cols-3 gap-1.5">
						<InfoCard
							label="العنوان"
							icon={IconMapPin}
							value={supplier.address || supplier.city}
						/>
						<InfoCard
							label="البريد الالكتروني"
							icon={IconMail}
							value={supplier.email}
						/>
						<InfoCard
							label="رقم الجوال"
							icon={IconPhone}
							value={supplier.phone}
						/>
					</div>

					{/* جدول المنتجات */}
					<div className="overflow-hidden rounded-[4px] border-[0.5px] border-[#D8D8D8]">
						<table className="w-full border-collapse text-right">
							<thead>
								<tr className="border-b-[0.5px] border-[#D8D8D8]">
									<HeadCell label="اسم المنتج" />
									<HeadCell label="رقم المنتج" />
									<HeadCell label="الكمية" />
									<HeadCell label="تكلفة المنتج" />
									<HeadCell label="التكلفة الاجمالية" />
								</tr>
							</thead>
							<tbody>
								{lines.map((l) => (
									<tr
										key={l.product.id}
										className="border-b-[0.5px] border-[#D8D8D8]"
									>
										<td className="px-3 py-2.5">
											<div
												className="flex items-center gap-2"
												dir="rtl"
											>
												<span className="flex size-6 items-center justify-center rounded-full bg-[#F4F4F4]">
													<IconBuildingStore className="size-3 text-[#A3A8B0]" />
												</span>
												<span className="text-[12px] text-[#08090A]">{l.product.name}</span>
											</div>
										</td>
										<td className="px-3 py-2.5">
											<span className="text-[12px] tabular-nums text-[#08090A]">
												{l.product.sku || l.product.code}
											</span>
										</td>
										<td className="px-3 py-2.5">
											<span className="text-[12px] tabular-nums text-[#08090A]">
												{l.qty} وحدة
											</span>
										</td>
										<td className="px-3 py-2.5">
											<span className="text-[12px] tabular-nums text-[#08090A]">
												{money(unitCostOf(l.product))}
											</span>
										</td>
										<td className="px-3 py-2.5">
											<span className="text-[12px] tabular-nums text-[#08090A]">
												{money(l.qty * unitCostOf(l.product))}
											</span>
										</td>
									</tr>
								))}
								<tr>
									<td
										colSpan={4}
										className="px-3 py-2.5 text-right"
									>
										<span className="text-[12px] font-medium text-[#08090A]">الاجمالي</span>
									</td>
									<td className="px-3 py-2.5">
										<span className="text-[12px] font-bold tabular-nums text-[#08090A]">
											{money(total)}
										</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* الفوتر: ارسال الطلب (يسار) + تحميل */}
			<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
				<button
					type="button"
					onClick={() =>
						openInvoiceWindow(buildInvoiceHtml({ code, supplier, lines, deliveryDate, total }))
					}
					className="flex h-[24px] items-center gap-1.5 rounded-[4px] border border-[#D9D9DA] bg-[#F9FAFB] px-3 text-[10px] font-medium text-[#08090A]"
				>
					<IconDownload className="size-3" />
					تحميل
				</button>
				<button
					type="button"
					onClick={onSend}
					className="flex h-[24px] items-center gap-1.5 rounded-[4px] bg-[#506AE0] px-3 text-[10px] font-medium text-white"
				>
					<IconSend className="size-3" />
					ارسال الطلب
				</button>
			</div>
		</>
	);
}

// شاشة إنشاء البريد لإرسال الطلب للمورد (view داخل نفس الشيت — مطابق Figma)
function EmailComposeView({
	email,
	code,
	supplier,
	lines,
	deliveryDate,
	total,
	onSent,
	onCancel,
}: {
	email: string;
	code: string;
	supplier: SupplierResponse;
	lines: Line[];
	deliveryDate?: Date;
	total: number;
	onSent: () => void;
	onCancel: () => void;
}) {
	const [body, setBody] = useState(
		"مرحبًا، نود طلب بعض المخزون، من فضلك. مرفق نموذج طلب ومعلومات التسليم الخاصة بنا",
	);

	// فاتورة الطلب تُرفق تلقائيًا — تحوي معلومات الطلب كاملة كملف PDF
	const invoiceHtml = useMemo(
		() => buildInvoiceHtml({ code, supplier, lines, deliveryDate, total }),
		[code, supplier, lines, deliveryDate, total],
	);
	const fileName = `فاتورة_${code}.pdf`;
	const fileSizeKb = useMemo(
		() => Math.max(1, Math.round(new Blob([invoiceHtml]).size / 1024)),
		[invoiceHtml],
	);

	return (
		<>
			{/* إلى (اليمين) */}
			<div className="flex items-center gap-2.5 border-b border-[#F3F4F6] px-3 py-3">
				<span className="text-[14px] text-[#6A7282]">إلى</span>
				<span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[14px] text-[#1E2939]">
					{email || "—"}
				</span>
			</div>

			{/* الموضوع (اليمين) */}
			<div className="flex items-center gap-2.5 border-b border-[#F3F4F6] px-3 py-3">
				<span className="text-[14px] text-[#6A7282]">الموضوع</span>
				<span className="text-[14px] font-medium text-[#101828]">
					إعادة تخزين المنتج - #{code}
				</span>
			</div>

			{/* النص */}
			<textarea
				value={body}
				onChange={(e) => setBody(e.target.value)}
				dir="rtl"
				className="min-h-[160px] flex-1 resize-none px-3 py-3 text-right text-[14px] leading-[21px] text-[#1E2939] outline-none"
			/>

			{/* المرفق: فاتورة الطلب (PDF) تُرفق تلقائيًا */}
			<div className="px-3 pt-2">
				<div className="flex items-center justify-between gap-2 rounded-[4px] border border-[#F3F4F6] bg-[#F9FAFB] px-2 py-1.5">
					{/* معلومات الملف (يمين): أيقونة PDF + الاسم + الحجم */}
					<div className="flex items-center gap-2.5">
						<span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-[#FFE2E2]">
							<IconFileText className="size-4 text-[#FB2C36]" />
						</span>
						<div className="flex items-center gap-1.5">
							<span className="text-[14px] font-medium text-[#08090A]">{fileName}</span>
							<span className="text-[12px] text-[#99A1AF]">({fileSizeKb} كيلوبايت)</span>
						</div>
					</div>
					{/* زر التحميل (يسار) */}
					<button
						type="button"
						onClick={() => openInvoiceWindow(invoiceHtml)}
						className="flex size-[23px] shrink-0 items-center justify-center rounded-[4px] text-[#99A1AF] hover:bg-black/[0.03]"
						title="تحميل الفاتورة"
					>
						<IconDownload className="size-4" />
					</button>
				</div>
			</div>

			{/* شريط الأدوات: الأيقونات (يمين) + قالب البريد (يسار) */}
			<div className="flex items-center justify-between border-t border-[#F3F4F6] px-3 py-2.5">
				<div className="flex items-center gap-1 text-[#6A7282]">
					<IconBold className="size-4" />
					<IconPaperclip className="size-4" />
					<IconPrinter className="size-4" />
					<IconMoodSmile className="size-4" />
					<IconAlignRight className="size-4" />
					<IconDotsVertical className="size-4" />
				</div>
				<button
					type="button"
					className="flex items-center gap-1 text-[14px] font-medium text-[#4A5565]"
				>
					قالب البريد
					<IconChevronDown className="size-3.5" />
				</button>
			</div>

			{/* الفوتر: ارسال (يسار) + إلغاء */}
			<div className="flex items-center justify-end gap-2.5 border-t px-4 py-2">
				<button
					type="button"
					onClick={onSent}
					className="flex h-[28px] items-center gap-1.5 rounded-[4px] bg-[#506AE0] px-4 text-[12px] font-medium text-white"
				>
					ارسال
					<IconSend className="size-3.5" />
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="flex h-[28px] items-center rounded-[4px] border border-black/[0.13] bg-[#F9FAFB] px-4 text-[12px] font-medium text-[#08090A]"
				>
					إلغاء
				</button>
			</div>
		</>
	);
}
