import { IconHourglass } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { useAgeing } from "@/features/inventory/hooks/use-ageing";
import type { StockAgeingItem } from "@/server/stock/stock.type";

const num = (n: number) => n.toLocaleString("ar-EG");

export function AgeingView() {
	const { items, totals, isLoading } = useAgeing();

	const columns = useMemo<ColumnDef<StockAgeingItem>[]>(
		() => [
			{
				id: "item",
				accessorFn: (r) => `${r.name} ${r.code}`,
				header: "المنتج",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="text-sm font-medium">{row.original.name}</span>
						<span className="text-xs text-muted-foreground tabular-nums">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "d0_30",
				header: "0 - 30 يوم",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">{num(row.original.d0_30)}</span>
				),
			},
			{
				accessorKey: "d31_60",
				header: "31 - 60 يوم",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">{num(row.original.d31_60)}</span>
				),
			},
			{
				accessorKey: "d61_90",
				header: "61 - 90 يوم",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums text-amber-600">
						{num(row.original.d61_90)}
					</span>
				),
			},
			{
				accessorKey: "d90plus",
				header: "أكثر من 90 يوم",
				cell: ({ row }) => (
					<span className="text-sm font-semibold tabular-nums text-red-600">
						{num(row.original.d90plus)}
					</span>
				),
			},
			{
				accessorKey: "total",
				header: "الإجمالي",
				cell: ({ row }) => (
					<span className="text-sm font-semibold tabular-nums">{num(row.original.total)}</span>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: items,
		columns,
		enableSorting: false,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	const search = (table.getState().globalFilter as string) ?? "";
	const emptyIcon: ReactNode = <IconHourglass className="size-10 text-[#A3A8B0]" />;

	return (
		<div className="flex flex-col">
			{/* ملخّص الشرائح العمرية */}
			{totals && (
				<>
					<div
						className="flex flex-wrap items-center gap-2 px-[11px] py-[12px]"
						dir="rtl"
					>
						<AgeCard
							label="0 - 30 يوم"
							value={num(totals.d0_30)}
							tone="text-emerald-600"
						/>
						<AgeCard
							label="31 - 60 يوم"
							value={num(totals.d31_60)}
							tone="text-[#1F2937]"
						/>
						<AgeCard
							label="61 - 90 يوم"
							value={num(totals.d61_90)}
							tone="text-amber-600"
						/>
						<AgeCard
							label="أكثر من 90 يوم"
							value={num(totals.d90plus)}
							tone="text-red-600"
						/>
					</div>
					<div className="h-px w-full bg-[#D8D8D8]" />
				</>
			)}

			<TableToolbar
				className="border-t"
				searchClassName="w-[414px]"
				searchPlaceholder="ابحث عن منتج..."
				searchValue={search}
				onSearchChange={(v) => table.setGlobalFilter(v)}
				leftExtra={
					<span className="text-[13px] font-semibold text-[#1F2937]">تقرير أعمار المخزون</span>
				}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				keepHeaderOnEmpty
				headerTextClassName="text-[#5C5C5E] text-[12px] font-semibold"
				emptyState={{
					title: "لا توجد بيانات أعمار بعد",
					description: "تظهر الأعمار بعد تسجيل حركات إدخال على المنتجات.",
					icon: emptyIcon,
				}}
			/>
		</div>
	);
}

function AgeCard({ label, value, tone }: { label: string; value: string; tone: string }) {
	return (
		<div className="flex flex-col gap-0.5 rounded-[4px] border border-[#E5E5E5] bg-[#F9FAFB] px-4 py-2.5">
			<span className="text-xs text-muted-foreground">{label}</span>
			<span className={`text-lg font-bold tabular-nums ${tone}`}>{value}</span>
		</div>
	);
}
