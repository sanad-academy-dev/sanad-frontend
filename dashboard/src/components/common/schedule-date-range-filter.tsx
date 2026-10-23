import { IconCalendar, IconChevronDown } from "@tabler/icons-react";
import {
	addDays,
	addMonths,
	addWeeks,
	endOfMonth,
	format,
	getDaysInMonth,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { arSA } from "date-fns/locale";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type ScheduleFilterMode = "week" | "month";

export interface ScheduleDateRange {
	mode: ScheduleFilterMode;
	date: Date;
}

export interface ResolvedScheduleRange {
	mode: ScheduleFilterMode;
	start: Date;
	end: Date;
	days: Date[];
	label: string;
}

// دالة تحويل الحالة إلى نطاق زمني مع قائمة الأيام والعنوان المنسق
export function resolveScheduleRange(value: ScheduleDateRange): ResolvedScheduleRange {
	if (value.mode === "month") {
		const start = startOfMonth(value.date);
		const end = endOfMonth(value.date);
		const daysCount = getDaysInMonth(value.date);
		const days = Array.from({ length: daysCount }, (_, i) => addDays(start, i));
		const label = `شهر ${format(value.date, "MMMM yyyy", { locale: arSA })}`;
		return { mode: "month", start, end, days, label };
	}

	// وضع الأسبوع (يبدأ من الأحد)
	const start = startOfWeek(value.date, { weekStartsOn: 0 });
	const end = addDays(start, 6);
	const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
	const isSameMonth = start.getMonth() === end.getMonth();
	const label = isSameMonth
		? `${format(start, "d", { locale: arSA })} - ${format(end, "d MMMM yyyy", { locale: arSA })}`
		: `${format(start, "d MMM", { locale: arSA })} - ${format(end, "d MMM yyyy", { locale: arSA })}`;
	return { mode: "week", start, end, days, label };
}

export interface ScheduleDateRangeFilterProps {
	value: ScheduleDateRange;
	onChange: (value: ScheduleDateRange) => void;
	className?: string;
}

export function ScheduleDateRangeFilter({
	value,
	onChange,
	className,
}: ScheduleDateRangeFilterProps) {
	const { start, end, label } = resolveScheduleRange(value);
	const [open, setOpen] = useState(false);
	const [month, setMonth] = useState(value.date);

	const shift = (dir: -1 | 1) => {
		const next =
			value.mode === "week"
				? addWeeks(value.date, dir)
				: addMonths(value.date, dir);
		onChange({ ...value, date: next });
		setMonth(next);
	};

	const goToDate = (date: Date) => {
		onChange({ ...value, date });
		setMonth(date);
	};

	return (
		<div className={cn("flex items-center gap-1.5", className)} >
			{/* Toggle أسبوع / شهر */}
			<ToggleGroup
				type="single"
				size="sm"
				value={value.mode}
				onValueChange={(mode) => {
					if (mode === "week" || mode === "month") {
						onChange({ mode, date: value.date });
					}
				}}
				className="h-7 rounded-md border p-0.5 bg-background"
			>
				
				<ToggleGroupItem
					value="month"
					className="h-6 rounded-sm px-2 text-[11px] font-medium data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
				>
					شهر
				</ToggleGroupItem>

				<ToggleGroupItem
					value="week"
					className="h-6 rounded-sm px-2 text-[11px] font-medium data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
				>
					أسبوع
				</ToggleGroupItem>
			</ToggleGroup>

			{/* منتقي المدى الزمني مع التقويم */}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type="button"
						className="flex h-7 items-center gap-1.5 rounded-md border bg-background px-2 text-[11px] font-medium text-foreground transition-colors hover:bg-accent"
					>
						<IconCalendar className="size-3.5 text-muted-foreground" stroke={1.5} />
						<span className="whitespace-nowrap tabular-nums">{label}</span>
						<IconChevronDown className="size-3 text-muted-foreground" stroke={1.5} />
					</button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-auto p-0" dir="rtl">
					{/* أزرار التنقل السريع: السابق | اليوم | التالي */}
					<div className="flex items-center justify-between border-b px-2 py-1.5 text-[11px]">
						<button
							type="button"
							onClick={() => shift(-1)}
							className="rounded px-2 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
						>
							السابق
						</button>
						<button
							type="button"
							onClick={() => goToDate(new Date())}
							className="rounded px-2 py-0.5 font-medium text-primary hover:bg-primary/10"
						>
							اليوم
						</button>
						<button
							type="button"
							onClick={() => shift(1)}
							className="rounded px-2 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
						>
							التالي
						</button>
					</div>
					<Calendar
						mode="single"
						selected={value.date}
						onSelect={(date) => {
							if (date) {
								goToDate(date);
							}
						}}
						month={month}
						onMonthChange={setMonth}
						locale={arSA}
						modifiers={{
							inRange: { from: start, to: end },
						}}
						modifiersClassNames={{
							inRange: cn("bg-primary/10 text-primary rounded-none"),
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
