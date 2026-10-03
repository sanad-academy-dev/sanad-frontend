import {
	IconAlertTriangle,
	IconCalendar,
	IconChevronDown,
	IconHelpCircle,
	IconPaperclip,
	IconPlus,
	IconUserX,
} from "@tabler/icons-react";
import { eachDayOfInterval, format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUpsertAttendance } from "@/features/services/staff/hooks/use-upsert-attendance";
import { cn } from "@/lib/utils";

// أسباب الغياب (واجهة — تُحفظ ضمن ملاحظات سجل الحضور)
const ABSENCE_REASONS = ["مرض مفاجئ", "ظرف طارئ", "بدون إذن", "أخرى"] as const;

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

// منتقي تاريخ (Popover + Calendar) — يعرض "اختر..." أو التاريخ المنسّق
function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex h-[34px] items-center justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px]"
				>
					<IconCalendar className="size-4 shrink-0 text-[#08090A]" />
					<span className={cn("text-[11px]", value ? "text-[#08090A]" : "text-[#9B9B9D]")}>
						{value
							? format(new Date(`${value}T00:00:00`), "d MMMM yyyy", { locale: arSA })
							: "اختر..."}
					</span>
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
						selected={value ? new Date(`${value}T00:00:00`) : undefined}
						onSelect={(d) => d && onChange(format(d, "yyyy-MM-dd"))}
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
							onClick={() => onChange("")}
							className="px-2 py-1 text-[14px] text-[#121217] hover:text-[#6366F1]"
						>
							إعادة الضبط
						</button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export function AttendanceAbsenceDialog({
	open,
	staffId,
	staffName,
	staffCode,
	onClose,
}: {
	open: boolean;
	staffId: string | null;
	staffName: string | null;
	staffCode: string | null;
	date: Date | null;
	onClose: () => void;
}) {
	const { upsertAsync, isPending } = useUpsertAttendance();

	const [reason, setReason] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [notes, setNotes] = useState("");
	const [notifyEmail, setNotifyEmail] = useState(false);

	useEffect(() => {
		if (open) {
			const d = format(new Date(), "yyyy-MM-dd");
			setReason("");
			setStartDate(d);
			setEndDate(d);
			setNotes("");
			setNotifyEmail(false);
		}
	}, [open]);

	const initials = (staffName ?? "")
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

	const canSubmit = !!reason && !!startDate && !!endDate && startDate <= endDate;

	const handleSubmit = async () => {
		if (!staffId || !canSubmit) return;
		const days = eachDayOfInterval({
			start: new Date(`${startDate}T00:00:00`),
			end: new Date(`${endDate}T00:00:00`),
		});
		const note = [reason, notes].filter(Boolean).join(" — ");

		await toast.promise(
			Promise.all(
				days.map((d) =>
					upsertAsync({
						staffId,
						date: format(d, "yyyy-MM-dd"),
						status: "ABSENT",
						hours: 0,
						notes: note || undefined,
					}),
				),
			),
			{
				loading: "جارٍ تسجيل الغياب...",
				success: "تم تسجيل الغياب",
				error: (err: Error) => err.message || "فشل تسجيل الغياب",
				position: "bottom-left",
			},
		);
		onClose();
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
				<DialogTitle className="sr-only">تسجيل غياب</DialogTitle>
				<DialogDescription className="sr-only">
					تسجيل غياب الموظف مع السبب وتاريخ البداية والنهاية
				</DialogDescription>

				{/* الرأس */}
				<div className="flex items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
					<div className="flex items-center gap-1.5 text-[10px]">
						<IconUserX className="size-3.5 text-[#272829]" />
						<span className="font-bold text-[#08090A]">تسجيل غياب</span>
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
					{/* تنبيه فترة التجربة */}
					<div className="flex items-center gap-2.5 rounded-[4px] bg-[#FFFBEA] px-2 py-3.5">
						<IconAlertTriangle className="size-3.5 shrink-0 text-[#C34E00]" />
						<span className="text-[12px] text-[#C34E00]">
							تأكد من صحة بيانات الغياب قبل التسجيل؛ سيؤثر ذلك على سجل حضور الموظف.
						</span>
					</div>

					{/* سبب الغياب */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel label="سبب الغياب" />
						<Select
							value={reason}
							onValueChange={setReason}
							dir="rtl"
						>
							<SelectTrigger className="h-[34px] w-full justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] text-[#08090A] data-placeholder:text-[#9B9B9D] [&>svg]:hidden">
								<IconChevronDown className="size-2.5 text-[#9B9B9D]" />
								<SelectValue placeholder="اختر..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{ABSENCE_REASONS.map((r) => (
									<SelectItem
										key={r}
										value={r}
									>
										{r}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* تاريخ البداية + النهاية */}
					<div className="flex items-start gap-4">
						<div className="flex flex-1 flex-col gap-1.5">
							<FieldLabel label="تاريخ نهاية الغياب" />
							<DateField
								value={endDate}
								onChange={setEndDate}
							/>
						</div>
						<div className="flex flex-1 flex-col gap-1.5">
							<FieldLabel label="تاريخ بدايه الغياب" />
							<DateField
								value={startDate}
								onChange={setStartDate}
							/>
						</div>
					</div>

					{/* ملاحظات */}
					<div className="flex flex-col gap-1.5">
						<span className="text-right text-[12px] font-medium text-[#08090A]">ملاحظات</span>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="أضف أي ملاحظات للغياب..."
							className="h-[74px] w-full resize-none rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[10.5px] py-[7px] text-right text-[13px] text-[#08090A] outline-none placeholder:text-[#08090A]/50"
						/>
					</div>
				</div>

				{/* التذييل */}
				<div className="flex items-center justify-between border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={isPending || !canSubmit}
						className="h-[25.5px] gap-2 rounded-[4px] bg-[#6366F1] text-[11px]"
					>
						<span className="rounded-[4px] bg-white/20 px-1 py-0.5 text-[8px]">⌘↵</span>
						تسجيل غياب
					</Button>
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] text-[#737373]">إشعار عبر البريد</span>
						<Switch
							checked={notifyEmail}
							onCheckedChange={setNotifyEmail}
						/>
						<button
							type="button"
							aria-label="إرفاق ملف"
							className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconPaperclip className="size-3.5" />
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
