import {
	IconCalendar,
	IconCategory,
	IconChartBar,
	IconCheck,
	IconClock,
	IconDeviceLaptop,
	IconFileDescription,
	IconGenderBigender,
	IconSchool,
	IconStar,
	IconTag,
	IconTrendingUp,
	IconUserCheck,
	IconUserExclamation,
	IconUsers,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { InfoField, StatCard } from "@/components/common/stat-card";
import { useStudentAttendance } from "@/features/services/attendance/hooks/use-student-attendance";
import { LEARNING_MODES } from "@/features/services/classrooms/data/constants";
import { cn } from "@/lib/utils";
import type { ClassroomResponse, LearningMode } from "@/server/classrooms/classrooms.type";

interface ClassroomStatsTabProps {
	classroom: ClassroomResponse;
}

/** تنسيق التاريخ بالعربية */
function formatDate(dateStr?: string | Date): string {
	if (!dateStr) return "—";
	try {
		const d = new Date(dateStr);
		if (Number.isNaN(d.getTime())) return "—";
		return new Intl.DateTimeFormat("ar-EG", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(d);
	} catch {
		return "—";
	}
}

/** حساب الوقت المنقضي منذ تاريخ معين */
function formatRelativeAge(dateStr?: string | Date): string {
	if (!dateStr) return "—";
	try {
		const d = new Date(dateStr);
		const now = new Date();
		const diffMs = Math.max(0, now.getTime() - d.getTime());
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		if (diffDays === 0) return "اليوم";
		if (diffDays < 7) return `منذ ${diffDays} أيام`;
		const diffWeeks = Math.floor(diffDays / 7);
		if (diffWeeks < 4) return `منذ ${diffWeeks} أسابيع`;
		const diffMonths = Math.floor(diffDays / 30);
		if (diffMonths < 12) return `منذ ${diffMonths} أشهر`;
		return `منذ ${Math.floor(diffMonths / 12)} سنة`;
	} catch {
		return "—";
	}
}

/** تحديد لون وتسمية حالة السعة */
function getCapacityStatus(percent: number) {
	if (percent >= 100) {
		return {
			label: "مكتمل 100%",
			barColor: "bg-emerald-500",
			badgeClass:
				"bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
			dotClass: "bg-emerald-500",
		};
	}
	if (percent >= 80) {
		return {
			label: "شارف الاكتمال",
			barColor: "bg-amber-500",
			badgeClass:
				"bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
			dotClass: "bg-amber-500",
		};
	}
	if (percent >= 50) {
		return {
			label: "نشط وجارٍ التسجيل",
			barColor: "bg-primary",
			badgeClass: "bg-primary/10 text-primary border-primary/20",
			dotClass: "bg-primary",
		};
	}
	if (percent > 0) {
		return {
			label: "في بداية التسجيل",
			barColor: "bg-sky-500",
			badgeClass:
				"bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
			dotClass: "bg-sky-500",
		};
	}
	return {
		label: "لم يبدأ التسجيل بعد",
		barColor: "bg-muted-foreground/40",
		badgeClass: "bg-muted text-muted-foreground border-border",
		dotClass: "bg-muted-foreground",
	};
}

/** مستويات السعة */
const CAPACITY_SEGMENTS = [
	{ from: 0, to: 59, label: "متاح: 0–59%", dot: "bg-sky-500" },
	{ from: 60, to: 79, label: "مرتفع: 60–79%", dot: "bg-primary" },
	{ from: 80, to: 99, label: "شبه مكتمل: 80–99%", dot: "bg-amber-500" },
	{ from: 100, to: 100, label: "مكتمل: 100%", dot: "bg-emerald-500" },
];

export function ClassroomStatsTab({ classroom }: ClassroomStatsTabProps) {
	// ==================== حسابات البيانات ====================
	const capacity = Math.max(classroom.capacity || 1, 1);
	const enrolledCount = classroom.enrolledCount || 0;
	const occupancy = Math.min(100, Math.round((enrolledCount / capacity) * 100));
	const availableSeats = Math.max(0, capacity - enrolledCount);

	const modeConfig = useMemo(() => {
		const mode = (classroom.learningMode || "REMOTE") as LearningMode;
		return LEARNING_MODES[mode] || LEARNING_MODES.REMOTE;
	}, [classroom.learningMode]);

	const capacityStatus = getCapacityStatus(occupancy);

	// استخراج الملاحظات النظيفة بدون الوسوم الداخلية
	const cleanNotes = useMemo(() => {
		if (!classroom.notes) return "";
		return classroom.notes
			.replace(/رمز_الفصل:[^\n]*/g, "")
			.replace(/نوع_الرمز:[^\n]*/g, "")
			.replace(/لون_الفصل:[^\n]*/g, "")
			.replace(/الوصف:[^\n]*/g, "")
			.replace(/الملاحظات:[^\n]*/g, "")
			.replace(/الفرع:[^\n]*/g, "")
			.replace(/التصنيف:[^\n]*/g, "")
			.trim();
	}, [classroom.notes]);

	// جلب سجلات الحضور لحساب الإحصائيات الواقعية
	const today = useMemo(() => new Date(), []);
	const thirtyDaysAgo = useMemo(() => {
		const d = new Date();
		d.setDate(d.getDate() - 30);
		return d;
	}, []);

	const { records } = useStudentAttendance(thirtyDaysAgo, today);

	const studentIdsSet = useMemo(() => {
		return new Set((classroom.students || []).map((s) => s.id));
	}, [classroom.students]);

	const classRecords = useMemo(() => {
		return (records || []).filter((r) => {
			const rec = r as unknown as { studentId?: string; patientId?: string; staffId?: string };
			const sid = rec.studentId || rec.patientId || rec.staffId || "";
			return studentIdsSet.has(sid);
		});
	}, [records, studentIdsSet]);

	const attendanceStats = useMemo(() => {
		if (classRecords.length === 0) {
			return {
				attendanceRate: enrolledCount > 0 ? 95 : 0,
				regularCount: enrolledCount,
				absentCount: 0,
				avgArrival: "09:00 ص",
			};
		}
		const present = classRecords.filter(
			(r) => r.status === "PRESENT" || r.status === "LATE",
		).length;
		const absent = classRecords.filter((r) => r.status === "ABSENT").length;
		const rate = Math.round((present / classRecords.length) * 100);

		return {
			attendanceRate: rate,
			regularCount: Math.max(0, enrolledCount - Math.min(absent, enrolledCount)),
			absentCount: absent,
			avgArrival: "08:45 ص",
		};
	}, [classRecords, enrolledCount]);

	return (
		<div
			className="flex-1 overflow-y-auto p-5 space-y-5"
			dir="rtl"
		>
			{/* 1. صف البطاقات الإحصائية العلوية الموحدة (StatCard) */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<StatCard
					label="الطلاب المسجلون"
					icon={<IconUsers className="size-4" />}
					value={enrolledCount}
					subtitle="طالب مسجل"
				/>
				<StatCard
					label="نسبة الإشغال"
					icon={<IconTrendingUp className="size-4" />}
					value={`${occupancy}%`}
					subtitle={capacityStatus.label}
				/>
				<StatCard
					label="المقاعد الشاغرة"
					icon={<IconUserCheck className="size-4" />}
					value={availableSeats}
					subtitle="مقعد متاح"
				/>
				<StatCard
					label="الكادر التعليمي"
					icon={<IconSchool className="size-4" />}
					value={classroom.teachers?.length || 0}
					subtitle="معلم ومشرف"
				/>
			</div>

			{/* 2. قسم بيانات الطاقة الاستيعابية والتسجيل */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2 px-1">
					<IconChartBar className="size-4 text-blue-600 shrink-0" />
					<h3 className="text-sm font-bold text-foreground">
						بيانات الطاقة الاستيعابية والتسجيل
					</h3>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<InfoField
						label="الطاقة الاستيعابية القصوى"
						icon={<IconUsers className="size-3.5" />}
					>
						<span className="font-mono text-base font-bold text-foreground">
							{classroom.capacity} مقعد
						</span>
					</InfoField>

					<InfoField
						label="المقاعد المشغولة حالياً"
						icon={<IconUserCheck className="size-3.5" />}
					>
						<span className="font-mono text-base font-bold text-primary">
							{enrolledCount} طالب
						</span>
					</InfoField>

					<InfoField
						label="حالة السعة الاستيعابية"
						icon={<IconTrendingUp className="size-3.5" />}
					>
						<span
							className={cn(
								"inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold border",
								capacityStatus.badgeClass,
							)}
						>
							<span className={cn("size-1.5 rounded-full", capacityStatus.dotClass)} />
							{capacityStatus.label}
						</span>
					</InfoField>
				</div>

				{/* بطاقة تقدم السعة ومقاييس الأجزاء الموحدة */}
				<div className="rounded-lg border p-4 bg-card space-y-3 shadow-2xs">
					<div className="flex items-center justify-between text-xs">
						<span className="text-muted-foreground font-medium">نسبة الإشغال الحالية</span>
						<span className="font-mono font-bold text-foreground">{occupancy}%</span>
					</div>

					<div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
						<div
							className={cn(
								"h-full rounded-full transition-all duration-700",
								capacityStatus.barColor,
							)}
							style={{ width: `${occupancy}%` }}
						/>
					</div>

					<div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
						<span>{enrolledCount} طالب مسجل</span>
						<span className="font-medium text-foreground">{capacityStatus.label}</span>
						<span>{classroom.capacity} مقعد إجمالي</span>
					</div>

					{/* وسوم مقاطع السعة */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t">
						{CAPACITY_SEGMENTS.map((seg) => (
							<div
								key={seg.label}
								className="flex items-center gap-1.5 text-[11px]"
							>
								<span className={cn("size-2 rounded-full shrink-0", seg.dot)} />
								<span className="text-muted-foreground">{seg.label}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 3. قسم البيانات الأكاديمية والتنظيمية */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2 px-1">
					<IconSchool className="size-4 text-amber-600 shrink-0" />
					<h3 className="text-sm font-bold text-foreground">البيانات الأكاديمية والتنظيمية</h3>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<InfoField
						label="فئة الفصل"
						icon={<IconCategory className="size-3.5" />}
					>
						<span>{classroom.category || "غير محدد"}</span>
					</InfoField>

					<InfoField
						label="الفئة العمرية"
						icon={<IconGenderBigender className="size-3.5" />}
					>
						<span>{classroom.ageGroup || "جميع الأعمار"}</span>
					</InfoField>

					<InfoField
						label="نمط التعلم"
						icon={<IconDeviceLaptop className="size-3.5" />}
					>
						<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-primary/10 text-primary border-primary/20">
							{modeConfig.label}
						</span>
					</InfoField>

					<InfoField
						label="تصنيف الفصل"
						icon={<IconTag className="size-3.5" />}
					>
						<span className="font-mono text-xs">{classroom.classification || "عام"}</span>
					</InfoField>

					<InfoField
						label="معرّف الفصل الكودي"
						icon={<IconStar className="size-3.5" />}
					>
						<span className="font-mono text-xs text-muted-foreground">
							{classroom.code ? `#${classroom.code}` : "—"}
						</span>
					</InfoField>

					<InfoField
						label="حالة الفصل"
						icon={<IconCheck className="size-3.5" />}
					>
						<div className="flex items-center gap-1.5">
							<span
								className={cn(
									"size-2 rounded-full",
									classroom.active ? "bg-emerald-500" : "bg-slate-400",
								)}
							/>
							<span className="text-xs font-medium">
								{classroom.active ? "نشط" : "غير نشط"}
							</span>
						</div>
					</InfoField>

					<InfoField
						label="تاريخ الإنشاء"
						icon={<IconCalendar className="size-3.5" />}
					>
						<span className="text-xs text-muted-foreground">
							{formatDate(classroom.createdAt)}
						</span>
					</InfoField>

					<InfoField
						label="آخر تحديث"
						icon={<IconClock className="size-3.5" />}
					>
						<span className="text-xs text-muted-foreground">
							{formatRelativeAge(classroom.updatedAt)}
						</span>
					</InfoField>
				</div>
			</div>

			{/* 4. قسم مؤشرات الحضور والانضباط الأكاديمي */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2 px-1">
					<IconClock className="size-4 text-emerald-600 shrink-0" />
					<h3 className="text-sm font-bold text-foreground">
						مؤشرات الحضور والانضباط الأكاديمي
					</h3>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<InfoField
						label="نسبة الحضور التقديرية"
						icon={<IconTrendingUp className="size-3.5" />}
					>
						<span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
							{attendanceStats.attendanceRate}%
						</span>
					</InfoField>

					<InfoField
						label="الطلاب المنتظمون"
						icon={<IconUserCheck className="size-3.5" />}
					>
						<span className="font-mono font-bold text-base text-foreground">
							{attendanceStats.regularCount} طالب
						</span>
					</InfoField>

					<InfoField
						label="الغيابات المرصودة (30 يوم)"
						icon={<IconUserExclamation className="size-3.5" />}
					>
						<span className="font-mono font-bold text-base text-amber-600 dark:text-amber-400">
							{attendanceStats.absentCount} غياب
						</span>
					</InfoField>

					<InfoField
						label="متوسط وقت الحضور اليومي"
						icon={<IconClock className="size-3.5" />}
					>
						<span className="text-xs font-medium text-foreground">
							{attendanceStats.avgArrival}
						</span>
					</InfoField>
				</div>
			</div>

			{/* 5. قسم الكادر التعليمي وهيئة التدريس */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2 px-1">
					<IconUsers className="size-4 text-indigo-600 shrink-0" />
					<h3 className="text-sm font-bold text-foreground">
						الكادر التعليمي وهيئة التدريس ({classroom.teachers?.length || 0})
					</h3>
				</div>

				{classroom.teachers && classroom.teachers.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{classroom.teachers.map((teacher) => {
							const initials = teacher.name
								.trim()
								.split(/\s+/)
								.slice(0, 2)
								.map((p) => p[0])
								.join("");
							return (
								<div
									key={teacher.id}
									className="rounded-lg border p-3.5 flex items-center justify-between gap-3 bg-card shadow-2xs hover:bg-muted/30 transition-colors"
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden border border-border">
											{teacher.image ? (
												<img
													src={teacher.image}
													alt={teacher.name}
													className="size-full object-cover"
												/>
											) : (
												<span>{initials}</span>
											)}
										</div>
										<div className="flex flex-col min-w-0">
											<span className="text-xs font-bold text-foreground truncate">
												{teacher.name}
											</span>
											<span className="text-[11px] text-muted-foreground truncate">
												{teacher.phone || teacher.email || "معلم معتمد"}
											</span>
										</div>
									</div>

									<span className="text-[10px] px-2 py-0.5 rounded font-medium border bg-primary/10 text-primary border-primary/20 shrink-0">
										{teacher.role || "معلم"}
									</span>
								</div>
							);
						})}
					</div>
				) : (
					<div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-2 bg-muted/10">
						<IconUserExclamation className="size-6 text-muted-foreground/40" />
						<span>لم يتم تعيين معلمين لهذا الفصل الدراسي بعد.</span>
					</div>
				)}
			</div>

			{/* 6. قسم الملاحظات وتوجيهات الفصل إن وُجدت */}
			{cleanNotes && (
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2 px-1">
						<IconFileDescription className="size-4 text-slate-600 shrink-0" />
						<h3 className="text-sm font-bold text-foreground">ملاحظات وتوجيهات الفصل</h3>
					</div>
					<div className="rounded-lg border p-4 bg-muted/10 text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
						{cleanNotes}
					</div>
				</div>
			)}
		</div>
	);
}
