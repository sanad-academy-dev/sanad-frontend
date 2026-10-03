import {
	IconArrowsExchange,
	IconBan,
	IconBell,
	IconCalendar,
	IconDots,
	IconEdit,
	IconEye,
	IconPlus,
	IconThermometer,
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
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeletePatientDialog } from "@/features/services/patients/components/delete-patient-dialog";
import { DisablePatientDialog } from "@/features/services/patients/components/disable-patient-dialog";
import { PatientProfileSheet } from "@/features/services/patients/components/patient-profile-sheet";
import { PatientSheet } from "@/features/services/patients/components/patient-sheet";
import { TransferOwnershipDialog } from "@/features/services/patients/components/transfer-ownership-dialog";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import type { PatientResponse } from "@/server/patients/patients.type";

function OwnerAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary primarytext-xs font-semibold border border-primary/20">
			{initials}
		</div>
	);
}

export function PatientsTable() {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [viewingPatient, setViewingPatient] = useState<PatientResponse | null>(null);
	const [editingPatient, setEditingPatient] = useState<PatientResponse | null>(null);
	const [disablingPatient, setDisablingPatient] = useState<PatientResponse | null>(null);
	const [transferringPatient, setTransferringPatient] = useState<PatientResponse | null>(null);
	const [deletingPatient, setDeletingPatient] = useState<PatientResponse | null>(null);
	const { patients, isLoading } = usePatients();

	const columns = useMemo<ColumnDef<PatientResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "اسم الطفل / المعرف",
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<div className="flex flex-col">
							<span className="font-semibold text-sm">{row.original.name}</span>
							<span className="text-xs text-muted-foreground">{row.original.code}</span>
						</div>
					</div>
				),
			},
			{
				accessorKey: "animalType",
				header: "النوع",
				cell: ({ row }) => (
					<span className="text-sm">{row.original.animalType?.arName ?? "—"}</span>
				),
			},
			{
				accessorKey: "owner",
				header: "وليّ الأمر",
				cell: ({ row }) => {
					const owner = row.original.owner;
					if (!owner) return <span className="text-muted-foreground text-sm">—</span>;
					return (
						<div className="flex items-center gap-2">
							<OwnerAvatar name={owner.name} />
							<div className="flex flex-col gap-0.5">
								<span className="font-medium text-sm">{owner.name}</span>
								{owner.phone && (
									<span className="text-xs text-muted-foreground tabular-nums">
										{owner.phone}
									</span>
								)}
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "age",
				header: "العمر",
				cell: ({ row }) =>
					row.original.age != null ? (
						<span className="text-sm tabular-nums">{row.original.age} سنوات</span>
					) : (
						<span className="text-muted-foreground text-sm">—</span>
					),
			},
			{
				accessorKey: "weight",
				header: "الوزن",
				cell: ({ row }) =>
					row.original.weight != null ? (
						<div className="flex items-center gap-1.5">
							<span className="text-sm tabular-nums border rounded px-2 py-0.5">
								{row.original.weight} kg
							</span>
						</div>
					) : (
						<span className="text-muted-foreground text-sm">—</span>
					),
			},
			{
				id: "lastVisit",
				header: "آخر زيارة",
				cell: () => (
					<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
						<IconCalendar className="size-3.5 shrink-0" />—
					</span>
				),
			},
			{
				id: "nextVisit",
				header: "الزيارة القادمة",
				cell: () => (
					<div className="flex items-center gap-2">
						<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
							<IconCalendar className="size-3.5 shrink-0" />—
						</span>
						<Button
							variant="outline"
							size="sm"
							className="h-6 px-2 text-xs"
							onClick={(e) => e.stopPropagation()}
						>
							<IconBell className="size-3" />
							تذكير
						</Button>
					</div>
				),
			},
			{
				id: "patientStatus",
				header: "حالة الطفل",
				cell: () => (
					<p className="flex items-center gap-1 text-sm">
						<IconThermometer className="size-4 text-emerald-500" />
						<span className="text-emerald-500">سليم</span>
					</p>
				),
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عناصر القائمة نفسها قابلة للوصول بلوحة المفاتيح
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
									onSelect={() => setViewingPatient(row.original)}
								>
									<IconEye className="size-4" />
									فتح
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setEditingPatient(row.original)}
								>
									<IconEdit className="size-4" />
									تعديل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setTransferringPatient(row.original)}
								>
									<IconArrowsExchange className="size-4" />
									نقل ملكية
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setDisablingPatient(row.original)}
								>
									<IconBan className="size-4" />
									تعطيل
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive gap-2"
									onSelect={() => setDeletingPatient(row.original)}
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
		data: patients,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	return (
		<>
			<PatientSheet
				open={sheetOpen}
				onClose={() => setSheetOpen(false)}
			/>
			<PatientProfileSheet
				open={!!viewingPatient}
				onClose={() => setViewingPatient(null)}
				patient={viewingPatient}
			/>
			<PatientSheet
				open={!!editingPatient}
				onClose={() => setEditingPatient(null)}
				patient={editingPatient}
			/>
			<DisablePatientDialog
				patient={disablingPatient}
				onClose={() => setDisablingPatient(null)}
			/>
			<TransferOwnershipDialog
				patient={transferringPatient}
				onClose={() => setTransferringPatient(null)}
			/>
			<DeletePatientDialog
				patient={deletingPatient}
				onClose={() => setDeletingPatient(null)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchPlaceholder="ابحث باسم الطفل..."
					searchValue={(table.getState().globalFilter as string) ?? ""}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<Button
							size="sm"
							onClick={() => setSheetOpen(true)}
						>
							<IconPlus />
							أضف طفل جديد
						</Button>
					}
				/>

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					onRowClick={(row) => setViewingPatient(row.original)}
					emptyState={{
						title: "لا يوجد أطفال حتى الآن",
						description:
							"ملفات الأطفال تساعدك على متابعة حالته الصحية، زياراته، والعلاجات بشكل منظم",
						action: { label: "أضف طفل جديد", onClick: () => setSheetOpen(true) },
					}}
				/>
			</div>
		</>
	);
}
