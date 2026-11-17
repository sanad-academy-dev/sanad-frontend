import {
	IconAward,
	IconCheck,
	IconDots,
	IconEdit,
	IconEye,
	IconMapPin,
	IconPlus,
	IconRoute,
	IconSchool,
	IconTrash,
	IconUserPlus,
	IconUsers,
	IconX,
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
import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { Spinner } from "@/components/common/spinner";
import { Stats } from "@/components/common/stats";
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
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
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
import { ContentLoadError } from "./content-load-error";
import { StudentsCell } from "./students-cell";
import { TrackCard } from "./track-card";
import { TrackDialog } from "./track-dialog";
import { TrackStatusSelect } from "./track-status-select";
import { TrainersCell } from "./trainers-cell";
import { type CoursesView, ViewOptionsMenu } from "./view-options-menu";

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
	trainers: {
		id: string;
		name: string;
		avatar?: string;
		phone?: string;
		email?: string;
		role?: string;
		branch?: string;
		employmentType?: string;
		active?: boolean;
	}[];
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
	const [view, setView] = useState<CoursesView>("list");
	const [oldestFirst, setOldestFirst] = useState(false);
	const [page, setPage] = useState(1);
	const pageSize = 100;
	const {
		tracks: serverTracks,
		total: totalTracks,
		totalPages: totalTrackPages,
		isLoading: isTracksLoading,
		isError: tracksLoadError,
		error: tracksError,
		refetch: refetchTracks,
	} = useTracks(search, page, pageSize, "preview");
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

	// تصفية وترتيب المسارات
	const filteredTracks = useMemo(() => {
		const list = tracks.filter((t) => {
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
			if (search.trim()) {
				const s = search.toLowerCase().trim();
				const matchesName = t.name.toLowerCase().includes(s);
				const matchesCode = t.code.toLowerCase().includes(s);
				const matchesCategory = t.category.toLowerCase().includes(s);
				const matchesStage = t.academicStage?.toLowerCase().includes(s) ?? false;
				const matchesLoc = t.locationLabel?.toLowerCase().includes(s) ?? false;
				if (!matchesName && !matchesCode && !matchesCategory && !matchesStage && !matchesLoc) {
					return false;
				}
			}
			return true;
		});

		return oldestFirst ? [...list].reverse() : list;
	}, [
		tracks,
		selectedStatuses,
		selectedCategories,
		selectedLocations,
		selectedAcademicStages,
		search,
		oldestFirst,
	]);

	// الشرائح النشطة للفلاتر المختارة
	const activeFilters = useMemo(() => {
		const list: { key: string; label: string; value: string; onRemove: () => void }[] = [];
		for (const s of selectedStatuses) {
			list.push({
				key: `status-${s}`,
				label: "الحالة",
				value:
					s === "ACTIVE"
						? "نشط"
						: s === "PENDING"
							? "جاري"
							: s === "COMPLETED"
								? "مكتمل"
								: "مسودة",
				onRemove: () => setSelectedStatuses((prev) => prev.filter((x) => x !== s)),
			});
		}
		for (const st of selectedAcademicStages) {
			list.push({
				key: `stage-${st}`,
				label: "المرحلة",
				value: st,
				onRemove: () => setSelectedAcademicStages((prev) => prev.filter((x) => x !== st)),
			});
		}
		for (const c of selectedCategories) {
			list.push({
				key: `cat-${c}`,
				label: "المسار",
				value: c,
				onRemove: () => setSelectedCategories((prev) => prev.filter((x) => x !== c)),
			});
		}
		for (const loc of selectedLocations) {
			list.push({
				key: `loc-${loc}`,
				label: "المكان",
				value: loc === "ONLINE" ? "أونلاين" : loc === "IN_PERSON" ? "حضوري" : "مدمج",
				onRemove: () => setSelectedLocations((prev) => prev.filter((x) => x !== loc)),
			});
		}
		return list;
	}, [selectedStatuses, selectedAcademicStages, selectedCategories, selectedLocations]);

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
		[
			selectedStatuses,
			selectedAcademicStages,
			academicStages,
			selectedLocations,
			selectedCategories,
		],
	);

	const clearAllFilters = useCallback(() => {
		setSelectedStatuses([]);
		setSelectedCategories([]);
		setSelectedLocations([]);
		setSelectedAcademicStages([]);
	}, []);

	const handleStatusChange = useCallback(
		(trackId: string, newStatus: TrackStatus) => {
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
		},
		[refetchStats, refetchTracks, updateTrackMutation],
	);

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
					// biome-ignore lint/a11y/noStaticElementInteractions: stop propagation
					// biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation
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
						// biome-ignore lint/a11y/noStaticElementInteractions: open track edit
						// biome-ignore lint/a11y/useKeyWithClickEvents: open track edit
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
					return (
						<TrainersCell
							trainers={row.original.trainers}
							maxVisible={3}
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
				header: "الطلاب",
				size: 130,
				minSize: 110,
				cell: ({ row }) => {
					const tr = row.original;
					return (
						<StudentsCell
							students={tr.students}
							studentIds={tr.studentIds}
							totalCount={tr.studentsCount}
							maxVisible={3}
							onClick={(e) => {
								e.stopPropagation();
								setAssigningTrack(tr);
							}}
						/>
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
						// biome-ignore lint/a11y/noStaticElementInteractions: actions container
						// biome-ignore lint/a11y/useKeyWithClickEvents: actions container
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
										onSelect={() => setEditingTrack(tr)}
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
				showExport={false}
				showView={false}
				leftExtra={
					<ViewOptionsMenu
						view={view}
						onViewChange={setView}
						oldestFirst={oldestFirst}
						onOldestFirstChange={setOldestFirst}
					/>
				}
				actions={
					<Button
						size="sm"
						onClick={() => setIsAddOpen(true)}
						className="gap-1.5 font-bold cursor-pointer"
					>
						<IconPlus className="size-4" />
						إضافة مسار جديد
					</Button>
				}
			/>

			{/* شرائح الفلاتر النشطة */}
			{activeFilters.length > 0 && (
				<div className="flex flex-wrap items-center gap-2 border-b-[0.5px] border-border px-3 py-2 bg-muted/10">
					{activeFilters.map((f) => (
						<span
							key={f.key}
							className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary shadow-2xs"
						>
							<span className="text-muted-foreground">{f.label}:</span>
							<span>{f.value}</span>
							<button
								type="button"
								onClick={f.onRemove}
								className="hover:text-primary/70 cursor-pointer p-0.5 rounded-full hover:bg-primary/10 transition-colors"
								title="إزالة الفلتر"
							>
								<IconX className="size-3" />
							</button>
						</span>
					))}
					<button
						type="button"
						onClick={clearAllFilters}
						className="text-[11px] font-medium text-destructive hover:underline cursor-pointer px-1.5"
					>
						إعادة تعيين
					</button>
				</div>
			)}

			{/* محتوى المسارات: جدول أو بطاقات بالثيم الموحد */}
			<div className="min-h-0 flex-1 overflow-auto bg-background">
				{isTracksLoading && tracks.length === 0 ? (
					<Spinner containerClassName="py-24 min-h-0" />
				) : tracksLoadError ? (
					<ContentLoadError
						message={
							tracksError instanceof Error
								? tracksError.message
								: "تعذّر تحميل المسارات التدريبية."
						}
						onRetry={() => void refetchTracks()}
					/>
				) : filteredTracks.length === 0 ? (
					<div className="flex flex-col items-center gap-3 px-3 py-16 text-center">
						<span className="flex size-12 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground">
							<IconRoute className="size-6" />
						</span>
						<h2 className="text-[14px] font-bold text-foreground">
							{tracks.length === 0
								? "لا توجد مسارات تدريبية بعد"
								: "لا توجد مسارات مطابقة للبحث أو الفلترة"}
						</h2>
						<p className="max-w-[320px] text-[12px] text-muted-foreground leading-relaxed">
							{tracks.length === 0
								? "أنشئ مسارات تدريبية متكاملة لربط الدورات والمستندات والتقييمات ضمن خطة تعليمية واحدة."
								: "جرب تغيير معايير البحث أو إعادة ضبط خيارات الفلترة لعرض النتائج."}
						</p>
						{tracks.length === 0 ? (
							<Button
								type="button"
								onClick={() => setIsAddOpen(true)}
								className="h-9 gap-1.5 rounded-lg px-4 text-[12px] font-bold mt-1 cursor-pointer"
							>
								<IconPlus className="size-4" />
								إضافة مسار جديد
							</Button>
						) : (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={clearAllFilters}
								className="gap-1.5 text-xs font-semibold mt-1 cursor-pointer"
							>
								إعادة ضبط الفلاتر
							</Button>
						)}
					</div>
				) : view === "grid" ? (
					<div className="p-3">
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{filteredTracks.map((tr) => (
								<TrackCard
									key={tr.id}
									track={tr}
									onEdit={() => setEditingTrack(tr)}
									onDelete={() => setDeletingTrack(tr)}
									onAssignStaff={() => setAssigningStaffTrack(tr)}
									onAssignStudent={() => setAssigningTrack(tr)}
								/>
							))}
						</div>
					</div>
				) : (
					<TableDataView
						table={table}
						columns={columns}
						isPending={isTracksLoading}
						tableClassName="w-full min-w-[1250px]"
						pagination={false}
					/>
				)}
			</div>
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
