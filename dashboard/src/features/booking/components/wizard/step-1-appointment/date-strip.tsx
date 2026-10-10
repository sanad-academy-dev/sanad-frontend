import { IconCalendar, IconChevronLeft } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import type { PublicSlotDay } from "@/server/public/public.type";

const AR_WEEKDAY = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const AR_MONTH = [
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

const toYmdString = (value: string | Date): string => {
	if (value instanceof Date) {
		const y = value.getFullYear();
		const m = String(value.getMonth() + 1).padStart(2, "0");
		const d = String(value.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	}
	return String(value);
};

const parseYmd = (ymd: string | Date): Date => {
	if (ymd instanceof Date) return ymd;
	const [y, m, d] = String(ymd)
		.split("-")
		.map((p) => parseInt(p, 10));
	return new Date(y, m - 1, d);
};

const isSameYmd = (a: Date, ymd: string | Date): boolean => {
	const b = parseYmd(ymd);
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
};

type DateStripProps = {
	days: PublicSlotDay[];
	selectedDate: string | null;
	onSelect: (date: string) => void;
	onLoadMore: () => void;
	canLoadMore: boolean;
	isLoading?: boolean;
};

export const DateStrip = ({
	days,
	selectedDate,
	onSelect,
	onLoadMore,
	canLoadMore,
	isLoading,
}: DateStripProps) => {
	const today = new Date();

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
				<IconCalendar className="size-4" />
				<span>اختر التاريخ</span>
				<span className="text-destructive">*</span>
			</div>

			<div className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
				{days.map((day) => {
					const ymd = toYmdString(day.date);
					const date = parseYmd(ymd);
					const weekday = AR_WEEKDAY[date.getDay()];
					const month = AR_MONTH[date.getMonth()];
					const isToday = isSameYmd(today, ymd);
					const isSelected = selectedDate === ymd;
					const hasAvailable = day.isWorking && day.slots.some((s) => s.available);
					const isDisabled = !hasAvailable;

					return (
						<button
							key={ymd}
							type="button"
							onClick={() => onSelect(ymd)}
							disabled={isDisabled}
							aria-pressed={isSelected}
							className={cn(
								"relative flex w-[78px] shrink-0 flex-col items-center gap-1 rounded-xl border bg-card px-2 py-3 text-center transition-colors",
								"hover:bg-muted/40",
								isSelected && "border-primary bg-primary/5",
								isDisabled && "cursor-not-allowed opacity-50 hover:bg-card",
							)}
						>
							{isToday && (
								<span className="absolute -top-2 inset-x-1 mx-auto inline-block w-fit rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
									اليوم
								</span>
							)}
							<span
								className={cn("text-xs text-muted-foreground", isSelected && "text-primary")}
							>
								{weekday}
							</span>
							<span
								className={cn(
									"text-lg font-bold text-foreground",
									isSelected && "text-primary",
								)}
							>
								{date.getDate()}
							</span>
							<span
								className={cn("text-xs text-muted-foreground", isSelected && "text-primary")}
							>
								{month}
							</span>
						</button>
					);
				})}

				{canLoadMore && (
					<button
						type="button"
						onClick={onLoadMore}
						disabled={isLoading}
						className={cn(
							"flex w-[78px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-card/40 px-2 py-3 text-center text-xs text-muted-foreground transition-colors",
							"hover:bg-muted/40",
							isLoading && "cursor-wait opacity-50",
						)}
					>
						<IconChevronLeft className="size-5" />
						<span>المزيد</span>
					</button>
				)}
			</div>
		</div>
	);
};
