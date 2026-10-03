import { IconClipboardCheck, IconPackages, IconPlus } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MovementSheet } from "@/features/inventory/components/stock/movement-sheet";
import { ReconcileSheet } from "@/features/inventory/components/stock/reconcile-sheet";
import { VOUCHER_TYPE_LABELS } from "@/features/inventory/data/constants";
import { useStockLedger } from "@/features/inventory/hooks/use-stock-ledger";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import { cn } from "@/lib/utils";
import type { LedgerFilters, StockLedgerResponse } from "@/server/stock/stock.type";

const VOUCHER_TYPE_VALUES = Object.keys(
	VOUCHER_TYPE_LABELS,
) as (keyof typeof VOUCHER_TYPE_LABELS)[];
const ALL = "__all__";

const dateFmt = new Intl.DateTimeFormat("ar-EG", {
	dateStyle: "medium",
	timeStyle: "short",
});

export function MovementsView() {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [reconcileOpen, setReconcileOpen] = useState(false);
	const [filters, setFilters] = useState<LedgerFilters>({});
	const { warehouses } = useWarehouses();
	const { ledger, isLoading } = useStockLedger(filters);
	const setFilter = (k: keyof LedgerFilters, v: string) =>
		setFilters((p) => ({ ...p, [k]: v === ALL || v === "" ? undefined : v }));

	const columns = useMemo<ColumnDef<StockLedgerResponse>[]>(
		() => [
			{
				accessorKey: "createdAt",
				header: "التاريخ",
				cell: ({ row }) => (
					<span className="text-xs text-muted-foreground tabular-nums">
						{dateFmt.format(new Date(row.original.createdAt))}
					</span>
				),
			},
			{
				id: "item",
				accessorFn: (r) => `${r.item.name} ${r.item.code}`,
				header: "المنتج",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="text-sm font-medium">{row.original.item.name}</span>
						<span className="text-xs text-muted-foreground tabular-nums">
							{row.original.item.code}
						</span>
					</div>
				),
			},
			{
				id: "warehouse",
				header: "المستودع",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">{row.original.warehouse.name}</span>
				),
			},
			{
				accessorKey: "voucherType",
				header: "نوع الحركة",
				cell: ({ row }) => (
					<span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-[#1F2937]">
						{VOUCHER_TYPE_LABELS[row.original.voucherType]}
					</span>
				),
			},
			{
				accessorKey: "qtyChange",
				header: "التغيّر",
				cell: ({ row }) => {
					const q = row.original.qtyChange;
					return (
						<span
							className={cn(
								"text-sm font-semibold tabular-nums",
								q > 0 ? "text-emerald-600" : q < 0 ? "text-red-600" : "text-muted-foreground",
							)}
						>
							{q > 0 ? `+${q}` : q}
						</span>
					);
				},
			},
			{
				accessorKey: "balanceQty",
				header: "الرصيد بعدها",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">{row.original.balanceQty}</span>
				),
			},
			{
				accessorKey: "note",
				header: "ملاحظات",
				cell: ({ row }) => (
					<span className="text-xs text-muted-foreground">{row.original.note ?? "—"}</span>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: ledger,
		columns,
		enableSorting: false,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	const search = (table.getState().globalFilter as string) ?? "";
	const emptyIcon: ReactNode = <IconPackages className="size-10 text-[#A3A8B0]" />;

	return (
		<>
			<MovementSheet
				open={sheetOpen}
				onClose={() => setSheetOpen(false)}
			/>
			<ReconcileSheet
				open={reconcileOpen}
				onClose={() => setReconcileOpen(false)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchClassName="w-[414px]"
					searchPlaceholder="ابحث في سجل الحركات..."
					searchValue={search}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setReconcileOpen(true)}
							>
								<IconClipboardCheck />
								جرد
							</Button>
							<Button
								size="sm"
								onClick={() => setSheetOpen(true)}
							>
								<IconPlus />
								حركة جديدة
							</Button>
						</>
					}
				/>

				<div className="h-px w-full bg-[#D8D8D8]" />

				{/* صف الفلاتر — المستودع / النوع / الفترة */}
				<div
					className="flex flex-wrap items-center gap-2 px-[11px] py-[8px]"
					dir="rtl"
				>
					<Select
						value={filters.warehouseId ?? ALL}
						onValueChange={(v) => setFilter("warehouseId", v)}
						dir="rtl"
					>
						<SelectTrigger className="h-8 w-[170px] text-xs">
							<SelectValue placeholder="كل المستودعات" />
						</SelectTrigger>
						<SelectContent dir="rtl">
							<SelectItem value={ALL}>كل المستودعات</SelectItem>
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

					<Select
						value={filters.voucherType ?? ALL}
						onValueChange={(v) => setFilter("voucherType", v)}
						dir="rtl"
					>
						<SelectTrigger className="h-8 w-[150px] text-xs">
							<SelectValue placeholder="كل الأنواع" />
						</SelectTrigger>
						<SelectContent dir="rtl">
							<SelectItem value={ALL}>كل الأنواع</SelectItem>
							{VOUCHER_TYPE_VALUES.map((v) => (
								<SelectItem
									key={v}
									value={v}
								>
									{VOUCHER_TYPE_LABELS[v]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Input
						type="date"
						value={filters.from ?? ""}
						onChange={(e) => setFilter("from", e.target.value)}
						className="h-8 w-[150px] text-xs"
						aria-label="من تاريخ"
					/>
					<Input
						type="date"
						value={filters.to ?? ""}
						onChange={(e) => setFilter("to", e.target.value)}
						className="h-8 w-[150px] text-xs"
						aria-label="إلى تاريخ"
					/>

					{(filters.warehouseId || filters.voucherType || filters.from || filters.to) && (
						<button
							type="button"
							onClick={() => setFilters({})}
							className="text-[12px] font-medium text-[#6366F1]"
						>
							مسح الفلاتر
						</button>
					)}
				</div>

				<div className="h-px w-full bg-[#D8D8D8]" />

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					keepHeaderOnEmpty
					headerTextClassName="text-[#5C5C5E] text-[12px] font-semibold"
					emptyState={{
						title: "لا توجد حركات مخزون بعد",
						description:
							"سجّل أول حركة استلام أو صرف أو تحويل لتتبّع المخزون عبر المستودعات بدقّة.",
						icon: emptyIcon,
						action: { label: "حركة جديدة", onClick: () => setSheetOpen(true) },
					}}
				/>
			</div>
		</>
	);
}
