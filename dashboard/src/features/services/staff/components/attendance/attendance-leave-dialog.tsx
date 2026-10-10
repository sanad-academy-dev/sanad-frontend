import {
	IconAlertTriangle,
	IconCalendar,
	IconCalendarEvent,
	IconChevronDown,
	IconCloudUpload,
	IconFileText,
	IconHelpCircle,
	IconLink,
	IconPlus,
	IconUpload,
	IconX,
} from "@tabler/icons-react";
import { eachDayOfInterval, format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LEAVE_TYPES } from "@/features/services/staff/data/leave-types";
import { useCreateLeaveRequest } from "@/features/services/staff/hooks/use-create-leave-request";
import { useLeaveBalance } from "@/features/services/staff/hooks/use-leave-balance";
import { cn } from "@/lib/utils";
import { COMPENSATORY_LEAVE_TYPE } from "@sanad/contracts/runtime/server/compensatory/compensatory.type";

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

export function AttendanceLeaveDialog({
	open,
	staffId,
	staffName,
	staffCode,
	date,
	onClose,
	onSubmitted,
}: {
	open: boolean;
	staffId: string | null;
	staffName: string | null;
	staffCode: string | null;
	date: Date | null;
	onClose: () => void;
	onSubmitted: (requestId: string) => void;
}) {
	const { createLeaveRequest, isPending } = useCreateLeaveRequest();
	const { balance } = useLeaveBalance(staffId, open);

	const [leaveType, setLeaveType] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [notes, setNotes] = useState("");
	const [notifyManager, setNotifyManager] = useState(false);
	const [fileName, setFileName] = useState("");
	const [linkMode, setLinkMode] = useState(false);
	const [linkName, setLinkName] = useState("");
	const [linkUrl, setLinkUrl] = useState("");
	const [docMode, setDocMode] = useState(false);
	const [docName, setDocName] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			// افتراضيًا: اليوم المُختار من الخلية (أو اليوم الحالي إن لم يُمرَّر)
			const d = format(date ?? new Date(), "yyyy-MM-dd");
			setLeaveType("");
			setStartDate(d);
			setEndDate(d);
			setNotes("");
			setNotifyManager(false);
			setFileName("");
			setLinkMode(false);
			setLinkName("");
			setLinkUrl("");
			setDocMode(false);
			setDocName("");
		}
	}, [open, date]);

	const initials = (staffName ?? "")
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

	// عدد الأيام المطلوبة (شامل الطرفين)
	const requestedDays =
		startDate && endDate && startDate <= endDate
			? eachDayOfInterval({
					start: new Date(`${startDate}T00:00:00`),
					end: new Date(`${endDate}T00:00:00`),
				}).length
			: 0;

	// إجازة تعويضية: يجب ألا تتجاوز الأيام المطلوبة الرصيد التعويضي (بالأيام)
	const isCompensatory = leaveType === COMPENSATORY_LEAVE_TYPE;
	const compBalanceDays = balance?.compensatoryDays ?? 0;
	const compExceeds = isCompensatory && requestedDays > compBalanceDays;

	const canSubmit =
		!!leaveType && !!startDate && !!endDate && startDate <= endDate && !compExceeds;

	const handleSubmit = async () => {
		if (!staffId || !canSubmit) return;
		const days = eachDayOfInterval({
			start: new Date(`${startDate}T00:00:00`),
			end: new Date(`${endDate}T00:00:00`),
		}).length;

		// جمع المرفقات (رابط و/أو مستند)
		const attachments: { kind: "link" | "document"; name?: string; url: string }[] = [];
		if (linkMode && linkUrl) {
			attachments.push({ kind: "link", name: linkName || undefined, url: linkUrl });
		}
		if (docMode && fileName) {
			attachments.push({ kind: "document", name: docName || fileName, url: fileName });
		}

		const created = await createLeaveRequest({
			staffId,
			type: leaveType,
			startDate,
			endDate,
			days,
			notes: notes || undefined,
			attachments: attachments.length ? attachments : undefined,
		});

		// إشعار إضافة الرابط عند وجوده
		if (linkMode && linkUrl) {
			toast.success("تم إضافة الرابط للموعد بنجاح", { position: "bottom-left" });
		}
		onClose();
		if (created?.id) onSubmitted(created.id);
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
				<DialogTitle className="sr-only">تسجيل إجازة</DialogTitle>
				<DialogDescription className="sr-only">
					تسجيل إجازة الموظف مع النوع وتاريخ البداية والنهاية
				</DialogDescription>

				{/* الرأس */}
				<div className="flex items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
					<div className="flex items-center gap-1.5 text-[10px]">
						<IconCalendarEvent className="size-3.5 text-[#272829]" />
						<span className="font-bold text-[#08090A]">تسجيل إجازة</span>
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
					{/* تنبيه رصيد الإجازات */}
					<div className="flex items-center gap-2.5 rounded-[4px] bg-[#FFFBEA] px-2 py-3.5">
						<IconAlertTriangle className="size-3.5 shrink-0 text-[#C34E00]" />
						<span className="text-[12px] text-[#C34E00]">
							{balance
								? `${staffName} لدية رصيد أجازات ${balance.remaining} يوم`
								: "جارٍ جلب رصيد الإجازات..."}
						</span>
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
							<FieldLabel label="تاريخ نهاية الأجازة" />
							<DateField
								value={endDate}
								onChange={setEndDate}
							/>
						</div>
						<div className="flex flex-1 flex-col gap-1.5">
							<FieldLabel label="تاريخ بداية الأجازة" />
							<DateField
								value={startDate}
								onChange={setStartDate}
							/>
						</div>
					</div>

					{/* تنبيه: الرصيد التعويضي أقل من المطلوب — يمنع المراجعة */}
					{compExceeds && (
						<div className="flex items-center gap-2.5 rounded-[4px] border-[0.75px] border-[#DC2626] bg-[#FDEBEB] px-2 py-3">
							<IconAlertTriangle className="size-3.5 shrink-0 text-[#DC2626]" />
							<span className="text-right text-[11px] leading-[18px] text-[#08090A]">
								رصيد {staffName ?? "الموظف"} التعويضي ({compBalanceDays} يوم) أقل من الأيام
								المطلوبة ({requestedDays} أيام). الأفضل تقديم إجازة سنوية بدلًا منها.
							</span>
						</div>
					)}

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

					{/* إرفاق ملف — قائمة (إضافة رابط / إضافة مستند) + حقول الرابط */}
					<div className="flex items-center justify-start gap-1.5">
						<input
							ref={fileInputRef}
							type="file"
							className="hidden"
							onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
						/>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className="flex h-[23px] shrink-0 items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 text-[10px] font-medium text-[#08090A]"
								>
									إرفاق ملف
									<IconUpload className="size-2.5" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								className="w-[177px] rounded-[4px] p-3 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
							>
								<DropdownMenuItem
									onSelect={() => {
										setLinkMode(true);
										setDocMode(false);
									}}
									className="flex h-[29px] items-center justify-start gap-1.5 rounded-[4px] px-2 text-[12px] font-bold text-[#08090A]"
								>
									<IconLink className="size-3.5" />
									إضافة رابط
								</DropdownMenuItem>
								<DropdownMenuItem
									onSelect={() => {
										setDocMode(true);
										setLinkMode(false);
									}}
									className="flex h-[29px] items-center justify-start gap-1.5 rounded-[4px] px-2 text-[12px] font-bold text-[#08090A]"
								>
									<IconFileText className="size-3.5" />
									إضافة مستند
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* حقول إضافة الرابط */}
						{linkMode && (
							<>
								{/* الرابط (https://...) */}
								<input
									dir="ltr"
									value={linkUrl}
									onChange={(e) => setLinkUrl(e.target.value)}
									placeholder="https://..."
									className="h-[23px] w-[172px] rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[11px] text-[#08090A] outline-none placeholder:text-[#08090A]"
								/>
								{/* اسم الرابط (اختياري) */}
								<input
									value={linkName}
									onChange={(e) => setLinkName(e.target.value)}
									placeholder="الاسم الرابط (اختياري)"
									className="h-[23px] w-[152px] rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1 text-right text-[8px] text-[#08090A] outline-none placeholder:text-[#08090A]"
								/>
								{/* أيقونة رابط + زر حذف */}
								<IconLink className="size-3 shrink-0 text-[#6366F1]/30" />
								<button
									type="button"
									onClick={() => {
										setLinkMode(false);
										setLinkUrl("");
										setLinkName("");
									}}
									aria-label="إزالة الرابط"
									className="shrink-0"
								>
									<IconX className="size-3 text-[#EF4444]" />
								</button>
							</>
						)}

						{/* حقول إضافة المستند */}
						{docMode && (
							<>
								{/* منطقة السحب/التحميل */}
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="flex h-[23px] w-[172px] items-center justify-between gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1.5 text-[8px] text-[#08090A]"
								>
									<span className="truncate">
										{fileName || "اسحب وافلت أو الضغط علي الأيقون للتحميل"}
									</span>
									<IconCloudUpload className="size-3.5 shrink-0" />
								</button>
								{/* اسم المستند (اختياري) */}
								<input
									value={docName}
									onChange={(e) => setDocName(e.target.value)}
									placeholder="الاسم المستند (اختياري)"
									className="h-[23px] w-[152px] rounded-[4px] border-[0.75px] border-[#E5E5E5] px-1 text-right text-[8px] font-light text-[#08090A] outline-none placeholder:text-[#08090A]"
								/>
								{/* أيقونة + زر حذف */}
								<IconCloudUpload className="size-3 shrink-0 text-[#6366F1]/40" />
								<button
									type="button"
									onClick={() => {
										setDocMode(false);
										setFileName("");
										setDocName("");
									}}
									aria-label="إزالة المستند"
									className="shrink-0"
								>
									<IconX className="size-3 text-[#EF4444]" />
								</button>
							</>
						)}

						{fileName && !linkMode && !docMode && (
							<span className="truncate text-[10px] text-[#737373]">{fileName}</span>
						)}
					</div>
				</div>

				{/* التذييل */}
				<div className="flex flex-row-reverse items-center justify-start gap-3 border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={isPending || !canSubmit}
						className="h-[25.5px] gap-2 rounded-[4px] bg-[#6366F1] text-[11px]"
					>
						<span className="rounded-[4px] bg-white/20 px-1 py-0.5 text-[8px]">⌘↵</span>
						مراجعة طلب أجازة
					</Button>
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] text-[#737373]">
							إشعار المدير / الموظف عبر البريد
						</span>
						<Switch
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
