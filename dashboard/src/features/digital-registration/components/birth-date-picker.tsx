import { useState, useMemo, useEffect } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	IconCalendar,
	IconChevronLeft,
	IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface BirthDatePickerProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
	className?: string;
}

const MONTHS = [
	{ value: 0, label: "يناير (01)" },
	{ value: 1, label: "فبراير (02)" },
	{ value: 2, label: "مارس (03)" },
	{ value: 3, label: "أبريل (04)" },
	{ value: 4, label: "مايو (05)" },
	{ value: 5, label: "يونيو (06)" },
	{ value: 6, label: "يوليو (07)" },
	{ value: 7, label: "أغسطس (08)" },
	{ value: 8, label: "سبتمبر (09)" },
	{ value: 9, label: "أكتوبر (10)" },
	{ value: 10, label: "نوفمبر (11)" },
	{ value: 11, label: "ديسمبر (12)" },
];

// أسماء أيام الأسبوع باللغة العربية السليمة
const WEEKDAYS = ["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];

// تاريخ الميلاد لا ينبغي أن يكون مستقبلياً، لكن نسمح بكل نطاق الأعمار الواقعي.
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const CURRENT_DAY = new Date().getDate();
const MIN_BIRTH_YEAR = 1900;
const YEARS = Array.from({ length: CURRENT_YEAR - MIN_BIRTH_YEAR + 1 }, (_, i) => CURRENT_YEAR - i);

type BirthDateParts = { day: number; month: number; year: number };

function parseBirthDate(value: string): BirthDateParts | null {
	const trimmedValue = value.trim();
	const match = trimmedValue.match(/^(?:(\d{4})-(\d{2})-(\d{2})|(\d{2})\/(\d{2})\/(\d{4}))$/);
	if (!match) return null;

	const year = Number(match[1] || match[6]);
	const month = Number(match[2] || match[5]) - 1;
	const day = Number(match[3] || match[4]);
	if (year < MIN_BIRTH_YEAR || year > CURRENT_YEAR || month < 0 || month > 11 || day < 1) {
		return null;
	}

	const date = new Date(year, month, day);
	if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
		return null;
	}
	if (date > new Date(CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY)) return null;

	return { day, month, year };
}

export function BirthDatePicker({
	value,
	onChange,
	placeholder = "مثال: 19/02/2008",
	required = false,
	className,
}: BirthDatePickerProps) {
	const [open, setOpen] = useState(false);

	// يقبل الإدخال اليدوي بصيغتي DD/MM/YYYY و YYYY-MM-DD، ويطابقه مع التقويم
	// فقط إذا كان تاريخاً صحيحاً وغير مستقبلي.
	const parsedDate = useMemo(() => parseBirthDate(value), [value]);

	// السنة الافتراضية 2008 (مطابقة لمثال التصميم) أو السنة المحللة
	const [selectedYear, setSelectedYear] = useState<number>(parsedDate?.year || 2008);
	const [selectedMonth, setSelectedMonth] = useState<number>(parsedDate?.month ?? 1); // 1 = فبراير
	const [selectedDay, setSelectedDay] = useState<number | null>(parsedDate?.day ?? 19);

	// المزامنة مع القيمة الخارجية
	useEffect(() => {
		if (parsedDate) {
			setSelectedYear(parsedDate.year);
			setSelectedMonth(parsedDate.month);
			setSelectedDay(parsedDate.day);
		}
	}, [parsedDate]);

	// عدد أيام الشهر المحدد
	const daysInMonth = useMemo(() => {
		return new Date(selectedYear, selectedMonth + 1, 0).getDate();
	}, [selectedYear, selectedMonth]);

	// إزاحة أول يوم في الشهر (بداية الأسبوع من السبت = 0)
	const startDayOffset = useMemo(() => {
		const dayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 الأحد، 6 السبت
		return (dayOfWeek + 1) % 7; // السبت = 0، الأحد = 1 ... الجمعة = 6
	}, [selectedYear, selectedMonth]);

	// التنقل بين الأشهر
	const handlePrevMonth = () => {
		if (selectedYear === MIN_BIRTH_YEAR && selectedMonth === 0) return;
		if (selectedMonth === 0) {
			setSelectedMonth(11);
			setSelectedYear((y) => y - 1);
		} else {
			setSelectedMonth((m) => m - 1);
		}
	};

	const handleNextMonth = () => {
		if (selectedYear === CURRENT_YEAR && selectedMonth === CURRENT_MONTH) return;
		if (selectedMonth === 11) {
			setSelectedMonth(0);
			setSelectedYear((y) => y + 1);
		} else {
			setSelectedMonth((m) => m + 1);
		}
	};

	const handleSelectYear = (year: number) => {
		setSelectedYear(year);
		if (year === CURRENT_YEAR && selectedMonth > CURRENT_MONTH) {
			setSelectedMonth(CURRENT_MONTH);
		}
	};

	const handleSelectMonth = (month: number) => {
		setSelectedMonth(selectedYear === CURRENT_YEAR && month > CURRENT_MONTH ? CURRENT_MONTH : month);
	};

	// اختيار اليوم
	const handleSelectDay = (day: number) => {
		const isFutureDate =
			selectedYear === CURRENT_YEAR &&
			(selectedMonth > CURRENT_MONTH ||
				(selectedMonth === CURRENT_MONTH && day > CURRENT_DAY));
		if (isFutureDate) return;
		setSelectedDay(day);
		const formatted = `${String(day).padStart(2, "0")}/${String(selectedMonth + 1).padStart(2, "0")}/${selectedYear}`;
		onChange(formatted);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<div className="relative h-9">
				<PopoverTrigger asChild>
					<div className="relative h-full cursor-pointer">
						<Input
							value={value}
							onChange={(e) => onChange(e.target.value)}
							placeholder={placeholder}
							className={cn(
								"h-9! min-h-9! h-full box-border text-[12px] leading-5 text-right font-mono pr-2.5 pl-8 rounded-md border-border/80 cursor-pointer bg-background",
								className,
							)}
							required={required}
						/>
						<div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-muted-foreground/60">
							<IconCalendar className="size-3.5 text-muted-foreground/80" />
						</div>
					</div>
				</PopoverTrigger>
			</div>

			<PopoverContent
				align="end"
				sideOffset={4}
				className="z-[99] w-[295px] p-2.5 bg-card border border-border/80 shadow-2xl rounded-xl select-none"
				dir="rtl"
			>
				{/* ─── 1. ترويسة التقويم: اختيار السنة والشهر بوضوح تام ────────── */}
				<div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-border/60">
					{/* سهم الشهر السابق */}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handlePrevMonth}
						disabled={selectedYear === MIN_BIRTH_YEAR && selectedMonth === 0}
						className="size-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-35"
						title="الشهر السابق"
					>
						<IconChevronRight className="size-3.5" />
					</Button>

					{/* منسدلة الشهر */}
					<div className="flex-1 min-w-0">
						<Select
							value={String(selectedMonth)}
							onValueChange={(val) => handleSelectMonth(Number(val))}
						>
							<SelectTrigger className="w-full h-8! min-h-8! px-2 text-[11px] font-semibold text-foreground border-border/70 rounded-md">
								<SelectValue />
							</SelectTrigger>
							<SelectContent
								dir="rtl"
								position="popper"
								sideOffset={2}
								className="max-h-52 z-[100] w-[140px] text-xs bg-popover"
							>
								{MONTHS.map((m) => (
									<SelectItem key={m.value} value={String(m.value)} className="text-xs py-1 cursor-pointer">
										{m.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* منسدلة السنة (اختيار السنة المباشر) */}
					<div className="w-[84px] shrink-0">
						<Select
							value={String(selectedYear)}
							onValueChange={(val) => handleSelectYear(Number(val))}
						>
							<SelectTrigger className="w-full h-8! min-h-8! px-2 text-[11px] font-bold font-mono text-foreground border-border/70 rounded-md">
								<SelectValue />
							</SelectTrigger>
							<SelectContent
								dir="rtl"
								position="popper"
								sideOffset={2}
								className="max-h-52 z-[100] w-[90px] font-mono text-xs bg-popover"
							>
								{YEARS.map((y) => (
									<SelectItem key={y} value={String(y)} className="text-xs font-mono py-1 cursor-pointer">
										{y}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* سهم الشهر القادم */}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handleNextMonth}
						disabled={selectedYear === CURRENT_YEAR && selectedMonth === CURRENT_MONTH}
						className="size-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-35"
						title="الشهر القادم"
					>
						<IconChevronLeft className="size-3.5" />
					</Button>
				</div>

				{/* ─── 2. صف أسماء أيام الأسبوع (عربي سليم ودقيق) ─────────────── */}
				<div className="grid grid-cols-7 gap-1 text-center mb-1">
					{WEEKDAYS.map((dayName, idx) => (
						<span
							key={idx}
							className={cn(
								"text-[10px] font-semibold py-0.5",
								idx === 6 ? "text-rose-500 font-bold" : "text-muted-foreground",
							)}
						>
							{dayName}
						</span>
					))}
				</div>

				{/* ─── 3. شبكة أيام الشهر ─────────────────────────────────────── */}
				<div className="grid grid-cols-7 gap-1 text-center">
					{/* الفراغات قبل اليوم الأول */}
					{Array.from({ length: startDayOffset }).map((_, i) => (
						<span key={`empty-${i}`} className="size-8" />
					))}

					{/* أزرار الأيام */}
					{Array.from({ length: daysInMonth }).map((_, i) => {
						const dayNum = i + 1;
						const isFutureDate =
							selectedYear === CURRENT_YEAR &&
							(selectedMonth > CURRENT_MONTH ||
								(selectedMonth === CURRENT_MONTH && dayNum > CURRENT_DAY));
						const isSelected =
							selectedDay === dayNum &&
							parsedDate?.month === selectedMonth &&
							parsedDate?.year === selectedYear;

						return (
							<button
								key={dayNum}
								type="button"
								onClick={() => handleSelectDay(dayNum)}
								disabled={isFutureDate}
								className={cn(
									"size-8 rounded-md text-[11px] font-semibold transition-all flex items-center justify-center font-mono cursor-pointer disabled:cursor-not-allowed disabled:text-muted-foreground/35",
									isSelected
										? "bg-[#5B50E5] text-white shadow-xs font-bold"
										: "text-foreground hover:bg-muted/80 hover:text-foreground",
								)}
							>
								{dayNum}
							</button>
						);
					})}
				</div>

				{/* تاريخ الميلاد لا يستخدم «اليوم»؛ الإجراء الوحيد الآمن هنا هو المسح. */}
				<div className="flex items-center justify-end pt-2 mt-2 border-t border-border/50 text-[11px]">
					{value && (
						<button
							type="button"
							onClick={() => {
								onChange("");
								setSelectedDay(null);
							}}
							className="text-muted-foreground hover:text-destructive cursor-pointer"
						>
							مسح التاريخ
						</button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
