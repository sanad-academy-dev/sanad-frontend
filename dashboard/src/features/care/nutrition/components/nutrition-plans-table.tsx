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
import { LuCarrot } from "react-icons/lu";

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
import type { NutritionPlanStatus } from "@/generated/prisma/enums";
import {
	GOAL_LABELS,
	type NutritionPlanListResponse,
	PLAN_STATUS_LABELS,
} from "@sanad/contracts/runtime/server/nutrition/nutrition.type";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

const STATUS_FILTER = [
	{ value: "ALL", label: "كل الحالات" },
	{ value: "DRAFT", label: "مسودّة" },
	{ value: "ACTIVE", label: "سارية" },
	{ value: "COMPLETED", label: "مكتملة" },
	{ value: "DISCONTINUED", label: "موقوفة" },
] as const;

const STATUS_TONE: Record<
	NutritionPlanStatus,
	"default" | "secondary" | "outline" | "destructive"
> = {
	DRAFT: "outline",
	ACTIVE: "default",
	COMPLETED: "secondary",
	DISCONTINUED: "destructive",
};

export function NutritionPlansTable({
	plans,
	isLoading,
	isError,
	search,
	onSearchChange,
	status,
	onStatusChange,
	onOpenPlan,
	onCreate,
}: {
	plans: NutritionPlanListResponse[];
	isLoading: boolean;
	isError?: boolean;
	search: string;
	onSearchChange: (value: string) => void;
	status: string;
	onStatusChange: (value: string) => void;
	onOpenPlan: (planId: string) => void;
	onCreate: () => void;
}) {
	const columns = useMemo<ColumnDef<NutritionPlanListResponse>[]>(
		() => [
			{
				accessorKey: "code",
				header: "الخطة",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium">{row.original.patient.name}</span>
						<span className="truncate text-xs tabular-nums text-muted-foreground">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "goal",
				header: "الهدف",
				cell: ({ row }) => <Badge variant="outline">{GOAL_LABELS[row.original.goal]}</Badge>,
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => (
					<Badge variant={STATUS_TONE[row.original.status]}>
						{PLAN_STATUS_LABELS[row.original.status]}
					</Badge>
				),
			},
			{
				id: "weight",
				header: "الوزن",
				cell: ({ row }) => (
					<span className="tabular-nums">
						{Number(row.original.currentWeightKg)} كجم
						{row.original.idealWeightKg && (
							<span className="text-muted-foreground">
								{" "}
								← {Number(row.original.idealWeightKg)}
							</span>
						)}
					</span>
				),
			},
			{
				id: "energy",
				header: "الطاقة",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col tabular-nums">
						<span>{Math.round(Number(row.original.derKcal))} سعرة/يوم</span>
						<span className="text-xs text-muted-foreground">
							RER {Math.round(Number(row.original.rerKcal))} × {Number(row.original.derFactor)}
						</span>
					</div>
				),
			},
			{
				accessorKey: "bodyConditionScore",
				header: "BCS",
				cell: ({ row }) =>
					row.original.bodyConditionScore ? (
						<span className="tabular-nums">{row.original.bodyConditionScore} / ٩</span>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: "nextRecheckAt",
				header: "المراجعة القادمة",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col tabular-nums">
						<span>
							{row.original.nextRecheckAt
								? dateFmt.format(new Date(row.original.nextRecheckAt))
								: "—"}
						</span>
						<span className="text-xs text-muted-foreground">
							{row.original._count.rechecks} مراجعة · {row.original._count.items} غذاء
						</span>
					</div>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: plans,
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
				searchPlaceholder="ابحث بالطفل أو رقم الخطة..."
				leftExtra={
					<Select
						value={status}
						onValueChange={onStatusChange}
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
							{STATUS_FILTER.map((option) => (
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
						خطة تغذية
					</Button>
				}
			/>
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				onRowClick={(row) => onOpenPlan(row.original.id)}
				emptyState={{
					title: isError ? "تعذّر جلب الخطط" : "لا خطط تغذية بعد",
					description: isError
						? "حاول تحديث الصفحة"
						: "ابدأ بتقييم غذائي لطفل — الوزن ودرجة حالة الجسم يكفيان",
					icon: <LuCarrot className="size-10 text-[#9CA3AF]" />,
					action: { label: "خطة تغذية جديدة", onClick: onCreate },
				}}
			/>
		</div>
	);
}
