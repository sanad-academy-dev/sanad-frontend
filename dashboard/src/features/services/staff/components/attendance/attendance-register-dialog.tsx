import {
	IconCalendar,
	IconCircleCheckFilled,
	IconClock,
	IconHelpCircle,
	IconLogin,
	IconPlus,
	IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useUpsertAttendance } from "@/features/services/staff/hooks/use-upsert-attendance";
import { cn } from "@/lib/utils";

// توست نجاح التسجيل (بطاقة بيضاء + علامة خضراء + زر إغلاق) — أسفل يسار
function showRegisterToast(message: string) {
	toast.custom(
		(id) => (
			<div className="flex w-[345px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]">
				<button
					type="button"
					onClick={() => toast.dismiss(id)}
					aria-label="إغلاق"
					className="flex size-5 shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] opacity-40 hover:opacity-100"
				>
					<IconX className="size-3" />
				</button>
				<span className="flex-1 text-right text-[12px] font-semibold leading-[18px] text-[#08090A]">
					{message}
				</span>
				<IconCircleCheckFilled className="size-5 shrink-0 text-[#008A2E]" />
			</div>
		),
		{ position: "bottom-left", duration: 5000 },
	);
}

// شارة "مطلوب"
function RequiredBadge() {
	return (
		<span className="rounded-[4px] bg-[#DC2626]/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium text-[#DC2626]">
			مطلوب
		</span>
	);
}

function FieldLabel({ label }: { label: string }) {
	return (
		<div className="flex items-center gap-1.5">
			<span className="text-[11px] font-medium text-[#08090A]">{label}</span>
			<RequiredBadge />
			<IconHelpCircle className="size-2.5 text-[#9B9B9D] opacity-50" />
		</div>
	);
}

export function AttendanceRegisterDialog({
	open,
	staffId,
	staffName,
	staffCode,
	date,
	defaultCheckInTime,
	defaultCheckOutTime,
	defaultShowCheckOut,
	onClose,
}: {
	open: boolean;
	staffId: string | null;
	staffName: string | null;
	staffCode: string | null;
	date: Date | null;
	defaultCheckInTime?: string;
	defaultCheckOutTime?: string;
	defaultShowCheckOut?: boolean;
	onClose: () => void;
}) {
	const { upsertAsync, isPending } = useUpsertAttendance();

	const [dateValue, setDateValue] = useState("");
	const [checkInTime, setCheckInTime] = useState("09:00");
	const [checkOutTime, setCheckOutTime] = useState("");
	const [showCheckOut, setShowCheckOut] = useState(false);
	const [notifyManager, setNotifyManager] = useState(false);

	// إعادة ضبط القيم عند فتح النافذة على يوم/موظف جديد
	useEffect(() => {
		if (open && date) {
			setDateValue(format(date, "yyyy-MM-dd"));
			setCheckInTime(defaultCheckInTime ?? "09:00");
			setCheckOutTime(defaultCheckOutTime ?? "");
			setShowCheckOut(defaultShowCheckOut ?? false);
			setNotifyManager(false);
		}
	}, [open, date, defaultCheckInTime, defaultCheckOutTime, defaultShowCheckOut]);

	const initials = (staffName ?? "")
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

	// وضع الانصراف — يُفتح بعد تسجيل الحضور: التاريخ ووقت الحضور غير قابلين للتعديل
	const checkoutMode = !!defaultShowCheckOut;

	const summaryDate = dateValue
		? format(new Date(`${dateValue}T00:00:00`), "d MMMM، yyyy", { locale: arSA })
		: "";
	const summaryTime = (checkoutMode ? checkOutTime : checkInTime) || checkInTime;
	const period = Number(summaryTime.slice(0, 2)) < 12 ? "صباحًا" : "مساءً";
	const verb = checkoutMode ? "انصراف" : "حضور";

	// صباحًا/مساءً لوقت الانصراف
	const checkOutRef = useRef<HTMLInputElement>(null);
	const checkOutPeriod = checkOutTime
		? Number(checkOutTime.slice(0, 2)) < 12
			? "صباحًا"
			: "مساءً"
		: "";

	const handleSubmit = async () => {
		if (!staffId || !dateValue) return;
		const checkIn = `${dateValue}T${checkInTime}:00`;
		let checkOut: string | null = null;
		let hours = 0;
		if (showCheckOut && checkOutTime) {
			checkOut = `${dateValue}T${checkOutTime}:00`;
			hours =
				Math.round(
					((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 3.6e6) * 100,
				) / 100;
			if (hours < 0) hours = 0;
		}
		const time12 = format(new Date(`2000-01-01T${summaryTime}:00`), "hh:mm");
		try {
			await upsertAsync({
				staffId,
				date: dateValue,
				status: "PRESENT",
				hours,
				checkIn,
				checkOut,
			});
			showRegisterToast(`تم تسجيل ${verb} ${staffName} في ${time12} ${period} بنجاح`);
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "فشل التسجيل", {
				position: "bottom-left",
			});
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => !o && onClose()}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="w-[620px] max-w-[620px] gap-0 overflow-hidden p-0 sm:max-w-[620px]"
			>
				<DialogTitle className="sr-only">تسجيل حضور وانصراف</DialogTitle>
				<DialogDescription className="sr-only">
					تسجيل حضور أو انصراف الموظف مع التاريخ والوقت
				</DialogDescription>

				{/* الرأس */}
				<div className="flex items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
					<div className="flex items-center gap-1.5 text-[10px]">
						<IconLogin className="size-3.5 text-[#272829]" />
						<span className="font-bold text-[#08090A]">تسجيل حضور وانصراف</span>
						<span className="text-[#9B9B9D]">›</span>
						<span className="text-[13px] font-bold text-[#08090A]">{staffName}</span>
						<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
							{initials}
						</span>
						<span className="text-[#9B9B9D]">›</span>
						<span className="font-mono text-[10px] text-[#9B9B9D]">{staffCode}</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="إغلاق"
						className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
					>
						<IconPlus className="size-3.5 rotate-45" />
					</button>
				</div>

				{/* الجسم */}
				<div className="flex flex-col gap-4 px-[15px] py-3">
					{/* تنبيه ملخّص */}
					<div className="flex items-center gap-2.5 rounded-[4px] bg-[#FFFBEA] px-2 py-3.5">
						<IconClock className="size-3.5 shrink-0 text-[#C34E00]" />
						<span className="text-[12px] text-[#C34E00]">
							{verb} {staffName} بتاريخ {summaryDate} - الساعة {summaryTime} {period}
						</span>
					</div>

					{/* التاريخ */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel label="التاريخ" />
						<Popover>
							<PopoverTrigger asChild>
								<button
									type="button"
									disabled={checkoutMode}
									className="flex h-[34px] items-center justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] disabled:opacity-60"
								>
									<span
										className={cn(
											"text-[11px]",
											dateValue ? "text-[#08090A]" : "text-[#9B9B9D]",
										)}
									>
										{dateValue
											? format(new Date(`${dateValue}T00:00:00`), "d MMMM yyyy", {
													locale: arSA,
												})
											: "اختر..."}
									</span>
									<IconCalendar className="size-4 shrink-0 text-[#08090A]" />
								</button>
							</PopoverTrigger>
							<PopoverContent
								align="end"
								dir="rtl"
								className="w-[445px] rounded-[4px] p-0 shadow-xl"
							>
								<div className="flex flex-col gap-2 px-6 py-1.5">
									<Calendar
										mode="single"
										locale={arSA}
										weekStartsOn={1}
										showOutsideDays
										selected={dateValue ? new Date(`${dateValue}T00:00:00`) : undefined}
										onSelect={(d) => d && setDateValue(format(d, "yyyy-MM-dd"))}
										formatters={{
											formatWeekdayName: (d) =>
												d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
										}}
										className="w-full p-0 [--cell-radius:9999px] [--cell-size:--spacing(10)]"
										classNames={{
											month_caption:
												"flex h-(--cell-size) w-full items-center justify-center text-base font-medium text-[#08090A]",
											weekday: "flex-1 text-[14px] font-normal text-[#667085] select-none",
											day: "group/day relative aspect-square h-full w-full rounded-full p-0 text-center select-none",
										}}
									/>
									{/* إعادة الضبط */}
									<div className="flex justify-end border-t border-[#EBEBEF] pt-1.5">
										<button
											type="button"
											onClick={() => setDateValue("")}
											className="px-2 py-1 text-[14px] text-[#121217] hover:text-[#6366F1]"
										>
											إعادة الضبط
										</button>
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</div>

					{/* وضع الانصراف: عمودان (الحضور معطّل + الانصراف قابل للتعديل) */}
					{checkoutMode ? (
						<div className="flex items-start gap-2.5">
							{/* توقيت الحضور — يمين (معطّل) */}
							<div className="flex flex-1 flex-col gap-1.5">
								<FieldLabel label="توقيت الحضور" />
								<div className="flex h-[34px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#F9FAFB] px-[9px] opacity-70">
									<IconClock className="size-3 shrink-0 text-[#08090A]" />
									<input
										type="time"
										value={checkInTime}
										disabled
										readOnly
										className="w-full bg-transparent text-[11px] text-[#08090A] outline-none"
									/>
								</div>
							</div>
							{/* توقيت الإنصراف — يسار (قابل للتعديل + X) */}
							<div className="flex flex-1 flex-col gap-1.5">
								<FieldLabel label="توقيت الإنصراف" />
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => setCheckOutTime("")}
										aria-label="إزالة"
										className="flex size-4 shrink-0 items-center justify-center rounded-full text-[#DC2626]"
									>
										<IconX className="size-3.5" />
									</button>
									<div className="flex h-[34px] flex-1 items-center justify-between gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px]">
										{/* الوقت المدخل — يمين */}
										<input
											ref={checkOutRef}
											type="time"
											dir="ltr"
											value={checkOutTime}
											onChange={(e) => setCheckOutTime(e.target.value)}
											className="min-w-0 flex-1 bg-transparent text-right text-[11px] text-[#08090A] outline-none [&::-webkit-calendar-picker-indicator]:hidden"
										/>
										{/* صباحًا/مساءً + أيقونة الساعة — يسار */}
										<div className="flex shrink-0 items-center gap-1.5 text-[11px] text-[#08090A]">
											<span className="tabular-nums">{checkOutPeriod}</span>
											<button
												type="button"
												onClick={() => checkOutRef.current?.showPicker?.()}
												aria-label="اختيار الوقت"
											>
												<IconClock className="size-3 text-[#08090A]" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-1.5">
							<FieldLabel label="توقيت الحضور" />
							<div className="flex items-center gap-2.5">
								<div className="flex h-[34px] flex-1 items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px]">
									<IconClock className="size-3 shrink-0 text-[#08090A]" />
									<input
										type="time"
										value={checkInTime}
										onChange={(e) => setCheckInTime(e.target.value)}
										className="w-full bg-transparent text-[11px] text-[#08090A] outline-none"
									/>
								</div>
								<button
									type="button"
									onClick={() => setShowCheckOut(true)}
									className="flex shrink-0 items-center gap-2 text-[14px] font-semibold text-[#6941C6]"
								>
									<IconPlus className="size-4" />
									تسجيل انصراف
								</button>
							</div>
						</div>
					)}
				</div>

				{/* التذييل */}
				<div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] text-[#737373]">إشعار المدير عبر البريد</span>
						<Switch
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
						/>
					</div>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={isPending || !dateValue || (checkoutMode && !checkOutTime)}
						className={cn("h-[25.5px] gap-2 rounded-[4px] bg-[#6366F1] text-[11px]")}
					>
						<span className="rounded-[4px] bg-white/20 px-1 py-0.5 text-[8px]">⌘↵</span>
						{checkoutMode ? "تسجيل انصراف" : "تسجيل حاضر"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
