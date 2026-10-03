import {
	IconAlertTriangle,
	IconArrowsExchange,
	IconBan,
	IconBell,
	IconBone,
	IconChevronDown,
	IconDots,
	IconEdit,
	IconEye,
	IconInfoCircle,
	IconPlus,
	IconShoppingCart,
	IconTrash,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddProductSheet } from "@/features/inventory/components/add-product-sheet";
import { DeleteInventoryDialog } from "@/features/inventory/components/delete-inventory-dialog";
import { DisableInventoryDialog } from "@/features/inventory/components/disable-inventory-dialog";
import {
	type ExpiryAction,
	ExpiryActionDialog,
} from "@/features/inventory/components/expiry-action-dialog";
import { ProductDetailSheet } from "@/features/inventory/components/product-detail-sheet";
import { RestockDialog } from "@/features/inventory/components/restock-dialog";
import { StockAlertsSheet } from "@/features/inventory/components/stock-alerts-sheet";
import { INVENTORY_CATEGORY_LABELS } from "@/features/inventory/data/constants";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useStockOverview } from "@/features/inventory/hooks/use-stock-overview";
import { getExpiryMeta } from "@/features/inventory/utils/expiry-status";
import { getStockStatus } from "@/features/inventory/utils/stock-status";
import { cn } from "@/lib/utils";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

const formatDate = (value: InventoryResponse["productionDate"]) =>
	value ? format(new Date(value), "dd/MM/yyyy") : "—";

const formatPrice = (value: InventoryResponse["price"]) =>
	`${Number(value).toLocaleString("ar-SA")} ر.س`;

// رأس عمود مع أيقونة معلومات — قيم حرفية من get_code (10px / #9B9B9D / opacity 0.45)
const headerWithInfo = (label: string) => () => (
	<>
		<span>{label}</span>
		<IconInfoCircle
			className="size-[10px] text-[#9B9B9D] opacity-45"
			stroke={0.833}
		/>
	</>
);

// خلية تاريخ الصلاحية — للمنتجات المنتهية يظهر التاريخ بالأحمر مع زرّي استرجاع/إعدام،
// وكلاهما يفتح حوار تأكيد (بنفس تصميم حوار الحذف) قبل تنفيذ حركة المخزون.
function ExpiryCell({ product }: { product: InventoryResponse }) {
	const [action, setAction] = useState<ExpiryAction | null>(null);

	if (!product.expiryDate) {
		return <span className="text-sm text-muted-foreground">—</span>;
	}

	const expired = getExpiryMeta(product.expiryDate).status === "expired";

	return (
		<div
			className="flex items-center gap-2"
			dir="rtl"
		>
			<span
				className={cn(
					"text-sm tabular-nums",
					expired ? "font-medium text-[#DC2626]" : "text-muted-foreground",
				)}
			>
				{formatDate(product.expiryDate)}
			</span>
			{expired && (
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setAction("return");
						}}
						className="rounded-[4px] border-[0.75px] border-[#0B4642]/[0.12] bg-white px-1.5 py-0.5 text-[9px] font-medium text-[#08090A]"
					>
						استرجاع
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setAction("dispose");
						}}
						className="rounded-[4px] border-[0.75px] border-[#0B4642]/[0.12] bg-white px-1.5 py-0.5 text-[9px] font-medium text-[#08090A]"
					>
						إعدام
					</button>
				</div>
			)}

			<ExpiryActionDialog
				product={action ? product : null}
				action={action ?? "dispose"}
				onClose={() => setAction(null)}
			/>
		</div>
	);
}

export function InventoryTable({
	onRequestPurchase,
	onShowMovements,
	onShowExpiry,
}: {
	onRequestPurchase?: () => void;
	onShowMovements?: () => void;
	onShowExpiry?: () => void;
} = {}) {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [alertsOpen, setAlertsOpen] = useState(false);
	const [viewingProduct, setViewingProduct] = useState<InventoryResponse | null>(null);
	const [editingProduct, setEditingProduct] = useState<InventoryResponse | null>(null);
	const [deletingProduct, setDeletingProduct] = useState<InventoryResponse | null>(null);
	const [disablingProduct, setDisablingProduct] = useState<InventoryResponse | null>(null);
	const [restockProduct, setRestockProduct] = useState<InventoryResponse | null>(null);
	const { inventory, isLoading } = useInventory();
	const { overview } = useStockOverview();
	const alertCount = (overview?.outOfStock ?? 0) + (overview?.belowReorder ?? 0);

	const columns = useMemo<ColumnDef<InventoryResponse>[]>(
		() => [
			{
				id: "select",
				size: 48,
				header: () => (
					<Checkbox className="size-[18px] rounded-[4px] border-[1.5px] border-[#E5E5E5]" />
				),
				cell: () => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ خانة الاختيار قابلة للوصول بلوحة المفاتيح
					<div onClick={(e) => e.stopPropagation()}>
						<Checkbox className="size-[18px] rounded-[4px] border-[1.5px] border-[#E5E5E5]" />
					</div>
				),
			},
			{
				accessorKey: "name",
				header: "المنتج / المعرّف",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="font-semibold text-sm">{row.original.name}</span>
						<span className="text-xs text-muted-foreground tabular-nums">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "category",
				header: "الفئة",
				cell: ({ row }) => (
					<Badge variant="secondary">{INVENTORY_CATEGORY_LABELS[row.original.category]}</Badge>
				),
			},
			{
				accessorKey: "stock",
				header: headerWithInfo("المخزون"),
				cell: ({ row }) => {
					const { stock, maxQuantity } = row.original;
					const pct = maxQuantity ? Math.min(100, Math.round((stock / maxQuantity) * 100)) : 0;
					return (
						<div className="flex items-center gap-2">
							<span className="text-sm tabular-nums">
								{stock}/{maxQuantity ?? "—"}
							</span>
							<div className="h-1.5 w-[70px] overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-primary"
									style={{ width: `${pct}%` }}
								/>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "reorderPoint",
				header: headerWithInfo("نقطة إعادة البيع"),
				cell: ({ row }) => (
					<span className="text-sm tabular-nums text-muted-foreground">
						{row.original.reorderPoint} وحدات
					</span>
				),
			},
			{
				accessorKey: "price",
				header: "السعر",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">{formatPrice(row.original.price)}</span>
				),
			},
			{
				accessorKey: "expiryDate",
				header: headerWithInfo("تاريخ الانتهاء"),
				cell: ({ row }) => <ExpiryCell product={row.original} />,
			},
			{
				id: "status",
				header: headerWithInfo("حالة"),
				cell: ({ row }) => {
					const info = getStockStatus(row.original.stock, row.original.reorderPoint);
					return (
						<div
							className="flex items-center justify-start gap-1"
							dir="rtl"
						>
							<span
								className={cn(
									"inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
									info.textClass,
								)}
							>
								<span className={cn("size-1.5 rounded-full", info.dotClass)} />
								{info.label}
								<IconChevronDown className="size-3 opacity-50" />
							</span>
							{info.status === "low" && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										setRestockProduct(row.original);
									}}
									className="shrink-0 rounded-[4px] border-[0.75px] border-[#0B4642]/[0.12] bg-white px-[6px] py-[2px] text-[11px] font-medium text-[#08090A] hover:bg-muted"
								>
									طلب شراء
								</button>
							)}
						</div>
					);
				},
			},
			{
				id: "suppliers",
				header: "الموردين",
				cell: ({ row }) =>
					row.original.supplier ? (
						<div className="flex items-center gap-2">
							<span className="truncate text-sm text-muted-foreground">
								{row.original.supplier}
							</span>
							<button
								type="button"
								onClick={(e) => e.stopPropagation()}
								className="shrink-0 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
							>
								طلب تعبئة
							</button>
						</div>
					) : (
						<span className="text-sm text-muted-foreground">—</span>
					),
			},
			{
				id: "warehouse",
				header: "المستودع",
				cell: ({ row }) => {
					// المستودع الذي يحوي أكبر رصيد لهذا المنتج (أو أول مستودع)
					const bins = row.original.bins ?? [];
					const top =
						[...bins].sort((a, b) => b.qty - a.qty).find((b) => b.qty > 0) ?? bins[0];
					return top?.warehouse?.name ? (
						<span className="inline-flex items-center rounded-[4px] bg-[#EEF2FF] px-2 py-1 text-xs font-medium text-[#4F46E5]">
							{top.warehouse.name}
						</span>
					) : (
						<span className="text-sm text-muted-foreground">—</span>
					);
				},
			},
			{
				id: "actions",
				size: 64,
				header: "الإجراءات",
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عناصر القائمة قابلة للوصول بلوحة المفاتيح
					<div onClick={(e) => e.stopPropagation()}>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-8"
								>
									<IconDots className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setViewingProduct(row.original)}
								>
									<IconEye className="size-4" />
									فتح
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setEditingProduct(row.original)}
								>
									<IconEdit className="size-4" />
									تعديل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setDisablingProduct(row.original)}
								>
									<IconBan className="size-4" />
									تعطيل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setRestockProduct(row.original)}
								>
									<IconShoppingCart className="size-4" />
									طلب شراء
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive gap-2"
									onSelect={() => setDeletingProduct(row.original)}
								>
									<IconTrash className="size-4" />
									حذف
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: inventory,
		columns,
		enableSorting: false,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	const search = (table.getState().globalFilter as string) ?? "";

	const emptyIcon: ReactNode = <IconBone className="size-6 text-[#A3A8B0]" />;

	return (
		<>
			<AddProductSheet
				open={sheetOpen}
				onClose={() => setSheetOpen(false)}
			/>
			<ProductDetailSheet
				product={viewingProduct}
				onClose={() => setViewingProduct(null)}
			/>
			<StockAlertsSheet
				open={alertsOpen}
				onClose={() => setAlertsOpen(false)}
				onRestock={onRequestPurchase}
			/>
			<RestockDialog
				product={restockProduct}
				onClose={() => setRestockProduct(null)}
			/>
			<AddProductSheet
				open={!!editingProduct}
				onClose={() => setEditingProduct(null)}
				product={editingProduct}
			/>
			<DisableInventoryDialog
				product={disablingProduct}
				onClose={() => setDisablingProduct(null)}
			/>
			<DeleteInventoryDialog
				product={deletingProduct}
				onClose={() => setDeletingProduct(null)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchClassName="w-[414px]"
					searchPlaceholder="ابحث عن منتج..."
					searchValue={search}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<>
							<Button
								size="sm"
								variant="outline"
								className="relative px-4"
								onClick={() => setAlertsOpen(true)}
								title="المنتجات الناقصة — تنبيهات المخزون"
							>
								<IconBell className="text-[#DC2626]" />
								تنبيهات المخزون
								{alertCount > 0 && (
									<Badge className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
										{alertCount}
									</Badge>
								)}
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={onShowMovements}
							>
								<IconArrowsExchange />
								تحركات المخزون
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={onShowExpiry}
							>
								<IconAlertTriangle />
								تنبيهات انتهاء الصلاحية
							</Button>
							<Button
								size="sm"
								onClick={() => setSheetOpen(true)}
							>
								<IconPlus />
								إضافة منتج جديد
							</Button>
						</>
					}
				/>

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					onRowClick={(row) => setViewingProduct(row.original)}
					keepHeaderOnEmpty
					headerTextClassName="text-[#5C5C5E] text-[12px] font-semibold"
					emptyState={{
						title: "لا يوجد أي منتج مضاف حتى الآن",
						description:
							"ابدأ بإضافة المنتجات والأدوية والمستلزمات لإدارة المخزون وتتبع الكميات بسهولة داخل الأكاديمية.",
						icon: emptyIcon,
						action: { label: "إضافة أول منتج", onClick: () => setSheetOpen(true) },
					}}
				/>
			</div>
		</>
	);
}
