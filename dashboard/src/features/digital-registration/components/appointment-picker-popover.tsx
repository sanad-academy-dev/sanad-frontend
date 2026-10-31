import { useState, useMemo, useEffect, useRef } from "react";
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
	IconClock,
	IconCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { backendFetch } from "@/lib/backend-fetch";

interface AppointmentPickerPopoverProps {
	value: string;
	onChange: (value: string, isoDate?: string | null) => void;
	reviewerName?: string;
	reviewerId?: string;
	enableReminders?: boolean;
	onEnableRemindersChange?: (val: boolean) => void;
	enableRecurrence?: boolean;
	onEnableRecurrenceChange?: (val: boolean) => void;
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
	startMinute: number;
	status: "available" | "unavailable" | "conflict";
	badge?: string;
}

const BASE_SLOT_DEFS: { id: string; time: string; startMinute: number }[] = [
	{ id: "slot-1", time: "09:00 صباحاً", startMinute: 540 },
	{ id: "slot-2", time: "09:30 صباحاً", startMinute: 570 },
	{ id: "slot-3", time: "10:00 صباحاً", startMinute: 600 },
	{ id: "slot-4", time: "10:30 صباحاً", startMinute: 630 },
	{ id: "slot-5", time: "11:00 صباحاً", startMinute: 660 },
	{ id: "slot-6", time: "11:30 صباحاً", startMinute: 690 },
	{ id: "slot-7", time: "01:00 مساءً", startMinute: 780 },
	{ id: "slot-8", time: "01:30 مساءً", startMinute: 810 },
	{ id: "slot-9", time: "02:00 مساءً", startMinute: 840 },
	{ id: "slot-10", time: "02:30 مساءً", startMinute: 870 },
	{ id: "slot-11", time: "03:00 مساءً", startMinute: 900 },
	{ id: "slot-12", time: "03:30 مساءً", startMinute: 930 },
	{ id: "slot-13", time: "04:00 مساءً", startMinute: 960 },
];

/** حساب فترات الإتاحة الذكية فورياً مع حظر الساعات الماضية لليوم فقط (مفيش أيام عطلة - جميع الأيام متاحة) */
function computeSmartSlots(targetDay: number, targetMonth: number, targetYear: number): TimeSlot[] {
	const now = new Date();
	const isToday =
		targetYear === now.getFullYear() &&
		targetMonth === now.getMonth() &&
		targetDay === now.getDate();

	const isPastDay =
		targetYear < now.getFullYear() ||
		(targetYear === now.getFullYear() && targetMonth < now.getMonth()) ||
		(targetYear === now.getFullYear() && targetMonth === now.getMonth() && targetDay < now.getDate());

	const currentMinuteNow = now.getHours() * 60 + now.getMinutes();

	return BASE_SLOT_DEFS.map((s) => {
		const isPastHour = isToday && s.startMinute <= currentMinuteNow + 20;

		let status: "available" | "unavailable" | "conflict" = "available";
		let badge: string | undefined = undefined;

		if (isPastDay) {
			status = "unavailable";
			badge = "مضى";
		} else if (isPastHour) {
			status = "unavailable";
			badge = "مضى";
		}

		return {
			...s,
			status,
			badge,
		};
	});
}

export function AppointmentPickerPopover({
	value,
	onChange,
	reviewerName,
	reviewerId,
	enableReminders: externalReminders,
	onEnableRemindersChange,
	enableRecurrence: externalRecurrence,
	onEnableRecurrenceChange,
	className,
}: AppointmentPickerPopoverProps) {
	const [open, setOpen] = useState(false);

	// مراجع التمرير وحاوية البوبوفر للتحكم في التمرير بعجلة الماوس بشكل أصلي
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const popoverContentRef = useRef<HTMLDivElement>(null);

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

	// وقت الموعد المحدد
	const [selectedSlot, setSelectedSlot] = useState<string>("");

	// وضع اختيار الوقت: فترات محددة أو وقت مخصص بحرية
	const [timeMode, setTimeMode] = useState<"presets" | "custom">("presets");

	// متحكمات الوقت المخصص
	const [customHour, setCustomHour] = useState<number>(10);
	const [customMinute, setCustomMinute] = useState<number>(0);
	const [customPeriod, setCustomPeriod] = useState<"AM" | "PM">("AM");

	// فترات الإتاحة المحسوبة ديناميكياً
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() =>
		computeSmartSlots(currentRealDay, currentRealMonth, currentRealYear),
	);

	// يوم العمل القادم المقترح من AI
	const [nextWorkingDate, setNextWorkingDate] = useState<{
		isoDate: string;
		formattedDate: string;
		recommendedTime: string;
		dayNameAr: string;
	} | null>(null);

	// بيانات اقتراح AI وساعات العمل
	const [aiRecommendation, setAiRecommendation] = useState<{
		isWorkingDay: boolean;
		recommendedTime: string;
		reason: string;
		workingHoursText: string;
	}>({
		isWorkingDay: true,
		recommendedTime: "",
		reason: "اختر موعداً متاحاً أو اعتمد اقتراح AI",
		workingHoursText: "09:00 ص - 04:30 م",
	});

	// حالة AI (شريط مدمج banner أو بطاقة الاقتراحات suggestions)
	const [aiState, setAiState] = useState<"banner" | "suggestions">("banner");

	// تفعيل التكرار (جدولة زيارات متكررة)
	const [recurrenceActive, setRecurrenceActive] = useState<boolean>(false);

	// هل اليوم المحدد هو اليوم الفعلي الحالي؟
	const isTodaySelected =
		selectedYear === currentRealYear &&
		selectedMonth === currentRealMonth &&
		selectedDay === currentRealDay;

	// الوقت الحالي بالدقائق من منتصف الليل وفترة السماح
	const currentMinuteNow = useMemo(() => {
		const now = new Date();
		return now.getHours() * 60 + now.getMinutes();
	}, [open, selectedDay]);

	// عدد الفترات المتاحة (معرّف قبل useEffect لمنع أخطاء TDZ)
	const availableSlotsCount = useMemo(() => {
		return timeSlots.filter((slot) => {
			const isPastHour = isTodaySelected && slot.startMinute <= currentMinuteNow + 20;
			return slot.status === "available" && !isPastHour;
		}).length;
	}, [timeSlots, isTodaySelected, currentMinuteNow]);

	// تفعيل التمرير بعجلة الماوس بشكل أصلي (سلس بماوس عادي وبنفس منطق النموذج)
	useEffect(() => {
		const scrollEl = scrollContainerRef.current;
		const popoverEl = popoverContentRef.current;
		if (!open || !scrollEl) return;

		const handleNativeWheel = (e: WheelEvent) => {
			e.stopPropagation();

			const { scrollTop, scrollHeight, clientHeight } = scrollEl;
			const maxScroll = scrollHeight - clientHeight;
			if (maxScroll <= 0) return;

			let delta = e.deltaY;
			if (e.deltaMode === 1) {
				delta *= 36;
			} else if (e.deltaMode === 2) {
				delta *= clientHeight;
			}

			const targetScrollTop = Math.max(0, Math.min(maxScroll, scrollTop + delta));
			if (targetScrollTop !== scrollTop) {
				e.preventDefault();
				scrollEl.scrollTop = targetScrollTop;
			}
		};

		scrollEl.addEventListener("wheel", handleNativeWheel, { passive: false });
		popoverEl?.addEventListener("wheel", handleNativeWheel, { passive: false });

		return () => {
			scrollEl.removeEventListener("wheel", handleNativeWheel);
			popoverEl?.removeEventListener("wheel", handleNativeWheel);
		};
	}, [open, timeMode, aiState]);

	// استعادة الموعد المختار إن وجد
	useEffect(() => {
		if (value && value !== "تاريخ الموعد") {
			const timeMatch = value.match(/(\d+):(\d+)\s*(صباحاً|مساءً|ص|م)?/);
			if (timeMatch) {
				const rawH = parseInt(timeMatch[1], 10);
				const rawM = parseInt(timeMatch[2], 10);
				const periodStr = timeMatch[3];
				const isPM = periodStr ? periodStr.includes("م") || periodStr.includes("مساءً") : rawH >= 12;
				setCustomHour(rawH > 12 ? rawH - 12 : rawH === 0 ? 12 : rawH);
				setCustomMinute(rawM);
				setCustomPeriod(isPM ? "PM" : "AM");
			}
		}
	}, [value]);

	// جلب اقتراحات الذكاء الاصطناعي وجدول المراجع عند تغيير التاريخ أو المراجع
	useEffect(() => {
		const targetDay = selectedDay || currentRealDay;

		setTimeSlots(computeSmartSlots(targetDay, selectedMonth, selectedYear));

		const yStr = selectedYear;
		const mStr = String(selectedMonth + 1).padStart(2, "0");
		const dStr = String(targetDay).padStart(2, "0");
		const dateParam = `${yStr}-${mStr}-${dStr}`;

		const q = new URLSearchParams();
		q.set("date", dateParam);
		if (reviewerId) q.set("staffId", reviewerId);

		backendFetch(`/api/digital-registration/ai-slot-recommendation?${q.toString()}`)
			.then(async (res) => {
				if (res && res.ok) {
					const data = await res.json();
					if (data && data.slots && Array.isArray(data.slots)) {
						const validatedSlots = data.slots.map((s: TimeSlot) => {
							const isPast = isTodaySelected && s.startMinute <= currentMinuteNow + 20;
							if (isPast) {
								return { ...s, status: "unavailable", badge: "مضى" };
							}
							return s;
						});
						setTimeSlots(validatedSlots);
					}
					setAiRecommendation({
						isWorkingDay: true,
						recommendedTime: data.recommendedTime || "",
						reason:
							data.reason ||
							(isTodaySelected && availableSlotsCount === 0
								? "انتهت فترات العمل المتاحة لهذا اليوم"
								: "الوقت الأنسب بدون أي تعارض مع جدول المراجع"),
						workingHoursText: data.workingHoursText || "09:00 ص - 04:30 م",
					});
					if (data.nextWorkingDate) {
						setNextWorkingDate(data.nextWorkingDate);
					} else {
						setNextWorkingDate(null);
					}
				}
			})
			.catch(() => {
				if (isTodaySelected) {
					setAiRecommendation({
						isWorkingDay: true,
						recommendedTime: "",
						reason: "انتهت مواعيد وساعات العمل المتاحة لليوم",
						workingHoursText: "09:00 ص - 04:30 م",
					});
				} else {
					setAiRecommendation({
						isWorkingDay: true,
						recommendedTime: "10:00 صباحاً",
						reason: "الوقت الأنسب بدون أي تعارض",
						workingHoursText: "09:00 ص - 04:30 م",
					});
				}
			});
	}, [selectedYear, selectedMonth, selectedDay, reviewerId, currentRealDay, isTodaySelected, currentMinuteNow, availableSlotsCount]);

	// حماية الموعد المحدد: يمنع بقاء أي ساعة مضت لليوم الحالي
	useEffect(() => {
		if (isTodaySelected && selectedSlot) {
			const matchingSlot = timeSlots.find((s) => s.time === selectedSlot);
			let slotMin = matchingSlot?.startMinute;
			if (slotMin === undefined) {
				const match = selectedSlot.match(/(\d+):(\d+)/);
				if (match) {
					let h = parseInt(match[1], 10);
					const m = parseInt(match[2], 10);
					const isPM = selectedSlot.includes("مساءً") || selectedSlot.includes("م");
					if (isPM && h < 12) h += 12;
					if (!isPM && h === 12) h = 0;
					slotMin = h * 60 + m;
				}
			}

			if (slotMin !== undefined && slotMin <= currentMinuteNow + 20) {
				const upcomingSlot = timeSlots.find(
					(s) => s.status === "available" && s.startMinute > currentMinuteNow + 20,
				);
				if (upcomingSlot) {
					setSelectedSlot(upcomingSlot.time);
					syncValue(selectedDay, selectedMonth, selectedYear, upcomingSlot.time);
				} else {
					setSelectedSlot("");
					syncValue(selectedDay, selectedMonth, selectedYear, null);
				}
			}
		}
	}, [isTodaySelected, timeSlots, selectedDay, selectedMonth, selectedYear, selectedSlot, currentMinuteNow]);

	// تفعيل التذكيرات
	const [internalReminders, setInternalReminders] = useState<boolean>(false);
	const remindersActive = externalReminders !== undefined ? externalReminders : internalReminders;
	const toggleReminders = (checked: boolean) => {
		setInternalReminders(checked);
		onEnableRemindersChange?.(checked);
	};

	// فحص حدود الشهر الحالي
	const isAtCurrentMonth =
		year < currentRealYear ||
		(year === currentRealYear && month <= currentRealMonth);

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

	// توليد شبكة التقويم
	const calendarDays = useMemo(() => {
		const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
		const daysInPrevMonth = new Date(year, month, 0).getDate();

		const firstDayOfWeek = new Date(year, month, 1).getDay();
		const startOffset = (firstDayOfWeek + 6) % 7;

		const days: Array<{
			day: number;
			isCurrentMonth: boolean;
			isPast: boolean;
			isToday: boolean;
			isSelected: boolean;
		}> = [];

		for (let i = startOffset - 1; i >= 0; i--) {
			days.push({
				day: daysInPrevMonth - i,
				isCurrentMonth: false,
				isPast: true,
				isToday: false,
				isSelected: false,
			});
		}

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

	// تحديث القيمة الخارجية والمزامنة مع ISO
	const syncValue = (dayNum: number | null, mIdx: number, yNum: number, slotTime: string | null) => {
		if (!dayNum) {
			onChange("تاريخ الموعد", null);
			return;
		}
		const mName = MONTH_NAMES_AR[mIdx] || "أكتوبر";
		const isToday =
			yNum === currentRealYear && mIdx === currentRealMonth && dayNum === currentRealDay;

		const dayLabel = isToday ? "اليوم" : `${dayNum} ${mName}`;
		const result = slotTime ? `${dayLabel} - ${slotTime}` : dayLabel;

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
		if (isPast || !isCurrent) return;
		setSelectedDay(d);
		setSelectedMonth(month);
		setSelectedYear(year);

		const isNowToday = year === currentRealYear && month === currentRealMonth && d === currentRealDay;
		let validSlot = selectedSlot;
		if (isNowToday) {
			const matching = timeSlots.find((s) => s.time === selectedSlot);
			if (matching && matching.startMinute <= currentMinuteNow + 20) {
				validSlot = "";
			}
		}

		syncValue(d, month, year, validSlot || null);
	};

	const handleSelectSlot = (slot: TimeSlot) => {
		const isPastHour = isTodaySelected && slot.startMinute <= currentMinuteNow + 20;
		if (slot.status !== "available" || isPastHour) return;

		const targetDay = selectedDay || currentRealDay;
		if (!selectedDay) {
			setSelectedDay(targetDay);
		}

		setSelectedSlot(slot.time);
		syncValue(targetDay, selectedMonth, selectedYear, slot.time);
		setOpen(false);
	};

	// اعتماد الوقت المخصص
	const handleApplyCustomTime = () => {
		const targetDay = selectedDay || currentRealDay;
		if (!selectedDay) {
			setSelectedDay(targetDay);
		}

		const formattedTime = `${String(customHour).padStart(2, "0")}:${String(customMinute).padStart(2, "0")} ${customPeriod === "AM" ? "صباحاً" : "مساءً"}`;

		if (isTodaySelected) {
			let chosenMinutes = customHour * 60 + customMinute;
			if (customPeriod === "PM" && customHour < 12) chosenMinutes += 720;
			if (customPeriod === "AM" && customHour === 12) chosenMinutes = customMinute;
			if (chosenMinutes <= currentMinuteNow) {
				toast.warning("ملاحظة: هذا الوقت قد مضى اليوم، يُفضل اختيار وقت قادم أو تغيير اليوم.");
			}
		}

		setSelectedSlot(formattedTime);
		syncValue(targetDay, selectedMonth, selectedYear, formattedTime);
		toast.success(`تم اختيار الموعد المخصص: ${formattedTime}`);
		setOpen(false);
	};

	const handleReset = () => {
		setSelectedDay(null);
		setSelectedSlot("");
		toggleReminders(false);
		setRecurrenceActive(false);
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
						"h-6.5 px-2.5 rounded-md border text-[10.5px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer select-none",
						isCustomSelected
							? "border-[#5B50E5]/50 bg-[#5B50E5]/10 text-[#5B50E5] font-semibold"
							: "border-border/80 bg-background hover:bg-muted text-foreground",
						className,
					)}
				>
					<span>{value || "تاريخ الموعد"}</span>
					<IconCalendarPlus className="size-3 text-muted-foreground/80" />
				</button>
			</PopoverTrigger>

			<PopoverContent
				ref={popoverContentRef}
				side="top"
				align="start"
				sideOffset={6}
				avoidCollisions={true}
				collisionPadding={8}
				data-radix-scroll-lock-ignore
				style={{
					maxHeight: "min(580px, var(--radix-popover-content-available-height, 580px))",
				}}
				className="z-[99] w-[390px] flex flex-col gap-0 p-0 bg-white dark:bg-zinc-950 text-popover-foreground border border-border/80 shadow-2xl rounded-xl select-none overflow-hidden"
				dir="rtl"
			>
				{/* ─── 1. ترويسة الشهر والتنقل الثابتة (Fixed Header - لا تختفي أبداً) ──── */}
				<div className="shrink-0 px-4 py-2.5 border-b border-border/70 flex items-center justify-between bg-white dark:bg-zinc-950 select-none">
					<button
						type="button"
						disabled={isAtCurrentMonth}
						onClick={handlePrevMonth}
						className={cn(
							"size-7 rounded-md flex items-center justify-center transition-colors",
							isAtCurrentMonth
								? "opacity-25 cursor-not-allowed text-muted-foreground"
								: "hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer",
						)}
						title={isAtCurrentMonth ? "لا يمكن العودة لشهر سابق" : "الشهر السابق"}
					>
						<IconChevronRight className="size-4" />
					</button>

					<span className="text-xs font-bold text-foreground">
						{MONTH_NAMES_AR[month]} {year}
					</span>

					<button
						type="button"
						onClick={handleNextMonth}
						className="size-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
						title="الشهر التالي"
					>
						<IconChevronLeft className="size-4" />
					</button>
				</div>

				{/* ─── 2. مساحة التمرير السلسة (مطابقة تماماً للنموذج وتعمل بماوس عادي) ──── */}
				<div
					ref={scrollContainerRef}
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
					className="flex-1 min-h-0 overflow-y-auto overscroll-contain sanad-scrollbar pr-3.5 pl-2.5 py-3 space-y-2.5 select-none"
				>
					{/* شبكة أيام التقويم (Mo -> Su) */}
					<div dir="ltr" className="select-none">
						<div className="grid grid-cols-7 text-center text-[10.5px] font-bold text-muted-foreground/75 mb-1">
							{WEEKDAYS.map((wd) => (
								<div key={wd} className="py-0.5">
									{wd}
								</div>
							))}
						</div>

						<div className="grid grid-cols-7 gap-1 text-center">
							{calendarDays.map((c, idx) => {
								if (!c.isCurrentMonth) {
									return (
										<div
											key={idx}
											className="size-7.5 flex items-center justify-center mx-auto text-muted-foreground/25 text-[10.5px]"
										>
											{c.day}
										</div>
									);
								}

								if (c.isPast) {
									return (
										<div
											key={idx}
											className="size-7.5 flex items-center justify-center mx-auto rounded-full text-[10.5px] text-muted-foreground/30 cursor-not-allowed select-none"
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
											"size-7.5 flex items-center justify-center mx-auto rounded-full text-[11px] font-medium transition-all cursor-pointer",
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

					{/* ─── 3. قسم AI (ذكي، أنيق، ومريح المساحة بدون أي تداخل) ─── */}
					{aiState === "banner" ? (
						<div
							className={cn(
								"border rounded-lg px-3 py-2 flex items-center justify-between gap-2 select-none transition-all",
								isTodaySelected && availableSlotsCount === 0
									? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/60"
									: "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200/60 dark:border-indigo-900/40",
							)}
						>
							<div className="flex items-center gap-1.5 font-bold text-[10.5px] truncate flex-1 min-w-0 text-foreground/90">
								<IconSparkles className="size-3.5 text-[#5B50E5] shrink-0" />
								<span className="truncate">
									{isTodaySelected && availableSlotsCount === 0
										? "انتهت مواعيد اليوم — اضغط لاقتراح موعد"
										: "حدد موعد الزيارة أو اختر من اقتراحات AI"}
								</span>
							</div>

							<button
								type="button"
								onClick={() => setAiState("suggestions")}
								className="h-6 px-2.5 text-[10px] text-[#5B50E5] dark:text-indigo-400 font-bold hover:underline cursor-pointer bg-card rounded border border-indigo-200/50 shadow-2xs shrink-0 flex items-center gap-1"
								title="عرض اقتراحات رفيق AI"
							>
								<span>اقتراح AI</span>
							</button>
						</div>
					) : (
						<div className="bg-[#FFFDF5] dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-lg p-2.5 text-right space-y-1.5 transition-all">
							<div className="flex items-center justify-between border-b border-amber-200/50 pb-1">
								<button
									type="button"
									onClick={() => setAiState("banner")}
									className="text-[9.5px] text-amber-700 dark:text-amber-300 hover:underline cursor-pointer font-medium"
								>
									إخفاء التفاصيل
								</button>
								<div className="flex items-center gap-1 text-amber-800 dark:text-amber-400 font-bold text-[10.5px]">
									<IconSparkles className="size-3 text-amber-500" />
									<span>اقتراح رفيق AI الذكي</span>
								</div>
							</div>

							<div className="text-[10px] text-amber-800/90 dark:text-amber-300/90 space-y-0.5 font-medium leading-tight">
								<p className="flex items-center gap-1.5 truncate">
									<span
										className={cn(
											"size-1.5 rounded-full inline-block shrink-0",
											!isTodaySelected || availableSlotsCount > 0
												? "bg-emerald-500"
												: "bg-amber-500",
										)}
									/>
									<span className="truncate">
										{reviewerName && reviewerName !== "المراجع"
											? `المراجع: ${reviewerName}`
											: `ساعات العمل: ${aiRecommendation.workingHoursText}`}
									</span>
								</p>

								<p className="flex items-start gap-1.5">
									<span className="size-1.5 rounded-full bg-amber-500 inline-block shrink-0 mt-0.5" />
									<span className="line-clamp-2 leading-tight">{aiRecommendation.reason}</span>
								</p>
							</div>

							{/* زر اعتماد اقتراح AI أو الانتقال للغد */}
							{availableSlotsCount > 0 && aiRecommendation.recommendedTime ? (
								<button
									type="button"
									onClick={() => {
										const targetDay = selectedDay || currentRealDay;
										setSelectedDay(targetDay);
										setSelectedMonth(month);
										setSelectedYear(year);

										const targetSlot =
											timeSlots.find(
												(s) =>
													s.time === aiRecommendation.recommendedTime &&
													s.status === "available" &&
													(!isTodaySelected || s.startMinute > currentMinuteNow + 20),
											) ||
											timeSlots.find(
												(s) =>
													s.status === "available" &&
													(!isTodaySelected || s.startMinute > currentMinuteNow + 20),
											);
										if (targetSlot) {
											setSelectedSlot(targetSlot.time);
											syncValue(targetDay, month, year, targetSlot.time);
										}
									}}
									className="w-full h-7 rounded-md bg-[#5B50E5] hover:bg-[#4E43D8] text-white font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
								>
									<IconSparkles className="size-3.5" />
									<span>
										تطبيق موعد ({aiRecommendation.recommendedTime.replace(" صباحاً", " ص").replace(" مساءً", " م")})
									</span>
								</button>
							) : nextWorkingDate ? (
								<button
									type="button"
									onClick={() => {
										const [y, m, d] = nextWorkingDate.isoDate.split("-").map(Number);
										setYear(y);
										setMonth(m - 1);
										setSelectedYear(y);
										setSelectedMonth(m - 1);
										setSelectedDay(d);
										setSelectedSlot(nextWorkingDate.recommendedTime);
										syncValue(d, m - 1, y, nextWorkingDate.recommendedTime);
									}}
									className="w-full h-7 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
								>
									<IconSparkles className="size-3.5" />
									<span>
										الانتقال ليوم {nextWorkingDate.dayNameAr} {nextWorkingDate.formattedDate} ({nextWorkingDate.recommendedTime.replace(" صباحاً", " ص").replace(" مساءً", " م")})
									</span>
								</button>
							) : (
								<div className="text-[10px] text-muted-foreground text-center py-0.5">
									لا توجد فترات متاحة للحجز في هذا اليوم
								</div>
							)}
						</div>
					)}

					{/* ─── 4. قسم وقت الإتاحة مع خيار الوقت المخصص ─── */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="font-bold text-[11.5px] text-foreground">وقت الإتاحة</span>
							<div className="flex items-center bg-muted/80 p-0.5 rounded-md border border-border/60">
								<button
									type="button"
									onClick={() => setTimeMode("presets")}
									className={cn(
										"h-5.5 px-2.5 rounded text-[10px] font-bold transition-all cursor-pointer",
										timeMode === "presets"
											? "bg-background text-foreground shadow-xs"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									فترات محددة
								</button>
								<button
									type="button"
									onClick={() => {
										setTimeMode("custom");
										setTimeout(() => {
											scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: "smooth" });
										}, 50);
									}}
									className={cn(
										"h-5.5 px-2.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1",
										timeMode === "custom"
											? "bg-[#5B50E5] text-white shadow-xs"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									<IconClock className="size-3" />
									<span>وقت مخصص</span>
								</button>
							</div>
						</div>

						{timeMode === "presets" ? (
							<div className="space-y-1.5">
								<div className="grid grid-cols-4 gap-1.5">
									{timeSlots.map((slot) => {
										const isSelected = selectedSlot === slot.time;
										const isPastHour = isTodaySelected && slot.startMinute <= currentMinuteNow + 20;
										const isAvailable = slot.status === "available" && !isPastHour;
										const badgeText = isPastHour ? "مضى" : slot.badge;

										return (
											<button
												key={slot.id}
												type="button"
												disabled={!isAvailable}
												onClick={() => handleSelectSlot(slot)}
												title={
													isPastHour
														? "هذه الساعة انتهت اليوم ولا يمكن حجزها"
														: slot.status !== "available"
															? `غير متاح (${badgeText || "محجوز"})`
															: `حجز الساعة ${slot.time}`
												}
												className={cn(
													"h-6.5 px-1.5 rounded-md border text-[9.5px] font-medium flex items-center justify-between transition-all select-none",
													isAvailable
														? isSelected
															? "border-[#5B50E5] bg-[#5B50E5]/10 text-[#5B50E5] font-bold shadow-xs cursor-pointer ring-1 ring-[#5B50E5]"
															: "border-border/80 bg-background hover:bg-muted text-foreground cursor-pointer"
														: "border-border/40 bg-muted/20 text-muted-foreground/40 cursor-not-allowed opacity-55",
												)}
											>
												<span className="font-semibold">{slot.time.replace(" صباحاً", " ص").replace(" مساءً", " م")}</span>
												{badgeText && (
													<span
														className={cn(
															"px-1 py-0.2 rounded text-[7px] font-bold leading-none shrink-0",
															badgeText === "مضى"
																? "bg-zinc-200/90 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
																: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
														)}
													>
														{badgeText}
													</span>
												)}
											</button>
										);
									})}
								</div>

								{/* مساعدة سريعة لاختيار وقت مخصص إذا لم يناسبه أي من الفترات أو مضى اليوم */}
								<div className="flex items-center justify-between pt-1 px-1 text-[10px] text-muted-foreground">
									<span>لم تجد الوقت المناسب؟</span>
									<button
										type="button"
										onClick={() => {
											setTimeMode("custom");
											setTimeout(() => {
												scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: "smooth" });
											}, 50);
										}}
										className="text-[#5B50E5] dark:text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
									>
										<IconClock className="size-3" />
										<span>تحديد وقت مخصص حر</span>
									</button>
								</div>
							</div>
						) : (
							/* لوحة تحديد الوقت المخصص بحرية تامة */
							<div className="rounded-lg border border-[#5B50E5]/30 bg-[#5B50E5]/5 p-2.5 space-y-2.5 text-right">
								<div className="flex items-center justify-between border-b border-[#5B50E5]/15 pb-1.5">
									<span className="text-[10.5px] font-bold text-foreground flex items-center gap-1">
										<IconClock className="size-3.5 text-[#5B50E5]" />
										<span>اختر الوقت الذي يناسبك تماماً:</span>
									</span>
									<span className="text-[10.5px] text-[#5B50E5] font-bold bg-white dark:bg-card px-2 py-0.5 rounded border border-[#5B50E5]/25 shadow-2xs">
										{String(customHour).padStart(2, "0")}:{String(customMinute).padStart(2, "0")} {customPeriod === "AM" ? "صباحاً" : "مساءً"}
									</span>
								</div>

								{/* أوقات سريعة شائعة للاختيار المباشر بضغطة واحدة */}
								<div>
									<div className="text-[9.5px] font-bold text-muted-foreground mb-1">أوقات شائعة سريعة:</div>
									<div className="grid grid-cols-4 gap-1">
										{[
											{ h: 9, m: 0, p: "AM" as const, label: "09:00 ص" },
											{ h: 10, m: 30, p: "AM" as const, label: "10:30 ص" },
											{ h: 1, m: 0, p: "PM" as const, label: "01:00 م" },
											{ h: 3, m: 30, p: "PM" as const, label: "03:30 م" },
										].map((t, idx) => (
											<button
												key={idx}
												type="button"
												onClick={() => {
													setCustomHour(t.h);
													setCustomMinute(t.m);
													setCustomPeriod(t.p);
												}}
												className="h-5.5 rounded text-[9.5px] font-bold bg-white dark:bg-card border border-border/80 hover:border-[#5B50E5] text-foreground transition-all cursor-pointer"
											>
												{t.label}
											</button>
										))}
									</div>
								</div>

								{/* اختيار الساعة 1 إلى 12 */}
								<div>
									<div className="text-[9.5px] font-bold text-muted-foreground mb-1">الساعة:</div>
									<div className="grid grid-cols-6 gap-1">
										{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
											<button
												key={h}
												type="button"
												onClick={() => setCustomHour(h)}
												className={cn(
													"h-6 rounded text-[10.5px] font-bold transition-all cursor-pointer border",
													customHour === h
														? "bg-[#5B50E5] text-white border-[#5B50E5] shadow-xs"
														: "bg-white dark:bg-card border-border/80 hover:bg-muted text-foreground",
												)}
											>
												{h}
											</button>
										))}
									</div>
								</div>

								{/* اختيار الدقيقة وفترة اليوم (صباحاً / مساءً) */}
								<div className="grid grid-cols-2 gap-2">
									<div>
										<div className="text-[9.5px] font-bold text-muted-foreground mb-1">الدقيقة:</div>
										<div className="grid grid-cols-4 gap-1">
											{[0, 15, 30, 45].map((m) => (
												<button
													key={m}
													type="button"
													onClick={() => setCustomMinute(m)}
													className={cn(
														"h-6 rounded text-[10px] font-bold transition-all cursor-pointer border",
														customMinute === m
															? "bg-[#5B50E5] text-white border-[#5B50E5] shadow-xs"
															: "bg-white dark:bg-card border-border/80 hover:bg-muted text-foreground",
													)}
												>
													{String(m).padStart(2, "0")}
												</button>
											))}
										</div>
									</div>

									<div>
										<div className="text-[9.5px] font-bold text-muted-foreground mb-1">الفترة:</div>
										<div className="grid grid-cols-2 gap-1">
											<button
												type="button"
												onClick={() => setCustomPeriod("AM")}
												className={cn(
													"h-6 rounded text-[10px] font-bold transition-all cursor-pointer border",
													customPeriod === "AM"
														? "bg-[#5B50E5] text-white border-[#5B50E5] shadow-xs"
														: "bg-white dark:bg-card border-border/80 hover:bg-muted text-foreground",
												)}
											>
												صباحاً (ص)
											</button>
											<button
												type="button"
												onClick={() => setCustomPeriod("PM")}
												className={cn(
													"h-6 rounded text-[10px] font-bold transition-all cursor-pointer border",
													customPeriod === "PM"
														? "bg-[#5B50E5] text-white border-[#5B50E5] shadow-xs"
														: "bg-white dark:bg-card border-border/80 hover:bg-muted text-foreground",
												)}
											>
												مساءً (م)
											</button>
										</div>
									</div>
								</div>

								{/* زر اعتماد الوقت المخصص */}
								<button
									type="button"
									onClick={handleApplyCustomTime}
									className="w-full h-7 rounded-md bg-[#5B50E5] hover:bg-[#4E43D8] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
								>
									<IconCheck className="size-3.5 stroke-[2.5]" />
									<span>
										تأكيد واعتماد الوقت ({String(customHour).padStart(2, "0")}:{String(customMinute).padStart(2, "0")} {customPeriod === "AM" ? "ص" : "م"})
									</span>
								</button>
							</div>
						)}

						{/* كبسولة الموعد المعتمد */}
						{selectedSlot && !timeSlots.some((s) => s.time === selectedSlot) && (
							<div className="flex items-center justify-between p-2 px-3 rounded-lg border border-[#5B50E5]/30 bg-[#5B50E5]/10 text-xs">
								<div className="flex items-center gap-1.5 font-bold text-[#5B50E5] text-[11px]">
									<IconSparkles className="size-3.5" />
									<span>الموعد المعتمد: {selectedSlot}</span>
								</div>
								<button
									type="button"
									onClick={() => setTimeMode("custom")}
									className="text-[10.5px] text-[#5B50E5] hover:underline font-bold cursor-pointer"
								>
									تعديل
								</button>
							</div>
						)}
					</div>
				</div>

				{/* ─── 5. تذييل ثابت محكم تماماً بالأسفل (لا يتداخل إطلاقاً مع المحتوى) ───── */}
				<div className="shrink-0 px-4 py-3 border-t border-border/70 space-y-2.5 select-none bg-white dark:bg-zinc-950">
					{/* 1. تفعيل التذكيرات: النص على اليمين والمفتاح على اليسار */}
					<div className="flex items-center justify-between gap-3">
						<div className="text-right flex-1 min-w-0">
							<div className="text-[11px] font-bold text-foreground">
								تفعيل التذكيرات
							</div>
							<div className="text-[9.5px] text-muted-foreground">
								تذكير للمستخدم عبر الواتساب قبل الموعد بـ 24 ساعة
							</div>
						</div>
						<Switch
							checked={remindersActive}
							onCheckedChange={toggleReminders}
							className="cursor-pointer shrink-0"
						/>
					</div>

					{/* 2. تفعيل التكرار: النص على اليمين والمفتاح على اليسار */}
					<div className="flex items-center justify-between gap-3">
						<div className="text-right flex-1 min-w-0">
							<div className="text-[11px] font-bold text-foreground">
								تفعيل التكرار
							</div>
							<div className="text-[9.5px] text-muted-foreground">
								طلب جدولة زيارات متكررة للطالب
							</div>
						</div>
						<Switch
							checked={externalRecurrence !== undefined ? externalRecurrence : recurrenceActive}
							onCheckedChange={(val) => {
								setRecurrenceActive(val);
								onEnableRecurrenceChange?.(val);
								if (val) {
									toast.info("تم تفعيل طلب التكرار: سيتم إدراج طلب زيارات متكررة للطالب في خطة المواعيد.");
								}
							}}
							className="cursor-pointer shrink-0"
						/>
					</div>

					{/* خط فاصل */}
					<div className="border-t border-border/40 my-0.5" />

					{/* 3. زر إعادة الضبط في المنتصف تماماً */}
					<div className="text-center pt-0.5">
						<button
							type="button"
							onClick={handleReset}
							className="text-[11px] font-bold text-foreground/80 hover:text-foreground transition-colors cursor-pointer hover:underline"
						>
							إعادة الضبط
						</button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
