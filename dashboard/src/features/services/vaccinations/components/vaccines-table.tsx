import { IconAlertTriangle, IconPlus } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
	VACCINE_KIND_LABELS,
	VACCINE_ROUTE_LABELS,
	type VaccineResponse,
} from "@sanad/contracts/runtime/server/vaccinations/vaccinations.type";

export function VaccinesTable({
	vaccines,
	isLoading,
	search,
	onSearchChange,
	onEdit,
	onCreate,
}: {
	vaccines: VaccineResponse[];
	isLoading: boolean;
	search: string;
	onSearchChange: (value: string) => void;
	onEdit: (vaccine: VaccineResponse) => void;
	onCreate: () => void;
}) {
	const columns = useMemo<ColumnDef<VaccineResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "اللقاح",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium">
							{row.original.name}
							{!row.original.active && (
								<Badge
									variant="secondary"
									className="ms-2"
								>
									معطّل
								</Badge>
							)}
						</span>
						<span className="truncate text-xs text-muted-foreground tabular-nums">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "kind",
				header: "النوع",
				cell: ({ row }) => (
					<span className="text-muted-foreground">
						{VACCINE_KIND_LABELS[row.original.kind]}
					</span>
				),
			},
			{
				id: "antigens",
				accessorFn: (v) => v.antigens.map((a) => a.antigen.nameAr).join(" "),
				header: "المُستضِدّات",
				cell: ({ row }) => (
					<span className="line-clamp-2 text-sm">
						{row.original.antigens.map((a) => a.antigen.nameAr).join("، ") || "—"}
					</span>
				),
			},
			{
				accessorKey: "manufacturerName",
				header: "الشركة",
				cell: ({ row }) => (
					<span className="truncate text-muted-foreground">
						{row.original.manufacturerName ?? "—"}
					</span>
				),
			},
			{
				id: "series",
				header: "السلسلة",
				cell: ({ row }) => (
					<span className="whitespace-nowrap tabular-nums">
						{row.original.primarySeriesDoses} جرعة
						{row.original.boosterIntervalDays
							? ` · منشّطة كل ${row.original.boosterIntervalDays}ي`
							: ""}
					</span>
				),
			},
			{
				accessorKey: "defaultRoute",
				header: "الطريق",
				cell: ({ row }) => VACCINE_ROUTE_LABELS[row.original.defaultRoute],
			},
			{
				id: "stock",
				header: "المخزون",
				cell: ({ row }) => {
					const item = row.original.inventoryItem;
					// بلا صنف مخزون لا توجد دفعة ولا رقم دفعة — والإعطاء مرفوض في الدورة،
					// فالحالة تُعرض تحذيرًا لا فراغًا
					if (!item) {
						return (
							<Tooltip>
								<TooltipTrigger asChild>
									<Badge variant="destructive">غير مرتبط</Badge>
								</TooltipTrigger>
								<TooltipContent>
									بلا صنف مخزون لا توجد دفعة ولا تتبّع — الإعطاء مرفوض
								</TooltipContent>
							</Tooltip>
						);
					}
					return (
						<span className="flex min-w-0 items-center gap-1 text-sm">
							<span className="truncate">{item.name}</span>
							<span className="shrink-0 text-xs text-muted-foreground tabular-nums">
								{item.stock}
							</span>
							{!item.tracksBatches && (
								<Tooltip>
									<TooltipTrigger asChild>
										<IconAlertTriangle className="size-3.5 shrink-0 text-[#B45309]" />
									</TooltipTrigger>
									<TooltipContent>
										الصنف غير متتبَّع بالدُفعات — لن يُسجَّل رقم دفعة عند الإعطاء
									</TooltipContent>
								</Tooltip>
							)}
						</span>
					);
				},
			},
		],
		[],
	);

	const table = useReactTable({
		data: vaccines,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
		state: { globalFilter: search },
		onGlobalFilterChange: (updater) =>
			onSearchChange(typeof updater === "function" ? updater(search) : updater),
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث باسم اللقاح أو الشركة..."
				searchValue={search}
				onSearchChange={onSearchChange}
				actions={
					<Button
						size="sm"
						onClick={onCreate}
					>
						<IconPlus />
						لقاح جديد
					</Button>
				}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				onRowClick={(row) => onEdit(row.original)}
				emptyState={{
					title: "لا لقاحات في الكتالوج بعد",
					description:
						"اللقاح عنصر كتالوج بمُستضِدّاته وصنف مخزونه — عليه يقوم حساب الجرعة القادمة وتتبّع رقم الدفعة.",
					action: { label: "إضافة لقاح", onClick: onCreate },
				}}
			/>
		</div>
	);
}
