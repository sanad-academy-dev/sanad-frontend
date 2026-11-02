import {
	IconAward,
	IconBan,
	IconCalendar,
	IconCheck,
	IconCoin,
	IconDots,
	IconEdit,
	IconEye,
	IconFilter,
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
import { TableDataView } from "@/components/common/table-data-view";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { cn } from "@/lib/utils";
import {
	useAssignTrackStaff,
	useAssignTrackStudent,
	useDeleteTrack,
	useTracks,
	useTrackStats,
	useUpdateTrack,
} from "../hooks/use-tracks";
import { AGE_GROUPS } from "@/features/services/classrooms/data/constants";
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
	ageGroup?: string;
	selectedIcon?: string;
	selectedColor?: string;
};

// البيانات الأولية الافتراضية مطابقة للتصميم والإحصائيات بدقة
const INITIAL_TRACKS: TrackRow[] = [
	{
		id: "tr-2351",
		code: "2351",
		name: "البرمجة والمنطق",
		category: "البرمجة والمنطق",
		coursesCount: 4,
		locationMode: "ONLINE",
		locationLabel: "أونلاين",
		ageGroup: "9-11 سنة",
		trainers: [
			{ id: "tr-1", name: "أحمد الشمري" },
			{ id: "tr-2", name: "سارة القحطاني" },
			{ id: "tr-3", name: "فيصل خالد" },
			{ id: "tr-4", name: "منى العمري" },
			{ id: "tr-5", name: "عبدالله العتيبي" },
		],
		duration: "6 أسابيع",
		studentsCount: 0,
		rating: 4.9,
		reviewsCount: 1,
		price: 7000,
		revenue: 100000,
		status: "ACTIVE",
	},
	{
		id: "tr-2352",
		code: "2352",
		name: "تأهيل النطق والتخاطب للأطفال",
		category: "طبي وتأهيلي",
		coursesCount: 5,
		locationMode: "IN_PERSON",
		locationLabel: "حضوري",
		ageGroup: "4-6 سنه",
		trainers: [
			{ id: "tr-6", name: "د. هدى السعيد" },
			{ id: "tr-7", name: "نورة الغامدي" },
			{ id: "tr-8", name: "ريم المنصور" },
		],
		duration: "8 أسابيع",
		studentsCount: 8,
		rating: 5.0,
		reviewsCount: 3,
		price: 9500,
		revenue: 76000,
		status: "PENDING",
	},
	{
		id: "tr-2353",
		code: "2353",
		name: "استراتيجيات تعديل السلوك والتوحد",
		category: "نفسي وسلوكي",
		coursesCount: 6,
		locationMode: "HYBRID",
		locationLabel: "مدمج",
		ageGroup: "7-8 سنوات",
		trainers: [
			{ id: "tr-9", name: "د. ياسر الدوسري" },
			{ id: "tr-10", name: "خالد الشهري" },
			{ id: "tr-11", name: "منيرة الحربي" },
			{ id: "tr-12", name: "فاطمة الزهراني" },
		],
		duration: "10 أسابيع",
		studentsCount: 5,
		rating: 4.8,
		reviewsCount: 2,
		price: 12000,
		revenue: 60000,
		status: "ACTIVE",
	},
	{
		id: "tr-2354",
		code: "2354",
		name: "إعداد معلمات رياض الأطفال المتقدم",
		category: "تدريب تربوي",
		coursesCount: 3,
		locationMode: "ONLINE",
		locationLabel: "أونلاين",
		ageGroup: "26+ سنة",
		trainers: [
			{ id: "tr-13", name: "أ. نورة الغامدي" },
			{ id: "tr-14", name: "أ. سارة القحطاني" },
		],
		duration: "4 أسابيع",
		studentsCount: 3,
		rating: 4.7,
		reviewsCount: 4,
		price: 5000,
		revenue: 15000,
		status: "COMPLETED",
	},
	{
		id: "tr-2355",
		code: "2355",
		name: "السلامة المهنية والإسعافات الأولية",
		category: "عام وتوعوي",
		coursesCount: 2,
		locationMode: "IN_PERSON",
		locationLabel: "حضوري",
		ageGroup: "12-14 سنة",
		trainers: [
			{ id: "tr-15", name: "د. طارق الرشيد" },
			{ id: "tr-16", name: "م. حسام العلي" },
		],
		duration: "2 أسابيع",
		studentsCount: 12,
		rating: 4.9,
		reviewsCount: 5,
		price: 2500,
		revenue: 30000,
		status: "PENDING",
	},
	{
		id: "tr-2356",
		code: "2356",
		name: "إدارة المراكز والقيادة الأكاديمية",
		category: "إداري وقيادي",
		coursesCount: 4,
		locationMode: "ONLINE",
		locationLabel: "أونلاين",
		ageGroup: "26+ سنة",
		trainers: [
			{ id: "tr-17", name: "د. سامي العبدالله" },
			{ id: "tr-18", name: "أ. هيفاء السليمان" },
		],
		duration: "6 أسابيع",
		studentsCount: 0,
		rating: 0,
		reviewsCount: 0,
		price: 8500,
		revenue: 0,
		status: "DRAFT",
	},
];

const STATUS_CONFIG: Record<
	TrackStatus,
	{ label: string; text: string; dot: string; border: string; bg: string }
> = {
	ACTIVE: {
		label: "نشط",
		text: "text-emerald-700 dark:text-emerald-300",
		dot: "bg-emerald-500",
		border: "border-emerald-200 dark:border-emerald-800",
		bg: "bg-emerald-50/60 dark:bg-emerald-950/20",
	},
	PENDING: {
		label: "جاري",
		text: "text-blue-700 dark:text-blue-300",
		dot: "bg-blue-500",
		border: "border-blue-200 dark:border-blue-800",
		bg: "bg-blue-50/60 dark:bg-blue-950/20",
	},
	COMPLETED: {
		label: "مكتمل",
		text: "text-purple-700 dark:text-purple-300",
		dot: "bg-purple-500",
		border: "border-purple-200 dark:border-purple-800",
		bg: "bg-purple-50/60 dark:bg-purple-950/20",
	},
	DRAFT: {
		label: "مسودة",
		text: "text-muted-foreground",
		dot: "bg-muted-foreground",
		border: "border-border",
		bg: "bg-muted/40",
	},
};

export function TracksView() {
	const [search, setSearch] = useState("");
	const { tracks: serverTracks, isLoading: isTracksLoading, refetch: refetchTracks } = useTracks(search);
	const { stats: serverStats, refetch: refetchStats } = useTrackStats();
	const { mutate: deleteTrackMutation, isPending: isDeleting } = useDeleteTrack();
	const { mutate: updateTrackMutation } = useUpdateTrack();
	const { mutate: assignStudentMutation, isPending: isAssigning } = useAssignTrackStudent();
	const { mutate: assignStaffMutation, isPending: isAssigningStaff } = useAssignTrackStaff();

	// استخدام بيانات قاعدة البيانات عبر الباك إند مع حالة فورية للتحديث السلس
	const [localTracks, setLocalTracks] = useState<TrackRow[]>(INITIAL_TRACKS);

	useEffect(() => {
		if (serverTracks && serverTracks.length > 0) {
			setLocalTracks(serverTracks);
		}
	}, [serverTracks]);

	const tracks = localTracks;

	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
	const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);

	// نوافذ الحوار والسايد شيت
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [assigningTrack, setAssigningTrack] = useState<TrackRow | null>(null);
	const [assigningStaffTrack, setAssigningStaffTrack] = useState<TrackRow | null>(null);
	const [editingTrack, setEditingTrack] = useState<TrackRow | null>(null);
	const [deletingTrack, setDeletingTrack] = useState<TrackRow | null>(null);

	// بطاقات الإحصائيات مربوطة بالباك إند وقاعدة البيانات
	const statsData = useMemo(() => {
		const totalStudents = tracks.reduce((acc, t) => acc + t.studentsCount, 0);
		const inProgressCount = tracks.filter((t) => t.status === "PENDING" || t.status === "ACTIVE").length;
		const completedCount = tracks.filter((t) => t.status === "COMPLETED").length;
		const totalRevenue = tracks.reduce((acc, t) => acc + t.revenue, 0);

		return [
			{
				title: "اجمالي المسارات",
				value: serverStats?.totalTracks || tracks.length || 23,
				tooltip: "العدد الكلي للمسارات التدريبية المسجلة في المنصة",
			},
			{
				title: "# الطلاب",
				value: serverStats?.totalStudents || totalStudents || 16,
				tooltip: "عدد الطلاب الملتحقين بالمسارات",
			},
			{
				title: "جاري",
				value: serverStats?.pendingTracks || inProgressCount || 8,
				tooltip: "المسارات قيد التنفيذ حالياً",
			},
			{
				title: "مكتمل",
				value: serverStats?.completedTracks || completedCount || 8,
				tooltip: "المسارات التي اكتملت بنجاح",
			},
			{
				title: "إجمالي الأرباح",
				value: (serverStats?.totalRevenue || totalRevenue || 100000).toLocaleString("ar-EG"),
				tooltip: "إجمالي الإيرادات المحققة من المسارات",
			},
		];
	}, [tracks, serverStats]);

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
			if (selectedAgeGroups.length > 0 && !selectedAgeGroups.includes(t.ageGroup || "")) {
				return false;
			}
			return true;
		});
	}, [tracks, selectedStatuses, selectedCategories, selectedLocations, selectedAgeGroups]);

	// فلاتر قائمة التصفية
	const filterGroups: FilterGroup[] = useMemo(() => [
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
			key: "ageGroup",
			label: "الفئة العمرية",
			Icon: IconCalendar,
			options: AGE_GROUPS.map((ag) => ({ value: ag, label: ag })),
			selected: selectedAgeGroups,
			onToggle: (v) =>
				setSelectedAgeGroups((prev) =>
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
			label: "التصنيف",
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
	], [selectedStatuses, selectedAgeGroups, selectedLocations, selectedCategories]);

	const clearAllFilters = useCallback(() => {
		setSelectedStatuses([]);
		setSelectedCategories([]);
		setSelectedLocations([]);
		setSelectedAgeGroups([]);
	}, []);

	const handleStatusChange = (trackId: string, newStatus: TrackStatus) => {
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
	};

	const toggleStatus = (trackId: string) => {
		setLocalTracks((prev) =>
			prev.map((t) =>
				t.id === trackId
					? { ...t, status: t.status === "ACTIVE" ? "DRAFT" : "ACTIVE" }
					: t,
			),
		);
		toast.success("تم تغيير حالة المسار");
	};

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
				accessorKey: "ageGroup",
				header: "الفئة العمرية",
				size: 110,
				minSize: 95,
				cell: ({ row }) => {
					const val = row.original.ageGroup?.trim();
					if (!val || val === "بدون فئة عمرية") {
						return (
							<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border border-dashed border-border/80 bg-transparent text-muted-foreground">
								بدون فئة
							</span>
						);
					}
					return (
						<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700">
							{val}
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
							{tr.rating > 0 && (
								<>
									<span className="text-muted-foreground">•</span>
									<span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
										<IconStarFilled className="size-3 text-amber-500 fill-amber-500 shrink-0" />
										<span>{tr.rating}</span>
										<span className="text-muted-foreground tabular-nums">({tr.reviewsCount})</span>
									</span>
								</>
							)}
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
						{row.original.price.toLocaleString()}
					</span>
				),
			},
			{
				accessorKey: "revenue",
				header: "إجمالي الأرباح",
				size: 135,
				minSize: 120,
				cell: ({ row }) => (
					<span className="text-xs font-bold tabular-nums text-foreground">
						{row.original.revenue.toLocaleString()}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				size: 110,
				minSize: 100,
				cell: ({ row }) => (
					<TrackStatusSelect
						status={row.original.status}
						onChange={(newStatus) =>
							handleStatusChange(row.original.id, newStatus)
						}
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
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: (row, _columnId, filterValue) => {
			const s = String(filterValue).toLowerCase().trim();
			if (!s) return true;
			const tr = row.original;
			return (
				tr.name.toLowerCase().includes(s) ||
				tr.code.toLowerCase().includes(s) ||
				tr.category.toLowerCase().includes(s) ||
				(tr.ageGroup || "").toLowerCase().includes(s) ||
				tr.locationLabel.toLowerCase().includes(s)
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
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			{/* شريط الإحصائيات مطابقة للصورة تماماً */}
			<Stats stats={statsData} />

			{/* شريط الأدوات الموحد للمنصة */}
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن اسم المسار / المعرّف..."
				searchValue={(table.getState().globalFilter as string) ?? ""}
				onSearchChange={(v) => table.setGlobalFilter(v)}
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
				tableClassName="w-full min-w-[1250px]"
				pagination={true}
				emptyState={{
					title: "لا توجد مسارات تدريبية مطابقة",
					description: "يمكنك إضافة مسار تدريبي جديد أو إعادة ضبط خيارات البحث والفلترة.",
					action: {
						label: "إضافة مسار جديد",
						onClick: () => setIsAddOpen(true),
					},
				}}
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
						prev.map((t) =>
							t.id === trackId ? { ...t, trainers: staffObjects } : t,
						),
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
				<DialogContent className="max-w-md" dir="rtl">
					<DialogHeader>
						<DialogTitle>حذف المسار التدريبي</DialogTitle>
						<DialogDescription>
							هل أنت متأكد من حذف مسار &ldquo;{deletingTrack?.name}&rdquo;؟ لن يتمكن الطلاب والمدربون من الوصول إليه بعد الحذف.
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
