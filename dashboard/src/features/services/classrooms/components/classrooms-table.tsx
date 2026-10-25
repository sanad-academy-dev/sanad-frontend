import { useMemo, useState } from "react";
import {
	IconDots,
	IconEdit,
	IconTrash,
	IconUserPlus,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { TableDataView } from "@/components/common/table-data-view";
import { AvatarCirclesStack } from "@/components/common/avatar-circles-stack";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssignStaffDialog } from "@/features/services/classrooms/components/assign-staff-dialog";
import { ClassroomSheet } from "@/features/services/classrooms/components/classroom-sheet";
import { DeleteClassroomDialog } from "@/features/services/classrooms/components/delete-classroom-dialog";
import { useClassrooms } from "@/features/services/classrooms/hooks/use-classrooms";
import { LEARNING_MODES } from "@/features/services/classrooms/data/constants";
import type { ClassroomResponse, ClassroomTeacher, LearningMode } from "@/server/classrooms/classrooms.type";
import { cn } from "@/lib/utils";

function formatArabicDate(dateVal?: string | Date | null) {
	if (!dateVal) return "—";
	try {
		const d = new Date(dateVal);
		if (Number.isNaN(d.getTime())) return "—";
		return new Intl.DateTimeFormat("ar-EG", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}).format(d);
	} catch {
		return "—";
	}
}

function TeachersCell({ teachers }: { teachers: ClassroomTeacher[] }) {
	if (!teachers || teachers.length === 0) {
		return <span className="text-[11px] text-muted-foreground">—</span>;
	}
	return (
		<AvatarCirclesStack
			items={teachers.map((t) => ({
				id: t.id,
				name: t.name,
				title: `${t.name}${t.phone ? ` • ${t.phone}` : ""}`,
			}))}
			variant="mauve"
			maxVisible={3}
		/>
	);
}

function CapacityCell({ enrolled, capacity }: { enrolled: number; capacity: number }) {
	const cap = capacity > 0 ? capacity : 1;
	const pct = Math.min(Math.round((enrolled / cap) * 100), 100);
	const isHigh = pct >= 80;
	const isMedium = pct >= 50;

	return (
		<div className="flex flex-col gap-1 w-24">
			<div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
				<span
					className={cn(
						"font-semibold",
						isHigh ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground",
					)}
				>
					{pct}%
				</span>
				<span className="text-[10px] text-muted-foreground">
					{enrolled}/{capacity}
				</span>
			</div>
			<div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
				<div
					className={cn(
						"h-full rounded-full transition-all",
						isHigh ? "bg-rose-500" : isMedium ? "bg-amber-500" : "bg-emerald-500",
					)}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

function StatusBadge({ active }: { active: boolean }) {
	if (active) {
		return (
			<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
				<span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
				نشط
			</span>
		);
	}
	return (
		<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
			<span className="size-1.5 rounded-full bg-slate-400" />
			غير نشط
		</span>
	);
}

interface ClassroomsTableProps {
	searchQuery?: string;
	onAddClassroom?: () => void;
}

export function ClassroomsTable({ searchQuery, onAddClassroom }: ClassroomsTableProps) {
	const [editingClassroom, setEditingClassroom] = useState<ClassroomResponse | null>(null);
	const [assigningClassroom, setAssigningClassroom] = useState<ClassroomResponse | null>(null);
	const [deletingClassroom, setDeletingClassroom] = useState<ClassroomResponse | null>(null);

	const { classrooms, isLoading } = useClassrooms(searchQuery);

	const columns = useMemo<ColumnDef<ClassroomResponse>[]>(
		() => [
			{
				id: "select",
				size: 40,
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
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار
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
			},
			{
				accessorKey: "name",
				header: "اسم الفصل / المعرف",
				size: 200,
				minSize: 180,
				cell: ({ row }) => (
					<div className="flex flex-col min-w-0">
						<span className="font-semibold text-xs text-foreground truncate cursor-pointer hover:underline">
							{row.original.name}
						</span>
						<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
							#{row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "ageGroup",
				header: "الفئة العمرية",
				size: 110,
				minSize: 95,
				cell: ({ row }) => {
					const val = row.original.ageGroup;
					if (!val) return <span className="text-[11px] text-muted-foreground">—</span>;
					return (
						<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700">
							{val}
						</span>
					);
				},
			},
			{
				accessorKey: "category",
				header: "الفئة التعليمية",
				size: 140,
				minSize: 120,
				cell: ({ row }) => {
					const val = row.original.category;
					if (!val) return <span className="text-[11px] text-muted-foreground">—</span>;
					return (
						<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900">
							{val}
						</span>
					);
				},
			},
			{
				accessorKey: "learningMode",
				header: "نمط التعلم",
				size: 100,
				minSize: 90,
				cell: ({ row }) => {
					const mode = (row.original.learningMode || "REMOTE") as LearningMode;
					const config = LEARNING_MODES[mode] || LEARNING_MODES.REMOTE;
					return (
						<span
							className={cn(
								"inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium border shadow-xs",
								config.className,
							)}
						>
							{config.label}
						</span>
					);
				},
			},
			{
				id: "teachers",
				header: "المشرف / المعلم",
				size: 130,
				minSize: 110,
				cell: ({ row }) => <TeachersCell teachers={row.original.teachers} />,
			},
			{
				accessorKey: "capacity",
				header: "السعة",
				size: 120,
				minSize: 105,
				cell: ({ row }) => (
					<CapacityCell
						enrolled={row.original.enrolledCount}
						capacity={row.original.capacity}
					/>
				),
			},
			{
				accessorKey: "createdAt",
				header: "تاريخ الإنشاء",
				size: 120,
				minSize: 110,
				cell: ({ row }) => (
					<span className="text-xs text-muted-foreground">
						{formatArabicDate(row.original.createdAt)}
					</span>
				),
			},
			{
				accessorKey: "active",
				header: "الحالة",
				size: 95,
				minSize: 85,
				cell: ({ row }) => <StatusBadge active={row.original.active} />,
			},
			{
				id: "actions",
				header: "الإجراءات",
				size: 120,
				minSize: 110,
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار
					<div
						className="flex items-center gap-1.5"
						onClick={(e) => e.stopPropagation()}
					>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setAssigningClassroom(row.original)}
							className="h-6.5 text-[11px] px-2 font-medium"
						>
							تعيين موظف
						</Button>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-6 text-muted-foreground hover:text-foreground"
								>
									<IconDots className="size-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem
									className="gap-2 text-xs"
									onSelect={() => setEditingClassroom(row.original)}
								>
									<IconEdit className="size-3.5" />
									تعديل الفصل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2 text-xs"
									onSelect={() => setAssigningClassroom(row.original)}
								>
									<IconUserPlus className="size-3.5" />
									المشرفون والمعلمون
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="gap-2 text-xs text-destructive"
									onSelect={() => setDeletingClassroom(row.original)}
								>
									<IconTrash className="size-3.5" />
									حذف الفصل
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
		data: classrooms,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<>
			<ClassroomSheet
				open={Boolean(editingClassroom)}
				onClose={() => setEditingClassroom(null)}
				classroom={editingClassroom}
			/>

			<AssignStaffDialog
				open={Boolean(assigningClassroom)}
				onOpenChange={(open) => !open && setAssigningClassroom(null)}
				classroom={assigningClassroom}
			/>

			<DeleteClassroomDialog
				classroom={deletingClassroom}
				onClose={() => setDeletingClassroom(null)}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				tableClassName="w-full min-w-[1050px]"
				onRowClick={(row) => setEditingClassroom(row.original)}
				emptyState={{
					title: "لا توجد فصول دراسية حتى الآن",
					description: "قم بإنشاء الفصول لتنظيم الطلاب ومجموعات التعلم وتعيين المعلمين والمشرفين",
					action: onAddClassroom ? { label: "إضافة فصل جديد", onClick: onAddClassroom } : undefined,
				}}
			/>
		</>
	);
}
