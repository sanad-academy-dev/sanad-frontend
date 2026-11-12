import {
	IconAward,
	IconCalendar,
	IconCheck,
	IconDots,
	IconEdit,
	IconEye,
	IconMapPin,
	IconPlus,
	IconSchool,
	IconStarFilled,
	IconTrash,
	IconUserPlus,
	IconUsers,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AvatarCirclesStack } from "@/components/common/avatar-circles-stack";
import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { TableDataView } from "@/components/common/table-data-view";
import { TablePagination } from "@/components/common/table-pagination";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { AGE_GROUPS } from "@/features/services/classrooms/data/constants";
import { useAcademicStageOptions } from "@/features/services/classrooms/hooks/use-classrooms";
import { cn } from "@/lib/utils";
import {
	useAssignTrackStaff,
	useDeleteTrack,
	useTrackStats,
	useTracks,
	useUpdateTrack,
} from "../hooks/use-tracks";
import { AssignTrackStaffSheet } from "./assign-track-staff-sheet";
import { AssignTrackStudentsSheet } from "./assign-track-students-sheet";
import { TrackDialog } from "./track-dialog";
import { TrackStatusSelect } from "./track-status-select";

export type TrackStatus = "ACTIVE" | "PENDING" | "COMPLETED" | "DRAFT";
export type TrackLocationMode = "ONLINE" | "IN_PERSON" | "HYBRID";

export type TrackRow = {
	id: string;
	code: string;
	name: string;
	category: string;
	coursesCount: number;
	locationMode: TrackLocationMode;
	locationLabel: string;
	trainers: { id: string; name: string; avatar?: string }[];
	students?: { id: string; name?: string; code?: string; gender?: string; avatar?: string }[];
	studentIds?: string[];
	duration: string;
	studentsCount: number;
	rating: number;
	reviewsCount: number;
	price: number;
	revenue: number;
	status: TrackStatus;
	description?: string;
	notes?: string;
	academicStage?: string;
	ageGroup?: string;
	selectedIcon?: string;
	selectedColor?: string;
};

export function TracksView() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const pageSize = 100;
	const {
		tracks: serverTracks,
		total: totalTracks,
		totalPages: totalTrackPages,
		isLoading: isTracksLoading,
		refetch: refetchTracks,
	} = useTracks(search, page, pageSize);
	useEffect(() => {
		if (page > totalTrackPages) setPage(totalTrackPages);
	}, [page, totalTrackPages]);
	const { stats: serverStats, refetch: refetchStats } = useTrackStats();
	const { mutate: deleteTrackMutation, isPending: isDeleting } = useDeleteTrack();
	const { mutate: updateTrackMutation } = useUpdateTrack();
	const { mutate: assignStaffMutation } = useAssignTrackStaff();
	const { academicStages } = useAcademicStageOptions();

	// استخدام بيانات قاعدة البيانات عبر الباك إند مع حالة فورية للتحديث السلس
	const [localTracks, setLocalTracks] = useState<TrackRow[]>([]);

	useEffect(() => {
		setLocalTracks((prev) => {
			if (prev === serverTracks) return prev;
			if (prev.length === 0 && serverTracks.length === 0) return prev;
			return serverTracks;
		});
	}, [serverTracks]);

	const tracks = localTracks;

	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
	const [selectedAcademicStages, setSelectedAcademicStages] = useState<string[]>([]);

	// نوافذ الحوار والسايد شيت
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [assigningTrack, setAssigningTrack] = useState<TrackRow | null>(null);
	const [assigningStaffTrack, setAssigningStaffTrack] = useState<TrackRow | null>(null);
	const [editingTrack, setEditingTrack] = useState<TrackRow | null>(null);
	const [deletingTrack, setDeletingTrack] = useState<TrackRow | null>(null);

	// بطاقات الإحصائيات مربوطة بالباك إند وقاعدة البيانات
	const statsData = useMemo<StatItem[]>(() => {
		const totalTracks = serverStats?.totalTracks ?? 0;
		const totalStudents = serverStats?.totalStudents ?? 0;
		const pendingTracks = serverStats?.pendingTracks ?? 0;
		const completedTracks = serverStats?.completedTracks ?? 0;
		const totalRevenue = serverStats?.totalRevenue ?? 0;

		return [
			{
				title: "اجمالي المسارات",
				value: totalTracks,
				tooltip: "العدد الكلي للمسارات التدريبية المسجلة في المنصة",
			},
			{
				title: "# الطلاب",
				value: totalStudents,
				tooltip: "عدد الطلاب الملتحقين بالمسارات",
			},
			{
				title: "جاري",
				value: pendingTracks,
				tooltip: "المسارات قيد التنفيذ حالياً",
			},
			{
				title: "مكتمل",
				value: completedTracks,
				tooltip: "المسارات التي اكتملت بنجاح",
			},
			{
				title: "قيمة التسجيلات التقديرية",
				value: totalRevenue,
				valueLabel: totalRevenue.toLocaleString("ar-EG"),
				tooltip: "السعر الحالي مضروبًا في عدد الطلاب المسجلين، وليس المدفوعات المحصلة",
			},
		];
	}, [serverStats]);

	// تصفية المسارات
	const filteredTracks = useMemo(() => {
		return tracks.filter((t) => {
			if (selectedStatuses.length > 0 && !selectedStatuses.includes(t.status)) {
				return false;
			}
			if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) {
				return false;
			}
			if (selectedLocations.length > 0 && !selectedLocations.includes(t.locationMode)) {
				return false;
			}
			if (
				selectedAcademicStages.length > 0 &&
				!selectedAcademicStages.includes(t.academicStage || "")
			) {
				return false;
			}
			return true;
		});
	}, [tracks, selectedStatuses, selectedCategories, selectedLocations, selectedAcademicStages]);

	// فلاتر قائمة التصفية
	const filterGroups: FilterGroup[] = useMemo(
		() => [
			{
				key: "status",
				label: "الحالة",
				Icon: IconCheck,
				options: [
					{ value: "ACTIVE", label: "نشط" },
					{ value: "PENDING", label: "جاري" },
					{ value: "COMPLETED", label: "مكتمل" },
					{ value: "DRAFT", label: "مسودة" },
				],
				selected: selectedStatuses,
				onToggle: (v) =>
					setSelectedStatuses((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
			{
				key: "academicStage",
				label: "المرحلة الدراسية",
				Icon: IconSchool,
				options: academicStages.map((stage) => ({ value: stage, label: stage })),
				selected: selectedAcademicStages,
				onToggle: (v) =>
					setSelectedAcademicStages((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
			{
				key: "location",
				label: "مكان المسار",
				Icon: IconMapPin,
				options: [
					{ value: "ONLINE", label: "أونلاين" },
					{ value: "IN_PERSON", label: "حضوري" },
					{ value: "HYBRID", label: "مدمج" },
				],
				selected: selectedLocations,
				onToggle: (v) =>
					setSelectedLocations((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
			{
				key: "category",
				label: "المسار",
				Icon: IconAward,
				options: [
					{ value: "البرمجة والمنطق", label: "البرمجة والمنطق" },
					{ value: "طبي وتأهيلي", label: "طبي وتأهيلي" },
					{ value: "نفسي وسلوكي", label: "نفسي وسلوكي" },
					{ value: "تدريب تربوي", label: "تدريب تربوي" },
					{ value: "عام وتوعوي", label: "عام وتوعوي" },
					{ value: "إداري وقيادي", label: "إداري وقيادي" },
				],
				selected: selectedCategories,
				onToggle: (v) =>
					setSelectedCategories((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
		],
		[selectedStatuses, selectedAcademicStages, academicStages, selectedLocations, selectedCategories],
	);

	const clearAllFilters = useCallback(() => {
		setSelectedStatuses([]);
		setSelectedCategories([]);
		setSelectedLocations([]);
		setSelectedAcademicStages([]);
	}, []);

	const handleStatusChange = useCallback((trackId: string, newStatus: TrackStatus) => {
		setLocalTracks((prev) =>
			prev.map((t) => (t.id === trackId ? { ...t, status: newStatus } : t)),
		);
		updateTrackMutation(
			{ id: trackId, data: { status: newStatus } },
			{
				onSuccess: () => {
					refetchTracks();
					refetchStats();
					toast.success("تم تحديث حالة المسار بنجاح");
				},
				onError: () => {
					refetchTracks();
				},
			},
		);
	}, [refetchStats, refetchTracks, updateTrackMutation]);

	// أعمدة الجدول مطابقة للتصميم المرفق تماماً
	const columns = useMemo<ColumnDef<TrackRow>[]>(
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
				header: "اسم المسار / المعرّف",
				size: 210,
				minSize: 180,
				cell: ({ row }) => {
					const tr = row.original;
					return (
						<div
							className="flex flex-col min-w-0 group cursor-pointer"
							onClick={() => setEditingTrack(tr)}
						>
							<span className="font-bold text-xs text-foreground group-hover:text-primary group-hover:underline truncate">
								{tr.name}
							</span>
							<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
								#{tr.code}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: "academicStage",
				header: "المرحلة الدراسية",
				size: 130,
				minSize: 110,
				cell: ({ row }) => {
					const val = row.original.academicStage?.trim();
					if (!val || val === "بدون مرحلة دراسية") {
						return (
							<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border border-dashed border-border/80 bg-transparent text-muted-foreground">
								بدون مرحلة
							</span>
						);
					}
					return (
						<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
							<IconSchool className="size-3 shrink-0" />
							<span>{val}</span>
						</span>
					);
				},
			},
			{
				accessorKey: "category",
				header: "التصنيف",
				size: 130,
				minSize: 110,
				cell: ({ row }) => {
					const cat = row.original.category?.trim();
					return (
						<span
							className={cn(
								"inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border",
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
			{
				accessorKey: "coursesCount",
				header: "# الدورات",
				size: 85,
				minSize: 75,
				cell: ({ row }) => (
					<span className="text-xs font-semibold tabular-nums text-foreground">
						{row.original.coursesCount}
					</span>
				),
			},
			{
				accessorKey: "locationLabel",
				header: "مكان المسار",
				size: 100,
				minSize: 90,
				cell: ({ row }) => {
					const mode = row.original.locationMode;
					return (
						<span
							className={cn(
								"inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border",
								mode === "ONLINE"
									? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900"
									: mode === "IN_PERSON"
										? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900"
										: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
							)}
						>
							{row.original.locationLabel}
						</span>
					);
				},
			},
			{
				id: "trainers",
				header: "المدربين",
				size: 130,
				minSize: 110,
				cell: ({ row }) => {
					const trainers = row.original.trainers || [];
					if (trainers.length === 0) {
						return <span className="text-xs text-muted-foreground">بدون مدرب</span>;
					}
					return (
						<AvatarCirclesStack
							items={trainers.map((t) => ({
								id: t.id,
								name: t.name,
								title: t.name,
							}))}
							variant="mauve"
							maxVisible={4}
						/>
					);
				},
			},
			{
				accessorKey: "duration",
				header: "فترة المسار",
				size: 100,
				minSize: 85,
				cell: ({ row }) => {
					const dur = row.original.duration?.trim();
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
			{
				id: "students",
				header: "# الطلاب",
				size: 140,
				minSize: 120,
				cell: ({ row }) => {
					const tr = row.original;
					return (
						<div
							className="flex items-center gap-1.5 text-xs cursor-pointer group"
							onClick={(e) => {
								e.stopPropagation();
								setAssigningTrack(tr);
							}}
							title="تسجيل وتعيين الطلاب في المسار"
						>
							<span className="font-medium text-foreground group-hover:text-primary group-hover:underline tabular-nums">
								{tr.studentsCount} طالب
							</span>
							{/* {tr.rating > 0 && (
								<>
									<span className="text-muted-foreground">•</span>
									<span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
										<IconStarFilled className="size-3 text-amber-500 fill-amber-500 shrink-0" />
										<span>{tr.rating}</span>
										<span className="text-muted-foreground tabular-nums">
											({tr.reviewsCount})
										</span>
									</span>
								</>
							)} */}
						</div>
					);
				},
			},
			{
				accessorKey: "price",
				header: "السعر",
				size: 125,
				minSize: 110,
				cell: ({ row }) => (
					<span className="text-xs font-semibold tabular-nums text-foreground">
						{(row.original.price ?? 0).toLocaleString()}
					</span>
				),
			},
			// {
			// 	accessorKey: "revenue",
			// 	header: " التسجيلات التقديرية",
			// 	size: 135,
			// 	minSize: 120,
			// 	cell: ({ row }) => (
			// 		<span className="text-xs font-bold tabular-nums text-foreground">
			// 			{row.original.revenue.toLocaleString()}
			// 		</span>
			// 	),
			// },
			{
				accessorKey: "status",
				header: "الحالة",
				size: 110,
				minSize: 100,
				cell: ({ row }) => (
					<TrackStatusSelect
						status={row.original.status}
						onChange={(newStatus) => handleStatusChange(row.original.id, newStatus)}
					/>
				),
			},
			{
				id: "actions",
				header: "الإجراءات",
				size: 140,
				minSize: 130,
				cell: ({ row }) => {
					const tr = row.original;
					return (
						<div
							className="flex items-center gap-1.5"
							onClick={(e) => e.stopPropagation()}
						>
							<Button
								variant="outline"
								size="xs"
								className="h-6 px-2 text-[11px] font-medium gap-1 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
								onClick={() => setAssigningStaffTrack(tr)}
							>
								<IconUserPlus className="size-3.5" />
								تعيين موظف
							</Button>

							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
									>
										<IconDots className="size-3.5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem
										className="gap-2 text-xs cursor-pointer"
										onSelect={() => setAssigningStaffTrack(tr)}
									>
										<IconUserPlus className="size-3.5" />
										تعيين موظف
									</DropdownMenuItem>
									<DropdownMenuItem
										className="gap-2 text-xs cursor-pointer"
										onSelect={() => setAssigningTrack(tr)}
									>
										<IconUsers className="size-3.5" />
										تسجيل طالب
									</DropdownMenuItem>
									<DropdownMenuItem
										className="gap-2 text-xs cursor-pointer"
										onSelect={() => toast.info(`فتح تفاصيل المسار: ${tr.name}`)}
									>
										<IconEye className="size-3.5" />
										فتح المسار
									</DropdownMenuItem>
									<DropdownMenuItem
										className="gap-2 text-xs cursor-pointer"
										onSelect={() => setEditingTrack(tr)}
									>
										<IconEdit className="size-3.5" />
										تعديل
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-destructive gap-2 text-xs cursor-pointer"
										onSelect={() => setDeletingTrack(tr)}
									>
										<IconTrash className="size-3.5" />
										حذف
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		],
		[handleStatusChange],
	);

	const table = useReactTable({
		data: filteredTracks,
		columns,
		initialState: { pagination: { pageSize: 100 } },
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: (row, _columnId, filterValue) => {
			const s = String(filterValue).toLowerCase().trim();
			if (!s) return true;
			const tr = row.original;
			return (
				(tr.name || "").toLowerCase().includes(s) ||
				(tr.code || "").toLowerCase().includes(s) ||
				(tr.category || "").toLowerCase().includes(s) ||
				(tr.academicStage || "").toLowerCase().includes(s) ||
				(tr.ageGroup || "").toLowerCase().includes(s) ||
				(tr.locationLabel || "").toLowerCase().includes(s)
			);
		},
	});

	// حذف مسار من قاعدة البيانات
	const confirmDeleteTrack = () => {
		if (deletingTrack) {
			deleteTrackMutation(deletingTrack.id, {
				onSuccess: () => {
					setLocalTracks((prev) => prev.filter((t) => t.id !== deletingTrack.id));
					refetchTracks();
					refetchStats();
					setDeletingTrack(null);
				},
			});
		}
	};

	return (
		<div
			className="flex min-h-0 flex-1 flex-col"
			dir="rtl"
		>
			{/* شريط الإحصائيات مطابق لبقية تبويبات التدريب */}
			<Stats
				className="grid-cols-5 gap-3 px-3"
				stats={statsData}
				variant="compact"
			/>

			{/* شريط الأدوات الموحد للمنصة */}
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن اسم المسار / المعرّف..."
				searchValue={search}
				onSearchChange={(value) => {
					setSearch(value);
					setPage(1);
				}}
				filterMenu={
					<FiltersMenu
						groups={filterGroups}
						size="sm"
						label="فلترة"
						onReset={clearAllFilters}
					/>
				}
				onExport={() => toast.success("تم تصدير قائمة المسارات التدريبية بنجاح")}
				actions={
					<Button
						size="sm"
						onClick={() => setIsAddOpen(true)}
						className="gap-1.5"
					>
						<IconPlus className="size-4" />
						إضافة مسار جديد
					</Button>
				}
			/>

			{/* جدول بيانات المسارات بالثيم الرسمي للمنصة */}
			<TableDataView
				table={table}
				columns={columns}
				isPending={isTracksLoading}
				tableClassName="w-full min-w-[1250px]"
				pagination={false}
				emptyState={{
					title: "لا توجد مسارات تدريبية مطابقة",
					description: "يمكنك إضافة مسار تدريبي جديد أو إعادة ضبط خيارات البحث والفلترة.",
					action: {
						label: "إضافة مسار جديد",
						onClick: () => setIsAddOpen(true),
					},
				}}
			/>
			<TablePagination
				page={page - 1}
				pageCount={totalTrackPages}
				pageSize={pageSize}
				totalRows={totalTracks}
				fromRow={totalTracks ? (page - 1) * pageSize + 1 : 0}
				toRow={Math.min(page * pageSize, totalTracks)}
				showPageSize={false}
				onPageChange={(index) => setPage(index + 1)}
			/>

			{/* نافذة إضافة وتعديل المسار التدريبي بتصميم وشاشات المنصة الموحدة */}
			<TrackDialog
				open={isAddOpen || Boolean(editingTrack)}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddOpen(false);
						setEditingTrack(null);
					}
				}}
				track={editingTrack}
				onSuccess={(savedTrack) => {
					setLocalTracks((prev) => {
						const index = prev.findIndex((t) => t.id === savedTrack.id);
						if (index >= 0) {
							const updated = [...prev];
							updated[index] = savedTrack;
							return updated;
						}
						return [savedTrack, ...prev];
					});
					refetchTracks();
					refetchStats();
					setIsAddOpen(false);
					setEditingTrack(null);
				}}
			/>

			{/* سايد شيت تعيين وتعديل الموظفين في المسار المطابق للفصول */}
			<AssignTrackStaffSheet
				open={Boolean(assigningStaffTrack)}
				onOpenChange={(open) => !open && setAssigningStaffTrack(null)}
				track={assigningStaffTrack}
				allTracks={localTracks}
				onSaveStaff={(staffIds, staffObjects) => {
					if (!assigningStaffTrack) return;
					const trackId = assigningStaffTrack.id;
					setLocalTracks((prev) =>
						prev.map((t) => (t.id === trackId ? { ...t, trainers: staffObjects } : t)),
					);
					assignStaffMutation(
						{ id: trackId, staffIds },
						{
							onSuccess: () => {
								refetchTracks();
								setAssigningStaffTrack(null);
							},
						},
					);
				}}
			/>

			{/* سايد شيت تسجيل الطلاب في المسار المطابقة للفصول */}
			<AssignTrackStudentsSheet
				open={Boolean(assigningTrack)}
				onOpenChange={(open) => !open && setAssigningTrack(null)}
				track={assigningTrack}
				onSaveStudents={(studentIds) => {
					if (!assigningTrack) return;
					const trackId = assigningTrack.id;
					setLocalTracks((prev) =>
						prev.map((t) =>
							t.id === trackId
								? {
										...t,
										studentsCount: studentIds.length,
										studentIds,
									}
								: t,
						),
					);
					setAssigningTrack(null);
					refetchTracks();
					refetchStats();
				}}
			/>

			{/* نافذة تأكيد حذف المسار */}
			<Dialog
				open={Boolean(deletingTrack)}
				onOpenChange={(open) => !open && setDeletingTrack(null)}
			>
				<DialogContent
					className="max-w-md"
					dir="rtl"
				>
					<DialogHeader>
						<DialogTitle>حذف المسار التدريبي</DialogTitle>
						<DialogDescription>
							هل أنت متأكد من حذف مسار &ldquo;{deletingTrack?.name}&rdquo;؟ لن يتمكن الطلاب
							والمدربون من الوصول إليه بعد الحذف.
						</DialogDescription>
					</DialogHeader>

					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={() => setDeletingTrack(null)}
							disabled={isDeleting}
						>
							إلغاء
						</Button>
						<Button
							variant="destructive"
							onClick={confirmDeleteTrack}
							disabled={isDeleting}
						>
							{isDeleting && <Spinner className="size-3.5" />}
							تأكيد الحذف
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
