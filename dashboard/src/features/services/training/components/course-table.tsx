import {
	IconBan,
	IconCircleCheck,
	IconCopy,
	IconDots,
	IconExternalLink,
	IconPencil,
	IconSchool,
	IconTrash,
	IconUserPlus,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CourseCloneRow } from "@/features/services/training/components/course-clone-row";
import {
	courseLocationLabel,
	formatCourseDuration,
	formatTrainingCost,
} from "@/features/services/training/data/training";
import {
	extractCourseAcademicStage,
	resolveCourseAppearance,
} from "@/features/services/training/utils/course-meta";
import { resolveCover } from "@/features/services/training/utils/cover";
import { cn } from "@/lib/utils";
import type { CourseListItemResponse, CourseStatus } from "@sanad/contracts/runtime/server/training/training.type";
import { CourseStatusSelect } from "./course-status-select";
import { TrainersCell } from "./trainers-cell";

// تاريخ رقمي مضغوط مطابق لباقي جداول المنصة
const fmtDate = (d: Date | string) =>
	new Date(d).toLocaleDateString("ar-SA-u-nu-latn", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

// أبعاد الأعمدة متناسقة مع جدول المسارات وبنفس الثيم
const COLUMN_SIZES = [220, 130, 125, 85, 95, 120, 95, 95, 90, 90, 95, 145];

// جدول الدورات الخارجي — يعرض البيانات الفعلية للدورات الحالية بنفس ثيم المنصة والمسارات
export function CourseTable({
	courses,
	isLoading,
	onDelete,
	onEdit,
	onOpen,
	onDuplicate,
	onDisable,
	onEnable,
	onAssign,
	onRowOpen,
	onStatusChange,
	cloningCourseId,
}: {
	courses: CourseListItemResponse[];
	isLoading: boolean;
	onDelete: (course: CourseListItemResponse) => void;
	onEdit: (course: CourseListItemResponse) => void;
	onOpen: (course: CourseListItemResponse) => void;
	onDuplicate: (course: CourseListItemResponse) => void;
	onDisable: (course: CourseListItemResponse) => void;
	onEnable: (course: CourseListItemResponse) => void;
	onAssign: (course: CourseListItemResponse) => void;
	onRowOpen?: (course: CourseListItemResponse) => void;
	onStatusChange?: (course: CourseListItemResponse, newStatus: CourseStatus) => void;
	cloningCourseId?: string | null;
}) {
	const columns = useMemo<ColumnDef<CourseListItemResponse>[]>(
		() => [
			// 1) اسم الدورة / المعرّف مع الأيقونة واللون الفعلي للدورة
			{
				accessorKey: "name",
				header: "اسم الدورة / المعرّف",
				cell: ({ row }) => {
					const course = row.original;
					const cover = resolveCover(course.coverKey);
					const { Icon: CourseIcon, colorClass } = resolveCourseAppearance(course.description);
					return (
						<div className="flex items-center gap-2.5 min-w-0 group">
							{cover?.type === "image" ? (
								<img
									src={cover.url}
									alt={course.name}
									className="size-8 shrink-0 rounded-lg border border-border/60 object-cover"
								/>
							) : (
								<div
									className={cn(
										"flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-2xs",
										cover?.type === "color" ? "border-transparent text-white" : colorClass,
									)}
									style={
										cover?.type === "color" ? { backgroundColor: cover.color } : undefined
									}
								>
									<CourseIcon className="size-4" />
								</div>
							)}
							<div className="flex min-w-0 flex-col">
								<span className="truncate text-xs font-bold text-foreground group-hover:text-primary group-hover:underline">
									{course.name}
								</span>
								<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
									#{course.code}
								</span>
							</div>
						</div>
					);
				},
			},
			// 2) المرحلة الدراسية
			{
				id: "academicStage",
				header: "المرحلة الدراسية",
				cell: ({ row }) => {
					const val = extractCourseAcademicStage(row.original);
					if (!val || val === "بدون مرحلة دراسية") {
						return (
							<span className="inline-flex items-center rounded border border-dashed border-border/80 bg-transparent px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
								بدون مرحلة
							</span>
						);
					}
					return (
						<span className="inline-flex items-center gap-1 rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300">
							<IconSchool className="size-3 shrink-0" />
							<span className="truncate">{val}</span>
						</span>
					);
				},
			},
			// 3) التصنيف
			{
				id: "category",
				header: "التصنيف",
				cell: ({ row }) => {
					const cat = row.original.category?.trim() || row.original.department?.trim();
					return (
						<span
							className={cn(
								"inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium",
								cat
									? "border-border/80 bg-muted/40 text-foreground"
									: "border-dashed border-border/80 bg-transparent text-muted-foreground",
							)}
						>
							{cat || "بدون تصنيف"}
						</span>
					);
				},
			},
			// 4) # الوحدات
			{
				accessorKey: "contentCount",
				header: "# الوحدات",
				cell: ({ row }) => (
					<span className="text-xs font-semibold tabular-nums text-foreground">
						{row.original.contentCount}
					</span>
				),
			},
			// 5) مكان الدورة
			{
				id: "location",
				header: "مكان الدورة",
				cell: ({ row }) => {
					const mode = row.original.locationMode;
					const label = courseLocationLabel(mode);
					if (!label) {
						return <span className="text-xs text-muted-foreground">—</span>;
					}
					return (
						<span
							className={cn(
								"inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium",
								mode === "ONLINE"
									? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
									: mode === "ONSITE"
										? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300"
										: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
							)}
						>
							{label}
						</span>
					);
				},
			},
			// 6) المدربين
			{
				id: "trainers",
				header: "المدربين",
				cell: ({ row }) => {
					const trainers =
						row.original.trainers && row.original.trainers.length > 0
							? row.original.trainers
							: row.original.assignees || [];
					const totalCount = row.original.assignedCount || trainers.length;
					return (
						<TrainersCell
							trainers={trainers}
							totalCount={totalCount}
							maxVisible={3}
							emptyText="—"
						/>
					);
				},
			},
			// 7) فترة الدورة
			{
				id: "duration",
				header: "فترة الدورة",
				cell: ({ row }) => {
					const dur = formatCourseDuration(
						row.original.startDate,
						row.original.dueDate,
						row.original.estimatedDurationWeeks,
						row.original.description,
					);
					return (
						<span
							className={cn(
								"text-xs font-medium",
								dur ? "text-foreground" : "text-muted-foreground",
							)}
						>
							{dur || "بدون مدة"}
						</span>
					);
				},
			},
			// 8) السعر
			{
				id: "cost",
				header: "السعر",
				cell: ({ row }) => {
					const price = row.original.trainingCost;
					if (price == null) {
						return <span className="text-xs text-muted-foreground">—</span>;
					}
					return (
						<span className="text-xs font-semibold tabular-nums text-foreground">
							{price === 0 ? "مجاني" : formatTrainingCost(price, row.original)}
						</span>
					);
				},
			},
			// 10) آخر تحديث
			{
				accessorKey: "updatedAt",
				header: "آخر تحديث",
				cell: ({ row }) => (
					<span className="text-xs text-muted-foreground tabular-nums">
						{fmtDate(row.original.updatedAt)}
					</span>
				),
			},
			// 11) تاريخ الإنشاء
			{
				accessorKey: "createdAt",
				header: "تاريخ الإنشاء",
				cell: ({ row }) => (
					<span className="text-xs text-muted-foreground tabular-nums">
						{fmtDate(row.original.createdAt)}
					</span>
				),
			},
			// 12) حالة الدورة
			{
				accessorKey: "status",
				header: "حالة الدورة",
				size: 110,
				minSize: 100,
				cell: ({ row }) => (
					<CourseStatusSelect
						status={row.original.status}
						onChange={(newStatus) => onStatusChange?.(row.original, newStatus)}
					/>
				),
			},
			// 13) الإجراءات
			{
				id: "actions",
				header: "الإجراءات",
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: stop propagation for row actions
					// biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation for row actions
					<div
						className="flex items-center gap-1.5"
						onClick={(e) => e.stopPropagation()}
					>
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={() => onAssign(row.original)}
							className="h-6 gap-1 px-2 text-[11px] font-medium hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-pointer"
						>
							<IconUserPlus className="size-3.5" />
							تعيين مدرب
						</Button>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									aria-label="خيارات الدورة"
									className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
								>
									<IconDots className="size-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-[177px] gap-1 rounded-[4px] border border-[#E5E5E5] p-2 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
							>
								{[
									{
										label: "فتح الدورة",
										Icon: IconExternalLink,
										on: () => onOpen(row.original),
									},
									{ label: "تعديل", Icon: IconPencil, on: () => onEdit(row.original) },
									{ label: "استنساخ", Icon: IconCopy, on: () => onDuplicate(row.original) },
									row.original.status === "ARCHIVED"
										? {
												label: "إلغاء التعطيل",
												Icon: IconCircleCheck,
												on: () => onEnable(row.original),
											}
										: { label: "تعطيل", Icon: IconBan, on: () => onDisable(row.original) },
								].map(({ label, Icon, on }) => (
									<DropdownMenuItem
										key={label}
										onSelect={on}
										className="h-[29px] gap-2 rounded-[4px] px-2 text-xs font-medium cursor-pointer"
									>
										<Icon className="size-3.5" />
										{label}
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant="destructive"
									onSelect={() => onDelete(row.original)}
									className="h-[29px] gap-2 rounded-[4px] px-2 text-xs font-medium cursor-pointer"
								>
									<IconTrash className="size-3.5" />
									حذف
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
			},
		],
		[onDelete, onEdit, onOpen, onDuplicate, onDisable, onEnable, onAssign, onStatusChange],
	);

	const sizedColumns = useMemo(
		() => columns.map((c, i) => ({ ...c, size: COLUMN_SIZES[i] })),
		[columns],
	);

	const table = useReactTable({
		data: courses,
		columns: sizedColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<TableDataView
			table={table}
			columns={sizedColumns}
			isPending={isLoading}
			tableClassName="w-full min-w-[1250px]"
			onRowClick={onRowOpen ? (row) => onRowOpen(row.original) : undefined}
			renderAfterRow={(row) =>
				cloningCourseId === row.original.id ? (
					<CourseCloneRow
						name={row.original.name}
						colSpan={columns.length}
					/>
				) : null
			}
		/>
	);
}
