import {
	IconArrowsDiagonal,
	IconCalendar,
	IconChevronLeft,
	IconCircleCheckFilled,
	IconClock,
	IconHelpCircle,
	IconPlus,
	IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useUpsertAttendance } from "@/features/services/staff/hooks/use-upsert-attendance";
import { cn } from "@/lib/utils";

// الموظف المحدد (المعرف + الاسم + وقت حضوره المسجّل إن وجد) — مشتق من قائمة الموظفين
export type BulkPickedStaff = { id: string; name: string; checkIn?: string | null };

// وضع الدايلوج: تسجيل حضور (الافتراضي) أو تسجيل انصراف لموظفين حاضرين
export type BulkRegisterMode = "checkin" | "checkout";

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

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export function AttendanceBulkRegisterDialog({
	staff,
	mode = "checkin",
	onClose,
}: {
	staff: BulkPickedStaff[] | null;
	mode?: BulkRegisterMode;
	onClose: () => void;
}) {
	const open = !!staff && staff.length > 0;
	const isCheckout = mode === "checkout";
	const { upsertAsync, isPending } = useUpsertAttendance();

	const [dateValue, setDateValue] = useState("");
	const [checkInTime, setCheckInTime] = useState("09:00");
	const [showCheckOut, setShowCheckOut] = useState(false);
	const [checkOutTime, setCheckOutTime] = useState("");
	const [notifyManager, setNotifyManager] = useState(false);
	// الموظفون المختارون فعليًا للتسجيل (افتراضيًا الكل) — قابل للتبديل بالنقر على الشارة
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	// إعادة الضبط عند كل فتح — في وضع الانصراف نثبّت التاريخ على اليوم
	useEffect(() => {
		if (open) {
			setDateValue(isCheckout ? format(new Date(), "yyyy-MM-dd") : "");
			setCheckInTime("09:00");
			setShowCheckOut(false);
			setCheckOutTime("");
			setNotifyManager(false);
			setSelectedIds(new Set((staff ?? []).map((s) => s.id)));
		}
	}, [open, isCheckout, staff]);

	const toggleStaff = (id: string) =>
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const checkInPeriod = Number(checkInTime.slice(0, 2)) < 12 ? "صباحًا" : "مساءً";
	const checkOutPeriod = checkOutTime
		? Number(checkOutTime.slice(0, 2)) < 12
			? "صباحًا"
			: "مساءً"
		: "";

	// وقت الحضور المسجّل (للعرض المعطّل في وضع الانصراف) — موحّد أو "متعدد"
	const checkInDisplay = useMemo(() => {
		const times = [
			...new Set(
				(staff ?? [])
					.filter((s) => selectedIds.has(s.id))
					.map((s) => (s.checkIn ? format(new Date(s.checkIn), "hh:mm a") : ""))
					.filter(Boolean),
			),
		];
		if (times.length === 0) return "—";
		return times.length === 1 ? times[0] : "متعدد";
	}, [staff, selectedIds]);

	const handleSubmit = async () => {
		if (!staff || !dateValue) return;
		if (isCheckout && !checkOutTime) return;

		const targets = staff.filter((s) => selectedIds.has(s.id));
		if (targets.length === 0) return;

		const count = targets.length;
		const successMsg = isCheckout
			? `تم تسجيل انصراف (${count}) بنجاح`
			: `تم تسجيل حضور (${count}) بنجاح`;
		const toastId = toast.loading(
			isCheckout ? "جارٍ تسجيل الانصراف..." : "جارٍ تسجيل الحضور...",
			{ position: "bottom-left" },
		);
		try {
			await Promise.all(
				targets.map((s) => {
					// الانصراف: نُبقي حضور الموظف المسجّل ونُضيف وقت الانصراف
					const checkIn = isCheckout
						? (s.checkIn ?? `${dateValue}T${checkInTime}:00`)
						: `${dateValue}T${checkInTime}:00`;
					let checkOut: string | null = null;
					let hours = 0;
					if (isCheckout || (showCheckOut && checkOutTime)) {
						checkOut = `${dateValue}T${checkOutTime}:00`;
						hours =
							Math.round(
								((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 3.6e6) * 100,
							) / 100;
						if (hours < 0) hours = 0;
					}
					return upsertAsync({
						staffId: s.id,
						date: dateValue,
						status: "PRESENT",
						hours,
						checkIn,
						checkOut,
					});
				}),
			);
			toast.dismiss(toastId);
			// توست نجاح مخصّص — مطابق لتصميم Figma (أسفل اليسار)
			toast.custom(
				(id) => (
					<div className="flex w-[188px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]">
						<button
							type="button"
							onClick={() => toast.dismiss(id)}
							aria-label="إغلاق"
							className="flex size-5 shrink-0 items-center justify-center rounded-[4px] opacity-40"
						>
							<IconX className="size-3 text-[#9B9B9D]" />
						</button>
						<span className="flex-1 text-right text-[12px] font-medium text-black">
							{successMsg}
						</span>
						<IconCircleCheckFilled className="size-5 shrink-0 text-[#008A2E]" />
					</div>
				),
				{ position: "bottom-left" },
			);
			onClose();
		} catch (err) {
			toast.error(
				(err as Error).message || (isCheckout ? "فشل تسجيل الانصراف" : "فشل تسجيل الحضور"),
				{ id: toastId, position: "bottom-left" },
			);
		}
	};

	const count = selectedIds.size;

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => !o && onClose()}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="w-[620px] max-w-[620px] gap-0 overflow-hidden rounded-[4px] p-0 sm:max-w-[620px]"
			>
				<DialogTitle className="sr-only">تسجيل حضور وانصراف جماعي</DialogTitle>
				<DialogDescription className="sr-only">
					تسجيل حضور أو انصراف لعدة موظفين دفعة واحدة مع التاريخ والوقت
				</DialogDescription>

				{/* الرأس — مسار التنقّل (يمين) + أزرار (يسار) */}
				<div className="flex items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] font-bold text-[#08090A]">الحضور والانصراف</span>
						<IconChevronLeft className="size-[9px] text-[#272829]" />
						<span className="text-[10px] font-bold text-[#08090A]">تسجيل حضور وانصراف</span>
					</div>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							aria-label="توسيع"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconArrowsDiagonal className="size-3" />
						</button>
						<button
							type="button"
							onClick={onClose}
							aria-label="إغلاق"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* الجسم */}
				<div className="flex flex-col gap-4 px-[15px] py-3">
					{/* الموظفون المحددون — صندوق أصفر مع شارات */}
					<div className="flex flex-col gap-[5px] rounded-[4px] bg-[#FFFBEA] p-[7.5px]">
						<div className="flex items-center justify-between">
							<span className="text-[10px] text-[#08090A]">الموظفون المحددون ({count})</span>
							<span className="rounded-[4px] bg-[#3B82F6]/[0.05] px-1.5 py-[1.5px] text-[8px] font-semibold text-[#6366F1]">
								تسجيل جماعي
							</span>
						</div>
						<div className="flex flex-wrap items-center justify-start gap-1.5">
							{staff?.map((s) => {
								const isSel = selectedIds.has(s.id);
								return (
									<button
										key={s.id}
										type="button"
										onClick={() => toggleStaff(s.id)}
										className={cn(
											"flex items-center gap-[4.5px] rounded-[4px] border-[0.75px] px-1.5 py-[3px]",
											isSel
												? "border-[#DC2626] bg-[rgba(255,30,30,0.05)]"
												: "border-[#E5E5E5] bg-white",
										)}
									>
										<span className="text-[9px] text-[#08090A]">{s.name}</span>
										<span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-[6px] font-semibold text-[#F5F5F6]">
											{initialsOf(s.name)}
										</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* التاريخ */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel label="التاريخ" />
						<Popover>
							<PopoverTrigger asChild>
								<button
									type="button"
									className="flex h-[34px] items-center justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px]"
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

					{isCheckout ? (
						/* وضع الانصراف — توقيت الحضور (يمين معطّل) + توقيت الإنصراف (يسار) */
						<div className="flex items-start gap-2.5">
							<div className="flex flex-1 flex-col gap-1.5">
								<FieldLabel label="توقيت الحضور" />
								<div className="flex h-[34px] items-center justify-between gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#9B9B9D]/[0.24] px-[9px] opacity-80">
									<span className="text-[11px] text-[#08090A] tabular-nums">
										{checkInDisplay}
									</span>
									<IconClock className="size-3 shrink-0 text-[#08090A]" />
								</div>
							</div>
							<div className="flex flex-1 flex-col gap-1.5">
								<FieldLabel label="توقيت الإنصراف" />
								<div className="flex items-center gap-2">
									<div className="flex h-[34px] flex-1 items-center justify-between gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px]">
										<input
											type="time"
											value={checkOutTime}
											onChange={(e) => setCheckOutTime(e.target.value)}
											className="min-w-0 flex-1 bg-transparent text-right text-[11px] text-[#08090A] outline-none [&::-webkit-calendar-picker-indicator]:hidden"
										/>
										<div className="flex shrink-0 items-center gap-1.5 text-[11px] text-[#08090A]">
											<span className="tabular-nums">{checkOutPeriod}</span>
											<IconClock className="size-3 text-[#08090A]" />
										</div>
									</div>
									<button
										type="button"
										onClick={() => setCheckOutTime("")}
										aria-label="إزالة"
										className="flex size-4 shrink-0 items-center justify-center text-[#EF4444]"
									>
										<IconX className="size-3.5" />
									</button>
								</div>
							</div>
						</div>
					) : (
						<>
							{/* توقيت الحضور (+ تسجيل انصراف على نفس السطر) */}
							<div className="flex flex-col gap-1.5">
								<FieldLabel label="توقيت الحضور" />
								<div className="flex items-center gap-2.5">
									<div className="flex h-[34px] flex-1 items-center justify-between gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px]">
										<input
											type="time"
											value={checkInTime}
											onChange={(e) => setCheckInTime(e.target.value)}
											className="min-w-0 flex-1 bg-transparent text-right text-[11px] text-[#08090A] outline-none [&::-webkit-calendar-picker-indicator]:hidden"
										/>
										<div className="flex shrink-0 items-center gap-1.5 text-[11px] text-[#08090A]">
											<span className="tabular-nums">{checkInPeriod}</span>
											<IconClock className="size-3 text-[#08090A]" />
										</div>
									</div>
									{!showCheckOut && (
										<button
											type="button"
											onClick={() => setShowCheckOut(true)}
											className="flex shrink-0 items-center gap-2 text-[14px] font-semibold text-[#6941C6]"
										>
											<IconPlus className="size-4" />
											تسجيل انصراف
										</button>
									)}
								</div>
							</div>

							{/* توقيت الإنصراف (يظهر بعد الضغط على تسجيل انصراف) */}
							{showCheckOut && (
								<div className="flex flex-col gap-1.5">
									<div className="flex items-center justify-between">
										<FieldLabel label="توقيت الإنصراف" />
										<button
											type="button"
											onClick={() => {
												setShowCheckOut(false);
												setCheckOutTime("");
											}}
											aria-label="إزالة الانصراف"
											className="flex items-center gap-1 text-[11px] text-[#DC2626]"
										>
											<IconX className="size-3.5" />
											إزالة
										</button>
									</div>
									<div className="flex h-[34px] items-center justify-between gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px]">
										<input
											type="time"
											value={checkOutTime}
											onChange={(e) => setCheckOutTime(e.target.value)}
											className="min-w-0 flex-1 bg-transparent text-right text-[11px] text-[#08090A] outline-none [&::-webkit-calendar-picker-indicator]:hidden"
										/>
										<div className="flex shrink-0 items-center gap-1.5 text-[11px] text-[#08090A]">
											<span className="tabular-nums">{checkOutPeriod}</span>
											<IconClock className="size-3 text-[#08090A]" />
										</div>
									</div>
								</div>
							)}
						</>
					)}
				</div>

				{/* التذييل — زر التسجيل (يسار) + إشعار المدير (يمين) */}
				<div className="flex items-center justify-between border-t border-[#E5E5E5] px-3 py-[7.5px]">
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
						disabled={
							isPending ||
							!dateValue ||
							selectedIds.size === 0 ||
							((isCheckout || showCheckOut) && !checkOutTime)
						}
						className="h-[25.5px] gap-2 rounded-[4px] bg-[#6366F1] text-[11px]"
					>
						<span className="rounded-[4px] bg-white/20 px-1 py-0.5 text-[8px]">⌘↵</span>
						{isCheckout ? "تسجيل انصراف" : "تسجيل حاضر"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
