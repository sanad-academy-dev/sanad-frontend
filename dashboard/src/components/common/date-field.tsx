// حقل اختيار تاريخ (Popover + Calendar) يخزّن القيمة نصًا بصيغة "yyyy-MM-dd".
import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { type ComponentProps, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// التاريخ يُحفظ كنص محايد المنطقة الزمنية؛ التحويل لكائن Date يتم عند منتصف الليل المحلي
const toDate = (value: string) => new Date(`${value}T00:00:00`);

export function DateField({
	value,
	onChange,
	placeholder,
	disabled,
	invalid,
	className,
	triggerDisabled,
}: {
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
	disabled?: ComponentProps<typeof Calendar>["disabled"];
	invalid?: boolean;
	className?: string;
	triggerDisabled?: boolean;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					disabled={triggerDisabled}
					aria-invalid={invalid}
					className={cn(
						"flex h-9 items-center justify-between rounded-[4px] border border-input bg-transparent px-2.5 transition-colors hover:bg-muted/40",
						"disabled:cursor-not-allowed disabled:opacity-50",
						"aria-invalid:border-destructive",
						className,
					)}
				>
					<span
						className={cn(
							"text-[12px] tabular-nums",
							value ? "text-foreground" : "text-muted-foreground",
						)}
					>
						{value ? format(toDate(value), "d MMMM yyyy", { locale: arSA }) : placeholder}
					</span>
					<IconCalendar className="size-4 shrink-0 text-muted-foreground" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				dir="rtl"
				className="w-[320px] rounded-[4px] p-0 shadow-xl"
			>
				<div className="flex flex-col gap-2 px-4 py-2">
					<Calendar
						mode="single"
						locale={arSA}
						weekStartsOn={1}
						showOutsideDays
						disabled={disabled}
						selected={value ? toDate(value) : undefined}
						onSelect={(d) => {
							if (d) {
								onChange(format(d, "yyyy-MM-dd"));
								setOpen(false);
							}
						}}
						formatters={{
							formatWeekdayName: (d) =>
								d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
						}}
						className="w-full p-0 [--cell-radius:9999px] [--cell-size:--spacing(9)]"
						classNames={{
							month_caption:
								"flex h-(--cell-size) w-full items-center justify-center text-sm font-medium text-foreground",
							weekday: "flex-1 text-[12px] font-normal text-muted-foreground select-none",
							day: "group/day relative aspect-square h-full w-full rounded-full p-0 text-center select-none",
						}}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
