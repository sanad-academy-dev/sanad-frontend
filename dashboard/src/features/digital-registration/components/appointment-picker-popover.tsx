import { useState, useMemo, useEffect } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
	IconCalendarPlus,
	IconChevronLeft,
	IconChevronRight,
	IconSparkles,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { backendFetch } from "@/lib/backend-fetch";

interface AppointmentPickerPopoverProps {
	value: string;
	onChange: (value: string, isoDate?: string | null) => void;
	reviewerName?: string;
	reviewerId?: string;
	enableReminders?: boolean;
	onEnableRemindersChange?: (val: boolean) => void;
	className?: string;
}

const MONTH_NAMES_AR = [
	"يناير",
	"فبراير",
	"مارس",
	"أبريل",
	"مايو",
	"يونيو",
	"يوليو",
	"أغسطس",
	"سبتمبر",
	"أكتوبر",
	"نوفمبر",
	"ديسمبر",
];

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"];

interface TimeSlot {
	id: string;
	time: string;
	status: "available" | "unavailable" | "conflict";
	badge?: string;
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
	{ id: "slot-1", time: "10:00 صباحاً", status: "available" },
	{ id: "slot-2", time: "10:30 صباحاً", status: "unavailable", badge: "غير متاح" },
	{ id: "slot-3", time: "11:00 صباحاً", status: "available" },
	{ id: "slot-4", time: "02:00 مساءً", status: "available" },
	{ id: "slot-5", time: "02:30 مساءً", status: "unavailable", badge: "غير متاح" },
	{ id: "slot-6", time: "03:00 مساءً", status: "conflict", badge: "يوجد تعارض" },
];

export function AppointmentPickerPopover({
	value,
	onChange,
	reviewerName,
	reviewerId,
	enableReminders: externalReminders,
	onEnableRemindersChange,
	className,
}: AppointmentPickerPopoverProps) {
	const [open, setOpen] = useState(false);

	// تاريخ اليوم الفعلي
	const today = useMemo(() => new Date(), []);
	const currentRealYear = today.getFullYear();
	const currentRealMonth = today.getMonth();
	const currentRealDay = today.getDate();

	// الشهر والسنة المعروضين - يبدآن تلقائياً من تاريخ اليوم الفعلي
	const [year, setYear] = useState<number>(currentRealYear);
	const [month, setMonth] = useState<number>(currentRealMonth);

	// اليوم المحدد - يبدأ من اليوم الحالي
	const [selectedYear, setSelectedYear] = useState<number>(currentRealYear);
	const [selectedMonth, setSelectedMonth] = useState<number>(currentRealMonth);
	const [selectedDay, setSelectedDay] = useState<number | null>(currentRealDay);

	// وقت الموعد
	const [selectedSlot, setSelectedSlot] = useState<string>("10:00 صباحاً");

	// فترات الإتاحة المحسوبة ديناميكياً
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS);

	// بيانات اقتراح AI وساعات العمل
	const [aiRecommendation, setAiRecommendation] = useState<{
		isWorkingDay: boolean;
		recommendedTime: string;
		reason: string;
		workingHoursText: string;
	}>({
		isWorkingDay: true,
		recommendedTime: "10:00 صباحاً",
		reason: "الوقت الأنسب بناءً على ساعات العمل الرسمية وجدول المراجع",
		workingHoursText: "08:30 ص - 04:30 م",
	});

	// حالة AI (افتراضياً: شريط التنبيه المدمج، مع إمكانية التبديل لبطاقة الاقتراحات)
	const [aiState, setAiState] = useState<"banner" | "suggestions">("banner");

	// جلب اقتراحات الذكاء الاصطناعي وجدول المراجع عند تغيير التاريخ أو المراجع
	useEffect(() => {
		const targetDay = selectedDay || currentRealDay;
		const dObj = new Date(selectedYear, selectedMonth, targetDay);
		const dayOfWeek = dObj.getDay(); // 0: Sun, 5: Fri, 6: Sat
		const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

		const yStr = selectedYear;
		const mStr = String(selectedMonth + 1).padStart(2, "0");
		const dStr = String(targetDay).padStart(2, "0");
		const dateParam = `${yStr}-${mStr}-${dStr}`;

		const q = new URLSearchParams();
		q.set("date", dateParam);
		if (reviewerId) q.set("staffId", reviewerId);

		backendFetch<any>(`/api/digital-registration/ai-slot-recommendation?${q.toString()}`)
			.then((res) => {
				if (res) {
					if (res.slots && Array.isArray(res.slots)) {
						setTimeSlots(res.slots);
					}
					setAiRecommendation({
						isWorkingDay: res.isWorkingDay ?? !isWeekend,
						recommendedTime: res.recommendedTime || "10:00 صباحاً",
						reason:
							res.reason ||
							(isWeekend
								? "اليوم المحدد عطلة رسمية (الدوام: الأحد - الخميس)"
								: "الوقت الأنسب بدون تعارض مع جدول المراجع"),
						workingHoursText: res.workingHoursText || "08:30 ص - 04:30 م",
					});
				}
			})
			.catch(() => {
				// Fallback محلي ذكي في حالة عدم الاتصال
				if (isWeekend) {
					setAiRecommendation((prev) => ({
						...prev,
						isWorkingDay: false,
						reason: "اليوم المحدد عطلة رسمية للأكاديمية (الدوام: الأحد - الخميس)",
					}));
					setTimeSlots(
						DEFAULT_TIME_SLOTS.map((s) => ({ ...s, status: "unavailable", badge: "عطلة" })),
					);
				} else {
					setAiRecommendation((prev) => ({
						...prev,
						isWorkingDay: true,
						reason:
							reviewerName && reviewerName !== "المراجع"
								? `المراجع ${reviewerName} متاح في هذا التاريخ بدون تعارض`
								: "ساعات العمل الرسمية: 08:30 ص - 04:30 م",
					}));
					setTimeSlots(DEFAULT_TIME_SLOTS);
				}
			});
	}, [selectedDay, selectedMonth, selectedYear, reviewerId, reviewerName, currentRealDay]);

	// تفعيل التذكيرات (متزامن مع المفتاح الخارجي في تذييل النموذج)
	const [internalReminders, setInternalReminders] = useState<boolean>(false);
	const remindersActive = externalReminders !== undefined ? externalReminders : internalReminders;
	const toggleReminders = (checked: boolean) => {
		setInternalReminders(checked);
		onEnableRemindersChange?.(checked);
	};

	// هل نحن في الشهر الحالي أو السابق لمنع الرجوع للوراء لتاريخ قديم؟
	const isAtCurrentMonth =
		year < currentRealYear ||
		(year === currentRealYear && month <= currentRealMonth);

	// منع الرجوع لشهر سابق لتاريخ اليوم
	const handlePrevMonth = () => {
		if (isAtCurrentMonth) return;
		if (month === 0) {
			setMonth(11);
			setYear((y) => y - 1);
		} else {
			setMonth((m) => m - 1);
		}
	};

	const handleNextMonth = () => {
		if (month === 11) {
			setMonth(0);
			setYear((y) => y + 1);
		} else {
			setMonth((m) => m + 1);
		}
	};

	// توليد شبكة أيام التقويم للشهر المحدد (الأسبوع يبدأ من الإثنين Mo)
	const calendarDays = useMemo(() => {
		const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
		const daysInPrevMonth = new Date(year, month, 0).getDate();

		// أول يوم في الشهر من الأسبوع (0 = الأحد, 1 = الإثنين)
		const firstDayOfWeek = new Date(year, month, 1).getDay();
		// تحويل البداية للإثنين Mo
		const startOffset = (firstDayOfWeek + 6) % 7;

		const days: Array<{
			day: number;
			isCurrentMonth: boolean;
			isPast: boolean;
			isToday: boolean;
			isSelected: boolean;
		}> = [];

		// أيام الشهر السابق (غير قابلة للاختيار وتعتبر في الماضي)
		for (let i = startOffset - 1; i >= 0; i--) {
			days.push({
				day: daysInPrevMonth - i,
				isCurrentMonth: false,
				isPast: true,
				isToday: false,
				isSelected: false,
			});
		}

		// أيام الشهر الحالي مع فحص التواريخ السابقة
		for (let d = 1; d <= daysInCurrentMonth; d++) {
			const isPastDay =
				year < currentRealYear ||
				(year === currentRealYear && month < currentRealMonth) ||
				(year === currentRealYear && month === currentRealMonth && d < currentRealDay);

			const isTodayDay =
				year === currentRealYear && month === currentRealMonth && d === currentRealDay;

			const isSelectedDay =
				selectedDay === d && selectedMonth === month && selectedYear === year;

			days.push({
				day: d,
				isCurrentMonth: true,
				isPast: isPastDay,
				isToday: isTodayDay,
				isSelected: isSelectedDay,
			});
		}

		// إكمال الصفوف لأيام الشهر التالي
		const totalCells = Math.ceil(days.length / 7) * 7;
		let nextDayNum = 1;
		while (days.length < totalCells) {
			days.push({
				day: nextDayNum++,
				isCurrentMonth: false,
				isPast: false,
				isToday: false,
				isSelected: false,
			});
		}

		return days;
	}, [year, month, currentRealYear, currentRealMonth, currentRealDay, selectedDay, selectedMonth, selectedYear]);

	// تحديث القيمة الخارجية وإرسال النص المعروض بالإضافة للتاريخ المعتمد بصيغة ISO
	const syncValue = (dayNum: number | null, mIdx: number, yNum: number, slotTime: string | null) => {
		if (!dayNum) {
			onChange("تاريخ الموعد", null);
			return;
		}
		const mName = MONTH_NAMES_AR[mIdx] || "أكتوبر";
		const timeShort = slotTime ? slotTime.replace(" صباحاً", " ص").replace(" مساءً", " م") : "";
		const result = `${dayNum} ${mName}${timeShort ? ` - ${timeShort}` : ""}`;

		// حساب تاريخ ISO الدقيق للموعد
		let isoString: string | null = null;
		try {
			let hours = 10;
			let minutes = 0;
			if (slotTime) {
				const isPM = slotTime.includes("مساءً") || slotTime.includes("م");
				const match = slotTime.match(/(\d+):(\d+)/);
				if (match) {
					hours = parseInt(match[1], 10);
					minutes = parseInt(match[2], 10);
					if (isPM && hours < 12) hours += 12;
					if (!isPM && hours === 12) hours = 0;
				}
			}
			const d = new Date(yNum, mIdx, dayNum, hours, minutes, 0);
			if (!isNaN(d.getTime())) {
				isoString = d.toISOString();
			}
		} catch {
			// ignore
		}

		onChange(result, isoString);
	};

	const handleSelectDay = (d: number, isPast: boolean, isCurrent: boolean) => {
		if (isPast || !isCurrent) return; // ممنوع اختيار تواريخ ماضية
		setSelectedDay(d);
		setSelectedMonth(month);
		setSelectedYear(year);
		syncValue(d, month, year, selectedSlot);
	};

	const handleSelectSlot = (slot: TimeSlot) => {
		if (slot.status !== "available") return;
		setSelectedSlot(slot.time);
		syncValue(selectedDay, selectedMonth, selectedYear, slot.time);
	};

	const handleReset = () => {
		setSelectedDay(null);
		setSelectedSlot("");
		setEnableReminders(false);
		onChange("تاريخ الموعد", null);
		setOpen(false);
	};

	const isCustomSelected = value && value !== "تاريخ الموعد";

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"h-6.5 px-2 rounded-md border text-[10.5px] font-medium flex items-center gap-1 transition-colors cursor-pointer",
						isCustomSelected
							? "border-[#4F6BF5]/40 bg-[#4F6BF5]/10 text-[#4F6BF5] font-semibold"
							: "border-border/80 bg-background hover:bg-muted text-foreground",
						className,
					)}
				>
					<span>{value || "تاريخ الموعد"}</span>
					<IconCalendarPlus className="size-3 text-muted-foreground/80" />
				</button>
			</PopoverTrigger>

			<PopoverContent
				side="top"
				align="start"
				sideOffset={8}
				data-radix-scroll-lock-ignore
				className="z-[99] w-[305px] p-0 bg-card text-foreground border border-border/80 shadow-2xl rounded-xl select-none overflow-hidden"
				dir="rtl"
			>
				<div
					data-radix-scroll-lock-ignore
					style={{ overscrollBehavior: "contain" }}
					onWheel={(e) => {
						e.stopPropagation();
						const el = e.currentTarget;
						const maxScroll = el.scrollHeight - el.clientHeight;
						if (maxScroll <= 0) return;
						let delta = e.deltaY;
						if (e.deltaMode === 1) delta *= 36;
						else if (e.deltaMode === 2) delta *= el.clientHeight;
						const target = Math.max(0, Math.min(maxScroll, el.scrollTop + delta));
						if (target !== el.scrollTop) {
							el.scrollTop = target;
						}
					}}
					className="max-h-[min(510px,calc(100vh-120px))] overflow-y-auto overscroll-contain p-2 space-y-1 [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted-foreground)/0.3)_transparent]"
				>
				{/* ─── 1. ترويسة التقويم (الشهر والسنة + أسهم التنقل المحمية) ──── */}
				<div className="flex items-center justify-between pb-1 mb-1 border-b border-border/40">
					{/* سهم الشهر السابق - معطل إذا كنا في الشهر الحالي لمنع الرجوع للماضي */}
					<button
						type="button"
						disabled={isAtCurrentMonth}
						onClick={handlePrevMonth}
						className={cn(
							"size-6 rounded-md flex items-center justify-center transition-colors",
							isAtCurrentMonth
								? "opacity-25 cursor-not-allowed text-muted-foreground"
								: "hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer",
						)}
						title={isAtCurrentMonth ? "لا يمكن العودة لشهر سابق" : "الشهر السابق"}
					>
						<IconChevronRight className="size-3.5" />
					</button>

					<span className="text-[11.5px] font-bold text-foreground">
						{MONTH_NAMES_AR[month]} {year}
					</span>

					{/* سهم الشهر القادم */}
					<button
						type="button"
						onClick={handleNextMonth}
						className="size-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
						title="الشهر التالي"
					>
						<IconChevronLeft className="size-3.5" />
					</button>
				</div>

				{/* ─── 2. شبكة أيام الأسبوع والتقويم (Mo -> Su) بدقة متناهية ──── */}
				<div dir="ltr" className="mb-1">
					{/* صف أسماء الأيام */}
					<div className="grid grid-cols-7 text-center text-[9.5px] font-semibold text-muted-foreground/75 mb-0.5">
						{WEEKDAYS.map((wd) => (
							<div key={wd} className="py-0.5">
								{wd}
							</div>
						))}
					</div>

					{/* شبكة الأيام بارتفاع دقيق 24px بدون تسبب بأي scrollbar */}
					<div className="grid grid-cols-7 gap-y-0.5 gap-x-0.5 text-center">
						{calendarDays.map((c, idx) => {
							if (!c.isCurrentMonth) {
								return (
									<div
										key={idx}
										className="size-6 flex items-center justify-center mx-auto text-muted-foreground/25 text-[10px]"
									>
										{c.day}
									</div>
								);
							}

							if (c.isPast) {
								return (
									<div
										key={idx}
										className="size-6 flex items-center justify-center mx-auto rounded-full text-[10.5px] text-muted-foreground/30 cursor-not-allowed select-none"
										title="تاريخ سابق غير متاح للحجز"
									>
										{c.day}
									</div>
								);
							}

							return (
								<button
									key={idx}
									type="button"
									onClick={() => handleSelectDay(c.day, c.isPast, c.isCurrentMonth)}
									className={cn(
										"size-6 flex items-center justify-center mx-auto rounded-full text-[10.5px] font-medium transition-all cursor-pointer",
										c.isSelected
											? "bg-[#5B50E5] text-white font-bold shadow-xs hover:bg-[#4E43D8]"
											: c.isToday
												? "border border-[#5B50E5] text-[#5B50E5] font-bold hover:bg-[#5B50E5]/10"
												: "hover:bg-muted text-foreground",
									)}
								>
									{c.day}
								</button>
							);
						})}
					</div>
				</div>

				{/* ─── 3. قسم AI (شريط ساعات العمل التنبيهي أو بطاقة الاقتراحات) ─ */}
				{aiState === "banner" ? (
					/* الحالة الأولى: شريط ساعات العمل التنبيهي مطابق للصورة 09e02342 */
					<div
						className={cn(
							"border rounded-md px-2 py-1.5 flex items-center justify-between gap-1 select-none my-1",
							!aiRecommendation.isWorkingDay
								? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60"
								: "bg-[#FFF1F2] dark:bg-rose-950/30 border-[#FFE4E6] dark:border-rose-900/50",
						)}
					>
						{/* اليمين: الأيقونة والنص التحذيري */}
						<div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-[10.5px]">
							<IconSparkles className="size-3 text-rose-500 shrink-0" />
							<span>
								{!aiRecommendation.isWorkingDay
									? "اليوم المحدد عطلة رسمية للأكاديمية"
									: "خصص أيام وساعات عمل منشأتك"}
							</span>
						</div>

						{/* الشمال: أزرار التخصيص والتجاهل */}
						<div className="flex items-center gap-2 text-[10px]">
							<button
								type="button"
								onClick={() => setAiState("suggestions")}
								className="text-[#2563EB] dark:text-blue-400 font-bold hover:underline cursor-pointer"
								title="عرض اقتراحات رفيق AI"
							>
								تخصيص
							</button>
							<button
								type="button"
								onClick={() => setAiState("suggestions")}
								className="text-[#C2410C] dark:text-orange-400 font-bold hover:underline cursor-pointer"
								title="تجاهل التنبيه"
							>
								تجاهل
							</button>
						</div>
					</div>
				) : (
					/* الحالة الثانية: بطاقة اقتراحات رفيق AI التفاعلية */
					<div className="bg-[#FFFDF5] dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-lg p-2 my-1 text-right space-y-1.5">
						<div className="flex items-center justify-between border-b border-amber-200/50 pb-1">
							<button
								type="button"
								onClick={() => setAiState("banner")}
								className="text-[9px] text-amber-700 dark:text-amber-300 hover:underline cursor-pointer font-medium"
							>
								الرجوع للتنبيه
							</button>
							<div className="flex items-center gap-1 text-amber-800 dark:text-amber-400 font-bold text-[10.5px]">
								<IconSparkles className="size-3.5 text-amber-500" />
								<span>اقتراحات رفيق AI الذكية</span>
							</div>
						</div>
						<div className="text-[9.5px] text-amber-800/90 dark:text-amber-300/90 space-y-1 font-medium leading-tight">
							<p className="flex items-center gap-1.5">
								<span
									className={cn(
										"size-1.5 rounded-full inline-block shrink-0",
										aiRecommendation.isWorkingDay ? "bg-emerald-500" : "bg-rose-500",
									)}
								/>
								<span>
									{reviewerName && reviewerName !== "المراجع"
										? `المراجع: ${reviewerName} (${aiRecommendation.isWorkingDay ? "متاح" : "عطلة"})`
										: `الدوام الرسمي: ${aiRecommendation.workingHoursText}`}
								</span>
							</p>
							<p className="flex items-center gap-1.5">
								<span className="size-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
								<span>الوقت الأنسب: {aiRecommendation.recommendedTime} ({aiRecommendation.reason})</span>
							</p>
						</div>

						{/* زر اعتماد اقتراح AI بضغطة واحدة وتطبيقه فوراً */}
						<button
							type="button"
							onClick={() => {
								const targetDay = selectedDay || currentRealDay;
								handleSelectDay(targetDay, false, true);
								const targetSlot =
									timeSlots.find((s) => s.time === aiRecommendation.recommendedTime) ||
									timeSlots.find((s) => s.status === "available") ||
									timeSlots[0];
								if (targetSlot) handleSelectSlot(targetSlot);
							}}
							className="w-full py-1 px-2 rounded-md bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-amber-300 dark:border-amber-700"
						>
							<IconSparkles className="size-3 text-amber-600 dark:text-amber-400" />
							<span>
								تطبيق اقتراح AI الموصى به (
								{aiRecommendation.recommendedTime.replace(" صباحاً", " ص").replace(" مساءً", " م")}
								)
							</span>
						</button>
					</div>
				)}

				{/* ─── 4. قسم وقت الإتاحة ───────────────────────────────────── */}
				<div className="space-y-1 mb-1.5">
					<div className="flex items-center justify-between text-[10.5px]">
						<span className="font-bold text-foreground">وقت الإتاحة</span>
						<span className="text-[8.5px] text-muted-foreground">
							جميع الإتاحات حسب منطقتك
						</span>
					</div>

					<div className="grid grid-cols-3 gap-1">
						{timeSlots.map((slot) => {
							const isSelected = selectedSlot === slot.time;
							const isAvailable = slot.status === "available";

							return (
								<button
									key={slot.id}
									type="button"
									disabled={!isAvailable}
									onClick={() => handleSelectSlot(slot)}
									className={cn(
										"h-6 px-1 rounded-md border text-[9px] font-medium flex items-center justify-center gap-0.5 transition-all",
										isAvailable
											? isSelected
												? "border-[#5B50E5] bg-[#5B50E5]/10 text-[#5B50E5] font-bold shadow-2xs"
												: "border-border/80 bg-background hover:bg-muted text-foreground cursor-pointer"
											: "border-border/40 bg-muted/20 text-muted-foreground/50 cursor-not-allowed",
									)}
								>
									<span>{slot.time.replace(" صباحاً", " ص").replace(" مساءً", " م")}</span>
									{slot.badge && (
										<span
											className={cn(
												"px-0.5 py-0.2 rounded text-[7px] font-bold leading-none shrink-0",
												slot.status === "conflict"
													? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
													: "bg-muted text-muted-foreground/75",
											)}
										>
											{slot.badge}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* ─── 5. تفعيل التذكيرات ───────────────────────────────────── */}
				<div className="pt-1.5 mb-1 border-t border-border/40">
					<div className="flex items-center justify-between">
						<Switch
							checked={remindersActive}
							onCheckedChange={toggleReminders}
							className="scale-75 origin-left"
						/>
						<div className="text-right">
							<div className="text-[10px] font-bold text-foreground">تفعيل التذكيرات</div>
							<div className="text-[8.5px] text-muted-foreground">
								تذكير المستخدم عبر الواتساب قبل الموعد بـ 24 ساعة
							</div>
						</div>
					</div>
				</div>

				{/* ─── 6. تذييل Popover: إعادة الضبط ─────────────────────────── */}
				<div className="pt-1 border-t border-border/40 text-center">
					<button
						type="button"
						onClick={handleReset}
						className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					>
						إعادة الضبط
					</button>
				</div>
			</div>
			</PopoverContent>
		</Popover>
	);
}
