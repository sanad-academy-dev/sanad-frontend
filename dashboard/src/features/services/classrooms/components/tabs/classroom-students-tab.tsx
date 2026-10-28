import {
	IconArrowsExchange,
	IconCalendarEvent,
	IconChevronDown,
	IconClock,
	IconDots,
	IconEye,
	IconGenderFemale,
	IconGenderMale,
	IconPhone,
	IconPlus,
	IconTrash,
	IconUser,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import {
	useStudentAttendance,
	useUpsertStudentAttendance,
} from "@/features/services/attendance/hooks/use-student-attendance";
import { useStudentShifts } from "@/features/services/attendance/hooks/use-student-shifts";
import { AssignStudentDialog } from "@/features/services/classrooms/components/assign-student-dialog";
import { useClassrooms } from "@/features/services/classrooms/hooks/use-classrooms";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { backendFetch } from "@/lib/backend-fetch";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/utils";
import type {
	ClassroomResponse,
	ClassroomStudentInfo,
} from "@/server/classrooms/classrooms.type";

interface ClassroomStudentsTabProps {
	classroom: ClassroomResponse;
	onRefetch: () => void;
}

const AVATAR_PALETTE = [
	"bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300",
	"bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300",
	"bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300",
	"bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300",
	"bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300",
	"bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300",
	"bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-950/50 dark:text-teal-300",
];

function getInitials(name: string): string {
	if (!name) return "ط";
	const clean = name.trim().replace(/^د\.\s*|^أ\.\s*/, "");
	const parts = clean.split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "ط";
	if (parts.length === 1) return parts[0].slice(0, 2);
	return `${parts[0][0]}${parts[1][0]}`;
}

export function ClassroomStudentsTab({ classroom, onRefetch }: ClassroomStudentsTabProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [assignStudentOpen, setAssignStudentOpen] = useState(false);

	// حالة نقل طالب لفصل آخر
	const [transferStudent, setTransferStudent] = useState<ClassroomStudentInfo | null>(null);
	const [targetClassroomId, setTargetClassroomId] = useState<string>("");
	const [isTransferring, setIsTransferring] = useState(false);

	// حالة تأكيد إزالة طالب من الفصل
	const [deleteStudentConfirm, setDeleteStudentConfirm] =
		useState<ClassroomStudentInfo | null>(null);
	const [isRemovingStudent, setIsRemovingStudent] = useState(false);

	// بيانات الطلاب الملحقين بالفصل
	const rawStudents = useMemo(() => classroom.students || [], [classroom.students]);

	// قائمة الفصول ومفردات المرضى/الطلاب لتغذية البيانات بمرونة
	const { classrooms } = useClassrooms();
	const { patients } = usePatients();

	// خريطة لتفاصيل الطالب من ملفه الشامل في النظام (ولي الأمر، الهاتف، العمر، المناوبة المفضلة)
	const patientsMap = useMemo(() => {
		const map = new Map<string, (typeof patients)[number]>();
		for (const p of patients) {
			map.set(p.id, p);
		}
		return map;
	}, [patients]);

	// دمج بيانات الطلاب مع البيانات الكاملة المسجلة
	const students = useMemo<ClassroomStudentInfo[]>(() => {
		return rawStudents.map((s) => {
			const full = patientsMap.get(s.id);
			return {
				id: s.id,
				name: s.name || full?.name || "طالب",
				code: s.code || full?.code || s.id.slice(0, 5),
				gender: s.gender || full?.gender || null,
				avatar: s.avatar || (full as { avatar?: string | null } | undefined)?.avatar || null,
				active: s.active !== undefined ? s.active : (full?.active ?? true),
				age: s.age ?? full?.age ?? null,
				birthDate: s.birthDate || full?.birthDate || null,
				guardianName:
					s.guardianName || full?.owner?.name || full?.emergencyContactName || null,
				guardianPhone:
					s.guardianPhone ||
					full?.owner?.phone ||
					full?.emergencyContactPhone ||
					full?.owner?.phoneE164 ||
					null,
				guardianRelationship:
					s.guardianRelationship ||
					full?.guardianRelationship ||
					full?.owner?.relationship ||
					null,
				preferredShift: s.preferredShift || full?.preferredShift || null,
			};
		});
	}, [rawStudents, patientsMap]);

	// استدعاء سجلات حضور ومناوبات الطلاب لليوم الحالي تحديداً
	const todayDate = useMemo(() => new Date(), []);
	const todayKey = useMemo(() => format(todayDate, "yyyy-MM-dd"), [todayDate]);

	const { records: todayAttendance = [] } = useStudentAttendance(todayDate, todayDate);
	const { shifts: todayShifts = [] } = useStudentShifts(todayDate, todayDate);
	const { upsert: upsertAttendance } = useUpsertStudentAttendance();

	// دالة مساعدة للتحقق من هوية الطالب وتاريخ السجل بأمان ودقة
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

	type StudentRecordWithId = {
		staffId?: string | null;
		studentId?: string | null;
		patientId?: string | null;
		date?: unknown;
	};

	const getRecordStudentId = useCallback((item: StudentRecordWithId) => {
		return item.studentId || item.patientId || item.staffId;
	}, []);

	// خريطة حالة حضور الطلاب لليوم الحالي
	const studentAttendanceMap = useMemo(() => {
		const map = new Map<
			string,
			{
				status: string;
				label: string;
				colorClasses: string;
				dotColor: string;
			}
		>();

		for (const student of students) {
			// 1. فحص هل يوجد سجل حضور/انصراف لليوم الحالي
			const todayRec = (todayAttendance || []).find((r) => {
				const recStudentId = getRecordStudentId(r as StudentRecordWithId);
				return recStudentId === student.id && isSameDay(r.date, todayKey);
			});

			// 2. فحص هل لديه مناوبة مجدولة اليوم
			const shiftToday = (todayShifts || []).find((s) => {
				const shiftStudentId = getRecordStudentId(s as StudentRecordWithId);
				return shiftStudentId === student.id && isSameDay(s.date, todayKey);
			});

			if (todayRec) {
				const st = todayRec.status?.toUpperCase();
				if (st === "PRESENT") {
					map.set(student.id, {
						status: "PRESENT",
						label: "حاضر",
						colorClasses:
							"bg-emerald-50 text-emerald-700 border-emerald-200/90 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800",
						dotColor: "bg-emerald-500",
					});
				} else if (st === "ABSENT") {
					map.set(student.id, {
						status: "ABSENT",
						label: "غائب",
						colorClasses:
							"bg-rose-50 text-rose-700 border-rose-200/90 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800",
						dotColor: "bg-rose-500",
					});
				} else if (st === "LEAVE") {
					map.set(student.id, {
						status: "LEAVE",
						label: "إجازة",
						colorClasses:
							"bg-purple-50 text-purple-700 border-purple-200/90 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
						dotColor: "bg-purple-500",
					});
				} else if (st === "LATE") {
					map.set(student.id, {
						status: "LATE",
						label: "متأخر",
						colorClasses:
							"bg-amber-50 text-amber-700 border-amber-200/90 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
						dotColor: "bg-amber-500",
					});
				} else {
					map.set(student.id, {
						status: st || "UNKNOWN",
						label: st || "لم يسجل",
						colorClasses:
							"bg-blue-50 text-blue-700 border-blue-200/90 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
						dotColor: "bg-blue-500",
					});
				}
			} else if (shiftToday || student.preferredShift) {
				// لديه دوام/مناوبة مسجلة اليوم لكنه لم يسجل حضوراً بعد
				map.set(student.id, {
					status: "PENDING_CHECKIN",
					label: "لم يسجل بعد",
					colorClasses:
						"bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700",
					dotColor: "bg-slate-400",
				});
			} else {
				// يوم عطلة
				map.set(student.id, {
					status: "NO_SHIFT",
					label: "عطلة",
					colorClasses:
						"bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800",
					dotColor: "bg-sky-500",
				});
			}
		}

		return map;
	}, [students, todayKey, todayAttendance, todayShifts, isSameDay, getRecordStudentId]);

	// خريطة مناوبات الطلاب لليوم الحالي (صباحي / مسائي / عطلة)
	const studentShiftsMap = useMemo(() => {
		const map = new Map<
			string,
			{
				type: string;
				label: string;
				colorClasses: string;
				dotColor: string;
			}
		>();

		for (const student of students) {
			const shiftToday = (todayShifts || []).find((s) => {
				const shiftStudentId = getRecordStudentId(s as StudentRecordWithId);
				return shiftStudentId === student.id && isSameDay(s.date, todayKey);
			});

			if (shiftToday) {
				const shiftType = (shiftToday.type || "").toUpperCase();
				if (shiftType === "MORNING") {
					map.set(student.id, {
						type: "MORNING",
						label: "صباحي",
						colorClasses:
							"bg-amber-50 text-amber-700 border-amber-200/90 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
						dotColor: "bg-amber-500",
					});
				} else if (shiftType === "EVENING") {
					map.set(student.id, {
						type: "EVENING",
						label: "مسائي",
						colorClasses:
							"bg-indigo-50 text-indigo-700 border-indigo-200/90 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800",
						dotColor: "bg-indigo-500",
					});
				} else if (shiftType === "NIGHT") {
					map.set(student.id, {
						type: "NIGHT",
						label: "ليلي",
						colorClasses:
							"bg-purple-50 text-purple-700 border-purple-200/90 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
						dotColor: "bg-purple-500",
					});
				} else {
					map.set(student.id, {
						type: shiftType,
						label: shiftType,
						colorClasses:
							"bg-blue-50 text-blue-700 border-blue-200/90 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
						dotColor: "bg-blue-500",
					});
				}
			} else if (student.preferredShift) {
				const isMorning =
					student.preferredShift.includes("صباح") || student.preferredShift === "MORNING";
				map.set(student.id, {
					type: isMorning ? "MORNING" : "EVENING",
					label: isMorning ? "صباحي" : "مسائي",
					colorClasses: isMorning
						? "bg-amber-50 text-amber-700 border-amber-200/90 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800"
						: "bg-indigo-50 text-indigo-700 border-indigo-200/90 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800",
					dotColor: isMorning ? "bg-amber-500" : "bg-indigo-500",
				});
			} else {
				map.set(student.id, {
					type: "OFF",
					label: "عطلة",
					colorClasses:
						"bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700",
					dotColor: "bg-slate-400",
				});
			}
		}

		return map;
	}, [students, todayKey, todayShifts, isSameDay, getRecordStudentId]);

	// فلاتر جدول الطلاب (الجنس + المناوبة + حالة الحضور + الحالة)
	const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
	const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
	const [selectedAttendance, setSelectedAttendance] = useState<string[]>([]);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

	const toggleGender = useCallback((gender: string) => {
		setSelectedGenders((prev) =>
			prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender],
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

	const toggleStatus = useCallback((status: string) => {
		setSelectedStatuses((prev) =>
			prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
		);
	}, []);

	const clearStudentFilters = useCallback(() => {
		setSelectedGenders([]);
		setSelectedShifts([]);
		setSelectedAttendance([]);
		setSelectedStatuses([]);
	}, []);

	const studentFilterGroups: FilterGroup[] = useMemo(
		() => [
			{
				key: "gender",
				label: "الجنس",
				Icon: IconUser,
				options: [
					{ value: "MALE", label: "ذكر" },
					{ value: "FEMALE", label: "أنثى" },
				],
				selected: selectedGenders,
				onToggle: toggleGender,
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
					{ value: "NO_SHIFT", label: "عطلة" },
				],
				selected: selectedAttendance,
				onToggle: toggleAttendance,
			},
			{
				key: "status",
				label: "الحالة",
				Icon: IconUsers,
				options: [
					{ value: "ACTIVE", label: "نشط" },
					{ value: "INACTIVE", label: "غير نشط" },
				],
				selected: selectedStatuses,
				onToggle: toggleStatus,
			},
		],
		[
			selectedGenders,
			selectedShifts,
			selectedAttendance,
			selectedStatuses,
			toggleGender,
			toggleShift,
			toggleAttendance,
			toggleStatus,
		],
	);

	// تصفية الطلاب حسب البحث والفلاتر
	const filteredStudents = useMemo(() => {
		let result = students;

		if (selectedGenders.length > 0) {
			result = result.filter((s) => s.gender && selectedGenders.includes(s.gender));
		}

		if (selectedShifts.length > 0) {
			result = result.filter((s) => {
				const shiftType = studentShiftsMap.get(s.id)?.type || "OFF";
				return selectedShifts.includes(shiftType);
			});
		}

		if (selectedAttendance.length > 0) {
			result = result.filter((s) => {
				const status = studentAttendanceMap.get(s.id)?.status || "NOT_RECORDED";
				return selectedAttendance.includes(status);
			});
		}

		if (selectedStatuses.length > 0) {
			result = result.filter((s) => {
				const st = s.active !== false ? "ACTIVE" : "INACTIVE";
				return selectedStatuses.includes(st);
			});
		}

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(s) =>
					s.name.toLowerCase().includes(q) ||
					s.code?.toLowerCase().includes(q) ||
					s.guardianName?.toLowerCase().includes(q) ||
					s.guardianPhone?.includes(q),
			);
		}

		return result;
	}, [
		students,
		selectedGenders,
		selectedShifts,
		selectedAttendance,
		selectedStatuses,
		studentShiftsMap,
		studentAttendanceMap,
		searchQuery,
	]);

	// بطاقات الإحصائيات الأربع العلوية للطلاب
	const statsItems = useMemo<StatItem[]>(() => {
		const total = students.length;
		const active = students.filter((s) => s.active !== false).length;
		const presentToday = students.filter(
			(s) => studentAttendanceMap.get(s.id)?.status === "PRESENT",
		).length;
		const onHoliday = students.filter(
			(s) =>
				studentShiftsMap.get(s.id)?.type === "OFF" ||
				studentAttendanceMap.get(s.id)?.status === "NO_SHIFT",
		).length;

		return [
			{ title: "إجمالي الطلاب", value: total, tooltip: "إجمالي الطلاب المسجلين في هذا الفصل" },
			{ title: "نشط", value: active, tooltip: "الطلاب النشطون في هذا الفصل" },
			{
				title: "حاضر اليوم",
				value: presentToday,
				tooltip: "الطلاب الذين تم تسجيل حضورهم اليوم",
			},
			{
				title: "في عطلة",
				value: onHoliday,
				tooltip: "الطلاب الذين في يوم إجازة أو عطلة اليوم",
			},
		];
	}, [students, studentAttendanceMap, studentShiftsMap]);

	// تصدير CSV
	const handleExport = () => {
		const headers = [
			"اسم الطالب",
			"المعرف",
			"ولي الأمر",
			"رقم الهاتف",
			"الجنس",
			"المناوبة",
			"حالة الحضور",
			"الحالة",
		];
		const rows = students.map((s) => [
			s.name,
			s.code ?? "",
			s.guardianName ?? "غير محدد",
			s.guardianPhone ?? "",
			s.gender === "FEMALE" ? "أنثى" : "ذكر",
			studentShiftsMap.get(s.id)?.label || "عطلة",
			studentAttendanceMap.get(s.id)?.label || "لم يسجل",
			s.active !== false ? "نشط" : "غير نشط",
		]);
		downloadCsv(`classroom_${classroom.name}_students`, headers, rows);
	};

	// إزالة طالب من الفصل
	const handleExecuteRemoveStudent = async () => {
		if (!deleteStudentConfirm) return;
		setIsRemovingStudent(true);
		try {
			const remainingIds = students
				.filter((s) => s.id !== deleteStudentConfirm.id)
				.map((s) => s.id);

			const res = await backendFetch(`/api/classrooms/${classroom.id}/students`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ studentIds: remainingIds }),
			});

			if (!res.ok) throw new Error("فشل إزالة الطالب");
			toast.success(`تم إلغاء تسجيل ${deleteStudentConfirm.name} من الفصل بنجاح`);
			setDeleteStudentConfirm(null);
			onRefetch();
		} catch {
			toast.error("حدث خطأ أثناء إزالة الطالب من الفصل");
		} finally {
			setIsRemovingStudent(false);
		}
	};

	// نقل طالب إلى فصل آخر
	const handleExecuteTransfer = async () => {
		if (!transferStudent || !targetClassroomId) return;
		setIsTransferring(true);
		try {
			// 1. إضافة الطالب للفصل المستهدف
			const targetClassroom = classrooms.find((c) => c.id === targetClassroomId);
			const targetStudentIds = Array.from(
				new Set([...(targetClassroom?.students?.map((s) => s.id) || []), transferStudent.id]),
			);

			await backendFetch(`/api/classrooms/${targetClassroomId}/students`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ studentIds: targetStudentIds }),
			});

			// 2. إزالة الطالب من الفصل الحالي
			const remainingStudentIds = students
				.filter((s) => s.id !== transferStudent.id)
				.map((s) => s.id);

			await backendFetch(`/api/classrooms/${classroom.id}/students`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ studentIds: remainingStudentIds }),
			});

			toast.success(`تم نقل الطالب ${transferStudent.name} إلى الفصل الجديد بنجاح`);
			setTransferStudent(null);
			setTargetClassroomId("");
			onRefetch();
		} catch {
			toast.error("حدث خطأ أثناء نقل الطالب");
		} finally {
			setIsTransferring(false);
		}
	};

	// الفصول المتاحة للنقل إليها
	const availableTransferClassrooms = useMemo(() => {
		return classrooms.filter((c) => c.id !== classroom.id && c.active);
	}, [classrooms, classroom.id]);

	// أعمدة جدول الطلاب
	const columns = useMemo<ColumnDef<ClassroomStudentInfo>[]>(
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
					// biome-ignore lint/a11y/noStaticElementInteractions: إيقاف انتشار الحدث لعدم تفعيل النقر على الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار النقر لخانة الاختيار
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
				header: "اسم الطالب / المعرف",
				size: 200,
				minSize: 180,
				cell: ({ row, table }) => {
					const idx = table.getRowModel().rows.findIndex((r) => r.id === row.id);
					const colorClass = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
					return (
						<Link
							to="/services/patients/$patientId"
							params={{ patientId: row.original.id }}
							className="flex items-center gap-2.5 min-w-0 group"
						>
							<div
								className={cn(
									"size-8 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden",
									colorClass,
								)}
							>
								{row.original.avatar ? (
									<img
										src={row.original.avatar}
										alt={row.original.name}
										className="size-full object-cover rounded-full"
									/>
								) : (
									<span>{getInitials(row.original.name)}</span>
								)}
							</div>
							<div className="flex flex-col min-w-0">
								<span className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">
									{row.original.name}
								</span>
								<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
									#{row.original.code || row.original.id.slice(0, 5)}
								</span>
							</div>
						</Link>
					);
				},
			},
			{
				id: "guardian",
				header: "ولي الأمر / الهاتف",
				size: 190,
				minSize: 160,
				cell: ({ row }) => {
					const guardian = row.original.guardianName || "غير مسجل";
					const phone = row.original.guardianPhone || "--";
					return (
						<div className="flex flex-col gap-0.5 min-w-0 text-right">
							<span className="text-xs font-medium text-foreground flex items-center gap-1.5 truncate">
								<IconUser className="size-3 text-muted-foreground shrink-0" />
								<span className="truncate">{guardian}</span>
							</span>
							<span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-mono tabular-nums">
								<IconPhone className="size-3 text-muted-foreground shrink-0" />
								<span>{phone}</span>
							</span>
						</div>
					);
				},
			},
			{
				id: "demographics",
				header: "العمر / الجنس",
				size: 130,
				minSize: 110,
				cell: ({ row }) => {
					const isFemale = row.original.gender === "FEMALE";
					const ageStr = row.original.age ? `${row.original.age} سنوات` : "--";
					return (
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							{isFemale ? (
								<IconGenderFemale className="size-3.5 text-rose-500 shrink-0" />
							) : (
								<IconGenderMale className="size-3.5 text-blue-500 shrink-0" />
							)}
							<span className="font-medium">{isFemale ? "أنثى" : "ذكر"}</span>
							<span>•</span>
							<span className="font-mono text-[11px]">{ageStr}</span>
						</div>
					);
				},
			},
			{
				id: "goalProgress",
				header: "تقدم الخطة",
				size: 110,
				minSize: 95,
				cell: () => (
					<div className="flex items-center gap-1.5 w-20">
						<div className="h-1.5 w-12 bg-emerald-500 rounded-full" />
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
					const sh = studentShiftsMap.get(row.original.id);
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
					const att = studentAttendanceMap.get(row.original.id);
					const label = att?.label || "لم يسجل";
					const colorClasses =
						att?.colorClasses ||
						"bg-slate-100 text-slate-600 border-slate-200/90 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700";
					const dotColor = att?.dotColor || "bg-slate-400";

					return (
						// biome-ignore lint/a11y/noStaticElementInteractions: إيقاف انتشار الحدث لعدم فتح أية نافذة تابعة للصف
						// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار الحدث
						<div
							className="flex items-center gap-1.5"
							onClick={(e) => e.stopPropagation()}
						>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className={cn(
											"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border shadow-2xs cursor-pointer hover:opacity-85 transition-opacity",
											colorClasses,
										)}
									>
										<span className={cn("size-1.5 rounded-full shrink-0", dotColor)} />
										<span>{label}</span>
										<IconChevronDown className="size-2.5 opacity-60" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="min-w-[130px] p-1"
								>
									<DropdownMenuItem
										onClick={() =>
											upsertAttendance({
												staffId: row.original.id,
												date: todayKey,
												status: "PRESENT",
												hours: 8,
											})
										}
										className="gap-2 text-xs cursor-pointer text-emerald-600 focus:text-emerald-700"
									>
										<span className="size-2 rounded-full bg-emerald-500" />
										حاضر
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											upsertAttendance({
												staffId: row.original.id,
												date: todayKey,
												status: "ABSENT",
												hours: 0,
											})
										}
										className="gap-2 text-xs cursor-pointer text-rose-600 focus:text-rose-700"
									>
										<span className="size-2 rounded-full bg-rose-500" />
										غائب
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											upsertAttendance({
												staffId: row.original.id,
												date: todayKey,
												status: "LATE",
												hours: 0,
											})
										}
										className="gap-2 text-xs cursor-pointer text-amber-600 focus:text-amber-700"
									>
										<span className="size-2 rounded-full bg-amber-500" />
										متأخر
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											upsertAttendance({
												staffId: row.original.id,
												date: todayKey,
												status: "LEAVE",
												hours: 0,
											})
										}
										className="gap-2 text-xs cursor-pointer text-purple-600 focus:text-purple-700"
									>
										<span className="size-2 rounded-full bg-purple-500" />
										إجازة
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
			{
				id: "studentStatus",
				header: "حالة الطالب",
				size: 110,
				minSize: 95,
				cell: ({ row }) => {
					const isActive = row.original.active !== false;
					return (
						<span
							className={cn(
								"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border shadow-2xs",
								isActive
									? "bg-emerald-50 text-emerald-700 border-emerald-200/90 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
									: "bg-muted text-muted-foreground border-border",
							)}
						>
							<span
								className={cn(
									"size-1.5 rounded-full shrink-0",
									isActive ? "bg-emerald-500" : "bg-muted-foreground",
								)}
							/>
							<span>{isActive ? "نشط" : "غير نشط"}</span>
						</span>
					);
				},
			},
			{
				id: "actions",
				header: "الإجراءات",
				size: 130,
				minSize: 115,
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: إيقاف انتشار الحدث
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار الحدث
					<div
						className="flex items-center gap-1.5"
						onClick={(e) => e.stopPropagation()}
					>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setTransferStudent(row.original);
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
									asChild
									className="gap-2 text-xs"
								>
									<Link
										to="/services/patients/$patientId"
										params={{ patientId: row.original.id }}
									>
										<IconEye className="size-3.5 text-muted-foreground" />
										عرض ملف الطالب
									</Link>
								</DropdownMenuItem>

								<DropdownMenuItem
									className="gap-2 text-xs cursor-pointer"
									onSelect={() => {
										setTransferStudent(row.original);
										setTargetClassroomId("");
									}}
								>
									<IconArrowsExchange className="size-3.5 text-blue-500" />
									نقل الطالب إلى فصل آخر
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem
									className="gap-2 text-xs text-destructive cursor-pointer"
									onSelect={() => setDeleteStudentConfirm(row.original)}
								>
									<IconTrash className="size-3.5 text-destructive" />
									إلغاء تسجيل من الفصل
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
			},
		],
		[studentAttendanceMap, studentShiftsMap, todayKey, upsertAttendance],
	);

	const table = useReactTable({
		data: filteredStudents,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="flex flex-1 flex-col min-h-0">
			{/* بطاقات الإحصائيات الأربع العلوية */}
			<Stats
				className="px-4"
				stats={statsItems}
			/>

			{/* شريط أدوات الجدول: بحث فوري + قائمة فلاتر + تصدير + زر تعيين طالب */}
			<TableToolbar
				searchPlaceholder="ابحث عن اسم الطالب / المعرّف / ولي الأمر..."
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				onExport={handleExport}
				filterMenu={
					<FiltersMenu
						groups={studentFilterGroups}
						size="sm"
						label="فلترة"
						onReset={clearStudentFilters}
					/>
				}
				actions={
					<Button
						size="sm"
						onClick={() => setAssignStudentOpen(true)}
						className="gap-1.5 font-semibold cursor-pointer"
					>
						<IconPlus className="size-4" />
						تعيين طالب
					</Button>
				}
			/>

			{/* جدول الطلاب */}
			<div className="flex-1 flex flex-col min-h-0">
				<TableDataView
					table={table}
					columns={columns}
					isPending={false}
					tableClassName="w-full min-w-[1050px]"
					emptyState={{
						title: "لا يوجد طلاب مسجلون في هذا الفصل حتى الآن",
						description:
							"قم بتسجيل الطلاب وضمهم لهذا الفصل لبدء متابعة حضورهم ومناوباتهم والعملية التعليمية.",
						action: {
							label: "تعيين طالب الآن",
							onClick: () => setAssignStudentOpen(true),
						},
					}}
				/>
			</div>

			{/* نافذة تعيين طلاب للفصل (سايد شيت + بوب اب تأكيد فوقه) */}
			<AssignStudentDialog
				open={assignStudentOpen}
				onOpenChange={(open) => {
					setAssignStudentOpen(open);
					if (!open) onRefetch();
				}}
				classroom={classroom}
			/>

			{/* نافذة نقل الطالب إلى فصل آخر */}
			<Dialog
				open={Boolean(transferStudent)}
				onOpenChange={(open) => {
					if (!open) {
						setTransferStudent(null);
						setTargetClassroomId("");
					}
				}}
			>
				<DialogContent
					showCloseButton={false}
					className="p-0 gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl transition-all duration-200 sm:max-w-lg"
					dir="rtl"
				>
					{/* ترويسة النافذة */}
					<div className="p-4 pb-3 border-b border-border/60 flex items-center justify-between text-right bg-muted/20">
						<div className="flex items-center gap-1.5 text-xs font-semibold">
							<span className="text-muted-foreground">طلاب الفصل</span>
							<span className="text-muted-foreground">›</span>
							<span className="font-bold text-foreground flex items-center gap-1">
								<IconArrowsExchange className="size-4 text-primary" />
								نقل الطالب إلى فصل آخر
							</span>
						</div>

						<button
							type="button"
							onClick={() => {
								setTransferStudent(null);
								setTargetClassroomId("");
							}}
							title="إغلاق"
							className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
						>
							<IconX className="size-4" />
						</button>
					</div>

					<div className="p-5 space-y-4 text-right">
						{/* بطاقة معلومات الطالب المنقول */}
						<div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/10">
							<div className="flex items-center gap-3">
								<div className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs overflow-hidden">
									{transferStudent?.avatar ? (
										<img
											src={transferStudent.avatar}
											alt={transferStudent.name}
											className="size-full object-cover rounded-full"
										/>
									) : (
										<span>
											{transferStudent?.name ? getInitials(transferStudent.name) : "ط"}
										</span>
									)}
								</div>
								<div className="flex flex-col text-right">
									<span className="text-xs font-bold text-foreground">
										{transferStudent?.name}
									</span>
									<span className="text-[10px] text-muted-foreground">
										#{transferStudent?.code || transferStudent?.id.slice(0, 5)} • الفصل الحالي:{" "}
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
							<label
								htmlFor="target-transfer-classroom-select"
								className="text-xs font-bold text-foreground"
							>
								الفصل الدراسي الجديد
							</label>
							<Select
								value={targetClassroomId}
								onValueChange={setTargetClassroomId}
							>
								<SelectTrigger
									id="target-transfer-classroom-select"
									className="w-full h-10 rounded-xl border border-border/80 text-xs px-3 font-medium bg-background"
									dir="rtl"
								>
									<SelectValue placeholder="اختر الفصل الدراسي المستهدف..." />
								</SelectTrigger>
								<SelectContent
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
					</div>

					{/* تذييل النافذة */}
					<div className="p-4 border-t border-border/60 bg-muted/10 flex items-center justify-between gap-3">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => {
								setTransferStudent(null);
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
							className="text-xs font-semibold rounded-xl h-9 px-5 gap-1.5 cursor-pointer"
						>
							<IconArrowsExchange className="size-4" />
							{isTransferring ? "جاري النقل..." : "تأكيد نقل الطالب"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* نافذة تأكيد إلغاء تسجيل الطالب من الفصل */}
			<Dialog
				open={Boolean(deleteStudentConfirm)}
				onOpenChange={(open) => {
					if (!open) setDeleteStudentConfirm(null);
				}}
			>
				<DialogContent
					className="sm:max-w-md p-5 text-right rounded-2xl border border-border/80"
					dir="rtl"
				>
					<DialogHeader className="text-right space-y-2">
						<DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
							<IconTrash className="size-4 text-destructive" />
							إلغاء تسجيل الطالب من الفصل
						</DialogTitle>
						<DialogDescription className="text-xs text-muted-foreground leading-relaxed">
							هل أنت متأكد من رغبتك في إلغاء تسجيل الطالب{" "}
							<strong className="text-foreground">{deleteStudentConfirm?.name}</strong> من فصل{" "}
							<strong className="text-foreground">{classroom.name}</strong>؟ لن يتم حذف سجل
							الطالب من الأكاديمية وستتمكن من إلحاقه بأي فصل آخر لاحقاً.
						</DialogDescription>
					</DialogHeader>

					<DialogFooter className="gap-2 sm:gap-0 mt-3">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setDeleteStudentConfirm(null)}
							disabled={isRemovingStudent}
							className="text-xs rounded-xl"
						>
							إلغاء
						</Button>
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={handleExecuteRemoveStudent}
							disabled={isRemovingStudent}
							className="text-xs rounded-xl"
						>
							{isRemovingStudent ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
