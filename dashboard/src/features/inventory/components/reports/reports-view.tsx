import { IconCoins, IconPackages, IconReportMoney } from "@tabler/icons-react";
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
import { AgeingView } from "@/features/inventory/components/reports/ageing-view";
import { INVENTORY_CATEGORY_LABELS } from "@/features/inventory/data/constants";
import { useValuation } from "@/features/inventory/hooks/use-valuation";
import { cn } from "@/lib/utils";
import type { ValuationItem } from "@/server/stock/stock.type";

const money = (n: number) =>
	n.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type ReportKind = "value" | "ageing";

export function ReportsView() {
	const { items, totalValue, totalQty, isLoading } = useValuation();
	const [report, setReport] = useState<ReportKind>("value");

	const columns = useMemo<ColumnDef<ValuationItem>[]>(
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
				accessorKey: "category",
				header: "الفئة",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">
						{INVENTORY_CATEGORY_LABELS[row.original.category]}
					</span>
				),
			},
			{
				accessorKey: "stock",
				header: "الكمية",
				cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.stock}</span>,
			},
			{
				accessorKey: "valuationRate",
				header: "متوسط التكلفة",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums text-muted-foreground">
						{money(row.original.valuationRate)} ر.س
					</span>
				),
			},
			{
				accessorKey: "stockValue",
				header: "قيمة المخزون",
				cell: ({ row }) => (
					<span className="text-sm font-semibold tabular-nums">
						{money(row.original.stockValue)} ر.س
					</span>
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
	const emptyIcon: ReactNode = <IconReportMoney className="size-10 text-[#A3A8B0]" />;

	const reportTabs: { value: ReportKind; label: string }[] = [
		{ value: "value", label: "قيمة المخزون" },
		{ value: "ageing", label: "أعمار المخزون" },
	];

	return (
		<div className="flex flex-col">
			<div className="h-px w-full bg-[#D8D8D8]" />

			{/* مبدّل نوع التقرير */}
			<div
				className="flex items-center gap-1 px-[11px] py-[8px]"
				dir="rtl"
			>
				{reportTabs.map((t) => (
					<button
						key={t.value}
						type="button"
						onClick={() => setReport(t.value)}
						className={cn(
							"flex h-[26px] items-center rounded-[4px] px-3 text-[12px] font-medium",
							report === t.value
								? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
								: "text-[#6B7280]",
						)}
					>
						{t.label}
					</button>
				))}
			</div>

			{report === "ageing" ? (
				<AgeingView />
			) : (
				<ValuationBody
					table={table}
					columns={columns}
					isLoading={isLoading}
					totalValue={totalValue}
					totalQty={totalQty}
					search={search}
					emptyIcon={emptyIcon}
				/>
			)}
		</div>
	);
}

interface ValuationBodyProps {
	// biome-ignore lint/suspicious/noExplicitAny: passthrough table/columns
	table: any;
	// biome-ignore lint/suspicious/noExplicitAny: passthrough table/columns
	columns: any;
	isLoading: boolean;
	totalValue: number;
	totalQty: number;
	search: string;
	emptyIcon: ReactNode;
}

function ValuationBody({
	table,
	columns,
	isLoading,
	totalValue,
	totalQty,
	search,
	emptyIcon,
}: ValuationBodyProps) {
	return (
		<>
			<div className="h-px w-full bg-[#D8D8D8]" />

			{/* ملخّص القيمة */}
			<div
				className="flex items-center gap-3 px-[11px] py-[12px]"
				dir="rtl"
			>
				<div className="flex items-center gap-3 rounded-[4px] border border-[#E5E5E5] bg-[#F9FAFB] px-4 py-3">
					<span className="flex size-9 items-center justify-center rounded-full bg-[#6366F1]/10">
						<IconCoins className="size-5 text-[#6366F1]" />
					</span>
					<div className="flex flex-col">
						<span className="text-xs text-muted-foreground">إجمالي قيمة المخزون</span>
						<span className="text-lg font-bold tabular-nums text-[#08090A]">
							{money(totalValue)} ر.س
						</span>
					</div>
				</div>
				<div className="flex items-center gap-3 rounded-[4px] border border-[#E5E5E5] bg-[#F9FAFB] px-4 py-3">
					<span className="flex size-9 items-center justify-center rounded-full bg-[#10B981]/10">
						<IconPackages className="size-5 text-[#10B981]" />
					</span>
					<div className="flex flex-col">
						<span className="text-xs text-muted-foreground">إجمالي الكمية</span>
						<span className="text-lg font-bold tabular-nums text-[#08090A]">
							{totalQty.toLocaleString("ar-EG")}
						</span>
					</div>
				</div>
			</div>

			<TableToolbar
				className="border-t"
				searchClassName="w-[414px]"
				searchPlaceholder="ابحث عن منتج بالاسم أو المعرّف..."
				searchValue={search}
				onSearchChange={(v) => table.setGlobalFilter(v)}
				leftExtra={
					<span className="text-[13px] font-semibold text-[#1F2937]">تقرير قيمة المخزون</span>
				}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				keepHeaderOnEmpty
				headerTextClassName="text-[#5C5C5E] text-[12px] font-semibold"
				emptyState={{
					title: "لا توجد بيانات قيمة بعد",
					description:
						"تظهر قيمة المخزون بعد استلام المنتجات بتكلفة عبر أوامر الشراء (المتوسط المتحرّك).",
					icon: emptyIcon,
				}}
			/>
		</>
	);
}
