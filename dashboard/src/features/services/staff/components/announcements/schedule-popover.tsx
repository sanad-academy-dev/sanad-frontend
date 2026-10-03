// قائمة "توقيت النشر" — تقويم لاختيار تاريخ + تفعيل التذكيرات/الجدولة (مطابق لتصميم Figma)
import { IconBell, IconBellOff, IconCalendarClock, IconClock } from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export function SchedulePopover({
	date,
	onDateChange,
}: {
	date: Date | undefined;
	onDateChange: (date: Date | undefined) => void;
}) {
	const { lang } = useI18n();
	const locale = lang === "ar" ? arSA : enUS;
	const [open, setOpen] = useState(false);
	const [remindersEnabled, setRemindersEnabled] = useState(false);
	const [schedulingEnabled, setSchedulingEnabled] = useState(false);
	const [publishTime, setPublishTime] = useState("02:00");

	const reset = () => {
		onDateChange(undefined);
		setRemindersEnabled(false);
		setSchedulingEnabled(false);
		setPublishTime("02:00");
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"flex h-[23px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[5px] text-[10px] font-medium text-[#08090A] transition-colors hover:bg-[#F9FAFB]",
						open && "bg-[#F9FAFB]",
					)}
				>
					<IconCalendarClock className="size-[11px]" />
					<span>{date ? format(date, "d MMMM yyyy", { locale }) : "توقيت النشر"}</span>
				</button>
			</PopoverTrigger>

			<PopoverContent
				align="start"
				dir="rtl"
				className="w-[445px] rounded-[4px] border border-[#E5E5E5] p-0 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
			>
				<div className="flex flex-col gap-2 px-6 py-[6px]">
					{/* التقويم */}
					<Calendar
						mode="single"
						selected={date}
						onSelect={onDateChange}
						locale={locale}
						className="w-full p-0"
					/>

					<div className="h-px w-full bg-[#EBEBEF]" />

					{/* تفعيل التذكيرات */}
					<div className="flex items-center justify-between py-1">
						<span className="text-[14px] font-semibold text-[#08090A]">تفعيل التذكيرات</span>
						<Switch
							size="sm"
							checked={remindersEnabled}
							onCheckedChange={setRemindersEnabled}
						/>
					</div>

					<div className="h-px w-full bg-[#EBEBEF]" />

					{/* تفعيل الجدولة */}
					<div className="flex items-center justify-between py-1">
						<span className="text-[14px] font-semibold text-[#08090A]">تفعيل الجدولة</span>
						<Switch
							size="sm"
							checked={schedulingEnabled}
							onCheckedChange={setSchedulingEnabled}
						/>
					</div>

					{/* صف توقيت النشر — يظهر عند تفعيل الجدولة */}
					{schedulingEnabled && (
						<div className="flex items-center gap-[7px] pb-1">
							<div className="flex flex-1 items-center justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] p-1">
								<div className="flex items-center gap-[5px]">
									<IconClock className="size-[11px] text-[#08090A]" />
									<span className="text-[11px] font-medium text-[#08090A]">
										توقيت نشر الإعلان
									</span>
								</div>
								<input
									type="time"
									value={publishTime}
									onChange={(e) => setPublishTime(e.target.value)}
									className="w-[70px] bg-transparent text-right text-[11px] font-medium text-[#08090A] outline-none"
								/>
							</div>
							{/* مؤشّرات التذكير */}
							<div className="flex items-center gap-[2px]">
								<IconBellOff
									className="size-3 text-[#EF4444]"
									stroke={1}
								/>
								<IconBell
									className="size-3 text-[#6366F1]"
									stroke={1}
								/>
							</div>
						</div>
					)}

					<div className="h-px w-full bg-[#EBEBEF]" />

					{/* إعادة الضبط */}
					<button
						type="button"
						onClick={reset}
						className="py-1 text-right text-[14px] text-[#121217] transition-colors hover:text-[#4F6AE0]"
					>
						إعادة الضبط
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
