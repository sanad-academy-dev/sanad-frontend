import {
	IconAt,
	IconClock,
	IconLink,
	IconMoodSmile,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { showSuccessToast } from "@/components/common/success-toast";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { AttendanceLeaveDialog } from "@/features/services/staff/components/attendance/attendance-leave-dialog";
import { LeaveReviewDialog } from "@/features/services/staff/components/attendance/leave-review-dialog";
import { ShiftDeleteDialog } from "@/features/services/staff/components/shifts/shift-delete-dialog";
import {
	type CompensationChoice,
	ShiftExtendDialog,
} from "@/features/services/staff/components/shifts/shift-extend-dialog";
import { SHIFT_TYPE_MAP, SHIFT_TYPES } from "@/features/services/staff/data/shifts";
import { useCreateCompensatoryEntry } from "@/features/services/staff/hooks/use-create-compensatory-entry";
import { useDeleteShift } from "@/features/services/staff/hooks/use-delete-shift";
import { useLeaveBalance } from "@/features/services/staff/hooks/use-leave-balance";
import { useShifts } from "@/features/services/staff/hooks/use-shifts";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useUpsertShift } from "@/features/services/staff/hooks/use-upsert-shift";
import { cn } from "@/lib/utils";
import type { ShiftType } from "@/server/shifts/shifts.type";

// دقائق من منتصف الليل → "HH:mm"
const minutesToTime = (m: number) =>
	`${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
// "HH:mm" → دقائق من منتصف الليل
const timeToMinutes = (t: string) => {
	const [h, m] = t.split(":").map(Number);
	return (h || 0) * 60 + (m || 0);
};
// "HH:mm" → "hh:mm صباحًا/مساءً"
const time12 = (t: string) => {
	const [h, m] = t.split(":").map(Number);
	const period = h < 12 ? "صباحًا" : "مساءً";
	const hh = h % 12 === 0 ? 12 : h % 12;
	return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

// اسم نوع المناوبة كصفة (للعرض في صف التفاصيل)
const SHIFT_ADJECTIVE: Record<ShiftType, string> = {
	MORNING: "صباحية",
	EVENING: "مسائية",
	NIGHT: "ليلية",
};

const STAFF_STATUS_LABEL: Record<string, string> = {
	ACTIVE: "نشط",
	PENDING: "في الانتظار",
	INACTIVE: "غير نشط",
};

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

// حقل وقت مضغوط (أيقونة ساعة + الوقت بصيغة 12 ساعة + منتقي أصلي)
function TimeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	const ref = useRef<HTMLInputElement>(null);
	return (
		<button
			type="button"
			onClick={() => ref.current?.showPicker?.()}
			className="relative flex h-[22px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1.5"
		>
			<IconClock className="size-[11px] shrink-0 text-[#8D8D8D]" />
			<span className="whitespace-nowrap text-[9px] text-[#8D8D8D] tabular-nums">
				{time12(value)}
			</span>
			<input
				ref={ref}
				type="time"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="pointer-events-none absolute inset-0 size-full opacity-0"
			/>
		</button>
	);
}

// صف تفصيل (العنوان يمين، القيمة يسار)
function DetailRow({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex items-start justify-between">
			<span className="text-[12px] font-medium text-[#08090A]">{label}</span>
			<span className="text-[12px] text-[#08090A]">{value || "—"}</span>
		</div>
	);
}

export function ShiftDetailsPanel({
	open,
	staffId: presetStaffId,
	date: presetDate,
	defaultType,
	startMinute: presetStartMinute,
	endMinute: presetEndMinute,
	onClose,
}: {
	open: boolean;
	staffId?: string | null;
	date?: Date | null;
	defaultType?: ShiftType;
	// أوقات النوبة الفعلية عند الفتح من بادج نوبة موجودة (بالدقائق من منتصف الليل)
	startMinute?: number | null;
	endMinute?: number | null;
	onClose: () => void;
}) {
	const { staff } = useStaff();
	const { upsertAsync, isPending } = useUpsertShift();
	const { remove, removeAsync } = useDeleteShift();
	const { createCompensatoryAsync } = useCreateCompensatoryEntry();

	const [staffId, setStaffId] = useState("");
	const [dateValue, setDateValue] = useState("");
	const [type, setType] = useState<ShiftType>("MORNING");
	const [startTime, setStartTime] = useState("08:00");
	const [endTime, setEndTime] = useState("16:00");
	const [breakMinutes, setBreakMinutes] = useState(60);
	const [isLeaveDay, setIsLeaveDay] = useState(false);
	// دايالوج تمديد وقت المناوبة
	const [extendOpen, setExtendOpen] = useState(false);
	// دايالوج تأكيد حذف المناوبة
	const [deleteOpen, setDeleteOpen] = useState(false);
	// دايالوج تسجيل إجازة (يُفتح من مفتاح "تعيين كيوم إجازة")
	const [leaveOpen, setLeaveOpen] = useState(false);
	// شيت مراجعة طلب الإجازة (يُفتح بعد إنشاء الطلب)
	const [reviewRequestId, setReviewRequestId] = useState<string | null>(null);

	// إعادة الضبط عند الفتح
	useEffect(() => {
		if (!open) return;
		const t = defaultType ?? "MORNING";
		const meta = SHIFT_TYPE_MAP[t];
		setStaffId(presetStaffId ?? "");
		setDateValue(presetDate ? format(presetDate, "yyyy-MM-dd") : "");
		setType(t);
		// أوقات النوبة الفعلية إن مُرّرت، وإلا الأوقات الافتراضية للنوع
		setStartTime(minutesToTime(presetStartMinute ?? meta.defaultStart));
		setEndTime(minutesToTime(presetEndMinute ?? meta.defaultEnd));
		setBreakMinutes(60);
		setIsLeaveDay(false);
	}, [open, presetStaffId, presetDate, defaultType, presetStartMinute, presetEndMinute]);

	const selected = staff.find((s) => s.id === staffId);
	const { balance } = useLeaveBalance(staffId || null, open && !!staffId);

	// مناوبة الموظف في اليوم المحدد (لتمكين الحذف)
	const { shifts } = useShifts(
		dateValue ? new Date(`${dateValue}T00:00:00`) : new Date(),
		dateValue ? new Date(`${dateValue}T00:00:00`) : new Date(),
	);
	const existingShift = shifts.find(
		(sh) => sh.staffId === staffId && format(new Date(sh.date), "yyyy-MM-dd") === dateValue,
	);

	const startMinute = timeToMinutes(startTime);
	let endMinute = timeToMinutes(endTime);
	if (endMinute <= startMinute) endMinute += 1440;
	const hours = Math.round(((endMinute - startMinute) / 60) * 100) / 100;

	const onTypeChange = (value: ShiftType) => {
		const meta = SHIFT_TYPE_MAP[value];
		setType(value);
		setStartTime(minutesToTime(meta.defaultStart));
		setEndTime(minutesToTime(meta.defaultEnd));
	};

	const canSave = !!staffId && !!dateValue;

	const handleSave = async () => {
		if (!canSave) return;
		try {
			// تعيين كيوم إجازة → إزالة أي مناوبة في هذا اليوم
			if (isLeaveDay) {
				if (existingShift) await remove({ staffId, date: dateValue });
				toast.success("تم تعيين اليوم كإجازة", { position: "bottom-left" });
				onClose();
				return;
			}
			await upsertAsync({
				staffId,
				date: dateValue,
				type,
				startMinute: timeToMinutes(startTime),
				endMinute: timeToMinutes(endTime),
				hours,
			});
			toast.success(`تم حفظ ${SHIFT_TYPE_MAP[type].label} لـ ${selected?.name ?? ""}`, {
				position: "bottom-left",
			});
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "فشل الحفظ", {
				position: "bottom-left",
			});
		}
	};

	// حفظ تمديد وقت المناوبة (تحديث وقتي البداية والنهاية) من دايالوج التمديد
	const handleExtendSave = async (
		newStart: string,
		newEnd: string,
		_notifyEmail: boolean,
		compensation: CompensationChoice,
	) => {
		if (!canSave || isLeaveDay) return;
		// ساعات المناوبة قبل التعديل
		const oldStartMin = timeToMinutes(startTime);
		let oldEndMin = timeToMinutes(endTime);
		if (oldEndMin <= oldStartMin) oldEndMin += 1440;
		const oldHours = (oldEndMin - oldStartMin) / 60;
		// ساعات المناوبة بعد التعديل
		const s = timeToMinutes(newStart);
		let e = timeToMinutes(newEnd);
		if (e <= s) e += 1440;
		const newHours = Math.round(((e - s) / 60) * 100) / 100;
		// الساعات المضافة (الفرق)
		const added = Math.round((newHours - oldHours) * 100) / 100;
		try {
			await upsertAsync({
				staffId,
				date: dateValue,
				type,
				startMinute: s,
				endMinute: timeToMinutes(newEnd),
				hours: newHours,
			});
			// إضافة رصيد تعويضي عند اختيار "إجازة تعويضية" ووجود ساعات مضافة
			if (compensation === "compensatory" && added > 0) {
				await createCompensatoryAsync({
					staffId,
					minutes: Math.round(added * 60),
					source: "shift_extension",
					reason: `تمديد مناوبة ${SHIFT_ADJECTIVE[type]} (+${added} ساعات)`,
					date: dateValue,
				});
			}
			setStartTime(newStart);
			setEndTime(newEnd);
			// توست ببيانات حقيقية: نوع المناوبة + الساعات المضافة + طريقة التعويض
			const adjective = SHIFT_ADJECTIVE[type];
			const hoursWord = Math.abs(added) === 1 ? "ساعة" : "ساعات";
			const compNote = compensation === "compensatory" && added > 0 ? " كإجازة تعويضية" : "";
			const message =
				added > 0
					? `تم تحديث وقت المناوبة ${adjective} وإضافة ${added} ${hoursWord}${compNote} بنجاح`
					: `تم تحديث وقت المناوبة ${adjective} بنجاح`;
			showSuccessToast(message, {
				textClassName: "text-[12px] font-semibold text-[#08090A]",
			});
			setExtendOpen(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "فشل التمديد", {
				position: "bottom-left",
			});
		}
	};

	const handleDelete = async () => {
		if (!staffId || !dateValue) return;
		try {
			await removeAsync({ staffId, date: dateValue });
			showSuccessToast(`تم حذف مناوبة (${selected?.name ?? ""}) لهذا اليوم بنجاح`, {
				textClassName: "text-[12px] font-semibold text-[#08090A]",
			});
			setDeleteOpen(false);
			onClose();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "فشل حذف المناوبة", {
				position: "bottom-left",
			});
		}
	};

	const typeMeta = SHIFT_TYPE_MAP[type];

	return (
		<>
			<ShiftExtendDialog
				open={extendOpen}
				onClose={() => setExtendOpen(false)}
				startTime={startTime}
				defaultEndTime={endTime}
				isPending={isPending}
				onSave={handleExtendSave}
			/>
			<AttendanceLeaveDialog
				open={leaveOpen}
				staffId={staffId || null}
				staffName={selected?.name ?? null}
				staffCode={selected?.code ?? null}
				date={presetDate ?? (dateValue ? new Date(`${dateValue}T00:00:00`) : null)}
				onClose={() => {
					setLeaveOpen(false);
					setIsLeaveDay(false);
				}}
				onSubmitted={(id) => {
					// إغلاق نموذج التسجيل واللوحة، ثم فتح شيت مراجعة الطلب من يسار الشاشة
					setLeaveOpen(false);
					setIsLeaveDay(false);
					setReviewRequestId(id);
					onClose();
				}}
			/>
			<LeaveReviewDialog
				requestId={reviewRequestId}
				onClose={() => setReviewRequestId(null)}
			/>
			<ShiftDeleteDialog
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				staffName={selected?.name ?? ""}
				staffInitials={selected ? initialsOf(selected.name) : ""}
				staffCode={selected?.code ?? ""}
				shiftAdjective={SHIFT_ADJECTIVE[type]}
				date={dateValue}
				startTime={startTime}
				endTime={endTime}
				branchName={selected?.branch?.name ?? ""}
				isPending={isPending}
				onConfirm={handleDelete}
			/>
			<Sheet
				open={open}
				onOpenChange={(o) => !o && onClose()}
				// عند فتح دايالوج التمديد نجعل اللوحة غير مشروطة (non-modal) حتى لا تحجب
				// النقر على عناصر الـ Select داخل الدايالوج (تداخل نافذتين modal)
				modal={!extendOpen && !leaveOpen}
			>
				<SheetContent
					side="left"
					dir="rtl"
					showCloseButton={false}
					className="flex w-[511px]! max-w-[511px]! flex-col gap-0 overflow-hidden p-0"
				>
					<SheetTitle className="sr-only">تفاصيل المناوبة</SheetTitle>
					<SheetDescription className="sr-only">
						عرض وتعديل تفاصيل مناوبة الموظف
					</SheetDescription>

					{/* الرأس */}
					<div className="flex items-center justify-between border-b px-4 py-2">
						<div className="flex items-center gap-1.5">
							<span className="text-[10px] font-bold text-[#08090A]">تفاصيل المناوبة</span>
						</div>
						<div className="flex items-center gap-4">
							{/* تعيين كيوم إجازة */}
							<div className="flex items-center gap-1.5">
								<span className="text-[10px] text-[#08090A]">تعيين كيوم إجازة</span>
								<Switch
									checked={isLeaveDay}
									onCheckedChange={(v) => {
										if (v) {
											if (!staffId) {
												toast.error("اختر الموظف أولاً", {
													position: "bottom-left",
												});
												return;
											}
											setIsLeaveDay(true);
											setLeaveOpen(true);
										} else {
											setIsLeaveDay(false);
										}
									}}
								/>
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
					</div>

					{/* الجسم القابل للتمرير */}
					<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-[15px] py-3">
						{/* صندوق التفاصيل */}
						<div className="flex flex-col items-end gap-3 rounded-[4px] border-[0.5px] border-[#D8D8D8] p-3">
							{/* الموظف (يمين البوكس) + الحالة (يسار) */}
							<div className="flex w-full items-center justify-between">
								<div className="flex items-center gap-1">
									{/* الأڤاتار يمين الاسم */}
									{selected && (
										<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
											{initialsOf(selected.name)}
										</span>
									)}
									<Select
										value={staffId}
										onValueChange={setStaffId}
										dir="rtl"
									>
										<SelectTrigger
											className={cn(
												"gap-1 text-[#08090A]",
												selected
													? // موظف محدَّد: اسم عريض 13px بلا حدود ولا سهم — مطابق للتصميم
														"h-auto w-fit border-0 bg-transparent p-0 text-[13px] font-bold shadow-none focus-visible:ring-0 dark:bg-transparent [&>svg]:hidden"
													: // لا يوجد اختيار: منتقي واضح لاختيار الموظف
														"h-[22px] min-w-[140px] text-[11px] font-bold",
											)}
										>
											<SelectValue placeholder="اختر الموظف..." />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{staff.map((s) => (
												<SelectItem
													key={s.id}
													value={s.id}
												>
													{s.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{/* الكود يسار الاسم */}
									{selected && (
										<span className="font-mono text-[10px] text-[#9B9B9D]">
											{selected.code}
										</span>
									)}
								</div>
								{selected ? (
									<span className="rounded-[4px] bg-[#3B82F6]/5 px-1.5 py-[1.5px] text-[8px] font-medium text-[#3B82F6]">
										{STAFF_STATUS_LABEL[selected.status] ?? selected.status}
									</span>
								) : (
									<span />
								)}
							</div>

							<span className="h-px w-full bg-[#E5E5E5]" />

							{/* بطاقات رصيد الإجازة (يمينًا→يسارًا: رصيد الإجازة، مستخدم، متبقي) */}
							<div className="flex w-full items-center gap-1.5">
								<div className="flex h-[34px] flex-1 items-center justify-between rounded-[4px] border border-[#E5E5E5] px-1.5">
									<span className="text-[12px] text-[#9B9B9D]">رصيد الإجازة</span>
									<span className="text-[11px] font-medium text-[#08090A] tabular-nums">
										{balance ? `${balance.allowance} يوم` : "—"}
									</span>
								</div>
								<div className="flex h-[34px] flex-1 items-center justify-between rounded-[4px] border border-[#E5E5E5] px-1.5">
									<span className="text-[12px] text-[#9B9B9D]">مستخدم</span>
									<span className="text-[11px] font-medium text-[#08090A] tabular-nums">
										{balance ? `${balance.taken} أيام` : "—"}
									</span>
								</div>
								<div className="flex h-[34px] flex-1 items-center justify-between rounded-[4px] border border-[#E5E5E5] px-1.5">
									<span className="text-[12px] text-[#9B9B9D]">متبقي</span>
									<span className="text-[11px] font-medium text-[#08090A] tabular-nums">
										{balance ? `${balance.remaining} يوم` : "—"}
									</span>
								</div>
							</div>

							{/* تنبيه */}
							<div className="flex w-full items-center gap-2.5 rounded-[4px] bg-[#FFFBEA] px-2 py-3.5">
								<span className="flex-1 text-right text-[12px] text-[#C34E00]">
									تأكد من عدم تعارض المناوبة مع زيارات الموظف المعتمدة خلال هذه الفترة.
								</span>
							</div>

							{/* تفاصيل */}
							<div className="flex w-full flex-col gap-2.5">
								<DetailRow
									label="التخصص"
									value={selected?.primarySpecialization?.name ?? ""}
								/>
								<DetailRow
									label="الفرع"
									value={selected?.branch?.name ?? ""}
								/>
								<DetailRow
									label="القسم"
									value={selected?.role?.name ?? ""}
								/>
								<DetailRow
									label="نوع المناوبة"
									value={SHIFT_ADJECTIVE[type]}
								/>
								<DetailRow
									label="مدة المناوبة"
									value={`${hours} ساعات`}
								/>
								<DetailRow
									label="الاستراحة"
									value={`${breakMinutes} دقيقة`}
								/>
								<DetailRow
									label="الحالة"
									value={
										selected ? (STAFF_STATUS_LABEL[selected.status] ?? selected.status) : ""
									}
								/>
							</div>

							<span className="h-px w-full bg-[#D8D8D8]" />

							{/* المناوبة + الأوقات */}
							<div className="flex w-full flex-col gap-3">
								{/* المناوبة + الأوقات */}
								<div className="flex w-full items-center justify-between">
									{/* منتقي النوع (يمين) */}
									<div className="flex items-center gap-2">
										<span className="text-[10px] font-medium text-[#08090A]">المناوبة</span>
										<DropdownMenu dir="rtl">
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													disabled={isLeaveDay}
													className="flex h-[22px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[7.5px] text-[11px] font-medium text-[#08090A] disabled:opacity-50"
												>
													<span
														className="size-2 rounded-full"
														style={{ backgroundColor: typeMeta.color }}
													/>
													{typeMeta.shortLabel}
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="min-w-[120px] p-[3px]"
											>
												{SHIFT_TYPES.map((t) => (
													<DropdownMenuItem
														key={t.key}
														onSelect={() => onTypeChange(t.key)}
														className="flex h-6 items-center justify-start gap-1.5 rounded-[4px] px-[9px] text-right text-[10px] font-medium text-[#08090A]"
													>
														<span
															className="size-2 rounded-full"
															style={{ backgroundColor: t.color }}
														/>
														{t.label}
													</DropdownMenuItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>
									</div>

									{/* الأوقات (يسار) */}
									<div className="flex items-center gap-1.5">
										<TimeField
											value={startTime}
											onChange={setStartTime}
										/>
										<span className="text-[10px] text-[#8D8D8D]">-</span>
										<TimeField
											value={endTime}
											onChange={setEndTime}
										/>
									</div>
								</div>

								{/* زر تمديد وقت المناوبة — على يمين البوكس */}
								<div className="flex w-full items-center justify-start pt-1">
									<button
										type="button"
										onClick={() => setExtendOpen(true)}
										disabled={!canSave || isLeaveDay || isPending}
										className="flex h-5 items-center justify-center gap-2 text-[14px] font-semibold leading-5 text-[#6941C6] disabled:opacity-50"
									>
										تمديد وقت المناوبة
										<IconPlus
											className="size-5"
											stroke={1.667}
										/>
									</button>
								</div>
							</div>
						</div>

						{/* النشاط */}
						<div className="flex w-full flex-col gap-3">
							<span className="w-full text-right text-[12px] font-bold text-[#08090A]">
								النشاط
							</span>
							<div className="flex w-full items-center justify-start gap-1.5 text-[11px] text-[#9B9B9D]">
								{/* الأڤاتار يمين النص */}
								<span className="flex size-[13px] items-center justify-center rounded-full bg-[#4F6AE0] text-[7px] font-bold text-white">
									{selected ? initialsOf(selected.name) : "—"}
								</span>
								<span className="font-medium text-[#737373]">
									{selected?.name ?? "النظام"}
								</span>
								<span>أنشأ هذه المناوبة</span>
							</div>

							{/* صندوق التعليق */}
							<div className="flex w-full flex-col gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 py-1.5">
								<textarea
									placeholder="أضف تعليقًا..."
									className="h-9 w-full resize-none bg-transparent text-right text-[11px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
								/>
								<div className="flex items-center gap-2 text-[#5C5C5E]">
									<button
										type="button"
										aria-label="إرسال"
										className="flex size-6 items-center justify-center rounded-full border border-[#EDEAE9] bg-[#FCFCFC] opacity-50"
									>
										<IconPlus className="size-4" />
									</button>
									<IconMoodSmile className="size-4" />
									<IconAt className="size-4" />
									<IconLink className="size-4" />
								</div>
							</div>
						</div>
					</div>

					{/* التذييل — حذف المناوبة يمين، حفظ يسار */}
					<div className="flex items-center justify-between border-t px-4 py-2">
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={() => setDeleteOpen(true)}
							disabled={!existingShift || isPending}
							className="h-[22px] gap-1 rounded-[4px] border-[#E5E5E5] bg-white px-[7px] text-[10px] font-medium text-[#EF4444] hover:bg-muted hover:text-[#EF4444]"
						>
							حذف المناوبة
							<IconTrash className="size-2.5" />
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={handleSave}
							disabled={!canSave || isPending}
							className="h-[25.25px] gap-2 rounded-[4px] bg-[#6366F1] px-3 text-[11px]"
						>
							<span className="rounded-[4px] bg-white/20 px-1 py-0.5 text-[8px]">⌘↵</span>
							حفظ
						</Button>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
