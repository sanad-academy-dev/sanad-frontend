import {
	IconAlertTriangle,
	IconArrowsDiagonal,
	IconCalendar,
	IconChevronDown,
	IconChevronLeft,
	IconHelpCircle,
	IconX,
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
import type { BulkLeaveReview } from "@/features/services/staff/components/attendance/attendance-bulk-leave-review-dialog";
import type { BulkPickedStaff } from "@/features/services/staff/components/attendance/attendance-bulk-register-dialog";
import { LEAVE_TYPES } from "@/features/services/staff/data/leave-types";
import { useCreateLeaveRequest } from "@/features/services/staff/hooks/use-create-leave-request";
import { cn } from "@/lib/utils";

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

// منتقي تاريخ (Popover + Calendar) — يعرض "اختر..." أو التاريخ المنسّق
function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex h-[34px] items-center justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px]"
				>
					<span
						className={cn(
							"text-right text-[11px]",
							value ? "text-[#08090A]" : "text-[#9B9B9D]",
						)}
					>
						{value
							? format(new Date(`${value}T00:00:00`), "d MMMM yyyy", { locale: arSA })
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

export function AttendanceBulkLeaveDialog({
	staff,
	onClose,
	onSubmitted,
}: {
	staff: BulkPickedStaff[] | null;
	onClose: () => void;
	onSubmitted: (reviews: BulkLeaveReview[]) => void;
}) {
	const open = !!staff && staff.length > 0;
	const { createLeaveRequestAsync, isPending } = useCreateLeaveRequest();

	const [leaveType, setLeaveType] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [notes, setNotes] = useState("");
	const [notifyManager, setNotifyManager] = useState(false);
	// الموظفون المختارون فعليًا (افتراضيًا الكل) — قابل للتبديل بالنقر على الشارة
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (open) {
			const today = format(new Date(), "yyyy-MM-dd");
			setLeaveType("");
			setStartDate(today);
			setEndDate(today);
			setNotes("");
			setNotifyManager(false);
			setSelectedIds(new Set((staff ?? []).map((s) => s.id)));
		}
	}, [open, staff]);

	const toggleStaff = (id: string) =>
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const count = selectedIds.size;
	const canSubmit =
		!!leaveType && !!startDate && !!endDate && startDate <= endDate && count > 0;

	const handleSubmit = async () => {
		if (!staff || !canSubmit) return;
		const targets = staff.filter((s) => selectedIds.has(s.id));
		const days = eachDayOfInterval({
			start: new Date(`${startDate}T00:00:00`),
			end: new Date(`${endDate}T00:00:00`),
		}).length;

		const toastId = toast.loading("جارٍ تسجيل الإجازات...", { position: "bottom-left" });
		try {
			const created = await Promise.all(
				targets.map(async (s) => {
					const res = await createLeaveRequestAsync({
						staffId: s.id,
						type: leaveType,
						startDate,
						endDate,
						days,
						notes: notes || undefined,
					});
					return { requestId: res.id, name: s.name };
				}),
			);
			toast.dismiss(toastId);
			onClose();
			// فتح لوحة مراجعة الطلبات للموظفين المختارين
			onSubmitted(created);
		} catch (err) {
			toast.error((err as Error).message || "فشل تسجيل الإجازات", {
				id: toastId,
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
				className="w-[620px] max-w-[620px] gap-0 overflow-hidden rounded-[4px] p-0 sm:max-w-[620px]"
			>
				<DialogTitle className="sr-only">تسجيل إجازة جماعية</DialogTitle>
				<DialogDescription className="sr-only">
					تسجيل إجازة لعدة موظفين دفعة واحدة مع النوع والتواريخ
				</DialogDescription>

				{/* الرأس — مسار التنقّل (يمين) + أزرار (يسار) */}
				<div className="flex items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] font-bold text-[#08090A]">الحضور والانصراف</span>
						<IconChevronLeft className="size-[9px] text-[#272829]" />
						<span className="text-[10px] font-bold text-[#08090A]">تسجيل أجازة</span>
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
					{/* الموظفون المحددون — صندوق أصفر مع شارات قابلة للاختيار */}
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

					{/* نوع الأجازة */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel label="نوع الأجازة" />
						<Select
							value={leaveType}
							onValueChange={setLeaveType}
							dir="rtl"
						>
							<SelectTrigger className="h-[34px] w-full justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] text-[#08090A] data-placeholder:text-[#9B9B9D] [&>svg]:hidden">
								<IconChevronDown className="size-2.5 text-[#9B9B9D]" />
								<SelectValue placeholder="اختر..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{LEAVE_TYPES.map((t) => (
									<SelectItem
										key={t.label}
										value={t.label}
									>
										{t.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* تاريخ البداية + النهاية */}
					<div className="flex items-start gap-4">
						<div className="flex flex-1 flex-col gap-1.5">
							<FieldLabel label="تاريخ بداية الأجازة" />
							<DateField
								value={startDate}
								onChange={setStartDate}
							/>
						</div>
						<div className="flex flex-1 flex-col gap-1.5">
							<FieldLabel label="تاريخ نهاية الأجازة" />
							<DateField
								value={endDate}
								onChange={setEndDate}
							/>
						</div>
					</div>

					{/* ملاحظات */}
					<div className="flex flex-col gap-1.5">
						<span className="text-right text-[12px] font-medium text-[#08090A]">ملاحظات</span>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="أضف أي ملاحظات للأجازة..."
							className="h-[74px] w-full resize-none rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[10.5px] py-[7px] text-right text-[13px] text-[#08090A] outline-none placeholder:text-[#08090A]/50"
						/>
					</div>

					{/* تنبيه عند اختلاف التواريخ */}
					{startDate && endDate && startDate > endDate && (
						<div className="flex items-center gap-2.5 rounded-[4px] bg-[#FFFBEA] px-2 py-2.5">
							<IconAlertTriangle className="size-3.5 shrink-0 text-[#C34E00]" />
							<span className="text-[12px] text-[#C34E00]">
								تاريخ البداية يجب أن يسبق تاريخ النهاية.
							</span>
						</div>
					)}
				</div>

				{/* التذييل — زر التسجيل (يسار) + إشعار المدير (يمين) */}
				<div className="flex items-center justify-between border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] text-[#737373]">
							إشعار المدير / الموظف عبر البريد
						</span>
						<Switch
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
						/>
					</div>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={isPending || !canSubmit}
						className="h-[25.5px] gap-2 rounded-[4px] bg-[#6366F1] text-[11px]"
					>
						<span className="rounded-[4px] bg-white/20 px-1 py-0.5 text-[8px]">⌘↵</span>
						تسجيل أجازة
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
