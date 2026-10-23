import {
	IconArrowsExchange,
	IconBeach,
	IconBell,
	IconCalendarCheck,
	IconCalendarEvent,
	IconCalendarMinus,
	IconCheck,
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconCircleX,
	IconClock,
	IconDeviceDesktop,
	IconDownload,
	IconLogin,
	IconPlus,
	type IconProps,
	IconSortDescending,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { addDays, addWeeks, format, isToday, startOfWeek } from "date-fns";
import { arSA } from "date-fns/locale";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { showFeatureLockedToast } from "@/components/common/feature-locked-toast";
import { FiltersMenu } from "@/components/common/filters-menu";
import { TablePagination } from "@/components/common/table-pagination";
import { TableToolbar } from "@/components/common/table-toolbar";
import {
	ScheduleDateRangeFilter,
	type ScheduleDateRange,
	resolveScheduleRange,
} from "@/components/common/schedule-date-range-filter";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AttendanceAbsenceDialog } from "@/features/services/staff/components/attendance/attendance-absence-dialog";
import { AttendanceBulkAbsenceDialog } from "@/features/services/staff/components/attendance/attendance-bulk-absence-dialog";
import { AttendanceBulkLeaveDialog } from "@/features/services/staff/components/attendance/attendance-bulk-leave-dialog";
import {
	AttendanceBulkLeaveReviewDialog,
	type BulkLeaveReview,
} from "@/features/services/staff/components/attendance/attendance-bulk-leave-review-dialog";
import {
	AttendanceBulkRegisterDialog,
	type BulkPickedStaff,
	type BulkRegisterMode,
} from "@/features/services/staff/components/attendance/attendance-bulk-register-dialog";
import { AttendanceLeaveDialog } from "@/features/services/staff/components/attendance/attendance-leave-dialog";
import { AttendanceRegisterDialog } from "@/features/services/staff/components/attendance/attendance-register-dialog";
import { AttendanceStaffPickerPanel } from "@/features/services/staff/components/attendance/attendance-staff-picker-panel";
import { KioskPinDialog } from "@/features/services/staff/components/attendance/kiosk-pin-dialog";
import { KioskScreen } from "@/features/services/staff/components/attendance/kiosk-screen";
import { LeaveAlertsPanel } from "@/features/services/staff/components/attendance/leave-alerts-panel";
import { LeaveReviewDialog } from "@/features/services/staff/components/attendance/leave-review-dialog";
import type { AttendanceLegendKey } from "@/features/services/staff/data/attendance";
import {
	ATTENDANCE_LEGEND,
	ATTENDANCE_STATUSES,
} from "@/features/services/staff/data/attendance";
import { useAttendance } from "@/features/services/staff/hooks/use-attendance";
import { useLeaveRequests } from "@/features/services/staff/hooks/use-leave-request";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useStaffFilters } from "@/features/services/staff/hooks/use-staff-filters";
import { useUpsertAttendance } from "@/features/services/staff/hooks/use-upsert-attendance";
import { downloadCsv } from "@/lib/csv";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import {
	useStudentAttendance,
	useUpsertStudentAttendance,
} from "@/features/services/attendance/hooks/use-student-attendance";
import { ShiftDetailsPanel } from "@/features/services/staff/components/shifts/shift-details-panel";
import { SHIFT_TYPE_MAP } from "@/features/services/staff/data/shifts";
import { useShifts } from "@/features/services/staff/hooks/use-shifts";
import { useStudentShifts } from "@/features/services/attendance/hooks/use-student-shifts";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { cn } from "@/lib/utils";
import type { ShiftAssignmentResponse } from "@/server/shifts/shifts.type";

// لون كل حالة حضور مفهرس بقيمة enum (PRESENT → present …)
const STATUS_COLOR: Record<string, string> = Object.fromEntries(
	ATTENDANCE_STATUSES.map((s) => [s.key, s.color]),
);

// شارة الخلية لكل حالة (نص + أيقونة) — مطابقة لتصميم Figma
const STATUS_CELL: Record<string, { label: string; Icon: FC<IconProps> }> = {
	PRESENT: { label: "حاضر", Icon: IconCalendarCheck },
	ABSENT: { label: "غياب", Icon: IconCircleX },
	LEAVE: { label: "اجازة", Icon: IconBeach },
	LATE: { label: "متأخر", Icon: IconClock },
};

// تنسيق وقت السجل (ISO) → "09:00 AM" و "09:00"
const fmtTime = (iso: string | Date | null) => (iso ? format(new Date(iso), "hh:mm a") : "");
const fmtTime24 = (iso: string | Date | null) => (iso ? format(new Date(iso), "HH:mm") : "");

// مفتاح اليوم (yyyy-MM-dd) من تاريخ السجل أو المناوبة سواء كان نصًا أو كائن Date
const dayKey = (d: unknown): string => {
	if (!d) return "";
	if (typeof d === "string") return d.slice(0, 10);
	if (d instanceof Date && !isNaN(d.getTime())) return format(d, "yyyy-MM-dd");
	return "";
};

// تصدير كشف الحضور الأسبوعي كملف CSV للطلاب أو الموظفين
function exportAttendanceWeekCsv({
	rows,
	days,
	recordByCell,
	isStudents,
}: {
	rows: { id: string; name: string; code?: string }[];
	days: Date[];
	recordByCell: Map<string, { status: string; hours: number; checkIn: string | Date | null; checkOut: string | Date | null }>;
	isStudents: boolean;
}) {
	const headers = [
		isStudents ? "اسم الطالب" : "اسم الموظف",
		"المعرّف",
		...days.map((d) => format(d, "yyyy-MM-dd")),
		"إجمالي الساعات",
	];
	const csvRows = rows.map((r) => {
		let totalHours = 0;
		const dayCells = days.map((d) => {
			const rec = recordByCell.get(`${r.id}_${format(d, "yyyy-MM-dd")}`);
			if (!rec) return "—";
			totalHours += rec.hours || 0;
			if (rec.status === "PRESENT") {
				const inTime = fmtTime24(rec.checkIn);
				const outTime = fmtTime24(rec.checkOut);
				return `حاضر${inTime ? ` (${inTime}${outTime ? ` - ${outTime}` : ""})` : ""}`;
			}
			if (rec.status === "ABSENT") return "غياب";
			if (rec.status === "LEAVE") return "إجازة";
			if (rec.status === "LATE") return "متأخر";
			return rec.status;
		});
		return [r.name, r.code ?? "", ...dayCells, `${totalHours} ساعة`];
	});
	downloadCsv(isStudents ? "student-attendance" : "staff-attendance", headers, csvRows);
}

// أيقونة كل عنصر في دليل الألوان
const LEGEND_ICONS: Record<AttendanceLegendKey, FC<IconProps>> = {
	present: IconCheck,
	absent: IconX,
	leave: IconCalendarEvent,
	late: IconClock,
	shift: IconArrowsExchange,
};

// إجراءات قائمة الخلية (مطابقة لتصميم C5e)
const CELL_ACTIONS = [
	{
		status: "PRESENT",
		label: "تسجيل حاضر / انصراف",
		icon: IconLogin,
		color: "#16A34A",
		hours: 8,
	},
	{ status: "ABSENT", label: "غائب", icon: IconX, color: "#DC2626", hours: 0 },
	{ status: "LATE", label: "متأخر", icon: IconClock, color: "#F59E0B", hours: 0 },
	{ status: "LEAVE", label: "إجازة", icon: IconCalendarEvent, color: "#A855F7", hours: 0 },
] as const;

// قائمة إجراءات الخلية (تُستخدم لزر "+" الفارغ وزر "+" داخل خلية الحضور)
function CellActionsMenu({
	children,
	onPick,
	onScheduleShift,
}: {
	children: ReactNode;
	onPick: (action: (typeof CELL_ACTIONS)[number]) => void;
	onScheduleShift?: () => void;
}) {
	return (
		<DropdownMenu dir="rtl">
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent
				align="center"
				className="min-w-[155px] p-[3px]"
			>
				{onScheduleShift && (
					<DropdownMenuItem
						onSelect={onScheduleShift}
						className="flex h-6 items-center justify-start gap-1.5 rounded-[4px] px-[9px] text-right text-[10px] font-semibold text-[#6366F1] bg-[#6366F1]/5 hover:bg-[#6366F1]/10"
					>
						<IconClock className="size-2.5 text-[#6366F1]" />
						جدولة مناوبة لهذا اليوم
					</DropdownMenuItem>
				)}
				{CELL_ACTIONS.map((action, i) => {
					const ActionIcon = action.icon;
					return (
						<DropdownMenuItem
							key={action.status}
							onSelect={() => onPick(action)}
							className={cn(
								"flex h-6 items-center justify-start gap-1.5 rounded-[4px] px-[9px] text-right text-[10px] font-medium text-[#08090A]",
								i === 0 && !onScheduleShift && "bg-[#9B9B9D]/[0.11]",
							)}
						>
							<ActionIcon
								className="size-2.5"
								style={{ color: action.color }}
							/>
							{action.label}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function StaffAvatar({ name, isStudent = false }: { name: string; isStudent?: boolean }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div
			className={cn(
				"flex size-[18px] shrink-0 items-center justify-center rounded-full text-[9px] font-normal text-white",
				isStudent ? "bg-[#10B981]" : "bg-[#6366F1]",
			)}
		>
			{initials}
		</div>
	);
}

export function AttendanceView({
	targetType = "students",
	studentId,
	hideNameColumn = false,
	hideToolbar = false,
	hideStats = false,
	hidePagination = false,
	dateRange: externalDateRange,
	onDateRangeChange,
	weekStart: externalWeekStart,
	onWeekStartChange,
}: {
	targetType?: "students" | "staff";
	studentId?: string;
	hideNameColumn?: boolean;
	hideToolbar?: boolean;
	hideStats?: boolean;
	hidePagination?: boolean;
	dateRange?: ScheduleDateRange;
	onDateRangeChange?: (range: ScheduleDateRange) => void;
	weekStart?: Date;
	onWeekStartChange?: (date: Date | ((prev: Date) => Date)) => void;
}) {
	const shouldHideName = hideNameColumn || !!studentId;
	const isStudents = targetType === "students";
	const { staff, isLoading: isStaffLoading } = useStaff();
	const { patients, isLoading: isPatientsLoading } = usePatients();
	const isLoading = isStudents ? isPatientsLoading : isStaffLoading;
	const { filterGroups, applyStaffFilters } = useStaffFilters(staff);
	const { clinicInfo } = useClinicInfo();
	// وضع الكشك متاح فقط إذا فُعِّل من الإعدادات وله رمز PIN مخزّن
	const kioskReady = !!clinicInfo?.kioskEnabled && !!clinicInfo?.kioskPin;
	const [search, setSearch] = useState("");

	// نطاق العرض الموحّد (أسبوع / شهر) — يبدأ من الأسبوع الحالي افتراضياً
	const [internalDateRange, setInternalDateRange] = useState<ScheduleDateRange>(() => ({
		mode: "week",
		date: externalWeekStart ?? new Date(),
	}));
	const dateRange = externalDateRange ?? internalDateRange;
	const setDateRange = (range: ScheduleDateRange) => {
		if (onDateRangeChange) {
			onDateRangeChange(range);
		} else {
			setInternalDateRange(range);
		}
		if (onWeekStartChange) {
			onWeekStartChange(range.date);
		}
	};

	const { start: rangeStart, end: rangeEnd, days, label: weekLabel } = useMemo(
		() => resolveScheduleRange(dateRange),
		[dateRange],
	);

	// سجلات الحضور للنطاق المعروض (أسبوع أو شهر)
	const { records: staffRecords } = useAttendance(rangeStart, rangeEnd);
	const { records: studentRecords } = useStudentAttendance(rangeStart, rangeEnd);
	const allTargetRecords = isStudents ? studentRecords : staffRecords;
	const records = useMemo(
		() =>
			studentId
				? allTargetRecords.filter((r) => (r.staffId || (r as any).studentId) === studentId)
				: allTargetRecords,
		[allTargetRecords, studentId],
	);

	// تعيينات المناوبات للنطاق المعروض — لربط الحضور بأيام وساعات العمل المجدولة
	const { shifts: staffShifts } = useShifts(rangeStart, rangeEnd);
	const { shifts: studentShifts } = useStudentShifts(rangeStart, rangeEnd);
	const allTargetShifts = isStudents ? studentShifts : staffShifts;
	const shifts = useMemo(
		() =>
			studentId
				? allTargetShifts.filter((s) => (s.staffId || (s as any).studentId) === studentId)
				: allTargetShifts,
		[allTargetShifts, studentId],
	);

	// خريطة سريعة: "staffId_yyyy-MM-dd" → تعيين المناوبة
	const shiftByCell = useMemo(() => {
		const map = new Map<string, ShiftAssignmentResponse>();
		for (const s of shifts) {
			if (!s) continue;
			const id = s.staffId || (s as any).studentId;
			const dStr = dayKey(s.date);
			if (id && dStr) {
				map.set(`${id}_${dStr}`, s);
			}
		}
		return map;
	}, [shifts]);

	// سجلات حضور اليوم المحددة للتسجيل الجماعي والشارات الحالية
	const todayDate = useMemo(() => new Date(), []);
	const { records: todayStudentRecords } = useStudentAttendance(todayDate, todayDate);

	const { upsert: upsertStaff, upsertAsync: upsertStaffAsync } = useUpsertAttendance();
	const { upsert: upsertStudent, upsertAsync: upsertStudentAsync } = useUpsertStudentAttendance();
	const upsert = isStudents ? upsertStudent : upsertStaff;
	const upsertAsync = isStudents ? upsertStudentAsync : upsertStaffAsync;

	// نافذة تسجيل الحضور/الانصراف
	const [registerCell, setRegisterCell] = useState<{
		staffId: string;
		staffName: string;
		staffCode: string;
		date: Date;
		shift?: ShiftAssignmentResponse | null;
		defaultCheckIn?: string; // HH:mm — لتعبئة الحضور عند إضافة انصراف
		withCheckout?: boolean;
	} | null>(null);

	// لوحة تفاصيل وجدولة المناوبة (تفتح عند الضغط على جدولة مناوبة من الخلية)
	const [shiftPanelPreset, setShiftPanelPreset] = useState<{
		staffId?: string;
		date?: Date;
	} | null>(null);

	// نافذة تسجيل الإجازة
	const [leaveCell, setLeaveCell] = useState<{
		staffId: string;
		staffName: string;
		staffCode: string;
		date: Date;
	} | null>(null);

	// نافذة تسجيل الغياب
	const [absenceCell, setAbsenceCell] = useState<{
		staffId: string;
		staffName: string;
		staffCode: string;
		date: Date;
	} | null>(null);

	// لوحة مراجعة طلب الإجازة (بعد الإنشاء)
	const [reviewRequestId, setReviewRequestId] = useState<string | null>(null);

	// لوحة تنبيهات طلبات الإجازات (تنفتح من اليسار)
	const [alertsOpen, setAlertsOpen] = useState(false);

	// حوار رمز PIN للدخول لوضع الكشك + الشاشة الكاملة بعد النجاح
	const [kioskOpen, setKioskOpen] = useState(false);
	const [kioskActive, setKioskActive] = useState(false);

	// لوحة اختيار الموظفين/الطلاب للتسجيل الجماعي (تنفتح من اليسار)
	const [pickerOpen, setPickerOpen] = useState(false);
	// نيّة اللوحة: تسجيل حضور/انصراف، تسجيل إجازة، تسجيل غياب، أو تسجيل تأخر
	const [pickerIntent, setPickerIntent] = useState<
		"register" | "leave" | "absence" | "late"
	>("register");

	// نافذة التسجيل الجماعي (الخطوة الثانية بعد اختيار الموظفين)
	const [bulkStaff, setBulkStaff] = useState<BulkPickedStaff[] | null>(null);
	const [bulkMode, setBulkMode] = useState<BulkRegisterMode>("checkin");

	// نافذة الإجازة الجماعية + لوحة مراجعة الطلبات بعد الإنشاء
	const [bulkLeaveStaff, setBulkLeaveStaff] = useState<BulkPickedStaff[] | null>(null);
	const [bulkLeaveReviews, setBulkLeaveReviews] = useState<BulkLeaveReview[] | null>(null);

	// نافذة الغياب الجماعي
	const [bulkAbsenceStaff, setBulkAbsenceStaff] = useState<BulkPickedStaff[] | null>(null);
	const { requests: leaveRequests } = useLeaveRequests();
	const pendingLeaveCount = leaveRequests.filter((r) => r.status === "PENDING").length;

	// خريطة سريعة: "staffId_yyyy-MM-dd" → سجل الحضور
	const recordByCell = useMemo(() => {
		const map = new Map<string, (typeof records)[number]>();
		for (const r of records) {
			if (!r) continue;
			const id = r.staffId || (r as any).studentId;
			const dStr = dayKey(r.date);
			if (id && dStr) {
				map.set(`${id}_${dStr}`, r);
			}
		}
		return map;
	}, [records]);

	// إجمالي ساعات كل يوم: "yyyy-MM-dd" → مجموع الساعات
	const dailyTotals = useMemo(() => {
		const map = new Map<string, number>();
		for (const r of records) {
			if (!r) continue;
			const key = dayKey(r.date);
			if (key) {
				map.set(key, (map.get(key) ?? 0) + (r.hours || 0));
			}
		}
		return map;
	}, [records]);

	const rows = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (isStudents) {
			const sourcePatients = studentId ? patients.filter((p) => p.id === studentId) : patients;
			const list = sourcePatients.map((p) => ({
				id: p.id,
				name: p.name,
				code: p.code,
				role: "طالب",
			}));
			if (!q) return list;
			return list.filter(
				(s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
			);
		}
		const list = applyStaffFilters(staff);
		if (!q) return list;
		return list.filter(
			(s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
		);
	}, [isStudents, studentId, patients, staff, search, applyStaffFilters]);

	// ترقيم الصفحات
	const [pageSize, setPageSize] = useState(15);
	const [pageIndex, setPageIndex] = useState(0);
	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const safePage = Math.min(pageIndex, pageCount - 1);
	const pagedRows = rows.slice(safePage * pageSize, safePage * pageSize + pageSize);
	const fromRow = rows.length === 0 ? 0 : safePage * pageSize + 1;
	const toRow = Math.min((safePage + 1) * pageSize, rows.length);

	return (
		<div
			className="flex min-h-0 flex-1 flex-col"
			dir="rtl"
		>
			<AttendanceRegisterDialog
				open={!!registerCell}
				staffId={registerCell?.staffId ?? null}
				staffName={registerCell?.staffName ?? null}
				staffCode={registerCell?.staffCode ?? null}
				date={registerCell?.date ?? null}
				shift={registerCell?.shift}
				defaultCheckInTime={registerCell?.defaultCheckIn}
				defaultShowCheckOut={registerCell?.withCheckout}
				onClose={() => setRegisterCell(null)}
				onSave={isStudents ? upsertStudentAsync : undefined}
				targetLabel={isStudents ? "الطالب" : "الموظف"}
			/>

			{shiftPanelPreset && (
				<ShiftDetailsPanel
					open={!!shiftPanelPreset}
					staffId={shiftPanelPreset.staffId}
					date={shiftPanelPreset.date}
					isStudent={isStudents}
					customStaff={
						isStudents
							? (studentId ? patients.filter((p) => p.id === studentId) : patients).map((p) => ({
									id: p.id,
									name: p.name,
									code: p.code,
									role: "طالب",
								}))
							: undefined
					}
					onClose={() => setShiftPanelPreset(null)}
				/>
			)}

			<AttendanceLeaveDialog
				open={!!leaveCell}
				staffId={leaveCell?.staffId ?? null}
				staffName={leaveCell?.staffName ?? null}
				staffCode={leaveCell?.staffCode ?? null}
				date={leaveCell?.date ?? null}
				onClose={() => setLeaveCell(null)}
				onSubmitted={(id) => setReviewRequestId(id)}
				onSave={isStudents ? upsertStudentAsync : undefined}
				targetLabel={isStudents ? "الطالب" : "الموظف"}
			/>

			<AttendanceAbsenceDialog
				open={!!absenceCell}
				staffId={absenceCell?.staffId ?? null}
				staffName={absenceCell?.staffName ?? null}
				staffCode={absenceCell?.staffCode ?? null}
				date={absenceCell?.date ?? null}
				onClose={() => setAbsenceCell(null)}
				onSave={isStudents ? upsertStudentAsync : undefined}
				targetLabel={isStudents ? "الطالب" : "الموظف"}
			/>

			<LeaveReviewDialog
				requestId={reviewRequestId}
				onClose={() => setReviewRequestId(null)}
			/>

			<LeaveAlertsPanel
				open={alertsOpen}
				onClose={() => setAlertsOpen(false)}
			/>

			<KioskPinDialog
				open={kioskOpen}
				onClose={() => setKioskOpen(false)}
				onUnlocked={() => setKioskActive(true)}
			/>

			<KioskScreen
				open={kioskActive}
				targetType={targetType}
				onExit={() => setKioskActive(false)}
			/>

			<AttendanceStaffPickerPanel
				open={pickerOpen}
				title={
					isStudents
						? pickerIntent === "leave"
							? "تسجيل إجازة طالب"
							: pickerIntent === "absence"
								? "تسجيل غياب طالب"
								: pickerIntent === "late"
									? "تسجيل تأخر طالب"
									: "تسجيل حضور وانصراف الطلاب"
						: pickerIntent === "leave"
							? "تسجيل أجازة"
							: pickerIntent === "absence"
								? "تسجيل غياب"
								: pickerIntent === "late"
									? "تسجيل تأخر"
									: "تسجيل حضور وانصراف"
				}
				customItems={
					isStudents
						? (studentId ? patients.filter((p) => p.id === studentId) : patients).map((p) => ({
								id: p.id,
								name: p.name,
								code: p.code,
								role: "طالب",
							}))
						: undefined
				}
				customRecords={isStudents ? todayStudentRecords : undefined}
				targetLabel={isStudents ? "الطلاب" : "الموظفين"}
				onClose={() => setPickerOpen(false)}
				onNext={(selected) => {
					setPickerOpen(false);
					if (pickerIntent === "leave") {
						// تسجيل إجازة جماعي
						setBulkLeaveStaff(selected.map((s) => ({ id: s.id, name: s.name })));
						return;
					}
					if (pickerIntent === "absence") {
						// تسجيل غياب جماعي
						setBulkAbsenceStaff(selected.map((s) => ({ id: s.id, name: s.name })));
						return;
					}
					if (pickerIntent === "late") {
						// تسجيل تأخر جماعي لليوم
						const todayStr = format(new Date(), "yyyy-MM-dd");
						const label = isStudents ? "طلاب" : "موظفين";
						Promise.all(
							selected.map((s) =>
								upsertAsync({
									staffId: s.id,
									date: todayStr,
									status: "LATE",
									hours: 0,
								}),
							),
						)
							.then(() => {
								toast.success(`تم تسجيل تأخر (${selected.length}) ${label} بنجاح`);
							})
							.catch((err) => {
								toast.error(err?.message || "فشل تسجيل التأخر");
							});
						return;
					}
					// إن كان كل المختارين حاضرين اليوم → وضع تسجيل الانصراف
					const allPresent =
						selected.length > 0 && selected.every((s) => s.status === "PRESENT");
					setBulkMode(allPresent ? "checkout" : "checkin");
					setBulkStaff(selected.map((s) => ({ id: s.id, name: s.name, checkIn: s.checkIn })));
				}}
			/>

			<AttendanceBulkRegisterDialog
				staff={bulkStaff}
				mode={bulkMode}
				onClose={() => setBulkStaff(null)}
				onSave={isStudents ? upsertStudentAsync : undefined}
				targetLabel={isStudents ? "الطلاب" : "الموظفين"}
			/>

			<AttendanceBulkLeaveDialog
				staff={bulkLeaveStaff}
				onClose={() => setBulkLeaveStaff(null)}
				onSubmitted={(reviews) => setBulkLeaveReviews(reviews)}
				onSave={isStudents ? upsertStudentAsync : undefined}
				targetLabel={isStudents ? "الطلاب" : "الموظفين"}
			/>

			<AttendanceBulkLeaveReviewDialog
				requests={bulkLeaveReviews}
				onClose={() => setBulkLeaveReviews(null)}
			/>

			<AttendanceBulkAbsenceDialog
				staff={bulkAbsenceStaff}
				onClose={() => setBulkAbsenceStaff(null)}
				onSave={isStudents ? upsertStudentAsync : undefined}
				targetLabel={isStudents ? "الطلاب" : "الموظفين"}
			/>

			{/* شريط الأدوات */}
			{!hideToolbar && (
				<TableToolbar
					className="border-t"
					searchPlaceholder={
						isStudents
							? "ابحث عن الطالب بالاسم، المعرف..."
							: "ابحث عن المدرّب بالاسم،المعرف..."
					}
					searchValue={search}
					onSearchChange={setSearch}
					// نفس ترتيب صفحة الموظفين: [التصفية] [تصدير] بمقاس xs موحّد
					buttonSize="xs"
					showFilter={false}
					showView={false}
					showExport={false}
					leftExtra={
						<>
							<FiltersMenu groups={filterGroups} />
							{/* ترتيب DOM في RTL: بعد التصفية فيظهر على يسارها */}
							<Button
								type="button"
								variant="outline"
								size="xs"
								onClick={() =>
									exportAttendanceWeekCsv({
										rows,
										days,
										recordByCell,
										isStudents,
									})
								}
								disabled={rows.length === 0}
								className="gap-1.5 px-2"
							>
								<IconDownload className="size-3.5" />
								تصدير
							</Button>
							<span className="h-6 w-px bg-[#E5E5E5]" />
							{/* الفلتر الموحّد للنطاق الزمني (أسبوع / شهر + التقويم) */}
							<ScheduleDateRangeFilter
								value={dateRange}
								onChange={setDateRange}
							/>
						</>
					}
					actions={
						<>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setAlertsOpen(true)}
								className="h-8 gap-1.5 text-[13px]"
							>
								{pendingLeaveCount > 0 && (
									<span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] bg-destructive px-1 text-[10px] font-medium text-white">
										{pendingLeaveCount}
									</span>
								)}
								تنبيهات الأجازات
								<IconBell className="size-3.5 text-destructive" />
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => {
									if (!kioskReady) {
										showFeatureLockedToast({
											title: "وضع الكشك غير مفعّل",
											description:
												"فعّل «تفعيل وضع الكشك» وعيّن رمز PIN من الإعدادات لاستخدام وضع الكشك.",
										});
										return;
									}
									setKioskOpen(true);
								}}
								className="h-8 gap-1.5 text-[11px]"
							>
								<IconDeviceDesktop className="size-3.5" />
								وضع الكشك
							</Button>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										size="sm"
										className="h-[30px] gap-1.5 text-xs"
									>
										<IconPlus className="size-2.5" />
										تسجيل
										<IconChevronDown className="size-3" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="min-w-[150px] p-[3px]"
								>
									{CELL_ACTIONS.map((action, i) => {
										const ActionIcon = action.icon;
										return (
											<DropdownMenuItem
												key={action.status}
												onSelect={
													action.status === "PRESENT"
														? () => {
																setPickerIntent("register");
																setPickerOpen(true);
															}
														: action.status === "LEAVE"
															? () => {
																	setPickerIntent("leave");
																	setPickerOpen(true);
																}
															: action.status === "ABSENT"
																? () => {
																		setPickerIntent("absence");
																		setPickerOpen(true);
																	}
																: action.status === "LATE"
																	? () => {
																			setPickerIntent("late");
																			setPickerOpen(true);
																		}
																	: undefined
												}
												className={cn(
													"flex h-6 items-center justify-start gap-1.5 rounded-[4px] px-[9px] text-right text-[10px] font-medium text-[#08090A]",
													i === 0 && "bg-[#9B9B9D]/[0.11]",
												)}
											>
												<ActionIcon
													className="size-2.5"
													style={{ color: action.color }}
												/>
												{action.label}
											</DropdownMenuItem>
										);
									})}
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					}
				/>
			)}
		

			{/* شبكة الحضور الأسبوعية */}
			<div className="min-h-0 flex-1 overflow-auto bg-white">
				<table className="w-full border-collapse">
					<thead className="sticky top-0 z-10 bg-white">
						<tr>
							{!shouldHideName && (
								<th className="sticky right-0 z-20 h-[34px] min-w-[180px] border-t border-l border-[#F5F5F6] bg-white px-3">
									<div className="flex items-center justify-between gap-1">
										<span className="text-[12px] font-normal text-[#6B6B67]">
											{isStudents ? "اسم الطالب" : "اسم الموظف"}
										</span>
										<IconSortDescending className="size-[15px] text-[#6B6B67]" />
									</div>
								</th>
							)}
							{days.map((day) => {
								const today = isToday(day);
								return (
									<th
										key={day.toISOString()}
										className="h-[34px] min-w-[140px] border-t border-l border-[#F5F5F6] px-3 font-normal"
									>
										<div className="flex items-center justify-between">
											{/* اليوم + التاريخ — يمين */}
											<span className="flex items-center gap-1 text-[10px] text-[#22202A]">
												{format(day, "EEEE", { locale: arSA })}
												{today ? (
													<span className="flex h-4 min-w-5 items-center justify-center rounded-[4px] bg-[#3B82F6] px-1 text-[10px] primarytabular-nums">
														{format(day, "d", { locale: arSA })}
													</span>
												) : (
													<span className="tabular-nums">
														{format(day, "d", { locale: arSA })}
													</span>
												)}
											</span>
											{/* عدد الطلاب أو الموظفين — يسار */}
											<span
												className="flex items-center gap-1 text-[12px] text-[#6B6B67]"
												title={isStudents ? "عدد الطلاب" : "عدد الموظفين"}
											>
												<IconUser className="size-3" />
												<span className="tabular-nums">{rows.length}</span>
											</span>
										</div>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{pagedRows.map((s) => (
							<tr key={s.id}>
								{!shouldHideName && (
									<td className="sticky right-0 z-10 h-[34px] border-t border-l border-[#F5F5F6] bg-white px-3">
										<div className="flex items-center gap-1.5">
											<StaffAvatar name={s.name} isStudent={isStudents} />
											<span
												dir="rtl"
												className="truncate text-right text-[12px] text-[#08090A]"
											>
												{s.name}
											</span>
										</div>
									</td>
								)}
								{days.map((day) => {
									const dateKey = format(day, "yyyy-MM-dd");
									const record = recordByCell.get(`${s.id}_${dateKey}`);
									const shift = shiftByCell.get(`${s.id}_${dateKey}`);
									const color = record ? STATUS_COLOR[record.status.toLowerCase()] : undefined;
									// اختيار إجراء من قائمة الخلية: حاضر→نافذة، إجازة→نافذة، الباقي→تسجيل مباشر
									const handlePick = (action: (typeof CELL_ACTIONS)[number]) => {
										if (action.status === "PRESENT") {
											setRegisterCell({
												staffId: s.id,
												staffName: s.name,
												staffCode: s.code,
												date: day,
												shift,
												...(record?.checkIn
													? { defaultCheckIn: fmtTime24(record.checkIn), withCheckout: true }
													: {}),
											});
											return;
										}
										if (action.status === "LEAVE") {
											setLeaveCell({
												staffId: s.id,
												staffName: s.name,
												staffCode: s.code,
												date: day,
											});
											return;
										}
										if (action.status === "ABSENT") {
											setAbsenceCell({
												staffId: s.id,
												staffName: s.name,
												staffCode: s.code,
												date: day,
											});
											return;
										}
										upsert({
											staffId: s.id,
											date: dateKey,
											status: action.status,
											hours: shift?.hours ?? action.hours,
										});
									};
									return (
										<td
											key={day.toISOString()}
											className="h-[34px] border-t border-l border-[#F5F5F6] p-0 text-center align-middle"
										>
											{record && record.status === "PRESENT" && record.checkIn ? (
												// حاضر (يمين) | فاصل | انصراف أو زر إضافة (يسار) + شارة المناوبة
												<div className="mx-auto flex w-fit items-center gap-2">
													{/* حاضر */}
													<div className="flex items-center gap-1">
														<div className="flex flex-col items-end leading-[12px]">
															<div className="flex items-center gap-1">
																<span className="text-[8px] text-[#0CA644]">حاضر</span>
																{shift && (
																	<span className="rounded bg-[#6366F1]/10 px-0.5 text-[7px] font-medium text-[#6366F1]">
																		{SHIFT_TYPE_MAP[shift.type]?.shortLabel ?? "نوبة"}
																	</span>
																)}
															</div>
															<span className="text-[8px] text-[#0CA644] tabular-nums">
																{fmtTime(record.checkIn)}
															</span>
														</div>
														<IconCalendarCheck className="size-2.5 text-[#16A34A]" />
													</div>

													<span className="h-3 w-px bg-[#F5F5F6]" />

													{record.checkOut ? (
														// انصراف
														<div className="flex items-center gap-1">
															<div className="flex flex-col items-end leading-[12px]">
																<span className="text-[8px] text-[#FF6467]">انصراف</span>
																<span className="text-[8px] text-[#FF6467] tabular-nums">
																	{fmtTime(record.checkOut)}
																</span>
															</div>
															<IconCalendarMinus className="size-2.5 text-[#FF6467]" />
														</div>
													) : (
														// زر إضافة انصراف (قائمة)
														<CellActionsMenu
															onPick={handlePick}
															onScheduleShift={() =>
																setShiftPanelPreset({ staffId: s.id, date: day })
															}
														>
															<button
																type="button"
																className="flex size-3.5 items-center justify-center text-[#3B82F6]"
																aria-label="تسجيل انصراف"
															>
																<IconPlus className="size-3" />
															</button>
														</CellActionsMenu>
													)}
												</div>
											) : (
												<CellActionsMenu
													onPick={handlePick}
													onScheduleShift={() =>
														setShiftPanelPreset({ staffId: s.id, date: day })
													}
												>
													{record ? (
														(() => {
															const cell = STATUS_CELL[record.status] ?? {
																label: "",
																Icon: IconCalendarEvent,
															};
															const CellIcon = cell.Icon;
															return (
																<button
																	type="button"
																	className="mx-auto flex h-4 items-center justify-center gap-1 rounded-[4px] px-1 text-[10px]"
																	style={{ backgroundColor: `${color}0d`, color }}
																	aria-label="تعديل الحضور"
																>
																	{cell.label}
																	<CellIcon className="size-2" />
																</button>
															);
														})()
													) : shift ? (
														// مناوبة مجدولة لم يُسجل لها حضور بعد
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																setRegisterCell({
																	staffId: s.id,
																	staffName: s.name,
																	staffCode: s.code,
																	date: day,
																	shift,
																});
															}}
															className="mx-auto flex h-[22px] items-center justify-center gap-1 rounded-[4px] px-1.5 text-[9px] font-medium transition-all hover:scale-105"
															style={{
																backgroundColor: `${SHIFT_TYPE_MAP[shift.type]?.color ?? "#6366F1"}15`,
																color: SHIFT_TYPE_MAP[shift.type]?.color ?? "#6366F1",
																border: `0.75px dashed ${SHIFT_TYPE_MAP[shift.type]?.color ?? "#6366F1"}60`,
															}}
															title={`مناوبة مجدولة (${shift.hours || 8}س): اضغط لتسجيل الحضور`}
														>
															<IconClock className="size-2.5 shrink-0" />
															<span>{SHIFT_TYPE_MAP[shift.type]?.shortLabel ?? "مناوبة"}</span>
															<span className="opacity-80 tabular-nums">({shift.hours || 8}س)</span>
														</button>
													) : (
														// عطلة / لا توجد مناوبة عمل — نمط خطوط مائلة مطابق للتصميم
														<button
															type="button"
															className="flex h-[34px] w-full items-center justify-center transition-colors hover:bg-black/[0.03]"
															style={{
																backgroundImage:
																	"repeating-linear-gradient(-25deg, transparent, transparent 5px, rgba(161, 161, 170, 0.35) 5px, rgba(161, 161, 170, 0.35) 6px)",
															}}
															title="عطلة / لا توجد مناوبة — انقر للجدولة أو التسجيل"
															aria-label="عطلة / لا توجد مناوبة"
														/>
													)}
												</CellActionsMenu>
											)}
										</td>
									);
								})}
							</tr>
						))}
						{!isLoading && rows.length === 0 && (
							<tr>
								<td
									colSpan={days.length + (shouldHideName ? 0 : 1)}
									className="py-12 text-center text-sm text-muted-foreground"
								>
									{isStudents ? "لا يوجد طلاب لعرض حضورهم" : "لا يوجد موظفين لعرض حضورهم"}
								</td>
							</tr>
						)}
					</tbody>
					<tfoot>
						<tr>
							{!shouldHideName && (
								<td className="sticky right-0 z-10 h-[34px] border-t border-l border-[#F5F5F6] bg-white px-3 text-right text-[12px] text-[#6B6B67]">
									الاجمالي
								</td>
							)}
							{days.map((day) => {
								const total = dailyTotals.get(format(day, "yyyy-MM-dd")) ?? 0;
								return (
									<td
										key={day.toISOString()}
										className="h-[34px] border-t border-l border-[#F5F5F6] text-center text-[12px] text-[#08090A] tabular-nums"
									>
										{total} ساعة
									</td>
								);
							})}
						</tr>
					</tfoot>
				</table>
			</div>

			{/* دليل الألوان — شارات ملوّنة + عنوان (على اليمين) */}
			<div className="flex flex-wrap items-center justify-start gap-3 border-t px-4 py-2.5">
				<span className="text-[9px] font-semibold text-[#9B9B9D]">دليل الألوان:</span>
				{ATTENDANCE_LEGEND.map((item) => {
					const LegendIcon = LEGEND_ICONS[item.key];
					return (
						<span
							key={item.key}
							className="flex items-center gap-[4.5px]"
						>
							<span
								className="flex size-[15px] items-center justify-center rounded-[4px]"
								style={{ backgroundColor: `${item.color}14` }}
							>
								<LegendIcon
									className="size-2"
									style={{ color: item.color }}
								/>
							</span>
							<span className="text-[9px] text-[#9B9B9D]">{item.label}</span>
						</span>
					);
				})}
			</div>

			{!hidePagination && (!studentId || rows.length > pageSize) && (
				<TablePagination
					page={safePage}
					pageCount={pageCount}
					pageSize={pageSize}
					totalRows={rows.length}
					fromRow={fromRow}
					toRow={toRow}
					onPageChange={setPageIndex}
					onPageSizeChange={setPageSize}
				/>
			)}
		</div>
	);
}
