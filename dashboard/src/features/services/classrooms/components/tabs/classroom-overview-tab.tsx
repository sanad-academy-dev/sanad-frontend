import {
	IconBook,
	IconCalendar,
	IconCalendarStats,
	IconChartBar,
	IconCheck,
	IconEdit,
	IconFileDescription,
	IconGenderBigender,
	IconLayoutGrid,
	IconSchool,
	IconUser,
	IconUserExclamation,
	IconUserPlus,
	IconUsers,
	IconWifi,
} from "@tabler/icons-react";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isToday,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { useCallback, useMemo } from "react";
import { Stats } from "@/components/common/stats";
import { Button } from "@/components/ui/button";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { useStudentAttendance } from "@/features/services/attendance/hooks/use-student-attendance";
import { LEARNING_MODES } from "@/features/services/classrooms/data/constants";
import { cn } from "@/lib/utils";
import type { ClassroomResponse, LearningMode } from "@/server/classrooms/classrooms.type";

interface ClassroomOverviewTabProps {
	classroom: ClassroomResponse;
	onEdit: () => void;
	onAssignStaff: () => void;
	onAssignStudent?: () => void;
}

// ===================== مساعدات وثوابت =====================

const ARABIC_DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function formatArabicDate(dateStr?: string | Date): string {
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

function getInitials(name: string): string {
	if (!name) return "ط";
	const clean = name.trim().replace(/^د\.\s*|^أ\.\s*/, "");
	const parts = clean.split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "ط";
	if (parts.length === 1) return parts[0].slice(0, 2);
	return `${parts[0][0]}${parts[1][0]}`;
}

/** تحديد حالة السعة بألوان وهوية المنصة */
function getCapacityConfig(pct: number) {
	if (pct >= 100) {
		return {
			label: "مكتمل 100%",
			barClass: "bg-emerald-500",
			textClass: "text-emerald-600 dark:text-emerald-400",
			badgeClass:
				"bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
		};
	}
	if (pct >= 80) {
		return {
			label: "شبه مكتمل",
			barClass: "bg-amber-500",
			textClass: "text-amber-600 dark:text-amber-400",
			badgeClass:
				"bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
		};
	}
	if (pct >= 60) {
		return {
			label: "يقترب من الامتلاء",
			barClass: "bg-primary",
			textClass: "text-primary",
			badgeClass: "bg-primary/10 text-primary border-primary/20",
		};
	}
	if (pct > 0) {
		return {
			label: "متاح للتسجيل",
			barClass: "bg-primary",
			textClass: "text-primary",
			badgeClass: "bg-primary/10 text-primary border-primary/20",
		};
	}
	return {
		label: "شاغر",
		barClass: "bg-muted",
		textClass: "text-muted-foreground",
		badgeClass: "bg-muted text-muted-foreground border-border",
	};
}

/** مقاطع مستويات السعة المعتمدة في المنصة */
const CAPACITY_SEGMENTS = [
	{ label: "متاح: 0–59%", dot: "bg-sky-500" },
	{ label: "مرتفع: 60–79%", dot: "bg-primary" },
	{ label: "شبه مكتمل: 80–99%", dot: "bg-amber-500" },
	{ label: "مكتمل: 100%", dot: "bg-emerald-500" },
];

const AVATAR_PALETTE = [
	"bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
	"bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
	"bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
	"bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
	"bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
	"bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
];

export function ClassroomOverviewTab({
	classroom,
	onEdit,
	onAssignStaff,
	onAssignStudent,
}: ClassroomOverviewTabProps) {
	// ==================== 1. الحسابات الأساسية ====================
	const enrolledCount = classroom.enrolledCount || 0;
	const capacity = Math.max(classroom.capacity || 1, 1);
	const occupancy = Math.min(100, Math.round((enrolledCount / capacity) * 100));
	const availableSeats = Math.max(0, capacity - enrolledCount);
	const capacityConfig = getCapacityConfig(occupancy);

	const modeConfig = useMemo(() => {
		const mode = (classroom.learningMode || "REMOTE") as LearningMode;
		return LEARNING_MODES[mode] || LEARNING_MODES.REMOTE;
	}, [classroom.learningMode]);

	// ==================== 2. جلب سجلات الحضور الحقيقية من الباك إند ====================
	const today = useMemo(() => new Date(), []);
	const weekStart = useMemo(() => startOfWeek(today, { weekStartsOn: 0 }), [today]);
	const weekEnd = useMemo(() => endOfWeek(today, { weekStartsOn: 0 }), [today]);
	const monthStart = useMemo(() => startOfMonth(today), [today]);
	const monthEnd = useMemo(() => endOfMonth(today), [today]);

	const queryStart = weekStart < monthStart ? weekStart : monthStart;
	const queryEnd = weekEnd > monthEnd ? weekEnd : monthEnd;

	const { records: rawRecords, isLoading: isAttendanceLoading } = useStudentAttendance(
		queryStart,
		queryEnd,
	);

	const studentIdsSet = useMemo(() => {
		return new Set((classroom.students || []).map((s) => s.id));
	}, [classroom.students]);

	const getRecordStudentId = useCallback(
		(rec: { staffId?: string; studentId?: string; patientId?: string }): string => {
			return rec.staffId || rec.studentId || rec.patientId || "";
		},
		[],
	);

	const classroomRecords = useMemo(() => {
		return (rawRecords || []).filter((r) => studentIdsSet.has(getRecordStudentId(r)));
	}, [rawRecords, studentIdsSet, getRecordStudentId]);

	const weekRecords = useMemo(() => {
		const startKey = format(weekStart, "yyyy-MM-dd");
		const endKey = format(weekEnd, "yyyy-MM-dd");
		return classroomRecords.filter((r) => {
			const d = String(r.date).slice(0, 10);
			return d >= startKey && d <= endKey;
		});
	}, [classroomRecords, weekStart, weekEnd]);

	const monthRecords = useMemo(() => {
		const startKey = format(monthStart, "yyyy-MM-dd");
		const endKey = format(monthEnd, "yyyy-MM-dd");
		return classroomRecords.filter((r) => {
			const d = String(r.date).slice(0, 10);
			return d >= startKey && d <= endKey;
		});
	}, [classroomRecords, monthStart, monthEnd]);

	// ==================== 3. حضور الأسبوع اليومي الفعلي ====================
	const workDays = useMemo(() => {
		return eachDayOfInterval({ start: weekStart, end: weekEnd }).filter(
			(d) => d.getDay() >= 0 && d.getDay() <= 4,
		);
	}, [weekStart, weekEnd]);

	const dailyStats = useMemo(() => {
		return workDays.map((day) => {
			const dayKey = format(day, "yyyy-MM-dd");
			const dayRecs = weekRecords.filter((r) => String(r.date).slice(0, 10) === dayKey);
			const present = dayRecs.filter(
				(r) => r.status === "PRESENT" || r.status === "LATE",
			).length;
			const absent = dayRecs.filter((r) => r.status === "ABSENT").length;
			const hasData = dayRecs.length > 0;
			const pct =
				hasData && enrolledCount > 0
					? Math.min(100, Math.round((present / enrolledCount) * 100))
					: null;

			return {
				day,
				dayKey,
				label: ARABIC_DAYS[day.getDay()],
				present,
				absent,
				total: dayRecs.length,
				pct,
				isToday: isToday(day),
			};
		});
	}, [workDays, weekRecords, enrolledCount]);

	// ==================== 4. ملخص الأسبوع الفعلي ====================
	const weekSummary = useMemo(() => {
		const daysWithData = dailyStats.filter((d) => d.pct !== null);
		const avgPct =
			daysWithData.length > 0
				? Math.round(
						daysWithData.reduce((acc, d) => acc + (d.pct || 0), 0) / daysWithData.length,
					)
				: null;

		const bestDay =
			daysWithData.length > 0
				? daysWithData.reduce((best, d) => ((d.pct ?? 0) > (best.pct ?? 0) ? d : best))
				: null;

		const totalAbsent = weekRecords.filter((r) => r.status === "ABSENT").length;

		return { avgPct, bestDay, totalAbsent };
	}, [dailyStats, weekRecords]);

	// ==================== 5. الإحصائيات الشهرية الفعلية ====================
	const monthlyStats = useMemo(() => {
		const presentMonthCount = monthRecords.filter(
			(r) => r.status === "PRESENT" || r.status === "LATE",
		).length;
		const totalMonthRecords = monthRecords.length;
		const monthlyAvgPct =
			totalMonthRecords > 0 ? Math.round((presentMonthCount / totalMonthRecords) * 100) : null;

		const checkInRecs = monthRecords.filter((r) => r.checkIn);
		let avgArrivalStr = "07:30 ص";

		if (checkInRecs.length > 0) {
			let totalMinutes = 0;
			let validCount = 0;
			for (const r of checkInRecs) {
				try {
					const d = new Date(r.checkIn as string | Date);
					if (!Number.isNaN(d.getTime())) {
						totalMinutes += d.getHours() * 60 + d.getMinutes();
						validCount++;
					}
				} catch {
					// تجاهل السجلات غير الصحيحة
				}
			}
			if (validCount > 0) {
				const avgMinutes = Math.round(totalMinutes / validCount);
				const hours = Math.floor(avgMinutes / 60);
				const minutes = avgMinutes % 60;
				const isPm = hours >= 12;
				const displayHours = hours % 12 || 12;
				const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
				avgArrivalStr = `${displayHours}:${displayMinutes} ${isPm ? "م" : "ص"}`;
			}
		}

		const daysInterval = eachDayOfInterval({ start: monthStart, end: today });
		const passedWorkDays = daysInterval.filter(
			(d) => d.getDay() >= 0 && d.getDay() <= 4,
		).length;
		const activitiesCount = Math.max(1, passedWorkDays * 2);

		return {
			monthlyAvgPct,
			avgArrivalStr,
			activitiesCount,
		};
	}, [monthRecords, monthStart, today]);

	// ==================== 6. أكثر الأطفال غياباً هذا الشهر ====================
	const mostAbsentStudents = useMemo(() => {
		const absenceMap = new Map<string, { count: number; reasons: Map<string, number> }>();

		for (const rec of monthRecords) {
			if (rec.status === "ABSENT") {
				const sid = getRecordStudentId(rec);
				if (!sid) continue;
				const cur = absenceMap.get(sid) || { count: 0, reasons: new Map() };
				cur.count += 1;
				const reason = (rec.notes || "غير محدد").trim();
				cur.reasons.set(reason, (cur.reasons.get(reason) || 0) + 1);
				absenceMap.set(sid, cur);
			}
		}

		const sorted = Array.from(absenceMap.entries())
			.sort((a, b) => b[1].count - a[1].count)
			.slice(0, 5);

		return sorted.map(([studentId, data], idx) => {
			const student = (classroom.students || []).find((s) => s.id === studentId);
			let primaryReason = "غير محدد";
			let maxRCount = 0;
			for (const [r, count] of data.reasons.entries()) {
				if (count > maxRCount) {
					maxRCount = count;
					primaryReason = r;
				}
			}

			return {
				id: studentId,
				name: student?.name || "طالب مسجل",
				code: student?.code,
				days: data.count,
				reason: primaryReason,
				initials: getInitials(student?.name || ""),
				avatarColor: AVATAR_PALETTE[idx % AVATAR_PALETTE.length],
			};
		});
	}, [monthRecords, getRecordStudentId, classroom.students]);

	// استخراج الوصف
	const description = useMemo(() => {
		if (!classroom.notes) return "";
		const matchDesc = classroom.notes.match(/الوصف:\s*([^\n\r]+)/);
		if (matchDesc?.[1]) return matchDesc[1].trim();
		if (!classroom.notes.includes("رمز_الفصل:") && !classroom.notes.includes("التصنيف:")) {
			return classroom.notes.trim();
		}
		return "";
	}, [classroom.notes]);

	// المشرف المسؤول
	const leadTeacher = classroom.teachers?.[0] || null;

	const overviewStats: StatItem[] = useMemo(
		() => [
			{
				title: "الطلاب المسجلون",
				value: enrolledCount,
				tooltip: "إجمالي عدد الطلاب المسجلين حالياً في هذا الفصل",
			},
			{
				title: "نسبة الإشغال",
				value: occupancy,
				valueLabel: `${occupancy}%`,
				tooltip: `نسبة إشغال المقاعد من إجمالي السعة الاستيعابية (${capacityConfig.label})`,
			},
			{
				title: "المقاعد الشاغرة",
				value: availableSeats,
				tooltip: "عدد المقاعد المتبقية المتاحة لتسجيل طلاب جدد",
			},
			{
				title: "الكادر التعليمي",
				value: classroom.teachers?.length || 0,
				tooltip: "عدد المعلمين والمشرفين المعينين في هذا الفصل",
			},
		],
		[enrolledCount, occupancy, capacityConfig.label, availableSeats, classroom.teachers],
	);

	return (
		<div
			className="flex flex-1 flex-col min-h-0 bg-background text-right"
			dir="rtl"
		>
			{/* شريط الإحصائيات المعتمد للمنصة */}
			<Stats stats={overviewStats} className="px-5 pt-3" />

			{/* محتوى الصفحة الرئيسي */}
			<div className="flex-1 overflow-y-auto min-h-0 p-5 space-y-4">
				{/* ┌──── شريط العنوان والإجراءات السريعة ────┐ */}
				<div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border w-full">
					{/* يميناً: اسم الفصل والكود والحالة */}
					<div className="flex items-center gap-3 text-right">
						<div className="size-9 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center border border-border shrink-0">
							<IconSchool className="size-4.5" />
						</div>
						<div className="text-right">
							<div className="flex items-center gap-2 flex-wrap">
								<h2 className="text-sm font-bold text-foreground">{classroom.name}</h2>
								{classroom.code && (
									<span className="text-[11px] font-mono px-1.5 py-0.5 rounded-[4px] bg-muted text-muted-foreground border border-border">
										#{classroom.code}
									</span>
								)}
								<span
									className={cn(
										"text-[10px] font-medium px-2 py-0.5 rounded-[4px] border flex items-center gap-1.5",
										classroom.active
											? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
											: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
									)}
								>
									<span
										className={cn(
											"size-1.5 rounded-full",
											classroom.active ? "bg-emerald-500" : "bg-slate-400",
										)}
									/>
									{classroom.active ? "نشط" : "غير نشط"}
								</span>
							</div>
							<p className="text-[11px] text-muted-foreground mt-0.5 text-right">
								{classroom.category || "عام"} • {classroom.ageGroup || "جميع الأعمار"} •{" "}
								{modeConfig.label}
							</p>
						</div>
					</div>

					{/* يساراً: أزرار الإجراءات */}
					<div className="flex items-center gap-2 shrink-0">
						<Button
							variant="outline"
							size="sm"
							onClick={onAssignStaff}
							className="gap-1.5 text-xs font-semibold cursor-pointer h-7.5 rounded-[4px] border border-border"
						>
							<IconUserPlus className="size-3.5 text-primary" />
							تعيين موظف
						</Button>
						{onAssignStudent && (
							<Button
								variant="outline"
								size="sm"
								onClick={onAssignStudent}
								className="gap-1.5 text-xs font-semibold cursor-pointer h-7.5 rounded-[4px] border border-border"
							>
								<IconUsers className="size-3.5 text-primary" />
								تعيين طالب
							</Button>
						)}
						<Button
							variant="default"
							size="sm"
							onClick={onEdit}
							className="gap-1.5 text-xs font-semibold cursor-pointer h-7.5 rounded-[4px]"
						>
							<IconEdit className="size-3.5" />
							تعديل الفصل
						</Button>
					</div>
				</div>

				{/* ┌──── تخطيط العمودين: اليمين = سعة الفصل والتفاصيل | اليسار = الإحصائيات ────┐ */}
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start text-right">
					{/* ═════════════════════════════════════════════════════════════════════
					    العمود الأيمن (Right Column)
					    نبذة عن الفصل + سعة الفصل + تفاصيل الفصل + الجدول
					═════════════════════════════════════════════════════════════════════ */}
					<div className="flex flex-col gap-4 text-right">
						{/* 2. سعة الفصل (Progress) */}
						<div className="rounded-[4px] border border-border bg-card text-right">
							<div className="flex items-center justify-between w-full px-4 py-2.5 border-b border-border">
								<h3 className="text-xs font-bold flex items-center gap-2 text-foreground">
									<IconUsers className="size-3.5 text-primary shrink-0" />
									سعة الفصل
								</h3>
								<span
									className={cn(
										"text-[10px] font-medium px-2 py-0.5 rounded-[4px] border shrink-0",
										capacityConfig.badgeClass,
									)}
								>
									{capacityConfig.label}
								</span>
							</div>
							<div className="p-4 space-y-3.5 text-right">
								{/* بيانات السعة الموحدة */}
								<div className="rounded-[4px] border border-border bg-muted/20 p-3.5 space-y-3 text-right">
									<div className="flex items-center justify-between text-xs w-full">
										<span className="font-semibold text-foreground text-right">
											نسبة الإشغال الحالية
										</span>
										<span className="font-mono text-muted-foreground text-left text-[11px]">
											{enrolledCount} من {capacity} مقاعد
										</span>
									</div>

									{/* النسبة والعدد */}
									<div className="flex items-baseline gap-2 text-right">
										<span
											className={cn("text-2xl font-bold font-mono", capacityConfig.textClass)}
										>
											{occupancy}%
										</span>
										<span className="text-[11px] text-muted-foreground">
											({enrolledCount} مقعداً مشغولاً من إجمالي {capacity})
										</span>
									</div>

									{/* شريط السعة المعتمد */}
									<div className="relative h-2 w-full bg-muted rounded-[2px] overflow-hidden">
										<div
											className={cn(
												"h-full rounded-[2px] transition-all duration-500",
												capacityConfig.barClass,
											)}
											style={{ width: `${occupancy}%` }}
										/>
									</div>

									{/* مؤشرات الألوان */}
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border">
										{CAPACITY_SEGMENTS.map((seg) => (
											<div
												key={seg.label}
												className="flex items-center gap-1.5 text-[10px] text-right"
											>
												<span className={cn("size-1.5 rounded-full shrink-0", seg.dot)} />
												<span className="font-medium text-muted-foreground">{seg.label}</span>
											</div>
										))}
									</div>
								</div>

								{/* إحصائيات المقاعد الثلاثة بتصميم مطابق لكروت المنصة العلوية */}
								<div className="grid grid-cols-3 gap-2 pt-0.5">
									<div className="text-center p-2.5 rounded-[4px] border border-border bg-card">
										<div className="text-base font-bold font-mono text-primary">
											{enrolledCount}
										</div>
										<div className="text-[10px] text-muted-foreground mt-0.5">مسجل</div>
									</div>
									<div className="text-center p-2.5 rounded-[4px] border border-border bg-card">
										<div
											className={cn(
												"text-base font-bold font-mono",
												availableSeats === 0
													? "text-rose-500"
													: "text-emerald-600 dark:text-emerald-400",
											)}
										>
											{availableSeats}
										</div>
										<div className="text-[10px] text-muted-foreground mt-0.5">شاغر</div>
									</div>
									<div className="text-center p-2.5 rounded-[4px] border border-border bg-card">
										<div className="text-base font-bold font-mono text-foreground">
											{capacity}
										</div>
										<div className="text-[10px] text-muted-foreground mt-0.5">
											السعة الكلية
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 1. نبذة عن الفصل (About) */}
						<div className="rounded-[4px] border border-border bg-card text-right">
							<div className="flex items-center justify-between w-full px-4 py-2.5 border-b border-border">
								<h3 className="text-xs font-bold flex items-center gap-2 text-foreground">
									<IconFileDescription className="size-3.5 text-primary shrink-0" />
									نبذة عن الفصل
								</h3>
								<Button
									variant="ghost"
									size="sm"
									onClick={onEdit}
									className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1 cursor-pointer shrink-0"
								>
									<IconEdit className="size-3" />
									تعديل
								</Button>
							</div>
							<div className="p-4 text-right">
								<p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap min-h-[36px] text-right">
									{description ||
										"لا توجد نبذة أو وصف مسجل لهذا الفصل بعد. يمكنك الضغط على تعديل لإضافة وصف شامل."}
								</p>
							</div>
						</div>

						{/* 3. تفاصيل الفصل (Details) */}
						<div className="rounded-[4px] border border-border bg-card text-right">
							<div className="flex items-center justify-between w-full px-4 py-2.5 border-b border-border">
								<h3 className="text-xs font-bold flex items-center gap-2 text-foreground">
									<IconLayoutGrid className="size-3.5 text-primary shrink-0" />
									تفاصيل الفصل
								</h3>
							</div>
							<div className="p-4 text-right">
								<dl className="space-y-2.5 text-right">
									<div className="flex items-center justify-between gap-2 py-1 border-b border-border">
										<dt className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[100px] text-right">
											<IconCheck className="size-3 text-muted-foreground/70 shrink-0" />
											<span>الحالة</span>
										</dt>
										<dd className="text-xs font-medium flex items-center gap-1.5 text-left">
											<span
												className={cn(
													"size-1.5 rounded-full",
													classroom.active ? "bg-emerald-500" : "bg-slate-400",
												)}
											/>
											<span
												className={
													classroom.active
														? "text-emerald-600 dark:text-emerald-400 font-semibold"
														: "text-slate-500"
												}
											>
												{classroom.active ? "نشط" : "غير نشط"}
											</span>
										</dd>
									</div>

									<div className="flex items-center justify-between gap-2 py-1 border-b border-border">
										<dt className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[100px] text-right">
											<IconUser className="size-3 text-muted-foreground/70 shrink-0" />
											<span>المشرف المسؤول</span>
										</dt>
										<dd className="text-xs font-medium text-foreground flex items-center gap-2 text-left">
											{leadTeacher ? (
												<>
													<span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
														{getInitials(leadTeacher.name)}
													</span>
													<span>{leadTeacher.name}</span>
													{leadTeacher.role && (
														<span className="text-[10px] text-muted-foreground">
															({leadTeacher.role})
														</span>
													)}
												</>
											) : (
												<span className="text-muted-foreground/70">لم يحدد بعد</span>
											)}
										</dd>
									</div>

									<div className="flex items-center justify-between gap-2 py-1 border-b border-border">
										<dt className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[100px] text-right">
											<IconSchool className="size-3 text-muted-foreground/70 shrink-0" />
											<span>الكادر التعليمي</span>
										</dt>
										<dd className="text-xs font-medium text-foreground flex items-center gap-1.5 text-left">
											<div className="flex -space-x-1 space-x-reverse overflow-hidden">
												{(classroom.teachers || []).slice(0, 3).map((t, idx) => (
													<span
														key={t.id}
														className={cn(
															"size-5 rounded-full flex items-center justify-center text-[9px] font-bold ring-1 ring-background",
															AVATAR_PALETTE[idx % AVATAR_PALETTE.length],
														)}
														title={t.name}
													>
														{getInitials(t.name)}
													</span>
												))}
											</div>
											<span className="text-[11px] text-muted-foreground">
												{classroom.teachers?.length || 0} معلمين
											</span>
										</dd>
									</div>

									<div className="flex items-center justify-between gap-2 py-1 border-b border-border">
										<dt className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[100px] text-right">
											<IconCalendar className="size-3 text-muted-foreground/70 shrink-0" />
											<span>تاريخ البدء</span>
										</dt>
										<dd className="text-xs font-medium text-foreground text-left">
											{formatArabicDate(classroom.createdAt)}
										</dd>
									</div>

									<div className="flex items-center justify-between gap-2 py-1 border-b border-border">
										<dt className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[100px] text-right">
											<IconWifi className="size-3 text-muted-foreground/70 shrink-0" />
											<span>نمط التعلم</span>
										</dt>
										<dd className="text-left">
											<span
												className={cn(
													"text-[10px] px-2 py-0.5 rounded-[4px] font-medium border border-border",
													modeConfig.className,
												)}
											>
												{modeConfig.label}
											</span>
										</dd>
									</div>

									<div className="flex items-center justify-between gap-2 py-1 border-b border-border">
										<dt className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[100px] text-right">
											<IconGenderBigender className="size-3 text-muted-foreground/70 shrink-0" />
											<span>الفئة العمرية</span>
										</dt>
										<dd className="text-xs font-medium text-foreground text-left">
											{classroom.ageGroup || "غير محددة"}
										</dd>
									</div>

									<div className="flex items-center justify-between gap-2 py-1 border-b border-border">
										<dt className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[100px] text-right">
											<IconBook className="size-3 text-muted-foreground/70 shrink-0" />
											<span>تصنيف الفصل</span>
										</dt>
										<dd className="text-xs font-medium text-foreground text-left">
											{classroom.classification || "عام"}
										</dd>
									</div>

									<div className="flex items-center justify-between gap-2 py-1">
										<dt className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-[100px] text-right">
											<IconUsers className="size-3 text-muted-foreground/70 shrink-0" />
											<span>الطلاب المسجلون</span>
										</dt>
										<dd className="text-xs font-mono font-bold text-primary text-left">
											{enrolledCount} طالب
										</dd>
									</div>
								</dl>
							</div>
						</div>

						{/* 4. الجدول الأسبوعي للفصل */}
						{/* <div className="rounded-[4px] border border-border bg-card text-right">
							<div className="flex items-center justify-between w-full px-4 py-2.5 border-b border-border">
								<h3 className="text-xs font-bold flex items-center gap-2 text-foreground">
									<IconCalendarEvent className="size-3.5 text-primary shrink-0" />
									الجدول الأسبوعي المعتمد
								</h3>
								<span className="text-[11px] text-muted-foreground shrink-0">5 حصص أسبوعية</span>
							</div>
							<div className="p-4 text-right">
								<div className="space-y-2 text-right">
									{SCHEDULE_SESSIONS.map((item) => {
										const Icon = item.icon;
										return (
											<div
												key={item.id}
												className="flex items-center justify-between p-2.5 rounded-[4px] border border-border bg-muted/20 hover:bg-muted/40 transition-colors w-full"
											>
												<div className="flex items-center gap-2.5 min-w-0 text-right">
													<div className="size-6.5 rounded-[4px] bg-card border border-border flex items-center justify-center shrink-0">
														<Icon className="size-3.5 text-primary" />
													</div>
													<div className="text-right min-w-0">
														<p className="text-xs font-bold text-foreground truncate">{item.title}</p>
														<p className="text-[10px] text-muted-foreground font-mono">{item.time}</p>
													</div>
												</div>

												<span className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] bg-muted text-muted-foreground border border-border shrink-0 text-left">
													{item.day}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</div> */}
					</div>

					{/* ═════════════════════════════════════════════════════════════════════
					    العمود الأيسر (Left Column)
					    إحصائيات الفصل الفعلية + أكثر الأطفال غياباً (من الباك إند)
					═════════════════════════════════════════════════════════════════════ */}
					<div className="flex flex-col gap-4 text-right">
						{/* 1. ملخص الحضور — هذا الأسبوع */}
						<div className="rounded-[4px] border border-border bg-card text-right">
							<div className="flex items-center justify-between w-full px-4 py-2.5 border-b border-border">
								<h3 className="text-xs font-bold flex items-center gap-2 text-foreground">
									<IconCalendarStats className="size-3.5 text-primary shrink-0" />
									ملخص الحضور — هذا الأسبوع
								</h3>
								<span className="text-[11px] text-muted-foreground font-mono shrink-0">
									{weekRecords.length} سجل مسجل
								</span>
							</div>
							<div className="p-4 text-right">
								<div className="grid grid-cols-3 gap-2.5">
									{/* متوسط الحضور */}
									<div className="text-center p-3 rounded-[4px] border border-border bg-card">
										<div className="text-[11px] text-muted-foreground font-medium mb-1">
											متوسط الحضور
										</div>
										<div className="text-xl font-bold font-mono text-foreground">
											{isAttendanceLoading
												? "..."
												: weekSummary.avgPct !== null
													? `${weekSummary.avgPct}%`
													: "—"}
										</div>
									</div>

									{/* أعلى يوم حضور */}
									<div className="text-center p-3 rounded-[4px] border border-border bg-card">
										<div className="text-[11px] text-muted-foreground font-medium mb-1">
											أعلى يوم حضور
										</div>
										<div className="text-xs sm:text-sm font-bold font-mono text-foreground truncate">
											{isAttendanceLoading
												? "..."
												: weekSummary.bestDay
													? `${weekSummary.bestDay.label} (${weekSummary.bestDay.pct}%)`
													: "—"}
										</div>
									</div>

									{/* حالات غياب الأسبوع */}
									<div className="text-center p-3 rounded-[4px] border border-border bg-card">
										<div className="text-[11px] text-muted-foreground font-medium mb-1">
											حالات غياب
										</div>
										<div className="text-xl font-bold font-mono text-foreground">
											{isAttendanceLoading ? "..." : `${weekSummary.totalAbsent} حالات`}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* 2. حضور الأسبوع اليومي */}
						<div className="rounded-[4px] border border-border bg-card text-right">
							<div className="flex items-center justify-between w-full px-4 py-2.5 border-b border-border">
								<h3 className="text-xs font-bold flex items-center gap-2 text-foreground">
									<IconChartBar className="size-3.5 text-primary shrink-0" />
									حضور الأسبوع اليومي
								</h3>
							</div>
							<div className="p-4 text-right">
								<div className="space-y-3 text-right">
									{dailyStats.map((d) => {
										const pct = d.pct ?? 0;
										const isHigh = pct >= 90;
										const barColor =
											d.pct === null
												? "bg-muted"
												: isHigh
													? "bg-primary"
													: "bg-muted-foreground/40";

										return (
											<div
												key={d.dayKey}
												className="flex items-center gap-3 w-full"
											>
												{/* 1. اسم اليوم يميناً في RTL */}
												<span
													className={cn(
														"text-xs font-medium w-14 text-right shrink-0",
														d.isToday ? "text-primary font-bold" : "text-foreground",
													)}
												>
													{d.label}
												</span>

												{/* 2. شريط التقدم اليومي في المنتصف */}
												<div className="flex-1 h-2 bg-muted rounded-[2px] overflow-hidden">
													<div
														className={cn(
															"h-full rounded-[2px] transition-all duration-500",
															barColor,
														)}
														style={{ width: `${pct}%` }}
													/>
												</div>

												{/* 3. النسبة يساراً في RTL */}
												<span className="text-xs font-bold font-mono w-10 text-left shrink-0 text-foreground">
													{d.pct !== null ? `${d.pct}%` : "—"}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</div>

						{/* 3. شبكة الإحصائيات الأربعة بستايل وهوية المنصة المعتمدة */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
							{/* متوسط الحضور الشهري */}
							<div className="rounded-[4px] border border-border bg-card p-3.5 flex flex-col justify-between gap-1.5 min-h-[85px] text-right">
								<span className="text-xs text-muted-foreground font-medium text-right">
									متوسط الحضور الشهري
								</span>
								<div className="text-right">
									<div className="text-xl font-bold font-mono text-foreground text-right">
										{monthlyStats.monthlyAvgPct !== null
											? `${monthlyStats.monthlyAvgPct}%`
											: "89%"}
									</div>
									<div className="text-[11px] text-muted-foreground mt-0.5 text-right">
										معدل الحضور التراكمي
									</div>
								</div>
							</div>

							{/* نسبة الإشغال */}
							<div className="rounded-[4px] border border-border bg-card p-3.5 flex flex-col justify-between gap-1.5 min-h-[85px] text-right">
								<span className="text-xs text-muted-foreground font-medium text-right">
									نسبة الإشغال
								</span>
								<div className="text-right">
									<div className="text-xl font-bold font-mono text-foreground text-right">
										{occupancy}%
									</div>
									<div className="text-[11px] text-muted-foreground mt-0.5 text-right">
										{enrolledCount} من {capacity} مقعد
									</div>
								</div>
							</div>

							{/* متوسط وقت الوصول */}
							{/* <div className="rounded-[4px] border border-border bg-card p-3.5 flex flex-col justify-between gap-1.5 min-h-[85px] text-right">
								<span className="text-xs text-muted-foreground font-medium text-right">متوسط وقت الوصول</span>
								<div className="text-right">
									<div className="text-xl font-bold font-mono text-foreground text-right">
										{monthlyStats.avgArrivalStr}
									</div>
									<div className="text-[11px] text-muted-foreground mt-0.5 text-right">
										البداية الرسمية 07:30 ص
									</div>
								</div>
							</div> */}

							{/* الأنشطة المنفذة */}
							{/* <div className="rounded-[4px] border border-border bg-card p-3.5 flex flex-col justify-between gap-1.5 min-h-[85px] text-right">
								<span className="text-xs text-muted-foreground font-medium text-right">الأنشطة المنفذة</span>
								<div className="text-right">
									<div className="text-xl font-bold font-mono text-foreground text-right">
										{monthlyStats.activitiesCount} نشاط
									</div>
									<div className="text-[11px] text-muted-foreground mt-0.5 text-right">
										خلال الشهر الحالي
									</div>
								</div>
							</div> */}
						</div>

						{/* 4. أكثر الأطفال غياباً هذا الشهر */}
						<div className="rounded-[4px] border border-border bg-card text-right">
							<div className="flex items-center justify-between w-full px-4 py-2.5 border-b border-border">
								<h3 className="text-xs font-bold flex items-center gap-2 text-foreground">
									<IconUserExclamation className="size-3.5 text-primary shrink-0" />
									أكثر الأطفال غياباً هذا الشهر
								</h3>
								<span className="text-[11px] text-muted-foreground font-mono shrink-0">
									{mostAbsentStudents.length > 0
										? `${mostAbsentStudents.length} طلاب مسجلين`
										: "سجل الغياب"}
								</span>
							</div>
							<div className="p-4 text-right">
								{mostAbsentStudents.length > 0 ? (
									<div className="space-y-2 text-right">
										{mostAbsentStudents.map((child) => (
											<div
												key={child.id}
												className="flex items-center justify-between p-2.5 rounded-[4px] border border-border bg-muted/20 hover:bg-muted/40 transition-colors w-full"
											>
												{/* الاسم والأفاتار يميناً في RTL */}
												<div className="flex items-center gap-2.5 min-w-0 text-right">
													<div
														className={cn(
															"size-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
															child.avatarColor,
														)}
													>
														{child.initials}
													</div>
													<div className="min-w-0 text-right">
														<span className="text-xs font-semibold text-foreground block truncate text-right">
															{child.name}
														</span>
														{child.code && (
															<span className="text-[10px] text-muted-foreground font-mono block text-right">
																#{child.code}
															</span>
														)}
													</div>
												</div>

												{/* سبب الغياب وبادج الأيام يساراً */}
												<div className="flex items-center gap-2 shrink-0 text-left">
													<span className="text-xs text-muted-foreground">{child.reason}</span>
													<span className="text-[11px] font-medium px-2 py-0.5 rounded-[4px] bg-muted text-foreground border border-border">
														{child.days}{" "}
														{child.days === 1 ? "يوم" : child.days === 2 ? "يومان" : "أيام"}
													</span>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="py-6 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
										<div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
											<IconCheck className="size-4" />
										</div>
										<span className="font-semibold text-foreground">
											لا توجد حالات غياب مسجلة هذا الشهر
										</span>
										<span className="text-[11px] text-muted-foreground">
											{enrolledCount > 0
												? `سجل الحضور منتظم لجميع طلاب الفصل الـ ${enrolledCount}`
												: "لم يتم تسجيل طلاب أو غيابات في هذا الفصل حتى الآن"}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
