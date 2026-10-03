import { IconCalendar, IconChevronDown, IconX } from "@tabler/icons-react";
import { arSA, enUS } from "date-fns/locale";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	ALL_TIME_RANGE,
	HISTORY_RANGE_PRESET_LABELS,
	HISTORY_RANGE_PRESETS,
	historyRangeLabel,
	type PatientHistoryRange,
	resolveHistoryRange,
} from "@/features/services/patients/utils/patient-history";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface PatientHistoryRangeFilterProps {
	value: PatientHistoryRange;
	onChange: (range: PatientHistoryRange) => void;
	/** عدد السجلات ضمن النطاق المختار — يطمئن أن الفلتر لم يُفرغ القائمة صدفةً */
	matchCount: number;
}

/**
 * فلتر الفترة: اختصارات جاهزة تغطّي الحالة الغالبة، وتقويم مدى لما عداها.
 * التصفية كلها على العميل — الخط الزمني مُحمَّل كاملًا أصلًا، فلا رحلة خادم
 * لكل تغيير نطاق.
 */
export function PatientHistoryRangeFilter({
	value,
	onChange,
	matchCount,
}: PatientHistoryRangeFilterProps) {
	const { lang } = useI18n();
	const [open, setOpen] = useState(false);

	const isFiltered = value.preset !== "ALL";
	const selectedRange: DateRange | undefined = value.from
		? { from: value.from, to: value.to ?? undefined }
		: undefined;

	return (
		<div className="flex items-center gap-1">
			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger asChild>
					<Button
						size="xs"
						variant={isFiltered ? "default" : "outline"}
					>
						<IconCalendar className="size-3.5" />
						{historyRangeLabel(value)}
						<IconChevronDown className="size-3" />
					</Button>
				</PopoverTrigger>

				<PopoverContent
					align="end"
					className="w-auto p-0"
					dir="rtl"
				>
					<div className="flex">
						{/* الاختصارات أولًا (يمين RTL) — الاختيار الغالب بنقرة واحدة */}
						<div className="flex w-32 shrink-0 flex-col gap-0.5 border-e p-1.5">
							{HISTORY_RANGE_PRESETS.map((preset) => (
								<button
									key={preset}
									type="button"
									onClick={() => {
										onChange(resolveHistoryRange(preset));
										setOpen(false);
									}}
									className={cn(
										"rounded-[4px] px-2 py-1.5 text-start text-xs transition-colors hover:bg-accent",
										value.preset === preset
											? "bg-primary/10 font-medium text-primary"
											: "text-muted-foreground",
									)}
								>
									{HISTORY_RANGE_PRESET_LABELS[preset]}
								</button>
							))}
						</div>

						<div className="flex flex-col">
							<Calendar
								mode="range"
								selected={selectedRange}
								defaultMonth={value.from ?? undefined}
								onSelect={(next) =>
									onChange({
										preset: "CUSTOM",
										from: next?.from ?? null,
										to: next?.to ?? null,
									})
								}
								locale={lang === "ar" ? arSA : enUS}
								numberOfMonths={1}
							/>

							<div className="flex items-center justify-between gap-2 border-t px-2 py-1.5">
								<span className="text-[11px] text-muted-foreground">
									<span className="tabular-nums">{matchCount}</span> سجل
								</span>
								<Button
									size="xs"
									variant="ghost"
									onClick={() => setOpen(false)}
								>
									تم
								</Button>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>

			{isFiltered && (
				<Button
					size="icon"
					variant="ghost"
					className="size-6"
					onClick={() => onChange(ALL_TIME_RANGE)}
					aria-label="مسح فلتر الفترة"
				>
					<IconX className="size-3.5" />
				</Button>
			)}
		</div>
	);
}
