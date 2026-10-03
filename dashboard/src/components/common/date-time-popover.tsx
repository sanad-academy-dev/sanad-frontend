import { IconCalendarPlus } from "@tabler/icons-react";
import { arSA, enUS } from "date-fns/locale";
import { useState } from "react";

import { buildTimeOptions } from "@/components/common/time-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

// مُنتقي «تاريخ + وقت» بنفس شكل حجز الزيارة وطلب التحاليل: زر شريطي يفتح
// تقويمًا فوق شبكة أوقات. يُستعمل حيثما كان الموعد حقلًا واحدًا في شريط
// التفاصيل لا حقلين منفصلين.

/** يجمع لحظةً من تاريخ ودقيقة اليوم بالتوقيت المحلي */
const combineDateAndMinute = (date: Date, minute: number): Date => {
	const value = new Date(date);
	value.setHours(0, 0, 0, 0);
	value.setMinutes(minute);
	return value;
};

const minuteOfDay = (date: Date) => date.getHours() * 60 + date.getMinutes();

/** أقرب ربع ساعة قادم — قيمة ابتدائية معقولة بدل «الآن» بثوانيه */
export const nextQuarterHourDate = (from: Date = new Date()): Date => {
	const value = new Date(from);
	value.setSeconds(0, 0);
	value.setMinutes(Math.ceil(value.getMinutes() / 15) * 15);
	return value;
};

export function DateTimePopover({
	value,
	onChange,
	placeholder = "اختر الموعد",
	disabled,
	invalid,
	className,
	timeLabel = "الوقت",
}: {
	/** اللحظة المختارة — null يعني لم يُختر بعد */
	value: Date | null;
	onChange: (value: Date) => void;
	placeholder?: string;
	disabled?: boolean;
	invalid?: boolean;
	className?: string;
	timeLabel?: string;
}) {
	const { lang, isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";
	const [open, setOpen] = useState(false);

	const options = buildTimeOptions("H12");
	const selectedMinute = value ? minuteOfDay(value) : null;

	const dateText = value
		? new Intl.DateTimeFormat(isRtl ? "ar-EG" : "en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
				calendar: "gregory",
			}).format(value)
		: null;
	const timeText =
		selectedMinute != null
			? (options.find((o) => o.value === selectedMinute)?.label ??
				new Intl.DateTimeFormat(isRtl ? "ar-EG" : "en-US", {
					hour: "numeric",
					minute: "2-digit",
				}).format(value as Date))
			: null;

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={disabled}
					aria-invalid={invalid}
					className={cn("h-9 gap-2 aria-invalid:border-destructive", className)}
				>
					<IconCalendarPlus className="size-4" />
					{dateText ? (
						<span className="truncate">
							{dateText}
							{timeText ? ` · ${timeText}` : ""}
						</span>
					) : (
						placeholder
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align={isRtl ? "end" : "start"}
				dir={dir}
				className="w-[340px] space-y-2 p-3"
			>
				<Calendar
					mode="single"
					className="w-full p-0"
					locale={lang === "ar" ? arSA : enUS}
					selected={value ?? undefined}
					onSelect={(picked) => {
						if (!picked) return;
						// تغيير اليوم يحفظ الوقت المختار — وإلا ضاع باختيار تاريخ آخر
						onChange(combineDateAndMinute(picked, selectedMinute ?? 9 * 60));
					}}
				/>

				<div className="space-y-2">
					<Label className="text-xs font-medium">{timeLabel}</Label>
					<div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto">
						{options.map((option) => (
							<Button
								key={option.value}
								type="button"
								variant={selectedMinute === option.value ? "default" : "outline"}
								size="sm"
								className="h-9 text-xs"
								onClick={() => {
									onChange(combineDateAndMinute(value ?? new Date(), option.value));
									setOpen(false);
								}}
							>
								{option.label}
							</Button>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
