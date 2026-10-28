import { useMemo } from "react";
import {
	IconBook,
	IconBuildingCommunity,
	IconCalendar,
	IconCalendarStats,
	IconCategory,
	IconChartBar,
	IconChartPie,
	IconClock,
	IconGenderBigender,
	IconSchool,
	IconStar,
	IconTrendingUp,
	IconUsers,
	IconUserCheck,
	IconUserExclamation,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LEARNING_MODES } from "@/features/services/classrooms/data/constants";
import type { ClassroomResponse, LearningMode } from "@/server/classrooms/classrooms.type";
import { cn } from "@/lib/utils";

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

/** تحديد لون شريط السعة */
function getCapacityColor(percent: number): string {
	if (percent >= 100) return "bg-emerald-500";
	if (percent >= 80) return "bg-amber-500";
	if (percent >= 60) return "bg-primary";
	if (percent >= 40) return "bg-sky-500";
	return "bg-muted-foreground/40";
}

/** تحديد نص وصف حالة السعة */
function getCapacityLabel(percent: number): { label: string; className: string } {
	if (percent >= 100)
		return { label: "مكتمل 100%", className: "text-emerald-600 dark:text-emerald-400" };
	if (percent >= 80)
		return { label: "شارف الاكتمال", className: "text-amber-600 dark:text-amber-400" };
	if (percent >= 50)
		return { label: "نشط وجارٍ التسجيل", className: "text-primary" };
	if (percent > 0)
		return { label: "في بداية التسجيل", className: "text-sky-600 dark:text-sky-400" };
	return { label: "لم يبدأ التسجيل بعد", className: "text-muted-foreground" };
}

/** تحديد لون وتسمية منطقة السعة في مخطط الأجزاء */
const CAPACITY_SEGMENTS = [
	{ from: 0, to: 59, label: "متاح: 0–59%", color: "bg-emerald-500", textColor: "text-emerald-600" },
	{ from: 60, to: 79, label: "مرتفع: 60–79%", color: "bg-amber-500", textColor: "text-amber-600" },
	{ from: 80, to: 99, label: "شبه مكتمل: 80–99%", color: "bg-orange-500", textColor: "text-orange-600" },
	{ from: 100, to: 100, label: "مكتمل: 100%", color: "bg-rose-500", textColor: "text-rose-600" },
];

export function ClassroomStatsTab({ classroom }: ClassroomStatsTabProps) {
	// ==================== حسابات البيانات ====================
	const occupancy = useMemo(
		() => Math.min(100, Math.round((classroom.enrolledCount / (classroom.capacity || 1)) * 100)),
		[classroom.enrolledCount, classroom.capacity],
	);

	const availableSeats = useMemo(
		() => Math.max(0, classroom.capacity - classroom.enrolledCount),
		[classroom.capacity, classroom.enrolledCount],
	);

	const modeConfig = useMemo(() => {
		const mode = (classroom.learningMode || "REMOTE") as LearningMode;
		return LEARNING_MODES[mode] || LEARNING_MODES.REMOTE;
	}, [classroom.learningMode]);

	const capacityStatusLabel = getCapacityLabel(occupancy);
	const barColor = getCapacityColor(occupancy);

	// نسبة الإشغال المرئية للشريط بدقة
	const activeSegment = useMemo(
		() => CAPACITY_SEGMENTS.find((s) => occupancy >= s.from && occupancy <= s.to) || CAPACITY_SEGMENTS[0],
		[occupancy],
	);

	// احصائيات سريعة للعمود الأيسر
	const quickStats = useMemo(
		() => [
			{
				key: "enrolled",
				label: "الطلاب المسجلون",
				value: classroom.enrolledCount,
				sub: `من أصل ${classroom.capacity} مقعد`,
				icon: IconUsers,
				color: "text-primary",
				bg: "bg-primary/10",
			},
			{
				key: "available",
				label: "المقاعد الشاغرة",
				value: availableSeats,
				sub: `${occupancy}% نسبة الإشغال`,
				icon: IconUserCheck,
				color: availableSeats === 0 ? "text-rose-500" : "text-emerald-600",
				bg: availableSeats === 0 ? "bg-rose-50 dark:bg-rose-950/30" : "bg-emerald-50 dark:bg-emerald-950/30",
			},
			{
				key: "teachers",
				label: "الكادر التعليمي",
				value: classroom.teachers?.length || 0,
				sub: "معلمون ومشرفون",
				icon: IconSchool,
				color: "text-indigo-600 dark:text-indigo-400",
				bg: "bg-indigo-50 dark:bg-indigo-950/30",
			},
		],
		[classroom.enrolledCount, classroom.capacity, classroom.teachers, availableSeats, occupancy],
	);

	return (
		<div className="flex-1 overflow-y-auto" dir="rtl">
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 min-h-full">

				{/* ===================== العمود الأيسر: الإحصائيات ===================== */}
				<div className="flex flex-col gap-5 p-5 border-e border-border/60">

					{/* --- بطاقات الإحصاء السريع --- */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{quickStats.map((stat) => {
							const Icon = stat.icon;
							return (
								<div
									key={stat.key}
									className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs flex flex-col gap-3"
								>
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
										<div className={cn("size-7 rounded-lg flex items-center justify-center", stat.bg)}>
											<Icon className={cn("size-3.5", stat.color)} />
										</div>
									</div>
									<div className="flex flex-col gap-0.5">
										<span className={cn("text-2xl font-bold font-mono", stat.color)}>
											{stat.value}
										</span>
										<span className="text-[11px] text-muted-foreground">{stat.sub}</span>
									</div>
								</div>
							);
						})}
					</div>

					{/* --- مخطط توزيع السعة --- */}
					<Card>
						<CardHeader className="pb-2 border-b border-border/50 mb-0">
							<CardTitle className="text-sm font-bold flex items-center gap-2">
								<IconChartBar className="size-4 text-primary" />
								توزيع الطاقة الاستيعابية
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-4">
							{/* الشريط الرئيسي */}
							<div className="space-y-2 mb-4">
								<div className="flex items-center justify-between text-xs mb-1">
									<span className="text-muted-foreground font-medium">نسبة الإشغال الحالية</span>
									<span className={cn("font-bold font-mono text-sm", capacityStatusLabel.className)}>
										{occupancy}%
									</span>
								</div>
								<div className="relative h-3 rounded-full bg-muted/60 overflow-hidden">
									<div
										className={cn("h-full rounded-full transition-all duration-700", barColor)}
										style={{ width: `${occupancy}%` }}
									/>
								</div>
								<div className="flex items-center justify-between text-[10px] text-muted-foreground">
									<span>{classroom.enrolledCount} طالب مسجل</span>
									<span className={cn("font-medium text-[11px]", capacityStatusLabel.className)}>
										{capacityStatusLabel.label}
									</span>
									<span>{classroom.capacity} مقعد إجمالي</span>
								</div>
							</div>

							{/* مقياس أجزاء السعة */}
							<div className="flex rounded-full overflow-hidden h-2 gap-px mb-3">
								{CAPACITY_SEGMENTS.map((seg) => (
									<div
										key={seg.label}
										className={cn(
											"flex-1 transition-opacity duration-300",
											seg.color,
											activeSegment.from === seg.from ? "opacity-100" : "opacity-20",
										)}
									/>
								))}
							</div>
							<div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
								{CAPACITY_SEGMENTS.map((seg) => (
									<div key={seg.label} className="flex items-center gap-1.5 text-[10px]">
										<span className={cn("size-2 rounded-full shrink-0", seg.color)} />
										<span className={cn("font-medium", activeSegment.from === seg.from ? seg.textColor : "text-muted-foreground/60")}>
											{seg.label}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* --- إحصائيات المعلمين والكادر --- */}
					<Card>
						<CardHeader className="pb-2 border-b border-border/50">
							<CardTitle className="text-sm font-bold flex items-center gap-2">
								<IconSchool className="size-4 text-indigo-500" />
								الكادر التعليمي ({classroom.teachers?.length || 0})
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-4">
							{classroom.teachers && classroom.teachers.length > 0 ? (
								<div className="space-y-2.5">
									{classroom.teachers.map((teacher, idx) => {
										const COLORS = [
											"bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
											"bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
											"bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
											"bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
											"bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
										];
										const colorClass = COLORS[idx % COLORS.length];
										const initials = teacher.name
											.trim()
											.split(/\s+/)
											.slice(0, 2)
											.map((p) => p[0])
											.join("");
										return (
											<div
												key={teacher.id}
												className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
											>
												<div
													className={cn(
														"size-8 rounded-full flex items-center justify-center text-[11px] font-bold border border-transparent shrink-0 overflow-hidden",
														colorClass,
													)}
												>
													{teacher.image ? (
														<img
															src={teacher.image}
															alt={teacher.name}
															className="size-full object-cover rounded-full"
														/>
													) : (
														<span>{initials}</span>
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-xs font-bold text-foreground truncate">{teacher.name}</p>
													<p className="text-[10px] text-muted-foreground">
														{teacher.role || "معلم"}
														{teacher.phone ? ` • ${teacher.phone}` : ""}
													</p>
												</div>
												<span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 shrink-0">
													{teacher.employmentType || "معلم"}
												</span>
											</div>
										);
									})}
								</div>
							) : (
								<div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
									<IconUserExclamation className="size-8 text-muted-foreground/40" />
									<span>لم يتم تعيين معلمين لهذا الفصل بعد</span>
								</div>
							)}
						</CardContent>
					</Card>

					{/* --- ملخص إحصائي للفصل --- */}
					<Card>
						<CardHeader className="pb-2 border-b border-border/50">
							<CardTitle className="text-sm font-bold flex items-center gap-2">
								<IconChartPie className="size-4 text-amber-500" />
								ملخص إحصائي
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-4">
							<div className="grid grid-cols-2 gap-3">
								{[
									{
										label: "نسبة الإشغال",
										value: `${occupancy}%`,
										icon: IconTrendingUp,
										color: occupancy >= 80 ? "text-amber-600" : "text-primary",
									},
									{
										label: "المقاعد الشاغرة",
										value: `${availableSeats} مقعد`,
										icon: IconUserCheck,
										color: availableSeats === 0 ? "text-rose-500" : "text-emerald-600",
									},
									{
										label: "إجمالي الطلاب",
										value: classroom.enrolledCount,
										icon: IconUsers,
										color: "text-primary",
									},
									{
										label: "إجمالي الكادر",
										value: classroom.teachers?.length || 0,
										icon: IconSchool,
										color: "text-indigo-600",
									},
								].map((item) => {
									const Icon = item.icon;
									return (
										<div
											key={item.label}
											className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-muted/20"
										>
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<Icon className="size-3.5 text-muted-foreground/70" />
												<span>{item.label}</span>
											</div>
											<span className={cn("text-lg font-bold font-mono", item.color)}>
												{item.value}
											</span>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* ===================== العمود الأيمن: التقدم وبيانات الفصل ===================== */}
				<div className="flex flex-col gap-5 p-5 bg-muted/10">

					{/* --- بطاقة سعة الفصل / Progress --- */}
					<div className="rounded-xl border border-border/70 bg-card shadow-2xs overflow-hidden">
						{/* ترويسة بطاقة السعة */}
						<div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/50">
							<span className="text-xs font-bold text-foreground flex items-center gap-1.5">
								<IconCalendarStats className="size-3.5 text-primary" />
								سعة الفصل
							</span>
							<span className="text-[11px] text-muted-foreground font-mono">
								{classroom.enrolledCount} / {classroom.capacity} طالب
							</span>
						</div>

						{/* محتوى بطاقة السعة */}
						<div className="p-4 space-y-4">
							{/* الدائرة / الرقم الكبير */}
							<div className="flex flex-col items-center gap-2 py-2">
								<div className="relative size-28">
									{/* دائرة SVG */}
									<svg
										viewBox="0 0 100 100"
										className="size-full -rotate-90"
										aria-hidden="true"
									>
										<circle
											cx="50"
											cy="50"
											r="38"
											fill="none"
											strokeWidth="9"
											className="stroke-muted"
										/>
										<circle
											cx="50"
											cy="50"
											r="38"
											fill="none"
											strokeWidth="9"
											strokeLinecap="round"
											strokeDasharray={`${2 * Math.PI * 38}`}
											strokeDashoffset={`${2 * Math.PI * 38 * (1 - occupancy / 100)}`}
											className={cn(
												"transition-all duration-700",
												occupancy >= 100
													? "stroke-emerald-500"
													: occupancy >= 80
													? "stroke-amber-500"
													: "stroke-primary",
											)}
										/>
									</svg>
									{/* النسبة في المنتصف */}
									<div className="absolute inset-0 flex flex-col items-center justify-center">
										<span
											className={cn(
												"text-2xl font-extrabold font-mono leading-none",
												occupancy >= 100
													? "text-emerald-600 dark:text-emerald-400"
													: occupancy >= 80
													? "text-amber-600 dark:text-amber-400"
													: "text-primary",
											)}
										>
											{occupancy}%
										</span>
										<span className="text-[9px] text-muted-foreground mt-0.5">إشغال</span>
									</div>
								</div>
								<p className={cn("text-xs font-semibold", capacityStatusLabel.className)}>
									{capacityStatusLabel.label}
								</p>
							</div>

							{/* شريط السعة الأفقي */}
							<div className="space-y-1.5">
								<div className="flex items-center justify-between text-[10px] text-muted-foreground">
									<span>0</span>
									<span className="font-medium text-foreground">{classroom.enrolledCount} مسجل</span>
									<span>{classroom.capacity}</span>
								</div>
								<div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden">
									<div
										className={cn("h-full rounded-full transition-all duration-700", barColor)}
										style={{ width: `${occupancy}%` }}
									/>
								</div>
							</div>

							{/* تفاصيل السعة */}
							<div className="grid grid-cols-3 gap-2 pt-1">
								{[
									{ label: "مسجل", value: classroom.enrolledCount, color: "text-primary" },
									{ label: "شاغر", value: availableSeats, color: availableSeats === 0 ? "text-rose-500" : "text-emerald-600" },
									{ label: "سعة كاملة", value: classroom.capacity, color: "text-foreground" },
								].map((item) => (
									<div key={item.label} className="text-center p-2 rounded-lg bg-muted/30">
										<div className={cn("text-base font-bold font-mono", item.color)}>
											{item.value}
										</div>
										<div className="text-[9px] text-muted-foreground mt-0.5">{item.label}</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* --- بيانات الفصل --- */}
					<Card>
						<CardHeader className="pb-2 border-b border-border/50">
							<CardTitle className="text-sm font-bold flex items-center gap-2">
								<IconBook className="size-4 text-primary" />
								تفاصيل الفصل
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-3">
							<dl className="space-y-3">
								{[
									{
										label: "اسم الفصل",
										value: classroom.name,
										icon: IconSchool,
									},
									{
										label: "كود الفصل",
										value: classroom.code ? `#${classroom.code}` : "—",
										icon: IconStar,
										mono: true,
									},
									{
										label: "فئة الفصل",
										value: classroom.category || "غير محدد",
										icon: IconCategory,
									},
									{
										label: "الفئة العمرية",
										value: classroom.ageGroup || "غير محددة",
										icon: IconGenderBigender,
									},
									{
										label: "نمط التعلم",
										value: modeConfig.label,
										icon: IconBuildingCommunity,
										badge: modeConfig.className,
									},
									{
										label: "تصنيف الفصل",
										value: classroom.classification || "—",
										icon: IconChartBar,
									},
									{
										label: "تاريخ الإنشاء",
										value: formatDate(classroom.createdAt),
										icon: IconCalendar,
									},
									{
										label: "آخر تحديث",
										value: formatRelativeAge(classroom.updatedAt),
										icon: IconClock,
									},
									{
										label: "الحالة",
										value: classroom.active ? "نشط" : "غير نشط",
										icon: IconUserCheck,
										statusColor: classroom.active
											? "text-emerald-600 dark:text-emerald-400"
											: "text-slate-500",
										dot: classroom.active ? "bg-emerald-500" : "bg-slate-400",
									},
								].map((item) => {
									const Icon = item.icon;
									return (
										<div key={item.label} className="flex items-start justify-between gap-3">
											<dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground shrink-0 min-w-[90px]">
												<Icon className="size-3 text-muted-foreground/60 shrink-0" />
												<span>{item.label}</span>
											</dt>
											<dd className="text-[11px] font-medium text-foreground text-left flex items-center gap-1.5">
												{item.dot && (
													<span className={cn("size-1.5 rounded-full shrink-0", item.dot)} />
												)}
												{item.badge ? (
													<span
														className={cn(
															"text-[10px] px-1.5 py-0.5 rounded font-medium border",
															item.badge,
														)}
													>
														{item.value}
													</span>
												) : (
													<span
														className={cn(
															item.mono && "font-mono",
															item.statusColor,
														)}
													>
														{item.value}
													</span>
												)}
											</dd>
										</div>
									);
								})}
							</dl>
						</CardContent>
					</Card>

					{/* --- الملاحظات --- */}
					{classroom.notes && (
						<Card>
							<CardHeader className="pb-2 border-b border-border/50">
								<CardTitle className="text-sm font-bold flex items-center gap-2">
									<IconBook className="size-4 text-muted-foreground" />
									ملاحظات الفصل
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-3">
								<p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
									{classroom.notes
										.replace(/رمز_الفصل:[^\n]*/g, "")
										.replace(/نوع_الرمز:[^\n]*/g, "")
										.replace(/لون_الفصل:[^\n]*/g, "")
										.replace(/الوصف:[^\n]*/g, "")
										.replace(/الملاحظات:[^\n]*/g, "")
										.replace(/الفرع:[^\n]*/g, "")
										.replace(/التصنيف:[^\n]*/g, "")
										.trim() || "لا توجد ملاحظات مسجلة."}
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
