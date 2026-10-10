import { IconCalendar, IconChevronDown } from "@tabler/icons-react";
import {
	addDays,
	addWeeks,
	endOfDay,
	endOfWeek,
	format,
	startOfDay,
	startOfWeek,
} from "date-fns";
import { type ComponentProps, useMemo, useState } from "react";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDayCounts } from "@/features/dashboard/hooks/use-day-counts";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export type DateRangeMode = "day" | "week";

export interface DashboardDateRange {
	mode: DateRangeMode;
	/** أي تاريخ داخل النطاق (يوم مختار أو أي يوم من الأسبوع المختار) */
	date: Date;
}

// يحوّل الحالة إلى نطاق زمني فعلي [from, to) لاستخدامه في الاستعلامات.
export function resolveRange(value: DashboardDateRange): { from: Date; to: Date } {
	if (value.mode === "day") {
		return { from: startOfDay(value.date), to: endOfDay(value.date) };
	}
	const from = startOfWeek(value.date, { weekStartsOn: 0 }); // الأحد
	const to = endOfWeek(value.date, { weekStartsOn: 0 });
	return { from: startOfDay(from), to: endOfDay(to) };
}

export function DashboardDateRangeFilter({
	value,
	onChange,
}: {
	value: DashboardDateRange;
	onChange: (value: DashboardDateRange) => void;
}) {
	const { t } = useI18n();
	const { from, to } = resolveRange(value);
	const [open, setOpen] = useState(false);
	// الشهر المعروض في التقويم — يحدد نطاق العدّادات التي نجلبها.
	const [month, setMonth] = useState(value.date);
	const { countsByDay } = useDayCounts(month, open);

	// حدّ "اليوم" يُحسب مرة واحدة: ما قبله زيارات تمّت، وما بعده (ومعه) جلسات مجدولة.
	const todayStart = useMemo(() => startOfDay(new Date()), []);

	const label =
		value.mode === "day"
			? format(value.date, "d MMM yyyy")
			: `${t("dashboard.dateFilter.week")} (${format(from, "MMM d")} - ${format(to, "MMM d, yyyy")})`;

	const shift = (dir: -1 | 1) => {
		const next = value.mode === "day" ? addDays(value.date, dir) : addWeeks(value.date, dir);
		onChange({ ...value, date: next });
		setMonth(next);
	};

	const goToDate = (date: Date) => {
		onChange({ ...value, date });
		setMonth(date);
	};

	// العدّ لا يظهر داخل الخانة — يُقرأ عند المرور فوق اليوم:
	// زيارات تمّت للأيام الماضية، وجلسات مجدولة لليوم وما بعده.
	const components = useMemo(
		() => ({
			DayButton: ({
				day,
				modifiers,
				children,
				...rest
			}: ComponentProps<typeof CalendarDayButton>) => {
				const entry = countsByDay.get(format(day.date, "yyyy-MM-dd"));
				const isPast = day.date < todayStart;
				const count = (isPast ? entry?.visits : entry?.scheduled) ?? 0;

				const visitsLabel = t("dashboard.dateFilter.visitsCount", {
					count: entry?.visits ?? 0,
				});
				const scheduledLabel = t("dashboard.dateFilter.scheduledCount", {
					count: entry?.scheduled ?? 0,
				});
				// اليوم قد يجمع الاثنين (زيارات تمّت + جلسات باقية) فنعرضهما في التلميح.
				const title =
					count === 0
						? undefined
						: isPast
							? visitsLabel
							: entry && entry.visits > 0
								? `${scheduledLabel} · ${visitsLabel}`
								: scheduledLabel;

				return (
					<CalendarDayButton
						day={day}
						modifiers={modifiers}
						title={title}
						{...rest}
					>
						{children}
					</CalendarDayButton>
				);
			},
		}),
		[countsByDay, todayStart, t],
	);

	return (
		<div className="flex items-center gap-1.5">
			{/* Day / Week toggle */}
			<ToggleGroup
				type="single"
				size="sm"
				value={value.mode}
				onValueChange={(mode) => {
					if (mode === "day" || mode === "week") onChange({ mode, date: value.date });
				}}
				className="h-7 rounded-md border p-0.5"
			>
				<ToggleGroupItem
					value="day"
					className="h-6 rounded-sm px-2 text-[11px] data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
				>
					{t("dashboard.dateFilter.day")}
				</ToggleGroupItem>
				<ToggleGroupItem
					value="week"
					className="h-6 rounded-sm px-2 text-[11px] data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
				>
					{t("dashboard.dateFilter.week")}
				</ToggleGroupItem>
			</ToggleGroup>

			{/* Range picker */}
			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger asChild>
					<button
						type="button"
						className="flex h-7 items-center gap-1.5 rounded-md border px-2 text-[11px] font-medium text-foreground transition-colors hover:bg-accent"
					>
						<IconCalendar
							className="size-3.5 text-muted-foreground"
							stroke={1.5}
						/>
						<span className="whitespace-nowrap tabular-nums">{label}</span>
						<IconChevronDown
							className="size-3 text-muted-foreground"
							stroke={1.5}
						/>
					</button>
				</PopoverTrigger>
				<PopoverContent
					align="end"
					className="w-auto p-0"
				>
					{/* Prev/next quick nav */}
					<div className="flex items-center justify-between border-b px-2 py-1.5 text-[11px]">
						<button
							type="button"
							onClick={() => shift(-1)}
							className="rounded px-2 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
						>
							{t("dashboard.dateFilter.previous")}
						</button>
						<button
							type="button"
							onClick={() => goToDate(new Date())}
							className="rounded px-2 py-0.5 font-medium text-primary hover:bg-primary/10"
						>
							{t("dashboard.dateFilter.today")}
						</button>
						<button
							type="button"
							onClick={() => shift(1)}
							className="rounded px-2 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
						>
							{t("dashboard.dateFilter.next")}
						</button>
					</div>
					<Calendar
						mode="single"
						selected={value.date}
						onSelect={(date) => date && goToDate(date)}
						month={month}
						onMonthChange={setMonth}
						components={components}
						// في وضع الأسبوع نبرز الأسبوع كاملاً حول اليوم المختار
						modifiers={value.mode === "week" ? { inWeek: { from, to } } : undefined}
						modifiersClassNames={{ inWeek: cn("bg-primary/10 text-primary rounded-none") }}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
