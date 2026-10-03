import {
	IconArrowDownLeft,
	IconArrowsExchange,
	IconArrowUp,
	IconArrowUpRight,
	IconBandage,
	IconBarcode,
	IconBrain,
	IconBuildingWarehouse,
	IconCalendar,
	IconCalendarStats,
	IconChevronDown,
	IconCircleArrowDownFilled,
	IconCircleCheckFilled,
	IconCoin,
	IconCopy,
	IconEdit,
	IconFileInvoice,
	IconFilter,
	IconInfoCircle,
	IconLayoutGrid,
	IconMail,
	IconMapPin,
	IconPill,
	IconRefresh,
	IconReportMoney,
	IconShoppingCart,
	IconTable,
	IconUserCircle,
	IconX,
} from "@tabler/icons-react";
import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { RestockDialog } from "@/features/inventory/components/restock-dialog";
import {
	INVENTORY_CATEGORY_LABELS,
	PURCHASE_STATUS_META,
	VOUCHER_TYPE_LABELS,
} from "@/features/inventory/data/constants";
import { useItemActivity } from "@/features/inventory/hooks/use-item-activity";
import { useItemBins } from "@/features/inventory/hooks/use-item-bins";
import { useItemPurchases } from "@/features/inventory/hooks/use-item-purchases";
import { useItemSuppliers } from "@/features/inventory/hooks/use-item-suppliers";
import { useProductComments } from "@/features/inventory/hooks/use-product-comments";
import { useStockLedger } from "@/features/inventory/hooks/use-stock-ledger";
import { getExpiryMeta } from "@/features/inventory/utils/expiry-status";
import { getStockStatus } from "@/features/inventory/utils/stock-status";
import { cn } from "@/lib/utils";
import type {
	InventoryResponse,
	ProductActivityEntry,
} from "@/server/inventory/inventory.type";
import type { StockLedgerResponse } from "@/server/stock/stock.type";
import type { ItemSupplierResponse } from "@/server/suppliers/suppliers.type";

interface ProductDetailSheetProps {
	product: InventoryResponse | null;
	onClose: () => void;
}

type DetailTab = "info" | "movements" | "activity" | "purchases" | "suppliers";

const dayFmt = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" });
const isoDate = (d: string | Date) => new Date(d).toISOString().slice(0, 10);
const money = (n: number) =>
	`${n.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`;
const relativeDays = (d: string | Date | null) => {
	if (!d) return "—";
	const days = Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 86_400_000));
	if (days === 0) return "اليوم";
	if (days === 1) return "منذ يوم";
	if (days === 2) return "منذ يومين";
	if (days <= 10) return `منذ ${days} أيام`;
	return `منذ ${days} يومًا`;
};
const relativeTime = (d: string | Date) => {
	const min = Math.round((Date.now() - new Date(d).getTime()) / 60_000);
	if (min < 1) return "الآن";
	if (min < 60) return `منذ ${min} دقيقة`;
	const hr = Math.round(min / 60);
	if (hr < 24) return `منذ ${hr} ساعة`;
	return relativeDays(d);
};
const initials = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0])
		.join("");
const ACTIVITY_ICON: Record<
	ProductActivityEntry["type"],
	ComponentType<{ className?: string }>
> = {
	ledger: IconArrowsExchange,
	purchase: IconShoppingCart,
	product: IconEdit,
};

export function ProductDetailSheet({ product, onClose }: ProductDetailSheetProps) {
	const [tab, setTab] = useState<DetailTab>("info");
	const [viewMode, setViewMode] = useState<"table" | "cards">("table");
	const [restock, setRestock] = useState<InventoryResponse | null>(null);
	const open = !!product;
	const itemId = product?.id;

	const { bins } = useItemBins(itemId);
	const { ledger } = useStockLedger({ itemId }, { enabled: open });
	const { suppliers, isLoading: suppliersLoading } = useItemSuppliers(itemId, {
		enabled: open,
	});

	const tabs: { value: DetailTab; label: string }[] = [
		{ value: "info", label: "معلومات المنتج" },
		{ value: "movements", label: "حركة المخزون" },
		{ value: "suppliers", label: "الموردين" },
		{ value: "activity", label: "النشاط" },
		{ value: "purchases", label: "طلبات الشراء" },
	];

	const price = product ? Number(product.price) : 0;
	const cost = product ? Number(product.valuationRate) || Number(product.unitCost ?? 0) : 0;
	const margin = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;
	const status = product ? getStockStatus(product.stock, product.reorderPoint) : null;
	// المستودع صاحب أكبر رصيد لهذا المنتج
	const topBin = [...bins].sort((a, b) => b.qty - a.qty).find((b) => b.qty > 0) ?? bins[0];
	const warehouseName = topBin?.warehouse?.name;
	const maxQty = product?.maxQuantity ?? 0;
	const stockNow = product?.stock ?? 0;
	const stockPct = maxQty > 0 ? Math.min(100, Math.round((stockNow / maxQty) * 100)) : 0;
	const inventoryValue = stockNow * (cost || price);
	const expiryMeta = product ? getExpiryMeta(product.expiryDate) : null;
	const expired = expiryMeta?.status === "expired";

	// مؤشرات تقديرية مشتقّة من بيانات المنتج (لا يوجد محرّك تنبؤ بعد)
	const outMoves = ledger.filter((e) => e.qtyChange < 0).length;
	const aiDemand = Math.max(20, Math.min(95, outMoves * 15));
	const aiStockout = product
		? Math.max(
				5,
				Math.min(95, Math.round((1 - stockNow / Math.max(1, product.reorderPoint * 2)) * 100)),
			)
		: 0;
	const aiTurnover = Math.max(15, Math.min(95, outMoves * 10 + 20));
	const aiSupplier = product?.supplier ? 90 : 45;

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) {
						setTab("info");
						onClose();
					}
				}}
			>
				<SheetContent
					side="left"
					showCloseButton={false}
					dir="rtl"
					className="flex w-full flex-col gap-0 p-0 sm:max-w-[1000px]!"
				>
					{/* ─── الهيدر ─── */}
					<div
						className="flex items-center justify-between border-b px-4 py-2"
						dir="rtl"
					>
						<SheetTitle className="flex items-center gap-2 text-sm">
							<span className="flex size-[22px] items-center justify-center rounded-[4px] bg-[#F5F5F6]">
								<IconBandage className="size-[14px] text-[#22202A]" />
							</span>
							<span className="font-bold text-[#08090A]">{product?.name}</span>
							<span className="font-mono text-[11px] text-[#9B9B9D]">{product?.code}</span>
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

					{/* ─── التبويبات (شريط مقسّم) ─── */}
					<div
						className="flex items-center border-b border-[#E5E5E5] px-3 py-1"
						dir="rtl"
					>
						<div className="flex w-full items-center justify-start gap-[1.5px] rounded-[4px] bg-[#F0F0F0] p-[1.5px]">
							{tabs.map((t) => (
								<button
									key={t.value}
									type="button"
									onClick={() => setTab(t.value)}
									className={cn(
										"flex h-[24px] items-center justify-center rounded-[4px] px-[7.5px] text-[11px] font-medium transition-colors",
										tab === t.value
											? "border-[0.75px] border-[#E5E5E5] bg-white text-[#08090A]"
											: "text-[#9B9B9D] hover:text-[#08090A]",
									)}
								>
									{t.label}
								</button>
							))}
						</div>
					</div>

					{/* ─── التفاصيل (يرافق كل التبويبات) + منطقة التبويب ─── */}
					{product && (
						<div
							className="flex flex-1 overflow-hidden"
							dir="rtl"
						>
							{/* الشريط الجانبي — التفاصيل (يرافق كل التبويبات) */}
							<aside className="order-2 w-[242px] shrink-0 overflow-y-auto border-r border-[#E5E5E5] p-3">
								<h3 className="mb-3 text-[12px] font-semibold text-[#08090A]">التفاصيل</h3>
								<div className="flex flex-col gap-2.5 text-right">
									<SideRow
										label="حالة المنتج"
										icon={IconPill}
									>
										<div className="flex items-center gap-1">
											{status?.status === "low" && (
												<button
													type="button"
													onClick={() => setRestock(product)}
													className="flex shrink-0 items-center gap-0.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[4px] py-[2px] text-[10px] font-medium text-[#08090A] hover:bg-muted"
												>
													<IconShoppingCart className="size-[10px]" />
													طلب شراء
												</button>
											)}
											{status && (
												<span
													className={cn(
														"rounded-[4px] bg-[#FEE2E2] px-[4px] py-[2px] text-[10px] font-medium",
														status.textClass,
													)}
												>
													{status.label}
												</span>
											)}
										</div>
									</SideRow>
									<SideRow
										label="المستودع"
										icon={IconBuildingWarehouse}
									>
										{warehouseName ? (
											<span className="rounded-[4px] bg-[#6366F1]/[0.125] px-[6px] py-[2px] text-[10px] text-[#5B6ABF]">
												{warehouseName}
											</span>
										) : (
											<span className="text-[11px] text-[#A0A09B]">—</span>
										)}
									</SideRow>
									<SideRow
										label="موقع المخزون"
										icon={IconMapPin}
									>
										<span className="text-[11px] text-[#08090A]">
											{product.location || "—"}
										</span>
									</SideRow>
									<SideRow
										label="فئة المخزون"
										icon={IconBandage}
									>
										<span className="rounded-[4px] bg-[#6366F1]/[0.125] px-[6px] py-[2px] text-[10px] text-[#5B6ABF]">
											{INVENTORY_CATEGORY_LABELS[product.category]}
										</span>
									</SideRow>
									<SideRow
										label="السعر"
										icon={IconCoin}
									>
										<span className="text-[11px] font-medium tabular-nums text-[#08090A]">
											{money(price)}
										</span>
									</SideRow>
									<SideRow
										label="نقطة إعادة البيع"
										icon={IconReportMoney}
									>
										<span className="text-[11px] tabular-nums text-[#08090A]">
											{product.reorderPoint} وحدات
										</span>
									</SideRow>
									<SideRow
										label="تاريخ الانتهاء الصلاحية"
										icon={IconCalendarStats}
									>
										<div className="flex items-center gap-1">
											{expired && (
												<>
													<button
														type="button"
														className="rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[4px] py-[2px] text-[10px] font-medium text-[#08090A] hover:bg-muted"
													>
														إعدام
													</button>
													<button
														type="button"
														className="rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[4px] py-[2px] text-[10px] font-medium text-[#08090A] hover:bg-muted"
													>
														استرجاع
													</button>
												</>
											)}
											<span
												className={cn(
													"text-[10px] tabular-nums",
													expired ? "text-[#DC2626]" : "text-[#08090A]",
												)}
											>
												{product.expiryDate
													? dayFmt.format(new Date(product.expiryDate))
													: "—"}
											</span>
										</div>
									</SideRow>
									<SideRow
										label="إعادة تلقائية"
										icon={IconRefresh}
									>
										<span className="rounded-[4px] bg-[#22C55E]/10 px-[6px] py-[2px] text-[10px] text-[#008E34]">
											{product.reorderPoint > 0 ? "مفعّل ✓" : "غير مفعّل"}
										</span>
									</SideRow>
									<SideRow
										label="الباركود"
										icon={IconBarcode}
									>
										<span className="flex items-center gap-1 font-mono text-[10px] text-[#08090A]">
											<IconCopy className="size-3 text-[#737373]" />
											{product.barcode || "—"}
										</span>
									</SideRow>
									<SideRow
										label="الموردين"
										icon={IconUserCircle}
									>
										<span className="text-[10px] text-[#08090A]">
											{product.supplier || "—"}
										</span>
									</SideRow>

									<Separator />

									<h3 className="text-[12px] font-semibold text-[#08090A]">تفاصيل المورد</h3>
									<SideRow
										label="المورد"
										icon={IconUserCircle}
									>
										<span className="text-[11px] text-[#08090A]">
											{product.supplier || "—"}
										</span>
									</SideRow>
									<SideRow
										label="وقت تسجيل المنتج"
										icon={IconCalendarStats}
									>
										<span className="text-[11px] text-[#08090A]">
											{dayFmt.format(new Date(product.createdAt))}
										</span>
									</SideRow>
								</div>
							</aside>

							{/* معلومات المنتج */}
							{tab === "info" && (
								<div className="order-1 flex flex-1 flex-col gap-3 overflow-y-auto p-3">
									{/* بطاقات الإحصائيات */}
									<div className="grid grid-cols-4 gap-2">
										<StatBox
											label="سعر البيع"
											value={money(price)}
										/>
										<StatBox
											label="سعر التكلفة"
											value={money(cost)}
										/>
										<StatBox
											label="هامش الربح"
											value={`${margin}%`}
										/>
										<StatBox
											label="قيمة المخزون"
											value={money(inventoryValue)}
										/>
									</div>

									{/* بطاقة المنتج */}
									<div className="flex flex-col gap-2.5 rounded-[4px] border border-[#E5E5E5] p-2">
										{/* اسم المنتج */}
										<div className="flex items-center justify-start gap-1.5">
											<span className="text-[13px] font-bold text-[#08090A]">
												{product.name}
											</span>
											<span className="flex size-[17px] items-center justify-center rounded-[4px] bg-[#F5F5F6]">
												<IconBandage className="size-[11px] text-[#A3A8B0]" />
											</span>
										</div>

										{/* فاصل */}
										<div className="h-px w-full bg-[#EBEBEF]" />

										{/* شريحة تحليل AI */}
										<div className="flex items-center gap-2 rounded-[4px] border border-[#C7D7FE] bg-[#F0F4FF] px-3.5 py-2.5">
											<IconBrain className="size-3.5 shrink-0 text-[#3730A3]" />
											<p className="text-[9.5px] font-bold leading-[20px] text-[#3730A3]">
												تحليل الطلب: المخزون الحالي {stockNow} وحدة، نقطة إعادة الطلب{" "}
												{product.reorderPoint}.
												{stockNow <= product.reorderPoint && " يُنصح بإعادة الطلب."}
											</p>
										</div>

										{/* SKU + الباركود */}
										<div className="grid grid-cols-2 gap-2.5">
											<div className="flex items-center justify-between rounded-[4px] border border-[#E5E5E5] px-3 py-1.5">
												<div className="flex flex-col items-end">
													<span className="text-[11px] text-[#9B9B9D]">رمز المنتج (SKU)</span>
													<span className="text-[12px] font-semibold text-[#08090A]">
														{product.sku || "—"}
													</span>
												</div>
												<button
													type="button"
													onClick={() => navigator.clipboard.writeText(product.sku ?? "")}
													className="flex items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 py-0.5 text-[9px] text-[#08090A]"
												>
													<IconCopy className="size-2.5" />
													نسخ
												</button>
											</div>
											<div className="flex items-center justify-between rounded-[4px] border border-[#E5E5E5] px-3 py-1.5">
												<div className="flex flex-col items-end">
													<span className="text-[11px] text-[#9B9B9D]">الباركود</span>
													<span className="text-[12px] font-semibold text-[#08090A]">
														{product.barcode || "—"}
													</span>
												</div>
												<button
													type="button"
													onClick={() => navigator.clipboard.writeText(product.barcode ?? "")}
													className="flex items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 py-0.5 text-[9px] text-[#08090A]"
												>
													<IconCopy className="size-2.5" />
													نسخ
												</button>
											</div>
										</div>
									</div>

									{/* ملاحظات المنتج */}
									<div className="flex flex-col gap-2.5">
										<h4 className="text-[12px] font-bold text-[#08090A]">ملاحظات المنتج</h4>
										<div className="relative min-h-[76px] rounded-[4px] border border-[#E5E5E5] p-2.5">
											{product.notes ? (
												<span className="text-[11px] text-[#08090A]">{product.notes}</span>
											) : (
												<span className="text-[11px] text-[#9B9B9D]">
													أضف ملاحظات للمنتج...
												</span>
											)}
											<button
												type="button"
												className="absolute bottom-2.5 left-2.5 flex size-[17px] items-center justify-center rounded-full border-[0.75px] border-[#E5E5E5]"
											>
												<IconArrowUp className="size-3 text-[#9CA3AF]" />
											</button>
										</div>
									</div>

									{/* مستوى المخزون الحالي */}
									<div className="flex flex-col gap-1.5 rounded-[4px] border border-[#E5E5E5] p-2.5">
										<div className="flex items-center justify-between">
											<span className="text-[12px] font-medium text-[#08090A]">
												مستوى المخزون الحالي
											</span>
											<span className="text-[11px] font-bold text-[#08090A]">
												{stockNow} علبة
											</span>
										</div>
										<div className="h-[9px] w-full overflow-hidden rounded-full bg-[#F5F5F5]">
											<div
												className="h-full rounded-full bg-[#22C55E]"
												style={{ width: `${stockPct}%` }}
											/>
										</div>
										<div className="flex items-center justify-between text-[11px]">
											<span className="text-[#9B9B9D]">الأقصى: {maxQty || "—"}</span>
											<span className="text-[#F59E0B]">
												الحد الأدنى: {product.reorderPoint}
											</span>
											<span className="text-[#9B9B9D]">0</span>
										</div>
									</div>

									{/* مؤشرات AI */}
									<div className="flex flex-col gap-3 rounded-[4px] border border-black/[0.13] p-3.5">
										<h4 className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#08090A]">
											مؤشرات AI
										</h4>
										<AiBar
											label="مستوى الطلب"
											value={aiDemand}
											color="#16A34A"
										/>
										<AiBar
											label="احتمال النفاد خلال 30 يوم"
											value={aiStockout}
											color="#DC2626"
										/>
										<AiBar
											label="كفاءة دوران المخزون"
											value={aiTurnover}
											color="#2563EB"
										/>
										<AiBar
											label="جودة تقديرات المورد"
											value={aiSupplier}
											color="#16A34A"
										/>
									</div>
								</div>
							)}

							{/* حركة المخزون */}
							{tab === "movements" && (
								<div className="order-1 flex flex-1 flex-col gap-3 overflow-y-auto p-3">
									{/* شريط الأدوات */}
									<TabToolbar
										title="حركة المخزون"
										view={viewMode}
										onView={setViewMode}
									>
										<button
											type="button"
											className="flex h-[28px] items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[11px] font-medium text-[#08090A]"
										>
											<span>{product.name}</span>
											<IconFilter className="size-[11px]" />
										</button>
										<button
											type="button"
											className="flex h-[28px] items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[11px] font-medium text-[#08090A]"
										>
											<span>{ledger[0] ? isoDate(ledger[0].createdAt) : "الكل"}</span>
											<IconCalendar className="size-[11px]" />
										</button>
									</TabToolbar>

									{/* القائمة */}
									{ledger.length === 0 ? (
										<p className="text-sm text-muted-foreground">لا توجد حركات لهذا المنتج.</p>
									) : viewMode === "table" ? (
										<MovementsTable
											ledger={ledger}
											productName={product.name}
										/>
									) : (
										ledger.map((e) => {
											const up = e.qtyChange >= 0;
											return (
												<div
													key={e.id}
													className="flex flex-col gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-1.5"
												>
													<div className="flex items-center justify-between">
														<span className="text-[12px] font-medium text-[#08090A]">
															{product.name}
														</span>
														<div className="flex items-center gap-1.5">
															{up ? (
																<IconArrowUpRight className="size-3.5 text-[#22C55E]" />
															) : (
																<IconArrowDownLeft className="size-3.5 text-[#EF4444]" />
															)}
															<span className="text-[12px] text-[#08090A]">
																{VOUCHER_TYPE_LABELS[e.voucherType]}
															</span>
															<span
																className="text-[12px] font-bold tabular-nums"
																style={{ color: up ? "#22C55E" : "#EF4444" }}
															>
																{up ? `+${e.qtyChange}` : e.qtyChange}
															</span>
														</div>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-[11px] text-[#9B9B9D] tabular-nums">
															{isoDate(e.createdAt)}
														</span>
														<button
															type="button"
															className="flex h-7 items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[11px] font-medium text-[#08090A]"
														>
															<IconFileInvoice className="size-[11px]" />
															الفاتورة
														</button>
													</div>
												</div>
											);
										})
									)}
								</div>
							)}

							{/* ─── النشاط ─── */}
							{tab === "activity" && product && (
								<ActivityTab
									itemId={product.id}
									view={viewMode}
									onView={setViewMode}
								/>
							)}

							{/* ─── طلبات الشراء ─── */}
							{tab === "purchases" && product && (
								<PurchasesTab
									itemId={product.id}
									view={viewMode}
									onView={setViewMode}
								/>
							)}

							{/* ─── الموردين ─── */}
							{tab === "suppliers" && (
								<div className="order-1 flex flex-1 flex-col gap-3 overflow-y-auto p-3">
									<TabToolbar
										title="الموردين"
										view={viewMode}
										onView={setViewMode}
									/>
									{suppliersLoading ? (
										<p className="text-sm text-muted-foreground">جارٍ التحميل...</p>
									) : suppliers.length === 0 ? (
										<EmptyTab text="لا يوجد موردون لهذا المنتج بعد." />
									) : viewMode === "table" ? (
										<SuppliersTable suppliers={suppliers} />
									) : (
										suppliers.map((s) => (
											<div
												key={s.id}
												className="flex flex-col gap-1.5 rounded-[4px] border border-[#E5E5E5] p-3"
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<span className="text-[13px] font-semibold text-[#08090A]">
															{s.legalName}
														</span>
														{s.isPrimary && (
															<span className="rounded-[4px] bg-[#22C55E]/10 px-[6px] py-[2px] text-[10px] font-medium text-[#008E34]">
																رئيسي
															</span>
														)}
													</div>
													<span className="text-[14px] font-bold tabular-nums text-[#08090A]">
														{s.price != null ? money(s.price) : "—"}
													</span>
												</div>
												<p className="text-[11px] text-[#9B9B9D]">
													آخر طلب: {relativeDays(s.lastOrderAt)} · التقييم:{" "}
													{s.rating != null ? `${s.rating}/5` : "—"}
												</p>
											</div>
										))
									)}
								</div>
							)}
						</div>
					)}
				</SheetContent>
			</Sheet>

			<RestockDialog
				product={restock}
				onClose={() => setRestock(null)}
			/>
		</>
	);
}

function SideRow({
	label,
	icon: Icon,
	children,
}: {
	label: string;
	icon?: ComponentType<{ className?: string }>;
	children: ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-2">
			<span className="flex shrink-0 items-center gap-1 text-[10px] text-[#737373]">
				{Icon && <Icon className="size-3 text-[#737373]" />}
				{label}
			</span>
			{children}
		</div>
	);
}

function EmptyTab({ text }: { text: string }) {
	return (
		<div className="flex flex-1 items-center justify-center p-8">
			<p className="text-sm text-muted-foreground">{text}</p>
		</div>
	);
}

function ActivityTab({
	itemId,
	view,
	onView,
}: {
	itemId: string;
	view: "table" | "cards";
	onView: (v: "table" | "cards") => void;
}) {
	const { activity, isLoading } = useItemActivity(itemId);
	const { comments, addComment, isAdding } = useProductComments(itemId);
	const [draft, setDraft] = useState("");

	const submit = () => {
		const body = draft.trim();
		if (!body) return;
		addComment(body)
			.then(() => setDraft(""))
			.catch(() => {});
	};

	return (
		<div className="order-1 flex flex-1 flex-col gap-5 overflow-y-auto p-4">
			<TabToolbar
				title="النشاط"
				view={view}
				onView={onView}
			/>

			{/* سجل النشاط */}
			{isLoading ? (
				<p className="text-sm text-muted-foreground">جارٍ التحميل...</p>
			) : activity.length === 0 ? (
				<p className="text-[12px] text-[#9B9B9D]">لا يوجد نشاط مسجّل لهذا المنتج بعد.</p>
			) : (
				<ul className="flex flex-col gap-3">
					{activity.map((a) => {
						const Icon = ACTIVITY_ICON[a.type];
						return (
							<li
								key={a.id}
								className="flex items-center gap-2"
							>
								<span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#F5F5F6]">
									<Icon className="size-[12px] text-[#6D6E6F]" />
								</span>
								<span className="text-[12px] text-[#08090A]">{a.label}</span>
								<span className="text-[11px] text-[#9B9B9D]">· {relativeTime(a.at)}</span>
							</li>
						);
					})}
				</ul>
			)}

			{/* التعليقات */}
			<div className="flex flex-col gap-3">
				<h4 className="text-[14px] font-semibold text-[#08090A]">التعليقات</h4>
				{comments.map((c) => (
					<div
						key={c.id}
						className="flex flex-col gap-1.5 rounded-[4px] border border-[#E5E5E5] p-3"
					>
						<div className="flex items-center gap-2">
							<span className="flex size-[22px] items-center justify-center rounded-full bg-[#4F6AE0] text-[9px] font-medium text-white">
								{initials(c.author.name)}
							</span>
							<span className="text-[12px] font-medium text-[#08090A]">{c.author.name}</span>
							<span className="text-[11px] text-[#9B9B9D]">· {relativeTime(c.createdAt)}</span>
						</div>
						<p className="whitespace-pre-wrap text-[12px] text-[#08090A]">{c.body}</p>
					</div>
				))}

				{/* صندوق الكتابة */}
				<div className="relative rounded-[4px] border border-[#E5E5E5] p-2.5">
					<textarea
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								submit();
							}
						}}
						placeholder="اكتب تعليقًا..."
						rows={2}
						disabled={isAdding}
						className="w-full resize-none bg-transparent text-[12px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
					/>
					<button
						type="button"
						onClick={submit}
						disabled={isAdding || !draft.trim()}
						className="absolute bottom-2.5 left-2.5 flex size-[24px] items-center justify-center rounded-full border-[0.75px] border-[#E5E5E5] bg-white disabled:opacity-50"
					>
						<IconArrowUp className="size-3.5 text-[#6D6E6F]" />
					</button>
				</div>
			</div>
		</div>
	);
}

// مبدّل العرض (شبكة/جدول) — مشترك بين كل التبويبات
function ViewToggle({
	view,
	onView,
}: {
	view: "table" | "cards";
	onView: (v: "table" | "cards") => void;
}) {
	return (
		<div className="flex items-center gap-px rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#F5F5F3] p-px">
			<button
				type="button"
				onClick={() => onView("table")}
				className={cn(
					"flex size-6 items-center justify-center rounded-[4px]",
					view === "table" && "bg-white shadow-sm",
				)}
			>
				<IconLayoutGrid className="size-[11px] text-[#161616]" />
			</button>
			<button
				type="button"
				onClick={() => onView("cards")}
				className={cn(
					"flex size-6 items-center justify-center rounded-[4px]",
					view === "cards" && "bg-white shadow-sm",
				)}
			>
				<IconTable className="size-[11px] text-[#161616]" />
			</button>
		</div>
	);
}

// شريط أدوات موحّد لكل تبويب: العنوان + إضافات اختيارية + مبدّل العرض
function TabToolbar({
	title,
	view,
	onView,
	children,
}: {
	title: string;
	view: "table" | "cards";
	onView: (v: "table" | "cards") => void;
	children?: ReactNode;
}) {
	return (
		<div className="flex items-center justify-between">
			<h3 className="text-[14px] font-medium text-[#1A1A18]">{title}</h3>
			<div className="flex items-center gap-1.5">
				{children}
				<ViewToggle
					view={view}
					onView={onView}
				/>
			</div>
		</div>
	);
}

function PurchasesTab({
	itemId,
	view,
	onView,
}: {
	itemId: string;
	view: "table" | "cards";
	onView: (v: "table" | "cards") => void;
}) {
	const { purchases, isLoading } = useItemPurchases(itemId);

	return (
		<div className="order-1 flex flex-1 flex-col gap-3 overflow-y-auto p-3">
			<TabToolbar
				title="طلبات الشراء"
				view={view}
				onView={onView}
			/>
			{isLoading ? (
				<p className="text-sm text-muted-foreground">جارٍ التحميل...</p>
			) : purchases.length === 0 ? (
				<EmptyTab text="لا توجد طلبات شراء لهذا المنتج بعد." />
			) : (
				<div className="overflow-x-auto rounded-[4px] border border-[#E5E5E5]">
					<table className="w-full border-collapse text-right">
						<thead>
							<tr className="border-b border-[#E5E5E5]">
								<MovementsHeadCell label="رقم الطلب / الإجمالي" />
								<MovementsHeadCell
									label="تاريخ الإنشاء"
									info
								/>
								<MovementsHeadCell
									label="المورد"
									info
								/>
								<MovementsHeadCell
									label="الحالة"
									info
								/>
								<MovementsHeadCell
									label="تم استلام صنف"
									info
								/>
								<MovementsHeadCell label="التواصل" />
							</tr>
						</thead>
						<tbody>
							{purchases.map((po) => {
								const meta = PURCHASE_STATUS_META[po.status];
								const pct =
									po.qtyOrdered > 0
										? Math.min(100, Math.round((po.qtyReceived / po.qtyOrdered) * 100))
										: 0;
								return (
									<tr
										key={po.id}
										className="border-b border-[#F0F0F0] last:border-0"
									>
										<td className="px-3 py-2.5">
											<div className="flex flex-col">
												<span className="font-mono text-[12px] text-[#08090A]">
													#{po.code}
												</span>
												<span className="text-[11px] tabular-nums text-[#9B9B9D]">
													{money(po.total)}
												</span>
											</div>
										</td>
										<td className="px-3 py-2.5">
											<span className="text-[12px] tabular-nums text-[#08090A]">
												{dayFmt.format(new Date(po.createdAt))}
											</span>
										</td>
										<td className="px-3 py-2.5">
											<div className="flex flex-col">
												<span className="text-[12px] text-[#08090A]">
													{po.supplier.legalName}
												</span>
												{po.supplier.email && (
													<span className="text-[11px] text-[#9B9B9D]">
														{po.supplier.email}
													</span>
												)}
											</div>
										</td>
										<td className="px-3 py-2.5">
											<span
												className={cn(
													"inline-flex items-center gap-1 rounded-[4px] border border-[#E5E5E5] px-[6px] py-[2px] text-[11px] font-medium",
													meta.className,
												)}
											>
												{meta.label}
												<IconChevronDown className="size-3 opacity-50" />
											</span>
										</td>
										<td className="px-3 py-2.5">
											<div className="flex flex-col gap-1">
												<span className="text-[11px] tabular-nums text-[#08090A]">
													{po.qtyReceived}/{po.qtyOrdered} علبة
												</span>
												<div className="h-[6px] w-[90px] overflow-hidden rounded-full bg-[#F5F5F5]">
													<div
														className="h-full rounded-full bg-[#22C55E]"
														style={{ width: `${pct}%` }}
													/>
												</div>
												<span className="text-[11px] tabular-nums text-[#9B9B9D]">
													{po.qtyOrdered} علبة · {money(po.lineTotal)}
												</span>
											</div>
										</td>
										<td className="px-3 py-2.5">
											<div className="flex items-center gap-1.5">
												<button
													type="button"
													className="flex h-7 items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[11px] font-medium text-[#08090A]"
												>
													<IconMail className="size-[11px]" />
													إرسال رسالة
												</button>
												<button
													type="button"
													className="flex h-7 items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[11px] font-medium text-[#08090A]"
												>
													<IconFileInvoice className="size-[11px]" />
													عرض الفاتورة
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

function SuppliersTable({ suppliers }: { suppliers: ItemSupplierResponse[] }) {
	return (
		<div className="overflow-x-auto rounded-[4px] border border-[#E5E5E5]">
			<table className="w-full border-collapse text-right">
				<thead>
					<tr className="border-b border-[#E5E5E5]">
						<MovementsHeadCell label="المورد" />
						<MovementsHeadCell label="الحالة" />
						<MovementsHeadCell
							label="آخر طلب"
							info
						/>
						<MovementsHeadCell
							label="التقييم"
							info
						/>
						<MovementsHeadCell
							label="السعر"
							info
						/>
					</tr>
				</thead>
				<tbody>
					{suppliers.map((s) => (
						<tr
							key={s.id}
							className="border-b border-[#F0F0F0] last:border-0"
						>
							<td className="px-3 py-2.5">
								<span className="text-[12px] font-medium text-[#08090A]">{s.legalName}</span>
							</td>
							<td className="px-3 py-2.5">
								{s.isPrimary ? (
									<span className="rounded-[4px] bg-[#22C55E]/10 px-[6px] py-[2px] text-[10px] font-medium text-[#008E34]">
										رئيسي
									</span>
								) : (
									<span className="text-[11px] text-[#9B9B9D]">—</span>
								)}
							</td>
							<td className="px-3 py-2.5">
								<span className="text-[12px] text-[#08090A]">
									{relativeDays(s.lastOrderAt)}
								</span>
							</td>
							<td className="px-3 py-2.5">
								<span className="text-[12px] tabular-nums text-[#08090A]">
									{s.rating != null ? `${s.rating}/5` : "—"}
								</span>
							</td>
							<td className="px-3 py-2.5">
								<span className="text-[12px] font-bold tabular-nums text-[#08090A]">
									{s.price != null ? money(s.price) : "—"}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function MovementsHeadCell({ label, info }: { label: string; info?: boolean }) {
	return (
		<th className="px-3 py-2.5 font-normal">
			<div className="flex items-center gap-1">
				<span className="text-[12px] font-semibold text-[#5C5C5E]">{label}</span>
				{info && <IconInfoCircle className="size-3 text-[#9B9B9D]" />}
			</div>
		</th>
	);
}

function MovementsTable({
	ledger,
	productName,
}: {
	ledger: StockLedgerResponse[];
	productName: string;
}) {
	return (
		<div className="overflow-x-auto rounded-[4px] border border-[#E5E5E5]">
			<table className="w-full border-collapse text-right">
				<thead>
					<tr className="border-b border-[#E5E5E5]">
						<th className="w-[40px] px-3 py-2.5">
							<Checkbox />
						</th>
						<MovementsHeadCell label="المنتج" />
						<MovementsHeadCell
							label="نوع الحركة"
							info
						/>
						<MovementsHeadCell
							label="الكمية"
							info
						/>
						<MovementsHeadCell
							label="التاريخ"
							info
						/>
						<MovementsHeadCell
							label="الفاتورة"
							info
						/>
					</tr>
				</thead>
				<tbody>
					{ledger.map((e) => {
						const up = e.qtyChange >= 0;
						const color = up ? "#16A34A" : "#EF4444";
						return (
							<tr
								key={e.id}
								className="border-b border-[#F0F0F0] last:border-0"
							>
								<td className="px-3 py-2.5">
									<Checkbox />
								</td>
								<td className="px-3 py-2.5">
									<div className="flex items-center gap-2">
										<span className="flex size-[26px] items-center justify-center rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F6]">
											<IconBandage className="size-[13px] text-[#A3A8B0]" />
										</span>
										<span className="text-[12px] text-[#08090A]">{productName}</span>
									</div>
								</td>
								<td className="px-3 py-2.5">
									<div
										className="flex items-center gap-1.5"
										style={{ color }}
									>
										{up ? (
											<IconCircleCheckFilled className="size-3.5" />
										) : (
											<IconCircleArrowDownFilled className="size-3.5" />
										)}
										<span className="text-[12px]">{VOUCHER_TYPE_LABELS[e.voucherType]}</span>
									</div>
								</td>
								<td className="px-3 py-2.5">
									<span
										className="text-[12px] font-bold tabular-nums"
										style={{ color }}
									>
										{up ? `+${e.qtyChange}` : e.qtyChange}
									</span>
								</td>
								<td className="px-3 py-2.5">
									<span className="text-[12px] tabular-nums text-[#08090A]">
										{isoDate(e.createdAt)}
									</span>
								</td>
								<td className="px-3 py-2.5">
									<button
										type="button"
										className="flex h-7 items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[11px] font-medium text-[#08090A]"
									>
										<IconFileInvoice className="size-[11px]" />
										الفاتورة
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function AiBar({ label, value, color }: { label: string; value: number; color: string }) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center justify-between">
				<span className="text-[12px] text-[#6B6B67]">{label}</span>
				<span
					className="text-[12px] font-bold tabular-nums"
					style={{ color }}
				>
					{value}%
				</span>
			</div>
			<div className="h-[5px] w-full overflow-hidden rounded-[4px] bg-[#F5F5F5]">
				<div
					className="h-full rounded-[4px]"
					style={{ width: `${value}%`, backgroundColor: color }}
				/>
			</div>
		</div>
	);
}

function StatBox({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex h-[34px] items-center justify-between rounded-[4px] border border-[#E5E5E5] px-3">
			<span className="flex items-center gap-1 text-[11px] text-[#08090A]">
				{label}
				<IconInfoCircle className="size-[10px] text-[#08090A]" />
			</span>
			<span className="text-[12px] font-bold tabular-nums text-[#08090A]">{value}</span>
		</div>
	);
}
