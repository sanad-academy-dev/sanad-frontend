import { useEffect, useMemo, useState } from "react";
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
import { localToUTC, utcToLocal } from "@/lib/date";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { toZonedTime } from "date-fns-tz";

interface AppointmentPickerPopoverProps {
	value: string;
	/** القيمة الفعلية المحفوظة؛ النص المعروض لا يحتوي السنة دائماً. */
	isoValue?: string | null;
	onChange: (value: string, isoDate?: string | null) => void;
	reviewerName?: string;
	/** Staff ID للمراجع القابل للحجز، وليس User ID. */
	reviewerId?: string;
	enableReminders?: boolean;
	onEnableRemindersChange?: (enabled: boolean) => void;
	className?: string;
}

const MONTH_NAMES_AR = [
	"يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
	"يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

// الشبكة RTL، لكن ترتيب عناصرها يبدأ من اليمين؛ لذلك نضع تسلسل الأسبوع
// الزمني الطبيعي هنا، فيظهر الأحد يميناً ثم الاثنين… حتى السبت يساراً.
const WEEKDAYS = ["الأحد", "الإث", "الثلا", "الأرب", "الخمي", "الجم", "السبت"];
const SLOT_START_MINUTE = 9 * 60;
const SLOT_END_MINUTE = 21 * 60;
const SLOT_DURATION_MINUTES = 60;

interface TimeSlot {
	id: string;
	time: string;
	startMinute: number;
	status: "available" | "unavailable" | "conflict";
	badge?: string;
}

function formatMinuteToArabic(minute: number) {
	const hours = Math.floor(minute / 60);
	const minutes = minute % 60;
	const h12 = hours % 12 || 12;
	return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "مساءً" : "صباحاً"}`;
}

function createHourlySlots(targetDay: number, targetMonth: number, targetYear: number, now: Date): TimeSlot[] {
	const isToday = targetYear === now.getFullYear() && targetMonth === now.getMonth() && targetDay === now.getDate();
	const isPastDay = new Date(targetYear, targetMonth, targetDay).setHours(0, 0, 0, 0) < new Date(now).setHours(0, 0, 0, 0);
	const currentMinute = now.getHours() * 60 + now.getMinutes();

	return Array.from({ length: (SLOT_END_MINUTE - SLOT_START_MINUTE) / SLOT_DURATION_MINUTES }, (_, index) => {
		const startMinute = SLOT_START_MINUTE + index * SLOT_DURATION_MINUTES;
		const unavailable = isPastDay || (isToday && startMinute <= currentMinute + 20);
		return {
			id: `slot-${index + 1}`,
			time: formatMinuteToArabic(startMinute),
			startMinute,
			status: unavailable ? "unavailable" : "available",
			badge: unavailable ? "مضى" : undefined,
		};
	});
}

export function AppointmentPickerPopover({
	value,
	isoValue,
	onChange,
	reviewerName,
	reviewerId,
	enableReminders: externalReminders,
	onEnableRemindersChange,
	className,
}: AppointmentPickerPopoverProps) {
	const { clinicInfo } = useClinicInfo();
	const clinicTimezone = clinicInfo?.timezone || "Asia/Riyadh";
	const [open, setOpen] = useState(false);
	const [clinicNow, setClinicNow] = useState(() => toZonedTime(new Date(), "Asia/Riyadh"));
	const today = clinicNow;
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth();
	const currentDay = today.getDate();
	const clinicDateKey = `${currentYear}-${currentMonth}-${currentDay}`;
	const [year, setYear] = useState(currentYear);
	const [month, setMonth] = useState(currentMonth);
	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [selectedMonth, setSelectedMonth] = useState(currentMonth);
	const [selectedDay, setSelectedDay] = useState<number>(currentDay);
	const [selectedSlot, setSelectedSlot] = useState("");
	const [currentMinute, setCurrentMinute] = useState(() => today.getHours() * 60 + today.getMinutes());
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => createHourlySlots(currentDay, currentMonth, currentYear, today));
	const [recommendation, setRecommendation] = useState<{
		recommendedTime: string;
		reason: string;
		workingHoursText: string;
	} | null>(null);
	const [internalReminders, setInternalReminders] = useState(false);

	const isTodaySelected = selectedYear === currentYear && selectedMonth === currentMonth && selectedDay === currentDay;
	const isAtCurrentMonth = year === currentYear && month === currentMonth;
	const isCustomSelected = Boolean(value && value !== "تاريخ الموعد");
	const remindersActive = externalReminders ?? internalReminders;
	const canConfigureReminders = externalReminders !== undefined || onEnableRemindersChange !== undefined;
	const toggleReminders = (enabled: boolean) => {
		setInternalReminders(enabled);
		onEnableRemindersChange?.(enabled);
	};

	useEffect(() => {
		const updateClinicNow = () => {
			const now = toZonedTime(new Date(), clinicTimezone);
			setClinicNow(now);
			setCurrentMinute(now.getHours() * 60 + now.getMinutes());
		};
		updateClinicNow();
		if (!open) return;
		const interval = window.setInterval(updateClinicNow, 30_000);
		return () => window.clearInterval(interval);
	}, [clinicTimezone, open]);

	// يعيد فتح التقويم على الموعد الفعلي حتى لو كان النص المعروض مختصراً.
	useEffect(() => {
		if (!isoValue) return;
		const date = utcToLocal(isoValue, clinicTimezone);
		if (Number.isNaN(date.getTime())) return;
		const minute = date.getHours() * 60 + date.getMinutes();
		setYear(date.getFullYear());
		setMonth(date.getMonth());
		setSelectedYear(date.getFullYear());
		setSelectedMonth(date.getMonth());
		setSelectedDay(date.getDate());
		setSelectedSlot(formatMinuteToArabic(minute));
	}, [clinicTimezone, isoValue]);

	useEffect(() => {
		const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
		const fallback = createHourlySlots(selectedDay, selectedMonth, selectedYear, clinicNow);
		setTimeSlots(fallback);
		setRecommendation(null);
		const query = new URLSearchParams({ date });
		if (reviewerId) query.set("staffId", reviewerId);
		let cancelled = false;

		backendFetch(`/api/digital-registration/ai-slot-recommendation?${query}`)
			.then(async (response) => {
				if (!response.ok || cancelled) return;
				const data = await response.json();
				if (cancelled) return;
				if (Array.isArray(data?.slots)) setTimeSlots(data.slots);
				setRecommendation({
					recommendedTime: data?.recommendedTime || "",
					reason: data?.reason || "اختر من الفترات المتاحة بحسب جدول المراجع.",
					// العقد ثابت في التسجيل الرقمي؛ لا نعتمد نصاً قديماً من خادم لم يُعد تشغيله.
					workingHoursText: "من 09:00 ص حتى 09:00 م",
				});
			})
			.catch(() => undefined);

		return () => {
			cancelled = true;
		};
	}, [clinicDateKey, selectedDay, selectedMonth, selectedYear, reviewerId]);

	const slotIsTooSoon = (slot: TimeSlot) => isTodaySelected && slot.startMinute <= currentMinute + 20;
	const availableSlotsCount = timeSlots.filter((slot) => slot.status === "available" && !slotIsTooSoon(slot)).length;

	const syncValue = (day: number, monthIndex: number, selectedYearValue: number, slot?: TimeSlot) => {
		const dateLabel = selectedYearValue === currentYear && monthIndex === currentMonth && day === currentDay
			? "اليوم"
			: `${day} ${MONTH_NAMES_AR[monthIndex]}`;
		if (!slot) {
			onChange(dateLabel, null);
			return;
		}
		const hours = Math.floor(slot.startMinute / 60);
		const minutes = slot.startMinute % 60;
		// الموعد يُبنى بتوقيت الأكاديمية، لا بتوقيت جهاز الموظف. هذا يمنع انزياح
		// الساعة عند استخدام الفريق لجهاز أو اتصال في منطقة زمنية أخرى.
		const clinicLocalDate = new Date(selectedYearValue, monthIndex, day, hours, minutes, 0);
		onChange(`${dateLabel} - ${slot.time}`, localToUTC(clinicLocalDate, clinicTimezone).toISOString());
	};

	const handleSelectDay = (day: number) => {
		setSelectedDay(day);
		setSelectedMonth(month);
		setSelectedYear(year);
		// لا يُنشئ مجرد اختيار اليوم حجزاً؛ يلزم اختيار فترة ساعة بعده.
		setSelectedSlot("");
		syncValue(day, month, year);
	};

	const handleSelectSlot = (slot: TimeSlot) => {
		if (slot.status !== "available" || slotIsTooSoon(slot)) return;
		setSelectedSlot(slot.time);
		syncValue(selectedDay, selectedMonth, selectedYear, slot);
		setOpen(false);
	};

	const handlePrevMonth = () => {
		if (isAtCurrentMonth) return;
		if (month === 0) {
			setMonth(11);
			setYear((value) => value - 1);
		} else setMonth((value) => value - 1);
	};

	const handleNextMonth = () => {
		if (month === 11) {
			setMonth(0);
			setYear((value) => value + 1);
		} else setMonth((value) => value + 1);
	};

	const calendarDays = useMemo(() => {
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		// getDay يبدأ بالأحد (0)، وهو نفس ترتيب شبكة التقويم RTL أعلاه.
		const startOffset = new Date(year, month, 1).getDay();
		return Array.from({ length: daysInMonth + startOffset }, (_, index) => {
			const day = index - startOffset + 1;
			if (day < 1) return null;
			const isPast = new Date(year, month, day).setHours(0, 0, 0, 0) < new Date(currentYear, currentMonth, currentDay).setHours(0, 0, 0, 0);
			return {
				day,
				isPast,
				isToday: year === currentYear && month === currentMonth && day === currentDay,
				isSelected: selectedYear === year && selectedMonth === month && selectedDay === day,
			};
		});
	}, [currentDay, currentMonth, currentYear, month, selectedDay, selectedMonth, selectedYear, year]);

	const reset = () => {
		setYear(currentYear);
		setMonth(currentMonth);
		setSelectedYear(currentYear);
		setSelectedMonth(currentMonth);
		setSelectedDay(currentDay);
		setSelectedSlot("");
		toggleReminders(false);
		onChange("تاريخ الموعد", null);
		setOpen(false);
	};

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
				side="top"
				align="start"
				sideOffset={6}
				collisionPadding={8}
				style={{ maxHeight: "min(560px, var(--radix-popover-content-available-height, 560px))" }}
				className="z-[99] w-[min(390px,calc(100vw-1rem))] flex flex-col p-0 bg-white dark:bg-zinc-950 text-popover-foreground border border-border/80 shadow-2xl rounded-xl overflow-hidden"
				dir="rtl"
			>
				<div className="shrink-0 px-4 py-2.5 border-b border-border/70 flex items-center justify-between bg-white dark:bg-zinc-950">
					<button type="button" disabled={isAtCurrentMonth} onClick={handlePrevMonth} className="size-7 rounded-md flex items-center justify-center transition-colors disabled:opacity-25 disabled:cursor-not-allowed hover:bg-muted text-muted-foreground hover:text-foreground" title="الشهر السابق">
						<IconChevronRight className="size-4" />
					</button>
					<span className="text-xs font-bold text-foreground">{MONTH_NAMES_AR[month]} {year}</span>
					<button type="button" onClick={handleNextMonth} className="size-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer" title="الشهر التالي">
						<IconChevronLeft className="size-4" />
					</button>
				</div>

				<div
					data-radix-scroll-lock-ignore
					style={{
						overscrollBehavior: "contain",
						// يجب أن يبقى المحتوى أقصر من النافذة نفسها دائماً؛ بذلك يصير
						// هذا العنصر هو موضع التمرير الفعلي لعجلة الماوس، لا الـ Dialog.
						maxHeight: "min(26rem, calc(var(--radix-popover-content-available-height, 560px) - 7.5rem))",
					}}
					onWheel={(event) => {
						// احتياطياً نحرّك الحاوية نفسها حتى داخل Dialog الذي يقفل تمرير الخلفية.
						event.stopPropagation();
						const container = event.currentTarget;
						const maxScroll = container.scrollHeight - container.clientHeight;
						if (maxScroll <= 0) return;
						event.preventDefault();

						let delta = event.deltaY;
						if (event.deltaMode === 1) delta *= 36;
						else if (event.deltaMode === 2) delta *= container.clientHeight;
						container.scrollTop = Math.max(0, Math.min(maxScroll, container.scrollTop + delta));
					}}
					className="min-h-0 overflow-y-auto overscroll-contain scrollbar-thin px-3.5 py-3 space-y-3"
				>
					<div dir="rtl">
						<div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted-foreground/75 mb-1">
							{WEEKDAYS.map((day) => <div key={day} className="py-0.5">{day}</div>)}
						</div>
						<div className="grid grid-cols-7 gap-1 text-center">
							{calendarDays.map((calendarDay, index) => !calendarDay ? (
								<div key={`empty-${index}`} className="size-7.5" />
							) : calendarDay.isPast ? (
								<div key={calendarDay.day} className="size-7.5 mx-auto flex items-center justify-center rounded-full text-[10.5px] text-muted-foreground/30 cursor-not-allowed" title="تاريخ سابق غير متاح للحجز">{calendarDay.day}</div>
							) : (
								<button key={calendarDay.day} type="button" onClick={() => handleSelectDay(calendarDay.day)} className={cn("size-7.5 mx-auto flex items-center justify-center rounded-full text-[11px] font-medium transition-all cursor-pointer", calendarDay.isSelected ? "bg-[#5B50E5] text-white font-bold shadow-xs hover:bg-[#4E43D8]" : calendarDay.isToday ? "border border-[#5B50E5] text-[#5B50E5] font-bold hover:bg-[#5B50E5]/10" : "hover:bg-muted text-foreground")}>
									{calendarDay.day}
								</button>
							))}
						</div>
					</div>

					{recommendation && (
						<div className="rounded-lg border border-amber-200/80 bg-amber-50/70 px-3 py-2 text-right dark:border-amber-800/50 dark:bg-amber-950/20">
							<div className="flex items-center justify-end gap-1 text-[10.5px] font-bold text-amber-800 dark:text-amber-300">
								<span>اقتراحات فريق AI</span>
								<IconSparkles className="size-3.5 text-amber-500" />
							</div>
							<div className="mt-1 space-y-0.5 text-[9.5px] leading-relaxed text-amber-700/90 dark:text-amber-200/90">
								{recommendation.recommendedTime && <p>• أقرب فترة مناسبة: {recommendation.recommendedTime}</p>}
								<p>• {recommendation.reason}</p>
								<p>• ساعات المقابلات: {recommendation.workingHoursText}</p>
							</div>
						</div>
					)}

					<div className="border-t border-border/60 pt-3">
						<div className="mb-2 flex items-center justify-between gap-3">
							<div>
								<p className="text-[11.5px] font-bold text-foreground">اختر وقت المقابلة</p>
								<p className="text-[9.5px] text-muted-foreground">مدة المقابلة ساعة — يبدأ الحجز من 9 ص حتى 8 م (ينتهي الدوام 9 م)</p>
							</div>
							<span className="text-[9.5px] text-muted-foreground shrink-0">
								{reviewerName && reviewerName !== "المراجع" ? reviewerName : `${availableSlotsCount} فترات متاحة`}
							</span>
						</div>
						<div className="grid grid-cols-3 gap-1.5">
							{timeSlots.map((slot) => {
								const available = slot.status === "available" && !slotIsTooSoon(slot);
								const selected = selectedSlot === slot.time;
								return (
									<button key={slot.id} type="button" disabled={!available} onClick={() => handleSelectSlot(slot)} title={available ? `حجز ${slot.time}` : slot.badge === "محجوز" ? "هذا الموعد محجوز" : "هذا الموعد غير متاح"} className={cn("h-8 rounded-md border text-[10px] font-semibold transition-colors", available ? selected ? "border-[#5B50E5] bg-[#5B50E5]/10 text-[#5B50E5] ring-1 ring-[#5B50E5]" : "border-border/80 bg-background hover:bg-muted text-foreground cursor-pointer" : "border-border/40 bg-muted/20 text-muted-foreground/40 cursor-not-allowed opacity-60")}>
										{slot.time.replace(" صباحاً", " ص").replace(" مساءً", " م")}
									</button>
								);
							})}
						</div>
					</div>
				</div>

				<div className="shrink-0 px-4 py-2.5 border-t border-border/70 bg-white dark:bg-zinc-950 space-y-2">
					{canConfigureReminders && (
						<div className="flex items-center justify-between gap-3">
							<div className="min-w-0 text-right">
								<p className="text-[10.5px] font-bold text-foreground">تفعيل التذكيرات</p>
								<p className="text-[9px] text-muted-foreground">تذكير للطالب عبر الواتساب قبل الموعد بـ 24 ساعة</p>
							</div>
							<Switch checked={remindersActive} onCheckedChange={toggleReminders} className="shrink-0 cursor-pointer" aria-label="تفعيل تذكير واتساب قبل الموعد" />
						</div>
					)}
					<div className="text-center">
						<button type="button" onClick={reset} className="text-[10.5px] font-bold text-foreground/75 hover:text-foreground hover:underline cursor-pointer">إعادة الضبط</button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
