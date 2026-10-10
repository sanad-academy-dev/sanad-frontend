import {
	IconAlertTriangle,
	IconCalendarStats,
	IconDots,
	IconTrash,
} from "@tabler/icons-react";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WriteOffDialog } from "@/features/inventory/components/batches/write-off-dialog";
import { useBatches } from "@/features/inventory/hooks/use-batches";
import { getExpiryMeta } from "@/features/inventory/utils/expiry-status";
import { cn } from "@/lib/utils";
import type { StockBatchResponse } from "@/server/stock/stock.type";

const dateFmt = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" });

export function BatchesView() {
	const [nearOnly, setNearOnly] = useState(false);
	const { batches, isLoading } = useBatches(nearOnly ? { expiringInDays: 30 } : undefined);
	const [writingOff, setWritingOff] = useState<StockBatchResponse | null>(null);

	const columns = useMemo<ColumnDef<StockBatchResponse>[]>(
		() => [
			{
				id: "item",
				accessorFn: (r) => `${r.item.name} ${r.item.code} ${r.batchNo}`,
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
				accessorKey: "batchNo",
				header: "رقم الدفعة",
				cell: ({ row }) => <span className="font-mono text-sm">{row.original.batchNo}</span>,
			},
			{
				id: "warehouse",
				header: "المستودع",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">{row.original.warehouse.name}</span>
				),
			},
			{
				accessorKey: "qty",
				header: "الكمية",
				cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.qty}</span>,
			},
			{
				accessorKey: "expiryDate",
				header: "تاريخ الصلاحية",
				cell: ({ row }) =>
					row.original.expiryDate ? (
						<span className="text-sm tabular-nums">
							{dateFmt.format(new Date(row.original.expiryDate))}
						</span>
					) : (
						<span className="text-sm text-muted-foreground">—</span>
					),
			},
			{
				id: "status",
				header: "الحالة",
				cell: ({ row }) => {
					const meta = getExpiryMeta(row.original.expiryDate);
					return (
						<span
							className={cn(
								"inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
								meta.className,
							)}
						>
							<span className="size-1.5 rounded-full bg-current" />
							{meta.label}
						</span>
					);
				},
			},
			{
				id: "actions",
				size: 64,
				header: "الإجراءات",
				cell: ({ row }) => (
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
								className="gap-2 text-destructive"
								onClick={() => setWritingOff(row.original)}
							>
								<IconTrash className="size-4" />
								إتلاف / صرف
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: batches,
		columns,
		enableSorting: false,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	const search = (table.getState().globalFilter as string) ?? "";
	const emptyIcon: ReactNode = <IconCalendarStats className="size-10 text-[#A3A8B0]" />;

	return (
		<>
			<WriteOffDialog
				batch={writingOff}
				onClose={() => setWritingOff(null)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchClassName="w-[414px]"
					searchPlaceholder="ابحث عن دفعة بالمنتج أو الرقم..."
					searchValue={search}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					leftExtra={
						<Button
							size="sm"
							variant="outline"
							onClick={() => setNearOnly((v) => !v)}
							className={cn(
								nearOnly &&
									"border-[#F59E0B] bg-[#FEF3C7] text-[#B45309] hover:bg-[#FEF3C7] hover:text-[#B45309]",
							)}
						>
							<IconAlertTriangle />
							{nearOnly ? "عرض الكل" : "قرب الانتهاء فقط"}
						</Button>
					}
				/>

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					keepHeaderOnEmpty
					headerTextClassName="text-[#5C5C5E] text-[12px] font-semibold"
					emptyState={{
						title: nearOnly ? "لا توجد دُفعات قرب الانتهاء" : "لا توجد دُفعات بعد",
						description:
							"الدُفعات تُنشأ تلقائيًا عند استلام أوامر الشراء للأصناف المتتبّعة بالصلاحية.",
						icon: emptyIcon,
					}}
				/>
			</div>
		</>
	);
}
