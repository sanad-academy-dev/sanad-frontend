import type { ColumnDef } from "@tanstack/react-table";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	IconAlertTriangle,
	IconArrowsExchange,
	IconBan,
	IconCheck,
	IconChevronDown,
	IconDots,
	IconEdit,
	IconEye,
	IconMoodSmile,
	IconPlayerPause,
	IconPlus,
	IconTrash,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddPatientSheet } from "@/features/services/patients/components/add-patient-sheet";
import { DeletePatientDialog } from "@/features/services/patients/components/delete-patient-dialog";
import { DisablePatientDialog } from "@/features/services/patients/components/disable-patient-dialog";
import { PatientProfileSheet } from "@/features/services/patients/components/patient-profile-sheet";
import { PatientSheet } from "@/features/services/patients/components/patient-sheet";
import { TransferOwnershipDialog } from "@/features/services/patients/components/transfer-ownership-dialog";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useUpdatePatient } from "@/features/services/patients/hooks/use-update-patient";
import { cn } from "@/lib/utils";
import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";

function getGuardianInitials(name?: string | null) {
	if (!name) return "—";
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

function formatDate(dateVal?: string | Date | null) {
	if (!dateVal) return "—";
	const d = new Date(dateVal);
	if (Number.isNaN(d.getTime())) return "—";
	const day = d.getDate();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
}

export function PatientsTable() {
	const [addSheetOpen, setAddSheetOpen] = useState(false);
	const [viewingPatient, setViewingPatient] = useState<PatientResponse | null>(null);
	const [editingPatient, setEditingPatient] = useState<PatientResponse | null>(null);
	const [disablingPatient, setDisablingPatient] = useState<PatientResponse | null>(null);
	const [transferringPatient, setTransferringPatient] = useState<PatientResponse | null>(null);
	const [deletingPatient, setDeletingPatient] = useState<PatientResponse | null>(null);

	const { patients, isLoading } = usePatients();
	const { updatePatient } = useUpdatePatient();

	const handleStatusChange = async (patient: PatientResponse, newStatus: string) => {
		try {
			await updatePatient(patient.id, {
				status: newStatus,
				active: newStatus === "ACTIVE",
			});
		} catch (e) {
			console.error(e);
		}
	};

	const columns = useMemo<ColumnDef<PatientResponse>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
						aria-label="تحديد الكل"
						className="translate-y-0.5"
					/>
				),
				cell: ({ row }) => (
					<div onClick={(e) => e.stopPropagation()}>
						<Checkbox
							checked={row.getIsSelected()}
							onCheckedChange={(value) => row.toggleSelected(!!value)}
							aria-label="تحديد الصف"
							className="translate-y-0.5"
						/>
					</div>
				),
				enableSorting: false,
				enableHiding: false,
				size: 40,
			},
			{
				accessorKey: "name",
				header: "الطالب",
				cell: ({ row }) => {
					const p = row.original;
					const isFemale = p.gender === "FEMALE";
					const genderText = isFemale ? "أنثى" : "ذكر";
					const ageText = p.age != null ? `${p.age} سنوات` : "—";
					const code = p.code || "F-2024000";

					return (
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"flex size-9 shrink-0 items-center justify-center rounded-full border",
									isFemale
										? "bg-pink-50 border-pink-200 text-pink-500"
										: "bg-blue-50 border-blue-200 text-blue-500",
								)}
							>
								<IconUser className="size-4.5" />
							</div>
							<div className="flex flex-col gap-0.5">
								<span className="font-bold text-sm text-foreground">{p.name}</span>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<span>{code}</span>
									<span>-</span>
									<span>{genderText}</span>
									<span>-</span>
									<span>{ageText}</span>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "classroom",
				header: "الفصل",
				cell: ({ row }) => {
					const cls = row.original.classroom || "النجوم";
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
							{cls}
						</span>
					);
				},
			},
			{
				id: "guardian",
				header: "ولي الأمر",
				cell: ({ row }) => {
					const p = row.original;
					const guardianName = p.guardianName || p.owner?.name;
					const initials = getGuardianInitials(guardianName);

					return (
						<div
							className="flex items-center justify-center size-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold"
							title={guardianName || undefined}
						>
							{initials}
						</div>
					);
				},
			},
			{
				accessorKey: "birthDate",
				header: "تاريخ الميلاد",
				cell: ({ row }) => (
					<span className="text-xs text-foreground font-mono">
						{formatDate(row.original.birthDate)}
					</span>
				),
			},
			{
				accessorKey: "bloodType",
				header: "فصيلة الدم",
				cell: ({ row }) => {
					const bt = row.original.bloodType || "A+";
					return (
						<span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900">
							{bt}
						</span>
					);
				},
			},
			{
				accessorKey: "developmentStatus",
				header: "الحالة النمائية",
				cell: ({ row }) => {
					const dev = row.original.developmentStatus || "NORMAL";
					if (dev === "ADVANCED") {
						return (
							<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
								متقدم
							</span>
						);
					}
					if (dev === "NEEDS_FOLLOW_UP") {
						return (
							<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
								يحتاج متابعة
							</span>
						);
					}
					return (
						<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
							طبيعي
						</span>
					);
				},
			},
			{
				accessorKey: "allergies",
				header: "الحساسيات",
				cell: ({ row }) => {
					const alg = row.original.allergies?.trim();
					if (!alg || alg === "لا يوجد") {
						return <span className="text-xs text-muted-foreground">لا يوجد</span>;
					}
					return (
						<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
							{alg}
						</span>
					);
				},
			},
			{
				accessorKey: "feeType",
				header: "نوع الرسوم",
				cell: ({ row }) => {
					const fee = row.original.feeType?.trim();
					if (!fee) {
						return <span className="text-xs text-muted-foreground">—</span>;
					}
					return (
						<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
							{fee}
						</span>
					);
				},
			},
			{
				accessorKey: "pocketMoneyEnabled",
				header: "المصروف",
				cell: ({ row }) => {
					const enabled = row.original.pocketMoneyEnabled !== false;
					if (enabled) {
						return (
							<span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
								<IconCheck className="size-3.5 rounded-full border border-emerald-500 p-0.5" />
								مفعّل
							</span>
						);
					}
					return (
						<span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
							<IconX className="size-3.5 rounded-full border border-rose-500 p-0.5" />
							غير مفعّل
						</span>
					);
				},
			},
			{
				accessorKey: "updatedAt",
				header: "آخر تحديث",
				cell: ({ row }) => (
					<span className="text-xs text-muted-foreground font-mono">
						{formatDate(row.original.updatedAt || row.original.createdAt)}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => {
					const p = row.original;
					const currentStatus = p.status || (p.active ? "ACTIVE" : "SUSPENDED");
					const isPendingOrSuspended =
						currentStatus === "SUSPENDED" || currentStatus === "PENDING";

					return (
						<div onClick={(e) => e.stopPropagation()}>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className={cn(
											"h-7 gap-1 px-2.5 text-xs font-medium rounded-md border",
											isPendingOrSuspended
												? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-900"
												: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900",
										)}
									>
										<IconChevronDown className="size-3.5" />
										{isPendingOrSuspended ? (
											<>
												<IconPlayerPause className="size-3" />
												معلق
											</>
										) : (
											<>
												<IconCheck className="size-3" />
												نشط
											</>
										)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem
										onClick={() => handleStatusChange(p, "ACTIVE")}
										className="gap-2 text-xs"
									>
										<IconCheck className="size-3.5 text-emerald-600" />
										نشط
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleStatusChange(p, "SUSPENDED")}
										className="gap-2 text-xs"
									>
										<IconPlayerPause className="size-3.5 text-amber-600" />
										معلق
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => (
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
									{row.original.active ? "تعطيل" : "تفعيل"}
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

	const activeViewingPatient = useMemo(() => {
		if (!viewingPatient) return null;
		return patients.find((p) => p.id === viewingPatient.id) ?? viewingPatient;
	}, [patients, viewingPatient]);

	return (
		<>
			<AddPatientSheet
				open={addSheetOpen}
				onClose={() => setAddSheetOpen(false)}
			/>
			<PatientProfileSheet
				open={!!activeViewingPatient}
				onClose={() => setViewingPatient(null)}
				patient={activeViewingPatient}
				onPatientChange={(updated) => setViewingPatient(updated)}
			/>
			<PatientSheet
				open={!!editingPatient}
				onClose={() => setEditingPatient(null)}
				patient={editingPatient}
				onSuccess={(updated) => {
					setEditingPatient(null);
					if (viewingPatient?.id === updated.id) {
						setViewingPatient(updated);
					}
				}}
			/>
			<DisablePatientDialog
				patient={disablingPatient}
				onClose={() => setDisablingPatient(null)}
				onSuccess={(updated) => {
					setDisablingPatient(null);
					if (viewingPatient?.id === updated.id) {
						setViewingPatient(updated);
					}
				}}
			/>
			<TransferOwnershipDialog
				patient={transferringPatient}
				onClose={() => setTransferringPatient(null)}
				onSuccess={(updated) => {
					setTransferringPatient(null);
					if (viewingPatient?.id === updated.id) {
						setViewingPatient(updated);
					}
				}}
			/>
			<DeletePatientDialog
				patient={deletingPatient}
				onClose={() => setDeletingPatient(null)}
				onSuccess={(deletedId) => {
					setDeletingPatient(null);
					if (viewingPatient?.id === deletedId) {
						setViewingPatient(null);
					}
				}}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchPlaceholder="ابحث باسم الطالب..."
					searchValue={(table.getState().globalFilter as string) ?? ""}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<Button
							size="sm"
							onClick={() => setAddSheetOpen(true)}
						>
							<IconPlus className="size-4" />
							إضافة طالب جديد
						</Button>
					}
				/>

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					onRowClick={(row) => setViewingPatient(row.original)}
					emptyState={{
						title: "لا يوجد طلاب حتى الآن",
						description:
							"ملفات الطلاب تساعدك على متابعة بياناتهم، وحضورهم، وفصولهم بشكل منظم",
						action: { label: "إضافة طالب جديد", onClick: () => setAddSheetOpen(true) },
					}}
				/>
			</div>
		</>
	);
}
