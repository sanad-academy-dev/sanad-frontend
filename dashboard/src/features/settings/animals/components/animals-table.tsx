import {
	IconAlertTriangle,
	IconPaw,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddAnimalSheet } from "@/features/settings/animals/components/add-animal-sheet";
import { useAnimalStrains } from "@/features/settings/animals/hooks/use-animal-strains";
import {
	formatRange,
	getSizeLabel,
} from "@/features/settings/animals/utils/animal-formatters";
import {
	ACTIVITY_LEVEL_LABELS,
	type AnimalStrainWithTypeResponse,
	GROOMING_NEEDS_LABELS,
	HAIR_TYPE_LABELS,
} from "@sanad/contracts/runtime/server/animal-strains/animal-strains.type";

export function AnimalsTable() {
	const { strains, isLoading } = useAnimalStrains();
	const [sheetOpen, setSheetOpen] = useState(false);

	const columns = useMemo<ColumnDef<AnimalStrainWithTypeResponse>[]>(
		() => [
			{
				accessorKey: "arName",
				header: "اسم السلالة / المعرف",
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
							<IconPaw className="size-3.5" />
						</div>
						<div className="flex flex-col">
							<span className="font-semibold text-sm">{row.original.arName}</span>
							<span className="text-xs text-muted-foreground">{row.original.enName}</span>
						</div>
					</div>
				),
			},
			{
				id: "animalType",
				header: "التصنيف",
				cell: ({ row }) => <Badge variant="primary">{row.original.animalType.arName}</Badge>,
			},
			{
				id: "hairType",
				header: "نوع الشعر",
				cell: ({ row }) => {
					const hairType = row.original.hairType;
					if (!hairType) return <span className="text-muted-foreground text-sm">—</span>;
					return <Badge variant="secondary">{HAIR_TYPE_LABELS[hairType].ar}</Badge>;
				},
			},
			{
				id: "commonDiseases",
				header: "الأمراض الشائعة",
				cell: ({ row }) => {
					const count = row.original.commonDiseases.length;
					if (count === 0) return <span className="text-muted-foreground text-sm">—</span>;
					return (
						<div className="flex items-center gap-1 text-destructive text-xs font-medium">
							<IconAlertTriangle className="size-3.5" />
							<span>{count} أمراض</span>
						</div>
					);
				},
			},
			{
				id: "avgAge",
				header: "متوسط العمر",
				cell: ({ row }) => (
					<span className="text-sm">
						{formatRange(row.original.avgAgeMin, row.original.avgAgeMax, "سنة")}
					</span>
				),
			},
			{
				id: "avgWeight",
				header: "الوزن",
				cell: ({ row }) => (
					<span className="text-sm">
						{formatRange(row.original.avgWeightMin, row.original.avgWeightMax, "كجم")}
					</span>
				),
			},
			{
				id: "size",
				header: "الحجم",
				cell: ({ row }) => {
					const label = getSizeLabel(row.original.avgWeightMax);
					if (!label) return <span className="text-muted-foreground text-sm">—</span>;
					return <Badge variant="secondary">{label}</Badge>;
				},
			},
			{
				id: "activityLevel",
				header: "مستوي النشاط",
				cell: ({ row }) => {
					const level = row.original.activityLevel;
					if (!level) return <span className="text-muted-foreground text-sm">—</span>;
					const label = ACTIVITY_LEVEL_LABELS[level].ar;
					return <Badge variant={level === "HIGH" ? "sub" : "secondary"}>{label}</Badge>;
				},
			},
			{
				id: "groomingNeeds",
				header: "العناية",
				cell: ({ row }) => {
					const grooming = row.original.groomingNeeds;
					if (!grooming) return <span className="text-muted-foreground text-sm">—</span>;
					const label = GROOMING_NEEDS_LABELS[grooming].ar;
					return <Badge variant={grooming === "HIGH" ? "sub" : "secondary"}>{label}</Badge>;
				},
			},
			{
				id: "actions",
				header: () => <span className="block text-center">الإجراءات</span>,
				cell: () => (
					<div className="flex items-center justify-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="size-7"
						>
							<IconPencil className="size-3.5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="size-7 text-destructive hover:text-destructive"
						>
							<IconTrash className="size-3.5" />
						</Button>
					</div>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: strains,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
		initialState: { pagination: { pageSize: 10 } },
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث باسم السلالة..."
				searchValue={(table.getState().globalFilter as string) ?? ""}
				onSearchChange={(v) => table.setGlobalFilter(v)}
				actions={
					<Button
						size="sm"
						onClick={() => setSheetOpen(true)}
					>
						<IconPlus />
						أضف سلالة جديدة
					</Button>
				}
			/>
			<AddAnimalSheet
				open={sheetOpen}
				onClose={() => setSheetOpen(false)}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				emptyState={{
					title: "لا يوجد سلالات حتى الآن",
					description: "أضف سلالات الأطفال لتتمكن من تصنيف الأطفال بشكل صحيح",
					action: { label: "أضف سلالة جديدة", onClick: () => setSheetOpen(true) },
				}}
			/>
		</div>
	);
}
