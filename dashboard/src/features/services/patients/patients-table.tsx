import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";
import {
	IconArrowsExchange,
	IconBan,
	IconCheck,
	IconChevronDown,
	IconChevronLeft,
	IconDots,
	IconEdit,
	IconEye,
	IconMail,
	IconPhone,
	IconPlayerPause,
	IconPlus,
	IconTrash,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
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
import { PatientSheet } from "@/features/services/patients/components/patient-sheet";
import { TransferOwnershipDialog } from "@/features/services/patients/components/transfer-ownership-dialog";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useUpdatePatient } from "@/features/services/patients/hooks/use-update-patient";
import { cn } from "@/lib/utils";

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
	const navigate = useNavigate();
	const [addSheetOpen, setAddSheetOpen] = useState(false);
	const [editingPatient, setEditingPatient] = useState<PatientResponse | null>(null);
	const [disablingPatient, setDisablingPatient] = useState<PatientResponse | null>(null);
	const [transferringPatient, setTransferringPatient] = useState<PatientResponse | null>(null);
	const [deletingPatient, setDeletingPatient] = useState<PatientResponse | null>(null);

	const { patients, isLoading } = usePatients();
	const { updatePatient } = useUpdatePatient();

	const handleStatusChange = useCallback(
		async (patient: PatientResponse, newStatus: string) => {
			try {
				await updatePatient(patient.id, {
					status: newStatus,
					active: newStatus === "ACTIVE",
				});
			} catch (e) {
				console.error(e);
			}
		},
		[updatePatient],
	);

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
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عنصر التحكم داخله قابل للوصول
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
				size: 260,
				minSize: 220,
				cell: ({ row }) => {
					const p = row.original;
					const isFemale = p.gender === "FEMALE";
					const genderText = isFemale ? "أنثى" : "ذكر";
					const ageText = p.age != null ? `${p.age} سنوات` : "—";
					const code = p.code || "PT-2024000";

					return (
						<div className="flex items-center gap-3 min-w-[200px]">
							<div
								className={cn(
									"flex size-9 shrink-0 items-center justify-center rounded-full border",
									isFemale
										? "bg-pink-50 border-pink-200 text-pink-500 dark:bg-pink-950/30 dark:border-pink-900/50"
										: "bg-blue-50 border-blue-200 text-blue-500 dark:bg-blue-950/30 dark:border-blue-900/50",
								)}
							>
								<IconUser className="size-4.5" />
							</div>
							<div className="flex flex-col gap-0.5 min-w-0">
								<Link
									to="/services/patients/$patientId"
									params={{ patientId: p.id }}
									className="font-bold text-sm text-foreground hover:underline truncate"
									onClick={(e) => e.stopPropagation()}
									title={p.name}
								>
									{p.name}
								</Link>
								{/* <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<span className="font-mono text-[11px] text-muted-foreground/80">{code}</span>
									<span>•</span>
									<span>{genderText}</span>
									<span>•</span>
									<span>{ageText}</span>
								</div> */}
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "classroom",
				header: "الفصل",
				size: 110,
				minSize: 90,
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
				header: "ولي الأمر / التواصل",
				size: 260,
				minSize: 220,
				cell: ({ row }) => {
					const p = row.original;
					const guardians =
						p.guardians && p.guardians.length > 0
							? p.guardians.map((g) => g.owner).filter(Boolean)
							: p.owner
								? [p.owner]
								: [];

					const primary = guardians[0];
					const guardianName = primary?.name || p.guardianName || "ولي أمر غير محدد";
					const phone = primary?.phone || p.guardianPhone;
					const initials = getGuardianInitials(guardianName);
					const extraCount = guardians.length > 1 ? guardians.length - 1 : 0;
					const extraNames =
						extraCount > 0 ? guardians.slice(1).map((g) => g.name).join("، ") : "";

					if (!primary && !p.guardianName && !phone) {
						return <span className="text-xs text-muted-foreground">—</span>;
					}

					return (
						<div className="flex items-center gap-2.5 min-w-[200px]">
							<div
								className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
								title={guardianName || undefined}
							>
								{initials}
							</div>
							<div className="flex flex-col gap-0.5 min-w-0">
								<div className="flex items-center gap-1.5 flex-wrap">
									<span
										className="font-semibold text-sm text-foreground truncate"
										title={guardianName || undefined}
									>
										{guardianName}
									</span>
									{extraCount > 0 && (
										<span
											className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0 cursor-help"
											title={`أولياء أمور إضافيون: ${extraNames}`}
										>
											+{extraCount}
										</span>
									)}
								</div>
								<div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
									{phone ? (
										<span className="tabular-nums flex items-center gap-1.5 text-xs">
											<IconPhone className="size-3 text-muted-foreground shrink-0" />
											<span dir="ltr" className="text-right font-mono">
												{phone}
											</span>
										</span>
									) : (
										"-"
									)}
								</div>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "birthDate",
				header: "تاريخ الميلاد",
				size: 120,
				minSize: 100,
				cell: ({ row }) => (
					<span className="text-xs text-foreground font-mono">
						{formatDate(row.original.birthDate)}
					</span>
				),
			},
			{
				accessorKey: "bloodType",
				header: "فصيلة الدم",
				size: 95,
				minSize: 80,
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
				size: 130,
				minSize: 110,
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
				size: 130,
				minSize: 110,
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
				size: 120,
				minSize: 100,
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
				size: 105,
				minSize: 90,
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
				size: 120,
				minSize: 100,
				cell: ({ row }) => (
					<span className="text-xs text-muted-foreground font-mono">
						{formatDate(row.original.updatedAt || row.original.createdAt)}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				size: 120,
				minSize: 100,
				cell: ({ row }) => {
					const p = row.original;
					const currentStatus = p.status || (p.active ? "ACTIVE" : "SUSPENDED");
					const isPendingOrSuspended =
						currentStatus === "SUSPENDED" || currentStatus === "PENDING";

					return (
						// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
						// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عنصر التحكم داخله قابل للوصول
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
				size: 120,
				minSize: 110,
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عنصر التحكم داخله قابل للوصول
					<div
						className="flex items-center "
						onClick={(e) => e.stopPropagation()}
					>
					

						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-7 text-muted-foreground hover:text-foreground"
								>
									<IconDots className="size-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem
									className="gap-2"
									onSelect={() =>
										navigate({
											to: "/services/patients/$patientId",
											params: { patientId: row.original.id },
										})
									}
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
		[handleStatusChange, navigate],
	);

	const table = useReactTable({
		data: patients,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: (row, _columnId, filterValue) => {
			const search = String(filterValue).toLowerCase().trim();
			if (!search) return true;
			const p = row.original;
			const guardianName = p.guardianName || p.owner?.name || "";
			const guardianPhone = p.guardianPhone || p.owner?.phone || "";
			const guardianEmail = p.guardianEmail || p.owner?.email || "";
			const studentName = p.name || "";
			const code = p.code || "";
			const classroom = p.classroom || "";
			return (
				studentName.toLowerCase().includes(search) ||
				code.toLowerCase().includes(search) ||
				guardianName.toLowerCase().includes(search) ||
				guardianPhone.toLowerCase().includes(search) ||
				guardianEmail.toLowerCase().includes(search) ||
				classroom.toLowerCase().includes(search)
			);
		},
	});

	return (
		<>
			<AddPatientSheet
				open={addSheetOpen}
				onClose={() => setAddSheetOpen(false)}
			/>
			<PatientSheet
				open={!!editingPatient}
				onClose={() => setEditingPatient(null)}
				patient={editingPatient}
				onSuccess={() => setEditingPatient(null)}
			/>
			<DisablePatientDialog
				patient={disablingPatient}
				onClose={() => setDisablingPatient(null)}
				onSuccess={() => setDisablingPatient(null)}
			/>
			<TransferOwnershipDialog
				patient={transferringPatient}
				onClose={() => setTransferringPatient(null)}
				onSuccess={() => setTransferringPatient(null)}
			/>
			<DeletePatientDialog
				patient={deletingPatient}
				onClose={() => setDeletingPatient(null)}
				onSuccess={() => setDeletingPatient(null)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchPlaceholder="ابحث باسم الطالب، ولي الأمر، أو رقم التواصل..."
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
					tableClassName="w-full min-w-[1600px]"
					onRowClick={(row) =>
						navigate({
							to: "/services/patients/$patientId",
							params: { patientId: row.original.id },
						})
					}
					emptyState={{
						title: "لا يوجد طلاب حتى الآن",
						description: "ملفات الطلاب تساعدك على متابعة بياناتهم، وحضورهم، وفصولهم بشكل منظم",
						action: { label: "إضافة طالب جديد", onClick: () => setAddSheetOpen(true) },
					}}
				/>
				
			</div>
		</>
	);
}
