import { StaffStatus } from "@sanad/contracts/runtime/server/staff/staff.type";
import {
	IconArrowsExchange,
	IconBriefcase,
	IconCalendarEvent,
	IconClock,
	IconDots,
	IconMail,
	IconPhone,
	IconPlus,
	IconTrash,
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
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { AssignStaffDialog } from "@/features/services/classrooms/components/assign-staff-dialog";
import { ClassroomStatusSelect } from "@/features/services/classrooms/components/classroom-status-select";
import { useUpdateClassroom } from "@/features/services/classrooms/hooks/use-classroom-mutations";
import { useClassrooms } from "@/features/services/classrooms/hooks/use-classrooms";
import { useAttendance } from "@/features/services/staff/hooks/use-attendance";
import { useShifts } from "@/features/services/staff/hooks/use-shifts";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { backendFetch } from "@/lib/backend-fetch";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/utils";
import type { ClassroomResponse, ClassroomTeacher } from "@/server/classrooms/classrooms.type";

// ألوان أفاتار الموظفين
const AVATAR_PALETTE = [
	"bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
	"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
	"bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
	"bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
	"bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
];

function getInitials(name?: string | null): string {
	if (!name) return "م";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length >= 2) {
		return `${parts[0].charAt(0)}.${parts[1].charAt(0)}`;
	}
	return parts[0]?.slice(0, 2) || "م";
}

interface ClassroomStaffTabProps {
	classroom: ClassroomResponse;
	onRefetch: () => void;
}

export function ClassroomStaffTab({ classroom, onRefetch }: ClassroomStaffTabProps) {
	const [assignStaffOpen, setAssignStaffOpen] = useState(false);
	const [transferStaff, setTransferStaff] = useState<ClassroomTeacher | null>(null);
	const [targetClassroomId, setTargetClassroomId] = useState<string>("");
	const [isTransferring, setIsTransferring] = useState(false);
	const [deleteStaffConfirm, setDeleteStaffConfirm] = useState<ClassroomTeacher | null>(null);
	const [isRemovingStaff, setIsRemovingStaff] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const { classrooms } = useClassrooms();
	const { staff } = useStaff();
	const { mutate: updateClassroom, isPending: isUpdatingClassroom } = useUpdateClassroom();

	const handleStatusChange = useCallback(
		(newActive: boolean) => {
			updateClassroom(
				{
					id: classroom.id,
					data: { active: newActive },
				},
				{
					onSuccess: () => {
						onRefetch();
						toast.success(`تم تغيير حالة الفصل إلى "${newActive ? "نشط" : "غير نشط"}" بنجاح`);
					},
				},
			);
		},
		[classroom.id, updateClassroom, onRefetch],
	);

	const availableTransferClassrooms = useMemo(
		() => classrooms.filter((c) => c.id !== classroom.id && c.active),
		[classrooms, classroom.id],
	);

	const teachers = useMemo(() => classroom.teachers || [], [classroom.teachers]);

	// جلب سجلات الحضور والانصراف والمناوبات لليوم الحالي تحديداً
	const todayDate = useMemo(() => new Date(), []);
	const todayKey = useMemo(() => format(todayDate, "yyyy-MM-dd"), [todayDate]);
	const { records: todayAttendance } = useAttendance(todayDate, todayDate);
	const { shifts: todayShifts } = useShifts(todayDate, todayDate);

	// دالة مساعدة للتحقق من تاريخ السجل ومطابقته لليوم الحالي بأمان وبدون أخطاء
	const isSameDay = useCallback((dateVal: unknown, targetKey: string) => {
		if (!dateVal) return false;
		if (typeof dateVal === "string" && dateVal.slice(0, 10) === targetKey) return true;
		try {
			const d = new Date(dateVal as string | number | Date);
			return !Number.isNaN(d.getTime()) && format(d, "yyyy-MM-dd") === targetKey;
		} catch {
			return false;
		}
	}, []);

	type StaffRecordWithId = {
		staffId?: string | null;
		userId?: string | null;
		id?: string | null;
		date?: unknown;
	};

	const getRecordStaffId = useCallback((item: StaffRecordWithId) => {
		return item.staffId || item.userId || item.id;
	}, []);

	// خريطة حالة حضور الموظفين لليوم الحالي تحديداً
	const staffAttendanceMap = useMemo(() => {
		const map = new Map<
			string,
			{
				status: string;
				label: string;
				colorClasses: string;
				dotColor: string;
			}
		>();

		for (const teacher of teachers) {
			// 1. هل يوجد سجل حضور/انصراف لليوم الحالي تحديداً؟
			const todayRec = (todayAttendance || []).find((r) => {
				const recStaffId = getRecordStaffId(r as StaffRecordWithId);
				return recStaffId === teacher.id && isSameDay(r.date, todayKey);
			});

			// 2. هل لديه مناوبة عمل / دوام مجدول اليوم؟
			const shiftToday = (todayShifts || []).find((s) => {
				const shiftStaffId = getRecordStaffId(s as StaffRecordWithId);
				return shiftStaffId === teacher.id && isSameDay(s.date, todayKey);
			});

			if (todayRec) {
				const st = todayRec.status?.toUpperCase();
				if (st === "PRESENT") {
					map.set(teacher.id, {
						status: "PRESENT",
						label: "حاضر",
						colorClasses:
							"bg-emerald-50 text-emerald-700 border-emerald-200/90 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800",
						dotColor: "bg-emerald-500",
					});
				} else if (st === "ABSENT") {
					map.set(teacher.id, {
						status: "ABSENT",
						label: "غائب",
						colorClasses:
							"bg-rose-50 text-rose-700 border-rose-200/90 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800",
						dotColor: "bg-rose-500",
					});
				} else if (st === "LEAVE") {
					map.set(teacher.id, {
						status: "LEAVE",
						label: "إجازة",
						colorClasses:
							"bg-purple-50 text-purple-700 border-purple-200/90 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
						dotColor: "bg-purple-500",
					});
				} else if (st === "LATE") {
					map.set(teacher.id, {
						status: "LATE",
						label: "متأخر",
						colorClasses:
							"bg-amber-50 text-amber-700 border-amber-200/90 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
						dotColor: "bg-amber-500",
					});
				} else {
					map.set(teacher.id, {
						status: st || "UNKNOWN",
						label: st === "MISSION" ? "مأمورية" : st === "OVERTIME" ? "إضافي" : "لم يسجل",
						colorClasses:
							"bg-blue-50 text-blue-700 border-blue-200/90 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
						dotColor: "bg-blue-500",
					});
				}
			} else if (shiftToday) {
				// لديه مناوبة عمل مجدولة اليوم ولكنه لم يبصم بعد
				map.set(teacher.id, {
					status: "PENDING_CHECKIN",
					label: "لم يسجل بعد",
					colorClasses:
						"bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700",
					dotColor: "bg-slate-400",
				});
			} else {
				// ليس لديه عمل اليوم أصلاً (يوم عطلة / لا توجد مناوبة عمل لليوم)
				map.set(teacher.id, {
					status: "NO_SHIFT",
					label: "عطلة",
					colorClasses:
						"bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800",
					dotColor: "bg-sky-500",
				});
			}
		}

		return map;
	}, [teachers, todayKey, todayAttendance, todayShifts, isSameDay, getRecordStaffId]);

	// خريطة لتحديد مناوبة العمل لكل معلم لليوم الحالي (صباحي / مسائي / ليلي / عطلة)
	const staffShiftsMap = useMemo(() => {
		const map = new Map<
			string,
			{
				type: string;
				label: string;
				colorClasses: string;
				dotColor: string;
			}
		>();

		for (const teacher of teachers) {
			const shiftToday = (todayShifts || []).find((s) => {
				const shiftStaffId = getRecordStaffId(s as StaffRecordWithId);
				return shiftStaffId === teacher.id && isSameDay(s.date, todayKey);
			});

			if (shiftToday) {
				const shiftType = (shiftToday.type || "").toUpperCase();
				if (shiftType === "MORNING") {
					map.set(teacher.id, {
						type: "MORNING",
						label: "صباحي",
						colorClasses:
							"bg-amber-50 text-amber-700 border-amber-200/90 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
						dotColor: "bg-amber-500",
					});
				} else if (shiftType === "EVENING") {
					map.set(teacher.id, {
						type: "EVENING",
						label: "مسائي",
						colorClasses:
							"bg-indigo-50 text-indigo-700 border-indigo-200/90 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800",
						dotColor: "bg-indigo-500",
					});
				} else if (shiftType === "NIGHT") {
					map.set(teacher.id, {
						type: "NIGHT",
						label: "ليلي",
						colorClasses:
							"bg-purple-50 text-purple-700 border-purple-200/90 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
						dotColor: "bg-purple-500",
					});
				} else {
					map.set(teacher.id, {
						type: shiftType,
						label: shiftType,
						colorClasses:
							"bg-blue-50 text-blue-700 border-blue-200/90 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
						dotColor: "bg-blue-500",
					});
				}
			} else {
				// لا توجد مناوبة مسجلة اليوم -> عطلة
				map.set(teacher.id, {
					type: "OFF",
					label: "عطلة",
					colorClasses:
						"bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700",
					dotColor: "bg-slate-400",
				});
			}
		}

		return map;
	}, [teachers, todayKey, todayShifts, isSameDay, getRecordStaffId]);

	// فلاتر جدول الموظفين (الدور / القسم + المناوبة + حالة الحضور)
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
	const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
	const [selectedAttendance, setSelectedAttendance] = useState<string[]>([]);

	const toggleRole = useCallback((role: string) => {
		setSelectedRoles((prev) =>
			prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
		);
	}, []);

	const toggleShift = useCallback((shift: string) => {
		setSelectedShifts((prev) =>
			prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift],
		);
	}, []);

	const toggleAttendance = useCallback((status: string) => {
		setSelectedAttendance((prev) =>
			prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
		);
	}, []);

	const clearStaffFilters = useCallback(() => {
		setSelectedRoles([]);
		setSelectedShifts([]);
		setSelectedAttendance([]);
	}, []);

	const staffFilterGroups: FilterGroup[] = useMemo(() => {
		const uniqueRoles = Array.from(new Set(teachers.map((t) => t.role).filter(Boolean))).map(
			(r) => ({ value: r as string, label: r as string }),
		);

		return [
			{
				key: "role",
				label: "القسم / الدور",
				Icon: IconBriefcase,
				options: uniqueRoles,
				selected: selectedRoles,
				onToggle: toggleRole,
				emptyLabel: "لا توجد أدوار",
			},
			{
				key: "shift",
				label: "المناوبة",
				Icon: IconClock,
				options: [
					{ value: "MORNING", label: "صباحي" },
					{ value: "EVENING", label: "مسائي" },
					{ value: "OFF", label: "عطلة" },
				],
				selected: selectedShifts,
				onToggle: toggleShift,
			},
			{
				key: "attendance",
				label: "حالة الحضور",
				Icon: IconCalendarEvent,
				options: [
					{ value: "PRESENT", label: "حاضر" },
					{ value: "ABSENT", label: "غائب" },
					{ value: "LEAVE", label: "إجازة" },
					{ value: "LATE", label: "متأخر" },
					{ value: "PENDING_CHECKIN", label: "لم يسجل بعد" },
					{ value: "NO_SHIFT", label: "عطلة / لا توجد مناوبة" },
				],
				selected: selectedAttendance,
				onToggle: toggleAttendance,
			},
		];
	}, [
		teachers,
		selectedRoles,
		selectedShifts,
		selectedAttendance,
		toggleRole,
		toggleShift,
		toggleAttendance,
	]);

	// تصفية المعلمين حسب البحث والفلاتر
	const filteredTeachers = useMemo(() => {
		let result = teachers;

		if (selectedRoles.length > 0) {
			result = result.filter((t) => t.role && selectedRoles.includes(t.role));
		}

		if (selectedShifts.length > 0) {
			result = result.filter((t) => {
				const shiftType = staffShiftsMap.get(t.id)?.type || "OFF";
				return selectedShifts.includes(shiftType);
			});
		}

		if (selectedAttendance.length > 0) {
			result = result.filter((t) => {
				const status = staffAttendanceMap.get(t.id)?.status || "NOT_RECORDED";
				return selectedAttendance.includes(status);
			});
		}

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(t) =>
					t.name.toLowerCase().includes(q) ||
					t.email?.toLowerCase().includes(q) ||
					t.phone?.includes(q) ||
					t.role?.toLowerCase().includes(q),
			);
		}

		return result;
	}, [
		teachers,
		selectedRoles,
		selectedShifts,
		selectedAttendance,
		staffShiftsMap,
		staffAttendanceMap,
		searchQuery,
	]);

	// بطاقات الإحصائيات الأربع العلوية مطابقة تماماً للموجودة في صفحة الموظفين الأصلية (services/staff)
	const statsItems = useMemo<StatItem[]>(() => {
		const total = staff.length;
		const active = staff.filter((s) => s.status === StaffStatus.ACTIVE).length;
		const pending = staff.filter((s) => s.status === StaffStatus.PENDING).length;
		const inactive = staff.filter((s) => s.status === StaffStatus.INACTIVE).length;
		return [
			{ title: "إجمالي الموظفين", value: total, tooltip: "العدد الكلي للموظفين المسجلين" },
			{ title: "نشط", value: active, tooltip: "الموظفون الذين قبلوا الدعوة وهم نشطون" },
			{ title: "في الانتظار", value: pending, tooltip: "الموظفون الذين لم يقبلوا الدعوة بعد" },
			{ title: "غير نشط", value: inactive, tooltip: "الموظفون المعطّلون" },
		];
	}, [staff]);

	// تأكيد إزالة موظف من الفصل
	const handleExecuteRemoveStaff = async () => {
		if (!deleteStaffConfirm) return;
		setIsRemovingStaff(true);
		try {
			const remainingIds = teachers
				.filter((t) => t.id !== deleteStaffConfirm.id)
				.map((t) => t.id);

			const res = await backendFetch(`/api/classrooms/${classroom.id}/staff`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ staffIds: remainingIds }),
			});

			if (!res.ok) throw new Error("فشل إزالة الموظف");
			toast.success(`تمت إزالة ${deleteStaffConfirm.name} من الفصل بنجاح`);
			setDeleteStaffConfirm(null);
			onRefetch();
		} catch {
			toast.error("حدث خطأ أثناء إزالة الموظف من الفصل");
		} finally {
			setIsRemovingStaff(false);
		}
	};

	// نقل موظف لفصل آخر
	const handleExecuteTransfer = async () => {
		if (!transferStaff || !targetClassroomId) return;
		setIsTransferring(true);
		try {
			// 1. إضافة الموظف للفصل المستهدف
			const targetClassroom = classrooms.find((c) => c.id === targetClassroomId);
			const targetStaffIds = Array.from(
				new Set([...(targetClassroom?.teachers?.map((t) => t.id) || []), transferStaff.id]),
			);

			await backendFetch(`/api/classrooms/${targetClassroomId}/staff`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ staffIds: targetStaffIds }),
			});

			// 2. إزالة الموظف من الفصل الحالي
			const remainingStaffIds = teachers
				.filter((t) => t.id !== transferStaff.id)
				.map((t) => t.id);

			await backendFetch(`/api/classrooms/${classroom.id}/staff`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ staffIds: remainingStaffIds }),
			});

			toast.success(`تم نقل ${transferStaff.name} إلى الفصل الجديد بنجاح`);
			setTransferStaff(null);
			setTargetClassroomId("");
			onRefetch();
		} catch {
			toast.error("حدث خطأ أثناء نقل الموظف");
		} finally {
			setIsTransferring(false);
		}
	};

	// تصدير CSV
	const handleExport = () => {
		const headers = [
			"اسم الموظف",
			"الهاتف",
			"البريد الإلكتروني",
			"القسم / الدور",
			"المناوبة",
			"حالة الحضور",
			"حالة الفصل",
		];
		const rows = teachers.map((t) => [
			t.name,
			t.phone ?? "",
			t.email ?? "",
			t.role ?? "معلم برمجة",
			staffShiftsMap.get(t.id)?.label || "عطلة",
			staffAttendanceMap.get(t.id)?.label || "لم يسجل",
			classroom.active ? "نشط" : "غير نشط",
		]);
		downloadCsv(`classroom_${classroom.name}_staff`, headers, rows);
	};

	// أعمدة جدول الموظفين مطابقة تماماً للمطلوب والصورة المرفقة
	// ملاحظة المستخدم: "ولكن هنشيل بس منه عمودين الي هوا النسبه الطلاب و الجاهزيه"
	const columns = useMemo<ColumnDef<ClassroomTeacher>[]>(
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
					// biome-ignore lint/a11y/noStaticElementInteractions: إيقاف انتشار الحدث لعدم فتح أية نافذة
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار الحدث
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
				header: "اسم الموظف / المعرف",
				size: 190,
				minSize: 170,
				cell: ({ row, table }) => {
					const idx = table.getRowModel().rows.findIndex((r) => r.id === row.id);
					const colorClass = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
					return (
						<div className="flex items-center gap-2.5 min-w-0">
							<div
								className={cn(
									"size-7.5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 shadow-2xs",
									colorClass,
								)}
							>
								{row.original.image ? (
									<img
										src={row.original.image}
										alt={row.original.name}
										className="size-full object-cover rounded-full"
									/>
								) : (
									<span>{getInitials(row.original.name)}</span>
								)}
							</div>
							<div className="flex flex-col min-w-0">
								<span className="font-bold text-xs text-foreground truncate cursor-pointer hover:underline">
									{row.original.name}
								</span>
								<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
									D-{row.original.id.slice(0, 4)}
								</span>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "phone",
				header: "الهاتف / البريد الإلكتروني",
				size: 190,
				minSize: 160,
				cell: ({ row }) => (
					<div className="flex flex-col gap-0.5 min-w-0">
						<span className="text-xs tabular-nums text-foreground flex items-center gap-1.5 font-mono">
							<IconPhone className="size-3 text-muted-foreground shrink-0" />
							{row.original.phone || "+966 50 123 4567"}
						</span>
						<span className="text-[10px] text-muted-foreground flex items-center gap-1.5 truncate">
							<IconMail className="size-3 text-muted-foreground shrink-0" />
							<span className="truncate">{row.original.email || "ahmed@example.com"}</span>
						</span>
					</div>
				),
			},
			{
				accessorKey: "role",
				header: "القسم",
				size: 120,
				minSize: 100,
				cell: ({ row }) => {
					const roleName = row.original.role || "معلم برمجة";
					return (
						<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700">
							{roleName}
						</span>
					);
				},
			},
			{
				id: "goalProgress",
				header: "تقدم الهدف",
				size: 110,
				minSize: 95,
				cell: () => (
					<div className="flex items-center gap-1.5 w-20">
						<div className="h-1.5 w-12 bg-rose-500 rounded-full" />
						<span className="text-[10px] font-mono font-medium text-muted-foreground">--</span>
					</div>
				),
			},
			{
				id: "shift",
				header: "المناوبة",
				size: 110,
				minSize: 95,
				cell: ({ row }) => {
					const sh = staffShiftsMap.get(row.original.id);
					const label = sh?.label || "عطلة";
					const colorClasses =
						sh?.colorClasses ||
						"bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700";
					const dotColor = sh?.dotColor || "bg-slate-400";

					return (
						<div className="flex items-center gap-1.5">
							<span
								className={cn(
									"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border shadow-2xs",
									colorClasses,
								)}
							>
								<span className={cn("size-1.5 rounded-full shrink-0", dotColor)} />
								<span>{label}</span>
							</span>
						</div>
					);
				},
			},
			{
				id: "attendanceStatus",
				header: "حالة الحضور",
				size: 130,
				minSize: 115,
				cell: ({ row }) => {
					const att = staffAttendanceMap.get(row.original.id);
					const label = att?.label || "لم يسجل";
					const colorClasses =
						att?.colorClasses ||
						"bg-slate-100 text-slate-600 border-slate-200/90 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700";
					const dotColor = att?.dotColor || "bg-slate-400";

					return (
						<div className="flex items-center gap-1.5">
							<span
								className={cn(
									"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border shadow-2xs",
									colorClasses,
								)}
							>
								<span className={cn("size-1.5 rounded-full shrink-0", dotColor)} />
								<span>{label}</span>
							</span>
						</div>
					);
				},
			},
			{
				id: "classroomStatus",
				header: "حالة الفصل",
				size: 110,
				minSize: 95,
				cell: () => (
					// biome-ignore lint/a11y/noStaticElementInteractions: إيقاف انتشار الحدث لعدم فتح أية نافذة تابعة للصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار
					<div onClick={(e) => e.stopPropagation()}>
						<ClassroomStatusSelect
							active={Boolean(classroom.active)}
							onChange={handleStatusChange}
							disabled={isUpdatingClassroom}
						/>
					</div>
				),
			},
			{
				id: "actions",
				header: "الإجراءات",
				size: 130,
				minSize: 115,
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: إيقاف انتشار الحدث لعدم فتح أية نافذة تابعة للصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار
					<div
						className="flex items-center gap-1.5"
						onClick={(e) => e.stopPropagation()}
					>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setTransferStaff(row.original);
								setTargetClassroomId("");
							}}
							className="h-6.5 text-[11px] px-2 font-medium cursor-pointer"
						>
							نقل لفصل آخر
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
									onSelect={() => {
										setTransferStaff(row.original);
										setTargetClassroomId("");
									}}
								>
									<IconArrowsExchange className="size-3.5 text-muted-foreground" />
									نقل إلى فصل دراسي آخر
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="gap-2 text-xs text-destructive cursor-pointer"
									onSelect={() => setDeleteStaffConfirm(row.original)}
								>
									<IconTrash className="size-3.5" />
									إلغاء التعيين من هذا الفصل
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
			},
		],
		[
			staffShiftsMap,
			staffAttendanceMap,
			classroom.active,
			isUpdatingClassroom,
			handleStatusChange,
		],
	);

	const table = useReactTable({
		data: filteredTeachers,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="flex flex-1 flex-col min-h-0">
			{/* بطاقات الإحصائيات الأربع العلوية المطابقة تماماً للصورة */}
			<Stats
				className="px-4"
				stats={statsItems}
			/>

			{/* شريط الأدوات الموحد للمنصة (TableToolbar) */}
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن اسم الموظف / المعرّف..."
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				onExport={handleExport}
				filterMenu={
					<FiltersMenu
						groups={staffFilterGroups}
						size="sm"
						label="فلترة"
						onReset={clearStaffFilters}
					/>
				}
				actions={
					<Button
						size="sm"
						onClick={() => setAssignStaffOpen(true)}
						className="gap-1.5 font-semibold"
					>
						<IconPlus className="size-4" />
						تعيين موظف
					</Button>
				}
			/>

			{/* جدول الموظفين المرتبطين بالفصل */}
			<div className="flex-1 flex flex-col min-h-0">
				<TableDataView
					table={table}
					columns={columns}
					isPending={false}
					tableClassName="w-full min-w-[1050px]"
					emptyState={{
						title: "لا يوجد موظفون معينون لهذا الفصل حتى الآن",
						description: "قم بتعيين المعلمين والمشرفين لمتابعة الطلاب وإدارة الحصص التعليمية.",
						action: {
							label: "تعيين موظف الآن",
							onClick: () => setAssignStaffOpen(true),
						},
					}}
				/>
			</div>

			{/* نافذة تعيين موظفين للفصل */}
			<AssignStaffDialog
				open={assignStaffOpen}
				onOpenChange={setAssignStaffOpen}
				classroom={classroom}
			/>

			{/* نافذة نقل الموظف لفصل آخر بتصميم المنصة المتكامل */}
			<Dialog
				open={Boolean(transferStaff)}
				onOpenChange={(open) => {
					if (!open) {
						setTransferStaff(null);
						setTargetClassroomId("");
					}
				}}
			>
				<DialogContent
					showCloseButton={false}
					className="p-0 gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl transition-all duration-200 sm:max-w-lg"
					dir="rtl"
				>
					{/* ترويسة النافذة: مسار + زر الإغلاق */}
					<div className="p-4 pb-3 border-b border-border/60 flex items-center justify-between text-right bg-muted/20">
						<div className="flex items-center gap-1.5 text-xs font-semibold">
							<span className="text-muted-foreground">الكادر التعليمي</span>
							<span className="text-muted-foreground">›</span>
							<span className="font-bold text-foreground flex items-center gap-1">
								<IconArrowsExchange className="size-4 text-primary" />
								نقل الموظف إلى فصل آخر
							</span>
						</div>

						<button
							type="button"
							onClick={() => {
								setTransferStaff(null);
								setTargetClassroomId("");
							}}
							title="إغلاق"
							className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
						>
							<IconX className="size-4" />
						</button>
					</div>

					<div className="p-5 space-y-4 text-right">
						{/* بطاقة معلومات الموظف المنقول والفصل الحالي */}
						<div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/10">
							<div className="flex items-center gap-3">
								<div className="size-10 rounded-full bg-[#8296FF] text-white flex items-center justify-center text-xs font-bold shadow-2xs overflow-hidden">
									{transferStaff?.image ? (
										<img
											src={transferStaff.image}
											alt={transferStaff.name}
											className="size-full object-cover rounded-full"
										/>
									) : (
										<span>{transferStaff?.name ? getInitials(transferStaff.name) : "م"}</span>
									)}
								</div>
								<div className="flex flex-col text-right">
									<span className="text-xs font-bold text-foreground">
										{transferStaff?.name}
									</span>
									<span className="text-[10px] text-muted-foreground">
										{transferStaff ? `D-${transferStaff.id.slice(0, 4)}` : ""} • الفصل الحالي:{" "}
										<span className="font-medium text-foreground">{classroom.name}</span>
									</span>
								</div>
							</div>

							<span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
								قيد النقل
							</span>
						</div>

						{/* اختيار الفصل الدراسي الجديد */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label
									htmlFor="target-classroom-select"
									className="text-xs font-bold text-foreground flex items-center gap-1.5"
								>
									<span>الفصل الدراسي الجديد</span>
									<span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
										مطلوب
									</span>
								</label>
								<span className="text-[10px] text-muted-foreground">
									متاح {availableTransferClassrooms.length} فصل آخر
								</span>
							</div>

							<Select
								value={targetClassroomId}
								onValueChange={setTargetClassroomId}
								dir="rtl"
							>
								<SelectTrigger
									id="target-classroom-select"
									dir="rtl"
									className="w-full h-10 text-right text-xs rounded-xl border border-border/80 bg-background font-medium px-3 focus:ring-1"
								>
									<SelectValue placeholder="اختر الفصل الدراسي المستهدف..." />
								</SelectTrigger>
								<SelectContent
									position="popper"
									sideOffset={4}
									className="w-[var(--radix-select-trigger-width)] max-h-60 rounded-xl border border-border shadow-xl z-[9999]"
									dir="rtl"
								>
									{availableTransferClassrooms.length === 0 ? (
										<div className="p-3 text-center text-xs text-muted-foreground">
											لا توجد فصول دراسية أخرى متاحة للنقل إليها
										</div>
									) : (
										availableTransferClassrooms.map((c) => (
											<SelectItem
												key={c.id}
												value={c.id}
												className="text-xs py-2 px-2.5 cursor-pointer rounded-lg hover:bg-muted"
												dir="rtl"
											>
												<div className="flex items-center justify-between w-full gap-2">
													<div className="flex items-center gap-2">
														<span className="font-semibold text-foreground">{c.name}</span>
														{c.code && (
															<span className="text-[10px] font-mono text-muted-foreground">
																#{c.code}
															</span>
														)}
													</div>
													<span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
														{c.enrolledCount || 0}/{c.capacity} طالب
													</span>
												</div>
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
						</div>

						{/* خيار إشعار عبر البريد */}
						{/* <div className="flex items-center justify-between pt-1">
							<span className="text-xs font-medium text-foreground">
								إشعار الموظف بالنقل عبر البريد
							</span>
							<Switch
								checked={notifyViaEmail}
								onCheckedChange={setNotifyViaEmail}
								aria-label="إشعار الموظف بالنقل"
							/>
						</div> */}
					</div>

					{/* تذييل النافذة */}
					<div className="p-4 border-t border-border/60 bg-muted/10 flex items-center justify-between gap-3">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => {
								setTransferStaff(null);
								setTargetClassroomId("");
							}}
							disabled={isTransferring}
							className="text-xs font-medium rounded-xl h-9 px-4 cursor-pointer"
						>
							إلغاء
						</Button>

						<Button
							type="button"
							size="sm"
							onClick={handleExecuteTransfer}
							disabled={!targetClassroomId || isTransferring}
							className="gap-2 px-5 font-semibold text-xs rounded-xl h-9 bg-[#4F6AE0] hover:bg-[#435bc4] text-white shadow-xs cursor-pointer disabled:opacity-50"
						>
							<IconArrowsExchange className="size-4" />
							{isTransferring ? "جاري النقل..." : "تأكيد النقل"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* نافذة تأكيد إلغاء تعيين الموظف من الفصل */}
			<Dialog
				open={Boolean(deleteStaffConfirm)}
				onOpenChange={(open) => {
					if (!open && !isRemovingStaff) {
						setDeleteStaffConfirm(null);
					}
				}}
			>
				<DialogContent
					className="max-w-md p-6 rounded-2xl border border-border/80 bg-background shadow-2xl"
					dir="rtl"
				>
					<div className="flex items-start gap-3.5">
						<div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-destructive/10 text-destructive border border-destructive/20">
							<IconTrash className="size-5" />
						</div>
						<div className="space-y-1.5 text-right flex-1 min-w-0">
							<h3 className="text-base font-bold text-foreground">
								إلغاء تعيين الموظف من الفصل
							</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">
								هل أنت متأكد من إلغاء تعيين{" "}
								<span className="font-semibold text-foreground">
									{deleteStaffConfirm?.name}
								</span>{" "}
								من فصل <span className="font-semibold text-foreground">{classroom.name}</span>؟
								لن يتم حذف حساب الموظف، بل إزالته فقط من كادر هذا الفصل.
							</p>
						</div>
					</div>

					<div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setDeleteStaffConfirm(null)}
							disabled={isRemovingStaff}
							className="text-xs rounded-xl h-9 px-4 cursor-pointer font-medium"
						>
							تراجع
						</Button>
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={handleExecuteRemoveStaff}
							disabled={isRemovingStaff}
							className="text-xs rounded-xl h-9 px-4 font-semibold cursor-pointer gap-1.5"
						>
							<IconTrash className="size-3.5" />
							{isRemovingStaff ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
