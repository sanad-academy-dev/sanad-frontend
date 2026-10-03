import { IconPlus } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { LuBone } from "react-icons/lu";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type DietFoodResponse,
	FOOD_FORM_LABELS,
	FOOD_KIND_LABELS,
	MEASURE_UNIT_LABELS,
} from "@sanad/contracts/runtime/server/nutrition/nutrition.type";

const KIND_FILTER = [
	{ value: "ALL", label: "كل التصنيفات" },
	{ value: "MAINTENANCE", label: "غذاء صيانة" },
	{ value: "THERAPEUTIC", label: "غذاء علاجي" },
	{ value: "TREAT", label: "مكافآت" },
	{ value: "SUPPLEMENT", label: "مكمّل غذائي" },
] as const;

const SPECIES_LABELS: Record<string, string> = {
	DOG: "كلاب",
	CAT: "قطط",
	HORSE: "خيول",
	RABBIT: "أرانب",
};

export function DietFoodsTable({
	foods,
	isLoading,
	isError,
	search,
	onSearchChange,
	kind,
	onKindChange,
	onEdit,
	onCreate,
}: {
	foods: DietFoodResponse[];
	isLoading: boolean;
	isError?: boolean;
	search: string;
	onSearchChange: (value: string) => void;
	kind: string;
	onKindChange: (value: string) => void;
	onEdit: (food: DietFoodResponse) => void;
	onCreate: () => void;
}) {
	const columns = useMemo<ColumnDef<DietFoodResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "الغذاء",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium">{row.original.name}</span>
						<span className="truncate text-xs text-muted-foreground">
							{row.original.brand ?? row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "kind",
				header: "التصنيف",
				cell: ({ row }) => (
					<div className="flex items-center gap-1.5">
						<Badge variant={row.original.kind === "THERAPEUTIC" ? "default" : "outline"}>
							{FOOD_KIND_LABELS[row.original.kind]}
						</Badge>
						<Badge variant="secondary">{FOOD_FORM_LABELS[row.original.form]}</Badge>
					</div>
				),
			},
			{
				accessorKey: "metabolizableEnergyKcalPerKg",
				header: "كثافة الطاقة",
				cell: ({ row }) => (
					<span className="tabular-nums">
						{Number(row.original.metabolizableEnergyKcalPerKg)} سعرة/كجم
					</span>
				),
			},
			{
				id: "householdUnit",
				header: "وحدة المنزل",
				cell: ({ row }) =>
					row.original.householdUnitGrams ? (
						<span className="tabular-nums">
							{MEASURE_UNIT_LABELS[row.original.householdUnit]} ={" "}
							{Number(row.original.householdUnitGrams)} جم
						</span>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: "species",
				header: "الأنواع",
				cell: ({ row }) =>
					row.original.species.length ? (
						<span className="text-sm">
							{row.original.species.map((s) => SPECIES_LABELS[s] ?? s).join("، ")}
						</span>
					) : (
						<span className="text-muted-foreground">الكل</span>
					),
			},
			{
				accessorKey: "indications",
				header: "دواعي الاستعمال",
				cell: ({ row }) =>
					row.original.indications.length ? (
						<span className="line-clamp-2 text-sm">{row.original.indications.join("، ")}</span>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				id: "inventory",
				header: "المخزون",
				cell: ({ row }) =>
					row.original.inventoryItem ? (
						<span className="tabular-nums text-sm">
							{row.original.inventoryItem.stock} وحدة
						</span>
					) : (
						<span className="text-xs text-muted-foreground">غير مربوط</span>
					),
			},
		],
		[],
	);

	const table = useReactTable({
		data: foods,
		columns,
		state: { globalFilter: search },
		onGlobalFilterChange: (updater) =>
			onSearchChange(typeof updater === "function" ? updater(search) : String(updater)),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={onSearchChange}
				searchPlaceholder="ابحث بالاسم أو العلامة التجارية..."
				leftExtra={
					<Select
						value={kind}
						onValueChange={onKindChange}
					>
						<SelectTrigger
							size="sm"
							className="w-36"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir="rtl"
						>
							{KIND_FILTER.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				}
				actions={
					<Button
						size="sm"
						onClick={onCreate}
					>
						<IconPlus className="size-4" />
						غذاء جديد
					</Button>
				}
			/>
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				onRowClick={(row) => onEdit(row.original)}
				emptyState={{
					title: isError ? "تعذّر جلب الكتالوج" : "لا أغذية في الكتالوج",
					description: isError
						? "حاول تحديث الصفحة"
						: "كثافة الطاقة (سعرة/كجم) هي عمود كل حساب — أضِف أول غذاء لتبدأ وصف الخطط",
					icon: <LuBone className="size-10 text-[#9CA3AF]" />,
					action: { label: "غذاء جديد", onClick: onCreate },
				}}
			/>
		</div>
	);
}
